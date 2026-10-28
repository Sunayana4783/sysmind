import React, { useCallback, useEffect, useState } from 'react';
import {
  ReactFlow,
  Background,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  Handle,
  Position,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import './CacheBasicsFlow.css';

// ── Color tokens (match SysMind light theme) ──────────────────────────────────
const C = {
  primary:   '#7C5CFC',
  primaryBg: '#EEE9FF',
  border:    '#E5E0EF',
  text:      '#24212B',
  textSec:   '#716B7A',
  card:      '#ffffff',
  green:     '#22c55e',
  greenBg:   '#dcfce7',
  red:       '#DC2626',
  redBg:     '#FEE2E2',
  bg:        '#F0EEFF',
};

// ── Step definitions ──────────────────────────────────────────────────────────
// Each step declares which node IDs are "active" and which edge IDs are "animated"
const STEPS = [
  {
    label: 'Request',
    description: 'User requests data from the application server',
    activeNodes: ['user', 'server'],
    animatedEdges: ['user-server'],
    edgeColor: { 'user-server': C.primary },
    serverLabel: 'App Server',
  },
  {
    label: 'Check Cache',
    description: 'App checks Redis / Memcached before touching the database',
    activeNodes: ['server', 'cache'],
    animatedEdges: ['server-cache'],
    edgeColor: { 'server-cache': C.primary },
    serverLabel: 'App Server',
  },
  {
    label: 'Cache Hit',
    description: 'Data found in cache - returned in under 1ms',
    activeNodes: ['cache', 'server', 'user'],
    animatedEdges: ['cache-server', 'server-user'],
    edgeColor: { 'cache-server': C.green, 'server-user': C.green },
    serverLabel: 'App Server',
    cacheHit: true,
  },
  {
    label: 'Cache Miss',
    description: 'Not in cache - must query the database',
    activeNodes: ['server', 'db'],
    animatedEdges: ['server-db'],
    edgeColor: { 'server-db': C.red },
    serverLabel: 'App Server',
    cacheMiss: true,
  },
  {
    label: 'Store & Return',
    description: 'Save result in cache for next time, return to user',
    activeNodes: ['db', 'cache', 'server', 'user'],
    animatedEdges: ['db-server', 'server-cache', 'server-user'],
    edgeColor: { 'db-server': C.green, 'server-cache': C.primary, 'server-user': C.green },
    serverLabel: 'Stores in cache',
  },
];

// ── Custom Node ───────────────────────────────────────────────────────────────
interface FlowNodeData {
  label: string;
  sublabel?: string;
  icon: React.ReactNode;
  active?: boolean;
  hit?: boolean;
  miss?: boolean;
  [key: string]: unknown;
}

const FlowNode = ({ data }: { data: FlowNodeData }) => {
  const borderColor = data.miss ? C.red : data.hit ? C.green : data.active ? C.primary : C.border;
  const bg = data.miss ? C.redBg : data.hit ? C.greenBg : data.active ? C.primaryBg : C.card;
  const shadow = data.active
    ? `0 0 0 3px ${data.miss ? 'rgba(220,38,38,0.2)' : data.hit ? 'rgba(34,197,94,0.2)' : 'rgba(124,92,252,0.2)'}, 0 8px 24px rgba(124,92,252,0.15)`
    : '0 2px 8px rgba(0,0,0,0.06)';

  return (
    <>
      <Handle type="target" position={Position.Left}   style={{ opacity: 0 }} />
      <Handle type="target" position={Position.Top}    style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Right}  style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
      <div
        className={`flow-node${data.active ? ' flow-node--active' : ''}`}
        style={{ background: bg, border: `2px solid ${borderColor}`, boxShadow: shadow }}
      >
        <div className="flow-node__icon">{data.icon}</div>
        <div className="flow-node__label" style={{ color: data.active ? borderColor : C.text }}>{data.label}</div>
        {data.sublabel && (
          <div className="flow-node__sublabel" style={{ color: C.textSec }}>{data.sublabel}</div>
        )}
        {data.active && <div className="flow-node__pulse" style={{ background: borderColor }} />}
      </div>
    </>
  );
};

const nodeTypes = { flowNode: FlowNode };

