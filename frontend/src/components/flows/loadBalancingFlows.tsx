import React from 'react';
import { C, type FlowDef } from '../HLDFlow';

const box = (c: string, bg: string, t: string) => <svg width="32" height="28" viewBox="0 0 48 40" fill="none"><rect x="4" y="4" width="40" height="32" rx="6" fill={bg} stroke={c} strokeWidth="2"/><text x="24" y="24" textAnchor="middle" fontSize="9" fontWeight="700" fill={c}>{t}</text></svg>;
const srv = (c: string, bg: string) => <svg width="32" height="32" viewBox="0 0 48 48" fill="none"><rect x="4" y="8" width="40" height="10" rx="3" fill={c} stroke={c} strokeWidth="1.5"/><rect x="4" y="22" width="40" height="10" rx="3" fill={bg} stroke={c} strokeWidth="1.5"/><rect x="4" y="36" width="40" height="10" rx="3" fill={bg} stroke={c} strokeWidth="1.5"/><circle cx="36" cy="13" r="2" fill="white"/></svg>;
const usr = (c: string, bg: string) => <svg width="28" height="34" viewBox="0 0 44 52" fill="none"><circle cx="22" cy="14" r="10" fill={c} stroke={c} strokeWidth="2"/><path d="M4 46c0-9.941 8.059-18 18-18s18 8.059 18 18" fill={bg} stroke={c} strokeWidth="2" strokeLinecap="round"/></svg>;

export const lbFundamentalsDef: FlowDef = {
  nodes: [
    { id:'usr', label:'Users',     sublabel:'Incoming traffic', icon:(a)=>usr(a?C.primary:'#C4B5FD',a?C.primaryBg:'#F5F3FF'),     position:{x:20,y:170},  mobilePosition:{x:10,y:170} },
    { id:'lb',  label:'Load Bal.',sublabel:'Traffic distributor',icon:(a)=>box(a?C.orange:'#fdba74',a?C.orangeBg:'#fff7ed','LB'), position:{x:220,y:170}, mobilePosition:{x:150,y:170} },
    { id:'s1',  label:'Server 1', sublabel:'Healthy',           icon:(a)=>srv(a?C.green:'#86efac',  a?C.greenBg:'#f0fff4'),       position:{x:430,y:60},  mobilePosition:{x:300,y:60} },
    { id:'s2',  label:'Server 2', sublabel:'Healthy',           icon:(a)=>srv(a?C.green:'#86efac',  a?C.greenBg:'#f0fff4'),       position:{x:430,y:280}, mobilePosition:{x:300,y:270} },
  ],
  edges: [
    { id:'u-lb',  source:'usr', target:'lb', label:'request',  sourceHandle:'right',  targetHandle:'left',    type:'smoothstep' },
    { id:'lb-s1', source:'lb',  target:'s1', label:'route 50%',sourceHandle:'top-s',  targetHandle:'left',    type:'smoothstep' },
    { id:'lb-s2', source:'lb',  target:'s2', label:'route 50%',sourceHandle:'bottom', targetHandle:'left',    type:'smoothstep' },
    { id:'s1-lb', source:'s1',  target:'lb', label:'response', sourceHandle:'left-s', targetHandle:'right-t', type:'smoothstep' },
    { id:'s2-lb', source:'s2',  target:'lb', label:'response', sourceHandle:'left-s', targetHandle:'right-t', type:'smoothstep' },
    { id:'lb-u',  source:'lb',  target:'usr',label:'reply',    sourceHandle:'left-s', targetHandle:'right-t', type:'smoothstep' },
  ],
  steps: [
    { label:'Users Send Requests', description:'All client traffic hits a single entry point — the load balancer', activeNodes:['usr','lb'], animatedEdges:['u-lb'], edgeColor:{'u-lb':C.primary} },
    { label:'LB Routes to Server 1', description:'Load balancer chooses Server 1 based on its algorithm (round-robin, least conn, etc.)', activeNodes:['lb','s1'], animatedEdges:['lb-s1'], edgeColor:{'lb-s1':C.orange} },
    { label:'LB Routes to Server 2', description:'Next request goes to Server 2 — load evenly distributed', activeNodes:['lb','s2'], animatedEdges:['lb-s2'], edgeColor:{'lb-s2':C.orange} },
    { label:'Servers Respond', description:'Servers send responses back through the load balancer to the client', activeNodes:['s1','s2','lb'], animatedEdges:['s1-lb','s2-lb'], edgeColor:{'s1-lb':C.green,'s2-lb':C.green} },
    { label:'Client Gets Reply', description:'Client sees one unified endpoint — load balancing is transparent', activeNodes:['lb','usr'], animatedEdges:['lb-u'], edgeColor:{'lb-u':C.green} },
  ],
};

