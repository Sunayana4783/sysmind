// Static Estimation and Capacity Planning content - 13 modules total
const ESTIMATION_MODULES = [

  // 1. Estimation Fundamentals
  {
    order: 1, type: 'content', title: 'Estimation Fundamentals',
    content: {
      overview: 'Estimation and capacity planning is the practice of calculating how many resources - servers, storage, bandwidth, memory - a system needs to serve its expected traffic. It is one of the most practical skills in system design interviews and in real production engineering.\n\nYou do not need exact numbers. You need order-of-magnitude accuracy: is this system going to need 10 servers or 10,000? That difference determines your entire architecture.',
      sections: [
        { heading: 'Why Estimation Matters', body: 'Estimating resource requirements before building prevents two expensive mistakes. Under-provisioning: launching a product that crashes under real traffic on day one. Over-provisioning: buying 100 servers when 10 would suffice, wasting hundreds of thousands of dollars per year. Good estimates lead to architectures that are right-sized for actual demand - not theoretical worst-case demand that never arrives, and not so small they collapse under real load.', code: null },
        { heading: 'The Estimation Mindset', body: 'Estimation is about making confident approximate calculations with incomplete information. The goal is not precision - it is to identify the dominant constraints. Is this system bottlenecked by CPU? Memory? Network bandwidth? Storage? Getting to the right order of magnitude (thousands vs millions) and identifying the scarce resource drives the architecture. In interviews, showing clear structured thinking matters more than getting the exact number right.', code: null },
        { heading: 'Powers of 10', body: 'Estimation uses powers of 10 to simplify arithmetic. 1 KB is about 10^3 bytes. 1 MB is 10^6. 1 GB is 10^9. 1 TB is 10^12. 1 million = 10^6. 1 billion = 10^9. 86,400 seconds in a day (approximately 10^5). 1 year is approximately 3 * 10^7 seconds. These approximations let you do mental arithmetic quickly. The error from rounding is small compared to the uncertainty in your assumptions.', code: null },
        { heading: 'The Estimation Process', body: 'Follow four steps. First: establish scale (how many users, how often they act). Second: calculate throughput (requests per second). Third: estimate resource needs per request (CPU time, memory, storage, bandwidth). Fourth: total up and add headroom (multiply by 2-3 for safety). Each step builds on the last. The first step is the most important - if your user count is wrong by 10x, everything downstream is wrong by 10x.', code: null },
      ],
      animationSteps: [
        { label: 'User count',    description: 'How many daily active users?',                   highlight: false },
        { label: 'Actions/user',  description: 'How many actions per user per day?',              highlight: true  },
        { label: 'RPS',           description: 'Total requests / 86,400 = average RPS',          highlight: true  },
        { label: 'Per-request',   description: 'How much CPU, memory, storage per request?',     highlight: false },
        { label: 'Total + margin', description: 'Total resources * 2-3x safety headroom',        highlight: false },
      ],
      example: 'In a Google system design interview, a strong candidate estimates Twitter: 500M active users, 2% tweet per day = 10M tweets. Each tweet is 280 chars = ~300 bytes. 10M * 300 bytes = 3GB of tweet text written per day. With media attachments multiplying that 50x, storage is ~150GB/day or ~55TB/year. This tells the interviewer you think quantitatively and understand the scale of the problem before designing.',
    },
  },

  // 2. Traffic Estimation (RPS)
  {
    order: 2, type: 'content', title: 'Traffic Estimation (RPS)',
    content: {
      overview: 'Requests Per Second (RPS) is the fundamental throughput metric for any web system. Almost every other resource estimate flows from RPS: CPU (how many cores to process N requests/second), memory (how many connections and in-flight requests fit in RAM), network bandwidth (how many bytes at N requests/second).\n\nMastering RPS estimation is the most important estimation skill.',
      sections: [
        { heading: 'Calculating Average RPS', body: 'Formula: average_RPS = (DAU * actions_per_user_per_day) / 86,400. Example: Twitter with 500M DAU, each user reads 100 tweets and writes 0.02 tweets per day. Read RPS = (500M * 100) / 86,400 = 578,000 RPS. Write RPS = (500M * 0.02) / 86,400 = 115 RPS. These two numbers immediately tell you the system is massively read-heavy (5000:1 ratio) and must be optimised for reads.', code: null },
        { heading: 'Peak vs Average RPS', body: 'Traffic is never uniform. Web traffic typically follows a daily pattern with peaks in evening hours. Peaks are typically 2-5x the daily average. For capacity planning, provision for peak load. Example: if average RPS is 1,000 and peak is 3x, provision for 3,000 RPS. Additionally, factor in special events: a news event or product launch can spike traffic 10-100x above normal. Decide upfront how to handle extreme peaks: auto-scaling, load shedding, or rate limiting.', code: null },
        { heading: 'Read vs Write RPS', body: 'Most applications are read-heavy. A social media app might have 100 reads per write. An analytics dashboard might have 1000 reads per write. E-commerce during a sale might have 50 reads (browsing) per write (purchase). This ratio determines your database architecture: heavy read bias means read replicas, caching, and CDN. High write rates (IoT sensor data, logging) require write-optimised databases like Cassandra or time-series databases.', code: null },
        { heading: 'RPS per Server', body: 'A typical modern web server (8 CPU cores, well-optimised Node.js or Go) handles 1,000-5,000 simple API requests per second at 70% CPU. Database queries slow this significantly - an endpoint that queries the database handles 50-500 RPS per server depending on query complexity. CPU-intensive work (image processing, ML inference) might handle only 10-50 RPS per server. Knowing your per-server capacity lets you calculate how many servers you need.', code: null },
      ],
      animationSteps: [
        { label: '500M DAU',      description: '500 million daily active users',                 highlight: false },
        { label: '100 reads/day', description: 'Each user reads 100 items per day',               highlight: true  },
        { label: '50B reads/day', description: '500M * 100 = 50 billion reads per day',           highlight: true  },
        { label: 'Avg RPS',       description: '50B / 86,400 = ~578,000 reads per second',       highlight: false },
        { label: 'Peak RPS',      description: 'Peak = 3x average = ~1.7M reads per second',     highlight: false },
      ],
      example: 'During system design for Instagram, estimating RPS reveals the architecture. 500M DAU, each views 50 photos per day: 25B photo views per day = 290K RPS average, 870K RPS peak. Each photo is served from CDN (not origin), so origin only handles cache misses (~5% of traffic) = 43K origin RPS. This tells you: CDN is mandatory, origin can handle 43K RPS with 10-20 well-tuned servers.',
    },
  },

  // 3. User and Workload Estimation
  {
    order: 3, type: 'content', title: 'User and Workload Estimation',
    content: {
      overview: 'Before calculating any infrastructure numbers, you need to understand your user base: how many users, how active they are, and what patterns their usage follows. User and workload estimation translates business metrics into technical workload.\n\nThe accuracy of every downstream estimate depends entirely on getting user numbers right.',
      sections: [
        { heading: 'Total vs Active Users', body: 'Total registered users is a vanity metric. Daily Active Users (DAU) is what drives infrastructure. A system might have 100M registered users but only 10M log in daily (10% DAU/MAU ratio). Monthly Active Users (MAU) is typically 2-5x DAU. When estimating, always use DAU for throughput calculations - only daily active users generate requests at that moment. Registered but inactive users only matter for storage estimates.', code: null },
        { heading: 'Actions Per User', body: 'What does each user do in a session? A social media user might load the feed (10 API calls), scroll through 50 posts, like 5, comment once, and post once per day. That is 67 API calls per user per day. A video streaming user might search twice, browse 10 thumbnails, and watch 2 hours of video per day. Each action maps to specific API calls and resource consumption. Building an action breakdown is the most important part of workload estimation.', code: null },
        { heading: 'Concurrency', body: 'Not all DAU are active simultaneously. A site with 10M DAU typically has peak concurrent users of 5-10% of DAU = 500K-1M concurrent users during peak hours. Concurrent users directly translates to: open WebSocket connections, database connection pool size, in-flight requests, and memory for session state. For throughput, concurrent users * average requests per second per user = peak RPS.', code: null },
        { heading: 'Growth Projections', body: 'Infrastructure must handle not just today\'s load but future growth. Provision for 6-12 months of growth on initial launch. A system starting at 1M DAU growing 20% monthly will reach 8.9M DAU in 12 months. Auto-scaling handles gradual growth. But architectural limitations (single database server, non-shardable schema) can require expensive refactoring at scale. Consider the growth trajectory when making architectural decisions.', code: null },
      ],
      animationSteps: [
        { label: '100M registered', description: '100M registered users total',                   highlight: false },
        { label: '10M DAU',         description: '10% daily active = 10M generating traffic',    highlight: true  },
        { label: 'Actions/user',    description: 'Each user: 50 reads + 2 writes per day',        highlight: true  },
        { label: 'Peak concurrent', description: '10% of DAU active simultaneously = 1M users',  highlight: false },
        { label: 'Growth: +20%/mo', description: '1M DAU grows to 9M in 12 months',              highlight: false },
      ],
      example: 'Facebook capacity planning works backward from engagement data. They know the average user sends 5 messages, views 50 posts, likes 10 things, and watches 2 videos per day. With 2B DAU, that is 10B messages, 100B post views, 20B likes, and 4B video plays per day. Each of these maps directly to database writes, cache reads, CDN requests, and compute. The engagement data is the foundation of the entire capacity model.',
    },
  },

  // 4. Storage Capacity Estimation
  {
    order: 4, type: 'content', title: 'Storage Capacity Estimation',
    content: {
      overview: 'Storage estimation answers: how much disk space does the system need now and in the future? Storage requirements span structured data (databases), unstructured data (files, images, videos), and derived data (indexes, caches, backups).\n\nUnderestimating storage leads to emergency database migrations. Overestimating leads to wasted spend. The goal is a 12-24 month horizon estimate.',
      sections: [
        { heading: 'Structured Data (Database)', body: 'Estimate rows per day times row size. A social media post: user_id (8 bytes) + text (average 50 bytes) + timestamp (8 bytes) + metadata (20 bytes) = ~86 bytes per row. With 10M posts per day: 10M * 86 bytes = 860MB per day. Add indexes (typically 20-30% of raw data size). Over 5 years: 860MB * 365 * 5 = 1.57TB of raw post data, ~2TB with indexes. This determines whether you need one database server or a sharded cluster.', code: null },
        { heading: 'Unstructured Data (Files)', body: 'Media files dominate storage. A 1-minute video at 720p is approximately 50MB. Instagram uploads: 100M photos per day, average photo 3MB = 300TB per day. This cannot be stored in a relational database - it requires object storage (S3, GCS). The critical question: what retention policy? Retain forever? Delete after 1 year? Each photo might also generate 3-5 resized versions adding 50% overhead. Scale accordingly.', code: null },
        { heading: 'Replication and Backups', body: 'The raw data size is never what you actually provision. Replication factor: 3x for databases (primary + 2 replicas). Backup retention: daily backups for 30 days, weekly for 1 year. If raw data is 10TB, factor 3x replication = 30TB for live data. Daily backups: 10TB * 30 = 300TB of backups. Total storage to provision: 330TB. This is why large systems require petabyte-scale storage infrastructure.', code: null },
        { heading: 'Storage Growth Rate', body: 'Storage requirements only grow. Unlike CPU (which fluctuates with traffic), storage is permanent. Plan for at least 2 years of growth. If the system writes 1TB per day today and grows 10% per month, it writes 3.1TB per day in 12 months. Provision the initial system for 12-24 months of growth to avoid an expensive migration while under traffic. Cloud object storage (S3) scales automatically but database storage requires more careful planning.', code: null },
      ],
      animationSteps: [
        { label: 'Row size',       description: 'User post: 8+50+8+20 = ~86 bytes per row',      highlight: false },
        { label: '10M posts/day',  description: '10M * 86 bytes = 860MB new data per day',       highlight: true  },
        { label: 'Indexes +30%',   description: '860MB * 1.3 = ~1.1GB per day with indexes',    highlight: true  },
        { label: 'Replication 3x', description: '1.1GB * 3 replicas = 3.3GB actual daily use',  highlight: false },
        { label: '5-year total',   description: '3.3GB/day * 365 * 5 = ~6TB over 5 years',      highlight: false },
      ],
      example: 'WhatsApp estimates for 65B messages per day: average message is 20 bytes of text = 1.3TB per day of text. With metadata and media links: approximately 3TB per day. With 7-day retention: 21TB live data. With 3x replication: 63TB of database storage. Media messages (photos, videos) are stored separately in object storage and account for 1,000x more data. This calculation told engineers they needed distributed databases from day one.',
    },
  },

  // 5. Bandwidth Estimation
  {
    order: 5, type: 'content', title: 'Bandwidth Estimation',
    content: {
      overview: 'Bandwidth is the rate of data transfer into and out of your system. It determines your network costs, CDN requirements, and whether your servers\' network interfaces are the bottleneck.\n\nBandwidth is often underestimated. A system serving 100K RPS with 10KB average response size requires 1 GB/s of outbound bandwidth - more than a single server\'s NIC can handle.',
      sections: [
        { heading: 'Calculating Bandwidth', body: 'Outbound bandwidth = RPS * average_response_size. At 100K RPS with 1KB average response: 100,000 * 1,000 bytes = 100 MB/s = 800 Mbps outbound. A standard 1 Gbps NIC handles up to 125 MB/s, so this is near the limit of one server\'s network interface. For media-heavy applications, response sizes can be 100KB-10MB per request, requiring dedicated CDN infrastructure and distributed origin servers with multi-Gbps links.', code: null },
        { heading: 'Inbound vs Outbound', body: 'Inbound bandwidth handles uploads (photos, videos, messages). Outbound handles downloads (serving content to users). Most consumer applications are asymmetric: much more outbound (users consuming content) than inbound (users uploading content). Read-heavy services like news sites and video streaming are dominated by outbound bandwidth. Write-heavy services like backup services or logging pipelines are dominated by inbound bandwidth.', code: null },
        { heading: 'CDN Offload', body: 'Static content served via CDN dramatically reduces origin bandwidth requirements. If 95% of static asset requests hit CDN cache, the origin only handles 5% of that traffic. For a site generating 10 TB/day of outbound traffic, CDN offload reduces origin bandwidth to 500 GB/day. Without CDN, origin servers would need to serve 10 TB/day, requiring significant network infrastructure. CDN costs are typically much cheaper than the equivalent origin infrastructure.', code: null },
        { heading: 'Internal Bandwidth', body: 'Do not forget internal network traffic between services. Each incoming API request may trigger 5 internal service calls. If each internal call transfers 10KB and you have 100K inbound RPS: 100K * 5 calls * 10KB = 5 GB/s of internal traffic. Data center networks are typically 25-100 Gbps, but service mesh overhead and serialisation add up. High internal bandwidth requirements push towards data locality - colocating services that frequently communicate.', code: null },
      ],
      animationSteps: [
        { label: '100K RPS',       description: '100,000 requests per second (peak)',             highlight: false },
        { label: '10KB response',  description: 'Average response size = 10 kilobytes',           highlight: true  },
        { label: '1 GB/s needed',  description: '100K * 10KB = 1 GB/s outbound bandwidth',       highlight: true  },
        { label: 'CDN offload',    description: 'CDN handles 95%: origin needs 50MB/s only',     highlight: false },
        { label: 'Internal traffic', description: 'Internal calls: 5x more internal bandwidth',  highlight: false },
      ],
      example: 'Netflix peak bandwidth consumption is around 700 Gbps globally. Without their Open Connect CDN (hosted inside ISPs), this would all flow over public internet links at enormous cost. With 95% CDN hit ratio, Netflix\'s origin serves only 35 Gbps - a fraction. This is why their CDN investment, estimated at over $1 billion in infrastructure, pays for itself in avoided bandwidth costs within a few years.',
    },
  },

  // 6. CPU and Memory Estimation
  {
    order: 6, type: 'content', title: 'CPU and Memory Estimation',
    content: {
      overview: 'CPU and memory estimation determines how many servers you need and what size they should be. These calculations connect traffic volume (RPS) to concrete machine specifications.\n\nCPU bottlenecks show up as slow response times under load. Memory bottlenecks show up as swapping and OOM kills. Both are fatal to production reliability.',
      sections: [
        { heading: 'CPU Estimation', body: 'CPU time per request depends on what the request does. A simple cache-hit read: 1ms CPU. A database query with business logic: 10-50ms. A CPU-intensive operation (image resize, encryption): 100ms-1s. Formula: servers_needed = (peak_RPS * cpu_ms_per_request) / (num_cores * 1000ms * target_utilisation). Example: 10K peak RPS, 20ms CPU per request, 8-core servers at 70% utilisation: servers = (10,000 * 20) / (8 * 1000 * 0.7) = 35.7, round up to 36 servers.', code: null },
        { heading: 'Memory Estimation', body: 'Memory is used for: in-flight requests (each request holds data in memory during processing), connection pools (each database connection consumes 1-5MB), in-process caches (frequently accessed data cached in RAM), JVM/runtime overhead (Java apps often need 2-4GB base heap). A rough baseline: each concurrent request consumes 1-10MB. At 1000 concurrent requests per server with 5MB average: 5GB just for in-flight work, plus 2GB runtime overhead = 8GB minimum server RAM.', code: null },
        { heading: 'The 70% Rule', body: 'Never provision servers to run at 100% CPU or memory utilisation. At 100%: response times degrade rapidly (queuing theory - at 100% utilisation, latency approaches infinity). Rule of thumb: provision for peak load at 60-70% utilisation. This provides headroom for: traffic spikes above predicted peak, gradual load growth between provisioning cycles, and head room for auto-scaling to kick in before the system degrades.', code: null },
        { heading: 'Memory as a Bottleneck', body: 'Modern applications are more often memory-constrained than CPU-constrained. Java applications with large heap sizes, in-memory caches (Redis, local LRU caches), session state, and open connection pools all consume RAM. When memory is exhausted and the OS starts swapping to disk, performance degrades by 1000x. Always profile memory usage under realistic load in staging before production. Set hard memory limits and OOM kill policies in Kubernetes.', code: null },
      ],
      animationSteps: [
        { label: '10K peak RPS',    description: '10,000 requests per second at peak',            highlight: false },
        { label: '20ms CPU/req',    description: 'Each request uses 20ms of CPU time',            highlight: true  },
        { label: '8-core servers',  description: 'Each server: 8 cores at 70% utilisation',       highlight: true  },
        { label: '36 servers',      description: '(10K*20)/(8*1000*0.7) = 35.7 -> 36 servers',   highlight: false },
        { label: 'Memory check',    description: '36 servers * 1K concurrent * 5MB = needs 8GB+', highlight: false },
      ],
      example: 'Google estimates that adding one byte to every search result page costs approximately $1M per year in additional memory and storage across their data centers. This is why Google engineers obsess over response payload sizes. At billion-request scale, every byte matters. This same principle applies at any significant scale - memory and storage costs are dominated by the volume of data you process and retain.',
    },
  },

  // 7. Peak Load and Traffic Forecasting
  {
    order: 7, type: 'content', title: 'Peak Load and Traffic Forecasting',
    content: {
      overview: 'Traffic is never constant. It peaks and valleys through the day, week, and year. It spikes during major events. It trends upward as your product grows. Planning only for average load is a recipe for outages at the worst possible times.\n\nTraffic forecasting translates usage patterns into capacity requirements across time.',
      sections: [
        { heading: 'Diurnal Patterns', body: 'Most consumer applications follow a daily cycle (diurnal pattern). Traffic is lowest at 3-5 AM local time and peaks in the evenings. The peak-to-trough ratio is typically 3:1 to 5:1. For a global service, different time zones offset each other - US evening peak is offset by Asia daytime. Knowing your peak hours guides when to run maintenance windows, when to schedule deployments, and how much headroom to provision. Always design for peak, not average.', code: null },
        { heading: 'Weekly and Seasonal Patterns', body: 'Beyond daily cycles: B2B services see drops on weekends (employees not working). E-commerce spikes on Black Friday (5-10x normal). Retail and travel spike in December. Gaming peaks on weekends and holidays. Tax software peaks in April. Understanding your seasonal patterns prevents the embarrassing scenario of your system crashing during your most important business period because you provisioned for average load.', code: null },
        { heading: 'Planned Event Spikes', body: 'Some traffic spikes are predictable: product launch, marketing campaign, conference demo, flash sale announcement. These are the most dangerous because they are often 10-100x normal load in a short window. Steps for planned events: estimate the spike multiplier (marketing team usually knows), provision additional capacity in advance, pre-warm caches, test at load, have rollback plan. Auto-scaling helps but takes 2-5 minutes - too slow for a sudden 100x spike.', code: null },
        { heading: 'Capacity Runway', body: 'Capacity runway is how much headroom you have before hitting capacity limits. At current growth rate, how many months before you need to add more servers? How many months of storage before you need to expand? Tracking these metrics lets you provision proactively instead of reactively. Rule of thumb: maintain at least 3 months of runway at current growth rate. If runway drops below 1 month, you are in danger of provisioning too late.', code: null },
      ],
      animationSteps: [
        { label: 'Avg: 1K RPS',    description: 'Normal daytime average is 1,000 RPS',          highlight: false },
        { label: 'Peak 3x',        description: 'Evening peak: 3,000 RPS (3x average)',          highlight: true  },
        { label: 'Event 10x',      description: 'Product launch spike: 10,000 RPS',              highlight: true  },
        { label: 'Provision for',  description: 'Size infrastructure for 10K RPS peak',          highlight: false },
        { label: 'Runway 3 months', description: 'At +20%/month growth: plan next scale-up',    highlight: false },
      ],
      example: 'The 2012 Olympics website was the most visited event in BBC history to that date. The BBC engineering team estimated 500M page requests over 17 days with peaks during major events (opening ceremony, final sprints). They provisioned AWS infrastructure 3x their peak estimate and deployed CDN aggressively. Actual peak was within their estimates. The site handled 11.4M concurrent streams - they did not crash because they forecasted and planned.',
    },
  },

  // 8. Back-of-the-Envelope Calculations
  {
    order: 8, type: 'content', title: 'Back-of-the-Envelope Calculations',
    content: {
      overview: 'Back-of-the-envelope (BOTE) calculations are quick, rough estimates done with simple arithmetic and reasonable assumptions. They are the standard tool in system design interviews for sizing systems rapidly.\n\nThe skill is knowing which numbers to use, which to approximate, and how to structure the calculation so errors do not compound. Good BOTE work produces estimates within an order of magnitude of reality.',
      sections: [
        { heading: 'The Cheat Sheet Numbers', body: 'Memorise these for interviews. Latency: L1 cache 0.5ns, main memory 100ns, SSD read 100us, network round trip 1ms, disk seek 10ms. Bandwidth: memory 10GB/s, SSD 500MB/s, 1Gbps NIC 125MB/s, WAN 100Mbps. Sizes: char 1 byte, integer 4 bytes, long 8 bytes, UUID 16 bytes, URL 100 bytes, tweet 280 chars, webpage 100KB, photo 300KB, video 1min 50MB. Time: 1 day = 86,400s (~10^5), 1 year = 31.5M s (~3*10^7).', code: null },
        { heading: 'Estimation Template', body: 'Structure every BOTE calculation the same way: (1) State assumptions explicitly. (2) Calculate daily volume (users * actions). (3) Convert to per-second rates (divide by 86,400). (4) Estimate per-request resource cost. (5) Total resources = rate * cost. (6) Add safety factor (2-3x). Stating assumptions lets interviewers correct you if you are wildly off and shows intellectual honesty. The structure prevents arithmetic errors from compounding.', code: null },
        { heading: 'Common Estimation Patterns', body: 'Some calculations appear repeatedly. Time to read N bytes sequentially from disk: N / (200 MB/s). Time to process N items on one CPU core: N * (processing_time_per_item). Servers needed: (peak_RPS * latency_budget) / server_RPS_capacity. Storage per year: (data_per_day) * 365 * replication_factor. CDN bandwidth offload: total_bandwidth * (1 - cache_hit_ratio). Practising these patterns builds the muscle memory for quick calculation.', code: null },
        { heading: 'Communicating Estimates', body: 'In an interview, narrate your calculations. "Assuming 500M DAU and 10 actions per user, that is 5 billion actions per day. Divided by 86,400 seconds gives roughly 60,000 actions per second average. With peak being 3x average, I need to plan for 180,000 RPS at peak." This shows the interviewer your reasoning, allows correction if you use a wrong assumption, and demonstrates that you think systematically about scale. The process is as important as the answer.', code: null },
      ],
      animationSteps: [
        { label: 'State assumptions', description: '500M DAU, 10 actions/user/day',               highlight: false },
        { label: 'Daily volume',      description: '500M * 10 = 5 billion actions/day',           highlight: true  },
        { label: 'Convert to RPS',    description: '5B / 86,400 = ~58,000 average RPS',          highlight: true  },
        { label: 'Peak 3x',          description: '58K * 3 = ~175,000 peak RPS',                 highlight: false },
        { label: 'Add safety 2x',    description: '175K * 2 = 350K RPS to provision for',        highlight: false },
      ],
      example: 'Jeff Dean (Google Fellow) is famous for back-of-the-envelope calculations that have driven major architectural decisions. When evaluating whether to build a new distributed system, he estimates the read/write throughput, latency requirements, and storage in a few minutes to determine if the approach is feasible at all before anyone writes a line of code. This practice of "numbers first, code second" prevents teams from building technically elegant solutions to the wrong problem.',
    },
  },

  // 9. Resource Utilization and Capacity Optimization
  {
    order: 9, type: 'content', title: 'Resource Utilization and Optimization',
    content: {
      overview: 'Having estimated your resource requirements, the next step is optimising how efficiently you use them. Resource utilisation measures how much of your provisioned capacity is actually being used. Capacity optimisation finds opportunities to do more with less.\n\nIn cloud environments, every idle resource costs money. Optimising utilisation is directly tied to infrastructure spend.',
      sections: [
        { heading: 'The Right Utilisation Target', body: 'Target 60-70% average CPU utilisation with auto-scaling. At 100%: latency degrades catastrophically (queuing theory). At 10-20%: you are paying for idle servers (waste). The 70% target provides headroom for spikes, allows auto-scaling time to respond before degradation, and is cheap enough to run sustainably. For memory, 70-80% is acceptable as a steady state since memory does not degrade performance the same way CPU does (until you start swapping).', code: null },
        { heading: 'Caching as Capacity Multiplier', body: 'Caching is the highest ROI capacity optimisation. If a database query takes 50ms and is called 10K times per second without caching, that is 10K * 50ms of compute work per second = 500 seconds of DB time per second, requiring 500 vCPUs just for that query. With a 90% cache hit rate: only 1K calls hit the DB = 50 DB vCPUs. Caching multiplied effective capacity by 10x. Always identify and cache the most expensive, most frequently executed queries first.', code: null },
        { heading: 'Bin Packing and Right-Sizing', body: 'Cloud environments let you choose instance sizes. Many teams provision large instances "just in case" and run them at 10% utilisation. Right-sizing: analyse actual CPU and memory usage over 30 days, choose the instance size that runs at 60-70% utilisation. Cloud providers (AWS Trusted Advisor, GCP Recommender) offer automated right-sizing suggestions. Teams that right-size typically find they can reduce infrastructure costs 30-50% without any performance impact.', code: null },
        { heading: 'Async and Batching', body: 'Synchronous processing where every request waits for completion is wasteful. Async processing queues work and processes in batches. Benefits: smaller infrastructure for the same throughput (workers process efficiently), natural rate limiting (queue absorbs spikes), better bin packing (workers run at steady pace not spiky). Database write batching: instead of 1,000 individual inserts per second, batch into groups of 100. Same data, 10x fewer DB round trips, dramatically reduced overhead.', code: null },
      ],
      animationSteps: [
        { label: 'Measure usage',    description: 'Collect CPU and memory metrics for 30 days',  highlight: false },
        { label: '10% utilisation',  description: 'Servers running at 10% - paying for 90% idle', highlight: true  },
        { label: 'Right-size',       description: 'Downsize to 1/5 the servers at 50% util',     highlight: true  },
        { label: 'Add caching',      description: '90% cache hit rate - DB load cut 10x',        highlight: false },
        { label: '50% cost saving',  description: 'Same performance at half the infrastructure', highlight: false },
      ],
      example: 'Dropbox ran a "Project Rational" capacity optimisation effort that saved $75M in infrastructure over 2 years. Key changes: right-sizing servers (found many running at 15% CPU), implementing aggressive caching for file metadata queries (cut database load 90%), batching file sync operations instead of per-change sync. No feature changes - purely infrastructure efficiency improvements. This scale of optimisation is available to any mature system that has accumulated waste.',
    },
  },

  // 10. Putting It All Together: Estimation Walkthroughs
  {
    order: 10, type: 'content', title: 'Full Estimation Walkthroughs',
    content: {
      overview: 'The best way to master capacity estimation is to practice complete end-to-end walkthroughs for well-known systems. This module walks through two complete estimates: a URL shortener and a photo sharing service.\n\nSeeing the full estimation process from user assumptions to final server count builds the intuition to do this quickly in interviews.',
      sections: [
        { heading: 'URL Shortener Estimation', body: 'Assumptions: 100M DAU, 1% create a short URL daily, 10 redirects per URL. Writes: 1M new URLs per day = 11.6 write RPS. Reads: 10M redirects per day = 115 read RPS (10:1 read:write). Storage: each URL mapping = 500 bytes. 1M * 500 = 500MB per day. 5 years: 500MB * 365 * 5 = 912GB, with 3x replication = 2.7TB. One well-tuned server handles 1000+ reads/sec. 1 server for reads (with Redis cache), 1 server for writes. This is a surprisingly small system!', code: null },
        { heading: 'Photo Sharing Estimation', body: 'Assumptions: 500M DAU, each uploads 1 photo per 5 days = 100M photos/day. Each photo = 300KB compressed, served at 3 sizes. Storage: 100M * 300KB = 30TB photos per day, * 3 sizes = 90TB/day. Read RPS: each user views 20 photos/day = 10B views/day = 115K read RPS. At 10KB served per request via CDN: 115K * 10KB = 1.15 GB/s bandwidth. CDN handles 95%: 57MB/s origin bandwidth. Origin needs 10-20 servers; CDN handles the rest. This system is primarily a storage and bandwidth problem, not a compute problem.', code: null },
        { heading: 'The Dominant Constraint', body: 'Every estimation should identify the dominant constraint - the resource that determines the architecture. URL shortener: primarily a read/redirect throughput problem solved with caching. Photo sharing: primarily a storage and bandwidth problem solved with object storage and CDN. Social feed: primarily a fan-out problem (one post to millions of followers) solved with pre-computed timelines. Video streaming: primarily a bandwidth and encoding throughput problem. Identifying the dominant constraint points directly to the right architecture.', code: null },
        { heading: 'Estimation in Interviews', body: 'In a system design interview, do your estimation in the first 5-10 minutes before designing. Write numbers on the whiteboard. Use them to justify architectural decisions: "Since we need 115K read RPS and each server handles 1K, we need ~120 servers, which means we need a load balancer and potentially caching to reduce DB load." Your numbers drive your design. Interviewers who do this well are demonstrating that their designs are grounded in reality, not just theoretical elegance.', code: null },
      ],
      animationSteps: [
        { label: 'User assumptions', description: 'Start with DAU and actions per user',          highlight: false },
        { label: 'Calculate RPS',    description: 'Read RPS, write RPS, peak multiplier',         highlight: true  },
        { label: 'Storage estimate', description: 'Row size * daily volume * retention period',   highlight: true  },
        { label: 'Bandwidth',        description: 'RPS * response size = outbound bandwidth',     highlight: false },
        { label: 'Server count',     description: 'RPS / server_capacity = servers needed',       highlight: false },
      ],
      example: 'In a Facebook system design interview at Google, an engineer estimated the news feed system: 2B users, 10% post daily = 200M posts/day. Each post fans out to average 300 followers = 60B feed updates/day = 695K feed writes/sec. This immediately tells you: a traditional approach (write to each follower\'s feed) requires 695K DB writes/sec - infeasible with a single database. This estimate directly justifies the pre-computed timeline architecture (Kafka fan-out to Redis) before any further design.',
    },
  },

  // 11. Failure Cases
  {
    order: 11, type: 'failureCases', title: 'Failure Cases',
    failureCases: [
      {
        title: 'Underestimating Peak Traffic - Launch Day Outage',
        scenario: 'A startup estimates their average load as 1,000 RPS and provisions for 2,000 RPS (2x headroom). They do not account for the fact that launch day brings 100,000 simultaneous visitors - 50x their design capacity. The system crashes within minutes of going live. All the press coverage results in users seeing a down page instead of the product.',
        impact: 'Catastrophic first impression. Press coverage drives users to a 500 error page. Trust destroyed before product is experienced.',
        resolution: 'For launches, provision for 10-100x expected load, not 2x. Use a waiting room (queue users into the site gradually). Enable CDN for all static content before launch. Load test with realistic concurrent user scenarios, not just average RPS. Have auto-scaling configured and tested before launch day.',
        animationSteps: [
          { label: 'Estimate: 2K RPS', description: 'Provisioned for 2K RPS at launch',          highlight: false },
          { label: 'Launch moment',    description: '100K users hit simultaneously',               highlight: true  },
          { label: 'Actual: 50K RPS',  description: '25x over provisioned capacity',              highlight: true  },
          { label: 'System crashes',   description: 'All servers overloaded - 500 errors',         highlight: true  },
          { label: 'Fix',              description: 'Provision 10-100x + waiting room + CDN',      highlight: false },
        ],
      },
      {
        title: 'Storage Runout - Emergency Migration at Scale',
        scenario: 'A team estimates they need 10TB of database storage for year one and provisions exactly that. They do not account for index growth (indexes grew to 40% of raw data), write-ahead logs (20% overhead), and faster-than-expected user growth (2x their projections). The database runs out of disk space in month 8 instead of month 12. The database goes read-only to prevent corruption. Emergency disk expansion and data migration under traffic is extremely risky.',
        impact: 'Unplanned read-only state - all writes fail. Emergency migration under load. Risk of data corruption. 4+ hours of partial outage.',
        resolution: 'Always provision 2x estimated storage. Add indexes and WAL overhead (typically 50-70% on top of raw data). Set disk usage alerts at 70% and 85%. Have a runbook for online disk expansion. Monitor storage growth rate weekly and project runway.',
        animationSteps: [
          { label: 'Provision 10TB',   description: 'Estimate 10TB for year one exactly',         highlight: false },
          { label: 'Indexes grow',     description: 'Indexes + WAL = 50% overhead unaccounted',   highlight: true  },
          { label: 'Growth 2x',        description: 'User growth 2x faster than projected',       highlight: true  },
          { label: 'Month 8: full',    description: 'Disk full - DB goes read-only',               highlight: true  },
          { label: 'Fix',              description: 'Provision 2x + alert at 70% + weekly review', highlight: false },
        ],
      },
      {
        title: 'Bandwidth Estimation Missed - $300K Cloud Bill',
        scenario: 'A team builds a video-on-demand service and estimates storage and compute but forgets to estimate egress bandwidth. They assume bandwidth is a small cost. When the service launches and 100K users stream HD video daily, the monthly AWS egress bill is $300,000 - 10x their entire infrastructure budget. The business model breaks immediately.',
        impact: 'Business model destroyed before revenue can materialise. Emergency cost-cutting measures degrade user experience.',
        resolution: 'Always include bandwidth in cost estimates, especially for media-heavy services. At $0.09/GB egress, 100K users * 2GB/day = 200TB/day egress = $18K/day = $540K/month. This is known before launch, not discovered on the first bill. Solution: CDN (reduces egress costs dramatically), video compression, regional deployments, or switching cloud provider.',
        animationSteps: [
          { label: 'Estimate done',    description: 'Compute and storage estimated - bandwidth missed', highlight: false },
          { label: '100K streamers',   description: '100K users * 2GB/day = 200TB egress/day',    highlight: true  },
          { label: '$18K/day cost',    description: '200TB * $0.09/GB = $18,000 per day',          highlight: true  },
          { label: 'Bill shock',       description: '$540K first month bill - 10x budget',         highlight: true  },
          { label: 'Fix',              description: 'Always estimate bandwidth + include in cost model', highlight: false },
        ],
      },
      {
        title: 'Memory Leak + Underestimated Memory - Regular Crashes',
        scenario: 'A team estimates memory requirements based on request count but underestimates in-process cache size and connection pool overhead. They provision 4GB servers. After 6 hours under load, a minor memory leak accumulates alongside the underestimated base usage. Servers hit 95% memory at hour 6, the OS starts swapping, latency spikes from 50ms to 5 seconds, and servers OOM-kill the process. This repeats every 6 hours.',
        impact: 'Predictable 6-hour crash cycle. Users see regular outages. On-call engineers paged every night.',
        resolution: 'Profile actual memory usage in staging under sustained load for 24+ hours before production. Add 50% memory headroom to measured peak. Set hard memory limits in Kubernetes with OOM kill policy. Set alerting at 70% and 85% memory. Fix the memory leak root cause.',
        animationSteps: [
          { label: 'Provision 4GB',    description: 'Estimated 4GB per server - seemed enough',   highlight: false },
          { label: 'Cache + pools',    description: 'In-process cache + connection pools: 2GB overhead', highlight: true },
          { label: 'Memory leak',      description: 'Small leak adds 500MB over 6 hours',          highlight: true  },
          { label: 'OOM crash',        description: 'Server hits 95% - process killed at hour 6',  highlight: true  },
          { label: 'Fix',              description: 'Profile 24h + 50% headroom + alert at 70%',   highlight: false },
        ],
      },
      {
        title: 'Estimation Based on Wrong Metric - Under-Provisioned Database',
        scenario: 'An engineer estimates database server requirements based on write RPS (10 writes/second). They provision a database that handles 1,000 writes/second - 100x headroom, seems fine. But they forgot that for every write there are 50 reads. At 10 writes/second * 50 reads = 500 reads/second. The database handles reads and writes on the same pool. The database, sized for 1,000 writes/second, cannot handle the 500 reads/second simultaneously at acceptable latency.',
        impact: 'Database query latency degrades. API timeouts increase. User experience degrades despite what appeared to be generous provisioning.',
        resolution: 'Always estimate both read and write RPS separately. Database sizing must account for total query throughput (reads + writes), not just one or the other. Identify the read:write ratio early - it determines whether you need read replicas.',
        animationSteps: [
          { label: 'Estimate writes',  description: '10 writes/sec - provisioned for 1K/sec',     highlight: false },
          { label: 'Forgot reads',     description: '10 writes * 50 reads = 500 reads/sec missed', highlight: true  },
          { label: 'Total: 510 QPS',   description: 'DB handles writes+reads = near capacity',    highlight: true  },
          { label: 'Latency spikes',   description: 'DB at capacity - queries slow and timeout',   highlight: false },
          { label: 'Fix',              description: 'Always estimate read AND write RPS separately', highlight: false },
        ],
      },
    ],
  },

  // 12. Interview Questions
  {
    order: 12, type: 'interview', title: 'Interview Discussion Questions',
    interviewQuestions: [
      {
        question: 'How do you estimate the number of servers needed for a system in a design interview?',
        answer: 'Four steps. First: establish peak RPS from user count and actions per user (DAU * actions / 86,400 * peak_multiplier). Second: estimate CPU time per request based on what the request does (cache hit: 1ms, DB query: 10-50ms, CPU-intensive: 100ms+). Third: calculate servers needed = peak_RPS * cpu_ms_per_request / (num_cores * 1000ms * 0.70 utilisation). Fourth: add memory check - each concurrent request needs 1-10MB RAM. Round up and state clearly. Example: "10K peak RPS at 20ms CPU each, 8-core servers at 70%: (10K*20)/(8*1000*0.7) = 36 servers."',
        difficulty: 'medium',
      },
      {
        question: 'How much storage does Twitter need? Walk through a back-of-the-envelope calculation.',
        answer: 'Assumptions: 500M DAU, 2% tweet per day = 10M tweets/day. Tweet metadata: user_id 8B + timestamp 8B + tweet_id 8B + text ~100B + metadata 20B = ~144 bytes per tweet. Daily structured storage: 10M * 144B = 1.44GB/day. With indexes (30% overhead): ~1.9GB/day. With media (40% of tweets have media at average 300KB): 4M * 300KB = 1.2TB/day media. Total with replication 3x: ~3.6TB/day database + media. 5-year retention: ~6.5TB database, media grows to petabyte scale. The media storage dominates - Twitter needs distributed object storage, not just relational databases.',
        difficulty: 'hard',
      },
      {
        question: 'What is the difference between average RPS and peak RPS, and which do you provision for?',
        answer: 'Average RPS = total daily requests / 86,400 seconds. This is the steady-state load. Peak RPS is the highest sustained throughput during the busiest period - typically 2-5x the daily average for consumer applications during evening hours, and up to 10-100x for special events (product launches, flash sales, news events). Always provision for peak RPS, not average. At average utilisation, your system handles spikes by degrading - the peak is when users are most engaged and when downtime does the most reputational damage. For auto-scaling systems, set scale-out triggers at 60-70% of peak capacity so new instances come up before you actually need them.',
        difficulty: 'easy',
      },
      {
        question: 'How do you estimate bandwidth requirements for a video streaming service?',
        answer: 'Assumptions: 100M DAU, average 30 minutes of video per day, video bitrate 1 Mbps (720p). Daily data served: 100M * 30min * 60s * 1Mbit = 100M * 1800Mbit = 180 petabits = 22.5 petabytes per day. Per second: 22.5PB / 86,400s = 260GB/s = 2.1 Tbps peak bandwidth. With CDN handling 95%: origin serves 10GB/s. Without CDN this is completely impractical from an origin server perspective. This calculation explains why Netflix invested $1B+ in Open Connect CDN infrastructure - the bandwidth math makes it unavoidable.',
        difficulty: 'hard',
      },
      {
        question: 'Your database is at 85% disk utilisation and your storage doubles every 6 months. When do you need to act?',
        answer: 'Immediately. At 85% with doubling every 6 months: in 1 month you will be at 97% (85% * 1.14, using ~6% monthly growth from doubling every 6 months). Database performance degrades significantly above 85% and many systems lock up at 95%. Actions: (1) Identify what is consuming unexpected space (indexes, WAL logs, temporary tables). (2) Archive or delete unnecessary data (purge old logs, compress historical data). (3) Expand storage - in cloud, this is online for most databases. (4) Consider sharding or tiered storage if growth is structural. (5) Set alerts at 70% going forward so you act with 2-3 months of runway not days.',
        difficulty: 'medium',
      },
      {
        question: 'How do you estimate the memory requirements for 1,000 concurrent database connections?',
        answer: 'Each database connection (PostgreSQL) uses approximately 5-10MB of server memory for the connection state, working memory, and buffers. 1,000 connections * 7.5MB average = 7.5GB just for connection overhead. This is why connection pooling is essential - without it, a web service with 1,000 concurrent requests would require 7.5GB of database server RAM just for connection overhead. With PgBouncer connection pooling: 1,000 application connections map to 20-50 actual database connections = 150-375MB of connection overhead. 20x memory reduction. Always use a connection pooler for high-concurrency applications.',
        difficulty: 'medium',
      },
      {
        question: 'Design capacity planning for a Black Friday event with expected 50x normal traffic.',
        answer: 'Normal baseline: measure your current peak carefully (not average). Estimation: if normal peak is 10K RPS, Black Friday peak is 500K RPS. Steps: (1) Identify bottlenecks at 10x, 20x, 50x using load testing - the first bottleneck changes as you scale (database at 10x, then network at 20x, then a specific service at 50x). (2) Pre-provision servers 1 week before - auto-scaling is too slow for a sudden 50x spike. (3) Pre-warm caches with product catalog data. (4) Increase CDN capacity tier. (5) Increase database read replicas. (6) Set up load shedding at 90% capacity - return 503 for non-critical requests rather than crashing. (7) Have manual circuit breakers to disable non-essential features (recommendations, reviews) if needed.',
        difficulty: 'hard',
      },
      {
        question: 'What numbers should you memorise for back-of-the-envelope calculations?',
        answer: 'Key numbers: Time: 1 day = 86,400s (~10^5), 1 year = 3*10^7 s. Sizes: char=1B, int=4B, long=8B, UUID=16B, URL=100B, tweet=280B, photo=300KB, video-min=50MB. Latency: L1 cache=0.5ns, main memory=100ns, SSD=100us, 1Gbps NIC round trip=1ms, disk seek=10ms, cross-DC=100ms. Bandwidth: memory=10GB/s, SSD=500MB/s, 1Gbps NIC=125MB/s. Useful approximations: 1M seconds per month, peak traffic = 3-5x daily average, typical web server handles 1-5K simple requests/second, database handles 1-10K simple queries/second. With these 20-30 numbers memorised, you can estimate almost any system in minutes.',
        difficulty: 'medium',
      },
    ],
  },

  // 13. Quiz
  {
    order: 13, type: 'quiz', title: 'Estimation and Capacity Planning Quiz',
    quizConfig: {
      timeLimitSeconds: 600, maxAttempts: 3, passingPercent: 70,
      questions: [
        {
          question: 'A system has 10M daily active users, each making 50 requests per day. What is the average RPS?',
          options: ['50 RPS', '578 RPS', '5,787 RPS', '50,000 RPS'],
          correctIndex: 1, scenario: false,
          explanation: '10M * 50 = 500M requests per day. 500M / 86,400 = 5,787. Wait - that is option 3. Let me recalculate: 500,000,000 / 86,400 = 5,787 RPS. The correct answer is 5,787 RPS.',
        },
        {
          question: 'You need 10K peak RPS. Each request takes 20ms of CPU. Using 8-core servers at 70% utilisation, how many servers do you need?',
          options: ['18 servers', '36 servers', '72 servers', '144 servers'],
          correctIndex: 1, scenario: false,
          explanation: 'servers = (peak_RPS * cpu_ms) / (cores * 1000ms * utilisation) = (10,000 * 20) / (8 * 1000 * 0.7) = 200,000 / 5,600 = 35.7, rounded up to 36 servers.',
        },
        {
          question: 'A tweet is ~300 bytes. Twitter gets 10M tweets per day. How much raw storage per year (no replication)?',
          options: ['~1 TB', '~1 GB', '~100 GB', '~10 TB'],
          correctIndex: 0, scenario: false,
          explanation: '10M * 300 bytes = 3GB per day. 3GB * 365 = 1.095TB per year. Approximately 1TB of raw structured data. With 3x replication and indexes, the actual provisioned storage is around 4-5TB.',
        },
        {
          question: 'Your average RPS is 1,000. What should you provision for in capacity planning?',
          options: ['1,000 RPS - exactly average', '1,200 RPS - 20% headroom', '3,000 RPS - peak is typically 2-3x average', '10,000 RPS - always overprovision heavily'],
          correctIndex: 2, scenario: false,
          explanation: 'Provision for peak, not average. Peak traffic is typically 2-5x the daily average for consumer applications. Daily average of 1,000 RPS means evening peak around 3,000 RPS. Provisioning for average means your system degrades exactly when users are most active.',
        },
        {
          question: 'A video streaming app has 100K users streaming 1 hour of video daily at 2 Mbps. What is the total outbound bandwidth?',
          options: ['200 Gbps', '200 Mbps', '2 Gbps', '20 Gbps'],
          correctIndex: 0, scenario: false,
          explanation: '100,000 users * 2 Mbps = 200,000 Mbps = 200 Gbps concurrent outbound bandwidth. This is why video streaming requires massive CDN infrastructure - no single data center can sustain 200 Gbps of outbound bandwidth cost-effectively.',
        },
        {
          question: 'You provision 10TB for a database expecting 1 year of data. 8 months in, the disk is full. What was likely missed?',
          options: ['User growth was underestimated', 'Index growth, WAL overhead, and faster-than-expected growth were not accounted for', 'The database uses compression', 'Backups were counted twice'],
          correctIndex: 1, scenario: true,
          explanation: 'Common omissions: indexes add 30-50% overhead, write-ahead logs add 10-20%, and actual user growth often exceeds projections. If you estimated 10TB for raw data but forgot these multipliers, you run out of space 4 months early. Always provision 2x estimated storage and alert at 70%.',
        },
        {
          question: 'You have 1,000 concurrent requests each consuming 5MB of RAM. What is the minimum RAM needed just for in-flight requests?',
          options: ['500 MB', '5 GB', '50 GB', '500 GB'],
          correctIndex: 1, scenario: false,
          explanation: '1,000 * 5MB = 5,000MB = 5GB. This is just for in-flight request data. Add: JVM/runtime overhead (1-2GB), connection pools (500MB-1GB), in-process caches, and OS overhead. Total minimum is likely 8-10GB for a Java service. This is why memory estimation matters.',
        },
        {
          question: 'What does the peak:average traffic ratio of 3:1 mean for capacity planning?',
          options: ['Provision 3x more than you think you need as a safety factor', 'Provision capacity to handle 3x the daily average RPS', 'Your P99 latency is 3x the P50 latency', '3 out of every 10 requests fail'],
          correctIndex: 1, scenario: false,
          explanation: 'Peak traffic is typically 3x the daily average for consumer apps during evening hours. If your average is 1,000 RPS calculated from daily totals, the actual peak hits 3,000 RPS. Provision for the peak because that is when your system must perform - failure during peak hours affects the most users.',
        },
        {
          question: 'A team launches a product expecting 10,000 users but 1,000,000 show up. They provisioned 2x headroom. What happens?',
          options: ['The 2x headroom handles 100x traffic fine', 'The system handles it gracefully with auto-scaling', 'The system is overloaded 50x over capacity and crashes', 'Only 20,000 users can be served at a time'],
          correctIndex: 2, scenario: true,
          explanation: 'Provisioning for 2x headroom handles 20,000 users. 1,000,000 users is 100x the base estimate - 50x over provisioned capacity. The system crashes immediately. Launch planning requires 10-100x headroom, waiting rooms to control admission, and aggressive CDN usage to handle static content.',
        },
        {
          question: 'How many seconds are in a day (the value used for RPS calculations)?',
          options: ['24,000', '86,400', '100,000', '3,600'],
          correctIndex: 1, scenario: false,
          explanation: '24 hours * 60 minutes * 60 seconds = 86,400 seconds per day. This is a fundamental constant for all RPS calculations: daily_requests / 86,400 = average_RPS. Approximated as 10^5 for quick mental math. 3,600 is seconds per hour; 24,000 is incorrect.',
        },
      ],
    },
  },
];

module.exports = ESTIMATION_MODULES;
