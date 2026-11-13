import React from 'react';
import { C, type FlowDef } from '../HLDFlow';

const box = (c: string, bg: string, t: string) => <svg width="32" height="28" viewBox="0 0 48 40" fill="none"><rect x="4" y="4" width="40" height="32" rx="6" fill={bg} stroke={c} strokeWidth="2"/><text x="24" y="24" textAnchor="middle" fontSize="9" fontWeight="700" fill={c}>{t}</text></svg>;
const srv = (c: string, bg: string) => <svg width="32" height="32" viewBox="0 0 48 48" fill="none"><rect x="4" y="8" width="40" height="10" rx="3" fill={c} stroke={c} strokeWidth="1.5"/><rect x="4" y="22" width="40" height="10" rx="3" fill={bg} stroke={c} strokeWidth="1.5"/><rect x="4" y="36" width="40" height="10" rx="3" fill={bg} stroke={c} strokeWidth="1.5"/><circle cx="36" cy="13" r="2" fill="white"/></svg>;

export const obsFundamentalsDef: FlowDef = {
  nodes: [
    { id:'svc',  label:'Service',    sublabel:'Running',         icon:(a)=>srv(a?C.primary:'#C4B5FD',a?C.primaryBg:'#F5F3FF'),     position:{x:20,y:170},  mobilePosition:{x:10,y:170} },
    { id:'log',  label:'Logs',       sublabel:'What happened',   icon:(a)=>box(a?C.blue:'#93c5fd', a?C.blueBg:'#eff6ff', 'LOG'), position:{x:250,y:30},  mobilePosition:{x:170,y:30} },
    { id:'met',  label:'Metrics',    sublabel:'How much/fast',   icon:(a)=>box(a?C.orange:'#fdba74',a?C.orangeBg:'#fff7ed','MET'), position:{x:250,y:170}, mobilePosition:{x:170,y:170} },
    { id:'trc',  label:'Traces',     sublabel:'Why it happened', icon:(a)=>box(a?C.green:'#86efac',a?C.greenBg:'#f0fff4','TRC'),  position:{x:250,y:310}, mobilePosition:{x:170,y:310} },
    { id:'ops',  label:'Engineers',  sublabel:'Debug + fix',     icon:(a)=>srv(a?C.green:'#86efac',a?C.greenBg:'#f0fff4'),        position:{x:470,y:170}, mobilePosition:{x:320,y:170} },
  ],
  edges: [
    { id:'s-l',  source:'svc', target:'log', label:'emits',  sourceHandle:'top-s',  targetHandle:'left',    type:'smoothstep' },
    { id:'s-m',  source:'svc', target:'met', label:'emits',  sourceHandle:'right',  targetHandle:'left',    type:'smoothstep' },
    { id:'s-t',  source:'svc', target:'trc', label:'emits',  sourceHandle:'bottom', targetHandle:'left',    type:'smoothstep' },
    { id:'l-o',  source:'log', target:'ops', label:'tells',  sourceHandle:'right',  targetHandle:'top',     type:'smoothstep' },
    { id:'m-o',  source:'met', target:'ops', label:'shows',  sourceHandle:'right',  targetHandle:'left',    type:'smoothstep' },
    { id:'t-o',  source:'trc', target:'ops', label:'reveals',sourceHandle:'right',  targetHandle:'bottom-t',type:'smoothstep' },
  ],
  steps: [
    { label:'Three Pillars of Observability', description:'Logs, Metrics, and Traces — together they give you full visibility into distributed systems', activeNodes:['svc','log','met','trc'], animatedEdges:['s-l','s-m','s-t'], edgeColor:{'s-l':C.blue,'s-m':C.orange,'s-t':C.green} },
    { label:'Logs: What Happened', description:'Timestamped records of events — "user 123 added item to cart at 10:03:42" — structured JSON preferred', activeNodes:['svc','log'], animatedEdges:['s-l'], edgeColor:{'s-l':C.blue} },
    { label:'Metrics: How Much / How Fast', description:'Numeric measurements over time — CPU 80%, 1,200 RPS, p99 latency 450ms', activeNodes:['svc','met'], animatedEdges:['s-m'], edgeColor:{'s-m':C.orange} },
    { label:'Traces: Why It Happened', description:'Tracks request across services — shows exactly where time was spent in each microservice', activeNodes:['svc','trc'], animatedEdges:['s-t'], edgeColor:{'s-t':C.green} },
    { label:'Engineers Debug Fast', description:'Alert fires → metrics show high latency → trace shows DB is slow → logs show the bad query', activeNodes:['log','met','trc','ops'], animatedEdges:['l-o','m-o','t-o'], edgeColor:{'l-o':C.blue,'m-o':C.orange,'t-o':C.green} },
  ],
};

