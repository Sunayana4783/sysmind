"""
Assessment Routes
POST /api/assessment/generate        — trigger quiz generation (manual or scheduler)
GET  /api/assessment/current         — get this week's quiz for the logged-in user
POST /api/assessment/submit          — submit answers
GET  /api/assessment/results/:id     — get results for an attempt
GET  /api/assessment/history         — list all past quizzes for user
POST /api/assessment/admin/trigger   — admin manual trigger (no auth check in dev)
"""
from __future__ import annotations
import asyncio
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from bson import ObjectId

from app.auth import get_current_user
from app.database import (
    col_assessments, col_questions, col_attempts, col_results
)
from app.models import SubmitQuizRequest, QuizResponse, QuestionPublic, MCQOption
from app.supervisor import run_assessment
from app.scorer import score_attempt

router = APIRouter(prefix="/api/assessment", tags=["assessment"])


# ── helpers ───────────────────────────────────────────────────────────────────
def _oid(val):
    try:
        return ObjectId(val)
    except Exception:
        return val


async def _get_active_assessment(user_id: str) -> dict | None:
    return await col_assessments().find_one(
        {"userId": user_id, "status": "active"},
        sort=[("generatedAt", -1)],
    )


# ── POST /generate ─────────────────────────────────────────────────────────────
@router.post("/generate")
async def generate_quiz(
    background_tasks: BackgroundTasks,
    user_id: str = Depends(get_current_user),
):
    # Check if quiz already exists for this week
    existing = await _get_active_assessment(user_id)
    if existing:
        return {
            "message": "Quiz already generated for this week.",
            "assessment_id": str(existing["_id"]),
        }

    # Run pipeline synchronously (can be moved to background for large scale)
    final_state = await run_assessment(user_id)

    if final_state["status"] == "no_topics":
        raise HTTPException(
            status_code=404,
            detail=final_state.get("error", "No completed topics this week."),
        )
    if final_state["status"] == "failed":
        raise HTTPException(
            status_code=500,
            detail=final_state.get("error", "Quiz generation failed."),
        )

    return {
        "message": "Quiz generated successfully.",
        "assessment_id": final_state["assessment_id"],
        "topics_covered": list({q["topic_title"] for q in final_state["valid_questions"]}),
        "question_count": len(final_state["valid_questions"][:20]),
    }


# ── GET /current ───────────────────────────────────────────────────────────────
@router.get("/current", response_model=QuizResponse)
async def get_current_quiz(user_id: str = Depends(get_current_user)):
    assessment = await _get_active_assessment(user_id)
    if not assessment:
        raise HTTPException(
            status_code=404,
            detail="No active quiz found. Click 'Generate Quiz' to create one.",
        )

    assessment_id = str(assessment["_id"])

    # Check if already submitted
    attempt = await col_attempts().find_one({"assessmentId": assessment_id, "userId": user_id})
    already_submitted = attempt is not None

    # Fetch questions (hide correct_answer)
    q_cursor = col_questions().find(
        {"assessmentId": assessment_id},
        sort=[("questionNumber", 1)],
    )
    q_docs = await q_cursor.to_list(length=25)

    questions_public = []
    for q in q_docs:
        opts = [MCQOption(key=o["key"], text=o["text"]) for o in q.get("options", [])]
        questions_public.append(QuestionPublic(
            question_number=q["questionNumber"],
            question_text=q["questionText"],
            options=opts,
            difficulty=q.get("difficulty", "medium"),
            topic_title=q.get("topicTitle", ""),
            question_type=q.get("questionType", "conceptual"),
        ))

    return QuizResponse(
        assessment_id=assessment_id,
        week_start=assessment["weekStart"].strftime("%Y-%m-%d") if assessment.get("weekStart") else "",
        week_end=assessment["weekEnd"].strftime("%Y-%m-%d") if assessment.get("weekEnd") else "",
        topics_covered=assessment.get("topicTitles", []),
        questions=questions_public,
        already_submitted=already_submitted,
    )


