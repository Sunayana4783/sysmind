import React from 'react';
import { C, type FlowDef } from '../HLDFlow';

const box = (c: string, bg: string, t: string) => <svg width="32" height="28" viewBox="0 0 48 40" fill="none"><rect x="4" y="4" width="40" height="32" rx="6" fill={bg} stroke={c} strokeWidth="2"/><text x="24" y="24" textAnchor="middle" fontSize="9" fontWeight="700" fill={c}>{t}</text></svg>;
const srv = (c: string, bg: string) => <svg width="32" height="32" viewBox="0 0 48 48" fill="none"><rect x="4" y="8" width="40" height="10" rx="3" fill={c} stroke={c} strokeWidth="1.5"/><rect x="4" y="22" width="40" height="10" rx="3" fill={bg} stroke={c} strokeWidth="1.5"/><rect x="4" y="36" width="40" height="10" rx="3" fill={bg} stroke={c} strokeWidth="1.5"/><circle cx="36" cy="13" r="2" fill="white"/></svg>;
const usr = (c: string, bg: string) => <svg width="28" height="34" viewBox="0 0 44 52" fill="none"><circle cx="22" cy="14" r="10" fill={c} stroke={c} strokeWidth="2"/><path d="M4 46c0-9.941 8.059-18 18-18s18 8.059 18 18" fill={bg} stroke={c} strokeWidth="2" strokeLinecap="round"/></svg>;

export const rtFundamentalsDef: FlowDef = {
  nodes: [
    { id:'src',  label:'Data Source',sublabel:'Events happen',    icon:(a)=>srv(a?C.primary:'#C4B5FD',a?C.primaryBg:'#F5F3FF'),     position:{x:20,y:170},  mobilePosition:{x:10,y:170} },
    { id:'proc', label:'Processing', sublabel:'<100ms latency',  icon:(a)=>box(a?C.orange:'#fdba74',a?C.orangeBg:'#fff7ed','PROC'), position:{x:240,y:170}, mobilePosition:{x:160,y:170} },
    { id:'usr',  label:'User',       sublabel:'Sees update now', icon:(a)=>usr(a?C.green:'#86efac', a?C.greenBg:'#f0fff4'),         position:{x:450,y:170}, mobilePosition:{x:310,y:170} },
    { id:'ws',   label:'WebSocket',  sublabel:'Persistent conn', icon:(a)=>box(a?C.blue:'#93c5fd', a?C.blueBg:'#eff6ff', 'WS'),   position:{x:240,y:30},  mobilePosition:{x:160,y:30} },
  ],
  edges: [
    { id:'s-p',  source:'src',  target:'proc',label:'event',      sourceHandle:'right',  targetHandle:'left',    type:'smoothstep' },
    { id:'p-u',  source:'proc', target:'usr', label:'push update',sourceHandle:'right',  targetHandle:'left',    type:'smoothstep' },
    { id:'s-ws', source:'src',  target:'ws',  label:'stream',     sourceHandle:'top-s',  targetHandle:'left',    type:'smoothstep' },
    { id:'ws-u', source:'ws',   target:'usr', label:'real-time',  sourceHandle:'right',  targetHandle:'top',     type:'smoothstep' },
  ],
  steps: [
    { label:'Real-Time = Low Latency', description:'Real-time systems respond within milliseconds — stock tickers, live chat, gaming, IoT dashboards', activeNodes:['src','proc'], animatedEdges:['s-p'], edgeColor:{'s-p':C.primary} },
    { label:'Push vs Pull', description:'Traditional HTTP: client polls every few seconds. Real-time: server PUSHES updates immediately', activeNodes:['proc','usr'], animatedEdges:['p-u'], edgeColor:{'p-u':C.green} },
    { label:'WebSocket Connection', description:'Persistent bidirectional TCP connection — both server and client can send at any time', activeNodes:['src','ws'], animatedEdges:['s-ws'], edgeColor:{'s-ws':C.blue} },
    { label:'User Sees Update Instantly', description:'Message sent → WebSocket delivers to all connected clients in <50ms', activeNodes:['ws','usr'], animatedEdges:['ws-u'], edgeColor:{'ws-u':C.green} },
    { label:'Use Cases', description:'Chat, live sports scores, collaborative editing, real-time analytics dashboards, notifications', activeNodes:['src','proc','usr'], animatedEdges:['s-p','p-u'], edgeColor:{'s-p':C.primary,'p-u':C.green} },
  ],
};

