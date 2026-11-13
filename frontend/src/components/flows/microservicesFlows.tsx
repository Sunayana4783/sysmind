import React from 'react';
import { C, type FlowDef } from '../HLDFlow';

const box = (c: string, bg: string, t: string) => <svg width="32" height="28" viewBox="0 0 48 40" fill="none"><rect x="4" y="4" width="40" height="32" rx="6" fill={bg} stroke={c} strokeWidth="2"/><text x="24" y="24" textAnchor="middle" fontSize="9" fontWeight="700" fill={c}>{t}</text></svg>;
const srv = (c: string, bg: string) => <svg width="32" height="32" viewBox="0 0 48 48" fill="none"><rect x="4" y="8" width="40" height="10" rx="3" fill={c} stroke={c} strokeWidth="1.5"/><rect x="4" y="22" width="40" height="10" rx="3" fill={bg} stroke={c} strokeWidth="1.5"/><rect x="4" y="36" width="40" height="10" rx="3" fill={bg} stroke={c} strokeWidth="1.5"/><circle cx="36" cy="13" r="2" fill="white"/></svg>;
const usr = (c: string, bg: string) => <svg width="28" height="34" viewBox="0 0 44 52" fill="none"><circle cx="22" cy="14" r="10" fill={c} stroke={c} strokeWidth="2"/><path d="M4 46c0-9.941 8.059-18 18-18s18 8.059 18 18" fill={bg} stroke={c} strokeWidth="2" strokeLinecap="round"/></svg>;
const cyl = (c: string, bg: string) => <svg width="32" height="36" viewBox="0 0 44 52" fill="none"><ellipse cx="22" cy="10" rx="18" ry="6" fill={c} stroke={c} strokeWidth="2"/><rect x="4" y="10" width="36" height="28" fill={bg} stroke={c} strokeWidth="2"/><ellipse cx="22" cy="38" rx="18" ry="6" fill={bg} stroke={c} strokeWidth="2"/></svg>;

export const msFundamentalsDef: FlowDef = {
  nodes: [
    { id:'client', label:'Client',      sublabel:'API calls',       icon:(a)=>usr(a?C.primary:'#C4B5FD',a?C.primaryBg:'#F5F3FF'),     position:{x:20,y:170},  mobilePosition:{x:10,y:170} },
    { id:'gw',     label:'API Gateway', sublabel:'Entry point',     icon:(a)=>box(a?C.orange:'#fdba74',a?C.orangeBg:'#fff7ed','GW'),  position:{x:200,y:170}, mobilePosition:{x:140,y:170} },
    { id:'us',     label:'User Svc',    sublabel:'Owns user data',  icon:(a)=>srv(a?C.primary:'#C4B5FD',a?C.primaryBg:'#F5F3FF'),     position:{x:400,y:30},  mobilePosition:{x:270,y:30} },
    { id:'os',     label:'Order Svc',   sublabel:'Owns orders',     icon:(a)=>srv(a?C.blue:'#93c5fd',  a?C.blueBg:'#eff6ff'),         position:{x:400,y:170}, mobilePosition:{x:270,y:170} },
    { id:'ps',     label:'Payment Svc', sublabel:'Owns payments',   icon:(a)=>srv(a?C.green:'#86efac', a?C.greenBg:'#f0fff4'),        position:{x:400,y:310}, mobilePosition:{x:270,y:310} },
  ],
  edges: [
    { id:'cl-gw', source:'client', target:'gw', label:'request', sourceHandle:'right',  targetHandle:'left',    type:'smoothstep' },
    { id:'gw-us', source:'gw',     target:'us', label:'route',   sourceHandle:'top-s',  targetHandle:'left',    type:'smoothstep' },
    { id:'gw-os', source:'gw',     target:'os', label:'route',   sourceHandle:'right',  targetHandle:'left',    type:'smoothstep' },
    { id:'gw-ps', source:'gw',     target:'ps', label:'route',   sourceHandle:'bottom', targetHandle:'left',    type:'smoothstep' },
  ],
  steps: [
    { label:'Each Service is Independent', description:'User, Order, Payment services each own their data, deploy independently, scale independently', activeNodes:['us','os','ps'], animatedEdges:[], edgeColor:{} },
    { label:'Client Hits API Gateway', description:'Single entry point for clients — gateway handles routing, auth, rate limiting', activeNodes:['client','gw'], animatedEdges:['cl-gw'], edgeColor:{'cl-gw':C.primary} },
    { label:'Route to User Service', description:'API Gateway routes user-related requests to the User Service', activeNodes:['gw','us'], animatedEdges:['gw-us'], edgeColor:{'gw-us':C.primary} },
    { label:'Route to Order Service', description:'Order requests routed to Order Service — owns its own database', activeNodes:['gw','os'], animatedEdges:['gw-os'], edgeColor:{'gw-os':C.blue} },
    { label:'Independent Scaling', description:'Payment Service can scale to 10x without touching User or Order services', activeNodes:['gw','ps'], animatedEdges:['gw-ps'], edgeColor:{'gw-ps':C.green} },
  ],
};

