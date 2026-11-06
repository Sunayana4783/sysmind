// Static Distributed Systems content - 13 modules total
const DISTRIBUTED_SYSTEMS_MODULES = [

  // 1. Distributed Systems Fundamentals
  {
    order: 1, type: 'content', title: 'Distributed Systems Fundamentals',
    content: {
      overview: 'A distributed system is a collection of independent computers that appear to users as a single coherent system. Your phone, a server in London, and a database in Singapore can all be part of the same distributed system working together.\n\nDistributed systems are powerful - they can store more data and handle more traffic than any single machine. But they introduce new problems that simply do not exist on one computer: network failures, partial failures, and the challenge of keeping data consistent across many nodes.',
      sections: [
        { heading: 'Why Distribute?', body: 'Single machines have hard limits. One server has a maximum amount of RAM, CPU, and disk. When you hit these limits, you must distribute. Beyond capacity, distribution provides availability - if one machine fails, others continue. It provides geographic distribution - serve users from servers close to them. And it provides isolation - a failure in one component does not take down everything.', code: null },
        { heading: 'The Fallacies of Distributed Computing', body: 'Engineers new to distributed systems make eight dangerous assumptions. The network is reliable. Latency is zero. Bandwidth is infinite. The network is secure. Topology does not change. There is one administrator. Transport cost is zero. The network is homogeneous. All eight are false. Networks fail, packets are lost, latency varies wildly, and nodes crash at the worst moments. Every distributed system must be designed assuming all of these will happen.', code: null },
        { heading: 'Partial Failures', body: 'The most fundamental challenge of distributed systems is partial failure. In a single machine, either the machine works or it does not. In a distributed system, some components can fail while others continue. Node A might be up, Node B might be down, and Node C might be slow due to network congestion. Designing systems that handle partial failures gracefully - without the whole system going down - is the core engineering challenge.', code: null },
        { heading: 'The Two Generals Problem', body: 'Two armies need to coordinate an attack over unreliable messengers. Neither army can be certain the other received their message. This is a fundamental impossibility: over an unreliable network, you cannot achieve perfect guaranteed coordination. In practice: accept that messages may be lost or duplicated, design operations to be idempotent (safe to repeat), and use acknowledgement patterns with retries.', code: null },
      ],
      animationSteps: [
        { label: 'Single node',    description: 'One machine: simple but limited capacity',    highlight: false },
        { label: 'Add nodes',      description: 'Multiple nodes: more capacity, new problems',  highlight: true  },
        { label: 'Network call',   description: 'Node A calls Node B over unreliable network',  highlight: true  },
        { label: 'Partial fail',   description: 'Node B crashes - A must detect and handle it', highlight: false },
        { label: 'Handle',         description: 'Retry, fallback, or fail gracefully',          highlight: false },
      ],
      example: 'When you send a WhatsApp message, it goes through a distributed system spanning data centers on multiple continents. If the recipient\'s regional data center is temporarily unreachable, your message is stored durably and delivered when connectivity restores. The system handles partial failures without losing your message or requiring you to resend.',
    },
  },

  // 2. Distributed System Architecture and Components
  {
    order: 2, type: 'content', title: 'Architecture and Components',
    content: {
      overview: 'A distributed system consists of multiple components with specific roles: nodes that store and process data, a network connecting them, coordination services that help nodes agree on shared state, and load distribution mechanisms that route work to the right node.\n\nKnowing what each component does and how they interact is essential for designing reliable distributed systems.',
      sections: [
        { heading: 'Nodes and Roles', body: 'Nodes in a distributed system have different roles. Leader or primary nodes coordinate work and accept writes. Follower or replica nodes receive copies of data and serve reads. Worker nodes process tasks from a queue. Gateway nodes accept external traffic and route internally. In most systems, a single physical machine acts as multiple logical nodes simultaneously. Roles can change dynamically through leader election.', code: null },
        { heading: 'The Network Layer', body: 'The network is the most unreliable component. Packets can be lost, duplicated, reordered, or delayed arbitrarily. A network partition splits nodes into groups that cannot communicate. Crucially, a node cannot distinguish between "the other node crashed" and "there is a network partition" - both look like no response. This ambiguity forces you to design for both failure modes simultaneously.', code: null },
        { heading: 'Coordination Services', body: 'Coordination services (ZooKeeper, etcd, Consul) provide primitives that distributed applications need: distributed locks (only one node does a job at a time), leader election (nodes agree on which one is the leader), configuration storage (all nodes see the same config), and service discovery (nodes register their addresses). These services themselves are distributed systems that use consensus algorithms to maintain strong consistency.', code: null },
        { heading: 'Data Distribution', body: 'Data must be distributed across nodes for scalability. Sharding assigns each record to a specific node based on a key. Replication keeps copies on multiple nodes for durability and availability. The combination determines: how much data each node stores, what happens when a node fails, and how queries are routed. Getting this balance right between consistency, availability, and partition tolerance is the central challenge.', code: null },
      ],
      animationSteps: [
        { label: 'Leader node',    description: 'Leader accepts writes, coordinates replicas',  highlight: false },
        { label: 'Replicate',      description: 'Writes replicated to follower nodes',          highlight: true  },
        { label: 'Read scaling',   description: 'Reads distributed across all followers',       highlight: true  },
        { label: 'etcd/ZooKeeper', description: 'Coordination service: locks, leader election', highlight: false },
        { label: 'Sharding',       description: 'Data partitioned across nodes by key',         highlight: false },
      ],
      example: 'Google Spanner is a globally distributed database with nodes in multiple continents. Each row is assigned to a Paxos group (3-5 nodes) that keeps replicas consistent. The leader node in each group handles writes and replicates to followers. ZooKeeper-like services coordinate which node is the leader. When a leader fails, a new one is elected automatically within seconds.',
    },
  },

  // 3. Communication Between Distributed Nodes
  {
    order: 3, type: 'content', title: 'Communication Between Nodes',
    content: {
      overview: 'Distributed nodes communicate over the network. This communication is fundamentally different from in-process function calls: network calls are slow, can fail, can be delayed indefinitely, and can result in unknown outcomes (did the remote node receive the message or not?).\n\nDesigning reliable communication in the face of these properties is one of the core skills in distributed systems engineering.',
      sections: [
        { heading: 'Remote Procedure Calls (RPC)', body: 'RPC makes a network call look like a local function call. gRPC and Thrift are modern RPC frameworks. The challenge: RPC hides the fact that the call can fail in ways a local call cannot. A local call either returns or throws. An RPC can time out, partially execute, or silently fail. Developers must explicitly handle all these cases - timeouts, retries, and idempotency. Never treat an RPC like a local function call.', code: null },
        { heading: 'Message Passing', body: 'Message passing is an alternative to RPC. Instead of calling a remote function directly, you send a message to a queue or topic. The sender does not wait for a response and does not know who processes the message. This asynchronous decoupling means the sender never blocks and the system tolerates receiver failures gracefully. Messages accumulate and are processed when the receiver recovers.', code: null },
        { heading: 'Timeouts and Retries', body: 'When an RPC does not respond, how long do you wait? Setting a timeout is mandatory - without one, you may wait forever. But if a request timed out and you retry, the original request may have been received and processed. Retrying without idempotency can cause double processing. Always set timeouts, always retry transient failures, and always make operations idempotent so retrying is safe.', code: null },
        { heading: 'Heartbeats', body: 'How does Node A know if Node B is still alive? Heartbeats: Node B sends a periodic ping to Node A (or to a coordinator) every few seconds. If A does not hear from B within a timeout window, A assumes B is down. The challenge: a slow heartbeat might mean B is under load, not dead. Setting the timeout too short causes false positives. Too long means slow failure detection. Most systems use 10-30 second heartbeat intervals with 2-3 missed heartbeats before declaring a node dead.', code: null },
      ],
      animationSteps: [
        { label: 'RPC call',       description: 'Node A calls Node B over network',             highlight: false },
        { label: 'Timeout',        description: 'No response after 500ms - what happened?',     highlight: true  },
        { label: 'Ambiguity',      description: 'B received it? B crashed? Network lost it?',   highlight: true  },
        { label: 'Retry',          description: 'Retry with idempotency key - safe to repeat',  highlight: false },
        { label: 'Heartbeat',      description: 'B sends ping every 5s - silence = B is down',  highlight: false },
      ],
      example: 'Amazon\'s internal services use a 100ms default RPC timeout with 3 automatic retries using exponential backoff. Every operation has a unique request ID (idempotency key). If a retry arrives after the original succeeded, the second attempt is detected as a duplicate and skipped. This handles the case where the network dropped the response but not the original request.',
    },
  },

  // 4. Time, Clocks and Event Ordering
  {
    order: 4, type: 'content', title: 'Time, Clocks and Event Ordering',
    content: {
      overview: 'In a single machine, time is simple - events happen in a clear order. In distributed systems, clocks on different machines can drift apart by milliseconds or more, and there is no shared global clock. This makes it impossible to simply compare timestamps to determine which event happened first.\n\nThis is not a theoretical problem - it causes real bugs: lost updates, incorrect conflict resolution, and stale reads presented as current.',
      sections: [
        { heading: 'Clock Drift', body: 'Physical clocks in computers drift - they run slightly faster or slower than real time. NTP (Network Time Protocol) synchronises clocks over the network but can only correct within a window of 10-100ms under good conditions. In a distributed system, two events with timestamps 20ms apart might have actually happened in the opposite order. Never rely on wall clock timestamps to determine causality across machines.', code: null },
        { heading: 'Logical Clocks (Lamport Clocks)', body: 'Lamport clocks solve the ordering problem without requiring synchronised physical clocks. Each node maintains a counter. On any event, increment the counter. When sending a message, include the current counter value. When receiving a message, set local counter to max(local, received) + 1. This gives a happens-before relationship: if event A\'s Lamport timestamp is less than B\'s, A could have happened before B.', code: null },
        { heading: 'Vector Clocks', body: 'Lamport clocks can tell you A might have happened before B, but not definitively. Vector clocks give a complete picture. Each node tracks a vector of counters - one per node in the system. On send: increment your own counter. On receive: take the max of each position. If vector clock A is less than B in every position, A happened before B. If they are incomparable in some positions, A and B are concurrent.', code: null },
        { heading: 'Google TrueTime', body: 'Google Spanner uses hardware (atomic clocks and GPS receivers) to bound clock uncertainty. Instead of a single timestamp, TrueTime returns an interval [earliest, latest] within which the true time definitely falls. Before committing a transaction, Spanner waits until the uncertainty window closes, ensuring commit timestamps are globally consistent. This is how Spanner achieves external consistency (stronger than serialisability) globally.', code: null },
      ],
      animationSteps: [
        { label: 'Clock drift',    description: 'Node A clock: 10:00:00.000, Node B: 10:00:00.050', highlight: true  },
        { label: 'Timestamp A',    description: 'A records event at 10:00:00.030',               highlight: true  },
        { label: 'Timestamp B',    description: 'B records event at 10:00:00.020 - but B was after!', highlight: false },
        { label: 'Lamport clock',  description: 'Logical counter: no clock drift, causal order',  highlight: false },
        { label: 'Vector clock',   description: 'Track per-node counters: detect concurrent events', highlight: false },
      ],
      example: 'DynamoDB uses vector clocks to track concurrent updates to the same item. If two clients update the same item simultaneously without reading each other\'s changes, DynamoDB stores both versions and marks the conflict. The application reads both versions, sees the conflict flag, and resolves it (last-write-wins, merge, or prompt the user). Without vector clocks, one update would silently overwrite the other.',
    },
  },

  // 5. Consistency Models
  {
    order: 5, type: 'content', title: 'Consistency Models',
    content: {
      overview: 'Consistency in distributed systems describes what guarantee a client has about what they will read after a write. The spectrum goes from strong consistency (every read sees the latest write) to eventual consistency (reads will eventually be consistent, but may temporarily see stale data).\n\nChoosing the right consistency model is one of the most important design decisions in a distributed system.',
      sections: [
        { heading: 'Strong Consistency (Linearisability)', body: 'Strong consistency (or linearisability) means every read returns the most recent write, as if the system were a single machine. Once a write is confirmed, any subsequent read anywhere in the system returns that value. This is the strongest guarantee and the easiest to reason about, but it requires coordination on every write and has high latency, especially across geographies.', code: null },
        { heading: 'Eventual Consistency', body: 'Eventual consistency means all replicas will eventually converge to the same value, but there is no guarantee of when. A read immediately after a write may return the old value. Given enough time without new writes, all replicas converge. This is much easier to achieve at scale and with low latency - no coordination needed. Suitable when brief staleness is acceptable: social media feeds, view counts, shopping cart availability.', code: null },
        { heading: 'Causal Consistency', body: 'Causal consistency is between strong and eventual. If event A causally precedes event B (A caused B, or the same user did A then B), then A is visible before B everywhere. If A and B are causally unrelated (concurrent events from different users), they may be seen in any order. This preserves the intuitive order users expect (your own actions are consistent) without requiring global coordination.', code: null },
        { heading: 'Read-Your-Writes', body: 'Read-your-writes is a common practical guarantee: after a write, the same client will always see that write on subsequent reads. This prevents the confusing experience of updating your profile and then not seeing the update. Implemented by routing that client\'s reads to the same replica they wrote to, or by tracking the write timestamp and waiting for replicas to catch up before serving reads to that client.', code: null },
      ],
      animationSteps: [
        { label: 'Write to Node A', description: 'Client writes value to Node A',               highlight: false },
        { label: 'Strong read',    description: 'Strong: read from any node returns new value',  highlight: true  },
        { label: 'Eventual read',  description: 'Eventual: read may return old value briefly',   highlight: true  },
        { label: 'Causal',         description: 'Causal: your own writes always visible to you', highlight: false },
        { label: 'Converge',       description: 'Eventually all replicas agree on same value',   highlight: false },
      ],
      example: 'Facebook uses different consistency models for different features. Profile information uses strong consistency - if you update your name, you always see the new name immediately. Like counts use eventual consistency - seeing 1,200 vs 1,201 likes is not harmful. The news feed uses causal consistency - your own posts always appear to you before others see them.',
    },
  },

  // 6. Consensus Algorithms (Paxos and Raft)
  {
    order: 6, type: 'content', title: 'Consensus Algorithms',
    content: {
      overview: 'Consensus is the problem of getting multiple nodes to agree on a single value, even in the presence of failures. This is fundamental to distributed systems: leader election, distributed locks, configuration management, and replicated state machines all require consensus.\n\nPaxos was the first rigorous consensus algorithm (1989). Raft was designed to be understandable (2014) and is now more widely used in practice.',
      sections: [
        { heading: 'Why Consensus is Hard', body: 'The FLP impossibility theorem proves that in an asynchronous system with even one faulty process, it is impossible to guarantee consensus. In practice: systems add timeouts (moving from fully asynchronous to partially synchronous), accept that consensus may occasionally fail to make progress but never produce wrong results, and tolerate liveness failures (temporary stuck states) to preserve safety (never returning wrong data).', code: null },
        { heading: 'Raft: Leader-Based Consensus', body: 'Raft works in three phases. Leader election: nodes hold elections; the winner becomes leader for a term. Log replication: the leader receives client requests, appends them to its log, and replicates to followers. Commitment: once a majority of nodes have the log entry, the leader commits it. If the leader fails, a new election occurs. A cluster of 2N+1 nodes tolerates N failures - a 5-node cluster tolerates 2 failures.', code: null },
        { heading: 'Quorum', body: 'A quorum is the minimum number of nodes that must participate in an operation for it to be valid. In a 5-node cluster, the quorum is 3 (majority). For a write to succeed, 3 nodes must acknowledge it. For a read to be strongly consistent, 3 nodes must be queried. Why majority? Any two quorums share at least one node - this overlap ensures every read sees the latest write.', code: null },
        { heading: 'Paxos', body: 'Paxos is older and formally proved correct but notoriously difficult to understand and implement. It separates the problem into proposers (propose values), acceptors (accept proposals), and learners (learn the chosen value). Multi-Paxos extends it for a log of values. Raft is functionally equivalent but structures the algorithm around leader-based log replication which maps more naturally to real systems. etcd, CockroachDB, and Consul use Raft.', code: null },
      ],
      animationSteps: [
        { label: 'Election',       description: 'Nodes vote: one wins leader for current term',  highlight: false },
        { label: 'Client write',   description: 'Leader receives write from client',             highlight: true  },
        { label: 'Replicate',      description: 'Leader sends log entry to all followers',       highlight: true  },
        { label: 'Quorum',         description: 'Majority (3/5) ack - entry committed',          highlight: false },
        { label: 'Leader fails',   description: 'New election: remaining 4 nodes elect new leader', highlight: false },
      ],
      example: 'etcd (used by Kubernetes) uses Raft to store cluster state. When you deploy a pod to Kubernetes, the API server writes to etcd. Raft replicates that write to a quorum of etcd nodes before confirming. When a Kubernetes master node fails, a new etcd leader is elected automatically within seconds. All the cluster state is safely preserved because Raft committed it to a quorum.',
    },
  },

  // 7. Distributed Transactions (2PC and Saga)
  {
    order: 7, type: 'content', title: 'Distributed Transactions',
    content: {
      overview: 'A distributed transaction spans multiple nodes or services and must either fully commit or fully roll back atomically. In a single database, transactions are simple. Across distributed services with separate databases, achieving atomicity is one of the hardest problems.\n\nTwo-Phase Commit (2PC) is the classic protocol. The Saga pattern is the modern microservices alternative.',
      sections: [
        { heading: 'Two-Phase Commit (2PC)', body: 'Phase 1 - Prepare: the coordinator asks all participants "can you commit?". Each participant locks resources and responds yes or no. Phase 2 - Commit or Abort: if all said yes, coordinator sends commit to all. If any said no, coordinator sends abort. All participants apply or roll back. The problem: if the coordinator crashes between phases, participants holding locks are stuck waiting indefinitely. 2PC is blocking.', code: null },
        { heading: '2PC Limitations', body: 'Two-Phase Commit has significant drawbacks. Blocking: if the coordinator crashes after prepare but before commit, all participants are blocked holding locks until coordinator recovers. Single point of failure: the coordinator is critical. Performance: all participants must synchronise, adding latency. Not partition tolerant: a network partition leaves participants in an uncertain state. 2PC works for tight systems (same database) but poorly for microservices across unreliable networks.', code: null },
        { heading: 'The Saga Pattern', body: 'A Saga is a sequence of local transactions. Each step executes a local transaction and publishes an event or message. The next step is triggered by the event. If any step fails, compensating transactions run to undo previous steps. Sagas are not atomic in the traditional sense - there is a window where partial results are visible. But they are more available, more performant, and work across independent services.', code: null },
        { heading: 'Saga: Choreography vs Orchestration', body: 'Choreography Saga: each service reacts to events from others. Order service publishes "order placed", Payment service listens and publishes "payment done", Inventory service listens and reserves stock. Decoupled but harder to trace. Orchestration Saga: a central coordinator calls each service in sequence and manages compensation on failure. Easier to understand and debug but creates a central dependency.', code: null },
      ],
      animationSteps: [
        { label: '2PC Phase 1',    description: 'Coordinator asks all participants: can you commit?', highlight: false },
        { label: '2PC Phase 2',    description: 'All yes: coordinator sends commit to all',       highlight: true  },
        { label: '2PC Problem',    description: 'Coordinator crashes: participants stuck with locks', highlight: true },
        { label: 'Saga step 1',    description: 'Order Service: create order (local TX)',          highlight: false },
        { label: 'Saga step 2',    description: 'Payment fails: compensate - cancel order',        highlight: false },
      ],
      example: 'Airbnb uses the Saga pattern for booking. Step 1: create a booking in pending state. Step 2: charge the guest card. Step 3: notify the host and confirm. If Step 3 fails (host system down), compensating transactions run: refund the guest, cancel the booking. Each step is a local transaction with a defined compensation. The guest\'s card is never charged if the booking cannot be confirmed.',
    },
  },

  // 8. Fault Tolerance and Replication
  {
    order: 8, type: 'content', title: 'Fault Tolerance and Replication',
    content: {
      overview: 'Fault tolerance is the ability of a distributed system to continue operating correctly when individual components fail. Replication - keeping multiple copies of data on different nodes - is the primary mechanism for fault tolerance.\n\nThe key design questions: how many replicas, where to place them, and how to keep them consistent.',
      sections: [
        { heading: 'Replication Strategies', body: 'Synchronous replication: the primary waits for all (or a quorum of) replicas to confirm before acknowledging the write. Guarantees no data loss if primary fails, but increases write latency. Asynchronous replication: primary acknowledges immediately, replication happens in the background. Low write latency but potential data loss if primary fails before replicas catch up. Semi-synchronous: wait for at least one replica (compromise between the two).', code: null },
        { heading: 'Replica Placement', body: 'Where you place replicas matters as much as how many. Replicas on the same server: no protection against server failure. Replicas on different servers in the same rack: no protection against rack failure (power, switch). Replicas in different data center buildings: no protection against campus-level events. Replicas in different availability zones: no protection against regional disaster. Best practice: replicas in 3 different availability zones in a region.', code: null },
        { heading: 'Failure Detection', body: 'Nodes must detect when other nodes have failed. Gossip protocols: each node periodically exchanges state with random other nodes. Failure information propagates across the cluster in O(log N) rounds. Heartbeat monitors: a dedicated service pings each node and marks it as down after N missed heartbeats. Phi Accrual Failure Detector: uses statistical analysis of heartbeat intervals to give a confidence score rather than binary up/down.', code: null },
        { heading: 'Automatic Recovery', body: 'When a node fails, the system must recover without human intervention. Leader election replaces a failed primary. Automatic re-replication copies data from surviving replicas to new nodes. Circuit breakers stop sending traffic to failing nodes. Self-healing systems monitor their own health metrics and trigger recovery procedures automatically. The goal: mean time to recovery (MTTR) measured in seconds, not minutes.', code: null },
      ],
      animationSteps: [
        { label: 'Write to primary', description: 'Client writes to primary node',              highlight: false },
        { label: 'Sync replicate',   description: 'Primary waits for replica acks before ACK',  highlight: true  },
        { label: 'Primary fails',    description: 'Primary node crashes unexpectedly',           highlight: true  },
        { label: 'Leader election',  description: 'Replica with most up-to-date log elected',   highlight: false },
        { label: 'Re-replicate',     description: 'New primary re-replicates to restore 3x',    highlight: false },
      ],
      example: 'Cassandra uses a replication factor of 3 by default, placing replicas across 3 different availability zones. With consistent hashing, each token range is owned by 3 nodes. If one node fails, the remaining 2 still serve requests. The system automatically detects the failure via gossip and schedules a repair to restore the replication factor to 3 once a replacement node comes online.',
    },
  },

  // 9. Partition Tolerance and CAP Theorem
  {
    order: 9, type: 'content', title: 'Partition Tolerance and CAP Theorem',
    content: {
      overview: 'The CAP theorem states that a distributed system can only guarantee two of three properties: Consistency (every read returns the latest write), Availability (every request gets a response), and Partition Tolerance (system works despite network splits).\n\nSince network partitions always happen in real systems, the real choice is between consistency and availability during a partition.',
      sections: [
        { heading: 'What is a Network Partition?', body: 'A network partition occurs when the network between nodes breaks, splitting the cluster into groups that cannot communicate. This is not a node failure - all nodes are running and healthy, but they cannot reach each other. During a partition, a distributed system must make a choice: refuse requests (to stay consistent) or serve requests with possibly stale data (to stay available). The choice defines whether your system is CP or AP.', code: null },
        { heading: 'CP Systems (Consistency over Availability)', body: 'CP systems prioritise returning correct data even if that means refusing some requests. During a partition, a CP system may return an error or time out rather than risk returning stale data. If a quorum cannot be reached (because too many nodes are on the wrong side of the partition), the system rejects writes and possibly reads. HBase, ZooKeeper, and etcd are CP systems. Use for: financial data, authentication, any data where incorrect reads cause real harm.', code: null },
        { heading: 'AP Systems (Availability over Consistency)', body: 'AP systems prioritise staying available over always returning the latest data. During a partition, each side continues serving requests independently. When the partition heals, nodes sync and converge - eventual consistency. The system is always available but may temporarily return stale data. Cassandra, CouchDB, and DynamoDB (with eventual consistency) are AP systems. Use for: social media feeds, product catalog, anything where brief staleness is acceptable.', code: null },
        { heading: 'PACELC: Beyond CAP', body: 'CAP only describes the partition case. PACELC extends it: if there is a Partition, choose Availability or Consistency; Else (no partition), choose Latency or Consistency. Even without a partition, strongly consistent systems have higher latency because they require quorum coordination. DynamoDB, Cassandra (PA/EL - available + low latency). CockroachDB, Spanner (PC/EC - consistent but higher latency). Real design requires both tradeoffs.', code: null },
      ],
      animationSteps: [
        { label: 'Network splits',  description: 'Partition: Node A and Node B cannot talk',     highlight: true  },
        { label: 'CP: refuse',     description: 'CP system: Node B refuses reads - stays consistent', highlight: true },
        { label: 'AP: serve',      description: 'AP system: Node B serves stale data - stays up', highlight: false },
        { label: 'Partition heals', description: 'Network reconnects - nodes sync their state',   highlight: false },
        { label: 'Choose',         description: 'CP: banking. AP: social feeds. Choose by use case.', highlight: false },
      ],
      example: 'During AWS us-east-1 network issues in 2011, DynamoDB (AP) continued serving reads with potentially stale data while maintaining availability. An equivalent CP system would have rejected requests until quorum was restored. For the social apps using DynamoDB, showing a slightly stale friend count was acceptable. For a bank\'s balance, it would not have been.',
    },
  },

  // 10. Observability in Distributed Systems
  {
    order: 10, type: 'content', title: 'Observability in Distributed Systems',
    content: {
      overview: 'In a monolith, you look at one log file. In a distributed system with 50 services, a single user request may touch 20 of them. Finding where a failure occurred, or why a request was slow, requires sophisticated observability tooling.\n\nThe three pillars of observability are logs, metrics, and traces. Together they give you visibility into distributed system behaviour.',
      sections: [
        { heading: 'Distributed Tracing', body: 'Every request gets a unique trace ID at the entry point. Every service that handles the request logs its actions tagged with that trace ID. Tracing tools (Jaeger, Zipkin, AWS X-Ray) aggregate these logs and visualise the complete request path as a waterfall diagram - showing which service was slowest, where errors occurred, and how long each step took. Without tracing, debugging failures across 20 services requires manual correlation of timestamps.', code: null },
        { heading: 'Metrics', body: 'Metrics are numeric measurements collected over time: request rate, error rate, and latency (the RED metrics). Every service exposes these metrics. Prometheus scrapes them every 15 seconds. Grafana visualises them on dashboards. Alert rules fire when error rates exceed 1% or latency P99 exceeds 500ms. Metrics show you system health at a glance. When something goes wrong, metrics show you which service is misbehaving.', code: null },
        { heading: 'Centralised Logging', body: 'Each service writes logs to its local storage. A log shipping agent (Fluentd, Filebeat) forwards them to a central store (Elasticsearch, Datadog, Splunk). Engineers search across all service logs from one place. Every log line should include the trace ID so you can filter all logs for a specific failed request across all services. Structured logging (JSON format) enables rich querying.', code: null },
        { heading: 'Service Health Dashboards', body: 'The on-call engineer needs to see the health of the entire distributed system at a glance. A service dependency graph shows which services depend on which others. Traffic, errors, and latency for each service are shown simultaneously. When an alert fires, the engineer can immediately see which service is the root cause and which downstream services are affected. Tools like Grafana, Datadog, and Honeycomb specialise in this.', code: null },
      ],
      animationSteps: [
        { label: 'Request enters',  description: 'Trace ID assigned at entry service',           highlight: false },
        { label: 'Propagated',      description: 'All services log with same trace ID',          highlight: true  },
        { label: 'Service fails',   description: 'Payment service throws error at step 4',       highlight: true  },
        { label: 'Trace view',      description: 'Jaeger: shows full path - found failure in 5s', highlight: false },
        { label: 'Alert fires',     description: 'Prometheus: error rate >1% - on-call paged',   highlight: false },
      ],
      example: 'Lyft built Envoy proxy specifically for distributed systems observability. Every request between services passes through Envoy sidecars that automatically collect metrics and traces without any code changes. This service mesh approach provides observability across 1,000+ services without asking every engineering team to instrument their code correctly. The traces are aggregated in Jaeger where on-call engineers can find the root cause of any incident.',
    },
  },

  // 11. Failure Cases
  {
    order: 11, type: 'failureCases', title: 'Failure Cases',
    failureCases: [
      {
        title: 'Split-Brain: Two Leaders Elected Simultaneously',
        scenario: 'A Raft cluster has 5 nodes. A network partition separates them into groups of 3 and 2. The group of 3 has enough for a quorum and elects a new leader. The group of 2 still has the old leader who did not know about the partition. Both leaders accept writes for 5 minutes. When the partition heals, the nodes have diverging logs.',
        impact: 'Data inconsistency. Writes accepted by the old leader may conflict with writes accepted by the new leader. One set of writes must be discarded. Potential data loss.',
        resolution: 'Raft\'s term mechanism prevents split-brain. The old leader has term N. The new leader has term N+1. When the partition heals, the old leader sees the higher term and immediately steps down, rolling back its uncommitted log entries. Only committed entries (acknowledged by a quorum) survive. This is why Raft\'s quorum requirement is critical - the old leader (with only 2 nodes) cannot commit anything without a quorum.',
        animationSteps: [
          { label: 'Partition',      description: 'Network splits: 3 nodes vs 2 nodes',          highlight: true  },
          { label: '2 leaders',      description: 'Group of 3 elects new leader: term N+1',      highlight: true  },
          { label: 'Both write',     description: 'Both leaders accept writes independently',     highlight: true  },
          { label: 'Partition heals', description: 'Old leader sees higher term - steps down',   highlight: false },
          { label: 'Raft resolves',   description: 'Only quorum-committed entries survive',       highlight: false },
        ],
      },
      {
        title: 'Distributed Deadlock Across Services',
        scenario: 'Service A holds a lock on Resource 1 and requests a lock on Resource 2. Service B holds a lock on Resource 2 and requests a lock on Resource 1. Both wait for each other forever. Without a global deadlock detection mechanism, both services are stuck indefinitely.',
        impact: 'Both services halt. Any operation requiring either resource fails. If this happens during a critical path, the system appears completely unresponsive despite being fully operational for other work.',
        resolution: 'Always acquire distributed locks in a consistent global order (always lock Resource 1 before Resource 2, never the reverse). Use lock timeouts so locks release after a maximum hold time. Implement distributed deadlock detection or use optimistic locking (detect conflicts on commit rather than lock upfront). Never hold multiple distributed locks simultaneously if avoidable.',
        animationSteps: [
          { label: 'A locks R1',     description: 'Service A acquires lock on Resource 1',       highlight: false },
          { label: 'B locks R2',     description: 'Service B acquires lock on Resource 2',       highlight: false },
          { label: 'A wants R2',     description: 'Service A waits for Resource 2 - blocked',    highlight: true  },
          { label: 'B wants R1',     description: 'Service B waits for Resource 1 - deadlock!',  highlight: true  },
          { label: 'Fix',            description: 'Lock ordering: always R1 before R2 everywhere', highlight: false },
        ],
      },
      {
        title: 'Cascading Failure from Slow Dependency',
        scenario: 'Service A depends on Services B, C, and D. Service D starts responding slowly (30s instead of 100ms). Service A sets a 30-second timeout and waits. All of A\'s threads accumulate waiting for D. New requests to A are queued. The queue fills. Services that call A also start accumulating threads. Within 3 minutes the entire system is unresponsive despite only Service D being slow.',
        impact: 'System-wide outage from one slow service. The slowness cascades upstream through the dependency chain.',
        resolution: 'Circuit breakers at every service boundary. Aggressive timeouts (500ms not 30s). Bulkhead pattern: separate thread pools per downstream dependency so D\'s slowness cannot consume all of A\'s threads. Design fallbacks for every external call. Chaos engineering: regularly simulate slow dependencies to verify circuit breakers work correctly.',
        animationSteps: [
          { label: 'D slows',        description: 'Service D takes 30s instead of 100ms',        highlight: true  },
          { label: 'A threads fill', description: 'All of A\'s threads waiting for D',           highlight: true  },
          { label: 'A blocked',      description: 'New requests to A queue up - A appears down', highlight: true  },
          { label: 'Cascade',        description: 'Callers of A also fill up - system down',     highlight: false },
          { label: 'Fix',            description: 'Circuit breaker + 500ms timeout + bulkhead',  highlight: false },
        ],
      },
      {
        title: 'Lost Update Due to Non-Atomic Read-Modify-Write',
        scenario: 'Two nodes both read a counter value of 100. Node A increments it to 101 and writes back. Node B also increments from its stale read of 100 to 101 and writes back. The counter is 101 instead of 102. One increment is silently lost.',
        impact: 'Silent data corruption. The counter is wrong but no error was raised. With strong enough consistency requirements (financial counters, inventory), this causes real harm.',
        resolution: 'Use atomic compare-and-swap (CAS): "set value to 101 only if current value is still 100". If the CAS fails (another writer changed it), retry. Alternatively, use distributed transactions around the read-modify-write. Or use a CRDT (Conflict-free Replicated Data Type) that can merge concurrent increments mathematically without conflicts.',
        animationSteps: [
          { label: 'Both read 100',  description: 'Node A and Node B both read counter=100',     highlight: true  },
          { label: 'A writes 101',   description: 'Node A increments and writes back: 101',      highlight: false },
          { label: 'B writes 101',   description: 'Node B also increments from 100: writes 101',  highlight: true  },
          { label: 'Lost update',    description: 'Counter is 101 not 102 - one increment lost', highlight: true  },
          { label: 'Fix',            description: 'Compare-and-swap: only write if value unchanged', highlight: false },
        ],
      },
      {
        title: 'Thundering Herd After Partition Heals',
        scenario: 'A 6-hour network partition separates 100 microservice instances from the database. When the partition heals, all 100 instances simultaneously try to reconnect, check connection health, replay queued requests, and warm their local caches. The database is overwhelmed by 100x its normal connection load.',
        impact: 'The database crashes immediately after partition heals. Service that was recovering goes down again. The recovery causes another outage.',
        resolution: 'Implement exponential backoff with jitter on all reconnection logic. Instances should reconnect at random times spread over 30-120 seconds, not simultaneously. Use a connection pool with a maximum size enforced at reconnect. Gradually drain and process the backlog rather than replaying everything at once.',
        animationSteps: [
          { label: 'Partition heals', description: '100 instances all reconnect simultaneously',  highlight: true  },
          { label: 'DB overwhelmed', description: '100x connection flood - DB CPU 100%',          highlight: true  },
          { label: 'DB crashes',     description: 'Recovery attempt causes another outage',       highlight: true  },
          { label: 'Backoff',        description: 'With jitter: reconnect spread over 60 seconds', highlight: false },
          { label: 'Fix',            description: 'Exponential backoff + jitter on all reconnects', highlight: false },
        ],
      },
    ],
  },

  // 12. Interview Questions
  {
    order: 12, type: 'interview', title: 'Interview Discussion Questions',
    interviewQuestions: [
      {
        question: 'What are the main challenges of distributed systems compared to a single machine system?',
        answer: 'The fundamental challenges: partial failures (some nodes fail while others continue - you cannot simply halt all computation), network unreliability (packets lost, delayed, duplicated - a remote call can fail in ways a local call cannot), clock skew (no shared global clock - timestamps from different nodes cannot be directly compared), and the CAP theorem (cannot simultaneously guarantee consistency, availability, and partition tolerance). Additional challenges: distributed transactions are hard (no global ACID), debugging requires observability tools (logs, metrics, traces across many services), and operational complexity is much higher. Always ask: "do I actually need distribution?" - a single well-optimised machine handles surprisingly large loads.',
        difficulty: 'medium',
      },
      {
        question: 'Explain the CAP theorem and how it influences architectural decisions.',
        answer: 'CAP: a distributed system can only guarantee two of Consistency (every read returns the latest write), Availability (every request gets a response), and Partition Tolerance (works despite network splits). Since network partitions are inevitable, the real choice is CP vs AP. CP (ZooKeeper, HBase, etcd): during a partition, may reject requests to stay consistent. Right for: financial transactions, authentication, inventory counts, any data where stale reads cause real harm. AP (Cassandra, DynamoDB): during a partition, serves requests with potentially stale data. Right for: social feeds, view counts, shopping cart availability, anything where brief inconsistency is acceptable. Choose deliberately based on what stale data means for your specific use case.',
        difficulty: 'medium',
      },
      {
        question: 'How does the Raft consensus algorithm work?',
        answer: 'Raft works in three phases. Leader election: all nodes start as followers. If a follower does not hear from a leader within an election timeout, it becomes a candidate and requests votes. The first to get a majority of votes becomes leader for the current term. Log replication: the leader receives client requests, appends to its log, and sends AppendEntries RPCs to all followers in parallel. Once a majority acknowledge the entry, the leader marks it as committed and responds to the client. Safety: a node only votes for a candidate if that candidate\'s log is at least as up-to-date as its own. This ensures the elected leader always has all committed entries. A 2N+1 node cluster tolerates N failures.',
        difficulty: 'hard',
      },
      {
        question: 'What is the difference between 2-Phase Commit and the Saga pattern for distributed transactions?',
        answer: '2PC: synchronous blocking protocol. Phase 1 - coordinator asks all participants "can you commit?". Phase 2 - if all yes, commit; otherwise abort. Problems: blocking (if coordinator crashes between phases, participants hold locks indefinitely), poor availability (all participants must be reachable), high latency (synchronous coordination). Saga: sequence of local transactions with compensating transactions for rollback. Non-blocking - if step 3 fails, compensating transactions undo steps 1 and 2 asynchronously. Problems: no true atomicity (partial results visible), compensating transactions must be carefully designed. Use 2PC for tight systems (same database, same network). Use Saga for microservices across independent databases where availability matters more than strict atomicity.',
        difficulty: 'hard',
      },
      {
        question: 'Why can\'t you use timestamps from different machines to determine event order in a distributed system?',
        answer: 'Clock drift. Physical clocks on different machines run at slightly different rates and synchronise imperfectly via NTP (Network Time Protocol). NTP synchronises to within 10-100ms under normal conditions. Two events 20ms apart on different machines cannot be reliably ordered by their timestamps - the ordering could be wrong. Additionally, a machine\'s clock can jump backwards after NTP correction, breaking the assumption that timestamps monotonically increase. Solutions: Lamport clocks (logical counter incremented on events and messages - gives happens-before ordering without wall clocks), Vector clocks (per-node counters enabling detection of causality and concurrency), or hardware solutions like Google TrueTime (atomic clocks + GPS bounding clock uncertainty).',
        difficulty: 'medium',
      },
      {
        question: 'Design a distributed counter (like a video view count) that can handle millions of increments per second.',
        answer: 'The naive solution (read-increment-write with strong consistency) will not work at millions/second due to coordination overhead. Approaches by increasing complexity. Approximate counter with eventual consistency: each server keeps a local counter, periodically merge all local counters into a global total. Eventual consistency - count may be slightly stale but scales infinitely. CRDT (Grow-only Counter): a G-Counter assigns one counter slot per node, each node only increments its own slot, the total is sum of all slots. CRDTs merge automatically without conflicts. Sharded counter: partition the counter into N shards, each shard handles 1/N of increments, aggregate on read. For YouTube with 1M increments/second: use sharded counters with 100 shards (10K inc/sec each), aggregate periodically, accept counts slightly stale by seconds.',
        difficulty: 'hard',
      },
      {
        question: 'What is a quorum and why is it important in distributed systems?',
        answer: 'A quorum is the minimum number of nodes that must participate in an operation for it to be considered valid. In a cluster of N nodes, the standard quorum is (N/2) + 1 (majority). Importance: any two quorums must share at least one node. This overlap guarantees: write quorum + read quorum always overlap, so every strongly consistent read will see the latest write. For a 5-node cluster: write to 3 nodes, read from 3 nodes - they must share at least 1 node that has the latest write. This is how systems like Cassandra achieve tunable consistency: read from 1 (fast, may be stale), read from 3 (slow, strongly consistent). Quorum is also used in leader election - a candidate must receive votes from a majority before becoming leader, preventing split-brain.',
        difficulty: 'medium',
      },
      {
        question: 'How would you detect and handle a slow node (not crashed, just slow) in a distributed system?',
        answer: 'Detection: phi accrual failure detector uses statistical analysis of heartbeat intervals to give a confidence score that a node is down, rather than a binary determination. Adaptive timeouts: track response time percentiles (P99) per node, set timeout at 2-3x the moving average. Monitoring: track tail latency (P99, P999) per node - a slow node shows up as high tail latency. Handling: circuit breaker opens after N slow responses, routing stops until node recovers. Timeout and retry to a different replica. Hedged requests: send to two replicas and use whichever responds first (doubles request load but eliminates tail latency). Backpressure: if a node signals it is at capacity, stop sending traffic temporarily. The key insight: a slow node is often worse than a crashed node - a crashed node fails fast, a slow node blocks threads.',
        difficulty: 'hard',
      },
    ],
  },

  // 13. Quiz
  {
    order: 13, type: 'quiz', title: 'Distributed Systems Quiz',
    quizConfig: {
      timeLimitSeconds: 600, maxAttempts: 3, passingPercent: 70,
      questions: [
        {
          question: 'Node A sends a request to Node B. Node B does not respond. What are the possible reasons?',
          options: ['Node B crashed only', 'Network partition only', 'Node B crashed, network partition, B is slow, or request was lost - cannot distinguish', 'Node B is overloaded only'],
          correctIndex: 2, scenario: true,
          explanation: 'This is the fundamental ambiguity of distributed systems. A non-response could mean: the node crashed, the network is partitioned, the node is under heavy load, or the request packet was lost. Node A cannot distinguish between these cases - they all look the same from A\'s perspective. This is why systems must handle all these cases with timeouts, retries, and circuit breakers.',
        },
        {
          question: 'In a 7-node Raft cluster, how many nodes can fail before the cluster stops making progress?',
          options: ['1 node', '2 nodes', '3 nodes', '4 nodes'],
          correctIndex: 2, scenario: false,
          explanation: 'A 7-node cluster requires a quorum of 4 (majority). The cluster can tolerate 7 - 4 = 3 failures and still form a quorum with the remaining 4 nodes. Formula: a (2N+1) node cluster tolerates N failures. 7 = 2(3)+1, so N=3 failures tolerated.',
        },
        {
          question: 'Two nodes both read the same counter value (100) and both write back incremented values. The counter ends up at 101 instead of 102. What problem is this?',
          options: ['Clock skew', 'Lost update (non-atomic read-modify-write)', 'Split-brain', 'Partition tolerance failure'],
          correctIndex: 1, scenario: true,
          explanation: 'Lost update. Both nodes read the stale value before either wrote back. Both incremented from 100 to 101. One write overwrote the other. Fix: use compare-and-swap (set 101 only if value is still 100), distributed lock around the read-modify-write, or CRDT counters that merge concurrent increments correctly.',
        },
        {
          question: 'Which consistency model ensures that after you write a value, you will always read that value back, but other users might still see the old value?',
          options: ['Strong consistency', 'Read-your-writes consistency', 'Eventual consistency', 'Causal consistency'],
          correctIndex: 1, scenario: false,
          explanation: 'Read-your-writes. This guarantees that a client always sees its own writes on subsequent reads, but does not guarantee other clients see the write immediately. Implemented by routing the same client\'s reads to the replica they wrote to, or tracking their write position and waiting for replicas to catch up.',
        },
        {
          question: 'In a network partition, what does a CP database do vs an AP database?',
          options: ['CP serves requests, AP rejects them', 'CP rejects requests to stay consistent, AP serves requests with potentially stale data', 'Both behave identically during partitions', 'CP serves only reads, AP serves only writes'],
          correctIndex: 1, scenario: false,
          explanation: 'CP prioritises consistency over availability. During a partition, if a quorum cannot be reached, the CP system refuses requests rather than risk returning stale data. AP prioritises availability - it serves requests from available nodes even if they may be stale, achieving eventual consistency when the partition heals.',
        },
        {
          question: 'A Saga for booking: Step 1 creates a booking, Step 2 charges the card, Step 3 notifies the host. Step 3 fails. What happens?',
          options: ['Transaction rolls back atomically - card never charged', 'Compensating transactions run: refund card, cancel booking', 'Step 3 is retried indefinitely', 'The partial state (booking + charge) is committed as-is'],
          correctIndex: 1, scenario: true,
          explanation: 'Compensating transactions. Saga is not atomic like 2PC. Steps 1 and 2 already committed locally. When Step 3 fails, compensating transactions run in reverse: refund the card (compensate Step 2), cancel the booking (compensate Step 1). The compensating transactions must be idempotent and retried until they succeed.',
        },
        {
          question: 'Why are wall clock timestamps from different machines unreliable for determining event order in a distributed system?',
          options: ['Machines in different time zones confuse timestamps', 'Clock drift: NTP synchronisation is imperfect, machines\' clocks diverge by 10-100ms', 'Timestamps are too slow to compute', 'Network latency makes timestamps arrive out of order'],
          correctIndex: 1, scenario: false,
          explanation: 'Clock drift. Physical clocks on different machines run at slightly different rates and NTP can only synchronise them to within 10-100ms. Two events 50ms apart on different machines might have their timestamps swapped. Lamport clocks and vector clocks solve this by using logical counters rather than wall clocks.',
        },
        {
          question: 'What is the purpose of using a heartbeat mechanism between nodes in a distributed system?',
          options: ['To synchronise clocks between nodes', 'To detect when a node has failed so traffic can be rerouted', 'To replicate data between nodes', 'To elect a new leader node'],
          correctIndex: 1, scenario: false,
          explanation: 'Failure detection. Nodes send periodic heartbeats (every 5-10s). If a node misses a configurable number of heartbeats, it is declared failed and removed from the active pool. Without heartbeats, the system would not know a node has failed and would continue routing requests to it, causing errors for users.',
        },
        {
          question: 'Service A depends on B, C, and D. D becomes slow (30s response). Without mitigation, what cascades?',
          options: ['Only requests to D are affected', 'A\'s threads fill up waiting for D, then A appears down, then A\'s callers also fill up', 'The load balancer automatically routes around D', 'D eventually recovers and the system stabilises'],
          correctIndex: 1, scenario: true,
          explanation: 'Cascading failure. A\'s threads are blocked waiting 30s for D. New requests to A queue up. A\'s callers (E, F) start accumulating threads waiting for A. Within minutes the entire call chain is down. Solution: circuit breaker opens after N failures, timeout set to 500ms not 30s, bulkhead isolates D\'s thread pool from affecting other calls.',
        },
        {
          question: 'What does a vector clock tell you that a Lamport clock cannot?',
          options: ['The exact wall clock time of events', 'Whether two events are causally related or concurrent', 'Which node processed more events', 'The network latency between nodes'],
          correctIndex: 1, scenario: false,
          explanation: 'Concurrency detection. A Lamport clock gives a partial ordering: if event A\'s timestamp < B\'s, A could have happened before B. But it cannot tell you if A and B are concurrent (both happened independently without knowing about each other). Vector clocks track per-node counters - if two events\' vector clocks are incomparable (neither is less than the other in all positions), they are concurrent. This powers conflict detection in systems like DynamoDB.',
        },
      ],
    },
  },
];

module.exports = DISTRIBUTED_SYSTEMS_MODULES;
