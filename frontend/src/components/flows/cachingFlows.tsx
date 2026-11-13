import React from 'react';
import { C, type FlowDef } from '../HLDFlow';

// ── Shared SVG icon helpers ───────────────────────────────────────────────────
const box = (color: string, bg: string, label: string) => (
  <svg width="32" height="28" viewBox="0 0 48 40" fill="none">
    <rect x="4" y="4" width="40" height="32" rx="6" fill={bg} stroke={color} strokeWidth="2"/>
    <text x="24" y="24" textAnchor="middle" fontSize="10" fontWeight="700" fill={color}>{label}</text>
  </svg>
);
const cylinder = (color: string, bg: string) => (
  <svg width="32" height="36" viewBox="0 0 44 52" fill="none">
    <ellipse cx="22" cy="10" rx="18" ry="6" fill={color} stroke={color} strokeWidth="2"/>
    <rect x="4" y="10" width="36" height="28" fill={bg} stroke={color} strokeWidth="2"/>
    <ellipse cx="22" cy="38" rx="18" ry="6" fill={bg} stroke={color} strokeWidth="2"/>
  </svg>
);
const server = (color: string, bg: string) => (
  <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
    <rect x="4" y="8"  width="40" height="10" rx="3" fill={color} stroke={color} strokeWidth="1.5"/>
    <rect x="4" y="22" width="40" height="10" rx="3" fill={bg}    stroke={color} strokeWidth="1.5"/>
    <rect x="4" y="36" width="40" height="10" rx="3" fill={bg}    stroke={color} strokeWidth="1.5"/>
    <circle cx="36" cy="13" r="2" fill="white"/>
  </svg>
);
const user = (color: string, bg: string) => (
  <svg width="28" height="34" viewBox="0 0 44 52" fill="none">
    <circle cx="22" cy="14" r="10" fill={color} stroke={color} strokeWidth="2"/>
    <path d="M4 46c0-9.941 8.059-18 18-18s18 8.059 18 18" fill={bg} stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);
const cloud = (color: string, bg: string) => (
  <svg width="36" height="28" viewBox="0 0 56 40" fill="none">
    <path d="M44 32H14a10 10 0 010-20 10 10 0 0119.6-3A8 8 0 1144 32z" fill={bg} stroke={color} strokeWidth="2"/>
  </svg>
);

// ── 2. Cache Architecture ─────────────────────────────────────────────────────
export const cacheArchitectureDef: FlowDef = {
  nodes: [
    { id: 'client', label: 'Client', sublabel: 'App / Browser',
      icon: (a) => user(a ? C.primary : '#C4B5FD', a ? C.primaryBg : '#F5F3FF'),
      position: { x: 20, y: 150 }, mobilePosition: { x: 10, y: 120 } },
    { id: 'app', label: 'App Server', sublabel: 'Business logic',
      icon: (a) => server(a ? C.primary : '#C4B5FD', a ? C.primaryBg : '#F5F3FF'),
      position: { x: 200, y: 150 }, mobilePosition: { x: 150, y: 120 } },
    { id: 'cache', label: 'Cache Layer', sublabel: 'Redis / Memcached',
      icon: (a) => cylinder(a ? C.primary : '#C4B5FD', a ? C.primaryBg : '#F5F3FF'),
      position: { x: 390, y: 40 }, mobilePosition: { x: 290, y: 20 } },
    { id: 'db', label: 'Database', sublabel: 'Source of truth',
      icon: (a) => cylinder(a ? C.green : '#86efac', a ? C.greenBg : '#f0fff4'),
      position: { x: 390, y: 270 }, mobilePosition: { x: 290, y: 220 } },
  ],
  edges: [
    { id: 'c-a', source: 'client', target: 'app',   label: 'request',  sourceHandle: 'right',  targetHandle: 'left',  type: 'smoothstep' },
    { id: 'a-c', source: 'app',   target: 'client', label: 'response', sourceHandle: 'left-s', targetHandle: 'right-t', type: 'smoothstep' },
    { id: 'a-ch', source: 'app',  target: 'cache',  label: 'lookup',   sourceHandle: 'top-s',  targetHandle: 'left',  type: 'smoothstep' },
    { id: 'ch-a', source: 'cache', target: 'app',   label: 'hit',      sourceHandle: 'left-s', targetHandle: 'right-t', type: 'smoothstep' },
    { id: 'a-db', source: 'app',  target: 'db',     label: 'query',    sourceHandle: 'bottom', targetHandle: 'left',  type: 'smoothstep' },
    { id: 'db-a', source: 'db',   target: 'app',    label: 'data',     sourceHandle: 'left-s', targetHandle: 'right-t', type: 'smoothstep' },
    { id: 'a-wc', source: 'app',  target: 'cache',  label: 'write',    sourceHandle: 'right',  targetHandle: 'bottom-t', type: 'smoothstep' },
  ],
  steps: [
    { label: 'Client Request', description: 'Client sends a data request to the app server', activeNodes: ['client', 'app'], animatedEdges: ['c-a'], edgeColor: { 'c-a': C.primary } },
    { label: 'Cache Lookup', description: 'App server checks the cache layer first before the database', activeNodes: ['app', 'cache'], animatedEdges: ['a-ch'], edgeColor: { 'a-ch': C.primary } },
    { label: 'Cache Hit', description: 'Data found in cache — returned to app in under 1ms', activeNodes: ['cache', 'app'], animatedEdges: ['ch-a'], edgeColor: { 'ch-a': C.green } },
    { label: 'Cache Miss', description: 'Data not in cache — app queries the database', activeNodes: ['app', 'db'], animatedEdges: ['a-db'], edgeColor: { 'a-db': C.red } },
    { label: 'DB Returns Data', description: 'Database returns data to the app server', activeNodes: ['db', 'app'], animatedEdges: ['db-a'], edgeColor: { 'db-a': C.green } },
    { label: 'Write to Cache', description: 'App stores the result in the cache for future requests', activeNodes: ['app', 'cache'], animatedEdges: ['a-wc'], edgeColor: { 'a-wc': C.primary } },
    { label: 'Return to Client', description: 'Final response sent back to the client', activeNodes: ['app', 'client'], animatedEdges: ['a-c'], edgeColor: { 'a-c': C.green } },
  ],
};


