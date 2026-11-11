// Static Observability and SLOs content - 13 modules total
const OBSERVABILITY_MODULES = [

  // 1. Observability Fundamentals
  {
    order: 1, type: 'content', title: 'Observability Fundamentals',
    content: {
      overview: 'Observability is the ability to understand the internal state of a system from its external outputs. A system is observable when you can answer: what is happening right now, why is it happening, and where exactly is the problem?\n\nObservability is not just monitoring. Monitoring tells you when something is broken. Observability helps you understand why it is broken - even for failures you have never seen before.',
      sections: [
        { heading: 'The Three Pillars', body: 'Observability rests on three data types. Logs are timestamped records of discrete events - what happened and when. Metrics are numeric measurements sampled over time - CPU 73%, 1,234 requests/second. Traces follow a single request through all the services it touches, showing where time was spent and where errors occurred. Together they give a complete picture: metrics show something is wrong, logs explain what happened, traces show exactly where.', code: null },
        { heading: 'Observability vs Monitoring', body: 'Monitoring is about known unknowns - you define dashboards and alerts for failure modes you anticipate. Observability is about unknown unknowns - when a failure happens that you did not predict, can you still diagnose it? A monolith with one log file is easy to monitor but not necessarily observable. A distributed system with 50 services, each emitting structured logs, metrics, and traces, is highly observable even though it is harder to monitor.', code: null },
        { heading: 'Why Observability Matters at Scale', body: 'In a monolith, debugging means reading one log file. In a microservices system with 50 services, a user request may touch 20 of them. Finding which service caused a failure without observability tools requires manually checking 20 service logs one by one - which can take hours. With proper observability: a trace ID follows the request across all services, centralised logs are searchable in one place, and metrics show which service degraded first. The same investigation takes minutes.', code: null },
        { heading: 'The Cost of Poor Observability', body: 'Poor observability has measurable costs. Mean Time to Detect (MTTD): how long before you know there is a problem? Mean Time to Resolve (MTTR): how long to fix it? Poor observability inflates both. Teams without observability tools often discover outages from customer complaints (long MTTD) and spend hours debugging with insufficient data (long MTTR). Good observability directly reduces downtime, which translates directly to revenue, reputation, and engineer sleep quality.', code: null },
      ],
      animationSteps: [
        { label: 'Problem occurs',  description: 'Something breaks in production',                highlight: true  },
        { label: 'Metrics alert',   description: 'Prometheus: error rate > 1% - alert fires',     highlight: true  },
        { label: 'Logs explain',    description: 'Elasticsearch: NullPointerException in service C', highlight: false },
        { label: 'Trace locates',   description: 'Jaeger: payment service took 4s - root cause',  highlight: false },
        { label: 'Fix in minutes',  description: 'MTTR drops from hours to minutes',              highlight: false },
      ],
      example: 'During the 2019 Google Cloud outage, their engineering team identified the root cause in under 30 minutes using distributed traces that followed impact across dozens of services. Without traces, correlating failures across that many interdependent services manually would have taken hours. The investment in observability infrastructure directly translated to faster recovery and less user impact.',
    },
  },

  // 2. Logging and Log Management
  {
    order: 2, type: 'content', title: 'Logging and Log Management',
    content: {
      overview: 'Logs are the most granular observability signal. They record discrete events with detail that metrics cannot capture: the exact error message, the user ID, the SQL query, the stack trace. When an alert fires and you know something is wrong, logs tell you exactly what happened.\n\nEffective logging requires not just emitting logs but structuring them, centralising them, and making them searchable.',
      sections: [
        { heading: 'Structured vs Unstructured Logging', body: 'Unstructured: "ERROR 2024-01-15 14:23:45 Payment failed for user 123". Hard to query programmatically. Structured (JSON): {"level":"error","timestamp":"2024-01-15T14:23:45Z","user_id":123,"event":"payment_failed","error":"insufficient_funds","trace_id":"abc123"}. Every field is queryable. You can filter by user_id, group by error type, correlate by trace_id. Always use structured logging in production.', code: null },
        { heading: 'What to Log', body: 'Log at the right level. DEBUG: detailed diagnostic information useful during development (too verbose for production). INFO: normal business events (user signed up, order placed). WARN: unexpected but handled situations (rate limit hit, retrying a request). ERROR: exceptions and failures that need investigation. Never log passwords, credit card numbers, or personal data. Always include: timestamp, request ID, user ID (if applicable), service name, and enough context to understand the event without looking at code.', code: null },
        { heading: 'Centralised Log Management', body: 'With 50 microservices each writing logs to their own container, finding a relevant log entry requires SSHing into each container. Centralised log management ships all logs to one searchable store. The ELK Stack (Elasticsearch, Logstash, Kibana) is the classic open-source solution. Datadog Logs and Splunk are managed alternatives. A log shipping agent (Fluentd, Filebeat) runs on each host and forwards logs. Engineers search and analyse from one place regardless of how many services exist.', code: null },
        { heading: 'Log Retention and Cost', body: 'Logs are expensive at scale. A system with 1,000 services each emitting 1KB per request at 10,000 RPS generates 10GB of logs per second = 864TB per day. Strategies: hot tier (last 7 days, fast SSD, full search), warm tier (last 30 days, slower storage), cold tier (90+ days, cheap object storage). Index only important fields for fast queries. Compress and archive everything. Set retention based on compliance requirements (financial: 7 years, GDPR: limited) not just cost.', code: null },
      ],
      animationSteps: [
        { label: 'Event happens',   description: 'Payment fails in the service',                  highlight: false },
        { label: 'Structured log',  description: '{level:error, user:123, error:insufficient_funds}', highlight: true },
        { label: 'Log shipper',     description: 'Fluentd forwards to Elasticsearch',             highlight: true  },
        { label: 'Centralised',     description: 'All 50 services logs searchable in Kibana',     highlight: false },
        { label: 'Find fast',       description: 'Filter trace_id=abc123: see full request path', highlight: false },
      ],
      example: 'GitHub processes over 1.5 PB of logs per day. They use a custom log pipeline that routes logs to different storage tiers based on importance. Application errors go to fast SSD storage for 30 days with full-text search. Access logs go to cheaper storage for 90 days. Audit logs (who did what to which repo) are retained for 7 years for compliance. Without tiered storage, the cost would be prohibitive.',
    },
  },

  // 3. Metrics and Monitoring
  {
    order: 3, type: 'content', title: 'Metrics and Monitoring',
    content: {
      overview: 'Metrics are numeric measurements collected over time. CPU 73%. 1,234 requests per second. P99 latency 487ms. 0.3% error rate. Unlike logs (which record individual events), metrics aggregate behaviour into numbers that can be graphed, trended, and alerted on.\n\nMetrics are the fastest observability signal to collect and query - essential for real-time monitoring and alerting.',
      sections: [
        { heading: 'Types of Metrics', body: 'Counters: monotonically increasing values (total requests, total errors). Never go down. Query as rate-of-change. Gauges: values that go up and down (CPU usage, queue depth, active connections). Query as current value. Histograms: distribution of values (request latency bucketed into 0-1ms, 1-10ms, 10-100ms, 100ms+). Query as percentiles (P50, P95, P99). Most important for latency monitoring since averages hide the tail experience that your worst-off users face.', code: null },
        { heading: 'Prometheus and the Pull Model', body: 'Prometheus is the standard open-source metrics system. It works by scraping (pulling) metrics from each service endpoint (/metrics) every 15 seconds. Each service exposes its own metrics. Prometheus stores them as time-series data. PromQL is the query language. Prometheus is push-agnostic - it discovers services via service discovery and pulls metrics. This simplifies the service (no SDK to send metrics) but requires Prometheus to reach every service.', code: null },
        { heading: 'The RED Metrics', body: 'The RED method defines three metrics every service should expose. Rate: how many requests per second is the service handling? Errors: what percentage of requests are failing? Duration: how long are requests taking (P50, P95, P99)? These three numbers give you a complete picture of service health. Add them to dashboards and set alerts. If you can only instrument one thing about a service, instrument these three.', code: null },
        { heading: 'Dashboards and Alerting', body: 'Grafana is the standard dashboard tool for Prometheus. Build service-level dashboards showing RED metrics per service. Build dependency graphs showing which services are unhealthy. Alert rules fire when metrics breach thresholds: error rate > 1% for 5 minutes, P99 latency > 500ms. Alerts route to PagerDuty or Opsgenie to notify on-call engineers. Good alerting pages on-call before users notice, with enough context in the alert to begin diagnosis immediately.', code: null },
      ],
      animationSteps: [
        { label: 'Service emits',   description: '/metrics endpoint: requests=1234, errors=4',    highlight: false },
        { label: 'Prometheus pulls', description: 'Scrapes every 15 seconds, stores time-series', highlight: true  },
        { label: 'RED metrics',     description: 'Rate: 1234/s, Errors: 0.3%, Duration: P99=487ms', highlight: true },
        { label: 'Grafana dashboard', description: 'Real-time graphs of all service health',      highlight: false },
        { label: 'Alert fires',     description: 'Error rate > 1% for 5 min: pages on-call',      highlight: false },
      ],
      example: 'Cloudflare monitors over 10,000 metrics per second from their global network. Their Grafana dashboards show traffic, errors, and latency per data center, per customer, and per product in real time. When a BGP route leak caused a traffic disruption in 2019, their metrics showed anomalous traffic patterns within seconds - far faster than any customer complaint could have alerted them.',
    },
  },

  // 4. Distributed Tracing
  {
    order: 4, type: 'content', title: 'Distributed Tracing',
    content: {
      overview: 'A distributed trace follows a single request through all the services it touches, recording the time spent in each service and the relationships between them. When a user request is slow or fails in a system with 20 microservices, tracing shows you exactly where the time was spent and where the error occurred.\n\nTracing is the most powerful observability tool for microservices - it converts a guessing game into a systematic investigation.',
      sections: [
        { heading: 'How Tracing Works', body: 'Every request receives a unique trace ID at the entry point (API gateway or first service). The trace ID is passed to every downstream service call via headers (usually X-Trace-ID or W3C Trace Context). Every service logs its operation with the trace ID: which service, what it did, how long it took, whether it succeeded. The tracing backend (Jaeger, Zipkin, Datadog APM) collects these spans and reconstructs the full trace as a waterfall diagram.', code: null },
        { heading: 'Spans and Traces', body: 'A trace is a tree of spans. A span represents a single operation: "Payment Service processed request" or "SELECT * FROM orders WHERE user_id=123". Each span has: service name, operation name, start time, duration, status (success/error), and optional tags (HTTP status code, database query, user ID). The trace shows all spans from a single request, their parent-child relationships, and their timing - revealing where the request spent its time.', code: null },
        { heading: 'Sampling', body: 'At high traffic volumes (100K requests/second), tracing every request generates enormous data volumes. Sampling records only a fraction of traces. Head-based sampling: decide whether to trace at the entry point (simple but misses rare errors). Tail-based sampling: collect all spans but only save traces that show errors or high latency (more sophisticated, captures the interesting cases). Start with 1% sampling for normal traffic and 100% sampling for errors.', code: null },
        { heading: 'Service Mesh Tracing', body: 'Adding trace instrumentation to every service requires code changes in every service. Service mesh tracing (Istio, Linkerd) adds tracing at the infrastructure level: sidecar proxies intercept all network traffic and generate spans automatically without any code changes. Each HTTP call between services generates a span with timing and status. This provides instant distributed tracing for all services at the cost of service mesh operational complexity.', code: null },
      ],
      animationSteps: [
        { label: 'Trace ID assigned', description: 'API Gateway assigns trace_id=abc123 to request', highlight: false },
        { label: 'Propagated',       description: 'Every service receives and logs trace_id=abc123', highlight: true  },
        { label: 'Spans collected',  description: 'Each service emits span: name, duration, status', highlight: true  },
        { label: 'Jaeger waterfall', description: 'Reconstruct: Order(10ms)->Payment(4s ERROR)',   highlight: false },
        { label: 'Root cause found', description: 'Payment service DB query took 3.9s - found!',    highlight: false },
      ],
      example: 'Uber\'s distributed tracing system (Jaeger, which they open-sourced) handles 100,000 traces per second across their microservices. When a driver app feature was intermittently slow for users in certain cities, tracing revealed it was a geo-lookup service with high P99 latency for specific postal codes. Without tracing, this would have been almost impossible to diagnose - the slowness only manifested for certain data patterns that were invisible in aggregate metrics.',
    },
  },

  // 5. Health Checks and Alerting
  {
    order: 5, type: 'content', title: 'Health Checks and Alerting',
    content: {
      overview: 'Health checks are the mechanism by which load balancers, orchestrators, and monitoring systems determine whether a service is functioning correctly. Alerting notifies engineers when health checks fail or metrics breach thresholds.\n\nTogether they form the first line of defence: fast failure detection followed by fast engineer notification.',
      sections: [
        { heading: 'Health Check Endpoints', body: 'A /health endpoint returns 200 if healthy, 503 if unhealthy. A shallow check just returns 200 (the process is running). A deep check verifies the service can actually handle requests: runs a lightweight database query, checks Redis connectivity, verifies critical config is loaded. Load balancers use liveness checks (is it running?) to route traffic and readiness checks (is it ready?) to determine when to include it in the pool. Kubernetes uses both livenessProbe and readinessProbe.', code: null },
        { heading: 'Synthetic Monitoring', body: 'Synthetic monitoring simulates real user actions to verify the system works end-to-end. A script runs every minute: open the homepage, search for a product, add to cart, check out. If any step fails or takes too long, alert fires. This catches failures that only manifest for real user flows - not just at the individual service level. Datadog Synthetics and AWS CloudWatch Synthetics provide managed synthetic monitoring.', code: null },
        { heading: 'Alert Design', body: 'Good alerts have three properties. Actionable: when it fires, the on-call engineer knows what to do. Accurate: fires only when there is a real problem (low false positive rate). Appropriate severity: not everything is a P1 at 3 AM. Alert design principles: alert on symptoms (user-visible impact), not causes (CPU is high). Use SLO-based alerting (error budget is burning too fast) rather than arbitrary thresholds. Test your alerts regularly - an alert that never fires might be misconfigured.', code: null },
        { heading: 'On-Call and Incident Management', body: 'Alerts route to PagerDuty or Opsgenie which contact the on-call engineer. Incident management tools (PagerDuty, Jira Service Management) track incidents from detection through resolution. Good incident response: acknowledge quickly (stops escalation), establish a war room (single Slack channel or call), assign incident commander, communicate status to stakeholders, write a postmortem after. MTTR (Mean Time to Resolve) is the key metric - reduce it by improving runbooks and observability tools.', code: null },
      ],
      animationSteps: [
        { label: 'Health ping',      description: 'Load balancer pings /health every 5 seconds',  highlight: false },
        { label: 'Deep check fails', description: '/health checks DB - returns 503 (DB down)',     highlight: true  },
        { label: 'Alert fires',      description: 'Prometheus: error rate >1% for 5 minutes',      highlight: true  },
        { label: 'PagerDuty',        description: 'On-call engineer paged with context',           highlight: false },
        { label: 'MTTR tracked',     description: 'Time from detection to resolution measured',    highlight: false },
      ],
      example: 'Atlassian publishes their MTTD and MTTR publicly in incident post-mortems. After a 2022 database deletion incident, their MTTD was 20 minutes (time to detect data was gone) and MTTR was several days (time to restore data from backups). The long MTTR revealed gaps in their backup and recovery observability. They subsequently invested heavily in continuous backup verification - synthetic monitoring for their own backup systems.',
    },
  },

  // 6. Golden Signals
  {
    order: 6, type: 'content', title: 'Golden Signals',
    content: {
      overview: 'The Four Golden Signals, defined by Google\'s Site Reliability Engineering book, are the most important metrics for any user-facing service. If you can only monitor four things, monitor these: Latency, Traffic, Errors, and Saturation.\n\nThey provide a complete picture of service health from the user\'s perspective and are the foundation of SLO-based monitoring.',
      sections: [
        { heading: 'Latency', body: 'Latency measures how long requests take. Track percentiles (P50, P95, P99) not just averages. The P99 latency is what your worst-served 1% of users experience - this is often 10x the median. A system with P50=50ms and P99=5000ms is not "fast on average" - it is fast for most users but broken for some. Alert on P99 latency exceeding your SLO. Track latency for successful and failed requests separately - failed requests often fail fast (which inflates the "fast" average).', code: null },
        { heading: 'Traffic', body: 'Traffic measures demand on the system. Requests per second, bytes per second, active connections, messages per second. Track traffic at multiple levels: total inbound traffic, traffic per endpoint, traffic per user tier. Traffic spikes trigger auto-scaling, reveal DDoS attacks, and explain latency degradation. Historical traffic patterns guide capacity planning. Sudden traffic drops can indicate problems just as much as spikes (users not reaching the service at all).', code: null },
        { heading: 'Errors', body: 'Error rate is the fraction of requests that fail. Distinguish error types: explicit (HTTP 500 responses) vs implicit (200 with wrong content, timeouts). Set error budget based on your SLO. Alert when error rate exceeds your threshold. Track errors by type (5xx vs 4xx), by endpoint, by user segment. A 1% global error rate might be 10% for one specific endpoint - aggregate metrics hide per-endpoint problems. User-impacting errors should page on-call; background job errors can wait for business hours.', code: null },
        { heading: 'Saturation', body: 'Saturation measures how "full" a resource is. CPU at 90%, memory at 85%, disk at 70%, connection pool at 95%. Saturation predicts future failures before they occur. A database connection pool at 95% utilisation will cause request failures at the next traffic spike. Alert on saturation trending upward, not just on the threshold being crossed. Use saturation metrics for capacity planning: when is the next resource going to be exhausted? Saturation is about the future, while the other three signals are about the present.', code: null },
      ],
      animationSteps: [
        { label: 'Latency',          description: 'P99=487ms - are requests fast enough?',         highlight: false },
        { label: 'Traffic',          description: '12,340 req/sec - is demand within capacity?',   highlight: true  },
        { label: 'Errors',           description: '0.3% error rate - are requests succeeding?',    highlight: true  },
        { label: 'Saturation',       description: 'CPU 73%, DB pool 68% - how full are resources?', highlight: false },
        { label: 'All green',        description: 'Four signals healthy = service is healthy',      highlight: false },
      ],
      example: 'Google\'s internal monitoring for Gmail is built entirely around the four golden signals. When the latency signal spikes, the investigation starts there. When traffic drops unexpectedly, it means users cannot reach the service. When errors spike, specific error types guide the investigation. When memory saturation crosses 85%, capacity planning kicks in. These four numbers answer "is Gmail healthy right now?" in a glance.',
    },
  },

  // 7. Service Level Indicators (SLIs)
  {
    order: 7, type: 'content', title: 'Service Level Indicators (SLIs)',
    content: {
      overview: 'A Service Level Indicator (SLI) is a carefully defined quantitative measure of service quality. It is the specific metric you use to measure whether your service is meeting expectations.\n\nChoosing the right SLI is crucial - it must accurately reflect user experience, not just system internals. A service can have 100% uptime but still be failing users if its latency is too high.',
      sections: [
        { heading: 'What Makes a Good SLI', body: 'A good SLI measures what users actually care about, not what is easy to measure. Good SLIs: "95% of requests complete in under 200ms" or "99.9% of requests return a non-5xx response". Bad SLIs: "CPU is below 80%" (users do not care about CPU directly) or "service is pingable" (a 200 from /ping does not mean the service is functional). SLIs should be measurable automatically, expressed as a ratio or percentage, and directly correlated with user experience.', code: null },
        { heading: 'Common SLI Types', body: 'Availability SLI: fraction of time the service is successfully serving requests. "Successful requests / total requests over 30 days." Latency SLI: fraction of requests faster than a threshold. "Requests completing in under 200ms / total requests." Error rate SLI: fraction of requests succeeding. "Non-5xx responses / total responses." Freshness SLI (data systems): fraction of time data is not too stale. "Fraction of queries where data is less than 5 minutes old."', code: null },
        { heading: 'Measuring SLIs', body: 'SLIs should be measured as close to the user as possible. Load balancer access logs capture all user requests (before service-level errors hide failures). Synthetic monitoring replays real user flows and measures from the user\'s perspective. Client-side instrumentation measures actual user experience including client-side rendering time and network latency. Each measurement point has tradeoffs: server-side is easy to implement, client-side is most accurate.', code: null },
        { heading: 'SLIs vs Metrics', body: 'All SLIs are metrics but not all metrics are SLIs. Metrics are raw measurements: request count, CPU usage, error count. SLIs are specific metrics chosen to represent service quality from the user\'s perspective. You might have 1,000 metrics but only 3-5 SLIs per service. The discipline of choosing SLIs forces clarity about what "working correctly" actually means for your service. If you cannot define an SLI for a service, you cannot measure whether it is working.', code: null },
      ],
      animationSteps: [
        { label: 'User request',     description: 'User requests the checkout page',               highlight: false },
        { label: 'Measure result',   description: 'Did it return success in under 200ms?',         highlight: true  },
        { label: 'Count good/bad',   description: 'Good: success + fast. Bad: error or slow',      highlight: true  },
        { label: 'SLI ratio',        description: 'SLI = good_requests / total_requests',          highlight: false },
        { label: 'SLI = 99.7%',     description: '99.7% of requests met quality criteria',         highlight: false },
      ],
      example: 'Spotify defines SLIs at the playlist level: "Percentage of playlist page loads that fully render within 2 seconds with all tracks visible." This SLI captures what users actually care about - not just that the server responded, but that the page is usable. A playlist page with a 200 response but only 2 of 50 tracks loaded is a failure in this SLI even though it would appear as a success in a simple availability metric.',
    },
  },

  // 8. Service Level Objectives (SLOs)
  {
    order: 8, type: 'content', title: 'Service Level Objectives (SLOs)',
    content: {
      overview: 'A Service Level Objective (SLO) is a target value for an SLI over a time window. "99.9% of requests will complete in under 200ms over any 30-day rolling window." SLOs define what good looks like - the reliability target your service aims to achieve.\n\nSLOs are the bridge between engineering metrics and business requirements. They make reliability measurable and comparable across teams.',
      sections: [
        { heading: 'Defining an SLO', body: 'An SLO combines an SLI with a target and a window. SLI: "fraction of requests completing successfully." Target: 99.9%. Window: rolling 30 days. Full SLO: "99.9% of requests in any 30-day window return a non-5xx response." The window defines how you measure compliance. Rolling windows (last 30 days) are more user-friendly than calendar windows (this month) because they respond continuously rather than resetting at the start of each month.', code: null },
        { heading: 'The Error Budget', body: 'The error budget is 100% minus the SLO target. For a 99.9% SLO: error budget = 0.1%. In 30 days (2,592,000 seconds), you can have 2,592 seconds (43 minutes) of complete downtime, or 0.1% of your total request volume fail. The error budget quantifies how much unreliability is acceptable. When the error budget is healthy, teams can ship changes aggressively. When it is nearly exhausted, they slow down and prioritise stability.', code: null },
        { heading: 'SLOs Enable Better Decisions', body: 'Without SLOs, reliability is a feeling. "Is the service reliable enough?" triggers endless debate. With SLOs: "We have burned 60% of our error budget with 15 days left in the window. We should freeze non-critical deployments." This creates objective data-driven decision-making around reliability vs velocity. The SLO framework aligns product, engineering, and operations teams around shared reliability targets.', code: null },
        { heading: 'Setting the Right SLO', body: 'SLOs should be achievable but meaningful. Setting 99.999% (five nines) for a service with current actual reliability of 99.5% creates an error budget you have already exhausted - meaningless. Setting 90% when users expect 99.9% means you are acceptable with 876 hours of downtime per year. Start with actual observed reliability, set the SLO slightly above current performance, then improve. Review SLOs quarterly as reliability improves.', code: null },
      ],
      animationSteps: [
        { label: 'SLI measured',    description: 'SLI: 99.72% requests successful last 30 days',  highlight: false },
        { label: 'SLO target',      description: 'SLO: 99.9% target for this 30-day window',       highlight: true  },
        { label: 'Error budget',    description: 'Budget = 0.1% = 2,592 seconds of downtime',      highlight: true  },
        { label: 'Budget consumed', description: '0.28% failure = budget overrun - SLO breached',  highlight: false },
        { label: 'Action',          description: 'Freeze deployments, focus on reliability',       highlight: false },
      ],
      example: 'Google Search has an SLO of 99.99% availability for search results returning in under 1 second. The error budget is 0.01% of requests over 30 days = 52.5 minutes of full downtime equivalent per month. Every time an engineer wants to deploy a change, they check: will this consume error budget? If the budget is healthy, deploy. If it is nearly exhausted, the change waits for the budget to replenish. This directly connects reliability to engineering velocity.',
    },
  },

  // 9. SLAs and Error Budgets
  {
    order: 9, type: 'content', title: 'SLAs and Error Budgets',
    content: {
      overview: 'A Service Level Agreement (SLA) is a formal contract between a service provider and their customers defining the minimum acceptable service quality and the consequences of falling below it. Error budgets are the operational tool that makes SLOs actionable - they transform abstract reliability percentages into concrete time-based allowances.\n\nTogether they create a framework where reliability is a business commitment with real consequences.',
      sections: [
        { heading: 'SLAs vs SLOs', body: 'SLOs are internal targets you set for yourself. SLAs are external commitments you make to customers with contractual penalties. SLOs should be stricter than SLAs: if your SLA is 99.9% and your SLO is 99.9%, you have no margin for error. Best practice: SLO = 99.95%, SLA = 99.9%. The 0.05% gap means you can breach your SLO (and use it as a signal to improve) without immediately breaching your customer contract and triggering refunds. Never set an SLA you cannot meet with your current infrastructure.', code: null },
        { heading: 'Error Budget Policy', body: 'An error budget policy defines what teams do when the budget is consumed. Example policy: If error budget > 50% remaining: deploy freely, focus on features. If error budget 10-50% remaining: require additional testing before deploy. If error budget < 10% remaining: freeze all non-critical deployments, prioritise reliability. If budget exhausted: halt new features until reliability improves. This policy is agreed in advance so there is no debate during an incident about what to do.', code: null },
        { heading: 'Burn Rate Alerting', body: 'An SLO breach is not a moment - it is a gradual accumulation of failures. Burn rate measures how fast you are consuming the error budget. If you burn 100% of a monthly budget in one day, the burn rate is 30x the sustainable rate. Alert at high burn rates (5x or 10x): "At the current error rate, we will exhaust the error budget in 2 hours." This gives teams time to respond before the SLO is breached, not after. Burn rate alerts are more actionable than absolute threshold alerts.', code: null },
        { heading: 'SLA Financial Implications', body: 'SLA violations have financial consequences. AWS commits to 99.99% uptime for many services and offers service credits when they fall short: 10% credit if availability drops to 99.0-99.9%, 25% credit if 95.0-99.0%, 100% credit below 95%. For enterprise SaaS, SLA penalties can be much larger. This financial accountability forces providers to take reliability seriously. Customers choose providers partly based on SLA terms.', code: null },
      ],
      animationSteps: [
        { label: 'SLO: 99.95%',    description: 'Internal target: stricter than SLA',              highlight: false },
        { label: 'SLA: 99.9%',     description: 'Customer contract: external commitment',           highlight: true  },
        { label: 'Error budget',    description: '0.05% gap: SLO margin before SLA breach',         highlight: true  },
        { label: 'Burn rate',       description: 'Budget burning 10x fast - alert fires',           highlight: false },
        { label: 'Freeze deploys',  description: 'Policy: halt features, focus reliability',        highlight: false },
      ],
      example: 'AWS S3 has a 99.99% availability SLA. When a major 2017 S3 US-East-1 outage caused 4+ hours of downtime, AWS issued service credits to affected customers automatically. The outage burned through the entire monthly error budget of 4.4 minutes in 4 hours. This SLA mechanism created accountability and drove AWS to invest in greater redundancy. Services depending on S3 also learned they needed their own SLOs accounting for dependency failures.',
    },
  },

  // 10. Observability in Practice
  {
    order: 10, type: 'content', title: 'Observability in Practice',
    content: {
      overview: 'Understanding observability theory is one thing. Building and operating production observability systems involves practical decisions: what to instrument first, how to structure the observability stack, how to manage costs, and how to use observability data to actually improve reliability.\n\nThis module covers the practical patterns for building observable systems.',
      sections: [
        { heading: 'Instrumentation Strategy', body: 'You cannot instrument everything - the data volume and cost would be prohibitive. Prioritise: instrument all user-facing endpoints first (they directly impact SLIs). Instrument all external service calls (errors and latency). Instrument all database queries (the most common bottleneck). Add custom business metrics for key flows (checkout completion rate, search relevance score). Start with the RED metrics per service, add specific metrics only when investigating a real problem. Do not instrument preemptively - instrument in response to observed problems.', code: null },
        { heading: 'The Observability Stack', body: 'A complete observability stack has four layers. Instrumentation: code-level metrics (Prometheus client libraries), structured logging (JSON), trace generation (OpenTelemetry). Transport: metrics pulled by Prometheus, logs shipped by Fluentd/Filebeat, traces sent to Jaeger. Storage: Prometheus + Thanos for long-term metrics, Elasticsearch for logs, Jaeger/Tempo for traces. Visualisation and alerting: Grafana for dashboards, Alertmanager for routing alerts. OpenTelemetry is the emerging standard for unified instrumentation across all three signal types.', code: null },
        { heading: 'Runbooks', body: 'An alert without a runbook is an alert that creates confusion at 3 AM. A runbook is step-by-step guidance for responding to a specific alert: what the alert means, what to check first, common causes and their fixes, escalation path if first steps do not resolve it. Good runbooks reduce MTTR dramatically. Runbooks should be linked directly from the alert notification. Update runbooks after every incident. The best runbooks are automatically executed (auto-remediation) - the alert fires and the runbook runs itself.', code: null },
        { heading: 'Post-Mortems', body: 'A post-mortem (also called incident review) is a blameless analysis of what went wrong after an incident. Five whys: keep asking why until you reach the root cause, not just the proximate cause. Output: timeline of events, root cause analysis, action items to prevent recurrence. Post-mortems are where observability investment pays back - better observability means more detailed timelines and clearer root causes. Publish post-mortems internally and sometimes externally to build trust.', code: null },
      ],
      animationSteps: [
        { label: 'Instrument first', description: 'Add RED metrics to all user-facing services',   highlight: false },
        { label: 'Alert fires',     description: 'P99 > 500ms for 5 minutes - pages on-call',       highlight: true  },
        { label: 'Trace + logs',    description: 'Trace shows DB slow; logs show missing index',    highlight: true  },
        { label: 'Fix deployed',    description: 'Index added - P99 drops from 2s to 50ms',        highlight: false },
        { label: 'Post-mortem',     description: 'Document: timeline, root cause, prevention',      highlight: false },
      ],
      example: 'Netflix\'s observability stack (Atlas for metrics, Edgar for traces, Mantis for streaming analytics) is part of their open source suite. After every production incident, they run a mandatory post-mortem that must include: a timeline reconstructed from observability data, a "five whys" root cause analysis, and at least three action items. This disciplined process has let Netflix maintain high availability while deploying thousands of times per day.',
    },
  },

  // 11. Failure Cases
  {
    order: 11, type: 'failureCases', title: 'Failure Cases',
    failureCases: [
      {
        title: 'Missing Trace ID - Debugging Takes Hours Not Minutes',
        scenario: 'A checkout service has 15% of requests failing intermittently. Engineers check the checkout service logs - nothing unusual. They check the payment service - nothing. They check the inventory service - nothing. They check the notification service - nothing. After 3 hours of manual log correlation, they find the failure in a shipping estimate service. No trace IDs were propagated between services.',
        impact: '3 hours of engineer time wasted. Customers experiencing failures for 3 hours. With trace IDs, the investigation would have taken 5 minutes - search for failed trace, see which span errored.',
        resolution: 'Make trace ID propagation mandatory. Use OpenTelemetry SDK which handles propagation automatically. Add trace ID to all alert notifications. Use service mesh (Istio) to handle propagation at the infrastructure level. Test trace propagation explicitly in CI/CD pipeline.',
        animationSteps: [
          { label: 'Request fails',   description: '15% of checkout requests failing',               highlight: true  },
          { label: 'Check service 1', description: 'Checkout logs: nothing unusual',                 highlight: false },
          { label: 'Check 2,3,4...',  description: 'Manual check of each service - hours pass',      highlight: true  },
          { label: 'Found at hour 3', description: 'Shipping service was the cause - found manually', highlight: true },
          { label: 'Fix',             description: 'Trace IDs: find in 5 minutes via trace search',   highlight: false },
        ],
      },
      {
        title: 'SLO Breach Discovered at Month End - Too Late to Act',
        scenario: 'An engineering team has an SLO of 99.9% availability over a 30-day window. They check their SLO dashboard once a week. On day 28, they discover their availability has been 99.6% for the past 15 days due to a background processing bug causing periodic errors. The error budget was exhausted on day 15 but no one noticed. The SLA with enterprise customers has been breached. Penalty credits must be issued.',
        impact: 'SLA breach. Financial penalties. Customer trust damage. All preventable if the team had been alerted when error budget burn rate was elevated on day 2.',
        resolution: 'Implement burn rate alerts. Alert at 5x burn rate (will exhaust budget in 6 days) and 10x burn rate (will exhaust in 3 days). Daily review of error budget consumption. Automated reports when budget drops below 50%.',
        animationSteps: [
          { label: 'Day 1: bug deployed', description: 'Background bug causes 0.4% error rate',    highlight: false },
          { label: 'Day 15: budget gone', description: 'Error budget exhausted - SLO breached',     highlight: true  },
          { label: 'Day 28: discovered',  description: 'Team checks dashboard: SLA violated!',      highlight: true  },
          { label: 'Too late',            description: '13 days of violations - customer credits',   highlight: true  },
          { label: 'Fix',                 description: 'Burn rate alert on day 1 would have caught this', highlight: false },
        ],
      },
      {
        title: 'Alert Fatigue - On-Call Ignores Critical Alerts',
        scenario: 'A service generates 500 alerts per week, mostly for transient issues that self-resolve within minutes. The on-call engineer has been paged at 3 AM 20 times in the past month for non-urgent issues. When a critical database failure occurs, the engineer sees an alert come in and ignores it - assuming it will self-resolve like the previous 20 false alarms. The database corruption is not addressed for 4 hours.',
        impact: 'Alert fatigue caused a critical incident to be ignored. 4-hour outage that should have been resolved in 20 minutes.',
        resolution: 'Audit all alert rules. Remove or silence any alert that does not require human action. Fix noisy alerts (tune thresholds or fix the underlying issue). Every alert should require action. Track false positive rate per alert rule. Set a maximum of 5 actionable alerts per on-call shift as a goal.',
        animationSteps: [
          { label: '500 alerts/week', description: 'Most alerts self-resolve - ignored by on-call',   highlight: true  },
          { label: 'Critical alert',  description: 'Database corruption - requires immediate action',  highlight: true  },
          { label: 'Ignored',         description: 'On-call assumes it will self-resolve',             highlight: true  },
          { label: '4-hour outage',   description: 'Critical issue ignored due to alert fatigue',     highlight: false },
          { label: 'Fix',             description: 'Remove noisy alerts - only page on actionable ones', highlight: false },
        ],
      },
      {
        title: 'Shallow Health Check Masks Real Failure',
        scenario: 'A service\'s health endpoint returns 200 OK as long as the HTTP server responds. A critical background job that syncs data from an external API has been failing silently for 6 hours - the data is now 6 hours stale. The health check still returns 200. The load balancer routes traffic normally. Users see stale data but the system appears healthy. No alert fires.',
        impact: 'Users served 6-hour-old data. Business decisions made on stale data. No detection until a user reports it.',
        resolution: 'Health checks must check the things users care about. Add a check: when was data last successfully synced? If sync is more than 15 minutes stale, return 503. Add an explicit SLI for data freshness. Create a separate "component health" dashboard showing each background job\'s last success time.',
        animationSteps: [
          { label: 'Sync fails',       description: 'External API sync job starts failing silently',  highlight: true  },
          { label: 'Health: 200',      description: 'Shallow check: HTTP server up - returns 200',    highlight: true  },
          { label: 'Traffic normal',   description: 'Load balancer routes traffic - no alert',        highlight: false },
          { label: 'Data 6h stale',    description: 'Users see 6-hour-old data - found by report',    highlight: true  },
          { label: 'Fix',              description: 'Deep health check: verify last sync <15min',     highlight: false },
        ],
      },
      {
        title: 'Logging PII - Compliance Violation Under Audit',
        scenario: 'A developer logs request bodies to help debug payment failures. The request body includes credit card numbers, billing addresses, and names. These logs are shipped to a centralised ELK stack that has broad access within the engineering team. During a compliance audit, the auditors find PII (Personally Identifiable Information) and credit card data in plain text in log files. This is a PCI-DSS and GDPR violation.',
        impact: 'Compliance violation. Potential fines (GDPR: up to 4% of global revenue). Mandatory notification to regulators. Customer notification. Emergency log purge operation.',
        resolution: 'Never log request/response bodies in production without scrubbing. Implement log scanning in CI/CD that rejects commits containing potential PII patterns. Use structured logging with explicit field allowlists. Regularly audit log contents. Apply log access controls so sensitive logs have restricted access.',
        animationSteps: [
          { label: 'Log request body', description: 'Developer logs full payment request body',       highlight: false },
          { label: 'PII in logs',      description: 'Credit card + name + address stored in ELK',    highlight: true  },
          { label: 'Broad access',     description: 'All engineers can search logs including PII',    highlight: true  },
          { label: 'Audit finds PCI',  description: 'Compliance audit finds card data in plain text', highlight: true  },
          { label: 'Fix',              description: 'Never log PII - scrub fields before logging',   highlight: false },
        ],
      },
    ],
  },

  // 12. Interview Questions
  {
    order: 12, type: 'interview', title: 'Interview Discussion Questions',
    interviewQuestions: [
      {
        question: 'What are the three pillars of observability and when would you use each?',
        answer: 'Logs: timestamped records of discrete events with full context. Use when you need to understand exactly what happened in a specific request or at a specific time. Best for debugging known issues. Metrics: numeric measurements sampled over time. Use for real-time monitoring, alerting, and trend analysis. Best for detecting when something is wrong and capacity planning. Traces: follow a single request through all services it touches. Use when debugging performance problems or failures in distributed systems. Best for diagnosing unknown failures in microservices. In practice, you use all three together: metrics detect the problem, traces narrow it to a service, logs explain the specific failure.',
        difficulty: 'easy',
      },
      {
        question: 'What are the Four Golden Signals and why are they sufficient to monitor any service?',
        answer: 'From Google\'s SRE book. Latency: how long requests take (P50, P95, P99 - never just average). Traffic: how much demand the service is handling (requests/second). Errors: what fraction of requests are failing (HTTP 5xx, timeouts, business logic errors). Saturation: how full key resources are (CPU, memory, DB connections, queue depth). They are sufficient because: latency answers "is it fast?", errors answer "is it working?", traffic answers "is load within capacity?", saturation answers "will it fail soon?". If all four are healthy, users are having a good experience. If any is unhealthy, you know which aspect to investigate first.',
        difficulty: 'easy',
      },
      {
        question: 'Explain the difference between SLI, SLO, and SLA. How do they relate to each other?',
        answer: 'SLI (Service Level Indicator): a specific metric measuring service quality. "Fraction of checkout requests completing successfully in under 500ms." The raw measurement. SLO (Service Level Objective): a target value for an SLI over a time window. "99.9% of checkout requests will complete successfully in under 500ms over any 30-day rolling window." The internal engineering target. SLA (Service Level Agreement): external contract with customers defining minimum quality and consequences for falling below it. "If availability drops below 99.9% in any month, customers receive a 25% service credit." The business commitment. Relationship: SLA <= SLO <= actual reliability. SLO should be stricter than SLA to provide a margin - if your SLA is 99.9%, set SLO at 99.95% so a slight SLO breach does not immediately breach the customer contract.',
        difficulty: 'medium',
      },
      {
        question: 'What is an error budget and how do teams use it to balance reliability vs velocity?',
        answer: 'Error budget = 100% - SLO target. For a 99.9% SLO: 0.1% error budget = 43.2 minutes of downtime per 30 days. The error budget quantifies how much unreliability is acceptable. When budget is healthy: teams can ship changes aggressively - they have runway. When budget is nearly exhausted: freeze non-critical deployments, focus on reliability. When budget is exhausted: halt new features entirely until reliability improves. This creates a data-driven mechanism: "do we have runway to ship this risky change?" replaces subjective judgment. Error budget policy should be agreed in advance so there is no debate during stressful incidents about what to do.',
        difficulty: 'medium',
      },
      {
        question: 'How would you design observability for a new microservice from scratch?',
        answer: 'Four steps. Instrument: add RED metrics (request rate, error rate, duration P50/P95/P99) using Prometheus client library. Add structured JSON logging with trace ID, service name, and relevant business context. Add distributed trace instrumentation using OpenTelemetry SDK. Add /health/live and /health/ready endpoints that check actual dependencies. Transport: configure log shipping (Fluentd/Filebeat), configure Prometheus scrape target, configure trace export to Jaeger. Alert: create alerts for RED metrics with burn rate alerting against your SLO. Create runbook for each alert. Connect alerts to PagerDuty with on-call rotation. Verify: generate test traffic, verify metrics appear in Grafana, verify logs appear in Kibana, verify traces appear in Jaeger, verify alerts fire in staging.',
        difficulty: 'medium',
      },
      {
        question: 'What is distributed tracing and how does it help debug microservice failures?',
        answer: 'Distributed tracing assigns a unique trace ID to every request at the entry point (API gateway). The ID propagates to every downstream service call via headers. Each service emits spans: operation name, service name, start time, duration, and status. The tracing backend (Jaeger, Zipkin) collects spans and reconstructs the full request path as a waterfall diagram. Debug use: search by trace ID to see the complete path of a failed or slow request. The waterfall shows exactly which service was slow (Payment Service took 4s), which call caused the error (DB query failed), and the dependency chain. This turns a multi-hour manual log correlation into a 5-minute investigation. Without tracing in a 50-service system, finding which service caused a failure requires checking 50 service logs individually.',
        difficulty: 'medium',
      },
      {
        question: 'What is alert fatigue and how do you fix it?',
        answer: 'Alert fatigue: when on-call engineers receive so many alerts (many false positives, low signal) that they start ignoring or desensitising to them. When a critical real alert fires, it gets ignored because it looks like all the previous noise. Causes: alerts on causes not symptoms (CPU is high) rather than symptoms (users are experiencing errors), alerts with low signal-to-noise ratio (fires for transient issues that self-resolve), alerts on too many dimensions with no context. Fixes: Every alert must require human action - if it self-resolves, it should not page. Alert on symptoms (error budget burn rate) not causes. Add Retry-After / auto-heal for transient alerts. Audit all alert rules quarterly. Set target: fewer than 5 actionable pages per on-call shift. Track and reduce false positive rate per alert rule. Use SLO-based alerting (burn rate) which has much better signal-to-noise than threshold alerts.',
        difficulty: 'medium',
      },
      {
        question: 'How does burn rate alerting work and why is it better than threshold alerting?',
        answer: 'Burn rate measures how fast you are consuming your SLO error budget relative to the sustainable rate. Sustainable rate = error budget / window length. If your 30-day error budget is 0.1%, sustainable burn rate is consuming 0.1% over 30 days. 1x burn rate = will exhaust exactly at window end. 10x burn rate = will exhaust in 3 days. Alert at high burn rates: 10x for immediate page (budget exhausted in 3 days), 5x for lower severity (budget exhausted in 6 days). Why better than thresholds: threshold alerts (error rate > 1%) fire on brief spikes that do not meaningfully impact SLO. Burn rate alerts fire when the error rate is sustained long enough to actually breach the SLO. 10% error rate for 1 minute = same budget consumption as 0.1% error rate for 10 minutes. Threshold catches the first, burn rate catches the second too.',
        difficulty: 'hard',
      },
    ],
  },

  // 13. Quiz
  {
    order: 13, type: 'quiz', title: 'Observability and SLOs Quiz',
    quizConfig: {
      timeLimitSeconds: 600, maxAttempts: 3, passingPercent: 70,
      questions: [
        {
          question: 'What are the three pillars of observability?',
          options: ['CPU, Memory, Disk', 'Logs, Metrics, Traces', 'Availability, Latency, Errors', 'Monitoring, Alerting, Dashboards'],
          correctIndex: 1, scenario: false,
          explanation: 'Logs (discrete events with context), Metrics (numeric measurements over time), and Traces (following requests across services). Together they answer: what happened (logs), how is the system behaving (metrics), and where in the distributed system did a specific request go wrong (traces).',
        },
        {
          question: 'Your SLO is 99.9% availability over 30 days. What is your monthly error budget in minutes?',
          options: ['4.4 minutes', '43.2 minutes', '432 minutes', '4320 minutes'],
          correctIndex: 1, scenario: false,
          explanation: '30 days * 24 hours * 60 minutes = 43,200 minutes total. Error budget = 0.1% of 43,200 = 43.2 minutes. This is the maximum total downtime (or equivalent failure) allowed in a 30-day window before breaching the SLO.',
        },
        {
          question: 'A trace shows the payment service taking 4 seconds while other services take under 100ms. What does this tell you?',
          options: ['The API gateway is misconfigured', 'The payment service is the bottleneck - investigate there first', 'Network latency is high globally', 'The user has a slow connection'],
          correctIndex: 1, scenario: true,
          explanation: 'Distributed tracing shows exactly which service consumed the time. The waterfall diagram clearly identifies the payment service as the bottleneck (4s vs <100ms everywhere else). Without tracing, finding this would require checking each service\'s logs manually.',
        },
        {
          question: 'What is the difference between an SLO and an SLA?',
          options: ['SLOs are for databases, SLAs are for APIs', 'SLO is an internal reliability target; SLA is an external customer contract with penalties', 'SLOs track latency; SLAs track availability', 'They are the same thing with different names'],
          correctIndex: 1, scenario: false,
          explanation: 'SLO is an internal engineering target you set for yourself. SLA is an external contract with customers that includes financial penalties for violations. SLO should be stricter than SLA (e.g., SLO=99.95%, SLA=99.9%) to provide a margin so an SLO breach does not immediately trigger customer penalties.',
        },
        {
          question: 'Your error budget is burning at 15x the sustainable rate. What should you do?',
          options: ['Continue normally - this is expected', 'Freeze non-critical deployments and investigate the elevated error rate immediately', 'Wait until the budget is fully exhausted before acting', 'Increase the SLO target to give more budget'],
          correctIndex: 1, scenario: true,
          explanation: '15x burn rate means the error budget will be exhausted in 2 days (30 days / 15x). This warrants an immediate response: freeze risky deployments, investigate root cause, and fix the elevated error rate before the SLO is breached and the SLA potentially violated.',
        },
        {
          question: 'Which Golden Signal predicts future failures before they occur?',
          options: ['Latency', 'Traffic', 'Errors', 'Saturation'],
          correctIndex: 3, scenario: false,
          explanation: 'Saturation measures how full resources are (CPU 90%, DB connections 95%, disk 85%). High saturation predicts an upcoming failure at the next traffic spike - before any user-visible error has occurred. The other three signals (latency, traffic, errors) measure current conditions, not future risk.',
        },
        {
          question: 'You receive 500 alerts per week but only 5 require actual action. What is the main problem?',
          options: ['Your service is broken', 'Alert fatigue - too many false positives degrade response to real alerts', 'Your on-call rotation is too small', 'You need more dashboards'],
          correctIndex: 1, scenario: true,
          explanation: 'Alert fatigue. When engineers receive hundreds of alerts that self-resolve, they begin ignoring alerts. When a critical real alert fires, it gets ignored too. Fix: remove alerts that do not require action, tune thresholds, alert on symptoms (error budget burn) not causes. Target: every alert should require human action.',
        },
        {
          question: 'A health check always returns 200 OK even though a background sync job has been failing for 6 hours. The data is now 6 hours stale. What was wrong with the health check?',
          options: ['The health check URL was wrong', 'The health check only verified the HTTP server was running - not that the service was actually functional', 'The health check ran too infrequently', 'The load balancer was misconfigured'],
          correctIndex: 1, scenario: true,
          explanation: 'Shallow health check. A meaningful health check verifies the service can actually serve its purpose - including that background jobs are running successfully. A deep health check would verify "last successful sync < 15 minutes ago" and return 503 if the sync is stale.',
        },
        {
          question: 'What is the purpose of a blameless post-mortem?',
          options: ['To identify and punish the engineer who caused the incident', 'To analyse what went wrong without blame, identify root causes, and create action items to prevent recurrence', 'To document all alerts that fired during the incident', 'To calculate SLA penalty credits'],
          correctIndex: 1, scenario: false,
          explanation: 'Blameless post-mortems focus on systemic issues and process improvements, not individual blame. The goal is to understand root causes (five whys), create a timeline from observability data, and generate concrete action items. Blame creates a culture where engineers hide mistakes rather than learning from them.',
        },
        {
          question: 'What should every structured log record include as a minimum?',
          options: ['CPU usage and memory', 'Timestamp, service name, trace ID, log level, and enough context to understand the event', 'User password and IP address', 'Only the error message'],
          correctIndex: 1, scenario: false,
          explanation: 'Structured logs need: timestamp (when did it happen?), service name (which service?), trace ID (to correlate with the full request trace), log level (severity), and event-specific context. Crucially: never include passwords, credit card numbers, or PII. Trace ID is essential for correlating log entries with distributed traces.',
        },
      ],
    },
  },
];

module.exports = OBSERVABILITY_MODULES;
