import React from 'react';
import { C, type FlowDef } from '../HLDFlow';

const box = (c: string, bg: string, t: string) => <svg width="32" height="28" viewBox="0 0 48 40" fill="none"><rect x="4" y="4" width="40" height="32" rx="6" fill={bg} stroke={c} strokeWidth="2"/><text x="24" y="24" textAnchor="middle" fontSize="9" fontWeight="700" fill={c}>{t}</text></svg>;
const srv = (c: string, bg: string) => <svg width="32" height="32" viewBox="0 0 48 48" fill="none"><rect x="4" y="8" width="40" height="10" rx="3" fill={c} stroke={c} strokeWidth="1.5"/><rect x="4" y="22" width="40" height="10" rx="3" fill={bg} stroke={c} strokeWidth="1.5"/><rect x="4" y="36" width="40" height="10" rx="3" fill={bg} stroke={c} strokeWidth="1.5"/><circle cx="36" cy="13" r="2" fill="white"/></svg>;
const usr = (c: string, bg: string) => <svg width="28" height="34" viewBox="0 0 44 52" fill="none"><circle cx="22" cy="14" r="10" fill={c} stroke={c} strokeWidth="2"/><path d="M4 46c0-9.941 8.059-18 18-18s18 8.059 18 18" fill={bg} stroke={c} strokeWidth="2" strokeLinecap="round"/></svg>;
const cyl = (c: string, bg: string) => <svg width="32" height="36" viewBox="0 0 44 52" fill="none"><ellipse cx="22" cy="10" rx="18" ry="6" fill={c} stroke={c} strokeWidth="2"/><rect x="4" y="10" width="36" height="28" fill={bg} stroke={c} strokeWidth="2"/><ellipse cx="22" cy="38" rx="18" ry="6" fill={bg} stroke={c} strokeWidth="2"/></svg>;

export const scalabilityFundamentalsDef: FlowDef = {
  nodes: [
    { id:'s1', label:'1 Server',    sublabel:'Initial state',    icon:(a)=>srv(a?C.primary:'#C4B5FD',a?C.primaryBg:'#F5F3FF'), position:{x:30,y:170}, mobilePosition:{x:10,y:170} },
    { id:'s3', label:'3 Servers',   sublabel:'Horizontal scale', icon:(a)=>srv(a?C.green:'#86efac', a?C.greenBg:'#f0fff4'),   position:{x:230,y:60},  mobilePosition:{x:160,y:60} },
    { id:'big',label:'Bigger Box',  sublabel:'Vertical scale',   icon:(a)=>srv(a?C.orange:'#fdba74',a?C.orangeBg:'#fff7ed'),  position:{x:230,y:280}, mobilePosition:{x:160,y:280} },
    { id:'lb', label:'Load Bal.',   sublabel:'Distributes load', icon:(a)=>box(a?C.blue:'#93c5fd',  a?C.blueBg:'#eff6ff','LB'), position:{x:430,y:170}, mobilePosition:{x:300,y:170} },
  ],
  edges: [
    { id:'s1-h', source:'s1',  target:'s3',  label:'scale out', sourceHandle:'top-s',  targetHandle:'left', type:'smoothstep' },
    { id:'s1-v', source:'s1',  target:'big', label:'scale up',  sourceHandle:'bottom', targetHandle:'left', type:'smoothstep' },
    { id:'h-lb', source:'s3',  target:'lb',  label:'needs LB',  sourceHandle:'right',  targetHandle:'top',  type:'smoothstep' },
    { id:'v-lb', source:'big', target:'lb',  label:'still SPOF',sourceHandle:'right',  targetHandle:'bottom-t', type:'smoothstep' },
  ],
  steps: [
    { label:'Single Server Limit', description:'One server handles all traffic — eventually hits CPU, memory, or network limits', activeNodes:['s1'], animatedEdges:[], edgeColor:{} },
    { label:'Vertical Scaling (Scale Up)', description:'Add more CPU/RAM to existing server — simple but has hardware limits and causes downtime', activeNodes:['s1','big'], animatedEdges:['s1-v'], edgeColor:{'s1-v':C.orange} },
    { label:'Horizontal Scaling (Scale Out)', description:'Add more servers — no hardware ceiling, enables high availability', activeNodes:['s1','s3'], animatedEdges:['s1-h'], edgeColor:{'s1-h':C.green} },
    { label:'Load Balancer Required', description:'With multiple servers you need a load balancer to distribute traffic evenly', activeNodes:['s3','lb'], animatedEdges:['h-lb'], edgeColor:{'h-lb':C.blue} },
    { label:'Vertical vs Horizontal', description:'Vertical: easy but limited. Horizontal: unlimited scale but needs stateless design and LB', activeNodes:['s3','big','lb'], animatedEdges:['s1-h','s1-v','h-lb'], edgeColor:{'s1-h':C.green,'s1-v':C.orange,'h-lb':C.blue} },
  ],
};

