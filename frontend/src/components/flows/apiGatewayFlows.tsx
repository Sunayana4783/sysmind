import React from 'react';
import { C, type FlowDef } from '../HLDFlow';

const box = (c: string, bg: string, t: string) => <svg width="32" height="28" viewBox="0 0 48 40" fill="none"><rect x="4" y="4" width="40" height="32" rx="6" fill={bg} stroke={c} strokeWidth="2"/><text x="24" y="24" textAnchor="middle" fontSize="9" fontWeight="700" fill={c}>{t}</text></svg>;
const srv = (c: string, bg: string) => <svg width="32" height="32" viewBox="0 0 48 48" fill="none"><rect x="4" y="8" width="40" height="10" rx="3" fill={c} stroke={c} strokeWidth="1.5"/><rect x="4" y="22" width="40" height="10" rx="3" fill={bg} stroke={c} strokeWidth="1.5"/><rect x="4" y="36" width="40" height="10" rx="3" fill={bg} stroke={c} strokeWidth="1.5"/><circle cx="36" cy="13" r="2" fill="white"/></svg>;
const usr = (c: string, bg: string) => <svg width="28" height="34" viewBox="0 0 44 52" fill="none"><circle cx="22" cy="14" r="10" fill={c} stroke={c} strokeWidth="2"/><path d="M4 46c0-9.941 8.059-18 18-18s18 8.059 18 18" fill={bg} stroke={c} strokeWidth="2" strokeLinecap="round"/></svg>;

export const agFundamentalsDef: FlowDef = {
  nodes: [
    { id:'client', label:'Client',      sublabel:'Mobile/Web',    icon:(a)=>usr(a?C.primary:'#C4B5FD',a?C.primaryBg:'#F5F3FF'),     position:{x:20,y:170},  mobilePosition:{x:10,y:170} },
    { id:'gw',     label:'API Gateway', sublabel:'Single entry',  icon:(a)=>box(a?C.orange:'#fdba74',a?C.orangeBg:'#fff7ed','GW'),  position:{x:230,y:170}, mobilePosition:{x:160,y:170} },
    { id:'s1',     label:'User Svc',    sublabel:'Backend',       icon:(a)=>srv(a?C.primary:'#C4B5FD',a?C.primaryBg:'#F5F3FF'),     position:{x:430,y:60},  mobilePosition:{x:300,y:60} },
    { id:'s2',     label:'Order Svc',   sublabel:'Backend',       icon:(a)=>srv(a?C.blue:'#93c5fd',  a?C.blueBg:'#eff6ff'),         position:{x:430,y:280}, mobilePosition:{x:300,y:280} },
  ],
  edges: [
    { id:'cl-gw', source:'client', target:'gw', label:'HTTPS',   sourceHandle:'right',  targetHandle:'left',    type:'smoothstep' },
    { id:'gw-s1', source:'gw',     target:'s1', label:'route',   sourceHandle:'top-s',  targetHandle:'left',    type:'smoothstep' },
    { id:'gw-s2', source:'gw',     target:'s2', label:'route',   sourceHandle:'bottom', targetHandle:'left',    type:'smoothstep' },
    { id:'gw-cl', source:'gw',     target:'client', label:'response', sourceHandle:'left-s', targetHandle:'right-t', type:'smoothstep' },
  ],
  steps: [
    { label:'Single Entry Point', description:'All client requests enter through one gateway — clients never talk to backend services directly', activeNodes:['client','gw'], animatedEdges:['cl-gw'], edgeColor:{'cl-gw':C.primary} },
    { label:'Route to User Service', description:'Gateway parses the request path and routes /users/* to the User Service', activeNodes:['gw','s1'], animatedEdges:['gw-s1'], edgeColor:{'gw-s1':C.primary} },
    { label:'Route to Order Service', description:'Gateway routes /orders/* to Order Service — backend services are hidden from clients', activeNodes:['gw','s2'], animatedEdges:['gw-s2'], edgeColor:{'gw-s2':C.blue} },
    { label:'Response Returned', description:'Gateway aggregates or passes through the response back to the client', activeNodes:['gw','client'], animatedEdges:['gw-cl'], edgeColor:{'gw-cl':C.green} },
    { label:'Cross-Cutting Concerns', description:'Auth, rate limiting, logging, SSL termination — all handled once in the gateway, not per service', activeNodes:['gw'], animatedEdges:[], edgeColor:{}, nodeOverride:{'gw':{hit:true}} },
  ],
};

