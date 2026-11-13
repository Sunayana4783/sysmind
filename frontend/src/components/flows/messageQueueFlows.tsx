import React from 'react';
import { C, type FlowDef } from '../HLDFlow';

const box = (c: string, bg: string, t: string) => <svg width="32" height="28" viewBox="0 0 48 40" fill="none"><rect x="4" y="4" width="40" height="32" rx="6" fill={bg} stroke={c} strokeWidth="2"/><text x="24" y="24" textAnchor="middle" fontSize="9" fontWeight="700" fill={c}>{t}</text></svg>;
const srv = (c: string, bg: string) => <svg width="32" height="32" viewBox="0 0 48 48" fill="none"><rect x="4" y="8" width="40" height="10" rx="3" fill={c} stroke={c} strokeWidth="1.5"/><rect x="4" y="22" width="40" height="10" rx="3" fill={bg} stroke={c} strokeWidth="1.5"/><rect x="4" y="36" width="40" height="10" rx="3" fill={bg} stroke={c} strokeWidth="1.5"/><circle cx="36" cy="13" r="2" fill="white"/></svg>;

export const mqFundamentalsDef: FlowDef = {
  nodes: [
    { id:'prod', label:'Producer',  sublabel:'Sends messages',  icon:(a)=>srv(a?C.primary:'#C4B5FD',a?C.primaryBg:'#F5F3FF'), position:{x:20,y:170},  mobilePosition:{x:10,y:170} },
    { id:'q',    label:'Queue',     sublabel:'Buffers messages', icon:(a)=>box(a?C.orange:'#fdba74',a?C.orangeBg:'#fff7ed','Q'), position:{x:230,y:170}, mobilePosition:{x:160,y:170} },
    { id:'cons', label:'Consumer',  sublabel:'Processes them',  icon:(a)=>srv(a?C.green:'#86efac',a?C.greenBg:'#f0fff4'),     position:{x:430,y:170}, mobilePosition:{x:300,y:170} },
  ],
  edges: [
    { id:'p-q',  source:'prod', target:'q',    label:'publish',  sourceHandle:'right',  targetHandle:'left',    type:'smoothstep' },
    { id:'q-c',  source:'q',    target:'cons', label:'deliver',  sourceHandle:'right',  targetHandle:'left',    type:'smoothstep' },
    { id:'c-q',  source:'cons', target:'q',    label:'ack',      sourceHandle:'left-s', targetHandle:'right-t', type:'smoothstep' },
  ],
  steps: [
    { label:'Producer Sends Message', description:'Producer creates a message and puts it in the queue — does not wait for consumer', activeNodes:['prod','q'], animatedEdges:['p-q'], edgeColor:{'p-q':C.primary} },
    { label:'Queue Buffers', description:'Queue holds messages durably — if consumer is slow or down, messages wait safely', activeNodes:['q'], animatedEdges:[], edgeColor:{} },
    { label:'Consumer Receives', description:'Consumer pulls messages at its own pace — fully decoupled from producer speed', activeNodes:['q','cons'], animatedEdges:['q-c'], edgeColor:{'q-c':C.green} },
    { label:'Acknowledgement', description:'Consumer sends ACK after successful processing — queue only deletes message after ACK', activeNodes:['cons','q'], animatedEdges:['c-q'], edgeColor:{'c-q':C.blue} },
    { label:'Decoupling Benefit', description:'Producer and consumer are independent — either can be restarted without losing messages', activeNodes:['prod','q','cons'], animatedEdges:['p-q','q-c'], edgeColor:{'p-q':C.primary,'q-c':C.green} },
  ],
};

