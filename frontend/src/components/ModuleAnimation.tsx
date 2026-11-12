import React, { useState, useEffect } from 'react';
import { type AnimationStep } from '../services/api';
import './ModuleAnimation.css';

interface Props {
  steps: AnimationStep[];
  animType?: string;
  title?: string;
  topicTitle?: string;
  topic?: string; // 'caching' | 'system-architecture' — used to scope diagram matching
}

// ─────────────────────────────────────────────────────────────────────────────
// SVG SYSTEM COMPONENT ICONS
// ─────────────────────────────────────────────────────────────────────────────

const UserIcon = ({ active }: { active?: boolean }) => (
  <svg width="44" height="52" viewBox="0 0 44 52" fill="none">
    <circle cx="22" cy="14" r="10" fill={active ? '#7C5CFC' : '#EEE9FF'} stroke={active ? '#7C5CFC' : '#C4B5FD'} strokeWidth="2"/>
    <path d="M4 46c0-9.941 8.059-18 18-18s18 8.059 18 18" fill={active ? '#EEE9FF' : '#F5F3FF'} stroke={active ? '#7C5CFC' : '#C4B5FD'} strokeWidth="2" strokeLinecap="round"/>
    {active && <circle cx="22" cy="14" r="5" fill="white" opacity="0.6"/>}
  </svg>
);

const ServerIcon = ({ active, color }: { active?: boolean; color?: string }) => {
  const c = color || (active ? '#7C5CFC' : '#A78BFA');
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <rect x="4" y="8"  width="40" height="10" rx="3" fill={active ? '#7C5CFC' : '#EEE9FF'} stroke={c} strokeWidth="1.5"/>
      <rect x="4" y="22" width="40" height="10" rx="3" fill={active ? '#EEE9FF' : '#F5F3FF'} stroke={c} strokeWidth="1.5"/>
      <rect x="4" y="36" width="40" height="10" rx="3" fill={active ? '#EEE9FF' : '#F5F3FF'} stroke={c} strokeWidth="1.5"/>
      <circle cx="36" cy="13" r="2" fill={active ? 'white' : c}/>
      <circle cx="36" cy="27" r="2" fill={c} opacity="0.5"/>
      <circle cx="36" cy="41" r="2" fill={c} opacity="0.3"/>
    </svg>
  );
};

const CacheIcon = ({ active }: { active?: boolean }) => (
  <svg width="48" height="52" viewBox="0 0 48 52" fill="none">
    <ellipse cx="24" cy="10" rx="20" ry="7" fill={active ? '#7C5CFC' : '#EEE9FF'} stroke={active ? '#7C5CFC' : '#C4B5FD'} strokeWidth="2"/>
    <rect x="4" y="10" width="40" height="30" fill={active ? '#EEE9FF' : '#F9F8FF'} stroke={active ? '#7C5CFC' : '#C4B5FD'} strokeWidth="2"/>
    <ellipse cx="24" cy="40" rx="20" ry="7" fill={active ? '#EEE9FF' : '#F5F3FF'} stroke={active ? '#7C5CFC' : '#C4B5FD'} strokeWidth="2"/>
    {active && (
      <>
        <line x1="14" y1="22" x2="34" y2="22" stroke="#7C5CFC" strokeWidth="2" strokeLinecap="round"/>
        <line x1="14" y1="28" x2="28" y2="28" stroke="#7C5CFC" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
      </>
    )}
  </svg>
);

const DatabaseIcon = ({ active }: { active?: boolean }) => (
  <svg width="44" height="52" viewBox="0 0 44 52" fill="none">
    <ellipse cx="22" cy="10" rx="18" ry="6" fill={active ? '#22c55e' : '#dcfce7'} stroke={active ? '#16a34a' : '#86efac'} strokeWidth="2"/>
    <rect x="4" y="10" width="36" height="30" fill={active ? '#f0fdf4' : '#f9fffe'} stroke={active ? '#16a34a' : '#86efac'} strokeWidth="2"/>
    <ellipse cx="22" cy="40" rx="18" ry="6" fill={active ? '#dcfce7' : '#f0fff4'} stroke={active ? '#16a34a' : '#86efac'} strokeWidth="2"/>
    <ellipse cx="22" cy="22" rx="18" ry="6" fill="none" stroke={active ? '#16a34a' : '#86efac'} strokeWidth="1.5" strokeDasharray="3 2"/>
  </svg>
);

const RedisIcon = ({ active }: { active?: boolean }) => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
    <rect x="4" y="4" width="40" height="40" rx="8" fill={active ? '#DC2626' : '#FEE2E2'} stroke={active ? '#DC2626' : '#FCA5A5'} strokeWidth="2"/>
    <text x="24" y="28" textAnchor="middle" fontSize="18" fontWeight="bold" fill="white">R</text>
    {active && <rect x="4" y="4" width="40" height="40" rx="8" fill="none" stroke="white" strokeWidth="1.5" opacity="0.3"/>}
  </svg>
);

const NetworkIcon = ({ active }: { active?: boolean }) => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
    <circle cx="24" cy="24" r="18" fill={active ? '#EEE9FF' : '#F5F3FF'} stroke={active ? '#7C5CFC' : '#C4B5FD'} strokeWidth="2"/>
    <line x1="6"  y1="24" x2="42" y2="24" stroke={active ? '#7C5CFC' : '#C4B5FD'} strokeWidth="1.5"/>
    <ellipse cx="24" cy="24" rx="9"  ry="18" fill="none" stroke={active ? '#7C5CFC' : '#C4B5FD'} strokeWidth="1.5"/>
    <ellipse cx="24" cy="24" rx="18" ry="9"  fill="none" stroke={active ? '#7C5CFC' : '#C4B5FD'} strokeWidth="1.5"/>
    {active && <circle cx="24" cy="24" r="3" fill="#7C5CFC"/>}
  </svg>
);

const LockIcon = ({ active }: { active?: boolean }) => (
  <svg width="40" height="48" viewBox="0 0 40 48" fill="none">
    <rect x="4" y="20" width="32" height="24" rx="4" fill={active ? '#7C5CFC' : '#EEE9FF'} stroke={active ? '#7C5CFC' : '#C4B5FD'} strokeWidth="2"/>
    <path d="M10 20V14a10 10 0 0120 0v6" fill="none" stroke={active ? '#7C5CFC' : '#C4B5FD'} strokeWidth="2.5" strokeLinecap="round"/>
    <circle cx="20" cy="32" r="4" fill={active ? 'white' : '#C4B5FD'}/>
    {active && <line x1="20" y1="36" x2="20" y2="40" stroke="white" strokeWidth="2" strokeLinecap="round"/>}
  </svg>
);

const WarningIcon = ({ active }: { active?: boolean }) => (
  <svg width="48" height="44" viewBox="0 0 48 44" fill="none">
    <path d="M24 4L44 40H4L24 4z" fill={active ? '#DC2626' : '#FEE2E2'} stroke={active ? '#DC2626' : '#FCA5A5'} strokeWidth="2" strokeLinejoin="round"/>
    <line x1="24" y1="18" x2="24" y2="28" stroke={active ? 'white' : '#DC2626'} strokeWidth="3" strokeLinecap="round"/>
    <circle cx="24" cy="34" r="2" fill={active ? 'white' : '#DC2626'}/>
  </svg>
);

const BloomIcon = ({ active }: { active?: boolean }) => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
    <circle cx="24" cy="24" r="20" fill={active ? '#EEE9FF' : '#F5F3FF'} stroke={active ? '#7C5CFC' : '#C4B5FD'} strokeWidth="2"/>
    {[0,60,120,180,240,300].map((angle, i) => {
      const rad = (angle * Math.PI) / 180;
      const x = 24 + 12 * Math.cos(rad);
      const y = 24 + 12 * Math.sin(rad);
      return <circle key={i} cx={x} cy={y} r="3" fill={active ? '#7C5CFC' : '#C4B5FD'}/>;
    })}
    <circle cx="24" cy="24" r="4" fill={active ? '#7C5CFC' : '#A78BFA'}/>
  </svg>
);

// ─────────────────────────────────────────────────────────────────────────────
// ARROW SVG
// ─────────────────────────────────────────────────────────────────────────────
const Arrow = ({ active, label, reverse }: { active: boolean; label?: string; reverse?: boolean }) => (
  <div className="arch-arrow">
    <svg width="60" height="30" viewBox="0 0 60 30" fill="none" className={`arch-arrow__svg${active ? ' arch-arrow__svg--active' : ''}`}>
      {reverse ? (
        <>
          <line x1="58" y1="15" x2="4"  y2="15" stroke={active ? '#7C5CFC' : '#E5E0EF'} strokeWidth="2" strokeDasharray={active ? 'none' : '4 2'}/>
          <polygon points="4,15 12,10 12,20" fill={active ? '#7C5CFC' : '#E5E0EF'}/>
        </>
      ) : (
        <>
          <line x1="2"  y1="15" x2="56" y2="15" stroke={active ? '#7C5CFC' : '#E5E0EF'} strokeWidth="2" strokeDasharray={active ? 'none' : '4 2'}/>
          <polygon points="56,15 48,10 48,20" fill={active ? '#7C5CFC' : '#E5E0EF'}/>
        </>
      )}
    </svg>
    {label && <span className={`arch-arrow__label${active ? ' arch-arrow__label--active' : ''}`}>{label}</span>}
  </div>
);

const VertArrow = ({ active, label }: { active: boolean; label?: string }) => (
  <div className="arch-varrow">
    <svg width="30" height="40" viewBox="0 0 30 40" fill="none">
      <line x1="15" y1="2" x2="15" y2="36" stroke={active ? '#7C5CFC' : '#E5E0EF'} strokeWidth="2" strokeDasharray={active ? 'none' : '4 2'}/>
      <polygon points="15,38 10,30 20,30" fill={active ? '#7C5CFC' : '#E5E0EF'}/>
    </svg>
    {label && <span className={`arch-arrow__label${active ? ' arch-arrow__label--active' : ''}`}>{label}</span>}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// ARCHITECTURE NODE
// ─────────────────────────────────────────────────────────────────────────────
const ArchNode = ({
  icon, label, sublabel, active, onClick, danger,
}: {
  icon: React.ReactNode; label: string; sublabel?: string;
  active?: boolean; onClick?: () => void; danger?: boolean;
}) => (
  <div
    className={`arch-node${active ? ' arch-node--active' : ''}${danger ? ' arch-node--danger' : ''}`}
    onClick={onClick}
    role={onClick ? 'button' : undefined}
    tabIndex={onClick ? 0 : undefined}
    onKeyDown={onClick ? (e) => (e.key === 'Enter' || e.key === ' ') && onClick() : undefined}
  >
    <div className="arch-node__icon">{icon}</div>
    <div className="arch-node__label">{label}</div>
    {sublabel && <div className="arch-node__sublabel">{sublabel}</div>}
    {active && <div className="arch-node__pulse" />}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// STEP NAV - prev / dot indicators / next - used at the bottom of every diagram
// ─────────────────────────────────────────────────────────────────────────────
const StepNav = ({
  activeIdx, total, setActiveIdx,
}: {
  activeIdx: number; total: number; setActiveIdx: (i: number) => void;
}) => (
  <div className="arch-step-nav">
    <button
      className="arch-step-nav__btn"
      onClick={() => setActiveIdx(activeIdx - 1)}
      disabled={activeIdx === 0}
      aria-label="Previous step"
    >
      &#8592; Prev
    </button>
    <div className="arch-step-nav__dots">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          className={`arch-step-nav__dot${i === activeIdx ? ' arch-step-nav__dot--active' : ''}`}
          onClick={() => setActiveIdx(i)}
          aria-label={`Step ${i + 1}`}
        />
      ))}
    </div>
    <button
      className="arch-step-nav__btn"
      onClick={() => setActiveIdx(activeIdx + 1)}
      disabled={activeIdx === total - 1}
      aria-label="Next step"
    >
      Next &#8594;
    </button>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// DIAGRAM 1 - Cache Basics
// ─────────────────────────────────────────────────────────────────────────────
const TOTAL_BASICS = 5;
const CacheBasicsDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => (
  <div className="arch-diagram">
    <div className="arch-row arch-row--center">
      <ArchNode icon={<UserIcon   active={activeIdx === 0} />} label="User"       sublabel="Makes request"      active={activeIdx === 0} onClick={() => setActiveIdx(0)} />
      <Arrow active={activeIdx >= 1} label="request" />
      <ArchNode icon={<ServerIcon active={activeIdx === 1} />} label="App Server" sublabel="Checks cache first" active={activeIdx === 1} onClick={() => setActiveIdx(1)} />
      <Arrow active={activeIdx >= 2} label="lookup" />
      <ArchNode icon={<CacheIcon  active={activeIdx === 2} />} label="Cache"      sublabel="Redis / Memcached"  active={activeIdx === 2} onClick={() => setActiveIdx(2)} />
      <Arrow active={activeIdx >= 3} label="miss" />
      <ArchNode icon={<DatabaseIcon active={activeIdx === 3} />} label="Database" sublabel="Source of truth"   active={activeIdx === 3} onClick={() => setActiveIdx(3)} />
    </div>
    <div className="arch-return-row">
      <Arrow active={activeIdx >= 4} label="store result" />
      <span className="arch-return-label">response flows back to user</span>
    </div>
    <div className="arch-step-info">
      <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_BASICS}</span>
      <span className="arch-step-desc">{[
        'User makes a request to the application',
        'App checks the cache before touching the database',
        'Cache returns data instantly on a hit (< 1ms)',
        'Cache miss - app queries the database',
        'Result stored in cache, returned to user',
      ][activeIdx]}</span>
    </div>
    <StepNav activeIdx={activeIdx} total={TOTAL_BASICS} setActiveIdx={setActiveIdx} />
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// DIAGRAM 2 - Cache Architecture
// ─────────────────────────────────────────────────────────────────────────────
const TOTAL_ARCH = 3;
const CacheArchDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const layers = [
    { label: 'L1: In-Process', sub: 'HashMap in memory',    icon: <ServerIcon   active={activeIdx === 0} />, ns: '< 1µs' },
    { label: 'L2: Redis',      sub: 'Distributed cache',    icon: <CacheIcon    active={activeIdx === 1} />, ns: '< 1ms' },
    { label: 'L3: Database',   sub: 'PostgreSQL / MySQL',   icon: <DatabaseIcon active={activeIdx === 2} />, ns: '5-50ms' },
  ];
  const descs = [
    'L1 is in-process app memory - fastest (nanoseconds), not shared across servers',
    'L2 is a shared Redis cluster - fast (sub-ms), shared across all app instances',
    'L3 is the database - slowest but always the source of truth',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-col arch-col--center">
        <ArchNode icon={<UserIcon active={false} />} label="Request" sublabel="from user" />
        <VertArrow active label="1. check" />
        {layers.map((layer, i) => (
          <React.Fragment key={i}>
            <div className={`arch-layer${activeIdx === i ? ' arch-layer--active' : ''}`} onClick={() => setActiveIdx(i)}>
              <div className="arch-layer__icon">{layer.icon}</div>
              <div className="arch-layer__info">
                <span className="arch-layer__label">{layer.label}</span>
                <span className="arch-layer__sub">{layer.sub}</span>
              </div>
              <div className="arch-layer__latency">{layer.ns}</div>
            </div>
            {i < layers.length - 1 && <VertArrow active={activeIdx > i} label={`${i + 2}. miss - check next`} />}
          </React.Fragment>
        ))}
      </div>
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_ARCH}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_ARCH} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// DIAGRAM 3 - Cache-Aside
// ─────────────────────────────────────────────────────────────────────────────
const TOTAL_ASIDE = 6;
const CacheAsideDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const isWrite = activeIdx >= 3;
  const descs = [
    'Read path: App checks cache first',
    'Cache miss - query DB for data',
    'Store result in cache with TTL',
    'Write path: Write to DB first - always',
    'Then invalidate the cache key',
    'Next read will fetch fresh data from DB',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-two-path">
        <div className={`arch-path${!isWrite ? ' arch-path--active' : ''}`}>
          <div className="arch-path__label arch-path__label--read">READ PATH</div>
          <div className="arch-row arch-row--col">
            <ArchNode icon={<ServerIcon   active={activeIdx === 0} />} label="App"   sublabel="Check cache" active={activeIdx === 0} onClick={() => setActiveIdx(0)} />
            <VertArrow active={activeIdx >= 1} label="miss" />
            <ArchNode icon={<CacheIcon    active={activeIdx === 1} />} label="Cache" sublabel="MISS"        active={activeIdx === 1} onClick={() => setActiveIdx(1)} />
            <VertArrow active={activeIdx >= 2} label="fetch" />
            <ArchNode icon={<DatabaseIcon active={activeIdx === 2} />} label="DB"    sublabel="Query"       active={activeIdx === 2} onClick={() => setActiveIdx(2)} />
          </div>
        </div>
        <div className="arch-path-divider" />
        <div className={`arch-path${isWrite ? ' arch-path--active' : ''}`}>
          <div className="arch-path__label arch-path__label--write">WRITE PATH</div>
          <div className="arch-row arch-row--col">
            <ArchNode icon={<ServerIcon   active={activeIdx === 3} />} label="App"   sublabel="Write"       active={activeIdx === 3} onClick={() => setActiveIdx(3)} />
            <VertArrow active={activeIdx >= 4} label="1. write first" />
            <ArchNode icon={<DatabaseIcon active={activeIdx === 4} />} label="DB"    sublabel="Updated"     active={activeIdx === 4} onClick={() => setActiveIdx(4)} />
            <VertArrow active={activeIdx >= 5} label="2. invalidate" />
            <ArchNode icon={<LockIcon     active={activeIdx === 5} />} label="Cache" sublabel="Deleted"     active={activeIdx === 5} onClick={() => setActiveIdx(5)} />
          </div>
        </div>
      </div>
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_ASIDE}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_ASIDE} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// DIAGRAM 4 - Read / Write Strategies
// ─────────────────────────────────────────────────────────────────────────────
const TOTAL_RW = 6;
const ReadWriteDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const isWriteBack = activeIdx >= 3;
  const descs = [
    'Write-Through: Write to cache AND DB at the same time',
    'Both cache and DB updated synchronously - always consistent',
    'Slower writes, but no data loss if cache crashes',
    'Write-Back: Write to cache ONLY, return immediately',
    'DB updated asynchronously in background later',
    'Faster writes, but risk of data loss if cache crashes before flush',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-two-path">
        <div className={`arch-path${!isWriteBack ? ' arch-path--active' : ''}`}>
          <div className="arch-path__label arch-path__label--read">WRITE-THROUGH</div>
          <div className="arch-row arch-row--col">
            <ArchNode icon={<UserIcon     active={activeIdx === 0} />} label="Write" sublabel="User update"   active={activeIdx === 0} onClick={() => setActiveIdx(0)} />
            <VertArrow active={activeIdx >= 1} label="sync write" />
            <ArchNode icon={<CacheIcon    active={activeIdx === 1} />} label="Cache" sublabel="Updated first" active={activeIdx === 1} onClick={() => setActiveIdx(1)} />
            <VertArrow active={activeIdx >= 2} label="sync write" />
            <ArchNode icon={<DatabaseIcon active={activeIdx === 2} />} label="DB"    sublabel="Also updated"  active={activeIdx === 2} onClick={() => setActiveIdx(2)} />
          </div>
        </div>
        <div className="arch-path-divider" />
        <div className={`arch-path${isWriteBack ? ' arch-path--active' : ''}`}>
          <div className="arch-path__label arch-path__label--write">WRITE-BACK</div>
          <div className="arch-row arch-row--col">
            <ArchNode icon={<UserIcon     active={activeIdx === 3} />} label="Write" sublabel="User update"     active={activeIdx === 3} onClick={() => setActiveIdx(3)} />
            <VertArrow active={activeIdx >= 4} label="write cache only" />
            <ArchNode icon={<CacheIcon    active={activeIdx === 4} />} label="Cache" sublabel="Written, ack sent" active={activeIdx === 4} onClick={() => setActiveIdx(4)} />
            <VertArrow active={activeIdx >= 5} label="async later" />
            <ArchNode icon={<DatabaseIcon active={activeIdx === 5} />} label="DB"    sublabel="Updated async"    active={activeIdx === 5} danger={activeIdx === 5} onClick={() => setActiveIdx(5)} />
          </div>
        </div>
      </div>
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_RW}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_RW} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// DIAGRAM 5 - Eviction
// ─────────────────────────────────────────────────────────────────────────────
const TOTAL_EVICT = 5;
const EvictionDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const slots = ['A', 'B', 'C', 'D', 'E'];
  const descs = [
    'Cache is full - 5 slots occupied, no space for new entry',
    'LRU identifies slot A as least recently used - evict it',
    'Slot A removed from cache, space freed',
    'New entry inserted into the freed slot',
    'TTL timers run independently - expired entries also removed',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-eviction">
        <div className="arch-eviction__label">Cache Memory Slots</div>
        <div className="arch-eviction__slots">
          {slots.map((s, i) => (
            <div key={s} className={`arch-eviction__slot
              ${i === 0 && activeIdx === 1 ? ' arch-eviction__slot--victim' : ''}
              ${i === 0 && activeIdx >= 2 ? ' arch-eviction__slot--empty'  : ''}
              ${i === 0 && activeIdx >= 3 ? ' arch-eviction__slot--new'    : ''}
              ${activeIdx === 0           ? ' arch-eviction__slot--full'   : ''}
            `}>
              {i === 0 && activeIdx >= 3 ? 'NEW' : i === 0 && activeIdx >= 2 ? '-' : s}
              {i === 0 && activeIdx === 1 && <span className="arch-eviction__evict-badge">LRU x</span>}
              {i === 0 && activeIdx >= 3  && <div className="arch-eviction__new-pulse" />}
            </div>
          ))}
        </div>
        <div className="arch-eviction__ttl-row">
          <ArchNode icon={<CacheIcon active={activeIdx === 4} />} label="TTL Timer" sublabel="Runs independently" active={activeIdx === 4} onClick={() => setActiveIdx(4)} />
          <Arrow active={activeIdx >= 4} label="expire" />
          <ArchNode icon={<DatabaseIcon active={false} />} label="DB Fetch" sublabel="On miss" />
        </div>
      </div>
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_EVICT}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_EVICT} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// DIAGRAM 6 - Invalidation
// ─────────────────────────────────────────────────────────────────────────────
const TOTAL_INVAL = 5;
const InvalidationDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'App writes updated data to the database',
    'DB fires an update event (via CDC or app logic)',
    'Cache key invalidated - old data removed',
    'Next read is a cache miss - fresh data fetched from DB',
    'Fresh data stored back in cache with new TTL',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-row arch-row--center">
        <ArchNode icon={<ServerIcon   active={activeIdx === 0} />} label="App Server" sublabel="Write operation"    active={activeIdx === 0} onClick={() => setActiveIdx(0)} />
        <Arrow active={activeIdx >= 1} label="1. write" />
        <ArchNode icon={<DatabaseIcon active={activeIdx === 1} />} label="Database"   sublabel="Updated"            active={activeIdx === 1} onClick={() => setActiveIdx(1)} />
      </div>
      <div className="arch-event-row">
        <Arrow active={activeIdx >= 2} label="2. event" />
        <ArchNode icon={<NetworkIcon  active={activeIdx === 2} />} label="Event Bus"  sublabel="Invalidation event" active={activeIdx === 2} onClick={() => setActiveIdx(2)} />
        <Arrow active={activeIdx >= 3} label="3. delete key" />
        <ArchNode icon={<LockIcon     active={activeIdx === 3} />} label="Cache"      sublabel="Key deleted"        active={activeIdx === 3} onClick={() => setActiveIdx(3)} />
      </div>
      <div className="arch-row arch-row--center" style={{ marginTop: '0.5rem' }}>
        <ArchNode icon={<UserIcon     active={activeIdx === 4} />} label="Next Read"  sublabel="Cache miss -> DB"   active={activeIdx === 4} onClick={() => setActiveIdx(4)} />
        <Arrow active={activeIdx >= 4} label="4. fetch fresh" />
        <ArchNode icon={<CacheIcon    active={activeIdx >= 4} />}  label="Cache"      sublabel="Repopulated"        active={activeIdx >= 4} />
      </div>
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_INVAL}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_INVAL} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// DIAGRAM 7 - Redis
// ─────────────────────────────────────────────────────────────────────────────
const TOTAL_REDIS = 5;
const RedisDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'App sends GET or SET command to Redis over TCP',
    'Redis looks up the key in its in-memory hash table',
    'Data found - returned in sub-millisecond',
    'On write: Redis AOF logs every command for persistence',
    'Redis stores data in RAM - eviction policy controls memory',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-redis-layout">
        <div className="arch-redis__apps">
          {['App 1', 'App 2', 'App 3'].map((a) => (
            <ArchNode key={a} icon={<ServerIcon active={activeIdx === 0} color="#7C5CFC" />} label={a} sublabel="Client" active={activeIdx === 0} onClick={() => setActiveIdx(0)} />
          ))}
        </div>
        <div className="arch-redis__arrows">
          {[0, 1, 2].map(i => <Arrow key={i} active={activeIdx >= 1} label="TCP cmd" />)}
        </div>
        <div className="arch-redis__core">
          <ArchNode icon={<RedisIcon active={activeIdx >= 1} />} label="Redis" sublabel="In-memory store" active={activeIdx >= 1} onClick={() => setActiveIdx(1)} />
          <div className="arch-redis__sub">
            <div className={`arch-redis__module${activeIdx === 3 ? ' arch-redis__module--active' : ''}`} onClick={() => setActiveIdx(3)}>
              AOF Persistence
            </div>
            <div className={`arch-redis__module${activeIdx === 4 ? ' arch-redis__module--active' : ''}`} onClick={() => setActiveIdx(4)}>
              Eviction Policy
            </div>
          </div>
        </div>
      </div>
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_REDIS}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_REDIS} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// DIAGRAM 8 - Distributed Cache
// ─────────────────────────────────────────────────────────────────────────────
const TOTAL_DIST = 5;
const DistributedDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const nodes = ['Slots 0-5460', 'Slots 5461-10922', 'Slots 10923-16383'];
  const descs = [
    'Client sends key - consistent hash maps it to a slot',
    'Hash slot determines which node owns the key',
    'Node 2 holds this slot - client queries it directly',
    'Primary fails - replica takes over automatically in <30s',
    'New node added - only 1/N keys remapped (minimal disruption)',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-cluster">
        <div className="arch-cluster__client">
          <ArchNode icon={<UserIcon active={activeIdx === 0} />} label="Client" sublabel={activeIdx === 1 ? 'slot 7638' : 'CRC16 hash'} active={activeIdx === 0} onClick={() => setActiveIdx(0)} />
        </div>
        <Arrow active={activeIdx >= 1} label={activeIdx === 1 ? 'slot 7638 -> Node 2' : 'hash'} />
        <div className="arch-cluster__nodes">
          {nodes.map((n, i) => (
            <ArchNode key={i}
              icon={<CacheIcon active={activeIdx - 1 === i} />}
              label={`Node ${i + 1}`}
              sublabel={n}
              active={activeIdx - 1 === i}
              danger={activeIdx === 3 && i === 0}
              onClick={() => setActiveIdx(i + 1)}
            />
          ))}
        </div>
      </div>
      {activeIdx === 3 && (
        <div className="arch-danger-banner">Node 1 failed - Replica promoted to primary</div>
      )}
      {activeIdx === 4 && (
        <div className="arch-failover-banner">New node added - only ~1/N keys remapped</div>
      )}
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_DIST}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_DIST} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// DIAGRAM 9 - Stampede / Penetration / Avalanche
// ─────────────────────────────────────────────────────────────────────────────
const TOTAL_STAMP = 5;
const StampedeDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'Popular cache key expires - everyone misses simultaneously',
    'Thousands of requests all query the DB at once',
    'Database overwhelmed - CPU 100%, response degraded',
    'Mutex lock: only ONE request rebuilds, others wait',
    'Cache repopulated - all waiting requests served',
  ];
  const isDanger = activeIdx >= 1 && activeIdx <= 2;
  return (
    <div className="arch-diagram">
      <div className="arch-stampede">
        <div className="arch-stampede__users">
          {['User 1', 'User 2', '...', 'User N'].map((u) => (
            <div key={u} className={`arch-stampede__user${activeIdx >= 1 ? ' arch-stampede__user--flood' : ''}`}>
              <UserIcon active={activeIdx >= 1} />
              <span>{u}</span>
            </div>
          ))}
        </div>
        <Arrow active={activeIdx >= 1} label={activeIdx >= 1 ? 'all miss!' : 'requests'} />
        <div className="arch-stampede__center">
          <ArchNode icon={<CacheIcon active={activeIdx === 0} />}
            label="Cache"
            sublabel={activeIdx === 0 ? 'Key expires' : activeIdx >= 4 ? 'Repopulated' : 'EMPTY'}
            active={activeIdx === 0 || activeIdx >= 4}
            danger={activeIdx >= 1 && activeIdx <= 2}
          />
          {activeIdx >= 3 && (
            <>
              <VertArrow active label="mutex lock" />
              <ArchNode icon={<LockIcon active />} label="Mutex" sublabel="One rebuilds" active />
            </>
          )}
        </div>
        {isDanger && <Arrow active label="flood" />}
        {isDanger && <ArchNode icon={<DatabaseIcon active={isDanger} />} label="Database" sublabel="Overwhelmed" active danger />}
      </div>
      {isDanger && <div className="arch-danger-banner">Database CPU at 100% - stampede in progress</div>}
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_STAMP}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_STAMP} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// DIAGRAM 10 - Consistency
// ─────────────────────────────────────────────────────────────────────────────
const TOTAL_CONSIST = 5;
const ConsistencyDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'App writes new data to the database',
    'Cache still holds old stale value',
    'Other users read stale data from cache',
    'TTL expires - cache entry removed',
    'Fresh data fetched - all users see consistent data',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-row arch-row--center">
        <ArchNode icon={<ServerIcon   active={activeIdx === 0} />} label="App"      sublabel="Writes update"  active={activeIdx === 0} onClick={() => setActiveIdx(0)} />
        <Arrow active={activeIdx >= 0} label="write" />
        <ArchNode icon={<DatabaseIcon active={activeIdx >= 0} />}  label="Database" sublabel="Updated"        active={activeIdx >= 0} onClick={() => setActiveIdx(1)} />
      </div>
      <div className="arch-row arch-row--center" style={{ marginTop: '1rem' }}>
        <ArchNode icon={<UserIcon active={activeIdx === 2} />}
          label="Users"
          sublabel={activeIdx >= 2 && activeIdx <= 3 ? 'Stale data' : activeIdx >= 4 ? 'Fresh data' : 'Reading...'}
          active={activeIdx >= 2}
          danger={activeIdx === 2}
          onClick={() => setActiveIdx(2)}
        />
        <Arrow active={activeIdx >= 2} label="read" />
        <ArchNode icon={<CacheIcon active={activeIdx >= 1} />}
          label="Cache"
          sublabel={activeIdx <= 2 ? 'STALE' : activeIdx === 3 ? 'TTL expired' : 'Fresh'}
          active={activeIdx >= 1}
          danger={activeIdx === 2}
          onClick={() => setActiveIdx(3)}
        />
      </div>
      {activeIdx === 2 && <div className="arch-danger-banner">Cache and DB are out of sync - stale data period</div>}
      {activeIdx >= 4  && <div className="arch-failover-banner">Cache and DB are now consistent</div>}
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_CONSIST}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_CONSIST} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// ── SYSTEM ARCHITECTURE DIAGRAMS ─────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────

// SA DIAGRAM 1 - System Fundamentals: full request flow
const TOTAL_SA_FUND = 5;
const SAFundamentalsDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'Client sends request from browser or mobile app',
    'Load Balancer distributes traffic across app servers',
    'App Server processes business logic',
    'Cache layer checked before hitting the database',
    'Database persists and returns the data',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-row arch-row--center">
        <ArchNode icon={<UserIcon active={activeIdx === 0} />}     label="Client"        sublabel="Browser / App"     active={activeIdx === 0} onClick={() => setActiveIdx(0)} />
        <Arrow active={activeIdx >= 1} label="request" />
        <ArchNode icon={<NetworkIcon active={activeIdx === 1} />}  label="Load Balancer" sublabel="Distributes traffic" active={activeIdx === 1} onClick={() => setActiveIdx(1)} />
        <Arrow active={activeIdx >= 2} label="route" />
        <ArchNode icon={<ServerIcon active={activeIdx === 2} />}   label="App Server"    sublabel="Business logic"    active={activeIdx === 2} onClick={() => setActiveIdx(2)} />
      </div>
      <div className="arch-row arch-row--center" style={{ marginTop: '0.75rem' }}>
        <ArchNode icon={<CacheIcon active={activeIdx === 3} />}    label="Cache"         sublabel="Redis / Memcached" active={activeIdx === 3} onClick={() => setActiveIdx(3)} />
        <Arrow active={activeIdx >= 4} label="miss" />
        <ArchNode icon={<DatabaseIcon active={activeIdx === 4} />} label="Database"      sublabel="Source of truth"  active={activeIdx === 4} onClick={() => setActiveIdx(4)} />
      </div>
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_SA_FUND}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_SA_FUND} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// SA DIAGRAM 2 - Architectural Patterns: layered architecture
const TOTAL_SA_PATTERNS = 5;
const SAPatternsDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const layers = [
    { label: 'Presentation Layer',   sub: 'UI - what users see',           latency: 'Browser' },
    { label: 'API Layer',            sub: 'Routes and validates requests',  latency: 'REST / GraphQL' },
    { label: 'Business Logic',       sub: 'Rules and processing',           latency: 'Core' },
    { label: 'Data Access Layer',    sub: 'Queries and persistence',        latency: 'ORM / SQL' },
    { label: 'Database',             sub: 'PostgreSQL / MongoDB',           latency: 'Storage' },
  ];
  const descs = [
    'Presentation layer - handles what users see and interact with',
    'API layer - receives requests, validates input, routes to services',
    'Business logic layer - applies rules, processes data, orchestrates',
    'Data access layer - translates between objects and database queries',
    'Database - persists data, enforces integrity constraints',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-col arch-col--center">
        {layers.map((layer, i) => (
          <React.Fragment key={i}>
            <div
              className={`arch-layer${activeIdx === i ? ' arch-layer--active' : ''}`}
              onClick={() => setActiveIdx(i)}
            >
              <div className="arch-layer__icon">
                {i === 0 && <UserIcon active={activeIdx === i} />}
                {i === 1 && <NetworkIcon active={activeIdx === i} />}
                {i === 2 && <ServerIcon active={activeIdx === i} />}
                {i === 3 && <LockIcon active={activeIdx === i} />}
                {i === 4 && <DatabaseIcon active={activeIdx === i} />}
              </div>
              <div className="arch-layer__info">
                <span className="arch-layer__label">{layer.label}</span>
                <span className="arch-layer__sub">{layer.sub}</span>
              </div>
              <div className="arch-layer__latency">{layer.latency}</div>
            </div>
            {i < layers.length - 1 && <VertArrow active={activeIdx > i} />}
          </React.Fragment>
        ))}
      </div>
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_SA_PATTERNS}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_SA_PATTERNS} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// SA DIAGRAM 3 - Monolith vs Microservices
const TOTAL_SA_MONO = 5;
const SAMonolithDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const isMS = activeIdx >= 3;
  const descs = [
    'Monolith: all features in one single deployable codebase',
    'Monolith grows: harder to deploy, scale, and change safely',
    'Problem: one bug can take down all features simultaneously',
    'Microservices: each service owns one business capability',
    'Independent deploy and scale - teams work without stepping on each other',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-two-path">
        <div className={`arch-path${!isMS ? ' arch-path--active' : ''}`}>
          <div className="arch-path__label arch-path__label--read">MONOLITH</div>
          <div className="arch-row arch-row--col">
            <ArchNode icon={<ServerIcon active={activeIdx === 0} />} label="One Codebase" sublabel="Users + Orders + Payments" active={activeIdx === 0} onClick={() => setActiveIdx(0)} danger={activeIdx === 2} />
            <VertArrow active={activeIdx >= 1} label="grows large" />
            <ArchNode icon={<DatabaseIcon active={activeIdx === 1} />} label="One DB" sublabel="Shared by all features" active={activeIdx === 1} onClick={() => setActiveIdx(1)} />
            {activeIdx === 2 && <div className="arch-danger-banner" style={{ marginTop: '0.5rem' }}>One bug = total outage</div>}
          </div>
        </div>
        <div className="arch-path-divider" />
        <div className={`arch-path${isMS ? ' arch-path--active' : ''}`}>
          <div className="arch-path__label arch-path__label--write">MICROSERVICES</div>
          <div className="arch-row arch-row--col">
            <ArchNode icon={<NetworkIcon active={activeIdx === 3} />} label="API Gateway" sublabel="Single entry point" active={activeIdx === 3} onClick={() => setActiveIdx(3)} />
            <VertArrow active={activeIdx >= 4} label="routes" />
            <div className="arch-row arch-row--center" style={{ gap: '0.4rem' }}>
              <ArchNode icon={<ServerIcon active={activeIdx === 4} />} label="Users" sublabel="Service" active={activeIdx === 4} onClick={() => setActiveIdx(4)} />
              <ArchNode icon={<ServerIcon active={activeIdx === 4} />} label="Orders" sublabel="Service" active={activeIdx === 4} />
              <ArchNode icon={<ServerIcon active={activeIdx === 4} />} label="Pay" sublabel="Service" active={activeIdx === 4} />
            </div>
          </div>
        </div>
      </div>
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_SA_MONO}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_SA_MONO} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// SA DIAGRAM 4 - Components and Communication: API Gateway + Queue
const TOTAL_SA_COMM = 5;
const SACommDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'Client request arrives at the API Gateway',
    'Gateway authenticates the JWT token',
    'Gateway routes to the correct microservice',
    'Service pushes async job to the message queue',
    'Background worker picks up and processes the job',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-row arch-row--center">
        <ArchNode icon={<UserIcon active={activeIdx === 0} />}     label="Client"      sublabel="Request"         active={activeIdx === 0} onClick={() => setActiveIdx(0)} />
        <Arrow active={activeIdx >= 1} label="request" />
        <ArchNode icon={<NetworkIcon active={activeIdx === 1} />}  label="API Gateway" sublabel="Auth + Route"    active={activeIdx === 1} onClick={() => setActiveIdx(1)} />
        <Arrow active={activeIdx >= 2} label="route" />
        <ArchNode icon={<ServerIcon active={activeIdx === 2} />}   label="Service"     sublabel="Business logic"  active={activeIdx === 2} onClick={() => setActiveIdx(2)} />
      </div>
      <div className="arch-event-row" style={{ marginTop: '0.75rem' }}>
        <Arrow active={activeIdx >= 3} label="push job" />
        <ArchNode icon={<CacheIcon active={activeIdx === 3} />}    label="Message Queue" sublabel="RabbitMQ / Kafka" active={activeIdx === 3} onClick={() => setActiveIdx(3)} />
        <Arrow active={activeIdx >= 4} label="consume" />
        <ArchNode icon={<ServerIcon active={activeIdx === 4} color="#22c55e" />} label="Worker" sublabel="Async processing" active={activeIdx === 4} onClick={() => setActiveIdx(4)} />
      </div>
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_SA_COMM}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_SA_COMM} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// SA DIAGRAM 5 - Scalability: load balancer + auto-scale
const TOTAL_SA_SCALE = 5;
const SAScaleDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'Traffic surge arrives - load balancer receives all requests',
    'Requests distributed across existing server pool',
    'Server 1 and Server 2 each handle their share',
    'Load spikes beyond capacity - auto-scaler triggers',
    'New Server 3 added automatically to absorb extra load',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-row arch-row--center">
        <ArchNode icon={<UserIcon active={activeIdx === 0} />}     label="Traffic surge" sublabel="High request volume" active={activeIdx === 0} onClick={() => setActiveIdx(0)} />
        <Arrow active={activeIdx >= 1} label="all requests" />
        <ArchNode icon={<NetworkIcon active={activeIdx === 1} />}  label="Load Balancer" sublabel="Round Robin / LCM"   active={activeIdx === 1} onClick={() => setActiveIdx(1)} />
      </div>
      <div className="arch-row arch-row--center" style={{ marginTop: '0.75rem' }}>
        <ArchNode icon={<ServerIcon active={activeIdx === 2} />}   label="Server 1"  sublabel="Handles share" active={activeIdx === 2} onClick={() => setActiveIdx(2)} />
        <ArchNode icon={<ServerIcon active={activeIdx === 2} />}   label="Server 2"  sublabel="Handles share" active={activeIdx === 2} />
        <ArchNode icon={<ServerIcon active={activeIdx === 4} />}   label="Server 3"  sublabel={activeIdx >= 4 ? 'Auto-added' : 'Standby'}  active={activeIdx === 4} danger={activeIdx === 3} onClick={() => setActiveIdx(4)} />
      </div>
      {activeIdx === 3 && <div className="arch-danger-banner">CPU above 80% - auto-scaler triggered</div>}
      {activeIdx === 4 && <div className="arch-failover-banner">Server 3 added - load distributed</div>}
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_SA_SCALE}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_SA_SCALE} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// SA DIAGRAM 6 - Database Architecture: primary + replicas
const TOTAL_SA_DB = 5;
const SADatabaseDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'All write operations go exclusively to the Primary database',
    'Primary replicates every write to Replica 1 asynchronously',
    'Primary replicates every write to Replica 2 as well',
    'Read operations are distributed across all replicas',
    'Primary fails - Replica 1 is promoted automatically',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-row arch-row--center">
        <ArchNode icon={<ServerIcon active={activeIdx <= 2} />}    label="App Server"  sublabel="Writes + Reads"    active={activeIdx === 0} onClick={() => setActiveIdx(0)} />
        <Arrow active={activeIdx >= 0} label="writes" />
        <ArchNode icon={<DatabaseIcon active={activeIdx <= 2} />}  label="Primary DB"  sublabel="Handles all writes" active={activeIdx <= 2} danger={activeIdx === 4} onClick={() => setActiveIdx(1)} />
      </div>
      <div className="arch-row arch-row--center" style={{ marginTop: '0.75rem' }}>
        <ArchNode icon={<DatabaseIcon active={activeIdx === 3 || activeIdx === 4} />} label="Replica 1" sublabel={activeIdx === 4 ? 'Promoted to Primary' : 'Read traffic'} active={activeIdx === 3 || activeIdx === 4} onClick={() => setActiveIdx(3)} />
        <Arrow active={activeIdx >= 2} label="replicate" reverse />
        <ArchNode icon={<DatabaseIcon active={activeIdx === 3} />} label="Replica 2" sublabel="Read traffic" active={activeIdx === 3} onClick={() => setActiveIdx(3)} />
      </div>
      {activeIdx === 4 && <div className="arch-failover-banner">Primary failed - Replica 1 promoted automatically</div>}
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_SA_DB}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_SA_DB} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// SA DIAGRAM 7 - Distributed Systems: Raft consensus
const TOTAL_SA_DIST = 5;
const SADistributedDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'Leader node receives all write requests from clients',
    'Leader sends the write to all follower nodes',
    'Majority of followers acknowledge the write (quorum)',
    'Leader commits the write and confirms to client',
    'Remaining nodes sync when network allows - eventual consistency',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-row arch-row--center">
        <ArchNode icon={<UserIcon active={activeIdx === 0} />}    label="Client"     sublabel="Write request"      active={activeIdx === 0} onClick={() => setActiveIdx(0)} />
        <Arrow active={activeIdx >= 1} label="write" />
        <ArchNode icon={<ServerIcon active={activeIdx <= 3} />}   label="Leader"     sublabel="Raft leader node"   active={activeIdx <= 3} onClick={() => setActiveIdx(1)} />
        <Arrow active={activeIdx >= 2} label="replicate" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <ArchNode icon={<ServerIcon active={activeIdx >= 2} />} label="Follower 1" sublabel={activeIdx >= 3 ? 'Ack sent' : 'Waiting'} active={activeIdx >= 2} onClick={() => setActiveIdx(2)} />
          <ArchNode icon={<ServerIcon active={activeIdx >= 2} />} label="Follower 2" sublabel={activeIdx >= 3 ? 'Ack sent' : 'Waiting'} active={activeIdx >= 2} />
          <ArchNode icon={<ServerIcon active={activeIdx === 4} />} label="Follower 3" sublabel={activeIdx === 4 ? 'Syncing' : 'Offline'} active={activeIdx === 4} />
        </div>
      </div>
      {activeIdx === 3 && <div className="arch-failover-banner">Quorum reached - write committed</div>}
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_SA_DIST}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_SA_DIST} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// SA DIAGRAM 8 - Fault Tolerance: circuit breaker + failover
const TOTAL_SA_FAULT = 5;
const SAFaultDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'Primary server becomes unresponsive',
    'Load balancer health check detects failure within seconds',
    'All traffic rerouted to healthy servers immediately',
    'Circuit breaker opens - stops calls to failed dependency',
    'Failed server recovers and rejoins the pool',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-row arch-row--center">
        <ArchNode icon={<NetworkIcon active={activeIdx >= 1} />}  label="Load Balancer"  sublabel="Health checks"     active={activeIdx >= 1} onClick={() => setActiveIdx(1)} />
        <Arrow active={activeIdx >= 2} label="reroute" />
        <ArchNode icon={<ServerIcon active={activeIdx >= 2} />}   label="Healthy Server" sublabel="Still running"     active={activeIdx >= 2} onClick={() => setActiveIdx(2)} />
      </div>
      <div className="arch-event-row" style={{ marginTop: '0.75rem' }}>
        <ArchNode icon={<ServerIcon active={activeIdx === 0} />}  label="Server"         sublabel={activeIdx === 0 ? 'Failing' : activeIdx === 4 ? 'Recovered' : 'Down'} active={activeIdx === 0 || activeIdx === 4} danger={activeIdx >= 0 && activeIdx <= 3} onClick={() => setActiveIdx(0)} />
        <Arrow active={activeIdx >= 3} label="circuit open" />
        <ArchNode icon={<LockIcon active={activeIdx >= 3} />}     label="Circuit Breaker" sublabel={activeIdx >= 3 ? 'OPEN - blocking' : 'Closed'} active={activeIdx >= 3} danger={activeIdx === 3} onClick={() => setActiveIdx(3)} />
      </div>
      {activeIdx === 0 && <div className="arch-danger-banner">Server unresponsive - health check failing</div>}
      {activeIdx === 4 && <div className="arch-failover-banner">Server recovered - rejoining pool</div>}
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_SA_FAULT}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_SA_FAULT} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SCALABILITY DIAGRAMS
// ─────────────────────────────────────────────────────────────────────────────

