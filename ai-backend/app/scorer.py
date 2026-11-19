"""
Python Scoring Service — calculates marks, topic breakdown, grade.
No LLM involved — pure Python arithmetic.
"""
from __future__ import annotations
from collections import defaultdict


GRADE_SCALE = [
    (90, "A"),
    (75, "B"),
    (60, "C"),
    (40, "D"),
    (0,  "F"),
]


def calculate_grade(percent: float) -> str:
    for threshold, grade in GRADE_SCALE:
        if percent >= threshold:
            return grade
    return "F"


def score_attempt(
    questions: list[dict],      # from MongoDB (includes correctAnswer)
    answers: list[dict],        # [{question_number, selected_answer}]
) -> dict:
    """
    Returns full result dict ready to store in assessment_results.
    """
    answer_map = {a["question_number"]: a["selected_answer"].upper() for a in answers}

    correct_count = 0
    topic_stats: dict[str, dict] = defaultdict(lambda: {"correct": 0, "total": 0})
    question_results = []

    for q in questions:
        qn = q["questionNumber"]
        correct_ans = q["correctAnswer"].upper()
        selected = answer_map.get(qn, "")
        is_correct = selected == correct_ans

        if is_correct:
            correct_count += 1

        topic = q.get("topicTitle", "Unknown")
        topic_stats[topic]["total"] += 1
        if is_correct:
            topic_stats[topic]["correct"] += 1

        question_results.append({
            "question_number": qn,
            "question_text": q["questionText"],
            "selected_answer": selected,
            "correct_answer": correct_ans,
            "is_correct": is_correct,
            "explanation": q.get("explanation", ""),
            "topic_title": topic,
            "difficulty": q.get("difficulty", "medium"),
        })

    total = len(questions)
    score_percent = round((correct_count / total) * 100, 1) if total > 0 else 0.0

    # Build topic breakdown with percentages
    topic_breakdown = {}
    for topic, stats in topic_stats.items():
        pct = round((stats["correct"] / stats["total"]) * 100, 1) if stats["total"] > 0 else 0.0
        topic_breakdown[topic] = {
            "correct": stats["correct"],
            "total": stats["total"],
            "percent": pct,
        }

    return {
        "total_questions": total,
        "correct_count": correct_count,
        "score_percent": score_percent,
        "grade": calculate_grade(score_percent),
        "topic_breakdown": topic_breakdown,
        "question_results": question_results,
    }