export const agArchitectureDef: FlowDef = {
  nodes: [
    { id:'client', label:'Client',      sublabel:'Request',       icon:(a)=>usr(a?C.primary:'#C4B5FD',a?C.primaryBg:'#F5F3FF'),     position:{x:20,y:170},  mobilePosition:{x:10,y:170} },
    { id:'gw',     label:'Gateway',     sublabel:'Kong/AWS API GW',icon:(a)=>box(a?C.orange:'#fdba74',a?C.orangeBg:'#fff7ed','GW'), position:{x:220,y:170}, mobilePosition:{x:150,y:170} },
    { id:'auth',   label:'Auth',        sublabel:'JWT/OAuth',     icon:(a)=>box(a?C.red:'#fca5a5',  a?C.redBg:'#fff5f5',  'AUTH'), position:{x:420,y:30},  mobilePosition:{x:290,y:30} },
    { id:'rl',     label:'Rate Limit',  sublabel:'Token bucket',  icon:(a)=>box(a?C.blue:'#93c5fd', a?C.blueBg:'#eff6ff', 'RL'),   position:{x:420,y:170}, mobilePosition:{x:290,y:170} },
    { id:'svc',    label:'Backend',     sublabel:'Microservices', icon:(a)=>srv(a?C.green:'#86efac',a?C.greenBg:'#f0fff4'),         position:{x:580,y:170}, mobilePosition:{x:400,y:170} },
  ],
  edges: [
    { id:'cl-gw',  source:'client', target:'gw',  label:'request',  sourceHandle:'right',  targetHandle:'left',    type:'smoothstep' },
    { id:'gw-auth',source:'gw',     target:'auth',label:'verify',   sourceHandle:'top-s',  targetHandle:'left',    type:'smoothstep' },
    { id:'gw-rl',  source:'gw',     target:'rl',  label:'check',    sourceHandle:'right',  targetHandle:'left',    type:'smoothstep' },
    { id:'rl-svc', source:'rl',     target:'svc', label:'forward',  sourceHandle:'right',  targetHandle:'left',    type:'smoothstep' },
    { id:'gw-cl',  source:'gw',     target:'client',label:'reply',  sourceHandle:'left-s', targetHandle:'right-t', type:'smoothstep' },
  ],
  steps: [
    { label:'Request Enters Gateway', description:'TLS terminated, request decoded — gateway inspects headers and routing info', activeNodes:['client','gw'], animatedEdges:['cl-gw'], edgeColor:{'cl-gw':C.primary} },
    { label:'Authentication Check', description:'Gateway validates JWT token or calls OAuth provider — rejects unauthorized requests instantly', activeNodes:['gw','auth'], animatedEdges:['gw-auth'], edgeColor:{'gw-auth':C.red} },
    { label:'Rate Limit Check', description:'Token bucket: client allowed 100 req/min — 429 Too Many Requests if exceeded', activeNodes:['gw','rl'], animatedEdges:['gw-rl'], edgeColor:{'gw-rl':C.blue} },
    { label:'Forward to Backend', description:'Authenticated and rate-limited request forwarded to the correct microservice', activeNodes:['rl','svc'], animatedEdges:['rl-svc'], edgeColor:{'rl-svc':C.green} },
    { label:'Response to Client', description:'Gateway returns the service response — may transform format, add headers', activeNodes:['gw','client'], animatedEdges:['gw-cl'], edgeColor:{'gw-cl':C.green} },
  ],
};

