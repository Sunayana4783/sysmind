import React from 'react';
import { C, type FlowDef } from '../HLDFlow';

const box = (c: string, bg: string, t: string) => <svg width="32" height="28" viewBox="0 0 48 40" fill="none"><rect x="4" y="4" width="40" height="32" rx="6" fill={bg} stroke={c} strokeWidth="2"/><text x="24" y="24" textAnchor="middle" fontSize="9" fontWeight="700" fill={c}>{t}</text></svg>;
const srv = (c: string, bg: string) => <svg width="32" height="32" viewBox="0 0 48 48" fill="none"><rect x="4" y="8" width="40" height="10" rx="3" fill={c} stroke={c} strokeWidth="1.5"/><rect x="4" y="22" width="40" height="10" rx="3" fill={bg} stroke={c} strokeWidth="1.5"/><rect x="4" y="36" width="40" height="10" rx="3" fill={bg} stroke={c} strokeWidth="1.5"/><circle cx="36" cy="13" r="2" fill="white"/></svg>;
const usr = (c: string, bg: string) => <svg width="28" height="34" viewBox="0 0 44 52" fill="none"><circle cx="22" cy="14" r="10" fill={c} stroke={c} strokeWidth="2"/><path d="M4 46c0-9.941 8.059-18 18-18s18 8.059 18 18" fill={bg} stroke={c} strokeWidth="2" strokeLinecap="round"/></svg>;

export const rpFundamentalsDef: FlowDef = {
  nodes: [
    { id:'usr', label:'User',       sublabel:'Expects uptime',  icon:(a)=>usr(a?C.primary:'#C4B5FD',a?C.primaryBg:'#F5F3FF'),     position:{x:20,y:170},  mobilePosition:{x:10,y:170} },
    { id:'sys', label:'System',     sublabel:'Can fail',        icon:(a)=>srv(a?C.orange:'#fdba74', a?C.orangeBg:'#fff7ed'),       position:{x:230,y:60},  mobilePosition:{x:160,y:60} },
    { id:'pat', label:'Patterns',   sublabel:'CB/Retry/Fallback',icon:(a)=>box(a?C.green:'#86efac',a?C.greenBg:'#f0fff4','PAT'), position:{x:230,y:280}, mobilePosition:{x:160,y:280} },
    { id:'res', label:'Resilient',  sublabel:'Stays running',   icon:(a)=>srv(a?C.green:'#86efac', a?C.greenBg:'#f0fff4'),        position:{x:450,y:170}, mobilePosition:{x:310,y:170} },
  ],
  edges: [
    { id:'u-s',  source:'usr', target:'sys', label:'depends on', sourceHandle:'top-s',  targetHandle:'left',    type:'smoothstep' },
    { id:'s-p',  source:'sys', target:'pat', label:'hardened by',sourceHandle:'bottom', targetHandle:'top',     type:'smoothstep' },
    { id:'p-r',  source:'pat', target:'res', label:'produces',   sourceHandle:'right',  targetHandle:'bottom-t',type:'smoothstep' },
    { id:'s-r',  source:'sys', target:'res', label:'becomes',    sourceHandle:'right',  targetHandle:'left',    type:'smoothstep' },
  ],
  steps: [
    { label:'Systems Fail', description:'Networks drop, disks crash, services hang — reliability patterns prevent failures from cascading', activeNodes:['usr','sys'], animatedEdges:['u-s'], edgeColor:{'u-s':C.orange} },
    { label:'Apply Reliability Patterns', description:'Circuit breakers, retries, timeouts, bulkheads — patterns that contain failures and recover gracefully', activeNodes:['sys','pat'], animatedEdges:['s-p'], edgeColor:{'s-p':C.primary} },
    { label:'System Becomes Resilient', description:'With patterns applied, partial failures no longer cause total outages', activeNodes:['pat','res'], animatedEdges:['p-r'], edgeColor:{'p-r':C.green} },
    { label:'Design for Failure', description:'Assume everything will fail eventually — build recovery in from the start, not as an afterthought', activeNodes:['sys','res'], animatedEdges:['s-r'], edgeColor:{'s-r':C.blue} },
    { label:'User Sees Reliability', description:'Users see fast, available service — patterns operate transparently behind the scenes', activeNodes:['usr','res'], animatedEdges:[], edgeColor:{}, nodeOverride:{'res':{hit:true}} },
  ],
};

