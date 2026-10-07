import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import LearningNav from '../components/LearningNav';
import { activityAPI, learningAPI } from '../services/api';
import '../styles/learning-theme.css';
import './Profile.css';

// ── GitHub-style contribution graph ──────────────────────────────────────────
interface ContribGraphProps {
  activityMap: Record<string, number>;
  today: string;
}

const ContribGraph = ({ activityMap, today }: ContribGraphProps) => {
  const [tooltip, setTooltip] = useState<{ date: string; count: number; x: number; y: number } | null>(null);

  // Helper: format a Date as YYYY-MM-DD using LOCAL browser time
  const toLocalDateStr = (d: Date): string => {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  // Build 53 weeks ending with the week that contains today
  const WEEKS = 53;

  // Parse today as a local date object
  const [ty, tm, td] = today.split('-').map(Number);
  const todayDate = new Date(ty, tm - 1, td); // local midnight

  // Find the Saturday of this week (end of current week)
  const endDate = new Date(todayDate);
  endDate.setDate(endDate.getDate() + (6 - endDate.getDay())); // advance to Saturday

  // Go back 53 weeks to find the start (Sunday)
  const start = new Date(endDate);
  start.setDate(start.getDate() - (WEEKS * 7 - 1));

  const weeks: { date: string; count: number }[][] = [];
  const cur = new Date(start);
  for (let w = 0; w < WEEKS; w++) {
    const week: { date: string; count: number }[] = [];
    for (let d = 0; d < 7; d++) {
      const ds = toLocalDateStr(cur);
      week.push({ date: ds, count: activityMap[ds] || 0 });
      cur.setDate(cur.getDate() + 1);
    }
    weeks.push(week);
  }

  // Month labels
  const monthLabels: { label: string; col: number }[] = [];
  let lastMonth = -1;
  weeks.forEach((week, wi) => {
    const m = new Date(week[0].date + 'T00:00:00').getMonth();
    if (m !== lastMonth) {
      monthLabels.push({ label: new Date(week[0].date + 'T00:00:00').toLocaleString('default', { month: 'short' }), col: wi });
      lastMonth = m;
    }
  });

  const intensityClass = (count: number) => {
    if (count === 0) return 'contrib-cell--0';
    if (count <= 1)  return 'contrib-cell--1';
    if (count <= 3)  return 'contrib-cell--2';
    if (count <= 6)  return 'contrib-cell--3';
    return 'contrib-cell--4';
  };

  const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="contrib-graph">
      {/* Month labels */}
      <div className="contrib-months">
        <div className="contrib-day-labels-spacer" />
        <div className="contrib-months__inner">
          {monthLabels.map((ml, i) => (
            <span key={i} className="contrib-month-label" style={{ gridColumnStart: ml.col + 1 }}>
              {ml.label}
            </span>
          ))}
        </div>
      </div>

      <div className="contrib-body">
        {/* Day labels */}
        <div className="contrib-day-labels">
          {DAYS.map((d, i) => (
            <span key={d} className="contrib-day-label" style={{ gridRowStart: i + 1 }}>
              {i % 2 !== 0 ? d : ''}
            </span>
          ))}
        </div>

        {/* Grid */}
        <div className="contrib-grid">
          {weeks.map((week, wi) => (
            <div key={wi} className="contrib-week">
              {week.map((cell, di) => {
                const isFuture = cell.date > today;
                return (
                  <div
                    key={di}
                    className={`contrib-cell ${isFuture ? 'contrib-cell--future' : intensityClass(cell.count)}`}
                    onMouseEnter={e => {
                      const rect = (e.target as HTMLElement).getBoundingClientRect();
                      setTooltip({ date: cell.date, count: cell.count, x: rect.left, y: rect.top });
                    }}
                    onMouseLeave={() => setTooltip(null)}
                    aria-label={`${cell.date}: ${cell.count} activities`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div className="contrib-tooltip" style={{ top: tooltip.y - 48, left: tooltip.x - 40 }}>
          <strong>{tooltip.count} {tooltip.count === 1 ? 'activity' : 'activities'}</strong>
          <span>{new Date(tooltip.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
        </div>
      )}

      {/* Legend */}
      <div className="contrib-legend">
        <span className="contrib-legend__label">Less</span>
        {[0, 1, 2, 3, 4].map(l => <div key={l} className={`contrib-cell contrib-cell--${l}`} />)}
        <span className="contrib-legend__label">More</span>
      </div>
    </div>
  );
};

// ── Profile page ──────────────────────────────────────────────────────────────
const Profile = () => {
  const { user } = useAuth();
  const [activityData, setActivityData] = useState<{
    activityMap: Record<string, number>;
    total: number; currentStreak: number; longestStreak: number; today: string;
  } | null>(null);
  const [completedCount, setCompletedCount] = useState(0);
  const [totalModules, setTotalModules] = useState(0);
  const [loadingActivity, setLoadingActivity] = useState(true);

  useEffect(() => {
    // Calculate today using browser LOCAL time
    const now = new Date();
    const localToday = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;

    activityAPI.getStreak()
      .then(r => {
        setActivityData({ ...r.data, today: localToday });
      })
      .catch(() => {})
      .finally(() => setLoadingActivity(false));

    Promise.all([
      learningAPI.getModules('caching'),
      learningAPI.getProgress('caching'),
    ]).then(([modRes, progRes]) => {
      setTotalModules(modRes.data.modules.length);
      setCompletedCount(progRes.data.completedModuleIds.length);
    }).catch(() => {});
  }, []);

  const joinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : '—';

  const initials = user?.username?.slice(0, 2).toUpperCase() ?? '??';

  return (
    <div className="learn-root">
      <LearningNav />
      <main className="profile-page">
        <header className="profile-page__header">
          <h1 className="profile-page__title">Profile</h1>
          <p className="profile-page__subtitle">Your learning progress and activity</p>
        </header>

        {/* User card */}
        <div className="profile-card">
          <div className="profile-avatar">{initials}</div>
          <div className="profile-fields">
            <div className="profile-field">
              <span className="profile-field__label">Username</span>
              <span className="profile-field__value">{user?.username ?? '—'}</span>
            </div>
            <div className="profile-field">
              <span className="profile-field__label">Email</span>
              <span className="profile-field__value">{user?.email ?? '—'}</span>
            </div>
            <div className="profile-field">
              <span className="profile-field__label">Member since</span>
              <span className="profile-field__value">{joinDate}</span>
            </div>
          </div>
        </div>

        {/* Streak stats */}
        <div className="profile-stats">
          <div className="profile-stat">
            <span className="profile-stat__value profile-stat__value--purple">
              {activityData?.currentStreak ?? 0}
            </span>
            <span className="profile-stat__label">Day Streak 🔥</span>
          </div>
          <div className="profile-stat">
            <span className="profile-stat__value profile-stat__value--purple">
              {activityData?.longestStreak ?? 0}
            </span>
            <span className="profile-stat__label">Longest Streak</span>
          </div>
          <div className="profile-stat">
            <span className="profile-stat__value profile-stat__value--purple">
              {activityData?.total ?? 0}
            </span>
            <span className="profile-stat__label">Total Activities</span>
          </div>
          <div className="profile-stat">
            <span className="profile-stat__value profile-stat__value--purple">
              {completedCount}/{totalModules}
            </span>
            <span className="profile-stat__label">Modules Completed</span>
          </div>
        </div>

        {/* Contribution graph */}
        <div className="profile-contrib-section">
          <div className="profile-section-header">
            <h2 className="profile-section-title">Learning Activity</h2>
            {activityData && (
              <span className="profile-activity-count">
                {activityData.total} activities in the last year
              </span>
            )}
          </div>

          {loadingActivity ? (
            <div className="profile-contrib-placeholder">
              <div className="rag-spinner" style={{ width: 28, height: 28 }} />
            </div>
          ) : activityData ? (
            <ContribGraph activityMap={activityData.activityMap} today={activityData.today} />
          ) : (
            <div className="profile-contrib-placeholder">
              <p style={{ color: 'var(--l-text-sec)' }}>No activity data available.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Profile;
