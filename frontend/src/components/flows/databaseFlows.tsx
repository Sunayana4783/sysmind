import React from 'react';
import { C, type FlowDef } from '../HLDFlow';

const box = (c: string, bg: string, t: string) => <svg width="32" height="28" viewBox="0 0 48 40" fill="none"><rect x="4" y="4" width="40" height="32" rx="6" fill={bg} stroke={c} strokeWidth="2"/><text x="24" y="24" textAnchor="middle" fontSize="9" fontWeight="700" fill={c}>{t}</text></svg>;
const srv = (c: string, bg: string) => <svg width="32" height="32" viewBox="0 0 48 48" fill="none"><rect x="4" y="8" width="40" height="10" rx="3" fill={c} stroke={c} strokeWidth="1.5"/><rect x="4" y="22" width="40" height="10" rx="3" fill={bg} stroke={c} strokeWidth="1.5"/><rect x="4" y="36" width="40" height="10" rx="3" fill={bg} stroke={c} strokeWidth="1.5"/><circle cx="36" cy="13" r="2" fill="white"/></svg>;
const cyl = (c: string, bg: string) => <svg width="32" height="36" viewBox="0 0 44 52" fill="none"><ellipse cx="22" cy="10" rx="18" ry="6" fill={c} stroke={c} strokeWidth="2"/><rect x="4" y="10" width="36" height="28" fill={bg} stroke={c} strokeWidth="2"/><ellipse cx="22" cy="38" rx="18" ry="6" fill={bg} stroke={c} strokeWidth="2"/></svg>;

export const dbFundamentalsDef: FlowDef = {
  nodes: [
    { id:'app', label:'Application', sublabel:'Data requests',  icon:(a)=>srv(a?C.primary:'#C4B5FD',a?C.primaryBg:'#F5F3FF'),     position:{x:20,y:170},  mobilePosition:{x:10,y:170} },
    { id:'sql', label:'SQL DB',      sublabel:'Structured',     icon:(a)=>cyl(a?C.blue:'#93c5fd',   a?C.blueBg:'#eff6ff'),        position:{x:240,y:60},  mobilePosition:{x:160,y:60} },
    { id:'nos', label:'NoSQL DB',    sublabel:'Flexible schema', icon:(a)=>cyl(a?C.green:'#86efac', a?C.greenBg:'#f0fff4'),       position:{x:240,y:280}, mobilePosition:{x:160,y:280} },
    { id:'idx', label:'Index',       sublabel:'Fast lookup',    icon:(a)=>box(a?C.orange:'#fdba74',a?C.orangeBg:'#fff7ed','IDX'), position:{x:450,y:170}, mobilePosition:{x:310,y:170} },
  ],
  edges: [
    { id:'a-sql',  source:'app', target:'sql', label:'structured', sourceHandle:'top-s',  targetHandle:'left',    type:'smoothstep' },
    { id:'a-nos',  source:'app', target:'nos', label:'flexible',   sourceHandle:'bottom', targetHandle:'left',    type:'smoothstep' },
    { id:'sql-i',  source:'sql', target:'idx', label:'B-tree',     sourceHandle:'right',  targetHandle:'top',     type:'smoothstep' },
    { id:'nos-i',  source:'nos', target:'idx', label:'hash',       sourceHandle:'right',  targetHandle:'bottom-t',type:'smoothstep' },
  ],
  steps: [
    { label:'What is a Database?', description:'A database persists data beyond app restarts — it is the source of truth for all application data', activeNodes:['app'], animatedEdges:[], edgeColor:{} },
    { label:'SQL Databases', description:'Structured data, enforced schema, ACID transactions, strong consistency — PostgreSQL, MySQL', activeNodes:['app','sql'], animatedEdges:['a-sql'], edgeColor:{'a-sql':C.blue} },
    { label:'NoSQL Databases', description:'Flexible schemas, horizontal scale, eventual consistency — MongoDB, Cassandra, DynamoDB', activeNodes:['app','nos'], animatedEdges:['a-nos'], edgeColor:{'a-nos':C.green} },
    { label:'Indexes Speed Up Reads', description:'Without index: full table scan O(n). With index: direct lookup O(log n)', activeNodes:['sql','nos','idx'], animatedEdges:['sql-i','nos-i'], edgeColor:{'sql-i':C.orange,'nos-i':C.green} },
    { label:'Choosing SQL vs NoSQL', description:'SQL: relations, transactions, complex queries. NoSQL: scale, flexibility, high write throughput', activeNodes:['app','sql','nos'], animatedEdges:['a-sql','a-nos'], edgeColor:{'a-sql':C.blue,'a-nos':C.green} },
  ],
};

