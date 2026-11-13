import React from 'react';
import { C, type FlowDef } from '../HLDFlow';

// ── SVG helpers ───────────────────────────────────────────────────────────────
const box  = (c: string, bg: string, t: string) => <svg width="32" height="28" viewBox="0 0 48 40" fill="none"><rect x="4" y="4" width="40" height="32" rx="6" fill={bg} stroke={c} strokeWidth="2"/><text x="24" y="24" textAnchor="middle" fontSize="9" fontWeight="700" fill={c}>{t}</text></svg>;
const srv  = (c: string, bg: string) => <svg width="32" height="32" viewBox="0 0 48 48" fill="none"><rect x="4" y="8" width="40" height="10" rx="3" fill={c} stroke={c} strokeWidth="1.5"/><rect x="4" y="22" width="40" height="10" rx="3" fill={bg} stroke={c} strokeWidth="1.5"/><rect x="4" y="36" width="40" height="10" rx="3" fill={bg} stroke={c} strokeWidth="1.5"/><circle cx="36" cy="13" r="2" fill="white"/></svg>;
const usr  = (c: string, bg: string) => <svg width="28" height="34" viewBox="0 0 44 52" fill="none"><circle cx="22" cy="14" r="10" fill={c} stroke={c} strokeWidth="2"/><path d="M4 46c0-9.941 8.059-18 18-18s18 8.059 18 18" fill={bg} stroke={c} strokeWidth="2" strokeLinecap="round"/></svg>;
const cyl  = (c: string, bg: string) => <svg width="32" height="36" viewBox="0 0 44 52" fill="none"><ellipse cx="22" cy="10" rx="18" ry="6" fill={c} stroke={c} strokeWidth="2"/><rect x="4" y="10" width="36" height="28" fill={bg} stroke={c} strokeWidth="2"/><ellipse cx="22" cy="38" rx="18" ry="6" fill={bg} stroke={c} strokeWidth="2"/></svg>;

// ── 1. System Architecture Fundamentals ───────────────────────────────────────
export const sysArchFundamentalsDef: FlowDef = {
  nodes: [
    { id: 'req', label: 'Requirements', sublabel: 'Functional / NFR', icon: (a) => box(a?C.primary:'#C4B5FD', a?C.primaryBg:'#F5F3FF','REQ'), position:{x:30,y:160}, mobilePosition:{x:10,y:160} },
    { id: 'hld', label: 'HLD Design',   sublabel: 'Components + flow', icon: (a) => box(a?C.orange:'#fdba74', a?C.orangeBg:'#fff7ed','HLD'), position:{x:230,y:160}, mobilePosition:{x:170,y:160} },
    { id: 'lld', label: 'LLD Design',   sublabel: 'Classes + APIs',    icon: (a) => box(a?C.blue:'#93c5fd',  a?C.blueBg:'#eff6ff', 'LLD'), position:{x:430,y:160}, mobilePosition:{x:300,y:160} },
    { id: 'nfr', label: 'NFR',          sublabel: 'Scale/Perf/Avail',  icon: (a) => box(a?C.green:'#86efac', a?C.greenBg:'#f0fff4','NFR'), position:{x:230,y:30},  mobilePosition:{x:170,y:30} },
    { id: 'trd', label: 'Trade-offs',   sublabel: 'CAP / cost / ops',  icon: (a) => box(a?C.red:'#fca5a5',   a?C.redBg:'#fff5f5',  'TRD'), position:{x:230,y:300}, mobilePosition:{x:170,y:300} },
  ],
  edges: [
    { id:'r-h',  source:'req', target:'hld', label:'defines',  sourceHandle:'right',  targetHandle:'left',    type:'smoothstep' },
    { id:'h-l',  source:'hld', target:'lld', label:'refines',  sourceHandle:'right',  targetHandle:'left',    type:'smoothstep' },
    { id:'n-h',  source:'nfr', target:'hld', label:'constrains', sourceHandle:'bottom', targetHandle:'top',   type:'smoothstep' },
    { id:'h-t',  source:'hld', target:'trd', label:'reveals',  sourceHandle:'bottom', targetHandle:'top',     type:'smoothstep' },
  ],
  steps: [
    { label:'Gather Requirements', description:'Start with functional requirements (what it does) and non-functional requirements (how well it does it)', activeNodes:['req','nfr'], animatedEdges:[], edgeColor:{} },
    { label:'High-Level Design', description:'Define major components, their responsibilities, and data flow between them', activeNodes:['req','hld'], animatedEdges:['r-h'], edgeColor:{'r-h':C.primary} },
    { label:'NFRs Constrain Design', description:'Scalability, availability, latency requirements shape which components you choose', activeNodes:['nfr','hld'], animatedEdges:['n-h'], edgeColor:{'n-h':C.green} },
    { label:'Low-Level Design', description:'Drill down into API contracts, data schemas, and class designs', activeNodes:['hld','lld'], animatedEdges:['h-l'], edgeColor:{'h-l':C.blue} },
    { label:'Identify Trade-offs', description:'Every design has trade-offs — cost, complexity, consistency vs availability', activeNodes:['hld','trd'], animatedEdges:['h-t'], edgeColor:{'h-t':C.orange} },
  ],
};