export const verticalHorizontalDef: FlowDef = {
  nodes: [
    { id:'app', label:'App',       sublabel:'Growing load',      icon:(a)=>srv(a?C.primary:'#C4B5FD',a?C.primaryBg:'#F5F3FF'), position:{x:30,y:170}, mobilePosition:{x:10,y:170} },
    { id:'vu',  label:'↑ CPU/RAM', sublabel:'Vertical up',       icon:(a)=>box(a?C.orange:'#fdba74',a?C.orangeBg:'#fff7ed','↑'), position:{x:240,y:60},  mobilePosition:{x:170,y:60} },
    { id:'s2',  label:'+ Server',  sublabel:'Horizontal add',    icon:(a)=>srv(a?C.green:'#86efac', a?C.greenBg:'#f0fff4'),   position:{x:240,y:280}, mobilePosition:{x:170,y:280} },
    { id:'lim', label:'Limit',     sublabel:'Max hardware',      icon:(a)=>box(a?C.red:'#fca5a5',  a?C.redBg:'#fff5f5', '!'), position:{x:430,y:60},  mobilePosition:{x:300,y:60} },
    { id:'inf', label:'Infinite',  sublabel:'No ceiling',        icon:(a)=>box(a?C.green:'#86efac', a?C.greenBg:'#f0fff4','∞'), position:{x:430,y:280}, mobilePosition:{x:300,y:280} },
  ],
  edges: [
    { id:'a-v',  source:'app', target:'vu',  label:'upgrade', sourceHandle:'top-s',  targetHandle:'left',  type:'smoothstep' },
    { id:'a-h',  source:'app', target:'s2',  label:'add',     sourceHandle:'bottom', targetHandle:'left',  type:'smoothstep' },
    { id:'v-l',  source:'vu',  target:'lim', label:'ceiling', sourceHandle:'right',  targetHandle:'left',  type:'smoothstep' },
    { id:'h-i',  source:'s2',  target:'inf', label:'scales',  sourceHandle:'right',  targetHandle:'left',  type:'smoothstep' },
  ],
  steps: [
    { label:'Load Increases', description:'Traffic grows — current server cannot keep up', activeNodes:['app'], animatedEdges:[], edgeColor:{} },
    { label:'Vertical: Upgrade Hardware', description:'Upgrade to a bigger instance — more CPU, more RAM, faster disk', activeNodes:['app','vu'], animatedEdges:['a-v'], edgeColor:{'a-v':C.orange} },
    { label:'Vertical Hits a Ceiling', description:'There is a maximum server size — and upgrades require downtime', activeNodes:['vu','lim'], animatedEdges:['v-l'], edgeColor:{'v-l':C.red} },
    { label:'Horizontal: Add Servers', description:'Add another server and distribute load — no ceiling on how many you can add', activeNodes:['app','s2'], animatedEdges:['a-h'], edgeColor:{'a-h':C.green} },
    { label:'Horizontal Scales Infinitely', description:'Keep adding servers as traffic grows — requires stateless design', activeNodes:['s2','inf'], animatedEdges:['h-i'], edgeColor:{'h-i':C.green} },
  ],
};

