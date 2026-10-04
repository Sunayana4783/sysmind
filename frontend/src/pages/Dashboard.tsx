import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import LearningNav from '../components/LearningNav';
import '../styles/learning-theme.css';
import './Dashboard.css';

// ── Radar chart (SVG, purple) ─────────────────────────────────────────────────
const RadarChart = () => {
  const size = 160;
  const center = size / 2;
  const radius = 55;

  const axes = [
    { label: 'LLD', angle: -90 },
    { label: 'HLD', angle: 30 },
    { label: 'Overall', angle: 150 },
  ];

  const toXY = (angle: number, r: number) => ({
    x: center + r * Math.cos((angle * Math.PI) / 180),
    y: center + r * Math.sin((angle * Math.PI) / 180),
  });

  const rings = [0.25, 0.5, 0.75, 1].map((scale) => {
    const points = axes.map((a) => toXY(a.angle, radius * scale));
    return points.map((p) => `${p.x},${p.y}`).join(' ');
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-label="Mastery radar chart">
      {rings.map((pts, i) => (
        <polygon key={i} points={pts} fill="none" stroke="rgba(124,92,252,0.18)" strokeWidth="1" />
      ))}
      {axes.map((a) => {
        const end = toXY(a.angle, radius);
        return (
          <line key={a.label} x1={center} y1={center} x2={end.x} y2={end.y}
            stroke="rgba(124,92,252,0.28)" strokeWidth="1" />
        );
      })}
      <polygon
        points={axes.map((a) => `${center},${center}`).join(' ')}
        fill="rgba(124,92,252,0.12)"
        stroke="#7C5CFC"
        strokeWidth="1.5"
      />
      {axes.map((a) => {
        const pos = toXY(a.angle, radius + 14);
        return (
          <text key={a.label} x={pos.x} y={pos.y} textAnchor="middle"
            dominantBaseline="middle" fill="#716B7A" fontSize="9">
            {a.label}
          </text>
        );
      })}
    </svg>
  );
};

// ── Progress bar ──────────────────────────────────────────────────────────────
const ProgressBar = ({ value = 0 }: { value?: number }) => (
  <div className="db-progress-bar" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
    <div className="db-progress-bar__fill" style={{ width: `${value}%` }} />
  </div>
);

// ── Stat card ─────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, icon }: { label: string; value: string; icon: string }) => (
  <div className="db-stat-card">
    <div className="db-stat-card__label">
      <span className="db-stat-card__icon">{icon}</span>
      {label}
    </div>
    <div className="db-stat-card__value">{value}</div>
  </div>
);

// ── Concept row ───────────────────────────────────────────────────────────────
const ConceptRow = ({ title }: { title: string }) => (
  <div className="db-concept-row">
    <div className="db-concept-row__header">
      <span className="db-concept-row__title">{title}</span>
      <span className="db-badge">In Progress</span>
    </div>
    <div className="db-concept-row__sub">Not Started</div>
    <ProgressBar value={0} />
  </div>
);

// ── Dashboard ─────────────────────────────────────────────────────────────────
const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const concepts = [
    'System Design Fundamentals & NFRs',
    '2-Tier, 3-Tier, N-Tier Architecture',
    'Monolithic Architecture',
    'Microservices Architecture',
  ];

  return (
    <div className="learn-root">
      <LearningNav />

      <main className="dashboard">
        {/* ── Header ──────────────────────────────────────────────────── */}
        <header className="db-header">
          <div className="db-welcome">
            <h1 className="db-title">Welcome back, {user?.username} 👋</h1>
            <p className="db-meta">
              <span className="db-concepts-link">0 concepts mastered</span>
              &nbsp;·&nbsp; Phase: <strong>Foundation</strong>
            </p>
          </div>
          <div className="db-actions">
            <button className="db-btn-continue" onClick={() => navigate('/learning')}>
              <span>⚡</span> Continue Learning
            </button>
          </div>
        </header>

        {/* ── Stats row ────────────────────────────────────────────────── */}
        <section className="db-stats" aria-label="Progress stats">
          <StatCard label="LLD Progress" value="0%" icon="▣" />
          <StatCard label="HLD Progress" value="0%" icon="◈" />
          <StatCard label="Overall"      value="0%" icon="⊕" />
        </section>

        {/* ── Middle row ───────────────────────────────────────────────── */}
        <section className="db-middle">
          <div className="db-card db-card--radar">
            <h3 className="db-card__title">Mastery Overview</h3>
            <div className="db-card__radar">
              <RadarChart />
            </div>
          </div>

          <div className="db-card">
            <h3 className="db-card__title"><span>⚠️</span> Weak Areas</h3>
            <p className="db-card__empty">No weak areas detected yet.</p>
          </div>

          <div className="db-card">
            <h3 className="db-card__title"><span>🔄</span> Due for Review</h3>
            <p className="db-card__empty">Nothing due today.</p>
          </div>
        </section>

        {/* ── Concept progress ─────────────────────────────────────────── */}
        <section className="db-concepts-section" aria-label="Concept progress">
          <div className="db-card db-card--full">
            <div className="db-concepts-header">
              <h3 className="db-card__title">Concept Progress (0/48 mastered)</h3>
              <span className="db-phase-label">IN PROGRESS</span>
            </div>
            <div className="db-concepts-grid">
              {concepts.map((c) => <ConceptRow key={c} title={c} />)}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