export const wsProtocolDef: FlowDef = {
  nodes: [
    { id:'cl',   label:'Client',    sublabel:'Browser/App',     icon:(a)=>usr(a?C.primary:'#C4B5FD',a?C.primaryBg:'#F5F3FF'),     position:{x:20,y:170},  mobilePosition:{x:10,y:170} },
    { id:'ws',   label:'WebSocket', sublabel:'Bi-directional',  icon:(a)=>box(a?C.blue:'#93c5fd',  a?C.blueBg:'#eff6ff', 'WS'),  position:{x:230,y:60},  mobilePosition:{x:160,y:60} },
    { id:'sse',  label:'SSE',       sublabel:'Server push only',icon:(a)=>box(a?C.orange:'#fdba74',a?C.orangeBg:'#fff7ed','SSE'), position:{x:230,y:170}, mobilePosition:{x:160,y:170} },
    { id:'poll', label:'Long Poll', sublabel:'HTTP hold open',  icon:(a)=>box(a?C.green:'#86efac', a?C.greenBg:'#f0fff4','LP'),  position:{x:230,y:280}, mobilePosition:{x:160,y:280} },
    { id:'srv',  label:'Server',    sublabel:'Backend',         icon:(a)=>srv(a?C.green:'#86efac', a?C.greenBg:'#f0fff4'),        position:{x:450,y:170}, mobilePosition:{x:310,y:170} },
  ],
  edges: [
    { id:'cl-ws',  source:'cl', target:'ws',  label:'upgrade', sourceHandle:'top-s',  targetHandle:'left',    type:'smoothstep' },
    { id:'cl-sse', source:'cl', target:'sse', label:'GET',     sourceHandle:'right',  targetHandle:'left',    type:'smoothstep' },
    { id:'cl-lp',  source:'cl', target:'poll',label:'GET hold',sourceHandle:'bottom', targetHandle:'left',    type:'smoothstep' },
    { id:'ws-s',   source:'ws', target:'srv', label:'msgs ↕',  sourceHandle:'right',  targetHandle:'top',     type:'smoothstep' },
    { id:'sse-s',  source:'sse',target:'srv', label:'events ↓',sourceHandle:'right',  targetHandle:'left',    type:'smoothstep' },
    { id:'lp-s',   source:'poll',target:'srv',label:'wait→resp',sourceHandle:'right', targetHandle:'bottom-t',type:'smoothstep' },
  ],
  steps: [
    { label:'WebSocket: Full Duplex', description:'Client upgrades HTTP to WS — persistent TCP, server and client both send anytime. Best for chat/gaming', activeNodes:['cl','ws','srv'], animatedEdges:['cl-ws','ws-s'], edgeColor:{'cl-ws':C.blue,'ws-s':C.blue} },
    { label:'SSE: Server Push', description:'Client opens one HTTP stream — server pushes events down. Client cannot send back (HTTP). Good for live feeds', activeNodes:['cl','sse','srv'], animatedEdges:['cl-sse','sse-s'], edgeColor:{'cl-sse':C.orange,'sse-s':C.orange} },
    { label:'Long Polling: Fake Push', description:'Client holds HTTP request open — server responds when data is ready, client immediately re-opens', activeNodes:['cl','poll','srv'], animatedEdges:['cl-lp','lp-s'], edgeColor:{'cl-lp':C.green,'lp-s':C.green} },
    { label:'Comparison', description:'WS: best for bi-directional. SSE: simpler for push-only. Long Poll: works everywhere, higher overhead', activeNodes:['ws','sse','poll'], animatedEdges:[], edgeColor:{} },
    { label:'Choose Based on Need', description:'Chat → WebSocket. Live news feed → SSE. Fallback for old browsers → Long Polling', activeNodes:['cl','ws','sse','poll'], animatedEdges:['cl-ws','cl-sse','cl-lp'], edgeColor:{'cl-ws':C.blue,'cl-sse':C.orange,'cl-lp':C.green} },
  ],
};

export const streamProcessingDef: FlowDef = {
  nodes: [
    { id:'src',  label:'Event Source',sublabel:'Kafka topic',    icon:(a)=>srv(a?C.primary:'#C4B5FD',a?C.primaryBg:'#F5F3FF'),     position:{x:20,y:170},  mobilePosition:{x:10,y:170} },
    { id:'str',  label:'Stream Proc.',sublabel:'Flink/Kafka Str',icon:(a)=>box(a?C.orange:'#fdba74',a?C.orangeBg:'#fff7ed','STR'), position:{x:230,y:170}, mobilePosition:{x:160,y:170} },
    { id:'win',  label:'Window',      sublabel:'5-min tumbling', icon:(a)=>box(a?C.blue:'#93c5fd', a?C.blueBg:'#eff6ff','WIN'),   position:{x:430,y:60},  mobilePosition:{x:300,y:60} },
    { id:'out',  label:'Output',      sublabel:'Dashboard/DB',   icon:(a)=>box(a?C.green:'#86efac',a?C.greenBg:'#f0fff4','OUT'),  position:{x:430,y:280}, mobilePosition:{x:300,y:280} },
  ],
  edges: [
    { id:'s-st',  source:'src', target:'str',label:'events',   sourceHandle:'right',  targetHandle:'left',    type:'smoothstep' },
    { id:'st-w',  source:'str', target:'win',label:'aggregate',sourceHandle:'top-s',  targetHandle:'left',    type:'smoothstep' },
    { id:'st-o',  source:'str', target:'out',label:'result',   sourceHandle:'bottom', targetHandle:'left',    type:'smoothstep' },
    { id:'w-o',   source:'win', target:'out',label:'window agg',sourceHandle:'bottom',targetHandle:'top',    type:'smoothstep' },
  ],
  steps: [
    { label:'Continuous Event Stream', description:'Events flow continuously from Kafka — clicks, transactions, sensor readings, log lines', activeNodes:['src','str'], animatedEdges:['s-st'], edgeColor:{'s-st':C.primary} },
    { label:'Stream Processor', description:'Flink or Kafka Streams processes events in-flight — filter, transform, enrich, aggregate', activeNodes:['str'], animatedEdges:[], edgeColor:{} },
    { label:'Windowing', description:'Group events into time windows — tumbling (5-min buckets), sliding (5-min window every 1-min)', activeNodes:['str','win'], animatedEdges:['st-w'], edgeColor:{'st-w':C.blue} },
    { label:'Window Aggregation', description:'Count events, sum values, find max/min within each time window', activeNodes:['win','out'], animatedEdges:['w-o'], edgeColor:{'w-o':C.green} },
    { label:'Output to Dashboard', description:'Results written to dashboard, DB, or another Kafka topic — real-time metrics visible immediately', activeNodes:['str','out'], animatedEdges:['st-o'], edgeColor:{'st-o':C.green} },
  ],
};