export const agVsReverseProxyDef: FlowDef = {
  nodes: [
    { id:'cl',  label:'Client',       sublabel:'Browser',         icon:(a)=>usr(a?C.primary:'#C4B5FD',a?C.primaryBg:'#F5F3FF'),     position:{x:20,y:170},  mobilePosition:{x:10,y:170} },
    { id:'rp',  label:'Reverse Proxy',sublabel:'Nginx',           icon:(a)=>box(a?C.blue:'#93c5fd', a?C.blueBg:'#eff6ff', 'RP'),   position:{x:230,y:60},  mobilePosition:{x:160,y:60} },
    { id:'ag',  label:'API Gateway',  sublabel:'Kong/AWS',        icon:(a)=>box(a?C.orange:'#fdba74',a?C.orangeBg:'#fff7ed','GW'),  position:{x:230,y:280}, mobilePosition:{x:160,y:280} },
    { id:'svc', label:'Backend',      sublabel:'Services',        icon:(a)=>srv(a?C.green:'#86efac',a?C.greenBg:'#f0fff4'),         position:{x:450,y:170}, mobilePosition:{x:310,y:170} },
  ],
  edges: [
    { id:'cl-rp',source:'cl',  target:'rp', label:'HTTP',    sourceHandle:'top-s',  targetHandle:'left',    type:'smoothstep' },
    { id:'cl-ag',source:'cl',  target:'ag', label:'HTTPS',   sourceHandle:'bottom', targetHandle:'left',    type:'smoothstep' },
    { id:'rp-s', source:'rp',  target:'svc',label:'proxy',   sourceHandle:'right',  targetHandle:'top',     type:'smoothstep' },
    { id:'ag-s', source:'ag',  target:'svc',label:'route+auth',sourceHandle:'right',targetHandle:'bottom-t',type:'smoothstep' },
  ],
  steps: [
    { label:'Reverse Proxy: Simple', description:'Reverse proxy sits in front of servers — forwards traffic, handles SSL, load balances', activeNodes:['cl','rp','svc'], animatedEdges:['cl-rp','rp-s'], edgeColor:{'cl-rp':C.blue,'rp-s':C.blue} },
    { label:'Reverse Proxy Scope', description:'Nginx/HAProxy: load balancing, SSL, caching static content — no business logic awareness', activeNodes:['rp'], animatedEdges:[], edgeColor:{} },
    { label:'API Gateway: Smart Proxy', description:'API gateway does everything a reverse proxy does PLUS auth, rate limiting, transformations, analytics', activeNodes:['cl','ag','svc'], animatedEdges:['cl-ag','ag-s'], edgeColor:{'cl-ag':C.orange,'ag-s':C.orange} },
    { label:'API Gateway Features', description:'JWT validation, API versioning, request/response transformation, circuit breaking, developer portal', activeNodes:['ag'], animatedEdges:[], edgeColor:{}, nodeOverride:{'ag':{hit:true}} },
    { label:'Which to Choose', description:'Reverse proxy for simple load balancing. API gateway when you have microservices with auth/rate limiting needs', activeNodes:['rp','ag'], animatedEdges:['cl-rp','cl-ag'], edgeColor:{'cl-rp':C.blue,'cl-ag':C.orange} },
  ],
};