export const lbTypesDef: FlowDef = {
  nodes: [
    { id:'l4',  label:'L4 LB',   sublabel:'TCP/UDP level',    icon:(a)=>box(a?C.blue:'#93c5fd',  a?C.blueBg:'#eff6ff', 'L4'), position:{x:40,y:60},  mobilePosition:{x:10,y:60} },
    { id:'l7',  label:'L7 LB',   sublabel:'HTTP/HTTPS level', icon:(a)=>box(a?C.primary:'#C4B5FD',a?C.primaryBg:'#F5F3FF','L7'), position:{x:40,y:280}, mobilePosition:{x:10,y:280} },
    { id:'hw',  label:'Hardware',sublabel:'Cisco / F5',       icon:(a)=>box(a?C.orange:'#fdba74',a?C.orangeBg:'#fff7ed','HW'), position:{x:270,y:170}, mobilePosition:{x:170,y:170} },
    { id:'sw',  label:'Software',sublabel:'Nginx / HAProxy',  icon:(a)=>box(a?C.green:'#86efac', a?C.greenBg:'#f0fff4','SW'), position:{x:460,y:60},  mobilePosition:{x:310,y:60} },
    { id:'cld', label:'Cloud LB',sublabel:'AWS ALB/NLB',      icon:(a)=>box(a?C.blue:'#93c5fd',  a?C.blueBg:'#eff6ff','CLD'), position:{x:460,y:280}, mobilePosition:{x:310,y:280} },
  ],
  edges: [
    { id:'l4-hw',  source:'l4',  target:'hw',  label:'used by', sourceHandle:'right',  targetHandle:'top',     type:'smoothstep' },
    { id:'l7-sw',  source:'l7',  target:'sw',  label:'Nginx',   sourceHandle:'right',  targetHandle:'left',    type:'smoothstep' },
    { id:'l7-cld', source:'l7',  target:'cld', label:'AWS ALB', sourceHandle:'right',  targetHandle:'top',     type:'smoothstep' },
    { id:'hw-sw',  source:'hw',  target:'sw',  label:'vs',      sourceHandle:'bottom', targetHandle:'top',     type:'smoothstep' },
  ],
  steps: [
    { label:'Layer 4 Load Balancer', description:'Routes at TCP/UDP level — fast, no content inspection, cannot route by URL path', activeNodes:['l4'], animatedEdges:[], edgeColor:{} },
    { label:'Layer 7 Load Balancer', description:'Routes by HTTP content — URL, headers, cookies — smarter routing decisions', activeNodes:['l7'], animatedEdges:[], edgeColor:{} },
    { label:'Hardware Load Balancer', description:'Dedicated physical appliances — very fast but expensive and hard to scale', activeNodes:['l4','hw'], animatedEdges:['l4-hw'], edgeColor:{'l4-hw':C.orange} },
    { label:'Software LB (Nginx/HAProxy)', description:'Runs on commodity servers — flexible, cheap, widely used', activeNodes:['l7','sw'], animatedEdges:['l7-sw'], edgeColor:{'l7-sw':C.green} },
    { label:'Cloud Load Balancer', description:'Managed by cloud provider — AWS ALB (L7), NLB (L4) — scales automatically', activeNodes:['l7','cld'], animatedEdges:['l7-cld'], edgeColor:{'l7-cld':C.blue} },
  ],
};