export const sqlNoSqlDef: FlowDef = {
  nodes: [
    { id:'sql', label:'SQL',      sublabel:'PostgreSQL/MySQL', icon:(a)=>cyl(a?C.blue:'#93c5fd',  a?C.blueBg:'#eff6ff'),        position:{x:30,y:60},  mobilePosition:{x:10,y:60} },
    { id:'doc', label:'Document', sublabel:'MongoDB',          icon:(a)=>cyl(a?C.green:'#86efac', a?C.greenBg:'#f0fff4'),       position:{x:30,y:280}, mobilePosition:{x:10,y:280} },
    { id:'kv',  label:'Key-Value',sublabel:'Redis/DynamoDB',   icon:(a)=>box(a?C.orange:'#fdba74',a?C.orangeBg:'#fff7ed','KV'), position:{x:270,y:60},  mobilePosition:{x:170,y:60} },
    { id:'col', label:'Column',   sublabel:'Cassandra',        icon:(a)=>box(a?C.primary:'#C4B5FD',a?C.primaryBg:'#F5F3FF','COL'), position:{x:270,y:280}, mobilePosition:{x:170,y:280} },
    { id:'gph', label:'Graph',    sublabel:'Neo4j',            icon:(a)=>box(a?C.red:'#fca5a5',  a?C.redBg:'#fff5f5', 'GRP'),  position:{x:480,y:170}, mobilePosition:{x:320,y:170} },
  ],
  edges: [
    { id:'s-k',  source:'sql', target:'kv',  label:'faster reads', sourceHandle:'right',  targetHandle:'left',    type:'smoothstep' },
    { id:'d-c',  source:'doc', target:'col', label:'write scale',  sourceHandle:'right',  targetHandle:'left',    type:'smoothstep' },
    { id:'k-g',  source:'kv',  target:'gph', label:'relationships',sourceHandle:'right',  targetHandle:'top',     type:'smoothstep' },
    { id:'c-g',  source:'col', target:'gph', label:'graph needs',  sourceHandle:'right',  targetHandle:'bottom-t',type:'smoothstep' },
  ],
  steps: [
    { label:'Relational (SQL)', description:'Tables, joins, foreign keys — great for financial data, user accounts, complex queries', activeNodes:['sql'], animatedEdges:[], edgeColor:{} },
    { label:'Document Store', description:'JSON/BSON documents — flexible schema, great for content, catalogs, user profiles', activeNodes:['doc'], animatedEdges:[], edgeColor:{} },
    { label:'Key-Value Store', description:'Fastest reads/writes — perfect for sessions, caching, counters, leaderboards', activeNodes:['sql','kv'], animatedEdges:['s-k'], edgeColor:{'s-k':C.orange} },
    { label:'Wide-Column Store', description:'Cassandra-style — optimized for massive write throughput and time-series data', activeNodes:['doc','col'], animatedEdges:['d-c'], edgeColor:{'d-c':C.primary} },
    { label:'Graph Database', description:'Models relationships natively — social networks, fraud detection, recommendation engines', activeNodes:['kv','col','gph'], animatedEdges:['k-g','c-g'], edgeColor:{'k-g':C.red,'c-g':C.red} },
  ],
};

