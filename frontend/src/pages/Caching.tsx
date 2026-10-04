import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import LearningNav from '../components/LearningNav';
import ModuleAnimation from '../components/ModuleAnimation';
import { learningAPI, quizAPI, activityAPI, type LearningModule, type QuizData, type QuizResult } from '../services/api';
import '../styles/learning-theme.css';
import './Caching.css';
import './Modules.css';

// ── Helpers ───────────────────────────────────────────────────────────────────
const MODULE_ICONS: Record<string, string> = {
  content: '📖', failureCases: '⚠️', interview: '💬', quiz: '🎯',
};

// ── ContentModule renderer ────────────────────────────────────────────────────
const ContentModule = ({ mod, completed, onComplete, completing }: {
  mod: LearningModule; completed: boolean;
  onComplete: () => void; completing: boolean;
}) => {
  const c = mod.content!;
  return (
    <div className="mod-body">
      <div className="mod-overview">{c.overview.split('\n').filter(Boolean).map((p, i) => <p key={i}>{p}</p>)}</div>

      {c.sections?.map((s, i) => (
        <div key={i} className="mod-section">
          <h3 className="mod-section__heading"><span>{s.icon}</span> {s.heading}</h3>
          <p className="mod-section__body">{s.body}</p>
          {s.code && <pre className="code-block">{s.code}</pre>}
        </div>
      ))}

      {c.animationSteps?.length > 0 && (
        <div className="mod-block">
          <h3 className="mod-section-title">🎬 How it works</h3>
          <ModuleAnimation steps={c.animationSteps} topicTitle={mod.title} />
        </div>
      )}

      {c.example && (
        <div className="mod-block">
          <h3 className="mod-section-title">💡 Real-world example</h3>
          <div className="example-box"><p>{c.example}</p></div>
        </div>
      )}

      {c.keyPoints?.length > 0 && (
        <div className="mod-block">
          <h3 className="mod-section-title">🔑 Key points</h3>
          <ul className="keypoints-list">
            {c.keyPoints.map((kp, i) => (
              <li key={i}><span className="keypoints-dot" />{kp}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mod-complete-row">
        <button className={`mark-done-btn${completed ? ' mark-done-btn--done' : ''}`}
          onClick={onComplete} disabled={completed || completing}>
          {completed ? '✅ Completed' : completing ? <><span className="spinner spinner--sm" style={{borderTopColor:'#fff'}} /> Saving…</> : '✓ Mark as Completed'}
        </button>
      </div>
    </div>
  );
};

// ── FailureCases renderer ─────────────────────────────────────────────────────
const FailureCasesModule = ({ mod, completed, onComplete, completing }: {
  mod: LearningModule; completed: boolean; onComplete: () => void; completing: boolean;
}) => {
  const [openIdx, setOpenIdx] = useState(0);
  const cases = mod.failureCases || [];
  const fc = cases[openIdx];

  return (
    <div className="mod-body">
      <p className="mod-overview-text">Real-world failure scenarios and how to handle them.</p>

      <div className="fc-layout">
        {/* Sidebar */}
        <div className="fc-sidebar">
          {cases.map((c, i) => (
            <button key={i}
              className={`fc-sidebar__item${i === openIdx ? ' fc-sidebar__item--active' : ''}`}
              onClick={() => setOpenIdx(i)}>
              <span className="fc-sidebar__icon">{c.icon}</span>
              <span>{c.title}</span>
            </button>
          ))}
        </div>

        {/* Detail */}
        {fc && (
          <div className="fc-detail">
            <h3 className="fc-detail__title">{fc.icon} {fc.title}</h3>

            <div className="fc-detail__block fc-detail__block--scenario">
              <span className="fc-label">📋 Scenario</span>
              <p>{fc.scenario}</p>
            </div>
            <div className="fc-detail__block fc-detail__block--impact">
              <span className="fc-label">💥 Impact</span>
              <p>{fc.impact}</p>
            </div>
            <div className="fc-detail__block fc-detail__block--resolution">
              <span className="fc-label">✅ Resolution</span>
              <p>{fc.resolution}</p>
            </div>

            {fc.animationSteps?.length > 0 && (
              <div className="mod-block" style={{ marginTop: '1.25rem' }}>
                <h4 className="mod-section-title">🎬 Failure flow</h4>
                <ModuleAnimation steps={fc.animationSteps} animType="cascade" topicTitle={fc.title} />
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mod-complete-row">
        <button className={`mark-done-btn${completed ? ' mark-done-btn--done' : ''}`}
          onClick={onComplete} disabled={completed || completing}>
          {completed ? '✅ Completed' : completing ? <><span className="spinner spinner--sm" style={{borderTopColor:'#fff'}} /> Saving…</> : '✓ Mark as Completed'}
        </button>
      </div>
    </div>
  );
};

// ── InterviewQuestions renderer ───────────────────────────────────────────────
const InterviewModule = ({ mod, completed, onComplete, completing }: {
  mod: LearningModule; completed: boolean; onComplete: () => void; completing: boolean;
}) => {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const questions = mod.interviewQuestions || [];

  return (
    <div className="mod-body">
      <p className="mod-overview-text">
        {questions.length} interview questions — click a question to reveal the answer.
      </p>

      <div className="iq-list">
        {questions.map((q, i) => (
          <div key={i} className={`iq-item${openIdx === i ? ' iq-item--open' : ''}`}>
            <button className="iq-item__header" onClick={() => setOpenIdx(openIdx === i ? null : i)}>
              <div className="iq-item__left">
                <span className="iq-item__icon">{q.icon}</span>
                <span className="iq-item__q">{q.question}</span>
              </div>
              <div className="iq-item__right">
                <span className={`diff-badge diff-badge--${q.difficulty}`}>{q.difficulty}</span>
                <span className="iq-item__chevron">{openIdx === i ? '▲' : '▼'}</span>
              </div>
            </button>
            {openIdx === i && (
              <div className="iq-item__answer">
                <p>{q.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mod-complete-row">
        <button className={`mark-done-btn${completed ? ' mark-done-btn--done' : ''}`}
          onClick={onComplete} disabled={completed || completing}>
          {completed ? '✅ Completed' : completing ? <><span className="spinner spinner--sm" style={{borderTopColor:'#fff'}} /> Saving…</> : '✓ Mark as Completed'}
        </button>
      </div>
    </div>
  );
};

// ── Quiz component ────────────────────────────────────────────────────────────
const QuizModule = ({ mod, completed, onComplete }: {
  mod: LearningModule; completed: boolean; onComplete: () => void;
}) => {
  type QuizStage = 'locked' | 'info' | 'active' | 'result';
  const [stage, setStage] = useState<QuizStage>(completed ? 'locked' : 'info');
  const [retaking, setRetaking] = useState(false); // user explicitly clicked Retake
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [current, setCurrent] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [flagged, setFlagged] = useState(false);
  const [flagCount, setFlagCount] = useState(0);
  const [showFlagWarning, setShowFlagWarning] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [startTime, setStartTime] = useState(0);

  // Load quiz meta + last attempt if already passed
  useEffect(() => {
    if (stage === 'info' || stage === 'locked' || completed) {
      setLoading(true);
      quizAPI.getQuiz(mod._id)
        .then(r => {
          setQuizData(r.data);
          setLoading(false);
        })
        .catch(e => { setError(e.message); setLoading(false); });
    }
  }, [mod._id, stage, completed]);

  // Timer
  useEffect(() => {
    if (stage !== 'active' || !quizData?.timeLimitSeconds) return;
    const iv = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(iv); handleSubmit(); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, [stage, quizData]);

  // Fullscreen detection
  useEffect(() => {
    if (stage !== 'active') return;
    const handler = () => {
      if (!document.fullscreenElement) {
        setFlagged(true);
        setFlagCount(c => c + 1);
        setShowFlagWarning(true);
        setTimeout(() => setShowFlagWarning(false), 5000);
      }
    };
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, [stage]);

  const enterFullscreen = () => document.documentElement.requestFullscreen().catch(() => {});
  const exitFullscreen = () => document.fullscreenElement && document.exitFullscreen();

  const startQuiz = () => {
    if (!quizData) return;
    setAnswers(new Array(quizData.questions.length).fill(null));
    setCurrent(0);
    setTimeLeft(quizData.timeLimitSeconds);
    setFlagged(false); setFlagCount(0); setShowFlagWarning(false);
    setStartTime(Date.now());
    enterFullscreen();
    setStage('active');
  };

  const handleSubmit = useCallback(async () => {
    if (!quizData || submitting) return;
    setSubmitting(true);
    exitFullscreen();
    const timeTaken = Math.round((Date.now() - startTime) / 1000);
    try {
      const r = await quizAPI.submitAttempt(mod._id, {
        answers: answers.map(a => a ?? -1),
        timeTaken, flagged, flagCount,
      });
      setResult(r.data);
      if (r.data.passed) onComplete();
      setRetaking(false);
      setStage('result');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Submit failed');
    } finally {
      setSubmitting(false);
    }
  }, [quizData, answers, flagged, flagCount, startTime, mod._id, submitting]);

  const fmt = (s: number) => `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;

  if (loading) return (
    <div className="mod-body mod-center">
      <div className="rag-spinner" /><p className="rag-loading-text">Loading quiz…</p>
    </div>
  );
  if (error) return (
    <div className="mod-body mod-center">
      <p className="rag-error-msg">⚠️ {error}</p>
      <button className="mark-done-btn" onClick={() => { setError(''); setStage('info'); }}>Retry</button>
    </div>
  );

  // ── Already passed ────────────────────────────────────────────────────────
  // Only show this screen when NOT actively retaking
  if ((completed || quizData?.alreadyPassed) && !retaking && stage !== 'result') return (
    <div className="mod-body">
      <div className="quiz-result-card quiz-result-card--pass">
        <div className="quiz-result__icon">🏆</div>
        <h3 className="quiz-result__title">Quiz Passed!</h3>
        {quizData && (
          <>
            <div className="quiz-result__stats-row">
              <div className="quiz-result__stat">
                <span className="quiz-result__stat-val quiz-result__stat-val--green">✅ Passed</span>
                <span className="quiz-result__stat-label">Status</span>
              </div>
              <div className="quiz-result__stat">
                <span className="quiz-result__stat-val">{quizData.passingPercent}%</span>
                <span className="quiz-result__stat-label">Pass Mark</span>
              </div>
              <div className="quiz-result__stat">
                <span className="quiz-result__stat-val">{quizData.attemptsTaken}</span>
                <span className="quiz-result__stat-label">Attempts Used</span>
              </div>
              <div className="quiz-result__stat">
                <span className="quiz-result__stat-val">{quizData.questions.length}</span>
                <span className="quiz-result__stat-label">Questions</span>
              </div>
            </div>
            <p className="quiz-result__sub" style={{ marginTop: '1rem' }}>
              🎉 Next topic unlocked. Well done!
            </p>
            {/* Allow retake even after passing if attempts remain */}
            {quizData.attemptsRemaining > 0 && (
              <button className="mark-done-btn" style={{ marginTop: '1rem', background: 'var(--l-primary)' }}
                onClick={() => { setRetaking(true); setStage('info'); }}>
                🔁 Retake Quiz ({quizData.attemptsRemaining} attempt{quizData.attemptsRemaining !== 1 ? 's' : ''} left)
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );

  // ── Info screen ───────────────────────────────────────────────────────────
  if (stage === 'info' && quizData) return (
    <div className="mod-body">
      <div className="quiz-info-card">
        <div className="quiz-info__icon">🎯</div>
        <h3 className="quiz-info__title">{quizData.title}</h3>
        <div className="quiz-info__stats">
          <div className="quiz-stat"><span className="quiz-stat__val">{quizData.questions.length}</span><span className="quiz-stat__label">Questions</span></div>
          <div className="quiz-stat"><span className="quiz-stat__val">{fmt(quizData.timeLimitSeconds)}</span><span className="quiz-stat__label">Time Limit</span></div>
          <div className="quiz-stat"><span className="quiz-stat__val">{quizData.passingPercent}%</span><span className="quiz-stat__label">Pass Mark</span></div>
          <div className="quiz-stat"><span className="quiz-stat__val">{quizData.attemptsRemaining}</span><span className="quiz-stat__label">Attempts Left</span></div>
        </div>
        <div className="quiz-info__rules">
          <p>⚡ Most questions are real-world scenario-based</p>
          <p>🖥️ Quiz will open in full-screen mode</p>
          <p>⚠️ Exiting full-screen will flag your attempt</p>
          <p>🔒 You must pass to unlock the next topic</p>
        </div>
        {quizData.attemptsRemaining > 0
          ? <button className="mark-done-btn" style={{ width: '100%', justifyContent: 'center' }} onClick={startQuiz}>Start Quiz →</button>
          : <p style={{ color: '#dc2626', fontWeight: 600, textAlign: 'center' }}>No attempts remaining</p>
        }
      </div>
    </div>
  );

  // ── Active quiz ───────────────────────────────────────────────────────────
  if (stage === 'active' && quizData) {
    const q = quizData.questions[current];
    const progress = ((current + 1) / quizData.questions.length) * 100;
    const answered = answers.filter(a => a !== null).length;

    return (
      <div className="quiz-active">
        {/* Flag warning popup */}
        {showFlagWarning && (
          <div className="flag-warning">
            <strong>⚠️ Warning</strong>
            <p>You exited full-screen mode. This attempt has been flagged.</p>
            <button onClick={enterFullscreen} className="resend-btn" style={{ marginTop: '0.5rem' }}>Return to full-screen</button>
          </div>
        )}

        {/* Header */}
        <div className="quiz-active__header">
          <div className="quiz-active__meta">
            <span className="quiz-q-counter">Question {current + 1} / {quizData.questions.length}</span>
            {flagged && <span className="quiz-flag-badge">🚩 Flagged</span>}
          </div>
          <div className="quiz-active__right">
            {quizData.timeLimitSeconds > 0 && (
              <span className={`quiz-timer${timeLeft < 60 ? ' quiz-timer--urgent' : ''}`}>⏱ {fmt(timeLeft)}</span>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="quiz-progress-bar">
          <div className="quiz-progress-bar__fill" style={{ width: `${progress}%` }} />
        </div>

        {/* Question */}
        <div className="quiz-question-card">
          {q.scenario && <span className="scenario-tag">📋 Scenario-based</span>}
          <p className="quiz-question__text">{q.question}</p>
          <div className="quiz-options">
            {q.options.map((opt, oi) => (
              <button key={oi}
                className={`quiz-option${answers[current] === oi ? ' quiz-option--selected' : ''}`}
                onClick={() => setAnswers(a => { const n = [...a]; n[current] = oi; return n; })}>
                <span className="quiz-option__letter">{String.fromCharCode(65 + oi)}</span>
                <span>{opt}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="quiz-nav">
          <button className="quiz-nav__btn" onClick={() => setCurrent(c => c - 1)} disabled={current === 0}>← Previous</button>
          <span className="quiz-nav__answered">{answered}/{quizData.questions.length} answered</span>
          {current < quizData.questions.length - 1
            ? <button className="quiz-nav__btn quiz-nav__btn--primary" onClick={() => setCurrent(c => c + 1)} disabled={answers[current] === null}>Next →</button>
            : <button className="quiz-nav__btn quiz-nav__btn--submit" onClick={handleSubmit} disabled={submitting || answered < quizData.questions.length}>
                {submitting ? <><span className="spinner spinner--sm" style={{borderTopColor:'#fff'}} /> Submitting…</> : 'Submit Quiz'}
              </button>
          }
        </div>
      </div>
    );
  }

  // ── Result screen ─────────────────────────────────────────────────────────
  if (stage === 'result' && result) return (
    <div className="mod-body">

      {/* Score summary card */}
      <div className={`quiz-result-card${result.passed ? ' quiz-result-card--pass' : ' quiz-result-card--fail'}`}>
        <div className="quiz-result__icon">{result.passed ? '🏆' : '📚'}</div>
        <h3 className="quiz-result__title">{result.passed ? 'Quiz Passed!' : 'Not Passed'}</h3>
        <div className="quiz-result__stats-row">
          <div className="quiz-result__stat">
            <span className={`quiz-result__stat-val ${result.passed ? 'quiz-result__stat-val--green' : 'quiz-result__stat-val--red'}`}>{result.score}%</span>
            <span className="quiz-result__stat-label">Your Score</span>
          </div>
          <div className="quiz-result__stat">
            <span className="quiz-result__stat-val">{result.correct}/{result.total}</span>
            <span className="quiz-result__stat-label">Correct</span>
          </div>
          <div className="quiz-result__stat">
            <span className="quiz-result__stat-val">{result.passingPercent}%</span>
            <span className="quiz-result__stat-label">Pass Mark</span>
          </div>
          <div className="quiz-result__stat">
            <span className="quiz-result__stat-val">{result.attemptsRemaining}</span>
            <span className="quiz-result__stat-label">Attempts Left</span>
          </div>
        </div>
        {result.flagged && (
          <div className="quiz-flag-notice">
            <span>🚩</span><p>This attempt was flagged for exiting full-screen.</p>
          </div>
        )}
      </div>

      {/* Question review — outside score card so text-align:center doesn't affect it */}
      <div className="qr-section">
        <h4 className="qr-section__heading">
          📋 Question Review — {result.correct} correct, {result.total - result.correct} wrong
        </h4>
        {result.results.map((r, i) => (
          <div key={i} className={`qr-item${r.isCorrect ? ' qr-item--correct' : ' qr-item--wrong'}`}>
            <div className="qr-item__header">
              <span className="qr-item__status">{r.isCorrect ? '✅' : '❌'}</span>
              <span className="qr-item__num">Q{i + 1}</span>
              <span className="qr-item__question">{r.question}</span>
            </div>
            <div className="qr-item__options">
              {r.options.map((opt, oi) => {
                const isSelected = r.selected === oi;
                const isCorrect  = r.correctIndex === oi;
                let cls = 'qr-opt';
                if (isCorrect && isSelected)  cls += ' qr-opt--correct-selected';
                else if (isCorrect)           cls += ' qr-opt--correct';
                else if (isSelected)          cls += ' qr-opt--wrong';
                return (
                  <div key={oi} className={cls}>
                    <span className="qr-opt__letter">{String.fromCharCode(65 + oi)}</span>
                    <span className="qr-opt__text">{opt}</span>
                    <span className="qr-opt__badge">
                      {isCorrect && isSelected && '✓ Correct — your answer'}
                      {isCorrect && !isSelected && '✓ Correct answer'}
                      {!isCorrect && isSelected && '✗ Your answer'}
                    </span>
                  </div>
                );
              })}
            </div>
            {r.explanation && (
              <div className="qr-item__explanation">
                <span className="qr-item__exp-label">💡 Explanation</span>
                <p>{r.explanation}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Action buttons */}
      <div className="quiz-result__actions">
        {result.attemptsRemaining > 0 && (
          <button className="mark-done-btn"
            onClick={() => { setResult(null); setRetaking(true); setStage('info'); }}>
            🔁 {result.passed ? 'Retake' : 'Try Again'} ({result.attemptsRemaining} attempt{result.attemptsRemaining !== 1 ? 's' : ''} left)
          </button>
        )}
        {!result.passed && result.attemptsRemaining === 0 && (
          <p className="quiz-no-attempts">No attempts remaining. Review the modules above.</p>
        )}
      </div>
    </div>
  );

  return null;
};

// ── Main Caching page ─────────────────────────────────────────────────────────
const Caching = () => {
  const navigate = useNavigate();
  const [modules, setModules] = useState<LearningModule[]>([]);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const init = async () => {
      try {
        const [modRes, progRes] = await Promise.all([
          learningAPI.getModules('caching'),
          learningAPI.getProgress('caching'),
        ]);
        setModules(modRes.data.modules);
        setCompletedIds(new Set(progRes.data.completedModuleIds));
        activityAPI.log().catch(() => {});
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Failed to load content');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const isLocked = (idx: number): boolean => {
    if (idx === 0) return false;
    // Each module requires all previous to be completed
    for (let i = 0; i < idx; i++) {
      if (!completedIds.has(modules[i]?._id)) return true;
    }
    return false;
  };

  const handleMarkComplete = async () => {
    const mod = modules[selectedIdx];
    if (!mod || completedIds.has(mod._id)) return;
    setCompleting(true);
    try {
      await learningAPI.markComplete(mod._id, 'caching');
      setCompletedIds(prev => new Set([...prev, mod._id]));
      activityAPI.log().catch(() => {});
    } catch (e: unknown) {
      console.error(e);
    } finally {
      setCompleting(false);
    }
  };

  const selectedMod = modules[selectedIdx];
  const canAccessSelected = !isLocked(selectedIdx);

  if (loading) return (
    <div className="learn-root"><LearningNav />
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', flexDirection: 'column', gap: '1rem', background: 'var(--l-bg)' }}>
        <div className="rag-spinner" />
        <p style={{ color: 'var(--l-text-sec)' }}>Loading modules…</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="learn-root"><LearningNav />
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', flexDirection: 'column', gap: '1rem', background: 'var(--l-bg)' }}>
        <p style={{ color: '#dc2626' }}>⚠️ {error}</p>
      </div>
    </div>
  );

  return (
    <div className="learn-root">
      <LearningNav />
      <main className="caching-page">
        {/* Breadcrumb */}
        <nav className="caching-breadcrumb">
          <button className="caching-breadcrumb__btn" onClick={() => navigate('/learning')}>Learning Interface</button>
          <span>/</span>
          <button className="caching-breadcrumb__btn" onClick={() => navigate('/learning/hld')}>HLD</button>
          <span>/</span>
          <span className="caching-breadcrumb__current">Caching</span>
        </nav>

        <div className="caching-layout">
          {/* Sidebar */}
          <aside className="caching-sidebar">
            <button className="caching-dropdown__header" onClick={() => setDropdownOpen(v => !v)} aria-expanded={dropdownOpen}>
              <span className="caching-dropdown__title">Caching Topics</span>
              <span className={`caching-dropdown__chevron${dropdownOpen ? ' caching-dropdown__chevron--open' : ''}`}>›</span>
            </button>

            {dropdownOpen && (
              <ul className="caching-sidebar__list">
                {modules.map((m, idx) => {
                  const done = completedIds.has(m._id);
                  const locked = isLocked(idx);
                  return (
                    <li key={m._id}>
                      <button
                        className={`caching-sidebar__item${selectedIdx === idx ? ' caching-sidebar__item--active' : ''}${locked ? ' caching-sidebar__item--locked' : ''}`}
                        onClick={() => !locked && setSelectedIdx(idx)}
                        title={locked ? 'Complete previous modules first' : ''}
                      >
                        <span className="caching-sidebar__mod-icon">{MODULE_ICONS[m.type]}</span>
                        <span className="caching-sidebar__label">{m.title}</span>
                        {done && <span className="caching-sidebar__done">✓</span>}
                        {locked && <span className="caching-sidebar__lock">🔒</span>}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </aside>

          {/* Content panel */}
          <div className="caching-content">
            {selectedMod && canAccessSelected ? (
              <div className="content-panel">
                <div className="content-panel__header">
                  <div>
                    <span className="content-panel__type-badge">{MODULE_ICONS[selectedMod.type]} {selectedMod.type}</span>
                    <h2 className="cp__title">{selectedMod.title}</h2>
                  </div>
                  {completedIds.has(selectedMod._id) && <span className="content-panel__done-badge">✅ Completed</span>}
                </div>

                {selectedMod.type === 'content' && (
                  <ContentModule mod={selectedMod} completed={completedIds.has(selectedMod._id)}
                    onComplete={handleMarkComplete} completing={completing} />
                )}
                {selectedMod.type === 'failureCases' && (
                  <FailureCasesModule mod={selectedMod} completed={completedIds.has(selectedMod._id)}
                    onComplete={handleMarkComplete} completing={completing} />
                )}
                {selectedMod.type === 'interview' && (
                  <InterviewModule mod={selectedMod} completed={completedIds.has(selectedMod._id)}
                    onComplete={handleMarkComplete} completing={completing} />
                )}
                {selectedMod.type === 'quiz' && (
                  <QuizModule mod={selectedMod} completed={completedIds.has(selectedMod._id)}
                    onComplete={handleMarkComplete} />
                )}
              </div>
            ) : (
              <div className="content-panel content-panel--center">
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔒</div>
                <h3 style={{ color: 'var(--l-text)', marginBottom: '0.5rem' }}>Module Locked</h3>
                <p style={{ color: 'var(--l-text-sec)' }}>Complete previous modules to unlock this one.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Caching;
