import React, { useState, useEffect } from 'react';
import { type AnimationStep } from '../services/api';
import '../pages/Modules.css';

interface Props { steps: AnimationStep[]; autoPlay?: boolean; }

const FlowAnimation = ({ steps, autoPlay = true }: Props) => {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    setActiveIdx(0);
    if (!autoPlay || steps.length <= 1) return;
    const iv = setInterval(() => setActiveIdx(i => (i + 1) % steps.length), 2200);
    return () => clearInterval(iv);
  }, [steps, autoPlay]);

  return (
    <div className="flow-anim" aria-label="Step animation">
      <div className="flow-anim__track">
        {steps.map((step, idx) => (
          <React.Fragment key={idx}>
            <div className={
              `flow-anim__step${idx === activeIdx ? ' flow-anim__step--active' : ''}${step.highlight ? ' flow-anim__step--highlight' : ''}`
            }>
              <div className="flow-anim__step-num">{idx + 1}</div>
              <div className="flow-anim__step-label">{step.label}</div>
              <div className="flow-anim__step-desc">{step.description}</div>
            </div>
            {idx < steps.length - 1 && (
              <div className={`flow-anim__arrow${idx < activeIdx ? ' flow-anim__arrow--done' : ''}`}>→</div>
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="flow-anim__dots">
        {steps.map((_, idx) => (
          <button key={idx}
            className={`flow-anim__dot${idx === activeIdx ? ' flow-anim__dot--active' : ''}`}
            onClick={() => setActiveIdx(idx)} aria-label={`Step ${idx + 1}`} />
        ))}
      </div>
    </div>
  );
};

export default FlowAnimation;
