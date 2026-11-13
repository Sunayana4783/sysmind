import React from 'react';
import { C, type FlowDef } from '../HLDFlow';

const box = (c: string, bg: string, t: string) => <svg width="32" height="28" viewBox="0 0 48 40" fill="none"><rect x="4" y="4" width="40" height="32" rx="6" fill={bg} stroke={c} strokeWidth="2"/><text x="24" y="24" textAnchor="middle" fontSize="9" fontWeight="700" fill={c}>{t}</text></svg>;
const srv = (c: string, bg: string) => <svg width="32" height="32" viewBox="0 0 48 48" fill="none"><rect x="4" y="8" width="40" height="10" rx="3" fill={c} stroke={c} strokeWidth="1.5"/><rect x="4" y="22" width="40" height="10" rx="3" fill={bg} stroke={c} strokeWidth="1.5"/><rect x="4" y="36" width="40" height="10" rx="3" fill={bg} stroke={c} strokeWidth="1.5"/><circle cx="36" cy="13" r="2" fill="white"/></svg>;

export const estFundamentalsDef: FlowDef = {
  nodes: [
    { id:'dau',  label:'DAU',       sublabel:'Daily Active Users', icon:(a)=>box(a?C.primary:'#C4B5FD',a?C.primaryBg:'#F5F3FF','DAU'), position:{x:20,y:170},  mobilePosition:{x:10,y:170} },
    { id:'rps',  label:'RPS',       sublabel:'Requests/second',    icon:(a)=>box(a?C.orange:'#fdba74',a?C.orangeBg:'#fff7ed','RPS'), position:{x:230,y:60},  mobilePosition:{x:160,y:60} },
    { id:'sto',  label:'Storage',   sublabel:'GB/TB/day',          icon:(a)=>box(a?C.blue:'#93c5fd', a?C.blueBg:'#eff6ff','STO'),   position:{x:230,y:280}, mobilePosition:{x:160,y:280} },
    { id:'srv',  label:'Fleet',     sublabel:'# servers needed',   icon:(a)=>srv(a?C.green:'#86efac',a?C.greenBg:'#f0fff4'),         position:{x:450,y:170}, mobilePosition:{x:310,y:170} },
  ],
  edges: [
    { id:'d-r',  source:'dau', target:'rps', label:'÷ 86400',    sourceHandle:'top-s',  targetHandle:'left',    type:'smoothstep' },
    { id:'d-s',  source:'dau', target:'sto', label:'× payload',  sourceHandle:'bottom', targetHandle:'left',    type:'smoothstep' },
    { id:'r-sv', source:'rps', target:'srv', label:'÷ capacity', sourceHandle:'right',  targetHandle:'top',     type:'smoothstep' },
    { id:'s-sv', source:'sto', target:'srv', label:'size disks', sourceHandle:'right',  targetHandle:'bottom-t',type:'smoothstep' },
  ],
  steps: [
    { label:'Start with DAU', description:'Daily Active Users is your anchor number — all estimates derive from it', activeNodes:['dau'], animatedEdges:[], edgeColor:{} },
    { label:'Calculate RPS', description:'100M DAU × 10 req/day ÷ 86,400 s/day ≈ 11,500 RPS. Peak is typically 2-3× average', activeNodes:['dau','rps'], animatedEdges:['d-r'], edgeColor:{'d-r':C.orange} },
    { label:'Calculate Storage', description:'11,500 RPS × 1KB payload × 86,400 ≈ 1TB/day. 5-year retention = 1.8PB', activeNodes:['dau','sto'], animatedEdges:['d-s'], edgeColor:{'d-s':C.blue} },
    { label:'Size the Fleet', description:'If one server handles 1,000 RPS, need 12 servers + 20% headroom = ~15 servers', activeNodes:['rps','srv'], animatedEdges:['r-sv'], edgeColor:{'r-sv':C.green} },
    { label:'Complete Picture', description:'RPS drives compute, storage drives database — both inform your architecture choices', activeNodes:['rps','sto','srv'], animatedEdges:['r-sv','s-sv'], edgeColor:{'r-sv':C.green,'s-sv':C.blue} },
  ],
};

