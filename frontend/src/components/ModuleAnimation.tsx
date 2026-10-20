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
// DISPATCHER
// ─────────────────────────────────────────────────────────────────────────────
const ModuleAnimation = ({ steps, animType, title, topicTitle, topic }: Props) => {
  const [activeIdx, setActiveIdx] = useState(0);

  const t = (topicTitle || title || '').toLowerCase();
  const isSA = topic === 'system-architecture';
  const isCache = topic === 'caching' || (!isSA); // default to caching if no topic given

  const getSADiagram = (): React.ReactNode => {
    if (t.includes('fundamentals'))                           return <SAFundamentalsDiagram  activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('architectural pattern') || t.includes('architectural patterns')) return <SAPatternsDiagram activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('monolithic') || t.includes('client-server') || t.includes('client server')) return <SAMonolithDiagram activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('component') || t.includes('interaction')) return <SACommDiagram         activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('service communication') || t.includes('rest') || t.includes('grpc') || t.includes('websocket')) return <SACommDiagram activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('scalability') || t.includes('load'))      return <SAScaleDiagram        activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('database'))                               return <SADatabaseDiagram      activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('distributed'))                            return <SADistributedDiagram   activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('fault') || t.includes('reliability') || t.includes('availability')) return <SAFaultDiagram activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('design principle') || t.includes('solid') || t.includes('modularity')) return <SAPatternsDiagram activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('decision') || t.includes('trade-off') || t.includes('trade off')) return <SADatabaseDiagram activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('hld') || t.includes('design process') || t.includes('diagram')) return <SAFundamentalsDiagram activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('failure') || t.includes('stampede') || t.includes('penetration') || t.includes('avalanche')) return <SAFaultDiagram activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    return <SAFundamentalsDiagram activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
  };

  const getCacheDiagram = (): React.ReactNode => {
    if (t.includes('basics'))                                 return <CacheBasicsDiagram     activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('architecture'))                           return <CacheArchDiagram        activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('aside') || t.includes('cache-aside'))     return <CacheAsideDiagram       activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('read') || t.includes('write') || t.includes('strateg')) return <ReadWriteDiagram activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('eviction') || t.includes('lru') || t.includes('lfu') || t.includes('ttl')) return <EvictionDiagram activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('invalid'))                                return <InvalidationDiagram     activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('consisten'))                              return <ConsistencyDiagram      activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('redis'))                                  return <RedisDiagram            activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('distributed'))                            return <DistributedDiagram      activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('stampede') || t.includes('penetration') || t.includes('avalanche') || t.includes('failure')) return <StampedeDiagram activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    return <CacheBasicsDiagram activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
  };

  const getSATotals = (): number => {
    if (t.includes('fundamentals'))                           return TOTAL_SA_FUND;
    if (t.includes('architectural pattern') || t.includes('architectural patterns')) return TOTAL_SA_PATTERNS;
    if (t.includes('monolithic') || t.includes('client-server') || t.includes('client server')) return TOTAL_SA_MONO;
    if (t.includes('component') || t.includes('interaction') || t.includes('service communication') || t.includes('rest') || t.includes('grpc')) return TOTAL_SA_COMM;
    if (t.includes('scalability') || t.includes('load'))      return TOTAL_SA_SCALE;
    if (t.includes('database'))                               return TOTAL_SA_DB;
    if (t.includes('distributed'))                            return TOTAL_SA_DIST;
    if (t.includes('fault') || t.includes('reliability') || t.includes('availability') || t.includes('failure')) return TOTAL_SA_FAULT;
    if (t.includes('design principle') || t.includes('decision') || t.includes('hld') || t.includes('diagram')) return TOTAL_SA_PATTERNS;
    return TOTAL_SA_FUND;
  };

  const getCacheTotals = (): number => {
    if (t.includes('basics'))                                 return TOTAL_BASICS;
    if (t.includes('architecture'))                           return TOTAL_ARCH;
    if (t.includes('aside') || t.includes('cache-aside'))     return TOTAL_ASIDE;
    if (t.includes('read') || t.includes('write') || t.includes('strateg')) return TOTAL_RW;
    if (t.includes('eviction') || t.includes('lru') || t.includes('lfu') || t.includes('ttl')) return TOTAL_EVICT;
    if (t.includes('invalid'))                                return TOTAL_INVAL;
    if (t.includes('consisten'))                              return TOTAL_CONSIST;
    if (t.includes('redis'))                                  return TOTAL_REDIS;
    if (t.includes('distributed'))                            return TOTAL_DIST;
    if (t.includes('stampede') || t.includes('penetration') || t.includes('avalanche') || t.includes('failure')) return TOTAL_STAMP;
    return TOTAL_BASICS;
  };

  const total = isSA ? getSATotals() : getCacheTotals();

  useEffect(() => { setActiveIdx(0); }, [steps, title, topicTitle, topic]);

  useEffect(() => {
    if (total <= 1) return;
    const iv = setInterval(() => setActiveIdx(i => (i + 1) % total), 2600);
    return () => clearInterval(iv);
  }, [steps, title, topicTitle, topic, total]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="module-animation" aria-label="Architecture diagram">
      {isSA ? getSADiagram() : getCacheDiagram()}
    </div>
  );
};

export default ModuleAnimation;
