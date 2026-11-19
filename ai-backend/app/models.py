"""
Pydantic models for request/response validation and MongoDB documents.
"""
from __future__ import annotations
from datetime import datetime
from typing import Any, Optional
from pydantic import BaseModel, Field


# ── Question (stored in assessment_questions) ─────────────────────────────────
class MCQOption(BaseModel):
    key: str          # "A" | "B" | "C" | "D"
    text: str

class AssessmentQuestion(BaseModel):
    assessment_id: str
    question_number: int          # 1-20
    question_text: str
    options: list[MCQOption]      # always 4
    correct_answer: str           # "A" | "B" | "C" | "D"  — hidden from frontend
    explanation: str
    difficulty: str               # "easy" | "medium" | "hard"
    topic_id: str
    topic_title: str
    question_type: str            # "conceptual" | "application" | "scenario"
    created_at: datetime = Field(default_factory=datetime.utcnow)

class QuestionPublic(BaseModel):
    """Sent to frontend — no correct_answer or explanation."""
    question_number: int
    question_text: str
    options: list[MCQOption]
    difficulty: str
    topic_title: str
    question_type: str


# ── Weekly Assessment (stored in weekly_assessments) ─────────────────────────
class WeeklyAssessment(BaseModel):
    user_id: str
    week_start: datetime          # Monday 00:00 IST of that week
    week_end: datetime            # Friday 23:59 IST
    generated_at: datetime = Field(default_factory=datetime.utcnow)
    status: str = "active"        # "active" | "submitted" | "expired"
    topics_covered: list[str]     # list of topic_ids
    total_questions: int = 20


# ── Attempt (stored in assessment_attempts) ───────────────────────────────────
class SubmitAnswerItem(BaseModel):
    question_number: int
    selected_answer: str          # "A" | "B" | "C" | "D"

class SubmitQuizRequest(BaseModel):
    answers: list[SubmitAnswerItem]


# ── Result (stored in assessment_results) ────────────────────────────────────
class QuestionResult(BaseModel):
    question_number: int
    question_text: str
    selected_answer: str
    correct_answer: str
    is_correct: bool
    explanation: str
    topic_title: str
    difficulty: str

class AssessmentResult(BaseModel):
    assessment_id: str
    user_id: str
    submitted_at: datetime = Field(default_factory=datetime.utcnow)
    total_questions: int
    correct_count: int
    score_percent: float
    topic_breakdown: dict[str, Any]   # {topic_title: {correct, total, percent}}
    question_results: list[QuestionResult]
    grade: str                        # "A" | "B" | "C" | "D" | "F"


# ── API responses ─────────────────────────────────────────────────────────────
class GenerateResponse(BaseModel):
    assessment_id: str
    message: str
    topics_covered: list[str]
    question_count: int

class QuizResponse(BaseModel):
    assessment_id: str
    week_start: str
    week_end: str
    topics_covered: list[str]
    questions: list[QuestionPublic]
    already_submitted: bool = False