export const dataModelingDef: FlowDef = {
  nodes: [
    { id:'ent', label:'Entities',    sublabel:'User, Order...',  icon:(a)=>box(a?C.primary:'#C4B5FD',a?C.primaryBg:'#F5F3FF','ENT'), position:{x:30,y:170},  mobilePosition:{x:10,y:170} },
    { id:'rel', label:'Relations',   sublabel:'1:1, 1:N, M:N',  icon:(a)=>box(a?C.orange:'#fdba74',a?C.orangeBg:'#fff7ed','REL'),   position:{x:230,y:60},  mobilePosition:{x:160,y:60} },
    { id:'sch', label:'Schema',      sublabel:'Tables + types',  icon:(a)=>box(a?C.blue:'#93c5fd',  a?C.blueBg:'#eff6ff', 'SCH'),   position:{x:230,y:280}, mobilePosition:{x:160,y:280} },
    { id:'db',  label:'Database',    sublabel:'Optimized',       icon:(a)=>cyl(a?C.green:'#86efac', a?C.greenBg:'#f0fff4'),          position:{x:440,y:170}, mobilePosition:{x:300,y:170} },
  ],
  edges: [
    { id:'e-r',  source:'ent', target:'rel', label:'defines',  sourceHandle:'top-s',  targetHandle:'left',    type:'smoothstep' },
    { id:'e-s',  source:'ent', target:'sch', label:'maps to',  sourceHandle:'bottom', targetHandle:'left',    type:'smoothstep' },
    { id:'r-db', source:'rel', target:'db',  label:'foreign keys',sourceHandle:'right',targetHandle:'top',   type:'smoothstep' },
    { id:'s-db', source:'sch', target:'db',  label:'creates',  sourceHandle:'right',  targetHandle:'bottom-t',type:'smoothstep' },
  ],
  steps: [
    { label:'Identify Entities', description:'What are the main "things" in your system? Users, Orders, Products, Payments?', activeNodes:['ent'], animatedEdges:[], edgeColor:{} },
    { label:'Define Relationships', description:'How do entities relate? User has many Orders (1:N), Orders have many Products (M:N)', activeNodes:['ent','rel'], animatedEdges:['e-r'], edgeColor:{'e-r':C.orange} },
    { label:'Design Schema', description:'Translate entities to tables with column types, constraints, and primary keys', activeNodes:['ent','sch'], animatedEdges:['e-s'], edgeColor:{'e-s':C.blue} },
    { label:'Add Foreign Keys', description:'Enforce relationships in DB via foreign keys — referential integrity', activeNodes:['rel','db'], animatedEdges:['r-db'], edgeColor:{'r-db':C.green} },
    { label:'Complete Schema', description:'Final schema is optimized with proper types, indexes, and constraints for the query patterns', activeNodes:['sch','db'], animatedEdges:['s-db'], edgeColor:{'s-db':C.green} },
  ],
};

