import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LearningNav from '../components/LearningNav';
import '../styles/learning-theme.css';
import './Learning.css';

interface LearningCard {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  locked: boolean;
  route: string;
  icon: string;
}

const CARDS: LearningCard[] = [
  {
    id: 'hld',
    title: 'HLD',
    subtitle: 'High Level Design',
    description: 'Learn system architecture, scalability, load balancing, distributed systems, and more.',
    locked: false,
    route: '/learning/hld',
    icon: '🏗️',
  },
  {
    id: 'lld',
    title: 'LLD',
    subtitle: 'Low Level Design',
    description: 'Master object-oriented design, design patterns, class diagrams, and component design.',
    locked: true,
    route: '',
    icon: '🔧',
  },
  {
    id: 'system-design',
    title: 'System Design',
    subtitle: 'End-to-End Design',
    description: 'Practice full system design interviews combining HLD and LLD principles together.',
    locked: true,
    route: '',
    icon: '⚙️',
  },
];

const Learning = () => {
  const navigate = useNavigate();
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (title: string) => {
    setToast(`${title} is coming soon. Complete HLD first to unlock it.`);
    setTimeout(() => setToast(null), 3000);
  };

  const handleCardClick = (card: LearningCard) => {
    if (!card.locked) {
      navigate(card.route);
    } else {
      showToast(card.title);
    }
  };

  return (
    <div className="learn-root">
      <LearningNav />

      <main className="learning-page">
        <header className="learning-page__header">
          <h1 className="learning-page__title">Learning Interface</h1>
          <p className="learning-page__subtitle">
            Choose a track to begin. Complete HLD to unlock the next track.
          </p>
        </header>

        <div className="learning-cards">
          {CARDS.map((card) => (
            <div
              key={card.id}
              className={`lcard${card.locked ? ' lcard--locked' : ' lcard--unlocked'}`}
              onClick={() => handleCardClick(card)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleCardClick(card)}
              aria-label={card.locked ? `${card.title} — locked` : `${card.title} — open`}
            >
              <div className="lcard__icon">{card.icon}</div>

              <div className="lcard__body">
                <h2 className="lcard__title">{card.title}</h2>
                <p className="lcard__subtitle">{card.subtitle}</p>
                <p className="lcard__desc">{card.description}</p>
              </div>

              <div className={`lcard__tag${card.locked ? ' lcard__tag--locked' : ' lcard__tag--unlocked'}`}>
                {card.locked ? '🔒 LOCKED' : '✅ UNLOCKED'}
              </div>

              {!card.locked && (
                <div className="lcard__cta">Start Learning →</div>
              )}
            </div>
          ))}
        </div>
      </main>

      {/* Toast notification */}
      {toast && (
        <div className="learning-toast" role="status" aria-live="polite">
          🔒 {toast}
        </div>
      )}
    </div>
  );
};

export default Learning;