export const kafkaEventStreamingDef: FlowDef = {
  nodes: [
    { id:'prod', label:'Producers',  sublabel:'Publish events',   icon:(a)=>srv(a?C.primary:'#C4B5FD',a?C.primaryBg:'#F5F3FF'),     position:{x:20,y:170},  mobilePosition:{x:10,y:170} },
    { id:'top',  label:'Kafka Topic',sublabel:'Partitioned log',  icon:(a)=>box(a?C.orange:'#fdba74',a?C.orangeBg:'#fff7ed','TOP'), position:{x:230,y:170}, mobilePosition:{x:160,y:170} },
    { id:'cg1',  label:'Consumer A', sublabel:'Analytics',        icon:(a)=>srv(a?C.blue:'#93c5fd',  a?C.blueBg:'#eff6ff'),         position:{x:450,y:60},  mobilePosition:{x:300,y:60} },
    { id:'cg2',  label:'Consumer B', sublabel:'Search Indexer',   icon:(a)=>srv(a?C.green:'#86efac', a?C.greenBg:'#f0fff4'),        position:{x:450,y:280}, mobilePosition:{x:300,y:280} },
  ],
  edges: [
    { id:'p-t',  source:'prod', target:'top', label:'publish', sourceHandle:'right',  targetHandle:'left',    type:'smoothstep' },
    { id:'t-c1', source:'top',  target:'cg1', label:'consume', sourceHandle:'top-s',  targetHandle:'left',    type:'smoothstep' },
    { id:'t-c2', source:'top',  target:'cg2', label:'consume', sourceHandle:'bottom', targetHandle:'left',    type:'smoothstep' },
  ],
  steps: [
    { label:'Events Published to Topic', description:'Multiple producers write events to a Kafka topic — topic is a durable, ordered log', activeNodes:['prod','top'], animatedEdges:['p-t'], edgeColor:{'p-t':C.primary} },
    { label:'Independent Consumer Groups', description:'Multiple consumer groups each read ALL messages independently — no competition', activeNodes:['top','cg1','cg2'], animatedEdges:['t-c1','t-c2'], edgeColor:{'t-c1':C.blue,'t-c2':C.green} },
    { label:'Analytics Consumer', description:'Analytics service reads events to build real-time dashboards — at its own pace', activeNodes:['top','cg1'], animatedEdges:['t-c1'], edgeColor:{'t-c1':C.blue} },
    { label:'Search Indexer', description:'Search service indexes events into Elasticsearch — same events, different use case', activeNodes:['top','cg2'], animatedEdges:['t-c2'], edgeColor:{'t-c2':C.green} },
    { label:'Replay Any Time', description:'Kafka retains messages for days — reprocess entire history to build new features or fix bugs', activeNodes:['top'], animatedEdges:[], edgeColor:{}, nodeOverride:{'top':{hit:true}} },
  ],
};

export const realtimeFlowMap: Record<string, FlowDef> = {
  'Real-Time Systems Fundamentals':       rtFundamentalsDef,
  'Real-Time Communication Protocols':    wsProtocolDef,
  'Real-Time Data Processing':            streamProcessingDef,
  'Stream Processing Fundamentals':       streamProcessingDef,
  'Event Streaming Architecture':         kafkaEventStreamingDef,
  'Stream Processing Frameworks':         streamProcessingDef,
  'Real-Time Data Pipelines':             kafkaEventStreamingDef,
  'Event Time vs Processing Time':        streamProcessingDef,
  'Stream Processing Windows':            streamProcessingDef,
  'Real-Time Architectures in Practice':  kafkaEventStreamingDef,
};