// ── 3. Cache-Aside Pattern ────────────────────────────────────────────────────
export const cacheAsidePatternDef: FlowDef = {
  nodes: [
    { id: 'app',   label: 'Application', sublabel: 'Manages cache',
      icon: (a) => server(a ? C.primary : '#C4B5FD', a ? C.primaryBg : '#F5F3FF'),
      position: { x: 200, y: 150 }, mobilePosition: { x: 140, y: 120 } },
    { id: 'cache', label: 'Cache', sublabel: 'Redis',
      icon: (a) => cylinder(a ? C.primary : '#C4B5FD', a ? C.primaryBg : '#F5F3FF'),
      position: { x: 390, y: 40 }, mobilePosition: { x: 290, y: 20 } },
    { id: 'db',    label: 'Database', sublabel: 'PostgreSQL',
      icon: (a) => cylinder(a ? C.green : '#86efac', a ? C.greenBg : '#f0fff4'),
      position: { x: 390, y: 270 }, mobilePosition: { x: 290, y: 230 } },
    { id: 'user',  label: 'User', sublabel: 'Read request',
      icon: (a) => user(a ? C.primary : '#C4B5FD', a ? C.primaryBg : '#F5F3FF'),
      position: { x: 20, y: 150 }, mobilePosition: { x: 10, y: 120 } },
  ],
  edges: [
    { id: 'u-a',  source: 'user',  target: 'app',   label: 'request', sourceHandle: 'right',  targetHandle: 'left', type: 'smoothstep' },
    { id: 'a-ch', source: 'app',   target: 'cache', label: 'check',   sourceHandle: 'top-s',  targetHandle: 'left', type: 'smoothstep' },
    { id: 'ch-a', source: 'cache', target: 'app',   label: 'miss',    sourceHandle: 'left-s', targetHandle: 'right-t', type: 'smoothstep' },
    { id: 'a-db', source: 'app',   target: 'db',    label: 'fetch',   sourceHandle: 'bottom', targetHandle: 'left', type: 'smoothstep' },
    { id: 'db-a', source: 'db',    target: 'app',   label: 'data',    sourceHandle: 'left-s', targetHandle: 'right-t', type: 'smoothstep' },
    { id: 'a-cw', source: 'app',   target: 'cache', label: 'store',   sourceHandle: 'right',  targetHandle: 'bottom-t', type: 'smoothstep' },
    { id: 'a-u',  source: 'app',   target: 'user',  label: 'respond', sourceHandle: 'left-s', targetHandle: 'right-t', type: 'smoothstep' },
  ],
  steps: [
    { label: 'User Requests Data', description: 'Application receives a read request from the user', activeNodes: ['user', 'app'], animatedEdges: ['u-a'], edgeColor: { 'u-a': C.primary } },
    { label: 'Check Cache', description: 'App looks up the key in the cache (cache-aside: app does this, not the cache)', activeNodes: ['app', 'cache'], animatedEdges: ['a-ch'], edgeColor: { 'a-ch': C.primary } },
    { label: 'Cache Miss', description: 'Key not found — app must load from the database', activeNodes: ['cache', 'app'], animatedEdges: ['ch-a'], edgeColor: { 'ch-a': C.red }, nodeOverride: { 'cache': { miss: true } } },
    { label: 'Load from DB', description: 'App queries the database directly', activeNodes: ['app', 'db'], animatedEdges: ['a-db'], edgeColor: { 'a-db': C.orange } },
    { label: 'DB Returns Data', description: 'Database sends the requested data back to the app', activeNodes: ['db', 'app'], animatedEdges: ['db-a'], edgeColor: { 'db-a': C.green } },
    { label: 'Populate Cache', description: 'App stores the data in cache so next time is a hit', activeNodes: ['app', 'cache'], animatedEdges: ['a-cw'], edgeColor: { 'a-cw': C.primary }, nodeOverride: { 'cache': { hit: true } } },
    { label: 'Return to User', description: 'App returns the data to the user', activeNodes: ['app', 'user'], animatedEdges: ['a-u'], edgeColor: { 'a-u': C.green } },
  ],
};