export const elasticityAutoScalingDef: FlowDef = {
  nodes: [
    { id:'mon', label:'Monitor',    sublabel:'CPU / RPS',         icon:(a)=>box(a?C.blue:'#93c5fd',  a?C.blueBg:'#eff6ff','MON'), position:{x:30,y:170},  mobilePosition:{x:10,y:170} },
    { id:'pol', label:'Policy',     sublabel:'Scale rules',       icon:(a)=>box(a?C.orange:'#fdba74',a?C.orangeBg:'#fff7ed','POL'), position:{x:230,y:170}, mobilePosition:{x:160,y:170} },
    { id:'up',  label:'Scale Out',  sublabel:'Add instances',     icon:(a)=>srv(a?C.green:'#86efac', a?C.greenBg:'#f0fff4'),       position:{x:430,y:60},  mobilePosition:{x:300,y:60} },
    { id:'dn',  label:'Scale In',   sublabel:'Remove instances',  icon:(a)=>srv(a?C.red:'#fca5a5',   a?C.redBg:'#fff5f5'),         position:{x:430,y:280}, mobilePosition:{x:300,y:280} },
    { id:'cost',label:'Cost',       sublabel:'Pay as you go',     icon:(a)=>box(a?C.primary:'#C4B5FD',a?C.primaryBg:'#F5F3FF','$'), position:{x:600,y:170}, mobilePosition:{x:420,y:170} },
  ],
  edges: [
    { id:'m-p',  source:'mon', target:'pol', label:'trigger',  sourceHandle:'right',  targetHandle:'left',    type:'smoothstep' },
    { id:'p-u',  source:'pol', target:'up',  label:'CPU>80%',  sourceHandle:'top-s',  targetHandle:'left',    type:'smoothstep' },
    { id:'p-d',  source:'pol', target:'dn',  label:'CPU<20%',  sourceHandle:'bottom', targetHandle:'left',    type:'smoothstep' },
    { id:'u-c',  source:'up',  target:'cost',label:'more $$',  sourceHandle:'right',  targetHandle:'top',     type:'smoothstep' },
    { id:'d-c',  source:'dn',  target:'cost',label:'saves $$', sourceHandle:'right',  targetHandle:'bottom-t',type:'smoothstep' },
  ],
  steps: [
    { label:'Continuous Monitoring', description:'Auto-scaler monitors CPU usage, request rate, queue depth, or custom metrics', activeNodes:['mon'], animatedEdges:[], edgeColor:{} },
    { label:'Scaling Policy Evaluates', description:'Policy rules define thresholds: scale out if CPU > 80% for 5 minutes', activeNodes:['mon','pol'], animatedEdges:['m-p'], edgeColor:{'m-p':C.blue} },
    { label:'Scale Out (High Load)', description:'New instances launch automatically — traffic spreads across more servers', activeNodes:['pol','up'], animatedEdges:['p-u'], edgeColor:{'p-u':C.green} },
    { label:'Scale In (Low Load)', description:'Idle instances are terminated — reduces cost during off-peak hours', activeNodes:['pol','dn'], animatedEdges:['p-d'], edgeColor:{'p-d':C.orange} },
    { label:'Cost Optimization', description:'Elasticity means you pay for exactly what you use — no idle capacity waste', activeNodes:['up','dn','cost'], animatedEdges:['u-c','d-c'], edgeColor:{'u-c':C.red,'d-c':C.green} },
  ],
};

