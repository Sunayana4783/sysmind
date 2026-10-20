// Static System Architecture content - 11 modules total
// Orders 1-8: content topics (simple language, no code)
// Order 9:  Failure Cases
// Order 10: Interview Discussion Questions
// Order 11: Quiz

const SYSTEM_ARCHITECTURE_MODULES = [

  // ── 1. System Architecture Fundamentals ───────────────────────────────────
  {
    order: 1, type: 'content', title: 'System Architecture Fundamentals',
    content: {
      overview: 'When you build a small app, one computer running your code is fine. But what happens when a million people use it at the same time? That is when you need to think about system architecture - the plan for how all the different pieces of your system fit together.\n\nSystem architecture answers questions like: where does the code run, how do different parts talk to each other, and what happens if one part breaks?',
      sections: [
        {
          heading: 'What is System Architecture?',
          body: 'System architecture is the high-level blueprint of a software system. It defines the major components, how they communicate, and the principles that guide design decisions. Think of it like the blueprint of a building - before you lay any bricks, you need to know where the walls, doors, and pipes go.',
          code: null,
        },
        {
          heading: 'Why It Matters',
          body: 'A wrong architectural decision early on can cost months to fix later. Good architecture makes a system easy to scale when traffic grows, easy to change when requirements shift, and resilient when parts fail. Bad architecture means every new feature is a battle against the existing code.',
          code: null,
        },
        {
          heading: 'Key Quality Attributes',
          body: 'Every architectural decision involves tradeoffs between scalability (handles more users), reliability (stays up), maintainability (easy to change), performance (responds fast), and security (protects data). No system is perfect at all five - you always choose which ones matter most for your product.',
          code: null,
        },
        {
          heading: 'The CAP Theorem',
          body: 'In a distributed system you can only guarantee two of three: Consistency (every read gets the latest write), Availability (every request gets a response), and Partition Tolerance (system works even if network splits). Network failures always happen, so real systems choose between being consistent or being available during a network problem.',
          code: null,
        },
      ],
      animationSteps: [
        { label: 'Client', description: 'User makes a request from browser or app', highlight: false },
        { label: 'Load Balancer', description: 'Distributes traffic across multiple servers', highlight: true },
        { label: 'App Server', description: 'Processes business logic and handles request', highlight: true },
        { label: 'Cache', description: 'Returns fast response if data already cached', highlight: false },
        { label: 'Database', description: 'Persists and retrieves data when needed', highlight: false },
      ],
      example: 'Instagram started as a single server. As users grew, they added load balancers, then multiple app servers, then caches, then database replicas. Each step was an architectural decision driven by scale. Today Instagram serves over a billion users with a deeply distributed architecture.',
    },
  },

  // ── 2. Architectural Patterns ─────────────────────────────────────────────
  {
    order: 2, type: 'content', title: 'Architectural Patterns',
    content: {
      overview: 'Over decades of building software, engineers discovered that the same types of problems keep appearing. They named and documented the solutions - these are called architectural patterns. Instead of reinventing the wheel, you pick the pattern that fits your problem.\n\nThe most important patterns to know are Layered, Event-Driven, and Client-Server, since almost every system uses at least one of them.',
      sections: [
        {
          heading: 'Layered Architecture',
          body: 'Code is split into horizontal layers, each with a clear job. The most common split is: Presentation (what the user sees), Business Logic (the rules of your app), and Data (storage). Each layer only talks to the layer directly below it. This makes it easy to change one layer without breaking others.',
          code: null,
        },
        {
          heading: 'Event-Driven Architecture',
          body: 'Instead of services calling each other directly, they communicate by publishing and subscribing to events. Service A publishes "order placed". Services B, C, and D each subscribe and react independently - send email, charge card, update inventory. They do not need to know about each other. This makes the system very loosely coupled.',
          code: null,
        },
        {
          heading: 'Client-Server Pattern',
          body: 'The most common pattern on the web. Clients (browsers, apps) send requests and servers respond with data. The server holds the logic and data; the client handles display. REST APIs and GraphQL both follow this pattern. The separation means you can build a web client, mobile app, and desktop app all sharing the same server.',
          code: null,
        },
        {
          heading: 'Pipe and Filter',
          body: 'Data flows through a series of processing steps, each doing one specific transformation. Think of a photo upload: receive file → validate format → resize → compress → store → return URL. Each step is independent. You can reorder, replace, or add steps without changing the others. ETL pipelines and video processing use this heavily.',
          code: null,
        },
      ],
      animationSteps: [
        { label: 'Presentation', description: 'UI layer - handles user interaction', highlight: false },
        { label: 'API Layer', description: 'Routes and validates incoming requests', highlight: true },
        { label: 'Business Logic', description: 'Applies rules and processes data', highlight: true },
        { label: 'Data Access', description: 'Queries and persists to storage', highlight: false },
        { label: 'Database', description: 'Stores the actual data persistently', highlight: false },
      ],
      example: 'Spotify uses event-driven architecture for its recommendation engine. When you finish a song, a "song completed" event fires. The recommendation service picks it up and updates your taste profile. The analytics service picks it up and updates play counts. Neither service calls the other - they both just listen to the same event.',
    },
  },

  // ── 3. Monolithic vs Microservices ────────────────────────────────────────
  {
    order: 3, type: 'content', title: 'Monolithic vs Microservices',
    content: {
      overview: 'When you start building an app, everything usually lives in one codebase - one database, one deployment. That is called a monolith. As your app grows and your team grows, some companies split it into many small independent services called microservices.\n\nNeither is better than the other - they solve different problems. Understanding when to use each is one of the most important decisions in system design.',
      sections: [
        {
          heading: 'Monolithic Architecture',
          body: 'A monolith is a single deployable unit. All features - user management, payments, notifications, search - live in the same codebase and run as one process. It is simple to develop at first, easy to test, and straightforward to deploy. The problem comes when the team grows: everyone is editing the same code, deployments affect everything, and one bug can take down the whole application.',
          code: null,
        },
        {
          heading: 'Microservices Architecture',
          body: 'Microservices splits the application into small, independent services. Each service owns one business capability, has its own database, and is deployed separately. The User Service only handles users. The Payment Service only handles payments. Teams work independently. But this comes at a cost: network calls between services, more complex deployments, and distributed system problems.',
          code: null,
        },
        {
          heading: 'When to Choose Each',
          body: 'Start with a monolith. It is faster to build, easier to change early on, and avoids the operational complexity of microservices before you need it. Move to microservices when: your team is too large to coordinate on one codebase, different parts need to scale independently, or deployments of one part are blocking others.',
          code: null,
        },
        {
          heading: 'The Strangler Fig Pattern',
          body: 'Migrating from monolith to microservices all at once is dangerous. Instead, use the Strangler Fig pattern. Route new features to new microservices while the monolith still runs. Gradually move old features out one at a time. The monolith "strangles" over months or years without a risky big-bang rewrite.',
          code: null,
        },
      ],
      animationSteps: [
        { label: 'Monolith', description: 'All services in one deployable unit', highlight: false },
        { label: 'Problem grows', description: 'Team grows, code becomes hard to change', highlight: true },
        { label: 'Extract service', description: 'Split out one independent microservice', highlight: true },
        { label: 'API Gateway', description: 'Single entry point routes to services', highlight: false },
        { label: 'Independent deploy', description: 'Each service deploys and scales alone', highlight: false },
      ],
      example: 'Amazon started as a monolith in 1995. By 2002, Jeff Bezos mandated that all teams expose their functionality via service APIs. That memo was the beginning of Amazon\'s microservices transformation - and eventually led to AWS, which was built on those internal service infrastructure tools.',
    },
  },

  // ── 4. System Components and Communication ───────────────────────────────
  {
    order: 4, type: 'content', title: 'System Components and Communication',
    content: {
      overview: 'A real system is not just code and a database. It has many specialized components, each doing a specific job. A load balancer distributes traffic. A message queue handles async work. An API gateway is the front door. Understanding what each component does and how they communicate helps you design reliable systems.\n\nServices communicate in two main ways: synchronously (wait for a reply) or asynchronously (fire and forget).',
      sections: [
        {
          heading: 'API Gateway',
          body: 'The API gateway is the single entry point for all client requests. It handles authentication, rate limiting, request routing, and response aggregation. Clients talk to one URL; the gateway figures out which backend service to call. It also handles cross-cutting concerns so individual services do not have to.',
          code: null,
        },
        {
          heading: 'Message Queue',
          body: 'A message queue lets services communicate asynchronously. Service A puts a message in the queue and immediately continues working. Service B picks up the message when it is ready and processes it. This decouples the two services completely. If Service B is slow or down, messages just wait in the queue. RabbitMQ and Kafka are the most popular.',
          code: null,
        },
        {
          heading: 'Synchronous vs Asynchronous Communication',
          body: 'Synchronous: Service A calls Service B and waits. Simple and easy to understand, but A is blocked while waiting. If B is slow, A is slow. Used for real-time data needs like fetching a user profile.\n\nAsynchronous: Service A sends a message and continues. B processes when ready. Used for work that does not need an immediate result like sending emails, processing images, or updating analytics.',
          code: null,
        },
        {
          heading: 'Service Discovery',
          body: 'In microservices, services constantly start and stop. How does Service A know the current address of Service B? Service discovery solves this. Each service registers its address in a central registry (like Consul or Kubernetes DNS). When A needs to call B, it looks up the current address from the registry instead of hardcoding an IP.',
          code: null,
        },
      ],
      animationSteps: [
        { label: 'Client request', description: 'Request hits the API Gateway', highlight: false },
        { label: 'Auth check', description: 'Gateway validates JWT token', highlight: true },
        { label: 'Route', description: 'Gateway routes to correct microservice', highlight: true },
        { label: 'Async work', description: 'Service pushes job to message queue', highlight: false },
        { label: 'Worker', description: 'Background worker processes queue job', highlight: false },
      ],
      example: 'When you post a photo on Instagram, the API Gateway receives the upload, routes it to the Media Service, which synchronously validates and stores the photo, then asynchronously pushes a message to the queue. A background worker picks it up and creates multiple resized versions without making you wait.',
    },
  },

  // ── 5. Scalability and Load Distribution ─────────────────────────────────
  {
    order: 5, type: 'content', title: 'Scalability and Load Distribution',
    content: {
      overview: 'Scalability is the ability of your system to handle more load by adding resources. A scalable system can serve 100 users and also serve 10 million users - it just needs more resources for the larger load.\n\nThere are two ways to scale: scale up (bigger machine) or scale out (more machines). Most modern systems scale out because there is a limit to how big one machine can get.',
      sections: [
        {
          heading: 'Vertical vs Horizontal Scaling',
          body: 'Vertical scaling means upgrading to a more powerful single machine - more CPU, more RAM. It is simple (no code changes) but has a hard ceiling: you cannot buy an infinitely big machine. Horizontal scaling means adding more machines and splitting the load between them. It scales to almost any size but requires your app to work correctly across multiple instances.',
          code: null,
        },
        {
          heading: 'Load Balancing',
          body: 'A load balancer sits in front of your servers and distributes incoming requests across them. If one server has 100 requests and another has 10, the load balancer sends new requests to the less busy server. If a server goes down, the load balancer stops sending traffic to it. NGINX, AWS ALB, and HAProxy are common load balancers.',
          code: null,
        },
        {
          heading: 'Load Balancing Algorithms',
          body: 'Round Robin sends each request to the next server in rotation - simple and works well when all requests are similar. Least Connections sends to the server with the fewest active connections - better when requests vary in processing time. Consistent Hashing maps specific users to specific servers - used for cache servers so the same user always hits the same cache.',
          code: null,
        },
        {
          heading: 'Auto Scaling',
          body: 'Auto scaling monitors your system load and automatically adds or removes servers. At midnight when traffic is low, you run 2 servers. At noon when traffic peaks, auto scaling spins up 20 servers. At 2 AM they shut back down. You pay only for what you use. AWS Auto Scaling, Kubernetes Horizontal Pod Autoscaler do this automatically.',
          code: null,
        },
      ],
      animationSteps: [
        { label: 'Traffic surge', description: 'Request volume spikes suddenly', highlight: true },
        { label: 'Load Balancer', description: 'Distributes requests across server pool', highlight: true },
        { label: 'Server 1', description: 'Handles its share of requests', highlight: false },
        { label: 'Server 2', description: 'Handles its share in parallel', highlight: false },
        { label: 'Auto scale', description: 'New server added automatically when needed', highlight: false },
      ],
      example: 'Netflix runs on AWS and auto-scales constantly. Friday evenings they might run 10,000 servers to handle peak streaming traffic. By 4 AM they scale down to 2,000. This elasticity saves millions of dollars compared to provisioning for peak load 24/7.',
    },
  },

  // ── 6. Database Architecture ──────────────────────────────────────────────
  {
    order: 6, type: 'content', title: 'Database Architecture',
    content: {
      overview: 'The database is often the biggest bottleneck in a system. No matter how fast your application servers are, they are only as fast as the database responding behind them. Database architecture covers how to structure, scale, and distribute your data storage.\n\nThe two main decisions are: SQL vs NoSQL, and how to distribute data across multiple database servers.',
      sections: [
        {
          heading: 'SQL vs NoSQL',
          body: 'SQL databases (PostgreSQL, MySQL) store data in tables with fixed schemas and support complex queries with JOINs. They guarantee ACID transactions - every operation is atomic, consistent, isolated, and durable. Use SQL when data relationships are complex or data integrity is critical.\n\nNoSQL databases (MongoDB, Cassandra) store data in flexible formats - documents, key-value, wide columns. They scale horizontally more easily and can store unstructured data. Use NoSQL for massive scale, flexible schemas, or when you need global distribution.',
          code: null,
        },
        {
          heading: 'Database Replication',
          body: 'Replication copies your data to multiple database servers. The primary server handles all writes. Replica servers get copies and handle reads. If your system reads data 10x more than it writes, you can have 10 replicas each handling reads and 1 primary handling writes. This spreads the load dramatically. If the primary fails, a replica gets promoted.',
          code: null,
        },
        {
          heading: 'Database Sharding',
          body: 'Sharding splits data across multiple database servers. User IDs 1-1M go to Shard 1. User IDs 1M-2M go to Shard 2. Each shard is a separate database server. No single server holds all the data. This allows near-infinite horizontal scaling. The challenge is that queries across shards require extra work, and rebalancing shards when one gets too large is complex.',
          code: null,
        },
        {
          heading: 'Connection Pooling',
          body: 'Opening a new database connection takes time - typically 20-50ms. If your app creates a new connection for every request, you waste that time on every single query. A connection pool keeps a set of connections open and ready. Requests borrow a connection from the pool, use it, and return it. With 20 connections in the pool and 1000 requests, they share the connections efficiently.',
          code: null,
        },
      ],
      animationSteps: [
        { label: 'Write request', description: 'All writes go to the Primary database', highlight: true },
        { label: 'Replication', description: 'Primary replicates data to replicas', highlight: true },
        { label: 'Read request', description: 'Read queries distributed to replicas', highlight: false },
        { label: 'Replica 1', description: 'Serves read traffic independently', highlight: false },
        { label: 'Replica 2', description: 'Another replica for higher read capacity', highlight: false },
      ],
      example: 'LinkedIn has 950 million users. They use a combination of SQL (MySQL) for structured profile data, replicas for handling billions of reads per day, and sharding by member ID. Without replication and sharding, a single database server would collapse under the query load within minutes.',
    },
  },

  // ── 7. Distributed Systems ───────────────────────────────────────────────
  {
    order: 7, type: 'content', title: 'Distributed Systems',
    content: {
      overview: 'A distributed system is one where multiple computers work together and appear as a single system to users. Your phone, a data center in London, and servers in Singapore can all be part of the same distributed system.\n\nDistributed systems are powerful - they can store more data and handle more traffic than any single machine. But they introduce new problems that do not exist on a single computer: network failures, data consistency across servers, and partial failures.',
      sections: [
        {
          heading: 'The Fallacies of Distributed Computing',
          body: 'Developers new to distributed systems often assume: the network is reliable, latency is zero, bandwidth is infinite, the network is secure. All of these are false. Networks fail, packets get lost, connections are slow, and attackers exist. Every distributed system must be designed assuming any of these can happen at any time.',
          code: null,
        },
        {
          heading: 'Consistency Models',
          body: 'Strong consistency: every read returns the most recent write, no matter which server you ask. Easiest to reason about but hardest to achieve at scale.\n\nEventual consistency: all servers will eventually agree, but there may be a brief window where they show different values. Acceptable for things like social media likes or view counts where a few seconds of lag is fine.',
          code: null,
        },
        {
          heading: 'Consensus Algorithms',
          body: 'How do distributed servers agree on a value when they cannot fully trust each other or the network? Consensus algorithms solve this. Raft is the most readable: servers elect a leader, all writes go through the leader, the leader replicates to followers. If the leader dies, followers elect a new one. Raft is used in etcd, CockroachDB, and Consul.',
          code: null,
        },
        {
          heading: 'Distributed Transactions',
          body: 'In a single database, a transaction either fully succeeds or fully rolls back. In distributed systems, a payment might need to debit one service and credit another - both must succeed or both must fail. The Two-Phase Commit protocol coordinates this: Phase 1 - ask everyone "can you commit?", Phase 2 - if all say yes, tell everyone to commit. If anyone says no, tell everyone to rollback.',
          code: null,
        },
      ],
      animationSteps: [
        { label: 'Leader node', description: 'Leader receives and coordinates all writes', highlight: true },
        { label: 'Replicate', description: 'Leader sends write to all follower nodes', highlight: true },
        { label: 'Acknowledge', description: 'Majority of nodes acknowledge the write', highlight: false },
        { label: 'Commit', description: 'Leader commits and confirms to client', highlight: false },
        { label: 'Sync', description: 'Remaining nodes sync when available', highlight: false },
      ],
      example: 'Google Spanner is a globally distributed SQL database running across data centers on multiple continents. It achieves strong consistency globally using atomic clocks and the TrueTime API to synchronize time across all servers. It serves Google Ads, which processes billions of dollars in transactions daily.',
    },
  },

  // ── 8. Fault Tolerance and High Availability ──────────────────────────────
  {
    order: 8, type: 'content', title: 'Fault Tolerance and High Availability',
    content: {
      overview: 'Every system will have failures. Servers crash, networks go down, disks fail, software has bugs. Fault tolerance is about designing your system so that when individual parts fail, the overall system keeps working.\n\nHigh availability (HA) measures this as a percentage of uptime. 99.9% availability means about 9 hours of downtime per year. 99.99% means 52 minutes. 99.999% means 5 minutes.',
      sections: [
        {
          heading: 'Redundancy',
          body: 'The foundation of fault tolerance is having multiple copies of every critical component. Two load balancers (if one dies, the other takes over). Three database replicas (if one dies, two remain). Multiple availability zones (if one data center has a power failure, others keep running). Redundancy costs more but is the only reliable way to handle hardware failures.',
          code: null,
        },
        {
          heading: 'Circuit Breaker Pattern',
          body: 'Imagine Service A calls Service B which is down. Without a circuit breaker, every request to A fails slowly while waiting for B to time out - this cascades and brings down A too. A circuit breaker monitors failures. After 5 failures in a row it "opens" - immediately returns an error without calling B. After 30 seconds it tries again. This stops cascading failures from spreading.',
          code: null,
        },
        {
          heading: 'Health Checks and Failover',
          body: 'Load balancers continuously send health check pings to each server (every 5-10 seconds). If a server stops responding, the load balancer marks it unhealthy and stops sending traffic to it. When it recovers, traffic resumes. This is automatic failover - no human intervention needed. The key metric is how fast the system detects and routes around a failure.',
          code: null,
        },
        {
          heading: 'Graceful Degradation',
          body: 'When part of a system fails, it should degrade gracefully rather than fail completely. If the recommendation engine is down, Amazon still shows the product page - just without personalized recommendations. If the payment service is slow, show a loading spinner instead of a blank page. Plan for partial failures and define what the user experience looks like in each degraded mode.',
          code: null,
        },
      ],
      animationSteps: [
        { label: 'Server fails', description: 'Primary server becomes unresponsive', highlight: true },
        { label: 'Health check', description: 'Load balancer detects failure in seconds', highlight: true },
        { label: 'Traffic rerouted', description: 'All requests moved to healthy servers', highlight: false },
        { label: 'Alert fired', description: 'On-call engineer notified of incident', highlight: false },
        { label: 'Recovery', description: 'Failed server restarted and rejoins pool', highlight: false },
      ],
      example: 'AWS S3 achieves 99.999999999% (11 nines) durability by storing each object across at least 3 availability zones. Even if an entire data center burns down, your data survives. Netflix runs Chaos Monkey - a tool that randomly kills production servers - to ensure their system handles failures gracefully at all times.',
    },
  },

  // ── 9. Failure Cases ─────────────────────────────────────────────────────
  {
    order: 9, type: 'failureCases', title: 'Failure Cases',
    failureCases: [
      {
        title: 'Cascading Service Failure',
        scenario: 'Service A calls Service B which calls Service C. Service C is slow due to a database issue. Service B threads pile up waiting for C. Service A threads pile up waiting for B. Within 30 seconds the entire system is unresponsive.',
        impact: 'Total system outage from one slow dependency. All three services go down even though only C had the original problem.',
        resolution: 'Implement circuit breakers between every service pair. Set aggressive timeouts (500ms). Use bulkhead pattern to isolate thread pools per downstream dependency. Always define a fallback response.',
        animationSteps: [
          { label: 'C slows down', description: 'Service C database query takes 30s', highlight: true },
          { label: 'B threads fill', description: 'Service B waits for C, threads exhaust', highlight: true },
          { label: 'A threads fill', description: 'Service A waits for B, threads exhaust', highlight: true },
          { label: 'Total outage', description: 'All three services unresponsive', highlight: false },
          { label: 'Fix: circuit breaker', description: 'Open circuit stops cascade immediately', highlight: false },
        ],
      },
      {
        title: 'Database Connection Pool Exhaustion',
        scenario: 'Traffic spikes to 10x normal. Each request opens a DB connection. Pool is configured for 100 connections. 1000 concurrent requests all try to get a connection. 900 requests queue and wait. Latency climbs to 30 seconds. Users see timeouts.',
        impact: 'Application appears unresponsive. Logs show "connection pool timeout". Restarting the app temporarily helps but the problem returns immediately.',
        resolution: 'Right-size the connection pool based on database max connections and app server count. Add a queue depth limit. Implement request shedding above a threshold. Use async/non-blocking database drivers to use fewer connections for the same concurrency.',
        animationSteps: [
          { label: 'Traffic spike', description: '1000 concurrent requests arrive', highlight: true },
          { label: 'Pool full', description: 'All 100 DB connections in use', highlight: true },
          { label: 'Queue builds', description: '900 requests waiting for connection', highlight: false },
          { label: 'Timeouts', description: 'Requests fail after waiting 30s', highlight: false },
          { label: 'Fix: async driver', description: 'Async queries share connections efficiently', highlight: false },
        ],
      },
      {
        title: 'Split-Brain in Distributed Database',
        scenario: 'A network partition separates a database cluster into two halves. Both halves believe the other is dead. Both elect a primary. Users on each side write to different primaries. When the partition heals, the two primaries have conflicting data.',
        impact: 'Data corruption. Orders placed during the partition may be lost or duplicated. User records on the two sides have diverged.',
        resolution: 'Use quorum-based writes (require majority acknowledgment before confirming write). Deploy odd number of nodes. Use a tool like Raft or Paxos that only one partition can have the majority. Never run a 2-node cluster.',
        animationSteps: [
          { label: 'Network split', description: 'Network partition divides cluster in two', highlight: true },
          { label: 'Two primaries', description: 'Each half elects its own primary', highlight: true },
          { label: 'Conflicting writes', description: 'Both primaries accept writes independently', highlight: true },
          { label: 'Partition heals', description: 'Network reconnects - data conflicts detected', highlight: false },
          { label: 'Fix: quorum', description: 'Require majority vote - only one side wins', highlight: false },
        ],
      },
      {
        title: 'Memory Leak in Long-Running Service',
        scenario: 'A microservice runs fine for hours. After 12 hours, memory usage has climbed from 200MB to 2GB. The OS starts swapping to disk. The service slows to a crawl, then crashes. It restarts, runs fine for 12 hours, and crashes again.',
        impact: 'Regular service restarts causing brief outages every 12 hours. Each restart flushes in-memory state, causing brief inconsistencies.',
        resolution: 'Profile memory with a heap dump during the leak. Common causes: event listeners never removed, caches without eviction limits, closures holding references. Fix the root cause. Add memory limit alerts at 70% and 85%. Use a process manager (PM2) to auto-restart cleanly when memory exceeds a threshold.',
        animationSteps: [
          { label: 'Service starts', description: 'Memory usage at baseline 200MB', highlight: false },
          { label: 'Leak grows', description: 'Each request leaks a small amount', highlight: true },
          { label: 'Memory full', description: 'RAM exhausted after 12 hours', highlight: true },
          { label: 'Service crashes', description: 'OOM kill - service restarts', highlight: false },
          { label: 'Fix: heap profile', description: 'Find and remove uncleaned references', highlight: false },
        ],
      },
      {
        title: 'Thundering Herd on Service Restart',
        scenario: 'A popular service restarts after a crash. 50,000 clients all detect the reconnect simultaneously and retry at the same moment. The service starts up but is immediately overwhelmed by the flood of simultaneous reconnections.',
        impact: 'The service crashes again immediately after restarting. This becomes a crash loop. The more clients there are, the faster the service crashes after each restart.',
        resolution: 'Implement exponential backoff with jitter on all client retry logic. Clients retry after random(0, 1s), then random(0, 2s), then random(0, 4s), etc. This spreads the reconnection load across seconds rather than milliseconds.',
        animationSteps: [
          { label: 'Service restarts', description: 'Service comes back online after crash', highlight: false },
          { label: 'All clients retry', description: '50K clients reconnect simultaneously', highlight: true },
          { label: 'Overload', description: 'Service overwhelmed and crashes again', highlight: true },
          { label: 'Fix: jitter', description: 'Clients retry after random backoff delay', highlight: false },
          { label: 'Smooth load', description: 'Reconnections spread over 30 seconds', highlight: false },
        ],
      },
    ],
  },

  // ── 10. Interview Questions ───────────────────────────────────────────────
  {
    order: 10, type: 'interview', title: 'Interview Discussion Questions',
    interviewQuestions: [
      {
        question: 'Design a URL shortener like bit.ly that handles 100 million URLs and 10 billion redirects per month.',
        answer: 'Use a hash function to generate a 7-character short code. Store long URL to short code mapping in a SQL database sharded by short code. Cache short code to long URL in Redis with a long TTL (redirects rarely change). Use consistent hashing so the same short code always hits the same cache shard. CDN layer for most popular redirects. The read-to-write ratio is about 100:1 so optimize heavily for reads.',
        difficulty: 'hard',
      },
      {
        question: 'Your monolithic application is too slow to deploy (40-minute build). How do you approach breaking it into microservices?',
        answer: 'Do not rewrite everything at once - use the Strangler Fig pattern. Identify the bounded contexts: user, order, payment, inventory. Start with the service that causes the most deployment pain (often the one changed most frequently). Extract it behind an API boundary while keeping the monolith running. Migrate traffic gradually. Accept that the transition takes 12-18 months for a large system.',
        difficulty: 'medium',
      },
      {
        question: 'How would you design a system to handle 1 million concurrent WebSocket connections?',
        answer: 'Each server can hold about 100K WebSocket connections. Need 10 servers minimum. Use a load balancer with sticky sessions so the same client always connects to the same server. Use Redis Pub/Sub so a message sent from server 1 can be delivered to clients connected to server 7. Store session state in Redis so if a server crashes clients can reconnect to any server.',
        difficulty: 'hard',
      },
      {
        question: 'What is the CAP theorem and how does it influence database selection?',
        answer: 'CAP: you can only guarantee two of Consistency, Availability, and Partition Tolerance. Network partitions always happen, so you choose between CP (consistent during partitions - may reject requests) or AP (available during partitions - may serve stale data). PostgreSQL is CP. DynamoDB and Cassandra are AP with tunable consistency. Choose based on whether stale reads are acceptable in your domain.',
        difficulty: 'medium',
      },
      {
        question: 'A microservice you depend on has 99.9% uptime. You depend on 10 such services. What is your overall availability?',
        answer: '99.9% to the power of 10 = about 99%. That means about 3.6 days of downtime per year from dependencies alone, even if your own service is perfect. This is why you must implement timeouts, circuit breakers, and fallbacks for every external dependency. The more dependencies you have, the more critical resilience patterns become.',
        difficulty: 'medium',
      },
      {
        question: 'How does consistent hashing work and why is it used in distributed systems?',
        answer: 'Consistent hashing maps both data keys and servers onto a ring (0 to 2^32). Each key is stored on the first server clockwise from its hash position. When a server is added or removed, only the keys on that arc of the ring need to move - about 1/N of all keys. Without consistent hashing, adding one server requires rehashing all keys. Used in Redis Cluster, Cassandra, and load balancers for cache affinity.',
        difficulty: 'hard',
      },
      {
        question: 'When would you choose eventual consistency over strong consistency?',
        answer: 'Eventual consistency is acceptable when: brief staleness does not harm the user or business (social media likes, view counts, activity feeds), when availability is more important than perfect accuracy (shopping cart availability during network issues), or at massive global scale where strong consistency is too slow. Strong consistency is required for: financial transactions, inventory counts, authentication tokens, and any data where incorrect values cause real harm.',
        difficulty: 'medium',
      },
      {
        question: 'Explain the two-generals problem and why it matters in distributed systems.',
        answer: 'Two armies communicate by messenger to coordinate an attack, but messengers can be captured. Army A cannot be certain Army B received its confirmation, and Army B cannot be certain Army A received its acknowledgment. This is a fundamental impossibility: over an unreliable network you cannot achieve perfect guaranteed delivery with perfect confirmation. In practice: use message queues with at-least-once delivery and make operations idempotent so duplicates are harmless.',
        difficulty: 'hard',
      },
    ],
  },

  // ── 11. Quiz ─────────────────────────────────────────────────────────────
  {
    order: 11, type: 'quiz', title: 'System Architecture Quiz',
    quizConfig: {
      timeLimitSeconds: 600, maxAttempts: 3, passingPercent: 70,
      questions: [
        {
          question: 'Your startup has 3 developers and 1000 users. You are about to build a new feature. Which architecture should you start with?',
          options: ['Microservices with Kubernetes', 'Monolith with a well-structured codebase', 'Event-driven serverless architecture', 'Distributed database with sharding'],
          correctIndex: 1, scenario: true,
          explanation: 'Monolith first. At small scale, microservices add operational complexity without benefit. A well-structured monolith is faster to build, easier to change, and simple to deploy. Migrate to microservices when team or scale demands it.',
        },
        {
          question: 'Service A depends on Services B, C, and D. Service D becomes slow. Within 2 minutes Service A is unresponsive. What pattern prevents this?',
          options: ['Load balancing', 'Circuit breaker', 'Database replication', 'API gateway'],
          correctIndex: 1, scenario: true,
          explanation: 'Circuit breaker. After detecting D is slow, it opens the circuit and immediately returns a fallback response instead of waiting. This prevents D\'s slowness from consuming all of A\'s threads and causing a cascading failure.',
        },
        {
          question: 'You need to send a welcome email when a user signs up. The email service is sometimes slow. Best approach?',
          options: ['Call email service synchronously during signup', 'Put email job in a message queue, signup returns immediately', 'Skip the email if the service is slow', 'Call email service with a 5s timeout'],
          correctIndex: 1, scenario: true,
          explanation: 'Message queue. Signup is fast and reliable. The email job sits in the queue and is processed when the email service is ready. This decouples the two operations completely and improves signup reliability.',
        },
        {
          question: 'Your SQL database primary is handling 50,000 reads per second and is at 95% CPU. The data rarely changes. Best solution?',
          options: ['Upgrade to a larger database server', 'Add read replicas and route reads to them', 'Switch to a NoSQL database', 'Reduce the number of database columns'],
          correctIndex: 1, scenario: true,
          explanation: 'Read replicas. If reads dominate, replicate data to multiple servers and distribute reads across them. This scales read capacity linearly. Upgrading the primary is vertical scaling with a hard ceiling.',
        },
        {
          question: 'In the CAP theorem, what must every distributed system always provide?',
          options: ['Consistency', 'Availability', 'Partition Tolerance', 'Durability'],
          correctIndex: 2, scenario: false,
          explanation: 'Partition Tolerance is mandatory - network failures always happen in distributed systems. You cannot choose to not handle them. So the real choice is between Consistency and Availability during a partition.',
        },
        {
          question: 'Your e-commerce site needs to handle 100x traffic on Black Friday. What is the best scaling approach?',
          options: ['Buy a much bigger server 3 days before', 'Horizontal auto-scaling with load balancer', 'Manually start extra servers on the morning of Black Friday', 'Reduce features to handle less traffic'],
          correctIndex: 1, scenario: true,
          explanation: 'Horizontal auto-scaling. Define scaling policies based on CPU/request metrics. AWS Auto Scaling automatically adds servers as traffic rises and removes them as it falls. No manual intervention, no over-provisioning, pay only for what you use.',
        },
        {
          question: 'A database cluster has 2 nodes. Why is this dangerous?',
          options: ['Two nodes use twice the storage', 'With a network partition, both nodes can become primary (split-brain)', 'Two nodes are slower than one', 'Two nodes cannot replicate data'],
          correctIndex: 1, scenario: false,
          explanation: 'Split-brain. With 2 nodes and a network partition, each node thinks the other is dead and promotes itself to primary. Both accept writes, creating conflicting data. Always run 3 or more nodes so a majority quorum can be formed.',
        },
        {
          question: 'You are migrating a monolith to microservices. What is the safest approach?',
          options: ['Stop the monolith, rewrite everything as microservices, then deploy', 'Use the Strangler Fig pattern to gradually extract services', 'Deploy microservices and monolith in parallel permanently', 'Only migrate the database first, keep the monolith'],
          correctIndex: 1, scenario: true,
          explanation: 'Strangler Fig. Gradually route new features and then old features to microservices while the monolith continues running. This avoids a risky big-bang rewrite and allows rollback at any point. The monolith is "strangled" over time.',
        },
        {
          question: 'What is the availability of a system that depends on 3 services each with 99% uptime?',
          options: ['99%', '99.9%', 'About 97%', 'About 95%'],
          correctIndex: 2, scenario: false,
          explanation: '99% x 99% x 99% = 97.03%. Each additional dependency multiplies the downtime risk. With 10 services at 99% uptime, overall availability drops to ~90%. This is why resilience patterns (circuit breakers, fallbacks) are essential in microservices.',
        },
        {
          question: 'Which load balancing algorithm ensures the same user always reaches the same server (useful for caching)?',
          options: ['Round Robin', 'Least Connections', 'Consistent Hashing', 'Random'],
          correctIndex: 2, scenario: false,
          explanation: 'Consistent Hashing maps users to servers deterministically. The same user ID always hashes to the same server, so their cached data is always there. Adding or removing a server only remaps ~1/N of users, minimizing cache misses during cluster changes.',
        },
      ],
    },
  },
];

module.exports = SYSTEM_ARCHITECTURE_MODULES;
