import React from 'react';
import { C, type FlowDef } from '../HLDFlow';

const box = (c: string, bg: string, t: string) => <svg width="32" height="28" viewBox="0 0 48 40" fill="none"><rect x="4" y="4" width="40" height="32" rx="6" fill={bg} stroke={c} strokeWidth="2"/><text x="24" y="24" textAnchor="middle" fontSize="9" fontWeight="700" fill={c}>{t}</text></svg>;
const srv = (c: string, bg: string) => <svg width="32" height="32" viewBox="0 0 48 48" fill="none"><rect x="4" y="8" width="40" height="10" rx="3" fill={c} stroke={c} strokeWidth="1.5"/><rect x="4" y="22" width="40" height="10" rx="3" fill={bg} stroke={c} strokeWidth="1.5"/><rect x="4" y="36" width="40" height="10" rx="3" fill={bg} stroke={c} strokeWidth="1.5"/><circle cx="36" cy="13" r="2" fill="white"/></svg>;

export const dsFundamentalsDef: FlowDef = {
  nodes: [
    { id:'n1', label:'Node 1', sublabel:'Peer',   icon:(a)=>srv(a?C.primary:'#C4B5FD',a?C.primaryBg:'#F5F3FF'), position:{x:30,y:170},  mobilePosition:{x:10,y:170} },
    { id:'n2', label:'Node 2', sublabel:'Peer',   icon:(a)=>srv(a?C.orange:'#fdba74', a?C.orangeBg:'#fff7ed'),  position:{x:250,y:60},  mobilePosition:{x:170,y:60} },
    { id:'n3', label:'Node 3', sublabel:'Peer',   icon:(a)=>srv(a?C.green:'#86efac',  a?C.greenBg:'#f0fff4'),   position:{x:250,y:280}, mobilePosition:{x:170,y:280} },
    { id:'n4', label:'Node 4', sublabel:'Peer',   icon:(a)=>srv(a?C.blue:'#93c5fd',   a?C.blueBg:'#eff6ff'),    position:{x:450,y:170}, mobilePosition:{x:310,y:170} },
  ],
  edges: [
    { id:'1-2', source:'n1', target:'n2', label:'msg', sourceHandle:'top-s',  targetHandle:'left',    type:'smoothstep' },
    { id:'1-3', source:'n1', target:'n3', label:'msg', sourceHandle:'bottom', targetHandle:'left',    type:'smoothstep' },
    { id:'2-4', source:'n2', target:'n4', label:'msg', sourceHandle:'right',  targetHandle:'top',     type:'smoothstep' },
    { id:'3-4', source:'n3', target:'n4', label:'msg', sourceHandle:'right',  targetHandle:'bottom-t',type:'smoothstep' },
    { id:'2-3', source:'n2', target:'n3', label:'sync',sourceHandle:'bottom', targetHandle:'top',     type:'smoothstep' },
  ],
  steps: [
    { label:'Distributed System', description:'Multiple independent nodes work together — appear as one system to users, can span data centers', activeNodes:['n1','n2','n3','n4'], animatedEdges:[], edgeColor:{} },
    { label:'Nodes Communicate via Messages', description:'No shared memory — nodes communicate only by passing messages over the network', activeNodes:['n1','n2'], animatedEdges:['1-2'], edgeColor:{'1-2':C.primary} },
    { label:'Any Node Can Fail', description:'Networks partition, nodes crash — distributed systems must handle partial failures gracefully', activeNodes:['n1','n3'], animatedEdges:['1-3'], edgeColor:{'1-3':C.orange} },
    { label:'No Global Clock', description:'Each node has its own clock — clocks drift, ordering events across nodes is a hard problem', activeNodes:['n2','n3'], animatedEdges:['2-3'], edgeColor:{'2-3':C.blue} },
    { label:'Scale Horizontally', description:'Add nodes to increase capacity — distributed systems scale far beyond what any single machine can do', activeNodes:['n2','n4','n3'], animatedEdges:['2-4','3-4'], edgeColor:{'2-4':C.green,'3-4':C.green} },
  ],
};

