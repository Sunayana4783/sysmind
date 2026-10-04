import React, { useState, useEffect } from 'react';
import { type AnimationStep } from '../services/api';
import './ModuleAnimation.css';

interface Props {
  steps: AnimationStep[];
  animType?: string;
  title?: string;
  topicTitle?: string; // used to pick the right diagram
}

// ─────────────────────────────────────────────────────────────────────────────
// SVG SYSTEM COMPONENT ICONS
// Each one is a self-contained SVG that looks like a real architecture diagram
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
      <rect x="4" y="8" width="40" height="10" rx="3" fill={active ? '#7C5CFC' : '#EEE9FF'} stroke={c} strokeWidth="1.5"/>
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
    {/* Redis-style stacked cylinder */}
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
    <line x1="6" y1="24" x2="42" y2="24" stroke={active ? '#7C5CFC' : '#C4B5FD'} strokeWidth="1.5"/>
    <ellipse cx="24" cy="24" rx="9" ry="18" fill="none" stroke={active ? '#7C5CFC' : '#C4B5FD'} strokeWidth="1.5"/>
    <ellipse cx="24" cy="24" rx="18" ry="9" fill="none" stroke={active ? '#7C5CFC' : '#C4B5FD'} strokeWidth="1.5"/>
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
// ARROW SVG — connects two nodes
// ─────────────────────────────────────────────────────────────────────────────
const Arrow = ({ active, label, reverse }: { active: boolean; label?: string; reverse?: boolean }) => (
  <div className="arch-arrow">
    <svg width="60" height="30" viewBox="0 0 60 30" fill="none" className={`arch-arrow__svg${active ? ' arch-arrow__svg--active' : ''}`}>
      {reverse ? (
        <>
          <line x1="58" y1="15" x2="4" y2="15" stroke={active ? '#7C5CFC' : '#E5E0EF'} strokeWidth="2" strokeDasharray={active ? 'none' : '4 2'}/>
          <polygon points="4,15 12,10 12,20" fill={active ? '#7C5CFC' : '#E5E0EF'}/>
        </>
      ) : (
        <>
          <line x1="2" y1="15" x2="56" y2="15" stroke={active ? '#7C5CFC' : '#E5E0EF'} strokeWidth="2" strokeDasharray={active ? 'none' : '4 2'}/>
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
// ARCHITECTURE NODE — box with icon + label
// ─────────────────────────────────────────────────────────────────────────────
const ArchNode = ({
  icon, label, sublabel, active, onClick, danger
}: {
  icon: React.ReactNode; label: string; sublabel?: string;
  active?: boolean; onClick?: () => void; danger?: boolean;
}) => (
  <div
    className={`arch-node${active ? ' arch-node--active' : ''}${danger ? ' arch-node--danger' : ''}`}
    onClick={onClick}
    role={onClick ? 'button' : undefined}
    tabIndex={onClick ? 0 : undefined}
  >
    <div className="arch-node__icon">{icon}</div>
    <div className="arch-node__label">{label}</div>
    {sublabel && <div className="arch-node__sublabel">{sublabel}</div>}
    {active && <div className="arch-node__pulse" />}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// DIAGRAM 1 — Cache Basics: User → App → Cache → DB flow
// ─────────────────────────────────────────────────────────────────────────────
const CacheBasicsDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const steps = [
    { label: 'User', sub: 'Makes request' },
    { label: 'App Server', sub: 'Receives request' },
    { label: 'Cache', sub: 'Redis / Memcached' },
    { label: 'Database', sub: 'Source of truth' },
  ];
  const paths = ['User → App', 'App → Cache', 'Cache hit?', 'Cache miss → DB', 'Store & return'];

  return (
    <div className="arch-diagram">
      <div className="arch-row arch-row--center">
        <ArchNode icon={<UserIcon active={activeIdx === 0} />} label="User" sublabel="Makes request" active={activeIdx === 0} onClick={() => setActiveIdx(0)} />
        <Arrow active={activeIdx >= 1} label="request" />
        <ArchNode icon={<ServerIcon active={activeIdx === 1} />} label="App Server" sublabel="Checks cache first" active={activeIdx === 1} onClick={() => setActiveIdx(1)} />
        <Arrow active={activeIdx >= 2} label="lookup" />
        <ArchNode icon={<CacheIcon active={activeIdx === 2} />} label="Cache" sublabel="Redis / Memcached" active={activeIdx === 2} onClick={() => setActiveIdx(2)} />
        <Arrow active={activeIdx >= 3} label="miss" />
        <ArchNode icon={<DatabaseIcon active={activeIdx === 3} />} label="Database" sublabel="Source of truth" active={activeIdx === 3} onClick={() => setActiveIdx(3)} />
      </div>
      <div className="arch-return-row">
        <Arrow active={activeIdx >= 4} label="store result" />
        <span className="arch-return-label">← response flows back to user</span>
      </div>
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / 5</span>
        <span className="arch-step-desc">{['User makes a request to the application','App checks the cache before touching the database','Cache returns data instantly on a hit (< 1ms)','Cache miss — app queries the database','Result stored in cache, returned to user'][activeIdx] || ''}</span>
      </div>
      <div className="ma-dots" style={{ marginTop: '0.875rem' }}>
        {[0,1,2,3,4].map(i => <button key={i} className={`ma-dot${activeIdx === i ? ' ma-dot--active' : ''}`} onClick={() => setActiveIdx(i)} />)}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// DIAGRAM 2 — Cache Architecture: 3-tier layered diagram
// ─────────────────────────────────────────────────────────────────────────────
const CacheArchDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const layers = [
    { label: 'L1: In-Process', sub: 'HashMap in memory', icon: <ServerIcon active={activeIdx === 0} />, ns: '< 1µs' },
    { label: 'L2: Redis', sub: 'Distributed cache', icon: <CacheIcon active={activeIdx === 1} />, ns: '< 1ms' },
    { label: 'L3: Database', sub: 'PostgreSQL / MySQL', icon: <DatabaseIcon active={activeIdx === 2} />, ns: '5–50ms' },
  ];
  const descs = ['L1 is in-process app memory — fastest (nanoseconds), not shared across servers','L2 is a shared Redis cluster — fast (sub-ms), shared across all app instances','L3 is the database — slowest but always the source of truth'];

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
            {i < layers.length - 1 && <VertArrow active={activeIdx > i} label={`${i+2}. miss → check next`} />}
          </React.Fragment>
        ))}
      </div>
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / 3</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <div className="ma-dots" style={{ marginTop: '0.875rem' }}>
        {[0,1,2].map(i => <button key={i} className={`ma-dot${activeIdx === i ? ' ma-dot--active' : ''}`} onClick={() => setActiveIdx(i)} />)}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// DIAGRAM 3 — Cache-Aside: read + write paths side by side
// ─────────────────────────────────────────────────────────────────────────────
const CacheAsideDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const isWrite = activeIdx >= 3;
  const descs = ['Read path: App checks cache first','Cache miss — query DB for data','Store result in cache with TTL','Write path: Write to DB first — always','Then invalidate the cache key','Next read will fetch fresh data from DB'];

  return (
    <div className="arch-diagram">
      <div className="arch-two-path">
        {/* READ PATH */}
        <div className={`arch-path${!isWrite ? ' arch-path--active' : ''}`}>
          <div className="arch-path__label arch-path__label--read">📖 READ PATH</div>
          <div className="arch-row arch-row--col">
            <ArchNode icon={<ServerIcon active={activeIdx === 0} />} label="App" sublabel="Check cache" active={activeIdx === 0} onClick={() => setActiveIdx(0)} />
            <VertArrow active={activeIdx >= 1} label="miss" />
            <ArchNode icon={<CacheIcon active={activeIdx === 1} />} label="Cache" sublabel="MISS" active={activeIdx === 1} onClick={() => setActiveIdx(1)} />
            <VertArrow active={activeIdx >= 2} label="fetch" />
            <ArchNode icon={<DatabaseIcon active={activeIdx === 2} />} label="DB" sublabel="Query" active={activeIdx === 2} onClick={() => setActiveIdx(2)} />
          </div>
        </div>

        <div className="arch-path-divider" />

        {/* WRITE PATH */}
        <div className={`arch-path${isWrite ? ' arch-path--active' : ''}`}>
          <div className="arch-path__label arch-path__label--write">✍️ WRITE PATH</div>
          <div className="arch-row arch-row--col">
            <ArchNode icon={<ServerIcon active={activeIdx === 3} />} label="App" sublabel="Write" active={activeIdx === 3} onClick={() => setActiveIdx(3)} />
            <VertArrow active={activeIdx >= 4} label="1. write first" />
            <ArchNode icon={<DatabaseIcon active={activeIdx === 4} />} label="DB" sublabel="Updated" active={activeIdx === 4} onClick={() => setActiveIdx(4)} />
            <VertArrow active={activeIdx >= 5} label="2. invalidate" />
            <ArchNode icon={<LockIcon active={activeIdx === 5} />} label="Cache" sublabel="Deleted" active={activeIdx === 5} onClick={() => setActiveIdx(5)} />
          </div>
        </div>
      </div>

      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / 6</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <div className="ma-dots" style={{ marginTop: '0.875rem' }}>
        {[0,1,2,3,4,5].map(i => <button key={i} className={`ma-dot${activeIdx === i ? ' ma-dot--active' : ''}`} onClick={() => setActiveIdx(i)} />)}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// DIAGRAM 4 — Read/Write Strategies: write-through vs write-back comparison
// ─────────────────────────────────────────────────────────────────────────────
const ReadWriteDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const isWriteBack = activeIdx >= 3;
  const descs = [
    'Write-Through: Write to cache AND DB at the same time',
    'Both cache and DB updated synchronously — always consistent',
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
            <ArchNode icon={<UserIcon active={activeIdx === 0} />} label="Write" sublabel="User update" active={activeIdx === 0} onClick={() => setActiveIdx(0)} />
            <VertArrow active={activeIdx >= 1} label="sync write" />
            <ArchNode icon={<CacheIcon active={activeIdx === 1} />} label="Cache" sublabel="Updated first" active={activeIdx === 1} onClick={() => setActiveIdx(1)} />
            <VertArrow active={activeIdx >= 2} label="sync write" />
            <ArchNode icon={<DatabaseIcon active={activeIdx === 2} />} label="DB" sublabel="Also updated" active={activeIdx === 2} onClick={() => setActiveIdx(2)} />
          </div>
        </div>
        <div className="arch-path-divider" />
        <div className={`arch-path${isWriteBack ? ' arch-path--active' : ''}`}>
          <div className="arch-path__label arch-path__label--write">WRITE-BACK</div>
          <div className="arch-row arch-row--col">
            <ArchNode icon={<UserIcon active={activeIdx === 3} />} label="Write" sublabel="User update" active={activeIdx === 3} onClick={() => setActiveIdx(3)} />
            <VertArrow active={activeIdx >= 4} label="write cache only" />
            <ArchNode icon={<CacheIcon active={activeIdx === 4} />} label="Cache" sublabel="Written, ack sent" active={activeIdx === 4} onClick={() => setActiveIdx(4)} />
            <VertArrow active={activeIdx >= 5} label="async later" />
            <ArchNode icon={<DatabaseIcon active={activeIdx === 5} />} label="DB" sublabel="Updated async" active={activeIdx === 5} onClick={() => setActiveIdx(5)} danger={activeIdx === 5} />
          </div>
        </div>
      </div>
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / 6</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <div className="ma-dots" style={{ marginTop: '0.875rem' }}>
        {[0,1,2,3,4,5].map(i => <button key={i} className={`ma-dot${activeIdx === i ? ' ma-dot--active' : ''}`} onClick={() => setActiveIdx(i)} />)}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// DIAGRAM 5 — Eviction: LRU memory slots animation
// ─────────────────────────────────────────────────────────────────────────────
const EvictionDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const slots = ['A', 'B', 'C', 'D', 'E'];
  const evict = activeIdx >= 1;
  const descs = ['Cache is full — 5 slots occupied, no space for new entry','LRU identifies slot A as least recently used — evict it','Slot A removed from cache, space freed','New entry inserted into the freed slot','TTL timers run independently — expired entries also removed'];

  return (
    <div className="arch-diagram">
      <div className="arch-eviction">
        <div className="arch-eviction__label">Cache Memory Slots</div>
        <div className="arch-eviction__slots">
          {slots.map((s, i) => (
            <div key={s} className={`arch-eviction__slot
              ${i === 0 && activeIdx === 1 ? ' arch-eviction__slot--victim' : ''}
              ${i === 0 && activeIdx >= 2 ? ' arch-eviction__slot--empty' : ''}
              ${i === 0 && activeIdx >= 3 ? ' arch-eviction__slot--new' : ''}
              ${activeIdx === 0 ? ' arch-eviction__slot--full' : ''}
            `}>
              {i === 0 && activeIdx >= 3 ? 'NEW' : i === 0 && activeIdx >= 2 ? '—' : s}
              {i === 0 && activeIdx === 1 && <span className="arch-eviction__evict-badge">LRU ×</span>}
              {i === 0 && activeIdx >= 3 && <div className="arch-eviction__new-pulse" />}
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
        <span className="arch-step-pill">{activeIdx + 1} / 5</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <div className="ma-dots" style={{ marginTop: '0.875rem' }}>
        {[0,1,2,3,4].map(i => <button key={i} className={`ma-dot${activeIdx === i ? ' ma-dot--active' : ''}`} onClick={() => setActiveIdx(i)} />)}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// DIAGRAM 6 — Invalidation: event-driven flow
// ─────────────────────────────────────────────────────────────────────────────
const InvalidationDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = ['App writes updated data to the database','DB fires an update event (via CDC or app logic)','Cache key invalidated — old data removed','Next read is a cache miss — fresh data fetched from DB','Fresh data stored back in cache with new TTL'];
  return (
    <div className="arch-diagram">
      <div className="arch-row arch-row--center">
        <ArchNode icon={<ServerIcon active={activeIdx === 0} />} label="App Server" sublabel="Write operation" active={activeIdx === 0} onClick={() => setActiveIdx(0)} />
        <Arrow active={activeIdx >= 1} label="1. write" />
        <ArchNode icon={<DatabaseIcon active={activeIdx === 1} />} label="Database" sublabel="Updated" active={activeIdx === 1} onClick={() => setActiveIdx(1)} />
      </div>
      <div className="arch-event-row">
        <Arrow active={activeIdx >= 2} label="2. event" />
        <ArchNode icon={<NetworkIcon active={activeIdx === 2} />} label="Event Bus" sublabel="Invalidation event" active={activeIdx === 2} onClick={() => setActiveIdx(2)} />
        <Arrow active={activeIdx >= 3} label="3. delete key" />
        <ArchNode icon={<LockIcon active={activeIdx === 3} />} label="Cache" sublabel="Key deleted" active={activeIdx === 3} onClick={() => setActiveIdx(3)} />
      </div>
      <div className="arch-row arch-row--center" style={{ marginTop: '0.5rem' }}>
        <ArchNode icon={<UserIcon active={activeIdx === 4} />} label="Next Read" sublabel="Cache miss → DB" active={activeIdx === 4} onClick={() => setActiveIdx(4)} />
        <Arrow active={activeIdx >= 4} label="4. fetch fresh" />
        <ArchNode icon={<CacheIcon active={activeIdx >= 4} />} label="Cache" sublabel="Repopulated" active={activeIdx >= 4} />
      </div>
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / 5</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <div className="ma-dots" style={{ marginTop: '0.875rem' }}>
        {[0,1,2,3,4].map(i => <button key={i} className={`ma-dot${activeIdx === i ? ' ma-dot--active' : ''}`} onClick={() => setActiveIdx(i)} />)}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// DIAGRAM 7 — Redis: Redis architecture overview
// ─────────────────────────────────────────────────────────────────────────────
const RedisDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = ['App sends GET or SET command to Redis over TCP','Redis looks up the key in its in-memory hash table','Data found — returned in sub-millisecond','On write: Redis AOF logs every command for persistence','Redis stores data in RAM — eviction policy controls memory'];
  return (
    <div className="arch-diagram">
      <div className="arch-redis-layout">
        <div className="arch-redis__apps">
          {['App 1','App 2','App 3'].map((a, i) => (
            <ArchNode key={a} icon={<ServerIcon active={activeIdx === 0} color="#7C5CFC" />} label={a} sublabel="Client" active={activeIdx === 0} onClick={() => setActiveIdx(0)} />
          ))}
        </div>
        <div className="arch-redis__arrows">
          {[0,1,2].map(i => <Arrow key={i} active={activeIdx >= 1} label="TCP cmd" />)}
        </div>
        <div className="arch-redis__core">
          <ArchNode icon={<RedisIcon active={activeIdx >= 1} />} label="Redis" sublabel="In-memory store" active={activeIdx >= 1} onClick={() => setActiveIdx(1)} />
          <div className="arch-redis__sub">
            <div className={`arch-redis__module${activeIdx === 3 ? ' arch-redis__module--active' : ''}`} onClick={() => setActiveIdx(3)}>
              💾 AOF Persistence
            </div>
            <div className={`arch-redis__module${activeIdx === 4 ? ' arch-redis__module--active' : ''}`} onClick={() => setActiveIdx(4)}>
              📊 Eviction Policy
            </div>
          </div>
        </div>
      </div>
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / 5</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <div className="ma-dots" style={{ marginTop: '0.875rem' }}>
        {[0,1,2,3,4].map(i => <button key={i} className={`ma-dot${activeIdx === i ? ' ma-dot--active' : ''}`} onClick={() => setActiveIdx(i)} />)}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// DIAGRAM 8 — Distributed Cache: cluster with consistent hashing
// ─────────────────────────────────────────────────────────────────────────────
const DistributedDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const nodes = ['Node 1\nSlots 0–5460', 'Node 2\nSlots 5461–10922', 'Node 3\nSlots 10923–16383'];
  const descs = ['Client sends key — consistent hash maps it to a slot','Hash slot determines which node owns the key','Node 2 holds this slot — client queries it directly','Primary fails — replica takes over automatically in <30s','New node added — only 1/N keys remapped (minimal disruption)'];
  return (
    <div className="arch-diagram">
      <div className="arch-cluster">
        <div className="arch-cluster__client">
          <ArchNode icon={<UserIcon active={activeIdx === 0} />} label="Client" sublabel={`CRC16(key) % 16384\n= slot ${activeIdx === 1 ? '7638' : '...'}`} active={activeIdx === 0} onClick={() => setActiveIdx(0)} />
        </div>
        <Arrow active={activeIdx >= 1} label={activeIdx === 1 ? 'slot 7638 → Node 2' : 'hash'} />
        <div className="arch-cluster__nodes">
          {nodes.map((n, i) => (
            <ArchNode key={i} icon={<CacheIcon active={activeIdx - 1 === i} />}
              label={`Node ${i + 1}`}
              sublabel={n.split('\n')[1]}
              active={activeIdx - 1 === i}
              danger={activeIdx === 3 && i === 0}
              onClick={() => setActiveIdx(i + 1)}
            />
          ))}
        </div>
      </div>
      {activeIdx === 3 && (
        <div className="arch-failover-banner">
          ⚠️ Node 1 failed → Replica promoted to primary
        </div>
      )}
      {activeIdx === 4 && (
        <div className="arch-failover-banner arch-failover-banner--ok">
          ✅ New node added — only ~1/N keys remapped
        </div>
      )}
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / 5</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <div className="ma-dots" style={{ marginTop: '0.875rem' }}>
        {[0,1,2,3,4].map(i => <button key={i} className={`ma-dot${activeIdx === i ? ' ma-dot--active' : ''}`} onClick={() => setActiveIdx(i)} />)}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// DIAGRAM 9 — Stampede/Penetration/Avalanche
// ─────────────────────────────────────────────────────────────────────────────
const StampedeDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = ['Popular cache key expires — everyone misses simultaneously','Thousands of requests all query the DB at once','Database overwhelmed — CPU 100%, response degraded','Mutex lock: only ONE request rebuilds, others wait','Cache repopulated — all waiting requests served'];
  const isDanger = activeIdx >= 1 && activeIdx <= 2;

  return (
    <div className="arch-diagram">
      <div className="arch-stampede">
        <div className="arch-stampede__users">
          {['User 1','User 2','...','User N'].map((u, i) => (
            <div key={u} className={`arch-stampede__user${activeIdx >= 1 ? ' arch-stampede__user--flood' : ''}`}>
              <UserIcon active={activeIdx >= 1} />
              <span>{u}</span>
            </div>
          ))}
        </div>
        <Arrow active={activeIdx >= 1} label={activeIdx >= 1 ? '⚡ all miss!' : 'requests'} />
        <div className="arch-stampede__center">
          <ArchNode icon={<CacheIcon active={activeIdx === 0} />} label="Cache" sublabel={activeIdx === 0 ? 'Key expires ⏱️' : activeIdx >= 4 ? 'Repopulated ✅' : 'EMPTY ❌'} active={activeIdx === 0 || activeIdx >= 4} danger={activeIdx >= 1 && activeIdx <= 2} />
          {activeIdx >= 3 && (
            <>
              <VertArrow active label="mutex lock" />
              <ArchNode icon={<LockIcon active />} label="Mutex" sublabel="One rebuilds" active />
            </>
          )}
        </div>
        {isDanger && <Arrow active label="flood" />}
        {isDanger && <ArchNode icon={<DatabaseIcon active={isDanger} />} label="Database" sublabel="Overwhelmed 🔥" active danger />}
      </div>
      {isDanger && <div className="arch-danger-banner">🔥 Database CPU at 100% — stampede in progress</div>}
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / 5</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <div className="ma-dots" style={{ marginTop: '0.875rem' }}>
        {[0,1,2,3,4].map(i => <button key={i} className={`ma-dot${activeIdx === i ? ' ma-dot--active' : ''}`} onClick={() => setActiveIdx(i)} />)}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// CONSISTENCY DIAGRAM
// ─────────────────────────────────────────────────────────────────────────────
const ConsistencyDiagram = ({ activeIdx, setActiveIdx }: { activeIdx: number; setActiveIdx: (i: number) => void }) => {
  const descs = ['App writes new data to the database','Cache still holds old stale value','Other users read stale data from cache','TTL expires — cache entry removed','Fresh data fetched — all users see consistent data'];
  return (
    <div className="arch-diagram">
      <div className="arch-row arch-row--center">
        <ArchNode icon={<ServerIcon active={activeIdx === 0} />} label="App" sublabel="Writes update" active={activeIdx === 0} onClick={() => setActiveIdx(0)} />
        <Arrow active={activeIdx >= 0} label="write" />
        <ArchNode icon={<DatabaseIcon active={activeIdx >= 0} />} label="Database" sublabel="Updated ✅" active={activeIdx >= 0} onClick={() => setActiveIdx(1)} />
      </div>
      <div className="arch-row arch-row--center" style={{ marginTop: '1rem' }}>
        <ArchNode icon={<UserIcon active={activeIdx === 2} />} label="Users" sublabel={activeIdx >= 2 && activeIdx <= 3 ? 'See stale data ⚠️' : activeIdx >= 4 ? 'See fresh data ✅' : 'Reading...'} active={activeIdx >= 2} onClick={() => setActiveIdx(2)} danger={activeIdx === 2} />
        <Arrow active={activeIdx >= 2} label="read" />
        <ArchNode icon={<CacheIcon active={activeIdx >= 1} />} label="Cache" sublabel={activeIdx <= 2 ? 'STALE ⚠️' : activeIdx === 3 ? 'TTL expired' : 'Fresh ✅'} active={activeIdx >= 1} danger={activeIdx === 2} onClick={() => setActiveIdx(3)} />
      </div>
      {activeIdx === 2 && <div className="arch-danger-banner">⚠️ Cache and DB are out of sync — stale data period</div>}
      {activeIdx >= 4 && <div className="arch-failover-banner--ok arch-failover-banner">✅ Cache and DB are now consistent</div>}
      <div className="arch-step-info">
        <span className="arch-step-pill">{activeIdx + 1} / 5</span>
        <span className="arch-step-desc">{descs[activeIdx]}</span>
      </div>
      <div className="ma-dots" style={{ marginTop: '0.875rem' }}>
        {[0,1,2,3,4].map(i => <button key={i} className={`ma-dot${activeIdx === i ? ' ma-dot--active' : ''}`} onClick={() => setActiveIdx(i)} />)}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// DISPATCHER — pick the right diagram based on topic title
// ─────────────────────────────────────────────────────────────────────────────
const ModuleAnimation = ({ steps, animType, title, topicTitle }: Props) => {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    setActiveIdx(0);
    if (steps.length <= 1) return;
    const iv = setInterval(() => setActiveIdx(i => (i + 1) % steps.length), 2600);
    return () => clearInterval(iv);
  }, [steps]);

  const t = (topicTitle || title || '').toLowerCase();

  const getDiagram = () => {
    if (t.includes('basics') || t.includes('fundamentals')) return <CacheBasicsDiagram activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('architecture')) return <CacheArchDiagram activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('aside') || t.includes('cache-aside')) return <CacheAsideDiagram activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('read') || t.includes('write') || t.includes('strateg')) return <ReadWriteDiagram activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('eviction') || t.includes('lru') || t.includes('lfu') || t.includes('ttl')) return <EvictionDiagram activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('invalid')) return <InvalidationDiagram activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('consisten')) return <ConsistencyDiagram activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('redis')) return <RedisDiagram activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('distributed')) return <DistributedDiagram activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    if (t.includes('stampede') || t.includes('penetration') || t.includes('avalanche') || t.includes('failure')) return <StampedeDiagram activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
    // Default flow diagram
    return <CacheBasicsDiagram activeIdx={activeIdx} setActiveIdx={setActiveIdx} />;
  };

  return (
    <div className="module-animation" aria-label="Architecture diagram">
      {getDiagram()}
    </div>
  );
};

export default ModuleAnimation;