export const monoVsMicroDef: FlowDef = {
  nodes: [
    { id:'mono', label:'Monolith',      sublabel:'One deployable',  icon:(a)=>srv(a?C.orange:'#fdba74',a?C.orangeBg:'#fff7ed'),       position:{x:30,y:170},  mobilePosition:{x:10,y:170} },
    { id:'ui',   label:'UI + Logic',    sublabel:'All in one',      icon:(a)=>box(a?C.orange:'#fdba74',a?C.orangeBg:'#fff7ed','ALL'), position:{x:230,y:60},  mobilePosition:{x:160,y:60} },
    { id:'ms1',  label:'Svc A',         sublabel:'Microservice',    icon:(a)=>srv(a?C.primary:'#C4B5FD',a?C.primaryBg:'#F5F3FF'),     position:{x:230,y:280}, mobilePosition:{x:160,y:280} },
    { id:'ms2',  label:'Svc B',         sublabel:'Microservice',    icon:(a)=>srv(a?C.blue:'#93c5fd',  a?C.blueBg:'#eff6ff'),         position:{x:430,y:170}, mobilePosition:{x:300,y:170} },
  ],
  edges: [
    { id:'m-ui', source:'mono', target:'ui',  label:'grows',    sourceHandle:'top-s',  targetHandle:'left',    type:'smoothstep' },
    { id:'m-ms', source:'mono', target:'ms1', label:'split to', sourceHandle:'bottom', targetHandle:'left',    type:'smoothstep' },
    { id:'ms1-2',source:'ms1', target:'ms2',  label:'calls',    sourceHandle:'right',  targetHandle:'bottom-t',type:'smoothstep' },
  ],
  steps: [
    { label:'Monolith: Everything Together', description:'All features in one codebase — fast to start but grows into a tangled mess', activeNodes:['mono','ui'], animatedEdges:['m-ui'], edgeColor:{'m-ui':C.orange} },
    { label:'Monolith Pain Points', description:'One slow feature slows everything. One bug brings down the whole app. Deploy everything to fix one thing', activeNodes:['ui'], animatedEdges:[], edgeColor:{}, nodeOverride:{'ui':{warn:true}} },
    { label:'Break Into Microservices', description:'Split by business capability — each service is a deployable unit with its own team and DB', activeNodes:['mono','ms1'], animatedEdges:['m-ms'], edgeColor:{'m-ms':C.primary} },
    { label:'Services Communicate', description:'Services call each other via REST or message queues — network replaces in-process calls', activeNodes:['ms1','ms2'], animatedEdges:['ms1-2'], edgeColor:{'ms1-2':C.blue} },
    { label:'Microservices Trade-offs', description:'Independent scale and deploy — but adds network latency, distributed tracing complexity, and service mesh needs', activeNodes:['ms1','ms2'], animatedEdges:[], edgeColor:{}, nodeOverride:{'ms1':{hit:true},'ms2':{hit:true}} },
  ],
};