// SC DIAGRAM 1 - Scalability Fundamentals: single server to scaled out
const TOTAL_SC_FUND = 5;
const SCFundamentalsDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'Single server handles current load comfortably',
    'User growth causes traffic to increase 10x',
    'Server CPU hits 90% - requests slow down significantly',
    'Add more servers behind a load balancer to share load',
    'Each new server adds proportional capacity - linear scaling',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-row arch-row--center">
        <ArchNode icon={<UserIcon active={activeIdx === 0} />}     label="Users"         sublabel={activeIdx >= 1 ? 'Growing fast' : 'Stable load'} active={activeIdx === 0} onClick={() => setActiveIdx(0)} />
        <Arrow active={activeIdx >= 1} label="requests" />
        <ArchNode icon={<NetworkIcon active={activeIdx >= 1} />}   label="Load Balancer" sublabel="Distributes traffic"  active={activeIdx >= 3} onClick={() => setActiveIdx(3)} />
        <Arrow active={activeIdx >= 2} label="route" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <ArchNode icon={<ServerIcon active={activeIdx >= 2} />}  label="Server 1"      sublabel={activeIdx === 2 ? 'CPU 90%' : 'Normal'} active={activeIdx >= 2} danger={activeIdx === 2} onClick={() => setActiveIdx(2)} />
          <ArchNode icon={<ServerIcon active={activeIdx >= 3} />}  label="Server 2"      sublabel={activeIdx >= 3 ? 'Added' : 'Standby'} active={activeIdx >= 3} onClick={() => setActiveIdx(3)} />
          <ArchNode icon={<ServerIcon active={activeIdx >= 4} />}  label="Server 3"      sublabel={activeIdx >= 4 ? 'Added' : 'Standby'} active={activeIdx >= 4} onClick={() => setActiveIdx(4)} />
        </div>
      </div>
      {activeIdx === 2 && <div className="arch-danger-banner">Single server at 90% CPU - bottleneck reached</div>}
      {activeIdx >= 3  && <div className="arch-failover-banner">Load distributed - each server at 30% CPU</div>}
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_SC_FUND}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_SC_FUND} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// SC DIAGRAM 2 - Vertical vs Horizontal Scaling
const TOTAL_SC_VVSH = 5;
const SCVertHorizDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const isHoriz = activeIdx >= 3;
  const descs = [
    'Vertical: upgrade existing server with more CPU and RAM',
    'Vertical scaling hits a ceiling - no machine is infinitely large',
    'Single server is also a single point of failure',
    'Horizontal: add more servers, share load across all of them',
    'Stateless design lets any server handle any request',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-two-path">
        <div className={`arch-path${!isHoriz ? ' arch-path--active' : ''}`}>
          <div className="arch-path__label arch-path__label--read">VERTICAL (SCALE UP)</div>
          <div className="arch-row arch-row--col">
            <ArchNode icon={<ServerIcon active={activeIdx === 0} />} label="Small Server" sublabel="2 CPU, 4GB RAM"  active={activeIdx === 0} onClick={() => setActiveIdx(0)} />
            <VertArrow active={activeIdx >= 1} label="upgrade" />
            <ArchNode icon={<ServerIcon active={activeIdx === 1} />} label="Big Server"   sublabel="64 CPU, 256GB RAM" active={activeIdx === 1} onClick={() => setActiveIdx(1)} />
            {activeIdx === 2 && <div className="arch-danger-banner" style={{ marginTop: '0.5rem' }}>Ceiling reached - and single point of failure</div>}
          </div>
        </div>
        <div className="arch-path-divider" />
        <div className={`arch-path${isHoriz ? ' arch-path--active' : ''}`}>
          <div className="arch-path__label arch-path__label--write">HORIZONTAL (SCALE OUT)</div>
          <div className="arch-row arch-row--col">
            <ArchNode icon={<NetworkIcon active={activeIdx === 3} />} label="Load Balancer" sublabel="Routes traffic" active={activeIdx === 3} onClick={() => setActiveIdx(3)} />
            <VertArrow active={activeIdx >= 4} label="distribute" />
            <div className="arch-row arch-row--center" style={{ gap: '0.3rem' }}>
              <ArchNode icon={<ServerIcon active={activeIdx >= 4} />} label="Server 1" sublabel="Stateless" active={activeIdx >= 4} onClick={() => setActiveIdx(4)} />
              <ArchNode icon={<ServerIcon active={activeIdx >= 4} />} label="Server 2" sublabel="Stateless" active={activeIdx >= 4} />
              <ArchNode icon={<ServerIcon active={activeIdx >= 4} />} label="Server 3" sublabel="Stateless" active={activeIdx >= 4} />
            </div>
          </div>
        </div>
      </div>
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_SC_VVSH}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_SC_VVSH} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// SC DIAGRAM 3 - Auto-Scaling
const TOTAL_SC_AUTO = 5;
const SCAutoScaleDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'Normal load: 2 servers running, CPU at 40%',
    'Traffic spike detected - CPU crosses 70% threshold',
    'Auto-scaler triggers and provisions 3 new servers',
    'Load distributed across 5 servers - CPU back to 40%',
    'Traffic drops - 3 servers terminated to save cost',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-row arch-row--center">
        <ArchNode icon={<UserIcon active={activeIdx === 1} />}     label="Traffic"       sublabel={activeIdx >= 1 ? 'Spike!' : 'Normal'} active={activeIdx >= 1} danger={activeIdx === 1} onClick={() => setActiveIdx(1)} />
        <Arrow active={activeIdx >= 1} label={activeIdx >= 1 ? 'surge' : 'requests'} />
        <ArchNode icon={<NetworkIcon active={activeIdx >= 2} />}   label="Auto-Scaler"   sublabel={activeIdx >= 2 ? 'Triggered' : 'Watching'} active={activeIdx >= 2} onClick={() => setActiveIdx(2)} />
      </div>
      <div className="arch-row arch-row--center" style={{ marginTop: '0.75rem' }}>
        <ArchNode icon={<ServerIcon active />}  label="Server 1" sublabel="Always on" active />
        <ArchNode icon={<ServerIcon active />}  label="Server 2" sublabel="Always on" active />
        <ArchNode icon={<ServerIcon active={activeIdx >= 3} />} label="Server 3" sublabel={activeIdx >= 3 ? 'Auto-added' : 'Standby'} active={activeIdx >= 3} onClick={() => setActiveIdx(3)} />
        <ArchNode icon={<ServerIcon active={activeIdx >= 3} />} label="Server 4" sublabel={activeIdx >= 3 ? 'Auto-added' : 'Standby'} active={activeIdx >= 3} />
        <ArchNode icon={<ServerIcon active={activeIdx >= 3} />} label="Server 5" sublabel={activeIdx >= 3 ? 'Auto-added' : 'Standby'} active={activeIdx >= 3} />
      </div>
      {activeIdx === 1 && <div className="arch-danger-banner">CPU at 80% - auto-scaler threshold crossed</div>}
      {activeIdx >= 3 && activeIdx < 4 && <div className="arch-failover-banner">3 new servers added - load distributed</div>}
      {activeIdx === 4 && <div className="arch-failover-banner">Traffic dropped - 3 servers terminated, cost saved</div>}
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_SC_AUTO}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_SC_AUTO} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// SC DIAGRAM 4 - Stateless vs Stateful
const TOTAL_SC_STATE = 5;
const SCStateDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'Stateful: user session stored in Server 1 memory only',
    'Load balancer routes next request to Server 2',
    'Server 2 has no session - user gets logged out unexpectedly',
    'Fix: move sessions from memory to shared Redis store',
    'Any server reads session from Redis - horizontal scaling works',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-row arch-row--center">
        <ArchNode icon={<UserIcon active={activeIdx === 0} />}      label="User"          sublabel="Makes requests"     active={activeIdx === 0} onClick={() => setActiveIdx(0)} />
        <Arrow active={activeIdx >= 1} label="request" />
        <ArchNode icon={<NetworkIcon active={activeIdx >= 1} />}    label="Load Balancer" sublabel="Routes randomly"    active={activeIdx >= 1} onClick={() => setActiveIdx(1)} />
      </div>
      <div className="arch-row arch-row--center" style={{ marginTop: '0.75rem' }}>
        <ArchNode icon={<ServerIcon active={activeIdx === 0} />}    label="Server 1"      sublabel={activeIdx === 0 ? 'Has session' : 'No session'} active={activeIdx === 0} onClick={() => setActiveIdx(0)} />
        <ArchNode icon={<ServerIcon active={activeIdx >= 2} />}     label="Server 2"      sublabel={activeIdx === 2 ? 'No session!' : activeIdx >= 4 ? 'Reads Redis' : 'No session'} active={activeIdx >= 2} danger={activeIdx === 2} onClick={() => setActiveIdx(2)} />
        <ArchNode icon={<RedisIcon active={activeIdx >= 3} />}      label="Redis"         sublabel={activeIdx >= 3 ? 'Shared sessions' : 'Not used'} active={activeIdx >= 3} onClick={() => setActiveIdx(3)} />
      </div>
      {activeIdx === 2 && <div className="arch-danger-banner">Session not found - user logged out!</div>}
      {activeIdx >= 4  && <div className="arch-failover-banner">Any server reads from Redis - no logout issues</div>}
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_SC_STATE}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_SC_STATE} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// SC DIAGRAM 5 - Capacity Planning
const TOTAL_SC_CAP = 5;
const SCCapacityDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'Step 1: estimate daily active users and actions per user',
    'Step 2: calculate average QPS = DAU x actions / 86,400 seconds',
    'Step 3: apply peak factor (3-5x average) for provisioning',
    'Step 4: measure how many QPS each server handles at 70% CPU',
    'Step 5: divide peak QPS by per-server capacity = servers needed',
  ];
  const steps = [
    { label: '10M DAU',     sub: 'x 10 actions/day',  active: activeIdx === 0 },
    { label: '1,157 QPS',   sub: 'avg (100M / 86400)', active: activeIdx === 1 },
    { label: '5,000 QPS',   sub: 'peak (4.3x avg)',    active: activeIdx === 2 },
    { label: '500 QPS',     sub: 'per server at 70%',  active: activeIdx === 3 },
    { label: '10 servers',  sub: '5000 / 500 = 10',    active: activeIdx === 4 },
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-eviction">
        <div className="arch-eviction__label">Capacity Calculation</div>
        <div className="arch-eviction__slots">
          {steps.map((s, i) => (
            <div
              key={i}
              className={`arch-eviction__slot${s.active ? ' arch-eviction__slot--full' : i < activeIdx ? ' arch-eviction__slot--new' : ''}`}
              onClick={() => setActiveIdx(i)}
              style={{ cursor: 'pointer', minWidth: 64, height: 64, fontSize: '0.62rem', padding: '0.25rem' }}
            >
              <div style={{ fontWeight: 800, fontSize: '0.72rem' }}>{s.label}</div>
              <div style={{ fontSize: '0.55rem', opacity: 0.8, marginTop: 2 }}>{s.sub}</div>
              {s.active && <div className="arch-node__pulse" />}
            </div>
          ))}
        </div>
      </div>
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_SC_CAP}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_SC_CAP} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// SC DIAGRAM 6 - Bottleneck Identification
const TOTAL_SC_BOTTLENECK = 5;
const SCBottleneckDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'Profile a request end-to-end to see where time is spent',
    'Database query takes 480ms of a 500ms total response time',
    'Missing index on user_id found in slow query log',
    'Index added - query drops from 480ms to 8ms',
    'Redis cache added - 90% of DB calls eliminated entirely',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-row arch-row--center">
        <ArchNode icon={<UserIcon active={activeIdx === 0} />}     label="Request"    sublabel="500ms total"        active={activeIdx === 0} onClick={() => setActiveIdx(0)} />
        <Arrow active={activeIdx >= 1} label="trace" />
        <ArchNode icon={<ServerIcon active={activeIdx === 0} />}   label="App Server" sublabel="20ms app code"      active={activeIdx === 0} onClick={() => setActiveIdx(1)} />
        <Arrow active={activeIdx >= 1} label="query" />
        <ArchNode icon={<DatabaseIcon active={activeIdx >= 1} />}  label="Database"   sublabel={activeIdx <= 2 ? '480ms - slow!' : activeIdx === 3 ? '8ms - fast' : '8ms'} active={activeIdx >= 1} danger={activeIdx <= 2 && activeIdx >= 1} onClick={() => setActiveIdx(1)} />
      </div>
      <div className="arch-row arch-row--center" style={{ marginTop: '0.75rem' }}>
        <ArchNode icon={<CacheIcon active={activeIdx >= 4} />}     label="Redis Cache" sublabel={activeIdx >= 4 ? '90% cache hit' : 'Not added yet'} active={activeIdx >= 4} onClick={() => setActiveIdx(4)} />
      </div>
      {activeIdx === 1 && <div className="arch-danger-banner">DB takes 480ms - clear bottleneck</div>}
      {activeIdx === 3 && <div className="arch-failover-banner">Index added - 480ms dropped to 8ms</div>}
      {activeIdx === 4 && <div className="arch-failover-banner">Cache cuts DB calls by 90%</div>}
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_SC_BOTTLENECK}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_SC_BOTTLENECK} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// SC DIAGRAM 7 - Database Scaling
const TOTAL_SC_DBSCALE = 5;
const SCDbScaleDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'All writes go to the single Primary database',
    'Primary replicates data to read replicas automatically',
    'Read queries distributed across replicas - 3x read capacity',
    'Connection pooler sits between app and DB - multiplexes connections',
    'Shard by user ID if replicas are still not enough',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-row arch-row--center">
        <ArchNode icon={<ServerIcon active={activeIdx <= 1} />}    label="App Servers"  sublabel="Write + Read"       active={activeIdx === 0} onClick={() => setActiveIdx(0)} />
        <Arrow active label="writes" />
        <ArchNode icon={<DatabaseIcon active={activeIdx <= 2} />}  label="Primary DB"   sublabel="All writes"         active={activeIdx <= 1} danger={activeIdx === 4} onClick={() => setActiveIdx(1)} />
      </div>
      <div className="arch-row arch-row--center" style={{ marginTop: '0.75rem' }}>
        <ArchNode icon={<DatabaseIcon active={activeIdx >= 2} />}  label="Replica 1"    sublabel="Read traffic"       active={activeIdx >= 2} onClick={() => setActiveIdx(2)} />
        <Arrow active={activeIdx >= 1} label="replicate" reverse />
        <ArchNode icon={<DatabaseIcon active={activeIdx >= 2} />}  label="Replica 2"    sublabel="Read traffic"       active={activeIdx >= 2} />
        <ArchNode icon={<LockIcon active={activeIdx === 3} />}     label="PgBouncer"    sublabel="Connection pool"    active={activeIdx === 3} onClick={() => setActiveIdx(3)} />
      </div>
      {activeIdx === 4 && <div className="arch-failover-banner">Sharding: User IDs split across multiple DBs</div>}
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_SC_DBSCALE}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_SC_DBSCALE} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// SC DIAGRAM 8 - Scaling Strategies
const TOTAL_SC_STRAT = 5;
const SCStrategyDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'Start with the cheapest strategy: add Redis cache in front of DB',
    'Move slow work to async queue - API response becomes instant',
    'CDN caches static files at edge - reduces origin load 70%',
    'Microservices: scale each service independently if needed',
    'Trade-off: every strategy has a cost - choose consciously',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-row arch-row--center">
        <ArchNode icon={<UserIcon active />}                        label="User"       sublabel="Needs fast response"  active />
        <Arrow active label="request" />
        <ArchNode icon={<ServerIcon active={activeIdx === 0} />}    label="App Server" sublabel="Checks cache first"   active={activeIdx === 0} onClick={() => setActiveIdx(0)} />
        <Arrow active={activeIdx >= 1} label="queue" />
        <ArchNode icon={<CacheIcon active={activeIdx >= 1} />}      label="Queue"      sublabel="Async jobs"          active={activeIdx >= 1} onClick={() => setActiveIdx(1)} />
      </div>
      <div className="arch-row arch-row--center" style={{ marginTop: '0.75rem' }}>
        <ArchNode icon={<NetworkIcon active={activeIdx === 2} />}   label="CDN"        sublabel="Static at edge"       active={activeIdx === 2} onClick={() => setActiveIdx(2)} />
        <Arrow active={activeIdx >= 3} label="route" />
        <ArchNode icon={<ServerIcon active={activeIdx === 3} />}    label="Microservice" sublabel="Scale independently" active={activeIdx === 3} onClick={() => setActiveIdx(3)} />
        <Arrow active={activeIdx >= 4} label="trade-off" />
        <ArchNode icon={<DatabaseIcon active={activeIdx === 4} />}  label="Decision"   sublabel="Cost vs complexity"   active={activeIdx === 4} onClick={() => setActiveIdx(4)} />
      </div>
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_SC_STRAT}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_SC_STRAT} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// SC DIAGRAM 9 - Traffic Spikes
const TOTAL_SC_SPIKE = 5;
const SCSpikeDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'Traffic jumps 50x in 30 seconds - spike arrives',
    'Rate limiter caps requests per user - prevents abuse',
    'Remaining requests buffered in queue - no errors returned',
    'Warm pool servers join in 30 seconds - immediate capacity',
    'Non-critical features disabled - core system protected',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-stampede">
        <div className="arch-stampede__users">
          {['User 1', 'User 2', '...', 'User N'].map((u) => (
            <div key={u} className={`arch-stampede__user${activeIdx >= 1 ? ' arch-stampede__user--flood' : ''}`}>
              <UserIcon active={activeIdx >= 1} />
              <span>{u}</span>
            </div>
          ))}
        </div>
        <Arrow active={activeIdx >= 1} label={activeIdx >= 1 ? '50x spike!' : 'normal'} />
        <div className="arch-stampede__center">
          <ArchNode icon={<LockIcon active={activeIdx >= 1} />}      label="Rate Limiter"  sublabel={activeIdx >= 1 ? 'Caps excess' : 'Idle'} active={activeIdx >= 1} onClick={() => setActiveIdx(1)} />
          {activeIdx >= 2 && <><VertArrow active label="overflow" /><ArchNode icon={<CacheIcon active />} label="Queue" sublabel="Absorbs spike" active /></>}
          {activeIdx >= 3 && <><VertArrow active label="join pool" /><ArchNode icon={<ServerIcon active />} label="Warm Pool" sublabel="Ready in 30s" active /></>}
        </div>
      </div>
      {activeIdx === 0 && <div className="arch-danger-banner">50x traffic spike arriving</div>}
      {activeIdx >= 4  && <div className="arch-failover-banner">Core system protected - degraded non-critical features</div>}
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_SC_SPIKE}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_SC_SPIKE} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// OBSERVABILITY AND SLOs DIAGRAMS
// ─────────────────────────────────────────────────────────────────────────────

// OBS DIAGRAM 1 - Fundamentals: 3 pillars
const TOTAL_OBS_FUND = 5;
const OBSFundamentalsDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'Problem occurs in production - what tools do we use?',
    'Metrics: Prometheus alert fires - error rate > 1%',
    'Logs: Elasticsearch shows NullPointerException in Service C',
    'Traces: Jaeger shows payment service took 4s - root cause found',
    'Three pillars together: detect, explain, locate - MTTR in minutes',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-row arch-row--center">
        <ArchNode icon={<WarningIcon active={activeIdx === 0} />}  label="Problem"      sublabel="Something broke"     active={activeIdx === 0} danger onClick={() => setActiveIdx(0)} />
        <Arrow active={activeIdx >= 1} label="investigate" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          <ArchNode icon={<CacheIcon   active={activeIdx === 1} />} label="Metrics"     sublabel="Prometheus alert"    active={activeIdx === 1} onClick={() => setActiveIdx(1)} />
          <ArchNode icon={<DatabaseIcon active={activeIdx === 2} />} label="Logs"       sublabel="Elasticsearch"       active={activeIdx === 2} onClick={() => setActiveIdx(2)} />
          <ArchNode icon={<NetworkIcon active={activeIdx === 3} />} label="Traces"      sublabel="Jaeger waterfall"    active={activeIdx === 3} onClick={() => setActiveIdx(3)} />
        </div>
        <Arrow active={activeIdx >= 4} label="MTTR" />
        <ArchNode icon={<LockIcon    active={activeIdx >= 4} />}   label="Fix Found"    sublabel="Minutes not hours"   active={activeIdx >= 4} onClick={() => setActiveIdx(4)} />
      </div>
      {activeIdx === 1 && <div className="arch-failover-banner">Metrics: WHAT is broken (error rate &gt; 1%)</div>}
      {activeIdx === 2 && <div className="arch-failover-banner">Logs: WHY it broke (NullPointerException)</div>}
      {activeIdx === 3 && <div className="arch-failover-banner">Traces: WHERE it broke (payment service, 4s)</div>}
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_OBS_FUND}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_OBS_FUND} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// OBS DIAGRAM 2 - Logging: structured log pipeline
const TOTAL_OBS_LOG = 5;
const OBSLoggingDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'Service emits structured JSON log event with all context',
    'Log shipper (Fluentd) forwards to centralised Elasticsearch',
    'All 50 services logs searchable from one Kibana UI',
    'Filter by trace_id=abc123: see full request path across services',
    'Tiered storage: hot 7 days, warm 30 days, cold archive 1 year',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-row arch-row--center">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          {['Service A','Service B','Service C'].map(s => (
            <ArchNode key={s} icon={<ServerIcon active={activeIdx === 0} />} label={s} sublabel="JSON logs" active={activeIdx === 0} onClick={() => setActiveIdx(0)} />
          ))}
        </div>
        <Arrow active={activeIdx >= 1} label="Fluentd" />
        <ArchNode icon={<DatabaseIcon active={activeIdx >= 1} />}  label="Elasticsearch" sublabel="Centralised store" active={activeIdx >= 1} onClick={() => setActiveIdx(1)} />
        <Arrow active={activeIdx >= 2} label="search" />
        <ArchNode icon={<NetworkIcon  active={activeIdx >= 2} />}  label="Kibana"       sublabel="Query + dashboards" active={activeIdx >= 2} onClick={() => setActiveIdx(2)} />
      </div>
      {activeIdx === 3 && <div className="arch-failover-banner">trace_id=abc123: found across 5 services in 2 seconds</div>}
      {activeIdx >= 4 && <div className="arch-failover-banner">Tiered storage: cost-effective log retention</div>}
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_OBS_LOG}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_OBS_LOG} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// OBS DIAGRAM 3 - Metrics: Prometheus + Grafana
const TOTAL_OBS_METRICS = 5;
const OBSMetricsDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'Service exposes /metrics endpoint with RED metrics',
    'Prometheus scrapes /metrics every 15 seconds',
    'RED metrics: Rate 1234/s, Errors 0.3%, Duration P99=487ms',
    'Grafana dashboards show real-time graphs per service',
    'Alert fires: error rate > 1% for 5 min - pages on-call',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-row arch-row--center">
        <ArchNode icon={<ServerIcon  active={activeIdx === 0} />}  label="Service"      sublabel="/metrics endpoint"  active={activeIdx === 0} onClick={() => setActiveIdx(0)} />
        <Arrow active={activeIdx >= 1} label="scrape 15s" />
        <ArchNode icon={<CacheIcon   active={activeIdx >= 1} />}   label="Prometheus"   sublabel="Time-series store"  active={activeIdx >= 1} onClick={() => setActiveIdx(1)} />
        <Arrow active={activeIdx >= 3} label="query" />
        <ArchNode icon={<NetworkIcon active={activeIdx >= 3} />}   label="Grafana"      sublabel="Dashboards"         active={activeIdx >= 3} onClick={() => setActiveIdx(3)} />
      </div>
      <div className="arch-row arch-row--center" style={{ marginTop: '0.75rem' }}>
        {['Rate: 1234/s','Errors: 0.3%','P99: 487ms'].map((m, i) => (
          <ArchNode key={m} icon={<DatabaseIcon active={activeIdx === 2} />} label={m} sublabel="RED metric" active={activeIdx === 2} onClick={() => setActiveIdx(2)} />
        ))}
        {activeIdx >= 4 && <ArchNode icon={<WarningIcon active />} label="Alert!" sublabel="Error &gt; 1%" active danger onClick={() => setActiveIdx(4)} />}
      </div>
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_OBS_METRICS}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_OBS_METRICS} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// OBS DIAGRAM 4 - Distributed Tracing
const TOTAL_OBS_TRACE = 5;
const OBSTracingDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'Request enters API Gateway - trace_id=abc123 assigned',
    'trace_id propagated to every downstream service call',
    'Each service emits span: name, duration, status',
    'Payment service span: 4s, ERROR - root cause identified',
    'Jaeger waterfall: full request path visible in seconds',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-row arch-row--center">
        <ArchNode icon={<NetworkIcon active={activeIdx === 0} />}  label="Gateway"      sublabel="trace_id: abc123"   active={activeIdx === 0} onClick={() => setActiveIdx(0)} />
        <Arrow active={activeIdx >= 1} label="propagate" />
        <ArchNode icon={<ServerIcon  active={activeIdx === 1} />}  label="Order Svc"    sublabel="10ms - OK"           active={activeIdx === 1} onClick={() => setActiveIdx(1)} />
        <Arrow active={activeIdx >= 2} label="call" />
        <ArchNode icon={<LockIcon    active={activeIdx >= 2} />}   label="Payment Svc"  sublabel={activeIdx >= 3 ? '4s - ERROR!' : '...'} active={activeIdx >= 2} danger={activeIdx >= 3} onClick={() => setActiveIdx(3)} />
      </div>
      <div className="arch-row arch-row--center" style={{ marginTop: '0.75rem' }}>
        <ArchNode icon={<CacheIcon   active={activeIdx === 4} />}  label="Jaeger"       sublabel="Trace waterfall"     active={activeIdx === 4} onClick={() => setActiveIdx(4)} />
      </div>
      {activeIdx === 3 && <div className="arch-danger-banner">Payment: 4s DB query - root cause found!</div>}
      {activeIdx >= 4 && <div className="arch-failover-banner">Jaeger: full trace visible in seconds, not hours</div>}
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_OBS_TRACE}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_OBS_TRACE} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// OBS DIAGRAM 5 - Health Checks and Alerting
const TOTAL_OBS_HEALTH = 5;
const OBSHealthDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'Load balancer pings /health every 5 seconds on each service',
    'Deep health check verifies DB, cache, and dependencies',
    'Prometheus alert fires: error rate > 1% for 5 minutes',
    'PagerDuty notifies on-call with context and runbook link',
    'MTTR measured: time from detection to resolution',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-row arch-row--center">
        <ArchNode icon={<NetworkIcon active={activeIdx >= 0} />}   label="Load Balancer" sublabel="/health every 5s"  active />
        <Arrow active={activeIdx >= 1} label="deep check" />
        <ArchNode icon={<ServerIcon  active={activeIdx >= 1} />}   label="Service"       sublabel={activeIdx === 1 ? 'Checks DB+Redis' : '503 if unhealthy'} active={activeIdx >= 1} onClick={() => setActiveIdx(1)} />
      </div>
      <div className="arch-row arch-row--center" style={{ marginTop: '0.75rem' }}>
        <ArchNode icon={<CacheIcon   active={activeIdx === 2} />}  label="Prometheus"    sublabel="Alert: error &gt; 1%"  active={activeIdx === 2} onClick={() => setActiveIdx(2)} />
        <Arrow active={activeIdx >= 3} label="notify" />
        <ArchNode icon={<LockIcon    active={activeIdx === 3} />}  label="PagerDuty"     sublabel="On-call paged"      active={activeIdx === 3} onClick={() => setActiveIdx(3)} />
        <Arrow active={activeIdx >= 4} label="MTTR" />
        <ArchNode icon={<UserIcon    active={activeIdx >= 4} />}   label="Engineer"      sublabel="Investigates"       active={activeIdx >= 4} onClick={() => setActiveIdx(4)} />
      </div>
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_OBS_HEALTH}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_OBS_HEALTH} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// OBS DIAGRAM 6 - Golden Signals
const TOTAL_OBS_GOLDEN = 5;
const OBSGoldenDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'Four Golden Signals: complete picture of service health',
    'Latency: P99=487ms - are requests fast enough?',
    'Traffic: 12,340 req/sec - is demand within capacity?',
    'Errors: 0.3% error rate - are requests succeeding?',
    'Saturation: CPU 73%, DB pool 68% - will it fail soon?',
  ];
  const signals = [
    { label: 'Latency', sub: 'P99 = 487ms', idx: 1, ok: true },
    { label: 'Traffic', sub: '12,340 req/s', idx: 2, ok: true },
    { label: 'Errors',  sub: '0.3% error', idx: 3, ok: true },
    { label: 'Saturation', sub: 'CPU 73%', idx: 4, ok: false },
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-row arch-row--center">
        <ArchNode icon={<ServerIcon active />}                     label="Your Service"  sublabel="Is it healthy?"     active />
        <Arrow active={activeIdx >= 1} label="4 signals" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          {signals.map(s => (
            <ArchNode key={s.label} icon={<CacheIcon active={activeIdx === s.idx} />}
              label={s.label} sublabel={s.sub}
              active={activeIdx === s.idx}
              danger={activeIdx === s.idx && !s.ok}
              onClick={() => setActiveIdx(s.idx)} />
          ))}
        </div>
      </div>
      {activeIdx >= 1 && activeIdx <= 3 && <div className="arch-failover-banner">GREEN: {signals[activeIdx-1]?.label} is healthy</div>}
      {activeIdx === 4 && <div className="arch-danger-banner">Watch Saturation: at 73% CPU, next spike may cause issues</div>}
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_OBS_GOLDEN}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_OBS_GOLDEN} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// OBS DIAGRAM 7 - SLIs
const TOTAL_OBS_SLI = 5;
const OBSSLIDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'User makes a checkout request to the service',
    'Measure: did it return success AND complete in under 500ms?',
    'Good event: success + fast. Bad event: error OR slow',
    'SLI = good_requests / total_requests over time window',
    'SLI = 99.72% - measure of actual user experience',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-row arch-row--center">
        <ArchNode icon={<UserIcon    active={activeIdx === 0} />}  label="User Request"  sublabel="Checkout page"       active={activeIdx === 0} onClick={() => setActiveIdx(0)} />
        <Arrow active={activeIdx >= 1} label="measure" />
        <ArchNode icon={<LockIcon    active={activeIdx >= 1} />}   label="SLI Measure"   sublabel="Success + <500ms?"   active={activeIdx === 1} onClick={() => setActiveIdx(1)} />
        <Arrow active={activeIdx >= 2} label="classify" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          <ArchNode icon={<ServerIcon active={activeIdx === 2} />} label="Good event"    sublabel="Fast + success"      active={activeIdx === 2} onClick={() => setActiveIdx(2)} />
          <ArchNode icon={<WarningIcon active={activeIdx === 2} />} label="Bad event"   sublabel="Error or slow"        active={activeIdx === 2} danger onClick={() => setActiveIdx(2)} />
        </div>
      </div>
      {activeIdx >= 3 && <div className="arch-failover-banner">SLI = good / total = 997,200 / 1,000,000 = 99.72%</div>}
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_OBS_SLI}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_OBS_SLI} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// OBS DIAGRAM 8 - SLOs and Error Budget
const TOTAL_OBS_SLO = 5;
const OBSSLODiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'SLI measured: 99.72% requests successful last 30 days',
    'SLO target: 99.9% availability over any 30-day window',
    'Error budget: 0.1% = 43.2 minutes of downtime per month',
    'SLI is 99.72% - error budget is OVERRUN - SLO breached',
    'Response: freeze deployments, investigate root cause',
  ];
  const budgetPct = [100, 100, 100, 0, 0];
  const bp = budgetPct[Math.min(activeIdx, 4)];
  return (
    <div className="arch-diagram">
      <div style={{ background: '#F0EEFF', borderRadius: 8, padding: '0.75rem', margin: '0 0 0.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', marginBottom: 4, fontWeight: 700, color: '#24212B' }}>
          <span>Error Budget Remaining</span>
          <span style={{ color: bp === 0 ? '#DC2626' : '#7C5CFC' }}>{bp === 0 ? 'EXHAUSTED' : bp + '% remaining'}</span>
        </div>
        <div style={{ background: '#E5E0EF', borderRadius: 4, height: 20, overflow: 'hidden' }}>
          <div style={{ background: bp === 0 ? '#DC2626' : '#7C5CFC', height: '100%', width: Math.max(bp, 2) + '%', borderRadius: 4, transition: 'all 0.5s' }} />
        </div>
      </div>
      {activeIdx === 3 && <div className="arch-danger-banner">SLO BREACHED: 0.28% failure &gt; 0.1% budget</div>}
      {activeIdx >= 4 && <div className="arch-danger-banner">Action: freeze deploys, focus on reliability</div>}
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_OBS_SLO}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_OBS_SLO} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// OBS DIAGRAM 9 - SLAs and Burn Rate
const TOTAL_OBS_SLA = 5;
const OBSSLADiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'SLO: 99.95% internal target (stricter than SLA)',
    'SLA: 99.9% external customer contract with penalties',
    'Burn rate: how fast is error budget being consumed?',
    '15x burn rate: budget exhausted in 2 days - alert fires!',
    'Policy: freeze deploys at 15x burn rate before SLA breach',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-two-path">
        <div className={`arch-path${activeIdx <= 1 ? ' arch-path--active' : ''}`}>
          <div className="arch-path__label arch-path__label--write">INTERNAL (SLO)</div>
          <div className="arch-row arch-row--col">
            <ArchNode icon={<LockIcon    active={activeIdx === 0} />} label="SLO: 99.95%" sublabel="Stricter target" active={activeIdx === 0} onClick={() => setActiveIdx(0)} />
            {activeIdx === 0 && <div className="arch-failover-banner" style={{ marginTop: '0.5rem' }}>SLO margin before SLA breach</div>}
          </div>
        </div>
        <div className="arch-path-divider" />
        <div className={`arch-path${activeIdx >= 1 ? ' arch-path--active' : ''}`}>
          <div className="arch-path__label arch-path__label--read">EXTERNAL (SLA)</div>
          <div className="arch-row arch-row--col">
            <ArchNode icon={<UserIcon    active={activeIdx === 1} />} label="SLA: 99.9%" sublabel="Customer contract" active={activeIdx === 1} onClick={() => setActiveIdx(1)} />
            {activeIdx === 1 && <div className="arch-danger-banner" style={{ marginTop: '0.5rem' }}>Breach = financial penalty</div>}
          </div>
        </div>
      </div>
      <div className="arch-row arch-row--center" style={{ marginTop: '0.75rem' }}>
        <ArchNode icon={<CacheIcon   active={activeIdx === 2} />}  label="Burn Rate"    sublabel="1x sustainable"     active={activeIdx === 2} onClick={() => setActiveIdx(2)} />
        <Arrow active={activeIdx >= 3} label="spikes!" />
        <ArchNode icon={<WarningIcon active={activeIdx >= 3} />}   label="15x Burn!"   sublabel="Budget in 2 days"   active={activeIdx >= 3} danger onClick={() => setActiveIdx(3)} />
        <Arrow active={activeIdx >= 4} label="freeze" />
        <ArchNode icon={<ServerIcon  active={activeIdx >= 4} />}   label="Policy"      sublabel="Stop deploys"       active={activeIdx >= 4} onClick={() => setActiveIdx(4)} />
      </div>
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_OBS_SLA}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_OBS_SLA} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// OBS DIAGRAM 10 - Observability in Practice
const TOTAL_OBS_PRACTICE = 5;
const OBSPracticeDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'Start: add RED metrics to all user-facing services',
    'Alert fires: P99 latency > 500ms for 5 minutes',
    'Trace shows DB slow; logs show missing index on user_id',
    'Fix deployed: index added - P99 drops from 2s to 50ms',
    'Post-mortem: timeline, root cause, action items documented',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-col arch-col--center">
        {[
          { label: 'Instrument',  sub: 'RED metrics on all services', idx: 0 },
          { label: 'Alert fires', sub: 'P99 > 500ms for 5 min',       idx: 1 },
          { label: 'Investigate', sub: 'Trace + logs: DB index missing', idx: 2 },
          { label: 'Fix',         sub: 'Index added: 2s -> 50ms',      idx: 3 },
          { label: 'Post-mortem', sub: 'Timeline, cause, prevention',  idx: 4 },
        ].map((step, i) => (
          <React.Fragment key={step.label}>
            <div className={`arch-layer${activeIdx === i ? ' arch-layer--active' : ''}`} onClick={() => setActiveIdx(i)}>
              <div className="arch-layer__icon">
                {i === 0 && <ServerIcon  active={activeIdx === i} />}
                {i === 1 && <WarningIcon active={activeIdx === i} />}
                {i === 2 && <NetworkIcon active={activeIdx === i} />}
                {i === 3 && <LockIcon    active={activeIdx === i} />}
                {i === 4 && <DatabaseIcon active={activeIdx === i} />}
              </div>
              <div className="arch-layer__info">
                <span className="arch-layer__label">{step.label}</span>
                <span className="arch-layer__sub">{step.sub}</span>
              </div>
              <div className="arch-layer__latency">{i + 1}</div>
            </div>
            {i < 4 && <VertArrow active={activeIdx > i} />}
          </React.Fragment>
        ))}
      </div>
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_OBS_PRACTICE}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_OBS_PRACTICE} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// REAL-TIME AND STREAMING DIAGRAMS
// ─────────────────────────────────────────────────────────────────────────────