// ── 4. Read/Write Strategies ──────────────────────────────────────────────────
export const readWriteStrategiesDef: FlowDef = {
  nodes: [
    { id: 'app',   label: 'App', sublabel: 'Write request',
      icon: (a) => server(a ? C.primary : '#C4B5FD', a ? C.primaryBg : '#F5F3FF'),
      position: { x: 60, y: 150 }, mobilePosition: { x: 20, y: 150 } },
    { id: 'cache', label: 'Cache', sublabel: 'Write-through',
      icon: (a) => cylinder(a ? C.primary : '#C4B5FD', a ? C.primaryBg : '#F5F3FF'),
      position: { x: 270, y: 50 }, mobilePosition: { x: 190, y: 60 } },
    { id: 'db',    label: 'Database', sublabel: 'Always updated',
      icon: (a) => cylinder(a ? C.green : '#86efac', a ? C.greenBg : '#f0fff4'),
      position: { x: 270, y: 260 }, mobilePosition: { x: 190, y: 250 } },
    { id: 'q',     label: 'Write Queue', sublabel: 'Write-behind',
      icon: (a) => box(a ? C.orange : '#fdba74', a ? C.orangeBg : '#fff7ed', 'Q'),
      position: { x: 450, y: 150 }, mobilePosition: { x: 310, y: 150 } },
  ],
  edges: [
    { id: 'a-ch',  source: 'app',   target: 'cache', label: 'write',  sourceHandle: 'top-s',  targetHandle: 'left',    type: 'smoothstep' },
    { id: 'ch-db', source: 'cache', target: 'db',    label: 'sync',   sourceHandle: 'bottom', targetHandle: 'top',     type: 'smoothstep' },
    { id: 'a-db',  source: 'app',   target: 'db',    label: 'direct', sourceHandle: 'bottom', targetHandle: 'left',    type: 'smoothstep' },
    { id: 'a-q',   source: 'app',   target: 'q',     label: 'async',  sourceHandle: 'right',  targetHandle: 'left',    type: 'smoothstep' },
    { id: 'q-db',  source: 'q',     target: 'db',    label: 'flush',  sourceHandle: 'bottom', targetHandle: 'right-t', type: 'smoothstep' },
  ],
  steps: [
    { label: 'Write-Through', description: 'App writes to cache and database simultaneously — always consistent', activeNodes: ['app', 'cache', 'db'], animatedEdges: ['a-ch', 'ch-db'], edgeColor: { 'a-ch': C.primary, 'ch-db': C.primary } },
    { label: 'Write-Around', description: 'App writes directly to the database, bypassing the cache entirely', activeNodes: ['app', 'db'], animatedEdges: ['a-db'], edgeColor: { 'a-db': C.orange } },
    { label: 'Write-Behind (async)', description: 'App writes to cache immediately, flushes to DB asynchronously for speed', activeNodes: ['app', 'q', 'db'], animatedEdges: ['a-q', 'q-db'], edgeColor: { 'a-q': C.green, 'q-db': C.green } },
    { label: 'Read-Through', description: 'On cache miss, the cache itself loads data from the DB and populates itself', activeNodes: ['cache', 'db'], animatedEdges: ['ch-db'], edgeColor: { 'ch-db': C.blue } },
    { label: 'Write-Through vs Write-Behind', description: 'Write-Through: safe but slower. Write-Behind: fast but risk of data loss on crash', activeNodes: ['app', 'cache', 'q'], animatedEdges: ['a-ch', 'a-q'], edgeColor: { 'a-ch': C.primary, 'a-q': C.orange } },
  ],
};