export const statelessStatefulDef: FlowDef = {
  nodes: [
    { id:'u',   label:'User',      sublabel:'Session request',  icon:(a)=>usr(a?C.primary:'#C4B5FD',a?C.primaryBg:'#F5F3FF'),     position:{x:20,y:170},  mobilePosition:{x:10,y:170} },
    { id:'ss',  label:'Stateful',  sublabel:'Stores session',   icon:(a)=>srv(a?C.orange:'#fdba74', a?C.orangeBg:'#fff7ed'),       position:{x:220,y:60},  mobilePosition:{x:150,y:60} },
    { id:'sl',  label:'Stateless', sublabel:'No local state',   icon:(a)=>srv(a?C.green:'#86efac',  a?C.greenBg:'#f0fff4'),       position:{x:220,y:280}, mobilePosition:{x:150,y:280} },
    { id:'st',  label:'Session Store',sublabel:'Redis / DB',    icon:(a)=>cyl(a?C.blue:'#93c5fd',   a?C.blueBg:'#eff6ff'),        position:{x:430,y:280}, mobilePosition:{x:300,y:280} },
    { id:'prob',label:'Problem',   sublabel:'Sticky sessions!', icon:(a)=>box(a?C.red:'#fca5a5',    a?C.redBg:'#fff5f5',   '!'),  position:{x:430,y:60},  mobilePosition:{x:300,y:60} },
  ],
  edges: [
    { id:'u-ss',  source:'u',   target:'ss', label:'request', sourceHandle:'top-s',  targetHandle:'left',    type:'smoothstep' },
    { id:'u-sl',  source:'u',   target:'sl', label:'request', sourceHandle:'bottom', targetHandle:'left',    type:'smoothstep' },
    { id:'ss-p',  source:'ss',  target:'prob',label:'must hit same server', sourceHandle:'right', targetHandle:'left', type:'smoothstep' },
    { id:'sl-st', source:'sl',  target:'st', label:'fetch session', sourceHandle:'right', targetHandle:'left', type:'smoothstep' },
  ],
  steps: [
    { label:'Stateful Server Problem', description:'Server stores session in memory — user MUST hit the same server every time (sticky sessions)', activeNodes:['u','ss','prob'], animatedEdges:['u-ss','ss-p'], edgeColor:{'u-ss':C.orange,'ss-p':C.red} },
    { label:'Cannot Scale Freely', description:'If the stateful server goes down, all sessions are lost — also cannot freely add servers', activeNodes:['ss','prob'], animatedEdges:[], edgeColor:{}, nodeOverride:{'prob':{miss:true}} },
    { label:'Stateless Design', description:'Server stores NO session locally — each request is fully self-contained', activeNodes:['u','sl'], animatedEdges:['u-sl'], edgeColor:{'u-sl':C.green} },
    { label:'External Session Store', description:'Session data lives in Redis or a DB — any server can serve any request', activeNodes:['sl','st'], animatedEdges:['sl-st'], edgeColor:{'sl-st':C.blue} },
    { label:'Scale Freely', description:'Any server instance can handle any request — add or remove servers without sticky sessions', activeNodes:['sl'], animatedEdges:['u-sl','sl-st'], edgeColor:{'u-sl':C.green,'sl-st':C.blue} },
  ],
};