export const normalizationDef: FlowDef = {
  nodes: [
    { id:'raw', label:'Raw Table',   sublabel:'Duplicates',       icon:(a)=>box(a?C.red:'#fca5a5',  a?C.redBg:'#fff5f5',  'RAW'), position:{x:20,y:170},  mobilePosition:{x:10,y:170} },
    { id:'1nf', label:'1NF',         sublabel:'Atomic values',    icon:(a)=>box(a?C.orange:'#fdba74',a?C.orangeBg:'#fff7ed','1NF'), position:{x:220,y:60},  mobilePosition:{x:150,y:60} },
    { id:'3nf', label:'3NF',         sublabel:'No transitive dep',icon:(a)=>box(a?C.green:'#86efac',a?C.greenBg:'#f0fff4', '3NF'), position:{x:220,y:280}, mobilePosition:{x:150,y:280} },
    { id:'den', label:'Denorm',      sublabel:'Read optimized',   icon:(a)=>box(a?C.blue:'#93c5fd', a?C.blueBg:'#eff6ff', 'DEN'), position:{x:430,y:170}, mobilePosition:{x:300,y:170} },
  ],
  edges: [
    { id:'r-1',  source:'raw', target:'1nf', label:'normalize',  sourceHandle:'top-s',  targetHandle:'left',    type:'smoothstep' },
    { id:'r-3',  source:'raw', target:'3nf', label:'normalize',  sourceHandle:'bottom', targetHandle:'left',    type:'smoothstep' },
    { id:'1-d',  source:'1nf', target:'den', label:'denormalize',sourceHandle:'right',  targetHandle:'top',     type:'smoothstep' },
    { id:'3-d',  source:'3nf', target:'den', label:'for reads',  sourceHandle:'right',  targetHandle:'bottom-t',type:'smoothstep' },
  ],
  steps: [
    { label:'Raw Data Has Duplicates', description:'Storing user name, city, country in every order row — wastes space and causes update anomalies', activeNodes:['raw'], animatedEdges:[], edgeColor:{} },
    { label:'1NF: Atomic Values', description:'Each column holds one value — no arrays or repeated groups in a single cell', activeNodes:['raw','1nf'], animatedEdges:['r-1'], edgeColor:{'r-1':C.orange} },
    { label:'3NF: No Transitive Dependencies', description:'Every column depends on the primary key only — user data moves to users table, order data to orders table', activeNodes:['raw','3nf'], animatedEdges:['r-3'], edgeColor:{'r-3':C.green} },
    { label:'Denormalization for Performance', description:'Intentionally duplicate data to avoid joins — trade storage for read speed', activeNodes:['1nf','3nf','den'], animatedEdges:['1-d','3-d'], edgeColor:{'1-d':C.blue,'3-d':C.blue} },
    { label:'When to Denormalize', description:'For read-heavy OLAP analytics or NoSQL — when join cost is too high at scale', activeNodes:['den'], animatedEdges:[], edgeColor:{}, nodeOverride:{'den':{hit:true}} },
  ],
};

export const indexingDef: FlowDef = {
  nodes: [
    { id:'qry', label:'Query',       sublabel:'WHERE email=?',   icon:(a)=>box(a?C.primary:'#C4B5FD',a?C.primaryBg:'#F5F3FF','SQL'), position:{x:20,y:170},  mobilePosition:{x:10,y:170} },
    { id:'scan',label:'Full Scan',   sublabel:'O(n) rows',       icon:(a)=>box(a?C.red:'#fca5a5',  a?C.redBg:'#fff5f5',  'SCN'),   position:{x:230,y:60},  mobilePosition:{x:160,y:60} },
    { id:'idx', label:'B-Tree Index',sublabel:'O(log n)',        icon:(a)=>box(a?C.green:'#86efac',a?C.greenBg:'#f0fff4', 'IDX'),   position:{x:230,y:280}, mobilePosition:{x:160,y:280} },
    { id:'res', label:'Result',      sublabel:'Fast return',     icon:(a)=>box(a?C.orange:'#fdba74',a?C.orangeBg:'#fff7ed','RES'),  position:{x:440,y:170}, mobilePosition:{x:300,y:170} },
  ],
  edges: [
    { id:'q-s',  source:'qry', target:'scan',label:'no index',  sourceHandle:'top-s',  targetHandle:'left',    type:'smoothstep' },
    { id:'q-i',  source:'qry', target:'idx', label:'with index',sourceHandle:'bottom', targetHandle:'left',    type:'smoothstep' },
    { id:'s-r',  source:'scan',target:'res', label:'slow 500ms',sourceHandle:'right',  targetHandle:'top',     type:'smoothstep' },
    { id:'i-r',  source:'idx', target:'res', label:'fast 1ms',  sourceHandle:'right',  targetHandle:'bottom-t',type:'smoothstep' },
  ],
  steps: [
    { label:'Query Without Index', description:'DB scans every row to find matching records — O(n), gets slower as table grows', activeNodes:['qry','scan'], animatedEdges:['q-s'], edgeColor:{'q-s':C.red} },
    { label:'Full Scan is Slow', description:'500ms on a 10M row table — users experience slow pages, DB CPU spikes', activeNodes:['scan','res'], animatedEdges:['s-r'], edgeColor:{'s-r':C.red}, nodeOverride:{'scan':{miss:true}} },
    { label:'Add a B-Tree Index', description:'CREATE INDEX ON users(email) — DB builds a sorted tree structure for fast lookup', activeNodes:['qry','idx'], animatedEdges:['q-i'], edgeColor:{'q-i':C.green} },
    { label:'Index Returns Fast', description:'Binary search on tree: O(log n) — 1ms instead of 500ms on the same 10M rows', activeNodes:['idx','res'], animatedEdges:['i-r'], edgeColor:{'i-r':C.green} },
    { label:'Index Trade-offs', description:'Index speeds reads but slows writes (must update index on INSERT/UPDATE) — index only frequently queried columns', activeNodes:['qry','idx','res'], animatedEdges:['q-i','i-r'], edgeColor:{'q-i':C.green,'i-r':C.orange} },
  ],
};