export const trafficEstimationDef: FlowDef = {
  nodes: [
    { id:'dau',  label:'100M DAU',  sublabel:'Given',              icon:(a)=>box(a?C.primary:'#C4B5FD',a?C.primaryBg:'#F5F3FF','DAU'), position:{x:20,y:170},  mobilePosition:{x:10,y:170} },
    { id:'avg',  label:'10 req/day',sublabel:'Per user',           icon:(a)=>box(a?C.orange:'#fdba74',a?C.orangeBg:'#fff7ed','AVG'), position:{x:220,y:60},  mobilePosition:{x:150,y:60} },
    { id:'rps',  label:'11.5K RPS', sublabel:'÷86400',             icon:(a)=>box(a?C.blue:'#93c5fd', a?C.blueBg:'#eff6ff','RPS'),   position:{x:220,y:280}, mobilePosition:{x:150,y:280} },
    { id:'peak', label:'30K RPS',   sublabel:'Peak (3× avg)',      icon:(a)=>box(a?C.red:'#fca5a5', a?C.redBg:'#fff5f5','PEAK'),   position:{x:430,y:170}, mobilePosition:{x:300,y:170} },
  ],
  edges: [
    { id:'d-a',  source:'dau', target:'avg', label:'× req/user', sourceHandle:'top-s',  targetHandle:'left',    type:'smoothstep' },
    { id:'d-r',  source:'dau', target:'rps', label:'÷ 86400',    sourceHandle:'bottom', targetHandle:'left',    type:'smoothstep' },
    { id:'a-p',  source:'avg', target:'peak',label:'× 3 (peak)', sourceHandle:'right',  targetHandle:'top',     type:'smoothstep' },
    { id:'r-p',  source:'rps', target:'peak',label:'baseline',   sourceHandle:'right',  targetHandle:'bottom-t',type:'smoothstep' },
  ],
  steps: [
    { label:'100M DAU Starting Point', description:'100 million users per day — verify this assumption with interviewer before proceeding', activeNodes:['dau'], animatedEdges:[], edgeColor:{} },
    { label:'Average Requests Per User', description:'Estimate ~10 reads + 2 writes per user per day based on use case', activeNodes:['dau','avg'], animatedEdges:['d-a'], edgeColor:{'d-a':C.orange} },
    { label:'Average RPS', description:'100M × 10 / 86,400 = 11,574 RPS average. Round to 12K for simplicity', activeNodes:['dau','rps'], animatedEdges:['d-r'], edgeColor:{'d-r':C.blue} },
    { label:'Peak RPS', description:'Traffic spikes to 2-3× average in busy hours — design for 30K+ peak, not average', activeNodes:['avg','rps','peak'], animatedEdges:['a-p','r-p'], edgeColor:{'a-p':C.red,'r-p':C.red} },
    { label:'Design for Peak', description:'Always design capacity for peak load + buffer — average RPS will under-provision your system', activeNodes:['peak'], animatedEdges:[], edgeColor:{}, nodeOverride:{'peak':{warn:true}} },
  ],
};

export const storageEstimationDef: FlowDef = {
  nodes: [
    { id:'rps',  label:'12K RPS',   sublabel:'Requests/sec',       icon:(a)=>box(a?C.primary:'#C4B5FD',a?C.primaryBg:'#F5F3FF','RPS'), position:{x:20,y:170},  mobilePosition:{x:10,y:170} },
    { id:'sz',   label:'1KB/req',   sublabel:'Avg payload size',   icon:(a)=>box(a?C.orange:'#fdba74',a?C.orangeBg:'#fff7ed','SZ'),  position:{x:230,y:60},  mobilePosition:{x:160,y:60} },
    { id:'day',  label:'~1TB/day',  sublabel:'Daily writes',       icon:(a)=>box(a?C.blue:'#93c5fd', a?C.blueBg:'#eff6ff','1TB'),  position:{x:230,y:280}, mobilePosition:{x:160,y:280} },
    { id:'yr',   label:'~365TB/yr', sublabel:'Annual storage',     icon:(a)=>box(a?C.green:'#86efac',a?C.greenBg:'#f0fff4','YR'),  position:{x:460,y:170}, mobilePosition:{x:310,y:170} },
  ],
  edges: [
    { id:'r-s',  source:'rps', target:'sz',  label:'× payload',   sourceHandle:'top-s',  targetHandle:'left',    type:'smoothstep' },
    { id:'r-d',  source:'rps', target:'day', label:'× 86400',     sourceHandle:'bottom', targetHandle:'left',    type:'smoothstep' },
    { id:'s-y',  source:'sz',  target:'yr',  label:'× 365 days',  sourceHandle:'right',  targetHandle:'top',     type:'smoothstep' },
    { id:'d-y',  source:'day', target:'yr',  label:'× 365',       sourceHandle:'right',  targetHandle:'bottom-t',type:'smoothstep' },
  ],
  steps: [
    { label:'Payload Size Matters', description:'What is average request/record size? Tweet: ~300B. Photo metadata: ~1KB. Video file: ~100MB', activeNodes:['rps','sz'], animatedEdges:['r-s'], edgeColor:{'r-s':C.orange} },
    { label:'Daily Write Volume', description:'12K writes/s × 1KB × 86,400s ≈ 1TB/day written to storage', activeNodes:['rps','day'], animatedEdges:['r-d'], edgeColor:{'r-d':C.blue} },
    { label:'Annual Storage', description:'1TB/day × 365 = ~365TB/year. Multiply by replication factor (3×) = ~1PB/year', activeNodes:['sz','day','yr'], animatedEdges:['s-y','d-y'], edgeColor:{'s-y':C.green,'d-y':C.green} },
    { label:'Add Replication', description:'Every shard needs 3 replicas for HA — multiply storage by replication factor', activeNodes:['yr'], animatedEdges:[], edgeColor:{}, nodeOverride:{'yr':{warn:true}} },
    { label:'Storage Tiers', description:'Hot storage (SSD): last 30 days. Cold storage (HDD): 1 year. Archive (S3 Glacier): older data', activeNodes:['yr'], animatedEdges:[], edgeColor:{}, nodeOverride:{'yr':{hit:true}} },
  ],
};