export const capacityPlanningDef: FlowDef = {
  nodes: [
    { id:'rps', label:'RPS',       sublabel:'Req/second',       icon:(a)=>box(a?C.primary:'#C4B5FD',a?C.primaryBg:'#F5F3FF','RPS'), position:{x:30,y:60},  mobilePosition:{x:10,y:60} },
    { id:'sto', label:'Storage',   sublabel:'GB/TB needed',     icon:(a)=>box(a?C.green:'#86efac', a?C.greenBg:'#f0fff4', 'STO'),  position:{x:30,y:280}, mobilePosition:{x:10,y:280} },
    { id:'bw',  label:'Bandwidth', sublabel:'Mbps / Gbps',      icon:(a)=>box(a?C.orange:'#fdba74',a?C.orangeBg:'#fff7ed','BW'),   position:{x:240,y:170}, mobilePosition:{x:160,y:170} },
    { id:'srv', label:'Fleet Size',sublabel:'# of servers',     icon:(a)=>srv(a?C.blue:'#93c5fd',  a?C.blueBg:'#eff6ff'),          position:{x:450,y:170}, mobilePosition:{x:310,y:170} },
  ],
  edges: [
    { id:'r-b',  source:'rps', target:'bw',  label:'drives', sourceHandle:'right',  targetHandle:'top',     type:'smoothstep' },
    { id:'s-b',  source:'sto', target:'bw',  label:'drives', sourceHandle:'right',  targetHandle:'bottom-t',type:'smoothstep' },
    { id:'b-sv', source:'bw',  target:'srv', label:'size',   sourceHandle:'right',  targetHandle:'left',    type:'smoothstep' },
  ],
  steps: [
    { label:'Estimate RPS', description:'Back-of-envelope: 100M DAU, 10 requests/day = 100M×10 / 86400 ≈ 11,500 RPS', activeNodes:['rps'], animatedEdges:[], edgeColor:{} },
    { label:'Estimate Storage', description:'User data × retention: 11,500 RPS × 1 KB payload × 86400 s = ~1 TB/day', activeNodes:['sto'], animatedEdges:[], edgeColor:{} },
    { label:'Calculate Bandwidth', description:'Both RPS and storage growth drive bandwidth requirements for servers and CDN', activeNodes:['rps','sto','bw'], animatedEdges:['r-b','s-b'], edgeColor:{'r-b':C.primary,'s-b':C.green} },
    { label:'Size the Fleet', description:'If one server handles 1,000 RPS, you need 11,500/1,000 = 12 servers (add 20% headroom = 15)', activeNodes:['bw','srv'], animatedEdges:['b-sv'], edgeColor:{'b-sv':C.blue} },
    { label:'Add Headroom', description:'Always plan for 20-30% extra — traffic spikes, rolling deploys, and unexpected growth', activeNodes:['srv'], animatedEdges:[], edgeColor:{}, nodeOverride:{'srv':{hit:true}} },
  ],
};

export const bottleneckIdentificationDef: FlowDef = {
  nodes: [
    { id:'req', label:'Request',   sublabel:'Enters system',    icon:(a)=>usr(a?C.primary:'#C4B5FD',a?C.primaryBg:'#F5F3FF'),     position:{x:20,y:170},  mobilePosition:{x:10,y:170} },
    { id:'cpu', label:'CPU',       sublabel:'Computation',      icon:(a)=>box(a?C.orange:'#fdba74',a?C.orangeBg:'#fff7ed','CPU'), position:{x:220,y:60},  mobilePosition:{x:150,y:60} },
    { id:'db',  label:'Database',  sublabel:'Slow queries',     icon:(a)=>cyl(a?C.red:'#fca5a5',   a?C.redBg:'#fff5f5'),          position:{x:220,y:280}, mobilePosition:{x:150,y:280} },
    { id:'net', label:'Network',   sublabel:'Bandwidth',        icon:(a)=>box(a?C.blue:'#93c5fd',  a?C.blueBg:'#eff6ff', 'NET'), position:{x:420,y:170}, mobilePosition:{x:300,y:170} },
    { id:'fix', label:'Fix',       sublabel:'Optimize here',    icon:(a)=>box(a?C.green:'#86efac', a?C.greenBg:'#f0fff4', 'FIX'), position:{x:600,y:170}, mobilePosition:{x:420,y:170} },
  ],
  edges: [
    { id:'r-cpu', source:'req', target:'cpu', label:'heavy logic', sourceHandle:'top-s',  targetHandle:'left',    type:'smoothstep' },
    { id:'r-db',  source:'req', target:'db',  label:'N+1 query',   sourceHandle:'bottom', targetHandle:'left',    type:'smoothstep' },
    { id:'r-net', source:'req', target:'net', label:'large resp',  sourceHandle:'right',  targetHandle:'left',    type:'smoothstep' },
    { id:'cpu-f', source:'cpu', target:'fix', label:'parallelize', sourceHandle:'right',  targetHandle:'top',     type:'smoothstep' },
    { id:'db-f',  source:'db',  target:'fix', label:'index / cache',sourceHandle:'right', targetHandle:'bottom-t',type:'smoothstep' },
    { id:'net-f', source:'net', target:'fix', label:'compress',    sourceHandle:'right',  targetHandle:'left',    type:'smoothstep' },
  ],
  steps: [
    { label:'Find the Bottleneck First', description:'Never optimize blindly — profile the system to find WHERE time is actually spent', activeNodes:['req'], animatedEdges:[], edgeColor:{} },
    { label:'CPU Bottleneck', description:'Heavy computation blocks threads — fix by parallelizing, caching results, or offloading to workers', activeNodes:['req','cpu'], animatedEdges:['r-cpu'], edgeColor:{'r-cpu':C.orange} },
    { label:'Database Bottleneck', description:'N+1 queries, missing indexes, or unsharded tables — most common bottleneck in web apps', activeNodes:['req','db'], animatedEdges:['r-db'], edgeColor:{'r-db':C.red} },
    { label:'Network Bottleneck', description:'Large payloads or high latency — fix with compression, CDN, pagination', activeNodes:['req','net'], animatedEdges:['r-net'], edgeColor:{'r-net':C.blue} },
    { label:'Apply Targeted Fix', description:'Fix the bottleneck identified by profiling — adding servers cannot fix a slow DB query', activeNodes:['cpu','db','net','fix'], animatedEdges:['cpu-f','db-f','net-f'], edgeColor:{'cpu-f':C.orange,'db-f':C.red,'net-f':C.blue} },
  ],
};