export const dbReplicationDef: FlowDef = {
  nodes: [
    { id:'app', label:'App',        sublabel:'Read/Write',       icon:(a)=>srv(a?C.primary:'#C4B5FD',a?C.primaryBg:'#F5F3FF'),     position:{x:20,y:170},  mobilePosition:{x:10,y:170} },
    { id:'pri', label:'Primary',    sublabel:'Read + Write',     icon:(a)=>cyl(a?C.primary:'#C4B5FD',a?C.primaryBg:'#F5F3FF'),     position:{x:230,y:60},  mobilePosition:{x:160,y:60} },
    { id:'r1',  label:'Replica 1',  sublabel:'Read only',        icon:(a)=>cyl(a?C.blue:'#93c5fd',   a?C.blueBg:'#eff6ff'),        position:{x:230,y:280}, mobilePosition:{x:160,y:280} },
    { id:'r2',  label:'Replica 2',  sublabel:'Read only',        icon:(a)=>cyl(a?C.green:'#86efac',  a?C.greenBg:'#f0fff4'),       position:{x:440,y:170}, mobilePosition:{x:300,y:170} },
  ],
  edges: [
    { id:'a-p',   source:'app', target:'pri',label:'write',      sourceHandle:'top-s',  targetHandle:'left',    type:'smoothstep' },
    { id:'a-r1',  source:'app', target:'r1', label:'read',       sourceHandle:'bottom', targetHandle:'left',    type:'smoothstep' },
    { id:'p-r1',  source:'pri', target:'r1', label:'replicate',  sourceHandle:'bottom', targetHandle:'top',     type:'smoothstep' },
    { id:'p-r2',  source:'pri', target:'r2', label:'replicate',  sourceHandle:'right',  targetHandle:'left',    type:'smoothstep' },
    { id:'a-r2',  source:'app', target:'r2', label:'read',       sourceHandle:'right',  targetHandle:'top',     type:'smoothstep' },
  ],
  steps: [
    { label:'Primary Accepts Writes', description:'All write operations go to the primary DB — single source of truth', activeNodes:['app','pri'], animatedEdges:['a-p'], edgeColor:{'a-p':C.primary} },
    { label:'Primary Replicates', description:'Primary streams changes to replica nodes — WAL (write-ahead log) based replication', activeNodes:['pri','r1','r2'], animatedEdges:['p-r1','p-r2'], edgeColor:{'p-r1':C.blue,'p-r2':C.green} },
    { label:'Replicas Serve Reads', description:'Read traffic distributed across replicas — 10x read capacity with 3 replicas', activeNodes:['app','r1','r2'], animatedEdges:['a-r1','a-r2'], edgeColor:{'a-r1':C.blue,'a-r2':C.green} },
    { label:'Replication Lag', description:'Replicas are slightly behind primary — eventual consistency. Avoid reading critical data from replicas', activeNodes:['pri','r1'], animatedEdges:['p-r1'], edgeColor:{'p-r1':C.orange} },
    { label:'Failover', description:'If primary fails, promote a replica to primary — automated with tools like Patroni', activeNodes:['r1'], animatedEdges:[], edgeColor:{}, nodeOverride:{'r1':{hit:true}} },
  ],
};