export const circuitBreakerDef: FlowDef = {
  nodes: [
    { id:'cl',   label:'Caller',    sublabel:'Makes requests',  icon:(a)=>srv(a?C.primary:'#C4B5FD',a?C.primaryBg:'#F5F3FF'),     position:{x:20,y:170},  mobilePosition:{x:10,y:170} },
    { id:'cb',   label:'Circuit Breaker',sublabel:'State machine',icon:(a)=>box(a?C.orange:'#fdba74',a?C.orangeBg:'#fff7ed','CB'), position:{x:230,y:170}, mobilePosition:{x:160,y:170} },
    { id:'svc',  label:'Service',   sublabel:'May be failing',  icon:(a)=>srv(a?C.red:'#fca5a5',  a?C.redBg:'#fff5f5'),          position:{x:430,y:60},  mobilePosition:{x:300,y:60} },
    { id:'fb',   label:'Fallback',  sublabel:'Cached/default',  icon:(a)=>box(a?C.green:'#86efac',a?C.greenBg:'#f0fff4', 'FB'),  position:{x:430,y:280}, mobilePosition:{x:300,y:280} },
  ],
  edges: [
    { id:'cl-cb', source:'cl',  target:'cb',  label:'call',       sourceHandle:'right',  targetHandle:'left',    type:'smoothstep' },
    { id:'cb-sv', source:'cb',  target:'svc', label:'closed',     sourceHandle:'top-s',  targetHandle:'left',    type:'smoothstep' },
    { id:'cb-fb', source:'cb',  target:'fb',  label:'open→fast fail',sourceHandle:'bottom',targetHandle:'left',  type:'smoothstep' },
    { id:'fb-cl', source:'fb',  target:'cl',  label:'cached resp', sourceHandle:'left-s', targetHandle:'right-t', type:'smoothstep' },
  ],
  steps: [
    { label:'Circuit Closed (Normal)', description:'CB is Closed — requests flow through to service normally, errors monitored', activeNodes:['cl','cb','svc'], animatedEdges:['cl-cb','cb-sv'], edgeColor:{'cl-cb':C.primary,'cb-sv':C.primary} },
    { label:'Error Threshold Exceeded', description:'5 consecutive failures — CB transitions to Open state', activeNodes:['cb','svc'], animatedEdges:['cb-sv'], edgeColor:{'cb-sv':C.red}, nodeOverride:{'svc':{miss:true}} },
    { label:'Circuit Open (Fast Fail)', description:'CB is Open — requests fail immediately without hitting service. Gives service time to recover', activeNodes:['cl','cb','fb'], animatedEdges:['cl-cb','cb-fb'], edgeColor:{'cl-cb':C.orange,'cb-fb':C.orange} },
    { label:'Fallback Response', description:'Return cached data, default value, or friendly error — user sees degraded but working experience', activeNodes:['fb','cl'], animatedEdges:['fb-cl'], edgeColor:{'fb-cl':C.green} },
    { label:'Half-Open: Test Recovery', description:'After timeout, CB lets one request through — if success, closes again; if fail, reopens', activeNodes:['cb','svc'], animatedEdges:['cb-sv'], edgeColor:{'cb-sv':C.orange} },
  ],
};