export const queueArchDef: FlowDef = {
  nodes: [
    { id:'prod', label:'Producer',   sublabel:'Message source',  icon:(a)=>srv(a?C.primary:'#C4B5FD',a?C.primaryBg:'#F5F3FF'), position:{x:20,y:170},  mobilePosition:{x:10,y:170} },
    { id:'brk',  label:'Broker',     sublabel:'RabbitMQ/Kafka',  icon:(a)=>box(a?C.orange:'#fdba74',a?C.orangeBg:'#fff7ed','BRK'), position:{x:230,y:170}, mobilePosition:{x:160,y:170} },
    { id:'q1',   label:'Queue A',    sublabel:'Orders',          icon:(a)=>box(a?C.blue:'#93c5fd', a?C.blueBg:'#eff6ff','Q-A'), position:{x:430,y:60},  mobilePosition:{x:300,y:60} },
    { id:'q2',   label:'Queue B',    sublabel:'Emails',          icon:(a)=>box(a?C.green:'#86efac',a?C.greenBg:'#f0fff4','Q-B'), position:{x:430,y:280}, mobilePosition:{x:300,y:280} },
  ],
  edges: [
    { id:'p-b',  source:'prod', target:'brk', label:'send',    sourceHandle:'right',  targetHandle:'left',    type:'smoothstep' },
    { id:'b-q1', source:'brk',  target:'q1',  label:'route',   sourceHandle:'top-s',  targetHandle:'left',    type:'smoothstep' },
    { id:'b-q2', source:'brk',  target:'q2',  label:'route',   sourceHandle:'bottom', targetHandle:'left',    type:'smoothstep' },
  ],
  steps: [
    { label:'Producer to Broker', description:'Producer sends message to broker — broker is the central component that manages queues', activeNodes:['prod','brk'], animatedEdges:['p-b'], edgeColor:{'p-b':C.primary} },
    { label:'Broker Routes', description:'Broker routes messages to the appropriate queue based on routing key or exchange rules', activeNodes:['brk','q1','q2'], animatedEdges:['b-q1','b-q2'], edgeColor:{'b-q1':C.blue,'b-q2':C.green} },
    { label:'Queue A: Orders', description:'Order processing messages routed to Queue A — order workers consume from here', activeNodes:['brk','q1'], animatedEdges:['b-q1'], edgeColor:{'b-q1':C.blue} },
    { label:'Queue B: Emails', description:'Email notification messages routed to Queue B — email worker consumes here', activeNodes:['brk','q2'], animatedEdges:['b-q2'], edgeColor:{'b-q2':C.green} },
    { label:'Broker Durability', description:'Broker persists messages to disk — survives restarts without losing unprocessed messages', activeNodes:['brk'], animatedEdges:[], edgeColor:{}, nodeOverride:{'brk':{hit:true}} },
  ],
};

export const producersConsumersDef: FlowDef = {
  nodes: [
    { id:'p1',   label:'Producer 1', sublabel:'Order svc',      icon:(a)=>srv(a?C.primary:'#C4B5FD',a?C.primaryBg:'#F5F3FF'), position:{x:20,y:60},   mobilePosition:{x:10,y:60} },
    { id:'p2',   label:'Producer 2', sublabel:'User svc',       icon:(a)=>srv(a?C.blue:'#93c5fd',  a?C.blueBg:'#eff6ff'),     position:{x:20,y:280},  mobilePosition:{x:10,y:280} },
    { id:'q',    label:'Queue',      sublabel:'Message buffer',  icon:(a)=>box(a?C.orange:'#fdba74',a?C.orangeBg:'#fff7ed','Q'), position:{x:240,y:170}, mobilePosition:{x:160,y:170} },
    { id:'c1',   label:'Consumer 1', sublabel:'Worker A',       icon:(a)=>srv(a?C.green:'#86efac',a?C.greenBg:'#f0fff4'),     position:{x:440,y:60},  mobilePosition:{x:300,y:60} },
    { id:'c2',   label:'Consumer 2', sublabel:'Worker B',       icon:(a)=>srv(a?C.green:'#86efac',a?C.greenBg:'#f0fff4'),     position:{x:440,y:280}, mobilePosition:{x:300,y:280} },
  ],
  edges: [
    { id:'p1-q', source:'p1', target:'q',  label:'publish', sourceHandle:'right',  targetHandle:'top',     type:'smoothstep' },
    { id:'p2-q', source:'p2', target:'q',  label:'publish', sourceHandle:'right',  targetHandle:'bottom-t',type:'smoothstep' },
    { id:'q-c1', source:'q',  target:'c1', label:'deliver', sourceHandle:'top-s',  targetHandle:'left',    type:'smoothstep' },
    { id:'q-c2', source:'q',  target:'c2', label:'deliver', sourceHandle:'bottom', targetHandle:'left',    type:'smoothstep' },
  ],
  steps: [
    { label:'Multiple Producers', description:'Any service can be a producer — messages from multiple sources flow into the same queue', activeNodes:['p1','p2','q'], animatedEdges:['p1-q','p2-q'], edgeColor:{'p1-q':C.primary,'p2-q':C.blue} },
    { label:'Producer 1 Publishes', description:'Order service publishes OrderCreated message — does not care who processes it', activeNodes:['p1','q'], animatedEdges:['p1-q'], edgeColor:{'p1-q':C.primary} },
    { label:'Producer 2 Publishes', description:'User service publishes UserSignedUp — both flow into the queue independently', activeNodes:['p2','q'], animatedEdges:['p2-q'], edgeColor:{'p2-q':C.blue} },
    { label:'Consumer Group', description:'Multiple consumers in a group share the work — each message processed by exactly one consumer', activeNodes:['q','c1','c2'], animatedEdges:['q-c1','q-c2'], edgeColor:{'q-c1':C.green,'q-c2':C.green} },
    { label:'Scale Consumers', description:'Add more consumer workers to process faster — producers keep publishing at their own rate', activeNodes:['c1','c2'], animatedEdges:['q-c1','q-c2'], edgeColor:{'q-c1':C.green,'q-c2':C.green} },
  ],
};