export const lbAlgorithmsDef: FlowDef = {
  nodes: [
    { id:'lb',  label:'LB',         sublabel:'Chooses server',   icon:(a)=>box(a?C.orange:'#fdba74',a?C.orangeBg:'#fff7ed','LB'), position:{x:30,y:170},  mobilePosition:{x:10,y:170} },
    { id:'rr',  label:'Round Robin',sublabel:'One by one',       icon:(a)=>box(a?C.primary:'#C4B5FD',a?C.primaryBg:'#F5F3FF','RR'), position:{x:250,y:40},  mobilePosition:{x:170,y:40} },
    { id:'lc',  label:'Least Conn.',sublabel:'Fewest active',    icon:(a)=>box(a?C.blue:'#93c5fd',  a?C.blueBg:'#eff6ff', 'LC'), position:{x:250,y:170}, mobilePosition:{x:170,y:170} },
    { id:'ip',  label:'IP Hash',    sublabel:'Same server always',icon:(a)=>box(a?C.green:'#86efac',a?C.greenBg:'#f0fff4','IP'), position:{x:250,y:300}, mobilePosition:{x:170,y:300} },
    { id:'srv', label:'Server Pool',sublabel:'3 servers',        icon:(a)=>srv(a?C.primary:'#C4B5FD',a?C.primaryBg:'#F5F3FF'),     position:{x:460,y:170}, mobilePosition:{x:310,y:170} },
  ],
  edges: [
    { id:'lb-rr', source:'lb', target:'rr',  label:'simple',   sourceHandle:'top-s',  targetHandle:'left',  type:'smoothstep' },
    { id:'lb-lc', source:'lb', target:'lc',  label:'smart',    sourceHandle:'right',  targetHandle:'left',  type:'smoothstep' },
    { id:'lb-ip', source:'lb', target:'ip',  label:'sticky',   sourceHandle:'bottom', targetHandle:'left',  type:'smoothstep' },
    { id:'rr-s',  source:'rr', target:'srv', label:'rotate',   sourceHandle:'right',  targetHandle:'top',   type:'smoothstep' },
    { id:'lc-s',  source:'lc', target:'srv', label:'least',    sourceHandle:'right',  targetHandle:'left',  type:'smoothstep' },
    { id:'ip-s',  source:'ip', target:'srv', label:'hash',     sourceHandle:'right',  targetHandle:'bottom-t', type:'smoothstep' },
  ],
  steps: [
    { label:'Round Robin', description:'Each request goes to the next server in sequence — simple and fair for equal server capacity', activeNodes:['lb','rr','srv'], animatedEdges:['lb-rr','rr-s'], edgeColor:{'lb-rr':C.primary,'rr-s':C.primary} },
    { label:'Least Connections', description:'Route to the server with fewest active connections — better for long-lived requests', activeNodes:['lb','lc','srv'], animatedEdges:['lb-lc','lc-s'], edgeColor:{'lb-lc':C.blue,'lc-s':C.blue} },
    { label:'IP Hash (Sticky)', description:'Hash client IP to always route same client to same server — good for stateful sessions', activeNodes:['lb','ip','srv'], animatedEdges:['lb-ip','ip-s'], edgeColor:{'lb-ip':C.green,'ip-s':C.green} },
    { label:'Weighted Round Robin', description:'Servers with more capacity get a higher weight — e.g. powerful server gets 3x traffic', activeNodes:['lb','rr'], animatedEdges:['lb-rr'], edgeColor:{'lb-rr':C.orange} },
    { label:'Algorithm Comparison', description:'Round Robin: simple. Least Conn: adaptive. IP Hash: sticky. Weighted: handles unequal capacity', activeNodes:['lb','rr','lc','ip'], animatedEdges:['lb-rr','lb-lc','lb-ip'], edgeColor:{'lb-rr':C.primary,'lb-lc':C.blue,'lb-ip':C.green} },
  ],
};

