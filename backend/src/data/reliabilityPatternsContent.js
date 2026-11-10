// Static Reliability Patterns content - 13 modules total
const RELIABILITY_PATTERNS_MODULES = [

  // 1. Reliability Patterns Fundamentals
  {
    order: 1, type: 'content', title: 'Reliability Patterns Fundamentals',
    content: {
      overview: 'Reliability patterns are proven engineering solutions to the most common failure modes in distributed systems. They answer a simple but hard question: when something goes wrong - and it always does - how does your system behave?\n\nA reliable system is not one that never fails. It is one that handles failures gracefully, recovers quickly, and prevents one failure from cascading into a system-wide outage.',
      sections: [
        { heading: 'What is Reliability?', body: 'Reliability is the probability that a system performs its intended function under defined conditions for a specified period of time. In practice: how often is your system available, how quickly does it recover from failures, and how well does it handle unexpected load? Reliability is measured through SLAs (Service Level Agreements), SLOs (Service Level Objectives), and SLIs (Service Level Indicators) such as availability percentage and error rate.', code: null },
        { heading: 'Why Systems Fail', body: 'Systems fail for predictable reasons: hardware failure (disk crash, network outage), software bugs (edge cases, memory leaks), overload (more traffic than capacity), dependency failures (a third-party service goes down), and configuration errors (a wrong setting pushed to production). Reliability patterns address each of these categories with specific defensive mechanisms applied at design time, not after failure.', code: null },
        { heading: 'The Reliability Toolkit', body: 'The core reliability patterns form a toolkit: Circuit Breakers stop calling failing dependencies. Retries with backoff handle transient failures. Timeouts prevent requests from waiting forever. Bulkheads isolate failures so one problem cannot consume all resources. Fallbacks provide degraded-but-working responses. Health checks detect failures fast. Redundancy ensures no single point of failure. Each pattern solves a specific failure mode.', code: null },
        { heading: 'Defense in Depth', body: 'No single reliability pattern is sufficient. A well-designed system layers multiple patterns. A service call uses a timeout (to prevent waiting forever), a retry (to handle transient failures), a circuit breaker (to stop calling a failing service), and a fallback (to serve a degraded response). Each layer catches a different failure mode. The goal is defense in depth - multiple independent mechanisms so that if one fails to catch a problem, another does.', code: null },
      ],
      animationSteps: [
        { label: 'Failure occurs',    description: 'Downstream service starts failing',          highlight: true  },
        { label: 'Timeout fires',     description: 'Request not waiting forever - fails fast',   highlight: true  },
        { label: 'Retry attempts',    description: 'Retry with backoff - transient fix',         highlight: false },
        { label: 'Circuit breaks',    description: 'Repeated failures open the circuit breaker', highlight: false },
        { label: 'Fallback serves',   description: 'Degraded response returned - system up',    highlight: false },
      ],
      example: 'Netflix Hystrix (now open source as Resilience4j) implements the full reliability pattern toolkit in one library. Every outbound call from a Netflix service is wrapped in a Hystrix command with: timeout (500ms), retry policy, circuit breaker, bulkhead (thread pool), and fallback. When the recommendation service goes down, Netflix shows generic popular titles instead of crashing.',
    },
  },

  // 2. Fault Tolerance and Fault Isolation
  {
    order: 2, type: 'content', title: 'Fault Tolerance and Fault Isolation',
    content: {
      overview: 'Fault tolerance is the ability of a system to continue operating correctly even when some of its components fail. Fault isolation is the principle that a failure in one component should not spread to other components.\n\nTogether these two principles are the foundation of resilient distributed systems: tolerate the failures you cannot prevent, and contain the ones that occur.',
      sections: [
        { heading: 'Fault Tolerance Strategies', body: 'Redundancy is the primary fault tolerance mechanism: run multiple instances so if one fails, others continue. Active redundancy: all instances handle traffic simultaneously (active-active). Passive redundancy: backup instances stand by and take over on failure (active-passive). N+1 redundancy: always have one more than the minimum needed. The key: eliminate all single points of failure - any component that, if it fails, brings down the whole system.', code: null },
        { heading: 'Blast Radius', body: 'Blast radius is the scope of impact when something fails. A failure with a small blast radius affects a few users or one feature. A failure with a large blast radius takes down the entire system. Good system design minimises blast radius: deploy services independently so a bad deployment affects one service, not all. Use feature flags to roll out changes to 1% of users first. Isolate high-risk operations in their own service. The goal is to contain failures to the smallest possible scope.', code: null },
        { heading: 'Failure Modes', body: 'Understanding failure modes lets you design for them. Crash failure: a node stops and does not respond. Byzantine failure: a node sends incorrect or malicious responses. Omission failure: a node fails to respond to some (not all) requests. Timing failure: a node responds but takes too long. Fail-stop failures (crashes) are easiest to handle. Byzantine failures (wrong responses) are hardest. Design for the failure modes that are realistic for your system.', code: null },
        { heading: 'Isolation Techniques', body: 'Isolation prevents one failure from spreading. Process isolation: run services in separate processes so a crash in one does not affect others. Resource isolation: separate CPU, memory, and thread pool quotas per service so one service cannot starve others. Network isolation: segment services into different VPCs or namespaces. Data isolation: each microservice has its own database so a schema migration in one does not affect others. The more isolated components are, the smaller the blast radius of any failure.', code: null },
      ],
      animationSteps: [
        { label: 'Service A fails',   description: 'Service A crashes unexpectedly',             highlight: true  },
        { label: 'Without isolation', description: 'Failure spreads to B, C, D - cascades',     highlight: true  },
        { label: 'With isolation',    description: 'Failure contained to Service A only',        highlight: false },
        { label: 'B, C, D run',       description: 'Other services unaffected and serving',      highlight: false },
        { label: 'A recovers',        description: 'A restarts - system fully normal again',     highlight: false },
      ],
      example: 'AWS uses isolated blast radius zones called Availability Zones. A failure in us-east-1a does not affect us-east-1b or us-east-1c. Services designed with redundancy across AZs contain failures to one AZ. The 2021 us-east-1 outage impacted single-AZ deployments completely but multi-AZ deployments continued with degraded (not zero) capacity.',
    },
  },

  // 3. Circuit Breaker Pattern
  {
    order: 3, type: 'content', title: 'Circuit Breaker Pattern',
    content: {
      overview: 'The Circuit Breaker is named after the electrical component that cuts power when current is too high to prevent damage. In software, it monitors calls to a downstream service and when failure rate exceeds a threshold, it "trips open" - stopping all calls immediately and returning an error without even trying.\n\nThis prevents cascading failures where one slow or failing service brings down its callers.',
      sections: [
        { heading: 'The Three States', body: 'Closed state: normal operation - all calls pass through and are monitored. If failures exceed the threshold (say 50% of calls failing in 10 seconds), the breaker trips. Open state: breaker is tripped - all calls immediately return an error without calling the downstream service. The timeout is not hit - the caller gets an error in milliseconds instead of waiting seconds. After a configured time (30 seconds), the breaker moves to half-open.', code: null },
        { heading: 'Half-Open State', body: 'Half-open is a probe state. After the open timeout expires, the breaker allows one test request through. If that request succeeds, the breaker closes and normal traffic resumes. If it fails, the breaker opens again for another timeout period. This prevents repeated full recovery attempts that could spike load on a service that is still struggling. It acts as a gradual, automatic recovery mechanism.', code: null },
        { heading: 'Why It Prevents Cascade Failures', body: 'Without a circuit breaker: Service B is slow (taking 30 seconds). Service A calls B with a 30-second timeout. All of A\'s threads accumulate waiting for B. New requests to A are rejected or queue up. Services that call A also fill up. The whole chain goes down from one slow service. With a circuit breaker: after 5 failures, the breaker opens. A immediately returns an error without calling B. A\'s threads are free for other work. The cascade is stopped at the first link.', code: null },
        { heading: 'Configuring Circuit Breakers', body: 'Key configuration parameters: failure threshold percentage (what percent of calls must fail to trip), minimum call volume (do not trip on the first 2 failures of 2 total calls - wait for statistical significance), open state timeout (how long before attempting recovery), sliding window size (look at the last 10 calls or last 10 seconds). Different services warrant different settings - a critical payment service might trip at 20% failure rate while an optional analytics service might allow 60%.', code: null },
      ],
      animationSteps: [
        { label: 'Closed: normal',    description: 'All calls pass through - monitoring failures', highlight: false },
        { label: 'Failures spike',    description: '50% failure rate - threshold crossed',         highlight: true  },
        { label: 'Breaker opens',     description: 'All calls immediately return error - no wait',  highlight: true  },
        { label: 'Half-open probe',   description: 'After 30s: one test request allowed through',  highlight: false },
        { label: 'Success: close',    description: 'Test passed - breaker closes, traffic resumes', highlight: false },
      ],
      example: 'Resilience4j is the standard circuit breaker library for Java microservices. When the payment service experiences a 40% error rate over 10 calls, the circuit trips open. All subsequent payment calls immediately return a "payment service unavailable" error in under 1ms instead of waiting 5 seconds for a timeout. The order service remains available to serve other requests while payment recovers.',
    },
  },

  // 4. Retry Pattern and Exponential Backoff
  {
    order: 4, type: 'content', title: 'Retry Pattern and Exponential Backoff',
    content: {
      overview: 'Many failures in distributed systems are transient - a momentary network hiccup, a brief overload spike, a temporary resource contention. Retrying the same operation a moment later often succeeds.\n\nThe Retry pattern handles transient failures automatically. Exponential backoff spaces retries to avoid overwhelming an already-struggling system.',
      sections: [
        { heading: 'When to Retry', body: 'Only retry on retriable errors. Network timeout: retry - the request may not have reached the server. 503 Service Unavailable: retry - the server is temporarily overloaded. 429 Too Many Requests: retry after the Retry-After header duration. Never retry: 400 Bad Request (the request is wrong - retrying will not fix it), 401 Unauthorized (re-authenticate first), 404 Not Found (the resource does not exist), 500 Internal Server Error (may indicate a bug - retrying hammers a broken server). Know the difference between transient and permanent failures.', code: null },
        { heading: 'Exponential Backoff', body: 'Naive retry: immediately retry after failure. Problem: if 1000 clients all retry immediately, the struggling server gets 1000x its normal load at the worst moment. Exponential backoff: retry after 1 second, then 2 seconds, then 4 seconds, then 8 seconds. Each retry doubles the wait time. This gives the struggling server time to recover between retry storms. Maximum backoff (say 60 seconds) prevents indefinitely long waits.', code: null },
        { heading: 'Jitter', body: 'Even with exponential backoff, all clients might synchronise their retries (all waited 1 second, now all retry at the same moment). Jitter adds random variation: retry after 1s + random(0, 0.5s). The randomisation desynchronises clients so retries arrive spread out rather than in a wave. Full jitter: retry after random(0, maxBackoff). Decorrelated jitter: retry after min(maxBackoff, random(minBackoff, lastBackoff * 3)). AWS recommends full jitter for most cases.', code: null },
        { heading: 'Idempotency is Required', body: 'Retrying is only safe if the operation is idempotent - executing it multiple times produces the same result as executing it once. Reading data is idempotent. Setting a value to 100 is idempotent. Incrementing a counter is NOT idempotent - retrying doubles the increment. For non-idempotent operations, use an idempotency key: include a unique request ID with each call. The server deduplicates by ID and returns the same result for duplicate calls without re-executing.', code: null },
      ],
      animationSteps: [
        { label: 'Request fails',     description: 'Network timeout - transient error',          highlight: false },
        { label: 'Retry 1: 1s',       description: 'Retry after 1 second backoff',              highlight: true  },
        { label: 'Retry 2: 2s',       description: 'Still failing - retry after 2 seconds',     highlight: true  },
        { label: 'Retry 3: 4s+jitter', description: 'Backoff + random jitter to spread load',  highlight: false },
        { label: 'Success',           description: 'Transient issue resolved - request succeeds', highlight: false },
      ],
      example: 'AWS SDK automatically retries API calls with exponential backoff and jitter by default. When a DynamoDB call receives a 500 error or throttling response, the SDK waits 50ms (with jitter) then retries. If still failing, 100ms + jitter, then 200ms + jitter, up to 10 retries. This transparent retry logic means most transient AWS failures are invisible to application code.',
    },
  },

  // 5. Timeout Pattern
  {
    order: 5, type: 'content', title: 'Timeout Pattern',
    content: {
      overview: 'A timeout sets a maximum time a caller will wait for a response. If the response does not arrive within that time, the caller gives up and returns an error.\n\nTimeouts are fundamental to resilient systems. Without them, a single slow dependency can hold all your resources hostage indefinitely, eventually making your entire service unresponsive.',
      sections: [
        { heading: 'Why Timeouts Are Essential', body: 'Without timeouts: Service A calls Service B. B is overloaded and takes 30 seconds to respond (or never responds). A\'s thread is blocked for 30 seconds. With 100 concurrent requests and a 30-second wait, all 100 of A\'s threads are occupied within seconds. New requests to A cannot be served. A appears down. Services calling A also fill up. Total cascade failure - all because one service was slow and there was no timeout. Timeouts make failure fast instead of slow.', code: null },
        { heading: 'Setting the Right Timeout', body: 'Too short: legitimate slow operations fail unnecessarily (a database query that sometimes takes 800ms fails with a 500ms timeout). Too long: slow dependencies still consume threads for a long time before releasing them. The right timeout: measure the P99 (99th percentile) response time of the dependency under normal conditions. Set timeout at 2-3x the P99. For a service that normally responds in 50ms P99, a 150ms timeout catches genuine slowness while allowing normal operations. Review and adjust as your system\'s performance profile changes.', code: null },
        { heading: 'Timeout Hierarchy', body: 'Different timeouts apply at different levels. Connection timeout: how long to wait to establish the TCP connection (usually 1-3 seconds). Request timeout: how long to wait for the full response after connecting (depends on the operation). Socket timeout: how long to wait between bytes of data during a response transfer. Set all three. A missing socket timeout means a connection that starts sending but then stalls can hold a thread indefinitely even if connection and request timeouts are set.', code: null },
        { heading: 'Cascading Timeouts', body: 'When you have a chain of services (A calls B calls C calls D), timeouts must be set carefully. If A has a 2-second timeout and B has a 2-second timeout, B might time out just after A does. A gets an error from its own timeout, B\'s timeout fires too but its error goes nowhere. The correct approach: outer timeout should be shorter than inner timeouts. If A gives B 1 second, B should give C 800ms, so there is time for B to handle C\'s timeout and return a meaningful error to A.', code: null },
      ],
      animationSteps: [
        { label: 'Request sent',      description: 'Service A calls Service B',                  highlight: false },
        { label: 'B is slow',         description: 'B takes too long - no response coming',      highlight: true  },
        { label: 'Timeout fires',     description: '500ms elapsed - timeout triggers',           highlight: true  },
        { label: 'Thread freed',      description: 'A\'s thread released - no longer blocked',   highlight: false },
        { label: 'Fallback or error', description: 'A returns fallback/error to caller quickly', highlight: false },
      ],
      example: 'Google\'s internal RPC system (Stubby, later open-sourced as gRPC) requires every call to have a deadline. The deadline propagates through the entire call chain - if the outer caller has 500ms left and calls a sub-service, that sub-service receives a context with 500ms remaining. If a component in the chain would take longer than the remaining deadline, it cancels its work immediately. Work is never done for a request that has already timed out upstream.',
    },
  },

  // 6. Bulkhead Pattern
  {
    order: 6, type: 'content', title: 'Bulkhead Pattern',
    content: {
      overview: 'The Bulkhead pattern is named after the watertight compartments in a ship\'s hull. If one compartment is breached, water floods that section but the other compartments stay dry and the ship stays afloat.\n\nIn software, bulkheads isolate resources so that a failure or overload in one part of the system cannot consume resources needed by other parts.',
      sections: [
        { heading: 'The Problem Without Bulkheads', body: 'Service A calls downstream services B, C, and D. All calls share the same thread pool of 20 threads. Service B becomes slow. Requests to B accumulate, consuming threads. With 20 threads and 2-second B timeouts, within 10 seconds all 20 threads are occupied waiting for B. Calls to C and D - which are perfectly healthy - cannot be served because there are no free threads. One slow service B has made C and D effectively unreachable.', code: null },
        { heading: 'Thread Pool Bulkheads', body: 'Solution: assign a separate thread pool per downstream dependency. Service B gets 10 threads. Service C gets 5 threads. Service D gets 5 threads. When B becomes slow and fills its 10 threads, calls to C and D still have their own dedicated pools. B\'s problems are contained to its own bulkhead. This resource isolation is the defining characteristic of the bulkhead pattern. Hystrix and Resilience4j implement thread pool bulkheads.', code: null },
        { heading: 'Semaphore Bulkheads', body: 'Thread pool bulkheads add significant overhead (each call runs in a separate thread pool). Semaphore bulkheads are lighter weight: instead of a separate thread pool, use a semaphore to limit the maximum concurrent calls to a downstream service. When B has reached its semaphore limit (say 10 concurrent calls), new calls to B immediately return an error instead of queuing. Same isolation effect with less overhead. Use semaphores for fast operations where thread pool overhead dominates.', code: null },
        { heading: 'Other Bulkhead Types', body: 'The bulkhead principle applies beyond thread pools. Connection pool bulkheads: separate database connection pools per service. Deployment bulkheads: deploy to different server groups so a bad deployment affects only one group. Data store bulkheads: separate databases per service so a runaway query in one does not affect others. Queue bulkheads: separate message queues per message type so a consumer bottleneck on type A does not delay type B messages.', code: null },
      ],
      animationSteps: [
        { label: 'Without bulkhead',  description: 'All 20 threads shared between B, C, D',     highlight: true  },
        { label: 'B fills threads',   description: 'B slow - takes all 20 threads',              highlight: true  },
        { label: 'C and D blocked',   description: 'C and D cannot run - no threads available',  highlight: true  },
        { label: 'With bulkhead',     description: 'B: 10 threads, C: 5 threads, D: 5 threads', highlight: false },
        { label: 'Isolation',         description: 'B fills its 10 - C and D still have theirs', highlight: false },
      ],
      example: 'Amazon uses bulkheads extensively in their internal services. Each microservice has separate thread pools for calls to different upstream services. When the recommendation service was having issues during Prime Day, the product page service continued serving product details and pricing from their separate thread pools. Only the recommendations section of the page was affected, not the entire product page.',
    },
  },

  // 7. Failover and Redundancy Patterns
  {
    order: 7, type: 'content', title: 'Failover and Redundancy Patterns',
    content: {
      overview: 'Failover is the automatic switching to a backup system when the primary system fails. Redundancy is having backup systems ready to take over.\n\nTogether they eliminate single points of failure and ensure the system continues operating when individual components fail - which they always will.',
      sections: [
        { heading: 'Active-Passive Failover', body: 'Active-passive has a primary system handling all traffic and a standby system waiting in reserve. When the primary fails (detected via health check or heartbeat), the standby is promoted to primary and starts handling traffic. Traffic switches automatically via DNS, load balancer, or VIP (Virtual IP). The standby may be hot (fully running and in sync), warm (running but needs some startup), or cold (needs to be provisioned and started). Hot standby has the fastest failover time (seconds).', code: null },
        { heading: 'Active-Active Failover', body: 'Active-active runs multiple instances simultaneously, all handling traffic. If one fails, the others continue - no switchover needed. Load balancers distribute traffic across all healthy instances and automatically stop sending to failed ones. Active-active provides both redundancy and additional capacity. It requires the system to be stateless (any instance can handle any request) and traffic to be distributable. Most modern web services use active-active for application tier.', code: null },
        { heading: 'Geographic Redundancy', body: 'Single-region active-active protects against server and AZ failures but not against regional disasters. Geographic redundancy deploys across multiple regions. DNS-based global load balancing (AWS Route 53, Cloudflare) routes users to the nearest healthy region. If an entire region fails, DNS failover directs all traffic to remaining regions within seconds. Recovery Time Objective (RTO) for geo-redundant systems can be under 60 seconds with automated DNS failover.', code: null },
        { heading: 'Data Replication for Failover', body: 'Failover only works if the backup system has up-to-date data. Database replication keeps replicas in sync with the primary. Synchronous replication: zero data loss but higher write latency. Asynchronous replication: low write latency but potential data loss on failover. Recovery Point Objective (RPO) defines the maximum acceptable data loss. RPO of zero requires synchronous replication. RPO of 5 minutes allows asynchronous with up to 5 minutes of lag.', code: null },
      ],
      animationSteps: [
        { label: 'Primary active',    description: 'Primary handles all traffic normally',       highlight: false },
        { label: 'Primary fails',     description: 'Health check detects primary failure',       highlight: true  },
        { label: 'Failover triggers', description: 'Standby promoted - VIP reassigned in <30s',  highlight: true  },
        { label: 'Traffic switches',  description: 'All requests now reach the new primary',     highlight: false },
        { label: 'Restored',          description: 'System operational - primary being rebuilt', highlight: false },
      ],
      example: 'GitHub experienced a 24-hour outage in 2018 from a 43-second network partition. When the east coast data center lost connectivity, their automated failover promoted the west coast replica to primary. When east coast reconnected, it had a newer version of some data. The 43-second partition caused diverged state that took 24 hours to reconcile safely. The lesson: data replication and failover are hard, and the reconciliation after failover is as important as the failover itself.',
    },
  },

  // 8. Graceful Degradation and Fallback
  {
    order: 8, type: 'content', title: 'Graceful Degradation and Fallback',
    content: {
      overview: 'Graceful degradation means that when part of a system fails, the system continues to function with reduced capability rather than failing completely. A fallback is the specific alternative response returned when the primary function cannot execute.\n\nThe goal: always provide some value to the user even when things go wrong.',
      sections: [
        { heading: 'Graceful Degradation Design', body: 'For every external service call, define what happens if it fails. If the recommendation engine is down: show generic popular items (not an error page). If the user profile service is slow: show the page without personalisation (not a spinner forever). If the inventory service is unreachable: show "check availability" instead of exact stock count. Each degraded mode is explicitly designed, tested, and deployed. Without deliberate design, failures produce blank pages or error messages.', code: null },
        { heading: 'Types of Fallbacks', body: 'Static fallback: return a hardcoded default value (empty list, default price, generic content). Cached fallback: return the last known good response from cache (may be slightly stale but better than nothing). Stubbed fallback: return a mock or simplified response. Fail fast: return an error immediately with a clear message rather than waiting. Alternative service fallback: route to a less-featured but more reliable alternative. Choose based on what is acceptable for your users and your business.', code: null },
        { heading: 'Stale Cache as Fallback', body: 'One of the most practical fallback patterns: when the live data source fails, serve the last cached response with a "stale" indicator. Users see data that is minutes old rather than an error. The cache TTL policy needs to be tuned: set a separate stale-while-revalidate or stale-if-error TTL that is much longer than the normal cache TTL. Normal TTL: 5 minutes. Stale-if-error TTL: 24 hours. If the backend fails, serve up to 24-hour-old data rather than an error.', code: null },
        { heading: 'Progressive Enhancement', body: 'Progressive enhancement builds the user experience in layers. The core experience (see the product, place the order) works with minimal dependencies. Enhanced features (personalised recommendations, real-time inventory, review summaries) are added on top. If enhanced features fail, core experience is unaffected. This architecture makes graceful degradation natural - the core path has fewer dependencies to fail, and enhanced features are optional by design.', code: null },
      ],
      animationSteps: [
        { label: 'Primary fails',     description: 'Recommendation service is down',             highlight: true  },
        { label: 'Fallback triggered', description: 'Circuit breaker opens - no call to service', highlight: true  },
        { label: 'Cached response',   description: 'Last known good recommendations returned',   highlight: false },
        { label: 'User sees',         description: 'Generic popular items - not an error page',  highlight: false },
        { label: 'Primary recovers',  description: 'Service back up - fallback disabled',        highlight: false },
      ],
      example: 'Amazon\'s product page degrades gracefully when dependencies fail. The core: product title, price, images, and add-to-cart button always work (served from highly available microservices). If the recommendations service fails: the "customers also bought" section shows a cached or empty state. If the review service is slow: reviews load asynchronously or show a spinner, not blocking the page. If inventory is unavailable: shows "check availability" rather than blocking purchase.',
    },
  },

  // 9. Health Checks and Self-Healing Systems
  {
    order: 9, type: 'content', title: 'Health Checks and Self-Healing Systems',
    content: {
      overview: 'Health checks are the mechanism by which load balancers, orchestrators, and monitoring systems determine whether a service instance is capable of handling requests. Self-healing systems detect unhealthy instances and automatically replace or repair them without human intervention.\n\nFast failure detection + automatic remediation = minimal downtime from inevitable failures.',
      sections: [
        { heading: 'Types of Health Checks', body: 'Liveness check: is the process alive? A simple TCP connection check or HTTP 200 from /health. If this fails, restart the process. Readiness check: is the service ready to handle requests? Checks DB connectivity, cache connectivity, and dependent service availability. If this fails, stop sending traffic but do not restart. A service can be alive (liveness ok) but not ready (DB connection pool exhausted). Kubernetes uses both: livenessProbe triggers restart, readinessProbe removes from load balancer rotation.', code: null },
        { heading: 'What a Good Health Check Does', body: 'A minimal health endpoint just returns 200. A meaningful health check verifies the service can actually handle requests: check the database connection with a lightweight query, check Redis connectivity, check the message queue connection, verify critical config is loaded, check available disk space. Return 503 if any critical dependency is broken. Return specific details about what failed. The health check is your contract with the load balancer that this instance is ready to serve.', code: null },
        { heading: 'Self-Healing with Kubernetes', body: 'Kubernetes implements self-healing automatically. If a pod\'s liveness probe fails 3 times, Kubernetes restarts the container. If a readiness probe fails, the pod is removed from the Service endpoints and no traffic is sent to it. Deployment rolling updates check readiness before routing traffic to new pods. If a node fails, Kubernetes reschedules pods on healthy nodes. HorizontalPodAutoscaler scales pods based on CPU or custom metrics. This automatic management handles most common failure modes without human intervention.', code: null },
        { heading: 'Chaos Engineering', body: 'Self-healing systems must be tested under realistic failure conditions. Chaos engineering deliberately introduces failures in production to verify the system handles them correctly. Netflix\'s Chaos Monkey randomly terminates production instances. Chaos Gorilla shuts down entire availability zones. Latency Monkey injects network delays. If the system cannot survive random instance termination, it is not truly resilient. Test your failover, health checks, and auto-recovery in production on a schedule rather than discovering they do not work during an actual incident.', code: null },
      ],
      animationSteps: [
        { label: 'Health check ping',  description: 'Load balancer pings /health every 5s',      highlight: false },
        { label: 'Instance fails',     description: 'Health check returns 503 - DB down',         highlight: true  },
        { label: 'Removed from pool',  description: 'Instance removed from load balancer pool',  highlight: true  },
        { label: 'Kubernetes restarts', description: 'Liveness probe fails - container restarted', highlight: false },
        { label: 'Readiness passes',   description: 'Returns 200 - added back to rotation',       highlight: false },
      ],
      example: 'Kubernetes health checks saved a production incident at a large e-commerce company. A bad deployment caused 30% of pods to have memory leaks. Within 10 minutes, those pods failed their liveness probes (OOM kill) and were automatically restarted. Kubernetes immediately spun up new healthy pods to replace them. The readiness probe ensured traffic only went to healthy pods during the restart. Total user impact: near zero. Without automated health checks and self-healing, this would have required a 2-AM page to an on-call engineer.',
    },
  },

  // 10. Rate Limiting and Throttling as Reliability Patterns
  {
    order: 10, type: 'content', title: 'Rate Limiting and Load Shedding',
    content: {
      overview: 'Rate limiting and load shedding are proactive reliability patterns that protect a system from being overwhelmed by too much traffic. Rather than accepting all requests and degrading for everyone, these patterns selectively reject excess requests so the system stays healthy for the requests it does accept.\n\nA system that crashes under overload provides zero availability. A system that rejects 20% of requests provides 80% availability - far better.',
      sections: [
        { heading: 'Rate Limiting', body: 'Rate limiting caps how many requests a client can make per unit of time. If the limit is 100 requests per minute and a client sends 200, the extra 100 are rejected with HTTP 429 Too Many Requests. Rate limiting protects against abusive clients, bot traffic, and accidental runaway loops. It enforces fairness in multi-tenant systems so one heavy client cannot degrade others. Implement at the API gateway with counters stored in Redis shared across all gateway instances.', code: null },
        { heading: 'Load Shedding', body: 'Load shedding is different from rate limiting. Rate limiting is per-client. Load shedding is system-wide. When the total system load exceeds capacity, load shedding proactively rejects a percentage of incoming requests - typically the lowest-priority ones. Example: when queue depth exceeds 10,000 messages, reject 50% of non-critical requests. When CPU exceeds 80%, start dropping batch processing requests while continuing to serve user-facing APIs. The goal: maintain acceptable performance for critical requests when total capacity is exceeded.', code: null },
        { heading: 'Admission Control', body: 'Admission control decides whether to accept new requests based on current system state. Unlike rate limiting (count-based), admission control is state-based. Measure current CPU, memory, and queue depth. Set admission thresholds: if CPU > 80% reject non-critical requests, if memory > 90% reject everything but health checks. The CoDel (Controlled Delay) algorithm rejects requests when queue waiting time exceeds a threshold - an elegant indicator of overload.', code: null },
        { heading: 'Priority Queues', body: 'Not all requests are equal. When load shedding is necessary, shed the least valuable requests first. Assign priorities: P0 health checks and authentication (never shed), P1 user-facing APIs (shed last), P2 background jobs (shed first), P3 analytics and logging (shed aggressively). Process from high priority down. When capacity is 80%, process all P0, P1, P2 and shed P3. At 60% capacity, start shedding P2. This ensures the most important work always gets done during overload.', code: null },
      ],
      animationSteps: [
        { label: 'Traffic spike',     description: '1000 req/sec arriving - capacity is 500/sec', highlight: true  },
        { label: 'Rate limit check',  description: 'Per-client: heavy user at 150/min - cap 100', highlight: true  },
        { label: 'Excess rejected',   description: 'Extra requests get 429 Too Many Requests',   highlight: false },
        { label: 'Load shedding',     description: 'System at 90%: shed low-priority batch jobs', highlight: false },
        { label: 'Core stable',       description: 'User-facing traffic served at full speed',    highlight: false },
      ],
      example: 'Google\'s production systems use a combination of rate limiting and load shedding. At the API gateway layer, per-client quotas prevent any single client from using more than their allocated share. At the service layer, each service has a maximum request rate and uses load shedding with priority queues. During the 2020 peak of COVID-19 lockdowns, YouTube traffic doubled overnight. Load shedding on non-critical features (comment loading, channel analytics) kept video playback - the core user experience - running smoothly.',
    },
  },

  // 11. Failure Cases
  {
    order: 11, type: 'failureCases', title: 'Failure Cases',
    failureCases: [
      {
        title: 'Circuit Breaker Opens but No Fallback - Blank Page',
        scenario: 'A product page service has circuit breakers on all downstream calls. During an outage, the recommendation service circuit breaks, the review service circuit breaks, and the inventory service circuit breaks. The developer implemented circuit breakers but forgot to implement fallbacks. The product page renders with no recommendations, no reviews, and no stock information - but instead of degraded content it shows null errors and blank sections. Users see a broken page.',
        impact: 'Circuit breakers prevented cascading failure but the user experience is broken. Worse than graceful degradation - it looks like a bug.',
        resolution: 'Circuit breakers and fallbacks must be implemented together. For every circuit breaker, define the fallback: recommendations return a cached list of popular items, reviews return "no reviews yet", inventory returns "check availability". Test all fallback paths explicitly in staging.',
        animationSteps: [
          { label: 'CB opens',         description: '3 circuit breakers open during outage',       highlight: true  },
          { label: 'No fallback',      description: 'No fallback defined - returns null',          highlight: true  },
          { label: 'Blank page',       description: 'User sees broken page with null sections',    highlight: true  },
          { label: 'CB worked',        description: 'Cascade prevented but UX is broken',         highlight: false },
          { label: 'Fix',              description: 'Always pair circuit breaker with fallback',   highlight: false },
        ],
      },
      {
        title: 'Retry Storm After Recovery',
        scenario: 'A service has a 60-second outage. During the outage, 50,000 requests fail. The retry policy immediately retries on failure without backoff or jitter. When the service recovers at t=60s, all 50,000 retries fire simultaneously - 50,000 requests arrive in one second instead of the normal 833/second. The service immediately becomes overloaded again and fails again. Recovery triggers another retry storm. The service cannot recover.',
        impact: 'Retry storm prevents the service from ever recovering. The system is stuck in a loop: recover, get overwhelmed, fail, repeat.',
        resolution: 'Exponential backoff with jitter spreads retries over time. After 60 seconds of outage, retries arrive spaced over the next 60 seconds rather than all at once. The service recovers gradually. Combine with circuit breakers: when the circuit closes after 60s, allow traffic through gradually.',
        animationSteps: [
          { label: 'Outage 60s',       description: '50,000 requests fail during 60s outage',     highlight: false },
          { label: 'Service recovers', description: 'Service comes back online at t=60s',          highlight: false },
          { label: 'Retry storm',      description: '50,000 retries arrive simultaneously',        highlight: true  },
          { label: 'Crashes again',    description: 'Overwhelmed - service fails again instantly',  highlight: true  },
          { label: 'Fix',              description: 'Backoff + jitter spreads retries over 60s',   highlight: false },
        ],
      },
      {
        title: 'Health Check Too Shallow - Failing Node Stays in Rotation',
        scenario: 'A health check endpoint returns 200 OK as long as the HTTP server is running. A service instance\'s database connection pool is exhausted - all 20 connections are in use and new DB queries fail immediately. The HTTP server is running, so the health check returns 200. The load balancer continues sending traffic to this instance. Every request that hits this instance fails with a database error. 10% of all users get errors.',
        impact: '10% of requests fail silently. The broken instance looks healthy but every real request fails. Harder to diagnose than a complete failure.',
        resolution: 'Health checks must verify actual functionality. The /health endpoint should run a lightweight database query (SELECT 1), check available connection pool slots, verify Redis connectivity. Return 503 if any critical dependency is broken. Use Kubernetes readinessProbe at /health/ready that checks dependencies.',
        animationSteps: [
          { label: 'DB pool full',     description: 'All 20 DB connections exhausted',            highlight: true  },
          { label: 'Health: 200 OK',   description: 'HTTP server up - shallow check passes',       highlight: true  },
          { label: 'Traffic sent',     description: 'LB sends 10% of traffic to broken instance', highlight: false },
          { label: '10% fail',         description: 'Every request to this instance fails',        highlight: false },
          { label: 'Fix',              description: 'Health check runs SELECT 1 - returns 503',    highlight: false },
        ],
      },
      {
        title: 'Bulkhead Not Sized Correctly - Still Cascades',
        scenario: 'A developer implements bulkheads to isolate service dependencies. Service B gets its own thread pool of 2 threads. Service B starts responding slowly (2 seconds). With 2 threads and 2-second timeouts, the system can handle 1 request/second to B before the bulkhead fills. Normal B traffic is 10 requests/second. Within 2 seconds the bulkhead is saturated and new B calls get rejected. The developer thought they had protection but the bulkhead was too small.',
        impact: 'False sense of security from an undersized bulkhead. All B calls fail even though the intent was isolation, not prevention of normal traffic.',
        resolution: 'Size bulkheads based on measured traffic patterns. If B normally handles 10 req/sec with 200ms latency, the thread pool needs at least 10 * 0.2 = 2 threads just for normal load, plus headroom for spikes. A common formula: (peak_requests_per_second * average_latency_seconds) * 1.5 safety factor. Monitor bulkhead saturation and alert when thread pool is consistently above 70% utilised.',
        animationSteps: [
          { label: 'Bulkhead: 2 threads', description: 'B thread pool sized at only 2 threads',  highlight: false },
          { label: 'B slows to 2s',    description: 'B takes 2 seconds per request',              highlight: true  },
          { label: 'Pool fills fast',  description: '2 threads, 2s latency = 1 req/sec capacity', highlight: true  },
          { label: 'B calls rejected', description: 'Normal 10/sec traffic fills bulkhead',       highlight: false },
          { label: 'Fix',              description: 'Size pool: peak_rps * avg_latency * 1.5',    highlight: false },
        ],
      },
      {
        title: 'Timeout Longer Than User\'s Patience - Zombie Requests',
        scenario: 'A mobile app has a 60-second HTTP timeout. The API server behind it has a 60-second timeout to the database. The database query takes 55 seconds on a bad day. The user waits 55+ seconds, gives up and closes the app at second 20. The backend continues processing for 35 more seconds - consuming DB connection, server thread, and CPU for a request whose response will never be delivered.',
        impact: 'Zombie requests consume real resources for work that benefits no user. At scale, zombie requests can saturate DB connections and server threads, causing real requests to queue or fail.',
        resolution: 'Short user-facing timeouts (5-10 seconds for typical API calls). Propagate deadlines: if the user\'s request context has 5 seconds, all downstream calls have at most 5 seconds total. Use context cancellation (Go context, gRPC deadlines) so when the outer request is abandoned, all downstream work stops immediately.',
        animationSteps: [
          { label: 'User request',     description: 'User waits for API response',                highlight: false },
          { label: 'User gives up',    description: 'User closes app after 20s - too slow',       highlight: true  },
          { label: 'Backend continues', description: 'Server still runs DB query for 35 more s',  highlight: true  },
          { label: 'Zombie resource',  description: 'DB connection + thread held - no value',     highlight: true  },
          { label: 'Fix',              description: 'Propagate deadline - cancel downstream work', highlight: false },
        ],
      },
    ],
  },

  // 12. Interview Questions
  {
    order: 12, type: 'interview', title: 'Interview Discussion Questions',
    interviewQuestions: [
      {
        question: 'Explain the circuit breaker pattern. When does it open, and what happens when it does?',
        answer: 'A circuit breaker monitors calls to a downstream service. In closed state (normal), all calls pass through and are tracked. When failure rate exceeds a threshold (e.g., 50% of calls fail in a 10-second window), the breaker trips to open state. In open state, all calls immediately return an error without calling the downstream service - no timeout wait, just an instant error. After a configured cooldown (30-60 seconds), the breaker moves to half-open and allows one test request. If the test succeeds, the breaker closes. If it fails, the breaker reopens. This prevents cascading failures: a slow Service B can no longer exhaust Service A\'s threads because A never actually calls B when the breaker is open.',
        difficulty: 'medium',
      },
      {
        question: 'What is the difference between a liveness probe and a readiness probe in Kubernetes?',
        answer: 'Liveness probe: "is the container alive?" If this fails, Kubernetes kills and restarts the container. Use for: detecting deadlocks, process crashes, or states the container cannot recover from without a restart. Readiness probe: "is the container ready to accept traffic?" If this fails, Kubernetes removes the pod from service endpoints - no traffic is sent to it, but the container is not restarted. Use for: waiting for cache warm-up on startup, database connectivity checks, detecting when a service is temporarily overloaded. A pod can be live (should not be restarted) but not ready (should not receive traffic) - e.g., still warming up its local cache after restart.',
        difficulty: 'medium',
      },
      {
        question: 'How would you implement exponential backoff with jitter for retries?',
        answer: 'Exponential backoff: on first failure, wait base seconds (say 1s). On second failure, wait base * 2 (2s). On third, base * 4 (4s), etc., up to a maximum cap (say 60s). Formula: min(maxBackoff, base * 2^attempt). Without jitter, all retrying clients synchronise - they all waited the same time and all retry at the same moment. Full jitter: retry after random(0, min(maxBackoff, base * 2^attempt)). This randomises retry timing across all clients, spreading the load. Only retry on retriable errors (timeouts, 503, 429). For non-idempotent operations, include a unique idempotency key so safe retrying does not cause double processing.',
        difficulty: 'medium',
      },
      {
        question: 'What is the bulkhead pattern and when is it most valuable?',
        answer: 'Bulkhead isolates resources per downstream dependency to prevent one slow dependency from consuming all shared resources. Implementation: assign a separate thread pool (or semaphore) to each downstream service. If Service B becomes slow, it only fills its own thread pool - calls to Services C and D still have their dedicated resources. Most valuable when: a service calls multiple downstream services with different reliability profiles, some dependencies are more volatile than others, or one dependency handles significantly higher call volume. Size thread pools based on: expected_requests_per_second * average_latency_seconds * safety_factor. Monitor pool utilisation and alert at 70% to catch undersizing before it causes problems.',
        difficulty: 'medium',
      },
      {
        question: 'How do you decide what timeout value to set for a service call?',
        answer: 'Measure first: collect P50, P95, and P99 latency of the dependency under normal load. Set timeout at 2-3x the P99 to allow for normal variation while catching genuine slowness. Too short: legitimate slow operations fail unnecessarily. Too long: threads are held for too long during failures, potentially causing cascading problems. Consider the full timeout hierarchy: outer caller\'s timeout must be longer than inner caller\'s timeout, or the inner service may fail before the outer one has a chance to handle the error. For user-facing requests, budget backward from the maximum acceptable user wait time (say 2 seconds total) and allocate portions to each service call. Never have a service call with no timeout.',
        difficulty: 'medium',
      },
      {
        question: 'Design a gracefully degrading e-commerce product page. Which parts can degrade and which cannot?',
        answer: 'Core - cannot degrade: product title, main image, price, add-to-cart button. These come from the product catalog service and must work - without them the page has no value. Must degrade gracefully: recommendations ("customers also bought") - fallback to cached popular items or empty state. User reviews - fallback to "no reviews yet" or cached reviews. Real-time inventory - fallback to "check availability" button. Personalisation (recently viewed) - fallback to omit the section. Shipping estimate - fallback to "estimate at checkout". Implementation: each section loads independently (micro-frontends or async JS). Circuit breakers on each backend call. Explicit fallback for each. The page always renders the core in under 500ms even if all optional services are down.',
        difficulty: 'hard',
      },
      {
        question: 'What is load shedding and how is it different from rate limiting?',
        answer: 'Rate limiting is per-client: each client gets an allocation (100 requests/minute). It prevents any single client from using disproportionate resources. Applied at the API gateway based on client identity. Load shedding is system-wide: when total system load exceeds capacity, proactively reject the lowest-priority requests regardless of which client sent them. Applied when system metrics (CPU, queue depth, memory) exceed thresholds. Rate limiting: fair allocation between clients. Load shedding: system self-protection during overload. Use together: rate limiting prevents any client from causing overload, load shedding handles cases where aggregate traffic exceeds capacity. Priority queue with load shedding: when shedding 30% of requests, shed from lowest priority bucket first (batch jobs, analytics) before touching user-facing APIs.',
        difficulty: 'medium',
      },
      {
        question: 'What is chaos engineering and why is it valuable for reliability patterns?',
        answer: 'Chaos engineering deliberately injects failures into production systems to verify they behave as expected. Netflix Chaos Monkey randomly terminates EC2 instances. Chaos Gorilla shuts down availability zones. Latency Monkey adds artificial network delays. The value: reliability patterns (circuit breakers, health checks, failover) are only as good as their tests. A circuit breaker that has never been tested in production may be misconfigured, trip at the wrong threshold, or have a broken fallback. Discovering this during a real incident is costly. Chaos engineering finds these gaps on a schedule. Start small: inject failures in lower environments first. Graduate to production during business hours with engineers ready to intervene. The goal is not to cause outages but to prove your reliability patterns actually work when they are needed.',
        difficulty: 'hard',
      },
    ],
  },

  // 13. Quiz
  {
    order: 13, type: 'quiz', title: 'Reliability Patterns Quiz',
    quizConfig: {
      timeLimitSeconds: 600, maxAttempts: 3, passingPercent: 70,
      questions: [
        {
          question: 'Service A calls Service B. B becomes slow (30s response). Without any reliability patterns, what happens to Service A?',
          options: ['A returns an error immediately', 'A\'s threads accumulate waiting for B, eventually exhausting A\'s thread pool', 'A automatically switches to a fallback', 'A retries the call to B'],
          correctIndex: 1, scenario: true,
          explanation: 'Thread exhaustion. Without a timeout or circuit breaker, A\'s threads block waiting for B. With enough concurrent requests and 30-second waits, all threads fill. New requests to A cannot be served. This cascade brings down A even though only B was failing.',
        },
        {
          question: 'A circuit breaker is in half-open state. What does this mean?',
          options: ['50% of requests are allowed through', 'The breaker is permanently disabled', 'One test request is allowed - if it succeeds the breaker closes, if it fails it reopens', 'The breaker is being manually reset'],
          correctIndex: 2, scenario: false,
          explanation: 'Half-open is the probe state. After the open timeout expires, the circuit breaker allows one test request to verify the downstream service has recovered. Success closes the circuit and resumes normal traffic. Failure reopens the circuit for another timeout period. This prevents flooding a recovering service.',
        },
        {
          question: 'You retry a failed database query without backoff. 1000 clients all retry simultaneously after failure. What happens?',
          options: ['The retries succeed since the failure was transient', 'All 1000 retries hit the database at once - potentially overloading it again', 'The database handles retries specially', 'Only the first retry per client is sent'],
          correctIndex: 1, scenario: true,
          explanation: 'Retry storm. Synchronised retries amplify load on an already struggling system. All 1000 clients waited the same time and retry together. Exponential backoff with jitter spreads retries over time, reducing peak retry load significantly.',
        },
        {
          question: 'A Kubernetes liveness probe fails 3 times. What does Kubernetes do?',
          options: ['Removes the pod from load balancer rotation', 'Kills and restarts the container', 'Scales up a new replica', 'Alerts the on-call engineer'],
          correctIndex: 1, scenario: false,
          explanation: 'Liveness failure = restart. The liveness probe determines if the container should be restarted. 3 consecutive failures (configurable) triggers a container restart. Compare with readiness probe failure which removes the pod from service endpoints but does not restart it.',
        },
        {
          question: 'Service A shares a thread pool of 20 across calls to B, C, and D. B becomes slow. What happens to calls to C and D?',
          options: ['C and D are unaffected - they have their own threads', 'C and D slow down but are not blocked', 'B fills all 20 threads - C and D have no threads and appear down', 'C and D get the remaining threads automatically'],
          correctIndex: 2, scenario: true,
          explanation: 'Without bulkheads, the shared thread pool is exhausted by B. C and D cannot get threads and appear unavailable even though they are healthy. The bulkhead pattern assigns separate thread pools per dependency to prevent this isolation failure.',
        },
        {
          question: 'The recommendation service is down. Your product page should:',
          options: ['Return a 500 error for the entire page', 'Show the page without recommendations (empty section or generic popular items)', 'Block rendering until recommendations recover', 'Remove the recommendations section permanently'],
          correctIndex: 1, scenario: true,
          explanation: 'Graceful degradation. The recommendation service is a non-critical enhancement. The core product page (title, price, images, cart) should work independently. When the recommendation service fails, return cached popular items or an empty section. Never let an optional feature failure break the core experience.',
        },
        {
          question: 'You set a 60-second timeout on a user-facing API. The user waits 20 seconds and closes the app. What is wrong?',
          options: ['The timeout is too short', 'The backend continues processing for 40 more seconds wasting resources for a cancelled request', 'Nothing is wrong - 60s timeout is standard', 'The timeout should be even longer'],
          correctIndex: 1, scenario: true,
          explanation: 'Zombie requests. The user cancelled but the server keeps working. This wastes DB connections, threads, and CPU on work that will never be delivered. Fix: use context propagation (Go context, gRPC deadlines) so when the user\'s connection drops, all downstream work is cancelled immediately.',
        },
        {
          question: 'What is load shedding and when should it be applied?',
          options: ['Rejecting requests from specific clients (rate limiting)', 'System-wide proactive rejection of low-priority requests when total system load exceeds capacity', 'Distributing load across multiple servers', 'Caching responses to reduce database load'],
          correctIndex: 1, scenario: false,
          explanation: 'Load shedding is system-wide self-protection. When CPU exceeds 80% or queue depth exceeds threshold, proactively reject the lowest-priority requests (batch jobs, analytics) while continuing to serve high-priority user-facing requests. A system that rejects 20% of requests provides 80% availability - better than crashing and providing 0%.',
        },
        {
          question: 'A health check endpoint always returns 200 OK even when the database connection pool is exhausted. What problem does this cause?',
          options: ['The load balancer removes the instance', 'The load balancer keeps sending traffic to a broken instance - every request fails', 'Kubernetes restarts the pod', 'Nothing - the application handles it internally'],
          correctIndex: 1, scenario: true,
          explanation: 'Shallow health check. The load balancer thinks the instance is healthy and keeps routing traffic to it. Every real request fails because the database cannot be reached. A proper health check runs a lightweight database query and returns 503 if the connection pool is exhausted.',
        },
        {
          question: 'What is chaos engineering and why do Netflix and Amazon practice it?',
          options: ['A testing methodology that only runs in development environments', 'Deliberately injecting failures in production to verify reliability patterns actually work', 'An automated deployment pipeline for microservices', 'A monitoring system for detecting failures'],
          correctIndex: 1, scenario: false,
          explanation: 'Chaos engineering proactively validates that reliability patterns (circuit breakers, health checks, failover) work correctly under real failure conditions. Discovering a misconfigured circuit breaker during a chaos experiment on Tuesday is far better than discovering it during a real incident on Black Friday. It builds confidence in the system\'s resilience.',
        },
      ],
    },
  },
];

module.exports = RELIABILITY_PATTERNS_MODULES;
