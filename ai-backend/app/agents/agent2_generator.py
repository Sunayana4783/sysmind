"""
Agent 2 — Question Generation Agent
Uses Groq API via LangChain ChatGroq to generate exactly 20 MCQ questions
from verified completed topics and their learning content.
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
MODEL = "llama-3.3-70b-versatile"

SYSTEM_PROMPT = """You are an expert system design educator creating MCQ quiz questions.

Rules:
1. Generate EXACTLY the number of questions requested (distribute evenly across topics).
2. Use ONLY information from the provided topic content — no hallucinations.
3. Each question must have exactly 4 options (A, B, C, D).
4. Mix question types: conceptual (understanding), application (how to use), scenario (real-world case).
5. Mix difficulties: 40% easy, 40% medium, 20% hard.
6. The correct_answer field must be the letter A, B, C, or D only.
7. Write a clear explanation (2-3 sentences) of why the answer is correct.
8. Output ONLY a valid JSON array — no markdown, no extra text.

JSON format for each question:
{
  "question_number": 1,
  "question_text": "...",
  "options": [
    {"key": "A", "text": "..."},
    {"key": "B", "text": "..."},
    {"key": "C", "text": "..."},
    {"key": "D", "text": "..."}
  ],
  "correct_answer": "A",
  "explanation": "...",
  "difficulty": "easy",
  "topic_title": "...",
  "question_type": "conceptual"
}"""


def _build_user_prompt(topics: list[dict], total: int) -> str:
    per_topic = max(1, total // len(topics)) if topics else total
    remainder = total - per_topic * len(topics)

    lines = [
        f"Generate EXACTLY {total} MCQ questions for the following System Design topics.",
        f"Distribute questions: approximately {per_topic} per topic.",
        "",
    ]
    for i, t in enumerate(topics):
        count = per_topic + (1 if i < remainder else 0)
        lines.append(f"=== TOPIC: {t['topic_title']} (generate {count} questions) ===")
        if t.get("module_titles"):
            lines.append(f"Modules covered: {', '.join(t['module_titles'][:10])}")
        for snip in t.get("content_snippets", [])[:5]:
            lines.append(f"\n[{snip['module_title']}]: {snip['content'][:600]}")
        lines.append("")

    lines.append(f"\nReturn a JSON array of exactly {total} question objects.")
    return "\n".join(lines)


def _parse_questions(raw: str, topics: list[dict]) -> list[dict]:
    """Extract JSON array from LLM response, tolerating markdown fences."""
    text = raw.strip()
    # Strip markdown fences
    text = re.sub(r"^```(?:json)?", "", text, flags=re.MULTILINE).strip()
    text = re.sub(r"```$", "", text, flags=re.MULTILINE).strip()

    # Find first [ ... ] block
    start = text.find("[")
    end = text.rfind("]")
    if start == -1 or end == -1:
        raise ValueError(f"No JSON array found in LLM response. Raw: {raw[:300]}")

    questions = json.loads(text[start : end + 1])

    # Build topic lookup by title
    topic_map = {t["topic_title"]: t["topic_id"] for t in topics}

    cleaned = []
    for i, q in enumerate(questions):
        title = q.get("topic_title", topics[0]["topic_title"] if topics else "")
        cleaned.append({
            "question_number": i + 1,
            "question_text": q.get("question_text", ""),
            "options": q.get("options", []),
            "correct_answer": q.get("correct_answer", "A").upper(),
            "explanation": q.get("explanation", ""),
            "difficulty": q.get("difficulty", "medium").lower(),
            "topic_title": title,
            "topic_id": topic_map.get(title, topics[0]["topic_id"] if topics else ""),
            "question_type": q.get("question_type", "conceptual"),
        })
    return cleaned


async def run(topics: list[dict], total_questions: int = 20) -> dict:
    """
    Args:
        topics: list from Agent 1 — [{topic_id, topic_title, module_titles, content_snippets}]
        total_questions: how many to generate (default 20)
    Returns:
        {"questions": [...], "error": None} or {"questions": [], "error": "..."}
    """
    if not topics:
        return {"questions": [], "error": "No topics provided to generate questions from."}

    llm = ChatGroq(
        api_key=GROQ_API_KEY,
        model=MODEL,
        temperature=0.4,
        max_tokens=8000,
    )

    user_prompt = _build_user_prompt(topics, total_questions)

    try:
        response = await llm.ainvoke([
            SystemMessage(content=SYSTEM_PROMPT),
            HumanMessage(content=user_prompt),
        ])
        raw = response.content
        questions = _parse_questions(raw, topics)

        # Ensure exactly total_questions
        if len(questions) < total_questions:
            # Try once more with explicit count
            retry_prompt = (
                f"You returned {len(questions)} questions but I need exactly {total_questions}. "
                f"Add {total_questions - len(questions)} more questions from the same topics. "
                f"Return ONLY the full JSON array of {total_questions} questions."
            )
            response2 = await llm.ainvoke([
                SystemMessage(content=SYSTEM_PROMPT),
                HumanMessage(content=user_prompt),
                response,
                HumanMessage(content=retry_prompt),
            ])
            questions = _parse_questions(response2.content, topics)

        return {"questions": questions[:total_questions], "error": None}

    except Exception as e:
        return {"questions": [], "error": f"Generation failed: {str(e)}"}
