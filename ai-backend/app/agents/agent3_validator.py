"""
Agent 3 — Quiz Validation Agent
Uses Groq API via LangChain ChatGroq to semantically validate questions.
Checks: factual correctness, relevance, duplicates, answer quality.
Returns lists of valid and invalid questions with reasons.
"""
from __future__ import annotations
import json
import os
import re
from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage, SystemMessage
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
MODEL = "openai/gpt-oss-120b"

SYSTEM_PROMPT = """You are a strict technical editor validating System Design quiz questions.

For each question you receive, check ALL of the following:
1. FACTUAL: Is the question and correct answer factually accurate for System Design?
2. RELEVANT: Does it relate to the stated topic_title?
3. ANSWER: Is the correct_answer (A/B/C/D) actually the right answer given the options?
4. CLARITY: Is the question clear and unambiguous?
5. OPTIONS: Are all 4 options distinct and plausible?

Output ONLY a valid JSON object with this exact structure:
{
  "valid": [<question_numbers that pass all checks>],
  "invalid": [
    {"question_number": <n>, "reason": "<short reason>"}
  ]
}

No markdown, no extra text — raw JSON only."""


def _build_validation_prompt(questions: list[dict]) -> str:
    lines = ["Validate the following questions:\n"]
    for q in questions:
        lines.append(
            f"Q{q['question_number']} [{q['topic_title']}] [{q['difficulty']}]: "
            f"{q['question_text']}\n"
            f"  A: {next((o['text'] for o in q['options'] if o['key']=='A'), '')}\n"
            f"  B: {next((o['text'] for o in q['options'] if o['key']=='B'), '')}\n"
            f"  C: {next((o['text'] for o in q['options'] if o['key']=='C'), '')}\n"
            f"  D: {next((o['text'] for o in q['options'] if o['key']=='D'), '')}\n"
            f"  Correct: {q['correct_answer']}\n"
        )
    return "\n".join(lines)


def _dedup(questions: list[dict]) -> tuple[list[dict], list[dict]]:
    """Remove questions with near-identical text."""
    seen_texts: list[str] = []
    valid, dupes = [], []
    for q in questions:
        txt = q["question_text"].lower().strip()
        is_dup = any(
            len(set(txt.split()) & set(s.split())) / max(len(txt.split()), 1) > 0.7
            for s in seen_texts
        )
        if is_dup:
            dupes.append({"question_number": q["question_number"], "reason": "Duplicate question"})
        else:
            seen_texts.append(txt)
            valid.append(q)
    return valid, dupes


async def run(questions: list[dict], allowed_topics: list[str] | None = None) -> dict:
    """
    Returns:
      {
        "valid_questions": [...],
        "invalid_numbers": [...],
        "invalid_reasons": [...],
        "error": None | str
      }
    """
    if not questions:
        return {"valid_questions": [], "invalid_numbers": [], "invalid_reasons": [], "error": "No questions to validate."}

    # Step 0: reject questions from disallowed topics
    topic_invalids = []
    if allowed_topics:
        allowed_set = set(t.lower() for t in allowed_topics)
        for q in questions:
            if q.get("topic_title", "").lower() not in allowed_set:
                topic_invalids.append({
                    "question_number": q["question_number"],
                    "reason": f"Topic '{q.get('topic_title')}' not in completed topics"
                })
    topic_invalid_nums = {d["question_number"] for d in topic_invalids}
    questions_to_validate = [q for q in questions if q["question_number"] not in topic_invalid_nums]

    # Step 1: dedup check
    after_dedup, dup_invalids = _dedup(questions_to_validate)
    dup_numbers = {d["question_number"] for d in dup_invalids}
    llm = ChatGroq(
        api_key=GROQ_API_KEY,
        model=MODEL,
        temperature=0.1,
        max_tokens=2000,
    )

    try:
        prompt = _build_validation_prompt(after_dedup)
        response = await llm.ainvoke([
            SystemMessage(content=SYSTEM_PROMPT),
            HumanMessage(content=prompt),
        ])
        raw = response.content.strip()
        raw = re.sub(r"^```(?:json)?", "", raw, flags=re.MULTILINE).strip()
        raw = re.sub(r"```$", "", raw, flags=re.MULTILINE).strip()

        result = json.loads(raw)
        llm_valid_nums = set(result.get("valid", []))
        llm_invalid = result.get("invalid", [])

    except Exception as e:
        # If validation LLM fails, pass all non-duplicate questions
        llm_valid_nums = {q["question_number"] for q in after_dedup}
        llm_invalid = []

    # Combine ALL invalid sets (topic filter + dedup + llm)
    all_invalid_reasons = topic_invalids + dup_invalids + llm_invalid
    all_invalid_numbers = topic_invalid_nums | dup_numbers | {r["question_number"] for r in llm_invalid}

    valid_questions = [
        q for q in questions
        if q["question_number"] not in all_invalid_numbers
    ]

    return {
        "valid_questions": valid_questions,
        "invalid_numbers": list(all_invalid_numbers),
        "invalid_reasons": all_invalid_reasons,
        "error": None,
    }