export const requestRoutingDef: FlowDef = {
  nodes: [
    { id:'gw',  label:'Gateway',    sublabel:'Router',          icon:(a)=>box(a?C.orange:'#fdba74',a?C.orangeBg:'#fff7ed','GW'), position:{x:30,y:170},  mobilePosition:{x:10,y:170} },
    { id:'s1',  label:'/users',     sublabel:'User Service',    icon:(a)=>srv(a?C.primary:'#C4B5FD',a?C.primaryBg:'#F5F3FF'),   position:{x:270,y:30},  mobilePosition:{x:180,y:30} },
    { id:'s2',  label:'/orders',    sublabel:'Order Service',   icon:(a)=>srv(a?C.blue:'#93c5fd',  a?C.blueBg:'#eff6ff'),       position:{x:270,y:160}, mobilePosition:{x:180,y:160} },
    { id:'s3',  label:'/payments',  sublabel:'Payment Service', icon:(a)=>srv(a?C.green:'#86efac', a?C.greenBg:'#f0fff4'),      position:{x:270,y:290}, mobilePosition:{x:180,y:290} },
  ],
  edges: [
    { id:'gw-s1', source:'gw', target:'s1', label:'/users/*',   sourceHandle:'top-s',  targetHandle:'left', type:'smoothstep' },
    { id:'gw-s2', source:'gw', target:'s2', label:'/orders/*',  sourceHandle:'right',  targetHandle:'left', type:'smoothstep' },
    { id:'gw-s3', source:'gw', target:'s3', label:'/payments/*',sourceHandle:'bottom', targetHandle:'left', type:'smoothstep' },
  ],
  steps: [
    { label:'Path-Based Routing', description:'Gateway routes /users/* to User Service, /orders/* to Order Service — based on URL path', activeNodes:['gw','s1'], animatedEdges:['gw-s1'], edgeColor:{'gw-s1':C.primary} },
    { label:'Route to Orders', description:'/orders/123 routed to Order Service — backend URL rewritten transparently', activeNodes:['gw','s2'], animatedEdges:['gw-s2'], edgeColor:{'gw-s2':C.blue} },
    { label:'Route to Payments', description:'/payments/charge routed to Payment Service — services maintain clean separation', activeNodes:['gw','s3'], animatedEdges:['gw-s3'], edgeColor:{'gw-s3':C.green} },
    { label:'Header-Based Routing', description:'Route by HTTP header: X-API-Version: v2 → new service version, v1 → old — canary deploys', activeNodes:['gw'], animatedEdges:[], edgeColor:{}, nodeOverride:{'gw':{hit:true}} },
    { label:'All Routes Active', description:'Gateway holds the routing table — single config change to redirect traffic anywhere', activeNodes:['gw','s1','s2','s3'], animatedEdges:['gw-s1','gw-s2','gw-s3'], edgeColor:{'gw-s1':C.primary,'gw-s2':C.blue,'gw-s3':C.green} },
  ],
};

