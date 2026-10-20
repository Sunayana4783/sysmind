import React, { useState, useEffect, useRef } from 'react';
import { type AnimationStep } from '../services/api';
import '../pages/Modules.css';

interface Props { steps: AnimationStep[]; autoPlay?: boolean; }

const FlowAnimation = ({ steps, autoPlay = true }: Props) => {
  const [activeIdx, setActiveIdx] = useState(0);
  // Stop auto-play when user manually navigates
  const userActed = useRef(false);

  useEffect(() => {
    setActiveIdx(0);
    userActed.current = false;
  }, [steps]);

  useEffect(() => {
    if (!autoPlay || steps.length <= 1) return;
    const iv = setInterval(() => {
      if (!userActed.current) {
        setActiveIdx(i => (i + 1) % steps.length);
      }
    }, 2200);
    return () => clearInterval(iv);
  }, [steps, autoPlay]);

  const goTo = (i: number) => {
    userActed.current = true;
    setActiveIdx(i);
  };

  return (
    <div className="flow-anim" aria-label="Step animation">
      {/* ── Step cards ─────────────────────────────────────────────── */}
      <div className="flow-anim__cards">
        {steps.map((step, idx) => (
          <button
            key={idx}
            className={[
              'flow-anim__card',
              idx === activeIdx  ? 'flow-anim__card--active'    : '',
              step.highlight     ? 'flow-anim__card--highlight' : '',
            ].filter(Boolean).join(' ')}
            onClick={() => goTo(idx)}
            aria-pressed={idx === activeIdx}
          >
            <div className="flow-anim__card-num">{idx + 1}</div>
            <div className="flow-anim__card-label">{step.label}</div>
            <div className="flow-anim__card-desc">{step.description}</div>
            {idx < steps.length - 1 && (
              <div className="flow-anim__card-arrow">&#8594;</div>
            )}
          </button>
        ))}
      </div>

      {/* ── Active step detail ─────────────────────────────────────── */}
      <div className="flow-anim__detail">
        <span className="flow-anim__detail-pill">{activeIdx + 1} / {steps.length}</span>
        <span className="flow-anim__detail-text">{steps[activeIdx]?.description}</span>
      </div>

      {/* ── Prev / dot nav / next ──────────────────────────────────── */}
      <div className="flow-anim__nav">
        <button
          className="flow-anim__nav-btn"
          onClick={() => goTo(activeIdx - 1)}
          disabled={activeIdx === 0}
          aria-label="Previous step"
        >
          &#8592; Prev
        </button>
        <div className="flow-anim__dots">
          {steps.map((_, idx) => (
            <button
              key={idx}
              className={`flow-anim__dot${idx === activeIdx ? ' flow-anim__dot--active' : ''}`}
              onClick={() => goTo(idx)}
              aria-label={`Step ${idx + 1}`}
            />
          ))}
        </div>
        <button
          className="flow-anim__nav-btn"
          onClick={() => goTo(activeIdx + 1)}
          disabled={activeIdx === steps.length - 1}
          aria-label="Next step"
        >
          Next &#8594;
        </button>
      </div>
    </div>
  );
};

export default FlowAnimation;