// ── 2. Architectural Patterns ─────────────────────────────────────────────────
export const architecturalPatternsDef: FlowDef = {
  nodes: [
    { id:'mono', label:'Monolith',    sublabel:'Single deployable', icon:(a)=>box(a?C.orange:'#fdba74', a?C.orangeBg:'#fff7ed','MON'), position:{x:40,y:170},  mobilePosition:{x:10,y:170} },
    { id:'soa',  label:'SOA',         sublabel:'Shared services',   icon:(a)=>box(a?C.blue:'#93c5fd',   a?C.blueBg:'#eff6ff', 'SOA'), position:{x:240,y:60},  mobilePosition:{x:170,y:60} },
    { id:'ms',   label:'Microservices',sublabel:'Independent svcs', icon:(a)=>box(a?C.primary:'#C4B5FD',a?C.primaryBg:'#F5F3FF','MS'), position:{x:240,y:290}, mobilePosition:{x:170,y:280} },
    { id:'evt',  label:'Event-Driven', sublabel:'Async events',     icon:(a)=>box(a?C.green:'#86efac',  a?C.greenBg:'#f0fff4','EVT'), position:{x:440,y:170}, mobilePosition:{x:300,y:170} },
  ],
  edges: [
    { id:'m-s',  source:'mono', target:'soa', label:'evolves to', sourceHandle:'top-s',  targetHandle:'left', type:'smoothstep' },
    { id:'m-ms', source:'mono', target:'ms',  label:'breaks into', sourceHandle:'bottom', targetHandle:'left', type:'smoothstep' },
    { id:'s-e',  source:'soa',  target:'evt', label:'can use',    sourceHandle:'right',  targetHandle:'top',  type:'smoothstep' },
    { id:'ms-e', source:'ms',   target:'evt', label:'pairs with', sourceHandle:'right',  targetHandle:'bottom-t', type:'smoothstep' },
  ],
  steps: [
    { label:'Monolithic Architecture', description:'All functionality in one deployable unit — simple to start but hard to scale independently', activeNodes:['mono'], animatedEdges:[], edgeColor:{} },
    { label:'Service-Oriented (SOA)', description:'Break app into large services that communicate over enterprise buses or shared protocols', activeNodes:['mono','soa'], animatedEdges:['m-s'], edgeColor:{'m-s':C.blue} },
    { label:'Microservices', description:'Each service is small, independently deployable, owned by one team', activeNodes:['mono','ms'], animatedEdges:['m-ms'], edgeColor:{'m-ms':C.primary} },
    { label:'Event-Driven', description:'Services communicate via events (Kafka, SQS) — loosely coupled, async', activeNodes:['ms','evt'], animatedEdges:['ms-e'], edgeColor:{'ms-e':C.green} },
    { label:'Pattern Comparison', description:'Monolith: simple. SOA: organized. Microservices: scalable. Event-driven: decoupled', activeNodes:['mono','soa','ms','evt'], animatedEdges:['m-s','m-ms','ms-e'], edgeColor:{'m-s':C.blue,'m-ms':C.primary,'ms-e':C.green} },
  ],
};


