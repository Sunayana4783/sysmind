import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import LearningNav from '../components/LearningNav';
import ModuleAnimation from '../components/ModuleAnimation';
import { learningAPI, quizAPI, activityAPI, type LearningModule, type QuizData, type QuizResult } from '../services/api';
import '../styles/learning-theme.css';
import './SystemArchitecture.css';
import './Modules.css';

// ── Helpers ───────────────────────────────────────────────────────────────────
const MODULE_TYPE_LABELS: Record<string, string> = {
  content: 'Content', failureCases: 'Failure Cases', interview: 'Interview', quiz: 'Quiz',
};

// ── ContentModule renderer ────────────────────────────────────────────────────
const ContentModule = ({ mod, completed, onComplete, completing, onNext, isLast }: {
  mod: LearningModule; completed: boolean;
  onComplete: () => void; completing: boolean;
  onNext: () => void; isLast: boolean;
}) => {
  const c = mod.content!;
  return (
    <div className="mod-body">
      <div className="mod-overview">{c.overview.split('\n').filter(Boolean).map((p, i) => <p key={i}>{p}</p>)}</div>

      {c.sections?.map((s, i) => (
        <div key={i} className="mod-section">
          <h3 className="mod-section__heading">{s.heading}</h3>
          <p className="mod-section__body">{s.body}</p>
        </div>
      ))}

      {c.animationSteps?.length > 0 && (
        <div className="mod-block">
          <h3 className="mod-section-title">How it works</h3>
          <ModuleAnimation steps={c.animationSteps} topicTitle={mod.title} topic="system-architecture" />
        </div>
      )}

      {c.example && (
        <div className="mod-block">
          <h3 className="mod-section-title">Real-world example</h3>
          <div className="example-box"><p>{c.example}</p></div>
        </div>
      )}

      <div className="mod-complete-row">
        {!completed ? (
          <button className="mark-done-btn" onClick={onComplete} disabled={completing}>
            {completing ? <><span className="spinner spinner--sm" style={{borderTopColor:'#fff'}} /> Saving</> : 'Mark as Completed'}
          </button>
        ) : isLast ? (
          <button className="mark-done-btn mark-done-btn--done" disabled>Completed</button>
        ) : (
          <button className="mark-done-btn" onClick={onNext}>
            Next Module →
          </button>
        )}
      </div>
    </div>
  );
};