export const roundRobinDef: FlowDef = {
  nodes: [
    { id:'lb', label:'Load Bal.',sublabel:'Round Robin',    icon:(a)=>box(a?C.orange:'#fdba74',a?C.orangeBg:'#fff7ed','LB'), position:{x:30,y:160},  mobilePosition:{x:10,y:160} },
    { id:'s1', label:'Server 1',sublabel:'Weight: 1',      icon:(a)=>srv(a?C.primary:'#C4B5FD',a?C.primaryBg:'#F5F3FF'),   position:{x:280,y:30},  mobilePosition:{x:190,y:30} },
    { id:'s2', label:'Server 2',sublabel:'Weight: 1',      icon:(a)=>srv(a?C.primary:'#C4B5FD',a?C.primaryBg:'#F5F3FF'),   position:{x:280,y:160}, mobilePosition:{x:190,y:160} },
    { id:'s3', label:'Server 3',sublabel:'Weight: 2',      icon:(a)=>srv(a?C.green:'#86efac', a?C.greenBg:'#f0fff4'),      position:{x:280,y:290}, mobilePosition:{x:190,y:290} },
  ],
  edges: [
    { id:'lb-1', source:'lb', target:'s1', label:'req 1', sourceHandle:'top-s',  targetHandle:'left', type:'smoothstep' },
    { id:'lb-2', source:'lb', target:'s2', label:'req 2', sourceHandle:'right',  targetHandle:'left', type:'smoothstep' },
    { id:'lb-3', source:'lb', target:'s3', label:'req 3+4',sourceHandle:'bottom',targetHandle:'left', type:'smoothstep' },
  ],
  steps: [
    { label:'Pure Round Robin', description:'Request 1 → S1, Request 2 → S2, Request 3 → S3, Request 4 → S1 again', activeNodes:['lb','s1'], animatedEdges:['lb-1'], edgeColor:{'lb-1':C.primary} },
    { label:'Continues to S2', description:'Each server gets equal share — works when all servers have identical capacity', activeNodes:['lb','s2'], animatedEdges:['lb-2'], edgeColor:{'lb-2':C.primary} },
    { label:'Weighted Round Robin', description:'Server 3 has weight 2 — it receives twice as many requests as the others', activeNodes:['lb','s3'], animatedEdges:['lb-3'], edgeColor:{'lb-3':C.green} },
    { label:'Equal Distribution', description:'Pure round robin: each gets 33%. Weighted: S1=25%, S2=25%, S3=50%', activeNodes:['lb','s1','s2','s3'], animatedEdges:['lb-1','lb-2','lb-3'], edgeColor:{'lb-1':C.primary,'lb-2':C.primary,'lb-3':C.green} },
    { label:'When to Use', description:'Best for stateless, equal-capacity servers with short-lived requests (REST APIs)', activeNodes:['lb'], animatedEdges:[], edgeColor:{} },
  ],
};

export const leastConnectionsDef: FlowDef = {
  nodes: [
    { id:'lb', label:'Load Bal.', sublabel:'Least Connections', icon:(a)=>box(a?C.orange:'#fdba74',a?C.orangeBg:'#fff7ed','LB'), position:{x:30,y:160},  mobilePosition:{x:10,y:160} },
    { id:'s1', label:'Server 1', sublabel:'50 active conns',   icon:(a)=>srv(a?C.red:'#fca5a5',  a?C.redBg:'#fff5f5'),          position:{x:280,y:30},  mobilePosition:{x:190,y:30} },
    { id:'s2', label:'Server 2', sublabel:'10 active conns',   icon:(a)=>srv(a?C.green:'#86efac',a?C.greenBg:'#f0fff4'),        position:{x:280,y:160}, mobilePosition:{x:190,y:160} },
    { id:'s3', label:'Server 3', sublabel:'30 active conns',   icon:(a)=>srv(a?C.orange:'#fdba74',a?C.orangeBg:'#fff7ed'),      position:{x:280,y:290}, mobilePosition:{x:190,y:290} },
  ],
  edges: [
    { id:'lb-s1',source:'lb', target:'s1', label:'busy',  sourceHandle:'top-s',  targetHandle:'left', type:'smoothstep' },
    { id:'lb-s2',source:'lb', target:'s2', label:'chosen',sourceHandle:'right',  targetHandle:'left', type:'smoothstep' },
    { id:'lb-s3',source:'lb', target:'s3', label:'medium',sourceHandle:'bottom', targetHandle:'left', type:'smoothstep' },
  ],
  steps: [
    { label:'LB Checks Active Connections', description:'Load balancer tracks how many active connections each server currently has', activeNodes:['lb','s1','s2','s3'], animatedEdges:[], edgeColor:{} },
    { label:'S1 is Busy', description:'Server 1 has 50 active connections — overloaded, skip it', activeNodes:['lb','s1'], animatedEdges:['lb-s1'], edgeColor:{'lb-s1':C.red}, nodeOverride:{'s1':{warn:true}} },
    { label:'S2 is Chosen', description:'Server 2 has only 10 connections — fewest active, route here', activeNodes:['lb','s2'], animatedEdges:['lb-s2'], edgeColor:{'lb-s2':C.green}, nodeOverride:{'s2':{hit:true}} },
    { label:'Best for Long Requests', description:'Ideal for WebSockets, file uploads, or any long-lived connection where request time varies', activeNodes:['s2'], animatedEdges:[], edgeColor:{} },
    { label:'Comparison vs Round Robin', description:'Round Robin ignores current load. Least Connections tracks it — smarter but needs state', activeNodes:['lb','s1','s2','s3'], animatedEdges:['lb-s1','lb-s2','lb-s3'], edgeColor:{'lb-s1':C.red,'lb-s2':C.green,'lb-s3':C.orange} },
  ],
};

