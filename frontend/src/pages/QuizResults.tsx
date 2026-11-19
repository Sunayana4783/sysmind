import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LearningNav from '../components/LearningNav';
import { aiApi } from '../services/api';
import '../styles/learning-theme.css';
import './QuizResults.css';

interface QuestionResult {
  question_number: number;
  question_text: string;
  selected_answer: string;
  correct_answer: string;
  is_correct: boolean;
  explanation: string;
  topic_title: string;
  difficulty: string;
}
interface TopicBreakdown {
  correct: number;
  total: number;
  percent: number;
}
interface ResultData {
  _id: string;
  assessment_id: string;
  submitted_at: string;
  total_questions: number;
  correct_count: number;
  score_percent: number;
  grade: string;
  topic_breakdown: Record<string, TopicBreakdown>;
  question_results: QuestionResult[];
}

const GRADE_CONFIG: Record<string, { color: string; bg: string; msg: string }> = {
  A: { color: '#16a34a', bg: '#dcfce7', msg: 'Excellent! Outstanding performance.' },
  B: { color: '#2563eb', bg: '#dbeafe', msg: 'Good job! Solid understanding.' },
  C: { color: '#d97706', bg: '#fef3c7', msg: 'Fair. Review the topics you missed.' },
  D: { color: '#ea580c', bg: '#ffedd5', msg: 'Needs improvement. Revisit the material.' },
  F: { color: '#dc2626', bg: '#fee2e2', msg: 'Keep going! Study and try again.' },
};

function ScoreCircle({ percent, grade }: { percent: number; grade: string }) {
  const r = 54;
  const circ = 2 * Math.PI * r;
  const fill = circ * (1 - percent / 100);
  const cfg = GRADE_CONFIG[grade] ?? GRADE_CONFIG.F;
  return (
    <div className="qr-score-circle-wrap">
      <svg width="140" height="140" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r={r} fill="none" stroke="#f1f5f9" strokeWidth="12" />
        <circle cx="70" cy="70" r={r} fill="none"
          stroke={cfg.color} strokeWidth="12"
          strokeDasharray={circ}
          strokeDashoffset={fill}
          strokeLinecap="round"
          transform="rotate(-90 70 70)"
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
        <text x="70" y="62" textAnchor="middle" fontSize="22" fontWeight="800" fill={cfg.color}>{grade}</text>
        <text x="70" y="82" textAnchor="middle" fontSize="13" fontWeight="600" fill="#64748b">{percent}%</text>
      </svg>
    </div>
  );
}