export const msArchComponentsDef: FlowDef = {
  nodes: [
    { id:'gw',  label:'API Gateway',  sublabel:'Entry/Auth/Rate', icon:(a)=>box(a?C.orange:'#fdba74',a?C.orangeBg:'#fff7ed','GW'),  position:{x:20,y:170},  mobilePosition:{x:10,y:170} },
    { id:'sd',  label:'Service Disc.',sublabel:'Find services',   icon:(a)=>box(a?C.blue:'#93c5fd', a?C.blueBg:'#eff6ff', 'SD'),   position:{x:230,y:30},  mobilePosition:{x:160,y:30} },
    { id:'svc', label:'Service',      sublabel:'Business logic',  icon:(a)=>srv(a?C.primary:'#C4B5FD',a?C.primaryBg:'#F5F3FF'),     position:{x:230,y:170}, mobilePosition:{x:160,y:170} },
    { id:'mq',  label:'Message Bus',  sublabel:'Kafka/RabbitMQ', icon:(a)=>box(a?C.green:'#86efac',a?C.greenBg:'#f0fff4', 'MQ'),   position:{x:230,y:310}, mobilePosition:{x:160,y:310} },
    { id:'db',  label:'Own DB',       sublabel:'Per service',     icon:(a)=>cyl(a?C.green:'#86efac',a?C.greenBg:'#f0fff4'),         position:{x:450,y:170}, mobilePosition:{x:310,y:170} },
  ],
  edges: [
    { id:'gw-sd', source:'gw',  target:'sd',  label:'discover', sourceHandle:'top-s',  targetHandle:'left',    type:'smoothstep' },
    { id:'gw-sv', source:'gw',  target:'svc', label:'call',     sourceHandle:'right',  targetHandle:'left',    type:'smoothstep' },
    { id:'gw-mq', source:'gw',  target:'mq',  label:'publish',  sourceHandle:'bottom', targetHandle:'left',    type:'smoothstep' },
    { id:'sv-db', source:'svc', target:'db',  label:'own data', sourceHandle:'right',  targetHandle:'left',    type:'smoothstep' },
    { id:'sd-sv', source:'sd',  target:'svc', label:'locate',   sourceHandle:'right',  targetHandle:'top',     type:'smoothstep' },
  ],
  steps: [
    { label:'API Gateway', description:'Single entry point — handles auth, rate limiting, SSL termination, and routing to services', activeNodes:['gw'], animatedEdges:[], edgeColor:{} },
    { label:'Service Discovery', description:'Services register themselves — gateway/clients use discovery to find service endpoints dynamically', activeNodes:['gw','sd','svc'], animatedEdges:['gw-sd','sd-sv'], edgeColor:{'gw-sd':C.blue,'sd-sv':C.blue} },
    { label:'Direct Service Call', description:'Gateway routes synchronous requests directly to the target service', activeNodes:['gw','svc'], animatedEdges:['gw-sv'], edgeColor:{'gw-sv':C.primary} },
    { label:'Own Database', description:'Each service owns its database — no shared DB, ensures loose coupling', activeNodes:['svc','db'], animatedEdges:['sv-db'], edgeColor:{'sv-db':C.green} },
    { label:'Message Bus for Async', description:'Services communicate via Kafka/RabbitMQ for async events — decoupled and resilient', activeNodes:['gw','mq'], animatedEdges:['gw-mq'], edgeColor:{'gw-mq':C.orange} },
  ],
};

