import React, { useCallback, useEffect, useState } from 'react';
import {
  ReactFlow, Background, useNodesState, useEdgesState,
  type Node, type Edge, Handle, Position, MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import './HLDFlow.css';

// ── Color tokens ──────────────────────────────────────────────────────────────
export const C = {
  primary: '#7C5CFC', primaryBg: '#EEE9FF', border: '#E5E0EF',
  text: '#24212B', textSec: '#716B7A', card: '#ffffff',
  green: '#22c55e', greenBg: '#dcfce7', red: '#DC2626', redBg: '#FEE2E2',
  orange: '#f97316', orangeBg: '#fff7ed', blue: '#3b82f6', blueBg: '#eff6ff',
  bg: '#F0EEFF',
};

// ── Step type ─────────────────────────────────────────────────────────────────
export interface FlowStep {
  label: string;
  description: string;
  activeNodes: string[];
  animatedEdges: string[];
  edgeColor?: Record<string, string>;
  nodeOverride?: Record<string, Partial<FlowNodeData>>;
}

export interface FlowNodeDef {
  id: string;
  label: string;
  sublabel?: string;
  icon: (active: boolean, override?: Partial<FlowNodeData>) => React.ReactNode;
  position: { x: number; y: number };
  mobilePosition?: { x: number; y: number };
}

export interface FlowEdgeDef {
  id: string; source: string; target: string; label: string;
  sourceHandle: string; targetHandle: string; type?: string;
}

export interface FlowDef {
  nodes: FlowNodeDef[];
  edges: FlowEdgeDef[];
  steps: FlowStep[];
}

// ── Custom node data ──────────────────────────────────────────────────────────
export interface FlowNodeData {
  label: string; sublabel?: string;
  icon: React.ReactNode; active?: boolean;
  hit?: boolean; miss?: boolean; warn?: boolean;
  [key: string]: unknown;
}

// ── Custom node component ─────────────────────────────────────────────────────
const FlowNode = ({ data }: { data: FlowNodeData }) => {
  const borderColor = data.warn ? C.orange : data.miss ? C.red : data.hit ? C.green
    : data.active ? C.primary : C.border;
  const bg = data.warn ? C.orangeBg : data.miss ? C.redBg : data.hit ? C.greenBg
    : data.active ? C.primaryBg : C.card;
  const shadow = data.active
    ? `0 0 0 3px ${data.warn ? 'rgba(249,115,22,0.2)' : data.miss ? 'rgba(220,38,38,0.2)' : data.hit ? 'rgba(34,197,94,0.2)' : 'rgba(124,92,252,0.2)'}, 0 8px 24px rgba(124,92,252,0.15)`
    : '0 2px 8px rgba(0,0,0,0.06)';

  return (
    <>
      <Handle type="target" position={Position.Left}   id="left"     style={{ opacity: 0 }} />
      <Handle type="target" position={Position.Top}    id="top"      style={{ opacity: 0 }} />
      <Handle type="target" position={Position.Right}  id="right-t"  style={{ opacity: 0 }} />
      <Handle type="target" position={Position.Bottom} id="bottom-t" style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Right}  id="right"    style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Bottom} id="bottom"   style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Left}   id="left-s"   style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Top}    id="top-s"    style={{ opacity: 0 }} />
      <div
        className={`hf-node${data.active ? ' hf-node--active' : ''}`}
        style={{ background: bg, border: `2px solid ${borderColor}`, boxShadow: shadow, cursor: 'pointer' }}
      >
        <div className="hf-node__icon">{data.icon}</div>
        <div className="hf-node__label" style={{ color: data.active ? borderColor : C.text }}>{data.label}</div>
        {data.sublabel && <div className="hf-node__sublabel">{data.sublabel}</div>}
        {data.active && <div className="hf-node__pulse" style={{ background: borderColor }} />}
        {!data.active && <div className="hf-node__tap-hint" />}
      </div>
    </>
  );
};

const nodeTypes = { hfNode: FlowNode };

// ── Build nodes ───────────────────────────────────────────────────────────────
function buildNodes(def: FlowDef, step: FlowStep, mobile: boolean): Node[] {
  return def.nodes.map(nd => {
    const active = step.activeNodes.includes(nd.id);
    const override = step.nodeOverride?.[nd.id] ?? {};
    const pos = mobile && nd.mobilePosition ? nd.mobilePosition : nd.position;
    return {
      id: nd.id, type: 'hfNode', position: pos,
      data: {
        label: nd.label, sublabel: nd.sublabel,
        icon: nd.icon(active, override),
        active, ...override,
      },
    };
  });
}