export const ipHashingDef: FlowDef = {
  nodes: [
    { id:'c1', label:'Client A',   sublabel:'IP: 10.0.0.1',    icon:(a)=>usr(a?C.primary:'#C4B5FD',a?C.primaryBg:'#F5F3FF'),     position:{x:20,y:60},  mobilePosition:{x:10,y:60} },
    { id:'c2', label:'Client B',   sublabel:'IP: 10.0.0.2',    icon:(a)=>usr(a?C.blue:'#93c5fd',   a?C.blueBg:'#eff6ff'),         position:{x:20,y:280}, mobilePosition:{x:10,y:280} },
    { id:'lb', label:'Hash Ring',  sublabel:'Consistent hash', icon:(a)=>box(a?C.orange:'#fdba74',a?C.orangeBg:'#fff7ed','HR'),   position:{x:240,y:170}, mobilePosition:{x:160,y:170} },
    { id:'s1', label:'Server 1',   sublabel:'Always A',        icon:(a)=>srv(a?C.primary:'#C4B5FD',a?C.primaryBg:'#F5F3FF'),     position:{x:450,y:60},  mobilePosition:{x:300,y:60} },
    { id:'s2', label:'Server 2',   sublabel:'Always B',        icon:(a)=>srv(a?C.blue:'#93c5fd',   a?C.blueBg:'#eff6ff'),         position:{x:450,y:280}, mobilePosition:{x:300,y:270} },
  ],
  edges: [
    { id:'c1-lb', source:'c1', target:'lb', label:'hash IP', sourceHandle:'right',  targetHandle:'top',     type:'smoothstep' },
    { id:'c2-lb', source:'c2', target:'lb', label:'hash IP', sourceHandle:'right',  targetHandle:'bottom-t',type:'smoothstep' },
    { id:'lb-s1', source:'lb', target:'s1', label:'→ S1',    sourceHandle:'top-s',  targetHandle:'left',    type:'smoothstep' },
    { id:'lb-s2', source:'lb', target:'s2', label:'→ S2',    sourceHandle:'bottom', targetHandle:'left',    type:'smoothstep' },
  ],
  steps: [
    { label:'IP Hashing', description:'Client IP is hashed to consistently map to the same server — provides sticky sessions without cookies', activeNodes:['lb'], animatedEdges:[], edgeColor:{} },
    { label:'Client A Always → S1', description:'Hash(10.0.0.1) always maps to Server 1 — same session, no need for external session store', activeNodes:['c1','lb','s1'], animatedEdges:['c1-lb','lb-s1'], edgeColor:{'c1-lb':C.primary,'lb-s1':C.primary} },
    { label:'Client B Always → S2', description:'Hash(10.0.0.2) always maps to Server 2 — different client, different server', activeNodes:['c2','lb','s2'], animatedEdges:['c2-lb','lb-s2'], edgeColor:{'c2-lb':C.blue,'lb-s2':C.blue} },
    { label:'Consistent Hashing', description:'When a server is added/removed, only a small fraction of clients get remapped — not all', activeNodes:['lb'], animatedEdges:[], edgeColor:{}, nodeOverride:{'lb':{hit:true}} },
    { label:'Use Cases', description:'IP hashing: gaming servers, stateful apps. Consistent hashing: distributed caches, Cassandra nodes', activeNodes:['c1','c2','lb','s1','s2'], animatedEdges:['c1-lb','c2-lb','lb-s1','lb-s2'], edgeColor:{'c1-lb':C.primary,'c2-lb':C.blue,'lb-s1':C.primary,'lb-s2':C.blue} },
  ],
};