export const serviceDecompositionDef: FlowDef = {
  nodes: [
    { id:'dom', label:'Domain',       sublabel:'Business area',   icon:(a)=>box(a?C.primary:'#C4B5FD',a?C.primaryBg:'#F5F3FF','DOM'), position:{x:20,y:170},  mobilePosition:{x:10,y:170} },
    { id:'bc1', label:'Users BC',     sublabel:'Bounded context', icon:(a)=>box(a?C.blue:'#93c5fd',  a?C.blueBg:'#eff6ff',  'USR'), position:{x:240,y:30},  mobilePosition:{x:160,y:30} },
    { id:'bc2', label:'Orders BC',    sublabel:'Bounded context', icon:(a)=>box(a?C.orange:'#fdba74',a?C.orangeBg:'#fff7ed','ORD'), position:{x:240,y:170}, mobilePosition:{x:160,y:170} },
    { id:'bc3', label:'Payments BC',  sublabel:'Bounded context', icon:(a)=>box(a?C.green:'#86efac', a?C.greenBg:'#f0fff4', 'PAY'), position:{x:240,y:310}, mobilePosition:{x:160,y:310} },
    { id:'api', label:'API Per Svc',  sublabel:'Clear contract',  icon:(a)=>box(a?C.red:'#fca5a5',  a?C.redBg:'#fff5f5',  'API'), position:{x:450,y:170}, mobilePosition:{x:310,y:170} },
  ],
  edges: [
    { id:'d-b1', source:'dom', target:'bc1',label:'split', sourceHandle:'top-s',  targetHandle:'left',    type:'smoothstep' },
    { id:'d-b2', source:'dom', target:'bc2',label:'split', sourceHandle:'right',  targetHandle:'left',    type:'smoothstep' },
    { id:'d-b3', source:'dom', target:'bc3',label:'split', sourceHandle:'bottom', targetHandle:'left',    type:'smoothstep' },
    { id:'b1-a', source:'bc1', target:'api',label:'exposes',sourceHandle:'right', targetHandle:'top',     type:'smoothstep' },
    { id:'b2-a', source:'bc2', target:'api',label:'exposes',sourceHandle:'right', targetHandle:'left',    type:'smoothstep' },
    { id:'b3-a', source:'bc3', target:'api',label:'exposes',sourceHandle:'right', targetHandle:'bottom-t',type:'smoothstep' },
  ],
  steps: [
    { label:'Identify Business Domain', description:'Understand the full business domain before splitting — what are the main business capabilities?', activeNodes:['dom'], animatedEdges:[], edgeColor:{} },
    { label:'Find Bounded Contexts', description:'DDD: a bounded context defines the boundary where a domain model is consistent — split along these lines', activeNodes:['dom','bc1','bc2','bc3'], animatedEdges:['d-b1','d-b2','d-b3'], edgeColor:{'d-b1':C.blue,'d-b2':C.orange,'d-b3':C.green} },
    { label:'Users Bounded Context', description:'Everything about user identity, profiles, auth — owned by one team, one service', activeNodes:['bc1'], animatedEdges:['d-b1'], edgeColor:{'d-b1':C.blue} },
    { label:'Orders Bounded Context', description:'Cart, orders, fulfillment — has its own definition of User (just user_id)', activeNodes:['bc2'], animatedEdges:['d-b2'], edgeColor:{'d-b2':C.orange} },
    { label:'Each BC Exposes an API', description:'Services communicate only through well-defined APIs — internal implementation is hidden', activeNodes:['bc1','bc2','bc3','api'], animatedEdges:['b1-a','b2-a','b3-a'], edgeColor:{'b1-a':C.blue,'b2-a':C.orange,'b3-a':C.green} },
  ],
};

