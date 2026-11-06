// Static CDN content - 13 modules total
const CDN_MODULES = [
  {
    order: 1, type: 'content', title: 'CDN Fundamentals',
    content: {
      overview: 'A Content Delivery Network (CDN) is a geographically distributed network of servers that deliver content to users from the server closest to them. Instead of every user fetching content from a single server in one location, a CDN stores copies at dozens of locations worldwide.\n\nThe result: faster load times for all users, reduced load on your origin server, and better availability worldwide.',
      sections: [
        { heading: 'Why Distance Matters', body: 'Data travels at roughly the speed of light - about 200,000 km per second through fiber. A user in Mumbai fetching content from New York experiences about 150ms of latency just from distance. The same user fetching from a Mumbai edge server takes under 5ms. For a page with 50 requests, the difference between 150ms and 5ms per request is 7.5 seconds versus 0.25 seconds.', code: null },
        { heading: 'What a CDN Caches', body: 'CDNs primarily cache static assets: images, videos, JavaScript files, CSS files, HTML pages, and fonts. These do not change frequently - the same image can be served to millions of users without touching the origin server. Modern CDNs also support dynamic content acceleration and edge computing (running code at CDN nodes).', code: null },
        { heading: 'Cache Hit Ratio', body: 'The cache hit ratio is the percentage of requests served from CDN cache without going back to origin. A 95% hit ratio means only 5% of requests reach your origin. For a site with 10 million daily requests, a 95% hit ratio means your origin handles 500,000 requests instead of 10 million - a 20x reduction in load.', code: null },
        { heading: 'Major CDN Providers', body: 'Cloudflare has the largest network with over 300 Points of Presence worldwide. AWS CloudFront integrates tightly with AWS services. Akamai is the oldest CDN with deep enterprise penetration. Fastly is popular for real-time purging and edge computing. Vercel and Netlify bundle CDN into their deployment platforms automatically.', code: null },
      ],
      animationSteps: [
        { label: 'User in Mumbai', description: 'Requests image from your website',            highlight: false },
        { label: 'No CDN',        description: 'Goes all the way to New York server: 150ms',   highlight: true  },
        { label: 'With CDN',      description: 'CDN serves from Mumbai edge server: 5ms',      highlight: true  },
        { label: '30x faster',    description: 'Same content, 30x lower latency for user',     highlight: false },
        { label: 'Origin saved',  description: 'Origin never touched - 95% cache hit ratio',   highlight: false },
      ],
      example: 'Netflix built Open Connect, their own CDN, hosted directly inside internet service providers. When you watch a movie, the video is served from a server that may be in the same building as your ISP. This reduces latency to near zero and lets Netflix handle 15% of global internet traffic without overwhelming their own data centers.',
    },
  },
  {
    order: 2, type: 'content', title: 'CDN Architecture and Components',
    content: {
      overview: 'A CDN is a sophisticated distributed system with multiple components: the origin server (your backend), edge servers distributed worldwide, DNS routing that directs users to the nearest node, and a control plane that manages configuration globally.\n\nUnderstanding the architecture helps you configure CDNs correctly and debug delivery problems when they occur.',
      sections: [
        { heading: 'The Origin Server', body: 'The origin server is your actual web server or storage (AWS S3, your app server). It is the authoritative source of truth for all content. When a CDN edge server does not have a cached copy, it fetches from origin. The origin should be treated as a backend that the CDN protects - only cache misses and uncacheable dynamic content should reach it.', code: null },
        { heading: 'Edge Servers and PoPs', body: 'Edge servers (Points of Presence) are CDN nodes distributed globally. Each PoP is a data center with multiple servers. When a user requests content, CDN routes them to the nearest PoP. That PoP serves cached content or fetches from origin if not cached. Cloudflare has 300+ PoPs. Akamai has 4,000+. More PoPs means more users are physically close to a CDN node.', code: null },
        { heading: 'DNS-Based Routing', body: 'CDNs use DNS to route users to the nearest edge server. You change your DNS to point to the CDN nameservers. When a user resolves your domain, the CDN DNS returns the IP of the nearest edge server based on the user\'s location. The DNS TTL is kept short (30-60 seconds) so routing adapts quickly to server failures.', code: null },
        { heading: 'The Control Plane', body: 'The control plane manages CDN configuration across all edge nodes globally. When you purge a cached file, the control plane sends the purge command to all edge servers worldwide within seconds. When you update cache rules, the change propagates globally. Fastly propagates configuration changes globally in under 150ms.', code: null },
      ],
      animationSteps: [
        { label: 'User DNS query', description: 'User resolves your domain via CDN nameserver',  highlight: false },
        { label: 'Geo routing',   description: 'CDN DNS returns nearest PoP IP address',        highlight: true  },
        { label: 'Edge server',   description: 'User connects to closest edge PoP',             highlight: true  },
        { label: 'Cache hit',     description: 'Edge serves from cache - origin not touched',    highlight: false },
        { label: 'Cache miss',    description: 'Edge fetches from origin, caches for next user', highlight: false },
      ],
      example: 'When you type github.com, your DNS resolver queries GitHub\'s CDN nameservers. Fastly determines you are in Europe and returns the IP of a Frankfurt edge server. Your browser connects in 5ms. Without CDN, it would connect to GitHub\'s San Francisco servers in 150ms. The routing decision happens in under 1ms during DNS resolution.',
    },
  },
  {
    order: 3, type: 'content', title: 'Edge Servers and Points of Presence',
    content: {
      overview: 'Edge servers are the physical servers in CDN data centers distributed around the world. A Point of Presence (PoP) is a CDN data center location containing multiple servers.\n\nThe density and placement of PoPs determines how close a CDN can get to end users. More PoPs in more locations means lower latency for more users worldwide.',
      sections: [
        { heading: 'What Edge Servers Do', body: 'An edge server handles the full CDN request lifecycle. It receives the user\'s HTTP request, checks its local cache, returns cached content immediately on a hit, or fetches from origin on a miss. It then stores the fetched content for future requests and returns it to the user with appropriate headers. All of this typically completes in 5-50ms depending on cache warmth.', code: null },
        { heading: 'Cache Hierarchy', body: 'Large CDNs use a multi-tier cache hierarchy. L1: the edge PoP closest to the user. L2: a regional mid-tier cache that multiple L1 edge PoPs share. Origin shield: a single designated PoP that all L2 caches contact before origin. This hierarchy dramatically reduces origin traffic - only the origin shield ever contacts origin.', code: null },
        { heading: 'Anycast Routing', body: 'Many CDNs use Anycast IP routing. The same IP address is announced from multiple PoPs. Internet routing protocols (BGP) automatically route your request to the topologically nearest PoP. This provides automatic failover - if one PoP goes down, traffic automatically routes to the next nearest without any DNS change.', code: null },
        { heading: 'PoP Selection', body: 'CDN providers choose PoP locations based on internet exchange points (where many ISPs connect), major population centers, network peering agreements, and regulatory requirements. The best CDNs are peered directly inside major ISPs - your request never leaves the ISP network until it reaches the edge server.', code: null },
      ],
      animationSteps: [
        { label: 'User request',  description: 'User in Singapore makes a request',             highlight: false },
        { label: 'Anycast',       description: 'BGP routes to nearest PoP: Singapore edge',     highlight: true  },
        { label: 'L1 cache',      description: 'Singapore PoP checks local L1 cache',           highlight: true  },
        { label: 'L2 cache',      description: 'Miss: checks regional Asia-Pacific L2 cache',   highlight: false },
        { label: 'Origin shield', description: 'Miss: Asia shield fetches from origin once',    highlight: false },
      ],
      example: 'Cloudflare\'s network covers 300+ cities. Their PoPs are at major internet exchange points. A user in Lagos, Nigeria reaches a Cloudflare server in Lagos within their ISP\'s network - their request never crosses the Atlantic. This is possible because Cloudflare hosts hardware inside the ISP\'s data center through peering agreements.',
    },
  },
  {
    order: 4, type: 'content', title: 'Origin Servers and Edge Caching',
    content: {
      overview: 'The relationship between origin server and CDN edge cache is the heart of how a CDN works. The origin is the source of truth. Edge servers are its globally distributed cache layer.\n\nConfiguring what gets cached, for how long, and under what conditions determines your CDN effectiveness and content freshness.',
      sections: [
        { heading: 'Cache-Control Headers', body: 'The origin controls CDN caching via HTTP response headers. Cache-Control: public, max-age=86400 tells CDN to cache for 24 hours. Cache-Control: no-store means never cache. Cache-Control: private means user-specific - do not cache. s-maxage overrides max-age specifically for CDN caches. Getting these headers right is the most important CDN configuration task.', code: null },
        { heading: 'TTL Strategy', body: 'TTL determines how long an edge server keeps a cached copy. Static assets with content hashes in filenames: 1-year TTL (filename changes when content changes). HTML pages: 5-60 minutes TTL (content changes frequently). API responses: varies by endpoint (user profile: 5 min, product catalog: 1 hour, real-time price: 0). Always set TTL intentionally - never rely on CDN defaults.', code: null },
        { heading: 'Origin Shield', body: 'An origin shield is a designated CDN PoP acting as an additional cache layer in front of your origin. Instead of hundreds of edge PoPs fetching from origin on cache misses, they all fetch from the origin shield. Only the shield contacts origin. This collapses thousands of origin requests into one during viral traffic spikes.', code: null },
        { heading: 'Conditional Requests', body: 'When a cached item\'s TTL expires, the edge sends a conditional request with If-Modified-Since or ETag. If the content has not changed, origin responds with 304 Not Modified (no body) - much faster and cheaper. If changed, origin sends full updated content. This reduces origin bandwidth significantly.', code: null },
      ],
      animationSteps: [
        { label: 'Origin response',  description: 'Origin sends: Cache-Control: max-age=86400', highlight: false },
        { label: 'Edge caches',      description: 'Edge stores response for 24 hours',          highlight: true  },
        { label: 'User 2 requests',  description: 'Second user requests same content',          highlight: true  },
        { label: 'Cache hit',        description: 'Edge serves from cache - origin not called', highlight: false },
        { label: 'TTL expires',      description: 'After 24h: conditional request to origin',   highlight: false },
      ],
      example: 'Amazon serves product images with Cache-Control: max-age=31536000 (1 year). The image URL includes a content hash (/images/product-abc123.jpg). When the image changes, a new URL with a new hash is generated. Old caches keep serving the old URL. New requests use the new URL. This is cache busting - the URL change forces a fresh cache entry.',
    },
  },
  {
    order: 5, type: 'content', title: 'CDN Request Routing',
    content: {
      overview: 'When a user makes a request, the CDN must route it to the best edge server in milliseconds. This routing considers geographic proximity, server health, current load, and network conditions.\n\nSmart routing separates a great CDN from a basic file server. The goal is not just the geographically closest server but the one that delivers the best real-world performance.',
      sections: [
        { heading: 'DNS-Based Routing', body: 'The most common approach. When a user resolves your domain, the CDN DNS returns the IP of the nearest edge PoP based on the user\'s DNS resolver location. Fast (routing decision at DNS time), but limited granularity - DNS resolver location may not match user location. DNS changes take seconds to propagate due to TTL.', code: null },
        { heading: 'Anycast IP Routing', body: 'The same IP address is advertised from multiple PoPs. BGP routing on the internet directs packets to the topologically nearest PoP. No DNS manipulation required. Provides immediate failover - if a PoP fails, BGP reconverges in seconds. Cloudflare uses Anycast for all its services.', code: null },
        { heading: 'Real User Monitoring', body: 'Advanced CDNs continuously measure actual network performance between users and edge servers. A user might be geographically closer to Server A but get better performance from Server B due to network path quality. RUM data feeds routing decisions in real time, ensuring users are always routed to the server that performs best for them right now.', code: null },
        { heading: 'Request Processing at Edge', body: 'Once routed to an edge server: check the cache key (URL + relevant headers), return cached content if found and fresh, or fetch from origin and cache. Edge servers also handle: SSL termination, HTTP/2 and HTTP/3, gzip compression, image optimisation on the fly, and edge computing logic.', code: null },
      ],
      animationSteps: [
        { label: 'DNS query',    description: 'Browser resolves yourdomain.com',                highlight: false },
        { label: 'CDN DNS',      description: 'CDN returns nearest PoP IP: Frankfurt edge',     highlight: true  },
        { label: 'Connect',      description: 'Browser connects to Frankfurt edge in 8ms',      highlight: true  },
        { label: 'Cache check',  description: 'Edge checks cache for requested URL',            highlight: false },
        { label: 'Serve',        description: 'Cache hit: content served in 15ms total',        highlight: false },
      ],
      example: 'Akamai routes over 30% of global web traffic. Their system measures latency between every edge server and millions of network vantage points every few minutes. When your request arrives, Akamai selects the PoP with the optimal combination of proximity, network quality, and current load - not just geographic distance.',
    },
  },
  {
    order: 6, type: 'content', title: 'Push CDN vs Pull CDN',
    content: {
      overview: 'There are two models for how content gets from origin to CDN edge servers: Push CDN (you actively push content to CDN nodes proactively) and Pull CDN (CDN fetches content from origin on demand when users request it).\n\nEach has clear advantages for different use cases. Most modern CDNs support both.',
      sections: [
        { heading: 'Pull CDN', body: 'In a pull CDN, content is not uploaded in advance. When a user requests a file not cached at an edge, the edge pulls it from origin, caches it, and serves it. Future users get it from cache. Configuration is minimal - just point CDN at origin. The first user for each piece of content on each edge gets a slower response (the cache miss penalty). Best for high-traffic sites where cache warms quickly.', code: null },
        { heading: 'Push CDN', body: 'In a push CDN, you explicitly upload content to CDN nodes before users request it. All users get cache hits from the first request. You have full control over what is in the CDN. Best for large files you know will be requested (video files, software downloads), content slow to generate at origin, or when the first-user cache miss is unacceptable.', code: null },
        { heading: 'Comparing the Models', body: 'Pull CDN advantages: simple setup, automatic caching when first requested, storage used only for files actually requested. Pull CDN disadvantages: first request to any edge is a miss. Push CDN advantages: guaranteed cache hit for all requests, works even if origin is temporarily unavailable. Push CDN disadvantages: must manage uploads on content changes, paying for storage of all pushed content.', code: null },
        { heading: 'Hybrid Approach', body: 'Most production systems use a hybrid. Static web assets (images, CSS, JS): pull CDN with long TTLs - cache warms naturally from traffic. Large predictable files (video, game downloads): push CDN - upload before publishing. You push the video file to CDN before the article goes live, so the first reader gets a cache hit, not a 500MB origin fetch.', code: null },
      ],
      animationSteps: [
        { label: 'Pull: user 1',   description: 'First user: edge pulls from origin (slow)',    highlight: true  },
        { label: 'Pull: user 2',   description: 'Second user: served from edge cache (fast)',   highlight: false },
        { label: 'Pull: user 3+',  description: 'All subsequent users: instant cache hit',     highlight: false },
        { label: 'Push: pre-load', description: 'You push content to all edges before launch', highlight: true  },
        { label: 'Push: all fast', description: 'Every user gets cache hit from first request', highlight: false },
      ],
      example: 'Steam uses a push CDN for game files. When a new game launches, Valve pushes game files to CDN nodes worldwide before the release time. At midnight when millions download simultaneously, every download is a CDN cache hit. Without pre-push, first downloads would fetch 50GB game files from origin, instantly saturating origin bandwidth.',
    },
  },
  {
    order: 7, type: 'content', title: 'Static vs Dynamic Content',
    content: {
      overview: 'CDNs were originally built for static content - files that are the same for every user. Modern CDNs also handle dynamic content - responses that vary per user or request.\n\nUnderstanding the difference determines what you can cache, how long, and what strategies apply.',
      sections: [
        { heading: 'Static Content', body: 'Static content is identical for every user: images, videos, JS bundles, CSS, fonts, PDFs. Perfect for CDN caching - cache once, serve millions. High cache hit ratios and long TTLs. The CDN handles 99%+ of traffic for static assets, with origin only serving initial cache misses and re-validation after TTL expiry.', code: null },
        { heading: 'Dynamic Content', body: 'Dynamic content varies by user: personalised HTML pages, API responses with user-specific data, search results, shopping carts. Cannot be shared between users. Traditionally bypasses CDN entirely. However, even dynamic responses often have cacheable parts - the page structure can be cached while user-specific parts are injected by edge functions.', code: null },
        { heading: 'Dynamic Content Acceleration', body: 'Even for fully uncacheable dynamic requests, CDNs add value. CDNs have optimised private backbone networks between edge and origin. A dynamic API request may travel on Cloudflare\'s private backbone from Frankfurt to New York faster and more reliably than the public internet. Latency for dynamic content improves 20-40% with CDN acceleration.', code: null },
        { heading: 'Edge Computing', body: 'Modern CDNs support running code at the edge. Cloudflare Workers, AWS Lambda@Edge, and Vercel Edge Functions let you run JavaScript at CDN nodes worldwide. AB testing, authentication, personalisation, and geo-based content switching can all run at the edge with sub-millisecond latency - without touching your origin.', code: null },
      ],
      animationSteps: [
        { label: 'Static asset',   description: 'Same image for all users - CDN caches it',    highlight: false },
        { label: 'Cache 1 year',   description: 'Content hash in URL - cache max-age=31536000', highlight: true  },
        { label: 'Dynamic API',    description: 'User-specific data - cannot share between users', highlight: true },
        { label: 'CDN accelerates', description: 'Private backbone speeds dynamic requests 30%', highlight: false },
        { label: 'Edge function',  description: 'Personalisation logic runs at CDN edge: <1ms', highlight: false },
      ],
      example: 'Shopify uses Cloudflare Workers for personalisation at the edge. The product page HTML is cached at CDN edge nodes. A Cloudflare Worker runs at the edge, fetches the user\'s cart count from a nearby data store, injects it into the cached HTML, and returns the page - without touching Shopify\'s origin servers. Dynamic personalisation with CDN-level speed.',
    },
  },
  {
    order: 8, type: 'content', title: 'Cache Invalidation and Purging',
    content: {
      overview: 'Cache invalidation - knowing when to remove stale content from cache - is one of the hardest problems in distributed systems. CDN cache invalidation is particularly challenging because content is spread across hundreds of edge servers worldwide.\n\nWhen you update content on origin, users should see the new version quickly.',
      sections: [
        { heading: 'TTL-Based Expiry', body: 'The simplest approach: set an appropriate TTL and wait for it to expire. Content with max-age=3600 automatically becomes stale after 1 hour. No manual intervention needed. Works well for content that changes predictably and where serving slightly stale content for up to TTL seconds is acceptable. Longer TTLs improve performance but increase the stale window.', code: null },
        { heading: 'Cache Busting via URL Versioning', body: 'For static assets, include a content hash in the filename: app.a1b2c3d4.js. When content changes, the hash changes, generating a new URL. CDN caches the new URL fresh. Old URL caches expire naturally. No purging needed. This is what build tools like Webpack and Vite do automatically - the URL itself is the cache key.', code: null },
        { heading: 'Manual Cache Purging', body: 'When you need immediate update (fixing a broken image, removing sensitive data), trigger a cache purge via CDN API. This sends a purge command to all edge servers globally, removing specified URLs from cache. Modern CDNs complete global purges in seconds: Fastly under 150ms, Cloudflare typically under 5 seconds. Available via API or CDN dashboard.', code: null },
        { heading: 'Surrogate Keys', body: 'Surrogate keys (cache tags) allow bulk invalidation by logical group. Tag cached responses with identifiers like product-123 or category-electronics. When product 123 is updated, purge the product-123 tag - instantly invalidating all cached pages that contain that product with one API call, regardless of how many URLs those are.', code: null },
      ],
      animationSteps: [
        { label: 'Content updated', description: 'Origin content changed - needs to reach users', highlight: false },
        { label: 'Stale edge',      description: 'Edge servers still serve old cached version',  highlight: true  },
        { label: 'Purge API',       description: 'Developer triggers global cache purge via API', highlight: true  },
        { label: 'Propagates',      description: 'Purge command sent to all 300+ PoPs in <5s',  highlight: false },
        { label: 'Fresh fetch',     description: 'Next request: fresh content from origin',      highlight: false },
      ],
      example: 'The New York Times uses Fastly surrogate keys. Every article page is tagged with its article ID, author ID, and section tags. When an editor updates an article, purging the article ID tag instantly invalidates the article page, author\'s article list, and section front page - all from one purge call. Without surrogate keys, they would need to manually purge every URL that shows the article.',
    },
  },
  {
    order: 9, type: 'content', title: 'CDN Security',
    content: {
      overview: 'CDNs are not just a performance tool - they are a critical security layer. Because all traffic passes through the CDN before reaching your origin, the CDN is perfectly positioned to detect and block malicious traffic.\n\nModern CDNs provide DDoS protection, TLS termination, WAF, and bot detection.',
      sections: [
        { heading: 'DDoS Protection', body: 'A DDoS attack floods your servers with traffic to make them unavailable. CDNs absorb DDoS attacks by distributing traffic across their massive global network. Cloudflare\'s network capacity exceeds 100 Tbps - larger than the biggest DDoS attacks ever recorded. Anycast routing spreads attack traffic across all PoPs globally. Your origin server never sees the attack traffic.', code: null },
        { heading: 'TLS Termination', body: 'CDNs terminate TLS (HTTPS) at the edge. The user\'s encrypted connection ends at the CDN edge server, which decrypts it, processes the request, and forwards to origin over a separate connection. This offloads TLS computation from origin servers and enables the CDN to inspect and filter requests. The CDN manages SSL certificates and supports latest TLS versions automatically.', code: null },
        { heading: 'Web Application Firewall', body: 'A WAF inspects HTTP request content and blocks common attack patterns: SQL injection (malicious queries in URL parameters), Cross-Site Scripting (XSS), directory traversal, and known vulnerability exploits. CDN WAFs run at the edge before requests reach your application. Cloudflare blocks over 140 billion cyber threats per day across their network.', code: null },
        { heading: 'Bot Management', body: 'CDNs identify and manage bot traffic. Good bots (search crawlers, monitoring services) are allowed. Bad bots (scrapers, credential stuffers, inventory bots) are challenged or blocked. CDNs use browser fingerprinting, behavioral analysis, and machine learning. Rate limiting at CDN edge (100 requests per minute per IP) stops brute force attacks before they reach your application.', code: null },
      ],
      animationSteps: [
        { label: 'DDoS attack',    description: '1 Tbps flood from botnet worldwide',            highlight: true  },
        { label: 'CDN absorbs',    description: 'Anycast spreads traffic across 300+ PoPs',     highlight: true  },
        { label: 'WAF filters',    description: 'Malicious requests blocked by WAF rules',       highlight: false },
        { label: 'TLS terminates', description: 'CDN handles HTTPS encryption at edge',          highlight: false },
        { label: 'Origin safe',    description: 'Only clean legitimate traffic reaches origin',  highlight: false },
      ],
      example: 'In 2022, Cloudflare mitigated the largest DDoS attack ever recorded at that time: 26 million requests per second. The customer experienced zero downtime. Cloudflare\'s network automatically detected and mitigated within seconds. The customer\'s origin servers never saw a single malicious request.',
    },
  },
  {
    order: 10, type: 'content', title: 'CDN in Practice',
    content: {
      overview: 'Running a CDN in production involves practical decisions: setting correct cache headers, measuring effectiveness, handling deployments, and avoiding common pitfalls.\n\nThis module covers what you actually encounter when operating a CDN.',
      sections: [
        { heading: 'Setting Cache Headers', body: 'For immutable static assets (images with hashes, versioned JS/CSS): Cache-Control: public, max-age=31536000, immutable (1 year). For HTML pages: Cache-Control: public, max-age=300 (5 minutes). For user-specific content: Cache-Control: private or no-store. Always set these intentionally - never rely on CDN defaults. Test with curl --head your-url to verify headers.', code: null },
        { heading: 'Measuring Performance', body: 'Monitor: cache hit ratio (target >90% for static assets), origin traffic reduction (CDN should handle 90%+ of requests), Time to First Byte per geography (under 50ms for cached content), and bandwidth savings. Set alerts for sudden drops in hit ratio - a drop to 0% on a path means missing cache headers. CDN providers expose these metrics in dashboards and APIs.', code: null },
        { heading: 'CDN for Single Page Applications', body: 'Serve index.html with Cache-Control: no-cache (changes on every deploy). Serve JS/CSS/images with very long TTL (they have content hashes). Configure CDN to return index.html for all 404 routes (required for client-side routing). Trigger a purge of index.html on each deployment. With Vercel and Netlify this is all handled automatically.', code: null },
        { heading: 'Multi-CDN Strategy', body: 'Large organisations use multiple CDN providers simultaneously. Traffic is split between CDN A and CDN B. If CDN A has an outage, DNS switches all traffic to CDN B. Fastly\'s 2021 global outage and Cloudflare\'s 2022 incidents showed that even the largest CDN providers have failures. Multi-CDN provides resilience and also enables price negotiation between providers.', code: null },
      ],
      animationSteps: [
        { label: 'Cache headers',  description: 'Set correct Cache-Control per content type',   highlight: false },
        { label: 'Static: 1 year', description: 'JS/CSS with hash: max-age=31536000 immutable', highlight: true  },
        { label: 'HTML: 5 min',    description: 'index.html: max-age=300 - changes on deploy',  highlight: true  },
        { label: 'Measure',        description: 'Monitor hit ratio, TTFB, origin traffic',      highlight: false },
        { label: 'Multi-CDN',      description: 'Split traffic across 2 CDNs for resilience',   highlight: false },
      ],
      example: 'Vercel automatically configures optimal CDN settings for Next.js deployments. Static assets get immutable caching headers with 1-year TTL. HTML pages get short TTLs with stale-while-revalidate. On each deployment, all HTML caches are automatically purged. The developer just pushes code - Vercel handles all cache headers, CDN distribution, and invalidation.',
    },
  },
  {
    order: 11, type: 'failureCases', title: 'Failure Cases',
    failureCases: [
      {
        title: 'Serving Stale Sensitive Content After Deletion',
        scenario: 'A user\'s accidentally published private document is deleted from origin immediately. The CDN has cached it with a 24-hour TTL set 6 hours ago. For the next 18 hours, the CDN serves the deleted file to anyone who requests the URL.',
        impact: 'Private content exposed for 18 hours despite origin deletion. Potential GDPR violation, legal liability, and reputation damage.',
        resolution: 'Trigger CDN cache purge via API immediately on deletion. Use short TTLs (5-15 minutes) for sensitive or user-generated content. Implement surrogate keys so deletion triggers immediate targeted purge.',
        animationSteps: [
          { label: 'File deleted',   description: 'Deleted from origin - returns 404',           highlight: false },
          { label: 'CDN cached',     description: 'Edge still has file for 18 more hours',        highlight: true  },
          { label: 'Users get file', description: 'CDN serves deleted file to all requesters',   highlight: true  },
          { label: '18h exposure',   description: 'Sensitive content exposed until TTL expires', highlight: true  },
          { label: 'Fix',            description: 'Purge API on delete + short TTL for sensitive', highlight: false },
        ],
      },
      {
        title: 'CDN Caches Error Responses',
        scenario: 'A bad deployment causes origin to return 500 errors for 3 minutes. The CDN caches the 500 responses with a 5-minute TTL. After the origin is fixed, the CDN continues serving cached 500 error pages for 2 more minutes.',
        impact: 'Users see errors for 5 minutes total (3 min outage + 2 min cached errors). The CDN extends the outage artificially after the underlying issue is resolved.',
        resolution: 'Configure CDN to never cache error status codes (4xx, 5xx). Use stale-while-revalidate to serve stale content on origin errors rather than caching error responses.',
        animationSteps: [
          { label: 'Origin 500',     description: 'Origin returns 500 for 3 minutes',            highlight: true  },
          { label: 'CDN caches 500', description: 'CDN caches the 500 error with 5min TTL',      highlight: true  },
          { label: 'Origin fixed',   description: 'Origin fixed and returning 200 OK again',     highlight: false },
          { label: 'Still 500',      description: 'CDN serves cached 500 for 2 more minutes',    highlight: true  },
          { label: 'Fix',            description: 'Never cache 5xx or 4xx responses',            highlight: false },
        ],
      },
      {
        title: 'Missing Cache Headers - Origin Overloaded',
        scenario: 'A developer adds a new popular image endpoint but forgets to add Cache-Control headers. The CDN receives no caching instructions and defaults to not caching. All 100,000 requests per minute flow through CDN to origin, completely bypassing CDN caching.',
        impact: 'Origin server overloaded with traffic the CDN should absorb. Database CPU at 100%. All users experience degraded performance.',
        resolution: 'Always set explicit Cache-Control headers. Monitor cache hit ratio per path - drops to 0% indicate missing headers. Implement CDN-level default cache rules as a safety net.',
        animationSteps: [
          { label: 'No headers',    description: 'New endpoint: no Cache-Control header',        highlight: true  },
          { label: 'CDN bypassed',  description: 'Every request passes through to origin',       highlight: true  },
          { label: '100K req/min',  description: 'All traffic hits origin - CDN adds no value',  highlight: true  },
          { label: 'Origin overload', description: 'Database overwhelmed - degraded for all',   highlight: false },
          { label: 'Fix',           description: 'Add Cache-Control + alert on 0% hit ratio',    highlight: false },
        ],
      },
      {
        title: 'CDN Provider Outage Takes Down Website',
        scenario: 'All traffic routes through a single CDN provider. The CDN has a major global outage. Because DNS points to the CDN and origin only accepts CDN traffic, the website is completely unreachable worldwide for 45 minutes despite origin servers being healthy.',
        impact: 'Complete global outage despite healthy origin. The CDN meant to improve availability caused total unavailability.',
        resolution: 'Use multi-CDN with health-check-based DNS failover. Keep origin directly accessible as a fallback. Test failover regularly. Fastly 2021 and Cloudflare 2022 outages proved even the largest CDNs have incidents.',
        animationSteps: [
          { label: 'CDN outage',     description: 'CDN provider network fails globally',         highlight: true  },
          { label: 'DNS blocked',    description: 'DNS points to CDN - cannot route around it',  highlight: true  },
          { label: 'Origin healthy', description: 'Origin servers fine but unreachable',         highlight: true  },
          { label: 'Site down',      description: 'Complete global outage for 45 minutes',       highlight: false },
          { label: 'Fix',            description: 'Multi-CDN + automatic DNS failover',          highlight: false },
        ],
      },
      {
        title: 'Vary Header Cache Fragmentation',
        scenario: 'A developer adds Vary: User-Agent to API responses. The CDN creates a separate cache entry per User-Agent string. Thousands of different User-Agent strings exist in production. Cache hit ratio drops to near zero as the CDN fills with millions of near-identical responses.',
        impact: 'Cache fragmentation - CDN fills with duplicates. Hit ratio collapses. Origin overloaded. CDN storage exhausted.',
        resolution: 'Never use Vary: User-Agent for API responses. Normalise to Vary: X-Device-Type with two values (mobile/desktop) at most. Only use Vary headers with a very small number of distinct values.',
        animationSteps: [
          { label: 'Vary: User-Agent', description: 'Response tagged with Vary: User-Agent',     highlight: true  },
          { label: 'Cache splits',   description: 'New cache entry per User-Agent string',       highlight: true  },
          { label: '1000s of keys',  description: 'Thousands of near-duplicate cache entries',   highlight: true  },
          { label: 'Hit ratio: 0%',  description: 'Every request is a cache miss - origin flooded', highlight: false },
          { label: 'Fix',            description: 'Use X-Device-Type: mobile|desktop instead',   highlight: false },
        ],
      },
    ],
  },
  {
    order: 12, type: 'interview', title: 'Interview Discussion Questions',
    interviewQuestions: [
      {
        question: 'What is a CDN and why would you use one for a global web application?',
        answer: 'A CDN is a geographically distributed network of servers that serve content from locations close to users. Benefits: latency reduction (user in Singapore gets content from Singapore in 5ms vs New York in 150ms), origin load reduction (CDN handles 90%+ of traffic), availability (CDN serves cached content if origin is briefly down), and security (DDoS protection, WAF, TLS termination at edge). Essential for any global application - the performance difference is often the difference between a 0.5s and a 5s load time for distant users.',
        difficulty: 'easy',
      },
      {
        question: 'How would you configure CDN caching for a React Single Page Application?',
        answer: 'Two different strategies for two asset types. HTML files (index.html): Cache-Control: no-cache - these change on every deployment and must always be fresh. JavaScript and CSS bundles: Cache-Control: public, max-age=31536000, immutable - these have content hashes in filenames (app.a1b2c3.js) so safe to cache for 1 year. Configure CDN to return index.html for 404s (needed for client-side routing). On each deployment: new JS/CSS filenames (new hash) bypass old caches automatically. Trigger a purge of index.html on each deployment to ensure users get the new entry point.',
        difficulty: 'medium',
      },
      {
        question: 'A user reports seeing outdated content on your website. How do you investigate and fix it?',
        answer: 'Investigation: curl -I url to check response headers. Look for CDN-Cache-Status or X-Cache (HIT = served from cache, MISS = from origin). Check Age header (seconds since cached). Check Cache-Control header. Bypass CDN to check origin directly. If origin has fresh content but CDN serves stale: TTL has not expired. Fix immediately: trigger a cache purge via CDN API for the specific URL. Prevention: use URL versioning (content hash in filename) for immutable assets so content changes automatically create new URLs, set appropriate TTLs for mutable content, implement purge-on-deploy workflow.',
        difficulty: 'medium',
      },
      {
        question: 'What is the difference between push CDN and pull CDN?',
        answer: 'Pull CDN: content fetched from origin by edge on first user request. Simple setup - point CDN at origin. First user on each edge gets a cache miss (slower). Best for high-traffic content that warms cache quickly. Push CDN: you proactively upload content to CDN before users request it. All users get cache hits from first request. Best for large predictable files (video, game downloads) where first-user miss is unacceptable. Most production systems use hybrid: pull for web assets that warm naturally, push for large known files like video content released at a specific time.',
        difficulty: 'medium',
      },
      {
        question: 'How does a CDN protect against DDoS attacks?',
        answer: 'Two mechanisms. Capacity absorption: Cloudflare\'s network exceeds 100 Tbps - larger than the biggest DDoS attacks recorded. Anycast routing distributes attack traffic across hundreds of PoPs globally, dividing and absorbing it. The origin IP is hidden behind CDN - attackers cannot directly target origin. Traffic filtering: CDN WAF and rate limiting detect and block attack patterns (volumetric floods, HTTP floods) before reaching origin. The CDN becomes the target and has the capacity and tooling to handle it. Without CDN, even moderate DDoS overwhelms most origin servers.',
        difficulty: 'medium',
      },
      {
        question: 'What are surrogate keys and when would you use them?',
        answer: 'Surrogate keys are labels attached to CDN-cached responses enabling bulk invalidation by logical group. A product page tagged product-123 and category-electronics can be instantly invalidated with one API call purging the product-123 tag - clearing the product page, category listing, search results, and recommendation widgets simultaneously. Without surrogate keys, you must know and purge every URL containing that product - impractical at scale. Use when: content appears on multiple pages, you need instant invalidation on content update, or for publishing workflows where content dependencies are complex.',
        difficulty: 'hard',
      },
      {
        question: 'A website\'s CDN cache hit ratio drops from 95% to 20% overnight. What could cause this?',
        answer: 'Several causes to investigate. Code deployment added dynamic query parameters to static asset URLs (e.g., ?v=random) - these bust the cache on every request. New cache-busting headers added to responses (Cache-Control: no-store on paths that should be cached). New URL patterns not matching CDN cache rules. A/B testing tool injecting unique query parameters. Vary headers added causing cache fragmentation. Response compression format changed breaking cache keys. Diagnosis: check CDN logs for cache miss reasons, compare cache header changes between old and new deployments, look for new URL patterns in access logs. Fix whichever change broke the cache key stability.',
        difficulty: 'hard',
      },
      {
        question: 'How does an origin shield work and why is it important?',
        answer: 'An origin shield is a designated CDN PoP acting as an intermediary cache between all other edge PoPs and your origin. Instead of 300 edge PoPs each independently fetching from origin on a cache miss, they all fetch from the origin shield. Only the origin shield contacts origin. This collapses potentially hundreds of simultaneous origin requests (from different PoPs all missing cache at the same time) into one request. Critical for viral content - when a piece of content suddenly gets millions of views from users in many locations, without origin shield all 300 PoPs would simultaneously fetch from origin creating a thundering herd. With origin shield, origin receives at most one miss request per unique content item.',
        difficulty: 'hard',
      },
    ],
  },
  {
    order: 13, type: 'quiz', title: 'CDN Quiz',
    quizConfig: {
      timeLimitSeconds: 600, maxAttempts: 3, passingPercent: 70,
      questions: [
        {
          question: 'A user in Singapore requests your website which is hosted in New York. Without a CDN, the round-trip latency is 150ms. With a CDN PoP in Singapore, what is the expected latency?',
          options: ['Same 150ms - CDN does not reduce latency', 'Under 10ms - content served from nearby edge server', '75ms - CDN halves the distance', '30ms - depends on CDN speed'],
          correctIndex: 1, scenario: true,
          explanation: 'Under 10ms. With a CDN PoP in Singapore, the content is served locally. The user\'s request never crosses the Pacific. Physical distance from user to Singapore PoP is minimal, reducing round-trip to under 10ms vs 150ms to New York.',
        },
        {
          question: 'What does a 95% CDN cache hit ratio mean for your origin server?',
          options: ['Origin handles 95% of all requests', 'Origin handles only 5% of all requests - CDN serves the rest', 'CDN is 95% reliable', '95% of content is cacheable'],
          correctIndex: 1, scenario: false,
          explanation: '95% cache hit means CDN serves 95% of requests directly from cache. Only 5% reach origin. For 10 million daily requests, origin handles 500,000 instead of 10 million - a 20x reduction in origin load.',
        },
        {
          question: 'You delete a sensitive file from origin. It was cached with a 24-hour TTL 6 hours ago. What do users see for the next 18 hours?',
          options: ['Origin\'s 404 response immediately', 'The deleted file from CDN cache for 18 more hours', 'An error message from CDN', 'Nothing - CDN automatically detects deletion'],
          correctIndex: 1, scenario: true,
          explanation: 'Stale cached file for 18 more hours. The CDN does not know the file was deleted - it just cached a copy for 24 hours. It will continue serving that copy until TTL expires. Fix: trigger a cache purge via CDN API immediately on deletion.',
        },
        {
          question: 'You want JavaScript bundles to be cached for 1 year but always serve fresh versions when the code changes. What is the correct approach?',
          options: ['Set max-age=31536000 and purge on every deployment', 'Include a content hash in the filename: app.a1b2c3.js and set max-age=31536000', 'Set max-age=86400 and redeploy daily', 'Use no-cache on all JavaScript files'],
          correctIndex: 1, scenario: false,
          explanation: 'Content hash in filename. When code changes, the build tool generates a new hash and filename (app.d4e5f6.js). The CDN caches the new file fresh. Old files (old hash) expire naturally. No manual purging needed. This is cache busting - URL change forces cache miss.',
        },
        {
          question: 'Your CDN is configured to cache all responses including error responses. Origin has a 3-minute outage. How long do users see errors?',
          options: ['Exactly 3 minutes', '5 minutes - 3 min outage plus 2 min cached errors', 'Until CDN notices origin is back up', 'Errors are never cached by CDN'],
          correctIndex: 1, scenario: true,
          explanation: 'Longer than the actual outage. If CDN caches 500 errors with even a 2-minute TTL, users continue seeing errors for 2 minutes after origin recovers. Never cache error responses - configure CDN to pass through 4xx and 5xx without caching.',
        },
        {
          question: 'What is the benefit of an origin shield in a CDN?',
          options: ['Protects origin from DDoS attacks', 'Acts as an intermediary cache - all edge PoPs fetch from it, not directly from origin', 'Provides SSL termination for origin', 'Balances load between origin servers'],
          correctIndex: 1, scenario: false,
          explanation: 'Cache intermediary. Without origin shield, 300 edge PoPs all independently fetch from origin on cache miss - potentially 300 simultaneous origin requests for one piece of content. With origin shield, all 300 PoPs fetch from the shield, which fetches from origin once. Collapses 300 origin requests to 1.',
        },
        {
          question: 'You add Vary: User-Agent to your API responses. What happens to your CDN cache hit ratio?',
          options: ['Improves - CDN can serve personalised responses', 'Collapses near zero - CDN creates separate cache entry per User-Agent string', 'No change - CDN ignores Vary headers', 'Improves for mobile users only'],
          correctIndex: 1, scenario: true,
          explanation: 'Cache fragmentation. Thousands of different User-Agent strings exist in the wild. CDN creates separate cache entry for each - filling cache with near-duplicate responses. Every request becomes a miss. Never use Vary: User-Agent. Use Vary: X-Device-Type with 2-3 normalised values instead.',
        },
        {
          question: 'Your company uses a single CDN provider. That CDN has a global outage. Your origin servers are healthy. What happens?',
          options: ['Traffic automatically routes directly to origin', 'Website is completely unreachable despite healthy origin', 'CDN automatically fails over to backup nodes', 'Only some regions are affected'],
          correctIndex: 1, scenario: true,
          explanation: 'Complete outage. DNS points to CDN - users cannot reach your origin directly. If origin\'s IP is not publicly known or is firewalled to only accept CDN traffic, there is no bypass path. This is exactly what happened in the Fastly 2021 global outage. Solution: multi-CDN with automatic DNS failover to secondary CDN.',
        },
        {
          question: 'How does a CDN handle DDoS attacks?',
          options: ['It cannot - DDoS bypass CDN directly to origin', 'Anycast routing spreads attack across all PoPs, CDN network capacity absorbs it', 'CDN redirects attack traffic to a honeypot', 'CDN blocks the attacker\'s ASN permanently'],
          correctIndex: 1, scenario: false,
          explanation: 'Capacity absorption via Anycast. The same CDN IP is advertised from 300+ PoPs. Attack traffic is distributed across all of them. Cloudflare\'s total capacity exceeds 100 Tbps - larger than any recorded DDoS. Each individual PoP absorbs only a fraction of the attack. Origin never sees the traffic.',
        },
        {
          question: 'What is the difference between push CDN and pull CDN for a video streaming platform?',
          options: ['Pull CDN is better for video - automatic caching on demand', 'Push CDN is better - upload video to all CDN nodes before publishing so every user gets a cache hit', 'Both are identical for video use cases', 'Push CDN only works for files under 1GB'],
          correctIndex: 1, scenario: true,
          explanation: 'Push CDN for video. A video file might be hundreds of GB. With pull CDN, the first user on each edge PoP would trigger a massive origin fetch - hundreds of simultaneous 10GB origin downloads when a video launches. With push CDN, you pre-load the video to all CDN nodes before the published release time, so every user - even the very first - gets a CDN cache hit.',
        },
      ],
    },
  },
];

module.exports = CDN_MODULES;