export const dsConsistencyDef: FlowDef = {
  nodes: [
    { id:'cl',  label:'Client',   sublabel:'Write then read',    icon:(a)=>box(a?C.primary:'#C4B5FD',a?C.primaryBg:'#F5F3FF','CL'), position:{x:20,y:170},  mobilePosition:{x:10,y:170} },
    { id:'sc',  label:'Strong',   sublabel:'Always latest',      icon:(a)=>box(a?C.blue:'#93c5fd',  a?C.blueBg:'#eff6ff', 'SC'),   position:{x:260,y:30},  mobilePosition:{x:170,y:30} },
    { id:'ec',  label:'Eventual', sublabel:'Converges later',    icon:(a)=>box(a?C.green:'#86efac', a?C.greenBg:'#f0fff4','EC'),   position:{x:260,y:170}, mobilePosition:{x:170,y:170} },
    { id:'cc',  label:'Causal',   sublabel:'Cause before effect',icon:(a)=>box(a?C.orange:'#fdba74',a?C.orangeBg:'#fff7ed','CC'),  position:{x:260,y:310}, mobilePosition:{x:170,y:310} },
    { id:'db',  label:'DB',       sublabel:'Distributed',        icon:(a)=>srv(a?C.primary:'#C4B5FD',a?C.primaryBg:'#F5F3FF'),     position:{x:460,y:170}, mobilePosition:{x:310,y:170} },
  ],
  edges: [
    { id:'cl-sc',source:'cl', target:'sc', label:'read-after-write', sourceHandle:'top-s',  targetHandle:'left', type:'smoothstep' },
    { id:'cl-ec',source:'cl', target:'ec', label:'DNS, social',       sourceHandle:'right',  targetHandle:'left', type:'smoothstep' },
    { id:'cl-cc',source:'cl', target:'cc', label:'messaging',         sourceHandle:'bottom', targetHandle:'left', type:'smoothstep' },
    { id:'sc-db',source:'sc', target:'db', label:'ZooKeeper/spanner', sourceHandle:'right',  targetHandle:'top',  type:'smoothstep' },
    { id:'ec-db',source:'ec', target:'db', label:'Cassandra/DNS',     sourceHandle:'right',  targetHandle:'left', type:'smoothstep' },
  ],
  steps: [
    { label:'Strong Consistency', description:'After a write, every read returns the latest value — requires coordination overhead. Used in banking', activeNodes:['cl','sc','db'], animatedEdges:['cl-sc','sc-db'], edgeColor:{'cl-sc':C.blue,'sc-db':C.blue} },
    { label:'Eventual Consistency', description:'All replicas converge to same value eventually — fast but may read stale data temporarily', activeNodes:['cl','ec','db'], animatedEdges:['cl-ec','ec-db'], edgeColor:{'cl-ec':C.green,'ec-db':C.green} },
    { label:'Causal Consistency', description:'Operations causally related are seen in correct order — reply always after the question', activeNodes:['cl','cc'], animatedEdges:['cl-cc'], edgeColor:{'cl-cc':C.orange} },
    { label:'Trade-offs', description:'Strong: safe but slow. Eventual: fast but can serve stale data. Causal: balance — common in social apps', activeNodes:['sc','ec','cc'], animatedEdges:[], edgeColor:{} },
    { label:'Choose Based on Use Case', description:'Bank balance = strong. Social likes = eventual. Messaging thread = causal', activeNodes:['cl','sc','ec','cc'], animatedEdges:['cl-sc','cl-ec','cl-cc'], edgeColor:{'cl-sc':C.blue,'cl-ec':C.green,'cl-cc':C.orange} },
  ],
};

export const consensusDef: FlowDef = {
  nodes: [
    { id:'l',   label:'Leader',   sublabel:'Raft leader',      icon:(a)=>box(a?C.orange:'#fdba74',a?C.orangeBg:'#fff7ed','LDR'), position:{x:20,y:170},  mobilePosition:{x:10,y:170} },
    { id:'f1',  label:'Follower 1',sublabel:'Replicates',      icon:(a)=>srv(a?C.primary:'#C4B5FD',a?C.primaryBg:'#F5F3FF'),    position:{x:260,y:30},  mobilePosition:{x:170,y:30} },
    { id:'f2',  label:'Follower 2',sublabel:'Replicates',      icon:(a)=>srv(a?C.primary:'#C4B5FD',a?C.primaryBg:'#F5F3FF'),    position:{x:260,y:170}, mobilePosition:{x:170,y:170} },
    { id:'f3',  label:'Follower 3',sublabel:'Replicates',      icon:(a)=>srv(a?C.primary:'#C4B5FD',a?C.primaryBg:'#F5F3FF'),    position:{x:260,y:310}, mobilePosition:{x:170,y:310} },
    { id:'ok',  label:'Committed', sublabel:'Majority ack',   icon:(a)=>box(a?C.green:'#86efac', a?C.greenBg:'#f0fff4','OK'),   position:{x:470,y:170}, mobilePosition:{x:320,y:170} },
  ],
  edges: [
    { id:'l-f1',source:'l', target:'f1', label:'append',  sourceHandle:'top-s',  targetHandle:'left',    type:'smoothstep' },
    { id:'l-f2',source:'l', target:'f2', label:'append',  sourceHandle:'right',  targetHandle:'left',    type:'smoothstep' },
    { id:'l-f3',source:'l', target:'f3', label:'append',  sourceHandle:'bottom', targetHandle:'left',    type:'smoothstep' },
    { id:'f1-o',source:'f1',target:'ok', label:'ack',     sourceHandle:'right',  targetHandle:'top',     type:'smoothstep' },
    { id:'f2-o',source:'f2',target:'ok', label:'ack',     sourceHandle:'right',  targetHandle:'left',    type:'smoothstep' },
    { id:'f3-o',source:'f3',target:'ok', label:'ack',     sourceHandle:'right',  targetHandle:'bottom-t',type:'smoothstep' },
  ],
  steps: [
    { label:'Leader Election', description:'In Raft, one node is elected leader via voting — leader handles all writes', activeNodes:['l'], animatedEdges:[], edgeColor:{} },
    { label:'Leader Replicates Log', description:'Leader appends entry to its log and sends AppendEntries to all followers', activeNodes:['l','f1','f2','f3'], animatedEdges:['l-f1','l-f2','l-f3'], edgeColor:{'l-f1':C.primary,'l-f2':C.primary,'l-f3':C.primary} },
    { label:'Followers Acknowledge', description:'Followers write to their log and send ACK to leader', activeNodes:['f1','f2','f3','ok'], animatedEdges:['f1-o','f2-o','f3-o'], edgeColor:{'f1-o':C.green,'f2-o':C.green,'f3-o':C.green} },
    { label:'Majority Commits', description:'Once majority (2 of 3) ack — leader commits the entry. Can tolerate 1 failure of 3 nodes', activeNodes:['ok'], animatedEdges:[], edgeColor:{}, nodeOverride:{'ok':{hit:true}} },
    { label:'Leader Failure Recovery', description:'If leader fails, followers elect a new leader — no data loss if committed to majority', activeNodes:['f1','f2'], animatedEdges:['l-f1','l-f2'], edgeColor:{'l-f1':C.orange,'l-f2':C.orange} },
  ],
};