export const retryPatternDef: FlowDef = {
  nodes: [
    { id:'cl',   label:'Client',    sublabel:'Needs response',  icon:(a)=>srv(a?C.primary:'#C4B5FD',a?C.primaryBg:'#F5F3FF'),     position:{x:20,y:170},  mobilePosition:{x:10,y:170} },
    { id:'r1',   label:'Retry 1',   sublabel:'after 1s',        icon:(a)=>box(a?C.orange:'#fdba74',a?C.orangeBg:'#fff7ed','R1'),  position:{x:240,y:30},  mobilePosition:{x:160,y:30} },
    { id:'r2',   label:'Retry 2',   sublabel:'after 2s',        icon:(a)=>box(a?C.orange:'#fdba74',a?C.orangeBg:'#fff7ed','R2'),  position:{x:240,y:170}, mobilePosition:{x:160,y:170} },
    { id:'r3',   label:'Retry 3',   sublabel:'after 4s',        icon:(a)=>box(a?C.red:'#fca5a5',  a?C.redBg:'#fff5f5',  'R3'),  position:{x:240,y:310}, mobilePosition:{x:160,y:310} },
    { id:'ok',   label:'Success',   sublabel:'Response',        icon:(a)=>box(a?C.green:'#86efac',a?C.greenBg:'#f0fff4', 'OK'),  position:{x:460,y:170}, mobilePosition:{x:310,y:170} },
  ],
  edges: [
    { id:'cl-r1', source:'cl', target:'r1', label:'fail',    sourceHandle:'top-s',  targetHandle:'left',    type:'smoothstep' },
    { id:'cl-r2', source:'cl', target:'r2', label:'fail',    sourceHandle:'right',  targetHandle:'left',    type:'smoothstep' },
    { id:'cl-r3', source:'cl', target:'r3', label:'fail',    sourceHandle:'bottom', targetHandle:'left',    type:'smoothstep' },
    { id:'r1-ok', source:'r1', target:'ok', label:'success', sourceHandle:'right',  targetHandle:'top',     type:'smoothstep' },
    { id:'r2-ok', source:'r2', target:'ok', label:'success', sourceHandle:'right',  targetHandle:'left',    type:'smoothstep' },
    { id:'r3-ok', source:'r3', target:'ok', label:'give up', sourceHandle:'right',  targetHandle:'bottom-t',type:'smoothstep' },
  ],
  steps: [
    { label:'Initial Request Fails', description:'Network hiccup or service overloaded — transient failure, worth retrying', activeNodes:['cl','r1'], animatedEdges:['cl-r1'], edgeColor:{'cl-r1':C.orange} },
    { label:'Retry 1: After 1 Second', description:'Wait 1s then retry — many transient failures resolve quickly', activeNodes:['r1','ok'], animatedEdges:['r1-ok'], edgeColor:{'r1-ok':C.green} },
    { label:'Exponential Backoff', description:'Each retry doubles the wait: 1s, 2s, 4s — prevents thundering herd on recovering service', activeNodes:['cl','r1','r2','r3'], animatedEdges:['cl-r1','cl-r2','cl-r3'], edgeColor:{'cl-r1':C.orange,'cl-r2':C.orange,'cl-r3':C.red} },
    { label:'Add Jitter', description:'Add random jitter to backoff times — prevents all clients retrying at same instant', activeNodes:['r2'], animatedEdges:[], edgeColor:{} },
    { label:'Max Retries', description:'Give up after 3 retries — throw error to caller, do not retry indefinitely', activeNodes:['r3','ok'], animatedEdges:['r3-ok'], edgeColor:{'r3-ok':C.red} },
  ],
};

export const timeoutPatternDef: FlowDef = {
  nodes: [
    { id:'cl',   label:'Client',    sublabel:'Waits for svc',   icon:(a)=>srv(a?C.primary:'#C4B5FD',a?C.primaryBg:'#F5F3FF'),     position:{x:20,y:170},  mobilePosition:{x:10,y:170} },
    { id:'svc',  label:'Slow Svc',  sublabel:'Hangs...',        icon:(a)=>srv(a?C.red:'#fca5a5',  a?C.redBg:'#fff5f5'),          position:{x:250,y:60},  mobilePosition:{x:170,y:60} },
    { id:'to',   label:'Timeout',   sublabel:'500ms limit',     icon:(a)=>box(a?C.orange:'#fdba74',a?C.orangeBg:'#fff7ed','TO'),  position:{x:250,y:280}, mobilePosition:{x:170,y:280} },
    { id:'err',  label:'Error',     sublabel:'Fast failure',    icon:(a)=>box(a?C.red:'#fca5a5',  a?C.redBg:'#fff5f5', 'ERR'),   position:{x:460,y:170}, mobilePosition:{x:310,y:170} },
  ],
  edges: [
    { id:'cl-sv',source:'cl',  target:'svc', label:'call',     sourceHandle:'top-s',  targetHandle:'left',    type:'smoothstep' },
    { id:'cl-to',source:'cl',  target:'to',  label:'starts',   sourceHandle:'bottom', targetHandle:'left',    type:'smoothstep' },
    { id:'to-er',source:'to',  target:'err', label:'expired',  sourceHandle:'right',  targetHandle:'bottom-t',type:'smoothstep' },
    { id:'sv-er',source:'svc', target:'err', label:'still hung',sourceHandle:'right', targetHandle:'top',     type:'smoothstep' },
  ],
  steps: [
    { label:'Client Calls Service', description:'Client makes request to a service that starts responding slowly', activeNodes:['cl','svc'], animatedEdges:['cl-sv'], edgeColor:{'cl-sv':C.primary} },
    { label:'Timeout Counter Starts', description:'Client starts a 500ms timeout counter — will not wait longer than this', activeNodes:['cl','to'], animatedEdges:['cl-to'], edgeColor:{'cl-to':C.orange} },
    { label:'Service Hangs', description:'Service is stuck in DB query or external call — no response coming soon', activeNodes:['svc'], animatedEdges:[], edgeColor:{}, nodeOverride:{'svc':{warn:true}} },
    { label:'Timeout Fires', description:'500ms elapsed — client abandons the request, frees its thread to handle other requests', activeNodes:['to','err'], animatedEdges:['to-er'], edgeColor:{'to-er':C.red} },
    { label:'Why Timeouts Matter', description:'Without timeout, one slow service exhausts all client threads — cascading failure. Timeout prevents this', activeNodes:['cl','err'], animatedEdges:[], edgeColor:{} },
  ],
};