export const agAuthDef: FlowDef = {
  nodes: [
    { id:'cl',  label:'Client',     sublabel:'JWT token',       icon:(a)=>usr(a?C.primary:'#C4B5FD',a?C.primaryBg:'#F5F3FF'),     position:{x:20,y:170},  mobilePosition:{x:10,y:170} },
    { id:'gw',  label:'Gateway',    sublabel:'Verifies token',  icon:(a)=>box(a?C.orange:'#fdba74',a?C.orangeBg:'#fff7ed','GW'),  position:{x:230,y:170}, mobilePosition:{x:160,y:170} },
    { id:'ok',  label:'Allow',      sublabel:'Valid token',     icon:(a)=>box(a?C.green:'#86efac', a?C.greenBg:'#f0fff4', 'OK'), position:{x:430,y:60},  mobilePosition:{x:300,y:60} },
    { id:'deny',label:'Deny 401',   sublabel:'Invalid/expired', icon:(a)=>box(a?C.red:'#fca5a5',  a?C.redBg:'#fff5f5', '401'),  position:{x:430,y:280}, mobilePosition:{x:300,y:280} },
  ],
  edges: [
    { id:'cl-gw',  source:'cl',  target:'gw',  label:'Bearer token', sourceHandle:'right',  targetHandle:'left',    type:'smoothstep' },
    { id:'gw-ok',  source:'gw',  target:'ok',  label:'valid',        sourceHandle:'top-s',  targetHandle:'left',    type:'smoothstep' },
    { id:'gw-dn',  source:'gw',  target:'deny',label:'invalid',      sourceHandle:'bottom', targetHandle:'left',    type:'smoothstep' },
    { id:'ok-cl',  source:'ok',  target:'cl',  label:'200 OK',       sourceHandle:'left-s', targetHandle:'right-t', type:'smoothstep' },
    { id:'dn-cl',  source:'deny',target:'cl',  label:'401',          sourceHandle:'left-s', targetHandle:'right-t', type:'smoothstep' },
  ],
  steps: [
    { label:'Client Sends JWT', description:'Client includes Bearer token in Authorization header with every request', activeNodes:['cl','gw'], animatedEdges:['cl-gw'], edgeColor:{'cl-gw':C.primary} },
    { label:'Gateway Validates', description:'Gateway verifies JWT signature using the secret key — no DB lookup needed', activeNodes:['gw'], animatedEdges:[], edgeColor:{} },
    { label:'Valid Token', description:'Token signature checks out and is not expired — request forwarded to backend', activeNodes:['gw','ok'], animatedEdges:['gw-ok'], edgeColor:{'gw-ok':C.green} },
    { label:'Invalid/Expired Token', description:'Token is forged or expired — gateway returns 401 immediately without hitting backend', activeNodes:['gw','deny'], animatedEdges:['gw-dn'], edgeColor:{'gw-dn':C.red} },
    { label:'Response to Client', description:'Client gets 200 with data or 401 with error — backend services never see bad auth requests', activeNodes:['ok','deny','cl'], animatedEdges:['ok-cl','dn-cl'], edgeColor:{'ok-cl':C.green,'dn-cl':C.red} },
  ],
};

export const rateLimitingDef: FlowDef = {
  nodes: [
    { id:'cl',  label:'Client',       sublabel:'Many requests',  icon:(a)=>usr(a?C.primary:'#C4B5FD',a?C.primaryBg:'#F5F3FF'),     position:{x:20,y:170},  mobilePosition:{x:10,y:170} },
    { id:'rl',  label:'Rate Limiter', sublabel:'Token bucket',   icon:(a)=>box(a?C.blue:'#93c5fd', a?C.blueBg:'#eff6ff', 'RL'),   position:{x:230,y:170}, mobilePosition:{x:160,y:170} },
    { id:'ok',  label:'Allow',        sublabel:'Within limit',   icon:(a)=>box(a?C.green:'#86efac',a?C.greenBg:'#f0fff4', 'OK'),  position:{x:430,y:60},  mobilePosition:{x:300,y:60} },
    { id:'blk', label:'Block 429',    sublabel:'Too many req',   icon:(a)=>box(a?C.red:'#fca5a5', a?C.redBg:'#fff5f5',  '429'),  position:{x:430,y:280}, mobilePosition:{x:300,y:280} },
  ],
  edges: [
    { id:'cl-rl', source:'cl',  target:'rl',  label:'100 req/min', sourceHandle:'right',  targetHandle:'left',    type:'smoothstep' },
    { id:'rl-ok', source:'rl',  target:'ok',  label:'tokens left', sourceHandle:'top-s',  targetHandle:'left',    type:'smoothstep' },
    { id:'rl-bk', source:'rl',  target:'blk', label:'no tokens',   sourceHandle:'bottom', targetHandle:'left',    type:'smoothstep' },
    { id:'ok-cl', source:'ok',  target:'cl',  label:'200',         sourceHandle:'left-s', targetHandle:'right-t', type:'smoothstep' },
    { id:'bk-cl', source:'blk', target:'cl',  label:'429',         sourceHandle:'left-s', targetHandle:'right-t', type:'smoothstep' },
  ],
  steps: [
    { label:'Client Sends Requests', description:'Client fires many requests — could be a heavy user, bot, or DDoS attempt', activeNodes:['cl','rl'], animatedEdges:['cl-rl'], edgeColor:{'cl-rl':C.primary} },
    { label:'Token Bucket Check', description:'Each client has a bucket of tokens (e.g. 100/min) — each request consumes one token', activeNodes:['rl'], animatedEdges:[], edgeColor:{} },
    { label:'Tokens Available: Allow', description:'Bucket has tokens — request allowed through to backend services', activeNodes:['rl','ok'], animatedEdges:['rl-ok'], edgeColor:{'rl-ok':C.green} },
    { label:'Bucket Empty: Block', description:'Bucket depleted — gateway returns 429 Too Many Requests, refill happens each minute', activeNodes:['rl','blk'], animatedEdges:['rl-bk'], edgeColor:{'rl-bk':C.red} },
    { label:'Protects Backend', description:'Rate limiting prevents any single client from overwhelming backend services', activeNodes:['ok','blk','cl'], animatedEdges:['ok-cl','bk-cl'], edgeColor:{'ok-cl':C.green,'bk-cl':C.red} },
  ],
};