export const interServiceCommDef: FlowDef = {
  nodes: [
    { id:'svcA', label:'Svc A',       sublabel:'Caller',          icon:(a)=>srv(a?C.primary:'#C4B5FD',a?C.primaryBg:'#F5F3FF'),     position:{x:20,y:170},  mobilePosition:{x:10,y:170} },
    { id:'rest', label:'REST/gRPC',   sublabel:'Synchronous',     icon:(a)=>box(a?C.blue:'#93c5fd', a?C.blueBg:'#eff6ff', 'REST'),  position:{x:230,y:60},  mobilePosition:{x:160,y:60} },
    { id:'evt',  label:'Events',      sublabel:'Asynchronous',    icon:(a)=>box(a?C.green:'#86efac',a?C.greenBg:'#f0fff4', 'EVT'),  position:{x:230,y:280}, mobilePosition:{x:160,y:280} },
    { id:'svcB', label:'Svc B',       sublabel:'Receiver',        icon:(a)=>srv(a?C.green:'#86efac',a?C.greenBg:'#f0fff4'),         position:{x:450,y:170}, mobilePosition:{x:310,y:170} },
  ],
  edges: [
    { id:'a-r',  source:'svcA', target:'rest',label:'call',   sourceHandle:'top-s',  targetHandle:'left',    type:'smoothstep' },
    { id:'a-e',  source:'svcA', target:'evt', label:'publish',sourceHandle:'bottom', targetHandle:'left',    type:'smoothstep' },
    { id:'r-b',  source:'rest', target:'svcB',label:'sync',   sourceHandle:'right',  targetHandle:'top',     type:'smoothstep' },
    { id:'e-b',  source:'evt',  target:'svcB',label:'consume',sourceHandle:'right',  targetHandle:'bottom-t',type:'smoothstep' },
  ],
  steps: [
    { label:'Synchronous: REST', description:'Service A calls Service B and waits for response — simple, but couples availability', activeNodes:['svcA','rest','svcB'], animatedEdges:['a-r','r-b'], edgeColor:{'a-r':C.blue,'r-b':C.blue} },
    { label:'Synchronous: gRPC', description:'Binary protocol, strongly typed — faster than REST for high-frequency internal calls', activeNodes:['svcA','rest'], animatedEdges:['a-r'], edgeColor:{'a-r':C.orange} },
    { label:'Asynchronous: Events', description:'Service A publishes an event — Service B subscribes and processes when ready, fully decoupled', activeNodes:['svcA','evt','svcB'], animatedEdges:['a-e','e-b'], edgeColor:{'a-e':C.green,'e-b':C.green} },
    { label:'Saga Pattern', description:'Long business transactions span services using events — each step publishes next event, rollback via compensating actions', activeNodes:['evt','svcB'], animatedEdges:['e-b'], edgeColor:{'e-b':C.orange} },
    { label:'Choosing Communication', description:'REST for real-time queries, gRPC for speed-critical internal, events for workflows and cross-service state changes', activeNodes:['svcA','rest','evt','svcB'], animatedEdges:['a-r','a-e','r-b','e-b'], edgeColor:{'a-r':C.blue,'a-e':C.green,'r-b':C.blue,'e-b':C.green} },
  ],
};

