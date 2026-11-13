import React from 'react';
import { C, type FlowDef } from '../HLDFlow';

const box = (c: string, bg: string, t: string) => <svg width="32" height="28" viewBox="0 0 48 40" fill="none"><rect x="4" y="4" width="40" height="32" rx="6" fill={bg} stroke={c} strokeWidth="2"/><text x="24" y="24" textAnchor="middle" fontSize="9" fontWeight="700" fill={c}>{t}</text></svg>;
const srv = (c: string, bg: string) => <svg width="32" height="32" viewBox="0 0 48 48" fill="none"><rect x="4" y="8" width="40" height="10" rx="3" fill={c} stroke={c} strokeWidth="1.5"/><rect x="4" y="22" width="40" height="10" rx="3" fill={bg} stroke={c} strokeWidth="1.5"/><rect x="4" y="36" width="40" height="10" rx="3" fill={bg} stroke={c} strokeWidth="1.5"/><circle cx="36" cy="13" r="2" fill="white"/></svg>;
const usr = (c: string, bg: string) => <svg width="28" height="34" viewBox="0 0 44 52" fill="none"><circle cx="22" cy="14" r="10" fill={c} stroke={c} strokeWidth="2"/><path d="M4 46c0-9.941 8.059-18 18-18s18 8.059 18 18" fill={bg} stroke={c} strokeWidth="2" strokeLinecap="round"/></svg>;

export const cdnFundamentalsDef: FlowDef = {
  nodes: [
    { id:'usr', label:'User',         sublabel:'Tokyo, Japan',   icon:(a)=>usr(a?C.primary:'#C4B5FD',a?C.primaryBg:'#F5F3FF'),     position:{x:20,y:170},  mobilePosition:{x:10,y:170} },
    { id:'edge',label:'Edge Server',  sublabel:'Tokyo PoP',      icon:(a)=>box(a?C.orange:'#fdba74',a?C.orangeBg:'#fff7ed','EDGE'), position:{x:230,y:60},  mobilePosition:{x:160,y:60} },
    { id:'ori', label:'Origin',       sublabel:'US-East server', icon:(a)=>srv(a?C.blue:'#93c5fd',  a?C.blueBg:'#eff6ff'),         position:{x:430,y:170}, mobilePosition:{x:300,y:170} },
    { id:'hit', label:'Cache HIT',    sublabel:'<10ms response', icon:(a)=>box(a?C.green:'#86efac', a?C.greenBg:'#f0fff4', 'HIT'), position:{x:230,y:280}, mobilePosition:{x:160,y:280} },
  ],
  edges: [
    { id:'u-e',   source:'usr', target:'edge',label:'request',    sourceHandle:'top-s',  targetHandle:'left',    type:'smoothstep' },
    { id:'e-ori', source:'edge',target:'ori', label:'cache miss',  sourceHandle:'right',  targetHandle:'left',    type:'smoothstep' },
    { id:'ori-e', source:'ori', target:'edge',label:'content',    sourceHandle:'left-s', targetHandle:'right-t', type:'smoothstep' },
    { id:'e-h',   source:'edge',target:'hit', label:'cache hit',  sourceHandle:'bottom', targetHandle:'top',     type:'smoothstep' },
    { id:'h-u',   source:'hit', target:'usr', label:'fast reply', sourceHandle:'left-s', targetHandle:'right-t', type:'smoothstep' },
  ],
  steps: [
    { label:'User Requests Content', description:'User in Tokyo requests a file — without CDN it must travel to US server (~150ms latency)', activeNodes:['usr','edge'], animatedEdges:['u-e'], edgeColor:{'u-e':C.primary} },
    { label:'Edge Server Cache Miss', description:'First request — edge server does not have this file yet, fetches from origin', activeNodes:['edge','ori'], animatedEdges:['e-ori'], edgeColor:{'e-ori':C.orange} },
    { label:'Origin Delivers Content', description:'US origin server sends file to Tokyo edge server — happens once per file', activeNodes:['ori','edge'], animatedEdges:['ori-e'], edgeColor:{'ori-e':C.blue} },
    { label:'Edge Caches + Serves', description:'Edge stores the file — next request from Tokyo is served in <10ms without touching origin', activeNodes:['edge','hit'], animatedEdges:['e-h'], edgeColor:{'e-h':C.green} },
    { label:'User Gets Fast Response', description:'All subsequent Tokyo users get cached response from local edge — 10ms vs 150ms', activeNodes:['hit','usr'], animatedEdges:['h-u'], edgeColor:{'h-u':C.green} },
  ],
};