export const bulkheadDef: FlowDef = {
  nodes: [
    { id:'pool1',label:'Thread Pool A',sublabel:'Svc A — 10 threads',icon:(a)=>box(a?C.primary:'#C4B5FD',a?C.primaryBg:'#F5F3FF','TP-A'), position:{x:30,y:60},  mobilePosition:{x:10,y:60} },
    { id:'pool2',label:'Thread Pool B',sublabel:'Svc B — 10 threads',icon:(a)=>box(a?C.blue:'#93c5fd', a?C.blueBg:'#eff6ff',   'TP-B'), position:{x:30,y:280}, mobilePosition:{x:10,y:280} },
    { id:'svcA', label:'Service A',    sublabel:'Slow',               icon:(a)=>srv(a?C.red:'#fca5a5',  a?C.redBg:'#fff5f5'),            position:{x:270,y:60},  mobilePosition:{x:180,y:60} },
    { id:'svcB', label:'Service B',    sublabel:'Healthy',            icon:(a)=>srv(a?C.green:'#86efac',a?C.greenBg:'#f0fff4'),          position:{x:270,y:280}, mobilePosition:{x:180,y:280} },
    { id:'ok',   label:'B still works',sublabel:'Isolated!',          icon:(a)=>box(a?C.green:'#86efac',a?C.greenBg:'#f0fff4', 'OK'),    position:{x:470,y:170}, mobilePosition:{x:320,y:170} },
  ],
  edges: [
    { id:'p1-a', source:'pool1',target:'svcA',label:'10 threads busy', sourceHandle:'right',  targetHandle:'left',    type:'smoothstep' },
    { id:'p2-b', source:'pool2',target:'svcB',label:'10 threads free', sourceHandle:'right',  targetHandle:'left',    type:'smoothstep' },
    { id:'b-ok', source:'svcB', target:'ok',  label:'responds fast',   sourceHandle:'right',  targetHandle:'bottom-t',type:'smoothstep' },
  ],
  steps: [
    { label:'Shared Thread Pool (Problem)', description:'Without bulkhead: all services share one pool. Slow Service A fills all 20 threads — B cannot run', activeNodes:['pool1','svcA'], animatedEdges:['p1-a'], edgeColor:{'p1-a':C.red}, nodeOverride:{'svcA':{miss:true}} },
    { label:'Bulkhead: Separate Pools', description:'Bulkhead gives each service its own thread pool — Service A gets 10, Service B gets 10', activeNodes:['pool1','pool2'], animatedEdges:[], edgeColor:{} },
    { label:'Service A Saturates Its Pool', description:'Service A is slow and uses all 10 of its threads — but Service B is unaffected', activeNodes:['pool1','svcA'], animatedEdges:['p1-a'], edgeColor:{'p1-a':C.orange} },
    { label:'Service B Runs Normally', description:'Service B has its own 10 threads — continues serving requests despite A being overloaded', activeNodes:['pool2','svcB'], animatedEdges:['p2-b'], edgeColor:{'p2-b':C.green} },
    { label:'Fault Isolation Achieved', description:'Named after ship bulkheads — compartments flood independently, ship stays afloat', activeNodes:['svcB','ok'], animatedEdges:['b-ok'], edgeColor:{'b-ok':C.green} },
  ],
};