// ── 5. Eviction (LRU/LFU/TTL) ────────────────────────────────────────────────
export const evictionDef: FlowDef = {
  nodes: [
    { id: 'cache',  label: 'Cache', sublabel: 'Limited memory',
      icon: (a) => cylinder(a ? C.primary : '#C4B5FD', a ? C.primaryBg : '#F5F3FF'),
      position: { x: 60, y: 140 }, mobilePosition: { x: 20, y: 140 } },
    { id: 'lru',  label: 'LRU', sublabel: 'Least Recently Used',
      icon: (a) => box(a ? C.primary : '#C4B5FD', a ? C.primaryBg : '#F5F3FF', 'LRU'),
      position: { x: 290, y: 30 }, mobilePosition: { x: 190, y: 30 } },
    { id: 'lfu',  label: 'LFU', sublabel: 'Least Frequently Used',
      icon: (a) => box(a ? C.orange : '#fdba74', a ? C.orangeBg : '#fff7ed', 'LFU'),
      position: { x: 290, y: 160 }, mobilePosition: { x: 190, y: 160 } },
    { id: 'ttl',  label: 'TTL', sublabel: 'Time To Live',
      icon: (a) => box(a ? C.green : '#86efac', a ? C.greenBg : '#f0fff4', 'TTL'),
      position: { x: 290, y: 290 }, mobilePosition: { x: 190, y: 290 } },
    { id: 'evicted', label: 'Evicted', sublabel: 'Removed from cache',
      icon: (a) => box(a ? C.red : '#fca5a5', a ? C.redBg : '#fff5f5', 'OUT'),
      position: { x: 490, y: 160 }, mobilePosition: { x: 310, y: 160 } },
  ],
  edges: [
    { id: 'c-lru', source: 'cache', target: 'lru', label: 'policy', sourceHandle: 'top-s',  targetHandle: 'left',  type: 'smoothstep' },
    { id: 'c-lfu', source: 'cache', target: 'lfu', label: 'policy', sourceHandle: 'right',  targetHandle: 'left',  type: 'smoothstep' },
    { id: 'c-ttl', source: 'cache', target: 'ttl', label: 'policy', sourceHandle: 'bottom', targetHandle: 'left',  type: 'smoothstep' },
    { id: 'lru-e', source: 'lru',   target: 'evicted', label: 'evict', sourceHandle: 'right', targetHandle: 'top',   type: 'smoothstep' },
    { id: 'lfu-e', source: 'lfu',   target: 'evicted', label: 'evict', sourceHandle: 'right', targetHandle: 'left',  type: 'smoothstep' },
    { id: 'ttl-e', source: 'ttl',   target: 'evicted', label: 'expire', sourceHandle: 'right', targetHandle: 'bottom-t', type: 'smoothstep' },
  ],
  steps: [
    { label: 'Cache is Full', description: 'Cache has limited memory — when it fills up, old entries must be evicted', activeNodes: ['cache'], animatedEdges: [], edgeColor: {} },
    { label: 'LRU Policy', description: 'LRU evicts the item that was least recently accessed — good for recency-based data', activeNodes: ['cache', 'lru', 'evicted'], animatedEdges: ['c-lru', 'lru-e'], edgeColor: { 'c-lru': C.primary, 'lru-e': C.red } },
    { label: 'LFU Policy', description: 'LFU evicts the item accessed fewest times — good when popularity matters', activeNodes: ['cache', 'lfu', 'evicted'], animatedEdges: ['c-lfu', 'lfu-e'], edgeColor: { 'c-lfu': C.orange, 'lfu-e': C.red } },
    { label: 'TTL Expiry', description: 'TTL automatically expires entries after a set time — prevents stale data', activeNodes: ['cache', 'ttl', 'evicted'], animatedEdges: ['c-ttl', 'ttl-e'], edgeColor: { 'c-ttl': C.green, 'ttl-e': C.red } },
    { label: 'Choosing a Policy', description: 'LRU for most cases, LFU for popularity-based content, TTL for time-sensitive data', activeNodes: ['lru', 'lfu', 'ttl'], animatedEdges: ['c-lru', 'c-lfu', 'c-ttl'], edgeColor: { 'c-lru': C.primary, 'c-lfu': C.orange, 'c-ttl': C.green } },
  ],
};