// ── Build edges ───────────────────────────────────────────────────────────────
function buildEdges(def: FlowDef, step: FlowStep): Edge[] {
  return def.edges.map(ed => {
    const on = step.animatedEdges.includes(ed.id);
    const color = step.edgeColor?.[ed.id] ?? C.border;
    return {
      id: ed.id, source: ed.source, target: ed.target,
      sourceHandle: ed.sourceHandle, targetHandle: ed.targetHandle,
      label: on ? ed.label : '',
      animated: on,
      style: { stroke: on ? color : C.border, strokeWidth: on ? 2.5 : 1.5, opacity: on ? 1 : 0.3 },
      labelStyle: { fontSize: 10, fontWeight: 700, fill: color },
      labelBgStyle: { fill: C.bg, fillOpacity: 0.9, rx: 4 },
      markerEnd: { type: MarkerType.ArrowClosed, color: on ? color : C.border, width: on ? 16 : 12, height: on ? 16 : 12 },
      type: ed.type ?? 'smoothstep',
    };
  });
}

// ── Main component ────────────────────────────────────────────────────────────
interface HLDFlowProps { def: FlowDef; }

const HLDFlow: React.FC<HLDFlowProps> = ({ def }) => {
  const [stepIdx, setStepIdx] = useState(0);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [paused, setPaused] = useState(false);
  const [mobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 600);

  const handleNodeClick = useCallback((_e: React.MouseEvent, node: Node) => {
    // clicking any node pauses autoplay
    setPaused(true);
    // find next step that features this node
    const next = def.steps.findIndex((s, i) => i > stepIdx && s.activeNodes.includes(node.id));
    if (next !== -1) setStepIdx(next);
    else {
      const first = def.steps.findIndex(s => s.activeNodes.includes(node.id));
      if (first !== -1) setStepIdx(first);
    }
  }, [stepIdx, def.steps]);

  useEffect(() => {
    setNodes(buildNodes(def, def.steps[stepIdx], mobile));
    setEdges(buildEdges(def, def.steps[stepIdx]));
  }, [stepIdx, def]);

  useEffect(() => {
    if (paused) { const t = setTimeout(() => setPaused(false), 6000); return () => clearTimeout(t); }
    const iv = setInterval(() => setStepIdx(i => (i + 1) % def.steps.length), 2800);
    return () => clearInterval(iv);
  }, [paused, def.steps.length]);

  const goTo = (i: number) => { setStepIdx(i); setPaused(true); };
  const step = def.steps[stepIdx];

  return (
    <div className="hf-wrapper">
      <div className="hf-tap-hint">Tap any node to explore steps</div>
      <div className="hf-graph">
        <ReactFlow
          nodes={nodes} edges={edges}
          onNodesChange={onNodesChange} onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes} onNodeClick={handleNodeClick}
          fitView fitViewOptions={{ padding: 0.28 }}
          panOnDrag={false} panOnScroll={false}
          zoomOnScroll={false} zoomOnPinch={false} zoomOnDoubleClick={false}
          preventScrolling={false} nodesDraggable={false}
          nodesConnectable={false} elementsSelectable={false}
          minZoom={0.5} maxZoom={1}
          proOptions={{ hideAttribution: true }}
        >
          <Background color={C.border} gap={20} size={1} />
        </ReactFlow>
      </div>
      <div className="hf-info">
        <span className="hf-info__pill">{stepIdx + 1} / {def.steps.length}</span>
        <div className="hf-info__content">
          <span className="hf-info__label">{step.label}</span>
          <span className="hf-info__desc">{step.description}</span>
        </div>
      </div>
      <div className="hf-nav">
        <button className="hf-nav__btn" onClick={() => goTo(stepIdx - 1)} disabled={stepIdx === 0}>&#8592; Prev</button>
        <div className="hf-nav__dots">
          {def.steps.map((_, i) => (
            <button key={i} className={`hf-nav__dot${i === stepIdx ? ' hf-nav__dot--active' : ''}`}
              onClick={() => goTo(i)} aria-label={`Step ${i + 1}`} />
          ))}
        </div>
        <button className="hf-nav__btn" onClick={() => goTo(stepIdx + 1)} disabled={stepIdx === def.steps.length - 1}>Next &#8594;</button>
      </div>
    </div>
  );
};

export default HLDFlow;