export const healthChecksDef: FlowDef = {
  nodes: [
    { id:'lb',  label:'Load Bal.', sublabel:'Health monitor',  icon:(a)=>box(a?C.orange:'#fdba74',a?C.orangeBg:'#fff7ed','LB'), position:{x:30,y:160},  mobilePosition:{x:10,y:160} },
    { id:'s1',  label:'Server 1', sublabel:'Healthy',          icon:(a)=>srv(a?C.green:'#86efac', a?C.greenBg:'#f0fff4'),      position:{x:270,y:30},  mobilePosition:{x:190,y:30} },
    { id:'s2',  label:'Server 2', sublabel:'Failed',           icon:(a)=>srv(a?C.red:'#fca5a5',   a?C.redBg:'#fff5f5'),        position:{x:270,y:160}, mobilePosition:{x:190,y:160} },
    { id:'s3',  label:'Server 3', sublabel:'Recovered',        icon:(a)=>srv(a?C.green:'#86efac', a?C.greenBg:'#f0fff4'),      position:{x:270,y:290}, mobilePosition:{x:190,y:290} },
    { id:'pool',label:'Active Pool',sublabel:'S1 + S3',        icon:(a)=>box(a?C.green:'#86efac', a?C.greenBg:'#f0fff4','OK'), position:{x:470,y:160}, mobilePosition:{x:320,y:160} },
  ],
  edges: [
    { id:'lb-s1', source:'lb',  target:'s1', label:'ping OK',  sourceHandle:'top-s',  targetHandle:'left',    type:'smoothstep' },
    { id:'lb-s2', source:'lb',  target:'s2', label:'no reply', sourceHandle:'right',  targetHandle:'left',    type:'smoothstep' },
    { id:'lb-s3', source:'lb',  target:'s3', label:'ping OK',  sourceHandle:'bottom', targetHandle:'left',    type:'smoothstep' },
    { id:'s1-p',  source:'s1',  target:'pool',label:'in pool', sourceHandle:'right',  targetHandle:'top',     type:'smoothstep' },
    { id:'s3-p',  source:'s3',  target:'pool',label:'in pool', sourceHandle:'right',  targetHandle:'bottom-t',type:'smoothstep' },
  ],
  steps: [
    { label:'Health Check Pings All Servers', description:'LB sends periodic health checks (HTTP GET /health) to every server every few seconds', activeNodes:['lb','s1','s2','s3'], animatedEdges:['lb-s1','lb-s2','lb-s3'], edgeColor:{'lb-s1':C.green,'lb-s2':C.red,'lb-s3':C.green} },
    { label:'S1 Responds OK', description:'Server 1 returns 200 — healthy, stays in pool', activeNodes:['lb','s1'], animatedEdges:['lb-s1'], edgeColor:{'lb-s1':C.green} },
    { label:'S2 Fails Health Check', description:'Server 2 times out — LB marks it as unhealthy and removes from rotation immediately', activeNodes:['lb','s2'], animatedEdges:['lb-s2'], edgeColor:{'lb-s2':C.red}, nodeOverride:{'s2':{miss:true}} },
    { label:'Active Pool Updated', description:'Only S1 and S3 receive traffic — zero user impact from S2 failure', activeNodes:['s1','s3','pool'], animatedEdges:['s1-p','s3-p'], edgeColor:{'s1-p':C.green,'s3-p':C.green} },
    { label:'Auto-Recovery', description:'When S2 recovers and passes health checks, LB automatically adds it back to the pool', activeNodes:['lb','s3','pool'], animatedEdges:['lb-s3','s3-p'], edgeColor:{'lb-s3':C.green,'s3-p':C.primary} },
  ],
};