// ── 3. Monolithic Architecture ────────────────────────────────────────────────
export const monolithicArchDef: FlowDef = {
  nodes: [
    { id:'ui',  label:'UI Layer',     sublabel:'Frontend',        icon:(a)=>box(a?C.primary:'#C4B5FD',a?C.primaryBg:'#F5F3FF','UI'),  position:{x:200,y:20},  mobilePosition:{x:140,y:20} },
    { id:'bl',  label:'Business Logic',sublabel:'Core app code',  icon:(a)=>box(a?C.orange:'#fdba74', a?C.orangeBg:'#fff7ed','BL'),  position:{x:200,y:150}, mobilePosition:{x:140,y:150} },
    { id:'da',  label:'Data Layer',   sublabel:'DB access',       icon:(a)=>box(a?C.green:'#86efac',  a?C.greenBg:'#f0fff4','DA'),  position:{x:200,y:280}, mobilePosition:{x:140,y:280} },
    { id:'db',  label:'Database',     sublabel:'Single DB',       icon:(a)=>cyl(a?C.green:'#86efac',  a?C.greenBg:'#f0fff4'),       position:{x:420,y:280}, mobilePosition:{x:300,y:280} },
    { id:'dep', label:'Deploy',       sublabel:'One .jar / .exe', icon:(a)=>box(a?C.blue:'#93c5fd',   a?C.blueBg:'#eff6ff','DEP'),  position:{x:420,y:150}, mobilePosition:{x:300,y:150} },
  ],
  edges: [
    { id:'u-b', source:'ui',  target:'bl',  label:'calls',   sourceHandle:'bottom', targetHandle:'top',    type:'smoothstep' },
    { id:'b-d', source:'bl',  target:'da',  label:'queries', sourceHandle:'bottom', targetHandle:'top',    type:'smoothstep' },
    { id:'d-db',source:'da',  target:'db',  label:'SQL',     sourceHandle:'right',  targetHandle:'left',   type:'smoothstep' },
    { id:'b-dp',source:'bl',  target:'dep', label:'bundles', sourceHandle:'right',  targetHandle:'left',   type:'smoothstep' },
  ],
  steps: [
    { label:'Layered Structure', description:'Monolith has UI, Business Logic, and Data layers — all inside one process', activeNodes:['ui','bl','da'], animatedEdges:['u-b','b-d'], edgeColor:{'u-b':C.primary,'b-d':C.orange} },
    { label:'Single Database', description:'All features share one database — simple but becomes a bottleneck at scale', activeNodes:['da','db'], animatedEdges:['d-db'], edgeColor:{'d-db':C.green} },
    { label:'Single Deployment', description:'Everything deploys together — one binary or container for the entire app', activeNodes:['bl','dep'], animatedEdges:['b-dp'], edgeColor:{'b-dp':C.blue} },
    { label:'Pros: Simplicity', description:'Easy to develop, test, and debug — all code in one place, no network calls between parts', activeNodes:['ui','bl','da','db'], animatedEdges:['u-b','b-d','d-db'], edgeColor:{'u-b':C.primary,'b-d':C.orange,'d-db':C.green} },
    { label:'Cons: Scale Limits', description:'Can only scale the whole app, not just the busy parts — deploy risk grows with every change', activeNodes:['dep'], animatedEdges:[], edgeColor:{}, nodeOverride:{'dep':{warn:true}} },
  ],
};

// ── 4. Client-Server Architecture ────────────────────────────────────────────
export const clientServerArchDef: FlowDef = {
  nodes: [
    { id:'c1', label:'Client 1',   sublabel:'Browser',    icon:(a)=>usr(a?C.primary:'#C4B5FD',a?C.primaryBg:'#F5F3FF'),     position:{x:20,y:60},  mobilePosition:{x:10,y:60} },
    { id:'c2', label:'Client 2',   sublabel:'Mobile App', icon:(a)=>usr(a?C.primary:'#C4B5FD',a?C.primaryBg:'#F5F3FF'),     position:{x:20,y:280}, mobilePosition:{x:10,y:260} },
    { id:'lb', label:'Load Bal.',  sublabel:'Distributes', icon:(a)=>box(a?C.orange:'#fdba74',a?C.orangeBg:'#fff7ed','LB'), position:{x:230,y:170}, mobilePosition:{x:160,y:170} },
    { id:'s1', label:'Server 1',   sublabel:'App logic',  icon:(a)=>srv(a?C.primary:'#C4B5FD',a?C.primaryBg:'#F5F3FF'),     position:{x:430,y:60},  mobilePosition:{x:300,y:60} },
    { id:'s2', label:'Server 2',   sublabel:'App logic',  icon:(a)=>srv(a?C.primary:'#C4B5FD',a?C.primaryBg:'#F5F3FF'),     position:{x:430,y:280}, mobilePosition:{x:300,y:260} },
  ],
  edges: [
    { id:'c1-lb', source:'c1', target:'lb', label:'request', sourceHandle:'right', targetHandle:'left',    type:'smoothstep' },
    { id:'c2-lb', source:'c2', target:'lb', label:'request', sourceHandle:'right', targetHandle:'left-s',  type:'smoothstep' },
    { id:'lb-s1', source:'lb', target:'s1', label:'route',   sourceHandle:'top-s', targetHandle:'left',    type:'smoothstep' },
    { id:'lb-s2', source:'lb', target:'s2', label:'route',   sourceHandle:'bottom',targetHandle:'left',    type:'smoothstep' },
    { id:'s1-c1', source:'s1', target:'c1', label:'response',sourceHandle:'left-s',targetHandle:'right-t', type:'smoothstep' },
    { id:'s2-c2', source:'s2', target:'c2', label:'response',sourceHandle:'left-s',targetHandle:'right-t', type:'smoothstep' },
  ],
  steps: [
    { label:'Client Sends Request', description:'Clients (browser, mobile) send HTTP requests to the server', activeNodes:['c1','c2'], animatedEdges:[], edgeColor:{} },
    { label:'Load Balancer Routes', description:'Load balancer distributes incoming requests across multiple servers', activeNodes:['c1','c2','lb'], animatedEdges:['c1-lb','c2-lb'], edgeColor:{'c1-lb':C.primary,'c2-lb':C.primary} },
    { label:'Server Processes', description:'Server handles the request — authentication, business logic, DB queries', activeNodes:['lb','s1','s2'], animatedEdges:['lb-s1','lb-s2'], edgeColor:{'lb-s1':C.orange,'lb-s2':C.orange} },
    { label:'Response Returns', description:'Server sends the response back to the requesting client', activeNodes:['s1','s2','c1','c2'], animatedEdges:['s1-c1','s2-c2'], edgeColor:{'s1-c1':C.green,'s2-c2':C.green} },
    { label:'Stateless Design', description:'Best practice: servers are stateless — session stored in DB or cache, not server memory', activeNodes:['s1','s2'], animatedEdges:['lb-s1','lb-s2'], edgeColor:{'lb-s1':C.blue,'lb-s2':C.blue} },
  ],
};