export const pointToPointDef: FlowDef = {
  nodes: [
    { id:'prod', label:'Producer',   sublabel:'One sender',      icon:(a)=>srv(a?C.primary:'#C4B5FD',a?C.primaryBg:'#F5F3FF'), position:{x:20,y:170},  mobilePosition:{x:10,y:170} },
    { id:'q',    label:'Queue',      sublabel:'FIFO buffer',     icon:(a)=>box(a?C.orange:'#fdba74',a?C.orangeBg:'#fff7ed','Q'), position:{x:230,y:170}, mobilePosition:{x:160,y:170} },
    { id:'c1',   label:'Consumer 1', sublabel:'Gets odd msgs',   icon:(a)=>srv(a?C.green:'#86efac',a?C.greenBg:'#f0fff4'),     position:{x:430,y:60},  mobilePosition:{x:300,y:60} },
    { id:'c2',   label:'Consumer 2', sublabel:'Gets even msgs',  icon:(a)=>srv(a?C.blue:'#93c5fd', a?C.blueBg:'#eff6ff'),      position:{x:430,y:280}, mobilePosition:{x:300,y:280} },
  ],
  edges: [
    { id:'p-q',   source:'prod', target:'q',  label:'send',    sourceHandle:'right',  targetHandle:'left',    type:'smoothstep' },
    { id:'q-c1',  source:'q',    target:'c1', label:'msg 1,3', sourceHandle:'top-s',  targetHandle:'left',    type:'smoothstep' },
    { id:'q-c2',  source:'q',    target:'c2', label:'msg 2,4', sourceHandle:'bottom', targetHandle:'left',    type:'smoothstep' },
  ],
  steps: [
    { label:'Point-to-Point Model', description:'Each message is consumed by exactly ONE consumer — work distribution, not fan-out', activeNodes:['prod','q'], animatedEdges:['p-q'], edgeColor:{'p-q':C.primary} },
    { label:'Message Goes to One Consumer', description:'Queue distributes messages — message 1 to Consumer 1, message 2 to Consumer 2', activeNodes:['q','c1','c2'], animatedEdges:['q-c1','q-c2'], edgeColor:{'q-c1':C.green,'q-c2':C.blue} },
    { label:'Load Balancing via Queue', description:'Multiple consumers process messages in parallel — natural load balancing for jobs', activeNodes:['c1','c2'], animatedEdges:[], edgeColor:{} },
    { label:'Use Cases', description:'Task queues, email sending, image processing, payment processing — any background job', activeNodes:['q'], animatedEdges:[], edgeColor:{}, nodeOverride:{'q':{hit:true}} },
    { label:'vs Pub/Sub', description:'Point-to-Point: one consumer per message (task distribution). Pub/Sub: ALL subscribers get the message', activeNodes:['prod','q','c1','c2'], animatedEdges:['p-q','q-c1','q-c2'], edgeColor:{'p-q':C.primary,'q-c1':C.green,'q-c2':C.blue} },
  ],
};