export const bandwidthEstimationDef: FlowDef = {
  nodes: [
    { id:'in',   label:'Ingress',   sublabel:'Incoming data',      icon:(a)=>box(a?C.primary:'#C4B5FD',a?C.primaryBg:'#F5F3FF','IN'), position:{x:20,y:60},  mobilePosition:{x:10,y:60} },
    { id:'out',  label:'Egress',    sublabel:'Outgoing data',      icon:(a)=>box(a?C.blue:'#93c5fd', a?C.blueBg:'#eff6ff','OUT'),   position:{x:20,y:280}, mobilePosition:{x:10,y:280} },
    { id:'calc', label:'Calculate', sublabel:'RPS × payload',      icon:(a)=>box(a?C.orange:'#fdba74',a?C.orangeBg:'#fff7ed','='),  position:{x:250,y:170}, mobilePosition:{x:160,y:170} },
    { id:'res',  label:'Bandwidth', sublabel:'Gbps required',      icon:(a)=>srv(a?C.green:'#86efac',a?C.greenBg:'#f0fff4'),        position:{x:470,y:170}, mobilePosition:{x:320,y:170} },
  ],
  edges: [
    { id:'i-c',  source:'in',   target:'calc',label:'writes',  sourceHandle:'right',  targetHandle:'top',     type:'smoothstep' },
    { id:'o-c',  source:'out',  target:'calc',label:'reads',   sourceHandle:'right',  targetHandle:'bottom-t',type:'smoothstep' },
    { id:'c-r',  source:'calc', target:'res', label:'GB/s',    sourceHandle:'right',  targetHandle:'left',    type:'smoothstep' },
  ],
  steps: [
    { label:'Ingress Bandwidth', description:'Upload/write traffic: 1,000 writes/s × 1KB = 1 MB/s ingress. For video: 100 uploads/s × 10MB = 1 GB/s', activeNodes:['in','calc'], animatedEdges:['i-c'], edgeColor:{'i-c':C.primary} },
    { label:'Egress Bandwidth', description:'Read traffic is typically much higher — 10× read amplification is common', activeNodes:['out','calc'], animatedEdges:['o-c'], edgeColor:{'o-c':C.blue} },
    { label:'Calculate Total', description:'Sum ingress + egress — use this to size network cards, CDN bandwidth, and cost estimates', activeNodes:['calc','res'], animatedEdges:['c-r'], edgeColor:{'c-r':C.green} },
    { label:'CDN Offload', description:'CDN serves 70-90% of static content — dramatically reduces origin server bandwidth needs', activeNodes:['res'], animatedEdges:[], edgeColor:{}, nodeOverride:{'res':{hit:true}} },
    { label:'Network Bottleneck Check', description:'If bandwidth exceeds 1Gbps per server, you need multiple servers or CDN to prevent network bottleneck', activeNodes:['in','out','calc','res'], animatedEdges:['i-c','o-c','c-r'], edgeColor:{'i-c':C.primary,'o-c':C.blue,'c-r':C.green} },
  ],
};