// ── 5. System Components and Interaction ──────────────────────────────────────
export const systemComponentsDef: FlowDef = {
  nodes: [
    { id:'client', label:'Client',      sublabel:'Browser/App',     icon:(a)=>usr(a?C.primary:'#C4B5FD',a?C.primaryBg:'#F5F3FF'),     position:{x:20,y:170},  mobilePosition:{x:10,y:170} },
    { id:'api',    label:'API Gateway', sublabel:'Entry point',     icon:(a)=>box(a?C.orange:'#fdba74', a?C.orangeBg:'#fff7ed','API'), position:{x:200,y:170}, mobilePosition:{x:150,y:170} },
    { id:'svc',    label:'Services',    sublabel:'Business logic',  icon:(a)=>srv(a?C.primary:'#C4B5FD',a?C.primaryBg:'#F5F3FF'),     position:{x:380,y:60},  mobilePosition:{x:270,y:60} },
    { id:'db',     label:'Database',    sublabel:'Persistence',     icon:(a)=>cyl(a?C.green:'#86efac',  a?C.greenBg:'#f0fff4'),       position:{x:380,y:280}, mobilePosition:{x:270,y:270} },
    { id:'cache',  label:'Cache',       sublabel:'Fast reads',      icon:(a)=>cyl(a?C.blue:'#93c5fd',   a?C.blueBg:'#eff6ff'),        position:{x:560,y:170}, mobilePosition:{x:390,y:170} },
  ],
  edges: [
    { id:'cl-api', source:'client', target:'api',   label:'HTTPS',  sourceHandle:'right',  targetHandle:'left',    type:'smoothstep' },
    { id:'api-s',  source:'api',    target:'svc',   label:'route',  sourceHandle:'top-s',  targetHandle:'left',    type:'smoothstep' },
    { id:'s-db',   source:'svc',    target:'db',    label:'query',  sourceHandle:'bottom', targetHandle:'top',     type:'smoothstep' },
    { id:'s-ch',   source:'svc',    target:'cache', label:'read',   sourceHandle:'right',  targetHandle:'left',    type:'smoothstep' },
    { id:'api-cl', source:'api',    target:'client',label:'respond',sourceHandle:'left-s', targetHandle:'right-t', type:'smoothstep' },
    { id:'db-s',   source:'db',     target:'svc',   label:'data',   sourceHandle:'top-s',  targetHandle:'bottom',  type:'smoothstep' },
  ],
  steps: [
    { label:'Client Request', description:'Client sends request to API Gateway over HTTPS', activeNodes:['client','api'], animatedEdges:['cl-api'], edgeColor:{'cl-api':C.primary} },
    { label:'API Routing', description:'API Gateway authenticates, rate-limits, and routes to the right service', activeNodes:['api','svc'], animatedEdges:['api-s'], edgeColor:{'api-s':C.orange} },
    { label:'Cache Check', description:'Service checks cache first for frequently read data', activeNodes:['svc','cache'], animatedEdges:['s-ch'], edgeColor:{'s-ch':C.blue} },
    { label:'Database Query', description:'On cache miss, service queries the database', activeNodes:['svc','db'], animatedEdges:['s-db','db-s'], edgeColor:{'s-db':C.green,'db-s':C.green} },
    { label:'Response', description:'API Gateway returns the final response to the client', activeNodes:['api','client'], animatedEdges:['api-cl'], edgeColor:{'api-cl':C.green} },
  ],
};

