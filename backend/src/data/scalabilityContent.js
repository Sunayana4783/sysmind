// Static Scalability content - 12 modules total
// Orders 1-9:  content topics
// Order 10: Failure Cases
// Order 11: Interview Discussion Questions
// Order 12: Quiz

const SCALABILITY_MODULES = [

  // ── 1. Scalability Fundamentals ───────────────────────────────────────────
  {
    order: 1, type: 'content', title: 'Scalability Fundamentals',
    content: {
      overview: 'Scalability is the ability of a system to handle more work by adding resources. A scalable system serves 100 users and 100 million users - it just needs more resources for the larger load.\n\nMost systems start small and grow. The decisions you make early - how you structure your database, how you write your application code, how you design your APIs - all determine how easily the system can scale later.',
      sections: [
        {
          heading: 'What Scalability Actually Means',
          body: 'Scalability is not just about handling more users. It has three dimensions: Load scalability (handling more requests per second), Data scalability (storing and querying more data), and Geographic scalability (serving users in more locations with low latency). A system can be good at one and terrible at others.',
          code: null,
        },
        {
          heading: 'Throughput vs Latency',
          body: 'Throughput is how many requests your system handles per second. Latency is how long a single request takes. These are related but different. A system can have high throughput but also high latency - it processes many requests but each one is slow. Scalability work often involves improving throughput without degrading latency.',
          code: null,
        },
        {
          heading: 'The Scaling Equation',
          body: 'If your system handles 1,000 requests per second on one server, adding a second server should ideally handle 2,000. In practice it never doubles perfectly due to coordination overhead, shared resources like databases, and uneven load distribution. The closer you get to linear scaling, the better your architecture.',
          code: null,
        },
        {
          heading: 'When to Think About Scalability',
          body: 'Do not optimise for scale before you need it - that is premature optimisation. Build for your current load with clean architecture that can scale. When you hit 70-80% of capacity on any resource (CPU, memory, database connections), that is when to act. Monitor constantly so you know when that threshold approaches.',
          code: null,
        },
      ],
      animationSteps: [
        { label: 'Single server', description: 'One server handles all requests fine', highlight: false },
        { label: 'Traffic grows', description: 'User count increases 10x', highlight: true },
        { label: 'Bottleneck', description: 'Server CPU hits 90% - requests slow down', highlight: true },
        { label: 'Scale out', description: 'Add more servers to share the load', highlight: false },
        { label: 'Linear scale', description: 'Each new server adds proportional capacity', highlight: false },
      ],
      example: 'WhatsApp scaled to 900 million users with only 50 engineers. They achieved this by choosing Erlang (which handles millions of concurrent connections efficiently), keeping the architecture simple, and scaling horizontally. The lesson: the right technology and architecture choices matter more than throwing servers at a problem.',
    },
  },

  // ── 2. Vertical vs Horizontal Scaling ────────────────────────────────────
  {
    order: 2, type: 'content', title: 'Vertical vs Horizontal Scaling',
    content: {
      overview: 'When your system needs more capacity, you have two fundamental choices: make the existing machine bigger (vertical scaling) or add more machines (horizontal scaling). Every scaling decision starts here.\n\nEach approach has clear advantages and a clear ceiling. Understanding both - and knowing when to use each - is one of the most fundamental skills in system design.',
      sections: [
        {
          heading: 'Vertical Scaling (Scale Up)',
          body: 'Vertical scaling means upgrading the machine your application runs on. Add more CPU cores, more RAM, a faster disk. It is the simplest approach - no code changes required. Your application just has more resources available. The problem is the ceiling: there is a limit to how powerful a single machine can be, and large machines are disproportionately expensive. Also, one machine is a single point of failure.',
          code: null,
        },
        {
          heading: 'Horizontal Scaling (Scale Out)',
          body: 'Horizontal scaling means adding more machines and distributing the load across all of them. Instead of one powerful server, you have ten average servers. This scales to almost any size - you can keep adding machines. But it requires your application to work correctly when running as multiple instances, which means handling state carefully and ensuring any server can handle any request.',
          code: null,
        },
        {
          heading: 'Stateless is the Key to Horizontal Scaling',
          body: 'The biggest challenge with horizontal scaling is state. If a user logs in on Server 1 and their session is stored in that server\'s memory, the next request - which might go to Server 2 - won\'t find the session. Solution: move all state out of the application servers into shared stores like Redis (for sessions) and databases. Each server becomes stateless - any server can handle any request.',
          code: null,
        },
        {
          heading: 'Which to Choose?',
          body: 'Start with vertical scaling for simplicity - it requires no architectural changes. Switch to horizontal when you hit the vertical ceiling or need high availability (since horizontal means no single point of failure). Most large systems use both: vertical scaling for the database (buy a bigger database server), horizontal scaling for application servers (add more app instances).',
          code: null,
        },
      ],
      animationSteps: [
        { label: 'Small server', description: 'One server, handles current load', highlight: false },
        { label: 'Scale up', description: 'Upgrade to larger CPU and RAM', highlight: true },
        { label: 'Hit ceiling', description: 'Max machine size reached - still not enough', highlight: true },
        { label: 'Scale out', description: 'Add 3 more servers behind load balancer', highlight: false },
        { label: 'Any server', description: 'Stateless design - any server handles any request', highlight: false },
      ],
      example: 'Stack Overflow serves 1.5 billion page views per month from just 9 web servers. They use aggressive vertical scaling - very powerful servers with lots of RAM. This works because their content is highly cacheable. Twitter went the opposite way - hundreds of horizontally scaled commodity servers because their workload (real-time fan-out of tweets) cannot be handled by a single machine no matter how large.',
    },
  },

  // ── 3. Elasticity and Auto-Scaling ────────────────────────────────────────
  {
    order: 3, type: 'content', title: 'Elasticity and Auto-Scaling',
    content: {
      overview: 'Elasticity is the ability of a system to automatically grow and shrink its resources in response to real-time demand. Instead of provisioning for peak load 24 hours a day, an elastic system adds capacity when traffic spikes and removes it when traffic drops.\n\nAuto-scaling is the technology that implements elasticity. It monitors your system and automatically adjusts the number of running servers based on defined rules.',
      sections: [
        {
          heading: 'Why Elasticity Matters',
          body: 'Traffic is never constant. An e-commerce site has normal traffic during the week and 10x traffic on weekends. A news site has spikes when a big story breaks. A food delivery app peaks at lunch and dinner. Without elasticity you have two bad choices: provision for peak (expensive and wasteful at off-peak) or provision for average (cheap but crashes at peak). Elasticity gives you the best of both.',
          code: null,
        },
        {
          heading: 'How Auto-Scaling Works',
          body: 'You define scaling policies with thresholds. When average CPU across your server group exceeds 70% for 5 minutes, add 2 more servers. When CPU drops below 30% for 10 minutes, remove 1 server. The cloud monitors these metrics and automatically provisions or terminates instances. AWS Auto Scaling Groups, Google Cloud Managed Instance Groups, and Kubernetes Horizontal Pod Autoscaler all implement this.',
          code: null,
        },
        {
          heading: 'Scale-Out Lag',
          body: 'Auto-scaling is not instant. Spinning up a new server takes 1-5 minutes - the OS needs to boot, your application needs to start, health checks need to pass. During that window your existing servers absorb extra load. This is called scale-out lag. Solutions: keep a warm pool of pre-started instances ready to use, use predictive scaling based on historical patterns, or set scaling thresholds lower so you scale before you actually need it.',
          code: null,
        },
        {
          heading: 'Scaling Metrics',
          body: 'CPU utilisation is the simplest scaling metric but not always the right one. A Node.js app doing I/O-heavy work might have low CPU but be saturated with open connections. Better metrics to consider: requests per second, average response time, queue depth, memory utilisation, and custom application metrics. Choose the metric that best reflects when your system is actually struggling.',
          code: null,
        },
      ],
      animationSteps: [
        { label: 'Normal load', description: '2 servers running, CPU at 40%', highlight: false },
        { label: 'Traffic spike', description: 'Black Friday sale starts - CPU hits 80%', highlight: true },
        { label: 'Trigger fires', description: 'Auto-scaler detects threshold breach', highlight: true },
        { label: 'New servers', description: '3 more servers provisioned automatically', highlight: false },
        { label: 'Scale down', description: 'Traffic drops - servers terminated to save cost', highlight: false },
      ],
      example: 'Netflix runs on AWS and scales dynamically with viewing patterns. Friday evenings they might run 100,000 server instances globally to handle peak streaming. By 4 AM they scale down to 20,000. This elasticity saves millions of dollars compared to running 100,000 instances 24/7 just to handle Friday night peaks.',
    },
  },

  // ── 4. Stateless vs Stateful Application Scaling ──────────────────────────
  {
    order: 4, type: 'content', title: 'Stateless vs Stateful Scaling',
    content: {
      overview: 'Whether your application is stateless or stateful is one of the biggest factors in how easily it can scale horizontally. Stateless applications are trivial to scale - just add more servers. Stateful applications require careful handling to avoid serving wrong or missing data.\n\nMost modern web applications are designed to be stateless, moving state into external shared storage.',
      sections: [
        {
          heading: 'What is Application State?',
          body: 'State is any data your application remembers between requests. A user\'s login session is state. An in-progress multi-step checkout process is state. A shopping cart stored in server memory is state. If this data lives inside the application server\'s memory, only that specific server can serve subsequent requests from that user correctly.',
          code: null,
        },
        {
          heading: 'Stateless Architecture',
          body: 'In a stateless architecture, no server holds any user-specific data in memory. Every request contains all the information needed to process it - typically via a JWT token for authentication and a database or cache lookup for everything else. Because no server has special knowledge of any user, any server can handle any request. A load balancer can freely route requests to any healthy server.',
          code: null,
        },
        {
          heading: 'Sticky Sessions (and Why to Avoid Them)',
          body: 'Sticky sessions (also called session affinity) are a workaround for stateful apps: the load balancer always routes a specific user\'s requests to the same server. This maintains state but creates problems. If that server goes down, the user\'s session is lost. Load distribution becomes uneven. You cannot freely scale by adding new servers since existing sessions are pinned to specific ones. Avoid sticky sessions - move state out instead.',
          code: null,
        },
        {
          heading: 'Where to Store State',
          body: 'Move state to shared external stores that all servers can access. User sessions: Redis (fast, in-memory, TTL support). Shopping carts and temporary data: Redis. User preferences and profile data: database. File uploads: object storage like S3. With state externalised, every application server is identical and replaceable. Scaling means adding more identical stateless servers.',
          code: null,
        },
      ],
      animationSteps: [
        { label: 'Stateful', description: 'User session stored in Server 1 memory', highlight: true },
        { label: 'Problem', description: 'Server 1 crashes - session lost for this user', highlight: true },
        { label: 'Move state', description: 'Sessions moved from memory to Redis', highlight: false },
        { label: 'Stateless', description: 'Any server reads session from Redis', highlight: false },
        { label: 'Scale freely', description: 'Add or remove servers with no session loss', highlight: false },
      ],
      example: 'When Shopify handles Black Friday, they scale from hundreds to thousands of app servers within minutes. This is only possible because every Shopify app server is completely stateless. All shopping cart data, session tokens, and user state lives in Redis and MySQL - not in any server\'s memory. Any server can handle any request from any merchant at any time.',
    },
  },

  // ── 5. Capacity Planning and Traffic Estimation ───────────────────────────
  {
    order: 5, type: 'content', title: 'Capacity Planning and Traffic Estimation',
    content: {
      overview: 'Capacity planning is figuring out how many resources (servers, database connections, storage) you need to handle your expected traffic without running out. It combines traffic estimation (how many requests will come) with resource profiling (how much each request costs).\n\nThis is a critical skill in system design interviews - being able to do back-of-envelope calculations shows you think quantitatively about systems.',
      sections: [
        {
          heading: 'Traffic Estimation',
          body: 'Start with daily active users (DAU). Estimate how many actions each user performs per day. Calculate requests per second: DAU x actions per day divided by 86,400 seconds. Add a peak factor - traffic is not uniform, peak hours might be 3-5x the average. Example: 10 million DAU, 10 actions each = 100 million requests per day = 1,157 per second average, with peaks around 5,000 per second.',
          code: null,
        },
        {
          heading: 'Storage Estimation',
          body: 'Estimate data created per user per day, multiply by DAU, multiply by days of retention. Add headroom for indexes (typically 20-30% on top of raw data). Example: a social media app where each user creates 2 posts per day, each 500 bytes = 1KB per user per day. With 50 million users, that is 50GB per day, 18TB per year. Now you know you need distributed storage, not a single server.',
          code: null,
        },
        {
          heading: 'Resource Profiling',
          body: 'Know what each request actually costs. Profile your app under load: how much CPU does a typical API request use? How much memory? How many database queries does it trigger? How long does each query take? With this data you can calculate: if each request uses 5ms of CPU on a server with 8 cores, one server can handle 8,000 / 5ms = 1,600 requests per second at 100% CPU. Plan for 60-70% utilisation for headroom.',
          code: null,
        },
        {
          heading: 'Headroom and Growth',
          body: 'Never provision for exactly your current load. Always add headroom for: traffic spikes (2-3x buffer), data growth (plan for 12-18 months), and auto-scaling lag (servers need time to provision). A good rule: if you are at 60% capacity, start planning to scale. If you hit 80%, act immediately. If you hit 90%, you are already in danger of an outage.',
          code: null,
        },
      ],
      animationSteps: [
        { label: 'DAU estimate', description: '10M daily active users x 10 actions', highlight: false },
        { label: 'Avg QPS', description: '100M requests / 86,400s = 1,157 QPS avg', highlight: true },
        { label: 'Peak QPS', description: 'Peak hours 3-5x avg = 5,000 QPS peak', highlight: true },
        { label: 'Per server', description: 'Each server handles 500 QPS at 70% CPU', highlight: false },
        { label: 'Need 10 servers', description: '5,000 / 500 = 10 servers for peak load', highlight: false },
      ],
      example: 'Before Twitter\'s 2010 World Cup traffic (the first major social media event), their engineers did capacity planning that told them they needed 3x their normal server count. They provisioned ahead of time. This calculation saved them from the outage that would have happened if they had waited until the event started.',
    },
  },

  // ── 6. Bottleneck Identification and Performance Optimization ─────────────
  {
    order: 6, type: 'content', title: 'Bottleneck Identification and Optimization',
    content: {
      overview: 'A bottleneck is the one component that limits the performance of your entire system. It does not matter how fast your application servers are if your database is slow - the database is the bottleneck. Scaling everything except the bottleneck wastes money and achieves nothing.\n\nThe first step to improving performance is always measurement. You cannot fix what you cannot see.',
      sections: [
        {
          heading: 'Finding the Bottleneck',
          body: 'Use profiling tools to measure where time is actually spent in a request. In most web applications the bottleneck is almost always the database - N+1 queries, missing indexes, or lock contention. The second most common bottleneck is external API calls - waiting for a third-party service. Application code (CPU-bound work) is rarely the bottleneck for typical CRUD applications.',
          code: null,
        },
        {
          heading: 'Database Bottlenecks',
          body: 'Slow database queries are the most common performance problem. Diagnose with query analysis tools (EXPLAIN in PostgreSQL/MySQL). Common fixes: add missing indexes on columns used in WHERE and JOIN clauses, avoid N+1 queries by using joins or batching, add a read replica to offload reads, or add a cache (Redis) in front of frequently accessed data. Reducing database load is almost always the biggest performance win.',
          code: null,
        },
        {
          heading: 'Application-Level Optimisation',
          body: 'Once the database is not the bottleneck, look at the application. Common wins: avoid doing work inside loops that can be done once outside, batch external API calls instead of calling one at a time, use async processing to move slow work off the critical path, and cache computed results that are expensive to recalculate. Profile the code to find the actual slow path before optimising.',
          code: null,
        },
        {
          heading: 'Caching as a Performance Tool',
          body: 'Caching is the most powerful single tool for improving performance. If a database query takes 50ms and is called 1,000 times per second, adding a Redis cache that serves 95% of those calls cuts your database load by 950 queries per second and drops response time from 50ms to under 1ms for cached responses. Cache the results of expensive queries, API responses, and computed aggregations.',
          code: null,
        },
      ],
      animationSteps: [
        { label: 'Profile request', description: 'Measure time spent in each component', highlight: false },
        { label: 'DB is slow', description: 'Database takes 480ms of 500ms total', highlight: true },
        { label: 'Find cause', description: 'Missing index on user_id column', highlight: true },
        { label: 'Add index', description: 'Query drops from 480ms to 8ms', highlight: false },
        { label: 'Add cache', description: 'Redis cache cuts DB calls by 90%', highlight: false },
      ],
      example: 'In 2011, GitHub was experiencing slow page loads. They profiled and found that rendering a single repository page was triggering 600+ database queries (classic N+1 problem). By restructuring queries and adding caching, they reduced this to 8 queries per page load. No new servers needed - just fixing the bottleneck.',
    },
  },

  // ── 7. Database Scaling Basics ────────────────────────────────────────────
  {
    order: 7, type: 'content', title: 'Database Scaling Basics',
    content: {
      overview: 'The database is almost always the hardest component to scale. Application servers are stateless and easy to scale horizontally - just add more. Databases hold all your data and must stay consistent, making scaling much more complex.\n\nThis module covers the essential techniques: read replicas for read-heavy workloads, sharding for write-heavy or very large datasets, and connection pooling to handle many concurrent requests.',
      sections: [
        {
          heading: 'Read Replicas',
          body: 'In most web applications, reads (fetching data) far outnumber writes (creating or updating data). Often 80-95% of database queries are reads. Read replicas solve this: the primary database handles all writes and replicates data to one or more replica databases that handle reads. With 5 replicas, your read capacity is 5x. If your primary fails, a replica is promoted. This is the first database scaling technique to apply.',
          code: null,
        },
        {
          heading: 'Connection Pooling',
          body: 'Opening a database connection takes time (20-50ms) and each connection consumes database memory. If your app opens a new connection for every request and you have 1,000 concurrent requests, the database needs 1,000 connections simultaneously - most databases struggle above a few hundred. A connection pool maintains a fixed set of open connections (say 20) that requests borrow and return. PgBouncer (PostgreSQL) and ProxySQL (MySQL) are popular poolers.',
          code: null,
        },
        {
          heading: 'Database Sharding',
          body: 'Sharding splits data across multiple database servers. Instead of one server holding all users, User IDs 1-5 million go to Shard 1, IDs 5-10 million go to Shard 2, and so on. Each shard is an independent database. This scales both storage and write throughput near-linearly with the number of shards. The complexity: queries that span shards require extra work, and rebalancing when a shard grows too large is difficult. Use sharding only when read replicas are not enough.',
          code: null,
        },
        {
          heading: 'Caching in Front of the Database',
          body: 'Before sharding, always try adding a cache. Redis in front of your database can reduce database load by 80-90% for read-heavy workloads. Cache the results of your most frequent queries. This is far simpler than sharding and often entirely avoids the need for it. The rule: cache first, add read replicas second, shard only as a last resort.',
          code: null,
        },
      ],
      animationSteps: [
        { label: 'Write traffic', description: 'All writes go to the Primary database', highlight: false },
        { label: 'Replicate', description: 'Primary replicates data to replicas', highlight: true },
        { label: 'Read traffic', description: 'Reads distributed across 3 replicas', highlight: true },
        { label: 'Connection pool', description: 'Pool of 20 connections shared by 1000 requests', highlight: false },
        { label: 'Shard if needed', description: 'Split data by user ID across multiple DBs', highlight: false },
      ],
      example: 'Instagram uses PostgreSQL with read replicas to handle billions of queries per day. Each photo, comment, and like generates reads distributed across replica pools. For their most read-heavy tables they run dozens of replicas. They also use Cassandra for the activity feed - a NoSQL database chosen specifically because it scales writes horizontally, something PostgreSQL alone cannot do at their scale.',
    },
  },

  // ── 8. Scaling Strategies and Trade-offs ─────────────────────────────────
  {
    order: 8, type: 'content', title: 'Scaling Strategies and Trade-offs',
    content: {
      overview: 'There is no universal scaling strategy that works for every system. Each approach involves a trade-off - you give something up to gain something else. Understanding the trade-offs helps you choose the right strategy for your specific situation.\n\nThe most important strategies to know are caching, load balancing, asynchronous processing, and content delivery networks.',
      sections: [
        {
          heading: 'Caching Strategy',
          body: 'Caching is the highest ROI scaling strategy for most systems. Serving data from memory (Redis, Memcached) is 100-1000x faster than querying a database. Trade-off: cached data can become stale if the underlying data changes. You must decide how long cached data is valid (TTL) and when to invalidate it. The more you cache, the faster the system, but the higher the risk of serving stale data.',
          code: null,
        },
        {
          heading: 'Async Processing',
          body: 'Move slow work off the critical request path. When a user signs up, do not send the welcome email synchronously inside the sign-up request. Push it to a queue and return immediately. A background worker sends the email. This makes the sign-up API response instant, and if the email service is slow or down, the sign-up still succeeds. Trade-off: the email might arrive a few seconds later than if done synchronously.',
          code: null,
        },
        {
          heading: 'CDN for Static Assets',
          body: 'A Content Delivery Network caches static files (images, JS, CSS, videos) at servers located around the world. A user in Mumbai gets your images from a Mumbai CDN server instead of your origin server in the US. This reduces latency from 200ms to 10ms for assets. It also offloads 60-80% of traffic from your origin servers. Trade-off: CDNs cost money per GB of data transferred.',
          code: null,
        },
        {
          heading: 'Microservices for Independent Scaling',
          body: 'If your image processing service needs 10x more capacity than your user authentication service, a monolith forces you to scale both together. Microservices let you scale each service independently. Trade-off: microservices add operational complexity - more deployments, more network calls, more points of failure. Only decompose into microservices when independent scaling or independent deployment is a real need, not a theoretical one.',
          code: null,
        },
      ],
      animationSteps: [
        { label: 'Strategy choice', description: 'Which scaling approach fits this problem?', highlight: false },
        { label: 'Cache first', description: 'Redis cache reduces DB load 80% - cheapest win', highlight: true },
        { label: 'Async queue', description: 'Slow work moved to background workers', highlight: true },
        { label: 'CDN layer', description: 'Static assets served from edge globally', highlight: false },
        { label: 'Trade-off noted', description: 'Cache = possible staleness, Async = eventual processing', highlight: false },
      ],
      example: 'Airbnb\'s search feature needs to handle millions of searches per day with complex availability calculations. Their strategy: cache search results aggressively, run search queries asynchronously in the background to pre-warm caches before users search, and use Elasticsearch (which scales horizontally) rather than PostgreSQL for search. Each strategy was chosen for a specific trade-off the team consciously accepted.',
    },
  },

  // ── 9. Handling Traffic Spikes and Sudden Load ────────────────────────────
  {
    order: 9, type: 'content', title: 'Handling Traffic Spikes and Sudden Load',
    content: {
      overview: 'Traffic spikes are the hardest scaling challenge. Normal auto-scaling handles gradual traffic growth, but a sudden 100x spike - from a viral post, a product launch, or a breaking news event - can overwhelm a system before auto-scaling has time to react.\n\nPreparing for traffic spikes requires a combination of techniques: rate limiting, queue-based load leveling, warm pools, and graceful degradation.',
      sections: [
        {
          heading: 'Rate Limiting',
          body: 'Rate limiting caps how many requests a single client can make per unit of time. If each user can make at most 100 requests per minute, a single bad actor or runaway client cannot overwhelm your system. Rate limiting also prevents accidental denial-of-service from clients with bugs that send requests in a tight loop. Implement at the API gateway level using Redis to track request counts per user per window.',
          code: null,
        },
        {
          heading: 'Queue-Based Load Leveling',
          body: 'Instead of processing every request immediately, put them in a queue. The queue absorbs the spike. Your processing workers drain the queue at their natural rate. Users might wait a few seconds during a spike instead of getting errors. This converts a sudden vertical spike into a gradual horizontal flow of work. RabbitMQ, SQS, and Kafka are used for this pattern.',
          code: null,
        },
        {
          heading: 'Warm Pools and Pre-Scaling',
          body: 'Auto-scaling takes 2-5 minutes to provision a new server. During that window, your existing servers absorb the full spike. A warm pool is a set of pre-started servers that are running but not receiving traffic. When the auto-scaler triggers, these servers join immediately (under 30 seconds) instead of waiting for provisioning. Pre-scaling is manually scaling up before a known event like a product launch or a planned sale.',
          code: null,
        },
        {
          heading: 'Graceful Degradation Under Spike',
          body: 'Define what your system does when capacity is exceeded. Do not crash - degrade gracefully. Serve cached (potentially stale) data instead of querying the database. Disable expensive non-critical features (recommendations, analytics) and keep the core working. Show a loading queue message to users instead of an error page. A degraded but working experience is always better than a complete outage.',
          code: null,
        },
      ],
      animationSteps: [
        { label: 'Spike arrives', description: 'Traffic jumps 50x in 30 seconds', highlight: true },
        { label: 'Rate limiter', description: 'Excess requests rejected with 429 Too Many Requests', highlight: true },
        { label: 'Queue absorbs', description: 'Remaining requests buffered in message queue', highlight: false },
        { label: 'Warm pool', description: 'Pre-started servers join immediately', highlight: false },
        { label: 'Degrade safely', description: 'Non-critical features disabled to protect core', highlight: false },
      ],
      example: 'When the PS5 launched in 2020, Sony\'s PlayStation Store crashed within minutes of going live. The spike was entirely predictable - millions of pre-registered users all trying at once - but the system was not prepared. Contrast this with Nike SNKRS shoe drops: they use a waiting room (queue-based load leveling) that holds users before the release time, releasing them in controlled batches that the checkout system can handle.',
    },
  },

  // ── 10. Failure Cases ─────────────────────────────────────────────────────
  {
    order: 10, type: 'failureCases', title: 'Failure Cases',
    failureCases: [
      {
        title: 'Auto-Scaler Too Slow for Sudden Spike',
        scenario: 'A tweet about your product goes viral. Traffic jumps from 500 to 50,000 requests per second in 90 seconds. Your auto-scaler triggers at 70% CPU but takes 4 minutes to provision new servers. During those 4 minutes, your 3 existing servers handle 17x their capacity. Response times jump to 30 seconds and users give up.',
        impact: 'Service appears down during the exact moment of maximum public attention. First impressions lost, reputation damaged.',
        resolution: 'Maintain a warm pool of 3-5 pre-started instances ready to join in under 30 seconds. Set auto-scaling to trigger at 50% CPU (not 70%). Implement a queue-based waiting room for new requests during spikes. Use predictive scaling based on social media monitoring.',
        animationSteps: [
          { label: 'Viral moment', description: 'Traffic spikes 100x in 90 seconds', highlight: true },
          { label: 'Scaler triggers', description: 'Auto-scaler fires - starts provisioning', highlight: true },
          { label: '4 min lag', description: 'Existing 3 servers overwhelmed for 4 minutes', highlight: true },
          { label: 'Too late', description: 'Users already gave up and left', highlight: false },
          { label: 'Fix: warm pool', description: 'Pre-started instances join in 30 seconds instead', highlight: false },
        ],
      },
      {
        title: 'Database Becomes the Bottleneck After App Scaling',
        scenario: 'You scale your app servers from 5 to 50 to handle increased traffic. Response times improve briefly, then get worse again. You have 50 app servers all hammering a single database that was sized for 5 servers. The database is now at 100% CPU and has 1,500 concurrent connections against a limit of 500.',
        impact: 'Adding more app servers actually made things worse by multiplying database load. Connection errors flood the logs.',
        resolution: 'Scale app servers and database together. Add a connection pooler (PgBouncer). Add read replicas to distribute read queries. Add Redis cache to absorb repeated reads. Never scale one layer without checking the downstream impact.',
        animationSteps: [
          { label: '5 app servers', description: 'Database handles load fine at 40% CPU', highlight: false },
          { label: 'Scale to 50', description: '50 app servers each open DB connections', highlight: true },
          { label: 'DB overloaded', description: '1,500 connections, DB at 100% CPU', highlight: true },
          { label: 'Worse than before', description: 'More servers made the bottleneck worse', highlight: false },
          { label: 'Fix', description: 'Add read replicas, connection pooler, Redis cache', highlight: false },
        ],
      },
      {
        title: 'Hot Partition in Sharded Database',
        scenario: 'You shard your database by user ID. One celebrity user has 50 million followers. Every time they post, 50 million notification records are written to their shard. That single shard handles 10,000x the write traffic of any other shard. It falls over while all other shards are idle.',
        impact: 'One database shard is the bottleneck for the entire system during high-profile events. Classic hot partition problem.',
        resolution: 'Never shard purely by a single user attribute if some users are orders of magnitude more active. Use consistent hashing with virtual nodes to distribute hot data. For celebrity accounts use a different write strategy (fan-out-on-read instead of fan-out-on-write). Add shard rebalancing.',
        animationSteps: [
          { label: 'Celebrity posts', description: 'One user with 50M followers creates a post', highlight: false },
          { label: 'All to one shard', description: '50M writes routed to a single shard', highlight: true },
          { label: 'Hot shard crashes', description: 'That shard at 100% - other shards idle', highlight: true },
          { label: 'Entire system slow', description: 'Writes blocked waiting for overloaded shard', highlight: false },
          { label: 'Fix: virtual nodes', description: 'Consistent hashing distributes hot data evenly', highlight: false },
        ],
      },
      {
        title: 'Memory Leak Under Sustained High Load',
        scenario: 'Your application handles a traffic spike successfully. But 6 hours into sustained high load, memory usage on every app server has climbed from 400MB to 3.5GB. The OS starts swapping. Response times climb. Servers start crashing and restarting one by one, concentrating load on the remaining healthy servers, which then also crash.',
        impact: 'Cascading server crash loop under the exact load conditions you scaled for. System recovers only when traffic drops.',
        resolution: 'Profile memory under sustained load in staging before deploying. Set memory limits and auto-restart policies. Use memory alerting at 70% and 85%. Fix the root cause - common culprits are unbounded in-memory caches, event listeners not removed, and closures holding large objects.',
        animationSteps: [
          { label: 'High load starts', description: 'Traffic spike begins, servers handle it fine', highlight: false },
          { label: 'Memory climbs', description: 'Each request leaks a small amount', highlight: true },
          { label: '6 hours later', description: 'Memory at 3.5GB, OS swapping to disk', highlight: true },
          { label: 'Cascading crash', description: 'Servers crash one by one, load concentrates', highlight: true },
          { label: 'Fix', description: 'Profile under load, fix leaks, set memory limits', highlight: false },
        ],
      },
      {
        title: 'Stateful Sessions Break After Horizontal Scale',
        scenario: 'Your app stores user sessions in server memory. It works fine on one server. You add two more servers behind a load balancer. Users start reporting being randomly logged out. The load balancer is routing them to different servers, each of which has no knowledge of sessions created on the others.',
        impact: 'Users logged out at random. Users mid-checkout lose their cart. Trust in the application damaged.',
        resolution: 'Move session storage to Redis immediately. All servers read and write sessions to the same Redis instance. Sessions survive any server restart or failure. This is a prerequisite for horizontal scaling - never store user state in application memory.',
        animationSteps: [
          { label: 'Login on Server 1', description: 'Session stored in Server 1 memory', highlight: false },
          { label: 'Next request', description: 'Load balancer routes to Server 2', highlight: true },
          { label: 'Session missing', description: 'Server 2 has no record of this session', highlight: true },
          { label: 'User logged out', description: 'Unexpected logout - user confused and frustrated', highlight: false },
          { label: 'Fix: Redis sessions', description: 'All servers share sessions via Redis', highlight: false },
        ],
      },
    ],
  },

  // ── 11. Interview Questions ───────────────────────────────────────────────
  {
    order: 11, type: 'interview', title: 'Interview Discussion Questions',
    interviewQuestions: [
      {
        question: 'Your web app has one server handling 500 requests per second at 60% CPU. Traffic is expected to 10x in 3 months. Walk me through your scaling plan.',
        answer: 'First, profile the application to find the current bottleneck. If it is the database, add read replicas and Redis cache before touching app servers. For app servers, move to horizontal scaling: make the application stateless (sessions in Redis), add a load balancer, then add more app instances. Set up auto-scaling rules at 60% CPU. Plan for 15-20 servers at 10x traffic. Monitor DB connections per server and add a connection pooler. The plan must address both the app tier and the database tier together.',
        difficulty: 'medium',
      },
      {
        question: 'What is the difference between vertical and horizontal scaling? When would you choose each?',
        answer: 'Vertical: upgrade the machine (more CPU, RAM). Simple, no code changes, but has a hard ceiling and is a single point of failure. Horizontal: add more machines. Scales to any size, provides redundancy, but requires stateless application design. Choose vertical first for simplicity and for stateful components like databases where horizontal scaling is complex. Choose horizontal for application servers, stateless services, and when you need fault tolerance. Most large systems use both.',
        difficulty: 'easy',
      },
      {
        question: 'Design a system that can handle a sudden 100x traffic spike for a Black Friday sale.',
        answer: 'Multi-layered approach: CDN for all static assets (reduces origin load 60-80%). Aggressive caching of product and catalog data in Redis (most browsing is read-only). Auto-scaling with a warm pool of pre-started instances that join in 30 seconds. Queue-based load leveling for checkout - put checkout requests in SQS, process at a controlled rate. Rate limiting per user per minute. Pre-scale to 3x normal capacity the night before based on traffic predictions. Disable non-critical features (recommendations, personalisation) under high load. Load test in staging first.',
        difficulty: 'hard',
      },
      {
        question: 'Your application is slow. How do you identify and fix the bottleneck?',
        answer: 'Start by measuring, not guessing. Add distributed tracing (Jaeger or DataDog) to see where time is spent per request. In 80% of cases the bottleneck is the database. Check slow query logs, look for N+1 queries, missing indexes, and lock contention. Fix the database first. If the app code is the bottleneck, profile with a CPU profiler to find the hot path. Use async processing to move slow work off the critical path. Add caching for expensive repeated operations. Never optimise code without a profiler - it is always slower than the data suggests.',
        difficulty: 'medium',
      },
      {
        question: 'What is an N+1 query problem and how do you fix it?',
        answer: 'N+1 happens when you fetch N items and then make one additional database query per item. Example: fetch 100 posts (1 query), then fetch the author for each post (100 queries) = 101 queries total. Fix: use a JOIN or an IN clause to fetch all authors in a single query. In ORMs this is done with eager loading. N+1 is the most common database performance problem and can turn a page that should take 5ms into one that takes 5 seconds.',
        difficulty: 'medium',
      },
      {
        question: 'How does consistent hashing work and why is it used in distributed systems?',
        answer: 'Consistent hashing maps both servers and data keys onto a circular ring. Each key is stored on the first server clockwise from its position on the ring. When a server is added or removed, only the keys immediately counter-clockwise of that server need to move - roughly 1/N of all keys. Compare this to naive modulo hashing where adding one server remaps nearly all keys (catastrophic for a cache). Consistent hashing is used in Redis Cluster, Cassandra, and distributed caches to minimise cache misses and data movement during scaling events.',
        difficulty: 'hard',
      },
      {
        question: 'How would you do capacity planning for a new feature that will send push notifications to all active users?',
        answer: 'Start with estimates: 10M active users, each needs one notification = 10M deliveries. A single notification service handles 10,000 per second = 1,000 seconds = 16 minutes for one batch. That may be acceptable. For infrastructure: do not send 10M notifications synchronously. Use Kafka partitioned by user region. Deploy 100 worker instances each processing their partition. Include buffer for retries (failed deliveries retry 3x). Account for push provider rate limits (Apple and Google throttle). Calculate storage for tracking delivery status: 10M records x 100 bytes = 1GB, easily handled by a single database with an index on user_id.',
        difficulty: 'hard',
      },
      {
        question: 'Why is stateless application design essential for horizontal scaling?',
        answer: 'Stateless means any server can handle any request. If Server 1 stores a user session in memory and the load balancer sends the next request to Server 2, Server 2 has no session data and the user appears logged out. Stateless design solves this by storing all state externally: sessions in Redis, user data in the database, files in S3. With no server holding unique state, servers become identical and interchangeable. You can add or remove any of them at any time without affecting users. This is the single most important design requirement for horizontal scaling.',
        difficulty: 'medium',
      },
    ],
  },

  // ── 12. Quiz ─────────────────────────────────────────────────────────────
  {
    order: 12, type: 'quiz', title: 'Scalability Quiz',
    quizConfig: {
      timeLimitSeconds: 600, maxAttempts: 3, passingPercent: 70,
      questions: [
        {
          question: 'Your single app server is at 85% CPU. Traffic is growing 20% per month. What is the FIRST thing you should do?',
          options: ['Immediately add 10 more servers', 'Profile to find the bottleneck before scaling', 'Switch to a NoSQL database', 'Increase server RAM'],
          correctIndex: 1, scenario: true,
          explanation: 'Always profile first. 85% CPU could be caused by an inefficient database query, a missing cache, or an N+1 problem. Fixing the bottleneck might reduce CPU to 30% with no new servers. Scaling without profiling means scaling the wrong thing.',
        },
        {
          question: 'You add 10 more app servers to handle load. Response times get worse. What most likely happened?',
          options: ['Load balancer is misconfigured', 'The database became the bottleneck', 'Too many servers confuses the network', 'Auto-scaling is not working correctly'],
          correctIndex: 1, scenario: true,
          explanation: 'Classic mistake: scaling app servers without scaling the database. 10 servers each making DB connections overwhelmed a database sized for 1 server. Always scale the full stack together - app servers, database connections, and database read capacity.',
        },
        {
          question: 'A user logs in on Server 1. Their next request goes to Server 2. They are suddenly logged out. What is the cause?',
          options: ['JWT token expired', 'Load balancer bug', 'Session stored in Server 1 memory - Server 2 has no access', 'Database replication lag'],
          correctIndex: 2, scenario: true,
          explanation: 'Stateful session storage. Sessions in application memory do not survive a different server handling the next request. Fix: move sessions to Redis. All servers share the same Redis instance, so any server can read any session.',
        },
        {
          question: 'Traffic normally averages 1,000 QPS. On Black Friday it peaks at 15,000 QPS. Your auto-scaler takes 4 minutes to provision servers. What is the best mitigation?',
          options: ['Set auto-scaler threshold to 99% CPU to save money', 'Use a warm pool of pre-started instances', 'Double your normal server count permanently', 'Disable the service during Black Friday'],
          correctIndex: 1, scenario: true,
          explanation: 'Warm pool. Pre-started instances can join the pool in 30 seconds instead of 4 minutes. This bridges the gap between when the spike hits and when full auto-scaling kicks in. Pre-scale manually the night before for known events.',
        },
        {
          question: 'Your system has 10M daily active users, each making 5 requests per day. What is the average requests per second?',
          options: ['50 RPS', '578 RPS', '5,000 RPS', '50,000 RPS'],
          correctIndex: 1, scenario: false,
          explanation: '10M users x 5 requests = 50M requests per day. 50M / 86,400 seconds = 578 RPS average. Remember to then apply a peak factor (3-5x) for provisioning: plan for 1,700-2,900 RPS to handle peak hours safely.',
        },
        {
          question: 'When should you use database sharding?',
          options: ['As soon as you have more than 1 million users', 'Only after read replicas and caching are not sufficient', 'Before adding any read replicas', 'Whenever you use a NoSQL database'],
          correctIndex: 1, scenario: false,
          explanation: 'Sharding is complex - it makes cross-shard queries hard and rebalancing painful. Use it only as a last resort. The order should be: add cache first, add read replicas second, shard only when those are not enough. Many large systems (including Stack Overflow) never need sharding.',
        },
        {
          question: 'A new server is added to handle load but traffic is not distributed to it. What is the likely cause?',
          options: ['The database does not know about the new server', 'The load balancer health check has not yet passed for the new server', 'The CDN is caching the old server list', 'Auto-scaling does not work with horizontal scaling'],
          correctIndex: 1, scenario: true,
          explanation: 'Health checks. Load balancers only route traffic to servers that are passing health checks. A new server needs time to boot, start the application, and pass several consecutive health checks before receiving traffic. This is by design - it prevents routing requests to servers that are not ready.',
        },
        {
          question: 'You fetch 50 blog posts and then query the database once per post to get the author\'s name. What problem is this?',
          options: ['Cache stampede', 'N+1 query problem', 'Hot partition', 'Connection pool exhaustion'],
          correctIndex: 1, scenario: true,
          explanation: 'N+1 problem. 1 query to get 50 posts + 50 queries for 50 authors = 51 queries. Fix: JOIN the authors table in the original query or use an IN clause to fetch all 50 authors in one query. This reduces 51 database round trips to 1.',
        },
        {
          question: 'Consistent hashing is preferred over modulo hashing for distributed caches because:',
          options: ['It is faster to compute', 'Adding/removing a server only remaps ~1/N of keys', 'It guarantees even key distribution', 'It works without a load balancer'],
          correctIndex: 1, scenario: false,
          explanation: 'With modulo hashing, adding 1 server to a 10-server cluster remaps ~90% of all keys - a cache miss tsunami. Consistent hashing maps servers and keys onto a ring, so adding 1 server to 10 only remaps ~10% of keys (1/N). This is critical for cache clusters where a mass remapping means a mass cache miss flood hitting the database.',
        },
        {
          question: 'Which technique converts a sudden traffic spike into a manageable flow of work without rejecting requests?',
          options: ['Rate limiting', 'Queue-based load leveling', 'Read replicas', 'Vertical scaling'],
          correctIndex: 1, scenario: false,
          explanation: 'Queue-based load leveling. Requests go into a queue (SQS, RabbitMQ) and workers drain it at a steady rate. Users wait a bit longer during spikes but get processed eventually instead of receiving an error. Rate limiting rejects excess requests. Read replicas help with DB reads. Vertical scaling is slower to provision.',
        },
      ],
    },
  },
];

module.exports = SCALABILITY_MODULES;