export const requestTransformDef: FlowDef = {
  nodes: [
    { id:'cl',  label:'Client',     sublabel:'v1 format',       icon:(a)=>usr(a?C.primary:'#C4B5FD',a?C.primaryBg:'#F5F3FF'),     position:{x:20,y:170},  mobilePosition:{x:10,y:170} },
    { id:'gw',  label:'Gateway',    sublabel:'Transform',       icon:(a)=>box(a?C.orange:'#fdba74',a?C.orangeBg:'#fff7ed','GW'),  position:{x:230,y:170}, mobilePosition:{x:160,y:170} },
    { id:'svc', label:'Service',    sublabel:'v2 format',       icon:(a)=>srv(a?C.green:'#86efac',a?C.greenBg:'#f0fff4'),         position:{x:430,y:170}, mobilePosition:{x:300,y:170} },
    { id:'hdr', label:'Headers',    sublabel:'Add/Remove',      icon:(a)=>box(a?C.blue:'#93c5fd', a?C.blueBg:'#eff6ff','HDR'),   position:{x:230,y:30},  mobilePosition:{x:160,y:30} },
    { id:'bod', label:'Body',       sublabel:'Reformat JSON',   icon:(a)=>box(a?C.primary:'#C4B5FD',a?C.primaryBg:'#F5F3FF','BOD'), position:{x:230,y:310}, mobilePosition:{x:160,y:310} },
  ],
  edges: [
    { id:'cl-gw',  source:'cl',  target:'gw',  label:'v1 req',   sourceHandle:'right',  targetHandle:'left',    type:'smoothstep' },
    { id:'gw-h',   source:'gw',  target:'hdr', label:'modify',   sourceHandle:'top-s',  targetHandle:'left',    type:'smoothstep' },
    { id:'gw-b',   source:'gw',  target:'bod', label:'rewrite',  sourceHandle:'bottom', targetHandle:'left',    type:'smoothstep' },
    { id:'gw-svc', source:'gw',  target:'svc', label:'v2 req',   sourceHandle:'right',  targetHandle:'left',    type:'smoothstep' },
  ],
  steps: [
    { label:'Client Sends Old Format', description:'Legacy client sends v1 JSON format — new backend expects v2 format', activeNodes:['cl','gw'], animatedEdges:['cl-gw'], edgeColor:{'cl-gw':C.primary} },
    { label:'Transform Headers', description:'Gateway adds X-Request-ID, removes internal headers, adds authentication headers', activeNodes:['gw','hdr'], animatedEdges:['gw-h'], edgeColor:{'gw-h':C.blue} },
    { label:'Transform Body', description:'Gateway rewrites JSON body from v1 to v2 schema — renames fields, restructures nesting', activeNodes:['gw','bod'], animatedEdges:['gw-b'], edgeColor:{'gw-b':C.primary} },
    { label:'Forward to Service', description:'Transformed request forwarded — backend service only sees v2 format, unaware of legacy clients', activeNodes:['gw','svc'], animatedEdges:['gw-svc'], edgeColor:{'gw-svc':C.green} },
    { label:'API Versioning', description:'Gateway enables API evolution — clients on v1, v2, v3 all supported simultaneously via transformation', activeNodes:['cl','gw','svc'], animatedEdges:['cl-gw','gw-svc'], edgeColor:{'cl-gw':C.primary,'gw-svc':C.green} },
  ],
};

