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
    if (t.includes('fundamentals'))                                         return <SAFundamentalsDiagram  activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('architectural pattern') || t.includes('architectural patterns')) return <SAPatternsDiagram activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('monolithic') || t.includes('client-server') || t.includes('client server')) return <SAMonolithDiagram activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('component') || t.includes('interaction'))               return <SACommDiagram          activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('service communication') || t.includes('grpc') || t.includes('websocket')) return <SACommDiagram activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('scalability') || t.includes('load'))                    return <SAScaleDiagram         activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('database'))                                              return <SADatabaseDiagram      activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('distributed'))                                           return <SADistributedDiagram   activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('fault') || t.includes('reliability') || t.includes('availability')) return <SAFaultDiagram activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('design principle') || t.includes('solid') || t.includes('modularity')) return <SAPatternsDiagram activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('decision') || t.includes('trade-off') || t.includes('trade off')) return <SADatabaseDiagram activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('hld') || t.includes('design process') || t.includes('diagram')) return <SAFundamentalsDiagram activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('failure') || t.includes('stampede') || t.includes('penetration') || t.includes('avalanche')) return <SAFaultDiagram activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    return <SAFundamentalsDiagram activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
  };

  const getSATotals = (): number => {
    if (t.includes('fundamentals'))                                         return TOTAL_SA_FUND;
    if (t.includes('architectural pattern') || t.includes('architectural patterns')) return TOTAL_SA_PATTERNS;
    if (t.includes('monolithic') || t.includes('client-server') || t.includes('client server')) return TOTAL_SA_MONO;
    if (t.includes('component') || t.includes('interaction') || t.includes('service communication') || t.includes('grpc')) return TOTAL_SA_COMM;
    if (t.includes('scalability') || t.includes('load'))                    return TOTAL_SA_SCALE;
    if (t.includes('database'))                                              return TOTAL_SA_DB;
    if (t.includes('distributed'))                                           return TOTAL_SA_DIST;
    if (t.includes('fault') || t.includes('reliability') || t.includes('availability') || t.includes('failure')) return TOTAL_SA_FAULT;
    if (t.includes('design principle') || t.includes('decision') || t.includes('hld') || t.includes('diagram')) return TOTAL_SA_PATTERNS;
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

  const total = isMQ ? getMQTotal() : isAG ? getAGTotal() : isMS ? getMSTotal() : isDB ? getDBTotal() : isLB ? getLBTotal() : isSC ? getSCTotal() : isSA ? getSATotals() : getCacheTotals();

  useEffect(() => { setActiveIdx(0); }, [steps, title, topicTitle, topic]);

  useEffect(() => {
    if (total <= 1) return;
    const iv = setInterval(() => setActiveIdx(i => (i + 1) % total), 2600);
    return () => clearInterval(iv);
  }, [steps, title, topicTitle, topic, total]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="module-animation" aria-label="Architecture diagram">
      {isMQ ? getMQDiagram() : isAG ? getAGDiagram() : isMS ? getMSDiagram() : isDB ? getDBDiagram() : isLB ? getLBDiagram() : isSC ? getSCDiagram() : isSA ? getSADiagram() : getCacheDiagram()}
    </div>
  );
};

export default ModuleAnimation;