export const databaseScalingDef: FlowDef = {
  nodes: [
    { id:'app', label:'App',       sublabel:'DB requests',      icon:(a)=>srv(a?C.primary:'#C4B5FD',a?C.primaryBg:'#F5F3FF'),     position:{x:20,y:170},  mobilePosition:{x:10,y:170} },
    { id:'pri', label:'Primary DB',sublabel:'Read + Write',     icon:(a)=>cyl(a?C.primary:'#C4B5FD',a?C.primaryBg:'#F5F3FF'),     position:{x:220,y:60},  mobilePosition:{x:150,y:60} },
    { id:'rep', label:'Replica',   sublabel:'Read only',        icon:(a)=>cyl(a?C.blue:'#93c5fd',   a?C.blueBg:'#eff6ff'),        position:{x:220,y:280}, mobilePosition:{x:150,y:280} },
    { id:'sh1', label:'Shard 1',   sublabel:'User A-M',         icon:(a)=>cyl(a?C.green:'#86efac',  a?C.greenBg:'#f0fff4'),       position:{x:430,y:60},  mobilePosition:{x:300,y:60} },
    { id:'sh2', label:'Shard 2',   sublabel:'User N-Z',         icon:(a)=>cyl(a?C.orange:'#fdba74', a?C.orangeBg:'#fff7ed'),      position:{x:430,y:280}, mobilePosition:{x:300,y:280} },
  ],
  edges: [
    { id:'a-p',   source:'app', target:'pri', label:'write',    sourceHandle:'top-s',  targetHandle:'left',    type:'smoothstep' },
    { id:'a-r',   source:'app', target:'rep', label:'read',     sourceHandle:'bottom', targetHandle:'left',    type:'smoothstep' },
    { id:'p-rep', source:'pri', target:'rep', label:'replicate',sourceHandle:'bottom', targetHandle:'top',     type:'smoothstep' },
    { id:'p-s1',  source:'pri', target:'sh1', label:'shard A-M',sourceHandle:'right',  targetHandle:'left',    type:'smoothstep' },
    { id:'p-s2',  source:'pri', target:'sh2', label:'shard N-Z',sourceHandle:'bottom', targetHandle:'left',    type:'smoothstep' },
  ],
  steps: [
    { label:'Read Replicas', description:'Replicate data to read replicas — route read-heavy traffic there, writes go to primary', activeNodes:['app','pri','rep'], animatedEdges:['a-p','a-r','p-rep'], edgeColor:{'a-p':C.primary,'a-r':C.blue,'p-rep':C.green} },
    { label:'Write to Primary Only', description:'All writes go to primary — replicas sync asynchronously (small lag acceptable)', activeNodes:['app','pri'], animatedEdges:['a-p'], edgeColor:{'a-p':C.primary} },
    { label:'Read from Replica', description:'Reads distributed across replicas — scale read throughput without adding primaries', activeNodes:['app','rep'], animatedEdges:['a-r'], edgeColor:{'a-r':C.blue} },
    { label:'Sharding for Writes', description:'When write volume is too high, shard: split data by key range or hash across multiple DBs', activeNodes:['pri','sh1','sh2'], animatedEdges:['p-s1','p-s2'], edgeColor:{'p-s1':C.green,'p-s2':C.orange} },
    { label:'Replication Lag', description:'Replicas may lag slightly behind — handle eventual consistency in read paths', activeNodes:['pri','rep'], animatedEdges:['p-rep'], edgeColor:{'p-rep':C.orange} },
  ],
};