export const apiAggregationDef: FlowDef = {
  nodes: [
    { id:'cl',  label:'Client',       sublabel:'One request',    icon:(a)=>usr(a?C.primary:'#C4B5FD',a?C.primaryBg:'#F5F3FF'),     position:{x:20,y:170},  mobilePosition:{x:10,y:170} },
    { id:'gw',  label:'Gateway',      sublabel:'Aggregates',     icon:(a)=>box(a?C.orange:'#fdba74',a?C.orangeBg:'#fff7ed','GW'),  position:{x:220,y:170}, mobilePosition:{x:150,y:170} },
    { id:'s1',  label:'User Svc',     sublabel:'User data',      icon:(a)=>srv(a?C.primary:'#C4B5FD',a?C.primaryBg:'#F5F3FF'),     position:{x:420,y:30},  mobilePosition:{x:290,y:30} },
    { id:'s2',  label:'Order Svc',    sublabel:'Order data',     icon:(a)=>srv(a?C.blue:'#93c5fd',  a?C.blueBg:'#eff6ff'),         position:{x:420,y:170}, mobilePosition:{x:290,y:170} },
    { id:'s3',  label:'Product Svc',  sublabel:'Product data',   icon:(a)=>srv(a?C.green:'#86efac', a?C.greenBg:'#f0fff4'),        position:{x:420,y:310}, mobilePosition:{x:290,y:310} },
  ],
  edges: [
    { id:'cl-gw',  source:'cl',  target:'gw', label:'GET /dashboard', sourceHandle:'right',  targetHandle:'left',    type:'smoothstep' },
    { id:'gw-s1',  source:'gw',  target:'s1', label:'call',           sourceHandle:'top-s',  targetHandle:'left',    type:'smoothstep' },
    { id:'gw-s2',  source:'gw',  target:'s2', label:'call',           sourceHandle:'right',  targetHandle:'left',    type:'smoothstep' },
    { id:'gw-s3',  source:'gw',  target:'s3', label:'call',           sourceHandle:'bottom', targetHandle:'left',    type:'smoothstep' },
    { id:'gw-cl',  source:'gw',  target:'cl', label:'merged response',sourceHandle:'left-s', targetHandle:'right-t', type:'smoothstep' },
  ],
  steps: [
    { label:'Client Needs Dashboard', description:'Mobile client needs user info, recent orders, and recommended products — 3 services', activeNodes:['cl','gw'], animatedEdges:['cl-gw'], edgeColor:{'cl-gw':C.primary} },
    { label:'Gateway Fans Out', description:'Gateway calls all 3 services in parallel — no sequential waiting', activeNodes:['gw','s1','s2','s3'], animatedEdges:['gw-s1','gw-s2','gw-s3'], edgeColor:{'gw-s1':C.primary,'gw-s2':C.blue,'gw-s3':C.green} },
    { label:'Waits for All Responses', description:'Gateway waits for the slowest service to respond — or times out individual calls', activeNodes:['s1','s2','s3'], animatedEdges:[], edgeColor:{} },
    { label:'Merges into One Response', description:'Gateway combines all data into a single JSON response — mobile client makes one round trip', activeNodes:['gw','cl'], animatedEdges:['gw-cl'], edgeColor:{'gw-cl':C.green} },
    { label:'Reduces Mobile Round Trips', description:'Without gateway: 3 requests from mobile. With aggregation: 1 request — huge battery and latency saving', activeNodes:['cl','gw'], animatedEdges:['cl-gw','gw-cl'], edgeColor:{'cl-gw':C.primary,'gw-cl':C.green} },
  ],
};