export default function QuizResults() {
  const { resultId } = useParams<{ resultId: string }>();
  const navigate = useNavigate();
  const [result, setResult] = useState<ResultData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedQ, setExpandedQ] = useState<number | null>(null);
  const [filter, setFilter] = useState<'all' | 'correct' | 'wrong'>('all');

  useEffect(() => {
    if (!resultId) return;
    aiApi.getResults(resultId)
      .then(setResult)
      .catch(e => setError(e?.message || 'Failed to load results.'))
      .finally(() => setLoading(false));
  }, [resultId]);

  if (loading) return (
    <div className="learn-root">
      <LearningNav />
      <div className="qr-center"><div className="qr-spinner" /><p>Loading results...</p></div>
    </div>
  );

  if (error || !result) return (
    <div className="learn-root">
      <LearningNav />
      <div className="qr-center">
        <p style={{ color: '#ef4444' }}>{error || 'Result not found.'}</p>
        <button className="qr-btn-primary" onClick={() => navigate('/weekly-quiz')}>Back to Quiz</button>
      </div>
    </div>
  );

  const cfg = GRADE_CONFIG[result.grade] ?? GRADE_CONFIG.F;
  const filteredQs = result.question_results.filter(q =>
    filter === 'all' ? true : filter === 'correct' ? q.is_correct : !q.is_correct
  );

  return (
    <div className="learn-root">
      <LearningNav />
      <div className="qr-page">

        {/* ── Hero Score Section ── */}
        <div className="qr-hero" style={{ background: cfg.bg }}>
          <ScoreCircle percent={result.score_percent} grade={result.grade} />
          <div className="qr-hero-info">
            <h1 className="qr-hero-title">Quiz Results</h1>
            <p className="qr-hero-msg" style={{ color: cfg.color }}>{cfg.msg}</p>
            <div className="qr-stats-row">
              <div className="qr-stat">
                <span className="qr-stat-val" style={{ color: '#16a34a' }}>{result.correct_count}</span>
                <span className="qr-stat-lbl">Correct</span>
              </div>
              <div className="qr-stat">
                <span className="qr-stat-val" style={{ color: '#dc2626' }}>{result.total_questions - result.correct_count}</span>
                <span className="qr-stat-lbl">Wrong</span>
              </div>
              <div className="qr-stat">
                <span className="qr-stat-val">{result.total_questions}</span>
                <span className="qr-stat-lbl">Total</span>
              </div>
              <div className="qr-stat">
                <span className="qr-stat-val">{result.score_percent}%</span>
                <span className="qr-stat-lbl">Score</span>
              </div>
            </div>
            <p className="qr-date">
              Submitted: {new Date(result.submitted_at).toLocaleString('en-IN', {
                dateStyle: 'medium', timeStyle: 'short'
              })}
            </p>
          </div>
        </div>

        <div className="qr-body">
          {/* ── Topic Breakdown ── */}
          <section className="qr-section">
            <h2 className="qr-section-title">Topic-wise Performance</h2>
            <div className="qr-topic-grid">
              {Object.entries(result.topic_breakdown).map(([topic, stats]) => (
                <div key={topic} className="qr-topic-card">
                  <div className="qr-topic-header">
                    <span className="qr-topic-name">{topic}</span>
                    <span className="qr-topic-score"
                      style={{ color: stats.percent >= 70 ? '#16a34a' : stats.percent >= 40 ? '#d97706' : '#dc2626' }}>
                      {stats.percent}%
                    </span>
                  </div>
                  <div className="qr-topic-track">
                    <div className="qr-topic-fill"
                      style={{
                        width: `${stats.percent}%`,
                        background: stats.percent >= 70 ? '#22c55e' : stats.percent >= 40 ? '#f59e0b' : '#ef4444',
                      }} />
                  </div>
                  <p className="qr-topic-sub">{stats.correct} / {stats.total} correct</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── Question Review ── */}
          <section className="qr-section">
            <div className="qr-review-header">
              <h2 className="qr-section-title">Question Review</h2>
              <div className="qr-filter-tabs">
                {(['all', 'correct', 'wrong'] as const).map(f => (
                  <button key={f}
                    className={`qr-filter-tab${filter === f ? ' qr-filter-tab--active' : ''}`}
                    onClick={() => setFilter(f)}>
                    {f === 'all' ? `All (${result.total_questions})` :
                     f === 'correct' ? `Correct (${result.correct_count})` :
                     `Wrong (${result.total_questions - result.correct_count})`}
                  </button>
                ))}
              </div>
            </div>

            <div className="qr-questions">
              {filteredQs.map(q => (
                <div key={q.question_number}
                  className={`qr-q-card${q.is_correct ? ' qr-q-card--correct' : ' qr-q-card--wrong'}`}>
                  <div className="qr-q-header" onClick={() => setExpandedQ(expandedQ === q.question_number ? null : q.question_number)}>
                    <div className="qr-q-left">
                      <span className={`qr-q-icon${q.is_correct ? ' qr-q-icon--ok' : ' qr-q-icon--fail'}`}>
                        {q.is_correct ? '✓' : '✗'}
                      </span>
                      <div>
                        <span className="qr-q-num">Q{q.question_number}</span>
                        <span className="qr-q-topic">{q.topic_title}</span>
                        <span className="qr-q-diff">{q.difficulty}</span>
                      </div>
                    </div>
                    <span className="qr-q-chevron">{expandedQ === q.question_number ? '▲' : '▼'}</span>
                  </div>
                  <p className="qr-q-text">{q.question_text}</p>

                  {expandedQ === q.question_number && (
                    <div className="qr-q-detail">
                      <div className="qr-answer-row">
                        <div className={`qr-answer-box${q.is_correct ? ' qr-answer-box--ok' : ' qr-answer-box--wrong'}`}>
                          <span className="qr-answer-label">Your Answer</span>
                          <span className="qr-answer-val">{q.selected_answer || 'Not answered'}</span>
                        </div>
                        {!q.is_correct && (
                          <div className="qr-answer-box qr-answer-box--ok">
                            <span className="qr-answer-label">Correct Answer</span>
                            <span className="qr-answer-val">{q.correct_answer}</span>
                          </div>
                        )}
                      </div>
                      {q.explanation && (
                        <div className="qr-explanation">
                          <span className="qr-expl-label">Explanation</span>
                          <p className="qr-expl-text">{q.explanation}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* ── Actions ── */}
          <div className="qr-actions">
            <button className="qr-btn-outline" onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </button>
            <button className="qr-btn-primary" onClick={() => navigate('/hld')}>
              Continue Learning
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