// ── 6. Cache Invalidation ─────────────────────────────────────────────────────
export const cacheInvalidationDef: FlowDef = {
  nodes: [
    { id: 'src',   label: 'Data Source', sublabel: 'DB / API',
      icon: (a) => cylinder(a ? C.green : '#86efac', a ? C.greenBg : '#f0fff4'),
      position: { x: 40, y: 160 }, mobilePosition: { x: 10, y: 150 } },
    { id: 'cache', label: 'Cache', sublabel: 'Stale data?',
      icon: (a) => cylinder(a ? C.primary : '#C4B5FD', a ? C.primaryBg : '#F5F3FF'),
      position: { x: 240, y: 60 }, mobilePosition: { x: 170, y: 60 } },
    { id: 'inv',   label: 'Invalidate', sublabel: 'Delete key',
      icon: (a) => box(a ? C.red : '#fca5a5', a ? C.redBg : '#fff5f5', 'DEL'),
      position: { x: 240, y: 270 }, mobilePosition: { x: 170, y: 260 } },
    { id: 'app',   label: 'App', sublabel: 'Triggers update',
      icon: (a) => server(a ? C.primary : '#C4B5FD', a ? C.primaryBg : '#F5F3FF'),
      position: { x: 440, y: 160 }, mobilePosition: { x: 300, y: 150 } },
  ],
  edges: [
    { id: 's-ch',  source: 'src',   target: 'cache', label: 'stale!', sourceHandle: 'top-s',  targetHandle: 'left',    type: 'smoothstep' },
    { id: 'ch-inv', source: 'cache', target: 'inv',  label: 'expire', sourceHandle: 'bottom', targetHandle: 'top',     type: 'smoothstep' },
    { id: 'inv-ch', source: 'inv',   target: 'cache', label: 'purge', sourceHandle: 'top-s',  targetHandle: 'bottom-t', type: 'smoothstep' },
    { id: 'src-inv', source: 'src',  target: 'inv',   label: 'update', sourceHandle: 'bottom', targetHandle: 'left',   type: 'smoothstep' },
    { id: 'inv-a', source: 'inv',    target: 'app',   label: 'notify', sourceHandle: 'right',  targetHandle: 'bottom-t', type: 'smoothstep' },
    { id: 'a-ch',  source: 'app',    target: 'cache', label: 'reload', sourceHandle: 'top-s',  targetHandle: 'right-t', type: 'smoothstep' },
  ],
  steps: [
    { label: 'Data Changes', description: 'The source data (DB/API) has been updated — cache now holds stale data', activeNodes: ['src'], animatedEdges: [], edgeColor: {} },
    { label: 'Stale Cache', description: 'Cache still serves old data until it is invalidated', activeNodes: ['src', 'cache'], animatedEdges: ['s-ch'], edgeColor: { 's-ch': C.orange }, nodeOverride: { cache: { warn: true } } },
    { label: 'TTL Expiry', description: 'Cache entry expires automatically via TTL — simplest invalidation strategy', activeNodes: ['cache', 'inv'], animatedEdges: ['ch-inv'], edgeColor: { 'ch-inv': C.red } },
    { label: 'Event-Based Invalidation', description: 'On data update, app explicitly deletes the cache key immediately', activeNodes: ['src', 'inv', 'cache'], animatedEdges: ['src-inv', 'inv-ch'], edgeColor: { 'src-inv': C.orange, 'inv-ch': C.red } },
    { label: 'Cache Repopulated', description: 'Next request finds cache empty, fetches fresh data, re-caches it', activeNodes: ['app', 'cache'], animatedEdges: ['a-ch'], edgeColor: { 'a-ch': C.primary } },
  ],
};


// ── 7. Cache Consistency ──────────────────────────────────────────────────────
export const cacheConsistencyDef: FlowDef = {
  nodes: [
    { id: 'app1', label: 'App Server 1', sublabel: 'Writes data',
      icon: (a) => server(a ? C.primary : '#C4B5FD', a ? C.primaryBg : '#F5F3FF'),
      position: { x: 20, y: 60 }, mobilePosition: { x: 10, y: 60 } },
    { id: 'app2', label: 'App Server 2', sublabel: 'Reads data',
      icon: (a) => server(a ? C.blue : '#93c5fd', a ? C.blueBg : '#eff6ff'),
      position: { x: 20, y: 260 }, mobilePosition: { x: 10, y: 250 } },
    { id: 'cache', label: 'Shared Cache', sublabel: 'Redis cluster',
      icon: (a) => cylinder(a ? C.primary : '#C4B5FD', a ? C.primaryBg : '#F5F3FF'),
      position: { x: 230, y: 160 }, mobilePosition: { x: 170, y: 160 } },
    { id: 'db',   label: 'Database', sublabel: 'Single source',
      icon: (a) => cylinder(a ? C.green : '#86efac', a ? C.greenBg : '#f0fff4'),
      position: { x: 440, y: 160 }, mobilePosition: { x: 300, y: 160 } },
  ],
  edges: [
    { id: 'a1-db',  source: 'app1', target: 'db',    label: 'write',  sourceHandle: 'right',  targetHandle: 'top',     type: 'smoothstep' },
    { id: 'a1-ch',  source: 'app1', target: 'cache', label: 'update', sourceHandle: 'right',  targetHandle: 'left',    type: 'smoothstep' },
    { id: 'a2-ch',  source: 'app2', target: 'cache', label: 'read',   sourceHandle: 'right',  targetHandle: 'left-s',  type: 'smoothstep' },
    { id: 'ch-a2',  source: 'cache', target: 'app2', label: 'stale?', sourceHandle: 'left-s', targetHandle: 'right-t', type: 'smoothstep' },
    { id: 'db-ch',  source: 'db',   target: 'cache', label: 'sync',   sourceHandle: 'left-s', targetHandle: 'right-t', type: 'smoothstep' },
    { id: 'ch-db',  source: 'cache', target: 'db',   label: 'verify', sourceHandle: 'right',  targetHandle: 'left',    type: 'smoothstep' },
  ],
  steps: [
    { label: 'App 1 Writes', description: 'App Server 1 updates data in the database', activeNodes: ['app1', 'db'], animatedEdges: ['a1-db'], edgeColor: { 'a1-db': C.primary } },
    { label: 'Cache Update', description: 'App 1 must also update or invalidate the cache to avoid stale reads', activeNodes: ['app1', 'cache'], animatedEdges: ['a1-ch'], edgeColor: { 'a1-ch': C.orange } },
    { label: 'App 2 Reads', description: 'App Server 2 reads from the cache — may get stale data if cache was not updated', activeNodes: ['app2', 'cache'], animatedEdges: ['a2-ch', 'ch-a2'], edgeColor: { 'a2-ch': C.blue, 'ch-a2': C.orange }, nodeOverride: { cache: { warn: true } } },
    { label: 'DB Sync', description: 'Using DB-to-cache sync (CDC) keeps cache consistent automatically', activeNodes: ['db', 'cache'], animatedEdges: ['db-ch'], edgeColor: { 'db-ch': C.green } },
    { label: 'Strong Consistency', description: 'Write to DB first, then invalidate cache — guarantees fresh data on next read', activeNodes: ['app1', 'db', 'cache'], animatedEdges: ['a1-db', 'a1-ch'], edgeColor: { 'a1-db': C.primary, 'a1-ch': C.red } },
  ],
};