export const pubSubDef: FlowDef = {
  nodes: [
    { id:'pub',  label:'Publisher',   sublabel:'Sends event',    icon:(a)=>srv(a?C.primary:'#C4B5FD',a?C.primaryBg:'#F5F3FF'), position:{x:20,y:170},  mobilePosition:{x:10,y:170} },
    { id:'top',  label:'Topic',       sublabel:'OrderCreated',   icon:(a)=>box(a?C.orange:'#fdba74',a?C.orangeBg:'#fff7ed','TOP'), position:{x:230,y:170}, mobilePosition:{x:160,y:170} },
    { id:'s1',   label:'Email Svc',   sublabel:'Subscriber',     icon:(a)=>srv(a?C.blue:'#93c5fd', a?C.blueBg:'#eff6ff'),      position:{x:430,y:30},  mobilePosition:{x:300,y:30} },
    { id:'s2',   label:'Inventory',   sublabel:'Subscriber',     icon:(a)=>srv(a?C.green:'#86efac',a?C.greenBg:'#f0fff4'),     position:{x:430,y:170}, mobilePosition:{x:300,y:170} },
    { id:'s3',   label:'Analytics',   sublabel:'Subscriber',     icon:(a)=>srv(a?C.orange:'#fdba74',a?C.orangeBg:'#fff7ed'),   position:{x:430,y:310}, mobilePosition:{x:300,y:310} },
  ],
  edges: [
    { id:'p-t',  source:'pub', target:'top', label:'publish', sourceHandle:'right',  targetHandle:'left',    type:'smoothstep' },
    { id:'t-s1', source:'top', target:'s1',  label:'fan-out', sourceHandle:'top-s',  targetHandle:'left',    type:'smoothstep' },
    { id:'t-s2', source:'top', target:'s2',  label:'fan-out', sourceHandle:'right',  targetHandle:'left',    type:'smoothstep' },
    { id:'t-s3', source:'top', target:'s3',  label:'fan-out', sourceHandle:'bottom', targetHandle:'left',    type:'smoothstep' },
  ],
  steps: [
    { label:'Publisher Publishes to Topic', description:'Order service publishes OrderCreated event to a topic — does not know who subscribes', activeNodes:['pub','top'], animatedEdges:['p-t'], edgeColor:{'p-t':C.primary} },
    { label:'ALL Subscribers Receive', description:'Every subscriber gets a copy — Email, Inventory, Analytics all receive OrderCreated', activeNodes:['top','s1','s2','s3'], animatedEdges:['t-s1','t-s2','t-s3'], edgeColor:{'t-s1':C.blue,'t-s2':C.green,'t-s3':C.orange} },
    { label:'Email Service Reacts', description:'Email service sends order confirmation email — independent, loosely coupled', activeNodes:['top','s1'], animatedEdges:['t-s1'], edgeColor:{'t-s1':C.blue} },
    { label:'Inventory Reacts', description:'Inventory service decrements stock — same event, different reaction', activeNodes:['top','s2'], animatedEdges:['t-s2'], edgeColor:{'t-s2':C.green} },
    { label:'Add Subscriber Anytime', description:'New service (Analytics) subscribes to existing topic without changing publisher — open/closed principle', activeNodes:['top','s3'], animatedEdges:['t-s3'], edgeColor:{'t-s3':C.orange} },
  ],
};