export const shardingDef: FlowDef = {
  nodes: [
    { id:'app', label:'App',      sublabel:'Hash router',      icon:(a)=>srv(a?C.primary:'#C4B5FD',a?C.primaryBg:'#F5F3FF'),     position:{x:20,y:170},  mobilePosition:{x:10,y:170} },
    { id:'sh1', label:'Shard 1', sublabel:'User ID 0-33%',    icon:(a)=>cyl(a?C.primary:'#C4B5FD',a?C.primaryBg:'#F5F3FF'),     position:{x:260,y:30},  mobilePosition:{x:170,y:30} },
    { id:'sh2', label:'Shard 2', sublabel:'User ID 33-66%',   icon:(a)=>cyl(a?C.orange:'#fdba74', a?C.orangeBg:'#fff7ed'),       position:{x:260,y:170}, mobilePosition:{x:170,y:170} },
    { id:'sh3', label:'Shard 3', sublabel:'User ID 66-100%',  icon:(a)=>cyl(a?C.green:'#86efac',  a?C.greenBg:'#f0fff4'),        position:{x:260,y:310}, mobilePosition:{x:170,y:310} },
    { id:'prb', label:'Problem', sublabel:'Cross-shard joins', icon:(a)=>box(a?C.red:'#fca5a5',   a?C.redBg:'#fff5f5', '!'),     position:{x:470,y:170}, mobilePosition:{x:320,y:170} },
  ],
  edges: [
    { id:'a-s1', source:'app', target:'sh1',label:'hash%3=0', sourceHandle:'top-s',  targetHandle:'left',    type:'smoothstep' },
    { id:'a-s2', source:'app', target:'sh2',label:'hash%3=1', sourceHandle:'right',  targetHandle:'left',    type:'smoothstep' },
    { id:'a-s3', source:'app', target:'sh3',label:'hash%3=2', sourceHandle:'bottom', targetHandle:'left',    type:'smoothstep' },
    { id:'s2-p', source:'sh2', target:'prb',label:'cross join',sourceHandle:'right', targetHandle:'left',    type:'smoothstep' },
  ],
  steps: [
    { label:'Why Shard?', description:'Single DB cannot handle write volume — shard splits data horizontally across multiple DB instances', activeNodes:['app'], animatedEdges:[], edgeColor:{} },
    { label:'Hash-Based Sharding', description:'Hash(user_id) % 3 determines which shard — evenly distributes data across shards', activeNodes:['app','sh1','sh2','sh3'], animatedEdges:['a-s1','a-s2','a-s3'], edgeColor:{'a-s1':C.primary,'a-s2':C.orange,'a-s3':C.green} },
    { label:'Shard 1 Gets Its Data', description:'Users whose ID hashes to shard 1 — all their data lives on shard 1 only', activeNodes:['app','sh1'], animatedEdges:['a-s1'], edgeColor:{'a-s1':C.primary} },
    { label:'Cross-Shard Joins Problem', description:'Cannot JOIN across shards — data is on different machines. Design to avoid this!', activeNodes:['sh2','prb'], animatedEdges:['s2-p'], edgeColor:{'s2-p':C.red} },
    { label:'Hot Shard Problem', description:'If one key range is very popular, that shard is overwhelmed — consistent hashing helps', activeNodes:['sh2'], animatedEdges:[], edgeColor:{}, nodeOverride:{'sh2':{warn:true}} },
  ],
};

