// Static Load Balancing content - 13 modules total
// Orders 1-10: content topics
// Order 11: Failure Cases
// Order 12: Interview Discussion Questions
// Order 13: Quiz

const LOAD_BALANCING_MODULES = [

  // ── 1. Load Balancing Fundamentals ───────────────────────────────────────
  {
    order: 1, type: 'content', title: 'Load Balancing Fundamentals',
    content: {
      overview: 'Imagine a single cashier at a supermarket trying to serve 10,000 customers at once. That cashier would collapse. The solution is to open more checkout lanes and direct customers evenly across all of them. A load balancer does exactly this for your servers.\n\nA load balancer sits in front of your servers and distributes incoming requests across them so no single server gets overwhelmed. It is one of the most fundamental components in any scalable web system.',
      sections: [
        {
          heading: 'What is a Load Balancer?',
          body: 'A load balancer is a device or software that accepts incoming network traffic and distributes it across a pool of backend servers. Clients talk to the load balancer\'s single IP address. They have no idea how many servers are behind it or which one handled their request. The load balancer makes that decision transparently.',
          code: null,
        },
        {
          heading: 'Why Load Balancing Matters',
          body: 'Without a load balancer, all traffic hits one server. When that server reaches its limit - CPU at 100%, memory full, too many open connections - every request fails or slows to a crawl. With a load balancer and multiple servers, load is shared. If one server crashes, the load balancer routes around it. You can add more servers without changing your DNS or client code.',
          code: null,
        },
        {
          heading: 'What a Load Balancer Does',
          body: 'A load balancer does more than just distribute traffic. It performs health checks (continuously pinging servers to detect failures), terminates SSL/TLS so backend servers don\'t need to handle encryption, rate limits clients to prevent abuse, and collects metrics on request counts, response times, and error rates across all servers.',
          code: null,
        },
        {
          heading: 'Hardware vs Software Load Balancers',
          body: 'Hardware load balancers are dedicated physical appliances - very fast but extremely expensive (tens of thousands of dollars) and inflexible. Software load balancers run on commodity servers or in the cloud. NGINX and HAProxy are open-source software load balancers. AWS ALB, GCP Cloud Load Balancing, and Azure Load Balancer are cloud-managed options. Most modern systems use software or cloud load balancers.',
          code: null,
        },
      ],
      animationSteps: [
        { label: 'Clients', description: 'Thousands of users send requests', highlight: false },
        { label: 'Load Balancer', description: 'Single entry point receives all traffic', highlight: true },
        { label: 'Server 1', description: 'Handles its share of requests', highlight: false },
        { label: 'Server 2', description: 'Handles its share in parallel', highlight: false },
        { label: 'Server 3', description: 'Load evenly distributed - no server overwhelmed', highlight: false },
      ],
      example: 'Google handles over 8.5 billion searches per day. No single server could come close to handling that. Google uses multiple layers of load balancers - from DNS-level geographic routing all the way down to application-level balancers inside each data center - to distribute that traffic across hundreds of thousands of servers worldwide.',
    },
  },

  // ── 2. Types of Load Balancers (Layer 4 vs Layer 7) ─────────────────────
  {
    order: 2, type: 'content', title: 'Types of Load Balancers',
    content: {
      overview: 'Not all load balancers work the same way. The most important distinction is which layer of the network stack they operate at. Layer 4 load balancers work at the transport level (TCP/UDP) and are extremely fast. Layer 7 load balancers work at the application level (HTTP/HTTPS) and are more intelligent but slightly slower.\n\nUnderstanding this difference is critical for system design because it determines what routing decisions you can make.',
      sections: [
        {
          heading: 'Layer 4 Load Balancer (Transport Layer)',
          body: 'A Layer 4 load balancer works with TCP and UDP packets. It sees the source IP, destination IP, and port number - but it cannot read the actual content of the request. Routing decisions are based purely on network information. Because it does not need to inspect HTTP headers or URLs, it is extremely fast and has very low latency. It is ideal when you need raw throughput for non-HTTP traffic like database connections or game servers.',
          code: null,
        },
        {
          heading: 'Layer 7 Load Balancer (Application Layer)',
          body: 'A Layer 7 load balancer understands HTTP and HTTPS. It can read request headers, URLs, cookies, and even request bodies before making a routing decision. This enables powerful features: route /api/* to API servers and /static/* to CDN, route requests with a specific cookie to a specific server, route based on the logged-in user\'s ID, and decompress and inspect requests. AWS ALB and NGINX operate at Layer 7.',
          code: null,
        },
        {
          heading: 'Content-Based Routing',
          body: 'Layer 7 enables content-based routing - directing traffic based on what is in the request. A single domain can serve multiple services: requests to /api go to your Node.js servers, requests to /images go to your media servers, requests to /checkout go to your payment servers. The client uses one URL; the load balancer figures out which backend to use. This is sometimes called URL-based or path-based routing.',
          code: null,
        },
        {
          heading: 'When to Use Each',
          body: 'Use Layer 4 when you need maximum throughput with minimum latency, for non-HTTP protocols (database, game servers, streaming), or when content inspection is not needed. Use Layer 7 for web applications where you need URL-based routing, A/B testing, authentication offloading, or SSL termination with request inspection. Most web applications use Layer 7. Layer 4 is used for the outer edge or for non-HTTP services.',
          code: null,
        },
      ],
      animationSteps: [
        { label: 'Client request', description: 'HTTP request arrives at load balancer', highlight: false },
        { label: 'L4: TCP only', description: 'Layer 4 sees IP + port, routes blindly by network', highlight: true },
        { label: 'L7: reads HTTP', description: 'Layer 7 reads URL, headers, cookies', highlight: true },
        { label: 'Path routing', description: '/api to API servers, /images to media servers', highlight: false },
        { label: 'Response', description: 'Correct backend serves the request', highlight: false },
      ],
      example: 'Netflix uses both layers. At the edge, Layer 4 balancers handle the raw TCP connections from millions of streaming devices globally - pure throughput, no HTTP inspection needed. Inside the data center, Layer 7 balancers route API requests to the correct microservice based on the URL path and authentication headers.',
    },
  },

  // ── 3. Load Balancing Algorithms ─────────────────────────────────────────
  {
    order: 3, type: 'content', title: 'Load Balancing Algorithms',
    content: {
      overview: 'Once the load balancer receives a request, it needs to decide which server to send it to. The algorithm it uses determines how load gets distributed. Different algorithms suit different traffic patterns and server configurations.\n\nChoosing the wrong algorithm can mean one server is at 90% while another is at 10% - defeating the purpose of load balancing entirely.',
      sections: [
        {
          heading: 'Stateless Algorithms',
          body: 'Stateless algorithms make a routing decision based only on information available right now - they do not track history. Round Robin, Weighted Round Robin, and Random are stateless. They are simple and fast because the load balancer does not need to maintain any state. They work well when all requests are similar in cost and all servers are similar in capacity.',
          code: null,
        },
        {
          heading: 'Dynamic Algorithms',
          body: 'Dynamic algorithms track the current state of each server before making a decision. Least Connections sends the next request to the server with the fewest active connections right now. Resource-based algorithms query each server\'s current CPU and memory before routing. Dynamic algorithms are more complex but distribute load more fairly when requests vary significantly in processing time.',
          code: null,
        },
        {
          heading: 'Hashing Algorithms',
          body: 'Hashing algorithms compute a hash of some property of the request - the client IP address, a session cookie, or a URL - and map the result to a server. The key property is that the same input always maps to the same server. This provides session affinity (the same client always hits the same server) without requiring the load balancer to store session state. IP Hash and Consistent Hashing are in this category.',
          code: null,
        },
        {
          heading: 'Choosing the Right Algorithm',
          body: 'For a homogeneous cluster where all requests take similar time, Round Robin is fine. For clusters with servers of different capacities, use Weighted Round Robin. For long-lived connections like WebSockets or database connections, use Least Connections. For sessions that must stick to one server, use IP Hash or Consistent Hashing. In practice, Least Connections is the most broadly reliable choice for HTTP APIs.',
          code: null,
        },
      ],
      animationSteps: [
        { label: 'Request arrives', description: 'Load balancer receives new request', highlight: false },
        { label: 'Algorithm runs', description: 'Picks server based on chosen strategy', highlight: true },
        { label: 'Round Robin', description: 'Next server in rotation regardless of load', highlight: true },
        { label: 'Least Conn', description: 'Server with fewest active connections', highlight: false },
        { label: 'IP Hash', description: 'Same client IP always hits same server', highlight: false },
      ],
      example: 'Twitter uses a combination of algorithms. For most API requests they use Least Connections since tweet processing times vary widely. For their WebSocket connections (live notifications) they use IP Hashing to keep users on the same server for the duration of their connection. One cluster, two different algorithms for different traffic types.',
    },
  },

  // ── 4. Round-Robin and Weighted Round-Robin ───────────────────────────────
  {
    order: 4, type: 'content', title: 'Round-Robin and Weighted Round-Robin',
    content: {
      overview: 'Round Robin is the simplest load balancing algorithm and the default for most load balancers. It sends each request to the next server in a circular list. Request 1 goes to Server A, Request 2 to Server B, Request 3 to Server C, Request 4 back to Server A.\n\nWeighted Round Robin extends this by giving more capable servers a proportionally higher share of traffic.',
      sections: [
        {
          heading: 'How Round Robin Works',
          body: 'The load balancer maintains an ordered list of servers and a pointer to the current position. Each new request advances the pointer by one, wrapping back to the start when the end is reached. Every server receives exactly the same number of requests over time. It is O(1) - constant time - to make a routing decision. No state needs to be maintained other than the current pointer.',
          code: null,
        },
        {
          heading: 'When Round Robin Works Well',
          body: 'Round Robin is ideal when all servers have the same hardware specifications and all requests take roughly the same amount of time. A cluster of identical app servers handling stateless REST API calls is a perfect fit. Since every request is quick and servers are identical, distributing requests evenly distributes load evenly.',
          code: null,
        },
        {
          heading: 'The Problem with Round Robin',
          body: 'Round Robin breaks down when requests vary significantly in processing time. If Server A gets a 5ms request while Server B gets a 10-second database-heavy request, they are both counted as "1 request" by Round Robin. Server B becomes overloaded while Server A is idle. This is why Round Robin is not recommended for APIs where response times vary widely.',
          code: null,
        },
        {
          heading: 'Weighted Round Robin',
          body: 'Weighted Round Robin assigns a weight to each server proportional to its capacity. If Server A has 8 CPU cores and Server B has 4, assign weight 2 to A and weight 1 to B. Server A gets 2 requests for every 1 request Server B gets. This ensures more powerful servers handle proportionally more traffic. When you add a new, more powerful server to a cluster, give it a higher weight so it carries its fair share immediately.',
          code: null,
        },
      ],
      animationSteps: [
        { label: 'Request 1', description: 'Goes to Server A (position 1)', highlight: false },
        { label: 'Request 2', description: 'Goes to Server B (position 2)', highlight: true },
        { label: 'Request 3', description: 'Goes to Server C (position 3)', highlight: true },
        { label: 'Request 4', description: 'Wraps back to Server A (position 1)', highlight: false },
        { label: 'Weighted', description: 'Server A (weight 3) gets 3x more than Server B (weight 1)', highlight: false },
      ],
      example: 'Cloudflare uses Weighted Round Robin when rolling out new server hardware. When they add a new, faster server to a data center, they initially assign it a low weight (say 10% of traffic) to verify it behaves correctly. Once confirmed healthy, they gradually increase the weight to its full capacity share without any downtime or code changes.',
    },
  },

  // ── 5. Least Connections and Weighted Least Connections ───────────────────
  {
    order: 5, type: 'content', title: 'Least Connections',
    content: {
      overview: 'Least Connections is a smarter algorithm than Round Robin because it routes based on current server load rather than just taking turns. It always sends the next request to the server that currently has the fewest active connections - the least busy server right now.\n\nThis makes it far better for workloads where requests have variable processing times.',
      sections: [
        {
          heading: 'How Least Connections Works',
          body: 'The load balancer tracks the number of active (open) connections to each server in real time. When a new request arrives, it picks the server with the lowest current connection count. When a request completes, the connection count for that server decreases. The load balancer is constantly updating these counts as requests arrive and complete, making it a dynamic real-time algorithm.',
          code: null,
        },
        {
          heading: 'Why It Is Better Than Round Robin',
          body: 'Suppose Server A is processing a 10-second database query and Server B just finished a request. Round Robin might send the next request to Server A (its turn), making the user wait behind the slow query. Least Connections sends it to Server B which is free. The result is more even real-world utilisation and lower average response times for users.',
          code: null,
        },
        {
          heading: 'Weighted Least Connections',
          body: 'Just as Round Robin has a weighted variant, Least Connections does too. The server with the fewest connections relative to its weight is chosen. If Server A has weight 2 and 4 connections, its effective load is 4/2 = 2. If Server B has weight 1 and 1 connection, its effective load is 1/1 = 1. Server B is chosen. This combines capacity-awareness with real-time load awareness.',
          code: null,
        },
        {
          heading: 'Best Use Cases',
          body: 'Least Connections shines for long-lived connections (WebSockets, database connections), APIs where some requests are fast (cache hits) and some are slow (DB queries), or any workload with high variance in response time. It is the default recommendation for most general-purpose HTTP load balancing. NGINX and HAProxy both support it out of the box.',
          code: null,
        },
      ],
      animationSteps: [
        { label: 'Server status', description: 'A: 5 connections, B: 2 connections, C: 8 connections', highlight: false },
        { label: 'New request', description: 'Load balancer checks current connection counts', highlight: true },
        { label: 'Pick B', description: 'Server B has fewest - route request there', highlight: true },
        { label: 'B count rises', description: 'Server B now has 3 connections', highlight: false },
        { label: 'Balance', description: 'Real-time routing to least busy server always', highlight: false },
      ],
      example: 'Discord uses Least Connections for its WebSocket gateway servers. A user who opens Discord and keeps it open maintains a persistent WebSocket connection. Some users are highly active, generating many messages; others are idle. Least Connections ensures new users always connect to the gateway server with the most available capacity, regardless of how many connections that server already has.',
    },
  },

  // ── 6. IP Hashing and Consistent Hashing ─────────────────────────────────
  {
    order: 6, type: 'content', title: 'IP Hashing and Consistent Hashing',
    content: {
      overview: 'Both IP Hashing and Consistent Hashing use a mathematical hash function to deterministically map a request to a server. The same input always produces the same output, meaning the same client always reaches the same server.\n\nThe critical difference is what happens when you add or remove a server. This is where Consistent Hashing dramatically outperforms simple IP Hashing.',
      sections: [
        {
          heading: 'IP Hashing',
          body: 'IP Hashing computes a hash of the client\'s IP address and uses it to select a server, typically by doing hash(IP) modulo number_of_servers. If the result is 0, go to Server 1; if 1, go to Server 2; etc. The same client IP always maps to the same server because the hash is deterministic. This is simple and provides session affinity without cookies.',
          code: null,
        },
        {
          heading: 'The Problem with IP Hashing',
          body: 'IP Hashing breaks badly when you add or remove a server. If you have 3 servers and use modulo 3, then add a 4th server and use modulo 4, almost every client IP now maps to a different server. In a cache cluster, this means a near-total cache miss. Every key needs to be re-fetched and re-cached, causing a massive spike on your database. This is called a remapping storm.',
          code: null,
        },
        {
          heading: 'Consistent Hashing',
          body: 'Consistent Hashing places both servers and keys on an imaginary ring (values 0 to 2^32). Each key is stored on the first server clockwise from its position on the ring. When you add a server, only the keys between the new server and its predecessor on the ring need to move - roughly 1/N of all keys. When you remove a server, only its keys move to the next server clockwise. All other keys stay exactly where they are.',
          code: null,
        },
        {
          heading: 'Virtual Nodes',
          body: 'A basic consistent hash ring can create uneven distribution since servers land at random positions. Virtual nodes solve this: instead of one position per server, each server gets many positions (100-200) spread evenly around the ring. This creates much more uniform distribution. If a server goes down, its virtual nodes are distributed across all remaining servers, spreading the load evenly instead of dumping it all on one neighbor.',
          code: null,
        },
      ],
      animationSteps: [
        { label: 'Hash ring', description: 'Servers placed at positions on 0 to 2^32 ring', highlight: false },
        { label: 'Key hashed', description: 'Request key hashed to ring position', highlight: true },
        { label: 'Find server', description: 'Next server clockwise from key position', highlight: true },
        { label: 'Add server', description: 'Only ~1/N keys remapped - minimal disruption', highlight: false },
        { label: 'Virtual nodes', description: 'Each server holds many ring positions for even spread', highlight: false },
      ],
      example: 'Amazon DynamoDB and Apache Cassandra both use consistent hashing with virtual nodes to distribute data across their cluster nodes. When Amazon adds new DynamoDB capacity (which they do constantly as usage grows), only a fraction of the data needs to move. Without consistent hashing, every data key would need to be relocated - that would make scaling a distributed database practically impossible.',
    },
  },

  // ── 7. Health Checks and Automatic Failover ───────────────────────────────
  {
    order: 7, type: 'content', title: 'Health Checks and Automatic Failover',
    content: {
      overview: 'A load balancer is only as good as its ability to detect failed servers and stop sending traffic to them. Health checks are the mechanism that makes this possible. Without health checks, a load balancer would keep routing requests to a dead server, causing errors for users.\n\nAutomatic failover is the result: when a server fails, the load balancer detects it and reroutes traffic to healthy servers - all without human intervention.',
      sections: [
        {
          heading: 'How Health Checks Work',
          body: 'The load balancer periodically sends a request to each backend server - typically every 5-10 seconds. This can be as simple as a TCP connection check (can I connect to port 80?) or as meaningful as an HTTP request to a /health endpoint that checks database connectivity, cache availability, and other dependencies. If a server fails to respond (or returns an error) a configured number of times in a row, it is marked unhealthy.',
          code: null,
        },
        {
          heading: 'Passive vs Active Health Checks',
          body: 'Active health checks proactively send requests to servers specifically to test their health - separate from real user traffic. Passive health checks monitor actual request traffic: if a server returns 5xx errors or times out on N real requests, mark it unhealthy. Active checks detect failures faster (within one check interval) but add extra load. Passive checks are zero extra overhead but only detect failures when real traffic is flowing.',
          code: null,
        },
        {
          heading: 'Automatic Failover',
          body: 'When a server is marked unhealthy, the load balancer immediately stops sending new requests to it. Existing connections may be drained gracefully (allowed to complete) or dropped depending on configuration. The remaining healthy servers absorb the load. When the failed server recovers and passes health checks again (typically 2-3 consecutive successes), it is automatically added back to the rotation.',
          code: null,
        },
        {
          heading: 'Health Check Endpoints',
          body: 'A good /health endpoint is not just a "200 OK" response. It should verify the server can actually serve requests: check database connection, check Redis connection, check available disk space, check memory usage. Return 200 only if everything is genuinely healthy. This prevents the load balancer from routing traffic to a server that is technically alive but functionally broken because its database connection pool is exhausted.',
          code: null,
        },
      ],
      animationSteps: [
        { label: 'Health ping', description: 'Load balancer pings each server every 5s', highlight: false },
        { label: 'Server fails', description: 'Server 2 stops responding to health checks', highlight: true },
        { label: 'Marked unhealthy', description: 'After 3 failures, Server 2 removed from pool', highlight: true },
        { label: 'Traffic rerouted', description: 'All requests go to Server 1 and Server 3', highlight: false },
        { label: 'Recovery', description: 'Server 2 passes checks again - rejoins pool', highlight: false },
      ],
      example: 'AWS ALB (Application Load Balancer) performs health checks every 30 seconds by default and requires 5 consecutive successes before marking a server healthy again. During the 2021 AWS us-east-1 outage, load balancers across the region automatically drained traffic away from impaired instances, partially mitigating the impact for customers who had deployed across multiple availability zones.',
    },
  },

  // ── 8. Session Persistence (Sticky Sessions) ─────────────────────────────
  {
    order: 8, type: 'content', title: 'Session Persistence (Sticky Sessions)',
    content: {
      overview: 'Some applications store session state in the server\'s memory - shopping carts, logged-in user data, multi-step form state. If each request from the same user goes to a different server, the user\'s state is lost. Sticky sessions (also called session persistence) solve this by routing all requests from the same user to the same server.\n\nSticky sessions are a workaround, not an ideal solution. The right answer is to make your application stateless.',
      sections: [
        {
          heading: 'How Sticky Sessions Work',
          body: 'The load balancer inserts a cookie into the first response from a new user. The cookie value identifies which backend server handled that first request. On every subsequent request, the browser sends this cookie, and the load balancer reads it and routes back to the same server. AWS ALB uses a cookie named AWSALB. NGINX uses a cookie named route. This happens transparently - the user never sees it.',
          code: null,
        },
        {
          heading: 'Problems with Sticky Sessions',
          body: 'Sticky sessions cause uneven load distribution. If a heavy user is pinned to Server A, Server A becomes overloaded while Server B is idle. If the pinned server crashes, the user\'s session is lost and they must log in again. Sticky sessions prevent true horizontal scaling because servers are no longer interchangeable. They are a crutch for applications that were not designed to be stateless.',
          code: null,
        },
        {
          heading: 'IP-Based vs Cookie-Based Stickiness',
          body: 'IP-based stickiness routes by client IP address. Simple but breaks for users behind NAT (where thousands of users share one IP) or on mobile (where IP changes as you switch networks). Cookie-based stickiness is more reliable since the cookie persists as long as the browser session. Cookie-based is the standard approach in modern load balancers.',
          code: null,
        },
        {
          heading: 'The Better Alternative: Stateless Design',
          body: 'The correct fix for needing sticky sessions is to move session state out of server memory into a shared store. Store sessions in Redis. Store user data in a database. Store file uploads in S3. When no server holds unique state, every server is identical and the load balancer can route freely. This enables true elastic scaling - add or remove servers at any time without any user impact. Always prefer stateless design over sticky sessions.',
          code: null,
        },
      ],
      animationSteps: [
        { label: 'First request', description: 'User hits Server A - load balancer sets cookie', highlight: false },
        { label: 'Cookie set', description: 'AWSALB cookie identifies Server A', highlight: true },
        { label: 'Next request', description: 'Load balancer reads cookie, routes to Server A', highlight: true },
        { label: 'Server A fails', description: 'Session lost - user must log in again', highlight: false },
        { label: 'Better: Redis', description: 'Move sessions to Redis - no stickiness needed', highlight: false },
      ],
      example: 'In 2012, Pinterest was experiencing load balancing problems because their PHP sessions were stored in server memory. Different requests from the same user hitting different servers caused random logouts. Their solution was not sticky sessions - it was migrating sessions to Memcached. Once sessions were in a shared cache, any server could handle any user, and they scaled freely from 3 servers to 100.',
    },
  },

  // ── 9. High Availability and Load Balancer Redundancy ────────────────────
  {
    order: 9, type: 'content', title: 'High Availability and Redundancy',
    content: {
      overview: 'If your load balancer is a single point of failure, you have traded one single point of failure (one server) for another (one load balancer). A highly available system eliminates single points of failure at every layer - including the load balancer itself.\n\nLoad balancer redundancy means running multiple load balancers so that if one fails, another takes over without any downtime.',
      sections: [
        {
          heading: 'Active-Passive Setup',
          body: 'In an active-passive setup, one load balancer handles all traffic (active) while a second identical load balancer waits in standby (passive). Both share a virtual IP address (VIP). If the active load balancer fails, the passive one detects this (via heartbeat messages) and takes over the VIP within seconds. Users continue sending traffic to the same IP address without interruption. This is also called a failover pair.',
          code: null,
        },
        {
          heading: 'Active-Active Setup',
          body: 'In active-active, multiple load balancers all handle traffic simultaneously. DNS round-robin or an upstream router distributes traffic across them. If one fails, the others continue handling all traffic. Active-active provides both redundancy and additional capacity since all load balancers are working. The challenge is synchronising state between load balancers (for sticky sessions, rate limiting counters, etc.).',
          code: null,
        },
        {
          heading: 'Global Load Balancing',
          body: 'For global high availability, traffic is distributed across multiple geographic regions. DNS-based global load balancing (like AWS Route 53 with health checks) routes users to the nearest healthy region. If an entire data center fails, DNS automatically redirects all users to a different region within seconds. This is the highest level of availability and is used by major internet services.',
          code: null,
        },
        {
          heading: 'The 99.99% Uptime Target',
          body: '99.99% uptime means less than 52 minutes of downtime per year. Achieving this with a single load balancer is impossible - one hardware failure or software update would exceed that budget. With redundant load balancers in multiple availability zones plus global failover, this target becomes achievable. AWS ALB, GCP, and Azure all guarantee 99.99% SLA on their managed load balancing services.',
          code: null,
        },
      ],
      animationSteps: [
        { label: 'Active LB', description: 'Primary load balancer handles all traffic', highlight: false },
        { label: 'LB fails', description: 'Primary load balancer goes down', highlight: true },
        { label: 'VIP moves', description: 'Virtual IP transfers to standby in seconds', highlight: true },
        { label: 'Standby active', description: 'Standby takes over - zero downtime for users', highlight: false },
        { label: 'Multi-region', description: 'DNS routes to healthy region if whole DC fails', highlight: false },
      ],
      example: 'When AWS experienced the us-east-1 outage in December 2021, companies with active-active global load balancers across multiple regions (us-east-1 and us-west-2) experienced minimal disruption. Traffic automatically shifted to the healthy region. Companies with single-region deployments went completely offline. The difference was purely in whether redundancy was designed in from the start.',
    },
  },

  // ── 10. Load Balancing in Practice ───────────────────────────────────────
  {
    order: 10, type: 'content', title: 'Load Balancing in Practice',
    content: {
      overview: 'Understanding load balancing algorithms and theory is important, but so is knowing how to apply them in a real production system. In practice, load balancing involves choosing the right tool, configuring it correctly, and integrating it with monitoring and auto-scaling.\n\nThis module covers practical decisions: which load balancer to use, how to configure it for common scenarios, and how it fits into the broader architecture.',
      sections: [
        {
          heading: 'Choosing a Load Balancer',
          body: 'For cloud deployments, use the managed service from your cloud provider: AWS ALB for HTTP/HTTPS with path-based routing, AWS NLB for ultra-low latency TCP/UDP, GCP Cloud Load Balancing, or Azure Application Gateway. For on-premise or Docker/Kubernetes, NGINX and HAProxy are the industry standards. Kubernetes deployments use an Ingress controller (usually NGINX Ingress or Traefik) as the internal load balancer.',
          code: null,
        },
        {
          heading: 'SSL Termination',
          body: 'Handling SSL/TLS encryption and decryption is CPU-intensive. SSL termination at the load balancer means the load balancer decrypts HTTPS traffic and forwards plain HTTP to backend servers. Backend servers are relieved of the encryption overhead. SSL certificates are managed in one place (the load balancer) instead of on every server. This is the standard pattern for most web applications.',
          code: null,
        },
        {
          heading: 'Connection Draining',
          body: 'When you take a server out of rotation (for deployment, maintenance, or scaling down), connection draining ensures active requests are not abruptly cut off. The load balancer stops sending new requests to the server but allows existing connections to complete gracefully, up to a configured timeout (typically 30-300 seconds). After the timeout, remaining connections are forcibly closed. This prevents errors during routine deployments.',
          code: null,
        },
        {
          heading: 'Rate Limiting',
          body: 'A load balancer at the edge is the ideal place to enforce rate limiting - before requests reach your application servers. Rate limiting at the load balancer level can reject excess requests immediately without consuming any application server resources. Common limits: 100 requests per minute per IP for APIs, burst limits for specific endpoints. AWS WAF and NGINX rate limiting modules handle this.',
          code: null,
        },
      ],
      animationSteps: [
        { label: 'HTTPS in', description: 'Encrypted HTTPS from client arrives at LB', highlight: false },
        { label: 'SSL terminate', description: 'Load balancer decrypts - saves backend CPU', highlight: true },
        { label: 'HTTP forward', description: 'Plain HTTP forwarded to app servers', highlight: true },
        { label: 'Rate limit', description: 'Excess requests rejected at edge before backend', highlight: false },
        { label: 'Drain', description: 'Server removed gracefully - existing requests complete', highlight: false },
      ],
      example: 'Shopify handles Black Friday using AWS ALB with auto-scaling. Their load balancer terminates SSL for all merchant stores, handles rate limiting to prevent bot abuse, and uses connection draining during deployments. During Black Friday 2023, they processed over 4.2 million requests per minute at peak - all flowing through their load balancing layer without any incidents.',
    },
  },

  // ── 11. Failure Cases ─────────────────────────────────────────────────────
  {
    order: 11, type: 'failureCases', title: 'Failure Cases',
    failureCases: [
      {
        title: 'Load Balancer Becomes the Single Point of Failure',
        scenario: 'A company runs a single load balancer in front of 10 app servers. The load balancer\'s disk fills up from access logs, causing it to crash. All 10 app servers are healthy but completely unreachable. The entire system is down despite having redundant app servers.',
        impact: 'Total outage. All 10 healthy app servers are unreachable. Every user gets connection refused. The irony: they scaled the app tier but forgot to scale the load balancing tier.',
        resolution: 'Run load balancers in active-passive or active-active pairs. Deploy across at least two availability zones. Use managed cloud load balancers (AWS ALB, GCP CLB) which are themselves redundant. Monitor load balancer disk usage and rotate access logs.',
        animationSteps: [
          { label: 'LB crashes', description: 'Single load balancer goes down - disk full', highlight: true },
          { label: '10 servers fine', description: 'All 10 app servers healthy but unreachable', highlight: true },
          { label: 'Total outage', description: 'No path for requests to reach servers', highlight: true },
          { label: 'Root cause', description: 'LB itself was a single point of failure', highlight: false },
          { label: 'Fix', description: 'Active-passive LB pair across two availability zones', highlight: false },
        ],
      },
      {
        title: 'Unhealthy Server Passes Health Checks',
        scenario: 'A server\'s /health endpoint always returns 200 OK - even when the database connection pool is exhausted. The server can accept connections but all requests immediately fail with 500 errors. The load balancer keeps routing traffic to it because it passes health checks.',
        impact: '10-15% of all user requests fail with 500 errors. The error rate alert fires but engineers struggle to find the problem because the server appears healthy in monitoring.',
        resolution: 'Health check endpoints must verify actual functionality - not just respond 200. Check DB connection, check cache connection, check critical dependencies. Return 503 if any critical dependency is broken. Use passive health checks too: if a server returns 5xx on N consecutive real requests, mark it unhealthy regardless of active health check results.',
        animationSteps: [
          { label: 'Server broken', description: 'DB pool exhausted - all requests fail', highlight: true },
          { label: 'Health check', description: '/health returns 200 - looks healthy', highlight: true },
          { label: 'LB routes there', description: 'Load balancer sends 15% of traffic to broken server', highlight: false },
          { label: '15% fail', description: 'Users see 500 errors - hard to diagnose', highlight: false },
          { label: 'Fix', description: '/health checks DB connection - returns 503 when broken', highlight: false },
        ],
      },
      {
        title: 'Thundering Herd After Health Recovery',
        scenario: 'Server A is marked unhealthy and removed. Servers B, C, D absorb the load. After 2 minutes, Server A recovers and is added back. The load balancer immediately sends it 25% of all traffic. Server A\'s caches are cold (empty). Every request hits the database. Server A is overwhelmed by cold cache misses and crashes again. It recovers, gets added back, crashes again - a crash loop.',
        impact: 'Oscillating instability. A server that should be helping the system keeps crashing due to cold cache storm on reentry. Overall system operates at 75% capacity with periodic spikes of errors.',
        resolution: 'Implement slow start - gradually ramp up traffic to a recovering server over 30-120 seconds. NGINX upstream slow_start and AWS ALB warm-up period do this. Allow the cache to warm up before full traffic weight is applied.',
        animationSteps: [
          { label: 'A recovers', description: 'Server A rejoins pool - cold cache', highlight: false },
          { label: 'Full traffic', description: 'LB sends 25% traffic immediately to cold A', highlight: true },
          { label: 'Cache miss flood', description: 'Every request hits database - A overwhelmed', highlight: true },
          { label: 'A crashes again', description: 'Crash loop - A keeps recovering and crashing', highlight: true },
          { label: 'Fix: slow start', description: 'Ramp A from 5% to 25% over 60 seconds', highlight: false },
        ],
      },
      {
        title: 'Sticky Session Server Failure',
        scenario: 'An e-commerce site uses sticky sessions for shopping cart state. Server B, which holds sessions for 30% of active users, crashes during peak traffic. All 30% of those users lose their shopping carts and are logged out mid-checkout. Some were in the process of submitting payment.',
        impact: 'Immediate 30% session loss. Potential double-charges for users whose payment request was in-flight. Angry users and support tickets. Lost sales.',
        resolution: 'Stop using sticky sessions for critical state. Move shopping cart and session data to Redis. With stateless servers, a server crash is transparent to users - the load balancer routes their next request to another server which reads their cart from Redis. Payment transactions should use idempotency keys to prevent double-charges.',
        animationSteps: [
          { label: 'Server B up', description: '30% of users pinned to Server B via cookies', highlight: false },
          { label: 'Server B crashes', description: 'Server B goes down unexpectedly', highlight: true },
          { label: '30% lose sessions', description: 'All sticky sessions lost - mid-checkout users hit', highlight: true },
          { label: 'Some double charge', description: 'In-flight payment requests have unknown state', highlight: false },
          { label: 'Fix: Redis', description: 'Sessions in Redis - any server handles any user', highlight: false },
        ],
      },
      {
        title: 'Consistent Hashing Ring Imbalance (Hot Node)',
        scenario: 'A Consistent Hashing cluster has 3 nodes. Due to unlucky hash positions, Node 1 is responsible for 60% of the key space, Node 2 for 30%, and Node 3 for only 10%. Node 1 handles 6x the traffic of Node 3 and becomes a hot spot. Response times degrade for all keys assigned to Node 1.',
        impact: '60% of cache requests are slower. Node 1 CPU is consistently high. Adding more servers does not help because Node 1\'s key range stays the same.',
        resolution: 'Use virtual nodes. Assign each physical server 100-200 virtual node positions spread evenly around the ring. This averages out the key distribution so each physical server handles approximately 1/N of the key space. Any statistical imbalance is smoothed out across the many virtual positions.',
        animationSteps: [
          { label: 'Basic ring', description: '3 nodes at random positions - uneven key ranges', highlight: true },
          { label: 'Node 1: 60%', description: 'Node 1 owns 60% of ring - hot spot', highlight: true },
          { label: 'Degraded', description: 'Node 1 overloaded - 60% of reads slower', highlight: false },
          { label: 'Add vnodes', description: 'Each node gets 150 virtual positions on ring', highlight: false },
          { label: 'Even spread', description: 'Each node owns ~33% of key space', highlight: false },
        ],
      },
    ],
  },

  // ── 12. Interview Questions ───────────────────────────────────────────────
  {
    order: 12, type: 'interview', title: 'Interview Discussion Questions',
    interviewQuestions: [
      {
        question: 'What is the difference between Layer 4 and Layer 7 load balancing? When would you choose each?',
        answer: 'Layer 4 operates on TCP/UDP - it sees IP and port but not HTTP content. It is faster with lower latency. Use for non-HTTP traffic (databases, game servers) or when raw throughput matters. Layer 7 operates on HTTP - it reads URLs, headers, cookies. It enables path-based routing (/api to API servers, /images to media servers), SSL termination, authentication offloading, and A/B testing. Use Layer 7 for most modern web applications. In practice, a system might use Layer 4 at the edge for raw throughput and Layer 7 internally for intelligent routing.',
        difficulty: 'medium',
      },
      {
        question: 'Why is Round Robin not suitable for all workloads? When would you use Least Connections instead?',
        answer: 'Round Robin treats all requests equally - one request counts as one regardless of how long it takes. If requests vary widely in processing time (some 5ms, some 5s), Round Robin will overload servers that happen to receive the slow requests. Least Connections tracks real-time active connections and routes to the least busy server. Use Least Connections when request processing time varies significantly - API calls with variable DB query times, WebSocket servers, or any backend with mix of fast and slow operations.',
        difficulty: 'medium',
      },
      {
        question: 'Explain consistent hashing. Why is it used in distributed caches instead of modulo hashing?',
        answer: 'Consistent hashing places both servers and keys on a ring (0 to 2^32). Each key maps to the first server clockwise on the ring. Adding or removing a server only remaps 1/N of keys. With modulo hashing (key % N), adding one server to a 10-server cluster changes the mapping for ~90% of keys - causing a near-total cache miss flood. Consistent hashing changes only ~10%. This is critical for caches: a mass remapping event means a mass cache miss event which hammers the database. Used in Redis Cluster, Cassandra, and DynamoDB.',
        difficulty: 'hard',
      },
      {
        question: 'What are the risks of sticky sessions and how would you eliminate the need for them?',
        answer: 'Sticky sessions cause uneven load distribution (heavy users pin to one server), create a single point of failure (if that server dies, session is lost), and prevent truly elastic horizontal scaling. Eliminate them by moving all session state to a shared external store: sessions to Redis, user data to a database, file uploads to S3. With stateless application servers, any server handles any request - sticky sessions become unnecessary. This is a prerequisite for auto-scaling since you cannot scale out if servers hold unique user state.',
        difficulty: 'medium',
      },
      {
        question: 'Design a highly available load balancing setup for a global web application.',
        answer: 'Multiple layers: DNS-level with AWS Route 53 using latency-based routing and health checks - routes users to nearest healthy region. Per-region: active-active ALB pair across 2+ availability zones - if one AZ fails, the other handles all traffic. Each ALB distributes across an auto-scaling group of app servers using Least Connections. Health checks at every tier: Route 53 checks regional ALB health, ALB checks each app server health. Connection draining on all deployments. SSL terminates at ALB. Rate limiting at ALB edge. Result: no single point of failure from DNS to application server.',
        difficulty: 'hard',
      },
      {
        question: 'What should a good /health endpoint check and why?',
        answer: 'A good /health endpoint should verify the server can actually serve requests: check database connection can execute a simple query, check Redis connection responds, check available disk space above a threshold, check memory usage below a threshold, check any critical external API dependencies. It should return 503 if any critical dependency is broken. A minimal endpoint that just returns 200 creates the failure scenario where a broken server appears healthy - the load balancer routes traffic to it and every request fails. The health check is your contract with the load balancer that this server is ready to serve traffic.',
        difficulty: 'medium',
      },
      {
        question: 'A load balancer routes to 3 servers. You add a 4th server. Using IP hashing, what problem might occur?',
        answer: 'With IP hashing using modulo, adding a 4th server changes the hash calculation from hash(IP) % 3 to hash(IP) % 4. Most client IPs now map to different servers. In a cache cluster, this causes a near-total cache miss event - every key needs to be re-fetched from the database and re-cached. The database is hit with a sudden spike of queries it used to serve from cache. The fix is consistent hashing, which only remaps ~25% of keys (1/N where N = 4) when adding the 4th server. The other 75% continue to their same server without disruption.',
        difficulty: 'hard',
      },
      {
        question: 'What is connection draining and why is it important during deployments?',
        answer: 'Connection draining (also called deregistration delay) is the period during which a server being removed from the load balancer pool is allowed to finish its existing in-flight requests before being shut down. Without draining, in-progress requests are abruptly cut off - users get errors mid-operation, which is especially bad during checkouts or file uploads. With draining, the load balancer stops sending new requests to the server but waits up to a configured timeout (30-300 seconds) for existing connections to complete. This enables zero-downtime deployments. AWS ALB default draining is 300 seconds.',
        difficulty: 'medium',
      },
    ],
  },

  // ── 13. Quiz ──────────────────────────────────────────────────────────────
  {
    order: 13, type: 'quiz', title: 'Load Balancing Quiz',
    quizConfig: {
      timeLimitSeconds: 600, maxAttempts: 3, passingPercent: 70,
      questions: [
        {
          question: 'Your API has some endpoints that take 2ms and others that take 2 seconds. Which load balancing algorithm is most appropriate?',
          options: ['Round Robin', 'Weighted Round Robin', 'Least Connections', 'Random'],
          correctIndex: 2, scenario: true,
          explanation: 'Least Connections. When request processing times vary significantly, Round Robin distributes requests evenly but not load evenly. Least Connections routes to the server with the fewest active connections right now - the least busy one - which distributes actual load more fairly.',
        },
        {
          question: 'You need to route /api requests to API servers and /images requests to media servers. Which load balancer type handles this?',
          options: ['Layer 4 (TCP)', 'Layer 7 (HTTP)', 'DNS round robin', 'IP hashing'],
          correctIndex: 1, scenario: true,
          explanation: 'Layer 7. Only a Layer 7 load balancer can read the URL path and make routing decisions based on it. Layer 4 only sees TCP/UDP and IP - it cannot inspect HTTP content like URLs.',
        },
        {
          question: 'You have 3 cache servers using modulo hashing. You add a 4th. What is the main risk?',
          options: ['Servers run out of memory', 'Almost all cache keys remap to different servers - cache miss flood', 'The 4th server gets too much traffic', 'Load balancer crashes under new configuration'],
          correctIndex: 1, scenario: false,
          explanation: 'Cache miss flood. Modulo hashing: key % 3 vs key % 4 produces different results for most keys. Nearly all keys now map to a different server - they are not there, causing mass cache misses. The database gets hammered with all the queries that were previously served from cache.',
        },
        {
          question: 'A server\'s /health returns 200 OK but all actual requests return 500. The load balancer keeps routing to it. What is wrong?',
          options: ['Health checks are too infrequent', 'The health endpoint does not check actual functionality like DB connectivity', 'Load balancer is misconfigured', 'The server needs more memory'],
          correctIndex: 1, scenario: true,
          explanation: 'Shallow health check. The /health endpoint just returns 200 without verifying the server can actually handle requests. A proper health endpoint checks DB connection, cache connection, and other dependencies. If DB is broken, /health should return 503 so the load balancer removes the server from rotation.',
        },
        {
          question: 'Your load balancer is a single instance. It crashes. What happens to your 10 healthy app servers?',
          options: ['They continue working with reduced capacity', 'They are completely unreachable - total outage', 'They elect a new load balancer automatically', 'Traffic routes directly to servers via DNS'],
          correctIndex: 1, scenario: true,
          explanation: 'Total outage. All clients send traffic to the load balancer\'s IP. If the load balancer is down, there is no path to the healthy app servers. This is the classic single point of failure. Run load balancers in redundant pairs across availability zones to eliminate this.',
        },
        {
          question: 'You have 3 servers of equal power. Server weights are A:1, B:1, C:1. You add a Server D with 4x the CPU. What weight should D get?',
          options: ['1 (same as others)', '2', '4', '8'],
          correctIndex: 2, scenario: false,
          explanation: 'Weight 4. Weighted Round Robin assigns traffic proportional to weight. With A:1, B:1, C:1, D:4, total weight is 7. D gets 4/7 (~57%) of traffic. A, B, C each get 1/7 (~14%). This correctly reflects D\'s 4x greater capacity vs the other servers.',
        },
        {
          question: 'During a deployment you remove a server from the load balancer. A user is mid-checkout with an active connection. What prevents them from getting an error?',
          options: ['The server ignores the removal', 'Connection draining - existing connections complete before server shuts down', 'Sticky sessions keep them on the same server', 'The load balancer buffers the request'],
          correctIndex: 1, scenario: true,
          explanation: 'Connection draining. When a server is deregistered, the load balancer stops sending new requests but allows existing in-flight requests to complete up to a configured timeout. This ensures the checkout completes normally. Without draining, the connection would be abruptly cut and the user would see an error.',
        },
        {
          question: 'What is the main advantage of consistent hashing over simple modulo hashing when scaling a cache cluster?',
          options: ['It is faster to compute', 'Adding/removing a server only remaps ~1/N keys instead of nearly all of them', 'It guarantees perfectly even distribution', 'It works without a load balancer'],
          correctIndex: 1, scenario: false,
          explanation: 'Minimal remapping. Consistent hashing places servers on a ring. Adding 1 server to a 10-server cluster only remaps ~10% of keys. Modulo hashing would remap ~90%. This is critical for caches - fewer remapped keys means fewer cache misses means less database load during scaling events.',
        },
        {
          question: 'An e-commerce site uses sticky sessions. Server B crashes during peak traffic. What is the immediate impact?',
          options: ['Load redistributes seamlessly', 'All users pinned to Server B lose sessions and are logged out', 'Only new users are affected', 'Server B restarts automatically'],
          correctIndex: 1, scenario: true,
          explanation: 'Session loss. All users whose sticky session cookie pointed to Server B lose their sessions immediately. Shopping carts disappear, users are logged out, and any in-flight checkouts may have payment issues. This is why sticky sessions are dangerous for critical state. The correct fix is to store sessions in Redis so any server can serve any user.',
        },
        {
          question: 'Which active-passive load balancer configuration eliminates the load balancer as a single point of failure?',
          options: ['One load balancer with auto-restart', 'Two load balancers sharing a virtual IP - passive takes over if active fails', 'Round-robin between load balancers at the DNS level only', 'Increasing load balancer server specs'],
          correctIndex: 1, scenario: false,
          explanation: 'Active-passive with shared VIP. Both load balancers share a virtual IP address. The passive one monitors the active via heartbeat. On failure, the passive takes over the VIP within seconds. Users continue sending to the same IP - zero downtime. This eliminates the load balancer as a single point of failure.',
        },
      ],
    },
  },
];

module.exports = LOAD_BALANCING_MODULES;