// ── 6. Service Communication ──────────────────────────────────────────────────
export const serviceCommunicationDef: FlowDef = {
  nodes: [
    { id:'svcA', label:'Service A', sublabel:'Caller',           icon:(a)=>srv(a?C.primary:'#C4B5FD',a?C.primaryBg:'#F5F3FF'),     position:{x:20,y:160},  mobilePosition:{x:10,y:160} },
    { id:'rest', label:'REST',      sublabel:'HTTP sync',         icon:(a)=>box(a?C.blue:'#93c5fd',  a?C.blueBg:'#eff6ff', 'REST'),position:{x:240,y:40},  mobilePosition:{x:170,y:40} },
    { id:'grpc', label:'gRPC',      sublabel:'Binary sync',       icon:(a)=>box(a?C.orange:'#fdba74',a?C.orangeBg:'#fff7ed','gRPC'),position:{x:240,y:160}, mobilePosition:{x:170,y:160} },
    { id:'mq',   label:'Msg Queue', sublabel:'Async events',      icon:(a)=>box(a?C.green:'#86efac',a?C.greenBg:'#f0fff4', 'MQ'),  position:{x:240,y:280}, mobilePosition:{x:170,y:280} },
    { id:'svcB', label:'Service B', sublabel:'Receiver',          icon:(a)=>srv(a?C.green:'#86efac', a?C.greenBg:'#f0fff4'),       position:{x:450,y:160}, mobilePosition:{x:310,y:160} },
  ],
  edges: [
    { id:'a-rest', source:'svcA', target:'rest', label:'HTTP',  sourceHandle:'top-s',  targetHandle:'left', type:'smoothstep' },
    { id:'a-grpc', source:'svcA', target:'grpc', label:'proto', sourceHandle:'right',  targetHandle:'left', type:'smoothstep' },
    { id:'a-mq',   source:'svcA', target:'mq',   label:'pub',   sourceHandle:'bottom', targetHandle:'left', type:'smoothstep' },
    { id:'rest-b', source:'rest', target:'svcB', label:'call',  sourceHandle:'right',  targetHandle:'top',  type:'smoothstep' },
    { id:'grpc-b', source:'grpc', target:'svcB', label:'call',  sourceHandle:'right',  targetHandle:'left', type:'smoothstep' },
    { id:'mq-b',   source:'mq',   target:'svcB', label:'sub',   sourceHandle:'right',  targetHandle:'bottom-t', type:'smoothstep' },
  ],
  steps: [
    { label:'REST (Synchronous)', description:'Service A calls Service B via HTTP REST — simple, universal, but caller waits for response', activeNodes:['svcA','rest','svcB'], animatedEdges:['a-rest','rest-b'], edgeColor:{'a-rest':C.blue,'rest-b':C.blue} },
    { label:'gRPC (High Performance)', description:'Binary protocol over HTTP/2 — faster than REST, strongly typed, good for internal services', activeNodes:['svcA','grpc','svcB'], animatedEdges:['a-grpc','grpc-b'], edgeColor:{'a-grpc':C.orange,'grpc-b':C.orange} },
    { label:'Message Queue (Async)', description:'Service A publishes an event to a queue — Service B consumes it when ready, no blocking', activeNodes:['svcA','mq','svcB'], animatedEdges:['a-mq','mq-b'], edgeColor:{'a-mq':C.green,'mq-b':C.green} },
    { label:'Sync vs Async', description:'Synchronous: simple but tight coupling. Async: decoupled and resilient but harder to debug', activeNodes:['rest','grpc','mq'], animatedEdges:['a-rest','a-grpc','a-mq'], edgeColor:{'a-rest':C.blue,'a-grpc':C.orange,'a-mq':C.green} },
    { label:'Choosing Protocol', description:'REST for external APIs, gRPC for internal microservices, Message Queue for async workflows', activeNodes:['svcA','svcB'], animatedEdges:['a-rest','a-grpc','a-mq'], edgeColor:{'a-rest':C.blue,'a-grpc':C.orange,'a-mq':C.green} },
  ],
};