// ── 8. Redis ──────────────────────────────────────────────────────────────────
export const redisDef: FlowDef = {
  nodes: [
    { id: 'app',     label: 'Application', sublabel: 'Redis client',
      icon: (a) => server(a ? C.primary : '#C4B5FD', a ? C.primaryBg : '#F5F3FF'),
      position: { x: 20, y: 160 }, mobilePosition: { x: 10, y: 150 } },
    { id: 'redis',   label: 'Redis', sublabel: 'In-memory store',
      icon: (a) => cylinder(a ? C.red : '#fca5a5', a ? C.redBg : '#fff5f5'),
      position: { x: 230, y: 60 }, mobilePosition: { x: 170, y: 60 } },
    { id: 'str',     label: 'Strings', sublabel: 'Key-value',
      icon: (a) => box(a ? C.primary : '#C4B5FD', a ? C.primaryBg : '#F5F3FF', 'STR'),
      position: { x: 440, y: 10 }, mobilePosition: { x: 300, y: 10 } },
    { id: 'hash',    label: 'Hashes', sublabel: 'Objects',
      icon: (a) => box(a ? C.orange : '#fdba74', a ? C.orangeBg : '#fff7ed', 'HSH'),
      position: { x: 440, y: 120 }, mobilePosition: { x: 300, y: 100 } },
    { id: 'list',    label: 'Lists', sublabel: 'Queues',
      icon: (a) => box(a ? C.green : '#86efac', a ? C.greenBg : '#f0fff4', 'LST'),
      position: { x: 440, y: 230 }, mobilePosition: { x: 300, y: 200 } },
    { id: 'db',      label: 'Database', sublabel: 'Persistence',
      icon: (a) => cylinder(a ? C.green : '#86efac', a ? C.greenBg : '#f0fff4'),
      position: { x: 230, y: 280 }, mobilePosition: { x: 170, y: 270 } },
  ],
  edges: [
    { id: 'a-r',    source: 'app',   target: 'redis', label: 'GET/SET',  sourceHandle: 'top-s',  targetHandle: 'left',   type: 'smoothstep' },
    { id: 'r-str',  source: 'redis', target: 'str',   label: 'string',  sourceHandle: 'right',  targetHandle: 'left',   type: 'smoothstep' },
    { id: 'r-hash', source: 'redis', target: 'hash',  label: 'hash',    sourceHandle: 'right',  targetHandle: 'left',   type: 'smoothstep' },
    { id: 'r-list', source: 'redis', target: 'list',  label: 'list',    sourceHandle: 'right',  targetHandle: 'left',   type: 'smoothstep' },
    { id: 'r-db',   source: 'redis', target: 'db',    label: 'persist', sourceHandle: 'bottom', targetHandle: 'top',    type: 'smoothstep' },
    { id: 'a-r2',   source: 'app',   target: 'redis', label: 'expire',  sourceHandle: 'right',  targetHandle: 'left-s', type: 'smoothstep' },
  ],
  steps: [
    { label: 'App Connects to Redis', description: 'Application uses a Redis client to connect to the in-memory store', activeNodes: ['app', 'redis'], animatedEdges: ['a-r'], edgeColor: { 'a-r': C.red } },
    { label: 'String Operations', description: 'Most common use: GET/SET for session tokens, counters, rate limit keys', activeNodes: ['redis', 'str'], animatedEdges: ['r-str'], edgeColor: { 'r-str': C.primary } },
    { label: 'Hash Structures', description: 'Store objects as hashes — user profiles, cart items', activeNodes: ['redis', 'hash'], animatedEdges: ['r-hash'], edgeColor: { 'r-hash': C.orange } },
    { label: 'List as Queue', description: 'Lists support LPUSH/RPOP — perfect for job queues and message buffers', activeNodes: ['redis', 'list'], animatedEdges: ['r-list'], edgeColor: { 'r-list': C.green } },
    { label: 'Persistence', description: 'Redis can persist to disk via RDB snapshots or AOF logs — survives restarts', activeNodes: ['redis', 'db'], animatedEdges: ['r-db'], edgeColor: { 'r-db': C.green } },
    { label: 'TTL / Expiry', description: 'Set expiry on any key — Redis auto-evicts expired keys', activeNodes: ['app', 'redis'], animatedEdges: ['a-r2'], edgeColor: { 'a-r2': C.orange } },
  ],
};