export const scalingStrategiesDef: FlowDef = {
  nodes: [
    { id:'app', label:'App Layer',   sublabel:'Stateless',        icon:(a)=>srv(a?C.primary:'#C4B5FD',a?C.primaryBg:'#F5F3FF'), position:{x:30,y:60},  mobilePosition:{x:10,y:60} },
    { id:'cch', label:'Cache Layer', sublabel:'Redis',            icon:(a)=>cyl(a?C.blue:'#93c5fd',   a?C.blueBg:'#eff6ff'),    position:{x:30,y:280}, mobilePosition:{x:10,y:280} },
    { id:'cdn', label:'CDN',         sublabel:'Static content',   icon:(a)=>box(a?C.orange:'#fdba74',a?C.orangeBg:'#fff7ed','CDN'), position:{x:250,y:60},  mobilePosition:{x:170,y:60} },
    { id:'mq',  label:'Queue',       sublabel:'Async tasks',      icon:(a)=>box(a?C.green:'#86efac', a?C.greenBg:'#f0fff4', 'MQ'),  position:{x:250,y:280}, mobilePosition:{x:170,y:280} },
    { id:'db',  label:'DB + Shards', sublabel:'Data layer',       icon:(a)=>cyl(a?C.green:'#86efac', a?C.greenBg:'#f0fff4'),       position:{x:470,y:170}, mobilePosition:{x:320,y:170} },
  ],
  edges: [
    { id:'a-cdn',source:'app', target:'cdn',label:'offload static',sourceHandle:'right', targetHandle:'left',    type:'smoothstep' },
    { id:'c-mq', source:'cch', target:'mq', label:'async work',    sourceHandle:'right', targetHandle:'left',    type:'smoothstep' },
    { id:'cdn-db',source:'cdn',target:'db', label:'origin',        sourceHandle:'right', targetHandle:'top',     type:'smoothstep' },
    { id:'mq-db', source:'mq', target:'db', label:'write',         sourceHandle:'right', targetHandle:'bottom-t',type:'smoothstep' },
    { id:'a-c',  source:'app', target:'cch',label:'caches',        sourceHandle:'bottom',targetHandle:'top',     type:'smoothstep' },
  ],
  steps: [
    { label:'Layer Your Scaling Strategy', description:'No single technique is enough — combine horizontal scaling, caching, CDN, and async queues', activeNodes:['app','cch','cdn','mq','db'], animatedEdges:[], edgeColor:{} },
    { label:'Stateless App Tier', description:'Scale horizontally freely — session in Redis, any server handles any request', activeNodes:['app','cch'], animatedEdges:['a-c'], edgeColor:{'a-c':C.blue} },
    { label:'CDN for Static Content', description:'Images, JS, CSS served from edge — removes load from origin servers entirely', activeNodes:['app','cdn'], animatedEdges:['a-cdn'], edgeColor:{'a-cdn':C.orange} },
    { label:'Async Queue for Heavy Work', description:'Move slow tasks (email, video encoding, reports) to background workers via queue', activeNodes:['cch','mq'], animatedEdges:['c-mq'], edgeColor:{'c-mq':C.green} },
    { label:'Sharded Database', description:'Split write-heavy data across shards — each shard handles a subset of the data', activeNodes:['cdn','mq','db'], animatedEdges:['cdn-db','mq-db'], edgeColor:{'cdn-db':C.orange,'mq-db':C.green} },
  ],
};

