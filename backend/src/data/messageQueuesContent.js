// Static Message Queues content - 13 modules total
// Orders 1-10: content topics
// Order 11: Failure Cases
// Order 12: Interview Discussion Questions
// Order 13: Quiz

const MESSAGE_QUEUES_MODULES = [

  // 1. Message Queue Fundamentals
  {
    order: 1, type: 'content', title: 'Message Queue Fundamentals',
    content: {
      overview: 'A message queue is a communication mechanism that allows different parts of a system to send messages to each other without being directly connected. The sender puts a message in the queue and continues working. The receiver picks it up when ready and processes it.\n\nThis decoupling is the core value of message queues. The sender does not need the receiver to be online, fast, or even exist yet. Messages wait safely in the queue until processed.',
      sections: [
        { heading: 'What is a Message Queue?', body: 'A message queue is a temporary storage buffer that sits between a producer (sender) and a consumer (receiver). Messages are stored in order and consumers pick them up one at a time. The queue acts as a buffer - if the consumer is slow or temporarily unavailable, messages accumulate in the queue and are processed when the consumer recovers. Nothing is lost.', code: null },
        { heading: 'The Decoupling Benefit', body: 'Without a queue, Service A calls Service B directly. If B is down, A fails. If B is slow, A waits. With a queue, A puts a message in the queue and returns immediately. A does not know or care about B. B processes the message when ready. This temporal decoupling makes systems far more resilient and allows each service to scale independently.', code: null },
        { heading: 'Synchronous vs Asynchronous', body: 'Synchronous communication: Service A calls B and waits for a response. A is blocked until B responds. If B takes 10 seconds, A waits 10 seconds. Asynchronous communication via a queue: A puts a message in the queue and returns in milliseconds. B processes the message in the background. A is never blocked. This improves throughput and resilience dramatically.', code: null },
        { heading: 'Common Use Cases', body: 'Message queues are used in: sending emails and notifications (fire and forget after sign-up), processing uploaded files in the background (resize images, extract text), order processing pipelines (accept order immediately, process payment and inventory asynchronously), event-driven microservices (service A publishes an event, multiple services react), and smoothing traffic spikes (queue absorbs sudden bursts, workers drain at their natural rate).', code: null },
      ],
      animationSteps: [
        { label: 'Producer',    description: 'Service A sends message to the queue',            highlight: false },
        { label: 'Queued',      description: 'Message stored safely - producer returns fast',   highlight: true  },
        { label: 'Buffered',    description: 'Queue holds messages even if consumer is slow',   highlight: true  },
        { label: 'Consumer',    description: 'Service B picks up and processes when ready',     highlight: false },
        { label: 'Decoupled',   description: 'Producer and consumer never directly connected',  highlight: false },
      ],
      example: 'When you sign up for Slack, the API immediately returns "Account created!" and puts a "send welcome email" message in the queue. A background email worker picks it up seconds later and sends the email. The sign-up API is never blocked waiting for the email to send. If the email service is down, the message waits and is retried - the sign-up still succeeded.',
    },
  },

  // 2. Queue Architecture and Components
  {
    order: 2, type: 'content', title: 'Queue Architecture and Components',
    content: {
      overview: 'A message queue system has several key components that work together: the broker (the server that stores and routes messages), producers (senders), consumers (receivers), queues or topics (storage channels), and the messages themselves.\n\nUnderstanding how these components interact is essential for designing reliable event-driven systems.',
      sections: [
        { heading: 'The Message Broker', body: 'The broker is the central server that receives messages from producers, stores them, and delivers them to consumers. It handles routing, persistence, ordering, and delivery guarantees. RabbitMQ, Apache Kafka, Amazon SQS, and Google Pub/Sub are all message brokers. The broker must be highly available - if it goes down, no messages can be sent or received. Run brokers in clusters for high availability.', code: null },
        { heading: 'Queues vs Topics', body: 'A queue is a point-to-point channel. One producer puts a message in, one consumer takes it out. Once consumed, the message is gone. Used when exactly one service should process each message (payment processing, task distribution). A topic is a publish-subscribe channel. One producer publishes to a topic, multiple consumers each receive their own copy. Used when multiple services need to react to the same event.', code: null },
        { heading: 'Message Structure', body: 'A message has three parts. The payload (the actual data - JSON body, image bytes, text). The metadata headers (routing key, content type, priority, timestamp, correlation ID, expiry). The envelope (the message ID, delivery mode, queue name). Well-structured messages include a schema version and correlation ID for tracing. Consumers should be able to process a message knowing only its content - no external state lookup needed.', code: null },
        { heading: 'Persistence', body: 'Messages can be transient (stored in memory only - fast but lost if broker restarts) or persistent (written to disk before acknowledging - slower but survives restarts). For most production systems, persistence is essential. Kafka persists all messages to disk by default and retains them for days or weeks, not just until consumed. SQS stores messages redundantly across multiple availability zones automatically.', code: null },
      ],
      animationSteps: [
        { label: 'Producer',  description: 'Sends message to the broker',                      highlight: false },
        { label: 'Broker',    description: 'Stores message in queue or topic',                  highlight: true  },
        { label: 'Persist',   description: 'Written to disk for durability',                   highlight: true  },
        { label: 'Route',     description: 'Broker routes to correct consumer(s)',             highlight: false },
        { label: 'Deliver',   description: 'Consumer receives and acknowledges message',       highlight: false },
      ],
      example: 'Apache Kafka stores messages as an ordered log on disk. A message published at 2 PM on Monday stays on disk until the retention period expires (configured per topic, typically 7 days). Multiple consumer groups each read the same messages independently. The analytics team can replay all messages from yesterday without affecting the payment processing consumer reading in real time.',
    },
  },

  // 3. Producers and Consumers
  {
    order: 3, type: 'content', title: 'Producers and Consumers',
    content: {
      overview: 'Producers are the senders - applications that create and publish messages to a queue or topic. Consumers are the receivers - applications that read and process messages. The relationship between producers and consumers determines how work gets distributed across your system.\n\nThe key design decisions: how many consumers process a single queue, how consumers coordinate, and what happens if a consumer fails mid-processing.',
      sections: [
        { heading: 'Producer Design', body: 'A well-designed producer sends a message and returns immediately. It should not care about the consumer or wait for processing to complete. Include enough information in the message for the consumer to act without calling back to the producer. Set appropriate message metadata (expiry time, priority, correlation ID for tracing). Batch messages when possible (send 100 at once rather than 100 individual sends) to reduce broker overhead.', code: null },
        { heading: 'Consumer Groups', body: 'A consumer group is a set of consumers that collectively process messages from a queue. Each message is processed by exactly one consumer in the group. This enables parallel processing - with 10 consumers in a group and 1000 messages, each consumer processes roughly 100 messages simultaneously. If one consumer fails, the others take over its unprocessed messages. Consumer groups are the primary mechanism for horizontal scaling of message processing.', code: null },
        { heading: 'Push vs Pull', body: 'Push model: the broker pushes messages to consumers as they arrive. Low latency but can overwhelm slow consumers. RabbitMQ uses push with prefetch limits to prevent consumer overload. Pull model: consumers ask the broker for messages when they are ready. Consumer controls its own pace. Kafka uses pull - consumers request batches at their own rate. Pull is better for consumers with variable processing speeds or when consumers need to batch messages together.', code: null },
        { heading: 'Competing Consumers Pattern', body: 'Multiple consumers read from the same queue, each processing a different message in parallel. This is the standard pattern for distributing work. Each consumer claims a message (locks it), processes it, then acknowledges it. If the consumer crashes before acknowledging, the message is made available to another consumer. This pattern achieves load balancing and fault tolerance automatically.', code: null },
      ],
      animationSteps: [
        { label: 'Producer',     description: 'Publishes 100 messages to queue',               highlight: false },
        { label: 'Consumer 1',   description: 'Picks up and processes messages 1-33',          highlight: true  },
        { label: 'Consumer 2',   description: 'Picks up and processes messages 34-66',         highlight: true  },
        { label: 'Consumer 3',   description: 'Picks up and processes messages 67-100',        highlight: false },
        { label: 'Parallel',     description: 'All 3 consumers work simultaneously - 3x speed', highlight: false },
      ],
      example: 'Airbnb uses consumer groups for their image processing pipeline. When a host uploads photos, a producer sends one message per image to a queue. A consumer group of 50 image processing workers each picks up one message, resizes the image to multiple dimensions, and stores the results. 50 images are processed in parallel. Adding more workers to the group increases throughput linearly.',
    },
  },

  // 4. Point-to-Point Messaging
  {
    order: 4, type: 'content', title: 'Point-to-Point Messaging',
    content: {
      overview: 'Point-to-point (P2P) messaging is the simplest model: one producer sends a message, exactly one consumer receives and processes it. Once processed, the message is removed from the queue. It is guaranteed that only one consumer handles each message.\n\nThis model is ideal for distributing work across a pool of workers, task queues, and any situation where each piece of work should be done exactly once.',
      sections: [
        { heading: 'How It Works', body: 'The producer puts messages in a queue. Multiple consumers listen to the same queue. When a message arrives, one consumer claims it (other consumers do not see it). That consumer processes it and sends an acknowledgement (ack). The broker deletes the message. If the consumer crashes before acking, the message becomes visible again after a timeout (visibility timeout) and another consumer picks it up.', code: null },
        { heading: 'Work Distribution', body: 'P2P is the standard pattern for work queues - distributing jobs across a pool of workers. Think of it like a team of cashiers (consumers) serving customers from a line (queue). Each cashier serves one customer at a time. No two cashiers serve the same customer. If a cashier goes on break (consumer crashes), their customer gets back in line (message requeued). New cashiers can be added as the queue grows.', code: null },
        { heading: 'Load Leveling', body: 'A queue naturally levels load. During a traffic spike, producers send thousands of messages per second. Workers process at their natural rate (say 100 per second). Messages queue up. The spike passes. Workers drain the backlog at their own pace. Without a queue, the spike would overwhelm the workers directly. With a queue, the spike becomes a temporary backlog that clears over time. No requests are dropped.', code: null },
        { heading: 'When to Use P2P', body: 'Use point-to-point when: exactly one service should process each item (payment, order fulfillment), you want to distribute work across multiple workers, you need to handle traffic spikes without dropping requests, or you want natural retry on consumer failure. Examples: background job processing (Sidekiq, Celery), task queues (Celery workers), print queues, video transcoding jobs.', code: null },
      ],
      animationSteps: [
        { label: 'Messages queued', description: '5 messages waiting in the queue',            highlight: false },
        { label: 'Consumer A',      description: 'Claims message 1 - locked from others',      highlight: true  },
        { label: 'Consumer B',      description: 'Claims message 2 simultaneously',            highlight: true  },
        { label: 'A acks msg 1',    description: 'Processed - broker deletes message 1',       highlight: false },
        { label: 'Next message',    description: 'Consumer A immediately claims message 3',    highlight: false },
      ],
      example: 'Amazon SQS powers Netflix\'s encoding pipeline. When you upload a video, a producer sends a message to an SQS queue with the raw file location. A pool of 1000 encoding workers reads from the queue - each worker claims one video message, encodes it to multiple resolutions, stores the output, and acks. No two workers ever encode the same video. The queue ensures each video is encoded exactly once regardless of worker failures.',
    },
  },

  // 5. Publish-Subscribe (Pub/Sub) Messaging
  {
    order: 5, type: 'content', title: 'Publish-Subscribe Messaging',
    content: {
      overview: 'In Publish-Subscribe (Pub/Sub), a producer publishes a message to a topic and every subscriber receives their own copy of that message. Unlike point-to-point where one consumer gets the message, Pub/Sub delivers to all interested parties simultaneously.\n\nThis is the foundation of event-driven architecture. When something happens in your system, you publish an event and all services that care about it react independently.',
      sections: [
        { heading: 'How Pub/Sub Works', body: 'Producers publish messages to a named topic (not directly to a consumer). Consumers subscribe to topics they care about. When a message is published, every subscriber gets a copy. Subscribers are completely independent - they can be added or removed without changing the producer. The producer does not know who is subscribed or how many subscribers exist.', code: null },
        { heading: 'Fan-out', body: 'Fan-out is when one published message is delivered to many consumers simultaneously. An "order placed" event might fan out to: the notification service (send confirmation email), the inventory service (reserve stock), the analytics service (update metrics), the fraud detection service (check for suspicious patterns). All four services react in parallel from one published event. Adding a fifth subscriber requires no change to the producer.', code: null },
        { heading: 'Topics and Subscriptions', body: 'A topic is the channel. A subscription is a named consumer group connected to a topic. Each subscription receives every message published to the topic independently. In Kafka, topics are partitioned - each partition is an ordered log. In Google Pub/Sub and AWS SNS, subscriptions receive messages via push (HTTP endpoint) or pull (API call). In RabbitMQ, exchanges route messages to queues via binding rules.', code: null },
        { heading: 'Pub/Sub vs Point-to-Point', body: 'Use Pub/Sub when multiple services need to react to the same event and each should process it independently. Use Point-to-Point when only one service should process each message and you want to distribute work. They are often combined: a Pub/Sub topic fans out to multiple point-to-point queues, each with a consumer group. This provides fan-out (Pub/Sub) with parallel processing per subscriber (P2P queues).', code: null },
      ],
      animationSteps: [
        { label: 'Order placed',   description: 'Producer publishes "order.placed" event',     highlight: false },
        { label: 'Topic receives', description: 'Broker stores in order.placed topic',         highlight: true  },
        { label: 'Fan-out',        description: 'Email, Inventory, Analytics all get a copy',  highlight: true  },
        { label: 'Parallel react', description: 'All 3 services process independently',        highlight: false },
        { label: 'Decoupled',      description: 'Producer never knew these services existed',  highlight: false },
      ],
      example: 'Uber Eats publishes an "order.accepted" event when a restaurant accepts an order. The customer notification service subscribes and sends a push notification. The driver assignment service subscribes and starts looking for a nearby driver. The analytics service subscribes and updates real-time order metrics. All three react simultaneously to one published event. Uber can add a new subscriber (say a loyalty points service) without changing anything in the order acceptance code.',
    },
  },

  // 6. Message Delivery Guarantees
  {
    order: 6, type: 'content', title: 'Message Delivery Guarantees',
    content: {
      overview: 'Not all message systems deliver messages with the same guarantees. There are three delivery semantics: at-most-once (may lose messages), at-least-once (may duplicate), and exactly-once (never lose, never duplicate). Each involves a different tradeoff between performance, complexity, and reliability.\n\nChoosing the right delivery guarantee for each use case is a critical design decision.',
      sections: [
        { heading: 'At-Most-Once', body: 'A message is delivered zero or one time - it may be lost but is never duplicated. The producer fires and forgets without waiting for confirmation. The broker delivers and removes immediately without waiting for a consumer acknowledgement. If the consumer crashes after receiving but before processing, the message is gone. Use when: losing some messages is acceptable and performance is critical. Examples: metrics sampling, non-critical logs, real-time gaming events.', code: null },
        { heading: 'At-Least-Once', body: 'A message is delivered one or more times - it is never lost but may be duplicated. The producer waits for broker confirmation before considering the message sent. The consumer must explicitly acknowledge (ack) a message after processing. If the consumer crashes before acking, the broker re-delivers. The consumer may therefore receive the same message more than once. Requires idempotent consumers (processing the same message twice produces the same result). This is the most common production setting.', code: null },
        { heading: 'Exactly-Once', body: 'A message is delivered exactly one time - never lost, never duplicated. The hardest guarantee to achieve in distributed systems. Requires coordination between producer, broker, and consumer to detect and deduplicate duplicates. Kafka Transactions enable exactly-once between Kafka topics. AWS SQS FIFO queues provide exactly-once within a 5-minute deduplication window. The performance cost is significant. Use only when duplicates cause real harm (financial transactions, critical inventory updates).', code: null },
        { heading: 'Idempotency as an Alternative', body: 'For most use cases, at-least-once delivery with idempotent consumers is preferable to exactly-once. An idempotent operation produces the same result no matter how many times it runs. Sending the same welcome email twice is not idempotent (user gets two emails). Updating a user\'s email to a specific value is idempotent (updating it twice still results in the same email). Design consumers to be idempotent and use at-least-once delivery for simplicity with reliability.', code: null },
      ],
      animationSteps: [
        { label: 'At-most-once', description: 'Send and forget: may lose but never duplicate', highlight: false },
        { label: 'At-least-once', description: 'Ack required: never lose but may duplicate',   highlight: true  },
        { label: 'Consumer crash', description: 'Crashes before ack: broker re-delivers',      highlight: true  },
        { label: 'Exactly-once',  description: 'Deduplication: never lose, never duplicate',   highlight: false },
        { label: 'Idempotent',    description: 'Process twice = same result: use at-least-once', highlight: false },
      ],
      example: 'Stripe uses at-least-once delivery for all internal events with idempotent consumers. Every payment-related operation uses an idempotency key. If the same charge event is delivered twice, the second processing detects the idempotency key already exists and skips without charging again. This combines the simplicity of at-least-once with the safety of no double-charges.',
    },
  },

  // 7. Message Ordering and Prioritization
  {
    order: 7, type: 'content', title: 'Message Ordering and Prioritization',
    content: {
      overview: 'Message ordering determines the sequence in which consumers receive messages. Message prioritization determines which messages are processed first when the queue is backlogged.\n\nOrdering and priority seem simple but become complex at scale - especially when you need ordering across multiple consumers processing in parallel.',
      sections: [
        { heading: 'FIFO Ordering', body: 'First In, First Out (FIFO) ensures messages are delivered in the order they were sent. Simple and predictable. The challenge: FIFO and parallel processing are in tension. If you have 5 consumers and need strict ordering, only one consumer can process at a time (or you must ensure order before delivering). AWS SQS FIFO queues provide strict ordering within a message group while allowing parallelism across different message groups.', code: null },
        { heading: 'Partition-Based Ordering (Kafka)', body: 'Kafka achieves ordered parallel processing via partitions. A topic has N partitions, each an ordered log. Messages with the same key are always routed to the same partition (e.g., all messages for user_id 123 go to partition 2). Each partition is consumed by exactly one consumer in a group. Result: messages for the same user are always ordered, but messages for different users are processed in parallel by different consumers.', code: null },
        { heading: 'Message Priority', body: 'Priority queues deliver higher-priority messages before lower-priority ones. A premium customer\'s request gets processed before a free tier request. A critical alert gets processed before a routine notification. RabbitMQ supports priority queues natively (priority 0-255). Most brokers implement priority by routing high-priority messages to a separate queue that consumers drain first before reading low-priority messages.', code: null },
        { heading: 'Ordering Tradeoffs', body: 'Strict global ordering across all messages and all consumers is possible but expensive - effectively forces single-threaded processing. Partition-level ordering (Kafka) is a good balance. Message group ordering (SQS FIFO) is another. For most use cases, ordering within a logical group (same user, same order) is sufficient - you do not need ordering across different users. Design your message keys around your actual ordering requirements.', code: null },
      ],
      animationSteps: [
        { label: 'Messages sent',  description: 'M1, M2, M3 published in order',               highlight: false },
        { label: 'FIFO queue',     description: 'Consumer receives M1 then M2 then M3',         highlight: true  },
        { label: 'Kafka key',      description: 'user_id=123 always routes to partition 2',     highlight: true  },
        { label: 'Parallel',       description: 'Different user_ids processed in parallel',     highlight: false },
        { label: 'Priority',       description: 'High priority messages skip to front',         highlight: false },
      ],
      example: 'A bank processes transactions in Kafka. All transactions for the same account (same account_id key) go to the same partition and are processed in order - ensuring balance is calculated correctly. Transactions for different accounts go to different partitions and are processed in parallel. Ordering is maintained where it matters (per account) without sacrificing throughput.',
    },
  },

  // 8. Acknowledgements, Retries and Dead Letter Queues
  {
    order: 8, type: 'content', title: 'Acknowledgements, Retries and DLQ',
    content: {
      overview: 'Acknowledgements (acks) are the mechanism by which consumers tell the broker that a message was processed successfully. Retries handle transient failures. Dead Letter Queues (DLQ) catch messages that fail processing repeatedly and cannot be retried.\n\nThis trio forms the foundation of reliable message processing. Without them, failed messages silently disappear or block the entire queue.',
      sections: [
        { heading: 'Acknowledgements', body: 'When a consumer picks up a message, it is temporarily locked (hidden from other consumers). After processing, the consumer sends an ack. The broker permanently deletes the message. If the consumer crashes before acking, the lock expires (visibility timeout) and the message becomes visible again for another consumer to pick up. Never acknowledge before processing is complete - acking then crashing loses the message permanently.', code: null },
        { heading: 'Retries with Exponential Backoff', body: 'When a consumer fails to process a message (throws an exception), it sends a negative acknowledgement (nack) or simply lets the visibility timeout expire. The broker re-delivers the message. Naive immediate retry hammers a failing service. Exponential backoff spaces retries out: retry after 1s, then 2s, then 4s, 8s, 16s. This gives transient failures time to resolve without flooding the system. Add jitter to prevent all retried messages from spiking simultaneously.', code: null },
        { heading: 'Dead Letter Queues (DLQ)', body: 'A DLQ is a special queue that receives messages that have failed processing a configurable number of times (e.g., 3 retries). Instead of endlessly retrying a poison message (one that will always fail, like malformed data), the broker moves it to the DLQ after N attempts. Engineers monitor DLQs and investigate failures. The main queue keeps flowing without being blocked by unfixable messages. Every production queue should have a DLQ.', code: null },
        { heading: 'Poison Messages', body: 'A poison message is one that causes a consumer to crash or throw an exception every time it tries to process it. Without a DLQ, the message is retried forever, blocking or slowing the queue. Common causes: malformed JSON that cannot be parsed, missing required fields, business logic edge cases, data that triggers a bug in the consumer. The DLQ captures these, lets the queue continue, and gives you a record of what failed to investigate.', code: null },
      ],
      animationSteps: [
        { label: 'Consumer picks up', description: 'Message locked, consumer starts processing', highlight: false },
        { label: 'Processing fails',  description: 'Consumer throws exception - nack sent',    highlight: true  },
        { label: 'Retry 1',           description: 'Message re-delivered after 1s backoff',    highlight: true  },
        { label: 'Retry 3 fails',     description: 'Max retries reached - move to DLQ',        highlight: false },
        { label: 'DLQ',               description: 'Message in DLQ - engineer investigates',   highlight: false },
      ],
      example: 'Shopify processes order webhooks with at-least-once delivery and a DLQ. If a merchant\'s endpoint returns a 500 error, Shopify retries with exponential backoff (5s, 25s, 125s, 625s...) up to 19 times over 48 hours. If all retries fail, the webhook moves to the DLQ. The Shopify dashboard shows merchants their failed webhook deliveries with error details so they can fix their endpoint.',
    },
  },

  // 9. Message Brokers (RabbitMQ, Kafka, SQS)
  {
    order: 9, type: 'content', title: 'Message Brokers',
    content: {
      overview: 'Not all message brokers are built the same. RabbitMQ is a traditional message broker optimised for routing flexibility and low latency. Apache Kafka is a distributed log optimised for high throughput and event streaming. Amazon SQS is a managed cloud queue optimised for simplicity and unlimited scale.\n\nChoosing the right broker for your use case can make an enormous difference in operational complexity and performance.',
      sections: [
        { heading: 'RabbitMQ', body: 'RabbitMQ is a traditional AMQP broker. Key strengths: flexible routing via exchanges (direct, fanout, topic, headers), very low latency (sub-millisecond), per-message TTL and priority, message acknowledgements and DLQ built in. Best for: complex routing logic, task queues, RPC patterns, when messages must not persist after consumption. Limitations: not designed for high-throughput log streaming, messages are gone after consumption (no replay).', code: null },
        { heading: 'Apache Kafka', body: 'Kafka is a distributed commit log. Key strengths: extremely high throughput (millions of messages/second), durable storage with configurable retention (days/weeks), multiple consumer groups independently reading the same messages, time-travel (replay from any offset), ordered within a partition. Best for: event streaming, audit logs, real-time analytics pipelines, event sourcing. Limitations: more complex to operate, higher latency than RabbitMQ, no per-message routing.', code: null },
        { heading: 'Amazon SQS', body: 'SQS is a fully managed cloud queue. Key strengths: unlimited throughput scales automatically, zero operational overhead (no servers to manage), standard queues for maximum throughput and FIFO queues for ordered delivery, built-in DLQ support, tight AWS integration. Best for: decoupling AWS services, background job processing, when you want zero queue management. Limitations: higher per-message latency than self-hosted, no Pub/Sub natively (use SNS + SQS together).', code: null },
        { heading: 'Choosing a Broker', body: 'Use RabbitMQ when: complex routing, low latency task queues, messages should not persist after consumption. Use Kafka when: high throughput event streaming, multiple consumer groups reading the same events, need to replay historical events, building event-sourced systems or real-time pipelines. Use SQS when: running on AWS and want zero operational overhead, simple decoupling between AWS services, need infinite automatic scaling.', code: null },
      ],
      animationSteps: [
        { label: 'RabbitMQ',  description: 'Flexible routing: direct, fanout, topic exchanges', highlight: false },
        { label: 'Kafka',     description: 'Distributed log: partitions, consumer groups, replay', highlight: true },
        { label: 'SQS',       description: 'Managed cloud queue: zero ops, unlimited scale',    highlight: true  },
        { label: 'Use case',  description: 'RabbitMQ: routing. Kafka: streaming. SQS: managed', highlight: false },
        { label: 'Choose',    description: 'Match broker strengths to your actual requirements', highlight: false },
      ],
      example: 'LinkedIn uses Kafka as the central nervous system of their data infrastructure. Over 7 trillion messages per day flow through their Kafka clusters. Activity data, metrics, notifications, and database change events all go through Kafka. Multiple teams consume the same events independently - the analytics team, the recommendations team, and the real-time dashboard team all read from the same Kafka topics without interfering with each other.',
    },
  },

  // 10. Message Queues in Practice
  {
    order: 10, type: 'content', title: 'Message Queues in Practice',
    content: {
      overview: 'Understanding message queue theory is one thing. Running them in production involves practical decisions: how to monitor queue health, how to handle backpressure when consumers are slow, how to version message schemas, and how to avoid common operational pitfalls.\n\nThis module covers what you actually encounter when message queues are in production.',
      sections: [
        { heading: 'Monitoring Queue Health', body: 'Key metrics to monitor: queue depth (number of unprocessed messages - growing depth means consumers are falling behind), consumer lag (how far behind consumers are in Kafka - measured in offset lag), message age (how long the oldest message has been waiting - indicates consumer problems), dead letter queue depth (any growth needs immediate investigation), and throughput (messages per second - drops indicate broker or consumer issues).', code: null },
        { heading: 'Backpressure', body: 'Backpressure occurs when producers publish faster than consumers can process. The queue depth grows indefinitely. Strategies: scale up consumers (add more consumer instances), rate limit producers, use rejection (producers get a 429 and retry later), or add a circuit breaker that pauses producers when queue depth exceeds a threshold. Kafka supports consumer-controlled rate limiting naturally via its pull model.', code: null },
        { heading: 'Schema Evolution', body: 'Message schemas change over time as features evolve. Consumers reading old messages must still work when new fields are added. Use a schema registry (Confluent Schema Registry for Kafka) to version schemas and enforce compatibility rules: backward compatible (new consumers can read old messages), forward compatible (old consumers can read new messages), full compatible (both). Never remove or rename existing fields - only add new optional fields.', code: null },
        { heading: 'Idempotent Consumer Pattern', body: 'With at-least-once delivery, consumers must handle duplicate messages safely. The idempotent consumer pattern: before processing a message, check if its message ID has already been processed (lookup in Redis or database). If yes, skip it. If no, process and record the ID. This prevents double charges, double emails, and double inventory updates. The deduplication check must be atomic with the processing to avoid race conditions.', code: null },
      ],
      animationSteps: [
        { label: 'Queue depth', description: 'Monitor: queue depth growing = consumer lag',    highlight: false },
        { label: 'Backpressure', description: 'Depth too high: scale up consumers or rate limit', highlight: true },
        { label: 'DLQ alert',   description: 'DLQ growing: investigate poison messages',        highlight: true  },
        { label: 'Schema check', description: 'Schema registry validates compatibility on publish', highlight: false },
        { label: 'Idempotent',  description: 'Check message ID before processing - skip dups',  highlight: false },
      ],
      example: 'Spotify monitors their Kafka consumer groups with a custom dashboard showing lag per consumer group per partition. When the recommendations consumer group falls more than 100,000 messages behind (lag > 100K), an alert fires and they auto-scale the consumer group. They use Confluent Schema Registry to enforce that all schema changes are backward compatible before allowing a producer to publish new message formats.',
    },
  },

  // 11. Failure Cases
  {
    order: 11, type: 'failureCases', title: 'Failure Cases',
    failureCases: [
      {
        title: 'Queue Backlog Grows Without Bound',
        scenario: 'A producer publishes order events at 10,000 per second during a flash sale. The consumer group processes at 1,000 per second. Queue depth grows by 9,000 messages per second. After 10 minutes, 5.4 million unprocessed messages are queued. Consumers fall hours behind real-time. Order confirmation emails are delayed by hours. Customer support is flooded with "where is my order?" tickets.',
        impact: 'User experience severely degraded. Time-sensitive operations (order confirmations, inventory updates, fraud checks) are hours delayed. Queue may fill available disk space and crash the broker.',
        resolution: 'Monitor consumer lag continuously and alert at defined thresholds. Set up auto-scaling for consumer groups based on queue depth. Implement producer backpressure - slow or pause publishing when queue depth exceeds a threshold. For known events (flash sales), pre-scale consumers before the event starts.',
        animationSteps: [
          { label: 'Publish 10K/s', description: 'Producer publishes 10,000 messages per second', highlight: true },
          { label: 'Process 1K/s',  description: 'Consumer group processes only 1,000 per second', highlight: true },
          { label: 'Backlog grows', description: '+9,000 messages per second - unbounded growth',  highlight: true },
          { label: '5M messages',   description: '5.4M messages queued after 10 minutes',          highlight: false },
          { label: 'Fix',           description: 'Auto-scale consumers + backpressure on producers', highlight: false },
        ],
      },
      {
        title: 'Poison Message Blocks the Queue',
        scenario: 'A malformed order event is published with a null product ID. Every consumer that picks it up throws a NullPointerException immediately. Without a DLQ configured, the message is retried immediately after each crash. The retry loop exhausts one consumer after another. The consumer group becomes unstable. Other valid messages behind it cannot be processed. The queue appears stuck.',
        impact: 'Queue processing halted for all messages. Valid orders are not processed. System appears healthy (broker is running, consumers are running) but no work is getting done.',
        resolution: 'Configure a DLQ on every queue with a max receive count (3-5 retries before moving to DLQ). Monitor DLQ depth with alerts. Fix the root cause (validation on the producer side to reject malformed messages before they enter the queue).',
        animationSteps: [
          { label: 'Bad message',    description: 'Malformed message: null product_id',          highlight: true  },
          { label: 'Consumer crash', description: 'NullPointerException on every attempt',       highlight: true  },
          { label: 'Infinite retry', description: 'Requeued immediately - crash loop',           highlight: true  },
          { label: 'Queue stuck',    description: 'All other messages blocked behind poison msg', highlight: false },
          { label: 'Fix',            description: 'DLQ after 3 retries + producer validation',   highlight: false },
        ],
      },
      {
        title: 'Message Processing Not Idempotent',
        scenario: 'An order payment consumer processes a charge and then tries to update a database. The database update times out. The consumer nacks the message (or crashes). The broker re-delivers. The consumer charges the card again - successfully this time. The customer is charged twice for one order.',
        impact: 'Financial data corruption. Double charges require manual refunds and cause customer complaints and chargebacks. Trust damage.',
        resolution: 'All consumers for financial operations must be idempotent. Use a unique idempotency key (the message ID) to check if this message was already processed before charging. Store "message_id: processed" in Redis or database atomically with the charge. If the key exists, skip the charge and ack.',
        animationSteps: [
          { label: 'Message 1',     description: 'Payment consumer processes charge: success',   highlight: false },
          { label: 'DB update fails', description: 'Database timeout - consumer nacks',          highlight: true  },
          { label: 'Re-delivered',  description: 'Same message re-delivered by broker',          highlight: true  },
          { label: 'Double charge', description: 'Consumer charges card again - twice charged',  highlight: true  },
          { label: 'Fix',           description: 'Check idempotency key before charging',        highlight: false },
        ],
      },
      {
        title: 'Consumer Group Rebalance Storm',
        scenario: 'A Kafka consumer group has 20 consumers. During a deployment, all 20 consumers restart simultaneously. Every restart triggers a group rebalance (redistribution of partitions). Each rebalance takes 30 seconds. With 20 restarts happening in quick succession, the consumer group spends 10 minutes continuously rebalancing. During this time, no messages are processed.',
        impact: 'Zero message processing for 10 minutes during what should be a routine deployment. Queue depth grows by millions of messages. Downstream systems starved of events.',
        resolution: 'Use rolling deployments - restart consumers one at a time or in small batches. Configure longer session timeouts to reduce rebalance sensitivity. Use Kafka static group membership (group.instance.id) which prevents rebalances on short disconnections during restarts. Deploy during low-traffic windows.',
        animationSteps: [
          { label: '20 restart',    description: 'All 20 consumers restart simultaneously',      highlight: true  },
          { label: 'Rebalance 1',   description: 'Group rebalancing: 30s pause in processing',  highlight: true  },
          { label: 'Rebalance 2-N', description: 'Each restart triggers another rebalance',     highlight: true  },
          { label: '10min pause',   description: 'Zero processing for 10 minutes',              highlight: false },
          { label: 'Fix',           description: 'Rolling restart: one at a time + static IDs', highlight: false },
        ],
      },
      {
        title: 'Message Schema Breaking Change',
        scenario: 'A team renames a field in their published event (order_id to orderId to match their new coding standard). All existing consumers still expect order_id. After deployment, every consumer reading the event fails to find order_id (it is null), processes incorrectly, and silently produces wrong results. 500,000 affected messages are in the queue before the issue is caught.',
        impact: 'Silent data corruption. Consumers appear to run successfully (no exceptions) but process incorrect data. Millions of events processed incorrectly before detection.',
        resolution: 'Never rename fields in published schemas. Only add new optional fields (backward compatible change). Use a schema registry (Confluent Schema Registry) that enforces compatibility rules and rejects breaking changes on publish. Add both old_field and new_field during transition, deprecate old_field after all consumers migrate.',
        animationSteps: [
          { label: 'Old schema',   description: 'Event: {order_id: 123, total: 50}',             highlight: false },
          { label: 'Field renamed', description: 'Producer now publishes {orderId: 123, total: 50}', highlight: true },
          { label: 'Consumers fail', description: 'All consumers read order_id as null',         highlight: true  },
          { label: 'Silent bug',   description: '500K events processed with null order_id',      highlight: true  },
          { label: 'Fix',          description: 'Schema registry + never rename, only add fields', highlight: false },
        ],
      },
    ],
  },

  // 12. Interview Questions
  {
    order: 12, type: 'interview', title: 'Interview Discussion Questions',
    interviewQuestions: [
      {
        question: 'When would you use a message queue instead of direct synchronous API calls between services?',
        answer: 'Use a message queue when: the operation does not need an immediate result (sending a confirmation email, processing an uploaded file, updating analytics); you want to decouple services so they can fail and recover independently; you need to handle traffic spikes by buffering requests (queue absorbs bursts, workers drain at their own rate); multiple services need to react to the same event (Pub/Sub fan-out); or you need reliable retry on consumer failure. Use direct API calls when: you need an immediate response to continue (checking if payment was approved), the operation must be atomic across services, or the latency of async processing is unacceptable.',
        difficulty: 'medium',
      },
      {
        question: 'Explain at-most-once, at-least-once, and exactly-once delivery semantics.',
        answer: 'At-most-once: message delivered 0 or 1 times. Producer fires without confirmation, broker delivers without waiting for ack. Fast but may lose messages. Use for non-critical data like metrics samples. At-least-once: message delivered 1 or more times. Producer waits for broker ack, consumer must ack after processing. If consumer crashes before acking, broker re-delivers. May duplicate. Requires idempotent consumers. Most common in production. Exactly-once: message delivered exactly 1 time. Requires deduplication coordination between producer, broker, and consumer. Most complex and expensive. Use only when duplicates cause real harm (financial transactions). In practice, at-least-once with idempotent consumers gives you effectively-once semantics at lower complexity.',
        difficulty: 'medium',
      },
      {
        question: 'What is a Dead Letter Queue and why is every production queue incomplete without one?',
        answer: 'A DLQ is a queue that receives messages that have failed processing after a configurable number of retries (typically 3-5). Without a DLQ, a poison message (one that always causes the consumer to crash) is retried forever, blocking valid messages behind it or crashing the consumer in a loop. With a DLQ: the poison message is moved to the DLQ after N attempts, the main queue continues processing, and engineers are alerted to investigate the DLQ. Every queue needs a DLQ because: every queue will eventually receive a malformed or unexpected message that causes a consumer to fail permanently. The DLQ prevents that message from blocking everything else.',
        difficulty: 'medium',
      },
      {
        question: 'How does Kafka achieve ordered parallel processing across multiple consumers?',
        answer: 'Kafka uses partitions. A topic has N partitions, each an ordered, immutable append-only log. Messages with the same key are always routed to the same partition via hash(key) % num_partitions. Each partition is assigned to exactly one consumer within a consumer group. Result: messages for the same key (e.g., same user_id or same account_id) are always ordered because they are on the same partition processed by one consumer. Messages for different keys are processed in parallel by different consumers on different partitions. You get both ordering (within a key) and parallelism (across keys). The number of partitions limits the max parallelism - you cannot have more active consumers than partitions.',
        difficulty: 'hard',
      },
      {
        question: 'What is the competing consumers pattern and how does it achieve fault tolerance?',
        answer: 'Multiple consumers read from the same queue, each processing a different message simultaneously. When a consumer claims a message, it is locked (hidden from others) for the visibility timeout duration. If the consumer processes successfully, it acks and the message is deleted. If the consumer crashes before acking, the visibility timeout expires and the message becomes visible again - another consumer picks it up. This achieves: load distribution (work spread across all available consumers), horizontal scaling (add more consumers to increase throughput), and fault tolerance (crashed consumers\' messages are automatically picked up by healthy ones). The key requirement: consumers must be stateless (any consumer can process any message).',
        difficulty: 'medium',
      },
      {
        question: 'When would you choose Kafka over RabbitMQ over SQS?',
        answer: 'Kafka: when you need event streaming with high throughput (millions/second), multiple independent consumer groups reading the same events, the ability to replay historical events, or building an event-sourced system. Kafka stores events durably for days/weeks. RabbitMQ: when you need flexible routing (topic exchanges, headers-based routing), very low latency, complex routing topologies, or RPC-style request-reply patterns. Messages are gone after consumption - no replay. SQS: when you are on AWS and want zero operational overhead, unlimited automatic scaling, tight AWS service integration (Lambda, ECS, SNS), and simple decoupling. Higher per-message latency than self-hosted. For fan-out on SQS, combine with SNS (SNS publishes to multiple SQS queues).',
        difficulty: 'medium',
      },
      {
        question: 'How would you design a system to process 1 million image uploads per hour reliably?',
        answer: 'Use a queue-based pipeline. When a user uploads, the API immediately stores the raw image to S3, publishes an "image.uploaded" message to a queue with the S3 key, and returns 202 Accepted. A consumer group of image processing workers reads from the queue. Each worker downloads the image from S3, resizes to multiple dimensions, stores outputs, and acks. Size the consumer group to handle 1M/hour = ~278/second. Start with 30 workers (each handling ~10/second with processing time). Set up auto-scaling based on queue depth. Configure a DLQ for corrupt images that cannot be processed. Use at-least-once delivery - resizing the same image twice is idempotent (same output overwrites). Monitor queue depth and consumer lag continuously.',
        difficulty: 'hard',
      },
      {
        question: 'What is backpressure in message queues and how do you handle it?',
        answer: 'Backpressure occurs when producers publish faster than consumers can process, causing the queue to grow indefinitely. Detection: monitor queue depth and consumer lag - sustained growth indicates backpressure. Handling strategies: (1) Scale up consumers - add more consumer instances to increase processing rate. (2) Rate limit producers - slow down publishing when queue depth exceeds a threshold. (3) Producer backpressure - producers receive a signal to slow down or pause. (4) Kafka naturally handles this via the pull model - consumers pull at their own rate without being overwhelmed. (5) Pre-scale for known events - scale consumer groups before a planned flash sale. The key is to detect backpressure early (queue depth alerts at 50K messages, not 5M) and respond before the backlog becomes operationally unmanageable.',
        difficulty: 'medium',
      },
    ],
  },

  // 13. Quiz
  {
    order: 13, type: 'quiz', title: 'Message Queues Quiz',
    quizConfig: {
      timeLimitSeconds: 600, maxAttempts: 3, passingPercent: 70,
      questions: [
        {
          question: 'Service A calls Service B directly. Service B is down for 2 minutes. What happens to Service A\'s requests during those 2 minutes?',
          options: ['They queue up automatically and retry', 'They all fail immediately with connection errors', 'Service A pauses and waits for B to recover', 'Requests are cached and sent when B returns'],
          correctIndex: 1, scenario: true,
          explanation: 'With direct synchronous calls, all requests to Service A fail immediately during Service B\'s outage. There is no queue, no buffer, no automatic retry. This is the core problem message queues solve - with a queue between them, Service A continues accepting requests that queue up and are processed when Service B recovers.',
        },
        {
          question: 'You need to send a welcome email after user signup. The email service is sometimes slow (3-5 seconds). What is the best approach?',
          options: ['Call the email service synchronously during signup - block until sent', 'Put an email job in a message queue and return immediately', 'Skip the email if the service takes more than 1 second', 'Cache the signup and retry in a loop until email sends'],
          correctIndex: 1, scenario: true,
          explanation: 'Message queue. The signup API puts a "send welcome email" message in the queue and returns immediately (milliseconds). A background email worker picks it up and sends asynchronously. The user\'s signup is never delayed by email sending speed. If the email service is down, messages queue safely and are sent when it recovers.',
        },
        {
          question: 'A consumer crashes after processing a payment but before sending an acknowledgement. With at-least-once delivery, what happens?',
          options: ['The message is permanently lost', 'The broker re-delivers the message to another consumer', 'The payment is automatically reversed', 'The broker waits forever for the ack'],
          correctIndex: 1, scenario: true,
          explanation: 'Re-delivery. At-least-once delivery: if no ack is received within the visibility timeout, the broker assumes the consumer crashed and re-delivers the message. This is why consumers must be idempotent - the payment consumer must check if this message ID was already processed before charging again to prevent double charges.',
        },
        {
          question: 'What is the difference between a queue (point-to-point) and a topic (pub/sub)?',
          options: ['Queues are faster than topics', 'Queue: one consumer per message. Topic: all subscribers get a copy of each message', 'Topics are persistent, queues are not', 'Queues support ordering, topics do not'],
          correctIndex: 1, scenario: false,
          explanation: 'Queue (P2P): one producer sends a message, exactly one consumer receives it. Once consumed, gone. Used for work distribution. Topic (Pub/Sub): one producer publishes to a topic, every subscriber gets their own copy. Used for event fan-out. Example: "order.placed" event fans out to email service, inventory service, and analytics service - all three get a copy.',
        },
        {
          question: 'A malformed JSON message causes every consumer to crash. Without a DLQ, what happens?',
          options: ['The message is silently discarded after one failed attempt', 'The message is retried forever, potentially blocking other messages', 'The broker automatically fixes the malformed message', 'The producer is notified and must resend'],
          correctIndex: 1, scenario: true,
          explanation: 'Infinite retry loop. Without a DLQ, a poison message is retried forever. Every consumer that picks it up crashes, the lock expires, and another consumer picks it up. Other valid messages behind it may be blocked or the consumer group becomes unstable. DLQ solution: after 3-5 failed attempts, move the message to a dead letter queue for investigation and let the main queue continue.',
        },
        {
          question: 'You need messages for the same user to always be processed in order, but messages for different users can be parallel. Which Kafka feature achieves this?',
          options: ['FIFO queues with a single consumer', 'Partition keys - same user_id always routes to the same partition', 'Message priority settings', 'Separate queues per user'],
          correctIndex: 1, scenario: false,
          explanation: 'Partition keys. hash(user_id) % num_partitions routes all messages for the same user to the same partition. Each partition has one consumer - guaranteeing order for that user. Different users route to different partitions and are processed in parallel by different consumers. This is Kafka\'s core mechanism for ordered parallel processing.',
        },
        {
          question: 'Producers publish 10,000 messages/sec but consumers process only 2,000/sec. What is happening and what should you do?',
          options: ['This is normal behavior - queues are designed for this', 'Queue backlog is growing 8,000/sec - scale up consumers or rate limit producers', 'Reduce the message size to increase processing speed', 'Switch to a faster message broker'],
          correctIndex: 1, scenario: true,
          explanation: 'Queue backlog growing unboundedly at 8,000 messages per second. Left unchecked, this fills disk, delays processing by hours, and eventually crashes the broker. Actions: scale up consumers to close the gap, implement backpressure on producers when queue depth exceeds a threshold, or pre-scale consumers before known high-traffic events.',
        },
        {
          question: 'Which broker would you choose for a use case requiring multiple teams to independently replay and reprocess historical events?',
          options: ['Amazon SQS - simplest managed option', 'RabbitMQ - low latency routing', 'Apache Kafka - durable log with configurable retention and consumer group offsets', 'Redis Pub/Sub - in-memory speed'],
          correctIndex: 2, scenario: true,
          explanation: 'Kafka. It stores events durably on disk for configurable retention (days to weeks). Multiple consumer groups each track their own read position (offset) independently. A team can reset their consumer group offset to yesterday and replay all events without affecting other consumers reading in real time. RabbitMQ and SQS delete messages after consumption - replay is not possible.',
        },
        {
          question: 'What makes a consumer "idempotent" and why is it required with at-least-once delivery?',
          options: ['It processes messages faster than other consumers', 'Processing the same message twice produces the same result as processing it once', 'It only processes each message type once per session', 'It acknowledges messages before processing them'],
          correctIndex: 1, scenario: false,
          explanation: 'Idempotent means the same operation applied multiple times has the same effect as applying it once. With at-least-once delivery, the same message may be delivered more than once (on consumer crash/retry). If processing is not idempotent, this causes double charges, duplicate emails, or incorrect counts. Fix: check if this message ID was already processed before acting - if yes, skip it.',
        },
        {
          question: 'An "order.placed" event needs to trigger: send confirmation email, reserve inventory, and update analytics. What messaging pattern handles this best?',
          options: ['Point-to-point queue - one consumer handles all three', 'Publish-Subscribe - all three services subscribe independently', 'Direct API calls to all three services in sequence', 'A single monolithic service handles all three'],
          correctIndex: 1, scenario: true,
          explanation: 'Publish-Subscribe (Pub/Sub). Publish one "order.placed" event to a topic. Email service, inventory service, and analytics service each subscribe independently and receive their own copy. All three react in parallel. Adding a fourth reaction (e.g., loyalty points) requires no change to the order service. If one subscriber is slow, it does not affect the others.',
        },
      ],
    },
  },
];

module.exports = MESSAGE_QUEUES_MODULES;
