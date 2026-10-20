// Static System Architecture content - 13 modules total
// Orders 1-10: content topics
// Order 11: Failure Cases
// Order 12: Interview Discussion Questions
// Order 13: Quiz

const SYSTEM_ARCHITECTURE_MODULES = [

  // ── 1. System Architecture Fundamentals ───────────────────────────────────
  {
    order: 1, type: 'content', title: 'System Architecture Fundamentals',
    content: {
      overview: 'When you build a small app, one computer is enough. But when millions of people use it at the same time, you need a plan - a blueprint for how all the pieces fit together. That blueprint is called system architecture.\n\nSystem architecture answers: where does code run, how do parts talk to each other, and what happens when something breaks? Getting this right early saves months of painful rework later.',
      sections: [
        {
          heading: 'What is System Architecture?',
          body: 'System architecture is the high-level structure of a software system. It defines the major components - like servers, databases, caches, and queues - and describes how they connect and communicate. Think of it like the blueprint of a building. Before laying any bricks, you need to know where the walls, doors, and pipes go.',
          code: null,
        },
        {
          heading: 'Why It Matters',
          body: 'A wrong architectural decision early on can cost months to fix later. Good architecture makes a system easy to scale when traffic grows, easy to change when requirements shift, and resilient when parts fail. Bad architecture means every new feature is a battle against the existing structure.',
          code: null,
        },
        {
          heading: 'Key Quality Attributes',
          body: 'Every architectural decision involves tradeoffs between five qualities: Scalability (handles more users), Reliability (stays up when things fail), Maintainability (easy to change), Performance (responds fast), and Security (protects data). No system is perfect at all five - you always choose which ones matter most for your product.',
          code: null,
        },
        {
          heading: 'The CAP Theorem',
          body: 'In a distributed system you can only fully guarantee two of three properties at once: Consistency (every read gets the latest write), Availability (every request gets a response), and Partition Tolerance (system works even if the network splits). Since network failures always happen, real systems choose between being fully consistent or always available during a network problem.',
          code: null,
        },
      ],
      animationSteps: [
        { label: 'Client',        description: 'User makes a request from browser or app',     highlight: false },
        { label: 'Load Balancer', description: 'Distributes traffic across multiple servers',  highlight: true  },
        { label: 'App Server',    description: 'Processes business logic and handles request', highlight: true  },
        { label: 'Cache',         description: 'Returns fast response if data already cached', highlight: false },
        { label: 'Database',      description: 'Persists and retrieves data when needed',      highlight: false },
      ],
      example: 'Instagram started as a single server. As users grew, they added load balancers, then multiple app servers, then caches, then database replicas. Each step was an architectural decision driven by scale. Today Instagram serves over a billion users with a deeply distributed architecture - all built one layer at a time.',
    },
  },

  // ── 2. Architectural Patterns (Layered, SOA, Serverless) ──────────────────
  {
    order: 2, type: 'content', title: 'Architectural Patterns',
    content: {
      overview: 'Over decades of building software, engineers kept solving the same types of problems. They named and documented the solutions - these are called architectural patterns. Instead of reinventing the wheel, you pick the pattern that best fits your problem.\n\nThe three most important patterns to understand are Layered Architecture, Service-Oriented Architecture (SOA), and Serverless.',
      sections: [
        {
          heading: 'Layered Architecture',
          body: 'Code is split into horizontal layers, each with a clear job. The most common split is Presentation (what the user sees), Business Logic (the rules of your app), and Data (storage). Each layer only talks to the layer directly below it. This makes it easy to change one layer without breaking others. Almost every web application uses this pattern as its foundation.',
          code: null,
        },
        {
          heading: 'Service-Oriented Architecture (SOA)',
          body: 'SOA organises a system as a collection of services that communicate over a network. Each service is a self-contained unit that exposes a well-defined interface. Unlike microservices (which are tiny and independently deployed), SOA services tend to be larger and share a common enterprise service bus. SOA is common in large enterprise systems like banks and insurance companies.',
          code: null,
        },
        {
          heading: 'Serverless Architecture',
          body: 'In serverless, you write individual functions and deploy them to a cloud provider. The cloud automatically runs them when triggered (by an HTTP request, a file upload, a timer). You do not manage any servers - the provider handles scaling, availability, and infrastructure. You pay only for each function execution. AWS Lambda, Google Cloud Functions, and Vercel Functions are examples.',
          code: null,
        },
        {
          heading: 'Choosing the Right Pattern',
          body: 'Layered is the simplest starting point for most apps. SOA suits large enterprises that need to integrate many existing systems over a shared bus. Serverless is best for event-driven workloads, unpredictable traffic spikes, or tasks that run infrequently. Most real systems combine patterns - a layered monolith with some serverless functions for background jobs is completely normal.',
          code: null,
        },
      ],
      animationSteps: [
        { label: 'Presentation', description: 'UI layer - handles what users see and click',       highlight: false },
        { label: 'API Layer',    description: 'Routes and validates incoming requests',             highlight: true  },
        { label: 'Business',     description: 'Applies rules, orchestrates services',              highlight: true  },
        { label: 'Data Access',  description: 'Translates between objects and database queries',   highlight: false },
        { label: 'Database',     description: 'Stores data persistently',                          highlight: false },
      ],
      example: 'Spotify uses a layered architecture for its core app, SOA-style services for its internal platform teams, and serverless functions for lightweight background jobs like sending push notifications. Most large companies blend all three patterns rather than using just one.',
    },
  },

  // ── 3. Monolithic Architecture ─────────────────────────────────────────────
  {
    order: 3, type: 'content', title: 'Monolithic Architecture',
    content: {
      overview: 'A monolith is the simplest architecture: everything lives in one codebase, one deployable unit, one database. You build it, test it, and deploy it as a single thing. This is how almost every successful product starts - and for good reason.\n\nUnderstanding monoliths deeply is important because most systems begin as one, and knowing when to move away from it is one of the most consequential architectural decisions you will make.',
      sections: [
        {
          heading: 'What a Monolith Is',
          body: 'In a monolithic application, all features - user management, payments, notifications, search - live in the same codebase and run as one process. When you deploy, you deploy everything at once. The whole application shares one database. There is no network between components - function calls are direct and fast.',
          code: null,
        },
        {
          heading: 'Why Monoliths Are a Good Starting Point',
          body: 'Monoliths are simple to develop, test, and deploy. There is no distributed system complexity - no network calls between services, no service discovery, no distributed tracing. A small team can move very fast. Many hugely successful products - Stack Overflow, Shopify, GitHub - ran as monoliths for years and some still do.',
          code: null,
        },
        {
          heading: 'When Monoliths Become Painful',
          body: 'As the team grows, problems emerge. Everyone edits the same codebase - a change by one team can break another team\'s feature. Build and deployment times grow to 30-40 minutes. One bug in any part of the system can take down the whole application. Scaling requires copying the entire application even if only one feature needs more resources.',
          code: null,
        },
        {
          heading: 'The Strangler Fig Pattern',
          body: 'When a monolith becomes painful, do not rewrite everything at once - that is extremely risky. Instead use the Strangler Fig pattern: gradually extract individual features into separate services while the monolith continues running. Route traffic to new services one feature at a time. The monolith shrinks over months until it is gone. Amazon and Netflix both used this approach.',
          code: null,
        },
      ],
      animationSteps: [
        { label: 'Monolith',    description: 'All features in one single deployable codebase',    highlight: false },
        { label: 'Team grows',  description: 'Multiple teams editing the same code',              highlight: true  },
        { label: 'Slow deploy', description: 'Full rebuild required for any small change',        highlight: true  },
        { label: 'Extract',     description: 'One service extracted behind an API boundary',      highlight: false },
        { label: 'Strangled',   description: 'Monolith gradually replaced - no big-bang rewrite', highlight: false },
      ],
      example: 'Amazon started as a monolith in 1995. By 2002, Jeff Bezos issued a famous mandate: all teams must expose functionality via service APIs with no exceptions. That memo began Amazon\'s decomposition - and the internal infrastructure they built eventually became AWS.',
    },
  },

  // ── 4. Client-Server Architecture ─────────────────────────────────────────
  {
    order: 4, type: 'content', title: 'Client-Server Architecture',
    content: {
      overview: 'The client-server model is the most fundamental pattern on the internet. A client (browser, mobile app, desktop app) makes a request. A server receives it, processes it, and sends back a response. Everything on the web follows this pattern.\n\nUnderstanding how clients and servers are structured, and the different ways they can be organised, is the foundation for all web system design.',
      sections: [
        {
          heading: 'How It Works',
          body: 'The client holds the user interface and sends requests. The server holds the business logic and data, and responds to requests. The separation is clean: the server does not care whether a web browser, mobile app, or command-line tool is making the request - it just processes the input and returns output. This allows multiple client types to share a single backend.',
          code: null,
        },
        {
          heading: '2-Tier vs 3-Tier Architecture',
          body: 'In 2-tier architecture, the client talks directly to the database - common in simple desktop apps. In 3-tier architecture, there is a middle application server between client and database. The client talks to the app server; the app server talks to the database. This separation allows the business logic to be changed without touching the client, and the database to be changed without touching the client.',
          code: null,
        },
        {
          heading: 'Thin Client vs Thick Client',
          body: 'A thin client does minimal work - it just displays data received from the server. A thick (fat) client does significant processing locally. Traditional web apps (server-rendered HTML) are thin clients. Modern Single Page Applications (React, Vue, Angular) are thick clients - they fetch data as JSON and render it themselves. Thick clients are faster for users but more complex to build.',
          code: null,
        },
        {
          heading: 'Stateless Servers',
          body: 'Servers should be stateless - each request must contain all the information needed to process it. The server does not remember previous requests. User state (who is logged in) is stored in tokens sent with each request (like JWT), not on the server. Stateless servers can be scaled horizontally without problems - any server can handle any request.',
          code: null,
        },
      ],
      animationSteps: [
        { label: 'Client',      description: 'Browser or app sends HTTP request',             highlight: false },
        { label: 'Request',     description: 'Request travels over the network to server',    highlight: true  },
        { label: 'App Server',  description: 'Server processes logic and queries database',   highlight: true  },
        { label: 'Database',    description: 'Database returns requested data',               highlight: false },
        { label: 'Response',    description: 'Server sends response back to client',          highlight: false },
      ],
      example: 'When you open Twitter, your browser (client) sends a request to Twitter\'s servers. The server checks your JWT token, fetches your timeline from the database, and returns JSON. Your browser renders it. The server itself holds no memory of you - all your state is in the token you send with every request.',
    },
  },

  // ── 5. System Components and Interaction ──────────────────────────────────
  {
    order: 5, type: 'content', title: 'System Components and Interaction',
    content: {
      overview: 'A real production system is not just code and a database. It is built from many specialised components, each doing one specific job. A load balancer routes traffic. A cache serves hot data fast. A message queue handles async work. A CDN delivers static files globally.\n\nKnowing what each component does and when to use it is what separates a junior engineer from a senior one in system design interviews.',
      sections: [
        {
          heading: 'Load Balancer',
          body: 'A load balancer sits in front of your servers and distributes incoming requests across them. If one server goes down, the load balancer stops sending traffic to it automatically. It also prevents one server from being overwhelmed while others are idle. NGINX, AWS Application Load Balancer, and HAProxy are common examples.',
          code: null,
        },
        {
          heading: 'Cache',
          body: 'A cache stores copies of frequently accessed data in fast memory (RAM). Instead of querying the database on every request, the application checks the cache first. A cache hit returns data in under 1 millisecond. A cache miss falls back to the database. Redis is the most widely used cache in production systems.',
          code: null,
        },
        {
          heading: 'Message Queue',
          body: 'A message queue lets services communicate asynchronously. Service A puts a message in the queue and immediately continues. Service B picks it up when ready. If B is slow or down, messages wait safely in the queue - nothing is lost. This decouples services completely. RabbitMQ and Kafka are the most popular choices.',
          code: null,
        },
        {
          heading: 'CDN (Content Delivery Network)',
          body: 'A CDN caches static files (images, videos, JS, CSS) at servers around the world. Instead of a user in Mumbai fetching a video from a server in the US, they get it from a nearby CDN server in Mumbai. This dramatically reduces latency. Cloudflare, AWS CloudFront, and Akamai are major CDN providers.',
          code: null,
        },
      ],
      animationSteps: [
        { label: 'Request',       description: 'Client request hits the load balancer',         highlight: false },
        { label: 'Load Balancer', description: 'Routes request to least busy app server',       highlight: true  },
        { label: 'Cache check',   description: 'App checks Redis before hitting the database',  highlight: true  },
        { label: 'Queue',         description: 'Async jobs pushed to message queue',            highlight: false },
        { label: 'Worker',        description: 'Background worker processes queue jobs',        highlight: false },
      ],
      example: 'When you upload a photo to Instagram, the load balancer routes your request to an available server. The server checks cache for your profile data, stores the photo to object storage, then pushes a message to a queue. A background worker picks it up and generates multiple sizes of the photo - without making you wait.',
    },
  },

  // ── 6. Service Communication (REST, gRPC, WebSockets) ─────────────────────
  {
    order: 6, type: 'content', title: 'Service Communication',
    content: {
      overview: 'Once a system is split into multiple services, they need to talk to each other. The way services communicate has a huge impact on performance, reliability, and developer experience.\n\nThe three most important communication protocols to know are REST (the most common), gRPC (fast and type-safe for internal services), and WebSockets (real-time bidirectional communication).',
      sections: [
        {
          heading: 'REST (Representational State Transfer)',
          body: 'REST is the most widely used API style. It uses standard HTTP methods: GET to read, POST to create, PUT to update, DELETE to remove. Data is usually sent as JSON. REST is stateless - every request contains all needed information. It is simple, well-understood, and works with every programming language and tool. The downside is it can be verbose and slower than binary protocols.',
          code: null,
        },
        {
          heading: 'gRPC',
          body: 'gRPC is a high-performance communication framework developed by Google. Instead of JSON over HTTP, it uses Protocol Buffers (a compact binary format) over HTTP/2. It is typically 5-10x faster than REST for internal service-to-service calls. It generates type-safe client code automatically from a schema definition. It is ideal for internal microservice communication where performance matters.',
          code: null,
        },
        {
          heading: 'WebSockets',
          body: 'HTTP is request-response - the client asks, the server answers. But what if the server needs to push data to the client without being asked? WebSockets create a persistent two-way connection. Once established, either side can send messages at any time. This is essential for real-time features: chat, live notifications, collaborative editing, live sports scores.',
          code: null,
        },
        {
          heading: 'Synchronous vs Asynchronous',
          body: 'REST and gRPC are synchronous - the caller waits for a response. This is simple but means the caller is blocked. Message queues are asynchronous - fire and forget. Use synchronous for user-facing reads that need an immediate response (fetch a product page). Use asynchronous for background work that does not need an instant answer (send a welcome email, process a payment notification).',
          code: null,
        },
      ],
      animationSteps: [
        { label: 'REST call',   description: 'Client sends HTTP GET /users/123',              highlight: false },
        { label: 'JSON back',   description: 'Server responds with JSON in ~50ms',            highlight: true  },
        { label: 'gRPC call',   description: 'Service A calls Service B via Protobuf/HTTP2',  highlight: true  },
        { label: 'Binary back', description: 'Service B responds in ~5ms (10x faster)',       highlight: false },
        { label: 'WebSocket',   description: 'Server pushes live update without client asking', highlight: false },
      ],
      example: 'Slack uses REST for most API calls (fetching messages, channel lists). It uses WebSockets to push new messages to you in real time without polling. Internally, its backend microservices communicate via gRPC for low-latency calls. All three protocols in one product.',
    },
  },

  // ── 7. Architecture Design Principles ─────────────────────────────────────
  {
    order: 7, type: 'content', title: 'Architecture Design Principles',
    content: {
      overview: 'Good architecture is not just about picking the right database or framework. It is guided by a set of principles that have proven themselves over decades of software engineering. These principles help you write code that is easier to understand, change, and test.\n\nThe most important ones to know are Separation of Concerns, Modularity, and the SOLID principles.',
      sections: [
        {
          heading: 'Separation of Concerns',
          body: 'Each part of your system should have one clearly defined responsibility and should not mix concerns. The code that handles HTTP routing should not also contain database queries. The code that validates user input should not also send emails. When concerns are mixed, a change in one area unexpectedly breaks something in another. Keeping them separate makes each part easier to understand and change independently.',
          code: null,
        },
        {
          heading: 'Modularity',
          body: 'A modular system is split into independent pieces that can be developed, tested, and deployed separately. A change to one module should not require changes to others. Modules communicate through well-defined interfaces - they do not need to know how each other is implemented internally. This allows large teams to work in parallel without stepping on each other.',
          code: null,
        },
        {
          heading: 'SOLID Principles (Overview)',
          body: 'SOLID is five object-oriented design principles: Single Responsibility (a class has one reason to change), Open/Closed (open to extension, closed to modification), Liskov Substitution (subclasses can replace their parent), Interface Segregation (small specific interfaces over large general ones), Dependency Inversion (depend on abstractions, not concrete implementations). Together they produce code that is flexible and testable.',
          code: null,
        },
        {
          heading: 'DRY, KISS, and YAGNI',
          body: 'Three more principles every engineer should know. DRY (Do Not Repeat Yourself): every piece of logic should have one place in the codebase. KISS (Keep It Simple, Stupid): always prefer the simpler solution. YAGNI (You Are Not Going to Need It): do not build features or abstractions until you actually need them. Over-engineering before you understand the problem is one of the most common and costly mistakes.',
          code: null,
        },
      ],
      animationSteps: [
        { label: 'UI Module',     description: 'Handles only display and user interaction',          highlight: false },
        { label: 'API Module',    description: 'Handles only request routing and validation',        highlight: true  },
        { label: 'Service Layer', description: 'Handles only business logic and rules',              highlight: true  },
        { label: 'Data Module',   description: 'Handles only database access',                      highlight: false },
        { label: 'Interface',     description: 'Modules talk via contracts, not implementation',     highlight: false },
      ],
      example: 'Google\'s internal codebase has hundreds of millions of lines of code maintained by tens of thousands of engineers. The only reason this is possible is strict separation of concerns and modularity. Each team owns clearly defined modules with documented interfaces. Without these principles, the codebase would be unmaintainable at that scale.',
    },
  },

  // ── 8. Architecture Decision-Making and Trade-offs ─────────────────────────
  {
    order: 8, type: 'content', title: 'Architecture Decision-Making',
    content: {
      overview: 'There is no perfect architecture. Every decision you make - which database to use, how services communicate, where to put caches - involves giving something up to gain something else. This is called a trade-off.\n\nSenior engineers are not defined by knowing all the answers. They are defined by knowing the right questions to ask, understanding the trade-offs, and making defensible decisions for their specific context.',
      sections: [
        {
          heading: 'The Trade-off Triangle',
          body: 'The three things every system wants - fast, cheap, and reliable - cannot all be maximised at once. A fast, reliable system costs more money (more servers, more redundancy). A fast, cheap system cuts corners on reliability. A cheap, reliable system may be slower. Architecture is about deciding which two matter most for your specific product and accepting the third as a constraint.',
          code: null,
        },
        {
          heading: 'SQL vs NoSQL',
          body: 'SQL databases (PostgreSQL, MySQL) store structured data with relationships. They guarantee ACID transactions and support complex queries. Use SQL when data integrity and complex querying matter - financial records, user accounts. NoSQL databases (MongoDB, Cassandra, DynamoDB) store flexible or unstructured data and scale horizontally more easily. Use NoSQL for massive scale, flexible schemas, or simple key-value access patterns.',
          code: null,
        },
        {
          heading: 'Consistency vs Availability',
          body: 'In a distributed system, when a network failure occurs, you must choose: should the system refuse requests until it can guarantee consistent data (CP), or should it serve potentially stale data to stay available (AP)? Banking apps choose consistency - stale balance data causes real harm. Social media apps choose availability - seeing a like count that is 2 seconds out of date is fine.',
          code: null,
        },
        {
          heading: 'Architecture Decision Records (ADRs)',
          body: 'When you make an important architectural decision, document it. An ADR is a short document recording: what decision was made, why, what alternatives were considered, and what trade-offs were accepted. This is invaluable when the team changes, when conditions change, or when someone asks six months later why you did it that way. Good teams treat ADRs as part of their codebase.',
          code: null,
        },
      ],
      animationSteps: [
        { label: 'Requirement',   description: 'New requirement: store 1 billion user events/day',  highlight: false },
        { label: 'Option A',      description: 'PostgreSQL: strong consistency, complex to shard',  highlight: true  },
        { label: 'Option B',      description: 'Cassandra: scales easily, eventual consistency',    highlight: true  },
        { label: 'Trade-off',     description: 'Choose based on: read vs write pattern, team skill', highlight: false },
        { label: 'ADR written',   description: 'Decision documented with rationale for future team', highlight: false },
      ],
      example: 'When Netflix moved to the cloud in 2008, they had to choose between building their own infrastructure or using AWS. They chose AWS - giving up control and paying cloud prices to gain speed of deployment and global scale. That trade-off decision, documented and deliberate, shaped the entire company\'s future.',
    },
  },

  // ── 9. Reliability and Fault-Tolerant Architecture ────────────────────────
  {
    order: 9, type: 'content', title: 'Reliability and Fault-Tolerant Architecture',
    content: {
      overview: 'Every system will have failures. Servers crash, networks go down, disks fail, software has bugs. Reliability engineering is about designing your system so that when individual parts fail, the overall system keeps working for users.\n\nHigh availability is measured as a percentage of uptime. 99.9% means about 9 hours of downtime per year. 99.99% means 52 minutes. 99.999% means just 5 minutes.',
      sections: [
        {
          heading: 'Redundancy',
          body: 'The foundation of fault tolerance is having multiple copies of every critical component. Two load balancers so if one dies the other takes over. Three database replicas so if one fails two remain. Multiple availability zones so a data center fire does not bring down the system. Redundancy costs more but is the only reliable way to handle hardware failures that will inevitably happen.',
          code: null,
        },
        {
          heading: 'Circuit Breaker Pattern',
          body: 'Without a circuit breaker, if Service B goes down and Service A keeps calling it, every request to A fails slowly while waiting for B to time out. This cascades - A gets overwhelmed and goes down too. A circuit breaker monitors call failures. After 5 failures in a row it "opens" - immediately returning an error without actually calling B. After 30 seconds it tries one request. If successful it closes again.',
          code: null,
        },
        {
          heading: 'Health Checks and Failover',
          body: 'Load balancers continuously ping each server with health check requests every 5-10 seconds. If a server stops responding, the load balancer marks it unhealthy and stops sending traffic to it. When it recovers, traffic automatically resumes. This is automatic failover - no human required. The key metric is recovery time: how quickly the system detects a failure and routes around it.',
          code: null,
        },
        {
          heading: 'Graceful Degradation',
          body: 'When part of a system fails, it should degrade gracefully rather than fail completely. If the recommendation engine is down, Amazon still shows the product page - just without personalised recommendations. If the payment service is slow, show a loading state. Plan explicitly for partial failures and define the degraded user experience for each scenario. This is called a fallback.',
          code: null,
        },
      ],
      animationSteps: [
        { label: 'Server fails',  description: 'Primary server becomes unresponsive',          highlight: true  },
        { label: 'Health check',  description: 'Load balancer detects failure within seconds', highlight: true  },
        { label: 'Rerouted',      description: 'All traffic moved to healthy servers',         highlight: false },
        { label: 'Circuit open',  description: 'Circuit breaker stops calls to failed service', highlight: false },
        { label: 'Recovery',      description: 'Failed server restarts and rejoins the pool',  highlight: false },
      ],
      example: 'AWS S3 achieves 99.999999999% (11 nines) durability by storing every object across at least three availability zones. Netflix runs Chaos Monkey - a tool that randomly kills production servers - to continuously verify that their system handles failures gracefully. If it cannot survive Chaos Monkey, it will not survive real outages.',
    },
  },

  // ── 10. HLD Design Process and Architecture Diagrams ──────────────────────
  {
    order: 10, type: 'content', title: 'HLD Design Process and Architecture Diagrams',
    content: {
      overview: 'High Level Design (HLD) is the process of defining the overall structure of a system before writing any code. It answers: what are the major components, how do they interact, and how will the system meet its requirements at scale?\n\nIn system design interviews, this is exactly what you are expected to do. Having a structured process - rather than randomly drawing boxes - is what separates a strong answer from a weak one.',
      sections: [
        {
          heading: 'Step 1: Clarify Requirements',
          body: 'Before designing anything, ask clarifying questions. What is the scale - 1,000 users or 1 billion? What are the read vs write patterns? What are the latency requirements? What needs to be consistent vs eventually consistent? Do not design a system until you understand what problem you are actually solving. In an interview, spending 5 minutes here saves 30 minutes of redesigning.',
          code: null,
        },
        {
          heading: 'Step 2: Estimate Scale',
          body: 'Back-of-envelope calculations establish whether a single server is enough or if you need distributed systems. If the system needs to store 100 TB of data, a single disk is not enough. If it needs to handle 100,000 requests per second, a single server is not enough. These calculations justify your architectural decisions and show interviewers you think quantitatively.',
          code: null,
        },
        {
          heading: 'Step 3: Define the High-Level Components',
          body: 'Draw the major boxes: clients, load balancers, application servers, caches, databases, message queues, CDN. Label the connections between them with the protocol used (REST, gRPC, WebSocket). At this stage do not go deep into any single component - get the whole picture down first. This bird\'s-eye view is the HLD diagram.',
          code: null,
        },
        {
          heading: 'Step 4: Deep Dive on Critical Components',
          body: 'After the high-level diagram, zoom into the components that matter most for this specific system. For a URL shortener, that is the hashing algorithm and database schema. For a chat app, it is the WebSocket handling and message fan-out. For a video streaming service, it is the CDN and adaptive bitrate streaming. Choose the deep dives that demonstrate you understand the core challenges.',
          code: null,
        },
      ],
      animationSteps: [
        { label: 'Requirements',  description: 'Clarify scale, patterns, constraints',         highlight: false },
        { label: 'Estimate',      description: 'QPS, storage, bandwidth calculations',         highlight: true  },
        { label: 'HLD Diagram',   description: 'Draw major components and connections',        highlight: true  },
        { label: 'Deep Dive',     description: 'Zoom into the critical component',             highlight: false },
        { label: 'Trade-offs',    description: 'Explain decisions and alternatives considered', highlight: false },
      ],
      example: 'In a Google system design interview, a candidate who immediately starts drawing components without asking questions will score poorly. The strongest candidates spend the first 5 minutes asking: how many daily active users, what is the read-to-write ratio, what is the acceptable latency, does this need global availability? The design that follows those questions is always better.',
    },
  },

  // ── 11. Failure Cases ─────────────────────────────────────────────────────
  {
    order: 11, type: 'failureCases', title: 'Failure Cases',
    failureCases: [
      {
        title: 'Cascading Service Failure',
        scenario: 'Service A calls Service B which calls Service C. Service C is slow due to a database issue. Service B threads pile up waiting for C. Service A threads pile up waiting for B. Within 60 seconds the entire system is unresponsive - brought down by one slow database query.',
        impact: 'Total system outage from a single slow dependency. All three services crash even though only C had the original problem. Users see complete downtime.',
        resolution: 'Implement circuit breakers between every service pair. Set aggressive timeouts (500ms max). Use the bulkhead pattern to isolate thread pools so B\'s slowness cannot consume all of A\'s threads.',
        animationSteps: [
          { label: 'C slows',      description: 'Service C database query takes 30 seconds',     highlight: true  },
          { label: 'B fills up',   description: 'Service B threads all waiting for C',           highlight: true  },
          { label: 'A fills up',   description: 'Service A threads all waiting for B',           highlight: true  },
          { label: 'Outage',       description: 'All three services unresponsive',               highlight: false },
          { label: 'Fix',          description: 'Circuit breaker opens - stops cascade',         highlight: false },
        ],
      },
      {
        title: 'Split-Brain in Distributed Database',
        scenario: 'A network partition splits a 2-node database cluster. Both nodes believe the other is dead. Both promote themselves to primary. Users on each side write to different primaries. When the network heals, the two primaries have conflicting data.',
        impact: 'Data corruption and loss. Orders placed during the partition may be duplicated or lost. User records on the two sides have diverged and must be manually reconciled.',
        resolution: 'Always run an odd number of nodes (3 minimum) so a quorum majority can be established. Use Raft or Paxos consensus - only one partition can have the majority and therefore only one can elect a primary.',
        animationSteps: [
          { label: 'Split',        description: 'Network partition divides cluster in two',      highlight: true  },
          { label: 'Two primaries', description: 'Each node promotes itself to primary',        highlight: true  },
          { label: 'Conflict',     description: 'Both primaries accept writes independently',   highlight: true  },
          { label: 'Heals',        description: 'Network reconnects - conflicting data found',  highlight: false },
          { label: 'Fix',          description: 'Quorum writes require majority - one wins',    highlight: false },
        ],
      },
      {
        title: 'Thundering Herd on Service Restart',
        scenario: 'A popular service crashes and restarts. All 50,000 clients detect the reconnect simultaneously and retry at the same millisecond. The service starts up but is immediately overwhelmed by the flood of connections and crashes again.',
        impact: 'Crash loop - the service cannot stay up long enough to recover. The more clients it has, the faster it crashes after each restart.',
        resolution: 'Implement exponential backoff with jitter on all client retry logic. Clients wait random(0,1s), then random(0,2s), then random(0,4s). This spreads reconnections across seconds instead of milliseconds.',
        animationSteps: [
          { label: 'Restart',      description: 'Service comes back online after crash',        highlight: false },
          { label: '50K retry',    description: 'All clients reconnect at the same moment',     highlight: true  },
          { label: 'Overload',     description: 'Service overwhelmed and crashes again',        highlight: true  },
          { label: 'Fix',          description: 'Clients use exponential backoff with jitter',  highlight: false },
          { label: 'Smooth',       description: 'Reconnections spread over 30 seconds',        highlight: false },
        ],
      },
      {
        title: 'Database Connection Pool Exhaustion',
        scenario: 'Traffic spikes 10x. Each request needs a database connection. The pool holds 100 connections. 1,000 concurrent requests arrive. 900 queue and wait. Latency climbs to 30 seconds. Users see timeouts and blank pages.',
        impact: 'Application appears unresponsive. Logs show "connection pool timeout". Restarting helps briefly but the problem returns with the next traffic spike.',
        resolution: 'Size the connection pool correctly (available DB connections / number of app servers). Add a request queue depth limit. Use async database drivers that serve more concurrent queries per connection.',
        animationSteps: [
          { label: 'Spike',        description: '1,000 concurrent requests arrive',             highlight: true  },
          { label: 'Pool full',    description: 'All 100 DB connections are in use',            highlight: true  },
          { label: 'Queue builds', description: '900 requests wait for a connection',           highlight: false },
          { label: 'Timeouts',     description: 'Requests fail after waiting 30 seconds',      highlight: false },
          { label: 'Fix',          description: 'Async drivers and correct pool sizing',        highlight: false },
        ],
      },
      {
        title: 'Memory Leak in Long-Running Service',
        scenario: 'A microservice runs fine for 12 hours. Memory climbs from 200MB to 2GB. The OS starts swapping. The service crashes. It restarts, runs fine for 12 hours, then crashes again in a regular cycle.',
        impact: 'Regular outages every 12 hours. Restarts flush in-memory state causing brief inconsistencies. On-call engineers lose sleep.',
        resolution: 'Take a heap dump when memory is high. Common causes: event listeners never removed, unbounded in-memory caches, closures holding stale references. Fix root cause. Add memory alerts at 70% and 85%. Use PM2 or Kubernetes to auto-restart when memory exceeds a safe limit.',
        animationSteps: [
          { label: 'Starts OK',    description: 'Service starts at 200MB baseline',            highlight: false },
          { label: 'Leak grows',   description: 'Each request leaks a small amount of memory', highlight: true  },
          { label: 'RAM full',     description: 'Memory exhausted after 12 hours',             highlight: true  },
          { label: 'Crash',        description: 'OOM kill - service restarts',                 highlight: false },
          { label: 'Fix',          description: 'Heap profile identifies uncleaned references', highlight: false },
        ],
      },
    ],
  },

  // ── 12. Interview Questions ───────────────────────────────────────────────
  {
    order: 12, type: 'interview', title: 'Interview Discussion Questions',
    interviewQuestions: [
      {
        question: 'Design a URL shortener like bit.ly. It must handle 100 million URLs and 10 billion redirects per month.',
        answer: 'Generate a 7-character short code using base62 encoding of a counter or a hash of the long URL. Store the mapping in a SQL database sharded by short code. Cache the short-to-long mapping in Redis with a long TTL since redirects rarely change. Use consistent hashing so the same short code always hits the same cache shard. The read-to-write ratio is ~100:1 so optimise heavily for reads. CDN for the most popular links.',
        difficulty: 'hard',
      },
      {
        question: 'What is the difference between REST, gRPC, and WebSockets? When would you use each?',
        answer: 'REST: HTTP + JSON, simple and universal, use for public APIs and browser-facing endpoints. gRPC: Protobuf over HTTP/2, 5-10x faster, type-safe, use for internal service-to-service calls. WebSockets: persistent bidirectional connection, use for real-time push features like chat, live notifications, and collaborative tools. Most production systems use all three - REST externally, gRPC internally, WebSockets for real-time features.',
        difficulty: 'medium',
      },
      {
        question: 'Your monolithic application takes 45 minutes to build and deploy. How do you approach breaking it up?',
        answer: 'Use the Strangler Fig pattern - never rewrite everything at once. Identify the bounded contexts: user, order, payment, inventory. Start with the service that is the most painful or most frequently changed. Extract it behind an API boundary while keeping the monolith running. Migrate traffic gradually using feature flags. Accept that the full transition takes 12-18 months for a large system. The goal is continuous improvement, not a big-bang rewrite.',
        difficulty: 'medium',
      },
      {
        question: 'What is the CAP theorem? How does it influence the choice between PostgreSQL and Cassandra?',
        answer: 'CAP: you can only guarantee two of Consistency, Availability, and Partition Tolerance. Since network partitions always happen, the real choice is CP vs AP. PostgreSQL is CP - during a partition it may reject writes to preserve consistency. Cassandra is AP - it stays available and writes succeed, but replicas may diverge temporarily. Choose PostgreSQL for financial data, user accounts, anything where stale reads cause real harm. Choose Cassandra for analytics, activity feeds, time-series data where eventual consistency is acceptable.',
        difficulty: 'medium',
      },
      {
        question: 'You depend on 10 microservices each with 99.9% uptime. What is your overall availability?',
        answer: '99.9% to the power of 10 is approximately 99%. That is 3.6 days of downtime per year from dependencies alone - even if your own service never fails. This is why circuit breakers, timeouts, fallbacks, and graceful degradation are mandatory in microservices. Every additional dependency multiplies your failure risk. Design every external call to have a fallback path.',
        difficulty: 'medium',
      },
      {
        question: 'Explain the SOLID principles. Which do you find most valuable in practice?',
        answer: 'Single Responsibility: one class, one reason to change. Open/Closed: extend via new code, not by modifying existing code. Liskov Substitution: subclasses must be safely replaceable for their parent. Interface Segregation: small focused interfaces over fat general ones. Dependency Inversion: depend on abstractions not implementations. In practice, Single Responsibility and Dependency Inversion have the most impact - SRP prevents god classes, and DI makes code testable by allowing mocked dependencies.',
        difficulty: 'medium',
      },
      {
        question: 'How would you design a system to send 10 million push notifications when a major event happens?',
        answer: 'You cannot send 10 million notifications synchronously - that would take too long. Use a message queue (Kafka). When the event fires, push 10 million messages to the queue partitioned by user region. Have a fleet of worker processes subscribe and send notifications in parallel. Each worker handles a batch of 1,000 users. With 1,000 workers processing in parallel you can send 10 million in under a minute. The queue also provides retry for failed deliveries.',
        difficulty: 'hard',
      },
      {
        question: 'When would you choose eventual consistency over strong consistency?',
        answer: 'Eventual consistency is acceptable when: brief staleness does not harm the user or business (social media likes, view counts, activity feeds), when availability matters more than perfect accuracy (shopping cart availability), or when serving a global audience where strong consistency latency is too high. Strong consistency is required when: financial balances, inventory counts, authentication state, or anything where a stale value causes real harm to the user or business. The decision must be deliberate - never choose eventual consistency by accident.',
        difficulty: 'medium',
      },
    ],
  },

  // ── 13. Quiz ─────────────────────────────────────────────────────────────
  {
    order: 13, type: 'quiz', title: 'System Architecture Quiz',
    quizConfig: {
      timeLimitSeconds: 600, maxAttempts: 3, passingPercent: 70,
      questions: [
        {
          question: 'Your startup has 3 developers and 500 daily users. You are starting to build. Which architecture is the right choice?',
          options: ['Microservices with Kubernetes and service mesh', 'Monolith with a well-structured layered codebase', 'Serverless functions for every feature', 'Event-driven architecture with Kafka'],
          correctIndex: 1, scenario: true,
          explanation: 'Monolith first. At small scale, microservices add massive operational complexity with no benefit. A well-structured monolith is faster to build, easier to debug, and simple to deploy. Move to microservices only when the team size or scale demands it.',
        },
        {
          question: 'Service A depends on Services B, C, D. Service D becomes slow. Within 2 minutes Service A is unresponsive. What pattern prevents this?',
          options: ['Load balancing', 'Circuit breaker with timeout', 'Database replication', 'CDN caching'],
          correctIndex: 1, scenario: true,
          explanation: 'Circuit breaker. After detecting D is consistently slow, it opens the circuit and immediately returns a fallback instead of waiting. This stops D\'s slowness from consuming all of A\'s threads and causing a cascading failure across the system.',
        },
        {
          question: 'You need to send a welcome email when a user signs up. The email service is sometimes slow. What is the best approach?',
          options: ['Call email service synchronously during signup - block until it responds', 'Push email job to a message queue - signup returns immediately', 'Skip the email if the service is slow', 'Retry the email call up to 5 times synchronously'],
          correctIndex: 1, scenario: true,
          explanation: 'Message queue. Signup returns immediately - fast and reliable. The email job sits in the queue and is processed when the email service is ready. This completely decouples the two operations. If the email service is down for an hour, messages accumulate and are processed when it recovers.',
        },
        {
          question: 'In the CAP theorem, which property must every distributed system always guarantee?',
          options: ['Consistency', 'Availability', 'Partition Tolerance', 'Durability'],
          correctIndex: 2, scenario: false,
          explanation: 'Partition Tolerance is mandatory. Network failures always happen in distributed systems - you cannot choose to ignore them. So the real trade-off is between Consistency and Availability during a partition event.',
        },
        {
          question: 'You have a REST API that is called 1 million times per second between two internal services. What is a better protocol choice?',
          options: ['GraphQL', 'gRPC with Protocol Buffers', 'SOAP over HTTP', 'Server-Sent Events'],
          correctIndex: 1, scenario: true,
          explanation: 'gRPC. For high-frequency internal service calls, gRPC over HTTP/2 with Protocol Buffers is 5-10x faster than REST with JSON. It also provides type-safe generated client code. REST is fine for external-facing APIs but gRPC wins for high-throughput internal communication.',
        },
        {
          question: 'A user opens your chat app and a message arrives while they are connected. How does the server deliver it without the client asking?',
          options: ['The client polls every second via REST', 'WebSocket - server pushes message over persistent connection', 'The server sends an email notification', 'Long polling with 30-second timeout'],
          correctIndex: 1, scenario: true,
          explanation: 'WebSocket creates a persistent bidirectional connection. Once established, the server can push messages to the client at any time without the client polling. This is essential for real-time chat, live notifications, and collaborative editing.',
        },
        {
          question: 'Which SOLID principle is violated when a single class handles user authentication, sends emails, and logs to a database?',
          options: ['Open/Closed Principle', 'Single Responsibility Principle', 'Liskov Substitution Principle', 'Interface Segregation Principle'],
          correctIndex: 1, scenario: false,
          explanation: 'Single Responsibility Principle. A class should have only one reason to change. Mixing authentication, email sending, and database logging means a change to any one of those three concerns requires modifying this class - and risks breaking the others.',
        },
        {
          question: 'During a system design interview you are asked to design a video streaming platform. What should you do FIRST?',
          options: ['Draw all the components immediately', 'Clarify requirements: scale, read/write ratio, global vs regional', 'Choose the database first', 'Start with the mobile client design'],
          correctIndex: 1, scenario: true,
          explanation: 'Clarify requirements first. How many daily active users? What bitrates? Is it live streaming or on-demand? Is it global? These answers completely change the architecture. Designing without them wastes time and produces generic answers. Strong candidates spend 5 minutes here before drawing a single box.',
        },
        {
          question: 'Your 2-node database cluster experiences a network partition. What dangerous situation can occur?',
          options: ['Both nodes shut down to prevent data loss', 'Both nodes promote themselves to primary (split-brain)', 'The partition automatically resolves after 30 seconds', 'Writes are queued until the partition heals'],
          correctIndex: 1, scenario: false,
          explanation: 'Split-brain. With 2 nodes and a partition, each thinks the other is dead and promotes itself to primary. Both accept writes, creating conflicting data. Always run 3 or more nodes so one partition can always form a majority quorum.',
        },
        {
          question: 'You are choosing between PostgreSQL and Cassandra for storing user financial transactions. Which do you choose and why?',
          options: ['Cassandra - it scales better horizontally', 'PostgreSQL - ACID transactions guarantee data integrity', 'Either is fine for financial data', 'Cassandra - it has faster writes'],
          correctIndex: 1, scenario: true,
          explanation: 'PostgreSQL. Financial transactions require ACID guarantees - atomicity (all or nothing), consistency (valid state always), isolation (concurrent transactions do not interfere), durability (committed data survives crashes). Cassandra is eventually consistent, which is unacceptable for money - a stale balance read could cause real financial harm.',
        },
      ],
    },
  },
];

module.exports = SYSTEM_ARCHITECTURE_MODULES;