export const capTheoremDsDef: FlowDef = {
  nodes: [
    { id:'n1', label:'Node 1',    sublabel:'Data v1',          icon:(a)=>srv(a?C.primary:'#C4B5FD',a?C.primaryBg:'#F5F3FF'),     position:{x:30,y:170},  mobilePosition:{x:10,y:170} },
    { id:'n2', label:'Node 2',    sublabel:'Data v?',          icon:(a)=>srv(a?C.orange:'#fdba74', a?C.orangeBg:'#fff7ed'),       position:{x:250,y:60},  mobilePosition:{x:170,y:60} },
    { id:'n3', label:'Node 3',    sublabel:'Data v?',          icon:(a)=>srv(a?C.blue:'#93c5fd',   a?C.blueBg:'#eff6ff'),         position:{x:250,y:280}, mobilePosition:{x:170,y:280} },
    { id:'net',label:'Network Partition',sublabel:'Split!',    icon:(a)=>box(a?C.red:'#fca5a5',  a?C.redBg:'#fff5f5', '✕'),      position:{x:450,y:170}, mobilePosition:{x:310,y:170} },
  ],
  edges: [
    { id:'1-2',  source:'n1',  target:'n2',  label:'blocked',  sourceHandle:'top-s',  targetHandle:'left',    type:'smoothstep' },
    { id:'1-3',  source:'n1',  target:'n3',  label:'blocked',  sourceHandle:'bottom', targetHandle:'left',    type:'smoothstep' },
    { id:'n2-p', source:'n2',  target:'net', label:'partition',sourceHandle:'right',  targetHandle:'top',     type:'smoothstep' },
    { id:'n3-p', source:'n3',  target:'net', label:'partition',sourceHandle:'right',  targetHandle:'bottom-t',type:'smoothstep' },
  ],
  steps: [
    { label:'Network Partition Occurs', description:'Node 2 and Node 3 cannot reach Node 1 — network split, messages lost', activeNodes:['n1','n2','n3','net'], animatedEdges:['1-2','1-3'], edgeColor:{'1-2':C.red,'1-3':C.red} },
    { label:'Choose CP (Consistency)', description:'Reject writes on partitioned nodes — data stays consistent, availability sacrificed', activeNodes:['n2','n3'], animatedEdges:[], edgeColor:{}, nodeOverride:{'n2':{miss:true},'n3':{miss:true}} },
    { label:'Choose AP (Availability)', description:'Accept writes on all nodes — system stays available but data diverges temporarily', activeNodes:['n2','n3'], animatedEdges:[], edgeColor:{}, nodeOverride:{'n2':{hit:true},'n3':{hit:true}} },
    { label:'Partition Always Happens', description:'Networks are unreliable — partition tolerance is a must in any distributed system', activeNodes:['net'], animatedEdges:['n2-p','n3-p'], edgeColor:{'n2-p':C.red,'n3-p':C.red} },
    { label:'Real Systems Choose AP', description:'Most internet systems choose AP with eventual consistency — be available, converge later', activeNodes:['n1','n2','n3'], animatedEdges:[], edgeColor:{} },
  ],
};

export const distributedSystemsFlowMap: Record<string, FlowDef> = {
  'Distributed Systems Fundamentals':  dsFundamentalsDef,
  'Architecture and Components':       dsFundamentalsDef,
  'Communication Between Nodes':       dsFundamentalsDef,
  'Time, Clocks and Event Ordering':   dsFundamentalsDef,
  'Consistency Models':                dsConsistencyDef,
  'Consensus Algorithms':              consensusDef,
  'Distributed Transactions':          dsConsistencyDef,
  'Fault Tolerance and Replication':   dsFundamentalsDef,
  'Partition Tolerance and CAP Theorem': capTheoremDsDef,
  'Observability in Distributed Systems': dsFundamentalsDef,
};