export const sessionPersistenceDef: FlowDef = {
  nodes: [
    { id:'usr', label:'User',       sublabel:'Cart session',     icon:(a)=>usr(a?C.primary:'#C4B5FD',a?C.primaryBg:'#F5F3FF'),     position:{x:20,y:170},  mobilePosition:{x:10,y:170} },
    { id:'lb',  label:'Load Bal.',  sublabel:'Sticky session',   icon:(a)=>box(a?C.orange:'#fdba74',a?C.orangeBg:'#fff7ed','LB'), position:{x:220,y:170}, mobilePosition:{x:150,y:170} },
    { id:'s1',  label:'Server 1',   sublabel:'Owns session',     icon:(a)=>srv(a?C.primary:'#C4B5FD',a?C.primaryBg:'#F5F3FF'),     position:{x:420,y:60},  mobilePosition:{x:290,y:60} },
    { id:'s2',  label:'Server 2',   sublabel:'No session',       icon:(a)=>srv(a?C.orange:'#fdba74', a?C.orangeBg:'#fff7ed'),       position:{x:420,y:170}, mobilePosition:{x:290,y:170} },
    { id:'red', label:'Redis',      sublabel:'Shared sessions',  icon:(a)=>box(a?C.blue:'#93c5fd',  a?C.blueBg:'#eff6ff','RDS'), position:{x:420,y:290}, mobilePosition:{x:290,y:280} },
  ],
  edges: [
    { id:'u-lb',  source:'usr', target:'lb', label:'request', sourceHandle:'right',  targetHandle:'left',    type:'smoothstep' },
    { id:'lb-s1', source:'lb',  target:'s1', label:'sticky',  sourceHandle:'top-s',  targetHandle:'left',    type:'smoothstep' },
    { id:'lb-s2', source:'lb',  target:'s2', label:'problem!',sourceHandle:'right',  targetHandle:'left',    type:'smoothstep' },
    { id:'s1-r',  source:'s1',  target:'red',label:'store',   sourceHandle:'bottom', targetHandle:'top',     type:'smoothstep' },
    { id:'s2-r',  source:'s2',  target:'red',label:'fetch',   sourceHandle:'bottom', targetHandle:'left',    type:'smoothstep' },
    { id:'lb-r',  source:'lb',  target:'red',label:'any srvr',sourceHandle:'bottom', targetHandle:'left',    type:'smoothstep' },
  ],
  steps: [
    { label:'Session Problem', description:'User adds items to cart — session is on Server 1. Next request goes to S2 — cart is gone!', activeNodes:['usr','lb','s2'], animatedEdges:['u-lb','lb-s2'], edgeColor:{'u-lb':C.orange,'lb-s2':C.red}, nodeOverride:{'s2':{miss:true}} },
    { label:'Sticky Sessions (Cookie)', description:'LB uses a session cookie to always send same user to same server', activeNodes:['usr','lb','s1'], animatedEdges:['u-lb','lb-s1'], edgeColor:{'u-lb':C.primary,'lb-s1':C.primary} },
    { label:'Sticky Sessions Downsides', description:'If S1 goes down, all its session users lose their state — also uneven load distribution', activeNodes:['lb','s1'], animatedEdges:[], edgeColor:{}, nodeOverride:{'s1':{warn:true}} },
    { label:'Better: External Session Store', description:'Store sessions in Redis — any server can serve any user, no stickiness needed', activeNodes:['s1','s2','red'], animatedEdges:['s1-r','s2-r'], edgeColor:{'s1-r':C.blue,'s2-r':C.blue} },
    { label:'Stateless with Shared Store', description:'LB routes freely — sessions always available from Redis regardless of which server responds', activeNodes:['lb','red'], animatedEdges:['lb-r'], edgeColor:{'lb-r':C.blue} },
  ],
};