export const transactionsDef: FlowDef = {
  nodes: [
    { id:'txn', label:'Transaction', sublabel:'BEGIN/COMMIT',    icon:(a)=>box(a?C.primary:'#C4B5FD',a?C.primaryBg:'#F5F3FF','TXN'), position:{x:20,y:170},  mobilePosition:{x:10,y:170} },
    { id:'ato', label:'Atomic',      sublabel:'All or nothing',  icon:(a)=>box(a?C.blue:'#93c5fd',  a?C.blueBg:'#eff6ff', 'A'),    position:{x:230,y:30},  mobilePosition:{x:160,y:30} },
    { id:'con', label:'Consistent',  sublabel:'Valid state',     icon:(a)=>box(a?C.green:'#86efac', a?C.greenBg:'#f0fff4','C'),    position:{x:230,y:160}, mobilePosition:{x:160,y:160} },
    { id:'iso', label:'Isolated',    sublabel:'No dirty reads',  icon:(a)=>box(a?C.orange:'#fdba74',a?C.orangeBg:'#fff7ed','I'),   position:{x:230,y:290}, mobilePosition:{x:160,y:290} },
    { id:'dur', label:'Durable',     sublabel:'Survived crash',  icon:(a)=>box(a?C.red:'#fca5a5',  a?C.redBg:'#fff5f5', 'D'),    position:{x:430,y:160}, mobilePosition:{x:300,y:160} },
  ],
  edges: [
    { id:'t-a',  source:'txn', target:'ato',label:'guarantees', sourceHandle:'top-s',  targetHandle:'left',    type:'smoothstep' },
    { id:'t-c',  source:'txn', target:'con',label:'guarantees', sourceHandle:'right',  targetHandle:'left',    type:'smoothstep' },
    { id:'t-i',  source:'txn', target:'iso',label:'guarantees', sourceHandle:'bottom', targetHandle:'left',    type:'smoothstep' },
    { id:'a-d',  source:'ato', target:'dur',label:'persists',   sourceHandle:'right',  targetHandle:'top',     type:'smoothstep' },
    { id:'c-d',  source:'con', target:'dur',label:'persists',   sourceHandle:'right',  targetHandle:'left',    type:'smoothstep' },
    { id:'i-d',  source:'iso', target:'dur',label:'persists',   sourceHandle:'right',  targetHandle:'bottom-t',type:'smoothstep' },
  ],
  steps: [
    { label:'Atomic', description:'All operations in a transaction succeed together or all roll back — no partial updates', activeNodes:['txn','ato'], animatedEdges:['t-a'], edgeColor:{'t-a':C.blue} },
    { label:'Consistent', description:'Transaction moves DB from one valid state to another — constraints always satisfied', activeNodes:['txn','con'], animatedEdges:['t-c'], edgeColor:{'t-c':C.green} },
    { label:'Isolated', description:'Concurrent transactions do not see each other\'s partial changes — prevents dirty reads', activeNodes:['txn','iso'], animatedEdges:['t-i'], edgeColor:{'t-i':C.orange} },
    { label:'Durable', description:'Once committed, data survives crashes — written to WAL and disk before COMMIT returns', activeNodes:['ato','con','iso','dur'], animatedEdges:['a-d','c-d','i-d'], edgeColor:{'a-d':C.blue,'c-d':C.green,'i-d':C.orange} },
    { label:'ACID in Practice', description:'Bank transfer: debit account A AND credit account B — atomic, consistent, isolated, durable', activeNodes:['txn','ato','con','iso','dur'], animatedEdges:['t-a','t-c','t-i'], edgeColor:{'t-a':C.blue,'t-c':C.green,'t-i':C.orange} },
  ],
};