export const serviceDiscoveryDef: FlowDef = {
  nodes: [
    { id:'svcA', label:'Svc A',       sublabel:'Caller',          icon:(a)=>srv(a?C.primary:'#C4B5FD',a?C.primaryBg:'#F5F3FF'),     position:{x:20,y:170},  mobilePosition:{x:10,y:170} },
    { id:'reg',  label:'Registry',    sublabel:'Consul/Eureka',   icon:(a)=>box(a?C.orange:'#fdba74',a?C.orangeBg:'#fff7ed','REG'), position:{x:240,y:60},  mobilePosition:{x:160,y:60} },
    { id:'svcB', label:'Svc B',       sublabel:'Registers itself',icon:(a)=>srv(a?C.blue:'#93c5fd', a?C.blueBg:'#eff6ff'),          position:{x:240,y:280}, mobilePosition:{x:160,y:280} },
    { id:'lb',   label:'LB / Mesh',   sublabel:'Route traffic',   icon:(a)=>box(a?C.green:'#86efac',a?C.greenBg:'#f0fff4', 'LB'),  position:{x:450,y:170}, mobilePosition:{x:310,y:170} },
  ],
  edges: [
    { id:'b-reg', source:'svcB', target:'reg', label:'register',  sourceHandle:'top-s',  targetHandle:'left',    type:'smoothstep' },
    { id:'a-reg', source:'svcA', target:'reg', label:'lookup',    sourceHandle:'top-s',  targetHandle:'left-s',  type:'smoothstep' },
    { id:'reg-a', source:'reg',  target:'svcA',label:'IP:port',   sourceHandle:'left-s', targetHandle:'right-t', type:'smoothstep' },
    { id:'a-lb',  source:'svcA', target:'lb',  label:'call',      sourceHandle:'right',  targetHandle:'left',    type:'smoothstep' },
    { id:'lb-b',  source:'lb',   target:'svcB',label:'route',     sourceHandle:'bottom', targetHandle:'right-t', type:'smoothstep' },
  ],
  steps: [
    { label:'Service Registration', description:'When Service B starts, it registers its IP and port with the service registry (Consul)', activeNodes:['svcB','reg'], animatedEdges:['b-reg'], edgeColor:{'b-reg':C.orange} },
    { label:'Service Lookup', description:'Service A queries the registry to find where Service B is running right now', activeNodes:['svcA','reg'], animatedEdges:['a-reg'], edgeColor:{'a-reg':C.primary} },
    { label:'Registry Returns Address', description:'Registry returns the current IP:port of Service B instances', activeNodes:['reg','svcA'], animatedEdges:['reg-a'], edgeColor:{'reg-a':C.green} },
    { label:'Route via LB', description:'Service A calls through a load balancer / service mesh that knows healthy instances', activeNodes:['svcA','lb','svcB'], animatedEdges:['a-lb','lb-b'], edgeColor:{'a-lb':C.blue,'lb-b':C.green} },
    { label:'Dynamic Endpoints', description:'No hardcoded IPs — services scale up/down and registry always has fresh state', activeNodes:['reg','svcB'], animatedEdges:['b-reg'], edgeColor:{'b-reg':C.primary} },
  ],
};

export const msDataManagementDef: FlowDef = {
  nodes: [
    { id:'svcA', label:'Order Svc',   sublabel:'Orders DB',       icon:(a)=>srv(a?C.primary:'#C4B5FD',a?C.primaryBg:'#F5F3FF'),     position:{x:20,y:170},  mobilePosition:{x:10,y:170} },
    { id:'dbA',  label:'Orders DB',   sublabel:'Postgres',        icon:(a)=>cyl(a?C.primary:'#C4B5FD',a?C.primaryBg:'#F5F3FF'),     position:{x:230,y:60},  mobilePosition:{x:160,y:60} },
    { id:'svcB', label:'User Svc',    sublabel:'Users DB',        icon:(a)=>srv(a?C.blue:'#93c5fd',  a?C.blueBg:'#eff6ff'),         position:{x:430,y:170}, mobilePosition:{x:300,y:170} },
    { id:'dbB',  label:'Users DB',    sublabel:'MongoDB',         icon:(a)=>cyl(a?C.blue:'#93c5fd',  a?C.blueBg:'#eff6ff'),         position:{x:230,y:280}, mobilePosition:{x:160,y:280} },
    { id:'evt',  label:'Event Bus',   sublabel:'User updated',    icon:(a)=>box(a?C.green:'#86efac', a?C.greenBg:'#f0fff4', 'EVT'), position:{x:600,y:170}, mobilePosition:{x:420,y:170} },
  ],
  edges: [
    { id:'a-dba', source:'svcA', target:'dbA', label:'write',  sourceHandle:'top-s',  targetHandle:'left',    type:'smoothstep' },
    { id:'b-dbb', source:'svcB', target:'dbB', label:'write',  sourceHandle:'bottom', targetHandle:'right-t', type:'smoothstep' },
    { id:'b-evt', source:'svcB', target:'evt', label:'publish',sourceHandle:'right',  targetHandle:'left',    type:'smoothstep' },
    { id:'evt-a', source:'evt',  target:'svcA',label:'sync',   sourceHandle:'bottom', targetHandle:'right-t', type:'smoothstep' },
    { id:'a-b',   source:'svcA', target:'svcB',label:'REST',   sourceHandle:'right',  targetHandle:'left',    type:'smoothstep' },
  ],
  steps: [
    { label:'Database Per Service', description:'Each service owns its own database — no service accesses another service\'s DB directly', activeNodes:['svcA','dbA','svcB','dbB'], animatedEdges:['a-dba','b-dbb'], edgeColor:{'a-dba':C.primary,'b-dbb':C.blue} },
    { label:'Different DB Per Service', description:'Order service uses Postgres (ACID), User service uses MongoDB (flexible) — best tool per need', activeNodes:['dbA','dbB'], animatedEdges:[], edgeColor:{} },
    { label:'API for Cross-Service Data', description:'To get user data, Order service calls User service API — never queries the DB directly', activeNodes:['svcA','svcB'], animatedEdges:['a-b'], edgeColor:{'a-b':C.orange} },
    { label:'Event-Based Sync', description:'User service publishes UserUpdated event — Order service listens and updates its local copy', activeNodes:['svcB','evt','svcA'], animatedEdges:['b-evt','evt-a'], edgeColor:{'b-evt':C.green,'evt-a':C.green} },
    { label:'Eventual Consistency', description:'Local copies may lag slightly — accept eventual consistency for cross-service data', activeNodes:['evt','svcA'], animatedEdges:['evt-a'], edgeColor:{'evt-a':C.orange} },
  ],
};