export const cdnArchDef: FlowDef = {
  nodes: [
    { id:'ori',  label:'Origin',      sublabel:'Source of truth',  icon:(a)=>srv(a?C.blue:'#93c5fd', a?C.blueBg:'#eff6ff'),         position:{x:20,y:170},  mobilePosition:{x:10,y:170} },
    { id:'e1',   label:'PoP US',      sublabel:'Edge — New York', icon:(a)=>box(a?C.primary:'#C4B5FD',a?C.primaryBg:'#F5F3FF','US'), position:{x:270,y:30},  mobilePosition:{x:180,y:30} },
    { id:'e2',   label:'PoP EU',      sublabel:'Edge — London',   icon:(a)=>box(a?C.orange:'#fdba74',a?C.orangeBg:'#fff7ed','EU'), position:{x:270,y:170}, mobilePosition:{x:180,y:170} },
    { id:'e3',   label:'PoP APAC',    sublabel:'Edge — Tokyo',    icon:(a)=>box(a?C.green:'#86efac',a?C.greenBg:'#f0fff4','AP'),   position:{x:270,y:310}, mobilePosition:{x:180,y:310} },
    { id:'dns',  label:'DNS',         sublabel:'Anycast routing', icon:(a)=>box(a?C.red:'#fca5a5', a?C.redBg:'#fff5f5','DNS'),     position:{x:480,y:170}, mobilePosition:{x:320,y:170} },
  ],
  edges: [
    { id:'o-e1', source:'ori', target:'e1', label:'replicate',  sourceHandle:'top-s',  targetHandle:'left',    type:'smoothstep' },
    { id:'o-e2', source:'ori', target:'e2', label:'replicate',  sourceHandle:'right',  targetHandle:'left',    type:'smoothstep' },
    { id:'o-e3', source:'ori', target:'e3', label:'replicate',  sourceHandle:'bottom', targetHandle:'left',    type:'smoothstep' },
    { id:'e1-d', source:'e1',  target:'dns',label:'serve',      sourceHandle:'right',  targetHandle:'top',     type:'smoothstep' },
    { id:'e2-d', source:'e2',  target:'dns',label:'serve',      sourceHandle:'right',  targetHandle:'left',    type:'smoothstep' },
    { id:'e3-d', source:'e3',  target:'dns',label:'serve',      sourceHandle:'right',  targetHandle:'bottom-t',type:'smoothstep' },
  ],
  steps: [
    { label:'Origin Server', description:'One authoritative server holds the original content — all edge servers pull from here', activeNodes:['ori'], animatedEdges:[], edgeColor:{} },
    { label:'Points of Presence (PoPs)', description:'CDN operates dozens of PoPs globally — servers physically near users in each region', activeNodes:['ori','e1','e2','e3'], animatedEdges:['o-e1','o-e2','o-e3'], edgeColor:{'o-e1':C.primary,'o-e2':C.orange,'o-e3':C.green} },
    { label:'DNS Anycast Routing', description:'DNS resolves to nearest PoP automatically — user gets routed to closest edge server', activeNodes:['e1','e2','e3','dns'], animatedEdges:['e1-d','e2-d','e3-d'], edgeColor:{'e1-d':C.primary,'e2-d':C.orange,'e3-d':C.green} },
    { label:'Content Replication', description:'Content pushed or lazily pulled to edge servers — cached based on popularity and TTL', activeNodes:['ori','e1','e2'], animatedEdges:['o-e1','o-e2'], edgeColor:{'o-e1':C.blue,'o-e2':C.blue} },
    { label:'Global Low Latency', description:'Users worldwide get content from their nearest PoP — consistent performance regardless of location', activeNodes:['e1','e2','e3'], animatedEdges:[], edgeColor:{}, nodeOverride:{'e1':{hit:true},'e2':{hit:true},'e3':{hit:true}} },
  ],
};

