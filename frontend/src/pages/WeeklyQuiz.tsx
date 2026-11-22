import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LearningNav from '../components/LearningNav';
import { aiApi } from '../services/api';
import '../styles/learning-theme.css';
import './WeeklyQuiz.css';

interface MCQOption { key: string; text: string; }
interface Question {
  question_number: number;
  question_text: string;
  options: MCQOption[];
  difficulty: string;
  topic_title: string;
  question_type: string;
}
interface QuizData {
  assessment_id: string;
  week_start: string;
  week_end: string;
  topics_covered: string[];
  questions: Question[];
  already_submitted: boolean;
}

type Phase = 'loading' | 'no_quiz' | 'quiz' | 'submitting' | 'submitted' | 'error';

const DIFF_COLOR: Record<string, string> = {
  easy: '#22c55e', medium: '#f59e0b', hard: '#ef4444',
};

export default function WeeklyQuiz() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [phase, setPhase] = useState<Phase>('loading');
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [current, setCurrent] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [resultId, setResultId] = useState('');

  const fetchQuiz = useCallback(async () => {
    setPhase('loading');
    try {
      const data = await aiApi.getCurrentQuiz();
      setQuiz(data);
      setPhase(data.already_submitted ? 'submitted' : 'quiz');
    } catch (err: any) {
      if (err?.status === 404 || err?.message?.includes('404')) {
        setPhase('no_quiz');
      } else {
        setErrorMsg(err?.message || 'Failed to load quiz.');
        setPhase('error');
      }
    }
  }, []);

  useEffect(() => { fetchQuiz(); }, [fetchQuiz]);

  const handleGenerate = async () => {
    setGenerating(true);
    setErrorMsg('');
    try {
      await aiApi.generateQuiz();
      await fetchQuiz();
    } catch (err: any) {
      setErrorMsg(err?.detail || err?.message || 'Failed to generate quiz. Make sure you have completed topics this week.');
      setPhase('error');
    } finally {
      setGenerating(false);
    }
  };

  const handleSelect = (qNum: number, key: string) => {
    setAnswers(prev => ({ ...prev, [qNum]: key }));
  };

  const handleSubmit = async () => {
    if (!quiz) return;
    const unanswered = quiz.questions.filter(q => !answers[q.question_number]);
    if (unanswered.length > 0) {
      alert(`Please answer all questions. ${unanswered.length} question(s) unanswered.`);
      return;
    }
    setPhase('submitting');
    try {
      const payload = quiz.questions.map(q => ({
        question_number: q.question_number,
        selected_answer: answers[q.question_number],
      }));
      const res = await aiApi.submitQuiz(quiz.assessment_id, payload);
      setResultId(res.result_id);
      setPhase('submitted');
    } catch (err: any) {
      setErrorMsg(err?.detail || err?.message || 'Submission failed.');
      setPhase('error');
    }
  };

  const answeredCount = Object.keys(answers).length;
  const totalQ = quiz?.questions.length ?? 0;
  // Count only question numbers that actually exist in the quiz
  const answeredExisting = quiz
    ? quiz.questions.filter(q => !!answers[q.question_number]).length
    : 0;
  const allAnswered = answeredExisting === totalQ && totalQ > 0;
  const progress = totalQ > 0 ? Math.round((answeredExisting / totalQ) * 100) : 0;
  const q = quiz?.questions[current];

  return (
    <div className="learn-root">
      <LearningNav />
      <div className="wq-page">

        {/* ── Header ── */}
        <div className="wq-header">
          <div>
            <h1 className="wq-title">Weekly Assessment</h1>
            <p className="wq-subtitle">
              AI-generated quiz from your learning activity this week
            </p>
          </div>
          {quiz && (
            <div className="wq-week-badge">
              Week: {quiz.week_start} — {quiz.week_end}
            </div>
          )}
        </div>

        {/* ── LOADING ── */}
        {phase === 'loading' && (
          <div className="wq-center">
            <div className="wq-spinner" />
            <p className="wq-hint">Loading your quiz...</p>
          </div>
        )}

        {/* ── NO QUIZ ── */}
        {phase === 'no_quiz' && (
          <div className="wq-empty-card">
            <div className="wq-empty-icon">
              <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
                <circle cx="28" cy="28" r="28" fill="#EEE9FF"/>
                <path d="M20 28h16M28 20v16" stroke="#7C5CFC" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </div>
            <h2 className="wq-empty-title">No Quiz This Week Yet</h2>
            <p className="wq-empty-desc">
              Complete topics Monday–Friday and generate your personalised 20-question quiz.
              The quiz is created by AI based only on what you have studied.
            </p>
            <button
              className="wq-btn-primary"
              onClick={handleGenerate}
              disabled={generating}
            >
              {generating ? (
                <><span className="wq-btn-spinner" /> Generating with AI...</>
              ) : 'Generate My Weekly Quiz'}
            </button>
            {errorMsg && <p className="wq-error">{errorMsg}</p>}
          </div>
        )}

        {/* ── ERROR ── */}
        {phase === 'error' && (
          <div className="wq-empty-card">
            <h2 className="wq-empty-title" style={{ color: '#ef4444' }}>Something went wrong</h2>
            <p className="wq-empty-desc">{errorMsg}</p>
            <button className="wq-btn-primary" onClick={fetchQuiz}>Try Again</button>
          </div>
        )}

        {/* ── ALREADY SUBMITTED ── */}
        {phase === 'submitted' && (
          <div className="wq-empty-card">
            <div className="wq-check-icon">
              <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
                <circle cx="28" cy="28" r="28" fill="#dcfce7"/>
                <path d="M18 28l7 7 13-13" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2 className="wq-empty-title">Quiz Submitted!</h2>
            <p className="wq-empty-desc">You have already submitted this week's quiz.</p>
            <div className="wq-btn-row">
              {resultId && (
                <button className="wq-btn-primary"
                  onClick={() => navigate(`/quiz-results/${resultId}`)}>
                  View My Results
                </button>
              )}
              <button className="wq-btn-outline"
                onClick={() => navigate('/dashboard')}>
                Back to Dashboard
              </button>
            </div>
          </div>
        )}

        {/* ── SUBMITTING ── */}
        {phase === 'submitting' && (
          <div className="wq-center">
            <div className="wq-spinner" />
            <p className="wq-hint">Scoring your answers...</p>
          </div>
        )}

        {/* ── ACTIVE QUIZ ── */}
        {phase === 'quiz' && quiz && q && (
          <div className="wq-quiz-layout">

            {/* Left — question card */}
            <div className="wq-main">
              {/* Progress bar */}
              <div className="wq-progress-bar">
                <div className="wq-progress-track">
                  <div className="wq-progress-fill" style={{ width: `${progress}%` }} />
                </div>
                <span className="wq-progress-label">{answeredExisting}/{totalQ} answered</span>
              </div>

              {/* Question card */}
              <div className="wq-question-card">
                <div className="wq-question-meta">
                  <span className="wq-q-num">Q{q.question_number}</span>
                  <span className="wq-topic-badge">{q.topic_title}</span>
                  <span className="wq-diff-badge"
                    style={{ background: DIFF_COLOR[q.difficulty] + '20',
                             color: DIFF_COLOR[q.difficulty] }}>
                    {q.difficulty}
                  </span>
                  <span className="wq-type-badge">{q.question_type}</span>
                </div>
                <p className="wq-question-text">{q.question_text}</p>

                <div className="wq-options">
                  {q.options.map(opt => {
                    const selected = answers[q.question_number] === opt.key;
                    return (
                      <button
                        key={opt.key}
                        className={`wq-option${selected ? ' wq-option--selected' : ''}`}
                        onClick={() => handleSelect(q.question_number, opt.key)}
                      >
                        <span className="wq-opt-key">{opt.key}</span>
                        <span className="wq-opt-text">{opt.text}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Nav buttons */}
                <div className="wq-nav-btns">
                  <button className="wq-btn-outline"
                    disabled={current === 0}
                    onClick={() => setCurrent(c => c - 1)}>
                    Previous
                  </button>
                  {current < totalQ - 1 ? (
                    <button className="wq-btn-primary"
                      onClick={() => setCurrent(c => c + 1)}>
                      Next Question
                    </button>
                  ) : (
                    <button
                      className="wq-btn-submit"
                      onClick={handleSubmit}
                      disabled={!allAnswered}
                    >
                      Submit Quiz ({answeredExisting}/{totalQ})
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Right — question map */}
            <div className="wq-sidebar">
              <div className="wq-sidebar-card">
                <h3 className="wq-sidebar-title">Questions</h3>
                <div className="wq-q-grid">
                  {quiz.questions.map((qs, idx) => {
                    const answered = !!answers[qs.question_number];
                    const isCurrent = idx === current;
                    return (
                      <button
                        key={qs.question_number}
                        className={`wq-q-dot${answered ? ' wq-q-dot--done' : ''}${isCurrent ? ' wq-q-dot--active' : ''}`}
                        onClick={() => setCurrent(idx)}
                        title={`Q${qs.question_number}: ${qs.topic_title}`}
                      >
                        {qs.question_number}
                      </button>
                    );
                  })}
                </div>
                <div className="wq-sidebar-stats">
                  <span>{answeredExisting} answered</span>
                  <span>{totalQ - answeredExisting} remaining</span>
                </div>
              </div>

              <div className="wq-sidebar-card wq-topics-card">
                <h3 className="wq-sidebar-title">Topics in this quiz</h3>
                {quiz.topics_covered.map(tp => (
                  <div key={tp} className="wq-topic-chip">{tp}</div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