export const msDeploymentDef: FlowDef = {
  nodes: [
    { id:'code', label:'Source Code',  sublabel:'Git repo',       icon:(a)=>box(a?C.primary:'#C4B5FD',a?C.primaryBg:'#F5F3FF','GIT'), position:{x:20,y:170},  mobilePosition:{x:10,y:170} },
    { id:'img',  label:'Docker Image', sublabel:'Container',      icon:(a)=>box(a?C.blue:'#93c5fd',  a?C.blueBg:'#eff6ff',  'IMG'), position:{x:230,y:60},  mobilePosition:{x:160,y:60} },
    { id:'k8s',  label:'Kubernetes',   sublabel:'Orchestrator',   icon:(a)=>box(a?C.orange:'#fdba74',a?C.orangeBg:'#fff7ed','K8S'), position:{x:230,y:280}, mobilePosition:{x:160,y:280} },
    { id:'pod',  label:'Pod/Container',sublabel:'Running svc',    icon:(a)=>srv(a?C.green:'#86efac', a?C.greenBg:'#f0fff4'),         position:{x:450,y:170}, mobilePosition:{x:310,y:170} },
  ],
  edges: [
    { id:'c-i',  source:'code', target:'img', label:'docker build',sourceHandle:'top-s',  targetHandle:'left',    type:'smoothstep' },
    { id:'c-k',  source:'code', target:'k8s', label:'deploy YAML', sourceHandle:'bottom', targetHandle:'left',    type:'smoothstep' },
    { id:'i-p',  source:'img',  target:'pod', label:'run',         sourceHandle:'right',  targetHandle:'top',     type:'smoothstep' },
    { id:'k-p',  source:'k8s',  target:'pod', label:'schedule',    sourceHandle:'right',  targetHandle:'bottom-t',type:'smoothstep' },
  ],
  steps: [
    { label:'Container Per Service', description:'Each microservice is packaged as a Docker container — consistent environment everywhere', activeNodes:['code','img'], animatedEdges:['c-i'], edgeColor:{'c-i':C.blue} },
    { label:'Docker Image', description:'Dockerfile defines the runtime — image is built in CI pipeline and pushed to registry', activeNodes:['img'], animatedEdges:[], edgeColor:{} },
    { label:'Kubernetes Deploys', description:'K8s reads deployment YAML and schedules containers as pods across cluster nodes', activeNodes:['code','k8s'], animatedEdges:['c-k'], edgeColor:{'c-k':C.orange} },
    { label:'Pod Runs the Service', description:'Pod contains the container — K8s restarts it on failure, scales it on demand', activeNodes:['img','k8s','pod'], animatedEdges:['i-p','k-p'], edgeColor:{'i-p':C.green,'k-p':C.orange} },
    { label:'Independent Deployments', description:'Each service has its own CI/CD pipeline — deploy Order service without touching User service', activeNodes:['code','pod'], animatedEdges:['c-i','c-k'], edgeColor:{'c-i':C.blue,'c-k':C.orange} },
  ],
};