export const gracefulDegradationDef: FlowDef = {
  nodes: [
    { id:'usr', label:'User',       sublabel:'Request',         icon:(a)=>usr(a?C.primary:'#C4B5FD',a?C.primaryBg:'#F5F3FF'),     position:{x:20,y:170},  mobilePosition:{x:10,y:170} },
    { id:'svc', label:'Service',    sublabel:'Primary path',    icon:(a)=>srv(a?C.primary:'#C4B5FD',a?C.primaryBg:'#F5F3FF'),     position:{x:230,y:60},  mobilePosition:{x:160,y:60} },
    { id:'fb',  label:'Fallback',   sublabel:'Cached/default',  icon:(a)=>box(a?C.orange:'#fdba74',a?C.orangeBg:'#fff7ed','FB'),  position:{x:230,y:280}, mobilePosition:{x:160,y:280} },
    { id:'res', label:'Response',   sublabel:'Partial but OK',  icon:(a)=>box(a?C.green:'#86efac', a?C.greenBg:'#f0fff4','OK'),   position:{x:450,y:170}, mobilePosition:{x:310,y:170} },
  ],
  edges: [
    { id:'u-s',  source:'usr', target:'svc', label:'request',  sourceHandle:'top-s',  targetHandle:'left',    type:'smoothstep' },
    { id:'u-fb', source:'usr', target:'fb',  label:'fallback', sourceHandle:'bottom', targetHandle:'left',    type:'smoothstep' },
    { id:'s-r',  source:'svc', target:'res', label:'full resp',sourceHandle:'right',  targetHandle:'top',     type:'smoothstep' },
    { id:'fb-r', source:'fb',  target:'res', label:'partial',  sourceHandle:'right',  targetHandle:'bottom-t',type:'smoothstep' },
  ],
  steps: [
    { label:'Normal Operation', description:'Primary service runs — user gets full featured response', activeNodes:['usr','svc','res'], animatedEdges:['u-s','s-r'], edgeColor:{'u-s':C.primary,'s-r':C.green} },
    { label:'Primary Service Fails', description:'Recommendation engine is down — but showing product page without recommendations is better than error 500', activeNodes:['usr','svc'], animatedEdges:['u-s'], edgeColor:{'u-s':C.red}, nodeOverride:{'svc':{miss:true}} },
    { label:'Fall Back to Cache', description:'Serve cached recommendations from last hour — slightly stale but functional', activeNodes:['usr','fb'], animatedEdges:['u-fb'], edgeColor:{'u-fb':C.orange} },
    { label:'Partial Response Returned', description:'User sees page with generic/cached recommendations — degraded but not broken', activeNodes:['fb','res'], animatedEdges:['fb-r'], edgeColor:{'fb-r':C.green} },
    { label:'Graceful Degradation', description:'Core functionality preserved — non-critical features degrade silently without breaking UX', activeNodes:['res'], animatedEdges:[], edgeColor:{}, nodeOverride:{'res':{hit:true}} },
  ],
};

export const reliabilityFlowMap: Record<string, FlowDef> = {
  'Reliability Patterns Fundamentals':    rpFundamentalsDef,
  'Fault Tolerance and Fault Isolation':  bulkheadDef,
  'Circuit Breaker Pattern':              circuitBreakerDef,
  'Retry Pattern and Exponential Backoff':retryPatternDef,
  'Timeout Pattern':                      timeoutPatternDef,
  'Bulkhead Pattern':                     bulkheadDef,
  'Failover and Redundancy Patterns':     rpFundamentalsDef,
  'Graceful Degradation and Fallback':    gracefulDegradationDef,
  'Health Checks and Self-Healing Systems':circuitBreakerDef,
  'Rate Limiting and Load Shedding':      retryPatternDef,
};