export const deliveryGuaranteesDef: FlowDef = {
  nodes: [
    { id:'prod', label:'Producer',  sublabel:'Sends message',   icon:(a)=>srv(a?C.primary:'#C4B5FD',a?C.primaryBg:'#F5F3FF'), position:{x:20,y:170},  mobilePosition:{x:10,y:170} },
    { id:'q',    label:'Broker',    sublabel:'Kafka/SQS',       icon:(a)=>box(a?C.orange:'#fdba74',a?C.orangeBg:'#fff7ed','BRK'), position:{x:230,y:170}, mobilePosition:{x:160,y:170} },
    { id:'amo',  label:'At Most Once',sublabel:'May lose msgs', icon:(a)=>box(a?C.red:'#fca5a5',  a?C.redBg:'#fff5f5','AMO'), position:{x:430,y:30},  mobilePosition:{x:300,y:30} },
    { id:'alo',  label:'At Least Once',sublabel:'May duplicate',icon:(a)=>box(a?C.orange:'#fdba74',a?C.orangeBg:'#fff7ed','ALO'), position:{x:430,y:170}, mobilePosition:{x:300,y:170} },
    { id:'eo',   label:'Exactly Once',sublabel:'No loss/dup',   icon:(a)=>box(a?C.green:'#86efac',a?C.greenBg:'#f0fff4','EO'), position:{x:430,y:310}, mobilePosition:{x:300,y:310} },
  ],
  edges: [
    { id:'p-q',  source:'prod', target:'q',   label:'send', sourceHandle:'right',  targetHandle:'left',    type:'smoothstep' },
    { id:'q-am', source:'q',    target:'amo', label:'no ACK',sourceHandle:'top-s', targetHandle:'left',    type:'smoothstep' },
    { id:'q-al', source:'q',    target:'alo', label:'retry', sourceHandle:'right', targetHandle:'left',    type:'smoothstep' },
    { id:'q-eo', source:'q',    target:'eo',  label:'txn',  sourceHandle:'bottom',targetHandle:'left',     type:'smoothstep' },
  ],
  steps: [
    { label:'Three Delivery Guarantees', description:'Message queues offer different reliability trade-offs — choose based on your needs', activeNodes:['prod','q'], animatedEdges:['p-q'], edgeColor:{'p-q':C.primary} },
    { label:'At-Most-Once', description:'Message sent once, no retry — may be lost if consumer crashes. Fast but lossy. Use for metrics', activeNodes:['q','amo'], animatedEdges:['q-am'], edgeColor:{'q-am':C.red} },
    { label:'At-Least-Once', description:'Retried until ACK — may be processed twice if ACK lost. Use for most cases with idempotent consumers', activeNodes:['q','alo'], animatedEdges:['q-al'], edgeColor:{'q-al':C.orange} },
    { label:'Exactly-Once', description:'Transactional delivery — most expensive. Use for payments, inventory deductions. Kafka Transactions support this', activeNodes:['q','eo'], animatedEdges:['q-eo'], edgeColor:{'q-eo':C.green} },
    { label:'Idempotency Key', description:'For At-Least-Once: include an idempotency key in every message — consumer skips duplicate message IDs', activeNodes:['alo'], animatedEdges:[], edgeColor:{}, nodeOverride:{'alo':{hit:true}} },
  ],
};

export const dlqDef: FlowDef = {
  nodes: [
    { id:'q',    label:'Main Queue', sublabel:'Normal messages',  icon:(a)=>box(a?C.primary:'#C4B5FD',a?C.primaryBg:'#F5F3FF','Q'), position:{x:20,y:170},  mobilePosition:{x:10,y:170} },
    { id:'cons', label:'Consumer',   sublabel:'Processes msgs',   icon:(a)=>srv(a?C.green:'#86efac',a?C.greenBg:'#f0fff4'),         position:{x:230,y:60},  mobilePosition:{x:160,y:60} },
    { id:'fail', label:'Fail (3x)',  sublabel:'Retry exhausted',  icon:(a)=>box(a?C.red:'#fca5a5', a?C.redBg:'#fff5f5','FAIL'),     position:{x:230,y:280}, mobilePosition:{x:160,y:280} },
    { id:'dlq',  label:'Dead Letter', sublabel:'Inspect/replay',  icon:(a)=>box(a?C.orange:'#fdba74',a?C.orangeBg:'#fff7ed','DLQ'), position:{x:440,y:170}, mobilePosition:{x:300,y:170} },
  ],
  edges: [
    { id:'q-c',  source:'q',    target:'cons',label:'deliver',   sourceHandle:'top-s',  targetHandle:'left',    type:'smoothstep' },
    { id:'q-f',  source:'q',    target:'fail',label:'retry 3x',  sourceHandle:'bottom', targetHandle:'left',    type:'smoothstep' },
    { id:'f-dlq',source:'fail', target:'dlq', label:'→ DLQ',     sourceHandle:'right',  targetHandle:'left',    type:'smoothstep' },
    { id:'dlq-q',source:'dlq',  target:'q',   label:'replay',    sourceHandle:'left-s', targetHandle:'right-t', type:'smoothstep' },
  ],
  steps: [
    { label:'Normal Processing', description:'Consumer receives message and processes it successfully — message deleted from queue', activeNodes:['q','cons'], animatedEdges:['q-c'], edgeColor:{'q-c':C.green} },
    { label:'Consumer Fails', description:'Consumer throws an error — broker retries message up to 3 times with backoff', activeNodes:['q','fail'], animatedEdges:['q-f'], edgeColor:{'q-f':C.red} },
    { label:'Move to Dead Letter Queue', description:'After max retries, message moved to DLQ — not lost, just quarantined for inspection', activeNodes:['fail','dlq'], animatedEdges:['f-dlq'], edgeColor:{'f-dlq':C.orange} },
    { label:'Inspect and Fix', description:'Engineers inspect DLQ messages, fix the bug in consumer, then replay messages', activeNodes:['dlq'], animatedEdges:[], edgeColor:{}, nodeOverride:{'dlq':{hit:true}} },
    { label:'Replay from DLQ', description:'Fixed consumer replays DLQ messages — zero message loss despite original consumer failure', activeNodes:['dlq','q'], animatedEdges:['dlq-q'], edgeColor:{'dlq-q':C.primary} },
  ],
};