// ── FailureCases renderer ─────────────────────────────────────────────────────
const FailureCasesModule = ({ mod, completed, onComplete, completing, onNext, isLast }: {
  mod: LearningModule; completed: boolean; onComplete: () => void; completing: boolean;
  onNext: () => void; isLast: boolean;
}) => {
  const [openIdx, setOpenIdx] = useState(0);
  const cases = mod.failureCases || [];
  const fc = cases[openIdx];
  const isLastCase = openIdx === cases.length - 1;

  return (
    <div className="mod-body">
      <p className="mod-overview-text">Real-world failure scenarios and how to handle them.</p>

      <div className="fc-layout">
        {/* Sidebar */}
        <div className="fc-sidebar">
          {cases.map((c, i) => (
            <button key={i}
              className={`fc-sidebar__item${i === openIdx ? ' fc-sidebar__item--active' : ''}${i < openIdx ? ' fc-sidebar__item--visited' : ''}`}
              onClick={() => setOpenIdx(i)}>
              <span>{c.title}</span>
              {i < openIdx && <span className="fc-sidebar__done">&#10003;</span>}
            </button>
          ))}
        </div>

        {/* Detail */}
        {fc && (
          <div className="fc-detail">
            <h3 className="fc-detail__title">{fc.title}</h3>

            <div className="fc-detail__block fc-detail__block--scenario">
              <span className="fc-label">Scenario</span>
              <p>{fc.scenario}</p>
            </div>
            <div className="fc-detail__block fc-detail__block--impact">
              <span className="fc-label">Impact</span>
              <p>{fc.impact}</p>
            </div>
            <div className="fc-detail__block fc-detail__block--resolution">
              <span className="fc-label">Resolution</span>
              <p>{fc.resolution}</p>
            </div>

            {fc.animationSteps?.length > 0 && (
              <div className="mod-block" style={{ marginTop: '1.25rem' }}>
                <h4 className="mod-section-title">Failure flow</h4>
                <ModuleAnimation steps={fc.animationSteps} animType="cascade" topicTitle={fc.title} topic="system-architecture" />
              </div>
            )}

            {/* Navigation buttons */}
            <div className="mod-complete-row" style={{ marginTop: '1.5rem', gap: '0.75rem' }}>
              {!isLastCase ? (
                <button className="mark-done-btn" onClick={() => setOpenIdx(i => i + 1)}>
                  Next →
                </button>
              ) : !completed ? (
                <button className="mark-done-btn" onClick={onComplete} disabled={completing}>
                  {completing ? <><span className="spinner spinner--sm" style={{borderTopColor:'#fff'}} /> Saving</> : 'Mark as Completed'}
                </button>
              ) : isLast ? (
                <button className="mark-done-btn mark-done-btn--done" disabled>Completed</button>
              ) : (
                <button className="mark-done-btn" onClick={onNext}>Next Module →</button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ── InterviewQuestions renderer ───────────────────────────────────────────────
const InterviewModule = ({ mod, completed, onComplete, completing, onNext, isLast }: {
  mod: LearningModule; completed: boolean; onComplete: () => void; completing: boolean;
  onNext: () => void; isLast: boolean;
}) => {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const questions = mod.interviewQuestions || [];

  return (
    <div className="mod-body">
      <p className="mod-overview-text">
        {questions.length} interview questions. Click a question to reveal the answer.
      </p>

      <div className="iq-list">
        {questions.map((q, i) => (
          <div key={i} className={`iq-item${openIdx === i ? ' iq-item--open' : ''}`}>
            <button className="iq-item__header" onClick={() => setOpenIdx(openIdx === i ? null : i)}>
              <div className="iq-item__left">
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
        {!completed ? (
          <button className="mark-done-btn" onClick={onComplete} disabled={completing}>
            {completing ? <><span className="spinner spinner--sm" style={{borderTopColor:'#fff'}} /> Saving</> : 'Mark as Completed'}
          </button>
        ) : isLast ? (
          <button className="mark-done-btn mark-done-btn--done" disabled>Completed</button>
        ) : (
          <button className="mark-done-btn" onClick={onNext}>Next Module →</button>
        )}
      </div>
    </div>
  );
};

// ── Quiz component ────────────────────────────────────────────────────────────
const QuizModule = ({ mod, completed, onComplete, onQuizStart, onQuizEnd }: {
  mod: LearningModule; completed: boolean; onComplete: () => void;
  onQuizStart: () => void; onQuizEnd: () => void;
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
  const [warningDismissed, setWarningDismissed] = useState(false); // tracks if user manually dismissed
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

  // Fullscreen + visibility detection
  useEffect(() => {
    if (stage !== 'active') return;

    const triggerFlag = (reason: string) => {
      console.log('Quiz flag triggered:', reason);
      setFlagged(true);
      setFlagCount(c => c + 1);
      setShowFlagWarning(true);
      setWarningDismissed(false);
    };

    // Fullscreen exit
    const fullscreenHandler = () => {
      if (!document.fullscreenElement) {
        triggerFlag('fullscreen-exit');
      }
    };

    // Tab switch / window blur / app switch
    const visibilityHandler = () => {
      if (document.hidden) {
        triggerFlag('tab-switch');
      }
    };

    // Window blur (alt+tab, clicking outside browser)
    const blurHandler = () => {
      triggerFlag('window-blur');
    };

    document.addEventListener('fullscreenchange', fullscreenHandler);
    document.addEventListener('visibilitychange', visibilityHandler);
    window.addEventListener('blur', blurHandler);

    return () => {
      document.removeEventListener('fullscreenchange', fullscreenHandler);
      document.removeEventListener('visibilitychange', visibilityHandler);
      window.removeEventListener('blur', blurHandler);
    };
  }, [stage]);

  const enterFullscreen = () => document.documentElement.requestFullscreen().catch(() => {});
  const exitFullscreen = () => document.fullscreenElement && document.exitFullscreen();

  const startQuiz = () => {
    if (!quizData) return;
    setAnswers(new Array(quizData.questions.length).fill(null));
    setCurrent(0);
    setTimeLeft(quizData.timeLimitSeconds);
    setFlagged(false); setFlagCount(0); setShowFlagWarning(false); setWarningDismissed(false);
    setStartTime(Date.now());
    enterFullscreen();
    onQuizStart();
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
      onQuizEnd();
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
      <div className="rag-spinner" /><p className="rag-loading-text">Loading quiz</p>
    </div>
  );
  if (error) return (
    <div className="mod-body mod-center">
      <p className="rag-error-msg">Error: {error}</p>
      <button className="mark-done-btn" onClick={() => { setError(''); setStage('info'); }}>Retry</button>
    </div>
  );

  // ── Already passed ────────────────────────────────────────────────────────
  // Only show this screen when NOT actively retaking
  if ((completed || quizData?.alreadyPassed) && !retaking && stage !== 'result') return (
    <div className="mod-body">
      <div className="quiz-result-card quiz-result-card--pass">
        <div className="quiz-result__icon quiz-result__icon--pass" />
        <h3 className="quiz-result__title">Quiz Passed!</h3>
        {quizData && (
          <>
            <div className="quiz-result__stats-row">
              <div className="quiz-result__stat">
                <span className="quiz-result__stat-val quiz-result__stat-val--green">Passed</span>
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
              Next topic unlocked. Well done!
            </p>
            {/* Allow retake even after passing if attempts remain */}
            {quizData.attemptsRemaining > 0 && (
              <button className="mark-done-btn" style={{ marginTop: '1rem', background: 'var(--l-primary)' }}
                onClick={() => { setRetaking(true); setStage('info'); }}>
                Retake Quiz ({quizData.attemptsRemaining} attempt{quizData.attemptsRemaining !== 1 ? 's' : ''} left)
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
        <div className="quiz-info__icon quiz-info__icon--target" />
        <h3 className="quiz-info__title">{quizData.title}</h3>
        <div className="quiz-info__stats">
          <div className="quiz-stat"><span className="quiz-stat__val">{quizData.questions.length}</span><span className="quiz-stat__label">Questions</span></div>
          <div className="quiz-stat"><span className="quiz-stat__val">{fmt(quizData.timeLimitSeconds)}</span><span className="quiz-stat__label">Time Limit</span></div>
          <div className="quiz-stat"><span className="quiz-stat__val">{quizData.passingPercent}%</span><span className="quiz-stat__label">Pass Mark</span></div>
          <div className="quiz-stat"><span className="quiz-stat__val">{quizData.attemptsRemaining}</span><span className="quiz-stat__label">Attempts Left</span></div>
        </div>
        <div className="quiz-info__rules">
          <p>Most questions are real-world scenario-based</p>
          <p>Quiz will open in full-screen mode</p>
          <p>Exiting full-screen will flag your attempt</p>
          <p>You must pass to unlock the next topic</p>
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
        {/* Flag warning popup - persistent, blocks quiz until dismissed */}
        {showFlagWarning && (
          <div className="flag-warning flag-warning--blocking">
            <strong>Warning: Attempt Flagged</strong>
            <p>
              {!document.fullscreenElement
                ? 'You exited full-screen mode.'
                : 'You switched away from this tab or window.'}
              {' '}This attempt has been flagged.
            </p>
            <p className="flag-warning__count">Flag count: {flagCount}</p>
            <button
              className="mark-done-btn"
              style={{ marginTop: '0.75rem', width: '100%', justifyContent: 'center' }}
              onClick={() => {
                enterFullscreen();
                setShowFlagWarning(false);
                setWarningDismissed(true);
              }}
            >
              Return to Full-Screen & Continue
            </button>
          </div>
        )}

        {/* Header */}
        <div className="quiz-active__header">
          <div className="quiz-active__meta">
            <span className="quiz-q-counter">Question {current + 1} / {quizData.questions.length}</span>
            {flagged && <span className="quiz-flag-badge">Flagged</span>}
          </div>
          <div className="quiz-active__right">
            {quizData.timeLimitSeconds > 0 && (
              <span className={`quiz-timer${timeLeft < 60 ? ' quiz-timer--urgent' : ''}`}>{fmt(timeLeft)}</span>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="quiz-progress-bar">
          <div className="quiz-progress-bar__fill" style={{ width: `${progress}%` }} />
        </div>

        {/* Question */}
        <div className="quiz-question-card">
          {q.scenario && <span className="scenario-tag">Scenario-based</span>}
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
                {submitting ? <><span className="spinner spinner--sm" style={{borderTopColor:'#fff'}} /> Submitting</> : 'Submit Quiz'}
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
        <div className="quiz-result__icon">{result.passed ? <span className="quiz-result__icon--pass" /> : <span className="quiz-result__icon--fail" />}</div>
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
            <p>This attempt was flagged for exiting full-screen.</p>
          </div>
        )}
      </div>

      {/* Question review - outside score card so text-align:center doesn't affect it */}
      <div className="qr-section">
        <h4 className="qr-section__heading">
          Question Review: {result.correct} correct, {result.total - result.correct} wrong
        </h4>
        {result.results.map((r, i) => (
          <div key={i} className={`qr-item${r.isCorrect ? ' qr-item--correct' : ' qr-item--wrong'}`}>
            <div className="qr-item__header">
              <span className="qr-item__status">{r.isCorrect ? 'Correct' : 'Wrong'}</span>
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
                      {isCorrect && isSelected && 'Correct (your answer)'}
                      {isCorrect && !isSelected && 'Correct answer'}
                      {!isCorrect && isSelected && 'Your answer'}
                    </span>
                  </div>
                );
              })}
            </div>
            {r.explanation && (
              <div className="qr-item__explanation">
                <span className="qr-item__exp-label">Explanation</span>
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
            {result.passed ? 'Retake' : 'Try Again'} ({result.attemptsRemaining} attempt{result.attemptsRemaining !== 1 ? 's' : ''} left)
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
const SystemArchitecture = () => {
  const navigate = useNavigate();
  const [modules, setModules] = useState<LearningModule[]>([]);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(true);
  const [error, setError] = useState('');
  const [quizActive, setQuizActive] = useState(false); // true while quiz is in progress

  useEffect(() => {
    const init = async () => {
      try {
        const [modRes, progRes] = await Promise.all([
          learningAPI.getModules('system-architecture'),
          learningAPI.getProgress('system-architecture'),
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
      await learningAPI.markComplete(mod._id, 'system-architecture');
      setCompletedIds(prev => new Set([...prev, mod._id]));
      activityAPI.log().catch(() => {});
      // Auto-advance to next module
      const nextIdx = selectedIdx + 1;
      if (nextIdx < modules.length) {
        setTimeout(() => setSelectedIdx(nextIdx), 400);
      }
    } catch (e: unknown) {
      console.error(e);
    } finally {
      setCompleting(false);
    }
  };

  const handleNextModule = () => {
    const nextIdx = selectedIdx + 1;
    if (nextIdx < modules.length && !isLocked(nextIdx)) {
      setSelectedIdx(nextIdx);
    }
  };

  const selectedMod = modules[selectedIdx];
  const canAccessSelected = !isLocked(selectedIdx);

  if (loading) return (
    <div className="learn-root"><LearningNav />
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', flexDirection: 'column', gap: '1rem', background: 'var(--l-bg)' }}>
        <div className="rag-spinner" />
        <p style={{ color: 'var(--l-text-sec)' }}>Loading modules</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="learn-root"><LearningNav />
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', flexDirection: 'column', gap: '1rem', background: 'var(--l-bg)' }}>
        <p style={{ color: '#dc2626' }}>Error: {error}</p>
      </div>
    </div>
  );

  return (
    <div className="learn-root">
      {!quizActive && <LearningNav />}
      <main className="caching-page sa-page">
        {/* Hide breadcrumb and sidebar during active quiz */}
        {!quizActive && (
          <nav className="caching-breadcrumb">
            <button className="caching-breadcrumb__btn" onClick={() => navigate('/learning')}>Learning Interface</button>
            <span>/</span>
            <button className="caching-breadcrumb__btn" onClick={() => navigate('/learning/hld')}>HLD</button>
            <span>/</span>
            <span className="caching-breadcrumb__current">System Architecture</span>
          </nav>
        )}

        <div className={`caching-layout${quizActive ? ' caching-layout--quiz-active' : ''}`}>
          {/* Sidebar - hidden during quiz */}
          {!quizActive && (
          <aside className="caching-sidebar">
            <button className="caching-dropdown__header" onClick={() => setDropdownOpen(v => !v)} aria-expanded={dropdownOpen}>
              <span className="caching-dropdown__title">System Architecture Topics</span>
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
                        className={`caching-sidebar__item${selectedIdx === idx ? ' caching-sidebar__item--active' : ''}${locked || quizActive ? ' caching-sidebar__item--locked' : ''}`}
                        onClick={() => !locked && !quizActive && setSelectedIdx(idx)}
                        title={quizActive ? 'Quiz in progress - complete or submit first' : locked ? 'Complete previous modules first' : ''}
                      >
                        <span className="caching-sidebar__label">{m.title}</span>
                        {done && <span className="caching-sidebar__done">&#10003;</span>}
                        {locked && <span className="caching-sidebar__lock">&#128274;</span>}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </aside>
          )}

          {/* Content panel */}
          <div className="caching-content">
            {selectedMod && canAccessSelected ? (
              <div className="content-panel">
                <div className="content-panel__header">
                  <div>
                    <span className="content-panel__type-badge">{MODULE_TYPE_LABELS[selectedMod.type]}</span>
                    <h2 className="cp__title">{selectedMod.title}</h2>
                  </div>
                  {completedIds.has(selectedMod._id) && <span className="content-panel__done-badge">Completed</span>}
                </div>

                {selectedMod.type === 'content' && (
                  <ContentModule mod={selectedMod} completed={completedIds.has(selectedMod._id)}
                    onComplete={handleMarkComplete} completing={completing}
                    onNext={handleNextModule} isLast={selectedIdx === modules.length - 1} />
                )}
                {selectedMod.type === 'failureCases' && (
                  <FailureCasesModule mod={selectedMod} completed={completedIds.has(selectedMod._id)}
                    onComplete={handleMarkComplete} completing={completing}
                    onNext={handleNextModule} isLast={selectedIdx === modules.length - 1} />
                )}
                {selectedMod.type === 'interview' && (
                  <InterviewModule mod={selectedMod} completed={completedIds.has(selectedMod._id)}
                    onComplete={handleMarkComplete} completing={completing}
                    onNext={handleNextModule} isLast={selectedIdx === modules.length - 1} />
                )}
                {selectedMod.type === 'quiz' && (
                  <QuizModule mod={selectedMod} completed={completedIds.has(selectedMod._id)}
                    onComplete={handleMarkComplete} onQuizStart={() => setQuizActive(true)} onQuizEnd={() => setQuizActive(false)} />
                )}
              </div>
            ) : (
              <div className="content-panel content-panel--center">
                <div className="content-panel__lock-icon" />
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

export default SystemArchitecture;
