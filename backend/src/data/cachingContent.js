// Static caching content — 13 modules total
// Orders 1-10: content topics (simple language, no code)
// Order 11: Failure Cases
// Order 12: Interview Discussion Questions
// Order 13: Quiz

const CACHING_MODULES = [

  // ── 1. Cache Basics ────────────────────────────────────────────────────────
  {
    order: 1, type: 'content', title: 'Cache Basics',
    content: {
      overview: 'Imagine you need the same book from a library every day. Instead of walking to the library every time, you keep a copy at home. A cache works the same way — it keeps a copy of data close to your application so you can get it quickly without going back to the original source every time.\n\nWithout a cache, every time a user opens a page, the app has to go to the database, fetch the data, and send it back. This takes time. With a cache, the app checks the cache first. If the data is there, it returns instantly.',
      sections: [
        { heading: 'What is a Cache?', icon: '', body: 'A cache is a storage layer that holds copies of data. When your app needs some data, it checks the cache first. If the data is found, that is called a cache hit and it is returned immediately. If not found, that is a cache miss and the app fetches it from the database.', code: null },
        { heading: 'Cache Hit and Cache Miss', icon: '', body: 'A cache hit means the data was found in the cache — very fast, returns in under 1 millisecond. A cache miss means the data was not in the cache — the app has to go to the database which takes much longer. A good system should have more hits than misses.', code: null },
        { heading: 'Why Does It Matter?', icon: '', body: 'A database query can take anywhere from 5 to 50 milliseconds. A cache read takes less than 1 millisecond. When your app handles thousands of requests every second, this difference is huge. Caching can reduce the load on your database by up to 90%.', code: null },
      ],
      keyPoints: [
        'A cache stores copies of data so it can be returned quickly without hitting the database',
        'Cache hit means data was found in cache. Cache miss means it was not',
        'A good system aims for more than 90% cache hits',
        'Caching makes apps faster by reducing how often the database is queried',
        'Not all data needs to be cached — focus on data that is read frequently',
      ],
      animationSteps: [
        { label: 'Request', description: 'User requests data from application', highlight: false },
        { label: 'Check cache', description: 'App checks Redis/Memcached first', highlight: true },
        { label: 'Cache hit', description: 'Found — return immediately in <1ms', highlight: true },
        { label: 'Cache miss', description: 'Not found — query the database', highlight: false },
        { label: 'Store & return', description: 'Save result in cache, return to user', highlight: false },
      ],
      example: 'Twitter keeps your home timeline ready in a cache. When you open the app, your feed loads instantly. Without caching, Twitter would need to scan millions of tweets from all the people you follow every time you open the app — that would take seconds instead of milliseconds.',
    },
  },

  // ── 2. Cache Architecture ──────────────────────────────────────────────────
  {
    order: 2, type: 'content', title: 'Cache Architecture',
    content: {
      overview: 'Caches are not all the same. They exist at different levels of a system, each with different speeds and sizes. Think of it like how you store things at home — some things are on your desk (fastest access), some are in a nearby cupboard, and some are in a storage room far away.\n\nKnowing where to place a cache and which type to use is an important skill when designing large systems.',
      sections: [
        { heading: 'CPU Cache (L1, L2, L3)', icon: '', body: 'These are tiny, extremely fast memory chips built directly into the processor. They are managed by the hardware automatically — you do not write code to control them. They are the fastest storage possible but also the smallest, holding only a few megabytes.', code: null },
        { heading: 'In-Process Cache', icon: '', body: 'This is a cache that lives inside your application itself — stored in the app\'s own memory. It is very fast because there is no network involved. However, if you have multiple servers running, each server has its own separate copy. Good for data that rarely changes, like configuration settings.', code: null },
        { heading: 'Distributed Cache (Redis)', icon: '', body: 'This is a shared cache server that all your application servers can connect to. Redis is the most popular example. All servers see the same data, which makes it consistent. It is slightly slower than in-process cache because it goes over the network, but still very fast.', code: null },
        { heading: 'CDN Cache', icon: '', body: 'A Content Delivery Network caches files like images, videos, and website files at servers located around the world, close to where users are. Instead of a user in India fetching an image from a server in the US, they get it from a nearby CDN server — much faster.', code: null },
      ],
      keyPoints: [
        'Caches exist at multiple levels — CPU, application memory, shared server, and CDN',
        'Each level trades off between speed, size, and how many servers can share it',
        'Redis is the most commonly used shared cache in production systems',
        'CDN caches are specifically for static files like images and videos',
        'Using multiple levels together (layered caching) gives the best performance',
      ],
      animationSteps: [
        { label: 'Request', description: 'User request arrives at app server', highlight: false },
        { label: 'L1: In-process', description: 'Check local HashMap first (nanoseconds)', highlight: true },
        { label: 'L2: Redis', description: 'Check distributed cache (sub-millisecond)', highlight: true },
        { label: 'L3: Database', description: 'Last resort — fetch from DB (milliseconds)', highlight: false },
        { label: 'Populate', description: 'Store result in Redis and local cache', highlight: false },
      ],
      example: 'Facebook uses three levels of caching. Each web server has its own local cache (Level 1). There is a shared regional cache cluster (Level 2). The actual database is only hit as a last resort (Level 3). The local cache handles 90% of all requests — the database handles less than 1%.',
    },
  },

  // ── 3. Cache-Aside Pattern ─────────────────────────────────────────────────
  {
    order: 3, type: 'content', title: 'Cache-Aside Pattern',
    content: {
      overview: 'Cache-Aside is the most commonly used caching pattern. The idea is simple: the application itself decides when to read from and write to the cache. The cache sits "aside" — it is not automatically in the middle of every request.\n\nThis gives developers full control and is also resilient — if the cache goes down, the app can still work by reading directly from the database.',
      sections: [
        { heading: 'How Reading Works', icon: '', body: 'When the app needs data, it first checks the cache. If the data is there, great — return it immediately. If not, the app goes to the database, gets the data, saves a copy in the cache for next time, and returns it to the user. The first request is always a bit slower, but all future requests are fast.', code: null },
        { heading: 'How Writing Works', icon: '', body: 'When data is updated, the app first writes the new data to the database. Then it deletes the old entry from the cache. The next time someone reads that data, it will be fetched fresh from the database and stored in the cache again. This ensures the cache never holds wrong data for long.', code: null },
        { heading: 'Why Delete Instead of Update the Cache?', icon: '', body: 'When writing, deleting from cache is safer than updating it. If you update both the database and cache at the same time, there is a small window where two requests could overwrite each other and create inconsistent data. Deleting and letting it be refetched avoids this problem.', code: null },
      ],
      keyPoints: [
        'Application checks cache first on every read — if not found, fetch from DB and store in cache',
        'On every write, update the database first then delete the old cache entry',
        'If cache is down, the app still works by reading directly from the database',
        'The very first request for any piece of data will always be a cache miss',
        'This is the most widely used caching pattern in web applications',
      ],
      animationSteps: [
        { label: 'Read request', description: 'App needs user data for id=123', highlight: false },
        { label: 'Cache check', description: 'Look up user:123 in Redis', highlight: true },
        { label: 'Miss → DB', description: 'Not in cache — query database', highlight: false },
        { label: 'Cache set', description: 'Store user:123 in Redis with TTL=300s', highlight: true },
        { label: 'Return data', description: 'Subsequent reads served from cache', highlight: false },
      ],
      example: 'GitHub uses cache-aside for repository pages. When you visit a repo, GitHub checks its cache. If not found, it queries the database, stores the result in cache for 60 seconds, and serves it. When someone pushes a new commit, the cache entry for that repo is deleted so the next visitor gets fresh data.',
    },
  },

  // ── 4. Read/Write Strategies ───────────────────────────────────────────────
  {
    order: 4, type: 'content', title: 'Read/Write Strategies',
    content: {
      overview: 'Besides Cache-Aside, there are other ways to decide when and how data moves between the cache and the database. Each strategy has a different balance between speed and data accuracy.\n\nChoosing the right strategy depends on what your application values more — fast writes, or always having the most accurate data.',
      sections: [
        { heading: 'Write-Through', icon: '', body: 'Every time data is written, it is written to both the cache and the database at the same time before the user gets a response. This means the cache is always up to date. The downside is that writes take a bit longer because they have to update two places. Use this when data accuracy is critical, like financial records.', code: null },
        { heading: 'Write-Back (Write-Behind)', icon: '', body: 'Data is written to the cache first and the user gets an instant response. The database is updated a little later in the background. This makes writes very fast. The risk is that if the cache crashes before the database is updated, you could lose that recent data. Good for things like view counters or analytics.', code: null },
        { heading: 'Read-Through', icon: '', body: 'The cache sits directly in front of the database. When the app asks for data, it always asks the cache. If the cache does not have it, the cache itself goes and fetches it from the database — the application does not need to handle this. The app code is simpler because it only ever talks to the cache.', code: null },
        { heading: 'Refresh-Ahead', icon: '', body: 'The cache predicts which data will be needed soon and fetches it before it expires. This way, popular data is always fresh and ready. The downside is it might fetch data that no one actually requests, wasting resources.', code: null },
      ],
      keyPoints: [
        'Write-through always keeps cache and database in sync but is slower to write',
        'Write-back is faster to write but risks losing data if the cache crashes',
        'Read-through simplifies application code by letting the cache handle database fetching',
        'Cache-aside gives the most control and is most commonly used',
        'Choose your strategy based on whether speed or accuracy matters more for that data',
      ],
      animationSteps: [
        { label: 'Write-through', description: 'Write hits cache AND DB simultaneously', highlight: true },
        { label: 'Both updated', description: 'Cache and DB always in sync', highlight: true },
        { label: 'Write-back', description: 'Write hits cache only, returns immediately', highlight: false },
        { label: 'Async flush', description: 'DB updated in background later', highlight: false },
        { label: 'Trade-off', description: 'Speed vs consistency — choose per use case', highlight: false },
      ],
      example: 'Amazon\'s DynamoDB service has a caching layer called DAX that uses read-through caching. Your app talks to DAX just like it talks to DynamoDB. When data is not in the cache, DAX fetches it from DynamoDB automatically. You get the speed of a cache without changing your application code.',
    },
  },

  // ── 5. Eviction (LRU/LFU/TTL) ─────────────────────────────────────────────
  {
    order: 5, type: 'content', title: 'Eviction (LRU/LFU/TTL)',
    content: {
      overview: 'A cache has limited memory. It cannot store everything forever. When the cache is full and new data needs to be added, something old has to be removed. This is called eviction.\n\nThere are also expiry rules — you can tell a cache to automatically delete data after a certain amount of time, even if the cache is not full. This is called TTL (Time To Live).',
      sections: [
        { heading: 'LRU — Least Recently Used', icon: '', body: 'When the cache is full, LRU removes the item that has not been used for the longest time. The idea is that if you have not needed something recently, you probably will not need it again soon. This works well for most websites where recently viewed content is likely to be viewed again.', code: null },
        { heading: 'LFU — Least Frequently Used', icon: '', body: 'LFU removes the item that has been accessed the fewest number of times. This is better when some items are always popular — like the top 10 products on a shopping site. Even if a product was not accessed in the last minute, if it is accessed thousands of times a day, LFU will keep it.', code: null },
        { heading: 'TTL — Time To Live', icon: '', body: 'TTL is a timer on every cached item. You set how long the data should stay in the cache — for example 5 minutes or 1 hour. After that time, the item is automatically deleted. This prevents showing users old, outdated data. Always set a TTL — never cache data forever.', code: null },
        { heading: 'Choosing the Right One', icon: '', body: 'Use LRU for general purpose caching — it works well for most cases. Use LFU when a small number of items get most of the traffic, like popular products or trending topics. Use short TTLs for data that changes often (like prices) and longer TTLs for data that rarely changes (like product descriptions).', code: null },
      ],
      keyPoints: [
        'When the cache is full, eviction policies decide which data to remove',
        'LRU removes the least recently used item — good for most general use cases',
        'LFU removes the least frequently accessed item — good when traffic is uneven',
        'TTL automatically deletes data after a set time to prevent stale data',
        'Always set a TTL — caching data forever causes memory problems and stale reads',
      ],
      animationSteps: [
        { label: 'Cache full', description: 'maxmemory limit reached', highlight: true },
        { label: 'LRU scan', description: 'Find least recently accessed entry', highlight: true },
        { label: 'Evict entry', description: 'Remove the oldest unused entry', highlight: false },
        { label: 'Insert new', description: 'New entry takes freed slot', highlight: false },
        { label: 'TTL expiry', description: 'Separately, expired entries auto-removed', highlight: false },
      ],
      example: 'Netflix caches movie information like titles, descriptions, and ratings with a 1-hour TTL. This data rarely changes so serving it from cache for up to an hour is fine. Your watch history uses LRU eviction — recently watched shows are most likely to be relevant for recommendations.',
    },
  },

  // ── 6. Cache Invalidation ──────────────────────────────────────────────────
  {
    order: 6, type: 'content', title: 'Cache Invalidation',
    content: {
      overview: 'Cache invalidation means removing or updating old data in the cache when the original data in the database changes. This is one of the hardest problems in software because if you do it wrong, users see outdated information.\n\nThere is a famous saying: "There are only two hard things in computer science: cache invalidation and naming things."',
      sections: [
        { heading: 'TTL-Based (Let It Expire)', icon: '', body: 'The simplest approach: do nothing. Just wait for the TTL timer to expire and the cache will clear itself. The downside is that users might see old data for a few minutes or hours. This is fine for data that does not change often, like a news article or a product description.', code: null },
        { heading: 'Delete on Write', icon: '', body: 'When data changes in the database, immediately delete the related cache entry. The next user who reads that data will get the fresh version from the database. This is fast and accurate. The trade-off is you have to remember to delete the cache every time you update the database.', code: null },
        { heading: 'Using Events to Invalidate', icon: '', body: 'In systems with multiple services, one service can send a message when data changes. Other services that have the same data in their own caches listen for these messages and delete their stale copies. This keeps all parts of the system in sync without them needing to talk to each other directly.', code: null },
        { heading: 'Versioned Cache Keys', icon: '', body: 'Instead of deleting old entries, you can change the name of the cache key every time data changes. Old entries with the old name just expire naturally over time. This avoids race conditions where one request might overwrite another.', code: null },
      ],
      keyPoints: [
        'Invalidation means removing stale data from cache when the database is updated',
        'TTL-based invalidation is simple but allows stale data for the duration of the TTL',
        'Deleting cache on write gives fresher data but requires careful implementation',
        'Event-based invalidation works well when multiple services share the same data',
        'Always use TTL as a backup even when using manual invalidation',
      ],
      animationSteps: [
        { label: 'DB updated', description: 'Product price changed in database', highlight: false },
        { label: 'Event fired', description: 'Update event triggers invalidation', highlight: true },
        { label: 'Cache cleared', description: 'product:456 deleted from Redis', highlight: true },
        { label: 'Next read', description: 'Cache miss — fetches fresh price from DB', highlight: false },
        { label: 'Re-cached', description: 'New price stored in cache for future reads', highlight: false },
      ],
      example: 'Shopify deletes all related cache entries when a shop owner updates a product price. The product detail page cache, the category page cache, and the search results cache are all cleared. The next customer to visit sees the correct new price immediately.',
    },
  },

  // ── 7. Cache Consistency ───────────────────────────────────────────────────
  {
    order: 7, type: 'content', title: 'Cache Consistency',
    content: {
      overview: 'Cache consistency describes how closely the data in the cache matches the real data in the database. Perfect consistency means users always see the absolute latest data. But achieving that perfectly is expensive and slows things down.\n\nMost real-world systems accept a small window where the cache might be slightly behind — this is called eventual consistency.',
      sections: [
        { heading: 'Strong Consistency', icon: '', body: 'Every read always returns the most recent write. The cache and database are always in sync. This requires more work and slows things down slightly. Use this for things where wrong data would be a serious problem — bank balances, inventory counts, login sessions.', code: null },
        { heading: 'Eventual Consistency', icon: '', body: 'The cache might be slightly behind the database for a short time — usually just seconds or minutes — but it will eventually catch up. This is acceptable for most content on websites. For example, if someone adds a new post on social media, it is fine if it takes a few seconds to appear for all users.', code: null },
        { heading: 'Read Your Own Writes', icon: '', body: 'A user should always see their own changes immediately, even if other users might see a slightly older version for a moment. For example, when you update your profile photo, you should see the new photo right away even if your friend sees the old one for a few more seconds.', code: null },
        { heading: 'What Happens When Servers Disagree', icon: '', body: 'In a large system with many cache servers, sometimes different servers temporarily have different versions of the same data — especially after a network problem. Redis handles this by eventually making all copies agree on the most recent version once the connection is restored.', code: null },
      ],
      keyPoints: [
        'Strong consistency means cache always shows the latest data — more expensive',
        'Eventual consistency means cache may be slightly behind — cheaper and faster',
        'Most websites use eventual consistency for most data with short TTLs',
        'For critical data like payments and logins, always use strong consistency',
        'A short TTL of 30 to 60 seconds gives a good balance between freshness and speed',
      ],
      animationSteps: [
        { label: 'Write to DB', description: 'User updates their profile', highlight: false },
        { label: 'Stale cache', description: 'Old value still in cache for TTL period', highlight: true },
        { label: 'Other users', description: 'May see old profile for up to TTL seconds', highlight: false },
        { label: 'TTL expires', description: 'Cache entry removed after 60 seconds', highlight: false },
        { label: 'Consistent', description: 'Fresh data fetched — all users see latest', highlight: true },
      ],
      example: 'Facebook accepts that when you unfriend someone, they might still see you as a friend for up to 60 seconds. This is eventually consistent — the correct state will show up shortly. Accepting this small delay allows Facebook to handle billions of friend connections without slowing down.',
    },
  },

  // ── 8. Redis ───────────────────────────────────────────────────────────────
  {
    order: 8, type: 'content', title: 'Redis',
    content: {
      overview: 'Redis is the most popular caching tool in the world. The name stands for Remote Dictionary Server. Unlike a regular database that saves data to disk, Redis keeps all its data in memory (RAM), which makes it extremely fast — responses come back in under 1 millisecond.\n\nRedis is used by companies like Twitter, Instagram, GitHub, Snapchat, and thousands of others.',
      sections: [
        { heading: 'What Can Redis Store?', icon: '', body: 'Redis is not just a simple key-value store. It can store different types of data: plain text values, lists of items, sets of unique items, ranked leaderboards, and objects with multiple fields. This flexibility means Redis can replace several different tools — cache, queue, leaderboard, and session storage all in one.', code: null },
        { heading: 'Does Redis Lose Data When It Restarts?', icon: '', body: 'By default, Redis keeps data in memory, which means it could be lost if Redis restarts. But Redis also has options to save data to disk regularly (snapshots) or keep a log of every change. Using these options, Redis can recover its data after a restart, making it suitable for more than just temporary caching.', code: null },
        { heading: 'Redis is Very Reliable', icon: '', body: 'Redis processes commands one at a time in a single thread. This sounds slow, but because everything is in memory it is extremely fast, and it means there are never conflicts between commands. Every operation is atomic — it either fully succeeds or fully fails, never halfway.', code: null },
        { heading: 'Setting Expiry Times', icon: '', body: 'Every item stored in Redis can have an expiry time. You tell Redis how many seconds the data should stay, and Redis automatically deletes it when the time is up. This is essential for caching because you want fresh data, not data that is days or weeks old.', code: null },
      ],
      keyPoints: [
        'Redis stores data in RAM making it under 1 millisecond to read or write',
        'It supports multiple data types: strings, lists, sets, sorted sets, and hashes',
        'Redis can optionally save data to disk so it survives restarts',
        'Every Redis command is atomic — no partial updates or race conditions',
        'Always set an expiry time on cached data to prevent it from growing forever',
      ],
      animationSteps: [
        { label: 'App request', description: 'Application sends GET user:123', highlight: false },
        { label: 'Redis RAM', description: 'Key found in memory in microseconds', highlight: true },
        { label: 'Return value', description: 'Data returned to app over TCP', highlight: true },
        { label: 'SET with TTL', description: 'Store new data: SET key val EX 300', highlight: false },
        { label: 'Persist', description: 'AOF logs the write for durability', highlight: false },
      ],
      example: 'Instagram uses Redis to power its Explore page rankings. Every post has a score based on how many likes, comments, and shares it gets. Redis keeps all these scores sorted in order. When you open Explore, Instagram instantly retrieves the top-ranked posts for you from Redis in milliseconds.',
    },
  },

  // ── 9. Distributed Cache ───────────────────────────────────────────────────
  {
    order: 9, type: 'content', title: 'Distributed Cache',
    content: {
      overview: 'A single cache server has limits — it only has so much memory and can only handle so many requests per second. When your system grows beyond what one server can handle, you spread the cache across multiple servers. This is called a distributed cache.\n\nThe challenge is making sure the right server gets the right request every time, and that if one server fails, the system keeps working.',
      sections: [
        { heading: 'Redis Cluster', icon: '', body: 'Redis Cluster automatically splits your data across multiple Redis servers. It divides all possible data into 16,384 slots and assigns groups of slots to different servers. When you store or retrieve data, Redis calculates which slot it belongs to and sends the request to the right server automatically.', code: null },
        { heading: 'Consistent Hashing', icon: '', body: 'Consistent hashing is a clever way to decide which server stores which data. Imagine all servers placed around a circle. Each piece of data is also placed on the circle based on its name. Data is stored on the nearest server clockwise. When you add or remove a server, only the data near that server needs to move — everything else stays put.', code: null },
        { heading: 'Replicas for Reliability', icon: '', body: 'Each main cache server has one or more backup servers called replicas. The replica constantly receives copies of all the data from the main server. If the main server crashes, Redis automatically promotes the replica to take over within about 30 seconds. This means your cache keeps working even during failures.', code: null },
        { heading: 'The Hot Key Problem', icon: '', body: 'Sometimes one piece of data becomes extremely popular — like a trending hashtag or a breaking news story. If millions of requests all go to the same server for that one piece of data, that server can become overwhelmed. The solution is to store copies of that data on multiple servers and spread the requests among them.', code: null },
      ],
      keyPoints: [
        'Distributed caching spreads data across multiple servers when one is not enough',
        'Redis Cluster automatically routes requests to the correct server',
        'Consistent hashing means adding servers only moves a small amount of data',
        'Replicas provide automatic backup — if one server fails, another takes over',
        'Popular data should be spread across multiple servers to avoid bottlenecks',
      ],
      animationSteps: [
        { label: 'Key arrives', description: 'Request for key "product:456"', highlight: false },
        { label: 'Hash slot', description: 'CRC16("product:456") % 16384 = slot 7638', highlight: true },
        { label: 'Route to node', description: 'Slot 7638 → Node 2 (slots 5461-10922)', highlight: true },
        { label: 'Node responds', description: 'Node 2 returns cached data', highlight: false },
        { label: 'Node fails', description: 'Replica promoted, slot ownership transferred', highlight: false },
      ],
      example: 'Uber handles over one million cache operations every second. Their ride data is spread across hundreds of Redis servers using consistent hashing. When Uber adds more cache servers during peak hours, only about 5% of the data needs to move to the new servers — everything else stays exactly where it was.',
    },
  },

  // ── 10. Cache Stampede / Penetration / Avalanche ───────────────────────────
  {
    order: 10, type: 'content', title: 'Cache Stampede / Penetration / Avalanche',
    content: {
      overview: 'These are three common problems that can bring down a system when the cache does not work as expected. All three result in a sudden flood of requests hitting the database directly, which can cause it to crash.\n\nUnderstanding these problems and their solutions is one of the most important topics in system design interviews.',
      sections: [
        { heading: 'Cache Stampede', icon: '', body: 'Imagine thousands of users all try to access the same popular piece of data at exactly the same moment when its cache entry has just expired. The cache is empty for that item, so all thousands of requests go straight to the database at the same time. The database gets overwhelmed. The fix is to only let one request rebuild the cache while all others wait for it.', code: null },
        { heading: 'Cache Penetration', icon: '', body: 'This happens when someone keeps requesting data that does not exist anywhere — not in the cache and not in the database. Every single request has to go all the way to the database only to get an empty result. An attacker can use this to deliberately overload your database. The fix is to cache the empty result too, even if it is just for 30 seconds.', code: null },
        { heading: 'Cache Avalanche', icon: '', body: 'If you load your cache all at once when your app starts, and all those items have the same expiry time, they will all expire at exactly the same moment. Suddenly every request is a cache miss and floods the database. The fix is simple: add a small random amount to each item\'s expiry time so they expire at different times instead of all at once.', code: null },
      ],
      keyPoints: [
        'Cache stampede: many requests hit the same expired key at once — use a lock to let only one rebuild it',
        'Cache penetration: requests for non-existent data bypass the cache — store the empty result briefly',
        'Cache avalanche: all cache entries expire at the same time — add random variation to expiry times',
        'All three problems cause sudden spikes of database requests',
        'Monitor your database request rate — a sudden spike is a warning sign of one of these problems',
      ],
      animationSteps: [
        { label: 'Key expires', description: 'Popular key TTL reaches zero', highlight: true },
        { label: 'Mass miss', description: 'Thousands of requests get cache miss', highlight: true },
        { label: 'DB overload', description: 'All requests query DB simultaneously', highlight: true },
        { label: 'Fix: lock', description: 'First request acquires mutex lock', highlight: false },
        { label: 'Others wait', description: 'Remaining requests wait, then hit cache', highlight: false },
      ],
      example: 'A popular streaming service experienced a cache stampede when their homepage banner image cache expired during a major live event. 50,000 users were online at that moment and all tried to load the image simultaneously, crashing the database. They now spread out the expiry times of their cache entries and use locking for high-traffic items.',
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
          question: 'At 3 AM: DB CPU 100%, response time 2ms to 8s. A popular cache key expired 5 minutes ago. What happened?',
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
          explanation: 'Stale cache — the application cache was not invalidated on write. The old photo URL stays in cache until TTL expires. Fix: delete the cache entry on every profile update.',
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
          explanation: 'Fan-out-on-write pre-computes the timeline into Redis. On read it is one simple list read. Fan-out-on-read at 500 followees requires 500 queries and a merge — too slow at scale.',
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