// RT DIAGRAM 1 - Fundamentals: push vs pull
const TOTAL_RT_FUND = 5;
const RTFundamentalsDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'Pull model: client polls server every 5 seconds for new data',
    'User waits up to 5 seconds to see a new message - bad UX',
    'Push model: server pushes data to client immediately on event',
    'Message delivered to recipient in under 100ms',
    'Push is 50x faster than 5-second polling for real-time data',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-two-path">
        <div className={`arch-path${activeIdx <= 1 ? ' arch-path--active' : ''}`}>
          <div className="arch-path__label arch-path__label--read">PULL (POLLING)</div>
          <div className="arch-row arch-row--col">
            <ArchNode icon={<UserIcon    active={activeIdx === 0} />} label="Client" sublabel="Polls every 5s"  active={activeIdx === 0} onClick={() => setActiveIdx(0)} />
            <VertArrow active={activeIdx >= 1} label="5s wait" />
            <ArchNode icon={<ServerIcon  active={activeIdx === 1} />} label="Server" sublabel="Waits to reply"  active={activeIdx === 1} danger={activeIdx === 1} onClick={() => setActiveIdx(1)} />
            {activeIdx === 1 && <div className="arch-danger-banner" style={{ marginTop: '0.5rem' }}>Up to 5 second delay!</div>}
          </div>
        </div>
        <div className="arch-path-divider" />
        <div className={`arch-path${activeIdx >= 2 ? ' arch-path--active' : ''}`}>
          <div className="arch-path__label arch-path__label--write">PUSH (REAL-TIME)</div>
          <div className="arch-row arch-row--col">
            <ArchNode icon={<ServerIcon  active={activeIdx >= 2} />} label="Server" sublabel="Event occurs"    active={activeIdx === 2} onClick={() => setActiveIdx(2)} />
            <VertArrow active={activeIdx >= 3} label="instant push" />
            <ArchNode icon={<UserIcon    active={activeIdx >= 3} />} label="Client" sublabel="<100ms delivery" active={activeIdx >= 3} onClick={() => setActiveIdx(3)} />
            {activeIdx >= 4 && <div className="arch-failover-banner" style={{ marginTop: '0.5rem' }}>50x faster than polling!</div>}
          </div>
        </div>
      </div>
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_RT_FUND}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_RT_FUND} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// RT DIAGRAM 2 - Protocols: WebSocket vs SSE vs Long Polling
const TOTAL_RT_PROTO = 5;
const RTProtocolsDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'WebSocket: HTTP upgrade to persistent full-duplex TCP connection',
    'WebSocket: both client and server send data any time - 2 byte overhead',
    'SSE: standard HTTP, server pushes events, client uses separate requests',
    'Long Polling: client requests, server holds open until data available',
    'Choose: WebSocket=bidirectional, SSE=server-push, LongPoll=fallback',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-col arch-col--center">
        {[
          { label: 'WebSocket',     sub: 'Full duplex: 2-byte/msg',     idx: 1, active: activeIdx <= 1 },
          { label: 'SSE',           sub: 'Server push: standard HTTP',  idx: 2, active: activeIdx === 2 },
          { label: 'Long Polling',  sub: 'HTTP hold: fallback only',    idx: 3, active: activeIdx >= 3 },
        ].map((proto, i) => (
          <React.Fragment key={proto.label}>
            <div className={`arch-layer${activeIdx === proto.idx || (proto.idx === 1 && activeIdx === 0) ? ' arch-layer--active' : ''}`} onClick={() => setActiveIdx(proto.idx)}>
              <div className="arch-layer__icon">
                {i === 0 && <NetworkIcon active={activeIdx <= 1} />}
                {i === 1 && <CacheIcon   active={activeIdx === 2} />}
                {i === 2 && <LockIcon    active={activeIdx >= 3} />}
              </div>
              <div className="arch-layer__info">
                <span className="arch-layer__label">{proto.label}</span>
                <span className="arch-layer__sub">{proto.sub}</span>
              </div>
              <div className="arch-layer__latency">{i === 0 ? 'Best' : i === 1 ? 'Good' : 'Last resort'}</div>
            </div>
            {i < 2 && <VertArrow active={activeIdx > proto.idx} label="fallback if needed" />}
          </React.Fragment>
        ))}
      </div>
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_RT_PROTO}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_RT_PROTO} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// RT DIAGRAM 3 - Stream Processing pipeline
const TOTAL_RT_PIPELINE = 5;
const RTStreamPipelineDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'Events generated continuously from user actions or sensors',
    'Filter: remove bots, invalid events, test traffic',
    'Enrich: join with user profile data for context',
    'Aggregate: count events per user per 1-minute window',
    'Serve: results written to Redis and pushed to dashboard',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-row arch-row--center">
        <ArchNode icon={<UserIcon    active={activeIdx === 0} />}  label="Events"      sublabel="Continuous stream"   active={activeIdx === 0} onClick={() => setActiveIdx(0)} />
        <Arrow active={activeIdx >= 1} label="filter" />
        <ArchNode icon={<LockIcon    active={activeIdx === 1} />}  label="Filter"      sublabel="Remove bots"         active={activeIdx === 1} onClick={() => setActiveIdx(1)} />
        <Arrow active={activeIdx >= 2} label="enrich" />
        <ArchNode icon={<DatabaseIcon active={activeIdx === 2} />} label="Enrich"      sublabel="Add user context"    active={activeIdx === 2} onClick={() => setActiveIdx(2)} />
        <Arrow active={activeIdx >= 3} label="aggregate" />
        <ArchNode icon={<CacheIcon   active={activeIdx === 3} />}  label="Aggregate"   sublabel="Count per window"    active={activeIdx === 3} onClick={() => setActiveIdx(3)} />
        <Arrow active={activeIdx >= 4} label="serve" />
        <ArchNode icon={<NetworkIcon active={activeIdx >= 4} />}   label="Dashboard"   sublabel="Real-time results"   active={activeIdx >= 4} onClick={() => setActiveIdx(4)} />
      </div>
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_RT_PIPELINE}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_RT_PIPELINE} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// RT DIAGRAM 4 - Stream Fundamentals: operators
const TOTAL_RT_STREAM = 5;
const RTStreamFundDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'Record arrives: key=user123, value=click_event, timestamp=now',
    'Filter operator: is this a valid click? Keep or discard',
    'Map operator: transform to {user, product, timestamp}',
    'Aggregate: increment counter for user+product in this window',
    'When window closes: emit final count as output record',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-col arch-col--center">
        {[
          { label: 'Record',     sub: 'key+value+timestamp',   idx: 0 },
          { label: 'Filter',     sub: 'Valid click? Yes/No',    idx: 1 },
          { label: 'Map',        sub: 'Extract fields',         idx: 2 },
          { label: 'Aggregate',  sub: 'Count in window',        idx: 3 },
          { label: 'Emit',       sub: 'Output record',          idx: 4 },
        ].map((op, i) => (
          <React.Fragment key={op.label}>
            <div className={`arch-layer${activeIdx === i ? ' arch-layer--active' : ''}`} onClick={() => setActiveIdx(i)}>
              <div className="arch-layer__icon">
                {i === 0 && <UserIcon    active={activeIdx === i} />}
                {i === 1 && <LockIcon    active={activeIdx === i} />}
                {i === 2 && <NetworkIcon active={activeIdx === i} />}
                {i === 3 && <CacheIcon   active={activeIdx === i} />}
                {i === 4 && <ServerIcon  active={activeIdx === i} />}
              </div>
              <div className="arch-layer__info">
                <span className="arch-layer__label">{op.label}</span>
                <span className="arch-layer__sub">{op.sub}</span>
              </div>
              <div className="arch-layer__latency">{i + 1}</div>
            </div>
            {i < 4 && <VertArrow active={activeIdx > i} />}
          </React.Fragment>
        ))}
      </div>
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_RT_STREAM}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_RT_STREAM} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// RT DIAGRAM 5 - Event Streaming Architecture (Kafka)
const TOTAL_RT_KAFKA = 5;
const RTKafkaDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'Producer publishes "order.placed" event to Kafka topic',
    'Kafka stores event permanently in the append-only log',
    'Email Service: subscribes and sends confirmation email',
    'Inventory Service: subscribes and reserves stock independently',
    'New service added: replays full history from Kafka log',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-row arch-row--center">
        <ArchNode icon={<ServerIcon  active={activeIdx === 0} />}  label="Order Svc"   sublabel="order.placed event"  active={activeIdx === 0} onClick={() => setActiveIdx(0)} />
        <Arrow active={activeIdx >= 1} label="publish" />
        <ArchNode icon={<CacheIcon   active={activeIdx >= 1} />}   label="Kafka Topic" sublabel="Persistent log"       active={activeIdx >= 1} onClick={() => setActiveIdx(1)} />
        <Arrow active={activeIdx >= 2} label="fan-out" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          {[['Email Svc','Send email',2],['Inventory Svc','Reserve stock',3],['New Svc','Replay history',4]].map(([s,sub,i]) => (
            <ArchNode key={String(s)} icon={<ServerIcon active={activeIdx >= Number(i)} />} label={String(s)} sublabel={String(sub)} active={activeIdx >= Number(i)} onClick={() => setActiveIdx(Number(i))} />
          ))}
        </div>
      </div>
      {activeIdx >= 4 && <div className="arch-failover-banner">New service replays full history - no producer changes needed</div>}
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_RT_KAFKA}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_RT_KAFKA} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// RT DIAGRAM 6 - Frameworks comparison
const TOTAL_RT_FRAMEWORKS = 5;
const RTFrameworksDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'Stream events arriving in Kafka - which framework to process?',
    'Kafka Streams: library in your app, no cluster, Kafka-to-Kafka',
    'Apache Flink: separate cluster, true event-time, sub-10ms latency',
    'Spark Streaming: micro-batches 1-30s, good if already using Spark',
    'Default choice: Kafka Streams. Use Flink for complex event-time needs',
  ];
  const frameworks = [
    { label: 'Kafka Streams', sub: 'Library: no cluster', idx: 1 },
    { label: 'Apache Flink',  sub: 'Cluster: event-time', idx: 2 },
    { label: 'Spark Streaming', sub: 'Micro-batch: 1-30s', idx: 3 },
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-row arch-row--center">
        <ArchNode icon={<CacheIcon   active={activeIdx === 0} />}  label="Kafka"       sublabel="Event source"        active={activeIdx === 0} onClick={() => setActiveIdx(0)} />
        <Arrow active={activeIdx >= 1} label="choose" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          {frameworks.map(f => (
            <ArchNode key={f.label} icon={<NetworkIcon active={activeIdx === f.idx} />} label={f.label} sublabel={f.sub} active={activeIdx === f.idx} onClick={() => setActiveIdx(f.idx)} />
          ))}
        </div>
      </div>
      {activeIdx === 1 && <div className="arch-failover-banner">Kafka Streams: simplest - no extra infrastructure</div>}
      {activeIdx === 2 && <div className="arch-failover-banner">Flink: most powerful - true event-time, exactly-once</div>}
      {activeIdx === 3 && <div className="arch-failover-banner">Spark: familiar if Spark already used - higher latency</div>}
      {activeIdx >= 4  && <div className="arch-failover-banner">Start with Kafka Streams, upgrade to Flink if needed</div>}
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_RT_FRAMEWORKS}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_RT_FRAMEWORKS} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// RT DIAGRAM 7 - Data Pipeline: CDC + Kafka + processing
const TOTAL_RT_DATAPIPE = 5;
const RTDataPipelineDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'Source: database change captured by Debezium CDC',
    'CDC event published to Kafka topic automatically',
    'Flink processes: transforms, enriches, aggregates',
    'Multi-sink: writes to Elasticsearch + Redis + data warehouse',
    'Search index and cache updated within seconds of DB change',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-row arch-row--center">
        <ArchNode icon={<DatabaseIcon active={activeIdx === 0} />} label="Source DB"   sublabel="Debezium CDC"        active={activeIdx === 0} onClick={() => setActiveIdx(0)} />
        <Arrow active={activeIdx >= 1} label="CDC" />
        <ArchNode icon={<CacheIcon    active={activeIdx >= 1} />}  label="Kafka"       sublabel="Event log"           active={activeIdx >= 1} onClick={() => setActiveIdx(1)} />
        <Arrow active={activeIdx >= 2} label="process" />
        <ArchNode icon={<NetworkIcon  active={activeIdx >= 2} />}  label="Flink"       sublabel="Transform + enrich"  active={activeIdx === 2} onClick={() => setActiveIdx(2)} />
        <Arrow active={activeIdx >= 3} label="multi-sink" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          <ArchNode icon={<LockIcon   active={activeIdx >= 3} />}  label="Elastic"     sublabel="Search index"        active={activeIdx >= 3} />
          <ArchNode icon={<RedisIcon  active={activeIdx >= 3} />}  label="Redis"       sublabel="Cache"               active={activeIdx >= 3} />
        </div>
      </div>
      {activeIdx >= 4 && <div className="arch-failover-banner">End-to-end: DB change to search/cache in under 2 seconds</div>}
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_RT_DATAPIPE}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_RT_DATAPIPE} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// RT DIAGRAM 8 - Event Time vs Processing Time
const TOTAL_RT_EVTTIME = 5;
const RTEventTimeDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'Event occurs: user clicks at exactly 14:00:00',
    'Network delay: event travels 5 minutes due to mobile batching',
    'Arrives at processor at 14:05:00',
    'Processing time: attributed to 14:05 window - WRONG',
    'Event time: use 14:00 timestamp - CORRECT - watermark handles delay',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-row arch-row--center">
        <ArchNode icon={<UserIcon    active={activeIdx === 0} />}  label="Event 14:00"  sublabel="Actual event time"  active={activeIdx === 0} onClick={() => setActiveIdx(0)} />
        <Arrow active={activeIdx >= 1} label="5min delay" />
        <ArchNode icon={<NetworkIcon active={activeIdx >= 1} />}   label="Transit"      sublabel="Mobile buffering"   active={activeIdx === 1} danger={activeIdx === 1} onClick={() => setActiveIdx(1)} />
        <Arrow active={activeIdx >= 2} label="arrives" />
        <ArchNode icon={<ServerIcon  active={activeIdx >= 2} />}   label="Processor"    sublabel="Sees at 14:05"      active={activeIdx >= 2} onClick={() => setActiveIdx(2)} />
      </div>
      <div className="arch-row arch-row--center" style={{ marginTop: '0.75rem' }}>
        <ArchNode icon={<LockIcon    active={activeIdx === 3} />}  label="Proc. Time"   sublabel="14:05 bucket - WRONG" active={activeIdx === 3} danger onClick={() => setActiveIdx(3)} />
        <ArchNode icon={<CacheIcon   active={activeIdx === 4} />}  label="Event Time"   sublabel="14:00 bucket - RIGHT" active={activeIdx >= 4} onClick={() => setActiveIdx(4)} />
      </div>
      {activeIdx === 3 && <div className="arch-danger-banner">Processing time puts event in wrong time bucket!</div>}
      {activeIdx >= 4 && <div className="arch-failover-banner">Event time + watermark: correct window attribution</div>}
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_RT_EVTTIME}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_RT_EVTTIME} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// RT DIAGRAM 9 - Windows
const TOTAL_RT_WINDOWS = 5;
const RTWindowsDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'Tumbling: fixed 1-min non-overlapping buckets, each event in one window',
    'Sliding: 10-min window moves 1-min at a time, events in multiple windows',
    'Session: gaps >30min close window - variable size per activity burst',
    'Window closes when watermark passes end time',
    'Early trigger: emit partial results every 30s while window still open',
  ];
  const windows = [
    { label: 'Tumbling',  sub: '1-min fixed, no overlap', idx: 0 },
    { label: 'Sliding',   sub: '10-min, 1-min step',      idx: 1 },
    { label: 'Session',   sub: 'Gap >30min = new window', idx: 2 },
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-col arch-col--center">
        {windows.map((w, i) => (
          <React.Fragment key={w.label}>
            <div className={`arch-layer${activeIdx === i ? ' arch-layer--active' : ''}`} onClick={() => setActiveIdx(i)}>
              <div className="arch-layer__icon">
                {i === 0 && <LockIcon    active={activeIdx === i} />}
                {i === 1 && <NetworkIcon active={activeIdx === i} />}
                {i === 2 && <UserIcon    active={activeIdx === i} />}
              </div>
              <div className="arch-layer__info">
                <span className="arch-layer__label">{w.label}</span>
                <span className="arch-layer__sub">{w.sub}</span>
              </div>
              <div className="arch-layer__latency">{i + 1}</div>
            </div>
            {i < 2 && <VertArrow active={activeIdx > i} />}
          </React.Fragment>
        ))}
        {activeIdx >= 3 && (
          <>
            <VertArrow active label="watermark" />
            <ArchNode icon={<CacheIcon active />} label="Window Close" sublabel={activeIdx >= 4 ? 'Early trigger every 30s' : 'Emit final result'} active />
          </>
        )}
      </div>
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_RT_WINDOWS}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_RT_WINDOWS} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// RT DIAGRAM 10 - Failure/Practice: consumer lag + WS reconnect
const TOTAL_RT_PRACTICE = 5;
const RTPracticeDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'Normal: 100 events/sec arriving, 100/sec processed - lag = 0',
    'Processing slows: slow DB query makes it 5 events/sec only',
    'Consumer lag grows: 95 events/sec backlog builds',
    'Alert fires at lag > 1,000 events - scale consumers',
    'Recovered: 10 consumers, lag drains, real-time restored',
  ];
  const lags = [0, 0, 950, 10000, 0];
  const lag = lags[Math.min(activeIdx, lags.length - 1)];
  return (
    <div className="arch-diagram">
      <div className="arch-row arch-row--center">
        <ArchNode icon={<CacheIcon   active />}                    label="Kafka"       sublabel="100 events/sec"      active />
        <Arrow active={activeIdx >= 1} label="consume" />
        <ArchNode icon={<ServerIcon  active={activeIdx <= 1} />}   label="Consumer"    sublabel={activeIdx === 1 ? 'Slow: 5/sec' : activeIdx >= 4 ? 'x10 fast' : '100/sec'} active={activeIdx <= 1 || activeIdx >= 4} danger={activeIdx >= 1 && activeIdx <= 3} onClick={() => setActiveIdx(1)} />
        <Arrow active={activeIdx >= 2} label="alert" />
        <ArchNode icon={<WarningIcon active={activeIdx >= 2 && activeIdx <= 3} />} label="Alert" sublabel={lag > 0 ? `Lag: ${lag.toLocaleString()}` : 'Lag: 0'} active={activeIdx >= 2 && activeIdx <= 3} danger={activeIdx === 3} onClick={() => setActiveIdx(3)} />
      </div>
      {activeIdx === 1 && <div className="arch-danger-banner">Slow query: processing 5/sec vs 100/sec arriving</div>}
      {activeIdx === 2 && <div className="arch-danger-banner">Lag at 950 events - alert threshold approaching</div>}
      {activeIdx === 3 && <div className="arch-danger-banner">Lag at 10,000 - critical alert! Scale immediately!</div>}
      {activeIdx >= 4 && <div className="arch-failover-banner">Scaled to 10 consumers - lag draining, real-time restored</div>}
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_RT_PRACTICE}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_RT_PRACTICE} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// ESTIMATION AND CAPACITY PLANNING DIAGRAMS
// ─────────────────────────────────────────────────────────────────────────────

// EST DIAGRAM 1 - Estimation Fundamentals: 4-step process
const TOTAL_EST_FUND = 5;
const ESTFundamentalsDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'Step 1: Establish scale - how many DAU and actions per user?',
    'Step 2: Calculate throughput - daily volume / 86,400 = avg RPS',
    'Step 3: Estimate per-request cost - CPU ms, memory, storage, bytes',
    'Step 4: Total resources = rate * per-request cost',
    'Step 5: Add safety headroom - multiply by 2-3x for spikes',
  ];
  const steps = [
    { label: 'User Scale',      sub: 'DAU + actions/user',   idx: 0 },
    { label: 'Throughput RPS',  sub: 'volume / 86,400',      idx: 1 },
    { label: 'Per-request',     sub: 'CPU + mem + bytes',    idx: 2 },
    { label: 'Total resources', sub: 'rate * cost',          idx: 3 },
    { label: 'Add headroom',    sub: 'x 2-3 safety factor',  idx: 4 },
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-col arch-col--center">
        {steps.map((step, i) => (
          <React.Fragment key={step.label}>
            <div className={`arch-layer${activeIdx === i ? ' arch-layer--active' : ''}`} onClick={() => setActiveIdx(i)}>
              <div className="arch-layer__icon">
                {i === 0 && <UserIcon    active={activeIdx === i} />}
                {i === 1 && <NetworkIcon active={activeIdx === i} />}
                {i === 2 && <ServerIcon  active={activeIdx === i} />}
                {i === 3 && <DatabaseIcon active={activeIdx === i} />}
                {i === 4 && <LockIcon    active={activeIdx === i} />}
              </div>
              <div className="arch-layer__info">
                <span className="arch-layer__label">{step.label}</span>
                <span className="arch-layer__sub">{step.sub}</span>
              </div>
              <div className="arch-layer__latency">{i + 1}</div>
            </div>
            {i < 4 && <VertArrow active={activeIdx > i} />}
          </React.Fragment>
        ))}
      </div>
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_EST_FUND}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_EST_FUND} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// EST DIAGRAM 2 - RPS Calculation
const TOTAL_EST_RPS = 5;
const ESTRPSDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    '500M daily active users on the platform',
    'Each user reads 100 items per day',
    '500M * 100 = 50 billion reads per day',
    '50B / 86,400 seconds = ~578,000 average reads per second',
    'Peak = 3x average = ~1.7M reads per second to provision for',
  ];
  const vals = ['500M DAU', 'x 100 reads', '= 50B/day', '/ 86,400s', 'x 3 peak'];
  return (
    <div className="arch-diagram">
      <div className="arch-eviction">
        <div className="arch-eviction__label">RPS Calculation Steps</div>
        <div className="arch-eviction__slots">
          {vals.map((v, i) => (
            <div key={v}
              className={`arch-eviction__slot${activeIdx === i ? ' arch-eviction__slot--full' : i < activeIdx ? ' arch-eviction__slot--new' : ''}`}
              onClick={() => setActiveIdx(i)}
              style={{ cursor: 'pointer', minWidth: 72, height: 68, fontSize: '0.6rem', padding: '0.25rem' }}>
              <div style={{ fontWeight: 800, fontSize: '0.65rem' }}>{v}</div>
              {activeIdx === i && <div className="arch-node__pulse" />}
            </div>
          ))}
        </div>
        <div style={{ marginTop: '0.75rem', textAlign: 'center' }}>
          {activeIdx >= 3 && <div className="arch-failover-banner">Avg: 578K RPS{activeIdx >= 4 ? ' | Peak: 1.7M RPS' : ''}</div>}
        </div>
      </div>
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_EST_RPS}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_EST_RPS} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// EST DIAGRAM 3 - User + Workload
const TOTAL_EST_USER = 5;
const ESTUserDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    '100M registered users - but only 10% are daily active',
    '10M DAU generate all the actual traffic',
    'Each user performs 50 reads + 2 writes per day',
    '10% of DAU active simultaneously = 1M concurrent users at peak',
    'Growing 20%/month: 10M DAU becomes 74M in 12 months',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-row arch-row--center">
        <ArchNode icon={<UserIcon    active={activeIdx === 0} />}  label="100M Registered" sublabel="Total users"      active={activeIdx === 0} onClick={() => setActiveIdx(0)} />
        <Arrow active={activeIdx >= 1} label="10% active" />
        <ArchNode icon={<UserIcon    active={activeIdx >= 1} />}  label="10M DAU"          sublabel="Traffic sources"  active={activeIdx >= 1} onClick={() => setActiveIdx(1)} />
        <Arrow active={activeIdx >= 2} label="actions" />
        <ArchNode icon={<ServerIcon  active={activeIdx >= 2} />}  label="52 req/user/day"  sublabel="50r + 2w"         active={activeIdx >= 2} onClick={() => setActiveIdx(2)} />
      </div>
      <div className="arch-row arch-row--center" style={{ marginTop: '0.75rem' }}>
        <ArchNode icon={<NetworkIcon active={activeIdx === 3} />} label="1M concurrent"    sublabel="Peak simultaneous" active={activeIdx === 3} onClick={() => setActiveIdx(3)} />
        <Arrow active={activeIdx >= 4} label="x20%/mo" />
        <ArchNode icon={<CacheIcon   active={activeIdx === 4} />} label="74M in 12mo"      sublabel="At 20%/month growth" active={activeIdx === 4} onClick={() => setActiveIdx(4)} />
      </div>
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_EST_USER}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_EST_USER} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// EST DIAGRAM 4 - Storage Estimation
const TOTAL_EST_STORAGE = 5;
const ESTStorageDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'Row size: user_id 8B + text 50B + timestamp 8B + meta 20B = 86B',
    '10M posts per day * 86 bytes = 860MB raw data per day',
    'Add indexes (30% overhead): 860MB * 1.3 = ~1.1GB per day',
    '3x replication: 1.1GB * 3 = 3.3GB actual daily storage',
    '5-year total: 3.3GB * 365 * 5 = ~6TB to provision',
  ];
  const rows = [
    { label: 'Row: 86B',    sub: '8+50+8+20 bytes',   idx: 0 },
    { label: '860MB/day',   sub: '10M * 86B',          idx: 1 },
    { label: '+30% index',  sub: '= 1.1GB/day',        idx: 2 },
    { label: '3x repl',     sub: '= 3.3GB/day',        idx: 3 },
    { label: '5yr: ~6TB',   sub: '3.3*365*5',          idx: 4 },
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-eviction">
        <div className="arch-eviction__label">Storage Calculation</div>
        <div className="arch-eviction__slots">
          {rows.map((r, i) => (
            <div key={r.label}
              className={`arch-eviction__slot${activeIdx === i ? ' arch-eviction__slot--full' : i < activeIdx ? ' arch-eviction__slot--new' : ''}`}
              onClick={() => setActiveIdx(i)}
              style={{ cursor: 'pointer', minWidth: 72, height: 68, fontSize: '0.6rem', padding: '0.25rem' }}>
              <div style={{ fontWeight: 800, fontSize: '0.65rem' }}>{r.label}</div>
              <div style={{ fontSize: '0.52rem', opacity: 0.8 }}>{r.sub}</div>
              {activeIdx === i && <div className="arch-node__pulse" />}
            </div>
          ))}
        </div>
        {activeIdx >= 4 && <div className="arch-failover-banner" style={{ marginTop: '0.75rem' }}>Provision 6TB for 5 years of post data</div>}
      </div>
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_EST_STORAGE}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_EST_STORAGE} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// EST DIAGRAM 5 - Bandwidth
const TOTAL_EST_BW = 5;
const ESTBandwidthDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    '100K peak RPS to your servers',
    'Average response size is 10KB per request',
    '100K * 10KB = 1 GB/s outbound bandwidth needed',
    'CDN handles 95% of traffic: origin needs only 50 MB/s',
    'Internal service calls add 5x more internal bandwidth',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-row arch-row--center">
        <ArchNode icon={<UserIcon    active={activeIdx === 0} />}  label="100K RPS"      sublabel="Peak requests"      active={activeIdx === 0} onClick={() => setActiveIdx(0)} />
        <Arrow active={activeIdx >= 1} label="x 10KB" />
        <ArchNode icon={<NetworkIcon active={activeIdx >= 1} />}   label="1 GB/s"        sublabel="Raw bandwidth need" active={activeIdx === 1} danger={activeIdx === 1} onClick={() => setActiveIdx(1)} />
        <Arrow active={activeIdx >= 2} label="CDN 95%" />
        <ArchNode icon={<CacheIcon   active={activeIdx >= 2} />}   label="CDN Edge"      sublabel="Handles 950K RPS"   active={activeIdx >= 2} onClick={() => setActiveIdx(2)} />
        <Arrow active={activeIdx >= 3} label="miss 5%" />
        <ArchNode icon={<ServerIcon  active={activeIdx >= 3} />}   label="Origin"        sublabel="Only 50 MB/s"       active={activeIdx >= 3} onClick={() => setActiveIdx(3)} />
      </div>
      {activeIdx === 1 && <div className="arch-danger-banner">1 GB/s outbound - exceeds single server NIC!</div>}
      {activeIdx >= 2 && <div className="arch-failover-banner">CDN reduces origin bandwidth 20x</div>}
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_EST_BW}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_EST_BW} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// EST DIAGRAM 6 - CPU + Memory
const TOTAL_EST_CPU = 5;
const ESTCPUDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    '10K peak RPS - how many servers do we need?',
    'Each request uses 20ms of CPU time',
    '8-core server at 70% utilisation handles: 8*1000*0.7/20 = 280 RPS',
    'Servers needed: 10,000 / 280 = 36 servers',
    'Memory check: 1K concurrent * 5MB = 5GB min RAM per server',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-row arch-row--center">
        <ArchNode icon={<UserIcon    active={activeIdx === 0} />}  label="10K peak RPS"  sublabel="To handle"           active={activeIdx === 0} onClick={() => setActiveIdx(0)} />
        <Arrow active={activeIdx >= 1} label="x 20ms" />
        <ArchNode icon={<CacheIcon   active={activeIdx === 1} />}  label="20ms CPU/req"  sublabel="Per request cost"    active={activeIdx === 1} onClick={() => setActiveIdx(1)} />
        <Arrow active={activeIdx >= 2} label="8 cores" />
        <ArchNode icon={<ServerIcon  active={activeIdx >= 2} />}   label="280 RPS"       sublabel="Per 8-core server"   active={activeIdx === 2} onClick={() => setActiveIdx(2)} />
        <Arrow active={activeIdx >= 3} label="= " />
        <ArchNode icon={<DatabaseIcon active={activeIdx >= 3} />}  label="36 servers"    sublabel="10K / 280 = 35.7"    active={activeIdx >= 3} onClick={() => setActiveIdx(3)} />
      </div>
      {activeIdx >= 4 && <div className="arch-failover-banner">Memory: 1K concurrent * 5MB = 5GB min + overhead = 8GB RAM</div>}
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_EST_CPU}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_EST_CPU} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// EST DIAGRAM 7 - Peak Load Forecasting
const TOTAL_EST_PEAK = 5;
const ESTPeakDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'Daily average traffic baseline: 1,000 RPS',
    'Evening peak is typically 3x the daily average: 3,000 RPS',
    'Planned event (product launch) brings 10x spike: 10,000 RPS',
    'Provision infrastructure for the event peak: 10K RPS',
    'At +20%/month growth: plan next scale-up in 3 months',
  ];
  const levels = [
    { label: 'Avg: 1K RPS',   color: '#7C5CFC', pct: 10 },
    { label: 'Peak: 3K RPS',  color: '#E97316', pct: 30 },
    { label: 'Event: 10K RPS', color: '#DC2626', pct: 100 },
    { label: 'Provision 10K', color: '#22c55e', pct: 100 },
    { label: 'Growth runway',  color: '#7C5CFC', pct: 60 },
  ];
  const level = levels[Math.min(activeIdx, levels.length - 1)];
  return (
    <div className="arch-diagram">
      <div className="arch-row arch-row--center">
        <ArchNode icon={<NetworkIcon active={activeIdx >= 2} />}   label="Traffic Level"  sublabel={level.label}        active={activeIdx >= 1} danger={activeIdx === 2} onClick={() => setActiveIdx(activeIdx < 4 ? activeIdx + 1 : 0)} />
        <Arrow active label="compare to" />
        <ArchNode icon={<ServerIcon  active={activeIdx >= 3} />}   label="Provisioned"    sublabel="10K RPS capacity"   active={activeIdx >= 3} onClick={() => setActiveIdx(3)} />
      </div>
      <div style={{ background: '#F0EEFF', borderRadius: 8, padding: '0.75rem', margin: '0.5rem 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', marginBottom: 4, fontWeight: 700, color: '#24212B' }}>
          <span>Traffic Load</span><span style={{ color: level.color }}>{level.label}</span>
        </div>
        <div style={{ background: '#E5E0EF', borderRadius: 4, height: 16, overflow: 'hidden' }}>
          <div style={{ background: level.color, height: '100%', width: level.pct + '%', borderRadius: 4, transition: 'width 0.5s, background 0.3s' }} />
        </div>
      </div>
      {activeIdx === 2 && <div className="arch-danger-banner">Event spike 10x over average - must provision for this</div>}
      {activeIdx >= 3 && <div className="arch-failover-banner">Provision for peak + 3-month growth runway</div>}
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_EST_PEAK}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_EST_PEAK} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// EST DIAGRAM 8 - Back-of-the-Envelope
const TOTAL_EST_BOTE = 5;
const ESTBOTEDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'State assumptions clearly: 500M DAU, 10 actions per user per day',
    'Calculate daily volume: 500M * 10 = 5 billion actions per day',
    'Convert to RPS: 5B / 86,400 = ~58,000 average RPS',
    'Apply peak multiplier: 58K * 3x = 175,000 peak RPS',
    'Add 2x safety margin: 175K * 2 = 350K RPS to provision for',
  ];
  const vals = ['500M DAU', 'x10 actions', '= 5B/day', '/ 86,400', 'x3 peak', 'x2 safety'];
  const show = Math.min(activeIdx + 2, vals.length);
  return (
    <div className="arch-diagram">
      <div className="arch-eviction">
        <div className="arch-eviction__label">Back-of-the-Envelope Template</div>
        <div className="arch-eviction__slots" style={{ flexWrap: 'wrap', justifyContent: 'center', gap: '0.4rem' }}>
          {vals.slice(0, show).map((v, i) => (
            <div key={v}
              className={`arch-eviction__slot${i === activeIdx ? ' arch-eviction__slot--full' : ' arch-eviction__slot--new'}`}
              onClick={() => setActiveIdx(Math.min(i, 4))}
              style={{ cursor: 'pointer', minWidth: 72, height: 60, fontSize: '0.65rem', padding: '0.25rem' }}>
              <div style={{ fontWeight: 800 }}>{v}</div>
            </div>
          ))}
        </div>
        {activeIdx >= 4 && <div className="arch-failover-banner" style={{ marginTop: '0.75rem' }}>Result: provision for 350K RPS</div>}
      </div>
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_EST_BOTE}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_EST_BOTE} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// EST DIAGRAM 9 - Resource Utilization Optimization
const TOTAL_EST_UTIL = 5;
const ESTUtilDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'Measure: servers running at 10% CPU utilisation for 30 days',
    'At 10%: paying for 90% of capacity that sits idle',
    'Right-size: downsize to 20% of current servers at 50% utilisation',
    'Add caching: 90% cache hit rate cuts DB queries by 10x',
    'Result: same performance at 50% less infrastructure cost',
  ];
  const utils = [10, 10, 50, 50, 50];
  const serverCounts = [10, 10, 2, 2, 2];
  const util = utils[activeIdx];
  return (
    <div className="arch-diagram">
      <div style={{ background: '#F0EEFF', borderRadius: 8, padding: '0.75rem', margin: '0 0 0.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', marginBottom: 4, fontWeight: 700, color: '#24212B' }}>
          <span>CPU Utilisation ({serverCounts[activeIdx]} servers)</span>
          <span style={{ color: util < 30 ? '#DC2626' : '#22c55e' }}>{util}%</span>
        </div>
        <div style={{ background: '#E5E0EF', borderRadius: 4, height: 20, overflow: 'hidden' }}>
          <div style={{ background: util < 30 ? '#DC2626' : '#7C5CFC', height: '100%', width: util + '%', borderRadius: 4, transition: 'all 0.5s' }} />
        </div>
      </div>
      {activeIdx === 1 && <div className="arch-danger-banner">10% utilisation: paying for 90% idle capacity</div>}
      {activeIdx === 2 && <div className="arch-failover-banner">Right-sized: 50% utilisation on 2 servers</div>}
      {activeIdx >= 3 && <div className="arch-failover-banner">Cache + right-size: 50% cost saving</div>}
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_EST_UTIL}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_EST_UTIL} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// EST DIAGRAM 10 - Full Walkthrough (URL Shortener)
const TOTAL_EST_WALK = 5;
const ESTWalkthroughDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    '100M DAU, 1% create a short URL daily = 1M new URLs/day',
    '11.6 write RPS, 10 redirects per URL = 115 read RPS',
    'Read:write ratio = 10:1 - cache-heavy read architecture',
    'Storage: 1M * 500B = 500MB/day, 5yr * 3x replication = 2.7TB',
    'Result: 1 small DB server + 1 Redis cache handles this system',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-row arch-row--center">
        <ArchNode icon={<UserIcon    active={activeIdx === 0} />}  label="100M DAU"      sublabel="1% write daily"     active={activeIdx === 0} onClick={() => setActiveIdx(0)} />
        <Arrow active={activeIdx >= 1} label="1M URLs/day" />
        <ArchNode icon={<NetworkIcon active={activeIdx >= 1} />}   label="URL System"    sublabel="11.6w + 115r RPS"   active={activeIdx >= 1} onClick={() => setActiveIdx(1)} />
      </div>
      <div className="arch-row arch-row--center" style={{ marginTop: '0.75rem' }}>
        <ArchNode icon={<RedisIcon   active={activeIdx >= 2} />}   label="Redis Cache"   sublabel="Serves 95% reads"   active={activeIdx >= 2} onClick={() => setActiveIdx(2)} />
        <Arrow active={activeIdx >= 3} label="miss" />
        <ArchNode icon={<DatabaseIcon active={activeIdx >= 3} />}  label="1 DB Server"   sublabel="2.7TB over 5 years" active={activeIdx >= 3} onClick={() => setActiveIdx(3)} />
      </div>
      {activeIdx >= 4 && <div className="arch-failover-banner">Surprisingly small: 1 DB + 1 Redis cache is sufficient!</div>}
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_EST_WALK}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_EST_WALK} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// RELIABILITY PATTERNS DIAGRAMS
// ─────────────────────────────────────────────────────────────────────────────