export const pushVsPullDef: FlowDef = {
  nodes: [
    { id:'ori',  label:'Origin',    sublabel:'Source',          icon:(a)=>srv(a?C.blue:'#93c5fd', a?C.blueBg:'#eff6ff'),         position:{x:20,y:170},  mobilePosition:{x:10,y:170} },
    { id:'push', label:'Push CDN',  sublabel:'Pre-uploaded',    icon:(a)=>box(a?C.primary:'#C4B5FD',a?C.primaryBg:'#F5F3FF','PSH'), position:{x:260,y:60},  mobilePosition:{x:170,y:60} },
    { id:'pull', label:'Pull CDN',  sublabel:'On-demand cache', icon:(a)=>box(a?C.green:'#86efac',a?C.greenBg:'#f0fff4','PLL'),   position:{x:260,y:280}, mobilePosition:{x:170,y:280} },
    { id:'usr',  label:'User',      sublabel:'Requests file',   icon:(a)=>usr(a?C.primary:'#C4B5FD',a?C.primaryBg:'#F5F3FF'),     position:{x:470,y:170}, mobilePosition:{x:320,y:170} },
  ],
  edges: [
    { id:'o-ps', source:'ori',  target:'push',label:'you upload',   sourceHandle:'top-s',  targetHandle:'left',    type:'smoothstep' },
    { id:'ps-u', source:'push', target:'usr', label:'cached',       sourceHandle:'right',  targetHandle:'top',     type:'smoothstep' },
    { id:'u-pl', source:'usr',  target:'pull',label:'miss→origin',  sourceHandle:'bottom', targetHandle:'right-t', type:'smoothstep' },
    { id:'o-pl', source:'ori',  target:'pull',label:'pull+cache',   sourceHandle:'bottom', targetHandle:'left',    type:'smoothstep' },
    { id:'pl-u', source:'pull', target:'usr', label:'cached',       sourceHandle:'right',  targetHandle:'bottom-t',type:'smoothstep' },
  ],
  steps: [
    { label:'Push CDN', description:'You push content to the CDN before users request it — files are pre-cached at all edge servers', activeNodes:['ori','push'], animatedEdges:['o-ps'], edgeColor:{'o-ps':C.primary} },
    { label:'Push CDN: Always Fast', description:'No cache miss possible — content already at edge. Best for static files that rarely change', activeNodes:['push','usr'], animatedEdges:['ps-u'], edgeColor:{'ps-u':C.green} },
    { label:'Pull CDN', description:'Edge fetches from origin on first request — subsequent requests served from cache', activeNodes:['usr','pull','ori'], animatedEdges:['u-pl','o-pl'], edgeColor:{'u-pl':C.orange,'o-pl':C.blue} },
    { label:'Pull CDN: Lazy Caching', description:'Only popular files get cached — no wasted space for rarely-requested content', activeNodes:['pull','usr'], animatedEdges:['pl-u'], edgeColor:{'pl-u':C.green} },
    { label:'When to Use Which', description:'Push: gaming assets, videos, known large files. Pull: websites, APIs, dynamic content — most use Pull', activeNodes:['push','pull'], animatedEdges:[], edgeColor:{} },
  ],
};

export const cacheInvalidationCdnDef: FlowDef = {
  nodes: [
    { id:'ori',  label:'Origin',    sublabel:'Updated file',    icon:(a)=>srv(a?C.blue:'#93c5fd', a?C.blueBg:'#eff6ff'),          position:{x:20,y:170},  mobilePosition:{x:10,y:170} },
    { id:'edge', label:'Edge',      sublabel:'Stale cache',     icon:(a)=>box(a?C.orange:'#fdba74',a?C.orangeBg:'#fff7ed','EDGE'), position:{x:230,y:60},  mobilePosition:{x:160,y:60} },
    { id:'ttl',  label:'TTL Expire',sublabel:'Auto-expire',     icon:(a)=>box(a?C.green:'#86efac',a?C.greenBg:'#f0fff4', 'TTL'), position:{x:230,y:280}, mobilePosition:{x:160,y:280} },
    { id:'purge',label:'Purge API', sublabel:'Instant clear',   icon:(a)=>box(a?C.red:'#fca5a5', a?C.redBg:'#fff5f5','PURGE'),    position:{x:430,y:170}, mobilePosition:{x:300,y:170} },
  ],
  edges: [
    { id:'o-e',    source:'ori',  target:'edge', label:'stale!',    sourceHandle:'top-s',  targetHandle:'left',    type:'smoothstep' },
    { id:'e-ttl',  source:'edge', target:'ttl',  label:'wait TTL',  sourceHandle:'bottom', targetHandle:'top',     type:'smoothstep' },
    { id:'ttl-e',  source:'ttl',  target:'edge', label:'re-fetch',  sourceHandle:'top-s',  targetHandle:'bottom-t',type:'smoothstep' },
    { id:'o-purge',source:'ori',  target:'purge',label:'invalidate',sourceHandle:'right',  targetHandle:'left',    type:'smoothstep' },
    { id:'purge-e',source:'purge',target:'edge', label:'clear now', sourceHandle:'left-s', targetHandle:'right-t', type:'smoothstep' },
  ],
  steps: [
    { label:'Stale Content Problem', description:'You updated a file on origin — edge servers still serve the old version until cache expires', activeNodes:['ori','edge'], animatedEdges:['o-e'], edgeColor:{'o-e':C.orange}, nodeOverride:{'edge':{warn:true}} },
    { label:'TTL-Based Expiry', description:'Each cached file has a TTL (Cache-Control: max-age=86400) — expires after 24h automatically', activeNodes:['edge','ttl'], animatedEdges:['e-ttl'], edgeColor:{'e-ttl':C.orange} },
    { label:'Re-fetch After TTL', description:'After TTL expires, edge re-fetches fresh content from origin on next request', activeNodes:['ttl','edge'], animatedEdges:['ttl-e'], edgeColor:{'ttl-e':C.green} },
    { label:'Instant Purge API', description:'CDN providers offer purge API — immediately invalidate specific URLs across all edge servers', activeNodes:['ori','purge'], animatedEdges:['o-purge'], edgeColor:{'o-purge':C.red} },
    { label:'Edge Cleared Instantly', description:'Purge clears cached file at all PoPs — next request fetches fresh content from origin', activeNodes:['purge','edge'], animatedEdges:['purge-e'], edgeColor:{'purge-e':C.green} },
  ],
};