// ── 7. Architecture Design Principles ────────────────────────────────────────
export const archDesignPrinciplesDef: FlowDef = {
  nodes: [
    { id:'sep', label:'Separation of Concerns', sublabel:'Each part does one thing', icon:(a)=>box(a?C.primary:'#C4B5FD',a?C.primaryBg:'#F5F3FF','SoC'), position:{x:30,y:50},  mobilePosition:{x:10,y:50} },
    { id:'sca', label:'Scalability',           sublabel:'Grows with load',          icon:(a)=>box(a?C.orange:'#fdba74', a?C.orangeBg:'#fff7ed','SCA'), position:{x:30,y:200}, mobilePosition:{x:10,y:200} },
    { id:'rel', label:'Reliability',           sublabel:'Survives failures',         icon:(a)=>box(a?C.green:'#86efac', a?C.greenBg:'#f0fff4', 'REL'), position:{x:280,y:50},  mobilePosition:{x:190,y:50} },
    { id:'obs', label:'Observability',         sublabel:'Logs, metrics, traces',     icon:(a)=>box(a?C.blue:'#93c5fd',  a?C.blueBg:'#eff6ff',  'OBS'), position:{x:280,y:200}, mobilePosition:{x:190,y:200} },
    { id:'sys', label:'Balanced System',       sublabel:'All principles applied',    icon:(a)=>box(a?C.red:'#fca5a5',   a?C.redBg:'#fff5f5',   'SYS'), position:{x:470,y:130}, mobilePosition:{x:320,y:130} },
  ],
  edges: [
    { id:'sp-s', source:'sep', target:'sys', label:'enables',  sourceHandle:'right',  targetHandle:'top',      type:'smoothstep' },
    { id:'sc-s', source:'sca', target:'sys', label:'enables',  sourceHandle:'right',  targetHandle:'bottom-t', type:'smoothstep' },
    { id:'r-s',  source:'rel', target:'sys', label:'strengthens', sourceHandle:'right',targetHandle:'top',     type:'smoothstep' },
    { id:'o-s',  source:'obs', target:'sys', label:'monitors', sourceHandle:'right',  targetHandle:'bottom-t', type:'smoothstep' },
  ],
  steps: [
    { label:'Separation of Concerns', description:'Each component has one clear responsibility — UI, business logic, data access are separate', activeNodes:['sep'], animatedEdges:[], edgeColor:{} },
    { label:'Scalability', description:'Design so components can scale independently — horizontal scaling, statelessness, caching', activeNodes:['sca'], animatedEdges:[], edgeColor:{} },
    { label:'Reliability', description:'Build for failure — redundancy, retries, circuit breakers, graceful degradation', activeNodes:['rel'], animatedEdges:[], edgeColor:{} },
    { label:'Observability', description:'You cannot fix what you cannot see — logs, metrics, and distributed traces are essential', activeNodes:['obs'], animatedEdges:[], edgeColor:{} },
    { label:'Balanced System', description:'Great architecture applies all principles — none sacrificed, all trade-offs documented', activeNodes:['sep','sca','rel','obs','sys'], animatedEdges:['sp-s','sc-s','r-s','o-s'], edgeColor:{'sp-s':C.primary,'sc-s':C.orange,'r-s':C.green,'o-s':C.blue} },
  ],
};

// ── 8. Architecture Decision-Making ──────────────────────────────────────────
export const archDecisionMakingDef: FlowDef = {
  nodes: [
    { id:'prob', label:'Problem',   sublabel:'Define clearly',     icon:(a)=>box(a?C.red:'#fca5a5',   a?C.redBg:'#fff5f5',   'PRB'), position:{x:30,y:170},  mobilePosition:{x:10,y:170} },
    { id:'opt',  label:'Options',   sublabel:'List alternatives',  icon:(a)=>box(a?C.orange:'#fdba74',a?C.orangeBg:'#fff7ed','OPT'), position:{x:230,y:60},  mobilePosition:{x:160,y:60} },
    { id:'trd',  label:'Trade-offs',sublabel:'Cost/complexity',    icon:(a)=>box(a?C.blue:'#93c5fd',  a?C.blueBg:'#eff6ff', 'TRD'), position:{x:230,y:280}, mobilePosition:{x:160,y:280} },
    { id:'adr',  label:'ADR',       sublabel:'Decision record',    icon:(a)=>box(a?C.green:'#86efac', a?C.greenBg:'#f0fff4','ADR'), position:{x:430,y:170}, mobilePosition:{x:300,y:170} },
  ],
  edges: [
    { id:'p-o',  source:'prob', target:'opt', label:'generates', sourceHandle:'top-s',  targetHandle:'left',  type:'smoothstep' },
    { id:'p-t',  source:'prob', target:'trd', label:'reveals',   sourceHandle:'bottom', targetHandle:'left',  type:'smoothstep' },
    { id:'o-a',  source:'opt',  target:'adr', label:'chosen',    sourceHandle:'right',  targetHandle:'top',   type:'smoothstep' },
    { id:'t-a',  source:'trd',  target:'adr', label:'documented',sourceHandle:'right',  targetHandle:'bottom-t', type:'smoothstep' },
  ],
  steps: [
    { label:'Define the Problem', description:'What specific problem are you solving? Who is affected? What are the constraints?', activeNodes:['prob'], animatedEdges:[], edgeColor:{} },
    { label:'Enumerate Options', description:'List at least 2-3 architectural options — do not jump to the first idea', activeNodes:['prob','opt'], animatedEdges:['p-o'], edgeColor:{'p-o':C.orange} },
    { label:'Evaluate Trade-offs', description:'For each option: performance, cost, complexity, operational overhead, team skill fit', activeNodes:['prob','trd'], animatedEdges:['p-t'], edgeColor:{'p-t':C.blue} },
    { label:'Architecture Decision Record', description:'Document WHY you chose this option, what you rejected, and what the risks are — ADR format', activeNodes:['opt','trd','adr'], animatedEdges:['o-a','t-a'], edgeColor:{'o-a':C.green,'t-a':C.green} },
    { label:'Review and Revisit', description:'Architecture decisions are not permanent — revisit when scale, team, or requirements change', activeNodes:['adr'], animatedEdges:[], edgeColor:{}, nodeOverride:{'adr':{hit:true}} },
  ],
};