# ── POST /submit ───────────────────────────────────────────────────────────────
@router.post("/submit/{assessment_id}")
async def submit_quiz(
    assessment_id: str,
    body: SubmitQuizRequest,
    user_id: str = Depends(get_current_user),
):
    # Verify assessment belongs to user
    assessment = await col_assessments().find_one(
        {"_id": _oid(assessment_id), "userId": user_id}
    )
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found.")

    # Prevent double submission
    existing_attempt = await col_attempts().find_one(
        {"assessmentId": assessment_id, "userId": user_id}
    )
    if existing_attempt:
        raise HTTPException(status_code=409, detail="Already submitted.")

    # Save raw attempt
    await col_attempts().insert_one({
        "assessmentId": assessment_id,
        "userId": user_id,
        "submittedAt": datetime.utcnow(),
        "answers": [a.model_dump() for a in body.answers],
    })

    # Fetch questions WITH correct answers for scoring
    q_cursor = col_questions().find(
        {"assessmentId": assessment_id},
        sort=[("questionNumber", 1)],
    )
    q_docs = await q_cursor.to_list(length=25)

    # Score
    scored = score_attempt(q_docs, [a.model_dump() for a in body.answers])

    # Save result
    result_doc = {
        "assessmentId": assessment_id,
        "userId": user_id,
        "submittedAt": datetime.utcnow(),
        **scored,
    }
    res_insert = await col_results().insert_one(result_doc)

    # Mark assessment as submitted
    await col_assessments().update_one(
        {"_id": _oid(assessment_id)},
        {"$set": {"status": "submitted"}},
    )

    return {
        "result_id": str(res_insert.inserted_id),
        "score_percent": scored["score_percent"],
        "correct_count": scored["correct_count"],
        "total_questions": scored["total_questions"],
        "grade": scored["grade"],
    }


# ── GET /results/:result_id ────────────────────────────────────────────────────
@router.get("/results/{result_id}")
async def get_results(result_id: str, user_id: str = Depends(get_current_user)):
    result = await col_results().find_one(
        {"_id": _oid(result_id), "userId": user_id}
    )
    if not result:
        raise HTTPException(status_code=404, detail="Result not found.")

    result["_id"] = str(result["_id"])
    result["submittedAt"] = result["submittedAt"].isoformat() if result.get("submittedAt") else None
    return result


# ── GET /history ───────────────────────────────────────────────────────────────
@router.get("/history")
async def get_history(user_id: str = Depends(get_current_user)):
    cursor = col_results().find(
        {"userId": user_id},
        sort=[("submittedAt", -1)],
        limit=10,
    )
    results = await cursor.to_list(length=10)
    out = []
    for r in results:
        out.append({
            "result_id": str(r["_id"]),
            "assessment_id": r.get("assessmentId", ""),
            "submitted_at": r["submittedAt"].isoformat() if r.get("submittedAt") else None,
            "score_percent": r.get("score_percent", 0),
            "correct_count": r.get("correct_count", 0),
            "total_questions": r.get("total_questions", 20),
            "grade": r.get("grade", "F"),
            "topic_breakdown": r.get("topic_breakdown", {}),
        })
    return out


# ── POST /admin/trigger ────────────────────────────────────────────────────────
@router.post("/admin/trigger")
async def admin_trigger(user_id: str = Depends(get_current_user)):
    """Manual trigger — deletes existing active quiz and regenerates."""
    # Remove any existing active assessment for this user
    await col_assessments().delete_many({"userId": user_id, "status": "active"})

    final_state = await run_assessment(user_id)

    if final_state["status"] in ("no_topics", "failed"):
        raise HTTPException(
            status_code=400,
            detail=final_state.get("error", "Generation failed."),
        )

    return {
        "message": "Quiz regenerated.",
        "assessment_id": final_state["assessment_id"],
        "question_count": len(final_state["valid_questions"][:20]),
        "topics": list({q["topic_title"] for q in final_state["valid_questions"]}),
    }