export const capTheoremDbDef: FlowDef = {
  nodes: [
    { id:'cap', label:'CAP Theorem',sublabel:'Pick 2 of 3',     icon:(a)=>box(a?C.primary:'#C4B5FD',a?C.primaryBg:'#F5F3FF','CAP'), position:{x:20,y:170},  mobilePosition:{x:10,y:170} },
    { id:'con', label:'Consistency',sublabel:'All nodes same',  icon:(a)=>box(a?C.blue:'#93c5fd',  a?C.blueBg:'#eff6ff', 'C'),    position:{x:260,y:30},  mobilePosition:{x:170,y:30} },
    { id:'ava', label:'Availability',sublabel:'Always responds',icon:(a)=>box(a?C.green:'#86efac', a?C.greenBg:'#f0fff4','A'),    position:{x:260,y:170}, mobilePosition:{x:170,y:170} },
    { id:'par', label:'Partition Tol.',sublabel:'Survives split',icon:(a)=>box(a?C.orange:'#fdba74',a?C.orangeBg:'#fff7ed','P'),  position:{x:260,y:310}, mobilePosition:{x:170,y:310} },
    { id:'db',  label:'DB Examples', sublabel:'CP vs AP',       icon:(a)=>cyl(a?C.primary:'#C4B5FD',a?C.primaryBg:'#F5F3FF'),     position:{x:470,y:170}, mobilePosition:{x:320,y:170} },
  ],
  edges: [
    { id:'cap-c', source:'cap', target:'con',label:'trade-off', sourceHandle:'top-s',  targetHandle:'left',    type:'smoothstep' },
    { id:'cap-a', source:'cap', target:'ava',label:'trade-off', sourceHandle:'right',  targetHandle:'left',    type:'smoothstep' },
    { id:'cap-p', source:'cap', target:'par',label:'trade-off', sourceHandle:'bottom', targetHandle:'left',    type:'smoothstep' },
    { id:'c-db',  source:'con', target:'db', label:'CP: Zookeeper',sourceHandle:'right',targetHandle:'top',   type:'smoothstep' },
    { id:'a-db',  source:'ava', target:'db', label:'AP: Cassandra',sourceHandle:'right',targetHandle:'left',  type:'smoothstep' },
  ],
  steps: [
    { label:'CAP Theorem', description:'A distributed DB can guarantee at most 2 of 3 properties: Consistency, Availability, Partition Tolerance', activeNodes:['cap'], animatedEdges:[], edgeColor:{} },
    { label:'Consistency', description:'Every read gets the most recent write — all nodes see the same data at the same time', activeNodes:['cap','con'], animatedEdges:['cap-c'], edgeColor:{'cap-c':C.blue} },
    { label:'Availability', description:'Every request gets a response — even if some nodes are down, system keeps serving', activeNodes:['cap','ava'], animatedEdges:['cap-a'], edgeColor:{'cap-a':C.green} },
    { label:'Partition Tolerance', description:'System continues operating even if network partitions split nodes — required in practice', activeNodes:['cap','par'], animatedEdges:['cap-p'], edgeColor:{'cap-p':C.orange} },
    { label:'CP vs AP Databases', description:'CP (Consistency+Partition): PostgreSQL, Zookeeper. AP (Availability+Partition): Cassandra, DynamoDB', activeNodes:['con','ava','db'], animatedEdges:['c-db','a-db'], edgeColor:{'c-db':C.blue,'a-db':C.green} },
  ],
};

export const databaseFlowMap: Record<string, FlowDef> = {
  'Database Design Fundamentals':          dbFundamentalsDef,
  'SQL vs NoSQL Databases':                sqlNoSqlDef,
  'Data Modeling and Schema Design':       dataModelingDef,
  'Normalization and Denormalization':     normalizationDef,
  'Indexing and Query Optimization':       indexingDef,
  'Database Replication':                  dbReplicationDef,
  'Database Sharding and Partitioning':    shardingDef,
  'Transactions and ACID Properties':      transactionsDef,
  'Consistency and CAP Theorem':           capTheoremDbDef,
};