// ── 9. Reliability and Fault-Tolerant Architecture ───────────────────────────
export const reliabilityArchDef: FlowDef = {
  nodes: [
    { id:'client', label:'Client',      sublabel:'Request',      icon:(a)=>usr(a?C.primary:'#C4B5FD',a?C.primaryBg:'#F5F3FF'),     position:{x:20,y:170},  mobilePosition:{x:10,y:170} },
    { id:'lb',     label:'Load Bal.',   sublabel:'No SPOF',      icon:(a)=>box(a?C.orange:'#fdba74',a?C.orangeBg:'#fff7ed','LB'),  position:{x:200,y:170}, mobilePosition:{x:150,y:170} },
    { id:'s1',     label:'Server 1',    sublabel:'Primary',      icon:(a)=>srv(a?C.primary:'#C4B5FD',a?C.primaryBg:'#F5F3FF'),     position:{x:390,y:60},  mobilePosition:{x:270,y:60} },
    { id:'s2',     label:'Server 2',    sublabel:'Replica',      icon:(a)=>srv(a?C.green:'#86efac',  a?C.greenBg:'#f0fff4'),       position:{x:390,y:280}, mobilePosition:{x:270,y:270} },
    { id:'cb',     label:'Circuit Breaker',sublabel:'Protects',  icon:(a)=>box(a?C.red:'#fca5a5',  a?C.redBg:'#fff5f5',   'CB'), position:{x:560,y:170}, mobilePosition:{x:390,y:170} },
  ],
  edges: [
    { id:'cl-lb', source:'client', target:'lb', label:'request',   sourceHandle:'right',  targetHandle:'left',    type:'smoothstep' },
    { id:'lb-s1', source:'lb',     target:'s1', label:'primary',   sourceHandle:'top-s',  targetHandle:'left',    type:'smoothstep' },
    { id:'lb-s2', source:'lb',     target:'s2', label:'failover',  sourceHandle:'bottom', targetHandle:'left',    type:'smoothstep' },
    { id:'s1-cb', source:'s1',     target:'cb', label:'check',     sourceHandle:'right',  targetHandle:'top',     type:'smoothstep' },
    { id:'s2-cb', source:'s2',     target:'cb', label:'check',     sourceHandle:'right',  targetHandle:'bottom-t',type:'smoothstep' },
    { id:'lb-cl', source:'lb',     target:'client', label:'respond',sourceHandle:'left-s',targetHandle:'right-t', type:'smoothstep' },
  ],
  steps: [
    { label:'Eliminate Single Points of Failure', description:'Every component must have a redundant copy — load balancer, servers, databases', activeNodes:['lb','s1','s2'], animatedEdges:[], edgeColor:{} },
    { label:'Load Balancer Routes Traffic', description:'LB distributes requests across healthy servers — detects and skips failed ones', activeNodes:['client','lb'], animatedEdges:['cl-lb'], edgeColor:{'cl-lb':C.primary} },
    { label:'Primary and Failover', description:'Primary server handles requests; if it fails, LB routes to the replica instantly', activeNodes:['lb','s1','s2'], animatedEdges:['lb-s1','lb-s2'], edgeColor:{'lb-s1':C.primary,'lb-s2':C.orange} },
    { label:'Circuit Breaker', description:'Detects when a downstream service is failing — stops requests to give it time to recover', activeNodes:['s1','s2','cb'], animatedEdges:['s1-cb','s2-cb'], edgeColor:{'s1-cb':C.red,'s2-cb':C.red} },
    { label:'Fault-Tolerant Response', description:'Even if one server is down, client gets a response with no visible failure', activeNodes:['lb','client'], animatedEdges:['lb-cl'], edgeColor:{'lb-cl':C.green} },
  ],
};