export const metricsMonitoringDef: FlowDef = {
  nodes: [
    { id:'svc',  label:'Service',    sublabel:'Emits metrics',   icon:(a)=>srv(a?C.primary:'#C4B5FD',a?C.primaryBg:'#F5F3FF'),     position:{x:20,y:170},  mobilePosition:{x:10,y:170} },
    { id:'prom', label:'Prometheus', sublabel:'Scrape + store',  icon:(a)=>box(a?C.orange:'#fdba74',a?C.orangeBg:'#fff7ed','PRO'), position:{x:230,y:170}, mobilePosition:{x:160,y:170} },
    { id:'graf', label:'Grafana',    sublabel:'Dashboards',      icon:(a)=>box(a?C.blue:'#93c5fd', a?C.blueBg:'#eff6ff','GRF'),   position:{x:430,y:60},  mobilePosition:{x:300,y:60} },
    { id:'alrt', label:'Alert Mgr',  sublabel:'PagerDuty',       icon:(a)=>box(a?C.red:'#fca5a5', a?C.redBg:'#fff5f5','ALT'),     position:{x:430,y:280}, mobilePosition:{x:300,y:280} },
  ],
  edges: [
    { id:'s-p',  source:'svc', target:'prom',label:'expose /metrics', sourceHandle:'right',  targetHandle:'left',    type:'smoothstep' },
    { id:'p-g',  source:'prom',target:'graf',label:'query',           sourceHandle:'top-s',  targetHandle:'left',    type:'smoothstep' },
    { id:'p-a',  source:'prom',target:'alrt',label:'threshold',       sourceHandle:'bottom', targetHandle:'left',    type:'smoothstep' },
  ],
  steps: [
    { label:'Service Exposes Metrics', description:'Service exposes /metrics endpoint with Prometheus format — counter, gauge, histogram', activeNodes:['svc','prom'], animatedEdges:['s-p'], edgeColor:{'s-p':C.orange} },
    { label:'Prometheus Scrapes', description:'Prometheus scrapes every 15s — time series database stores all metrics', activeNodes:['prom'], animatedEdges:[], edgeColor:{} },
    { label:'Grafana Dashboards', description:'Query PromQL in Grafana — visualize CPU, memory, error rate, latency over time', activeNodes:['prom','graf'], animatedEdges:['p-g'], edgeColor:{'p-g':C.blue} },
    { label:'Alert on Thresholds', description:'AlertManager fires if error_rate > 1% for 5 minutes — pages on-call engineer', activeNodes:['prom','alrt'], animatedEdges:['p-a'], edgeColor:{'p-a':C.red} },
    { label:'Four Golden Signals', description:'Monitor these for every service: Latency, Traffic (RPS), Errors (%), Saturation (CPU/queue)', activeNodes:['prom','graf'], animatedEdges:['p-g'], edgeColor:{'p-g':C.orange} },
  ],
};

export const distributedTracingDef: FlowDef = {
  nodes: [
    { id:'cl',   label:'Client',    sublabel:'Request',          icon:(a)=>box(a?C.primary:'#C4B5FD',a?C.primaryBg:'#F5F3FF','CL'), position:{x:20,y:170},  mobilePosition:{x:10,y:170} },
    { id:'s1',   label:'API GW',    sublabel:'span 1: 10ms',    icon:(a)=>srv(a?C.orange:'#fdba74', a?C.orangeBg:'#fff7ed'),        position:{x:220,y:60},  mobilePosition:{x:150,y:60} },
    { id:'s2',   label:'User Svc',  sublabel:'span 2: 5ms',     icon:(a)=>srv(a?C.blue:'#93c5fd',  a?C.blueBg:'#eff6ff'),          position:{x:220,y:280}, mobilePosition:{x:150,y:280} },
    { id:'s3',   label:'DB',        sublabel:'span 3: 200ms(!)',icon:(a)=>srv(a?C.red:'#fca5a5',   a?C.redBg:'#fff5f5'),           position:{x:430,y:170}, mobilePosition:{x:300,y:170} },
  ],
  edges: [
    { id:'c-s1', source:'cl',  target:'s1', label:'trace-id', sourceHandle:'top-s',  targetHandle:'left',    type:'smoothstep' },
    { id:'c-s2', source:'cl',  target:'s2', label:'trace-id', sourceHandle:'bottom', targetHandle:'left',    type:'smoothstep' },
    { id:'s1-s3',source:'s1',  target:'s3', label:'span',     sourceHandle:'right',  targetHandle:'top',     type:'smoothstep' },
    { id:'s2-s3',source:'s2',  target:'s3', label:'span',     sourceHandle:'right',  targetHandle:'bottom-t',type:'smoothstep' },
  ],
  steps: [
    { label:'Trace ID Propagated', description:'Unique trace ID injected on first request — every service passes it in headers', activeNodes:['cl','s1','s2'], animatedEdges:['c-s1','c-s2'], edgeColor:{'c-s1':C.primary,'c-s2':C.blue} },
    { label:'API Gateway Span', description:'API GW records its span: 10ms for auth + routing — fast', activeNodes:['cl','s1'], animatedEdges:['c-s1'], edgeColor:{'c-s1':C.orange} },
    { label:'User Service Span', description:'User service records 5ms — also fast', activeNodes:['cl','s2'], animatedEdges:['c-s2'], edgeColor:{'c-s2':C.blue} },
    { label:'DB Span: 200ms Bottleneck', description:'Database span shows 200ms — missing index! This is where the latency comes from', activeNodes:['s1','s2','s3'], animatedEdges:['s1-s3','s2-s3'], edgeColor:{'s1-s3':C.red,'s2-s3':C.red}, nodeOverride:{'s3':{warn:true}} },
    { label:'Trace Shows the Full Picture', description:'Without tracing: "it is slow." With tracing: "DB query at step 3 takes 200ms due to missing index"', activeNodes:['s1','s2','s3'], animatedEdges:[], edgeColor:{} },
  ],
};

