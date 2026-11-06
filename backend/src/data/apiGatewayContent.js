// Static API Gateway content - 13 modules total
// Orders 1-10: content topics
// Order 11: Failure Cases
// Order 12: Interview Discussion Questions
// Order 13: Quiz

const API_GATEWAY_MODULES = [

  // 1. API Gateway Fundamentals
  {
    order: 1, type: 'content', title: 'API Gateway Fundamentals',
    content: {
      overview: 'An API Gateway is a server that acts as the single entry point for all client requests to your backend services. Instead of clients knowing the address of every individual microservice, they send all requests to one URL - the gateway - which then routes, transforms, and forwards each request to the correct backend service.\n\nThink of it as the front door of a building. Everyone enters through one door. The receptionist (gateway) checks who you are, where you need to go, and directs you there.',
      sections: [
        { heading: 'What an API Gateway Does', body: 'An API Gateway handles several cross-cutting concerns in one place. It receives all incoming requests, authenticates them, rate limits to prevent abuse, routes each request to the correct backend service, transforms request and response formats if needed, aggregates responses from multiple services into one, and logs everything for monitoring. Without a gateway, every service would need to implement all of these independently.', code: null },
        { heading: 'Why You Need One', body: 'Without an API Gateway, clients would need to know the address of every microservice. When a mobile app calls your system, it should not need to call the User Service directly, then the Order Service directly, then the Product Service directly. That leaks your internal architecture to clients, makes it impossible to change backend services without breaking clients, and forces every service to handle auth and rate limiting itself.', code: null },
        { heading: 'Popular API Gateways', body: 'AWS API Gateway is the most widely used managed service - fully serverless, integrates with Lambda and ECS. Kong is open-source and highly extensible with a plugin system. NGINX and Traefik are commonly used as both reverse proxies and API gateways in Kubernetes. Apollo Federation acts as an API Gateway specifically for GraphQL. Netflix Zuul and Spring Cloud Gateway are popular in Java microservices ecosystems.', code: null },
        { heading: 'Gateway vs Direct Client-Service', body: 'Without a gateway: a mobile app makes 5 separate API calls to 5 services, handles authentication for each, deals with different error formats from each, and breaks every time you refactor a service. With a gateway: the app makes 1 call, the gateway handles auth, aggregates the 5 service responses into one clean response, and you can freely refactor backends without changing the client-facing API.', code: null },
      ],
      animationSteps: [
        { label: 'Clients',       description: 'Mobile, web, third-party all send requests', highlight: false },
        { label: 'One endpoint',  description: 'All requests hit the API Gateway URL',       highlight: true  },
        { label: 'Auth + limit',  description: 'Gateway authenticates and rate limits',       highlight: true  },
        { label: 'Route',         description: 'Gateway routes to correct backend service',   highlight: false },
        { label: 'Respond',       description: 'Response returns through gateway to client',  highlight: false },
      ],
      example: 'Netflix uses an API Gateway (Zuul) that handles over 2 billion requests per day. Every request from the Netflix app - whether loading your profile, fetching recommendations, or starting a video - goes through Zuul first. It authenticates the request, routes it to 1 of 700+ backend microservices, and returns the response. Without it, the Netflix app would need to know the address of each microservice directly.',
    },
  },

  // 2. API Gateway Architecture and Components
  {
    order: 2, type: 'content', title: 'API Gateway Architecture',
    content: {
      overview: 'An API Gateway is not just a simple proxy. It is a sophisticated middleware layer with multiple processing stages. Understanding its internal architecture helps you configure it correctly and debug issues when requests fail.\n\nEvery request passes through a processing pipeline: pre-processing (auth, rate limiting), routing, forwarding, and post-processing (response transformation, logging).',
      sections: [
        { heading: 'The Request Pipeline', body: 'A request flows through the gateway in stages. Pre-processing: validate headers, authenticate the token, check rate limits. Routing: match the URL path and method to a backend service. Load balancing: pick which instance of that service to call. Forwarding: send the request upstream. Post-processing: transform the response, add headers, log the result. Each stage is typically implemented as a plugin or middleware that can be added or removed per route.', code: null },
        { heading: 'Control Plane vs Data Plane', body: 'An API Gateway has two planes. The data plane handles actual request traffic - it sits in the hot path of every API call and must be extremely fast. The control plane manages configuration - defining routes, policies, and plugins. You update the control plane to change how the data plane behaves. In Kong, the Admin API is the control plane. The Proxy is the data plane. In AWS API Gateway, the Console and API are the control plane, the deployed stage handles data.', code: null },
        { heading: 'Plugin System', body: 'Modern API gateways use a plugin architecture. Each cross-cutting concern (auth, rate limiting, caching, logging, request transformation) is a plugin. Plugins are applied per-route or globally. You can compose them in order. A route might have: JWT validation plugin, then rate limiting plugin, then request transformer plugin, then proxy plugin. This modularity lets you add or remove features without changing gateway code.', code: null },
        { heading: 'High Availability', body: 'The API Gateway is in the critical path of every single request. If it goes down, everything goes down. You must run it in a highly available configuration: multiple gateway instances behind a load balancer, across multiple availability zones. The gateway itself must be stateless so any instance can handle any request. State (rate limit counters, auth tokens) must be stored in Redis shared by all gateway instances.', code: null },
      ],
      animationSteps: [
        { label: 'Request in',   description: 'Client request enters gateway',                highlight: false },
        { label: 'Pre-process',  description: 'Authenticate, validate, rate check',           highlight: true  },
        { label: 'Route match',  description: 'Match URL to backend service definition',      highlight: true  },
        { label: 'Forward',      description: 'Send to upstream service instance',            highlight: false },
        { label: 'Post-process', description: 'Transform response, log, return to client',   highlight: false },
      ],
      example: 'Kong processes each request through an ordered chain of plugins. A typical Kong route might have: key-auth plugin (validate API key), rate-limiting plugin (100 req/min per consumer), request-transformer plugin (add internal headers), and proxy plugin (forward to upstream). Each plugin runs in order and can abort the chain early - if key-auth fails, rate-limiting never runs.',
    },
  },

  // 3. API Gateway vs Reverse Proxy
  {
    order: 3, type: 'content', title: 'API Gateway vs Reverse Proxy',
    content: {
      overview: 'API Gateway and Reverse Proxy are often confused because both sit in front of backend services and forward requests. The key difference is in what they know and do.\n\nA reverse proxy is infrastructure - it forwards HTTP traffic without understanding what is inside the request. An API Gateway is application-aware - it understands APIs, applies business logic like authentication and rate limiting, and can transform payloads.',
      sections: [
        { heading: 'What a Reverse Proxy Does', body: 'A reverse proxy (NGINX, HAProxy) sits between clients and servers and forwards requests. It handles SSL termination, load balancing, and caching. It operates at the HTTP level - it knows about URLs and headers but does not understand the meaning of your API. It does not know what a JWT token is or how to validate it. It routes based on URL patterns and host headers, not business logic.', code: null },
        { heading: 'What an API Gateway Adds', body: 'An API Gateway does everything a reverse proxy does, plus application-level concerns. It validates JWT tokens and checks scopes. It enforces rate limits per user or per API key. It transforms request formats (XML to JSON). It aggregates calls to multiple services into one response. It tracks usage per consumer for billing. These are business logic concerns that a reverse proxy does not handle.', code: null },
        { heading: 'When to Use Each', body: 'Use a reverse proxy when you need basic load balancing, SSL termination, and URL-based routing without business logic. Typical case: routing traffic between different applications on the same server, or as an edge layer before the gateway. Use an API Gateway when you have multiple services, need authentication and authorization, want rate limiting per client, or need to aggregate responses.', code: null },
        { heading: 'They Can Coexist', body: 'In many production systems, both exist. A CDN or reverse proxy (Cloudflare, NGINX) sits at the very edge handling SSL termination, DDoS protection, and static asset caching. Behind it, an API Gateway handles application-level concerns for API traffic. The reverse proxy handles infrastructure; the gateway handles business logic. The layers are complementary, not competing.', code: null },
      ],
      animationSteps: [
        { label: 'Reverse Proxy', description: 'NGINX: SSL, load balance, URL routing',       highlight: false },
        { label: 'Forwards',      description: 'Passes request through - no business logic',  highlight: true  },
        { label: 'API Gateway',   description: 'Validates JWT, checks rate limit, transforms', highlight: true  },
        { label: 'Routes',        description: 'Routes to correct microservice by API path',  highlight: false },
        { label: 'Coexist',       description: 'Edge: reverse proxy. App layer: API gateway', highlight: false },
      ],
      example: 'Stripe uses both. Cloudflare sits at the edge as a reverse proxy handling DDoS protection, SSL termination, and global routing. Behind Cloudflare, Stripe has their own API Gateway that validates API keys (each Stripe account has a unique sk_live key), enforces rate limits per account, routes to the correct internal service, and tracks API usage for their developer dashboard.',
    },
  },

  // 4. Request Routing and Forwarding
  {
    order: 4, type: 'content', title: 'Request Routing and Forwarding',
    content: {
      overview: 'Request routing is the core function of an API Gateway - deciding which backend service should handle each incoming request. Routing rules map incoming request properties (URL path, HTTP method, headers, query parameters) to upstream services.\n\nGetting routing right means clients use clean, stable URLs while backends can be restructured freely.',
      sections: [
        { heading: 'Path-Based Routing', body: 'The most common routing type. Requests to /api/users/* go to the User Service. Requests to /api/orders/* go to the Order Service. The gateway strips or rewrites the path before forwarding - a client calls /api/users/123 and the gateway forwards /123 to the User Service internal URL. This way internal service URLs can be completely different from client-facing URLs.', code: null },
        { heading: 'Header and Method Based Routing', body: 'Route based on any part of the request. Route POST /api/orders to the order creation service but GET /api/orders to a read-optimised replica. Route requests with header X-API-Version: v2 to the new service while v1 requests go to the old service. Route based on the Accept-Language header to serve localised backends. This flexibility enables A/B testing, gradual migrations, and canary deployments.', code: null },
        { heading: 'URL Rewriting and Path Manipulation', body: 'The gateway can rewrite URLs before forwarding. Strip the /api prefix so the backend only sees /users/123. Add a path prefix when the backend expects it. Replace path segments. Redirect /old-endpoint to /new-endpoint. This decouples the public API surface from how internal services are structured, letting you restructure backends without changing client-facing URLs.', code: null },
        { heading: 'Upstream Connection Management', body: 'When forwarding requests, the gateway maintains a connection pool to each upstream service. Connection pooling avoids the overhead of creating a new TCP connection for every request. The gateway handles retries for transient failures, timeouts per upstream, circuit breaking to stop forwarding to unhealthy services, and health checks to discover which upstream instances are available.', code: null },
      ],
      animationSteps: [
        { label: 'Request',      description: 'GET /api/users/123 arrives at gateway',        highlight: false },
        { label: 'Route match',  description: '/api/users/* matches User Service rule',        highlight: true  },
        { label: 'Rewrite',      description: 'Strip /api prefix: forward GET /users/123',    highlight: true  },
        { label: 'Forward',      description: 'Send to user-service:8080/users/123',          highlight: false },
        { label: 'Response',     description: 'Service responds, gateway returns to client',  highlight: false },
      ],
      example: 'GitHub uses their API Gateway to route requests to different backend teams. /api/repos/* routes to the Repository Service team. /api/pulls/* routes to the Pull Request Service team. /api/actions/* routes to the Actions Service team. Each team owns their service and can refactor internal URLs freely - the gateway URL mapping is the only contract with clients.',
    },
  },

  // 5. Authentication and Authorization
  {
    order: 5, type: 'content', title: 'Authentication and Authorization',
    content: {
      overview: 'The API Gateway is the ideal place to enforce authentication and authorization centrally. Every request passes through the gateway, so authenticating here means no individual service needs to implement auth logic.\n\nThis prevents auth bypass bugs (where a developer forgets to add auth to a new service endpoint) and ensures consistent auth behavior across all services.',
      sections: [
        { heading: 'JWT Validation at the Gateway', body: 'The most common approach is JWT-based authentication. Clients log in and receive a JWT token. On every subsequent request, they include the token in the Authorization header. The gateway validates the token signature, checks expiry, and extracts user information. Valid requests are forwarded to the backend with user context added as headers. The backend never sees unauthenticated requests.', code: null },
        { heading: 'API Key Authentication', body: 'API key auth is used for machine-to-machine communication and public APIs. Each client (developer, third-party app) gets a unique API key. The gateway validates the key on every request, identifies which client it belongs to, checks if that client is allowed to call this endpoint, and tracks usage per key. Stripe, Twilio, and SendGrid all use API key authentication for their developer APIs.', code: null },
        { heading: 'OAuth 2.0 and Scopes', body: 'OAuth 2.0 is the standard for delegated authorization. A user grants your app permission to access their data on another service. The gateway validates OAuth tokens and checks scopes - permissions granted with the token. A token with scope read:orders can access GET /orders but not POST /orders. The gateway enforces scope rules, keeping fine-grained authorization logic in one place.', code: null },
        { heading: 'Forwarding Auth Context', body: 'After validating auth, the gateway adds user context to the forwarded request. It adds headers like X-User-ID: 123 and X-User-Role: admin. Backend services trust these headers (they only arrive via the gateway, never directly from clients) and use them for business logic without re-validating tokens themselves. This is called the trusted subsystem pattern.', code: null },
      ],
      animationSteps: [
        { label: 'Request + JWT', description: 'Client sends request with Bearer token',      highlight: false },
        { label: 'Validate JWT',  description: 'Gateway validates signature and expiry',      highlight: true  },
        { label: 'Extract claims', description: 'Get user_id, role from token payload',      highlight: true  },
        { label: 'Add headers',   description: 'Forward: X-User-ID, X-User-Role headers',    highlight: false },
        { label: 'Backend',       description: 'Service trusts gateway headers, no re-auth',  highlight: false },
      ],
      example: 'Twilio\'s API Gateway validates API keys on every inbound request. Each of Twilio\'s 300,000+ developer customers has a unique Account SID and Auth Token. The gateway validates credentials, identifies the account, checks if it has sufficient balance and permissions to make the requested call, then forwards to the appropriate service with account context injected. No individual Twilio service handles authentication.',
    },
  },

  // 6. Rate Limiting and Throttling
  {
    order: 6, type: 'content', title: 'Rate Limiting and Throttling',
    content: {
      overview: 'Rate limiting controls how many requests a client can make in a given time window. Without it, a single client can flood your API with thousands of requests per second, overwhelming your backend and degrading service for everyone else.\n\nThe API Gateway enforces rate limits at the edge before requests reach your services, protecting backends from overload.',
      sections: [
        { heading: 'Why Rate Limiting Matters', body: 'Three scenarios where rate limiting is essential. Preventing accidental abuse: a client has a bug and sends requests in a tight loop - without limits they can bring down your API. Preventing intentional abuse: a competitor or attacker sends thousands of requests to extract your data. Fair usage: in a multi-tenant API, one heavy customer should not degrade performance for others. Rate limiting is the primary defence against all three.', code: null },
        { heading: 'Rate Limiting Algorithms', body: 'Fixed window: count requests in 1-minute windows. Simple but allows bursting at window boundaries. Sliding window: count requests in the past 60 seconds from now. More accurate but more complex. Token bucket: a bucket refills at a fixed rate, each request consumes one token. Allows controlled bursting. Leaky bucket: requests drain from a queue at a fixed rate - smooths traffic spikes. Token bucket is the most widely used algorithm.', code: null },
        { heading: 'Rate Limit Granularity', body: 'Rate limits can be applied at different levels. Global: total requests per second across all clients. Per IP: limits per source IP address - stops basic DDoS. Per API key: limits per authenticated client - fair usage. Per endpoint: different limits for expensive vs cheap operations (POST /search gets 10/min, GET /status gets 1000/min). Per user tier: free tier gets 100 req/day, paid tier gets 10,000 req/day.', code: null },
        { heading: 'Communicating Limits', body: 'When a request is rate limited, return HTTP 429 Too Many Requests with headers telling the client when to retry. X-RateLimit-Limit: 100 (your limit), X-RateLimit-Remaining: 0 (no requests left), X-RateLimit-Reset: 1640000000 (Unix timestamp when limit resets), Retry-After: 30 (seconds to wait). Well-behaved clients use these headers to back off automatically.', code: null },
      ],
      animationSteps: [
        { label: 'Client sends',  description: 'Client making rapid API requests',            highlight: false },
        { label: 'Count check',   description: 'Gateway checks counter in Redis: 98/100',    highlight: true  },
        { label: 'Limit hit',     description: 'Counter reaches 100 - limit exceeded',       highlight: true  },
        { label: '429 response',  description: 'Return 429 with Retry-After: 30 seconds',    highlight: false },
        { label: 'Reset',         description: 'Window resets, client can resume after 30s', highlight: false },
      ],
      example: 'GitHub\'s REST API enforces rate limits at their API Gateway. Unauthenticated requests: 60 per hour per IP. Authenticated requests: 5,000 per hour per token. The Search API: 30 per minute. GraphQL API: 5,000 points per hour (each query costs points based on complexity). All enforced at the gateway, all communicated via X-RateLimit headers, all stored in Redis shared across all gateway instances.',
    },
  },

  // 7. Request and Response Transformation
  {
    order: 7, type: 'content', title: 'Request and Response Transformation',
    content: {
      overview: 'The API Gateway can modify requests before forwarding them to backends and modify responses before returning them to clients. This transformation capability is powerful - it lets you present a clean, stable API to clients while backends use their own internal formats.\n\nTransformations can add, remove, or modify headers, query parameters, and body content.',
      sections: [
        { heading: 'Request Transformation', body: 'Before forwarding a request, the gateway can add or remove headers (inject internal auth headers, remove client-specific headers), modify query parameters (add default values, normalise parameter names), transform the request body (convert XML to JSON, rename fields, add or remove fields), and change the HTTP method (convert PUT to PATCH for legacy backends). This lets clients use modern formats while legacy backends keep their existing interface.', code: null },
        { heading: 'Response Transformation', body: 'Before returning a response to the client, the gateway can transform the body (add standard wrapper {data: ..., meta: ...}), remove sensitive internal fields (internal IDs, database keys), add CORS headers, compress the response, add cache headers, rename fields to match the public API specification, and convert between formats (backend returns XML, client expects JSON).', code: null },
        { heading: 'Protocol Translation', body: 'The gateway can translate between protocols. Clients call a REST API over HTTP/1.1. The gateway translates and forwards to a gRPC backend over HTTP/2. The client never knows gRPC is used internally. Similarly, translate HTTP to WebSocket for real-time backends, REST to GraphQL queries, or synchronous HTTP to async message queues by accepting the request, publishing to Kafka, and returning 202 Accepted immediately.', code: null },
        { heading: 'Versioning via Transformation', body: 'API versioning is cleanly handled through transformation. Clients call /v1/users. The v1 request format (firstName, lastName) is transformed to the current internal format (first_name, last_name) by the gateway. When you release v2 with a new format, add a new transformation rule. Old v1 clients keep working because the gateway translates for them. This extends the life of old API versions without keeping old backend code.', code: null },
      ],
      animationSteps: [
        { label: 'Client sends',  description: 'POST /v1/users with XML body',               highlight: false },
        { label: 'Transform req', description: 'Gateway converts XML to JSON for backend',    highlight: true  },
        { label: 'Add headers',   description: 'Inject X-User-ID, remove client headers',    highlight: true  },
        { label: 'Backend resp',  description: 'Backend returns JSON with internal fields',  highlight: false },
        { label: 'Transform resp', description: 'Remove internal fields, wrap in {data:...}', highlight: false },
      ],
      example: 'PayPal used API transformation to migrate their legacy SOAP APIs to REST. Their gateway receives REST requests from modern clients, transforms them into SOAP format, and forwards to legacy backend services. The legacy services were never changed. Modern clients see clean REST APIs. The transformation happens entirely in the gateway layer - completely transparent to both sides.',
    },
  },

  // 8. API Aggregation and Composition
  {
    order: 8, type: 'content', title: 'API Aggregation and Composition',
    content: {
      overview: 'API aggregation means combining multiple backend service calls into a single client-facing API call. Instead of a mobile app making 4 separate API calls to load a dashboard, the gateway makes all 4 calls in parallel and returns one combined response.\n\nThis is critical for mobile performance where each network round-trip adds 50-200ms of latency.',
      sections: [
        { heading: 'The Problem Without Aggregation', body: 'A mobile app loading a user dashboard might need: the user profile, their recent orders, their notification count, and their loyalty points. Without aggregation, the app makes 4 separate API calls. On a mobile network with 100ms latency each, that is 400ms just in network time, plus the time for each service to respond. On a slow connection, this becomes seconds of loading time.', code: null },
        { heading: 'Gateway-Level Aggregation', body: 'With aggregation, the client makes one call: GET /api/dashboard. The gateway simultaneously calls the User Service, Order Service, Notification Service, and Loyalty Service in parallel. When all respond, it combines the results into one JSON response and returns it to the client. The client waits for one round trip. The total time is max(service response times) not the sum.', code: null },
        { heading: 'GraphQL as an Aggregation Layer', body: 'GraphQL naturally solves aggregation. The client sends one query specifying exactly what data it needs. The GraphQL server resolves each field by calling the appropriate backend service. Apollo Federation is a specific pattern where each microservice owns part of the GraphQL schema and the gateway federates queries across them. The client gets a unified API without knowing how many services exist.', code: null },
        { heading: 'Partial Failures in Aggregation', body: 'When aggregating 4 service calls, what if one fails? The gateway must handle partial failures gracefully. Option 1: fail the entire request if any service fails (strict). Option 2: return partial data with null for failed services (resilient). Option 3: return cached or default data for failed services. The right choice depends on whether each piece is critical or optional for the client.', code: null },
      ],
      animationSteps: [
        { label: 'Client call',   description: 'GET /api/dashboard - single client request',  highlight: false },
        { label: 'Parallel calls', description: 'Gateway calls User, Orders, Notifs in parallel', highlight: true },
        { label: 'All respond',   description: 'All 3 services respond independently',        highlight: true  },
        { label: 'Aggregate',     description: 'Gateway combines all into one JSON response', highlight: false },
        { label: 'One response',  description: 'Client gets full dashboard data in one call', highlight: false },
      ],
      example: 'The Twitter mobile app\'s home screen was originally 12 separate API calls. After implementing aggregation at their gateway (Twitter called it BFF - Backend for Frontend), the home screen became 1 API call. The gateway makes the 12 internal calls in parallel. This reduced home screen load time by 60% on mobile networks because the number of client round trips dropped from 12 to 1.',
    },
  },

  // 9. API Gateway Security and Monitoring
  {
    order: 9, type: 'content', title: 'Security and Monitoring',
    content: {
      overview: 'The API Gateway is the ideal location for security enforcement and monitoring because it sees 100% of traffic. Every request and response passes through it, making it the perfect observation point.\n\nSecurity at the gateway protects all backend services uniformly. Monitoring at the gateway gives a complete picture of API health without instrumenting each service separately.',
      sections: [
        { heading: 'Security at the Gateway', body: 'The gateway enforces: TLS termination (all traffic encrypted in transit), input validation (reject malformed requests before they reach services), IP allowlisting and blocklisting (deny known bad actors), DDoS protection (rate limiting, connection limiting), WAF rules (block common attack patterns - SQL injection, XSS), and mutual TLS between the gateway and internal services (service-to-service encryption).', code: null },
        { heading: 'Request Logging', body: 'Every request through the gateway is logged: timestamp, client IP, HTTP method, URL, response code, latency, bytes transferred, and user identity (if authenticated). These logs feed into centralised logging (ELK stack, Datadog, Splunk). You can answer: which endpoints are most used? Who is hitting error 500s? Which clients have the highest latency? Where are suspicious patterns emerging?', code: null },
        { heading: 'Metrics and Alerting', body: 'The gateway exposes key metrics per endpoint and per client: requests per second, error rate (4xx and 5xx), P50/P95/P99 latency, and rate limit hits. Dashboards show API health in real time. Alerts fire when error rates exceed 1%, latency P99 exceeds 500ms, or a specific client suddenly sends 10x normal traffic. All from one observation point covering all services.', code: null },
        { heading: 'Distributed Tracing', body: 'The gateway assigns a correlation ID (trace ID) to every incoming request. This ID is forwarded to all downstream services in a header (X-Trace-ID). When a request fails or is slow, you search by trace ID in Jaeger or Zipkin to see the complete path across all services. The gateway is the natural entry point for trace ID generation since it sees every request first.', code: null },
      ],
      animationSteps: [
        { label: 'Request enters',  description: 'Request hits gateway - inspection begins',  highlight: false },
        { label: 'Security checks', description: 'TLS, IP block, WAF rules, input validation', highlight: true  },
        { label: 'Trace ID',        description: 'Unique trace ID assigned to request',        highlight: true  },
        { label: 'Metrics logged',  description: 'Latency, status, client tracked in metrics', highlight: false },
        { label: 'Alert',           description: 'Error rate >1% triggers alert to on-call',  highlight: false },
      ],
      example: 'Cloudflare processes 55 million HTTP requests per second as a combined reverse proxy, CDN, and WAF (Web Application Firewall). Every request passes through Cloudflare\'s security rules - blocking millions of malicious requests before they reach origin servers. Their analytics dashboard shows real-time threat maps, request rates, and performance metrics across every customer\'s API - all from one observation layer.',
    },
  },

  // 10. API Gateway in Practice
  {
    order: 10, type: 'content', title: 'API Gateway in Practice',
    content: {
      overview: 'Knowing the theory is one thing - running an API Gateway in production introduces practical challenges around performance, configuration management, and avoiding the gateway becoming a monolith itself.\n\nThis module covers the practical decisions: how to keep the gateway fast, how to manage configuration as it grows, and how to avoid common operational mistakes.',
      sections: [
        { heading: 'Performance Considerations', body: 'The gateway is in the critical path of every request. A gateway that adds 50ms to every request is unacceptable. Keep the gateway lean: do not put heavy business logic in it. Use in-memory caching for JWT public keys and route configurations. Keep plugin chains short. Set aggressive timeouts on upstream connections (500ms, not 30s). Use async logging (write to buffer, flush to log store in background). A well-configured gateway adds under 5ms overhead.', code: null },
        { heading: 'Configuration as Code', body: 'As your system grows, you might have hundreds of routes and policies. Managing these manually via a GUI is error-prone and not reproducible. Define all gateway configuration as code (YAML or JSON files in version control). Use a GitOps workflow: gateway configuration changes are pull requests, reviewed, tested in staging, then applied to production. Tools like Kong Deck and AWS CDK support infrastructure-as-code for gateway configuration.', code: null },
        { heading: 'Avoiding the Gateway Monolith', body: 'A common antipattern is putting too much logic in the gateway. Business rules like "if user is premium, route to the fast service" belong in backend services, not the gateway. If your gateway configuration becomes thousands of lines of complex routing logic and transformation scripts, it has become a monolith. The gateway should be transparent infrastructure - not a place to build features. Move complex logic back to services.', code: null },
        { heading: 'BFF Pattern', body: 'The Backend for Frontend (BFF) pattern creates separate gateway layers for different clients. A mobile BFF optimises responses for mobile (smaller payloads, offline-friendly formats). A web BFF returns full data for desktop browsers. A third-party BFF enforces strict rate limits for external developers. Each BFF is a thin layer that aggregates and adapts backend service responses for a specific client type.', code: null },
      ],
      animationSteps: [
        { label: 'Lean gateway',  description: 'Under 5ms overhead - no heavy logic',         highlight: false },
        { label: 'Config as code', description: 'Routes defined in YAML, reviewed as PRs',   highlight: true  },
        { label: 'BFF mobile',    description: 'Mobile BFF: small payloads, aggregated',      highlight: true  },
        { label: 'BFF web',       description: 'Web BFF: full data, rich responses',          highlight: false },
        { label: 'Separate',      description: 'Each client type gets its own optimised BFF', highlight: false },
      ],
      example: 'Netflix pioneered the BFF pattern. They have separate gateway layers for iOS, Android, Smart TV, Web, and their API for third-party developers. The iOS gateway returns compact responses optimised for mobile bandwidth. The Smart TV gateway returns pre-rendered layouts. The developer API enforces strict rate limits. Each BFF is independently deployable and optimised without affecting other clients.',
    },
  },

  // 11. Failure Cases
  {
    order: 11, type: 'failureCases', title: 'Failure Cases',
    failureCases: [
      {
        title: 'API Gateway as Single Point of Failure',
        scenario: 'A company runs a single API Gateway instance in front of all their microservices. A memory leak in the gateway causes it to crash. All 50 microservices are healthy and running but completely unreachable. Every client receives a connection refused error. The entire system is down because one gateway instance failed.',
        impact: 'Total outage across all services despite all backends being healthy. The gateway meant to protect services caused the outage.',
        resolution: 'Run at least 2 gateway instances across different availability zones behind a load balancer. The gateway must be stateless - all state (rate limit counters, auth cache) stored in Redis shared across instances. Monitor gateway health independently from backend health. Set up automated restart on crash.',
        animationSteps: [
          { label: 'GW crashes',    description: 'Single gateway instance goes down',          highlight: true  },
          { label: 'All blocked',   description: 'All 50 services healthy but unreachable',    highlight: true  },
          { label: 'Total outage',  description: 'Every client gets connection refused',       highlight: true  },
          { label: 'Root cause',    description: 'Gateway was a single point of failure',      highlight: false },
          { label: 'Fix',           description: 'Multiple GW instances across AZs + LB',     highlight: false },
        ],
      },
      {
        title: 'Rate Limiter State Lost on Gateway Restart',
        scenario: 'The gateway stores rate limit counters in its own local memory. When the gateway restarts during deployment, all counters reset to zero. Clients that were at their limit can immediately flood the system with requests again. A malicious client exploits this by timing their bursts to coincide with gateway deployments.',
        impact: 'Rate limiting becomes ineffective during deployments. Brief windows of unprotected traffic. Attack surface during routine maintenance.',
        resolution: 'Store all rate limit counters in Redis, not local memory. Redis persists across gateway restarts. Multiple gateway instances share the same counters via Redis. Rate limiting remains consistent regardless of which gateway instance handles a request or whether instances restart.',
        animationSteps: [
          { label: 'Counters in memory', description: 'Rate limit state in gateway local memory', highlight: true },
          { label: 'GW restarts',     description: 'Gateway restarts for deployment',           highlight: true  },
          { label: 'Counters reset',  description: 'All rate limit counters back to zero',      highlight: true  },
          { label: 'Burst allowed',   description: 'Client floods API - no limits in effect',  highlight: false },
          { label: 'Fix',             description: 'Store counters in Redis - persists restarts', highlight: false },
        ],
      },
      {
        title: 'Gateway Timeout Cascades to All Clients',
        scenario: 'An upstream service starts responding slowly (5 seconds per request). The gateway has a 30-second upstream timeout. For every client request, the gateway waits up to 30 seconds for the upstream response. Gateway connection pool is exhausted. Other healthy services become unreachable through the gateway because all connections are tied up waiting for the slow service.',
        impact: 'One slow upstream service causes all services to become unreachable through the gateway. Total effective outage despite only one service being slow.',
        resolution: 'Set short upstream timeouts (500ms-1s) per service. Implement circuit breakers at the gateway level - after 5 failures, trip the circuit and immediately return 503 for that upstream. Use bulkheads to separate connection pools per upstream service so one slow service cannot consume the entire connection pool.',
        animationSteps: [
          { label: 'Service B slow', description: 'Upstream Service B takes 30s to respond',  highlight: true  },
          { label: 'Connections fill', description: 'All gateway connections waiting for B',  highlight: true  },
          { label: 'Other blocked',  description: 'Services A, C, D now unreachable via GW',  highlight: true  },
          { label: 'All down',       description: 'One slow service brought down everything', highlight: false },
          { label: 'Fix',            description: '500ms timeout + circuit breaker per upstream', highlight: false },
        ],
      },
      {
        title: 'JWT Public Key Not Rotated',
        scenario: 'The authentication service rotates its JWT signing keys every 90 days. The API Gateway caches the JWT public key in memory for performance. The cache TTL is set to never expire. After key rotation, the gateway still validates tokens with the old public key. All new JWT tokens (signed with the new key) fail validation. Every authenticated user is suddenly logged out.',
        impact: 'All users locked out of the system. Every API request returns 401 Unauthorized. Requires emergency gateway configuration update and clear cache operation.',
        resolution: 'Use a short TTL for JWT public key cache (1 hour max). Implement key rotation discovery via a JWKS endpoint - the gateway fetches the current public keys from the auth service periodically. When a token validation fails, try fetching fresh keys before returning 401 - handles the brief transition window during rotation.',
        animationSteps: [
          { label: 'Key rotated',   description: 'Auth service rotates JWT signing key',       highlight: false },
          { label: 'Old key cached', description: 'Gateway still uses old public key from cache', highlight: true },
          { label: 'New tokens fail', description: 'All new JWTs signed with new key rejected', highlight: true },
          { label: 'All logged out', description: 'Every user gets 401 Unauthorized',          highlight: true  },
          { label: 'Fix',           description: 'Short TTL cache + JWKS endpoint refresh',    highlight: false },
        ],
      },
      {
        title: 'Business Logic Creep in Gateway',
        scenario: 'Over 2 years, the team adds business logic to the gateway: route to premium service if user.tier == gold, calculate discount codes in the gateway transformation layer, run A/B test assignments in gateway scripts, validate complex business rules before forwarding. The gateway becomes a 50,000-line configuration file. Any change requires a gateway deployment. Three teams cannot deploy their services independently anymore.',
        impact: 'The gateway has become a distributed monolith. All teams are blocked waiting for gateway deployments. Testing gateway changes requires a full integration test. The original benefit of microservices - independent deployment - is lost.',
        resolution: 'Enforce a strict rule: the gateway handles only infrastructure concerns (auth, rate limiting, routing, TLS, logging). All business logic belongs in backend services. Conduct a quarterly audit and move business logic out of the gateway. Use the strangler fig pattern to migrate complex gateway logic back into dedicated services.',
        animationSteps: [
          { label: 'Year 1',        description: 'Gateway: auth, routing, rate limiting',      highlight: false },
          { label: 'Year 2',        description: 'Added: business rules, A/B tests, pricing',  highlight: true  },
          { label: 'Year 3',        description: '50K line config - all teams blocked on GW',  highlight: true  },
          { label: 'Monolith again', description: 'Independent deployment lost - back to square 1', highlight: true },
          { label: 'Fix',           description: 'Strict rule: infra only in gateway',         highlight: false },
        ],
      },
    ],
  },

  // 12. Interview Questions
  {
    order: 12, type: 'interview', title: 'Interview Discussion Questions',
    interviewQuestions: [
      {
        question: 'What is an API Gateway and why would you use one in a microservices architecture?',
        answer: 'An API Gateway is the single entry point for all external clients. It handles cross-cutting concerns that every service would otherwise need to implement individually: authentication (validate JWT or API key), rate limiting (prevent abuse), routing (which URL maps to which service), request/response transformation (format adaptation), and aggregation (combine multiple service calls into one client-facing API). Without a gateway, each service handles these independently leading to inconsistency and duplication. The gateway also shields clients from internal service topology - you can refactor backend services freely without changing client-facing URLs.',
        difficulty: 'medium',
      },
      {
        question: 'How does authentication work at the API Gateway level?',
        answer: 'The gateway validates credentials on every inbound request before forwarding. For JWT: validate the token signature using the auth service public key, check expiry, extract user claims from the payload. For API keys: look up the key in a database or cache to identify the client and their permissions. After validation, the gateway adds context to the forwarded request - X-User-ID, X-User-Role headers. Backend services trust these headers (they can only arrive from the gateway, never directly from external clients). This is the trusted subsystem pattern. Services never re-validate tokens, keeping auth logic centralised.',
        difficulty: 'medium',
      },
      {
        question: 'What is the difference between an API Gateway and a reverse proxy?',
        answer: 'A reverse proxy (NGINX, HAProxy) operates at the infrastructure level - SSL termination, load balancing, URL-based routing. It does not understand API semantics. An API Gateway operates at the application level - it understands what a JWT token is and validates it, knows how to apply rate limits per API key, can transform request bodies, and can aggregate multiple service calls. Think of a reverse proxy as a dumb forwarder and an API Gateway as an intelligent middleware layer. They often coexist: reverse proxy at the edge for SSL and DDoS protection, API Gateway behind it for application-level concerns.',
        difficulty: 'medium',
      },
      {
        question: 'How do you implement rate limiting at the API Gateway? What algorithms are used?',
        answer: 'Store rate limit counters in Redis so they are shared across all gateway instances and survive restarts. Token bucket is the most common algorithm: a bucket of capacity N refills at rate R tokens per second. Each request consumes one token. If the bucket is empty, return 429 Too Many Requests. Apply limits at multiple granularities: per IP for basic DDoS protection, per API key for fair usage between clients, per endpoint for expensive operations. Return X-RateLimit-Limit, X-RateLimit-Remaining, and Retry-After headers so clients know when to back off. Redis INCR + EXPIRE commands implement fixed window counting in two atomic operations.',
        difficulty: 'medium',
      },
      {
        question: 'What is the BFF (Backend for Frontend) pattern and when would you use it?',
        answer: 'BFF creates a separate gateway layer per client type. A mobile BFF returns compact payloads aggregated from multiple services and optimised for bandwidth constraints. A web BFF returns rich data for desktop browsers. A partner API BFF enforces strict rate limits and provides a stable versioned API for external developers. Use BFF when different clients have fundamentally different data needs or performance constraints - instead of one API trying to serve all clients suboptimally. Each BFF is independently deployable and can evolve with its client without affecting others. Netflix, SoundCloud, and Twitter all use this pattern.',
        difficulty: 'medium',
      },
      {
        question: 'How would you handle an upstream service being slow or down at the API Gateway level?',
        answer: 'Circuit breaker at the gateway level: after N failures in a time window, trip open and immediately return 503 for that upstream without even attempting the call. This prevents timeout cascades where one slow service consumes all gateway connections. Short upstream timeouts (500ms maximum) - never let a single upstream hold a connection for 30 seconds. Bulkheads: separate connection pools per upstream service so one slow service cannot starve others. For non-critical services, return a graceful fallback (cached response, default value) instead of an error. Retry with exponential backoff for transient failures but only for idempotent operations.',
        difficulty: 'hard',
      },
      {
        question: 'What is API aggregation and why is it important for mobile clients?',
        answer: 'API aggregation combines multiple backend service calls into one client-facing API call. A mobile dashboard loading user profile, recent orders, notification count, and loyalty points would normally need 4 API calls. On mobile with 100ms latency each, that is 400ms just in network time. With aggregation, the gateway makes all 4 calls in parallel and returns one response. Client waits one round trip, total time is max(service times) not the sum. Critical for mobile because network round trips are expensive (latency, battery, data usage). GraphQL is a natural aggregation layer. The gateway pattern of one client call triggering N parallel backend calls was called BFF at Twitter and reduced home screen load time by 60%.',
        difficulty: 'medium',
      },
      {
        question: 'What antipatterns should you avoid with an API Gateway?',
        answer: 'Single point of failure: one gateway instance with no redundancy - fix with multiple instances + load balancer. Storing state locally: rate limit counters or auth cache in local memory - fix with Redis. Business logic in the gateway: routing conditions based on business rules, feature flags, pricing logic - fix by keeping the gateway as pure infrastructure. Overly long plugin chains: 20 plugins per request adding significant latency - fix by profiling and removing unnecessary plugins. Tight coupling: gateway configuration that knows internal service details (database schemas, internal IDs) that break when services change - fix with clean API contracts. The gateway should be transparent infrastructure, not a feature development platform.',
        difficulty: 'hard',
      },
    ],
  },

  // 13. Quiz
  {
    order: 13, type: 'quiz', title: 'API Gateway Quiz',
    quizConfig: {
      timeLimitSeconds: 600, maxAttempts: 3, passingPercent: 70,
      questions: [
        {
          question: 'Without an API Gateway, what problem arises when clients need data from multiple microservices?',
          options: ['Services cannot communicate with each other', 'Clients must call each service directly, leaking internal architecture', 'Services share a database causing data conflicts', 'Authentication cannot be implemented'],
          correctIndex: 1, scenario: true,
          explanation: 'Without a gateway, clients know the address of every service. When you refactor a service (rename it, split it, move it), every client breaks. The gateway provides a stable public API surface while backends can change freely behind it.',
        },
        {
          question: 'A single API Gateway instance crashes. What happens to all backend microservices?',
          options: ['Services continue serving traffic directly', 'All services become unreachable despite being healthy', 'Only the crashed service is affected', 'Traffic automatically routes to a backup gateway'],
          correctIndex: 1, scenario: true,
          explanation: 'Total outage. The gateway is the single entry point - if it fails, nothing can reach the healthy backends. This is why running a single gateway instance is a critical antipattern. Always run multiple gateway instances behind a load balancer across different availability zones.',
        },
        {
          question: 'What is the key difference between an API Gateway and a reverse proxy like NGINX?',
          options: ['API gateways are faster than reverse proxies', 'API gateways understand application semantics (JWT validation, rate limiting per key), reverse proxies handle infrastructure (SSL, load balancing)', 'Reverse proxies support microservices, API gateways do not', 'API gateways only work with REST APIs'],
          correctIndex: 1, scenario: false,
          explanation: 'A reverse proxy is infrastructure-level: SSL termination, load balancing, URL routing. It does not understand what a JWT token is or how to validate it. An API Gateway is application-level: validates JWTs, enforces per-client rate limits, transforms payloads, aggregates responses. They often coexist.',
        },
        {
          question: 'After the JWT signing key is rotated, all users suddenly get 401 errors. What likely caused this?',
          options: ['Rate limiting blocked all users simultaneously', 'The gateway cached the old JWT public key with no expiry', 'The database went offline', 'The token format changed'],
          correctIndex: 1, scenario: true,
          explanation: 'Stale JWT public key cache. When the auth service rotates its signing key, the gateway must fetch the new public key. If it cached the old key with no TTL, it keeps validating tokens against the old key - all new tokens (signed with the new key) fail. Fix: short TTL on public key cache + JWKS endpoint for automatic rotation discovery.',
        },
        {
          question: 'A mobile app makes 4 separate API calls to load a dashboard. Using API Gateway aggregation, how many calls does the app make?',
          options: ['4 calls - aggregation does not reduce client calls', '1 call - gateway makes 4 backend calls in parallel and returns one response', '2 calls - gateway combines some but not all', '0 calls - data is pushed to the client'],
          correctIndex: 1, scenario: true,
          explanation: 'API aggregation reduces client calls to 1. The gateway makes all 4 backend calls in parallel. Total client wait time = max(4 service times), not the sum. On mobile with 100ms latency per round trip, going from 4 calls to 1 saves 300ms in network time alone.',
        },
        {
          question: 'Rate limit counters are stored in the API Gateway local memory. The gateway restarts. What happens?',
          options: ['Counters are preserved automatically', 'All counters reset to zero, rate limits are ineffective until limits are reached again', 'The gateway refuses to start without counters', 'Clients are blocked until counters reload'],
          correctIndex: 1, scenario: true,
          explanation: 'Counter reset. All clients get a fresh window after every gateway restart. A malicious client can exploit this by timing bursts to coincide with deployments. Fix: store all rate limit counters in Redis. Counters persist across gateway restarts and are shared across all gateway instances.',
        },
        {
          question: 'The API Gateway adds JWT validation, pricing calculations, A/B test logic, and business rules over 2 years. What antipattern is this?',
          options: ['Gateway as single point of failure', 'Business logic creep - gateway becoming a distributed monolith', 'Lack of rate limiting', 'Poor routing configuration'],
          correctIndex: 1, scenario: true,
          explanation: 'Business logic creep. When business logic accumulates in the gateway, teams cannot deploy independently because every change requires a gateway deployment. The gateway has become a monolith again. The gateway should only handle infrastructure concerns: auth validation, rate limiting, routing, SSL, logging. Business logic belongs in backend services.',
        },
        {
          question: 'Service B upstream is slow (30s responses). Without circuit breaking at the gateway, what happens?',
          options: ['Only Service B requests are affected', 'Gateway connections fill up with B requests, blocking all other services', 'The gateway automatically redirects to a healthy instance', 'Rate limiting activates for Service B'],
          correctIndex: 1, scenario: true,
          explanation: 'Cascade failure. All gateway connections are consumed waiting for Service B to respond. Services A, C, D - all healthy - become unreachable because no connections are available for them. Fix: short timeout (500ms) per upstream + circuit breaker that trips after 5 failures + bulkhead (separate connection pool per upstream).',
        },
        {
          question: 'What does the BFF (Backend for Frontend) pattern achieve?',
          options: ['One API gateway serves all client types identically', 'Separate gateway layers optimised for each client type (mobile, web, partner API)', 'Backend services are hidden from all clients', 'Frontend code runs in the gateway'],
          correctIndex: 1, scenario: false,
          explanation: 'BFF creates separate gateway layers per client type. Mobile BFF: compact payloads, aggregated for bandwidth constraints. Web BFF: rich data for desktop. Partner API BFF: strict rate limits, stable versioning. Each BFF evolves independently with its client. Netflix uses separate BFFs for iOS, Android, Smart TV, and Web clients.',
        },
        {
          question: 'After JWT validation at the gateway, how do backend services know which user made the request?',
          options: ['Services re-validate the JWT token themselves', 'The gateway adds X-User-ID and X-User-Role headers to the forwarded request', 'Services query the auth service directly', 'The user ID is in the URL path'],
          correctIndex: 1, scenario: false,
          explanation: 'Gateway injects trusted headers. After validating the JWT, the gateway extracts user claims and adds them as internal headers (X-User-ID, X-User-Role) to the forwarded request. Backend services trust these headers because requests can only arrive from the gateway, never directly from external clients. Services never re-validate tokens - this is the trusted subsystem pattern.',
        },
      ],
    },
  },
];

module.exports = API_GATEWAY_MODULES;