// ── 10. HLD Design Process and Architecture Diagrams ─────────────────────────
export const hldDesignProcessDef: FlowDef = {
  nodes: [
    { id:'req',  label:'Requirements', sublabel:'Step 1',      icon:(a)=>box(a?C.primary:'#C4B5FD',a?C.primaryBg:'#F5F3FF','1'), position:{x:20,y:170},  mobilePosition:{x:10,y:170} },
    { id:'est',  label:'Estimation',   sublabel:'Step 2',      icon:(a)=>box(a?C.orange:'#fdba74', a?C.orangeBg:'#fff7ed', '2'), position:{x:170,y:170}, mobilePosition:{x:120,y:170} },
    { id:'hld',  label:'HLD Draft',    sublabel:'Step 3',      icon:(a)=>box(a?C.blue:'#93c5fd',   a?C.blueBg:'#eff6ff',   '3'), position:{x:320,y:170}, mobilePosition:{x:230,y:170} },
    { id:'deep', label:'Deep Dive',    sublabel:'Step 4',      icon:(a)=>box(a?C.green:'#86efac',  a?C.greenBg:'#f0fff4',  '4'), position:{x:470,y:170}, mobilePosition:{x:340,y:170} },
    { id:'trd',  label:'Trade-offs',   sublabel:'Step 5',      icon:(a)=>box(a?C.red:'#fca5a5',    a?C.redBg:'#fff5f5',    '5'), position:{x:320,y:300}, mobilePosition:{x:230,y:300} },
  ],
  edges: [
    { id:'r-e',  source:'req',  target:'est',  label:'scale?',  sourceHandle:'right',  targetHandle:'left',    type:'smoothstep' },
    { id:'e-h',  source:'est',  target:'hld',  label:'design',  sourceHandle:'right',  targetHandle:'left',    type:'smoothstep' },
    { id:'h-d',  source:'hld',  target:'deep', label:'drill',   sourceHandle:'right',  targetHandle:'left',    type:'smoothstep' },
    { id:'h-t',  source:'hld',  target:'trd',  label:'evaluate',sourceHandle:'bottom', targetHandle:'top',     type:'smoothstep' },
    { id:'d-t',  source:'deep', target:'trd',  label:'refine',  sourceHandle:'bottom', targetHandle:'right-t', type:'smoothstep' },
  ],
  steps: [
    { label:'Step 1: Gather Requirements', description:'Clarify functional requirements, NFRs, scale, and constraints before drawing anything', activeNodes:['req'], animatedEdges:[], edgeColor:{} },
    { label:'Step 2: Capacity Estimation', description:'Estimate QPS, storage, bandwidth — sets the scale for your design decisions', activeNodes:['req','est'], animatedEdges:['r-e'], edgeColor:{'r-e':C.primary} },
    { label:'Step 3: Draft HLD', description:'Draw the high-level diagram — major components, APIs, data flows, storage choices', activeNodes:['est','hld'], animatedEdges:['e-h'], edgeColor:{'e-h':C.blue} },
    { label:'Step 4: Deep Dive', description:'Interviewers pick one component to explore — walk through the most critical or complex part', activeNodes:['hld','deep'], animatedEdges:['h-d'], edgeColor:{'h-d':C.green} },
    { label:'Step 5: Trade-offs', description:'Discuss what you would do differently at 10x scale, failure scenarios, and simplifications you made', activeNodes:['hld','trd','deep'], animatedEdges:['h-t','d-t'], edgeColor:{'h-t':C.orange,'d-t':C.orange} },
  ],
};

// ── Index map ─────────────────────────────────────────────────────────────────
export const systemArchFlowMap: Record<string, FlowDef> = {
  'System Architecture Fundamentals': sysArchFundamentalsDef,
  'Architectural Patterns':           architecturalPatternsDef,
  'Monolithic Architecture':          monolithicArchDef,
  'Client-Server Architecture':       clientServerArchDef,
  'System Components and Interaction':systemComponentsDef,
  'Service Communication':            serviceCommunicationDef,
  'Architecture Design Principles':   archDesignPrinciplesDef,
  'Architecture Decision-Making':     archDecisionMakingDef,
  'Reliability and Fault-Tolerant Architecture': reliabilityArchDef,
  'HLD Design Process and Architecture Diagrams': hldDesignProcessDef,
};