// RP DIAGRAM 1 - Fundamentals: defense in depth
const TOTAL_RP_FUND = 5;
const RPFundamentalsDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'Downstream service starts failing - triggering reliability patterns',
    'Timeout fires: request does not wait forever - fails fast',
    'Retry with backoff: transient failure resolved on second attempt',
    'Circuit breaker opens: repeated failures stop calls to failing service',
    'Fallback serves: degraded but working response returned to user',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-col arch-col--center">
        {[
          { label: 'Timeout',         sub: 'Fail fast - no waiting forever', idx: 1 },
          { label: 'Retry + Backoff', sub: 'Handle transient failures',       idx: 2 },
          { label: 'Circuit Breaker', sub: 'Stop calling failing service',    idx: 3 },
          { label: 'Fallback',        sub: 'Serve degraded response',         idx: 4 },
        ].map((step, i) => (
          <React.Fragment key={step.label}>
            <div className={`arch-layer${activeIdx === step.idx ? ' arch-layer--active' : ''}`} onClick={() => setActiveIdx(step.idx)}>
              <div className="arch-layer__icon">
                {i === 0 && <LockIcon    active={activeIdx === step.idx} />}
                {i === 1 && <NetworkIcon active={activeIdx === step.idx} />}
                {i === 2 && <WarningIcon active={activeIdx === step.idx} />}
                {i === 3 && <CacheIcon   active={activeIdx === step.idx} />}
              </div>
              <div className="arch-layer__info">
                <span className="arch-layer__label">{step.label}</span>
                <span className="arch-layer__sub">{step.sub}</span>
              </div>
              <div className="arch-layer__latency">{i + 1}</div>
            </div>
            {i < 3 && <VertArrow active={activeIdx > step.idx} />}
          </React.Fragment>
        ))}
      </div>
      {activeIdx === 0 && <div className="arch-danger-banner">Failure detected - reliability patterns activate</div>}
      {activeIdx >= 4  && <div className="arch-failover-banner">Defense in depth: multiple layers catch different failures</div>}
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_RP_FUND}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_RP_FUND} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// RP DIAGRAM 2 - Fault Isolation
const TOTAL_RP_ISOLATION = 5;
const RPIsolationDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'Service A crashes unexpectedly',
    'Without isolation: failure spreads to B, C, D - cascade',
    'With isolation: failure contained to Service A only',
    'Services B, C, D remain unaffected and serving traffic',
    'Service A restarts and rejoins - other services never noticed',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-row arch-row--center">
        <ArchNode icon={<ServerIcon  active={activeIdx === 0} />}  label="Service A"   sublabel={activeIdx === 0 ? 'CRASHED' : activeIdx >= 4 ? 'Recovered' : 'Down'} active={activeIdx === 0 || activeIdx >= 4} danger={activeIdx >= 1 && activeIdx <= 3} onClick={() => setActiveIdx(0)} />
        <Arrow active={activeIdx >= 2} label="isolated" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          {['Service B','Service C','Service D'].map(s => (
            <ArchNode key={s} icon={<ServerIcon active={activeIdx >= 2} />} label={s} sublabel={activeIdx >= 2 ? 'Unaffected' : activeIdx === 1 ? 'Cascading!' : 'Running'} active={activeIdx >= 2} danger={activeIdx === 1} onClick={() => setActiveIdx(2)} />
          ))}
        </div>
      </div>
      {activeIdx === 1 && <div className="arch-danger-banner">No isolation: A failure cascades to B, C, D</div>}
      {activeIdx >= 2 && activeIdx <= 3 && <div className="arch-failover-banner">With isolation: blast radius contained to A only</div>}
      {activeIdx >= 4 && <div className="arch-failover-banner">A recovered - B, C, D never noticed the failure</div>}
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_RP_ISOLATION}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_RP_ISOLATION} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// RP DIAGRAM 3 - Circuit Breaker: 3 states
const TOTAL_RP_CB = 5;
const RPCircuitBreakerDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'CLOSED: normal operation - calls pass through and are monitored',
    'Failure rate spikes above 50% threshold in 10-second window',
    'OPEN: all calls immediately return error - no waiting for timeout',
    'After 30s cooldown: HALF-OPEN - one test request allowed through',
    'Test succeeds: CLOSED again - normal traffic resumes',
  ];
  const states = ['CLOSED', 'FAILING', 'OPEN', 'HALF-OPEN', 'CLOSED'];
  const colors = ['#7C5CFC', '#DC2626', '#DC2626', '#E97316', '#22c55e'];
  return (
    <div className="arch-diagram">
      <div className="arch-row arch-row--center">
        <ArchNode icon={<UserIcon    active />}                      label="Caller"      sublabel="Makes requests"      active />
        <Arrow active={activeIdx !== 2} label={activeIdx === 2 ? 'BLOCKED' : 'calls'} />
        <ArchNode icon={<LockIcon    active={activeIdx !== 2} />}    label="Circuit Breaker" sublabel={states[activeIdx]} active={activeIdx !== 2} danger={activeIdx === 2 || activeIdx === 1} onClick={() => setActiveIdx(activeIdx + 1 < 5 ? activeIdx + 1 : 0)} />
        <Arrow active={activeIdx !== 2} label={activeIdx === 2 ? '' : 'to'} />
        <ArchNode icon={<ServerIcon  active={activeIdx !== 2} />}    label="Service B"   sublabel={activeIdx === 1 ? 'FAILING' : 'Downstream'} active={activeIdx !== 1 && activeIdx !== 2} danger={activeIdx === 1 || activeIdx === 2} onClick={() => setActiveIdx(1)} />
      </div>
      <div className="arch-step-info" style={{ borderTop: `2px solid ${colors[activeIdx]}` }}>
        <span className="arch-step-pill" style={{ background: colors[activeIdx] }}>{activeIdx + 1} / {TOTAL_RP_CB}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      {activeIdx === 2 && <div className="arch-danger-banner">OPEN: instant error - no thread blocked waiting</div>}
      {activeIdx === 3 && <div className="arch-failover-banner">HALF-OPEN: probe request tests recovery</div>}
      {activeIdx === 4 && <div className="arch-failover-banner">CLOSED: test passed - full traffic resumed</div>}
      <StepNav activeIdx={activeIdx} total={TOTAL_RP_CB} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// RP DIAGRAM 4 - Retry + Backoff + Jitter
const TOTAL_RP_RETRY = 5;
const RPRetryDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'Request fails with network timeout - transient error',
    'Retry 1: wait 1 second then retry',
    'Retry 2: wait 2 seconds (doubled) + jitter then retry',
    'Retry 3: wait 4 seconds (doubled again) + jitter then retry',
    'Success: transient issue resolved - request completes',
  ];
  const waits = ['timeout', '1s wait', '2s+jitter', '4s+jitter', 'success!'];
  return (
    <div className="arch-diagram">
      <div className="arch-row arch-row--center">
        <ArchNode icon={<UserIcon    active={activeIdx === 0} />}  label="Caller"      sublabel="Makes request"       active={activeIdx === 0} onClick={() => setActiveIdx(0)} />
        <Arrow active label="attempt" />
        <ArchNode icon={<NetworkIcon active={activeIdx >= 1} />}   label="Retry Logic" sublabel={waits[activeIdx]}    active={activeIdx >= 1} onClick={() => setActiveIdx(activeIdx < 4 ? activeIdx + 1 : 0)} />
        <Arrow active={activeIdx >= 1} label="retry" />
        <ArchNode icon={<ServerIcon  active={activeIdx === 4} />}  label="Service"     sublabel={activeIdx === 4 ? 'Success!' : 'Failing'} active={activeIdx === 4} danger={activeIdx >= 1 && activeIdx <= 3} onClick={() => setActiveIdx(4)} />
      </div>
      {activeIdx === 0 && <div className="arch-danger-banner">Timeout - transient failure detected</div>}
      {activeIdx >= 1 && activeIdx <= 3 && <div className="arch-failover-banner">Exponential backoff: {waits[activeIdx]} before retry {activeIdx}</div>}
      {activeIdx >= 4 && <div className="arch-failover-banner">Retry succeeded - transient failure handled transparently</div>}
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_RP_RETRY}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_RP_RETRY} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// RP DIAGRAM 5 - Timeout
const TOTAL_RP_TIMEOUT = 5;
const RPTimeoutDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'Service A sends request to Service B',
    'Service B is slow - no response arriving',
    '500ms timeout fires - A stops waiting',
    'Thread freed: A can now serve other requests',
    'Error or fallback returned quickly to the caller',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-row arch-row--center">
        <ArchNode icon={<ServerIcon  active={activeIdx === 0} />}  label="Service A"   sublabel={activeIdx === 2 ? 'Thread freed!' : 'Waiting...'} active={activeIdx === 0 || activeIdx >= 2} danger={activeIdx === 1} onClick={() => setActiveIdx(0)} />
        <Arrow active={activeIdx >= 0} label={activeIdx >= 2 ? 'timeout!' : 'request'} />
        <ArchNode icon={<LockIcon    active={activeIdx === 2} />}  label="Timeout"     sublabel="500ms limit"         active={activeIdx === 2} onClick={() => setActiveIdx(2)} />
        <Arrow active={activeIdx >= 0} label={activeIdx === 1 ? 'slow...' : ''} />
        <ArchNode icon={<ServerIcon  active={activeIdx === 0} />}  label="Service B"   sublabel={activeIdx === 1 ? 'Too slow' : 'Downstream'} active={activeIdx === 0} danger={activeIdx >= 1} onClick={() => setActiveIdx(1)} />
      </div>
      {activeIdx === 1 && <div className="arch-danger-banner">B not responding - thread blocked waiting...</div>}
      {activeIdx === 2 && <div className="arch-failover-banner">Timeout fires at 500ms - thread immediately freed</div>}
      {activeIdx >= 4 && <div className="arch-failover-banner">Caller gets fast error - not stuck waiting 30 seconds</div>}
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_RP_TIMEOUT}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_RP_TIMEOUT} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// RP DIAGRAM 6 - Bulkhead
const TOTAL_RP_BULKHEAD = 5;
const RPBulkheadDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const withBulkhead = activeIdx >= 3;
  const descs = [
    'Without bulkhead: B, C, D share a single pool of 20 threads',
    'Service B becomes slow - starts consuming threads',
    'B fills all 20 threads - C and D have no threads, appear down',
    'With bulkhead: B:10 threads, C:5 threads, D:5 threads',
    'B fills its 10 - C and D still have their own threads and serve normally',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-two-path">
        <div className={`arch-path${!withBulkhead ? ' arch-path--active' : ''}`}>
          <div className="arch-path__label arch-path__label--read">NO BULKHEAD</div>
          <div className="arch-row arch-row--col">
            <ArchNode icon={<CacheIcon  active={activeIdx <= 2} />} label="20 threads" sublabel="Shared pool"        active={activeIdx === 0} danger={activeIdx === 2} onClick={() => setActiveIdx(1)} />
            <VertArrow active={activeIdx >= 1} label="B takes all" />
            <div className="arch-row arch-row--center" style={{ gap: '0.25rem' }}>
              {['B slow','C DOWN','D DOWN'].map((s, i) => (
                <ArchNode key={s} icon={<ServerIcon active={i === 0 && activeIdx === 1} />} label={s} sublabel="" active={i === 0 && activeIdx >= 1} danger={i > 0 && activeIdx === 2} onClick={() => setActiveIdx(2)} />
              ))}
            </div>
            {activeIdx === 2 && <div className="arch-danger-banner" style={{ marginTop: '0.5rem' }}>C and D starved of threads!</div>}
          </div>
        </div>
        <div className="arch-path-divider" />
        <div className={`arch-path${withBulkhead ? ' arch-path--active' : ''}`}>
          <div className="arch-path__label arch-path__label--write">WITH BULKHEAD</div>
          <div className="arch-row arch-row--col">
            <div className="arch-row arch-row--center" style={{ gap: '0.25rem' }}>
              <ArchNode icon={<CacheIcon  active={activeIdx === 4} />} label="B: 10" sublabel={activeIdx === 4 ? 'Full-isolated' : 'threads'} active={activeIdx >= 3} danger={activeIdx === 4} onClick={() => setActiveIdx(4)} />
              <ArchNode icon={<CacheIcon  active={activeIdx >= 3} />}  label="C: 5"  sublabel="OK"       active={activeIdx >= 3} onClick={() => setActiveIdx(4)} />
              <ArchNode icon={<CacheIcon  active={activeIdx >= 3} />}  label="D: 5"  sublabel="OK"       active={activeIdx >= 3} onClick={() => setActiveIdx(4)} />
            </div>
            {activeIdx >= 4 && <div className="arch-failover-banner" style={{ marginTop: '0.5rem' }}>B isolated - C and D serve normally</div>}
          </div>
        </div>
      </div>
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_RP_BULKHEAD}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_RP_BULKHEAD} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// RP DIAGRAM 7 - Failover and Redundancy
const TOTAL_RP_FAILOVER = 5;
const RPFailoverDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'Primary handles all traffic - standby waits in reserve',
    'Health check detects primary failure',
    'Failover triggers: VIP reassigned to standby in under 30 seconds',
    'Standby becomes new primary - traffic flows normally',
    'Old primary rebuilt and becomes the new standby',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-row arch-row--center">
        <ArchNode icon={<UserIcon    active />}                     label="Traffic"     sublabel="All requests"        active />
        <Arrow active label="to" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <ArchNode icon={<ServerIcon  active={activeIdx <= 1} />}  label="Primary"     sublabel={activeIdx >= 2 ? 'FAILED' : 'Active'} active={activeIdx <= 1} danger={activeIdx >= 2 && activeIdx <= 3} onClick={() => setActiveIdx(1)} />
          <ArchNode icon={<ServerIcon  active={activeIdx >= 2} />}  label="Standby"     sublabel={activeIdx >= 3 ? 'Now PRIMARY' : 'Standby'} active={activeIdx >= 3} onClick={() => setActiveIdx(3)} />
        </div>
        <ArchNode icon={<NetworkIcon active={activeIdx === 2} />}   label="Health Check" sublabel="Detects failure"   active={activeIdx === 2} onClick={() => setActiveIdx(2)} />
      </div>
      {activeIdx === 2 && <div className="arch-danger-banner">Primary failed - health check triggered failover</div>}
      {activeIdx >= 3 && <div className="arch-failover-banner">Failover complete - standby serving all traffic</div>}
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_RP_FAILOVER}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_RP_FAILOVER} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// RP DIAGRAM 8 - Graceful Degradation
const TOTAL_RP_DEGRADE = 5;
const RPDegradeDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'Product page depends on multiple services',
    'Recommendation service goes down - circuit breaker opens',
    'Fallback: return cached popular items instead of personalised ones',
    'Core product page (title, price, cart) is unaffected',
    'User sees degraded but functional page - not an error',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-row arch-row--center">
        <ArchNode icon={<ServerIcon  active={activeIdx >= 0} />}   label="Product Page" sublabel="Always works"       active />
        <Arrow active={activeIdx >= 2} label="fallback" />
        <ArchNode icon={<CacheIcon   active={activeIdx >= 2} />}   label="Cached Items" sublabel="Generic popular"    active={activeIdx >= 2} onClick={() => setActiveIdx(2)} />
      </div>
      <div className="arch-row arch-row--center" style={{ marginTop: '0.75rem' }}>
        <ArchNode icon={<DatabaseIcon active={activeIdx >= 0} />}  label="Catalog Svc"  sublabel="Core - always up"   active />
        <ArchNode icon={<ServerIcon   active={activeIdx === 0} />} label="Reco Svc"     sublabel={activeIdx >= 1 ? 'DOWN' : 'Running'} active={activeIdx === 0} danger={activeIdx >= 1} onClick={() => setActiveIdx(1)} />
        <ArchNode icon={<LockIcon     active={activeIdx === 1} />} label="Circuit Open" sublabel="No calls to Reco"   active={activeIdx === 1} onClick={() => setActiveIdx(1)} />
      </div>
      {activeIdx === 1 && <div className="arch-danger-banner">Recommendation service down - circuit open</div>}
      {activeIdx >= 2 && <div className="arch-failover-banner">Fallback: cached items shown - no error page</div>}
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_RP_DEGRADE}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_RP_DEGRADE} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// RP DIAGRAM 9 - Health Checks and Self-Healing
const TOTAL_RP_HEALTH = 5;
const RPHealthDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'Load balancer pings /health every 5 seconds on each instance',
    'Instance DB pool exhausted - health check returns 503',
    'Instance removed from load balancer rotation automatically',
    'Kubernetes liveness probe fails - container restarted',
    'Readiness probe passes - instance added back to rotation',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-row arch-row--center">
        <ArchNode icon={<NetworkIcon active={activeIdx >= 0} />}   label="Load Balancer" sublabel="Pings /health 5s" active />
        <Arrow active={activeIdx >= 1} label="503!" />
        <ArchNode icon={<ServerIcon  active={activeIdx <= 1} />}   label="Instance"      sublabel={activeIdx === 1 ? 'DB pool full' : activeIdx >= 2 && activeIdx <= 3 ? 'Restarting' : activeIdx >= 4 ? 'Healthy' : 'Running'} active={activeIdx === 0 || activeIdx >= 4} danger={activeIdx >= 1 && activeIdx <= 3} onClick={() => setActiveIdx(1)} />
      </div>
      <div className="arch-row arch-row--center" style={{ marginTop: '0.75rem' }}>
        <ArchNode icon={<LockIcon    active={activeIdx === 2} />}  label="Removed"       sublabel="From LB pool"      active={activeIdx === 2} onClick={() => setActiveIdx(2)} />
        <Arrow active={activeIdx >= 3} label="restart" />
        <ArchNode icon={<CacheIcon   active={activeIdx === 3} />}  label="K8s Restart"   sublabel="Liveness failed"   active={activeIdx === 3} onClick={() => setActiveIdx(3)} />
        <Arrow active={activeIdx >= 4} label="ready!" />
        <ArchNode icon={<NetworkIcon active={activeIdx >= 4} />}   label="Re-added"      sublabel="Readiness OK"      active={activeIdx >= 4} onClick={() => setActiveIdx(4)} />
      </div>
      {activeIdx === 1 && <div className="arch-danger-banner">Health check: DB pool exhausted - returns 503</div>}
      {activeIdx === 2 && <div className="arch-failover-banner">Removed from rotation - no traffic sent</div>}
      {activeIdx >= 4 && <div className="arch-failover-banner">Self-healed: instance healthy and serving again</div>}
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_RP_HEALTH}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_RP_HEALTH} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// RP DIAGRAM 10 - Rate Limiting and Load Shedding
const TOTAL_RP_RATELIMIT = 5;
const RPRateLimitDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'Traffic spike: 1000 req/sec arriving - capacity is 500/sec',
    'Per-client rate limiter: heavy user at 200/min - cap 100/min',
    'Excess requests rejected with 429 Too Many Requests',
    'System at 85% CPU: load shedding drops low-priority batch jobs',
    'Core user-facing traffic served at full speed - system stable',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-stampede">
        <div className="arch-stampede__users">
          {['Client 1','Client 2','Batch','...'].map(c => (
            <div key={c} className={`arch-stampede__user${activeIdx >= 1 ? ' arch-stampede__user--flood' : ''}`}>
              <UserIcon active={activeIdx >= 1} />
              <span>{c}</span>
            </div>
          ))}
        </div>
        <Arrow active={activeIdx >= 1} label={activeIdx >= 1 ? 'spike!' : 'requests'} />
        <div className="arch-stampede__center">
          <ArchNode icon={<LockIcon    active={activeIdx >= 1} />}  label="Rate Limiter"  sublabel={activeIdx >= 2 ? '429 excess' : 'Checking'} active={activeIdx >= 1} onClick={() => setActiveIdx(2)} />
          {activeIdx >= 3 && <><VertArrow active label="overload" /><ArchNode icon={<NetworkIcon active />} label="Load Shed" sublabel="Drop batch jobs" active /></>}
          {activeIdx >= 4 && <><VertArrow active label="stable" /><ArchNode icon={<ServerIcon active />} label="Core APIs" sublabel="Full speed" active /></>}
        </div>
      </div>
      {activeIdx === 0 && <div className="arch-danger-banner">Traffic spike: 2x capacity arriving</div>}
      {activeIdx >= 2 && activeIdx <= 3 && <div className="arch-danger-banner">429 sent to excess clients - load shed batch work</div>}
      {activeIdx >= 4  && <div className="arch-failover-banner">System stable - user-facing APIs unaffected</div>}
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_RP_RATELIMIT}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_RP_RATELIMIT} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// DISTRIBUTED SYSTEMS DIAGRAMS
// ─────────────────────────────────────────────────────────────────────────────

// DS DIAGRAM 1 - Fundamentals: single node vs distributed + partial failure
const TOTAL_DS_FUND = 5;
const DSFundamentalsDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'Single node: simple but limited by one machine\'s capacity',
    'Add nodes: more capacity and availability - new problems appear',
    'Network call between nodes: can fail, be lost, or timeout',
    'Partial failure: Node B crashes while A and C continue working',
    'Handle gracefully: retry, fallback, or fail with clear error',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-row arch-row--center">
        <ArchNode icon={<ServerIcon  active={activeIdx <= 1} />}  label="Node A"      sublabel="Still running"      active={activeIdx <= 1} onClick={() => setActiveIdx(0)} />
        <Arrow active={activeIdx >= 2} label="RPC call" />
        <ArchNode icon={<ServerIcon  active={activeIdx === 1} />} label="Node B"      sublabel={activeIdx >= 3 ? 'CRASHED' : 'Running'} active={activeIdx === 1} danger={activeIdx >= 3} onClick={() => setActiveIdx(3)} />
        <Arrow active={activeIdx >= 1} label="sync" />
        <ArchNode icon={<ServerIcon  active={activeIdx >= 1} />}  label="Node C"      sublabel="Still running"      active={activeIdx >= 1} onClick={() => setActiveIdx(1)} />
      </div>
      {activeIdx === 2 && <div className="arch-danger-banner">Network call can fail, timeout, or be lost - ambiguous!</div>}
      {activeIdx === 3 && <div className="arch-danger-banner">Partial failure: B crashed, A and C still serve traffic</div>}
      {activeIdx >= 4  && <div className="arch-failover-banner">Retry with backoff, circuit break, or fallback response</div>}
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_DS_FUND}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_DS_FUND} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// DS DIAGRAM 2 - Architecture: leader, followers, coordinator
const TOTAL_DS_ARCH = 5;
const DSArchDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'Leader node accepts all writes and coordinates replication',
    'Writes replicated to follower nodes for durability',
    'Reads distributed across followers for scalability',
    'Coordination service (etcd/ZooKeeper) manages leader election',
    'Sharding: data partitioned across multiple independent groups',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-row arch-row--center">
        <ArchNode icon={<NetworkIcon active={activeIdx === 3} />} label="etcd/ZooKeeper" sublabel="Leader election" active={activeIdx === 3} onClick={() => setActiveIdx(3)} />
        <Arrow active={activeIdx >= 0} label="elects" />
        <ArchNode icon={<ServerIcon  active={activeIdx <= 2} />}  label="Leader"       sublabel="Accepts writes"     active={activeIdx <= 1} onClick={() => setActiveIdx(0)} />
        <Arrow active={activeIdx >= 1} label="replicate" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          {['Follower 1','Follower 2'].map(f => (
            <ArchNode key={f} icon={<ServerIcon active={activeIdx >= 1} />} label={f} sublabel={activeIdx >= 2 ? 'Serves reads' : 'Syncing'} active={activeIdx >= 1} onClick={() => setActiveIdx(2)} />
          ))}
        </div>
      </div>
      {activeIdx >= 4 && <div className="arch-failover-banner">Sharding: each partition group is independent</div>}
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_DS_ARCH}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_DS_ARCH} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// DS DIAGRAM 3 - Communication: RPC timeout + retry + heartbeat
const TOTAL_DS_COMM = 5;
const DSCommDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'Node A makes RPC call to Node B over the network',
    'No response after 500ms timeout - what happened to B?',
    'Ambiguity: B crashed? Network lost it? B is slow?',
    'Retry with idempotency key - safe to repeat the operation',
    'Heartbeat: B pings every 5s - silence = B is assumed down',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-row arch-row--center">
        <ArchNode icon={<ServerIcon  active={activeIdx === 0} />} label="Node A"      sublabel="Makes RPC call"     active={activeIdx === 0} onClick={() => setActiveIdx(0)} />
        <Arrow active={activeIdx >= 0} label={activeIdx >= 1 ? 'timeout!' : 'RPC call'} />
        <ArchNode icon={<ServerIcon  active={activeIdx === 0} />} label="Node B"      sublabel={activeIdx >= 1 ? '???' : 'Responding'} active={activeIdx === 0} danger={activeIdx >= 1 && activeIdx <= 2} onClick={() => setActiveIdx(1)} />
      </div>
      <div className="arch-row arch-row--center" style={{ marginTop: '0.75rem' }}>
        <ArchNode icon={<LockIcon    active={activeIdx === 3} />} label="Idempotent"  sublabel="Safe retry key"     active={activeIdx === 3} onClick={() => setActiveIdx(3)} />
        <Arrow active={activeIdx >= 4} label="heartbeat" />
        <ArchNode icon={<NetworkIcon active={activeIdx === 4} />} label="Heartbeat"   sublabel="5s ping - detect fail" active={activeIdx === 4} onClick={() => setActiveIdx(4)} />
      </div>
      {activeIdx === 1 && <div className="arch-danger-banner">500ms timeout - no response from B!</div>}
      {activeIdx === 2 && <div className="arch-danger-banner">Cannot distinguish: crash vs partition vs slow</div>}
      {activeIdx === 3 && <div className="arch-failover-banner">Retry with idempotency key - processing twice is safe</div>}
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_DS_COMM}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_DS_COMM} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// DS DIAGRAM 4 - Clocks and Ordering
const TOTAL_DS_CLOCKS = 5;
const DSClocksDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'Physical clocks drift: A=10:00:00.030, B=10:00:00.010 (B is behind)',
    'Event on B at 10:00:00.020 appears to predate A\'s at 10:00:00.030',
    'But B\'s event may have happened AFTER A\'s - timestamps wrong',
    'Lamport clock: logical counter, increment on send/receive',
    'Vector clock: per-node counters - detect truly concurrent events',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-row arch-row--center">
        <ArchNode icon={<ServerIcon  active={activeIdx <= 2} />} label="Node A"      sublabel={activeIdx <= 2 ? 'Clock: .030' : 'Lamport: 3'} active={activeIdx <= 2} danger={activeIdx === 1 || activeIdx === 2} onClick={() => setActiveIdx(0)} />
        <Arrow active={activeIdx >= 3} label="Lamport msg" />
        <ArchNode icon={<ServerIcon  active={activeIdx <= 2} />} label="Node B"      sublabel={activeIdx <= 2 ? 'Clock: .010 (drifted)' : 'Lamport: 4'} active={activeIdx <= 2} danger={activeIdx === 1 || activeIdx === 2} onClick={() => setActiveIdx(1)} />
      </div>
      <div className="arch-row arch-row--center" style={{ marginTop: '0.75rem' }}>
        <ArchNode icon={<CacheIcon   active={activeIdx === 3} />} label="Lamport"    sublabel="max(local,recv)+1"   active={activeIdx === 3} onClick={() => setActiveIdx(3)} />
        <Arrow active={activeIdx >= 4} label="richer" />
        <ArchNode icon={<NetworkIcon active={activeIdx === 4} />} label="Vector"     sublabel="[A:3, B:2, C:1]"     active={activeIdx === 4} onClick={() => setActiveIdx(4)} />
      </div>
      {activeIdx === 2 && <div className="arch-danger-banner">Timestamp order wrong - clock drift flipped causality</div>}
      {activeIdx === 3 && <div className="arch-failover-banner">Lamport: causal ordering without wall clocks</div>}
      {activeIdx === 4 && <div className="arch-failover-banner">Vector clock: can detect concurrent (unrelated) events</div>}
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_DS_CLOCKS}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_DS_CLOCKS} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// DS DIAGRAM 5 - Consistency Models
const TOTAL_DS_CONSIST = 5;
const DSConsistDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'Client writes value to Node A',
    'Strong consistency: any node returns new value immediately',
    'Eventual consistency: replicas may briefly return old value',
    'Causal consistency: your own writes always visible to you',
    'Eventually all replicas converge to the same value',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-row arch-row--center">
        <ArchNode icon={<UserIcon    active={activeIdx === 0} />} label="Write"       sublabel="value=100"          active={activeIdx === 0} onClick={() => setActiveIdx(0)} />
        <Arrow active label="to" />
        <ArchNode icon={<ServerIcon  active />}                   label="Node A"      sublabel="value=100 (latest)" active />
        <Arrow active={activeIdx >= 1} label="replicate" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          <ArchNode icon={<ServerIcon active={activeIdx >= 1} />} label="Node B"      sublabel={activeIdx === 2 ? 'Still 99 (stale)' : activeIdx >= 1 ? 'value=100' : 'value=99'} active={activeIdx >= 1} danger={activeIdx === 2} onClick={() => setActiveIdx(2)} />
          <ArchNode icon={<ServerIcon active={activeIdx >= 4} />} label="Node C"      sublabel={activeIdx >= 4 ? 'value=100 (synced)' : 'Syncing...'} active={activeIdx >= 4} onClick={() => setActiveIdx(4)} />
        </div>
      </div>
      {activeIdx === 1 && <div className="arch-failover-banner">Strong: quorum read - always returns 100</div>}
      {activeIdx === 2 && <div className="arch-danger-banner">Eventual: B returns stale 99 briefly</div>}
      {activeIdx === 3 && <div className="arch-failover-banner">Causal: writer always sees own write (100)</div>}
      {activeIdx >= 4 && <div className="arch-failover-banner">Convergence: all replicas eventually agree on 100</div>}
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_DS_CONSIST}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_DS_CONSIST} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// DS DIAGRAM 6 - Raft Consensus
const TOTAL_DS_RAFT = 5;
const DSRaftDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'Election: nodes vote, winner becomes leader for current term',
    'Client write: leader appends entry to its log',
    'Replicate: leader sends log entry to all followers in parallel',
    'Quorum: majority (3/5) acknowledge - entry committed',
    'Leader fails: remaining 4 nodes elect new leader automatically',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-row arch-row--center">
        <ArchNode icon={<UserIcon    active={activeIdx === 1} />} label="Client"      sublabel="Write request"      active={activeIdx === 1} onClick={() => setActiveIdx(1)} />
        <Arrow active={activeIdx >= 1} label="write" />
        <ArchNode icon={<LockIcon    active={activeIdx <= 3} />}  label="Leader"      sublabel={activeIdx >= 4 ? 'FAILED' : `Term ${activeIdx + 1}`} active={activeIdx <= 3} danger={activeIdx === 4} onClick={() => setActiveIdx(1)} />
        <Arrow active={activeIdx >= 2} label="replicate" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          {['F1','F2','F3','F4'].map((f, i) => (
            <ArchNode key={f} icon={<ServerIcon active={activeIdx >= 2} />}
              label={'Follower ' + (i + 1)}
              sublabel={activeIdx >= 3 ? (i < 2 ? 'Acked' : 'Acking') : 'Waiting'}
              active={activeIdx >= 2} onClick={() => setActiveIdx(2)} />
          ))}
        </div>
      </div>
      {activeIdx === 3 && <div className="arch-failover-banner">Quorum (3/5) acked - entry committed safely</div>}
      {activeIdx === 4 && <div className="arch-danger-banner">Leader failed - followers elect new leader</div>}
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_DS_RAFT}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_DS_RAFT} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// DS DIAGRAM 7 - Distributed Transactions: 2PC vs Saga
const TOTAL_DS_TX = 5;
const DSTxDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const is2PC = activeIdx <= 2;
  const descs = [
    '2PC Phase 1: coordinator asks all participants "can you commit?"',
    '2PC Phase 2: all say yes - coordinator sends commit to all',
    '2PC problem: coordinator crashes - participants stuck holding locks',
    'Saga step 1: Order Service creates order (local transaction)',
    'Saga fails: compensating TX runs - refund card, cancel order',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-two-path">
        <div className={`arch-path${is2PC ? ' arch-path--active' : ''}`}>
          <div className="arch-path__label arch-path__label--read">2-PHASE COMMIT</div>
          <div className="arch-row arch-row--col">
            <ArchNode icon={<NetworkIcon active={activeIdx === 0} />} label="Coordinator" sublabel="Phase 1: prepare?" active={activeIdx === 0} danger={activeIdx === 2} onClick={() => setActiveIdx(0)} />
            <VertArrow active={activeIdx >= 1} label="yes/no" />
            <ArchNode icon={<ServerIcon  active={activeIdx === 1} />} label="Participants" sublabel={activeIdx === 2 ? 'STUCK waiting' : 'Lock + ready'} active={activeIdx === 1} danger={activeIdx === 2} onClick={() => setActiveIdx(1)} />
            {activeIdx === 2 && <div className="arch-danger-banner" style={{ marginTop: '0.5rem' }}>Coordinator crashed - participants hold locks forever!</div>}
          </div>
        </div>
        <div className="arch-path-divider" />
        <div className={`arch-path${!is2PC ? ' arch-path--active' : ''}`}>
          <div className="arch-path__label arch-path__label--write">SAGA PATTERN</div>
          <div className="arch-row arch-row--col">
            <ArchNode icon={<CacheIcon   active={activeIdx === 3} />} label="Step 1: Order" sublabel="Local TX - created" active={activeIdx === 3} onClick={() => setActiveIdx(3)} />
            <VertArrow active={activeIdx >= 4} label="fail" />
            <ArchNode icon={<WarningIcon active={activeIdx === 4} />} label="Compensate"   sublabel="Refund + cancel"     active={activeIdx === 4} danger={activeIdx === 4} onClick={() => setActiveIdx(4)} />
          </div>
        </div>
      </div>
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_DS_TX}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_DS_TX} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// DS DIAGRAM 8 - Fault Tolerance and Replication
const TOTAL_DS_FAULT = 5;
const DSFaultDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'Write to primary: synchronous - wait for quorum ack before confirming',
    'Primary replicates to 2 followers across different availability zones',
    'Primary crashes: system detects via missed heartbeats',
    'Leader election: follower with most up-to-date log becomes primary',
    'Re-replicate: new primary adds replica to restore 3x replication',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-row arch-row--center">
        <ArchNode icon={<UserIcon    active={activeIdx === 0} />}  label="Client"      sublabel="Write"              active={activeIdx === 0} onClick={() => setActiveIdx(0)} />
        <Arrow active label="write" />
        <ArchNode icon={<ServerIcon  active={activeIdx <= 1} />}   label="Primary"     sublabel={activeIdx >= 2 ? 'CRASHED' : 'AZ-1'} active={activeIdx <= 1} danger={activeIdx >= 2 && activeIdx <= 3} onClick={() => setActiveIdx(1)} />
        <Arrow active={activeIdx >= 1} label="sync rep" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          <ArchNode icon={<ServerIcon  active={activeIdx >= 1} />} label="Replica 1"   sublabel={activeIdx >= 3 ? 'NEW PRIMARY' : 'AZ-2'} active={activeIdx >= 3} onClick={() => setActiveIdx(3)} />
          <ArchNode icon={<ServerIcon  active={activeIdx >= 1} />} label="Replica 2"   sublabel="AZ-3"               active={activeIdx >= 1} onClick={() => setActiveIdx(1)} />
        </div>
      </div>
      {activeIdx === 2 && <div className="arch-danger-banner">Primary crashed - missed heartbeats detected</div>}
      {activeIdx === 3 && <div className="arch-failover-banner">Replica 1 elected new primary in seconds</div>}
      {activeIdx >= 4 && <div className="arch-failover-banner">New replica added - 3x replication restored</div>}
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_DS_FAULT}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_DS_FAULT} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// DS DIAGRAM 9 - CAP Theorem during partition
const TOTAL_DS_CAP = 5;
const DSCAPDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'Network partition splits cluster: Node A and Node B cannot talk',
    'CP choice: Node B refuses requests - avoids serving stale data',
    'AP choice: Node B serves requests with potentially stale data',
    'Partition heals: nodes sync and converge',
    'CP: banking. AP: social feeds. Choose based on your use case.',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-row arch-row--center">
        <ArchNode icon={<UserIcon    active={activeIdx === 0} />}  label="Write"       sublabel="balance=500"        active={activeIdx === 0} onClick={() => setActiveIdx(0)} />
        <Arrow active label="to" />
        <ArchNode icon={<ServerIcon  active={activeIdx <= 2} />}   label="Node A"      sublabel="balance=500"        active={activeIdx <= 2} onClick={() => setActiveIdx(1)} />
        <Arrow active={activeIdx === 0} label="PARTITION!" />
        <ArchNode icon={<ServerIcon  active={activeIdx >= 1} />}   label="Node B"
          sublabel={activeIdx === 1 ? 'REFUSED (CP)' : activeIdx === 2 ? 'balance=400 (AP)' : activeIdx >= 3 ? 'synced=500' : 'balance=400'}
          active={activeIdx >= 1} danger={activeIdx === 1 || activeIdx === 2}
          onClick={() => setActiveIdx(activeIdx >= 3 ? 3 : 2)} />
      </div>
      {activeIdx === 0 && <div className="arch-danger-banner">Network partition: A and B cannot communicate</div>}
      {activeIdx === 1 && <div className="arch-danger-banner">CP: Node B refuses - prefers consistency over availability</div>}
      {activeIdx === 2 && <div className="arch-failover-banner">AP: Node B serves stale data - prefers availability</div>}
      {activeIdx >= 3 && <div className="arch-failover-banner">Partition healed: nodes sync to same value</div>}
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_DS_CAP}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_DS_CAP} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// DS DIAGRAM 10 - Observability: distributed tracing
const TOTAL_DS_OBS = 5;
const DSObsDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'Request enters system: unique trace ID assigned at entry',
    'Every service logs with same trace ID',
    'Payment service throws error at step 4 of the call chain',
    'Jaeger shows full waterfall: found failure in seconds',
    'Prometheus alert fires: error rate >1% - on-call paged',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-row arch-row--center">
        <ArchNode icon={<NetworkIcon active={activeIdx === 0} />}  label="Entry"       sublabel="trace-id:abc123"     active={activeIdx === 0} onClick={() => setActiveIdx(0)} />
        <Arrow active={activeIdx >= 1} label="propagate" />
        <ArchNode icon={<ServerIcon  active={activeIdx === 1} />}  label="Order Svc"   sublabel="10ms - OK"          active={activeIdx === 1} onClick={() => setActiveIdx(1)} />
        <Arrow active={activeIdx >= 2} label="call" />
        <ArchNode icon={<LockIcon    active={activeIdx >= 2} />}   label="Payment Svc" sublabel={activeIdx >= 2 ? '4s - ERROR' : '...'} active={activeIdx >= 2} danger={activeIdx >= 2 && activeIdx <= 3} onClick={() => setActiveIdx(2)} />
      </div>
      <div className="arch-row arch-row--center" style={{ marginTop: '0.75rem' }}>
        <ArchNode icon={<CacheIcon   active={activeIdx === 3} />}  label="Jaeger"      sublabel="Full trace waterfall" active={activeIdx === 3} onClick={() => setActiveIdx(3)} />
        <Arrow active={activeIdx >= 4} label="alert" />
        <ArchNode icon={<UserIcon    active={activeIdx === 4} />}  label="On-Call"     sublabel="Error >1% - paged"   active={activeIdx === 4} onClick={() => setActiveIdx(4)} />
      </div>
      {activeIdx === 2 && <div className="arch-danger-banner">Payment Service: 4s latency spike + error</div>}
      {activeIdx === 3 && <div className="arch-failover-banner">Trace view: root cause found in 10 seconds</div>}
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_DS_OBS}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_DS_OBS} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// CDN DIAGRAMS
// ─────────────────────────────────────────────────────────────────────────────