export const slosDef: FlowDef = {
  nodes: [
    { id:'sli',  label:'SLI',       sublabel:'What you measure', icon:(a)=>box(a?C.blue:'#93c5fd', a?C.blueBg:'#eff6ff','SLI'),   position:{x:20,y:170},  mobilePosition:{x:10,y:170} },
    { id:'slo',  label:'SLO',       sublabel:'Target you set',   icon:(a)=>box(a?C.orange:'#fdba74',a?C.orangeBg:'#fff7ed','SLO'), position:{x:230,y:170}, mobilePosition:{x:160,y:170} },
    { id:'bud',  label:'Error Budget',sublabel:'Remaining slack', icon:(a)=>box(a?C.green:'#86efac',a?C.greenBg:'#f0fff4','BUD'), position:{x:430,y:60},  mobilePosition:{x:300,y:60} },
    { id:'sla',  label:'SLA',       sublabel:'Customer contract',icon:(a)=>box(a?C.red:'#fca5a5', a?C.redBg:'#fff5f5','SLA'),     position:{x:430,y:280}, mobilePosition:{x:300,y:280} },
  ],
  edges: [
    { id:'sli-slo',source:'sli', target:'slo',label:'measured',   sourceHandle:'right',  targetHandle:'left',    type:'smoothstep' },
    { id:'slo-b',  source:'slo', target:'bud', label:'100%-SLO',  sourceHandle:'top-s',  targetHandle:'left',    type:'smoothstep' },
    { id:'slo-sla',source:'slo', target:'sla', label:'backs',     sourceHandle:'bottom', targetHandle:'left',    type:'smoothstep' },
  ],
  steps: [
    { label:'SLI: What You Measure', description:'Service Level Indicator — the actual metric: request success rate, p99 latency, availability percentage', activeNodes:['sli'], animatedEdges:[], edgeColor:{} },
    { label:'SLO: Target You Set', description:'Service Level Objective — internal target: 99.9% success rate. If SLI drops below SLO, something is wrong', activeNodes:['sli','slo'], animatedEdges:['sli-slo'], edgeColor:{'sli-slo':C.orange} },
    { label:'Error Budget', description:'100% - 99.9% SLO = 0.1% error budget = 43 minutes/month. Spend it on new features vs reliability', activeNodes:['slo','bud'], animatedEdges:['slo-b'], edgeColor:{'slo-b':C.green} },
    { label:'SLA: Customer Contract', description:'Legal agreement backed by SLO — if violated, customers get refunds. SLA is weaker than internal SLO', activeNodes:['slo','sla'], animatedEdges:['slo-sla'], edgeColor:{'slo-sla':C.red} },
    { label:'Error Budget Decision', description:'Budget full → move fast, ship features. Budget gone → freeze releases, fix reliability first', activeNodes:['bud'], animatedEdges:[], edgeColor:{}, nodeOverride:{'bud':{hit:true}} },
  ],
};

export const observabilityFlowMap: Record<string, FlowDef> = {
  'Observability Fundamentals':          obsFundamentalsDef,
  'Logging and Log Management':          obsFundamentalsDef,
  'Metrics and Monitoring':              metricsMonitoringDef,
  'Distributed Tracing':                 distributedTracingDef,
  'Health Checks and Alerting':          metricsMonitoringDef,
  'Golden Signals':                      metricsMonitoringDef,
  'Service Level Indicators (SLIs)':     slosDef,
  'Service Level Objectives (SLOs)':     slosDef,
  'SLAs and Error Budgets':              slosDef,
  'Observability in Practice':           obsFundamentalsDef,
};