export const backOfEnvelopeDef: FlowDef = {
  nodes: [
    { id:'qs',  label:'Question',   sublabel:'Design Twitter',     icon:(a)=>box(a?C.primary:'#C4B5FD',a?C.primaryBg:'#F5F3FF','?'),  position:{x:20,y:170},  mobilePosition:{x:10,y:170} },
    { id:'dau', label:'~300M DAU',  sublabel:'Step 1: anchor',     icon:(a)=>box(a?C.orange:'#fdba74',a?C.orangeBg:'#fff7ed','DAU'), position:{x:230,y:30},  mobilePosition:{x:160,y:30} },
    { id:'rps', label:'~15K RPS',   sublabel:'Step 2: traffic',    icon:(a)=>box(a?C.blue:'#93c5fd', a?C.blueBg:'#eff6ff','RPS'),   position:{x:230,y:170}, mobilePosition:{x:160,y:170} },
    { id:'sto', label:'~1.5TB/day', sublabel:'Step 3: storage',    icon:(a)=>box(a?C.green:'#86efac',a?C.greenBg:'#f0fff4','STO'),  position:{x:230,y:310}, mobilePosition:{x:160,y:310} },
    { id:'ans', label:'Architecture',sublabel:'Step 4: design',    icon:(a)=>srv(a?C.primary:'#C4B5FD',a?C.primaryBg:'#F5F3FF'),     position:{x:460,y:170}, mobilePosition:{x:310,y:170} },
  ],
  edges: [
    { id:'q-d',  source:'qs',  target:'dau',label:'assume',    sourceHandle:'top-s',  targetHandle:'left',    type:'smoothstep' },
    { id:'q-r',  source:'qs',  target:'rps', label:'calc',     sourceHandle:'right',  targetHandle:'left',    type:'smoothstep' },
    { id:'q-s',  source:'qs',  target:'sto', label:'calc',     sourceHandle:'bottom', targetHandle:'left',    type:'smoothstep' },
    { id:'d-a',  source:'dau', target:'ans', label:'informs',  sourceHandle:'right',  targetHandle:'top',     type:'smoothstep' },
    { id:'r-a',  source:'rps', target:'ans', label:'shapes',   sourceHandle:'right',  targetHandle:'left',    type:'smoothstep' },
    { id:'s-a',  source:'sto', target:'ans', label:'sizes',    sourceHandle:'right',  targetHandle:'bottom-t',type:'smoothstep' },
  ],
  steps: [
    { label:'State Assumptions Aloud', description:'Always say your assumptions — "I will assume 300M DAU with 10% write rate"', activeNodes:['qs','dau'], animatedEdges:['q-d'], edgeColor:{'q-d':C.primary} },
    { label:'Calculate RPS', description:'300M × 10 req/day ÷ 86,400 ≈ 34,700 RPS average. Peak ≈ 100K RPS', activeNodes:['qs','rps'], animatedEdges:['q-r'], edgeColor:{'q-r':C.blue} },
    { label:'Calculate Storage', description:'Write rate × payload × seconds: 3,470 writes/s × 300B × 86,400 ≈ 90GB/day', activeNodes:['qs','sto'], animatedEdges:['q-s'], edgeColor:{'q-s':C.green} },
    { label:'Estimates Drive Design', description:'RPS tells you # of servers. Storage tells you DB sharding. Bandwidth tells you CDN need', activeNodes:['dau','rps','sto','ans'], animatedEdges:['d-a','r-a','s-a'], edgeColor:{'d-a':C.orange,'r-a':C.blue,'s-a':C.green} },
    { label:'Round Numbers Are Fine', description:'Back-of-envelope is directional — ±10x accuracy is acceptable. Communicate your reasoning', activeNodes:['ans'], animatedEdges:[], edgeColor:{}, nodeOverride:{'ans':{hit:true}} },
  ],
};

export const estimationFlowMap: Record<string, FlowDef> = {
  'Estimation Fundamentals':              estFundamentalsDef,
  'Traffic Estimation (RPS)':             trafficEstimationDef,
  'User and Workload Estimation':         trafficEstimationDef,
  'Storage Capacity Estimation':          storageEstimationDef,
  'Bandwidth Estimation':                 bandwidthEstimationDef,
  'CPU and Memory Estimation':            estFundamentalsDef,
  'Peak Load and Traffic Forecasting':    trafficEstimationDef,
  'Back-of-the-Envelope Calculations':    backOfEnvelopeDef,
  'Resource Utilization and Optimization':estFundamentalsDef,
  'Full Estimation Walkthroughs':         backOfEnvelopeDef,
};