export const haRedundancyDef: FlowDef = {
  nodes: [
    { id:'usr', label:'Users',      sublabel:'Always on',        icon:(a)=>usr(a?C.primary:'#C4B5FD',a?C.primaryBg:'#F5F3FF'),     position:{x:20,y:170},  mobilePosition:{x:10,y:170} },
    { id:'lb1', label:'LB Primary', sublabel:'Active',           icon:(a)=>box(a?C.green:'#86efac', a?C.greenBg:'#f0fff4', 'LB1'), position:{x:220,y:60},  mobilePosition:{x:150,y:60} },
    { id:'lb2', label:'LB Standby', sublabel:'Passive failover', icon:(a)=>box(a?C.orange:'#fdba74',a?C.orangeBg:'#fff7ed','LB2'), position:{x:220,y:280}, mobilePosition:{x:150,y:280} },
    { id:'pool',label:'Server Pool',sublabel:'Multiple servers', icon:(a)=>srv(a?C.primary:'#C4B5FD',a?C.primaryBg:'#F5F3FF'),     position:{x:430,y:170}, mobilePosition:{x:300,y:170} },
  ],
  edges: [
    { id:'u-l1',  source:'usr',  target:'lb1', label:'normal',   sourceHandle:'top-s',  targetHandle:'left',    type:'smoothstep' },
    { id:'u-l2',  source:'usr',  target:'lb2', label:'failover', sourceHandle:'bottom', targetHandle:'left',    type:'smoothstep' },
    { id:'l1-p',  source:'lb1',  target:'pool',label:'routes',   sourceHandle:'right',  targetHandle:'top',     type:'smoothstep' },
    { id:'l2-p',  source:'lb2',  target:'pool',label:'takes over',sourceHandle:'right', targetHandle:'bottom-t',type:'smoothstep' },
    { id:'l1-l2', source:'lb1',  target:'lb2', label:'heartbeat',sourceHandle:'bottom', targetHandle:'top',     type:'smoothstep' },
  ],
  steps: [
    { label:'Active-Passive LB Setup', description:'Primary LB handles all traffic. Standby LB monitors via heartbeat — ready to take over', activeNodes:['lb1','lb2'], animatedEdges:['l1-l2'], edgeColor:{'l1-l2':C.orange} },
    { label:'Normal Operation', description:'All user traffic goes through LB Primary — lowest latency path', activeNodes:['usr','lb1','pool'], animatedEdges:['u-l1','l1-p'], edgeColor:{'u-l1':C.primary,'l1-p':C.primary} },
    { label:'LB Primary Fails', description:'LB1 stops sending heartbeat — LB2 detects failure and promotes itself', activeNodes:['lb1','lb2'], animatedEdges:['l1-l2'], edgeColor:{'l1-l2':C.red}, nodeOverride:{'lb1':{miss:true}} },
    { label:'Failover Activates', description:'LB2 takes over — virtual IP re-assigned in seconds, users experience minimal disruption', activeNodes:['usr','lb2','pool'], animatedEdges:['u-l2','l2-p'], edgeColor:{'u-l2':C.green,'l2-p':C.green} },
    { label:'High Availability Result', description:'No single component can take down the system — redundancy at every layer ensures 99.9%+ uptime', activeNodes:['usr','lb1','lb2','pool'], animatedEdges:['u-l1','u-l2','l1-p','l2-p'], edgeColor:{'u-l1':C.primary,'u-l2':C.orange,'l1-p':C.primary,'l2-p':C.green} },
  ],
};

export const loadBalancingFlowMap: Record<string, FlowDef> = {
  'Load Balancing Fundamentals':          lbFundamentalsDef,
  'Types of Load Balancers':              lbTypesDef,
  'Load Balancing Algorithms':            lbAlgorithmsDef,
  'Round-Robin and Weighted Round-Robin': roundRobinDef,
  'Least Connections':                    leastConnectionsDef,
  'IP Hashing and Consistent Hashing':    ipHashingDef,
  'Health Checks and Automatic Failover': healthChecksDef,
  'Session Persistence (Sticky Sessions)':sessionPersistenceDef,
  'High Availability and Redundancy':     haRedundancyDef,
};