// ── 9. Distributed Cache ──────────────────────────────────────────────────────
export const distributedCacheDef: FlowDef = {
  nodes: [
    { id: 'app1', label: 'App 1', sublabel: 'Server',
      icon: (a) => server(a ? C.primary : '#C4B5FD', a ? C.primaryBg : '#F5F3FF'),
      position: { x: 20, y: 60 }, mobilePosition: { x: 10, y: 60 } },
    { id: 'app2', label: 'App 2', sublabel: 'Server',
      icon: (a) => server(a ? C.primary : '#C4B5FD', a ? C.primaryBg : '#F5F3FF'),
      position: { x: 20, y: 280 }, mobilePosition: { x: 10, y: 260 } },
    { id: 'n1',  label: 'Node 1', sublabel: 'Shard A-M',
      icon: (a) => cylinder(a ? C.primary : '#C4B5FD', a ? C.primaryBg : '#F5F3FF'),
      position: { x: 240, y: 20 }, mobilePosition: { x: 170, y: 20 } },
    { id: 'n2',  label: 'Node 2', sublabel: 'Shard N-Z',
      icon: (a) => cylinder(a ? C.orange : '#fdba74', a ? C.orangeBg : '#fff7ed'),
      position: { x: 240, y: 160 }, mobilePosition: { x: 170, y: 150 } },
    { id: 'n3',  label: 'Node 3', sublabel: 'Replica',
      icon: (a) => cylinder(a ? C.green : '#86efac', a ? C.greenBg : '#f0fff4'),
      position: { x: 240, y: 300 }, mobilePosition: { x: 170, y: 280 } },
    { id: 'ring', label: 'Hash Ring', sublabel: 'Consistent hash',
      icon: (a) => box(a ? C.blue : '#93c5fd', a ? C.blueBg : '#eff6ff', 'HR'),
      position: { x: 440, y: 160 }, mobilePosition: { x: 300, y: 150 } },
  ],
  edges: [
    { id: 'a1-n1', source: 'app1', target: 'n1',   label: 'write',  sourceHandle: 'right',  targetHandle: 'left',    type: 'smoothstep' },
    { id: 'a1-n2', source: 'app1', target: 'n2',   label: 'route',  sourceHandle: 'right',  targetHandle: 'left',    type: 'smoothstep' },
    { id: 'a2-n2', source: 'app2', target: 'n2',   label: 'read',   sourceHandle: 'right',  targetHandle: 'left-s',  type: 'smoothstep' },
    { id: 'a2-n3', source: 'app2', target: 'n3',   label: 'read',   sourceHandle: 'right',  targetHandle: 'left',    type: 'smoothstep' },
    { id: 'n2-r',  source: 'n2',   target: 'ring', label: 'hash',   sourceHandle: 'right',  targetHandle: 'left',    type: 'smoothstep' },
    { id: 'n1-n3', source: 'n1',   target: 'n3',   label: 'replicate', sourceHandle: 'bottom', targetHandle: 'top',  type: 'smoothstep' },
  ],
  steps: [
    { label: 'Multiple Cache Nodes', description: 'Distributed cache splits data across multiple nodes — no single point of failure', activeNodes: ['n1', 'n2', 'n3'], animatedEdges: [], edgeColor: {} },
    { label: 'App Routes Requests', description: 'Each app server routes cache operations to the correct node using consistent hashing', activeNodes: ['app1', 'n1', 'n2'], animatedEdges: ['a1-n1', 'a1-n2'], edgeColor: { 'a1-n1': C.primary, 'a1-n2': C.primary } },
    { label: 'Consistent Hashing', description: 'The hash ring maps keys to nodes — adding/removing nodes only remaps a small fraction of keys', activeNodes: ['n2', 'ring'], animatedEdges: ['n2-r'], edgeColor: { 'n2-r': C.blue } },
    { label: 'Replication', description: 'Each node replicates its data to a replica node for high availability', activeNodes: ['n1', 'n3'], animatedEdges: ['n1-n3'], edgeColor: { 'n1-n3': C.green } },
    { label: 'Read from Any Node', description: 'App 2 can read from any available node — fault tolerant if one node fails', activeNodes: ['app2', 'n2', 'n3'], animatedEdges: ['a2-n2', 'a2-n3'], edgeColor: { 'a2-n2': C.primary, 'a2-n3': C.green } },
  ],
};