export const cdnSecurityDef: FlowDef = {
  nodes: [
    { id:'atk',  label:'Attacker',   sublabel:'DDoS / bots',    icon:(a)=>usr(a?C.red:'#fca5a5',  a?C.redBg:'#fff5f5'),           position:{x:20,y:60},   mobilePosition:{x:10,y:60} },
    { id:'usr',  label:'User',       sublabel:'Legitimate',     icon:(a)=>usr(a?C.green:'#86efac', a?C.greenBg:'#f0fff4'),         position:{x:20,y:280},  mobilePosition:{x:10,y:280} },
    { id:'cdn',  label:'CDN Edge',   sublabel:'Shield + WAF',   icon:(a)=>box(a?C.orange:'#fdba74',a?C.orangeBg:'#fff7ed','CDN'), position:{x:250,y:170}, mobilePosition:{x:160,y:170} },
    { id:'ori',  label:'Origin',     sublabel:'Protected',      icon:(a)=>srv(a?C.blue:'#93c5fd',  a?C.blueBg:'#eff6ff'),         position:{x:460,y:170}, mobilePosition:{x:310,y:170} },
  ],
  edges: [
    { id:'a-cdn',  source:'atk', target:'cdn',label:'attack', sourceHandle:'right',  targetHandle:'top',     type:'smoothstep' },
    { id:'u-cdn',  source:'usr', target:'cdn',label:'request',sourceHandle:'right',  targetHandle:'bottom-t',type:'smoothstep' },
    { id:'cdn-blk',source:'cdn', target:'atk',label:'block',  sourceHandle:'left-s', targetHandle:'right-t', type:'smoothstep' },
    { id:'cdn-ori',source:'cdn', target:'ori',label:'allow',  sourceHandle:'right',  targetHandle:'left',    type:'smoothstep' },
  ],
  steps: [
    { label:'CDN as Shield', description:'Origin server IP is hidden behind CDN — attackers cannot target origin directly', activeNodes:['ori'], animatedEdges:[], edgeColor:{} },
    { label:'DDoS Attack Absorbed', description:'CDN absorbs volumetric attacks across global PoPs — no single point overwhelmed', activeNodes:['atk','cdn'], animatedEdges:['a-cdn'], edgeColor:{'a-cdn':C.red} },
    { label:'Attack Blocked', description:'CDN blocks attack traffic — rate limits, IP reputation, challenge pages for bots', activeNodes:['cdn','atk'], animatedEdges:['cdn-blk'], edgeColor:{'cdn-blk':C.red}, nodeOverride:{'atk':{miss:true}} },
    { label:'Legitimate User Served', description:'Real users pass through smoothly — cached content served with HTTPS', activeNodes:['usr','cdn'], animatedEdges:['u-cdn'], edgeColor:{'u-cdn':C.green} },
    { label:'Origin Stays Clean', description:'Only CDN reaches origin — origin never exposed to attack traffic', activeNodes:['cdn','ori'], animatedEdges:['cdn-ori'], edgeColor:{'cdn-ori':C.green} },
  ],
};

export const cdnFlowMap: Record<string, FlowDef> = {
  'CDN Fundamentals':                cdnFundamentalsDef,
  'CDN Architecture and Components': cdnArchDef,
  'Edge Servers and Points of Presence': cdnArchDef,
  'Origin Servers and Edge Caching': cdnFundamentalsDef,
  'CDN Request Routing':             cdnArchDef,
  'Push CDN vs Pull CDN':            pushVsPullDef,
  'Static vs Dynamic Content':       pushVsPullDef,
  'Cache Invalidation and Purging':  cacheInvalidationCdnDef,
  'CDN Security':                    cdnSecurityDef,
};
