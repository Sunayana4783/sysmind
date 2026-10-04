// Static caching content — 13 modules total
// Orders 1-10: individual content sub-topics (old RAG topics, now static)
// Order 11: Failure Cases
// Order 12: Interview Discussion Questions
// Order 13: Quiz

const CACHING_MODULES = [

  // ── 1. Cache Basics ────────────────────────────────────────────────────────
  {
    order: 1, type: 'content', title: 'Cache Basics',
    content: {
      overview: 'A cache is a high-speed storage layer between your application and its data source. Instead of hitting a slow database or API on every request, the app checks the cache first.\n\nCaches exploit the principle of temporal locality — data accessed once is very likely to be accessed again soon.',
      sections: [
        { heading: 'What is a Cache?', icon: '⚡', body: 'A cache stores copies of frequently requested data in fast-access memory. On a cache hit the data is returned immediately (sub-millisecond). On a cache miss the original source is queried and the result is stored for next time.', code: null },
        { heading: 'Cache Hit vs Miss', icon: '🎯', body: 'Hit rate = hits / (hits + misses). A healthy production system targets >90% hit rate. A miss is expensive — it means a full round-trip to the database. Monitor hit rate as a key performance indicator.', code: null },
        { heading: 'Why Caching Matters', icon: '📈', body: 'A typical PostgreSQL query takes 5–50ms. A Redis cache read takes 0.1–0.5ms. At 10,000 requests/second, caching can reduce database load by 90% and response times by 100x.', code: null },
      ],
      keyPoints: [
        'Cache hit rate above 90% is a healthy target',
        'Cache misses are expensive — warm up caches on startup for critical data',
        'Always measure before and after caching — not all data benefits equally',
        'Caching trades memory for speed',
        'Caches are not a replacement for database optimisation',
      ],
      animationSteps: [
        { label: 'Request', description: 'User requests data from application', highlight: false },
        { label: 'Check cache', description: 'App checks Redis/Memcached first', highlight: true },
        { label: 'Cache hit', description: 'Found — return immediately in <1ms', highlight: true },
        { label: 'Cache miss', description: 'Not found — query the database', highlight: false },
        { label: 'Store & return', description: 'Save result in cache, return to user', highlight: false },
      ],
      example: 'Twitter serves home timelines from Redis. A DB query to build a timeline takes 200ms. Redis returns it in <1ms. At 400M daily users this saves billions of DB queries every day.',
    },
  },

  // ── 2. Cache Architecture ──────────────────────────────────────────────────
  {
    order: 2, type: 'content', title: 'Cache Architecture',
    content: {
      overview: 'Caches exist at multiple layers of a system. Understanding where to place a cache and what type to use is a fundamental system design skill.\n\nEach layer has different trade-offs in speed, capacity, and consistency.',
      sections: [
        { heading: 'L1/L2/L3 CPU Cache', icon: '🖥️', body: 'Hardware caches built into the CPU. L1 is the fastest (1-4 cycles) and smallest (32KB). L3 is shared across cores and larger (8-32MB). Managed entirely by the CPU — not directly controlled by application code.', code: null },
        { heading: 'In-Process Cache', icon: '🏠', body: 'A HashMap or similar structure inside the application process itself. Zero network overhead — nanosecond reads. Downside: not shared across servers, so each instance has its own copy. Good for static/rarely-changing data.', code: 'const cache = new Map();\ncache.set("config", configData); // in-memory' },
        { heading: 'Distributed Cache', icon: '🌐', body: 'A shared cache server (Redis, Memcached) accessible by all application instances. Consistent view across horizontally-scaled servers. Sub-millisecond reads over local network. This is the most common production caching layer.', code: null },
        { heading: 'CDN Cache', icon: '🛰️', body: 'Content Delivery Networks cache static assets (images, JS, CSS) at edge nodes close to users. Reduces round-trip latency from hundreds of ms to single-digit ms for static content.', code: null },
      ],
      keyPoints: [
        'Use in-process cache for rarely-changing shared data (config, feature flags)',
        'Use distributed cache (Redis) for user sessions, hot data, computed results',
        'Use CDN for all static assets and public API responses',
        'Layered caching (L1 in-process → L2 Redis → L3 DB) maximises hit rates',
        'Each cache layer adds complexity — only add what is needed',
      ],
      animationSteps: [
        { label: 'Request', description: 'User request arrives at app server', highlight: false },
        { label: 'L1: In-process', description: 'Check local HashMap first (nanoseconds)', highlight: true },
        { label: 'L2: Redis', description: 'Check distributed cache (sub-millisecond)', highlight: true },
        { label: 'L3: Database', description: 'Last resort — fetch from DB (milliseconds)', highlight: false },
        { label: 'Populate', description: 'Store result in Redis and local cache', highlight: false },
      ],
      example: 'Facebook uses a three-tier cache: local Memcached per web server → regional Memcached cluster → MySQL databases. The local tier handles 90% of reads, the regional tier handles 9%, and MySQL handles only 1%.',
    },
  },

  // ── 3. Cache-Aside ─────────────────────────────────────────────────────────
  {
    order: 3, type: 'content', title: 'Cache-Aside Pattern',
    content: {
      overview: 'Cache-Aside (also called Lazy Loading) is the most widely used caching pattern. The application code manages cache interactions manually — the cache is "aside" from the main data flow.\n\nThis pattern gives you full control over what gets cached and when.',
      sections: [
        { heading: 'Read Path', icon: '📖', body: 'On every read: (1) check cache for the key. (2) If hit — return cached value. (3) If miss — read from database, store in cache with a TTL, return value. The first request always goes to the DB; subsequent requests are served from cache.', code: 'async function getUser(id) {\n  let user = await cache.get(`user:${id}`);\n  if (!user) {\n    user = await db.findById(id);\n    await cache.set(`user:${id}`, user, 300);\n  }\n  return user;\n}' },
        { heading: 'Write Path', icon: '✍️', body: 'On every write: (1) write to the database first. (2) Invalidate (delete) the cache entry. The next read will repopulate the cache with fresh data. Never update the cache directly on write — this risks race conditions.', code: 'async function updateUser(id, data) {\n  await db.update(id, data);       // write DB first\n  await cache.del(`user:${id}`);   // invalidate cache\n}' },
        { heading: 'Pros and Cons', icon: '⚖️', body: 'Pros: Only requested data is cached (no wasted memory). Cache failures are isolated — app still works (just slower). Full developer control. Cons: First request always misses. Potential for stale data between DB write and cache invalidation.', code: null },
      ],
      keyPoints: [
        'Always write to DB first, then invalidate cache — never the reverse',
        'Set a TTL as a safety net even when using explicit invalidation',
        'Cache-Aside is resilient — if Redis goes down the app still reads from DB',
        'Use consistent key naming: resource:id (e.g. user:123, product:456)',
        'Pre-warm the cache on application startup for critical hot data',
      ],
      animationSteps: [
        { label: 'Read request', description: 'App needs user data for id=123', highlight: false },
        { label: 'Cache check', description: 'Look up user:123 in Redis', highlight: true },
        { label: 'Miss → DB', description: 'Not in cache — query database', highlight: false },
        { label: 'Cache set', description: 'Store user:123 in Redis with TTL=300s', highlight: true },
        { label: 'Return data', description: 'Subsequent reads served from cache', highlight: false },
      ],
      example: 'GitHub uses cache-aside extensively. When you visit a repository page, GitHub checks Memcached for the repo metadata. On miss it queries MySQL and caches the result for 60 seconds. Write events (new commit, new star) invalidate the relevant cache keys.',
    },
  },

  // ── 4. Read/Write Strategies ───────────────────────────────────────────────
  {
    order: 4, type: 'content', title: 'Read/Write Strategies',
    content: {
      overview: 'Beyond Cache-Aside, there are several other caching strategies that handle reads and writes differently. Each has different trade-offs in consistency, performance, and complexity.\n\nChoosing the right strategy depends on your tolerance for stale data and write performance requirements.',
      sections: [
        { heading: 'Write-Through', icon: '➡️', body: 'Every write updates BOTH cache and database synchronously before responding to the user. Cache is always consistent with the DB. No stale reads. Downside: writes are slower (two writes per operation). Best for data that is read frequently after being written.', code: 'async function setUser(id, data) {\n  await cache.set(`user:${id}`, data);\n  await db.update(id, data); // both updated\n}' },
        { heading: 'Write-Back (Write-Behind)', icon: '⏩', body: 'Writes go to cache immediately and return success to the user. DB is updated asynchronously in the background. Much faster writes. Risk: if cache crashes before flush, data is lost. Best for high-write workloads where some loss is acceptable (e.g. analytics, counters).', code: null },
        { heading: 'Read-Through', icon: '🔁', body: 'Cache sits in front of the database and automatically fetches missing data. Application always reads from cache — cache handles DB lookups transparently. Simpler code but less flexible than cache-aside. Cache library (e.g. Spring Cache) handles this automatically.', code: null },
        { heading: 'Refresh-Ahead', icon: '🔄', body: 'Cache proactively refreshes entries before they expire. Predicts which entries will be needed and pre-fetches them. Reduces cache miss rate at the cost of potentially fetching data that is never used.', code: null },
      ],
      keyPoints: [
        'Write-through: strong consistency, slower writes — use for financial/critical data',
        'Write-back: fast writes, risk of data loss — use for counters/analytics',
        'Read-through: simplest code, auto-population — use with caching frameworks',
        'Cache-aside is the most flexible and most commonly used in microservices',
        'Mixing strategies per data type is fine — use the right tool for each case',
      ],
      animationSteps: [
        { label: 'Write-through', description: 'Write hits cache AND DB simultaneously', highlight: true },
        { label: 'Both updated', description: 'Cache and DB always in sync', highlight: true },
        { label: 'Write-back', description: 'Write hits cache only, returns immediately', highlight: false },
        { label: 'Async flush', description: 'DB updated in background later', highlight: false },
        { label: 'Trade-off', description: 'Speed vs consistency — choose per use case', highlight: false },
      ],
      example: 'Amazon DynamoDB Accelerator (DAX) uses read-through caching. Application code reads from DAX exactly like reading from DynamoDB — DAX transparently fetches from DynamoDB on misses and caches the result. Zero code changes needed.',
    },
  },

  // ── 5. Eviction (LRU/LFU/TTL) ─────────────────────────────────────────────
  {
    order: 5, type: 'content', title: 'Eviction (LRU/LFU/TTL)',
    content: {
      overview: 'Caches have finite memory. When full, they must evict (remove) old entries. The eviction policy determines which entries are removed.\n\nTTL (Time To Live) is separate — it sets a maximum lifetime on each entry regardless of memory pressure.',
      sections: [
        { heading: 'LRU — Least Recently Used', icon: '🕐', body: 'Evicts the entry that was accessed least recently. Assumes recently accessed data will be accessed again soon. Best for most web workloads. Implemented with a doubly-linked list + hash map. Redis supports allkeys-lru and volatile-lru policies.', code: null },
        { heading: 'LFU — Least Frequently Used', icon: '📊', body: 'Evicts the entry with the fewest total accesses. Better than LRU when some data is always hot (e.g. top 100 products on an e-commerce site). Requires extra memory to maintain frequency counters.', code: null },
        { heading: 'TTL — Time To Live', icon: '⏱️', body: 'Every entry gets a TTL. After expiry the entry is deleted regardless of access patterns or memory pressure. Essential for preventing stale data. Set TTL based on how often the source data changes.', code: 'cache.set("product:1", data, { ttl: 3600 }); // 1 hour TTL\ncache.set("session:abc", sess, { ttl: 86400 }); // 24 hour TTL' },
        { heading: 'Choosing the Right Policy', icon: '⚙️', body: 'Use LRU for general purpose. Use LFU when access patterns are skewed (Zipf distribution — a few items get most traffic). Use short TTL for volatile data. Use long TTL + explicit invalidation for stable data.', code: null },
      ],
      keyPoints: [
        'LRU is the default — works well for most web application workloads',
        'LFU outperforms LRU when traffic is skewed toward a small set of hot keys',
        'Always set TTL — infinite TTL causes memory leaks and stale data',
        'Redis maxmemory-policy controls eviction: allkeys-lru, volatile-lru, allkeys-lfu',
        'Monitor eviction rate — high eviction means cache is undersized',
      ],
      animationSteps: [
        { label: 'Cache full', description: 'maxmemory limit reached', highlight: true },
        { label: 'LRU scan', description: 'Find least recently accessed entry', highlight: true },
        { label: 'Evict entry', description: 'Remove the oldest unused entry', highlight: false },
        { label: 'Insert new', description: 'New entry takes freed slot', highlight: false },
        { label: 'TTL expiry', description: 'Separately, expired entries auto-removed', highlight: false },
      ],
      example: 'Netflix caches movie metadata with a 1-hour TTL using LRU eviction. Metadata (title, description, ratings) changes infrequently so 1-hour staleness is acceptable. User watch history uses LRU since recently watched content is most likely to be recommended.',
    },
  },

  // ── 6. Invalidation ────────────────────────────────────────────────────────
  {
    order: 6, type: 'content', title: 'Cache Invalidation',
    content: {
      overview: '"There are only two hard things in Computer Science: cache invalidation and naming things." — Phil Karlton\n\nInvalidation is the process of removing or updating stale cache entries when the source data changes. Getting it wrong causes users to see outdated data.',
      sections: [
        { heading: 'TTL-Based Invalidation', icon: '⏲️', body: 'The simplest approach — let entries expire naturally. Easy to implement. Downside: users may see stale data for up to TTL seconds after an update. Acceptable when some staleness is tolerable (e.g. product catalog, news feeds).', code: null },
        { heading: 'Event-Driven Invalidation', icon: '📡', body: 'When data changes in the DB, immediately delete the cache entry. The next read will repopulate with fresh data. Zero staleness. More complex — requires every write path to also call cache invalidation.', code: 'async function updateProduct(id, price) {\n  await db.update(id, { price });\n  await cache.del(`product:${id}`);\n  await cache.del(`product:list`);\n}' },
        { heading: 'Versioned Keys', icon: '🔢', body: 'Append a version number to cache keys. On update, increment the version. Old keys become orphans and expire via TTL. Allows atomic cache updates without deletion race conditions.', code: 'const key = `user:${id}:v${version}`;\n// on update: increment version in DB\n// old key expires naturally' },
        { heading: 'Pub/Sub Invalidation', icon: '📢', body: 'Use a message queue (Redis Pub/Sub, Kafka) to broadcast invalidation events. When one service updates data, all services subscribed to that data type invalidate their local caches. Essential in microservices architectures.', code: null },
      ],
      keyPoints: [
        'Use TTL as a safety net even when using event-driven invalidation',
        'Always invalidate all related keys — e.g. both user:123 and user:list',
        'Invalidation on write is safer than update-in-place to avoid race conditions',
        'In microservices: establish clear ownership of cache invalidation per service',
        'Log cache invalidation events for debugging stale data issues',
      ],
      animationSteps: [
        { label: 'DB updated', description: 'Product price changed in database', highlight: false },
        { label: 'Event fired', description: 'Update event triggers invalidation', highlight: true },
        { label: 'Cache cleared', description: 'product:456 deleted from Redis', highlight: true },
        { label: 'Next read', description: 'Cache miss — fetches fresh price from DB', highlight: false },
        { label: 'Re-cached', description: 'New price stored in cache for future reads', highlight: false },
      ],
      example: 'Shopify uses event-driven invalidation for product pages. When a merchant updates a product price, a background job runs that deletes all related cache keys (product detail, collection page, search results). Customer-facing pages reflect the new price within seconds.',
    },
  },

  // ── 7. Consistency ─────────────────────────────────────────────────────────
  {
    order: 7, type: 'content', title: 'Cache Consistency',
    content: {
      overview: 'Cache consistency describes how closely the cached data matches the source of truth (the database). Perfect consistency is expensive — most systems accept some degree of eventual consistency.\n\nUnderstanding the CAP theorem helps frame consistency trade-offs in distributed caching.',
      sections: [
        { heading: 'Strong Consistency', icon: '💎', body: 'Every read sees the most recent write. Achieved by write-through caching + synchronous invalidation. High consistency cost — every write involves both DB and cache. Required for financial transactions, inventory counts, authentication tokens.', code: null },
        { heading: 'Eventual Consistency', icon: '🔄', body: 'Cache may be stale for a short period (TTL duration) but will eventually converge to the correct value. Acceptable for social media feeds, product descriptions, recommendation engines. Much better performance than strong consistency.', code: null },
        { heading: 'Read-Your-Writes', icon: '👤', body: 'A user always sees their own writes immediately even if other users may see stale data. Achieved by routing a user\'s read requests to the same cache node that received their write, or by using user-specific cache keys.', code: null },
        { heading: 'Split-Brain Problem', icon: '🧠', body: 'When a network partition splits a Redis cluster, some nodes may have different versions of the same key. Redis Cluster handles this with eventual consistency — the most recent write wins after the partition heals.', code: null },
      ],
      keyPoints: [
        'Accept eventual consistency for most read-heavy workloads',
        'Use strong consistency only where correctness is business-critical',
        'Short TTL (30-60s) gives near-real-time consistency with good performance',
        'Monitor cache-to-DB discrepancy in critical paths',
        'Idempotent cache operations prevent consistency bugs under concurrent writes',
      ],
      animationSteps: [
        { label: 'Write to DB', description: 'User updates their profile', highlight: false },
        { label: 'Stale cache', description: 'Old value still in cache for TTL period', highlight: true },
        { label: 'Other users', description: 'May see old profile for up to TTL seconds', highlight: false },
        { label: 'TTL expires', description: 'Cache entry removed after 60 seconds', highlight: false },
        { label: 'Consistent', description: 'Fresh data fetched — all users see latest', highlight: true },
      ],
      example: 'Facebook\'s social graph tolerates eventual consistency. When you unfriend someone, their view may still show you as a friend for up to 60 seconds. The business impact is negligible. This trade-off allows Facebook to scale to billions of relationships.',
    },
  },

  // ── 8. Redis ───────────────────────────────────────────────────────────────
  {
    order: 8, type: 'content', title: 'Redis',
    content: {
      overview: 'Redis (Remote Dictionary Server) is the industry-standard in-memory data structure store. It is used as a cache, session store, message broker, rate limiter, and real-time leaderboard.\n\nRedis stores all data in RAM making reads/writes under 1 millisecond.',
      sections: [
        { heading: 'Core Data Types', icon: '📦', body: 'String: basic key-value. Hash: object with fields (e.g. user profile). List: ordered sequence (e.g. timeline). Set: unique unordered collection. Sorted Set: ranked leaderboard. These types allow Redis to replace multiple specialised databases.', code: 'SET user:123:name "Alice"\nHSET user:123 name Alice age 30\nLPUSH timeline:alice tweet1 tweet2\nZADD leaderboard 1000 alice' },
        { heading: 'Persistence Options', icon: '💾', body: 'RDB (Redis Database): periodic snapshots to disk. AOF (Append Only File): logs every write command — can replay to reconstruct state. Both can be used together for durability. Redis can also run purely in-memory with no persistence.', code: null },
        { heading: 'Redis Commands', icon: '⌨️', body: 'Common operations: SET/GET (string), HSET/HGET (hash), LPUSH/LRANGE (list), SADD/SMEMBERS (set), ZADD/ZRANGE (sorted set), EXPIRE (TTL), TTL (check remaining TTL), DEL (delete), KEYS (find keys by pattern).', code: 'SET session:abc token123 EX 3600  // with TTL\nTTL session:abc                    // check TTL\nEXPIRE user:123 300                // set TTL on existing key\nDEL user:123                       // delete key' },
        { heading: 'Atomic Operations', icon: '⚗️', body: 'Redis is single-threaded so all commands are atomic. INCR/DECR are atomic counters — safe for rate limiting and inventory counts without race conditions. MULTI/EXEC wraps multiple commands in a transaction.', code: 'INCR rate:limit:user123  // atomic counter\nSETNX lock:resource 1    // atomic lock (set if not exists)' },
      ],
      keyPoints: [
        'Redis is single-threaded — all commands are atomic with no locking needed',
        'Use EXPIRE or EX flag on all keys to prevent memory leaks',
        'Redis Sorted Sets are ideal for leaderboards and rate limiting',
        'Monitor memory usage with redis-cli INFO memory',
        'Use Redis connection pooling in production (never create a new connection per request)',
      ],
      animationSteps: [
        { label: 'App request', description: 'Application sends GET user:123', highlight: false },
        { label: 'Redis RAM', description: 'Key found in memory in microseconds', highlight: true },
        { label: 'Return value', description: 'Data returned to app over TCP', highlight: true },
        { label: 'SET with TTL', description: 'Store new data: SET key val EX 300', highlight: false },
        { label: 'Persist', description: 'AOF logs the write for durability', highlight: false },
      ],
      example: 'Instagram uses Redis Sorted Sets for the "Explore" feed ranking. Every content item has a score (engagement rate + recency). ZADD adds items with their scores. ZREVRANGE returns the top-N items instantly. 500M users, sub-millisecond response.',
    },
  },

  // ── 9. Distributed Cache ───────────────────────────────────────────────────
  {
    order: 9, type: 'content', title: 'Distributed Cache',
    content: {
      overview: 'A distributed cache spans multiple nodes to provide more memory capacity and higher availability than a single server can offer.\n\nThe key challenge is distributing data across nodes while minimising reshuffling when nodes are added or removed.',
      sections: [
        { heading: 'Redis Cluster', icon: '🌐', body: 'Redis Cluster shards data across up to 1000 nodes. Uses 16384 hash slots. Each key is assigned to a slot using CRC16(key) % 16384. Each node owns a range of slots. Clients use smart clients that know the slot-to-node mapping.', code: null },
        { heading: 'Consistent Hashing', icon: '🔵', body: 'Maps both keys and nodes to positions on a virtual ring. Each key is assigned to the nearest node clockwise. Adding/removing a node only remaps ~1/N keys. Essential for scaling without cache invalidation storms.', code: null },
        { heading: 'Replication', icon: '📋', body: 'Each primary node has one or more replica nodes. Replicas receive async copies of all writes. On primary failure, Redis Sentinel or Cluster promotes a replica to primary automatically (failover in 10-30 seconds).', code: null },
        { heading: 'Hot Key Problem', icon: '🔥', body: 'When one key receives disproportionate traffic (e.g. trending topic), the node holding it becomes a bottleneck. Solutions: local in-process L1 cache, read replicas for the hot key, key sharding (key:1, key:2, key:3 — pick randomly on read).', code: 'const shard = Math.floor(Math.random() * 3) + 1;\nconst key = `trending:${hashtag}:${shard}`;\nconst val = await redis.get(key);' },
      ],
      keyPoints: [
        'Redis Cluster provides automatic sharding across up to 1000 nodes',
        'Consistent hashing minimises key movement when adding/removing nodes',
        'Always configure at least one replica per primary for high availability',
        'Hot keys require special handling — local cache or key sharding',
        'Monitor slot distribution to ensure even load across cluster nodes',
      ],
      animationSteps: [
        { label: 'Key arrives', description: 'Request for key "product:456"', highlight: false },
        { label: 'Hash slot', description: 'CRC16("product:456") % 16384 = slot 7638', highlight: true },
        { label: 'Route to node', description: 'Slot 7638 → Node 2 (slots 5461-10922)', highlight: true },
        { label: 'Node responds', description: 'Node 2 returns cached data', highlight: false },
        { label: 'Node fails', description: 'Replica promoted, slot ownership transferred', highlight: false },
      ],
      example: 'Uber\'s cache cluster processes over 1 million cache operations per second. They use consistent hashing to distribute ride data across hundreds of Redis nodes. Adding new nodes during peak periods only moves ~5% of keys thanks to consistent hashing.',
    },
  },

  // ── 10. Cache Stampede / Penetration / Avalanche ───────────────────────────
  {
    order: 10, type: 'content', title: 'Cache Stampede / Penetration / Avalanche',
    content: {
      overview: 'Three classic cache failure modes that every system designer must know. Each describes a different way the cache can be bypassed or overwhelmed, sending unexpected load to the database.\n\nUnderstanding these patterns — and their solutions — is essential for senior engineering interviews.',
      sections: [
        { heading: 'Cache Stampede', icon: '🐂', body: 'A popular key expires. Thousands of concurrent requests all get a cache miss simultaneously and all query the DB at the same time. Solution: mutex lock (one request rebuilds, others wait), or probabilistic early expiration (refresh before TTL expires with some probability).', code: 'async function getWithLock(key) {\n  let val = await cache.get(key);\n  if (!val) {\n    const lock = await cache.set(`lock:${key}`, 1, { NX: true, EX: 5 });\n    if (lock) {\n      val = await db.query(key);\n      await cache.set(key, val, 300);\n    } else {\n      await sleep(50); // wait for lock holder\n      val = await cache.get(key);\n    }\n  }\n  return val;\n}' },
        { heading: 'Cache Penetration', icon: '🕳️', body: 'Requests for keys that DO NOT exist in DB OR cache. Every request bypasses the cache and hits the DB. Common attack vector. Solution: cache null results with a short TTL (30s), or use a Bloom filter to reject provably non-existent keys before cache lookup.', code: null },
        { heading: 'Cache Avalanche', icon: '🏔️', body: 'A large number of keys all expire at the same time (all set with same TTL at startup). The DB is hit with a massive spike. Solution: add random jitter to TTL values so expiry is spread across a time window.', code: 'const TTL = 300 + Math.floor(Math.random() * 60); // 300-360s\nawait cache.set(key, val, TTL); // different TTL each time' },
      ],
      keyPoints: [
        'Stampede: use mutex lock or probabilistic early expiration',
        'Penetration: cache null results or use Bloom filters',
        'Avalanche: add random TTL jitter at cache population time',
        'All three problems share a root cause: uncoordinated cache misses',
        'Monitor DB query rate — sudden spikes indicate one of these three patterns',
      ],
      animationSteps: [
        { label: 'Key expires', description: 'Popular key TTL reaches zero', highlight: true },
        { label: 'Mass miss', description: 'Thousands of requests get cache miss', highlight: true },
        { label: 'DB overload', description: 'All requests query DB simultaneously', highlight: true },
        { label: 'Fix: lock', description: 'First request acquires mutex lock', highlight: false },
        { label: 'Others wait', description: 'Remaining requests wait, then hit cache', highlight: false },
      ],
      example: 'During a major live event, a streaming platform experienced a stampede when the homepage banner image cache expired. 50,000 concurrent users all fetched it from the DB simultaneously. They now use jitter + mutex locking for all high-traffic keys.',
    },
  },

  // ── 11. Failure Cases ──────────────────────────────────────────────────────
  {
    order: 11, type: 'failureCases', title: 'Caching Failure Cases',
    failureCases: [
      {
        title: 'Cache Stampede',
        icon: '🐂',
        scenario: 'A popular cache key expires. 10,000 concurrent requests all get a cache miss simultaneously and all query the database at the same time.',
        impact: 'Database CPU spikes to 100%. Response times jump from 1ms to 10 seconds. Database may crash under the sudden load.',
        resolution: 'Mutex locking — only one request rebuilds the cache, others wait for the lock. Use probabilistic early expiration (refresh before TTL expires). Use stale-while-revalidate to serve stale data while refreshing in the background.',
        animationSteps: [
          { label: 'Key expires', description: 'Popular cache key TTL reaches zero', highlight: true },
          { label: 'Mass miss', description: '10,000 requests all hit cache miss', highlight: true },
          { label: 'DB overload', description: 'All requests query database simultaneously', highlight: true },
          { label: 'DB crashes', description: 'Database overwhelmed, service down', highlight: false },
          { label: 'Fix: mutex', description: 'One request rebuilds, others wait on lock', highlight: false },
        ],
      },
      {
        title: 'Cache Penetration',
        icon: '🕳️',
        scenario: 'An attacker sends millions of requests for non-existent keys (user IDs that have never existed). Every request bypasses the cache and hits the database.',
        impact: 'Database flooded with queries returning empty results. Can be used as a targeted denial-of-service attack against the database layer.',
        resolution: 'Cache null results with a short TTL (30 seconds). Use Bloom filters to quickly reject non-existent keys before cache lookup. Implement rate limiting per IP address.',
        animationSteps: [
          { label: 'Invalid key', description: 'Request for user:99999999 (does not exist)', highlight: false },
          { label: 'Cache miss', description: 'Key not in cache — expected for new key', highlight: false },
          { label: 'DB miss', description: 'Key not in database either', highlight: true },
          { label: 'Repeat ×M', description: 'Millions of such requests flood DB', highlight: true },
          { label: 'Fix: Bloom', description: 'Bloom filter rejects invalid keys instantly', highlight: false },
        ],
      },
      {
        title: 'Cache Avalanche',
        icon: '🏔️',
        scenario: 'Application starts up and pre-loads 100,000 cache keys all with the same TTL of 300 seconds. At the 5-minute mark, all keys expire simultaneously.',
        impact: 'Database hit with massive simultaneous query spike every 5 minutes like clockwork. Service degradation at regular intervals.',
        resolution: 'Add random jitter to TTL: TTL = base + random(0, 60). Stagger cache warming on startup. Use different TTLs per data category.',
        animationSteps: [
          { label: 'App starts', description: 'All 100K keys cached at startup', highlight: false },
          { label: 'Same TTL=300', description: 'All keys expire at exactly t=300s', highlight: false },
          { label: 'Mass expiry', description: 'All 100K keys expire simultaneously', highlight: true },
          { label: 'DB spike', description: 'Database receives 100K concurrent queries', highlight: true },
          { label: 'Fix: jitter', description: 'TTL = 300+rand(0,60) spreads expiry', highlight: false },
        ],
      },
      {
        title: 'Stale Data',
        icon: '🗓️',
        scenario: 'A user updates their profile picture. The database is updated correctly but the cache still holds the old photo URL. Other users see the old picture for the duration of the TTL.',
        impact: 'Data inconsistency between cache and database. Users see incorrect information. Can cause financial errors if product prices are affected.',
        resolution: 'Invalidate cache on every write (cache-aside pattern). Use write-through for critical data. Set appropriate TTL based on data volatility. Use event-driven invalidation for microservices.',
        animationSteps: [
          { label: 'DB updated', description: 'User changes profile picture in DB', highlight: false },
          { label: 'Cache stale', description: 'Old photo URL still in cache', highlight: true },
          { label: 'Wrong data', description: 'Other users see old photo', highlight: true },
          { label: 'Invalidate', description: 'On write: cache.del("user:123")', highlight: false },
          { label: 'Fresh fetch', description: 'Next read repopulates cache from DB', highlight: false },
        ],
      },
      {
        title: 'Redis Node Failure',
        icon: '💥',
        scenario: 'A Redis primary node crashes unexpectedly. All cache reads and writes to that node fail. Traffic that was being served from cache now hits the database.',
        impact: 'Cache miss rate spikes to 100% for affected keys. Database absorbs full production traffic. Elevated latency for 10-30 seconds during automatic failover.',
        resolution: 'Configure Redis Sentinel or Redis Cluster for automatic failover. Use a circuit breaker to fall back to DB gracefully. Always have at least one replica per primary.',
        animationSteps: [
          { label: 'Primary fails', description: 'Redis primary node goes offline', highlight: true },
          { label: 'Sentinel detects', description: 'Redis Sentinel detects failure (~5s)', highlight: false },
          { label: 'Replica elected', description: 'Replica node promoted to primary', highlight: false },
          { label: 'DNS updated', description: 'App client reconnects to new primary', highlight: false },
          { label: 'Restored', description: 'Cache serving traffic normally again', highlight: false },
        ],
      },
    ],
  },

  // ── 12. Interview Questions ────────────────────────────────────────────────
  {
    order: 12, type: 'interview', title: 'Interview Discussion Questions',
    interviewQuestions: [
      {
        question: 'Your e-commerce site is experiencing database overload during flash sales. Every product page hits the DB. How do you fix this?',
        answer: 'Implement cache-aside with Redis. Cache product details with a TTL of 5 minutes. For flash sale prices use a shorter TTL of 30 seconds or event-driven invalidation when price changes. Pre-warm the cache before the sale starts by running a background job that loads all sale products.',
        icon: '🛒', difficulty: 'medium',
      },
      {
        question: 'A senior engineer says "the hardest problem in computer science is cache invalidation." Why?',
        answer: 'Because there is no perfect strategy. TTL risks stale data. Event-driven invalidation adds coupling and complexity. In practice: use TTL for acceptable staleness, event-driven for critical data, versioned keys for atomic updates. Accept eventual consistency where appropriate.',
        icon: '🧠', difficulty: 'hard',
      },
      {
        question: 'You deploy Redis and your hit rate is only 40%. What steps do you take to investigate and improve it?',
        answer: 'Check Redis keyspace notifications to identify which keys are missing most. Audit TTL values — too-short TTL causes frequent misses. Check if cache is warmed on startup. Profile access patterns and ensure the right data is being cached. 40% hit rate suggests wrong data is cached or TTLs are too aggressive.',
        icon: '📊', difficulty: 'medium',
      },
      {
        question: 'How does Twitter serve the home timeline so quickly when each user follows thousands of people?',
        answer: 'Fan-out-on-write. When a user posts a tweet, it is pushed into every follower\'s Redis timeline cache. On read, one Redis list operation returns the timeline instantly. Celebrity accounts with 100M followers use fan-out-on-read to avoid writing to 100M caches per tweet.',
        icon: '🐦', difficulty: 'hard',
      },
      {
        question: 'When would you choose Memcached over Redis?',
        answer: 'Memcached is better for pure key-value caching requiring maximum throughput and multi-threaded performance, when you do not need persistence or complex data types. Redis is better for almost all other cases — persistence, pub/sub, sorted sets, Lua scripting, and cluster mode make it far more versatile.',
        icon: '⚡', difficulty: 'easy',
      },
      {
        question: 'One Redis key receives 800K of your 1M req/sec. The node is bottlenecking. What do you do?',
        answer: 'Hot key problem. Add a local in-process L1 cache on each app server for that specific key — most requests never reach Redis. Alternatively, use key sharding (key:1, key:2, key:3) and read randomly from shards. Or use read replicas specifically for that key.',
        icon: '🔥', difficulty: 'hard',
      },
      {
        question: 'Explain write-through vs write-back caching and when you would use each.',
        answer: 'Write-through: writes to both cache and DB synchronously — strong consistency but slower writes. Use for financial/critical data. Write-back: writes to cache only and flushes to DB asynchronously — faster writes but risk of data loss on crash. Use for high-write analytics or counters.',
        icon: '✍️', difficulty: 'medium',
      },
      {
        question: 'How do you handle caching in microservices where multiple services cache the same user data?',
        answer: 'Use a shared Redis cluster accessible to all services. Establish clear ownership — the User Service owns all user cache invalidation. Other services subscribe to user update events via message queue and invalidate their local caches. Never have two services independently caching the same key with different TTLs.',
        icon: '🔲', difficulty: 'hard',
      },
    ],
  },

  // ── 13. Quiz ───────────────────────────────────────────────────────────────
  {
    order: 13, type: 'quiz', title: 'Caching Quiz',
    quizConfig: {
      timeLimitSeconds: 600, maxAttempts: 3, passingPercent: 70,
      questions: [
        {
          question: 'Your database gets the same product catalog query thousands of times per second. The catalog changes once per hour. Best solution?',
          options: ['Add more database replicas','Cache in Redis with a 1-hour TTL','Optimise the database query','Use a CDN for API responses'],
          correctIndex: 1, scenario: true,
          explanation: 'Redis with 1-hour TTL matches data volatility perfectly. TTL ensures freshness. Adding replicas reduces per-replica load but does not eliminate the redundant queries.',
        },
        {
          question: 'At 3 AM: DB CPU 100%, response time 2ms → 8s. A popular cache key expired 5 minutes ago. What happened?',
          options: ['Cache penetration attack','Cache avalanche','Cache stampede','Redis node failure'],
          correctIndex: 2, scenario: true,
          explanation: 'Cache stampede — one key expired causing thousands of concurrent misses that all queried the DB simultaneously. The timing correlation (key expiry → immediate DB spike) is the key indicator.',
        },
        {
          question: 'An attacker sends millions of requests for non-existent user IDs. Your DB is under heavy load. This is:',
          options: ['Cache stampede','Cache avalanche','Cache penetration','Hot key problem'],
          correctIndex: 2, scenario: true,
          explanation: 'Cache penetration — non-existent keys bypass the cache on every request. Fix: cache null results with short TTL, or use Bloom filters to reject provably non-existent keys.',
        },
        {
          question: 'You pre-load 50,000 cache keys at midnight with TTL=300s. At 5:05 AM the database crashes. Why?',
          options: ['Cache ran out of memory','A Redis node failed','All keys expired simultaneously causing cache avalanche','Database connection pool exhausted'],
          correctIndex: 2, scenario: true,
          explanation: 'Cache avalanche — all keys set at the same time with the same TTL expire together. Fix: TTL = 300 + random(0, 60) to spread expiry across a time window.',
        },
        {
          question: 'Cache stores product listings where top 10 products get 80% of traffic. Which eviction policy?',
          options: ['LRU (Least Recently Used)','FIFO (First In First Out)','LFU (Least Frequently Used)','Random eviction'],
          correctIndex: 2, scenario: false,
          explanation: 'LFU keeps frequently accessed items in cache. LRU only considers recency — a briefly trending item could evict permanently popular products.',
        },
        {
          question: 'User updates profile picture. 10 minutes later others still see the old photo. DB was correctly updated. Most likely cause?',
          options: ['DB update failed silently','Browser cache outdated','App cache not invalidated after DB write','CDN cached old image'],
          correctIndex: 2, scenario: true,
          explanation: 'Stale cache — the application cache was not invalidated on write. The old photo URL stays in cache until TTL expires. Fix: cache.del("user:123") on every profile update.',
        },
        {
          question: 'One Redis key gets 700K of 1M req/sec. The Redis node is CPU-bottlenecking. Best solution?',
          options: ['Increase Redis memory','Add local in-process L1 cache on each app server','Increase TTL to reduce refresh frequency','Move key to separate Redis cluster'],
          correctIndex: 1, scenario: true,
          explanation: 'Hot key — local L1 cache on each app server means most requests never reach Redis. Served from application memory in nanoseconds. This is the standard hot-key mitigation.',
        },
        {
          question: 'What does write-through guarantee that write-back does NOT?',
          options: ['Faster write performance','Lower database load','No data loss if cache crashes','Higher cache hit rate'],
          correctIndex: 2, scenario: false,
          explanation: 'Write-through writes to both cache and DB synchronously. If cache crashes the DB already has the latest data. Write-back risks losing the in-cache-but-not-yet-flushed data.',
        },
        {
          question: 'Designing Twitter timeline. User follows 500 people. Fastest timeline load approach?',
          options: ['Query DB for all 500 followees in real-time','Fan-out-on-write: push tweets to each follower\'s Redis list on write','Cache the SQL query result with 5-min TTL','Load one followee at a time and merge'],
          correctIndex: 1, scenario: true,
          explanation: 'Fan-out-on-write pre-computes the timeline into Redis. On read it is one O(1) Redis list operation. Fan-out-on-read at 500 followees requires 500 queries and a merge — too slow at scale.',
        },
        {
          question: 'Redis is down. Your application should:',
          options: ['Return error to all users immediately','Fall back to database gracefully using circuit breaker','Queue all requests until Redis recovers','Switch to Memcached automatically'],
          correctIndex: 1, scenario: true,
          explanation: 'Circuit breaker pattern — fall back to the database gracefully. Application degrades (slower) but remains functional. The circuit breaker prevents cascade failures by stopping Redis calls when it is down.',
        },
      ],
    },
  },
];

module.exports = CACHING_MODULES;
