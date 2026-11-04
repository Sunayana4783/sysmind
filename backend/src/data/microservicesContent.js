// Static Microservices content - 13 modules total
// Orders 1-10: content topics
// Order 11: Failure Cases
// Order 12: Interview Discussion Questions
// Order 13: Quiz

const MICROSERVICES_MODULES = [

  // 1. Microservices Fundamentals
  {
    order: 1, type: 'content', title: 'Microservices Fundamentals',
    content: {
      overview: 'Microservices is an architectural style where a large application is built as a collection of small, independent services. Each service runs in its own process, owns its own data, and communicates with other services over a network.\n\nRather than one big application doing everything, you have many small applications each doing one thing well. A change to the payment service does not require redeploying the user service.',
      sections: [
        { heading: 'What Makes a Microservice?', body: 'A microservice has four defining characteristics. It is independently deployable - you can deploy it without touching other services. It owns its own data - no shared databases between services. It is organised around a business capability - the User Service handles everything about users. It is small enough for one team to fully understand and own.', code: null },
        { heading: 'The Core Benefits', body: 'Independent deployment means teams can release features without coordinating with other teams. Independent scaling means you scale only the services under load. Technology freedom means each service can use the best language and database for its job - Node.js for real-time, Python for ML, PostgreSQL for transactions. Failure isolation means one service crashing does not crash others.', code: null },
        { heading: 'The Real Costs', body: 'Microservices are not free. Every network call between services adds latency and a new failure point. Distributed tracing across 20 services is far harder than reading a single log file. Data consistency across services requires eventual consistency patterns instead of simple transactions. You need container orchestration, service discovery, API gateways, and distributed monitoring.', code: null },
        { heading: 'When Microservices Make Sense', body: 'Microservices make sense when your team has grown large enough that multiple teams fight over the same codebase, different parts of your system have different scaling requirements, or you need independent deployment of features. Do not start with microservices. Start with a monolith, learn your domain boundaries, then extract services when the monolith becomes a genuine constraint.', code: null },
      ],
      animationSteps: [
        { label: 'Monolith',      description: 'One codebase: users, orders, payments, search', highlight: false },
        { label: 'Extract',       description: 'Split into independent service boundaries',      highlight: true  },
        { label: 'User Service',  description: 'Owns user data and authentication logic',       highlight: true  },
        { label: 'Order Service', description: 'Owns order data, independent deployment',       highlight: false },
        { label: 'Scale each',    description: 'Scale only the services that need it',          highlight: false },
      ],
      example: 'Amazon started as a monolith in 1995. By 2002, Jeff Bezos issued the famous API mandate requiring all teams to expose functionality via service APIs. What began as an internal architecture decision eventually became AWS - the infrastructure tools they built to manage their own microservices became products sold to the world.',
    },
  },

  // 2. Monolithic vs Microservices Architecture
  {
    order: 2, type: 'content', title: 'Monolithic vs Microservices',
    content: {
      overview: 'The choice between a monolith and microservices is one of the most consequential architectural decisions you will make. Both approaches work - Netflix runs microservices, Stack Overflow runs a monolith. The right choice depends on your team size, scale, and stage.\n\nUnderstanding the concrete tradeoffs rather than following trends is what makes this decision correctly.',
      sections: [
        { heading: 'The Monolith Advantage', body: 'A monolith is simpler in every dimension. Deploying one application is easier than deploying 50. Debugging a single process is easier than tracing a request across 20 services. Transactions are simple database transactions, not distributed sagas. Testing is a single test suite. For a team of 5-15 engineers, a well-structured monolith is almost always the right choice.', code: null },
        { heading: 'When the Monolith Hurts', body: 'The monolith starts hurting when the team grows large. With 30 engineers all editing the same codebase, merge conflicts multiply. Build and deploy times grow to 40+ minutes. A bug in one part of the system can crash everything. You cannot scale the checkout service independently from the search service. These are real problems, but they require real scale to encounter.', code: null },
        { heading: 'The Microservices Tradeoff', body: 'Microservices solve the monolith problems but create distributed systems problems. Each network call between services is a potential failure point. A request touching 10 services has 10 chances to fail. Data consistency across services requires careful design. Debugging requires distributed tracing tools. You need a service registry, API gateway, circuit breakers, and container orchestration.', code: null },
        { heading: 'The Strangler Fig Migration', body: 'If you decide to migrate from monolith to microservices, use the Strangler Fig pattern. Never do a big-bang rewrite. Instead, gradually route new features to new microservices while the monolith continues running. Identify the bounded context you want to extract, build the new service, route traffic to it, verify it works, then remove that code from the monolith. One service at a time over months or years.', code: null },
      ],
      animationSteps: [
        { label: 'Monolith',      description: 'One deployable: all features together',         highlight: false },
        { label: 'Pain point',    description: 'Large team: merge conflicts, slow deploys',     highlight: true  },
        { label: 'Strangler Fig', description: 'Extract one service at a time gradually',       highlight: true  },
        { label: 'API Gateway',   description: 'Routes traffic to monolith and new services',  highlight: false },
        { label: 'Over time',     description: 'Monolith shrinks as services take over',        highlight: false },
      ],
      example: 'Shopify ran as a Ruby on Rails monolith for over a decade with billions of dollars in GMV. They only started extracting microservices when their engineering team exceeded 1,000 people and the monolith deploy pipeline took over an hour. The lesson: the monolith was not the problem until they hit that scale.',
    },
  },

  // 3. Microservices Architecture Components
  {
    order: 3, type: 'content', title: 'Architecture Components',
    content: {
      overview: 'A microservices system requires supporting infrastructure components to function correctly at scale. Without these, the services themselves would be unmanageable.\n\nThe key components are: API Gateway (the front door), Service Registry (the address book), Message Broker (async communication), and Observability Stack (logs, metrics, traces).',
      sections: [
        { heading: 'API Gateway', body: 'The API Gateway is the single entry point for all external clients. Instead of clients knowing the address of each microservice, they talk to one gateway URL. The gateway handles authentication, rate limiting, request routing to the correct service, and response aggregation. It also handles SSL termination and logging. AWS API Gateway, Kong, and Nginx are popular choices.', code: null },
        { heading: 'Service Registry', body: 'Services constantly start, stop, and move. A service registry is a dynamic address book. When a service starts, it registers its current IP address and port. When another service needs to call it, it looks up the current address from the registry. Consul, Eureka (Netflix), and Kubernetes DNS are common registries.', code: null },
        { heading: 'Message Broker', body: 'Not all inter-service communication needs to be synchronous. A message broker (Kafka, RabbitMQ) enables asynchronous communication. Service A publishes an event to a topic without waiting for any response. Services B, C, and D each subscribe to that topic and react independently. This decouples services completely.', code: null },
        { heading: 'Observability Stack', body: 'Distributed tracing (Jaeger, Zipkin) follows a request across all services with a correlation ID. Centralised logging (ELK stack, Datadog) aggregates logs from all services into one place. Metrics (Prometheus, Grafana) show the health of each service. Without these, debugging microservices is nearly impossible.', code: null },
      ],
      animationSteps: [
        { label: 'Client',        description: 'All requests enter through the API Gateway',    highlight: false },
        { label: 'Gateway',       description: 'Auth, rate limit, route to correct service',    highlight: true  },
        { label: 'Registry',      description: 'Gateway looks up service address dynamically',  highlight: true  },
        { label: 'Broker',        description: 'Service publishes event, others subscribe',     highlight: false },
        { label: 'Observability', description: 'Trace request across all services with ID',     highlight: false },
      ],
      example: 'Netflix microservices architecture has over 700 services. Without their Eureka service registry, services would not know where to find each other as instances scale up and down. Without Zipkin distributed tracing, debugging why a video playback failed across 10+ services would be practically impossible.',
    },
  },

  // 4. Service Decomposition and Bounded Contexts
  {
    order: 4, type: 'content', title: 'Service Decomposition',
    content: {
      overview: 'Decomposing a system into the right microservices is the hardest part. Split services too finely and you have unnecessary network overhead. Split them too coarsely and you lose independent deployment.\n\nDomain-Driven Design (DDD) and Bounded Contexts provide the most reliable framework for finding the right service boundaries.',
      sections: [
        { heading: 'Bounded Contexts', body: 'A bounded context is a clear boundary within which a domain model is defined and applicable. Inside the boundary, every term has a precise meaning. "Order" means one thing in the Order Service and something different in the Shipping Service. Each bounded context typically becomes one microservice. The boundaries come from the business domain, not technical layers.', code: null },
        { heading: 'Decomposition Strategies', body: 'Decompose by business capability: the User Service handles everything about users, the Payment Service handles everything about payments. This is the most natural decomposition because business capabilities are stable over time. Core domain gets the most investment. Supporting domains are necessary but not differentiating. Generic subdomains are commodity and can be bought off the shelf.', code: null },
        { heading: 'Signs of Wrong Decomposition', body: 'If deploying Service A always requires deploying Service B at the same time, you have split one thing into two unnecessarily. If every feature requires changes to 5 services, your decomposition does not match your actual business boundaries. If services share a database, you have not truly separated them. Good decomposition means each feature touches at most 1-2 services.', code: null },
        { heading: 'The Two-Pizza Team Rule', body: 'Each service should be owned by a team small enough to be fed by two pizzas (5-8 people). This size keeps the team cohesive and the service scope manageable. A service is too large if one team cannot fully understand it. A service is too small if it does not justify its own deployment pipeline and operational overhead.', code: null },
      ],
      animationSteps: [
        { label: 'Domain analysis', description: 'Identify business capabilities first',        highlight: false },
        { label: 'Bounded context', description: 'User, Order, Payment, Notification contexts', highlight: true  },
        { label: 'Service per BC',  description: 'One microservice per bounded context',        highlight: true  },
        { label: 'Team ownership',  description: 'One team fully owns one service end-to-end', highlight: false },
        { label: 'Validate',        description: 'Good split: features touch 1-2 services max', highlight: false },
      ],
      example: 'Uber decomposed their ride-hailing system by business capability: Rider Service, Driver Service, Trip Service, Pricing Service, Matching Service, Notification Service, Payment Service. Each represents a distinct business capability. The Pricing Service can change its surge pricing algorithm without touching the Matching Service at all.',
    },
  },

  // 5. Inter-Service Communication
  {
    order: 5, type: 'content', title: 'Inter-Service Communication',
    content: {
      overview: 'When one microservice needs data or action from another, how do they communicate? The wrong communication pattern creates tight coupling, cascading failures, and poor performance.\n\nThere are two fundamental choices: synchronous (ask and wait for an answer) and asynchronous (fire an event and continue).',
      sections: [
        { heading: 'Synchronous Communication (REST and gRPC)', body: 'Service A calls Service B and waits for a response before continuing. REST over HTTP is the most common approach - familiar and works everywhere. gRPC over HTTP/2 with Protocol Buffers is 5-10x faster and provides type-safe generated clients - preferred for high-frequency internal calls. Use synchronous when you need an immediate response to continue processing.', code: null },
        { heading: 'Asynchronous Communication (Events)', body: 'Service A publishes an event to a message broker and immediately continues without waiting. Services B, C, D subscribe and react independently and in parallel. This fully decouples services - Service A does not need to know Services B, C, D even exist. If Service B is down, events queue up and process when it recovers. Kafka and RabbitMQ are the standard brokers.', code: null },
        { heading: 'Choosing Between Sync and Async', body: 'Use synchronous when the caller needs the result immediately (fetch a user profile to display it), the operation is a query returning data, or consistency is required (check stock before confirming an order). Use asynchronous when the operation does not need an immediate result (send confirmation email), multiple services need to react to the same event, or you want to decouple services.', code: null },
        { heading: 'API Contracts and Versioning', body: 'When Service A calls Service B, both must agree on the API contract. If Service B changes its API, Service A may break. Manage this with API versioning (/v1/, /v2/) and backward-compatible changes - add fields, never remove or rename. Use a schema registry with Kafka or OpenAPI/Swagger documentation to keep contracts explicit and tested.', code: null },
      ],
      animationSteps: [
        { label: 'Sync REST',    description: 'Service A calls B and waits for response',       highlight: false },
        { label: 'gRPC faster',  description: 'gRPC: binary protocol, 10x faster than REST',   highlight: true  },
        { label: 'Async event',  description: 'Order placed: event published to Kafka',         highlight: true  },
        { label: 'Fan out',      description: 'Email, inventory, analytics all react to event', highlight: false },
        { label: 'Decouple',     description: 'Services do not need to know each other',        highlight: false },
      ],
      example: 'When you place an Uber order, the Trip Service synchronously calls the Payment Service (needs immediate result: is the card valid?) and the Driver Service (is a driver available?). Then it asynchronously publishes a "trip started" event - the Notification Service, Analytics Service, and Billing Service all independently react without the Trip Service knowing or caring about them.',
    },
  },

  // 6. Service Discovery and Registration
  {
    order: 6, type: 'content', title: 'Service Discovery',
    content: {
      overview: 'In a microservices environment, services are constantly starting, stopping, and scaling. You cannot hardcode the IP address of the Payment Service because it might be running on 10 different servers with different IPs that change when instances restart.\n\nService discovery solves this: services dynamically find each other by name rather than by hardcoded IP address.',
      sections: [
        { heading: 'Client-Side Discovery', body: 'With client-side discovery, the calling service queries the service registry directly to get the list of available instances, then chooses one (using round-robin or least connections) and makes the call. The client is responsible for load balancing. Netflix Eureka and Consul support this model. It gives the client full control but couples it to the registry client library.', code: null },
        { heading: 'Server-Side Discovery', body: 'With server-side discovery, the caller just sends the request to a load balancer or API gateway. The load balancer queries the registry and forwards the request to an available instance. The caller knows nothing about the registry or load balancing. Kubernetes uses this model - you call a Service name and Kubernetes DNS routes to a healthy pod.', code: null },
        { heading: 'Health Checks and Registration', body: 'When a service instance starts, it registers its IP, port, and a health check endpoint. The registry periodically pings this health check. If the health check fails 3 times in a row, the instance is deregistered. When a service shuts down gracefully, it deregisters itself. This ensures the registry never routes traffic to dead instances.', code: null },
        { heading: 'Kubernetes DNS', body: 'In Kubernetes, service discovery is built in via DNS. Each service gets a stable DNS name (payment-service.production.svc.cluster.local). Any pod can reach any service by name regardless of how many pods are running or what their IPs are. Kubernetes kube-proxy handles load balancing. For modern Kubernetes deployments, you get service discovery for free.', code: null },
      ],
      animationSteps: [
        { label: 'Service starts',   description: 'New instance registers IP + port with registry', highlight: false },
        { label: 'Health check',     description: 'Registry pings /health every 5 seconds',         highlight: true  },
        { label: 'Caller queries',   description: 'Service A asks: where is Service B?',            highlight: true  },
        { label: 'Registry answers', description: 'Returns IP:port of healthy instances',           highlight: false },
        { label: 'Service calls',    description: 'A calls B using discovered address',             highlight: false },
      ],
      example: 'Netflix runs thousands of microservice instances across AWS. Their Eureka service registry has over 200,000 service registrations. Without it, whenever AWS restarts an EC2 instance, the old IP would be unreachable. Eureka ensures that within 30 seconds of a new instance starting, all other services can find and call it.',
    },
  },

  // 7. Inter-Service Data Management
  {
    order: 7, type: 'content', title: 'Inter-Service Data Management',
    content: {
      overview: 'Each microservice should own its data exclusively - no sharing databases between services. This is one of the hardest rules to follow because it means you lose cross-service JOIN queries and distributed ACID transactions.\n\nInstead, you must design around data ownership, eventual consistency, and event-driven data synchronisation.',
      sections: [
        { heading: 'Database Per Service', body: 'Each microservice has its own private database. No other service can directly query it. This enforces true independence - services can change their data schema without coordinating with other services. The User Service might use PostgreSQL, the Product Catalog might use MongoDB, the Session Service might use Redis. Each team chooses the best database for their specific access patterns.', code: null },
        { heading: 'The Problem: Joins Across Services', body: 'In a monolith, you JOIN users and orders in a single SQL query. In microservices, these live in separate databases. To show "all orders for user John Smith", you must query the Order Service for orders, then query the User Service for the user, then join them in application code. This is slower and more complex but necessary for true service independence.', code: null },
        { heading: 'Saga Pattern for Distributed Transactions', body: 'A distributed transaction (charge the card AND reserve the item AND create the order) cannot use a simple database transaction across services. The Saga pattern uses a sequence of local transactions, each publishing an event to trigger the next step. If any step fails, compensating transactions undo the previous steps. Orchestration Saga has a central coordinator. Choreography Saga has services reacting to events.', code: null },
        { heading: 'CQRS and Event Sourcing', body: 'CQRS (Command Query Responsibility Segregation) uses separate models for writes (commands) and reads (queries). Write models optimise for data integrity. Read models optimise for query performance - potentially denormalised views updated by events. Event Sourcing stores every state change as an immutable event. The current state is derived by replaying events providing a complete audit trail.', code: null },
      ],
      animationSteps: [
        { label: 'Separate DBs', description: 'User Service owns users DB, Order Service owns orders DB', highlight: false },
        { label: 'No shared DB', description: 'No direct cross-service database queries allowed',  highlight: true  },
        { label: 'Saga step 1',  description: 'Order Service: create order (local TX)',            highlight: true  },
        { label: 'Saga step 2',  description: 'Payment Service: charge card (local TX)',           highlight: false },
        { label: 'Compensate',   description: 'Payment fails: cancel order (compensating TX)',     highlight: false },
      ],
      example: 'Uber Eats uses the Saga pattern for orders. When you place an order: (1) Order Service creates an order in pending state. (2) Payment Service charges your card. (3) Restaurant Service notifies the restaurant. If step 3 fails, compensating transactions run: refund the payment, cancel the order. Each step is a local transaction with a compensating action defined.',
    },
  },

  // 8. Microservices Deployment and Containerization
  {
    order: 8, type: 'content', title: 'Deployment and Containerization',
    content: {
      overview: 'To make independent deployment practical - deploying dozens of services reliably and repeatedly - you need containerisation (Docker) and container orchestration (Kubernetes).\n\nContainers package a service with all its dependencies into a portable unit that runs identically in development, staging, and production.',
      sections: [
        { heading: 'Docker Containers', body: 'A Docker container packages your service code, runtime, libraries, and configuration into a single portable image. The same image runs identically on your laptop, in CI/CD, and in production. Each service has its own Dockerfile. Images are versioned and stored in a container registry. Deploying a new version means pulling the new image and starting containers from it.', code: null },
        { heading: 'Kubernetes Orchestration', body: 'Kubernetes manages containers at scale. It handles: scheduling (which server runs which container), scaling (add/remove replicas based on load), health checks and restarts (replace crashed containers automatically), rolling deployments (replace old containers with new ones gradually), and service discovery (services find each other by name via DNS).', code: null },
        { heading: 'CI/CD Pipelines', body: 'Each service needs its own pipeline: code commit triggers tests, tests pass triggers Docker build, image pushed to registry triggers deployment to staging, staging tests pass triggers production deploy. Teams should be able to deploy their service to production multiple times per day without affecting other services.', code: null },
        { heading: 'Blue-Green and Canary Deployments', body: 'Blue-green deployment runs old (blue) and new (green) simultaneously. Traffic switches from blue to green atomically - instant rollback by switching back. Canary deployment routes a small percentage of traffic (1-5%) to the new version. Monitor error rates and latency. If the canary is healthy, gradually increase to 100%. If problems appear, roll back instantly.', code: null },
      ],
      animationSteps: [
        { label: 'Dockerfile',    description: 'Package service + dependencies into image',     highlight: false },
        { label: 'Build + push',  description: 'CI builds image, pushes to registry',           highlight: true  },
        { label: 'Kubernetes',    description: 'K8s pulls image, runs container in cluster',    highlight: true  },
        { label: 'Rolling deploy', description: 'New pods start before old pods stop',         highlight: false },
        { label: 'Canary',        description: '5% traffic to new version - monitor then 100%', highlight: false },
      ],
      example: 'Amazon deploys to production over 50 million times per year - averaging more than one deployment per second. This is only possible because each microservice has its own containerised CI/CD pipeline that can deploy independently. A change to the recommendation service does not require coordinating with the checkout team.',
    },
  },

  // 9. Microservices Resilience and Fault Isolation
  {
    order: 9, type: 'content', title: 'Resilience and Fault Isolation',
    content: {
      overview: 'A microservices system has many more failure points than a monolith. Each network call between services is a potential failure. A service that calls 5 downstream services has 5 chances for something to go wrong.\n\nResilience patterns ensure that when one service fails or becomes slow, the failure does not cascade through the entire system.',
      sections: [
        { heading: 'Circuit Breaker', body: 'A circuit breaker monitors calls to a downstream service. After a threshold of failures (say 5 in 10 seconds), it trips open and immediately returns an error for all subsequent calls without even trying the downstream service. After a cooldown period (30 seconds), it tries one request. If successful, it closes and normal traffic resumes. This prevents cascading failures.', code: null },
        { heading: 'Bulkhead Pattern', body: 'The Bulkhead pattern isolates resources for different downstream dependencies. If Service A calls both Service B and Service C, and Service B becomes slow, without bulkheads all of A\'s threads could be consumed waiting for B, leaving no threads for C. Bulkheads assign a fixed thread pool per downstream dependency. Service B\'s slowness only consumes its bulkhead threads.', code: null },
        { heading: 'Retry with Exponential Backoff', body: 'Transient failures are common in distributed systems. A retry can often succeed. But retrying immediately puts more load on an already struggling service. Exponential backoff: retry after 1 second, then 2 seconds, then 4 seconds, adding jitter to prevent all retried requests from hitting simultaneously. Always combine retries with idempotency - the downstream operation must be safe to repeat.', code: null },
        { heading: 'Graceful Degradation', body: 'Define what your service does when a dependency is unavailable. If the Recommendation Service is down, Amazon still shows the product page without personalised recommendations. If the Notification Service is slow, the order still completes and the email arrives late. Plan fallbacks for every external call. A degraded experience is always better than a failed one.', code: null },
      ],
      animationSteps: [
        { label: 'Service B slow', description: 'Service B taking 30s to respond',              highlight: true  },
        { label: 'Threads fill',   description: 'Service A threads all waiting for B',          highlight: true  },
        { label: 'Circuit opens',  description: 'Circuit breaker trips - fail fast immediately', highlight: false },
        { label: 'Fallback',       description: 'Return cached or default response instead',    highlight: false },
        { label: 'B recovers',     description: 'Circuit closes - normal traffic resumes',      highlight: false },
      ],
      example: 'Netflix Hystrix (now open source) is the reference implementation of circuit breakers for microservices. When the recommendation service goes down, Hystrix trips the circuit and Netflix shows generic popular titles instead. When the recommendation service recovers, the circuit closes and personalised recommendations return. No user ever sees an error page.',
    },
  },

  // 10. Microservices Observability
  {
    order: 10, type: 'content', title: 'Microservices Observability',
    content: {
      overview: 'When something goes wrong in a monolith, you look at one log file. When something goes wrong across 50 microservices, a single user request may have touched 20 of them. Finding which one caused the failure requires proper observability tooling.\n\nObservability has three pillars: Logs (what happened), Metrics (how healthy is each service), and Traces (how did this specific request flow through the system).',
      sections: [
        { heading: 'Distributed Tracing', body: 'Distributed tracing assigns a unique trace ID to every request as it enters the system. Every service that handles that request logs the trace ID along with its processing time and outcome. Tracing tools (Jaeger, Zipkin, Datadog APM) aggregate these logs and visualise the complete path of a request - showing which service was slowest, where errors occurred, and how much time each service consumed.', code: null },
        { heading: 'Centralised Logging', body: 'With 50 services each logging to their own container, finding a relevant log line requires checking each container separately. Centralised logging aggregates all service logs into one searchable system. The ELK stack and Datadog are standard solutions. Every log line must include the trace ID so you can filter all logs for a specific request across all services.', code: null },
        { heading: 'Metrics and Alerting', body: 'Every service should expose key metrics: request rate, error rate, and latency (the RED metrics). Prometheus scrapes these from each service every 15 seconds. Grafana dashboards visualise them. Alerts fire when error rates exceed 1%, when latency P99 exceeds 500ms, or when any service stops responding to health checks. Good alerting pages on-call engineers before users notice problems.', code: null },
        { heading: 'The Service Mesh', body: 'A service mesh (Istio, Linkerd) adds a sidecar proxy container to every service pod. The proxy intercepts all network traffic and automatically handles: mutual TLS (encryption between services), circuit breaking, retries, distributed tracing (without any code changes), and metrics collection. Service meshes provide observability and resilience for free without changing service code.', code: null },
      ],
      animationSteps: [
        { label: 'Request enters',  description: 'Trace ID assigned at API Gateway',            highlight: false },
        { label: 'Propagated',      description: 'Every service logs with same trace ID',       highlight: true  },
        { label: 'Service fails',   description: 'Payment Service returns 500 error',           highlight: true  },
        { label: 'Trace view',      description: 'Jaeger shows: request took 4s in Payment',    highlight: false },
        { label: 'Alert fires',     description: 'Prometheus: error rate >1% - page on-call',  highlight: false },
      ],
      example: 'Lyft built Envoy proxy specifically to handle observability in their microservices architecture. Every request between services passes through Envoy sidecars that automatically collect metrics and traces without the services themselves needing any tracing code. This pattern - later standardised as the service mesh - is now used by hundreds of companies running microservices at scale.',
    },
  },

  // 11. Failure Cases
  {
    order: 11, type: 'failureCases', title: 'Failure Cases',
    failureCases: [
      {
        title: 'Cascading Failure Without Circuit Breakers',
        scenario: 'Service A calls Service B which calls Service C. Service C has a database issue and starts taking 30 seconds per request. Service B threads fill up waiting for C. Service A threads fill up waiting for B. Within 2 minutes the entire system is unresponsive - brought down by one slow database query three layers deep.',
        impact: 'Total system outage from one slow dependency. Every user sees errors even though only Service C had the original problem.',
        resolution: 'Implement circuit breakers between every service pair. Set aggressive timeouts (500ms max per call). Use the bulkhead pattern to isolate thread pools per downstream service. Define fallback responses for every external call. Test failure modes explicitly with chaos engineering.',
        animationSteps: [
          { label: 'C slows',       description: 'Service C DB query takes 30s',                highlight: true  },
          { label: 'B fills up',    description: 'Service B threads all waiting for C',         highlight: true  },
          { label: 'A fills up',    description: 'Service A threads all waiting for B',         highlight: true  },
          { label: 'Total outage',  description: 'Entire system unresponsive',                  highlight: false },
          { label: 'Fix',           description: 'Circuit breaker stops cascade at first link', highlight: false },
        ],
      },
      {
        title: 'Distributed Monolith',
        scenario: 'A team splits their monolith into 8 microservices. But every deployment of any service requires deploying all 8 together because they share a database, use synchronous calls for every operation, and have tight version dependencies between APIs. They have all the operational complexity of microservices but none of the deployment independence.',
        impact: 'Worse than the original monolith: high operational overhead with no benefit. Deployments are still coupled but now require coordinating 8 separate pipelines instead of 1.',
        resolution: 'True microservices require: database per service (no sharing), backward-compatible API versioning, asynchronous communication for non-critical paths, and teams willing to accept eventual consistency. If these are not achievable, stay with the well-structured monolith.',
        animationSteps: [
          { label: 'Deploy A',      description: 'Must also deploy B, C, D at same time',       highlight: true  },
          { label: 'Shared DB',     description: 'All 8 services share one database',           highlight: true  },
          { label: 'Tight coupling', description: 'API version change breaks 5 services',      highlight: true  },
          { label: 'Distributed monolith', description: 'All complexity, no independence',    highlight: false },
          { label: 'Fix',           description: 'Enforce: one DB per service, versioned APIs', highlight: false },
        ],
      },
      {
        title: 'Service Discovery Failure',
        scenario: 'The Consul service registry cluster is unavailable for 4 minutes due to a leader election issue. During this time, all services that use client-side discovery cannot find each other. Inter-service calls fail with service not found errors even though all the actual services are healthy and running.',
        impact: 'Total failure of service-to-service communication despite all services being healthy. The registry becomes a single point of failure for the entire system.',
        resolution: 'Cache service registry results locally with a TTL. Services should fall back to last-known-good addresses if the registry is unavailable. Run the registry in a highly available cluster (3 or 5 nodes with Raft consensus). Use health check timeouts that distinguish registry unavailable from service unavailable.',
        animationSteps: [
          { label: 'Registry down', description: 'Consul registry unavailable for 4 minutes',  highlight: true  },
          { label: 'Lookup fails',  description: 'Service A cannot find Service B address',     highlight: true  },
          { label: 'All calls fail', description: 'Inter-service calls error: not found',       highlight: true  },
          { label: 'Services fine', description: 'Actual services healthy but unreachable',     highlight: false },
          { label: 'Fix',           description: 'Cache last-known addresses + HA registry',   highlight: false },
        ],
      },
      {
        title: 'Saga Compensation Failure',
        scenario: 'An order saga: create order, charge card, reserve inventory. The inventory reservation fails. The saga triggers compensation: cancel order, refund card. The refund call to the Payment Service times out. The saga gives up. Now the card has been charged, the order is cancelled, but no refund has been issued.',
        impact: 'Financial data inconsistency. User charged but order cancelled with no refund. Requires manual intervention. Customer support nightmare.',
        resolution: 'Compensating transactions must be retried indefinitely until they succeed. Use an outbox pattern to persist compensation tasks durably before executing them. Have a reconciliation job that scans for incomplete sagas and retries stuck compensations. All payment operations must be idempotent (safe to retry).',
        animationSteps: [
          { label: 'Order created',   description: 'Saga step 1: order in pending state',       highlight: false },
          { label: 'Card charged',    description: 'Saga step 2: payment taken successfully',   highlight: false },
          { label: 'Inventory fails', description: 'Saga step 3: no stock - compensate',        highlight: true  },
          { label: 'Refund fails',    description: 'Compensation: refund call times out',       highlight: true  },
          { label: 'Fix',             description: 'Retry compensation forever + idempotency',  highlight: false },
        ],
      },
      {
        title: 'Missing Trace ID Makes Debugging Impossible',
        scenario: 'Users report intermittent checkout errors. Engineers check the Checkout Service logs - nothing unusual. They check the Payment Service logs - also nothing. They check the Inventory Service logs - also clean. After 3 hours they find the error in the Shipping Service. Because no trace ID was propagated between services, finding the failing service required manually checking every service one by one.',
        impact: '3 hours of engineer time wasted on a bug that would take 5 minutes to locate with proper distributed tracing. During that time, users continue experiencing errors.',
        resolution: 'Enforce trace ID propagation as a non-negotiable standard across all services. Use a service mesh (Istio) that handles propagation automatically without code changes. Add tracing as a requirement in service templates so all new services get it automatically. Treat missing trace IDs as a build failure in CI.',
        animationSteps: [
          { label: 'Request fails',  description: 'User checkout fails - error reported',       highlight: true  },
          { label: 'Check service A', description: 'Checkout logs: nothing unusual',            highlight: false },
          { label: 'Check service B', description: 'Payment logs: nothing unusual',             highlight: false },
          { label: '3 hours later',  description: 'Found in Shipping Service manually',         highlight: true  },
          { label: 'Fix',            description: 'Trace ID in every request - find in 5 min',  highlight: false },
        ],
      },
    ],
  },

  // 12. Interview Questions
  {
    order: 12, type: 'interview', title: 'Interview Discussion Questions',
    interviewQuestions: [
      {
        question: 'When would you recommend microservices over a monolith? What signals tell you it is time to decompose?',
        answer: 'Recommend microservices when: the engineering team exceeds 25-30 people and multiple teams fight over the same codebase; build and deployment times exceed 20-30 minutes causing deployment friction; different parts of the system have radically different scaling requirements; or you need truly independent release cycles for business reasons. Signals to decompose: two teams cannot deploy independently without coordinating, a bug in one area regularly causes downtime in unrelated areas, or one service needs to be rewritten in a different language or scaled differently. Do not decompose speculatively - wait for the actual pain.',
        difficulty: 'medium',
      },
      {
        question: 'How do you handle a transaction that needs to update data in 3 different microservices atomically?',
        answer: 'Use the Saga pattern. Each service executes a local transaction and publishes an event triggering the next step. If any step fails, compensating transactions undo the previous steps. Two approaches: orchestration (a Saga coordinator service calls each step in sequence and manages compensation) or choreography (services react to events from each other without a central coordinator). Critical: compensating transactions must be retried indefinitely and all operations must be idempotent. For very strong consistency requirements, consider whether those services should actually be part of the same service.',
        difficulty: 'hard',
      },
      {
        question: 'A new feature requires changes to the User Service, Order Service, and Payment Service simultaneously. Is this a problem?',
        answer: 'Yes - this is a red flag called temporal coupling or a distributed monolith. If a feature consistently requires coordinated changes across 3 services, those services may not be correctly decomposed around business boundaries. First investigate: are these really independent services or is this one bounded context split incorrectly? If the services are correctly decomposed, the feature can be delivered incrementally: deploy backward-compatible changes to downstream services first, deploy the upstream changes second. API versioning enables this. If it is truly impossible to decouple, consider merging the tightly coupled services.',
        difficulty: 'hard',
      },
      {
        question: 'How does service discovery work in Kubernetes?',
        answer: 'Kubernetes provides built-in service discovery via DNS and Services. Each microservice is exposed as a Kubernetes Service object with a stable DNS name (e.g. payment-service.default.svc.cluster.local). When any pod calls that DNS name, Kubernetes DNS resolves it and kube-proxy load balances the request to a healthy pod running that service. Pod IPs change constantly as pods are created and destroyed, but the Service DNS name is stable. No external registry (Consul, Eureka) is needed - Kubernetes handles registration automatically when pods match a Service selector. For multi-cluster or external service discovery, Consul or Istio service mesh can be added.',
        difficulty: 'medium',
      },
      {
        question: 'What is the circuit breaker pattern and why is it essential in microservices?',
        answer: 'A circuit breaker wraps calls to a downstream service. It tracks failures over a time window. When failures exceed a threshold (say 5 failures in 10 seconds), the circuit trips open and all subsequent calls immediately return an error without calling the downstream service. After a configurable cooldown (30-60 seconds), it allows one test request through. If that succeeds, the circuit closes and normal traffic resumes. It is essential because without it, a slow or failing downstream service can exhaust the thread pool of the calling service, causing it to fail too - cascading failure. The circuit breaker stops the cascade at the first link in the chain.',
        difficulty: 'medium',
      },
      {
        question: 'How would you debug a slow user request in a system with 20 microservices?',
        answer: 'With distributed tracing. Every request gets a unique trace ID at the API gateway. Every service logs its processing time tagged with that trace ID. Jaeger or Zipkin collects these spans and visualises the complete request path as a waterfall diagram - showing exactly which service consumed the most time. Without tracing: grep for the request ID across 20 separate log streams, which takes hours. With tracing: open Jaeger, search the trace ID, see in 10 seconds that the Order Service took 3 seconds while everything else was under 10ms. Distributed tracing is non-negotiable infrastructure for microservices.',
        difficulty: 'medium',
      },
      {
        question: 'What is a service mesh and when would you use one?',
        answer: 'A service mesh (Istio, Linkerd) adds a sidecar proxy (typically Envoy) to every service pod. All inbound and outbound network traffic passes through the proxy. This gives you: mutual TLS between all services (zero-trust security), circuit breaking and retries without code changes, distributed tracing and metrics automatically collected, and traffic shaping (canary deployments, A/B testing) without touching service code. Use a service mesh when you have 20+ services and need consistent security, observability, and resilience enforcement without expecting every team to implement it correctly themselves. The complexity cost (additional infrastructure, steep learning curve) is justified at that scale.',
        difficulty: 'hard',
      },
      {
        question: 'How do you manage database schema changes across multiple microservices?',
        answer: 'Each service owns its own database schema exclusively - no other service touches it. Schema changes are handled entirely within the owning service team using migration tools (Flyway, Liquibase). The challenge is API contract changes: if the Order Service adds a new field and the Checkout Service depends on the Order Service API, use backward-compatible changes (add fields, never remove). Version your APIs (/v1, /v2). Use the expand-contract pattern: add the new field alongside the old one, migrate consumers to the new field, then remove the old one in a later release. For event-driven systems, use a schema registry (Confluent) to manage Kafka event schema evolution.',
        difficulty: 'medium',
      },
    ],
  },

  // 13. Quiz
  {
    order: 13, type: 'quiz', title: 'Microservices Quiz',
    quizConfig: {
      timeLimitSeconds: 600, maxAttempts: 3, passingPercent: 70,
      questions: [
        {
          question: 'Your startup has 8 engineers and is building a new product. Which architecture should you start with?',
          options: ['Microservices from day one for future scalability', 'Monolith with clean architecture for simplicity', 'Serverless functions for each feature', 'Microservices with a message broker'],
          correctIndex: 1, scenario: true,
          explanation: 'Monolith first. At 8 engineers, the operational overhead of microservices (service discovery, distributed tracing, container orchestration, multiple CI/CD pipelines) massively outweighs the benefits. A well-structured monolith moves faster and is easier to change. Migrate to microservices when the monolith becomes a genuine constraint, not speculatively.',
        },
        {
          question: 'Service A calls Service B (30s timeout) and Service C (1s timeout). Service B becomes slow. What happens without bulkheads?',
          options: ['Only Service B calls are affected', 'Service A threads are all consumed by B, no threads left for C', 'Service C automatically handles the extra load', 'The API Gateway reroutes traffic to Service C'],
          correctIndex: 1, scenario: true,
          explanation: 'Without bulkheads, Service B slowness consumes all of Service A\'s threads waiting for the 30s timeout. When Service C calls arrive, there are no threads to handle them even though Service C is healthy. Bulkheads fix this by assigning a fixed thread pool per downstream dependency.',
        },
        {
          question: 'You need to charge a credit card, create an order, and update inventory - all atomically across 3 services. What pattern handles this?',
          options: ['A single distributed SQL transaction', 'The Saga pattern with compensating transactions', 'Synchronous REST calls in sequence', 'A shared database all 3 services access'],
          correctIndex: 1, scenario: true,
          explanation: 'Saga pattern. You cannot use a distributed SQL transaction across separate service databases. A Saga executes local transactions per service, publishing events to trigger the next step. If any step fails, compensating transactions undo the completed steps (refund card, cancel order). Each compensating action must be idempotent and retried until it succeeds.',
        },
        {
          question: 'A feature requires changing the User Service, Order Service, and Notification Service at the same time. What does this indicate?',
          options: ['Good microservices architecture - changes spread across services', 'Temporal coupling - possibly a distributed monolith', 'The services need to be split further', 'Normal for complex features'],
          correctIndex: 1, scenario: true,
          explanation: 'Temporal coupling. If features consistently require coordinated changes across multiple services, those services may not be correctly decomposed around business boundaries. This is the distributed monolith antipattern - all the complexity of microservices with none of the deployment independence. Investigate whether the services should be merged or redesigned around actual bounded contexts.',
        },
        {
          question: 'How does Kubernetes handle service discovery without Consul or Eureka?',
          options: ['Services hardcode each other\'s IP addresses', 'Kubernetes DNS assigns a stable DNS name to each Service', 'Services broadcast their addresses via UDP', 'The API Gateway maintains a manual routing table'],
          correctIndex: 1, scenario: false,
          explanation: 'Kubernetes DNS. Each Service object gets a stable DNS name (service-name.namespace.svc.cluster.local). Pod IPs change constantly as pods restart and scale, but the Service DNS name is stable. kube-proxy handles load balancing to healthy pods automatically. No external registry is needed in a Kubernetes environment.',
        },
        {
          question: 'Service B fails completely. Service A has a circuit breaker. What happens to Service A?',
          options: ['Service A also fails and crashes', 'Circuit breaker opens - Service A returns fallback response immediately', 'Service A queues all requests until B recovers', 'Service A routes requests to a backup service automatically'],
          correctIndex: 1, scenario: true,
          explanation: 'Circuit breaker opens. After a threshold of failures, the breaker trips open and all subsequent calls return an error immediately without actually calling Service B. This prevents Service A\'s threads from being consumed waiting for B to time out. Service A can return a cached or default fallback response. After a cooldown, the breaker tests one request and closes if successful.',
        },
        {
          question: 'A request fails somewhere across your 20 microservices. Without distributed tracing, how long does debugging take?',
          options: ['Under 1 minute - just check the API gateway log', 'Under 5 minutes - grep across all services', 'Hours - manually check each service log one by one', 'Impossible to debug distributed systems'],
          correctIndex: 2, scenario: true,
          explanation: 'Hours. Without a trace ID, you must manually check each service log independently, filtering by timestamp and user ID, hoping to find the error. With distributed tracing, you search the trace ID in Jaeger and see the complete request path with timing in seconds. Distributed tracing is mandatory infrastructure for microservices.',
        },
        {
          question: 'What is the key difference between orchestration and choreography in the Saga pattern?',
          options: ['Orchestration uses REST, choreography uses gRPC', 'Orchestration has a central coordinator service, choreography uses events between services', 'Orchestration is for reads, choreography for writes', 'Orchestration is faster than choreography'],
          correctIndex: 1, scenario: false,
          explanation: 'Orchestration Saga has a central coordinator service that calls each service step by step and manages compensation if any step fails. It is easier to understand but creates a central dependency. Choreography Saga has services react to events from each other without a coordinator. It is more decoupled but harder to trace the overall flow. Choose orchestration for complex flows where visibility matters, choreography for simpler flows where full decoupling is a priority.',
        },
        {
          question: 'A new engineer wants to use a completely different database for their new microservice. Should you allow this?',
          options: ['No - all services must use the same database for consistency', 'Yes - each service should use the best database for its access patterns', 'Only if the existing database cannot handle the load', 'Only if the CTO approves each database choice'],
          correctIndex: 1, scenario: true,
          explanation: 'Yes. Database per service is a core principle of microservices. Each service should choose the best data store for its specific access patterns: key-value store for sessions, graph database for social connections, time-series database for metrics, document database for flexible schemas. Technology freedom is one of the main benefits of microservices. The services communicate via APIs, not by sharing a database.',
        },
        {
          question: 'What does a service mesh sidecar proxy (Envoy/Istio) provide that services would otherwise need to implement themselves?',
          options: ['Business logic and data validation', 'mTLS between services, circuit breaking, retries, and distributed tracing - automatically', 'Database connection pooling and query optimisation', 'API versioning and backward compatibility'],
          correctIndex: 1, scenario: false,
          explanation: 'mTLS, circuit breaking, retries, and distributed tracing - all without code changes. The sidecar proxy intercepts all network traffic. Instead of every service team implementing security (mTLS), resilience (circuit breakers), and observability (tracing) correctly, the service mesh provides these uniformly for all services. This is the main value proposition: consistent infrastructure concerns handled at the platform level, not the application level.',
        },
      ],
    },
  },
];

module.exports = MICROSERVICES_MODULES;