export const trafficSpikesDef: FlowDef = {
  nodes: [
    { id:'spike', label:'Traffic Spike', sublabel:'10x normal',   icon:(a)=>box(a?C.red:'#fca5a5',  a?C.redBg:'#fff5f5',  '↑'), position:{x:20,y:170},  mobilePosition:{x:10,y:170} },
    { id:'lb',    label:'Load Bal.',     sublabel:'Absorbs load',  icon:(a)=>box(a?C.orange:'#fdba74',a?C.orangeBg:'#fff7ed','LB'), position:{x:230,y:60},  mobilePosition:{x:160,y:60} },
    { id:'que',   label:'Queue',         sublabel:'Buffers work',  icon:(a)=>box(a?C.blue:'#93c5fd', a?C.blueBg:'#eff6ff','MQ'),  position:{x:230,y:280}, mobilePosition:{x:160,y:280} },
    { id:'as',    label:'Auto-Scale',    sublabel:'New instances', icon:(a)=>srv(a?C.green:'#86efac', a?C.greenBg:'#f0fff4'),     position:{x:430,y:170}, mobilePosition:{x:300,y:170} },
  ],
  edges: [
    { id:'sp-lb',  source:'spike', target:'lb',  label:'flood', sourceHandle:'top-s',  targetHandle:'left', type:'smoothstep' },
    { id:'sp-q',   source:'spike', target:'que', label:'buffer',sourceHandle:'bottom', targetHandle:'left', type:'smoothstep' },
    { id:'lb-as',  source:'lb',    target:'as',  label:'trigger',sourceHandle:'right', targetHandle:'top',  type:'smoothstep' },
    { id:'q-as',   source:'que',   target:'as',  label:'drain', sourceHandle:'right',  targetHandle:'bottom-t', type:'smoothstep' },
  ],
  steps: [
    { label:'Sudden Traffic Spike', description:'Flash sale, viral post, or breaking news — traffic jumps 10x in seconds', activeNodes:['spike'], animatedEdges:[], edgeColor:{} },
    { label:'Load Balancer Absorbs', description:'LB distributes incoming requests and queues them — no immediate overload to servers', activeNodes:['spike','lb'], animatedEdges:['sp-lb'], edgeColor:{'sp-lb':C.red} },
    { label:'Message Queue Buffers', description:'Async tasks go to a queue — workers process at their own pace, spike is smoothed out', activeNodes:['spike','que'], animatedEdges:['sp-q'], edgeColor:{'sp-q':C.blue} },
    { label:'Auto-Scaling Triggers', description:'High CPU metric triggers auto-scale — new instances come online within 1-2 minutes', activeNodes:['lb','que','as'], animatedEdges:['lb-as','q-as'], edgeColor:{'lb-as':C.green,'q-as':C.green} },
    { label:'Combined Defense', description:'LB + Queue + Auto-Scale together handle spikes gracefully without user impact', activeNodes:['spike','lb','que','as'], animatedEdges:['sp-lb','sp-q','lb-as','q-as'], edgeColor:{'sp-lb':C.red,'sp-q':C.blue,'lb-as':C.green,'q-as':C.green} },
  ],
};

export const scalabilityFlowMap: Record<string, FlowDef> = {
  'Scalability Fundamentals':                scalabilityFundamentalsDef,
  'Vertical vs Horizontal Scaling':          verticalHorizontalDef,
  'Elasticity and Auto-Scaling':             elasticityAutoScalingDef,
  'Stateless vs Stateful Scaling':           statelessStatefulDef,
  'Capacity Planning and Traffic Estimation':capacityPlanningDef,
  'Bottleneck Identification and Optimization': bottleneckIdentificationDef,
  'Database Scaling Basics':                 databaseScalingDef,
  'Scaling Strategies and Trade-offs':       scalingStrategiesDef,
  'Handling Traffic Spikes and Sudden Load': trafficSpikesDef,
};