// CDN DIAGRAM 1 - Fundamentals: user to edge vs user to origin
const TOTAL_CDN_FUND = 5;
const CDNFundamentalsDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'User in Mumbai requests content from your website',
    'Without CDN: request travels all the way to New York - 150ms',
    'With CDN: CDN routes to nearest edge server in Mumbai - 5ms',
    '30x faster for the user - same content, different source',
    'Origin server never touched - 95% cache hit ratio saves load',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-row arch-row--center">
        <ArchNode icon={<UserIcon active={activeIdx === 0} />}    label="User Mumbai"   sublabel="Makes request"      active={activeIdx === 0} onClick={() => setActiveIdx(0)} />
        <Arrow active={activeIdx >= 1} label={activeIdx >= 2 ? '5ms via CDN' : '150ms no CDN'} />
        <ArchNode icon={<NetworkIcon active={activeIdx >= 2} />}  label="CDN Edge"      sublabel="Mumbai PoP"         active={activeIdx >= 2} danger={activeIdx === 1} onClick={() => setActiveIdx(2)} />
        <Arrow active={activeIdx >= 3} label="only on miss" />
        <ArchNode icon={<ServerIcon active={activeIdx >= 4} />}   label="Origin"        sublabel="New York server"    active={activeIdx >= 4} danger={activeIdx === 1} onClick={() => setActiveIdx(4)} />
      </div>
      {activeIdx === 1 && <div className="arch-danger-banner">No CDN: 150ms round trip to New York every request</div>}
      {activeIdx === 2 && <div className="arch-failover-banner">CDN edge in Mumbai: 5ms - 30x faster for user</div>}
      {activeIdx >= 4  && <div className="arch-failover-banner">Only 5% of requests (cache misses) reach origin</div>}
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_CDN_FUND}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_CDN_FUND} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// CDN DIAGRAM 2 - Architecture: DNS routing to edge
const TOTAL_CDN_ARCH = 5;
const CDNArchDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'User resolves your domain via CDN nameserver',
    'CDN DNS returns IP of nearest edge PoP based on user location',
    'User connects to closest edge server',
    'Cache hit: edge serves content - origin not touched',
    'Cache miss: edge fetches from origin, caches for next user',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-row arch-row--center">
        <ArchNode icon={<UserIcon    active={activeIdx === 0} />}  label="User"         sublabel="DNS query"          active={activeIdx === 0} onClick={() => setActiveIdx(0)} />
        <Arrow active={activeIdx >= 1} label="DNS" />
        <ArchNode icon={<NetworkIcon active={activeIdx >= 1} />}   label="CDN DNS"      sublabel="Geo routing"        active={activeIdx === 1} onClick={() => setActiveIdx(1)} />
        <Arrow active={activeIdx >= 2} label="nearest IP" />
        <ArchNode icon={<NetworkIcon active={activeIdx >= 2} />}   label="Edge PoP"     sublabel="Frankfurt/Mumbai"   active={activeIdx >= 2} onClick={() => setActiveIdx(2)} />
        <Arrow active={activeIdx >= 4} label="miss only" />
        <ArchNode icon={<ServerIcon  active={activeIdx >= 4} />}   label="Origin"       sublabel="Your server"        active={activeIdx >= 4} onClick={() => setActiveIdx(4)} />
      </div>
      {activeIdx === 3 && <div className="arch-failover-banner">Cache HIT: content served from edge in milliseconds</div>}
      {activeIdx >= 4  && <div className="arch-danger-banner">Cache MISS: edge fetches from origin, then caches it</div>}
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_CDN_ARCH}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_CDN_ARCH} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// CDN DIAGRAM 3 - Edge PoPs and cache hierarchy
const TOTAL_CDN_EDGE = 5;
const CDNEdgeDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'User request routed via Anycast BGP to nearest PoP',
    'L1 edge cache checked first - closest to user',
    'L1 miss: check regional L2 cache shared by nearby PoPs',
    'L2 miss: only origin shield contacts origin - not all 300 PoPs',
    'Origin shield caches result - all future L2 misses served from shield',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-col arch-col--center">
        <ArchNode icon={<UserIcon    active={activeIdx === 0} />}  label="User"         sublabel="Anycast routes here" active={activeIdx === 0} onClick={() => setActiveIdx(0)} />
        <VertArrow active={activeIdx >= 1} label="L1 check" />
        <ArchNode icon={<CacheIcon   active={activeIdx >= 1} />}   label="L1 Edge PoP"  sublabel="Closest to user"    active={activeIdx === 1} onClick={() => setActiveIdx(1)} />
        <VertArrow active={activeIdx >= 2} label="miss" />
        <ArchNode icon={<CacheIcon   active={activeIdx >= 2} />}   label="L2 Regional"  sublabel="Asia-Pacific cache" active={activeIdx === 2} onClick={() => setActiveIdx(2)} />
        <VertArrow active={activeIdx >= 3} label="miss" />
        <ArchNode icon={<NetworkIcon active={activeIdx >= 3} />}   label="Origin Shield" sublabel="One shield for all" active={activeIdx >= 3} onClick={() => setActiveIdx(3)} />
        <VertArrow active={activeIdx >= 4} label="once" />
        <ArchNode icon={<ServerIcon  active={activeIdx >= 4} />}   label="Origin"       sublabel="Only hit on miss"    active={activeIdx >= 4} onClick={() => setActiveIdx(4)} />
      </div>
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_CDN_EDGE}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_CDN_EDGE} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// CDN DIAGRAM 4 - Origin caching: Cache-Control headers and TTL
const TOTAL_CDN_CACHE = 5;
const CDNCacheDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'Origin sends Cache-Control: public, max-age=86400',
    'Edge stores response for 24 hours',
    'Second user requests same URL - edge checks cache',
    'Cache hit: served from edge, origin not called',
    'After 24h TTL expires: conditional request (If-Modified-Since)',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-row arch-row--center">
        <ArchNode icon={<ServerIcon  active={activeIdx === 0} />}  label="Origin"       sublabel="max-age=86400"      active={activeIdx === 0} onClick={() => setActiveIdx(0)} />
        <Arrow active={activeIdx >= 1} label="cache headers" />
        <ArchNode icon={<CacheIcon   active={activeIdx >= 1} />}   label="CDN Edge"     sublabel={activeIdx >= 1 ? 'Caches 24h' : 'Waiting'} active={activeIdx >= 1} onClick={() => setActiveIdx(1)} />
        <Arrow active={activeIdx >= 3} label="served" />
        <ArchNode icon={<UserIcon    active={activeIdx >= 2} />}   label="User 2"       sublabel={activeIdx >= 3 ? 'Got cache hit!' : 'Requests'} active={activeIdx >= 2} onClick={() => setActiveIdx(2)} />
      </div>
      {activeIdx === 1 && <div className="arch-failover-banner">Edge caches response for 24 hours</div>}
      {activeIdx >= 3 && <div className="arch-failover-banner">Cache HIT: User 2 served instantly from edge</div>}
      {activeIdx >= 4 && <div className="arch-failover-banner">TTL expired: conditional request with If-Modified-Since</div>}
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_CDN_CACHE}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_CDN_CACHE} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// CDN DIAGRAM 5 - Push vs Pull CDN
const TOTAL_CDN_PUSHPULL = 5;
const CDNPushPullDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const isPush = activeIdx >= 3;
  const descs = [
    'Pull CDN: first user on any edge triggers cache miss (slow)',
    'Pull CDN: second user gets cache hit (fast) - cache warms from traffic',
    'Pull CDN: high traffic warms all edges quickly',
    'Push CDN: you upload content to all edges before users request it',
    'Push CDN: every user - including the first - gets a cache hit',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-two-path">
        <div className={`arch-path${!isPush ? ' arch-path--active' : ''}`}>
          <div className="arch-path__label arch-path__label--read">PULL CDN</div>
          <div className="arch-row arch-row--col">
            <ArchNode icon={<UserIcon   active={activeIdx === 0} />} label="User 1"    sublabel="Cache miss (slow)" active={activeIdx === 0} danger={activeIdx === 0} onClick={() => setActiveIdx(0)} />
            <VertArrow active={activeIdx >= 1} label="pulls from origin" />
            <ArchNode icon={<CacheIcon  active={activeIdx >= 1} />}  label="CDN Edge"  sublabel="Now cached" active={activeIdx >= 1} onClick={() => setActiveIdx(1)} />
            <VertArrow active={activeIdx >= 2} label="cache hit" />
            <ArchNode icon={<UserIcon   active={activeIdx === 2} />} label="User 2+"   sublabel="Cache hit (fast)" active={activeIdx === 2} onClick={() => setActiveIdx(2)} />
          </div>
        </div>
        <div className="arch-path-divider" />
        <div className={`arch-path${isPush ? ' arch-path--active' : ''}`}>
          <div className="arch-path__label arch-path__label--write">PUSH CDN</div>
          <div className="arch-row arch-row--col">
            <ArchNode icon={<ServerIcon active={activeIdx === 3} />} label="You"       sublabel="Upload to CDN" active={activeIdx === 3} onClick={() => setActiveIdx(3)} />
            <VertArrow active={activeIdx >= 4} label="pre-loaded" />
            <ArchNode icon={<CacheIcon  active={activeIdx >= 4} />}  label="All Edges" sublabel="Content ready" active={activeIdx >= 4} onClick={() => setActiveIdx(4)} />
            {activeIdx >= 4 && <div className="arch-failover-banner" style={{ marginTop: '0.5rem' }}>Every user gets cache hit from first request</div>}
          </div>
        </div>
      </div>
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_CDN_PUSHPULL}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_CDN_PUSHPULL} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// CDN DIAGRAM 6 - Static vs Dynamic
const TOTAL_CDN_STATIC = 5;
const CDNStaticDynDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'Static asset: same image for all users - CDN caches it',
    'Content hash in URL: app.a1b2c3.js - cache safely for 1 year',
    'Dynamic API: user-specific data - cannot share between users',
    'CDN accelerates dynamic on private backbone: 30% faster',
    'Edge function: personalisation logic runs at CDN node, not origin',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-two-path">
        <div className={`arch-path${activeIdx <= 1 ? ' arch-path--active' : ''}`}>
          <div className="arch-path__label arch-path__label--read">STATIC</div>
          <div className="arch-row arch-row--col">
            <ArchNode icon={<CacheIcon  active={activeIdx <= 1} />} label="CDN Edge"   sublabel="image.a1b2c3.jpg" active={activeIdx <= 1} onClick={() => setActiveIdx(0)} />
            <VertArrow active={activeIdx >= 1} label="cache 1 year" />
            <ArchNode icon={<UserIcon   active={activeIdx === 1} />} label="All Users" sublabel="Same cached asset" active={activeIdx === 1} onClick={() => setActiveIdx(1)} />
          </div>
        </div>
        <div className="arch-path-divider" />
        <div className={`arch-path${activeIdx >= 2 ? ' arch-path--active' : ''}`}>
          <div className="arch-path__label arch-path__label--write">DYNAMIC</div>
          <div className="arch-row arch-row--col">
            <ArchNode icon={<NetworkIcon active={activeIdx >= 2} />} label="CDN Edge"  sublabel={activeIdx >= 4 ? 'Edge function!' : 'Accelerates'} active={activeIdx >= 2} onClick={() => setActiveIdx(2)} />
            <VertArrow active={activeIdx >= 3} label={activeIdx >= 4 ? 'edge logic' : 'private backbone'} />
            <ArchNode icon={<ServerIcon  active={activeIdx >= 2 && activeIdx <= 3} />} label="Origin" sublabel="User-specific" active={activeIdx >= 2 && activeIdx <= 3} onClick={() => setActiveIdx(3)} />
            {activeIdx >= 4 && <div className="arch-failover-banner" style={{ marginTop: '0.5rem' }}>Edge function: no origin call needed</div>}
          </div>
        </div>
      </div>
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_CDN_STATIC}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_CDN_STATIC} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// CDN DIAGRAM 7 - Cache Invalidation and Purging
const TOTAL_CDN_PURGE = 5;
const CDNPurgeDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'Content updated on origin - CDN edges still serve old version',
    'Developer triggers global cache purge via CDN API',
    'Purge command propagates to all 300+ PoPs in under 5 seconds',
    'All edge caches for that URL cleared',
    'Next user: edge fetches fresh content from origin, caches it',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-row arch-row--center">
        <ArchNode icon={<ServerIcon  active={activeIdx === 0} />}  label="Origin"       sublabel="New content ready"  active={activeIdx === 0} onClick={() => setActiveIdx(0)} />
        <Arrow active={activeIdx >= 1} label="purge API" />
        <ArchNode icon={<NetworkIcon active={activeIdx >= 1} />}   label="CDN Control"  sublabel="Purge command"      active={activeIdx >= 1} onClick={() => setActiveIdx(1)} />
        <Arrow active={activeIdx >= 2} label="propagate" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          {['PoP 1','PoP 2','PoP 3'].map((p, i) => (
            <ArchNode key={p} icon={<CacheIcon active={activeIdx >= 3} />}
              label={p} sublabel={activeIdx >= 3 ? 'Cache cleared' : 'Stale cache'}
              active={activeIdx >= 3} danger={activeIdx === 1 || activeIdx === 2}
              onClick={() => setActiveIdx(3)} />
          ))}
        </div>
      </div>
      {activeIdx === 1 && <div className="arch-danger-banner">Edges serving stale content - purge initiated</div>}
      {activeIdx >= 3 && <div className="arch-failover-banner">All PoP caches cleared in under 5 seconds globally</div>}
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_CDN_PURGE}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_CDN_PURGE} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// CDN DIAGRAM 8 - Security: DDoS + WAF + TLS
const TOTAL_CDN_SEC = 5;
const CDNSecDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'DDoS attack: 1 Tbps flood from global botnet',
    'Anycast spreads attack across 300+ CDN PoPs globally',
    'WAF inspects HTTP content: blocks SQL injection, XSS',
    'TLS terminates at edge: HTTPS offloaded from origin',
    'Only clean legitimate traffic reaches your origin server',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-row arch-row--center">
        <ArchNode icon={<WarningIcon active={activeIdx === 0} />}  label="DDoS Attack"  sublabel="1 Tbps botnet"      active={activeIdx === 0} danger onClick={() => setActiveIdx(0)} />
        <Arrow active={activeIdx >= 1} label="absorbed" />
        <ArchNode icon={<NetworkIcon active={activeIdx >= 1} />}   label="CDN Network"  sublabel="300+ PoPs absorb"   active={activeIdx >= 1} onClick={() => setActiveIdx(1)} />
      </div>
      <div className="arch-row arch-row--center" style={{ marginTop: '0.75rem' }}>
        <ArchNode icon={<LockIcon    active={activeIdx >= 2} />}   label="WAF"          sublabel="Block SQLi + XSS"   active={activeIdx === 2} onClick={() => setActiveIdx(2)} />
        <Arrow active={activeIdx >= 3} label="TLS" />
        <ArchNode icon={<LockIcon    active={activeIdx >= 3} />}   label="TLS Term."    sublabel="HTTPS at edge"      active={activeIdx === 3} onClick={() => setActiveIdx(3)} />
        <Arrow active={activeIdx >= 4} label="clean only" />
        <ArchNode icon={<ServerIcon  active={activeIdx >= 4} />}   label="Origin"       sublabel="Never sees attack"  active={activeIdx >= 4} onClick={() => setActiveIdx(4)} />
      </div>
      {activeIdx === 0 && <div className="arch-danger-banner">DDoS: 1 Tbps flood - CDN network absorbs it</div>}
      {activeIdx >= 4 && <div className="arch-failover-banner">Origin only receives clean, authenticated traffic</div>}
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_CDN_SEC}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_CDN_SEC} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// CDN DIAGRAM 9 - CDN Request Routing
const TOTAL_CDN_ROUTE = 5;
const CDNRouteDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'Browser resolves yourdomain.com via CDN nameserver',
    'CDN DNS geo-locates user and returns nearest PoP IP',
    'Browser connects to nearest edge PoP',
    'Edge checks cache: URL matched - cache HIT',
    'Content served in 15ms total including DNS + connect + serve',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-row arch-row--center">
        <ArchNode icon={<UserIcon    active={activeIdx === 0} />}  label="Browser"      sublabel="yourdomain.com"     active={activeIdx === 0} onClick={() => setActiveIdx(0)} />
        <Arrow active={activeIdx >= 1} label="DNS query" />
        <ArchNode icon={<NetworkIcon active={activeIdx === 1} />}  label="CDN DNS"      sublabel="Returns nearest IP" active={activeIdx === 1} onClick={() => setActiveIdx(1)} />
        <Arrow active={activeIdx >= 2} label="connect 8ms" />
        <ArchNode icon={<NetworkIcon active={activeIdx >= 2} />}   label="Edge PoP"     sublabel="Frankfurt/Mumbai"   active={activeIdx >= 2} onClick={() => setActiveIdx(2)} />
        <Arrow active={activeIdx >= 4} label="response" />
        <ArchNode icon={<UserIcon    active={activeIdx >= 4} />}   label="Browser"      sublabel="15ms total"         active={activeIdx >= 4} onClick={() => setActiveIdx(4)} />
      </div>
      {activeIdx === 3 && <div className="arch-failover-banner">Cache HIT: URL found - serving immediately</div>}
      {activeIdx >= 4 && <div className="arch-failover-banner">15ms total: DNS + TCP + cache serve</div>}
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_CDN_ROUTE}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_CDN_ROUTE} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// CDN DIAGRAM 10 - Practice: cache headers + multi-CDN
const TOTAL_CDN_PRACTICE = 5;
const CDNPracticeDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'Set correct Cache-Control headers for each content type',
    'JS/CSS with content hash: max-age=31536000 immutable (1 year)',
    'HTML index: max-age=300 or no-cache - purge on each deploy',
    'Monitor cache hit ratio - drop to 0% means missing headers',
    'Multi-CDN: split traffic across two providers for resilience',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-col arch-col--center">
        {[
          { label: 'Cache Headers',  sub: 'Set intentionally per type', idx: 0 },
          { label: 'JS/CSS: 1 year', sub: 'Content hash = safe',        idx: 1 },
          { label: 'HTML: 5 min',    sub: 'Purge on each deploy',       idx: 2 },
          { label: 'Monitor HitRate', sub: '0% = missing headers',      idx: 3 },
          { label: 'Multi-CDN',      sub: 'CDN A + CDN B failover',     idx: 4 },
        ].map((step, i) => (
          <React.Fragment key={step.label}>
            <div className={`arch-layer${activeIdx === i ? ' arch-layer--active' : ''}`} onClick={() => setActiveIdx(i)}>
              <div className="arch-layer__icon">
                {i === 0 && <LockIcon    active={activeIdx === i} />}
                {i === 1 && <CacheIcon   active={activeIdx === i} />}
                {i === 2 && <ServerIcon  active={activeIdx === i} />}
                {i === 3 && <NetworkIcon active={activeIdx === i} />}
                {i === 4 && <DatabaseIcon active={activeIdx === i} />}
              </div>
              <div className="arch-layer__info">
                <span className="arch-layer__label">{step.label}</span>
                <span className="arch-layer__sub">{step.sub}</span>
              </div>
              <div className="arch-layer__latency">{i + 1}</div>
            </div>
            {i < 4 && <VertArrow active={activeIdx > i} />}
          </React.Fragment>
        ))}
      </div>
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_CDN_PRACTICE}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_CDN_PRACTICE} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MESSAGE QUEUES DIAGRAMS
// ─────────────────────────────────────────────────────────────────────────────

// MQ DIAGRAM 1 - Fundamentals: producer -> queue -> consumer
const TOTAL_MQ_FUND = 5;
const MQFundamentalsDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'Producer sends message to the queue and returns immediately',
    'Message stored safely in the queue - producer is not blocked',
    'Queue buffers messages even if consumer is slow or offline',
    'Consumer picks up and processes message when ready',
    'Producer and consumer are fully decoupled - never directly connected',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-row arch-row--center">
        <ArchNode icon={<ServerIcon active={activeIdx === 0} />}  label="Producer"   sublabel="Sends + returns fast" active={activeIdx === 0} onClick={() => setActiveIdx(0)} />
        <Arrow active={activeIdx >= 1} label="publish" />
        <ArchNode icon={<CacheIcon  active={activeIdx >= 1} />}   label="Queue"      sublabel="Buffers messages"     active={activeIdx >= 1} onClick={() => setActiveIdx(1)} />
        <Arrow active={activeIdx >= 3} label="consume" />
        <ArchNode icon={<ServerIcon active={activeIdx >= 3} />}   label="Consumer"   sublabel="Processes when ready" active={activeIdx >= 3} onClick={() => setActiveIdx(3)} />
      </div>
      {activeIdx === 2 && <div className="arch-failover-banner">Queue holds messages safely - consumer can be offline</div>}
      {activeIdx >= 4  && <div className="arch-failover-banner">Decoupled: producer never waits for consumer</div>}
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_MQ_FUND}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_MQ_FUND} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// MQ DIAGRAM 2 - Architecture: broker + queue + topic
const TOTAL_MQ_ARCH = 5;
const MQArchDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'Producer sends message to the broker server',
    'Broker stores message in a queue or topic on disk (persistent)',
    'Queue: one consumer gets each message (point-to-point)',
    'Topic: all subscribers get a copy (pub/sub fan-out)',
    'Broker routes messages to correct consumer(s)',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-row arch-row--center">
        <ArchNode icon={<ServerIcon  active={activeIdx === 0} />}  label="Producer"  sublabel="Publishes messages"   active={activeIdx === 0} onClick={() => setActiveIdx(0)} />
        <Arrow active={activeIdx >= 1} label="send" />
        <ArchNode icon={<NetworkIcon active={activeIdx >= 1} />}   label="Broker"    sublabel="Kafka/RabbitMQ/SQS"   active={activeIdx >= 1} onClick={() => setActiveIdx(1)} />
        <Arrow active={activeIdx >= 2} label="store" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          <ArchNode icon={<CacheIcon  active={activeIdx === 2} />} label="Queue"     sublabel="P2P: one consumer"    active={activeIdx === 2} onClick={() => setActiveIdx(2)} />
          <ArchNode icon={<CacheIcon  active={activeIdx === 3} />} label="Topic"     sublabel="Pub/Sub: all subs"    active={activeIdx === 3} onClick={() => setActiveIdx(3)} />
        </div>
      </div>
      {activeIdx >= 4 && <div className="arch-failover-banner">Broker routes to correct consumer(s) based on queue or topic</div>}
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_MQ_ARCH}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_MQ_ARCH} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// MQ DIAGRAM 3 - Producers and Consumers (competing consumers)
const TOTAL_MQ_PRODCONS = 5;
const MQProdConsDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'Producer publishes 100 messages to the queue',
    'Consumer 1 claims and processes messages 1-33',
    'Consumer 2 claims and processes messages 34-66 in parallel',
    'Consumer 3 claims and processes messages 67-100 in parallel',
    'All 3 consumers work simultaneously - 3x throughput',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-row arch-row--center">
        <ArchNode icon={<ServerIcon active={activeIdx === 0} />}   label="Producer"    sublabel="100 messages"      active={activeIdx === 0} onClick={() => setActiveIdx(0)} />
        <Arrow active={activeIdx >= 1} label="publish" />
        <ArchNode icon={<CacheIcon  active={activeIdx >= 1} />}    label="Queue"       sublabel="Waiting messages"  active={activeIdx >= 1} onClick={() => setActiveIdx(1)} />
        <Arrow active={activeIdx >= 2} label="compete" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          {[['Consumer 1','msgs 1-33'],['Consumer 2','msgs 34-66'],['Consumer 3','msgs 67-100']].map(([c,s],i) => (
            <ArchNode key={c} icon={<ServerIcon active={activeIdx >= i+2} />} label={c} sublabel={s} active={activeIdx >= i+2} onClick={() => setActiveIdx(i+2)} />
          ))}
        </div>
      </div>
      {activeIdx >= 4 && <div className="arch-failover-banner">3 consumers in parallel - add more to scale throughput</div>}
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_MQ_PRODCONS}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_MQ_PRODCONS} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// MQ DIAGRAM 4 - Point-to-Point
const TOTAL_MQ_P2P = 5;
const MQP2PDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    '5 messages waiting in the queue',
    'Consumer A claims message 1 - locked from all other consumers',
    'Consumer B simultaneously claims message 2',
    'Consumer A acks message 1 - broker deletes it permanently',
    'Consumer A immediately claims message 3 - work continues',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-row arch-row--center">
        <ArchNode icon={<CacheIcon  active={activeIdx >= 0} />}    label="Queue"       sublabel="5 messages"        active={activeIdx >= 0} onClick={() => setActiveIdx(0)} />
        <Arrow active={activeIdx >= 1} label="claim" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          <ArchNode icon={<ServerIcon active={activeIdx >= 1} />}  label="Consumer A"  sublabel={activeIdx >= 3 ? 'Acked - deleted' : 'Processing msg 1'} active={activeIdx >= 1} onClick={() => setActiveIdx(1)} />
          <ArchNode icon={<ServerIcon active={activeIdx >= 2} />}  label="Consumer B"  sublabel="Processing msg 2"  active={activeIdx >= 2} onClick={() => setActiveIdx(2)} />
        </div>
      </div>
      {activeIdx === 3 && <div className="arch-failover-banner">Ack sent - message 1 permanently deleted from queue</div>}
      {activeIdx >= 4  && <div className="arch-failover-banner">Consumer A picks up message 3 immediately</div>}
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_MQ_P2P}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_MQ_P2P} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// MQ DIAGRAM 5 - Pub/Sub
const TOTAL_MQ_PUBSUB = 5;
const MQPubSubDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'Producer publishes "order.placed" event to a topic',
    'Broker fans out - every subscriber gets their own copy',
    'Email Service: sends order confirmation to customer',
    'Inventory Service: reserves stock for the order',
    'Analytics Service: updates real-time order metrics',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-row arch-row--center">
        <ArchNode icon={<ServerIcon  active={activeIdx === 0} />}  label="Order Svc"   sublabel="order.placed event"  active={activeIdx === 0} onClick={() => setActiveIdx(0)} />
        <Arrow active={activeIdx >= 1} label="publish" />
        <ArchNode icon={<CacheIcon   active={activeIdx >= 1} />}   label="Topic"       sublabel="order.placed"        active={activeIdx >= 1} onClick={() => setActiveIdx(1)} />
        <Arrow active={activeIdx >= 2} label="fan-out" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          {[['Email Svc','Send confirmation'],['Inventory Svc','Reserve stock'],['Analytics Svc','Update metrics']].map(([s,sub],i) => (
            <ArchNode key={s} icon={<ServerIcon active={activeIdx >= i+2} />} label={s} sublabel={sub} active={activeIdx >= i+2} onClick={() => setActiveIdx(i+2)} />
          ))}
        </div>
      </div>
      {activeIdx >= 2 && <div className="arch-failover-banner">All subscribers react in parallel - Order Svc never knew they existed</div>}
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_MQ_PUBSUB}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_MQ_PUBSUB} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// MQ DIAGRAM 6 - Delivery Guarantees
const TOTAL_MQ_DELIVERY = 5;
const MQDeliveryDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const isAtLeast = activeIdx >= 2;
  const descs = [
    'At-most-once: fire and forget - may lose but never duplicate',
    'At-most-once: broker delivers, no ack required - fast but lossy',
    'At-least-once: consumer must ack - never lose but may duplicate',
    'Consumer crashes before ack: broker re-delivers the message',
    'Idempotent consumer: check message ID to skip duplicates safely',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-two-path">
        <div className={`arch-path${!isAtLeast ? ' arch-path--active' : ''}`}>
          <div className="arch-path__label arch-path__label--read">AT-MOST-ONCE</div>
          <div className="arch-row arch-row--col">
            <ArchNode icon={<ServerIcon  active={activeIdx === 0} />} label="Producer"  sublabel="No ack wait"       active={activeIdx === 0} onClick={() => setActiveIdx(0)} />
            <VertArrow active={activeIdx >= 1} label="deliver" />
            <ArchNode icon={<ServerIcon  active={activeIdx === 1} />} label="Consumer"  sublabel="No ack needed"     active={activeIdx === 1} danger={activeIdx === 1} onClick={() => setActiveIdx(1)} />
            {activeIdx === 1 && <div className="arch-danger-banner" style={{ marginTop: '0.5rem' }}>May lose messages - no ack</div>}
          </div>
        </div>
        <div className="arch-path-divider" />
        <div className={`arch-path${isAtLeast ? ' arch-path--active' : ''}`}>
          <div className="arch-path__label arch-path__label--write">AT-LEAST-ONCE</div>
          <div className="arch-row arch-row--col">
            <ArchNode icon={<ServerIcon  active={activeIdx >= 2} />} label="Consumer"  sublabel="Must ack"           active={activeIdx === 2} onClick={() => setActiveIdx(2)} />
            <VertArrow active={activeIdx >= 3} label="crash!" />
            <ArchNode icon={<ServerIcon  active={activeIdx >= 3} />} label="Re-deliver" sublabel="Broker re-sends"  active={activeIdx === 3} danger={activeIdx === 3} onClick={() => setActiveIdx(3)} />
            <VertArrow active={activeIdx >= 4} label="check ID" />
            <ArchNode icon={<LockIcon    active={activeIdx >= 4} />} label="Idempotent" sublabel="Skip if processed" active={activeIdx >= 4} onClick={() => setActiveIdx(4)} />
          </div>
        </div>
      </div>
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_MQ_DELIVERY}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_MQ_DELIVERY} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// MQ DIAGRAM 7 - Message Ordering (Kafka partitions)
const TOTAL_MQ_ORDER = 5;
const MQOrderDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'Messages published with user_id as the partition key',
    'hash(user_id) routes same user always to same partition',
    'Partition 1: all messages for user 123 - strict order guaranteed',
    'Partition 2: all messages for user 456 - processed in parallel',
    'Ordered per user AND parallel across users - best of both',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-row arch-row--center">
        <ArchNode icon={<ServerIcon  active={activeIdx === 0} />}  label="Producer"    sublabel="key=user_id"        active={activeIdx === 0} onClick={() => setActiveIdx(0)} />
        <Arrow active={activeIdx >= 1} label="hash(key)" />
        <ArchNode icon={<NetworkIcon active={activeIdx === 1} />}  label="Kafka"       sublabel="Partition router"   active={activeIdx === 1} onClick={() => setActiveIdx(1)} />
        <Arrow active={activeIdx >= 2} label="route" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          <ArchNode icon={<CacheIcon  active={activeIdx === 2} />} label="Partition 1" sublabel="user 123 - ordered" active={activeIdx === 2} onClick={() => setActiveIdx(2)} />
          <ArchNode icon={<CacheIcon  active={activeIdx === 3} />} label="Partition 2" sublabel="user 456 - parallel" active={activeIdx === 3} onClick={() => setActiveIdx(3)} />
        </div>
      </div>
      {activeIdx >= 4 && <div className="arch-failover-banner">Ordered within user, parallel across users</div>}
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_MQ_ORDER}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_MQ_ORDER} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// MQ DIAGRAM 8 - Acks, Retries and DLQ
const TOTAL_MQ_DLQ = 5;
const MQDLQDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'Consumer picks up message - locked from other consumers',
    'Processing fails - consumer sends nack or crashes',
    'Broker re-delivers with exponential backoff: 1s, 2s, 4s...',
    'Max retries (3) reached - message moved to Dead Letter Queue',
    'DLQ alert fires - engineer investigates poison message',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-row arch-row--center">
        <ArchNode icon={<CacheIcon   active={activeIdx >= 0} />}   label="Queue"       sublabel="Messages waiting"   active={activeIdx === 0} onClick={() => setActiveIdx(0)} />
        <Arrow active={activeIdx >= 0} label="claim" />
        <ArchNode icon={<ServerIcon  active={activeIdx >= 0} />}   label="Consumer"    sublabel={activeIdx === 1 ? 'FAILS!' : 'Processing'} active={activeIdx >= 0} danger={activeIdx >= 1 && activeIdx <= 3} onClick={() => setActiveIdx(1)} />
      </div>
      <div className="arch-row arch-row--center" style={{ marginTop: '0.75rem' }}>
        <ArchNode icon={<NetworkIcon active={activeIdx === 2} />}  label="Retry x3"    sublabel="Exp. backoff"       active={activeIdx === 2} onClick={() => setActiveIdx(2)} />
        <Arrow active={activeIdx >= 3} label="give up" />
        <ArchNode icon={<WarningIcon active={activeIdx >= 3} />}   label="DLQ"         sublabel="Dead letter queue"  active={activeIdx >= 3} danger={activeIdx >= 3} onClick={() => setActiveIdx(3)} />
        <Arrow active={activeIdx >= 4} label="alert" />
        <ArchNode icon={<UserIcon    active={activeIdx >= 4} />}   label="Engineer"    sublabel="Investigates"       active={activeIdx >= 4} onClick={() => setActiveIdx(4)} />
      </div>
      {activeIdx === 1 && <div className="arch-danger-banner">Consumer failed - nack sent to broker</div>}
      {activeIdx === 3 && <div className="arch-danger-banner">Max retries reached - poison message sent to DLQ</div>}
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_MQ_DLQ}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_MQ_DLQ} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// MQ DIAGRAM 9 - Brokers comparison
const TOTAL_MQ_BROKERS = 5;
const MQBrokersDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'Three major brokers - each optimised for different use cases',
    'RabbitMQ: flexible routing via exchanges, low latency, complex topologies',
    'Kafka: distributed log, millions/sec, multiple consumer groups, replay',
    'SQS: fully managed AWS, zero ops, unlimited scale, tight AWS integration',
    'Choose based on: routing needs vs throughput vs operational overhead',
  ];
  const brokers = [
    { label: 'RabbitMQ',  sub: 'Routing + low latency', idx: 1 },
    { label: 'Kafka',     sub: 'Streaming + replay',     idx: 2 },
    { label: 'Amazon SQS', sub: 'Managed + zero ops',   idx: 3 },
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-row arch-row--center">
        <ArchNode icon={<ServerIcon active={activeIdx === 0} />}   label="Your needs"  sublabel="Which broker?"      active={activeIdx === 0} onClick={() => setActiveIdx(0)} />
        <Arrow active={activeIdx >= 1} label="choose" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          {brokers.map(b => (
            <ArchNode key={b.label} icon={<NetworkIcon active={activeIdx === b.idx} />} label={b.label} sublabel={b.sub} active={activeIdx === b.idx} onClick={() => setActiveIdx(b.idx)} />
          ))}
        </div>
      </div>
      {activeIdx === 1 && <div className="arch-failover-banner">RabbitMQ: complex routing, task queues, low latency</div>}
      {activeIdx === 2 && <div className="arch-failover-banner">Kafka: event streaming, multiple consumers, replay history</div>}
      {activeIdx === 3 && <div className="arch-failover-banner">SQS: AWS-native, zero management, auto-scales infinitely</div>}
      {activeIdx >= 4  && <div className="arch-failover-banner">Match broker strengths to your actual requirements</div>}
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_MQ_BROKERS}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_MQ_BROKERS} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// MQ DIAGRAM 10 - Practice: backpressure + monitoring
const TOTAL_MQ_PRACTICE = 5;
const MQPracticeDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'Normal: producer and consumer in balance, queue depth stable',
    'Backpressure: producer 10K/s, consumer 2K/s - queue grows fast',
    'Alert: queue depth exceeds threshold - scale up consumers',
    'DLQ growing: poison messages detected - engineer investigates',
    'Schema registry: validates compatibility before publish allowed',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-row arch-row--center">
        <ArchNode icon={<ServerIcon  active={activeIdx === 1} />}  label="Producer"    sublabel={activeIdx === 1 ? '10K/sec!' : 'Normal rate'} active={activeIdx <= 1} danger={activeIdx === 1} onClick={() => setActiveIdx(1)} />
        <Arrow active label="publish" />
        <ArchNode icon={<CacheIcon   active={activeIdx >= 1} />}   label="Queue"       sublabel={activeIdx >= 1 ? 'GROWING!' : 'Stable depth'} active={activeIdx >= 1} danger={activeIdx === 1} onClick={() => setActiveIdx(1)} />
        <Arrow active={activeIdx >= 2} label="consume" />
        <ArchNode icon={<ServerIcon  active={activeIdx >= 2} />}   label="Consumers"   sublabel={activeIdx >= 2 ? 'Scaled up!' : '2K/sec'} active={activeIdx >= 2} onClick={() => setActiveIdx(2)} />
      </div>
      <div className="arch-row arch-row--center" style={{ marginTop: '0.75rem' }}>
        <ArchNode icon={<WarningIcon active={activeIdx === 3} />}  label="DLQ"         sublabel="Poison messages"    active={activeIdx === 3} danger={activeIdx === 3} onClick={() => setActiveIdx(3)} />
        <Arrow active={activeIdx >= 4} label="validate" />
        <ArchNode icon={<LockIcon    active={activeIdx >= 4} />}   label="Schema Reg"  sublabel="Compatibility check" active={activeIdx >= 4} onClick={() => setActiveIdx(4)} />
      </div>
      {activeIdx === 1 && <div className="arch-danger-banner">Queue growing 8K/sec - backpressure detected!</div>}
      {activeIdx === 3 && <div className="arch-danger-banner">DLQ growing - investigate poison messages immediately</div>}
      {activeIdx >= 4  && <div className="arch-failover-banner">Schema registry: reject breaking changes before they reach queue</div>}
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_MQ_PRACTICE}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_MQ_PRACTICE} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// API GATEWAY DIAGRAMS
// ─────────────────────────────────────────────────────────────────────────────