// ── SVG Icons ─────────────────────────────────────────────────────────────────
const UserSVG = (active: boolean) => (
  <svg width="32" height="38" viewBox="0 0 44 52" fill="none">
    <circle cx="22" cy="14" r="10" fill={active ? C.primary : C.primaryBg} stroke={active ? C.primary : '#C4B5FD'} strokeWidth="2"/>
    <path d="M4 46c0-9.941 8.059-18 18-18s18 8.059 18 18" fill={active ? C.primaryBg : '#F5F3FF'} stroke={active ? C.primary : '#C4B5FD'} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const ServerSVG = (active: boolean) => (
  <svg width="36" height="36" viewBox="0 0 48 48" fill="none">
    <rect x="4" y="8"  width="40" height="10" rx="3" fill={active ? C.primary : C.primaryBg} stroke={active ? C.primary : '#C4B5FD'} strokeWidth="1.5"/>
    <rect x="4" y="22" width="40" height="10" rx="3" fill={active ? C.primaryBg : '#F5F3FF'} stroke={active ? C.primary : '#C4B5FD'} strokeWidth="1.5"/>
    <rect x="4" y="36" width="40" height="10" rx="3" fill={active ? C.primaryBg : '#F5F3FF'} stroke={active ? C.primary : '#C4B5FD'} strokeWidth="1.5"/>
    <circle cx="36" cy="13" r="2" fill={active ? 'white' : C.primary}/>
  </svg>
);

const CacheSVG = (active: boolean, hit?: boolean, miss?: boolean) => {
  const color = miss ? C.red : hit ? C.green : active ? C.primary : '#C4B5FD';
  const bg    = miss ? C.redBg : hit ? C.greenBg : active ? C.primaryBg : '#F9F8FF';
  return (
    <svg width="36" height="40" viewBox="0 0 48 52" fill="none">
      <ellipse cx="24" cy="10" rx="20" ry="7" fill={active ? color : bg} stroke={color} strokeWidth="2"/>
      <rect x="4" y="10" width="40" height="28" fill={bg} stroke={color} strokeWidth="2"/>
      <ellipse cx="24" cy="38" rx="20" ry="7" fill={bg} stroke={color} strokeWidth="2"/>
      {active && <line x1="14" y1="22" x2="34" y2="22" stroke={color} strokeWidth="2" strokeLinecap="round"/>}
    </svg>
  );
};

const DatabaseSVG = (active: boolean) => (
  <svg width="36" height="40" viewBox="0 0 44 52" fill="none">
    <ellipse cx="22" cy="10" rx="18" ry="6" fill={active ? '#22c55e' : '#dcfce7'} stroke={active ? '#16a34a' : '#86efac'} strokeWidth="2"/>
    <rect x="4" y="10" width="36" height="28" fill={active ? '#f0fdf4' : '#f9fffe'} stroke={active ? '#16a34a' : '#86efac'} strokeWidth="2"/>
    <ellipse cx="22" cy="38" rx="18" ry="6" fill={active ? '#dcfce7' : '#f0fff4'} stroke={active ? '#16a34a' : '#86efac'} strokeWidth="2"/>
  </svg>
);

// ── Build nodes from step ─────────────────────────────────────────────────────
function buildNodes(step: typeof STEPS[0]): Node[] {
  const isActive = (id: string) => step.activeNodes.includes(id);
  return [
    {
      id: 'user',
      type: 'flowNode',
      position: { x: 20, y: 100 },
      data: {
        label: 'User',
        sublabel: 'Browser / App',
        icon: UserSVG(isActive('user')),
        active: isActive('user'),
      },
    },
    {
      id: 'server',
      type: 'flowNode',
      position: { x: 200, y: 100 },
      data: {
        label: step.serverLabel || 'App Server',
        sublabel: 'Business logic',
        icon: ServerSVG(isActive('server')),
        active: isActive('server'),
      },
    },
    {
      id: 'cache',
      type: 'flowNode',
      position: { x: 380, y: 20 },
      data: {
        label: 'Cache',
        sublabel: step.cacheHit ? 'HIT - <1ms' : step.cacheMiss ? 'MISS' : 'Redis / Memcached',
        icon: CacheSVG(isActive('cache'), step.cacheHit, step.cacheMiss),
        active: isActive('cache'),
        hit:  !!step.cacheHit,
        miss: !!step.cacheMiss,
      },
    },
    {
      id: 'db',
      type: 'flowNode',
      position: { x: 380, y: 180 },
      data: {
        label: 'Database',
        sublabel: 'Source of truth',
        icon: DatabaseSVG(isActive('db')),
        active: isActive('db'),
      },
    },
  ];
}

// ── Build edges from step ─────────────────────────────────────────────────────
function buildEdges(step: typeof STEPS[0]): Edge[] {
  const allEdgeDefs = [
    { id: 'user-server',  source: 'user',   target: 'server', label: 'request'  },
    { id: 'server-user',  source: 'server', target: 'user',   label: 'response' },
    { id: 'server-cache', source: 'server', target: 'cache',  label: 'lookup'   },
    { id: 'cache-server', source: 'cache',  target: 'server', label: 'hit'      },
    { id: 'server-db',    source: 'server', target: 'db',     label: 'query'    },
    { id: 'db-server',    source: 'db',     target: 'server', label: 'data'     },
  ];

  return allEdgeDefs.map(def => {
    const isAnimated = step.animatedEdges.includes(def.id);
    const color = step.edgeColor?.[def.id] ?? C.border;
    return {
      id: def.id,
      source: def.source,
      target: def.target,
      label: isAnimated ? def.label : '',
      animated: isAnimated,
      style: {
        stroke: isAnimated ? color : C.border,
        strokeWidth: isAnimated ? 2.5 : 1.5,
        opacity: isAnimated ? 1 : 0.35,
      },
      labelStyle: {
        fontSize: 10,
        fontWeight: 700,
        fill: color,
      },
      labelBgStyle: {
        fill: C.bg,
        fillOpacity: 0.9,
        rx: 4,
      },
      markerEnd: isAnimated ? {
        type: MarkerType.ArrowClosed,
        color,
        width: 16,
        height: 16,
      } : {
        type: MarkerType.ArrowClosed,
        color: C.border,
        width: 12,
        height: 12,
      },
      type: 'smoothstep',
    };
  });
}

// ── Main component ────────────────────────────────────────────────────────────
interface Props {
  /** If true, show the React Flow version; if false or omitted, fall back to old animation */
  active?: boolean;
}

const CacheBasicsFlow: React.FC<Props> = () => {
  const [stepIdx, setStepIdx] = useState(0);
  const [nodes, setNodes, onNodesChange] = useNodesState(buildNodes(STEPS[0]));
  const [edges, setEdges, onEdgesChange] = useEdgesState(buildEdges(STEPS[0]));

  // Auto-play
  useEffect(() => {
    const iv = setInterval(() => setStepIdx(i => (i + 1) % STEPS.length), 2800);
    return () => clearInterval(iv);
  }, []);

  // Rebuild graph on step change
  useEffect(() => {
    setNodes(buildNodes(STEPS[stepIdx]));
    setEdges(buildEdges(STEPS[stepIdx]));
  }, [stepIdx]);

  const goTo = useCallback((i: number) => setStepIdx(i), []);

  const step = STEPS[stepIdx];

  return (
    <div className="cbf-wrapper">
      {/* ── Flow graph ────────────────────────────────────────────────── */}
      <div className="cbf-graph">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.35 }}
          panOnDrag={false}
          panOnScroll={false}
          zoomOnScroll={false}
          zoomOnPinch={false}
          zoomOnDoubleClick={false}
          preventScrolling={false}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          minZoom={1}
          maxZoom={1}
          proOptions={{ hideAttribution: true }}
        >
          <Background color={C.border} gap={20} size={1} />
        </ReactFlow>
      </div>

      {/* ── Step info bar ─────────────────────────────────────────────── */}
      <div className="cbf-info">
        <span className="cbf-info__pill">{stepIdx + 1} / {STEPS.length}</span>
        <div className="cbf-info__content">
          <span className="cbf-info__label">{step.label}</span>
          <span className="cbf-info__desc">{step.description}</span>
        </div>
      </div>

      {/* ── Prev / dots / next ────────────────────────────────────────── */}
      <div className="cbf-nav">
        <button className="cbf-nav__btn" onClick={() => goTo(stepIdx - 1)} disabled={stepIdx === 0} aria-label="Previous">
          &#8592; Prev
        </button>
        <div className="cbf-nav__dots">
          {STEPS.map((_, i) => (
            <button
              key={i}
              className={`cbf-nav__dot${i === stepIdx ? ' cbf-nav__dot--active' : ''}`}
              onClick={() => goTo(i)}
              aria-label={`Step ${i + 1}`}
            />
          ))}
        </div>
        <button className="cbf-nav__btn" onClick={() => goTo(stepIdx + 1)} disabled={stepIdx === STEPS.length - 1} aria-label="Next">
          Next &#8594;
        </button>
      </div>
    </div>
  );
};

export default CacheBasicsFlow;