export const msResilienceDef: FlowDef = {
  nodes: [
    { id:'svcA', label:'Svc A',        sublabel:'Caller',         icon:(a)=>srv(a?C.primary:'#C4B5FD',a?C.primaryBg:'#F5F3FF'),     position:{x:20,y:170},  mobilePosition:{x:10,y:170} },
    { id:'cb',   label:'Circuit Breaker',sublabel:'Open/Closed',  icon:(a)=>box(a?C.orange:'#fdba74',a?C.orangeBg:'#fff7ed','CB'), position:{x:230,y:60},  mobilePosition:{x:160,y:60} },
    { id:'ret',  label:'Retry',         sublabel:'Exponential BO',icon:(a)=>box(a?C.blue:'#93c5fd', a?C.blueBg:'#eff6ff', 'RET'), position:{x:230,y:280}, mobilePosition:{x:160,y:280} },
    { id:'svcB', label:'Svc B',         sublabel:'May be slow',   icon:(a)=>srv(a?C.red:'#fca5a5',  a?C.redBg:'#fff5f5'),          position:{x:450,y:170}, mobilePosition:{x:310,y:170} },
  ],
  edges: [
    { id:'a-cb',  source:'svcA', target:'cb',  label:'calls',   sourceHandle:'top-s',  targetHandle:'left',    type:'smoothstep' },
    { id:'a-ret', source:'svcA', target:'ret', label:'on fail', sourceHandle:'bottom', targetHandle:'left',    type:'smoothstep' },
    { id:'cb-b',  source:'cb',   target:'svcB',label:'allow',   sourceHandle:'right',  targetHandle:'top',     type:'smoothstep' },
    { id:'ret-b', source:'ret',  target:'svcB',label:'retry',   sourceHandle:'right',  targetHandle:'bottom-t',type:'smoothstep' },
  ],
  steps: [
    { label:'Circuit Breaker: Closed', description:'Normal operation — requests flow through. CB monitors error rate', activeNodes:['svcA','cb','svcB'], animatedEdges:['a-cb','cb-b'], edgeColor:{'a-cb':C.primary,'cb-b':C.primary} },
    { label:'Circuit Breaker: Open', description:'Error rate exceeds threshold — CB opens, all requests fail fast without hitting Svc B', activeNodes:['svcA','cb'], animatedEdges:['a-cb'], edgeColor:{'a-cb':C.red}, nodeOverride:{'cb':{warn:true}} },
    { label:'Retry with Backoff', description:'On transient failure: retry after 1s, then 2s, then 4s — avoids hammering a recovering service', activeNodes:['svcA','ret','svcB'], animatedEdges:['a-ret','ret-b'], edgeColor:{'a-ret':C.orange,'ret-b':C.orange} },
    { label:'Bulkhead Pattern', description:'Isolate thread pools per service — one slow service cannot exhaust all threads and block others', activeNodes:['svcA'], animatedEdges:[], edgeColor:{} },
    { label:'Fault Isolation', description:'Microservices are isolated — if Payment service fails, User and Order services keep running', activeNodes:['svcA','cb','ret'], animatedEdges:['a-cb','a-ret'], edgeColor:{'a-cb':C.orange,'a-ret':C.blue} },
  ],
};

export const microservicesFlowMap: Record<string, FlowDef> = {
  'Microservices Fundamentals':           msFundamentalsDef,
  'Monolithic vs Microservices':          monoVsMicroDef,
  'Architecture Components':              msArchComponentsDef,
  'Service Decomposition':                serviceDecompositionDef,
  'Inter-Service Communication':          interServiceCommDef,
  'Service Discovery':                    serviceDiscoveryDef,
  'Inter-Service Data Management':        msDataManagementDef,
  'Deployment and Containerization':      msDeploymentDef,
  'Resilience and Fault Isolation':       msResilienceDef,
};