// AG DIAGRAM 1 - Fundamentals: clients to gateway to services
const TOTAL_AG_FUND = 5;
const AGFundamentalsDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'All clients (mobile, web, third-party) send requests to one URL',
    'API Gateway is the single entry point - clients never call services directly',
    'Gateway authenticates the request and checks rate limits',
    'Gateway routes to the correct backend microservice',
    'Response flows back through gateway to client',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-row arch-row--center">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          {['Mobile','Web','Partner'].map(c => (
            <ArchNode key={c} icon={<UserIcon active={activeIdx === 0} />} label={c} sublabel="client" active={activeIdx === 0} onClick={() => setActiveIdx(0)} />
          ))}
        </div>
        <Arrow active={activeIdx >= 1} label="one URL" />
        <ArchNode icon={<NetworkIcon active={activeIdx >= 1} />} label="API Gateway" sublabel="Single entry point" active={activeIdx >= 1} onClick={() => setActiveIdx(1)} />
        <Arrow active={activeIdx >= 3} label="route" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          {['User Svc','Order Svc','Pay Svc'].map(s => (
            <ArchNode key={s} icon={<ServerIcon active={activeIdx >= 3} />} label={s} sublabel="backend" active={activeIdx >= 3} onClick={() => setActiveIdx(3)} />
          ))}
        </div>
      </div>
      {activeIdx >= 4 && <div className="arch-failover-banner">One entry point - backends can change freely without breaking clients</div>}
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_AG_FUND}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_AG_FUND} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// AG DIAGRAM 2 - Architecture: request pipeline
const TOTAL_AG_ARCH = 5;
const AGArchDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'Request enters the API Gateway pipeline',
    'Pre-process: validate headers, authenticate token, check rate limit',
    'Route match: URL path matched to backend service definition',
    'Forward: send request upstream to service instance',
    'Post-process: transform response, add CORS headers, log result',
  ];
  const stages = [
    { label: 'Pre-process',  sub: 'Auth + Rate limit', idx: 1 },
    { label: 'Route match',  sub: 'URL to service',    idx: 2 },
    { label: 'Forward',      sub: 'Upstream call',     idx: 3 },
    { label: 'Post-process', sub: 'Transform + Log',   idx: 4 },
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-row arch-row--center">
        <ArchNode icon={<UserIcon active={activeIdx === 0} />} label="Request" sublabel="Enters pipeline" active={activeIdx === 0} onClick={() => setActiveIdx(0)} />
        {stages.map((s, i) => (
          <React.Fragment key={s.label}>
            <Arrow active={activeIdx > i} label="" />
            <ArchNode icon={i === 0 ? <LockIcon active={activeIdx === s.idx} /> : i === 1 ? <NetworkIcon active={activeIdx === s.idx} /> : i === 2 ? <ServerIcon active={activeIdx === s.idx} /> : <CacheIcon active={activeIdx === s.idx} />}
              label={s.label} sublabel={s.sub} active={activeIdx === s.idx} onClick={() => setActiveIdx(s.idx)} />
          </React.Fragment>
        ))}
        <Arrow active={activeIdx >= 4} label="" />
        <ArchNode icon={<UserIcon active={activeIdx >= 4} />} label="Response" sublabel="To client" active={activeIdx >= 4} />
      </div>
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_AG_ARCH}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_AG_ARCH} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// AG DIAGRAM 3 - Gateway vs Reverse Proxy
const TOTAL_AG_PROXY = 5;
const AGProxyDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const isGW = activeIdx >= 3;
  const descs = [
    'Reverse proxy: SSL termination, load balancing, URL routing',
    'Reverse proxy forwards request - no business logic, no JWT awareness',
    'Request passes through without auth or rate limiting',
    'API Gateway: validates JWT, checks rate limit, transforms payload',
    'They coexist: reverse proxy at edge, API gateway for app logic',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-two-path">
        <div className={`arch-path${!isGW ? ' arch-path--active' : ''}`}>
          <div className="arch-path__label arch-path__label--read">REVERSE PROXY (NGINX)</div>
          <div className="arch-row arch-row--col">
            <ArchNode icon={<NetworkIcon active={activeIdx <= 1} />} label="NGINX" sublabel="SSL + Load balance" active={activeIdx <= 1} onClick={() => setActiveIdx(0)} />
            <VertArrow active={activeIdx >= 1} label="forwards" />
            <ArchNode icon={<ServerIcon active={activeIdx === 2} />} label="Backend" sublabel="No auth check" active={activeIdx === 2} onClick={() => setActiveIdx(2)} />
          </div>
        </div>
        <div className="arch-path-divider" />
        <div className={`arch-path${isGW ? ' arch-path--active' : ''}`}>
          <div className="arch-path__label arch-path__label--write">API GATEWAY (KONG)</div>
          <div className="arch-row arch-row--col">
            <ArchNode icon={<LockIcon active={activeIdx === 3} />} label="API Gateway" sublabel="JWT + Rate limit" active={activeIdx === 3} onClick={() => setActiveIdx(3)} />
            <VertArrow active={activeIdx >= 4} label="routes" />
            <ArchNode icon={<ServerIcon active={activeIdx >= 4} />} label="Service" sublabel="Gets user context" active={activeIdx >= 4} onClick={() => setActiveIdx(4)} />
          </div>
        </div>
      </div>
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_AG_PROXY}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_AG_PROXY} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// AG DIAGRAM 4 - Request Routing
const TOTAL_AG_ROUTE = 5;
const AGRouteDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'GET /api/users/123 arrives at gateway',
    'Gateway matches /api/users/* to User Service routing rule',
    'Path rewritten: strip /api prefix, forward /users/123',
    'Request forwarded to user-service:8080/users/123',
    'Service responds, gateway returns response to client',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-row arch-row--center">
        <ArchNode icon={<UserIcon active={activeIdx === 0} />}    label="Client"       sublabel="GET /api/users/123"  active={activeIdx === 0} onClick={() => setActiveIdx(0)} />
        <Arrow active={activeIdx >= 1} label="request" />
        <ArchNode icon={<NetworkIcon active={activeIdx >= 1} />}  label="API Gateway"  sublabel={activeIdx === 2 ? 'Rewrite path' : 'Route match'} active={activeIdx >= 1} onClick={() => setActiveIdx(1)} />
        <Arrow active={activeIdx >= 3} label="forward" />
        <ArchNode icon={<ServerIcon active={activeIdx >= 3} />}   label="User Service" sublabel="GET /users/123"      active={activeIdx >= 3} onClick={() => setActiveIdx(3)} />
      </div>
      {activeIdx === 1 && <div className="arch-failover-banner">/api/users/* matches User Service rule</div>}
      {activeIdx === 2 && <div className="arch-failover-banner">Strip /api prefix: /api/users/123 becomes /users/123</div>}
      {activeIdx >= 4  && <div className="arch-failover-banner">Response flows back through gateway to client</div>}
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_AG_ROUTE}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_AG_ROUTE} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// AG DIAGRAM 5 - Authentication
const TOTAL_AG_AUTH = 5;
const AGAuthDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'Client sends request with Bearer JWT token in Authorization header',
    'Gateway validates JWT signature and checks expiry',
    'Extract user claims: user_id, role from token payload',
    'Inject trusted headers: X-User-ID, X-User-Role into forwarded request',
    'Backend trusts gateway headers - no re-validation needed',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-row arch-row--center">
        <ArchNode icon={<UserIcon active={activeIdx === 0} />}    label="Client"       sublabel="Bearer: eyJhbGci..." active={activeIdx === 0} onClick={() => setActiveIdx(0)} />
        <Arrow active={activeIdx >= 1} label="+ JWT" />
        <ArchNode icon={<LockIcon active={activeIdx >= 1} />}     label="API Gateway"  sublabel={activeIdx <= 2 ? 'Validating JWT' : 'Injecting headers'} active={activeIdx >= 1} onClick={() => setActiveIdx(1)} />
        <Arrow active={activeIdx >= 3} label="trusted headers" />
        <ArchNode icon={<ServerIcon active={activeIdx >= 3} />}   label="Service"      sublabel={activeIdx >= 3 ? 'X-User-ID: 123' : 'Waiting'} active={activeIdx >= 3} onClick={() => setActiveIdx(3)} />
      </div>
      {activeIdx === 1 && <div className="arch-failover-banner">Validate signature + check expiry</div>}
      {activeIdx === 2 && <div className="arch-failover-banner">Extract: user_id=123, role=admin from claims</div>}
      {activeIdx >= 4  && <div className="arch-failover-banner">Trusted subsystem: service never re-validates tokens</div>}
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_AG_AUTH}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_AG_AUTH} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// AG DIAGRAM 6 - Rate Limiting
const TOTAL_AG_RATE = 5;
const AGRateDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'Client making rapid API requests to the gateway',
    'Gateway checks rate limit counter in Redis: 98 of 100 used',
    'Counter reaches 100 - limit exceeded for this window',
    'Return 429 Too Many Requests with Retry-After: 30 header',
    'Window resets after 30s - client can resume requests',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-row arch-row--center">
        <ArchNode icon={<UserIcon active={activeIdx === 0} />}    label="Client"       sublabel="Rapid requests"      active={activeIdx === 0} danger={activeIdx >= 2} onClick={() => setActiveIdx(0)} />
        <Arrow active={activeIdx >= 1} label="request" />
        <ArchNode icon={<NetworkIcon active={activeIdx >= 1} />}  label="API Gateway"  sublabel={activeIdx >= 2 ? 'LIMIT HIT' : 'Checking Redis'} active={activeIdx >= 1} danger={activeIdx >= 2} onClick={() => setActiveIdx(1)} />
        <Arrow active={activeIdx >= 1} label="check" />
        <ArchNode icon={<RedisIcon active={activeIdx >= 1} />}    label="Redis"        sublabel={activeIdx >= 2 ? '100/100 - FULL' : '98/100 used'} active={activeIdx >= 1} danger={activeIdx >= 2} onClick={() => setActiveIdx(2)} />
      </div>
      {activeIdx >= 2 && activeIdx < 4 && <div className="arch-danger-banner">Rate limit exceeded - 100 requests used in window</div>}
      {activeIdx >= 3 && <div className="arch-danger-banner">429 Too Many Requests - Retry-After: 30 seconds</div>}
      {activeIdx >= 4 && <div className="arch-failover-banner">Window reset - client can send requests again</div>}
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_AG_RATE}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_AG_RATE} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// AG DIAGRAM 7 - Transformation
const TOTAL_AG_TRANSFORM = 5;
const AGTransformDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'Client sends POST /v1/users with XML body',
    'Gateway transforms: convert XML to JSON for backend',
    'Add internal headers, remove client-specific headers',
    'Backend returns JSON with internal fields',
    'Gateway removes internal fields, wraps in {data: ...} envelope',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-row arch-row--center">
        <ArchNode icon={<UserIcon active={activeIdx === 0} />}    label="Client"       sublabel="XML body (v1)"       active={activeIdx === 0} onClick={() => setActiveIdx(0)} />
        <Arrow active={activeIdx >= 1} label="XML" />
        <ArchNode icon={<NetworkIcon active={activeIdx >= 1} />}  label="API Gateway"  sublabel={activeIdx <= 2 ? 'Req transform' : 'Resp transform'} active={activeIdx >= 1} onClick={() => setActiveIdx(1)} />
        <Arrow active={activeIdx >= 2} label="JSON" />
        <ArchNode icon={<ServerIcon active={activeIdx >= 2} />}   label="Backend"      sublabel="Expects JSON"        active={activeIdx >= 2} onClick={() => setActiveIdx(2)} />
      </div>
      {activeIdx === 1 && <div className="arch-failover-banner">XML to JSON conversion + inject X-User-ID header</div>}
      {activeIdx === 3 && <div className="arch-failover-banner">Backend returns {'{'}id, name, internal_key{'}'}</div>}
      {activeIdx >= 4  && <div className="arch-failover-banner">Remove internal_key, wrap: {'{'}data: {'{'}id, name{'}'}{'}'}</div>}
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_AG_TRANSFORM}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_AG_TRANSFORM} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// AG DIAGRAM 8 - Aggregation
const TOTAL_AG_AGG = 5;
const AGAggDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'Client calls GET /api/dashboard - single request',
    'Gateway fires 3 parallel calls to User, Orders, Notifications services',
    'All 3 services respond independently in parallel',
    'Gateway aggregates all 3 responses into one JSON object',
    'Client gets complete dashboard in one round trip - 3x faster',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-row arch-row--center">
        <ArchNode icon={<UserIcon active={activeIdx === 0} />}    label="Client"       sublabel="GET /api/dashboard"  active={activeIdx === 0} onClick={() => setActiveIdx(0)} />
        <Arrow active={activeIdx >= 1} label="1 call" />
        <ArchNode icon={<NetworkIcon active={activeIdx >= 1} />}  label="API Gateway"  sublabel={activeIdx >= 3 ? 'Aggregating' : 'Calling all 3'} active={activeIdx >= 1} onClick={() => setActiveIdx(1)} />
        <Arrow active={activeIdx >= 1} label="parallel" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          {['User Svc','Orders Svc','Notif Svc'].map((s, i) => (
            <ArchNode key={s} icon={<ServerIcon active={activeIdx >= 2} />} label={s} sublabel={activeIdx >= 2 ? 'Responded' : 'Called'} active={activeIdx >= 2} onClick={() => setActiveIdx(2)} />
          ))}
        </div>
      </div>
      {activeIdx >= 3 && <div className="arch-failover-banner">3 parallel calls combined into 1 response - 1 round trip</div>}
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_AG_AGG}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_AG_AGG} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// AG DIAGRAM 9 - Security and Monitoring
const TOTAL_AG_SEC = 5;
const AGSecDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'Request enters gateway - security inspection begins',
    'TLS termination, IP blocklist check, WAF rules applied',
    'Trace ID assigned to request - propagated to all services',
    'Latency, status code, client ID logged to metrics store',
    'Error rate >1% triggers alert to on-call engineer',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-row arch-row--center">
        <ArchNode icon={<UserIcon active={activeIdx === 0} />}    label="Request"      sublabel="Enters gateway"      active={activeIdx === 0} onClick={() => setActiveIdx(0)} />
        <Arrow active={activeIdx >= 1} label="inspect" />
        <ArchNode icon={<LockIcon active={activeIdx >= 1} />}     label="Security"     sublabel="TLS + WAF + IP"      active={activeIdx === 1} onClick={() => setActiveIdx(1)} />
        <Arrow active={activeIdx >= 2} label="trace ID" />
        <ArchNode icon={<NetworkIcon active={activeIdx >= 2} />}  label="Trace"        sublabel="X-Trace-ID: abc"     active={activeIdx === 2} onClick={() => setActiveIdx(2)} />
      </div>
      <div className="arch-row arch-row--center" style={{ marginTop: '0.75rem' }}>
        <ArchNode icon={<CacheIcon active={activeIdx === 3} />}   label="Metrics"      sublabel="Prometheus/Datadog"   active={activeIdx === 3} onClick={() => setActiveIdx(3)} />
        <Arrow active={activeIdx >= 4} label="alert" />
        <ArchNode icon={<WarningIcon active={activeIdx === 4} />} label="Alert"        sublabel="Error rate >1%"       active={activeIdx === 4} danger={activeIdx === 4} onClick={() => setActiveIdx(4)} />
      </div>
      {activeIdx === 1 && <div className="arch-danger-banner">Security layer: block malicious requests at edge</div>}
      {activeIdx >= 4  && <div className="arch-danger-banner">On-call paged - error rate threshold breached</div>}
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_AG_SEC}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_AG_SEC} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// AG DIAGRAM 10 - BFF Pattern
const TOTAL_AG_BFF = 5;
const AGBFFDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'Different clients have different data needs and performance constraints',
    'Mobile BFF: compact payloads, aggregated for bandwidth constraints',
    'Web BFF: rich data responses optimised for desktop browsers',
    'Partner API BFF: strict rate limits, stable versioned API',
    'Each BFF deploys independently - changes to one do not affect others',
  ];
  const bffs = [
    { label: 'Mobile BFF',  sub: 'Compact + aggregated', idx: 1 },
    { label: 'Web BFF',     sub: 'Rich responses',       idx: 2 },
    { label: 'Partner BFF', sub: 'Rate limited + versioned', idx: 3 },
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-row arch-row--center">
        <ArchNode icon={<UserIcon active={activeIdx === 0} />}   label="Clients"      sublabel="Different needs"     active={activeIdx === 0} onClick={() => setActiveIdx(0)} />
        <Arrow active={activeIdx >= 1} label="each type" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          {bffs.map(b => (
            <ArchNode key={b.label} icon={<NetworkIcon active={activeIdx === b.idx} />} label={b.label} sublabel={b.sub} active={activeIdx === b.idx} onClick={() => setActiveIdx(b.idx)} />
          ))}
        </div>
        <Arrow active={activeIdx >= 1} label="to services" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          {['User Svc','Order Svc','Pay Svc'].map(s => (
            <ArchNode key={s} icon={<ServerIcon active={activeIdx >= 1} />} label={s} sublabel="backend" active={activeIdx >= 1} />
          ))}
        </div>
      </div>
      {activeIdx >= 4 && <div className="arch-failover-banner">Each BFF deploys independently - optimised for its client</div>}
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_AG_BFF}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_AG_BFF} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MICROSERVICES DIAGRAMS
// ─────────────────────────────────────────────────────────────────────────────

// MS DIAGRAM 1 - Fundamentals: monolith splits into services
const TOTAL_MS_FUND = 5;
const MSFundamentalsDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'Monolith: one codebase handles users, orders, payments, search',
    'Extract service boundaries based on business capabilities',
    'User Service: owns user data and auth - deploys independently',
    'Order Service: owns order data - scales independently',
    'Each service has its own database - no sharing',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-row arch-row--center">
        <ArchNode icon={<ServerIcon active={activeIdx === 0} />}    label="Monolith"       sublabel="All-in-one"        active={activeIdx === 0} danger={activeIdx === 0} onClick={() => setActiveIdx(0)} />
        <Arrow active={activeIdx >= 1} label="extract" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          <ArchNode icon={<UserIcon    active={activeIdx === 2} />} label="User Service"   sublabel="Auth + profiles"   active={activeIdx === 2} onClick={() => setActiveIdx(2)} />
          <ArchNode icon={<CacheIcon   active={activeIdx === 3} />} label="Order Service"  sublabel="Orders + status"   active={activeIdx === 3} onClick={() => setActiveIdx(3)} />
          <ArchNode icon={<LockIcon    active={activeIdx === 4} />} label="Pay Service"    sublabel="Billing + cards"   active={activeIdx === 4} onClick={() => setActiveIdx(4)} />
        </div>
        <Arrow active={activeIdx >= 2} label="own DB" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          <ArchNode icon={<DatabaseIcon active={activeIdx === 2} />} label="Users DB"      sublabel="PostgreSQL"        active={activeIdx === 2} />
          <ArchNode icon={<DatabaseIcon active={activeIdx === 3} />} label="Orders DB"     sublabel="MySQL"             active={activeIdx === 3} />
          <ArchNode icon={<DatabaseIcon active={activeIdx === 4} />} label="Pay DB"        sublabel="PostgreSQL"        active={activeIdx === 4} />
        </div>
      </div>
      {activeIdx === 0 && <div className="arch-danger-banner">Monolith: one deploy for all - any bug takes down everything</div>}
      {activeIdx >= 2  && <div className="arch-failover-banner">Independent deploy and scale per service</div>}
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_MS_FUND}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_MS_FUND} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// MS DIAGRAM 2 - Monolith vs Microservices
const TOTAL_MS_MONO = 5;
const MSMonoDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const isMS = activeIdx >= 3;
  const descs = [
    'Monolith: all features in one codebase and one deploy',
    'Monolith pain: 30+ engineers, 40min build, one crash = all down',
    'Strangler Fig: extract one service at a time - never big-bang rewrite',
    'Microservices: teams deploy independently, scale independently',
    'Tradeoff: distributed complexity vs deployment independence',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-two-path">
        <div className={`arch-path${!isMS ? ' arch-path--active' : ''}`}>
          <div className="arch-path__label arch-path__label--read">MONOLITH</div>
          <div className="arch-row arch-row--col">
            <ArchNode icon={<ServerIcon active={activeIdx === 0} />} label="One App" sublabel="All features" active={activeIdx === 0} danger={activeIdx === 1} onClick={() => setActiveIdx(0)} />
            <VertArrow active={activeIdx >= 1} label="grows" />
            <ArchNode icon={<DatabaseIcon active={activeIdx === 1} />} label="One DB" sublabel="Shared data" active={activeIdx === 1} danger={activeIdx === 1} onClick={() => setActiveIdx(1)} />
            {activeIdx === 1 && <div className="arch-danger-banner" style={{ marginTop: '0.5rem' }}>40min build - one bug = full outage</div>}
            {activeIdx === 2 && <div className="arch-failover-banner" style={{ marginTop: '0.5rem' }}>Strangler Fig: extract one at a time</div>}
          </div>
        </div>
        <div className="arch-path-divider" />
        <div className={`arch-path${isMS ? ' arch-path--active' : ''}`}>
          <div className="arch-path__label arch-path__label--write">MICROSERVICES</div>
          <div className="arch-row arch-row--col">
            <ArchNode icon={<NetworkIcon active={activeIdx === 3} />} label="API Gateway" sublabel="Single entry" active={activeIdx === 3} onClick={() => setActiveIdx(3)} />
            <VertArrow active={activeIdx >= 4} label="routes" />
            <div className="arch-row arch-row--center" style={{ gap: '0.25rem' }}>
              {['Users','Orders','Pay'].map(s => (
                <ArchNode key={s} icon={<ServerIcon active={activeIdx >= 4} />} label={s} sublabel="Service" active={activeIdx >= 4} onClick={() => setActiveIdx(4)} />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_MS_MONO}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_MS_MONO} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// MS DIAGRAM 3 - Architecture Components
const TOTAL_MS_ARCH = 5;
const MSArchDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'All client requests enter through the API Gateway',
    'Gateway handles auth, rate limiting, routing to correct service',
    'Service Registry: dynamic address book - services register on start',
    'Message Broker: async events decouple services completely',
    'Observability: trace ID follows request across all 20+ services',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-row arch-row--center">
        <ArchNode icon={<UserIcon    active={activeIdx === 0} />} label="Client"      sublabel="One URL"         active={activeIdx === 0} onClick={() => setActiveIdx(0)} />
        <Arrow active={activeIdx >= 1} label="request" />
        <ArchNode icon={<NetworkIcon active={activeIdx >= 1} />} label="API Gateway"  sublabel="Auth + Route"    active={activeIdx === 1} onClick={() => setActiveIdx(1)} />
        <Arrow active={activeIdx >= 2} label="lookup" />
        <ArchNode icon={<LockIcon    active={activeIdx === 2} />} label="Registry"    sublabel="Consul/Eureka"   active={activeIdx === 2} onClick={() => setActiveIdx(2)} />
      </div>
      <div className="arch-row arch-row--center" style={{ marginTop: '0.75rem' }}>
        <ArchNode icon={<CacheIcon   active={activeIdx === 3} />} label="Msg Broker"  sublabel="Kafka/RabbitMQ"  active={activeIdx === 3} onClick={() => setActiveIdx(3)} />
        <Arrow active={activeIdx >= 3} label="events" />
        <ArchNode icon={<ServerIcon  active={activeIdx === 3} />} label="Subscribers" sublabel="Email, Analytics" active={activeIdx === 3} />
        <Arrow active={activeIdx >= 4} label="trace" />
        <ArchNode icon={<NetworkIcon active={activeIdx === 4} />} label="Jaeger"      sublabel="Distributed trace" active={activeIdx === 4} onClick={() => setActiveIdx(4)} />
      </div>
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_MS_ARCH}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_MS_ARCH} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// MS DIAGRAM 4 - Service Decomposition
const TOTAL_MS_DECOMP = 5;
const MSDecompDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'Analyse the business domain - what are the core capabilities?',
    'Identify bounded contexts: clear business boundaries',
    'One microservice per bounded context - owned by one team',
    'Two-pizza rule: team small enough to be fed by two pizzas (5-8)',
    'Validate: a feature should touch at most 1-2 services',
  ];
  const services = [
    { label: 'User', sub: 'auth, profiles' },
    { label: 'Order', sub: 'cart, orders' },
    { label: 'Payment', sub: 'billing, cards' },
    { label: 'Notify', sub: 'email, SMS' },
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-row arch-row--center">
        <ArchNode icon={<ServerIcon active={activeIdx === 0} />}   label="Business Domain" sublabel="Ride-hailing" active={activeIdx === 0} onClick={() => setActiveIdx(0)} />
        <Arrow active={activeIdx >= 1} label="decompose" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          {services.map((s, i) => (
            <ArchNode key={s.label} icon={<CacheIcon active={activeIdx >= 2} />}
              label={s.label + ' Service'} sublabel={s.sub}
              active={activeIdx >= 2} onClick={() => setActiveIdx(2)} />
          ))}
        </div>
      </div>
      {activeIdx === 1 && <div className="arch-failover-banner">Bounded contexts: User, Order, Payment, Notification</div>}
      {activeIdx === 3 && <div className="arch-failover-banner">Each team: 5-8 engineers, fully own their service</div>}
      {activeIdx === 4 && <div className="arch-failover-banner">Good sign: each feature touches 1-2 services max</div>}
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_MS_DECOMP}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_MS_DECOMP} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// MS DIAGRAM 5 - Inter-Service Communication
const TOTAL_MS_COMM = 5;
const MSCommDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'Synchronous REST: Service A calls B and waits for response',
    'gRPC: binary protocol - 10x faster for internal service calls',
    'Async event: Order placed - publish to Kafka topic',
    'Fan-out: Email, Inventory, Analytics all react independently',
    'Decoupled: services do not need to know each other exists',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-row arch-row--center">
        <ArchNode icon={<ServerIcon  active={activeIdx <= 1} />}  label="Service A"    sublabel="Caller"         active={activeIdx <= 1} onClick={() => setActiveIdx(0)} />
        <Arrow active={activeIdx >= 0 && activeIdx <= 1} label={activeIdx === 1 ? 'gRPC' : 'REST'} />
        <ArchNode icon={<ServerIcon  active={activeIdx <= 1} />}  label="Service B"    sublabel="Responds"       active={activeIdx <= 1} onClick={() => setActiveIdx(1)} />
      </div>
      <div className="arch-row arch-row--center" style={{ marginTop: '0.75rem' }}>
        <ArchNode icon={<ServerIcon  active={activeIdx === 2} />} label="Order Service" sublabel="Places order"  active={activeIdx === 2} onClick={() => setActiveIdx(2)} />
        <Arrow active={activeIdx >= 2} label="publish" />
        <ArchNode icon={<CacheIcon   active={activeIdx >= 2} />}  label="Kafka"         sublabel="order.placed"  active={activeIdx >= 2} onClick={() => setActiveIdx(3)} />
        <Arrow active={activeIdx >= 3} label="consume" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {['Email','Inventory','Analytics'].map(s => (
            <ArchNode key={s} icon={<NetworkIcon active={activeIdx >= 3} />} label={s} sublabel="subscriber" active={activeIdx >= 3} onClick={() => setActiveIdx(3)} />
          ))}
        </div>
      </div>
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_MS_COMM}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_MS_COMM} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// MS DIAGRAM 6 - Service Discovery
const TOTAL_MS_DISC = 5;
const MSDiscoveryDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'Service starts: registers its IP and port with the registry',
    'Registry health-checks every instance every 5 seconds',
    'Service A needs to call Service B - queries registry',
    'Registry returns current healthy IP:port of B',
    'Service A calls B using discovered address - dynamic, not hardcoded',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-row arch-row--center">
        <ArchNode icon={<ServerIcon  active={activeIdx === 0} />}  label="Service B"    sublabel="New instance"  active={activeIdx === 0} onClick={() => setActiveIdx(0)} />
        <Arrow active={activeIdx >= 0} label="register" />
        <ArchNode icon={<LockIcon    active={activeIdx >= 0} />}   label="Registry"     sublabel="Consul/K8s DNS" active={activeIdx >= 1} onClick={() => setActiveIdx(1)} />
        <Arrow active={activeIdx >= 2} label="lookup" />
        <ArchNode icon={<ServerIcon  active={activeIdx >= 2} />}   label="Service A"    sublabel="Needs to call B" active={activeIdx >= 2} onClick={() => setActiveIdx(2)} />
      </div>
      <div className="arch-row arch-row--center" style={{ marginTop: '0.75rem' }}>
        <ArchNode icon={<NetworkIcon active={activeIdx >= 3} />}   label="IP:Port"      sublabel="Current address" active={activeIdx >= 3} onClick={() => setActiveIdx(3)} />
        <Arrow active={activeIdx >= 4} label="call" />
        <ArchNode icon={<ServerIcon  active={activeIdx >= 4} />}   label="Service B"    sublabel="Handles request" active={activeIdx >= 4} onClick={() => setActiveIdx(4)} />
      </div>
      {activeIdx === 1 && <div className="arch-failover-banner">Health check every 5s - unhealthy instances removed</div>}
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_MS_DISC}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_MS_DISC} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// MS DIAGRAM 7 - Data Management (Saga)
const TOTAL_MS_DATA = 5;
const MSDataDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'Database per service: no cross-service database sharing',
    'Saga step 1: Order Service creates order (local transaction)',
    'Saga step 2: Payment Service charges card (local transaction)',
    'Inventory fails: compensating TX - refund card, cancel order',
    'Each step is local - ACID within service, eventual across services',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-row arch-row--center">
        <ArchNode icon={<ServerIcon   active={activeIdx >= 1} />}  label="Order Svc"    sublabel="Own DB"         active={activeIdx === 1} onClick={() => setActiveIdx(1)} />
        <Arrow active={activeIdx >= 1} label="step 1" />
        <ArchNode icon={<LockIcon     active={activeIdx >= 2} />}  label="Pay Svc"      sublabel="Own DB"         active={activeIdx === 2} danger={activeIdx === 3} onClick={() => setActiveIdx(2)} />
        <Arrow active={activeIdx >= 2} label="step 2" />
        <ArchNode icon={<CacheIcon    active={activeIdx >= 2} />}  label="Inventory Svc" sublabel="Own DB"        active={activeIdx >= 2} danger={activeIdx === 3} onClick={() => setActiveIdx(3)} />
      </div>
      {activeIdx === 0 && <div className="arch-danger-banner">Rule: NO cross-service database access ever</div>}
      {activeIdx === 3 && <div className="arch-danger-banner">Inventory fails: compensate - refund card + cancel order</div>}
      {activeIdx === 4 && <div className="arch-failover-banner">Eventual consistency across services via Saga</div>}
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_MS_DATA}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_MS_DATA} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// MS DIAGRAM 8 - Deployment / Kubernetes
const TOTAL_MS_DEPLOY = 5;
const MSDeployDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'Dockerfile: package service + runtime + dependencies as image',
    'CI pipeline: code push triggers build, test, push to registry',
    'Kubernetes pulls image and runs containers in the cluster',
    'Rolling deploy: new pods start before old pods stop - zero downtime',
    'Canary: 5% traffic to new version, monitor, then roll to 100%',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-col arch-col--center">
        {[
          { label: 'Dockerfile',    sub: 'Image definition',     idx: 0 },
          { label: 'CI Build',      sub: 'Test + push to ECR',   idx: 1 },
          { label: 'K8s Deploy',    sub: 'Pull image, run pods', idx: 2 },
          { label: 'Rolling',       sub: 'New pods first',       idx: 3 },
          { label: 'Canary',        sub: '5% then 100%',         idx: 4 },
        ].map((step, i) => (
          <React.Fragment key={step.label}>
            <div className={`arch-layer${activeIdx === i ? ' arch-layer--active' : ''}`} onClick={() => setActiveIdx(i)}>
              <div className="arch-layer__icon">
                {i === 0 && <ServerIcon   active={activeIdx === i} />}
                {i === 1 && <NetworkIcon  active={activeIdx === i} />}
                {i === 2 && <CacheIcon    active={activeIdx === i} />}
                {i === 3 && <ServerIcon   active={activeIdx === i} />}
                {i === 4 && <LockIcon     active={activeIdx === i} />}
              </div>
              <div className="arch-layer__info">
                <span className="arch-layer__label">{step.label}</span>
                <span className="arch-layer__sub">{step.sub}</span>
              </div>
              <div className="arch-layer__latency">{i + 1}</div>
            </div>
            {i < 4 && <VertArrow active={activeIdx > i} />}
          </React.Fragment>
        ))}
      </div>
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_MS_DEPLOY}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_MS_DEPLOY} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// MS DIAGRAM 9 - Resilience: Circuit Breaker
const TOTAL_MS_RESIL = 5;
const MSResilDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'Service B becomes slow - taking 30s per request',
    'Service A threads all consumed waiting for B - no capacity left',
    'Circuit breaker trips open after 5 failures in 10 seconds',
    'A returns fallback response immediately - no call to B',
    'After 30s cooldown B tested - if healthy, circuit closes',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-row arch-row--center">
        <ArchNode icon={<UserIcon    active />}                    label="Clients"      sublabel="Incoming requests" active />
        <Arrow active label="requests" />
        <ArchNode icon={<ServerIcon  active={activeIdx <= 2} />}   label="Service A"    sublabel={activeIdx === 1 ? 'Threads full!' : 'Calling B'} active={activeIdx <= 2} danger={activeIdx === 1} onClick={() => setActiveIdx(1)} />
        <Arrow active={activeIdx <= 1} label={activeIdx >= 2 ? 'blocked' : 'calls'} />
        <ArchNode icon={<ServerIcon  active={activeIdx === 0} />}  label="Service B"    sublabel={activeIdx === 0 ? 'Slowing...' : 'SLOW 30s'} active={activeIdx === 0} danger={activeIdx >= 0 && activeIdx <= 2} onClick={() => setActiveIdx(0)} />
      </div>
      <div className="arch-row arch-row--center" style={{ marginTop: '0.75rem' }}>
        <ArchNode icon={<LockIcon    active={activeIdx >= 2} />}   label="Circuit Breaker" sublabel={activeIdx >= 2 ? 'OPEN' : 'Closed'} active={activeIdx >= 2} danger={activeIdx === 2} onClick={() => setActiveIdx(2)} />
        <Arrow active={activeIdx >= 3} label="fallback" />
        <ArchNode icon={<CacheIcon   active={activeIdx >= 3} />}   label="Fallback"     sublabel="Cached/default"  active={activeIdx >= 3} onClick={() => setActiveIdx(3)} />
      </div>
      {activeIdx === 1 && <div className="arch-danger-banner">All threads waiting for B - no capacity for other requests</div>}
      {activeIdx === 2 && <div className="arch-danger-banner">Circuit OPEN: fail fast - no calls to B</div>}
      {activeIdx >= 3 && <div className="arch-failover-banner">Fallback served immediately - users see degraded not broken</div>}
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_MS_RESIL}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_MS_RESIL} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// MS DIAGRAM 10 - Observability: Distributed Tracing
const TOTAL_MS_OBS = 5;
const MSObsDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'Request enters API Gateway - unique Trace ID assigned',
    'Every service logs its processing time with same Trace ID',
    'Payment Service takes 4s - error returned',
    'Jaeger collects all spans and shows complete waterfall',
    'Alert fires: error rate >1% - on-call engineer paged',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-row arch-row--center">
        <ArchNode icon={<NetworkIcon active={activeIdx === 0} />}  label="API Gateway"  sublabel="trace-id: abc123" active={activeIdx === 0} onClick={() => setActiveIdx(0)} />
        <Arrow active={activeIdx >= 1} label="propagate" />
        <ArchNode icon={<ServerIcon  active={activeIdx === 1} />}  label="Order Svc"    sublabel="10ms - OK"        active={activeIdx === 1} onClick={() => setActiveIdx(1)} />
        <Arrow active={activeIdx >= 2} label="call" />
        <ArchNode icon={<LockIcon    active={activeIdx >= 2} />}   label="Payment Svc"  sublabel={activeIdx >= 2 ? '4s - ERROR!' : '...'} active={activeIdx >= 2} danger={activeIdx >= 2 && activeIdx <= 3} onClick={() => setActiveIdx(2)} />
      </div>
      <div className="arch-row arch-row--center" style={{ marginTop: '0.75rem' }}>
        <ArchNode icon={<CacheIcon   active={activeIdx === 3} />}  label="Jaeger"       sublabel="Trace waterfall"  active={activeIdx === 3} onClick={() => setActiveIdx(3)} />
        <Arrow active={activeIdx >= 4} label="alert" />
        <ArchNode icon={<UserIcon    active={activeIdx === 4} />}  label="On-Call"      sublabel="Paged: >1% error" active={activeIdx === 4} onClick={() => setActiveIdx(4)} />
      </div>
      {activeIdx === 2 && <div className="arch-danger-banner">Payment Service failing - 4s latency spike</div>}
      {activeIdx === 3 && <div className="arch-failover-banner">Jaeger: found root cause in 10 seconds via trace ID</div>}
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_MS_OBS}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_MS_OBS} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// DATABASE DESIGN DIAGRAMS
// ─────────────────────────────────────────────────────────────────────────────

// DB DIAGRAM 1 - Fundamentals: entities + schema
const TOTAL_DB_FUND = 5;
const DBFundamentalsDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'Identify entities: User, Order, Product - things your app tracks',
    'Add attributes to each entity: User has name, email, password',
    'Define relationships: User places many Orders',
    'Translate to schema: tables with columns and foreign keys',
    'Optimise: add indexes based on your query patterns',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-row arch-row--center">
        <ArchNode icon={<UserIcon active={activeIdx === 0} />}     label="User Entity"    sublabel="name, email"      active={activeIdx === 0} onClick={() => setActiveIdx(0)} />
        <Arrow active={activeIdx >= 2} label="places" />
        <ArchNode icon={<ServerIcon active={activeIdx === 2} />}   label="Order Entity"   sublabel="date, total"      active={activeIdx === 2} onClick={() => setActiveIdx(2)} />
        <Arrow active={activeIdx >= 2} label="contains" />
        <ArchNode icon={<CacheIcon active={activeIdx === 2} />}    label="Product Entity" sublabel="name, price"      active={activeIdx === 2} onClick={() => setActiveIdx(2)} />
      </div>
      <div className="arch-row arch-row--center" style={{ marginTop: '0.75rem' }}>
        <ArchNode icon={<DatabaseIcon active={activeIdx >= 3} />}  label="Schema"         sublabel="Tables + FK"      active={activeIdx >= 3} onClick={() => setActiveIdx(3)} />
        <Arrow active={activeIdx >= 4} label="add" />
        <ArchNode icon={<LockIcon active={activeIdx >= 4} />}      label="Indexes"        sublabel="Query patterns"   active={activeIdx >= 4} onClick={() => setActiveIdx(4)} />
      </div>
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_DB_FUND}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_DB_FUND} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// DB DIAGRAM 2 - SQL vs NoSQL
const TOTAL_DB_SQLNOSQL = 5;
const DBSqlNoSqlDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const isNoSQL = activeIdx >= 3;
  const descs = [
    'SQL: fixed schema tables with rows and columns',
    'SQL: tables linked by foreign keys, queried with JOIN',
    'SQL: ACID transactions guarantee consistency',
    'NoSQL: flexible JSON documents, no fixed schema',
    'NoSQL: scales horizontally, eventual consistency',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-two-path">
        <div className={`arch-path${!isNoSQL ? ' arch-path--active' : ''}`}>
          <div className="arch-path__label arch-path__label--read">SQL (PostgreSQL)</div>
          <div className="arch-row arch-row--col">
            <ArchNode icon={<DatabaseIcon active={activeIdx === 0} />} label="Users Table" sublabel="id, name, email" active={activeIdx === 0} onClick={() => setActiveIdx(0)} />
            <VertArrow active={activeIdx >= 1} label="JOIN" />
            <ArchNode icon={<DatabaseIcon active={activeIdx === 1} />} label="Orders Table" sublabel="id, user_id FK" active={activeIdx === 1} onClick={() => setActiveIdx(1)} />
            {activeIdx === 2 && <div className="arch-failover-banner" style={{ marginTop: '0.5rem' }}>ACID: atomic, consistent, isolated, durable</div>}
          </div>
        </div>
        <div className="arch-path-divider" />
        <div className={`arch-path${isNoSQL ? ' arch-path--active' : ''}`}>
          <div className="arch-path__label arch-path__label--write">NoSQL (MongoDB)</div>
          <div className="arch-row arch-row--col">
            <ArchNode icon={<CacheIcon active={activeIdx === 3} />} label="User Doc" sublabel='{name, orders:[]}' active={activeIdx === 3} onClick={() => setActiveIdx(3)} />
            <VertArrow active={activeIdx >= 4} label="shard" />
            <div className="arch-row arch-row--center" style={{ gap: '0.3rem' }}>
              {['Node 1','Node 2','Node 3'].map(n => (
                <ArchNode key={n} icon={<ServerIcon active={activeIdx >= 4} />} label={n} sublabel="subset" active={activeIdx >= 4} onClick={() => setActiveIdx(4)} />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_DB_SQLNOSQL}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_DB_SQLNOSQL} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// DB DIAGRAM 3 - Data Modeling (ER diagram style)
const TOTAL_DB_MODEL = 5;
const DBModelDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'Entities: User, Order, Product - draw the boxes first',
    'One-to-many: User(1) places Orders(many) - FK user_id in Orders',
    'Many-to-many: Orders contain Products via order_items junction table',
    'Data types: id BIGINT, email VARCHAR(255), price DECIMAL(10,2)',
    'Constraints: NOT NULL, UNIQUE on email, FOREIGN KEY enforced',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-row arch-row--center">
        <ArchNode icon={<UserIcon active={activeIdx >= 0} />}       label="User"        sublabel="PK: id"            active={activeIdx >= 0} onClick={() => setActiveIdx(0)} />
        <Arrow active={activeIdx >= 1} label="1:many" />
        <ArchNode icon={<ServerIcon active={activeIdx >= 1} />}     label="Order"       sublabel="FK: user_id"       active={activeIdx >= 1} onClick={() => setActiveIdx(1)} />
        <Arrow active={activeIdx >= 2} label="via" />
        <ArchNode icon={<LockIcon active={activeIdx >= 2} />}       label="order_items" sublabel="junction table"    active={activeIdx >= 2} onClick={() => setActiveIdx(2)} />
        <Arrow active={activeIdx >= 2} label="refs" />
        <ArchNode icon={<CacheIcon active={activeIdx >= 2} />}      label="Product"     sublabel="PK: id"            active={activeIdx >= 2} onClick={() => setActiveIdx(2)} />
      </div>
      <div className="arch-row arch-row--center" style={{ marginTop: '0.75rem' }}>
        <ArchNode icon={<DatabaseIcon active={activeIdx >= 3} />}   label="Data Types"  sublabel="BIGINT, VARCHAR"   active={activeIdx >= 3} onClick={() => setActiveIdx(3)} />
        <Arrow active={activeIdx >= 4} label="plus" />
        <ArchNode icon={<NetworkIcon active={activeIdx >= 4} />}    label="Constraints" sublabel="NOT NULL, UNIQUE"  active={activeIdx >= 4} onClick={() => setActiveIdx(4)} />
      </div>
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_DB_MODEL}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_DB_MODEL} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// DB DIAGRAM 4 - Normalization
const TOTAL_DB_NORM = 5;
const DBNormDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'Unnormalised: address duplicated in every order row',
    'Extract address into separate Customers table',
    '3NF achieved: each fact stored exactly once',
    'Query requires JOIN - slightly slower read',
    'Denormalise: cache customer_name in orders for hot read path',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-two-path">
        <div className={`arch-path${activeIdx <= 2 ? ' arch-path--active' : ''}`}>
          <div className="arch-path__label arch-path__label--read">NORMALISED (3NF)</div>
          <div className="arch-row arch-row--col">
            <ArchNode icon={<UserIcon active={activeIdx >= 1} />}       label="Customers" sublabel="id, name, address"  active={activeIdx >= 1} onClick={() => setActiveIdx(1)} danger={activeIdx === 0} />
            <VertArrow active={activeIdx >= 1} label="FK" />
            <ArchNode icon={<DatabaseIcon active={activeIdx >= 1} />}   label="Orders"    sublabel="id, customer_id FK" active={activeIdx >= 1} onClick={() => setActiveIdx(2)} />
            {activeIdx === 0 && <div className="arch-danger-banner" style={{ marginTop: '0.5rem' }}>address duplicated in every row!</div>}
          </div>
        </div>
        <div className="arch-path-divider" />
        <div className={`arch-path${activeIdx >= 3 ? ' arch-path--active' : ''}`}>
          <div className="arch-path__label arch-path__label--write">DENORMALISED</div>
          <div className="arch-row arch-row--col">
            <ArchNode icon={<DatabaseIcon active={activeIdx >= 4} />}   label="Orders"    sublabel="+ customer_name col" active={activeIdx >= 4} onClick={() => setActiveIdx(4)} />
            {activeIdx >= 4 && <div className="arch-failover-banner" style={{ marginTop: '0.5rem' }}>No JOIN needed - read path faster</div>}
            {activeIdx === 3 && <ArchNode icon={<ServerIcon active />} label="JOIN needed" sublabel="3-table join" active />}
          </div>
        </div>
      </div>
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_DB_NORM}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_DB_NORM} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// DB DIAGRAM 5 - Indexing
const TOTAL_DB_INDEX = 5;
const DBIndexDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'No index: find user by email scans ALL 10M rows - O(n)',
    'Full table scan: reads every row one by one - slow!',
    'Add index: CREATE INDEX idx_email ON users(email)',
    'B-tree lookup: jump to matching row in O(log n)',
    'Same query: 200ms drops to under 1ms with index',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-row arch-row--center">
        <ArchNode icon={<ServerIcon active={activeIdx === 0} />}  label="Query"        sublabel="WHERE email=x"    active={activeIdx === 0} onClick={() => setActiveIdx(0)} />
        <Arrow active={activeIdx >= 1} label={activeIdx <= 1 ? 'full scan' : 'index lookup'} />
        <ArchNode icon={<DatabaseIcon active={activeIdx >= 1} />} label="Users Table"  sublabel="10M rows"         active={activeIdx >= 1} danger={activeIdx <= 1} onClick={() => setActiveIdx(1)} />
        <Arrow active={activeIdx >= 3} label="O(log n)" />
        <ArchNode icon={<LockIcon active={activeIdx >= 2} />}     label="B-tree Index" sublabel="idx_email"        active={activeIdx >= 2} onClick={() => setActiveIdx(2)} />
      </div>
      {activeIdx <= 1 && <div className="arch-danger-banner">Full scan: reads all 10M rows - 200ms!</div>}
      {activeIdx >= 3 && <div className="arch-failover-banner">Index: jumps directly to row - under 1ms</div>}
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_DB_INDEX}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_DB_INDEX} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// DB DIAGRAM 6 - Replication
const TOTAL_DB_REPL = 5;
const DBReplicationDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'All writes go exclusively to the Primary database',
    'Primary records every change in the Write-Ahead Log (WAL)',
    'Replicas read the WAL and apply the same changes',
    'Read queries distributed across replicas - 3x read capacity',
    'Primary fails: replica promoted automatically in under 30 seconds',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-row arch-row--center">
        <ArchNode icon={<ServerIcon active={activeIdx <= 2} />}    label="App Server"   sublabel="Routes writes/reads"  active={activeIdx === 0} onClick={() => setActiveIdx(0)} />
        <Arrow active label="writes" />
        <ArchNode icon={<DatabaseIcon active={activeIdx <= 2} />}  label="Primary DB"   sublabel="All writes here"      active={activeIdx <= 2} danger={activeIdx === 4} onClick={() => setActiveIdx(1)} />
      </div>
      <div className="arch-row arch-row--center" style={{ marginTop: '0.75rem' }}>
        {['Replica 1','Replica 2'].map((r, i) => (
          <ArchNode key={r} icon={<DatabaseIcon active={activeIdx >= 3 || (activeIdx === 4 && i === 0)} />}
            label={activeIdx === 4 && i === 0 ? 'New Primary' : r}
            sublabel={activeIdx >= 3 ? 'Read traffic' : 'Syncing'}
            active={activeIdx >= 2}
            onClick={() => setActiveIdx(3)} />
        ))}
        <ArchNode icon={<NetworkIcon active={activeIdx >= 1} />}   label="WAL Log"      sublabel="Change stream"        active={activeIdx >= 1} onClick={() => setActiveIdx(1)} />
      </div>
      {activeIdx === 4 && <div className="arch-failover-banner">Primary failed - Replica 1 promoted automatically</div>}
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_DB_REPL}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_DB_REPL} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// DB DIAGRAM 7 - Sharding
const TOTAL_DB_SHARD = 5;
const DBShardDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'Single DB: 500GB data, write throughput maxed out',
    'Define shard key: user_id determines which shard',
    'Shard 1: user IDs 1 to 10M - independent DB server',
    'Shard 2: user IDs 10M to 20M - another DB server',
    'App hashes user_id to find correct shard, routes there',
  ];
  const shards = [
    { label: 'Shard 1', sub: 'IDs 1-10M',    active: activeIdx === 2 },
    { label: 'Shard 2', sub: 'IDs 10M-20M',  active: activeIdx === 3 },
    { label: 'Shard 3', sub: 'IDs 20M+',     active: activeIdx >= 4  },
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-row arch-row--center">
        <ArchNode icon={<ServerIcon active />}                      label="App"          sublabel="Routes by shard key"  active />
        <Arrow active={activeIdx >= 1} label="hash(user_id)" />
        <ArchNode icon={<NetworkIcon active={activeIdx >= 1} />}    label="Shard Router" sublabel="Picks shard"          active={activeIdx >= 1} onClick={() => setActiveIdx(1)} />
        <Arrow active={activeIdx >= 2} label="route" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          {shards.map((s, i) => (
            <ArchNode key={s.label} icon={<DatabaseIcon active={s.active} />} label={s.label} sublabel={s.sub} active={s.active} onClick={() => setActiveIdx(i + 2)} />
          ))}
        </div>
      </div>
      {activeIdx === 0 && <div className="arch-danger-banner">Single DB at capacity - writes bottlenecked</div>}
      {activeIdx >= 2  && <div className="arch-failover-banner">Each shard is independent - scales linearly</div>}
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_DB_SHARD}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_DB_SHARD} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// DB DIAGRAM 8 - ACID Transactions
const TOTAL_DB_ACID = 5;
const DBACIDDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'BEGIN TRANSACTION: start an atomic unit of work',
    'Debit Account A: UPDATE balance = balance - 100',
    'Credit Account B: UPDATE balance = balance + 100',
    'COMMIT: both changes persist together - atomic success',
    'On error: ROLLBACK reverts all changes - nothing persists',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-row arch-row--center">
        <ArchNode icon={<LockIcon active={activeIdx === 0} />}      label="BEGIN TX"     sublabel="Atomic unit"          active={activeIdx === 0} onClick={() => setActiveIdx(0)} />
        <Arrow active={activeIdx >= 1} label="step 1" />
        <ArchNode icon={<DatabaseIcon active={activeIdx === 1} />}  label="Debit A"      sublabel="balance - 100"        active={activeIdx === 1} danger={activeIdx === 4} onClick={() => setActiveIdx(1)} />
        <Arrow active={activeIdx >= 2} label="step 2" />
        <ArchNode icon={<DatabaseIcon active={activeIdx === 2} />}  label="Credit B"     sublabel="balance + 100"        active={activeIdx === 2} danger={activeIdx === 4} onClick={() => setActiveIdx(2)} />
      </div>
      <div className="arch-row arch-row--center" style={{ marginTop: '0.75rem' }}>
        <ArchNode icon={<NetworkIcon active={activeIdx === 3} />}   label="COMMIT"       sublabel="Both persist"         active={activeIdx === 3} onClick={() => setActiveIdx(3)} />
        <ArchNode icon={<WarningIcon active={activeIdx === 4} />}   label="ROLLBACK"     sublabel="Error: undo all"      active={activeIdx === 4} danger={activeIdx === 4} onClick={() => setActiveIdx(4)} />
      </div>
      {activeIdx === 3 && <div className="arch-failover-banner">COMMIT: Atomicity + Durability guaranteed</div>}
      {activeIdx === 4 && <div className="arch-danger-banner">ROLLBACK: all changes reverted - no half-state</div>}
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_DB_ACID}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_DB_ACID} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// DB DIAGRAM 9 - CAP Theorem
const TOTAL_DB_CAP = 5;
const DBCAPDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'Write balance to Node 1 - both nodes should reflect this',
    'Network partition: Node 1 and Node 2 cannot communicate',
    'CP choice: Node 2 refuses reads to avoid stale data',
    'AP choice: Node 2 serves old balance - stays available',
    'Partition heals: nodes sync and converge eventually',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-row arch-row--center">
        <ArchNode icon={<UserIcon active={activeIdx === 0} />}     label="Write"        sublabel="balance = 500"        active={activeIdx === 0} onClick={() => setActiveIdx(0)} />
        <Arrow active={activeIdx >= 0} label="update" />
        <ArchNode icon={<DatabaseIcon active={activeIdx <= 1} />}  label="Node 1"       sublabel="balance = 500"        active={activeIdx <= 1} onClick={() => setActiveIdx(1)} />
        <Arrow active={activeIdx === 1} label="partition!" />
        <ArchNode icon={<DatabaseIcon active={activeIdx >= 2} />}  label="Node 2"
          sublabel={activeIdx === 2 ? 'REFUSED' : activeIdx === 3 ? 'balance=400 (stale)' : activeIdx >= 4 ? 'synced' : 'balance=400'}
          active={activeIdx >= 2} danger={activeIdx === 1} onClick={() => setActiveIdx(activeIdx >= 3 ? 4 : 2)} />
      </div>
      {activeIdx === 1 && <div className="arch-danger-banner">Network partition: nodes cannot communicate</div>}
      {activeIdx === 2 && <div className="arch-danger-banner">CP: Node 2 refuses reads - prefers consistency</div>}
      {activeIdx === 3 && <div className="arch-failover-banner">AP: Node 2 serves stale data - prefers availability</div>}
      {activeIdx >= 4  && <div className="arch-failover-banner">Partition healed: nodes sync - eventual consistency</div>}
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_DB_CAP}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_DB_CAP} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// DB DIAGRAM 10 - Practice: migrations + monitoring
const TOTAL_DB_PRACTICE = 5;
const DBPracticeDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'Migration: versioned script changes schema safely',
    'Add nullable column first - instant, no table lock',
    'Backfill existing rows in small batches with sleep',
    'Add NOT NULL constraint after all rows have a value',
    'Monitor: slow query log, replication lag, disk usage',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-col arch-col--center">
        {[
          { label: 'Migration Script', sub: 'Versioned, reversible', idx: 0 },
          { label: 'Add Nullable Col', sub: 'ALTER: instant op',      idx: 1 },
          { label: 'Backfill Batches', sub: '10K rows + sleep',       idx: 2 },
          { label: 'Add Constraint',   sub: 'NOT NULL applied',       idx: 3 },
          { label: 'Monitor',          sub: 'Slow log + lag',         idx: 4 },
        ].map((step, i) => (
          <React.Fragment key={step.label}>
            <div className={`arch-layer${activeIdx === i ? ' arch-layer--active' : ''}`} onClick={() => setActiveIdx(i)}>
              <div className="arch-layer__icon">
                {i === 0 && <ServerIcon   active={activeIdx === i} />}
                {i === 1 && <DatabaseIcon active={activeIdx === i} />}
                {i === 2 && <CacheIcon    active={activeIdx === i} />}
                {i === 3 && <LockIcon     active={activeIdx === i} />}
                {i === 4 && <NetworkIcon  active={activeIdx === i} />}
              </div>
              <div className="arch-layer__info">
                <span className="arch-layer__label">{step.label}</span>
                <span className="arch-layer__sub">{step.sub}</span>
              </div>
              <div className="arch-layer__latency">{i + 1}</div>
            </div>
            {i < 4 && <VertArrow active={activeIdx > i} />}
          </React.Fragment>
        ))}
      </div>
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_DB_PRACTICE}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_DB_PRACTICE} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// LOAD BALANCING DIAGRAMS
// ─────────────────────────────────────────────────────────────────────────────

// LB DIAGRAM 1 - Fundamentals
const TOTAL_LB_FUND = 5;
const LBFundamentalsDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'Thousands of clients send requests to a single load balancer IP',
    'Load balancer is the single entry point - one IP for all clients',
    'Requests distributed across Server 1, 2, and 3',
    'No single server gets overwhelmed - load shared evenly',
    'If one server fails, load balancer routes around it automatically',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-row arch-row--center">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          {(['Client 1','Client 2','Client 3'] as string[]).map(c => (
            <ArchNode key={c} icon={<UserIcon active={activeIdx === 0} />} label={c} sublabel="Sends request" active={activeIdx === 0} onClick={() => setActiveIdx(0)} />
          ))}
        </div>
        <Arrow active={activeIdx >= 1} label="all traffic" />
        <ArchNode icon={<NetworkIcon active={activeIdx >= 1} />} label="Load Balancer" sublabel="Single entry point" active={activeIdx >= 1} onClick={() => setActiveIdx(1)} />
        <Arrow active={activeIdx >= 2} label="distribute" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          {(['Server 1','Server 2','Server 3'] as string[]).map((s, i) => (
            <ArchNode key={s} icon={<ServerIcon active={activeIdx >= 2} />} label={s} sublabel="Handles share" active={activeIdx >= 2} onClick={() => setActiveIdx(2 + i)} />
          ))}
        </div>
      </div>
      {activeIdx >= 4 && <div className="arch-failover-banner">Load evenly distributed - no server overwhelmed</div>}
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_LB_FUND}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_LB_FUND} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// LB DIAGRAM 2 - Layer 4 vs Layer 7
const TOTAL_LB_TYPES = 5;
const LBTypesDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const isL7 = activeIdx >= 3;
  const descs = [
    'Client sends HTTP request to load balancer',
    'Layer 4: sees only IP and port - cannot read HTTP content',
    'Layer 4 routes blindly by network info - fast but no path routing',
    'Layer 7: reads URL, headers, cookies - intelligent routing',
    'Layer 7: /api to API servers, /images to media servers',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-two-path">
        <div className={`arch-path${!isL7 ? ' arch-path--active' : ''}`}>
          <div className="arch-path__label arch-path__label--read">LAYER 4 (TCP)</div>
          <div className="arch-row arch-row--col">
            <ArchNode icon={<NetworkIcon active={activeIdx === 1} />} label="L4 Balancer" sublabel="Sees IP + port only" active={activeIdx <= 2} onClick={() => setActiveIdx(1)} />
            <VertArrow active={activeIdx >= 2} label="route by IP" />
            <ArchNode icon={<ServerIcon active={activeIdx === 2} />} label="Any Server" sublabel="Blind routing" active={activeIdx === 2} onClick={() => setActiveIdx(2)} />
          </div>
        </div>
        <div className="arch-path-divider" />
        <div className={`arch-path${isL7 ? ' arch-path--active' : ''}`}>
          <div className="arch-path__label arch-path__label--write">LAYER 7 (HTTP)</div>
          <div className="arch-row arch-row--col">
            <ArchNode icon={<NetworkIcon active={activeIdx >= 3} />} label="L7 Balancer" sublabel="Reads URL + headers" active={activeIdx >= 3} onClick={() => setActiveIdx(3)} />
            <VertArrow active={activeIdx >= 4} label="path routing" />
            <div style={{ display: 'flex', gap: '0.3rem' }}>
              <ArchNode icon={<ServerIcon active={activeIdx >= 4} />} label="/api" sublabel="API servers" active={activeIdx >= 4} onClick={() => setActiveIdx(4)} />
              <ArchNode icon={<CacheIcon active={activeIdx >= 4} />} label="/images" sublabel="Media servers" active={activeIdx >= 4} />
            </div>
          </div>
        </div>
      </div>
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_LB_TYPES}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_LB_TYPES} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// LB DIAGRAM 3 - Algorithms overview
const TOTAL_LB_ALGO = 5;
const LBAlgoDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'Request arrives - which algorithm picks the server?',
    'Round Robin: rotate through servers in order - simple, stateless',
    'Least Connections: pick server with fewest active connections now',
    'IP Hash: same client IP always hits same server',
    'Weighted: more powerful servers get proportionally more traffic',
  ];
  const algos = [
    { label: 'Round Robin', sub: 'Rotate in order' },
    { label: 'Least Conn',  sub: 'Fewest active now' },
    { label: 'IP Hash',     sub: 'Same IP = same server' },
    { label: 'Weighted',    sub: 'By server capacity' },
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-row arch-row--center">
        <ArchNode icon={<UserIcon active={activeIdx === 0} />} label="Request" sublabel="Arrives at LB" active={activeIdx === 0} onClick={() => setActiveIdx(0)} />
        <Arrow active={activeIdx >= 1} label="algorithm decides" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          {algos.map((a, i) => (
            <ArchNode key={a.label} icon={<ServerIcon active={activeIdx === i + 1} />} label={a.label} sublabel={a.sub} active={activeIdx === i + 1} onClick={() => setActiveIdx(i + 1)} />
          ))}
        </div>
      </div>
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_LB_ALGO}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_LB_ALGO} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// LB DIAGRAM 4 - Round Robin
const TOTAL_LB_RR = 5;
const LBRoundRobinDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'Request 1 goes to Server A (position 1 in rotation)',
    'Request 2 goes to Server B (position 2)',
    'Request 3 goes to Server C (position 3)',
    'Request 4 wraps back to Server A',
    'Weighted: Server A (weight 3) gets 3x more than Server B (weight 1)',
  ];
  const servers = ['A', 'B', 'C'];
  return (
    <div className="arch-diagram">
      <div className="arch-row arch-row--center">
        <ArchNode icon={<NetworkIcon active />} label="Load Balancer" sublabel="Round Robin pointer" active />
        <Arrow active label={'req ' + (activeIdx + 1)} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          {servers.map((s, i) => (
            <ArchNode key={s} icon={<ServerIcon active={activeIdx % 3 === i || (activeIdx === 4 && i === 0)} />}
              label={'Server ' + s}
              sublabel={activeIdx === 4 ? (i === 0 ? 'weight 3' : 'weight 1') : 'position ' + (i + 1)}
              active={activeIdx % 3 === i || (activeIdx === 4 && i === 0)}
              onClick={() => setActiveIdx(i)} />
          ))}
        </div>
      </div>
      {activeIdx === 4 && <div className="arch-failover-banner">Server A gets 3/5 = 60% of traffic (Weighted)</div>}
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_LB_RR}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_LB_RR} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// LB DIAGRAM 5 - Least Connections
const TOTAL_LB_LC = 5;
const LBLeastConnDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const conns = [[5,2,8],[5,2,8],[5,3,8],[5,3,8],[5,3,8]];
  const descs = [
    'Current state: A=5, B=2, C=8 active connections',
    'New request arrives - check all servers connection counts',
    'Server B has fewest (2) - route request there',
    'Server B count rises to 3 - still least busy',
    'Next request: A=5, B=3, C=8 - B chosen again',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-row arch-row--center">
        <ArchNode icon={<UserIcon active={activeIdx === 1} />} label="New Request" sublabel="Waiting to route" active={activeIdx === 1} onClick={() => setActiveIdx(1)} />
        <Arrow active={activeIdx >= 2} label="route to B" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          {(['A','B','C'] as string[]).map((s, i) => (
            <ArchNode key={s} icon={<ServerIcon active={activeIdx >= 2 && i === 1} />}
              label={'Server ' + s}
              sublabel={conns[activeIdx][i] + ' connections'}
              active={activeIdx >= 2 && i === 1}
              danger={i === 2}
              onClick={() => setActiveIdx(i + 1)} />
          ))}
        </div>
      </div>
      {activeIdx >= 2 && <div className="arch-failover-banner">Server B chosen - fewest active connections</div>}
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_LB_LC}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_LB_LC} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// LB DIAGRAM 6 - Consistent Hashing
const TOTAL_LB_HASH = 5;
const LBHashDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'Servers placed at positions on a 0 to 2^32 hash ring',
    'Request key is hashed to a ring position',
    'Route to first server clockwise from the key position',
    'Adding a server: only 1/N keys remap - minimal disruption',
    'Virtual nodes: each server gets many positions for even spread',
  ];
  const nodes = ['Node 1 (0-5460)','Node 2 (5461-10922)','Node 3 (10923-16383)'];
  return (
    <div className="arch-diagram">
      <div className="arch-cluster">
        <div className="arch-cluster__client">
          <ArchNode icon={<UserIcon active={activeIdx === 1} />} label="Key hashed" sublabel={activeIdx >= 1 ? 'hash(key) = 7638' : 'request'} active={activeIdx >= 1} onClick={() => setActiveIdx(1)} />
        </div>
        <Arrow active={activeIdx >= 2} label="clockwise" />
        <div className="arch-cluster__nodes">
          {nodes.map((n, i) => (
            <ArchNode key={i}
              icon={<CacheIcon active={activeIdx === 2 && i === 1} />}
              label={'Node ' + (i + 1)}
              sublabel={activeIdx >= 3 && i === 1 ? 'only 1/3 keys move' : n}
              active={activeIdx === 2 && i === 1}
              onClick={() => setActiveIdx(2)} />
          ))}
        </div>
      </div>
      {activeIdx === 3 && <div className="arch-failover-banner">New node added: only 1/N keys remapped</div>}
      {activeIdx === 4 && <div className="arch-failover-banner">Virtual nodes: 150 positions per server - even distribution</div>}
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_LB_HASH}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_LB_HASH} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// LB DIAGRAM 7 - Health Checks and Failover
const TOTAL_LB_HEALTH = 5;
const LBHealthDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'Load balancer pings each server every 5 seconds',
    'Server 2 stops responding to health check pings',
    'After 3 failures Server 2 marked unhealthy - removed from pool',
    'All traffic reroutes to Server 1 and Server 3 automatically',
    'Server 2 recovers, passes checks again - rejoins pool',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-row arch-row--center">
        <ArchNode icon={<NetworkIcon active={activeIdx >= 1} />} label="Load Balancer" sublabel="Health pinging" active={activeIdx >= 1} onClick={() => setActiveIdx(1)} />
        <Arrow active={activeIdx >= 3} label="reroute" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          <ArchNode icon={<ServerIcon active={activeIdx >= 3} />} label="Server 1" sublabel="Healthy" active={activeIdx >= 3} onClick={() => setActiveIdx(3)} />
          <ArchNode icon={<ServerIcon active={activeIdx === 1} />} label="Server 2"
            sublabel={activeIdx === 1 ? 'No response!' : activeIdx >= 2 && activeIdx <= 3 ? 'REMOVED' : activeIdx >= 4 ? 'Recovering' : 'Healthy'}
            active={activeIdx === 1} danger={activeIdx >= 1 && activeIdx <= 3} onClick={() => setActiveIdx(1)} />
          <ArchNode icon={<ServerIcon active={activeIdx >= 3} />} label="Server 3" sublabel="Healthy" active={activeIdx >= 3} onClick={() => setActiveIdx(3)} />
        </div>
      </div>
      {activeIdx === 1 && <div className="arch-danger-banner">Server 2 not responding to health checks</div>}
      {activeIdx === 2 && <div className="arch-danger-banner">Server 2 marked unhealthy - removed from rotation</div>}
      {activeIdx >= 4 && <div className="arch-failover-banner">Server 2 recovered - rejoining pool</div>}
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_LB_HEALTH}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_LB_HEALTH} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// LB DIAGRAM 8 - Sticky Sessions
const TOTAL_LB_STICKY = 5;
const LBStickyDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'User first request hits Server A - LB inserts sticky cookie',
    'Cookie AWSALB=server-a stored in browser',
    'All subsequent requests routed to Server A via cookie',
    'Server A crashes - sticky session lost - user logged out',
    'Better fix: sessions in Redis - any server handles any user',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-row arch-row--center">
        <ArchNode icon={<UserIcon active={activeIdx <= 2} />} label="User" sublabel={activeIdx >= 1 ? 'Has AWSALB cookie' : 'First request'} active={activeIdx <= 2} onClick={() => setActiveIdx(0)} />
        <Arrow active={activeIdx >= 1} label={activeIdx >= 2 ? 'cookie->A' : 'first req'} />
        <ArchNode icon={<NetworkIcon active={activeIdx >= 1} />} label="Load Balancer" sublabel={activeIdx >= 1 ? 'Reads cookie' : 'No cookie yet'} active={activeIdx >= 1} onClick={() => setActiveIdx(1)} />
        <Arrow active={activeIdx >= 1} label="pin to A" />
        <ArchNode icon={<ServerIcon active={activeIdx >= 1 && activeIdx <= 2} />}
          label="Server A"
          sublabel={activeIdx === 3 ? 'CRASHED' : 'Pinned session'}
          active={activeIdx >= 1 && activeIdx <= 2} danger={activeIdx === 3}
          onClick={() => setActiveIdx(2)} />
      </div>
      <div className="arch-row arch-row--center" style={{ marginTop: '0.75rem' }}>
        <ArchNode icon={<RedisIcon active={activeIdx === 4} />} label="Redis" sublabel={activeIdx === 4 ? 'Shared sessions - better!' : 'Better option'} active={activeIdx === 4} onClick={() => setActiveIdx(4)} />
      </div>
      {activeIdx === 3 && <div className="arch-danger-banner">Server A crashed - session lost - user logged out!</div>}
      {activeIdx === 4 && <div className="arch-failover-banner">Redis sessions: any server handles any user</div>}
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_LB_STICKY}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_LB_STICKY} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// LB DIAGRAM 9 - High Availability Active-Passive
const TOTAL_LB_HA = 5;
const LBHADiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'Active LB handles all traffic - passive LB on standby',
    'Both share a Virtual IP address (VIP)',
    'Active LB fails - passive detects via heartbeat',
    'Passive takes over VIP within seconds - zero downtime',
    'Multi-region: DNS routes to healthy region if DC fails',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-row arch-row--center">
        <ArchNode icon={<UserIcon active />} label="Clients" sublabel="Send to VIP" active />
        <Arrow active label="VIP traffic" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <ArchNode icon={<NetworkIcon active={activeIdx <= 1} />}
            label="Active LB"
            sublabel={activeIdx >= 2 ? 'FAILED' : 'Handles all traffic'}
            active={activeIdx <= 1} danger={activeIdx >= 2 && activeIdx <= 3}
            onClick={() => setActiveIdx(1)} />
          <ArchNode icon={<NetworkIcon active={activeIdx >= 3} />}
            label="Passive LB"
            sublabel={activeIdx >= 3 ? 'Now ACTIVE - took VIP' : 'Standby'}
            active={activeIdx >= 3}
            onClick={() => setActiveIdx(3)} />
        </div>
        <Arrow active label="to servers" />
        <ArchNode icon={<ServerIcon active />} label="App Servers" sublabel="Always healthy" active />
      </div>
      {activeIdx === 2 && <div className="arch-danger-banner">Active LB failed - passive detecting via heartbeat</div>}
      {activeIdx >= 3 && <div className="arch-failover-banner">Passive took over VIP - zero downtime for users</div>}
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_LB_HA}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_LB_HA} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// LB DIAGRAM 10 - Practice: SSL + Rate Limiting + Drain
const TOTAL_LB_PRACTICE = 5;
const LBPracticeDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = [
    'HTTPS request arrives at load balancer from client',
    'SSL terminates at LB - backend servers receive plain HTTP',
    'Rate limiter rejects excess requests before hitting app servers',
    'Connection draining: server removed gracefully - in-flight requests complete',
    'LB collects metrics: latency, error rates, connection counts per server',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-row arch-row--center">
        <ArchNode icon={<UserIcon active={activeIdx === 0} />} label="Client" sublabel="HTTPS request" active={activeIdx === 0} onClick={() => setActiveIdx(0)} />
        <Arrow active={activeIdx >= 1} label="HTTPS" />
        <ArchNode icon={<LockIcon active={activeIdx >= 1} />} label="Load Balancer"
          sublabel={activeIdx === 1 ? 'SSL terminates' : activeIdx === 2 ? 'Rate limiter' : activeIdx === 3 ? 'Drain mode' : 'Monitoring'}
          active={activeIdx >= 1} onClick={() => setActiveIdx(1)} />
        <Arrow active={activeIdx >= 1 && activeIdx !== 2} label="HTTP" />
        <ArchNode icon={<ServerIcon active={activeIdx >= 1 && activeIdx !== 2 && activeIdx !== 3} />}
          label="App Servers"
          sublabel={activeIdx === 3 ? 'Draining...' : 'No SSL overhead'}
          active={activeIdx >= 1 && activeIdx !== 2 && activeIdx !== 3}
          danger={activeIdx === 3}
          onClick={() => setActiveIdx(4)} />
      </div>
      {activeIdx === 1 && <div className="arch-failover-banner">SSL terminates at LB - saves backend CPU</div>}
      {activeIdx === 2 && <div className="arch-danger-banner">Rate limit exceeded - request rejected at edge</div>}
      {activeIdx === 3 && <div className="arch-failover-banner">Connection draining: existing requests complete before shutdown</div>}
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_LB_PRACTICE}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_LB_PRACTICE} setActiveIdx={setActiveIdx} />
    </div>
  );
};


// SA DIAGRAM 4b - Client-Server Architecture
const TOTAL_SA_CLIENT_SERVER = 5;
const SAClientServerDiagram = ({ activeIdx, setActiveIdx }) => {
  const descs = [
    'Client sends HTTP request to the server',
    '2-tier: client talks directly to database - simple apps',
    '3-tier: client talks to app server which talks to database',
    'Stateless server: JWT in every request - any server handles any user',
    'Multiple clients (mobile, web) share one stateless backend',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-two-path">
        <div className={'arch-path' + (activeIdx <= 1 ? ' arch-path--active' : '')}>
          <div className="arch-path__label arch-path__label--read">2-TIER</div>
          <div className="arch-row arch-row--col">
            <ArchNode icon={<UserIcon active={activeIdx === 0} />} label="Client" sublabel="Browser / App" active={activeIdx === 0} onClick={() => setActiveIdx(0)} />
            <VertArrow active={activeIdx >= 1} label="direct SQL" />
            <ArchNode icon={<DatabaseIcon active={activeIdx === 1} />} label="Database" sublabel="Direct access" active={activeIdx === 1} onClick={() => setActiveIdx(1)} />
          </div>
        </div>
        <div className="arch-path-divider" />
        <div className={'arch-path' + (activeIdx >= 2 ? ' arch-path--active' : '')}>
          <div className="arch-path__label arch-path__label--write">3-TIER</div>
          <div className="arch-row arch-row--col">
            <ArchNode icon={<UserIcon active={activeIdx >= 2} />} label="Client" sublabel="Sends JWT" active={activeIdx === 2} onClick={() => setActiveIdx(2)} />
            <VertArrow active={activeIdx >= 3} label="HTTP" />
            <ArchNode icon={<ServerIcon active={activeIdx === 3} />} label="App Server" sublabel="Stateless" active={activeIdx === 3} onClick={() => setActiveIdx(3)} />
            <VertArrow active={activeIdx >= 4} label="query" />
            <ArchNode icon={<DatabaseIcon active={activeIdx >= 4} />} label="Database" sublabel="Isolated" active={activeIdx >= 4} onClick={() => setActiveIdx(4)} />
          </div>
        </div>
      </div>
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_SA_CLIENT_SERVER}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_SA_CLIENT_SERVER} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// SA DIAGRAM 6b - Service Communication (REST vs gRPC vs WebSocket)
const TOTAL_SA_SVC_COMM = 5;
const SAServiceCommDiagram = ({ activeIdx, setActiveIdx }) => {
  const descs = [
    'REST: HTTP + JSON - universal, simple, slight overhead',
    'gRPC: Protobuf over HTTP/2 - 10x faster for internal calls',
    'WebSocket: persistent bidirectional - real-time push features',
    'Sync: caller waits (REST/gRPC) - for immediate response needed',
    'Async: fire and forget (queue) - for background work',
  ];
  const protocols = [
    { label: 'REST',      sub: 'HTTP+JSON universal',    idx: 0 },
    { label: 'gRPC',      sub: 'Protobuf 10x faster',    idx: 1 },
    { label: 'WebSocket', sub: 'Bidirectional real-time', idx: 2 },
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-row arch-row--center">
        <ArchNode icon={<ServerIcon active={activeIdx <= 2} />} label="Service A" sublabel="Caller" active />
        <Arrow active label="protocol" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          {protocols.map(p => (
            <ArchNode key={p.label} icon={<NetworkIcon active={activeIdx === p.idx} />} label={p.label} sublabel={p.sub} active={activeIdx === p.idx} onClick={() => setActiveIdx(p.idx)} />
          ))}
        </div>
        <Arrow active label="to" />
        <ArchNode icon={<ServerIcon active={activeIdx <= 2} />} label="Service B" sublabel="Receiver" active />
      </div>
      <div className="arch-row arch-row--center" style={{ marginTop: '0.75rem' }}>
        <ArchNode icon={<LockIcon   active={activeIdx === 3} />} label="Sync"  sublabel="Wait for response" active={activeIdx === 3} onClick={() => setActiveIdx(3)} />
        <ArchNode icon={<CacheIcon  active={activeIdx === 4} />} label="Async" sublabel="Queue + continue"  active={activeIdx === 4} onClick={() => setActiveIdx(4)} />
      </div>
      {activeIdx === 1 && <div className="arch-failover-banner">gRPC: same as REST but 5-10x faster internally</div>}
      {activeIdx === 2 && <div className="arch-failover-banner">WebSocket: server pushes without client asking</div>}
      {activeIdx === 3 && <div className="arch-failover-banner">Sync: use when you need the result to continue</div>}
      {activeIdx === 4 && <div className="arch-failover-banner">Async: use when result not needed immediately</div>}
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_SA_SVC_COMM}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_SA_SVC_COMM} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// SA DIAGRAM 7b - Architecture Design Principles (SoC, DRY, SOLID)
const TOTAL_SA_PRINCIPLES = 5;
const SADesignPrinciplesDiagram = ({ activeIdx, setActiveIdx }) => {
  const descs = [
    'Separation of Concerns: each module has ONE clearly defined job',
    'Modularity: independent pieces with well-defined interfaces',
    'Single Responsibility (SOLID-S): one class, one reason to change',
    'Dependency Inversion: depend on abstractions, not concrete classes',
    'DRY + KISS + YAGNI: no duplicates, keep simple, no premature features',
  ];
  const principles = [
    { label: 'Separation of Concerns', sub: 'One job per module',           idx: 0 },
    { label: 'Modularity',             sub: 'Independent, interfaces',      idx: 1 },
    { label: 'Single Responsibility',  sub: 'One reason to change',         idx: 2 },
    { label: 'Dependency Inversion',   sub: 'Depend on abstractions',       idx: 3 },
    { label: 'DRY + KISS + YAGNI',    sub: 'No waste, stay simple',         idx: 4 },
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-col arch-col--center">
        {principles.map((p, i) => (
          <React.Fragment key={p.label}>
            <div className={'arch-layer' + (activeIdx === i ? ' arch-layer--active' : '')} onClick={() => setActiveIdx(i)}>
              <div className="arch-layer__icon">
                {i === 0 && <LockIcon    active={activeIdx === i} />}
                {i === 1 && <NetworkIcon active={activeIdx === i} />}
                {i === 2 && <ServerIcon  active={activeIdx === i} />}
                {i === 3 && <CacheIcon   active={activeIdx === i} />}
                {i === 4 && <DatabaseIcon active={activeIdx === i} />}
              </div>
              <div className="arch-layer__info">
                <span className="arch-layer__label">{p.label}</span>
                <span className="arch-layer__sub">{p.sub}</span>
              </div>
              <div className="arch-layer__latency">{i + 1}</div>
            </div>
            {i < 4 && <VertArrow active={activeIdx > i} />}
          </React.Fragment>
        ))}
      </div>
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_SA_PRINCIPLES}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_SA_PRINCIPLES} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// SA DIAGRAM 8b - Architecture Decision-Making (Trade-offs)
const TOTAL_SA_DECISION = 5;
const SADecisionDiagram = ({ activeIdx, setActiveIdx }) => {
  const descs = [
    'Requirement arrives: store 1 billion events per day',
    'Option A: PostgreSQL - strong consistency, complex to shard',
    'Option B: Cassandra - scales writes, eventual consistency',
    'Trade-off: choose based on read/write pattern and team skill',
    'ADR written: document decision + rationale for future team',
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-two-path">
        <div className={'arch-path' + (activeIdx === 1 ? ' arch-path--active' : '')}>
          <div className="arch-path__label arch-path__label--read">OPTION A: PostgreSQL</div>
          <div className="arch-row arch-row--col">
            <ArchNode icon={<DatabaseIcon active={activeIdx === 1} />} label="PostgreSQL" sublabel="ACID + Consistency" active={activeIdx === 1} onClick={() => setActiveIdx(1)} />
            {activeIdx === 1 && <div className="arch-danger-banner" style={{ marginTop: '0.5rem' }}>Hard to shard at 1B events/day</div>}
          </div>
        </div>
        <div className="arch-path-divider" />
        <div className={'arch-path' + (activeIdx === 2 ? ' arch-path--active' : '')}>
          <div className="arch-path__label arch-path__label--write">OPTION B: Cassandra</div>
          <div className="arch-row arch-row--col">
            <ArchNode icon={<CacheIcon active={activeIdx === 2} />} label="Cassandra" sublabel="Scale writes + AP" active={activeIdx === 2} onClick={() => setActiveIdx(2)} />
            {activeIdx === 2 && <div className="arch-failover-banner" style={{ marginTop: '0.5rem' }}>Eventual consistency - acceptable for logs</div>}
          </div>
        </div>
      </div>
      <div className="arch-row arch-row--center" style={{ marginTop: '0.75rem' }}>
        <ArchNode icon={<NetworkIcon active={activeIdx === 3} />} label="Trade-off" sublabel="Consistency vs Scale" active={activeIdx === 3} onClick={() => setActiveIdx(3)} />
        <Arrow active={activeIdx >= 4} label="document" />
        <ArchNode icon={<LockIcon    active={activeIdx >= 4} />} label="ADR" sublabel="Decision recorded" active={activeIdx >= 4} onClick={() => setActiveIdx(4)} />
      </div>
      {activeIdx === 0 && <div className="arch-failover-banner">Every architecture decision involves a trade-off</div>}
      {activeIdx >= 4 && <div className="arch-failover-banner">ADR: future team knows WHY this decision was made</div>}
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_SA_DECISION}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_SA_DECISION} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// SA DIAGRAM 10b - HLD Design Process
const TOTAL_SA_HLD_PROCESS = 5;
const SAHLDProcessDiagram = ({ activeIdx, setActiveIdx }) => {
  const descs = [
    'Step 1: Clarify requirements - scale, patterns, constraints',
    'Step 2: Back-of-envelope - QPS, storage, bandwidth estimates',
    'Step 3: Draw HLD - major components and connections',
    'Step 4: Deep dive - zoom into the critical component',
    'Step 5: Trade-offs - explain decisions and alternatives',
  ];
  const steps = [
    { label: 'Requirements',   sub: 'Scale, patterns, constraints', idx: 0 },
    { label: 'Estimation',     sub: 'QPS, storage, bandwidth',      idx: 1 },
    { label: 'HLD Diagram',    sub: 'Draw components + links',      idx: 2 },
    { label: 'Deep Dive',      sub: 'Critical component detail',    idx: 3 },
    { label: 'Trade-offs',     sub: 'Explain decisions made',       idx: 4 },
  ];
  return (
    <div className="arch-diagram">
      <div className="arch-col arch-col--center">
        {steps.map((step, i) => (
          <React.Fragment key={step.label}>
            <div className={'arch-layer' + (activeIdx === i ? ' arch-layer--active' : '')} onClick={() => setActiveIdx(i)}>
              <div className="arch-layer__icon">
                {i === 0 && <UserIcon    active={activeIdx === i} />}
                {i === 1 && <CacheIcon   active={activeIdx === i} />}
                {i === 2 && <NetworkIcon active={activeIdx === i} />}
                {i === 3 && <ServerIcon  active={activeIdx === i} />}
                {i === 4 && <LockIcon    active={activeIdx === i} />}
              </div>
              <div className="arch-layer__info">
                <span className="arch-layer__label">{step.label}</span>
                <span className="arch-layer__sub">{step.sub}</span>
              </div>
              <div className="arch-layer__latency">{i + 1}</div>
            </div>
            {i < 4 && <VertArrow active={activeIdx > i} />}
          </React.Fragment>
        ))}
      </div>
      {activeIdx === 0 && <div className="arch-failover-banner">Ask: how many users? Read vs write ratio? Global?</div>}
      {activeIdx === 2 && <div className="arch-failover-banner">Bird-eye view first - details come in step 4</div>}
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / {TOTAL_SA_HLD_PROCESS}</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <StepNav activeIdx={activeIdx} total={TOTAL_SA_HLD_PROCESS} setActiveIdx={setActiveIdx} />
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// DISPATCHER
// ─────────────────────────────────────────────────────────────────────────────
const ModuleAnimation = ({ steps, animType, title, topicTitle, topic }: Props) => {
  const [activeIdx, setActiveIdx] = useState(0);

  const t = (topicTitle || title || '').toLowerCase();
  const isLB    = topic === 'load-balancing';
  const isSC    = topic === 'scalability';
  const isSA    = topic === 'system-architecture';
  const isDB    = topic === 'database-design';
  const isMS    = topic === 'microservices';
  const isAG    = topic === 'api-gateway';
  const isMQ    = topic === 'message-queues';
  const isCDN   = topic === 'cdn';
  const isDS    = topic === 'distributed-systems';
  const isRP    = topic === 'reliability-patterns';
  const isEST   = topic === 'estimation-capacity';
  const isRT    = topic === 'realtime-streaming';
  const isOBS   = topic === 'observability-slos';

  // -- Observability and SLOs diagrams --
  const getOBSDiagram = (): React.ReactNode => {
    if (t.includes('fundamentals') || t.includes('observability fundamentals'))  return <OBSFundamentalsDiagram  activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('logging') || t.includes('log management'))                   return <OBSLoggingDiagram        activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('metrics') || t.includes('monitoring'))                       return <OBSMetricsDiagram        activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('tracing') || t.includes('distributed tracing'))              return <OBSTracingDiagram        activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('health check') || t.includes('alerting'))                    return <OBSHealthDiagram         activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('golden signal') || t.includes('latency, traffic') || t.includes('saturation')) return <OBSGoldenDiagram activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('service level indicator') || t.includes('sli') && !t.includes('slo') && !t.includes('sla')) return <OBSSLIDiagram activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('service level objective') || (t.includes('slo') && !t.includes('sla'))) return <OBSSLODiagram activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('service level agreement') || t.includes('sla') || t.includes('error budget')) return <OBSSLADiagram activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('failure') || t.includes('practice') || t.includes('observability in')) return <OBSPracticeDiagram activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    return <OBSFundamentalsDiagram activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
  };

  const getOBSTotal = (): number => {
    if (t.includes('fundamentals') || t.includes('observability fundamentals'))  return TOTAL_OBS_FUND;
    if (t.includes('logging') || t.includes('log management'))                   return TOTAL_OBS_LOG;
    if (t.includes('metrics') || t.includes('monitoring'))                       return TOTAL_OBS_METRICS;
    if (t.includes('tracing') || t.includes('distributed tracing'))              return TOTAL_OBS_TRACE;
    if (t.includes('health check') || t.includes('alerting'))                    return TOTAL_OBS_HEALTH;
    if (t.includes('golden signal') || t.includes('saturation'))                 return TOTAL_OBS_GOLDEN;
    if (t.includes('service level indicator') || (t.includes('sli') && !t.includes('slo') && !t.includes('sla'))) return TOTAL_OBS_SLI;
    if (t.includes('service level objective') || (t.includes('slo') && !t.includes('sla'))) return TOTAL_OBS_SLO;
    if (t.includes('service level agreement') || t.includes('sla') || t.includes('error budget')) return TOTAL_OBS_SLA;
    return TOTAL_OBS_PRACTICE;
  };

  // -- Real-Time and Streaming diagrams --
  const getRTDiagram = (): React.ReactNode => {
    if (t.includes('stream processing fundamentals') || (t.includes('stream process') && t.includes('fundamentals'))) return <RTStreamFundDiagram activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('fundamentals') || t.includes('real-time systems'))       return <RTFundamentalsDiagram   activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('protocol') || t.includes('websocket') || t.includes('sse') || t.includes('long polling')) return <RTProtocolsDiagram activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('real-time data processing') || t.includes('data processing')) return <RTStreamPipelineDiagram activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('stream processing fundamentals') || t.includes('stream process')) return <RTStreamFundDiagram activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('event streaming') || t.includes('kafka') && !t.includes('flink') && !t.includes('streams,')) return <RTKafkaDiagram activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('framework') || t.includes('flink') || t.includes('kafka streams') || t.includes('spark')) return <RTFrameworksDiagram activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('pipeline') || t.includes('cdc') || t.includes('data pipeline')) return <RTDataPipelineDiagram activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('event time') || t.includes('processing time'))           return <RTEventTimeDiagram      activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('window') || t.includes('tumbling') || t.includes('sliding') || t.includes('session')) return <RTWindowsDiagram activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('failure') || t.includes('practice') || t.includes('architectures')) return <RTPracticeDiagram activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    return <RTFundamentalsDiagram activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
  };

  const getRTTotal = (): number => {
    if (t.includes('stream processing fundamentals') || (t.includes('stream process') && t.includes('fundamentals'))) return TOTAL_RT_STREAM;
    if (t.includes('fundamentals') || t.includes('real-time systems'))       return TOTAL_RT_FUND;
    if (t.includes('protocol') || t.includes('websocket') || t.includes('sse')) return TOTAL_RT_PROTO;
    if (t.includes('real-time data processing'))                              return TOTAL_RT_PIPELINE;
    if (t.includes('stream processing fundamentals'))                         return TOTAL_RT_STREAM;
    if (t.includes('event streaming'))                                        return TOTAL_RT_KAFKA;
    if (t.includes('framework') || t.includes('flink') || t.includes('kafka streams') || t.includes('spark')) return TOTAL_RT_FRAMEWORKS;
    if (t.includes('pipeline') || t.includes('cdc'))                         return TOTAL_RT_DATAPIPE;
    if (t.includes('event time') || t.includes('processing time'))           return TOTAL_RT_EVTTIME;
    if (t.includes('window') || t.includes('tumbling') || t.includes('sliding')) return TOTAL_RT_WINDOWS;
    return TOTAL_RT_PRACTICE;
  };

  // -- Estimation diagrams --
  const getESTDiagram = (): React.ReactNode => {
    if (t.includes('fundamentals'))                                          return <ESTFundamentalsDiagram   activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('traffic') || t.includes('rps') || t.includes('requests per second')) return <ESTRPSDiagram activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('user') || t.includes('workload'))                        return <ESTUserDiagram           activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('storage') || t.includes('capacity estimation'))          return <ESTStorageDiagram        activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('bandwidth'))                                             return <ESTBandwidthDiagram      activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('cpu') || t.includes('memory') || t.includes('cpu and memory')) return <ESTCPUDiagram    activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('peak') || t.includes('forecast') || t.includes('forecasting')) return <ESTPeakDiagram   activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('back-of') || t.includes('envelope') || t.includes('back of')) return <ESTBOTEDiagram   activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('utiliz') || t.includes('optimiz') || t.includes('optimization')) return <ESTUtilDiagram activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('walkthrough') || t.includes('failure') || t.includes('full')) return <ESTWalkthroughDiagram activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    return <ESTFundamentalsDiagram activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
  };

  const getESTTotal = (): number => {
    if (t.includes('fundamentals'))                                          return TOTAL_EST_FUND;
    if (t.includes('traffic') || t.includes('rps'))                          return TOTAL_EST_RPS;
    if (t.includes('user') || t.includes('workload'))                        return TOTAL_EST_USER;
    if (t.includes('storage'))                                               return TOTAL_EST_STORAGE;
    if (t.includes('bandwidth'))                                             return TOTAL_EST_BW;
    if (t.includes('cpu') || t.includes('memory'))                           return TOTAL_EST_CPU;
    if (t.includes('peak') || t.includes('forecast'))                        return TOTAL_EST_PEAK;
    if (t.includes('back-of') || t.includes('envelope'))                     return TOTAL_EST_BOTE;
    if (t.includes('utiliz') || t.includes('optimiz'))                       return TOTAL_EST_UTIL;
    return TOTAL_EST_WALK;
  };

  // -- Reliability Patterns diagrams --
  const getRPDiagram = (): React.ReactNode => {
    if (t.includes('fundamentals'))                                          return <RPFundamentalsDiagram   activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('fault tolerance') || t.includes('fault isolation') || t.includes('isolation')) return <RPIsolationDiagram activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('circuit breaker') || t.includes('circuit'))              return <RPCircuitBreakerDiagram activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('retry') || t.includes('exponential') || t.includes('backoff')) return <RPRetryDiagram   activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('timeout'))                                               return <RPTimeoutDiagram        activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('bulkhead'))                                              return <RPBulkheadDiagram       activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('failover') || t.includes('redundancy'))                  return <RPFailoverDiagram       activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('graceful') || t.includes('fallback') || t.includes('degradation')) return <RPDegradeDiagram activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('health') || t.includes('self-heal') || t.includes('self heal')) return <RPHealthDiagram activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('rate limit') || t.includes('load shed') || t.includes('throttl') || t.includes('failure')) return <RPRateLimitDiagram activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    return <RPFundamentalsDiagram activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
  };

  const getRPTotal = (): number => {
    if (t.includes('fundamentals'))                                          return TOTAL_RP_FUND;
    if (t.includes('fault tolerance') || t.includes('fault isolation') || t.includes('isolation')) return TOTAL_RP_ISOLATION;
    if (t.includes('circuit breaker') || t.includes('circuit'))              return TOTAL_RP_CB;
    if (t.includes('retry') || t.includes('exponential') || t.includes('backoff')) return TOTAL_RP_RETRY;
    if (t.includes('timeout'))                                               return TOTAL_RP_TIMEOUT;
    if (t.includes('bulkhead'))                                              return TOTAL_RP_BULKHEAD;
    if (t.includes('failover') || t.includes('redundancy'))                  return TOTAL_RP_FAILOVER;
    if (t.includes('graceful') || t.includes('fallback') || t.includes('degradation')) return TOTAL_RP_DEGRADE;
    if (t.includes('health') || t.includes('self-heal'))                     return TOTAL_RP_HEALTH;
    return TOTAL_RP_RATELIMIT;
  };

  // -- Distributed Systems diagrams --
  const getDSDiagram = (): React.ReactNode => {
    if (t.includes('fundamentals'))                                          return <DSFundamentalsDiagram activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('architecture') || t.includes('component'))               return <DSArchDiagram         activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('communication') || t.includes('nodes'))                  return <DSCommDiagram         activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('time') || t.includes('clock') || t.includes('ordering')) return <DSClocksDiagram       activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('consistency model') || t.includes('eventual') || t.includes('strong')) return <DSConsistDiagram activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('consensus') || t.includes('raft') || t.includes('paxos')) return <DSRaftDiagram        activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('transaction') || t.includes('2pc') || t.includes('saga')) return <DSTxDiagram          activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('fault') || t.includes('replication'))                    return <DSFaultDiagram        activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('cap') || t.includes('partition tolerance'))               return <DSCAPDiagram          activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('observability') || t.includes('failure'))                 return <DSObsDiagram          activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    return <DSFundamentalsDiagram activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
  };

  const getDSTotal = (): number => {
    if (t.includes('fundamentals'))                                          return TOTAL_DS_FUND;
    if (t.includes('architecture') || t.includes('component'))               return TOTAL_DS_ARCH;
    if (t.includes('communication') || t.includes('nodes'))                  return TOTAL_DS_COMM;
    if (t.includes('time') || t.includes('clock') || t.includes('ordering')) return TOTAL_DS_CLOCKS;
    if (t.includes('consistency model') || t.includes('eventual') || t.includes('strong')) return TOTAL_DS_CONSIST;
    if (t.includes('consensus') || t.includes('raft') || t.includes('paxos')) return TOTAL_DS_RAFT;
    if (t.includes('transaction') || t.includes('2pc') || t.includes('saga')) return TOTAL_DS_TX;
    if (t.includes('fault') || t.includes('replication'))                    return TOTAL_DS_FAULT;
    if (t.includes('cap') || t.includes('partition tolerance'))               return TOTAL_DS_CAP;
    return TOTAL_DS_OBS;
  };

  // -- CDN diagrams --
  const getCDNDiagram = (): React.ReactNode => {
    if (t.includes('fundamentals'))                                          return <CDNFundamentalsDiagram activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('architecture') || t.includes('component'))               return <CDNArchDiagram         activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('edge') || t.includes('point of presence') || t.includes('pop')) return <CDNEdgeDiagram activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('origin') || t.includes('edge caching') || t.includes('cache-control')) return <CDNCacheDiagram activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('routing') || t.includes('content delivery') || t.includes('request routing')) return <CDNRouteDiagram activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('push') || t.includes('pull'))                            return <CDNPushPullDiagram     activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('static') || t.includes('dynamic'))                       return <CDNStaticDynDiagram    activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('invalidation') || t.includes('purging') || t.includes('purge')) return <CDNPurgeDiagram activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('security') || t.includes('ddos') || t.includes('waf') || t.includes('https')) return <CDNSecDiagram activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('failure') || t.includes('practice'))                     return <CDNPracticeDiagram     activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    return <CDNFundamentalsDiagram activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
  };

  const getCDNTotal = (): number => {
    if (t.includes('fundamentals'))                                          return TOTAL_CDN_FUND;
    if (t.includes('architecture') || t.includes('component'))               return TOTAL_CDN_ARCH;
    if (t.includes('edge') || t.includes('pop'))                             return TOTAL_CDN_EDGE;
    if (t.includes('origin') || t.includes('edge caching'))                  return TOTAL_CDN_CACHE;
    if (t.includes('routing') || t.includes('content delivery') || t.includes('request routing')) return TOTAL_CDN_ROUTE;
    if (t.includes('push') || t.includes('pull'))                            return TOTAL_CDN_PUSHPULL;
    if (t.includes('static') || t.includes('dynamic'))                       return TOTAL_CDN_STATIC;
    if (t.includes('invalidation') || t.includes('purging') || t.includes('purge')) return TOTAL_CDN_PURGE;
    if (t.includes('security') || t.includes('ddos') || t.includes('waf'))   return TOTAL_CDN_SEC;
    return TOTAL_CDN_PRACTICE;
  };

  // -- Message Queues diagrams --
  const getMQDiagram = (): React.ReactNode => {
    if (t.includes('fundamentals'))                                          return <MQFundamentalsDiagram activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('architecture') || t.includes('component'))               return <MQArchDiagram         activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('producer') || t.includes('consumer'))                    return <MQProdConsDiagram     activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('point-to-point') || t.includes('point to point'))        return <MQP2PDiagram          activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('publish') || t.includes('pub/sub') || t.includes('pub-sub')) return <MQPubSubDiagram  activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('delivery') || t.includes('at-most') || t.includes('at-least') || t.includes('exactly')) return <MQDeliveryDiagram activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('ordering') || t.includes('prioriti'))                    return <MQOrderDiagram        activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('acknowledgement') || t.includes('retry') || t.includes('dead letter') || t.includes('dlq')) return <MQDLQDiagram activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('broker') || t.includes('rabbitmq') || t.includes('kafka') || t.includes('sqs')) return <MQBrokersDiagram activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('failure') || t.includes('practice'))                     return <MQPracticeDiagram     activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    return <MQFundamentalsDiagram activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
  };

  const getMQTotal = (): number => {
    if (t.includes('fundamentals'))                                          return TOTAL_MQ_FUND;
    if (t.includes('architecture') || t.includes('component'))               return TOTAL_MQ_ARCH;
    if (t.includes('producer') || t.includes('consumer'))                    return TOTAL_MQ_PRODCONS;
    if (t.includes('point-to-point') || t.includes('point to point'))        return TOTAL_MQ_P2P;
    if (t.includes('publish') || t.includes('pub/sub') || t.includes('pub-sub')) return TOTAL_MQ_PUBSUB;
    if (t.includes('delivery') || t.includes('at-most') || t.includes('at-least') || t.includes('exactly')) return TOTAL_MQ_DELIVERY;
    if (t.includes('ordering') || t.includes('prioriti'))                    return TOTAL_MQ_ORDER;
    if (t.includes('acknowledgement') || t.includes('retry') || t.includes('dead letter') || t.includes('dlq')) return TOTAL_MQ_DLQ;
    if (t.includes('broker') || t.includes('rabbitmq') || t.includes('kafka') || t.includes('sqs')) return TOTAL_MQ_BROKERS;
    return TOTAL_MQ_PRACTICE;
  };

  // -- API Gateway diagrams --
  const getAGDiagram = (): React.ReactNode => {
    if (t.includes('fundamentals'))                                           return <AGFundamentalsDiagram activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('architecture') && !t.includes('micro'))                   return <AGArchDiagram         activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('reverse proxy') || t.includes('vs reverse'))              return <AGProxyDiagram        activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('routing') || t.includes('forwarding'))                    return <AGRouteDiagram        activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('authentication') || t.includes('authorization'))          return <AGAuthDiagram         activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('rate limit') || t.includes('throttl'))                    return <AGRateDiagram         activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('transform'))                                               return <AGTransformDiagram    activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('aggregat') || t.includes('composition'))                  return <AGAggDiagram          activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('security') || t.includes('monitor'))                      return <AGSecDiagram          activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('bff') || t.includes('backend for frontend') || t.includes('failure') || t.includes('practice')) return <AGBFFDiagram activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    return <AGFundamentalsDiagram activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
  };

  const getAGTotal = (): number => {
    if (t.includes('fundamentals'))                                           return TOTAL_AG_FUND;
    if (t.includes('architecture') && !t.includes('micro'))                   return TOTAL_AG_ARCH;
    if (t.includes('reverse proxy') || t.includes('vs reverse'))              return TOTAL_AG_PROXY;
    if (t.includes('routing') || t.includes('forwarding'))                    return TOTAL_AG_ROUTE;
    if (t.includes('authentication') || t.includes('authorization'))          return TOTAL_AG_AUTH;
    if (t.includes('rate limit') || t.includes('throttl'))                    return TOTAL_AG_RATE;
    if (t.includes('transform'))                                               return TOTAL_AG_TRANSFORM;
    if (t.includes('aggregat') || t.includes('composition'))                  return TOTAL_AG_AGG;
    if (t.includes('security') || t.includes('monitor'))                      return TOTAL_AG_SEC;
    return TOTAL_AG_BFF;
  };

  // -- Microservices diagrams --
  const getMSDiagram = (): React.ReactNode => {
    if (t.includes('fundamentals'))                                          return <MSFundamentalsDiagram activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('monolithic') || t.includes('monolith vs'))              return <MSMonoDiagram          activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('architecture components') || t.includes('components'))  return <MSArchDiagram          activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('decomp') || t.includes('bounded'))                      return <MSDecompDiagram        activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('inter-service comm') || t.includes('communication'))    return <MSCommDiagram          activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('discovery') || t.includes('registration'))              return <MSDiscoveryDiagram     activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('data management') || t.includes('saga'))                return <MSDataDiagram          activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('deploy') || t.includes('container'))                    return <MSDeployDiagram        activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('resil') || t.includes('fault'))                         return <MSResilDiagram         activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('observ') || t.includes('tracing') || t.includes('failure')) return <MSObsDiagram     activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    return <MSFundamentalsDiagram activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
  };

  const getMSTotal = (): number => {
    if (t.includes('fundamentals'))                                          return TOTAL_MS_FUND;
    if (t.includes('monolithic') || t.includes('monolith vs'))              return TOTAL_MS_MONO;
    if (t.includes('architecture components') || t.includes('components'))  return TOTAL_MS_ARCH;
    if (t.includes('decomp') || t.includes('bounded'))                      return TOTAL_MS_DECOMP;
    if (t.includes('inter-service comm') || t.includes('communication'))    return TOTAL_MS_COMM;
    if (t.includes('discovery') || t.includes('registration'))              return TOTAL_MS_DISC;
    if (t.includes('data management') || t.includes('saga'))                return TOTAL_MS_DATA;
    if (t.includes('deploy') || t.includes('container'))                    return TOTAL_MS_DEPLOY;
    if (t.includes('resil') || t.includes('fault') || t.includes('observ') || t.includes('tracing') || t.includes('failure')) return TOTAL_MS_RESIL;
    return TOTAL_MS_FUND;
  };

  // ── Database Design diagrams ──────────────────────────────────────────────
  const getDBDiagram = (): React.ReactNode => {
    if (t.includes('fundamentals'))                                                   return <DBFundamentalsDiagram  activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('sql vs') || t.includes('nosql'))                                  return <DBSqlNoSqlDiagram      activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('data model') || t.includes('schema design') || t.includes('modeling')) return <DBModelDiagram activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('normali') || t.includes('denormali'))                             return <DBNormDiagram          activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('index') || t.includes('query optim'))                             return <DBIndexDiagram         activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('replication'))                                                    return <DBReplicationDiagram   activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('shard') || t.includes('partition'))                               return <DBShardDiagram         activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('transaction') || t.includes('acid'))                              return <DBACIDDiagram          activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('consistency') || t.includes('cap'))                               return <DBCAPDiagram           activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    return <DBPracticeDiagram activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
  };

  const getDBTotal = (): number => {
    if (t.includes('fundamentals'))                                                   return TOTAL_DB_FUND;
    if (t.includes('sql vs') || t.includes('nosql'))                                  return TOTAL_DB_SQLNOSQL;
    if (t.includes('data model') || t.includes('schema') || t.includes('modeling'))  return TOTAL_DB_MODEL;
    if (t.includes('normali') || t.includes('denormali'))                             return TOTAL_DB_NORM;
    if (t.includes('index') || t.includes('query optim'))                             return TOTAL_DB_INDEX;
    if (t.includes('replication'))                                                    return TOTAL_DB_REPL;
    if (t.includes('shard') || t.includes('partition'))                               return TOTAL_DB_SHARD;
    if (t.includes('transaction') || t.includes('acid'))                              return TOTAL_DB_ACID;
    if (t.includes('consistency') || t.includes('cap'))                               return TOTAL_DB_CAP;
    return TOTAL_DB_PRACTICE;
  };

  // ── Load Balancing diagrams ───────────────────────────────────────────────
  const getLBDiagram = (): React.ReactNode => {
    if (t.includes('fundamentals'))                                                   return <LBFundamentalsDiagram  activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('types') || t.includes('layer 4') || t.includes('layer 7'))       return <LBTypesDiagram         activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('round-robin') || t.includes('round robin') || t.includes('weighted round')) return <LBRoundRobinDiagram activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('least connections') || t.includes('least conn'))                  return <LBLeastConnDiagram     activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('ip hash') || t.includes('consistent hash'))                       return <LBHashDiagram          activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('health') || t.includes('failover'))                               return <LBHealthDiagram        activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('sticky') || t.includes('session persistence'))                    return <LBStickyDiagram        activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('high availability') || t.includes('redundancy'))                  return <LBHADiagram            activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('algorithms') || t.includes('load balancing algorithm'))           return <LBAlgoDiagram          activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    return <LBPracticeDiagram activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
  };

  const getLBTotal = (): number => {
    if (t.includes('fundamentals'))                                                   return TOTAL_LB_FUND;
    if (t.includes('types') || t.includes('layer 4') || t.includes('layer 7'))       return TOTAL_LB_TYPES;
    if (t.includes('round-robin') || t.includes('round robin') || t.includes('weighted round')) return TOTAL_LB_RR;
    if (t.includes('least connections') || t.includes('least conn'))                  return TOTAL_LB_LC;
    if (t.includes('ip hash') || t.includes('consistent hash'))                       return TOTAL_LB_HASH;
    if (t.includes('health') || t.includes('failover'))                               return TOTAL_LB_HEALTH;
    if (t.includes('sticky') || t.includes('session persistence'))                    return TOTAL_LB_STICKY;
    if (t.includes('high availability') || t.includes('redundancy'))                  return TOTAL_LB_HA;
    if (t.includes('algorithms'))                                                      return TOTAL_LB_ALGO;
    return TOTAL_LB_PRACTICE;
  };

  // ── Scalability diagrams ──────────────────────────────────────────────────
  const getSCDiagram = (): React.ReactNode => {
    if (t.includes('fundamentals'))                                         return <SCFundamentalsDiagram  activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('vertical') || t.includes('horizontal'))                 return <SCVertHorizDiagram     activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('elastic') || t.includes('auto-scal') || t.includes('auto scal')) return <SCAutoScaleDiagram activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('stateless') || t.includes('stateful'))                  return <SCStateDiagram         activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('capacity') || t.includes('traffic estimation'))         return <SCCapacityDiagram      activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('bottleneck') || t.includes('optimiz') || t.includes('optimis') || t.includes('performance')) return <SCBottleneckDiagram activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('database scal') || t.includes('database scaling'))      return <SCDbScaleDiagram       activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('strateg') || t.includes('trade-off') || t.includes('trade off')) return <SCStrategyDiagram activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('spike') || t.includes('sudden') || t.includes('traffic spike')) return <SCSpikeDiagram activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('failure'))                                               return <SCSpikeDiagram         activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    return <SCFundamentalsDiagram activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
  };

  const getSCTotal = (): number => {
    if (t.includes('fundamentals'))                                         return TOTAL_SC_FUND;
    if (t.includes('vertical') || t.includes('horizontal'))                 return TOTAL_SC_VVSH;
    if (t.includes('elastic') || t.includes('auto-scal') || t.includes('auto scal')) return TOTAL_SC_AUTO;
    if (t.includes('stateless') || t.includes('stateful'))                  return TOTAL_SC_STATE;
    if (t.includes('capacity') || t.includes('traffic estimation'))         return TOTAL_SC_CAP;
    if (t.includes('bottleneck') || t.includes('optimiz') || t.includes('performance')) return TOTAL_SC_BOTTLENECK;
    if (t.includes('database scal') || t.includes('database scaling'))      return TOTAL_SC_DBSCALE;
    if (t.includes('strateg') || t.includes('trade-off'))                   return TOTAL_SC_STRAT;
    if (t.includes('spike') || t.includes('sudden') || t.includes('failure')) return TOTAL_SC_SPIKE;
    return TOTAL_SC_FUND;
  };

  // ── System Architecture diagrams ──────────────────────────────────────────
  const getSADiagram = (): React.ReactNode => {
    if (t.includes('fundamentals') && !t.includes('reliability'))            return <SAFundamentalsDiagram     activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('architectural pattern') || t.includes('architectural patterns')) return <SAPatternsDiagram activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('monolithic architecture'))                                return <SAMonolithDiagram         activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('client-server') || t.includes('client server'))          return <SAClientServerDiagram     activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('system components') || t.includes('interaction'))        return <SACommDiagram             activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('service communication') || t.includes('grpc') || t.includes('websocket') || t.includes('rest,')) return <SAServiceCommDiagram activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('design principle') || t.includes('solid') || t.includes('modularity') || t.includes('separation')) return <SADesignPrinciplesDiagram activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('decision-making') || t.includes('decision making') || t.includes('trade-off') || t.includes('trade off')) return <SADecisionDiagram activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('fault') || t.includes('reliability') || t.includes('availability')) return <SAFaultDiagram activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('hld design') || t.includes('design process') || t.includes('architecture diagram')) return <SAHLDProcessDiagram activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('scalability') || t.includes('load'))                     return <SAScaleDiagram            activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('database'))                                               return <SADatabaseDiagram         activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('distributed'))                                            return <SADistributedDiagram      activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('failure') || t.includes('stampede') || t.includes('penetration') || t.includes('avalanche')) return <SAFaultDiagram activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    return <SAFundamentalsDiagram activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
  };

  const getSATotals = (): number => {
    if (t.includes('fundamentals') && !t.includes('reliability'))            return TOTAL_SA_FUND;
    if (t.includes('architectural pattern') || t.includes('architectural patterns')) return TOTAL_SA_PATTERNS;
    if (t.includes('monolithic architecture'))                                return TOTAL_SA_MONO;
    if (t.includes('client-server') || t.includes('client server'))          return TOTAL_SA_CLIENT_SERVER;
    if (t.includes('system components') || t.includes('interaction'))        return TOTAL_SA_COMM;
    if (t.includes('service communication') || t.includes('grpc') || t.includes('websocket')) return TOTAL_SA_SVC_COMM;
    if (t.includes('design principle') || t.includes('solid') || t.includes('modularity') || t.includes('separation')) return TOTAL_SA_PRINCIPLES;
    if (t.includes('decision-making') || t.includes('decision making') || t.includes('trade-off') || t.includes('trade off')) return TOTAL_SA_DECISION;
    if (t.includes('fault') || t.includes('reliability') || t.includes('availability') || t.includes('failure')) return TOTAL_SA_FAULT;
    if (t.includes('hld design') || t.includes('design process') || t.includes('architecture diagram')) return TOTAL_SA_HLD_PROCESS;
    if (t.includes('scalability') || t.includes('load'))                     return TOTAL_SA_SCALE;
    if (t.includes('database'))                                               return TOTAL_SA_DB;
    if (t.includes('distributed'))                                            return TOTAL_SA_DIST;
    return TOTAL_SA_FUND;
  };

  // ── Caching diagrams ──────────────────────────────────────────────────────
  const getCacheDiagram = (): React.ReactNode => {
    if (t.includes('basics'))                                                return <CacheBasicsDiagram     activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('architecture'))                                          return <CacheArchDiagram        activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('aside') || t.includes('cache-aside'))                    return <CacheAsideDiagram       activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('read') || t.includes('write') || t.includes('strateg')) return <ReadWriteDiagram        activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('eviction') || t.includes('lru') || t.includes('lfu') || t.includes('ttl')) return <EvictionDiagram activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('invalid'))                                               return <InvalidationDiagram     activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('consisten'))                                             return <ConsistencyDiagram      activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('redis'))                                                 return <RedisDiagram            activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('distributed'))                                           return <DistributedDiagram      activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('stampede') || t.includes('penetration') || t.includes('avalanche') || t.includes('failure')) return <StampedeDiagram activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    return <CacheBasicsDiagram activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
  };

  const getCacheTotals = (): number => {
    if (t.includes('basics'))                                                return TOTAL_BASICS;
    if (t.includes('architecture'))                                          return TOTAL_ARCH;
    if (t.includes('aside') || t.includes('cache-aside'))                    return TOTAL_ASIDE;
    if (t.includes('read') || t.includes('write') || t.includes('strateg')) return TOTAL_RW;
    if (t.includes('eviction') || t.includes('lru') || t.includes('lfu') || t.includes('ttl')) return TOTAL_EVICT;
    if (t.includes('invalid'))                                               return TOTAL_INVAL;
    if (t.includes('consisten'))                                             return TOTAL_CONSIST;
    if (t.includes('redis'))                                                 return TOTAL_REDIS;
    if (t.includes('distributed'))                                           return TOTAL_DIST;
    if (t.includes('stampede') || t.includes('penetration') || t.includes('avalanche') || t.includes('failure')) return TOTAL_STAMP;
    return TOTAL_BASICS;
  };

  const total = isOBS ? getOBSTotal() : isRT ? getRTTotal() : isEST ? getESTTotal() : isRP ? getRPTotal() : isDS ? getDSTotal() : isCDN ? getCDNTotal() : isMQ ? getMQTotal() : isAG ? getAGTotal() : isMS ? getMSTotal() : isDB ? getDBTotal() : isLB ? getLBTotal() : isSC ? getSCTotal() : isSA ? getSATotals() : getCacheTotals();

  useEffect(() => { setActiveIdx(0); }, [steps, title, topicTitle, topic]);

  useEffect(() => {
    if (total <= 1) return;
    const iv = setInterval(() => setActiveIdx(i => (i + 1) % total), 2600);
    return () => clearInterval(iv);
  }, [steps, title, topicTitle, topic, total]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="module-animation" aria-label="Architecture diagram">
      {isOBS ? getOBSDiagram() : isRT ? getRTDiagram() : isEST ? getESTDiagram() : isRP ? getRPDiagram() : isDS ? getDSDiagram() : isCDN ? getCDNDiagram() : isMQ ? getMQDiagram() : isAG ? getAGDiagram() : isMS ? getMSDiagram() : isDB ? getDBDiagram() : isLB ? getLBDiagram() : isSC ? getSCDiagram() : isSA ? getSADiagram() : getCacheDiagram()}
    </div>
  );
};

export default ModuleAnimation;