export const brokersDef: FlowDef = {
  nodes: [
    { id:'app',   label:'Application', sublabel:'Needs messaging', icon:(a)=>srv(a?C.primary:'#C4B5FD',a?C.primaryBg:'#F5F3FF'), position:{x:20,y:170},  mobilePosition:{x:10,y:170} },
    { id:'kafka', label:'Kafka',        sublabel:'Log-based',      icon:(a)=>box(a?C.orange:'#fdba74',a?C.orangeBg:'#fff7ed','KFK'), position:{x:250,y:30},  mobilePosition:{x:170,y:30} },
    { id:'rmq',   label:'RabbitMQ',     sublabel:'Traditional MQ', icon:(a)=>box(a?C.blue:'#93c5fd', a?C.blueBg:'#eff6ff', 'RMQ'), position:{x:250,y:170}, mobilePosition:{x:170,y:170} },
    { id:'sqs',   label:'AWS SQS',      sublabel:'Managed cloud',  icon:(a)=>box(a?C.green:'#86efac',a?C.greenBg:'#f0fff4', 'SQS'), position:{x:250,y:310}, mobilePosition:{x:170,y:310} },
  ],
  edges: [
    { id:'a-k',  source:'app', target:'kafka',label:'high throughput', sourceHandle:'top-s',  targetHandle:'left', type:'smoothstep' },
    { id:'a-r',  source:'app', target:'rmq',  label:'flexible routing',sourceHandle:'right',  targetHandle:'left', type:'smoothstep' },
    { id:'a-s',  source:'app', target:'sqs',  label:'serverless/cloud',sourceHandle:'bottom', targetHandle:'left', type:'smoothstep' },
  ],
  steps: [
    { label:'Apache Kafka', description:'Distributed log — retains messages for days. Millions of events/second. Best for event streaming, analytics pipelines', activeNodes:['app','kafka'], animatedEdges:['a-k'], edgeColor:{'a-k':C.orange} },
    { label:'RabbitMQ', description:'Traditional message broker — flexible routing with exchanges, great for task queues and RPC patterns', activeNodes:['app','rmq'], animatedEdges:['a-r'], edgeColor:{'a-r':C.blue} },
    { label:'AWS SQS', description:'Fully managed, serverless — no infrastructure to run. Standard (at-least-once) or FIFO (exactly-once) queues', activeNodes:['app','sqs'], animatedEdges:['a-s'], edgeColor:{'a-s':C.green} },
    { label:'Kafka vs RabbitMQ', description:'Kafka: high throughput, replay, streaming. RabbitMQ: smart routing, lower latency, traditional queuing', activeNodes:['kafka','rmq'], animatedEdges:[], edgeColor:{} },
    { label:'Choosing a Broker', description:'SQS for AWS apps (easy ops), Kafka for event streaming/analytics, RabbitMQ for complex routing needs', activeNodes:['app','kafka','rmq','sqs'], animatedEdges:['a-k','a-r','a-s'], edgeColor:{'a-k':C.orange,'a-r':C.blue,'a-s':C.green} },
  ],
};

export const messageQueueFlowMap: Record<string, FlowDef> = {
  'Message Queue Fundamentals':                       mqFundamentalsDef,
  'Queue Architecture and Components':                queueArchDef,
  'Producers and Consumers':                          producersConsumersDef,
  'Point-to-Point Messaging':                         pointToPointDef,
  'Publish-Subscribe Messaging':                      pubSubDef,
  'Message Delivery Guarantees':                      deliveryGuaranteesDef,
  'Acknowledgements, Retries and DLQ':                dlqDef,
  'Message Brokers':                                  brokersDef,
};