export const agSecurityDef: FlowDef = {
  nodes: [
    { id:'inet', label:'Internet',    sublabel:'Untrusted',      icon:(a)=>box(a?C.red:'#fca5a5',  a?C.redBg:'#fff5f5', 'NET'),  position:{x:20,y:170},  mobilePosition:{x:10,y:170} },
    { id:'gw',   label:'Gateway',     sublabel:'Security layer', icon:(a)=>box(a?C.orange:'#fdba74',a?C.orangeBg:'#fff7ed','GW'), position:{x:230,y:170}, mobilePosition:{x:160,y:170} },
    { id:'waf',  label:'WAF',         sublabel:'SQL inject block',icon:(a)=>box(a?C.blue:'#93c5fd', a?C.blueBg:'#eff6ff','WAF'),  position:{x:430,y:60},  mobilePosition:{x:300,y:60} },
    { id:'svc',  label:'Backend',     sublabel:'Protected',      icon:(a)=>srv(a?C.green:'#86efac',a?C.greenBg:'#f0fff4'),       position:{x:430,y:280}, mobilePosition:{x:300,y:280} },
  ],
  edges: [
    { id:'i-gw',  source:'inet', target:'gw',  label:'all traffic',  sourceHandle:'right',  targetHandle:'left',    type:'smoothstep' },
    { id:'gw-waf',source:'gw',   target:'waf', label:'inspect',      sourceHandle:'top-s',  targetHandle:'left',    type:'smoothstep' },
    { id:'waf-s', source:'waf',  target:'svc', label:'clean',        sourceHandle:'bottom', targetHandle:'top',     type:'smoothstep' },
    { id:'gw-s',  source:'gw',   target:'svc', label:'forward',      sourceHandle:'bottom', targetHandle:'left',    type:'smoothstep' },
  ],
  steps: [
    { label:'All Traffic Through Gateway', description:'Internet traffic enters exclusively through gateway — backend services have no public IPs', activeNodes:['inet','gw'], animatedEdges:['i-gw'], edgeColor:{'i-gw':C.primary} },
    { label:'WAF Inspection', description:'Web Application Firewall blocks SQL injection, XSS, and known attack patterns before they reach services', activeNodes:['gw','waf'], animatedEdges:['gw-waf'], edgeColor:{'gw-waf':C.blue} },
    { label:'DDoS Protection', description:'Gateway absorbs volumetric attacks — rate limits, IP blocking, challenge pages for suspicious clients', activeNodes:['gw'], animatedEdges:[], edgeColor:{}, nodeOverride:{'gw':{hit:true}} },
    { label:'TLS Termination', description:'HTTPS decrypted at gateway — backend communication on internal network uses HTTP (saves CPU)', activeNodes:['inet','gw'], animatedEdges:['i-gw'], edgeColor:{'i-gw':C.orange} },
    { label:'Clean Traffic Reaches Backend', description:'Only verified, authenticated, rate-limited clean traffic reaches internal services', activeNodes:['waf','svc'], animatedEdges:['waf-s'], edgeColor:{'waf-s':C.green} },
  ],
};

export const apiGatewayFlowMap: Record<string, FlowDef> = {
  'API Gateway Fundamentals':              agFundamentalsDef,
  'API Gateway Architecture':              agArchitectureDef,
  'API Gateway vs Reverse Proxy':          agVsReverseProxyDef,
  'Request Routing and Forwarding':        requestRoutingDef,
  'Authentication and Authorization':      agAuthDef,
  'Rate Limiting and Throttling':          rateLimitingDef,
  'Request and Response Transformation':   requestTransformDef,
  'API Aggregation and Composition':       apiAggregationDef,
  'Security and Monitoring':               agSecurityDef,
};
