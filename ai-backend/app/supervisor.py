"""
LangGraph Supervisor — orchestrates all 3 agents.

Flow:
  START
    → agent1_history  (fetch Mon-Fri topics)
    → check_topics    (no topics? → END with error)
    → agent2_generate (generate 20 questions)
    → agent3_validate (validate questions)
    → check_valid     (all 20 valid? → save; else regenerate invalid ones)
    → regenerate      (re-run agent2 for missing count, up to MAX_RETRIES)
    → save_quiz       (persist to MongoDB)
    → END
"""
from __future__ import annotations
import asyncio
from datetime import datetime
from typing import Annotated, TypedDict
from langgraph.graph import StateGraph, END
from bson import ObjectId

from app.agents import agent1_history, agent2_generator, agent3_validator
from app.database import col_assessments, col_questions

MAX_RETRIES = 3
TARGET_QUESTIONS = 20


# ── State ──────────────────────────────────────────────────────────────────────
class QuizState(TypedDict):
    user_id: str
    week_start: datetime | None
    week_end: datetime | None
    topics: list[dict]
    all_questions: list[dict]      # accumulates across retries
    valid_questions: list[dict]
    invalid_reasons: list[dict]
    retry_count: int
    assessment_id: str | None
    error: str | None
    status: str                    # "running" | "done" | "failed" | "no_topics"


# ── Nodes ──────────────────────────────────────────────────────────────────────
async def node_fetch_history(state: QuizState) -> QuizState:
    result = await agent1_history.run(state["user_id"])
    if result["error"] or not result["topics"]:
        return {**state,
                "error": result["error"] or "No topics found",
                "status": "no_topics",
                "week_start": result.get("week_start"),
                "week_end": result.get("week_end")}
    return {**state,
            "topics": result["topics"],
            "week_start": result["week_start"],
            "week_end": result["week_end"],
            "error": None}


async def node_generate(state: QuizState) -> QuizState:
    needed = TARGET_QUESTIONS - len(state.get("valid_questions", []))
    result = await agent2_generator.run(state["topics"], total_questions=needed)
    if result["error"]:
        return {**state, "error": result["error"], "status": "failed"}
    # Renumber questions so they continue from where valid ones left off
    offset = len(state.get("valid_questions", []))
    for i, q in enumerate(result["questions"]):
        q["question_number"] = offset + i + 1
    return {**state,
            "all_questions": state.get("valid_questions", []) + result["questions"],
            "error": None}


async def node_validate(state: QuizState) -> QuizState:
    result = await agent3_validator.run(state["all_questions"])
    return {**state,
            "valid_questions": result["valid_questions"],
            "invalid_reasons": result.get("invalid_reasons", []),
            "error": result.get("error")}


async def node_save(state: QuizState) -> QuizState:
    # Renumber questions sequentially — removes any gaps from validation removals
    raw_questions = state["valid_questions"][:TARGET_QUESTIONS]
    questions = []
    for i, q in enumerate(raw_questions):
        q = dict(q)  # copy
        q["question_number"] = i + 1
        questions.append(q)

    # Verify no duplicates
    seen_nums = set()
    deduped = []
    for q in questions:
        if q["question_number"] not in seen_nums:
            seen_nums.add(q["question_number"])
            deduped.append(q)
    questions = deduped

    # Create assessment document
    assessment_doc = {
        "userId": state["user_id"],
        "weekStart": state["week_start"],
        "weekEnd": state["week_end"],
        "generatedAt": datetime.utcnow(),
        "status": "active",
        "topicsCovered": list({q["topic_id"] for q in questions}),
        "topicTitles": list({q["topic_title"] for q in questions}),
        "totalQuestions": len(questions),
    }
    insert_result = await col_assessments().insert_one(assessment_doc)
    assessment_id = str(insert_result.inserted_id)

    # Insert all questions
    q_docs = []
    for q in questions:
        q_docs.append({
            "assessmentId": assessment_id,
            "questionNumber": q["question_number"],
            "questionText": q["question_text"],
            "options": q["options"],
            "correctAnswer": q["correct_answer"],
            "explanation": q["explanation"],
            "difficulty": q["difficulty"],
            "topicId": q["topic_id"],
            "topicTitle": q["topic_title"],
            "questionType": q["question_type"],
        })
    if q_docs:
        await col_questions().insert_many(q_docs)

    return {**state, "assessment_id": assessment_id, "status": "done"}


# ── Conditional edges ──────────────────────────────────────────────────────────
def route_after_history(state: QuizState) -> str:
    if state["status"] in ("no_topics", "failed"):
        return "end_error"
    return "generate"


def route_after_validate(state: QuizState) -> str:
    valid_count = len(state.get("valid_questions", []))
    retry = state.get("retry_count", 0)
    if valid_count >= TARGET_QUESTIONS:
        return "save"
    if retry >= MAX_RETRIES:
        # Accept what we have if at least 10 questions
        if valid_count >= 10:
            return "save"
        return "end_error"
    return "regenerate"


# ── Graph ──────────────────────────────────────────────────────────────────────
def _build_graph() -> StateGraph:
    g = StateGraph(QuizState)

    g.add_node("fetch_history", node_fetch_history)
    g.add_node("generate",      node_generate)
    g.add_node("validate",      node_validate)
    g.add_node("save",          node_save)

    # Retry node — increments counter then goes back to generate
    async def node_retry(state: QuizState) -> QuizState:
        return {**state, "retry_count": state.get("retry_count", 0) + 1}

    g.add_node("regenerate", node_retry)

    g.set_entry_point("fetch_history")

    g.add_conditional_edges("fetch_history", route_after_history,
                             {"generate": "generate", "end_error": END})
    g.add_edge("generate", "validate")
    g.add_conditional_edges("validate", route_after_validate,
                             {"save": "save", "regenerate": "regenerate", "end_error": END})
    g.add_edge("regenerate", "generate")
    g.add_edge("save", END)

    return g.compile()


_graph = _build_graph()


# ── Public API ─────────────────────────────────────────────────────────────────
async def run_assessment(user_id: str) -> dict:
    """
    Run the full assessment pipeline for a user.
    Returns the final QuizState dict.
    """
    initial_state: QuizState = {
        "user_id": user_id,
        "week_start": None,
        "week_end": None,
        "topics": [],
        "all_questions": [],
        "valid_questions": [],
        "invalid_reasons": [],
        "retry_count": 0,
        "assessment_id": None,
        "error": None,
        "status": "running",
    }
    final_state = await _graph.ainvoke(initial_state)
    return final_state