// ── 10. Cache Stampede / Penetration / Avalanche ──────────────────────────────
export const cacheFailurePatternsDef: FlowDef = {
  nodes: [
    { id: 'users', label: 'Many Users', sublabel: 'Concurrent requests',
      icon: (a) => user(a ? C.red : '#fca5a5', a ? C.redBg : '#fff5f5'),
      position: { x: 20, y: 160 }, mobilePosition: { x: 10, y: 160 } },
    { id: 'cache', label: 'Cache', sublabel: 'Miss / Empty',
      icon: (a) => cylinder(a ? C.orange : '#fdba74', a ? C.orangeBg : '#fff7ed'),
      position: { x: 230, y: 60 }, mobilePosition: { x: 170, y: 60 } },
    { id: 'db',    label: 'Database', sublabel: 'Overwhelmed',
      icon: (a) => cylinder(a ? C.red : '#fca5a5', a ? C.redBg : '#fff5f5'),
      position: { x: 230, y: 270 }, mobilePosition: { x: 170, y: 260 } },
    { id: 'fix',   label: 'Solutions', sublabel: 'Mutex / Bloom',
      icon: (a) => box(a ? C.green : '#86efac', a ? C.greenBg : '#f0fff4', 'FIX'),
      position: { x: 440, y: 160 }, mobilePosition: { x: 300, y: 160 } },
  ],
  edges: [
    { id: 'u-ch',  source: 'users', target: 'cache', label: 'all miss',  sourceHandle: 'top-s',  targetHandle: 'left',    type: 'smoothstep' },
    { id: 'u-db',  source: 'users', target: 'db',    label: 'stampede',  sourceHandle: 'bottom', targetHandle: 'left',    type: 'smoothstep' },
    { id: 'ch-db', source: 'cache', target: 'db',    label: 'miss→DB',   sourceHandle: 'bottom', targetHandle: 'top',     type: 'smoothstep' },
    { id: 'db-f',  source: 'db',    target: 'fix',   label: 'overload',  sourceHandle: 'right',  targetHandle: 'bottom-t', type: 'smoothstep' },
    { id: 'ch-f',  source: 'cache', target: 'fix',   label: 'bypass',    sourceHandle: 'right',  targetHandle: 'left',    type: 'smoothstep' },
    { id: 'f-ch',  source: 'fix',   target: 'cache', label: 'lock/bloom', sourceHandle: 'left-s', targetHandle: 'right-t', type: 'smoothstep' },
  ],
  steps: [
    { label: 'Cache Stampede', description: 'Many requests miss cache simultaneously — all hit the database at once, causing overload', activeNodes: ['users', 'cache', 'db'], animatedEdges: ['u-ch', 'ch-db', 'u-db'], edgeColor: { 'u-ch': C.red, 'ch-db': C.red, 'u-db': C.red }, nodeOverride: { db: { warn: true } } },
    { label: 'Fix: Mutex Lock', description: 'First request acquires a lock and fetches DB; others wait — prevents duplicate DB hits', activeNodes: ['fix', 'cache'], animatedEdges: ['f-ch'], edgeColor: { 'f-ch': C.green } },
    { label: 'Cache Penetration', description: 'Requests for non-existent keys always miss cache — attackers can overload DB this way', activeNodes: ['users', 'cache', 'db'], animatedEdges: ['u-ch', 'ch-db'], edgeColor: { 'u-ch': C.orange, 'ch-db': C.red }, nodeOverride: { cache: { miss: true } } },
    { label: 'Fix: Bloom Filter', description: 'Bloom filter checks if key CAN exist before hitting DB — blocks invalid key lookups', activeNodes: ['fix', 'cache'], animatedEdges: ['ch-f', 'f-ch'], edgeColor: { 'ch-f': C.orange, 'f-ch': C.green } },
    { label: 'Cache Avalanche', description: 'Many cache keys expire at the same time — sudden DB flood. Fix: randomize TTLs', activeNodes: ['cache', 'db', 'fix'], animatedEdges: ['ch-db', 'db-f'], edgeColor: { 'ch-db': C.red, 'db-f': C.orange } },
  ],
};

// ── Index map: module title → FlowDef ─────────────────────────────────────────
export const cachingFlowMap: Record<string, FlowDef> = {
  'Cache Architecture':                   cacheArchitectureDef,
  'Cache-Aside Pattern':                  cacheAsidePatternDef,
  'Read/Write Strategies':                readWriteStrategiesDef,
  'Eviction (LRU/LFU/TTL)':              evictionDef,
  'Cache Invalidation':                   cacheInvalidationDef,
  'Cache Consistency':                    cacheConsistencyDef,
  'Redis':                                redisDef,
  'Distributed Cache':                    distributedCacheDef,
  'Cache Stampede / Penetration / Avalanche': cacheFailurePatternsDef,
};
