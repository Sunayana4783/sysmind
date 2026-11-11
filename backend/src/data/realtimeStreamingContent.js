// Static Real-Time and Streaming content - 13 modules total
const REALTIME_STREAMING_MODULES = [

  // 1. Real-Time Systems Fundamentals
  {
    order: 1, type: 'content', title: 'Real-Time Systems Fundamentals',
    content: {
      overview: 'A real-time system delivers responses within a defined time constraint. In web systems, real-time typically means users see updates within milliseconds to seconds without manually refreshing - a chat message appearing instantly, a live stock price updating, a notification arriving as soon as it is sent.\n\nReal-time systems require different architecture patterns from traditional request-response systems. Instead of clients asking for data, data is pushed to clients as it changes.',
      sections: [
        { heading: 'What Makes a System Real-Time?', body: 'Real-time in web systems means low-latency data delivery - typically under 100ms from event to display. Hard real-time (aircraft control systems) requires guaranteed response times. Soft real-time (chat, gaming) tolerates occasional delays. Near real-time (analytics dashboards) accepts delays of seconds. For most web systems, the goal is delivering updates within 1-2 seconds to feel instantaneous to users.', code: null },
        { heading: 'Push vs Pull', body: 'Traditional web: clients pull data by making HTTP requests. Each request is stateless and independent. Real-time web: servers push data to clients as events occur. The server initiates data delivery rather than waiting for client requests. Push dramatically reduces latency for event-driven data. Instead of a client polling every 5 seconds and potentially waiting 4.9 seconds for new data, a push notification arrives within 100ms of the event.', code: null },
        { heading: 'The State Problem', body: 'Push-based communication requires the server to maintain persistent connections to clients. Each open WebSocket connection consumes memory on the server. A chat server with 1 million concurrent users needs to hold 1 million open connections in memory simultaneously. This requires careful resource management, horizontal scaling with connection affinity or a shared state layer (Redis Pub/Sub), and load balancers configured to handle persistent connections.', code: null },
        { heading: 'Real-Time Use Cases', body: 'Chat and messaging (WhatsApp, Slack): messages delivered instantly to all recipients. Collaborative editing (Google Docs): keystrokes visible to all editors within milliseconds. Live sports scores and financial tickers: data pushed as events occur. Online gaming: player positions and actions broadcast with minimal latency. Live notifications (GitHub, Twitter): events pushed as they happen. Each use case has different throughput, latency, and durability requirements.', code: null },
      ],
      animationSteps: [
        { label: 'Event occurs',   description: 'User sends a chat message',                      highlight: false },
        { label: 'Push model',     description: 'Server immediately pushes to all recipients',    highlight: true  },
        { label: 'Delivered',      description: 'Message appears on recipient screen in <100ms',  highlight: true  },
        { label: 'vs Poll model',  description: 'Pull: recipient would wait up to 5 seconds',     highlight: false },
        { label: '50x faster',     description: 'Push delivers 50x faster than 5s polling',      highlight: false },
      ],
      example: 'WhatsApp delivers messages to 100 billion conversations daily with sub-second latency. Each device holds a persistent WebSocket connection to WhatsApp servers. When you send a message, it hits the server and is immediately pushed over the recipient\'s open WebSocket. Without persistent connections, WhatsApp would need to poll every device every second - 2 billion polls per second globally - completely infeasible.',
    },
  },

  // 2. Real-Time Communication Protocols
  {
    order: 2, type: 'content', title: 'Real-Time Communication Protocols',
    content: {
      overview: 'Three main protocols enable real-time web communication: WebSockets (full bidirectional), Server-Sent Events (server-to-client only), and Long Polling (simulated push over HTTP). Each has different capabilities, complexity, and browser support.\n\nChoosing the right protocol depends on whether you need bidirectional communication, how much infrastructure complexity you can accept, and your latency requirements.',
      sections: [
        { heading: 'WebSockets', body: 'WebSockets establish a persistent full-duplex connection over a single TCP connection. After the HTTP upgrade handshake, both client and server can send messages at any time. This enables true bidirectional real-time communication. Used for: chat, multiplayer games, collaborative editing, live trading dashboards. Overhead: 2 bytes per message (vs 800+ bytes for HTTP headers). Requires WebSocket-aware load balancers with sticky sessions or shared state.', code: null },
        { heading: 'Server-Sent Events (SSE)', body: 'SSE is a one-way push mechanism. The server streams events to the client over a standard HTTP connection. The client cannot send data back over the same connection - it uses separate HTTP requests. SSE is simpler than WebSockets: it uses plain HTTP, works through standard proxies and CDNs, and automatically reconnects. Use SSE for: live feeds, notifications, status updates - anything where only the server needs to push data. Not suitable for: chat or gaming where both sides send frequently.', code: null },
        { heading: 'Long Polling', body: 'Long polling simulates push over standard HTTP. The client makes a request and the server holds it open (without responding) until new data is available, then responds. The client immediately makes another request. This creates a continuous pull loop that feels like push. No special server infrastructure needed. High overhead: each message requires a full HTTP round trip with headers. Use only as a fallback when WebSockets or SSE cannot be used.', code: null },
        { heading: 'Choosing the Protocol', body: 'WebSockets: bidirectional communication, lowest per-message overhead, gaming and chat. SSE: one-way server push, simpler infrastructure, notifications and live feeds. Long Polling: maximum compatibility with legacy proxies and load balancers, highest overhead, use as fallback. Most modern applications use WebSockets for interactive features with an SSE or long polling fallback for environments where WebSockets are blocked (some corporate firewalls and older proxies block WebSocket upgrades).', code: null },
      ],
      animationSteps: [
        { label: 'HTTP upgrade',   description: 'Client requests WebSocket connection upgrade',   highlight: false },
        { label: 'Handshake',      description: 'Server confirms - persistent connection established', highlight: true },
        { label: 'Server pushes',  description: 'Server sends data any time without being asked',  highlight: true  },
        { label: 'Client sends',   description: 'Client also sends data any time - full duplex',  highlight: false },
        { label: 'vs SSE',         description: 'SSE: server pushes only, no client messages',    highlight: false },
      ],
      example: 'Slack uses WebSockets for real-time messaging. Each browser tab opens a WebSocket connection to Slack servers. When a teammate sends a message, it arrives over your open WebSocket instantly. Slack falls back to long polling for clients behind restrictive firewalls. Their WebSocket infrastructure handles over 100,000 messages per second globally with average delivery latency under 100ms.',
    },
  },

  // 3. Real-Time Data Processing
  {
    order: 3, type: 'content', title: 'Real-Time Data Processing',
    content: {
      overview: 'Real-time data processing transforms, enriches, filters, and aggregates data as it arrives - within milliseconds to seconds of the original event. Unlike batch processing (process last month\'s data overnight), real-time processing acts on data while it is still fresh and actionable.\n\nThis enables fraud detection that blocks a transaction in progress, recommendations that react to what you are doing right now, and dashboards that show what is happening today.',
      sections: [
        { heading: 'Batch vs Stream Processing', body: 'Batch processing: collect data for a period (hour, day), then process all at once. High throughput, high latency. Stream processing: process each event as it arrives, one at a time or in small micro-batches. Low latency, continuous output. The key tradeoff: batch processing is simpler and more efficient for historical analysis. Stream processing enables real-time action but adds complexity. Many systems use lambda architecture - both stream (for speed) and batch (for accuracy) processing the same data.', code: null },
        { heading: 'The Event Pipeline', body: 'A real-time data pipeline has stages. Ingestion: events enter the system (Kafka, Kinesis). Processing: events are transformed and enriched (apply business logic, join with reference data, filter, aggregate). Storage: processed results written to stores (databases, caches, data warehouses). Serving: results made available to applications or dashboards. Each stage adds latency. Well-designed pipelines achieve end-to-end latency from event occurrence to result visibility of under one second.', code: null },
        { heading: 'Stateful vs Stateless Processing', body: 'Stateless processing applies the same transformation to each event independently. Very scalable - any worker handles any event. Stateful processing maintains state across events. Counting events per user per hour requires remembering previous events. Detecting fraud patterns requires remembering a user\'s recent transaction history. Stateful stream processing is significantly more complex: state must be distributed across workers, survive worker failures, and be efficiently updated.', code: null },
        { heading: 'Micro-Batching', body: 'Pure per-event processing has overhead. Micro-batching groups events arriving within a short window (100ms-1s) and processes them together. This amortises per-batch overhead across many events, dramatically increasing throughput while keeping latency acceptable. Apache Spark Streaming and Flink both support micro-batching. The window size trades latency for throughput - 100ms windows give near real-time results with much better efficiency than per-event processing.', code: null },
      ],
      animationSteps: [
        { label: 'Events arrive',  description: 'Stream of user click events arrives continuously', highlight: false },
        { label: 'Filter',         description: 'Discard irrelevant events (bots, test traffic)',   highlight: true  },
        { label: 'Enrich',         description: 'Join with user profile data for context',          highlight: true  },
        { label: 'Aggregate',      description: 'Count clicks per product per minute',              highlight: false },
        { label: 'Serve results',  description: 'Real-time dashboard shows current top products',   highlight: false },
      ],
      example: 'Uber\'s surge pricing uses real-time stream processing. Driver GPS pings (every 4 seconds per driver) and rider requests stream into Kafka. A Flink processing pipeline aggregates supply and demand per geographic hexagon in real time. When demand in an area exceeds supply, surge pricing activates within 30 seconds of the imbalance developing. This requires processing millions of events per second with sub-minute latency.',
    },
  },

  // 4. Stream Processing Fundamentals
  {
    order: 4, type: 'content', title: 'Stream Processing Fundamentals',
    content: {
      overview: 'Stream processing is a data processing paradigm where computation is applied to a continuous, unbounded sequence of records as they arrive. Unlike batch processing where you have all the data upfront, stream processing handles data that arrives continuously and may never stop.\n\nUnderstanding the fundamental concepts - streams, operators, state, and time - is essential before using any stream processing framework.',
      sections: [
        { heading: 'Streams and Records', body: 'A stream is an infinite, ordered sequence of records. Each record has a key (for partitioning and aggregation), a value (the event data), and a timestamp. Records are immutable - once written they do not change. Processing a stream means defining a series of transformations that run on each record as it arrives. The transformations form a directed acyclic graph (DAG) from input sources through processing stages to output sinks.', code: null },
        { heading: 'Core Stream Operators', body: 'Map: transform each record independently (parse JSON, extract fields). Filter: keep only records matching a condition (errors only, specific users). Aggregate: combine multiple records into one (count, sum, average over a window). Join: combine records from two streams based on a matching key. FlatMap: transform one record into zero or more output records. These operators are the building blocks of all stream processing logic, composable into complex pipelines.', code: null },
        { heading: 'Stream State', body: 'Many stream operations require maintaining state across records. A counter that tracks how many times a user has clicked needs to remember previous events. A fraud detector needs to track the last N transactions per user. State in stream processing must be: distributed (sharded across workers by key), fault-tolerant (persisted to durable storage for recovery), and efficiently updated (append-only or log-structured). RocksDB (embedded key-value store) is the standard state backend for Flink and Kafka Streams.', code: null },
        { heading: 'Exactly-Once Processing', body: 'Stream processing failures require replaying records. Without care, this causes duplicate processing. Exactly-once semantics means each record affects the output exactly once even if processed multiple times due to failures. Achieving this requires idempotent operations or transactional writes. Flink and Kafka Streams both support exactly-once semantics using distributed snapshots and two-phase commit. The performance cost is significant - most systems accept at-least-once and design operations to be idempotent.', code: null },
      ],
      animationSteps: [
        { label: 'Record arrives',  description: 'Key=user123, value=click_event, ts=now',       highlight: false },
        { label: 'Filter',          description: 'Is this a valid click? Yes - keep it',          highlight: true  },
        { label: 'Map',             description: 'Extract: {user, product, timestamp}',           highlight: true  },
        { label: 'Aggregate',       description: 'Add to running count for user+product+window',  highlight: false },
        { label: 'Emit result',     description: 'When window closes, output final count',        highlight: false },
      ],
      example: 'LinkedIn uses Samza (their open-source stream processing framework) to process member activity streams. Every time a member views a profile, the event streams through Samza: filter bots, extract relationship type (connected, 2nd degree), aggregate view counts per member per day, join with privacy settings. The processed stream updates search ranking and "who viewed your profile" notifications in near real-time, handling billions of events per day.',
    },
  },

  // 5. Event Streaming Architecture
  {
    order: 5, type: 'content', title: 'Event Streaming Architecture',
    content: {
      overview: 'Event streaming architecture is built around the idea that every significant thing that happens in a system is published as an immutable event to a persistent log. Any part of the system can read that log independently, at its own pace, and react to events.\n\nKafka pioneered this approach. The event log becomes the central nervous system of the entire platform.',
      sections: [
        { heading: 'The Event Log', body: 'An event log is an append-only, immutable, ordered sequence of events. Events are never deleted or updated - they are permanent records of what happened. The log is partitioned for scalability and replicated for durability. Multiple consumer groups each maintain their own read position (offset) in the log, allowing them to process events independently and at their own pace. This decoupling is the core architectural advantage.', code: null },
        { heading: 'Producers and Consumers', body: 'Producers publish events to the log without knowing who will consume them. The Order Service publishes "order placed" events. The Email Service, Inventory Service, Analytics Service, and Fraud Detection Service each subscribe independently and react in their own way. Adding a new consumer (Loyalty Points Service) requires no change to the producer. This is true decoupling - compared to direct API calls where the producer explicitly calls each consumer.', code: null },
        { heading: 'Event Sourcing', body: 'Event sourcing stores state as a sequence of events rather than the current state. Instead of storing "account balance = $500", store "deposited $1000, withdrew $300, withdrew $200 = $500". Any state at any point in time can be reconstructed by replaying events. This provides a complete audit trail, enables time-travel debugging, and allows projecting the same event stream into different read models. The downside: the event store grows indefinitely and replaying millions of events to reconstruct state can be slow without periodic snapshots.', code: null },
        { heading: 'The Kappa Architecture', body: 'Lambda architecture uses both batch and stream processing. Kappa architecture uses only stream processing for both real-time and historical reprocessing. The key insight: if you retain all events in Kafka (long retention period), you can reprocess historical data by resetting a consumer group to the beginning of the log. This simplifies the architecture by eliminating the batch layer. When you need to fix a bug in your processing logic, just replay the event log through the corrected processor.', code: null },
      ],
      animationSteps: [
        { label: 'Event published', description: 'Order Service publishes "order.placed" to Kafka', highlight: false },
        { label: 'Log stores it',   description: 'Event persisted in Kafka topic permanently',    highlight: true  },
        { label: 'Consumer 1',      description: 'Email Service reads and sends confirmation',    highlight: true  },
        { label: 'Consumer 2',      description: 'Inventory Service reads and reserves stock',    highlight: false },
        { label: 'Replay',          description: 'New service added: reprocess all history',      highlight: false },
      ],
      example: 'LinkedIn\'s entire data infrastructure is built around Kafka. Every user action (profile view, connection request, job application) becomes an event in Kafka. The notifications service, analytics pipeline, search indexer, and ML feature store all consume the same events independently. When LinkedIn adds a new feature, it starts a new consumer group and replays months of historical events to build its initial state - the event log makes this trivial.',
    },
  },

  // 6. Stream Processing Frameworks
  {
    order: 6, type: 'content', title: 'Stream Processing Frameworks',
    content: {
      overview: 'Stream processing frameworks provide the infrastructure to build, deploy, and scale stream processing applications. They handle the hard problems: distributed state management, fault tolerance, event-time processing, and exactly-once semantics.\n\nThe three most important frameworks to know are Apache Kafka Streams, Apache Flink, and Apache Spark Streaming.',
      sections: [
        { heading: 'Apache Kafka Streams', body: 'Kafka Streams is a client library (not a separate cluster) for stream processing built on Kafka. Applications run as regular Java processes and scale by adding instances. State is stored in RocksDB locally and backed up to Kafka for fault tolerance. Best for: processing Kafka events with moderate complexity, joining streams with tables, teams already using Kafka. Limitations: input and output must be Kafka topics. No separate cluster to manage - this is a major operational simplicity advantage.', code: null },
        { heading: 'Apache Flink', body: 'Flink is a distributed stream processing engine with its own cluster. It supports true event-time processing (processing events based on when they occurred, not when they arrived), sophisticated windowing, exactly-once semantics, and very low latency (sub-10ms). Best for: complex stateful processing, event-time accuracy requirements, very high throughput. Used by Alibaba for real-time risk detection and by Lyft for real-time analytics. More complex to operate than Kafka Streams.', code: null },
        { heading: 'Apache Spark Streaming', body: 'Spark Streaming (now Structured Streaming) processes streams as micro-batches - collecting events for a short window (100ms-30s) then processing them as a mini-batch. This leverages Spark\'s batch processing engine for stream processing. Best for: teams already using Spark, unified batch and stream processing with the same code, processing that is comfortable with 1-30 second latency. Not ideal for sub-second latency requirements.', code: null },
        { heading: 'Choosing a Framework', body: 'Kafka Streams: simple, no extra cluster, Kafka-to-Kafka processing. Best starting point for most teams. Flink: when you need complex stateful processing, event-time accuracy, or sub-second latency at massive scale. Spark Streaming: when you are already using Spark and can tolerate second-level latency. For most microservices teams doing stream processing for the first time, Kafka Streams provides the right balance of power and operational simplicity. Only move to Flink when Kafka Streams cannot meet your requirements.', code: null },
      ],
      animationSteps: [
        { label: 'Events in Kafka', description: 'Stream of events in Kafka topics',               highlight: false },
        { label: 'KStreams lib',    description: 'Kafka Streams: library in your app - no cluster', highlight: true  },
        { label: 'Flink cluster',   description: 'Flink: separate cluster, true event-time',       highlight: true  },
        { label: 'Spark batches',   description: 'Spark Streaming: micro-batches every 1-30s',     highlight: false },
        { label: 'Choose right',    description: 'Simple -> Kafka Streams, Complex -> Flink',      highlight: false },
      ],
      example: 'Alibaba processes over 1 trillion events per day through Flink for real-time risk detection on Alipay. Each transaction is checked against hundreds of fraud rules in real time. Flink\'s exactly-once semantics are critical - a fraud transaction must never slip through due to a processing failure, and legitimate transactions must never be blocked due to duplicate processing. At this scale and latency requirement, Flink is the right tool.',
    },
  },

  // 7. Real-Time Data Pipelines
  {
    order: 7, type: 'content', title: 'Real-Time Data Pipelines',
    content: {
      overview: 'A real-time data pipeline is an end-to-end system that moves data from sources to destinations continuously with minimal latency. Unlike batch ETL (Extract, Transform, Load) which runs nightly, a real-time pipeline processes and delivers data within seconds of it being generated.\n\nBuilding reliable real-time pipelines requires careful design of each component and the connections between them.',
      sections: [
        { heading: 'Pipeline Architecture', body: 'Sources generate events (databases via CDC, application logs, IoT sensors, user interactions). Ingestion layer buffers events (Kafka, Kinesis) for durability and fan-out. Processing layer transforms and enriches (Flink, Kafka Streams). Storage layer persists results (Elasticsearch, Cassandra, Redis, data warehouse). Serving layer exposes data (APIs, dashboards). The pipeline is as reliable as its weakest component - invest in monitoring at every stage to detect failures immediately.', code: null },
        { heading: 'Change Data Capture (CDC)', body: 'CDC streams changes from databases into the event pipeline. Instead of polling the database for changes, CDC reads the database\'s transaction log (binlog in MySQL, WAL in PostgreSQL) and publishes each insert/update/delete as an event. Debezium is the standard open-source CDC tool. This enables real-time synchronisation between operational databases and analytics systems, search indexes, and caches without expensive database polling.', code: null },
        { heading: 'Backpressure', body: 'When downstream components cannot keep up with the rate of incoming events, backpressure builds up. Without backpressure handling: event queue fills until it crashes. With backpressure: upstream components are signalled to slow down or buffer. Reactive Streams and Flink handle backpressure automatically. Kafka\'s consumer lag metric shows backpressure building. Set alerts on consumer lag to detect when processing cannot keep up with ingestion. Unchecked backpressure leads to unbounded queue growth and eventual memory exhaustion.', code: null },
        { heading: 'Exactly-Once in Pipelines', body: 'Achieving exactly-once semantics end-to-end (from source to final destination) requires coordination across all components. Source offset tracking ensures each event is processed exactly once. Idempotent writes ensure writing the same event twice produces the same result. Transactions coordinate acknowledgement and commit atomically. The Kafka Streams + Kafka Transactions combination can achieve end-to-end exactly-once within the Kafka ecosystem. Cross-system exactly-once (Kafka to database to cache) requires application-level idempotency keys.', code: null },
      ],
      animationSteps: [
        { label: 'Source DB',       description: 'Database change captured via CDC (Debezium)',   highlight: false },
        { label: 'Kafka ingest',    description: 'CDC event published to Kafka topic',             highlight: true  },
        { label: 'Flink process',   description: 'Transform, enrich, aggregate in real time',     highlight: true  },
        { label: 'Multi-sink',      description: 'Write to Elasticsearch + Redis + Data Warehouse', highlight: false },
        { label: 'Served',          description: 'Search index and cache updated within seconds',  highlight: false },
      ],
      example: 'Airbnb\'s real-time pipeline powers their pricing and availability system. When a host updates availability, a database change is captured by Debezium and published to Kafka. A Flink pipeline enriches it with market data, computes dynamic pricing, and writes results to Redis (for immediate API responses) and Elasticsearch (for search). From host update to guest-visible price change: under 2 seconds. This pipeline processes millions of changes daily.',
    },
  },

  // 8. Event Time vs Processing Time
  {
    order: 8, type: 'content', title: 'Event Time vs Processing Time',
    content: {
      overview: 'Events have two timestamps: when the event actually occurred (event time) and when it was processed by the stream processor (processing time). These can differ by milliseconds, seconds, or even hours if events are delayed, retransmitted, or replayed from a backlog.\n\nUsing the wrong time dimension is one of the most common bugs in stream processing systems.',
      sections: [
        { heading: 'The Difference', body: 'Event time: when the event happened in the real world (e.g., user clicked at 14:00:00.123). Processing time: when the stream processor handled it (e.g., 14:00:00.456 if network latency was 333ms, or 14:05:00 if the processor was behind). For most real-time analytics, event time is what you want - you care about when users did things, not when your servers processed them. Using processing time for hourly aggregations can place events in the wrong bucket if they arrive late.', code: null },
        { heading: 'Out-of-Order Events', body: 'Events frequently arrive out of order. Mobile apps buffer events when offline and send them when connectivity returns. Network paths can deliver packets out of order. Retries can cause events to arrive multiple times. A stream processor using event time must handle out-of-order events. This requires buffering recent events and not finalising windows until it is confident all events for that window have arrived. This introduces processing latency to gain temporal accuracy.', code: null },
        { heading: 'Watermarks', body: 'A watermark is a declaration that "no events with timestamp earlier than T will arrive anymore." When the watermark passes time T, the processor can safely close all windows that ended before T and emit final results. Watermarks are the solution to the out-of-order event problem. Conservative watermarks (T = current_time - 10 minutes) accept all late arrivals but add 10 minutes of latency. Aggressive watermarks (T = current_time - 1 second) emit results quickly but may miss late-arriving events.', code: null },
        { heading: 'Late Data Handling', body: 'Despite watermarks, some events will arrive after their window has closed. Options: drop late data (simple but loses accuracy), update results (re-emit corrected counts when late data arrives), or use a side output (route late events to a special stream for separate handling). Flink and Beam support all three. For billing and financial calculations, dropping late data is unacceptable - results must be recomputed. For approximate real-time analytics, dropping late data is usually fine.', code: null },
      ],
      animationSteps: [
        { label: 'Event at 14:00',  description: 'User clicks at exactly 14:00:00',               highlight: false },
        { label: 'Network delay',   description: 'Event delayed 5 minutes in transit',             highlight: true  },
        { label: 'Arrives 14:05',   description: 'Event arrives at processor at 14:05',           highlight: true  },
        { label: 'Event time wins', description: 'Use event time 14:00 - correct window',         highlight: false },
        { label: 'Watermark',       description: 'Watermark at 14:03 - window still open for it',  highlight: false },
      ],
      example: 'Google Analytics uses event time, not processing time. When a user visits a webpage on a slow mobile connection, the click event might be queued locally and sent minutes later. If Google used processing time, that click would be attributed to the wrong time period in reports. By using event time with a watermark of several minutes, Google correctly attributes user activity to when it actually happened, even when mobile devices report events late.',
    },
  },

  // 9. Stream Processing Windows
  {
    order: 9, type: 'content', title: 'Stream Processing Windows',
    content: {
      overview: 'Windowing is how stream processing handles time-based aggregations. Since a stream is infinite, you cannot aggregate "all events" - you aggregate "all events in the last 5 minutes" or "all events in the current hour." Windows define the boundaries for grouping events together for aggregation.\n\nThe three main window types are tumbling (non-overlapping), sliding (overlapping), and session (activity-based).',
      sections: [
        { heading: 'Tumbling Windows', body: 'Tumbling windows are fixed-size, non-overlapping time intervals. Each event belongs to exactly one window. A 1-minute tumbling window groups events from 14:00-14:01, then 14:01-14:02, etc. Each window produces one result when it closes. Use tumbling windows for: hourly website traffic reports, minute-by-minute order counts, any time you want discrete, non-overlapping time buckets. Simple to understand and implement, with predictable memory usage.', code: null },
        { heading: 'Sliding Windows', body: 'Sliding windows are fixed-size intervals that advance by a step size smaller than the window size. A 10-minute window advancing every 1 minute: window 1 covers 14:00-14:10, window 2 covers 14:01-14:11, etc. Each event appears in multiple windows (up to window_size/step_size windows). Use sliding windows for: "clicks per user in the last 10 minutes" updated every minute, moving averages, rate limiting with a continuous view of recent activity.', code: null },
        { heading: 'Session Windows', body: 'Session windows group events by activity gap rather than clock time. A new session starts when activity resumes after a gap larger than the timeout (e.g., 30 minutes of inactivity). The session window ends when activity stops for longer than the timeout. Each session window is a different size depending on how long the activity burst lasted. Use session windows for: user session analysis, grouping clicks from the same browsing session, any activity-based segmentation where "sessions" are meaningful.', code: null },
        { heading: 'Window Triggers', body: 'By default, a window result is emitted when the window closes. Triggers allow early or late results. Early triggers: emit partial results before the window closes (every 30 seconds during a 5-minute window). Late triggers: emit corrected results when late events arrive after the window closed. Composite triggers: combine both. Early results enable real-time dashboards to update continuously rather than waiting for each window to close. Late triggers ensure accuracy when events arrive out of order.', code: null },
      ],
      animationSteps: [
        { label: 'Tumbling',        description: '1-min windows: 14:00-14:01, 14:01-14:02 each separate', highlight: false },
        { label: 'Sliding',         description: '10-min window, 1-min step: overlapping windows', highlight: true  },
        { label: 'Session',         description: 'Activity gap >30min closes window and starts new', highlight: true  },
        { label: 'Window closes',   description: 'Watermark passes end time - final result emitted', highlight: false },
        { label: 'Early trigger',   description: 'Partial result every 30s while window still open', highlight: false },
      ],
      example: 'Google Ads uses all three window types in their real-time bidding system. Tumbling windows: count impressions per campaign per hour for billing. Sliding windows: detect when click-through rate drops below 1% in the last 10 minutes (updated every minute) to auto-pause underperforming ads. Session windows: group a user\'s ad interactions into a browsing session to understand the conversion path. All three run simultaneously on the same event stream.',
    },
  },

  // 10. Real-Time Architectures in Practice
  {
    order: 10, type: 'content', title: 'Real-Time Architectures in Practice',
    content: {
      overview: 'Understanding real-time and stream processing theory is one thing. Building and operating production real-time systems requires knowing how to integrate these components, handle the operational challenges, and make the right architectural tradeoffs.\n\nThis module covers the practical patterns for building real-time systems.',
      sections: [
        { heading: 'The Lambda Architecture', body: 'Lambda architecture separates data processing into two layers. Speed layer: stream processing with low latency but approximate results (Kafka Streams or Flink). Batch layer: batch processing with high accuracy but high latency (Spark or Hive). Query layer: merges results from both. The speed layer answers "what is happening right now" and the batch layer periodically corrects any approximations. Complex to operate and maintain two separate processing systems. Many teams are moving to Kappa architecture instead.', code: null },
        { heading: 'Real-Time Notifications at Scale', body: 'Building a notification system for millions of users: each notification event published to Kafka. Fan-out service consumes events and determines which user devices to notify. Notification delivery service sends via push (APNs for iOS, FCM for Android) or WebSocket for web. Use consumer groups for horizontal scaling. Rate limit notifications per user to prevent overload. Buffer during peak hours and batch by device type for efficiency. Store notification history in Cassandra for retrieval.', code: null },
        { heading: 'Real-Time Leaderboards', body: 'Gaming leaderboards updated in real time: each score event published to Kafka. Kafka Streams application aggregates scores per player per time window using a tumbling window (current day). Results written to Redis Sorted Set for O(log N) rank queries. API reads from Redis to serve leaderboard requests. With Redis ZRANGEBYSCORE, any player can get their rank among millions of players in under 1ms. Reset and archive in batch at end of each period.', code: null },
        { heading: 'Monitoring Real-Time Systems', body: 'Key metrics for real-time systems: consumer lag (how far behind processing is from ingestion), end-to-end latency (from event occurrence to result visible), processing throughput (events per second), and error rates. Set alerts when consumer lag exceeds acceptable thresholds (more than 10,000 events behind means you are falling behind). Track watermark progress to ensure event-time processing is not stalling. Use distributed tracing to track specific events through the pipeline for debugging.', code: null },
      ],
      animationSteps: [
        { label: 'Event ingested',  description: 'User action event published to Kafka',           highlight: false },
        { label: 'Stream process',  description: 'Flink/Kafka Streams transforms in real time',    highlight: true  },
        { label: 'Multi-write',     description: 'Redis for low latency + DB for durability',      highlight: true  },
        { label: 'Push to client',  description: 'WebSocket pushes updated result to users',       highlight: false },
        { label: 'Monitor lag',     description: 'Alert if consumer lag > threshold',              highlight: false },
      ],
      example: 'Twitter\'s trending topics system is a real-time streaming application. Tweet events stream through Kafka. A Flink job counts hashtag occurrences using 5-minute tumbling windows, weighted by account reach and freshness. Results are compared to previous windows to detect velocity (rapidly accelerating topics). Trends are detected within 2 minutes of a topic starting to trend. The system processes 500M+ tweets per day across all languages with sub-minute detection latency.',
    },
  },

  // 11. Failure Cases
  {
    order: 11, type: 'failureCases', title: 'Failure Cases',
    failureCases: [
      {
        title: 'WebSocket Thundering Herd on Server Restart',
        scenario: 'A chat service has 500,000 active WebSocket connections distributed across 10 servers. One server is restarted for a deployment. All 50,000 connections on that server disconnect simultaneously. All 50,000 clients detect the disconnect and immediately try to reconnect to any available server. The reconnection flood overwhelms the servers, causing cascade failures that bring down additional servers, which triggers more reconnections.',
        impact: 'Cascade failure spreads from one server restart to full service outage affecting all 500,000 users.',
        resolution: 'WebSocket clients must implement exponential backoff with jitter on reconnection: reconnect after random(0, 1s), then random(0, 2s), etc. Use rolling deploys to restart one server at a time, allowing the reconnection load to spread over minutes. Servers should use connection draining to gracefully migrate connections before restarting.',
        animationSteps: [
          { label: '50K disconnect', description: 'Server restarts - 50K connections lost at once',   highlight: true  },
          { label: 'All reconnect',  description: '50K clients reconnect simultaneously',              highlight: true  },
          { label: 'Overload',       description: 'Other servers overwhelmed - cascade failure',       highlight: true  },
          { label: 'More disconnect', description: 'More servers fail - more reconnections',          highlight: false },
          { label: 'Fix',            description: 'Backoff + jitter on reconnect + rolling deploy',    highlight: false },
        ],
      },
      {
        title: 'Consumer Lag Grows Unboundedly - Processing Falls Behind',
        scenario: 'A Kafka consumer group processes order events to update inventory in real time. A slow database query causes each event to take 500ms instead of the expected 50ms. With 100 events/second arriving and only 2 events/second being processed, the consumer lag grows by 98 events/second. Within 10 minutes, 58,800 events are queued. Within an hour, millions of events are queued and inventory data is 1 hour behind real-time.',
        impact: 'Inventory data 1 hour stale. Overselling because stock levels not updated. Cascading issues downstream.',
        resolution: 'Set consumer lag alerts at defined thresholds (1000 events = investigate, 10,000 events = page on-call). Scale out consumer group immediately when lag builds. Fix the root cause (optimise the slow query). Consider circuit-breaking the database writes and writing to a queue temporarily until lag is cleared.',
        animationSteps: [
          { label: '100 events/s',   description: 'Events arriving at 100 per second',              highlight: false },
          { label: '2 events/s',     description: 'Processing only 2/sec due to slow DB query',      highlight: true  },
          { label: 'Lag grows',      description: 'Lag increases 98 events/second continuously',     highlight: true  },
          { label: '1hr: millions',  description: '1 hour later: millions of events unprocessed',    highlight: true  },
          { label: 'Fix',            description: 'Lag alerts + scale consumers + fix slow query',   highlight: false },
        ],
      },
      {
        title: 'Event Time Bug: Wrong Window Attribution',
        scenario: 'An e-commerce team builds a real-time sales dashboard using processing time instead of event time. Mobile app users submit orders, but the app batches and sends them when connectivity returns, sometimes 10-15 minutes later. Orders placed at 23:50 are processed at 00:05 the next day. The sales report attributes $200K of sales to the wrong day. Month-end reports are systematically incorrect.',
        impact: 'Financial reporting errors. Sales commissions calculated incorrectly. Business decisions based on wrong data.',
        resolution: 'Always use event time for business-critical aggregations. Include event timestamp in every event payload. Use watermarks with sufficient late arrival tolerance (15-30 minutes for mobile apps). Test with deliberately delayed events before going to production. Audit existing pipelines for processing time usage.',
        animationSteps: [
          { label: 'Order at 23:50', description: 'User places order at 23:50 on mobile',           highlight: false },
          { label: 'Mobile batches', description: 'App offline - buffers order locally',              highlight: false },
          { label: 'Sends at 00:05', description: 'Mobile reconnects - order arrives next day',       highlight: true  },
          { label: 'Wrong day',      description: 'Processing time: attributed to next day',          highlight: true  },
          { label: 'Fix',            description: 'Event time + 30-min watermark: correct day',       highlight: false },
        ],
      },
      {
        title: 'Stateful Stream Processor Loses State on Failure',
        scenario: 'A fraud detection stream processor maintains a 5-minute sliding window of transaction counts per user to detect rapid-fire transactions. The processor crashes mid-window. On restart, it has no memory of transactions processed in the last 5 minutes. A fraudster who has made 50 transactions in the last 4 minutes starts with a clean slate. The fraud detection rule misses the pattern completely.',
        impact: 'Fraud detection gap during recovery window. Financial losses from undetected fraud patterns.',
        resolution: 'Use a stream processing framework with built-in state checkpointing (Flink, Kafka Streams with changelog topics). Configure checkpoint frequency to match your recovery tolerance. Test fault tolerance explicitly: kill the processor mid-processing and verify the recovered processor produces the same results as an uninterrupted run.',
        animationSteps: [
          { label: '50 transactions', description: 'Fraudster makes 50 transactions in 4 minutes',  highlight: false },
          { label: 'Processor crash', description: 'Fraud detector crashes unexpectedly',            highlight: true  },
          { label: 'State lost',      description: 'On restart: no memory of last 5 minutes',         highlight: true  },
          { label: 'Fraud missed',    description: 'Counter resets - fraud rule not triggered',       highlight: true  },
          { label: 'Fix',             description: 'Flink checkpoints save state every 10s',          highlight: false },
        ],
      },
      {
        title: 'SSE Connection Pool Exhaustion Under Load',
        scenario: 'A live dashboard uses Server-Sent Events (SSE) to push metric updates. Under normal load: 10,000 concurrent SSE connections. Each connection is a long-lived HTTP connection held open by the web server. During a traffic spike, 100,000 users open the dashboard simultaneously. The web server\'s connection limit (50,000) is exhausted. New connections are rejected. The dashboard shows no data for half of users.',
        impact: 'Half of users see a broken dashboard during exactly the event that drove them to check it (a major incident or traffic spike).',
        resolution: 'SSE and WebSocket connections require horizontal scaling with a fan-out layer. Use a dedicated connection management service (or a service like Pusher or Ably) separate from the application tier. The fan-out service maintains millions of open connections while the application tier handles business logic. Monitor connection count per server and auto-scale before the limit is approached.',
        animationSteps: [
          { label: '10K normal',     description: '10K SSE connections - all fine',                  highlight: false },
          { label: 'Spike to 100K',  description: '100K users open dashboard simultaneously',        highlight: true  },
          { label: 'Limit 50K',      description: 'Server connection limit: 50,000 max',             highlight: true  },
          { label: 'Half rejected',  description: '50K new connections rejected - no data',          highlight: true  },
          { label: 'Fix',            description: 'Dedicated fan-out service + horizontal scale',     highlight: false },
        ],
      },
    ],
  },

  // 12. Interview Questions
  {
    order: 12, type: 'interview', title: 'Interview Discussion Questions',
    interviewQuestions: [
      {
        question: 'What is the difference between WebSockets, Server-Sent Events, and Long Polling?',
        answer: 'WebSockets: full-duplex persistent TCP connection. Both client and server send data any time. Used for chat, gaming, collaborative tools. 2-byte per-message overhead (vs 800+ bytes for HTTP). Requires WebSocket-aware load balancers. SSE: one-way server push over standard HTTP. Server streams events to client. Client uses separate HTTP requests to send data back. Works through standard proxies and CDNs. Best for notifications, live feeds where only server pushes. Long Polling: client makes HTTP request, server holds it until data is available, responds, client immediately re-requests. Highest overhead (full HTTP round-trip per message). Use only as fallback when WebSockets and SSE are blocked. For modern applications: WebSockets for interactive bidirectional features, SSE for simple unidirectional feeds, long polling as last resort.',
        difficulty: 'medium',
      },
      {
        question: 'What is the difference between event time and processing time in stream processing?',
        answer: 'Event time: when the event actually occurred in the real world (embedded in the event payload). Processing time: when the stream processor handled the event. They differ due to: network latency (100ms-minutes), mobile apps batching events when offline (minutes-hours), event retransmission (duplicates arrive later), or replaying historical events (hours-months later). For business-critical aggregations (sales by hour, fraud detection windows), always use event time - otherwise mobile orders placed before midnight get attributed to the next day. Use watermarks to handle late-arriving events: a watermark declares no events older than time T will arrive, allowing windows to close safely. Set watermark delay based on your expected maximum event delay.',
        difficulty: 'medium',
      },
      {
        question: 'Design a real-time leaderboard for a game with millions of players. How does it scale?',
        answer: 'Architecture: each score event published to Kafka. Kafka Streams consumer aggregates scores per player per period (using tumbling windows for daily/weekly leaderboards). Results written to Redis Sorted Set (ZADD with score). API reads leaderboard from Redis (ZREVRANGE for top-N, ZRANK for a specific player\'s rank). Redis Sorted Set supports O(log N) rank queries among millions of players. Scaling: partition Kafka by player_id for parallel processing. Redis Cluster shards the sorted set by score range or player_id. At 10M active players with 100 score events per second total: Kafka Streams processes comfortably on 3-5 instances. Redis serves leaderboard requests at <1ms latency. Total infrastructure: Kafka (3 brokers), Kafka Streams (3 instances), Redis Cluster (3 nodes).',
        difficulty: 'hard',
      },
      {
        question: 'What is a watermark in stream processing and why is it needed?',
        answer: 'A watermark is a declaration that "all events with timestamp before time T have arrived." It tells the stream processor it is safe to close windows that ended before T and emit final results. Without watermarks: a window covering 14:00-14:01 can never close because a delayed event from 14:00:30 might arrive at any time in the future. With a watermark at T-5min: when the watermark advances to 14:06, we know no events from before 14:01 will arrive (allowing 5 minutes for late events). The window can close and emit its result. The watermark delay trades accuracy vs latency: longer delay handles more late events but adds more latency to results. Set based on the maximum expected event delay in your system (mobile apps: 30-60 minutes; real-time IoT: 1-5 seconds).',
        difficulty: 'hard',
      },
      {
        question: 'When would you choose Kafka Streams vs Apache Flink?',
        answer: 'Kafka Streams: when processing is Kafka-to-Kafka, the team is comfortable with Java, operational simplicity matters (no separate cluster), and latency > 10ms is acceptable. Good for: transforming events, joining streams with lookup tables, simple windowed aggregations. Flink: when you need true event-time processing with complex watermark strategies, sub-10ms latency, exactly-once semantics across non-Kafka systems, very high throughput (billions of events/day), or complex stateful operations like custom windowing. Flink requires a separate cluster to operate - significantly more complex. For 90% of stream processing use cases, Kafka Streams is sufficient and much simpler. Use Flink when Kafka Streams cannot meet your latency, complexity, or scale requirements.',
        difficulty: 'medium',
      },
      {
        question: 'How does consumer lag indicate problems in a streaming system?',
        answer: 'Consumer lag = (latest offset in partition) - (consumer\'s current offset). It measures how far behind the consumer is relative to incoming events. Growing lag means the consumer is processing slower than events are arriving. Causes: slow processing logic (expensive queries, external API calls), not enough consumer instances, partition imbalance (all load on one partition), downstream system slowness. Monitoring: alert at two thresholds. Warning (1,000 events behind): investigate, possibly scale. Critical (10,000 events behind): page on-call, scale immediately. At 100 events/second and 10,000 event lag: 100 seconds (1.67 minutes) behind real time. For fraud detection, that is unacceptable. For analytics dashboards, it might be fine. Set thresholds based on your latency SLO.',
        difficulty: 'medium',
      },
      {
        question: 'Explain the lambda architecture and when would you use it vs kappa?',
        answer: 'Lambda architecture: batch layer (processes all historical data with high accuracy, runs periodically) + speed layer (processes recent data in real time with lower accuracy) + serving layer (merges both). Use lambda when: accuracy of historical reprocessing matters and stream processing cannot perfectly reproduce batch results, or when you have both real-time and historical analytics requirements with different accuracy needs. Kappa architecture: stream processing only. Historical reprocessing by resetting consumer group offset to replay the event log. Use kappa when: your stream processor can produce correct results for both real-time and historical data (Flink with event time handles this), you want operational simplicity (one processing system not two), and you retain events long enough in Kafka for reprocessing. Modern teams typically prefer Kappa for its simplicity - Flink\'s event-time capabilities make it accurate enough for most batch-equivalent use cases.',
        difficulty: 'hard',
      },
      {
        question: 'What is Change Data Capture (CDC) and how is it used in real-time systems?',
        answer: 'CDC streams changes (inserts, updates, deletes) from a database into the event pipeline by reading the database\'s transaction log (MySQL binlog, PostgreSQL WAL). Debezium is the standard open-source CDC tool. It publishes every database change as a Kafka event without any application code changes. Uses: sync database changes to Elasticsearch (search index updated within seconds of DB write), invalidate cache entries when data changes, replicate data to data warehouse in near real-time (instead of nightly ETL), trigger downstream workflows on specific data changes. Advantages: no polling (zero DB load from change detection), no application code changes, captures all changes including those from migrations and admin operations. Limitations: tied to database internals (binlog format), requires careful handling of schema changes, adds replication overhead.',
        difficulty: 'medium',
      },
    ],
  },

  // 13. Quiz
  {
    order: 13, type: 'quiz', title: 'Real-Time and Streaming Quiz',
    quizConfig: {
      timeLimitSeconds: 600, maxAttempts: 3, passingPercent: 70,
      questions: [
        {
          question: 'A chat app needs messages delivered in both directions (user sends and receives). Which protocol is the best choice?',
          options: ['Server-Sent Events (SSE)', 'Long Polling', 'WebSockets', 'HTTP/2 Push'],
          correctIndex: 2, scenario: true,
          explanation: 'WebSockets. Chat requires bidirectional communication - both client and server must send data at any time. SSE is server-to-client only. Long polling has very high overhead per message. WebSockets establish a persistent full-duplex connection with minimal per-message overhead (2 bytes vs 800+ for HTTP).',
        },
        {
          question: 'A mobile app user places an order at 23:55. Due to poor connectivity, the order event arrives at the stream processor at 00:10 the next day. Using processing time, the order is attributed to which day?',
          options: ['The correct day (the 23:55 day)', 'The next day (when it was processed at 00:10)', 'It is dropped as a late event', 'It is split across both days'],
          correctIndex: 1, scenario: true,
          explanation: 'Processing time attributes to the wrong day. The event arrives at 00:10 and processing time says it happened on the new day. Using event time (23:55 from the event payload) with a watermark that accommodates 20+ minutes of delay would correctly attribute the order to the original day.',
        },
        {
          question: 'A stream processor aggregates events into 1-minute non-overlapping buckets. What type of window is this?',
          options: ['Sliding window', 'Session window', 'Tumbling window', 'Global window'],
          correctIndex: 2, scenario: false,
          explanation: 'Tumbling window. Fixed-size, non-overlapping intervals where each event belongs to exactly one window. Sliding windows overlap. Session windows are based on activity gaps, not clock time. Tumbling windows are ideal for discrete time-bucket reports like "orders per hour" or "clicks per minute".',
        },
        {
          question: 'Your Kafka consumer group is processing 50 events per second but 200 events per second are arriving. What metric indicates this problem?',
          options: ['Error rate increasing', 'Consumer lag growing', 'Replication lag increasing', 'Partition count too low'],
          correctIndex: 1, scenario: true,
          explanation: 'Consumer lag. Lag = latest offset - consumer offset. When processing (50/sec) is slower than ingestion (200/sec), lag grows by 150 events/second. Alert at defined lag thresholds (1K = investigate, 10K = page on-call). The fix: scale out the consumer group and fix the slow processing bottleneck.',
        },
        {
          question: 'What problem do watermarks solve in stream processing?',
          options: ['Ensuring exactly-once delivery', 'Handling out-of-order events so windows can close correctly', 'Reducing memory usage in state stores', 'Balancing load across Kafka partitions'],
          correctIndex: 1, scenario: false,
          explanation: 'Watermarks handle out-of-order events. A watermark at time T declares all events before T have arrived. Without watermarks, an event-time window can never close because a delayed event might arrive at any moment. With a watermark, the processor knows it is safe to finalise windows older than the watermark timestamp.',
        },
        {
          question: 'A fraud detection system needs to count transactions per user over the last 10 minutes, updated every 1 minute. Which window type is correct?',
          options: ['Tumbling window (10 min)', 'Sliding window (10 min, 1 min step)', 'Session window', 'Global window'],
          correctIndex: 1, scenario: true,
          explanation: 'Sliding window (10 min window, 1 min step). This gives a moving view of "last 10 minutes" that updates every 1 minute. Tumbling windows would only emit every 10 minutes at window close. Session windows are activity-based, not time-based. The sliding window enables continuous monitoring with fresh results every minute.',
        },
        {
          question: 'Which stream processing framework runs as a library inside your application without requiring a separate cluster?',
          options: ['Apache Flink', 'Apache Spark Streaming', 'Apache Kafka Streams', 'Apache Storm'],
          correctIndex: 2, scenario: false,
          explanation: 'Kafka Streams is a client library. You add it as a dependency to your Java application and it runs as part of your process - no separate cluster to deploy, manage, or monitor. Scale by running more instances of your application. Flink, Spark Streaming, and Storm all require separate cluster deployments.',
        },
        {
          question: 'What is Change Data Capture (CDC) used for in real-time architectures?',
          options: ['Detecting schema changes in Kafka topics', 'Streaming database changes (inserts/updates/deletes) to Kafka without application code', 'Monitoring consumer lag in real time', 'Compressing stream data before storage'],
          correctIndex: 1, scenario: false,
          explanation: 'CDC reads the database transaction log and publishes every change as a Kafka event. No application code changes needed. Debezium is the standard tool. Used to: sync changes to search indexes (Elasticsearch), invalidate caches on data changes, build real-time data warehouses. Any database write is captured and available as an event within seconds.',
        },
        {
          question: 'A stateful stream processor crashes. On restart without checkpointing, what happens to its in-memory state?',
          options: ['State is automatically recovered from Kafka offsets', 'All state is lost - starts with an empty state', 'State is recovered from the most recent database snapshot', 'The processor replays all events since startup'],
          correctIndex: 1, scenario: true,
          explanation: 'State is lost. Without checkpointing, in-memory state (window counts, running aggregations, user transaction history) disappears on crash. The processor restarts with empty state. This creates correctness bugs - a fraud detector that forgets recent transactions misses fraud patterns. Solution: Flink checkpoints or Kafka Streams changelog topics persist state to durable storage for recovery.',
        },
        {
          question: 'What is the main advantage of using an event log (Kafka) as the central architecture component over direct service-to-service calls?',
          options: ['Direct calls are always slower than Kafka', 'Adding a new consumer does not require changes to the producer', 'Kafka automatically handles retries for all consumers', 'Events are delivered in strict priority order'],
          correctIndex: 1, scenario: false,
          explanation: 'Producer-consumer decoupling. With direct calls, the producer must explicitly call every consumer. Adding a new consumer requires changing the producer. With an event log, the producer publishes to a topic and any number of consumers subscribe independently. Adding a Loyalty Points Service that reacts to "order placed" events requires zero changes to the Order Service.',
        },
      ],
    },
  },
];

module.exports = REALTIME_STREAMING_MODULES;
