// Static Database Design content - 13 modules total
// Orders 1-10: content topics
// Order 11: Failure Cases
// Order 12: Interview Discussion Questions
// Order 13: Quiz

const DATABASE_DESIGN_MODULES = [

  // ── 1. Database Design Fundamentals ──────────────────────────────────────
  {
    order: 1, type: 'content', title: 'Database Design Fundamentals',
    content: {
      overview: 'A database is the foundation of almost every application. It stores, organises, and retrieves data. How you design that database - what tables or collections you create, how you structure them, and how they relate to each other - has a massive impact on how fast your application runs and how easy it is to change.\n\nGood database design is not about memorising rules. It is about understanding the tradeoffs and making deliberate decisions for your specific use case.',
      sections: [
        {
          heading: 'What Database Design Involves',
          body: 'Database design covers three main decisions. First, choosing the right database type for your use case (relational or non-relational). Second, modeling your data - deciding what entities exist, what attributes they have, and how they relate to each other. Third, optimising for how your application actually reads and writes data - adding indexes, choosing the right data types, and planning for growth.',
          code: null,
        },
        {
          heading: 'Entities, Attributes, and Relationships',
          body: 'An entity is a thing your application needs to track - a user, an order, a product. Attributes are the properties of that entity - a user has a name, email, and password. A relationship describes how entities connect - a user places many orders, an order contains many products. Mapping these out before writing any code prevents painful restructuring later.',
          code: null,
        },
        {
          heading: 'Read vs Write Patterns',
          body: 'Before designing a database, understand how your application uses data. Is it read-heavy (10 reads for every write) or write-heavy? Does it need complex joins across many tables, or simple key-value lookups? Does it need to store structured data with a fixed schema, or flexible documents that vary per record? These questions directly determine whether you should use SQL or NoSQL and how to structure your tables.',
          code: null,
        },
        {
          heading: 'The Cost of Bad Design',
          body: 'A badly designed database is extremely expensive to fix later. Changing a column name in a table with 500 million rows requires a migration that can lock the table for hours. Realising you need to split a table into two after millions of rows exist requires complex data transformation scripts. Good design decisions made before you have data cost nothing. The same decisions made after cost weeks of careful migration work.',
          code: null,
        },
      ],
      animationSteps: [
        { label: 'Entities',      description: 'Define User, Order, Product entities',          highlight: false },
        { label: 'Attributes',    description: 'Add properties to each entity',                 highlight: true  },
        { label: 'Relationships', description: 'Connect entities: User places Orders',          highlight: true  },
        { label: 'Schema',        description: 'Translate to tables or collections',            highlight: false },
        { label: 'Optimise',      description: 'Add indexes based on query patterns',           highlight: false },
      ],
      example: 'When Twitter designed its database, the most important decision was: a tweet belongs to one user, but a user can follow millions of other users. This many-to-many follower relationship became the most complex part of their data model - and directly drove the decision to use a fan-out architecture rather than a simple JOIN query.',
    },
  },

  // ── 2. SQL vs NoSQL Databases ─────────────────────────────────────────────
  {
    order: 2, type: 'content', title: 'SQL vs NoSQL Databases',
    content: {
      overview: 'The most fundamental database decision is: SQL or NoSQL? SQL databases store data in tables with fixed schemas and support powerful querying with JOINs. NoSQL databases store data in flexible formats - documents, key-value pairs, wide columns, or graphs - and scale horizontally more easily.\n\nNeither is universally better. The right choice depends entirely on your data structure, scale, and query patterns.',
      sections: [
        {
          heading: 'SQL Databases',
          body: 'SQL databases (PostgreSQL, MySQL, SQLite) organise data in tables with rows and columns. Every row in a table has the same columns - the schema is fixed. Tables are linked by foreign keys and queried with JOINs. SQL guarantees ACID transactions - your data is always consistent. Use SQL when your data has clear relationships, when you need complex queries, or when data integrity is critical (financial records, user accounts).',
          code: null,
        },
        {
          heading: 'NoSQL Databases',
          body: 'NoSQL covers four types. Document databases (MongoDB) store JSON-like objects - flexible schema, good for varied data. Key-value stores (Redis, DynamoDB) store simple key-value pairs - extremely fast lookups. Wide-column stores (Cassandra) store rows with dynamic columns - great for time-series and analytics at massive scale. Graph databases (Neo4j) store nodes and edges - perfect for social networks and recommendation engines.',
          code: null,
        },
        {
          heading: 'When to Choose SQL',
          body: 'Choose SQL when: your data has clear, stable relationships (users, orders, products); you need to query data in many different ways using JOIN; data integrity and consistency are critical (banking, medical records); or your team is already comfortable with SQL. Start with PostgreSQL for new projects - it handles most workloads and scales further than most teams ever need.',
          code: null,
        },
        {
          heading: 'When to Choose NoSQL',
          body: 'Choose NoSQL when: your data structure varies per record (different fields per product type); you need to scale writes horizontally across many servers; you have a simple access pattern (always look up by one key); or you need very high write throughput at low latency. The mistake is choosing NoSQL just because it sounds more modern - start with SQL unless you have a clear reason not to.',
          code: null,
        },
      ],
      animationSteps: [
        { label: 'SQL tables',     description: 'Fixed schema: Users(id, name, email)',         highlight: false },
        { label: 'Foreign key',    description: 'Orders.user_id links to Users.id',             highlight: true  },
        { label: 'JOIN query',     description: 'SELECT * FROM orders JOIN users ON ...',       highlight: true  },
        { label: 'NoSQL document', description: 'Flexible JSON: {name, orders: [...]}',        highlight: false },
        { label: 'Decision',       description: 'SQL for relations, NoSQL for scale/flex',      highlight: false },
      ],
      example: 'Airbnb uses both. PostgreSQL stores the core data: users, listings, bookings - structured data with clear relationships that needs strong consistency for payment transactions. They use Elasticsearch (a NoSQL document store) for search queries, since searching "2-bedroom apartments in Paris under $100" is not what SQL is optimised for.',
    },
  },

  // ── 3. Data Modeling and Schema Design ───────────────────────────────────
  {
    order: 3, type: 'content', title: 'Data Modeling and Schema Design',
    content: {
      overview: 'Data modeling is the process of deciding what your data looks like before writing any code. It answers: what tables do you need, what columns do they have, how do tables relate to each other, and what constraints ensure data stays valid.\n\nA good data model makes every feature easy to build. A bad data model makes every feature a fight against your own database.',
      sections: [
        {
          heading: 'Entity-Relationship (ER) Modeling',
          body: 'ER modeling is the standard technique for designing relational databases. You draw entities (rectangles), their attributes (ovals), and relationships between them (diamonds). A User entity has attributes name and email. A relationship line shows that a User places many Orders. Each Order belongs to one User. This diagram becomes your schema blueprint before you write a single SQL statement.',
          code: null,
        },
        {
          heading: 'One-to-One, One-to-Many, Many-to-Many',
          body: 'There are three types of relationships. One-to-One: one user has one profile - store a user_id foreign key in the profile table. One-to-Many: one user has many orders - store user_id in the orders table. Many-to-Many: one student takes many courses, one course has many students - requires a junction table (enrollments) with student_id and course_id columns.',
          code: null,
        },
        {
          heading: 'Choosing Data Types',
          body: 'Data types matter more than most developers realise. Storing an integer as VARCHAR wastes space and prevents numeric comparisons. Using TEXT for a column that stores only Y/N wastes 3x the space of a BOOLEAN. Using TIMESTAMP instead of VARCHAR for dates enables date arithmetic and indexing on date ranges. Always choose the most specific, smallest type that correctly represents the data.',
          code: null,
        },
        {
          heading: 'Constraints',
          body: 'Database constraints enforce rules at the storage level, not just the application level. NOT NULL prevents empty required fields. UNIQUE prevents duplicate emails. FOREIGN KEY prevents orphaned records (orders with no user). CHECK constraints validate ranges (age between 0 and 150). These protect your data integrity even if there is a bug in your application code.',
          code: null,
        },
      ],
      animationSteps: [
        { label: 'Entities',    description: 'Draw User, Order, Product boxes',                 highlight: false },
        { label: '1-to-many',   description: 'User(1) -> Orders(many): user_id FK',             highlight: true  },
        { label: 'Many-to-many', description: 'Orders <-> Products via order_items table',      highlight: true  },
        { label: 'Data types',  description: 'id:BIGINT, email:VARCHAR(255), price:DECIMAL',    highlight: false },
        { label: 'Constraints', description: 'NOT NULL, UNIQUE, FOREIGN KEY applied',           highlight: false },
      ],
      example: 'Instagram\'s data model has Users, Photos, Comments, Likes, and Follows. The Follows table (follower_id, following_id) is a many-to-many self-referencing relationship on the User entity. This single table powers the entire social graph. When engineers designed it, they specifically chose to denormalise the follower count as a separate column rather than computing it with COUNT() on every request.',
    },
  },

  // ── 4. Database Normalization and Denormalization ─────────────────────────
  {
    order: 4, type: 'content', title: 'Normalization and Denormalization',
    content: {
      overview: 'Normalization is the process of organising your database to reduce duplicate data. Instead of storing a customer\'s address in every order, you store it once in the customers table and reference it by ID. This eliminates update anomalies - if the customer moves, you update one row instead of thousands.\n\nDenormalization is deliberately going in the other direction - duplicating data to make reads faster. It is a performance optimisation that trades storage and write complexity for read speed.',
      sections: [
        {
          heading: 'Normal Forms',
          body: 'Normalisation is defined by "normal forms". First Normal Form (1NF): each column stores one value, no repeating groups. Second Normal Form (2NF): everything depends on the full primary key, not just part of it. Third Normal Form (3NF): no column depends on another non-key column. In practice, designing to 3NF covers most use cases. Going further (BCNF, 4NF) is rarely needed and can hurt read performance.',
          code: null,
        },
        {
          heading: 'Why Normalise?',
          body: 'Normalised databases avoid update anomalies (updating a customer name in one place instead of 10,000 orders), insertion anomalies (cannot add a product until it is in an order), and deletion anomalies (deleting the last order for a customer accidentally deletes the customer\'s data). Normalisation makes writes clean and eliminates inconsistencies that grow into data quality nightmares over time.',
          code: null,
        },
        {
          heading: 'When to Denormalise',
          body: 'Normalised schemas require JOINs to answer most questions, and JOINs across large tables are slow. When a query is called millions of times per day and joins three large tables, the read cost dominates. Denormalisation caches computed data directly in the row. An orders table might store customer_name directly instead of joining to the customers table every time - accepting that if the name changes, orders need updating too.',
          code: null,
        },
        {
          heading: 'Denormalisation Patterns',
          body: 'Common denormalisation patterns: storing counts directly (post.like_count instead of COUNT(likes)), duplicating frequently-read fields (order.customer_email alongside the FK), pre-computing aggregates (user.total_spent), and storing arrays in a column (post.tag_ids as an array instead of a tags join table). Each pattern speeds up reads at the cost of more complex writes and potential inconsistency.',
          code: null,
        },
      ],
      animationSteps: [
        { label: 'Unnormalised',  description: 'Order row has city, country, zip duplicated',   highlight: true  },
        { label: 'Extract',       description: 'Move address to separate Address table',         highlight: true  },
        { label: '3NF achieved',  description: 'No redundant data - one address per customer',  highlight: false },
        { label: 'Query slow',    description: 'JOIN across 3 tables takes 200ms',              highlight: false },
        { label: 'Denormalise',   description: 'Cache customer_name in orders for fast reads',  highlight: false },
      ],
      example: 'Stack Overflow deliberately denormalises. The vote count on each answer is stored directly as a column rather than computed by counting rows in a votes table. This means 40 million daily users can read answer scores instantly. The tradeoff: when someone votes, two writes happen (insert vote row + update answer score). They accept this because reads are 100x more frequent than votes.',
    },
  },

  // ── 5. Indexing and Query Optimization ───────────────────────────────────
  {
    order: 5, type: 'content', title: 'Indexing and Query Optimization',
    content: {
      overview: 'An index is a separate data structure that the database maintains to make lookups fast. Without an index, finding a user by email requires scanning every single row in the table - a full table scan. With an index on the email column, the database jumps directly to the matching row in microseconds.\n\nIndexes are the single most impactful performance tool in a relational database. The right indexes can turn a 10-second query into a 1-millisecond query.',
      sections: [
        {
          heading: 'How Indexes Work',
          body: 'A database index is like a book\'s index. Instead of reading every page to find "pagination", you look it up in the index and jump to page 247. In databases, the most common index type is a B-tree - a balanced tree structure that keeps keys sorted. Looking up a value is O(log n) instead of O(n). The database automatically uses the index when you query the indexed column in a WHERE clause.',
          code: null,
        },
        {
          heading: 'When to Add an Index',
          body: 'Add an index when: a column appears frequently in WHERE clauses; a column is used in JOIN conditions; a column is used in ORDER BY or GROUP BY; or a column needs to enforce uniqueness. Do not add indexes on every column - each index costs storage space and slows down INSERT, UPDATE, and DELETE operations because the index must be updated alongside the data.',
          code: null,
        },
        {
          heading: 'Composite Indexes',
          body: 'A composite (multi-column) index covers multiple columns. An index on (user_id, created_at) lets the database efficiently answer: "give me all orders for user 123 sorted by date". The order of columns in a composite index matters - the index is only useful when the query filters on the leftmost column(s) first. This is called the leftmost prefix rule.',
          code: null,
        },
        {
          heading: 'The N+1 Query Problem',
          body: 'N+1 is the most common database performance problem. You fetch 100 posts (1 query), then for each post you fetch its author (100 more queries) = 101 total. This turns O(1) into O(N). Fix: use a JOIN to fetch posts and authors in a single query, or batch fetch all authors with a single IN clause. Always check your ORM is not generating N+1 queries - use query logging in development.',
          code: null,
        },
      ],
      animationSteps: [
        { label: 'No index',     description: 'Find user by email: scans all 10M rows',        highlight: true  },
        { label: 'Full scan',    description: 'Reads every row: O(n) = slow',                  highlight: true  },
        { label: 'Add index',    description: 'CREATE INDEX idx_email ON users(email)',         highlight: false },
        { label: 'B-tree lookup', description: 'Jump to row via tree: O(log n) = fast',        highlight: false },
        { label: '10ms to 0.1ms', description: 'Same query - 100x faster with index',          highlight: false },
      ],
      example: 'GitHub has a repositories table with hundreds of millions of rows. Without indexes, searching for repositories by owner would be unusably slow. They index on owner_id, language, and star_count. A query like "show me all Python repos by user 123 sorted by stars" uses a composite index on (owner_id, language, star_count) and returns instantly regardless of how many total repositories exist.',
    },
  },

  // ── 6. Database Replication ───────────────────────────────────────────────
  {
    order: 6, type: 'content', title: 'Database Replication',
    content: {
      overview: 'Database replication copies data from one database server to one or more others. The server that accepts writes is called the primary (or master). Servers that receive copies of the data are called replicas (or secondaries).\n\nReplication solves two problems: high availability (if the primary fails, promote a replica) and read scalability (distribute read queries across many replicas).',
      sections: [
        {
          heading: 'Primary-Replica Replication',
          body: 'In primary-replica replication, all writes go to the primary. The primary records every change in a log (called the binary log in MySQL or WAL in PostgreSQL). Replicas read this log and apply the same changes to their own copy of the data. This happens asynchronously - replicas are usually a few milliseconds behind the primary. Applications read from replicas, write to the primary.',
          code: null,
        },
        {
          heading: 'Synchronous vs Asynchronous Replication',
          body: 'Asynchronous replication: primary confirms the write immediately without waiting for replicas to apply it. Fast writes, but if the primary crashes before replication, the last few writes may be lost. Synchronous replication: primary waits for at least one replica to confirm before acknowledging the write. No data loss, but slower writes. Most systems use asynchronous with semi-synchronous (wait for one replica) as a compromise.',
          code: null,
        },
        {
          heading: 'Read Scaling with Replicas',
          body: 'If 90% of your database queries are reads, adding replicas dramatically increases capacity. With 5 replicas, you have 5x the read throughput. Your application routes read queries to any available replica and write queries to the primary. Connection poolers like PgBouncer or HAProxy handle this routing transparently. The catch: replicas may return slightly stale data if replication lag exists.',
          code: null,
        },
        {
          heading: 'Failover',
          body: 'When the primary fails, one replica must be promoted to primary. Automated failover tools (Patroni for PostgreSQL, MHA for MySQL) detect primary failure and elect a new primary within 10-30 seconds. The promoted replica becomes the new primary and other replicas redirect to it. Applications reconnect automatically. Without automated failover, a primary failure requires manual intervention and causes minutes of downtime.',
          code: null,
        },
      ],
      animationSteps: [
        { label: 'Write to primary', description: 'All writes go to Primary database',          highlight: false },
        { label: 'WAL log',          description: 'Primary records change in write-ahead log',  highlight: true  },
        { label: 'Replicate',        description: 'Replicas apply same changes from log',       highlight: true  },
        { label: 'Read scaling',     description: 'Read queries distributed to replicas',       highlight: false },
        { label: 'Failover',         description: 'Primary fails: replica promoted in <30s',   highlight: false },
      ],
      example: 'LinkedIn runs thousands of MySQL replica servers. Each primary has multiple replicas in different data centers. Read queries for profile pages, connection lists, and feed items all hit replicas. Only writes (profile updates, new connections, messages) hit the primary. This replication strategy handles billions of reads per day without the primary becoming a bottleneck.',
    },
  },

  // ── 7. Database Sharding and Partitioning ────────────────────────────────
  {
    order: 7, type: 'content', title: 'Database Sharding and Partitioning',
    content: {
      overview: 'Replication scales reads by adding replicas, but all writes still go to one primary server. When your write volume exceeds what one server can handle - or when your data grows too large to fit on one server - you need sharding.\n\nSharding splits your data across multiple independent database servers. Each server holds a subset of the data and handles reads and writes for its portion.',
      sections: [
        {
          heading: 'Horizontal Partitioning (Sharding)',
          body: 'Sharding splits rows across multiple database servers called shards. User IDs 1 to 10 million go to Shard 1. User IDs 10 million to 20 million go to Shard 2. Each shard is a full, independent database server. This is called horizontal partitioning because you split rows while keeping the same columns. Sharding scales both write throughput and storage capacity linearly with the number of shards.',
          code: null,
        },
        {
          heading: 'Shard Keys',
          body: 'The shard key determines which shard stores a given row. Choosing the right shard key is critical. A good shard key distributes data evenly across shards and keeps related data on the same shard (so queries don\'t need to hit multiple shards). Bad shard keys create hot spots - one shard receiving most of the traffic while others are idle. User ID is a common shard key for user-centric applications.',
          code: null,
        },
        {
          heading: 'Vertical Partitioning',
          body: 'Vertical partitioning splits columns across tables rather than rows across servers. Move rarely-used or large columns (like user profile bios or settings blobs) to a separate table. The main users table stays lean and fast for the most common queries. This is different from sharding - it does not require multiple servers, just careful table design. It is often done as an early optimisation before sharding becomes necessary.',
          code: null,
        },
        {
          heading: 'The Complexity of Sharding',
          body: 'Sharding introduces significant complexity. Queries that span multiple shards (show me all users who signed up this week) require querying every shard and merging results. Cross-shard transactions are difficult to make atomic. Rebalancing shards when one grows too large is operationally complex. Only shard when you absolutely need to - read replicas and caching can delay the need for sharding by years.',
          code: null,
        },
      ],
      animationSteps: [
        { label: 'Single DB full',  description: 'One server: 500GB data, writes bottleneck',   highlight: true  },
        { label: 'Shard by ID',     description: 'Split: IDs 1-10M to Shard 1, rest to Shard 2', highlight: true },
        { label: 'Shard 1',         description: 'Handles users 1-10M independently',           highlight: false },
        { label: 'Shard 2',         description: 'Handles users 10M-20M independently',         highlight: false },
        { label: 'Route query',     description: 'App computes shard from user_id, routes there', highlight: false },
      ],
      example: 'Discord shards their message database by channel ID. When you send a message, Discord hashes the channel ID to find the correct database shard. A channel\'s entire message history lives on one shard, so fetching messages is always a single-shard query. They use Cassandra which has built-in sharding. At their scale (millions of messages per second), a single database server would be impossible.',
    },
  },

  // ── 8. Database Transactions and ACID Properties ──────────────────────────
  {
    order: 8, type: 'content', title: 'Transactions and ACID Properties',
    content: {
      overview: 'A database transaction is a group of operations that must all succeed or all fail together. Transferring money between accounts requires two operations: debit one account, credit another. If the first succeeds and the second fails, money disappears. A transaction ensures both happen, or neither does.\n\nACID is the set of properties that define what a reliable transaction system must guarantee.',
      sections: [
        {
          heading: 'Atomicity',
          body: 'Atomicity means a transaction is all-or-nothing. If any operation in the transaction fails, all operations are rolled back as if nothing happened. The database never ends up in a half-updated state. In the money transfer example: if debiting account A succeeds but crediting account B fails, the debit is automatically reversed. The accounts end up exactly as they were before the transaction started.',
          code: null,
        },
        {
          heading: 'Consistency',
          body: 'Consistency means every transaction brings the database from one valid state to another valid state. It cannot violate any defined rules or constraints. If your schema says account balances cannot be negative, a transaction that would make a balance negative will fail and be rolled back. Consistency is enforced through constraints (NOT NULL, CHECK, FOREIGN KEY) and the application\'s own validation logic.',
          code: null,
        },
        {
          heading: 'Isolation',
          body: 'Isolation means concurrent transactions do not interfere with each other. If two users are buying the last item in stock simultaneously, isolation ensures only one succeeds. Without isolation, two transactions could both read "1 item in stock", both proceed with the purchase, and you end up with -1 items. SQL databases offer different isolation levels (Read Committed, Repeatable Read, Serializable) that trade performance for stricter isolation.',
          code: null,
        },
        {
          heading: 'Durability',
          body: 'Durability means once a transaction is committed, it stays committed - even if the server crashes immediately after. The database writes the transaction to a write-ahead log on disk before confirming success. If the server crashes, it replays the log on restart to recover committed transactions. This is why database writes to disk are slower than memory - they must flush to durable storage before confirming.',
          code: null,
        },
      ],
      animationSteps: [
        { label: 'Begin TX',    description: 'START TRANSACTION: begin atomic unit',            highlight: false },
        { label: 'Debit A',     description: 'UPDATE accounts SET balance = balance - 100',     highlight: true  },
        { label: 'Credit B',    description: 'UPDATE accounts SET balance = balance + 100',     highlight: true  },
        { label: 'Commit',      description: 'COMMIT: both changes persist together',           highlight: false },
        { label: 'Rollback',    description: 'On error: ROLLBACK reverts all changes',          highlight: false },
      ],
      example: 'Every payment you make online relies on ACID transactions. When Stripe charges your card, it must atomically: record the charge, debit your account balance, and credit the merchant. If any of these three operations fail, all are rolled back. Without ACID guarantees, Stripe would risk charging your card without paying the merchant - or paying the merchant twice.',
    },
  },

  // ── 9. Database Consistency and CAP Theorem ──────────────────────────────
  {
    order: 9, type: 'content', title: 'Consistency and CAP Theorem',
    content: {
      overview: 'When data is stored across multiple servers, keeping all servers in sync becomes a challenge. The CAP theorem describes a fundamental tradeoff in distributed databases: you can only fully guarantee two of three properties - Consistency, Availability, and Partition Tolerance.\n\nUnderstanding CAP helps you choose the right database for your use case and set the right expectations for your system\'s behaviour.',
      sections: [
        {
          heading: 'The CAP Theorem',
          body: 'Consistency: every read returns the most recent write. If you write a value on Node 1, reading from Node 2 immediately returns that same value. Availability: every request receives a response (not necessarily the latest data). Partition Tolerance: the system keeps working even if the network between nodes breaks. Since network partitions always happen in distributed systems, you must choose between C and A.',
          code: null,
        },
        {
          heading: 'CP Systems (Consistency over Availability)',
          body: 'A CP system prioritises returning correct data over always being available. During a network partition, a CP system may refuse to serve requests from isolated nodes rather than risk returning stale data. HBase, Zookeeper, and MongoDB (with write concern majority) are CP systems. Use CP when incorrect data causes real harm - bank balances, inventory counts, medical records.',
          code: null,
        },
        {
          heading: 'AP Systems (Availability over Consistency)',
          body: 'An AP system prioritises staying available over always returning the latest data. During a network partition, all nodes continue serving requests, but they may return stale values temporarily. When the partition heals, nodes sync and eventually converge to the same state - this is called eventual consistency. Cassandra, CouchDB, and DynamoDB are AP systems. Use AP when brief staleness is acceptable - social media feeds, product view counts, shopping cart availability.',
          code: null,
        },
        {
          heading: 'Eventual Consistency',
          body: 'Eventual consistency means all replicas will eventually agree, but there may be a window where they show different values. The window is typically milliseconds to seconds. For most social media use cases this is fine - seeing a like count that is 2 seconds stale causes no harm. For financial transactions it is unacceptable. Always choose your consistency model deliberately based on what stale data would actually mean for your users.',
          code: null,
        },
      ],
      animationSteps: [
        { label: 'Write Node 1',   description: 'Update account balance on Node 1',             highlight: false },
        { label: 'Network split',  description: 'Partition: Node 1 and Node 2 cannot talk',     highlight: true  },
        { label: 'CP: refuse',     description: 'CP: Node 2 refuses reads - stale risk',        highlight: true  },
        { label: 'AP: serve stale', description: 'AP: Node 2 serves old value - stays up',     highlight: false },
        { label: 'Heal',           description: 'Partition heals: nodes sync eventually',       highlight: false },
      ],
      example: 'Amazon shopping carts use AP / eventual consistency. If you add an item to your cart and a network issue means one server doesn\'t get the update immediately, the worst case is you see your cart without that item for a second. That is acceptable. Contrast with Amazon Payments which uses CP / strong consistency - a payment must never be processed twice or skipped, even at the cost of briefly refusing requests.',
    },
  },

  // ── 10. Database Design in Practice ──────────────────────────────────────
  {
    order: 10, type: 'content', title: 'Database Design in Practice',
    content: {
      overview: 'Knowing the theory of database design is only half the job. Applying it in a real system requires knowing how to handle migrations safely, how to monitor database health, and how to make changes to a live production database without causing downtime.\n\nThis module covers the practical skills that separate a junior developer from someone who can be trusted to run a production database.',
      sections: [
        {
          heading: 'Database Migrations',
          body: 'A migration is a versioned script that changes your database schema. Migrations let you evolve your database alongside your code in a controlled way. Each migration has an up (apply the change) and a down (revert it). Tools like Flyway, Liquibase, and Rails migrations manage the order of migrations and track which ones have been applied. Never change a database schema manually in production - always use migrations.',
          code: null,
        },
        {
          heading: 'Zero-Downtime Schema Changes',
          body: 'Adding a column to a table with 500 million rows can lock the table for minutes. The safe approach: add the new column as nullable first (instant), backfill existing rows in small batches, then add the NOT NULL constraint. Dropping a column: stop writing to it first, deploy code that ignores it, then drop it in a separate migration. Renaming a column: add a new column, copy data, update code to use the new column, drop the old one.',
          code: null,
        },
        {
          heading: 'Connection Pooling',
          body: 'Each database connection uses memory and CPU on the database server. If your application opens a new connection for every request and you have 1,000 concurrent users, the database needs 1,000 simultaneous connections. A connection pool maintains a fixed set of open connections (say 20) that are shared across all requests. PgBouncer for PostgreSQL and ProxySQL for MySQL handle connection pooling as a separate proxy layer.',
          code: null,
        },
        {
          heading: 'Monitoring',
          body: 'Key metrics to monitor: slow query log (queries taking over 100ms), replication lag (how far behind replicas are), connection count (approaching the limit is dangerous), disk usage (plan before you run out), lock wait time (long waits indicate contention). Set alerts before problems become outages. The slow query log in particular reveals most performance issues before they become customer-facing.',
          code: null,
        },
      ],
      animationSteps: [
        { label: 'Migration',    description: 'Version-controlled schema change script',        highlight: false },
        { label: 'Nullable col', description: 'Add column nullable first - no table lock',      highlight: true  },
        { label: 'Backfill',     description: 'Fill existing rows in small batches',            highlight: true  },
        { label: 'Constraint',   description: 'Add NOT NULL constraint after backfill',         highlight: false },
        { label: 'Monitor',      description: 'Watch slow query log and replication lag',       highlight: false },
      ],
      example: 'GitHub has run thousands of database migrations on their production MySQL database with billions of rows and zero downtime. They use a tool called gh-ost (GitHub\'s Online Schema Migration) which copies the table to a shadow table with the new schema, applies changes in the background while the original table stays live, then swaps them atomically. This approach handles changes that would normally lock a 500GB table for hours.',
    },
  },

  // ── 11. Failure Cases ─────────────────────────────────────────────────────
  {
    order: 11, type: 'failureCases', title: 'Failure Cases',
    failureCases: [
      {
        title: 'Missing Index Causes Production Outage',
        scenario: 'An application runs fine in development with 1,000 users. It deploys to production. At 50,000 users, a query that searches orders by customer email starts taking 8 seconds. The query runs thousands of times per day. The database CPU hits 100%. The site becomes unresponsive.',
        impact: 'Full production outage. The query was always doing a full table scan - it just was not noticeable with small data. In production with millions of rows, the same query brings down the database.',
        resolution: 'Run EXPLAIN on slow queries during development with representative data volumes. Add indexes on columns used in WHERE clauses before going to production. Use a staging environment with production-scale data. Monitor the slow query log from day one.',
        animationSteps: [
          { label: 'Dev: fast',    description: '1K rows: full scan takes 0.1ms - unnoticed',   highlight: false },
          { label: 'Prod: slow',   description: '10M rows: full scan takes 8 seconds',          highlight: true  },
          { label: 'DB overload',  description: 'Thousands of 8s queries: CPU 100%',            highlight: true  },
          { label: 'Site down',    description: 'Application timeout waiting for queries',       highlight: false },
          { label: 'Fix: index',   description: 'CREATE INDEX: query drops to 1ms instantly',   highlight: false },
        ],
      },
      {
        title: 'Replication Lag Causes Stale Read After Write',
        scenario: 'User updates their profile photo. The write goes to the primary. Immediately after, the user\'s profile page is fetched - the read goes to a replica. The replica is 2 seconds behind the primary. The user sees their old photo and thinks the update failed. They submit the form again, creating a duplicate update.',
        impact: 'Data inconsistency and poor user experience. Users lose trust in the system. Duplicate writes can cause downstream issues in notifications or billing.',
        resolution: 'Read-your-own-writes consistency: after a write, read from the primary (or a specific replica) for that user for a short window (5-10 seconds). Store the primary\'s WAL position in the session and route reads to replicas that have caught up to that position. Or use sticky routing - route a user to the same replica consistently.',
        animationSteps: [
          { label: 'Write primary', description: 'Profile photo updated on Primary',            highlight: false },
          { label: 'Read replica',  description: 'Immediately read from Replica (2s lag)',      highlight: true  },
          { label: 'Stale data',    description: 'Replica returns old photo - not yet synced',  highlight: true  },
          { label: 'User confused', description: 'User sees old photo, submits again',          highlight: false },
          { label: 'Fix',          description: 'Read-your-writes: use primary briefly after write', highlight: false },
        ],
      },
      {
        title: 'Hot Shard Bottleneck',
        scenario: 'A social platform shards users by user ID ranges. A celebrity with 50 million followers is on Shard 3. Every time they post, 50 million notification queries hit Shard 3. Shards 1, 2, 4, and 5 are idle at 5% load while Shard 3 is at 100% CPU and unresponsive.',
        impact: 'All users on Shard 3 experience slow queries. The celebrity\'s activity degrades the experience for millions of unrelated users who happen to share the same shard.',
        resolution: 'Shard by activity level, not just ID range. Use consistent hashing with virtual nodes. For celebrity accounts, use a separate "hot account" strategy with dedicated shards or fan-out-on-read instead of fan-out-on-write. Monitor per-shard load and rebalance hot shards proactively.',
        animationSteps: [
          { label: 'Celebrity posts', description: 'Popular user on Shard 3 posts content',     highlight: false },
          { label: 'Fan-out',         description: '50M followers all query Shard 3',           highlight: true  },
          { label: 'Hot shard',       description: 'Shard 3 at 100% CPU - others idle',        highlight: true  },
          { label: 'Cascade',         description: 'All users on Shard 3 affected',             highlight: false },
          { label: 'Fix',             description: 'Dedicated shard or fan-out-on-read for VIPs', highlight: false },
        ],
      },
      {
        title: 'Transaction Deadlock Under Concurrent Load',
        scenario: 'Transaction A locks row 1 then tries to lock row 2. At the same time, Transaction B locks row 2 then tries to lock row 1. Both transactions wait for each other forever - a deadlock. The database detects this after a timeout (30 seconds) and rolls back one transaction, causing an error for that user.',
        impact: 'Users see random failures during high traffic. Difficult to reproduce locally. Causes customer support tickets and erodes trust.',
        resolution: 'Always acquire locks in the same consistent order across all transactions. Keep transactions as short as possible to reduce the window for deadlocks. Use optimistic locking (check a version number instead of locking) for read-heavy workflows. Set deadlock detection timeout low (5s not 30s) to fail fast.',
        animationSteps: [
          { label: 'TX A: lock 1',  description: 'Transaction A acquires lock on row 1',        highlight: false },
          { label: 'TX B: lock 2',  description: 'Transaction B acquires lock on row 2',        highlight: false },
          { label: 'TX A waits',    description: 'TX A tries row 2 - blocked by TX B',          highlight: true  },
          { label: 'Deadlock',      description: 'TX B tries row 1 - blocked by TX A: freeze',  highlight: true  },
          { label: 'Fix',           description: 'Always lock rows in same order: 1 then 2',    highlight: false },
        ],
      },
      {
        title: 'Migration Locks Table - Production Outage',
        scenario: 'An engineer runs ALTER TABLE to add a NOT NULL column on a 300 million row table during business hours. The ALTER requires a full table rewrite. It holds an exclusive lock on the table for 45 minutes. All reads and writes to that table time out. The site is down for 45 minutes.',
        impact: 'Unplanned 45-minute outage. All users affected. The migration that was supposed to be a routine 2-minute task causes a major incident.',
        resolution: 'Never run ALTER TABLE on large tables during business hours. Use online schema change tools (gh-ost, pt-online-schema-change) that avoid table locks. Add columns as nullable first, backfill in small batches with sleep between batches to avoid I/O spikes, then apply the NOT NULL constraint separately. Test migrations on a copy of production data first.',
        animationSteps: [
          { label: 'ALTER TABLE',   description: 'Run schema change on 300M row table',         highlight: true  },
          { label: 'Table locked',  description: 'Exclusive lock: all reads/writes blocked',    highlight: true  },
          { label: '45 min lock',   description: 'Full table rewrite takes 45 minutes',         highlight: true  },
          { label: 'Site down',     description: 'Every query times out - complete outage',     highlight: false },
          { label: 'Fix: gh-ost',   description: 'Online schema change: no lock, no downtime', highlight: false },
        ],
      },
    ],
  },

  // ── 12. Interview Questions ───────────────────────────────────────────────
  {
    order: 12, type: 'interview', title: 'Interview Discussion Questions',
    interviewQuestions: [
      {
        question: 'When would you choose PostgreSQL over MongoDB, and when would you choose MongoDB over PostgreSQL?',
        answer: 'PostgreSQL when: data has clear relationships (users, orders, products); you need complex queries with JOINs; ACID transactions are required (payments, medical records); or your schema is stable and well-defined. MongoDB when: documents vary significantly in structure per record (different product types with different attributes); you need flexible schema evolution; you are storing JSON-like hierarchical data that maps naturally to documents; or you need to scale writes horizontally. Default to PostgreSQL unless you have a specific reason to use MongoDB - it handles more use cases and most teams know SQL.',
        difficulty: 'medium',
      },
      {
        question: 'How do you design the data model for a Twitter-like system? Walk me through the key tables.',
        answer: 'Core tables: Users (id, username, email, bio, follower_count, following_count), Tweets (id, user_id FK, content, created_at, like_count, retweet_count), Follows (follower_id FK, following_id FK - composite PK), Likes (user_id FK, tweet_id FK, created_at). Denormalise follower_count and like_count as columns to avoid COUNT() on every read. Index tweets.user_id and tweets.created_at for timeline queries. The Follows table is the hardest part - it is a self-referential many-to-many on Users. At Twitter\'s scale, the home timeline is pre-computed via fan-out-on-write rather than queried with JOINs.',
        difficulty: 'hard',
      },
      {
        question: 'What is database normalization and when would you deliberately denormalize?',
        answer: 'Normalization eliminates data redundancy by ensuring each piece of information is stored in exactly one place. 3NF is the practical target: no column depends on another non-key column. Denormalize when: a query is called millions of times and JOIN cost dominates (cache the joined value directly); you need a count (store like_count as a column, update on like/unlike); you need to avoid JOINs for latency reasons in high-traffic paths. Always start normalized. Denormalize specific paths based on measured performance problems, not speculation.',
        difficulty: 'medium',
      },
      {
        question: 'Explain what ACID means and why it matters for financial transactions.',
        answer: 'Atomicity: the entire transaction succeeds or is fully rolled back - no half-transfers. Consistency: all constraints remain valid after the transaction - accounts cannot go below zero. Isolation: concurrent transactions see consistent state - two simultaneous transfers of the last $100 cannot both succeed. Durability: committed transactions survive crashes - a confirmed payment persists even if the server dies immediately after. Without ACID, you could charge a customer without crediting the merchant, double-charge for one order, or lose payment records on server crash. ACID is non-negotiable for financial systems.',
        difficulty: 'medium',
      },
      {
        question: 'Your database is running slow. Walk me through how you diagnose and fix it.',
        answer: 'First: check the slow query log - which queries take over 100ms? Second: run EXPLAIN ANALYZE on the slowest queries - look for full table scans (Seq Scan on large tables). Third: add missing indexes on columns in WHERE, JOIN, and ORDER BY clauses. Fourth: check for N+1 patterns in the application - use query logging to count queries per request. Fifth: check replication lag - reads from lagging replicas could be causing stale-read errors. Sixth: check connection count - near the connection limit causes queuing. Fix in this order: indexes first (free), then query structure, then caching, then read replicas, then sharding as a last resort.',
        difficulty: 'medium',
      },
      {
        question: 'What is the CAP theorem and how does it influence your database choice?',
        answer: 'CAP: in a distributed system you can guarantee at most two of Consistency (every read returns the latest write), Availability (every request gets a response), and Partition Tolerance (survives network splits). Since partitions always happen, choose CP or AP. CP databases (PostgreSQL, HBase) refuse requests when they cannot guarantee consistency - right for financial data, authentication, inventory. AP databases (Cassandra, DynamoDB) return potentially stale data but stay available - right for activity feeds, view counts, shopping carts. The choice is driven by: what is the real-world cost of serving stale data to a user?',
        difficulty: 'medium',
      },
      {
        question: 'How would you safely add a column to a table with 500 million rows in production?',
        answer: 'Never run a blocking ALTER TABLE during business hours on large tables. Step 1: add the column as nullable (ALTER TABLE ADD COLUMN status VARCHAR(20)) - this is instant in PostgreSQL 11+ and fast in MySQL. Step 2: backfill existing rows in batches of 10,000 with SLEEP(0.1) between batches to avoid I/O spikes. Step 3: once all rows have a value, add the NOT NULL constraint and default value separately. Or use gh-ost (GitHub) or pt-online-schema-change (Percona) which create a shadow copy of the table, apply the schema change to the shadow, then swap atomically with minimal lock time. Test the full migration against a production data size copy first.',
        difficulty: 'hard',
      },
      {
        question: 'Explain database sharding. When would you need it and what are the downsides?',
        answer: 'Sharding splits data across multiple independent database servers. Each server owns a subset of rows determined by the shard key (typically user ID or tenant ID). Use sharding when: a single server cannot handle the write volume, data exceeds what fits on one server, or read replicas are already maxed out. Downsides: cross-shard queries require scatter-gather (hit every shard, merge results); cross-shard transactions lose ACID guarantees; rebalancing shards when one grows too large is complex; application complexity increases significantly. Try caching, indexing, and read replicas before sharding - most applications never need it.',
        difficulty: 'hard',
      },
    ],
  },

  // ── 13. Quiz ─────────────────────────────────────────────────────────────
  {
    order: 13, type: 'quiz', title: 'Database Design Quiz',
    quizConfig: {
      timeLimitSeconds: 600, maxAttempts: 3, passingPercent: 70,
      questions: [
        {
          question: 'Your app stores blog posts where each post can have completely different custom fields (post type, video URL, recipe ingredients, etc.). Which database is the better fit?',
          options: ['PostgreSQL with a fixed schema', 'MongoDB with flexible document schema', 'Redis key-value store', 'Cassandra wide-column store'],
          correctIndex: 1, scenario: true,
          explanation: 'MongoDB. When documents vary significantly in structure per record, a flexible document schema is the right fit. PostgreSQL with a fixed schema would require either a very wide sparse table or a complex EAV pattern. MongoDB stores each post as a JSON document with whatever fields that specific post type needs.',
        },
        {
          question: 'A query searches users by email and runs 50,000 times per day. It currently takes 200ms. What is the first thing you should do?',
          options: ['Add more database servers', 'Add an index on the email column', 'Cache the results in Redis', 'Rewrite the query in a stored procedure'],
          correctIndex: 1, scenario: true,
          explanation: 'Add an index. A 200ms query on a column without an index is almost certainly doing a full table scan. CREATE INDEX idx_users_email ON users(email) will drop this to under 1ms instantly. Always check for missing indexes before adding hardware or caching complexity.',
        },
        {
          question: 'A bank transfer must debit Account A and credit Account B. If the credit fails after the debit succeeds, what ACID property ensures the debit is reversed?',
          options: ['Consistency', 'Isolation', 'Atomicity', 'Durability'],
          correctIndex: 2, scenario: true,
          explanation: 'Atomicity. A transaction is all-or-nothing. If any operation in the transaction fails, all operations are rolled back. The debit cannot persist without the credit succeeding. Atomicity prevents the database from ending up in a half-updated, inconsistent state.',
        },
        {
          question: 'You are designing a system where users can follow other users (like Twitter). How do you model the follower relationship?',
          options: ['Add a followers column to the Users table', 'A separate Follows table with (follower_id, following_id)', 'Store follower IDs as a JSON array in the Users table', 'Add a foreign key from User to User'],
          correctIndex: 1, scenario: false,
          explanation: 'A junction table. A user can follow many users and be followed by many users - this is a many-to-many self-referential relationship. It requires a separate Follows table with (follower_id, following_id) as a composite primary key. Arrays or JSON columns make querying followers/following extremely inefficient at scale.',
        },
        {
          question: 'Your read replicas are 3 seconds behind the primary. A user updates their email and immediately views their profile - they see the old email. What is this problem called?',
          options: ['Dirty read', 'Phantom read', 'Stale read after write (replication lag)', 'Lost update'],
          correctIndex: 2, scenario: true,
          explanation: 'Stale read after write due to replication lag. The write hit the primary, but the read hit a replica that hasn\'t received the update yet. Fix: implement read-your-writes consistency by routing reads to the primary (or a caught-up replica) for a short window after each write from the same user.',
        },
        {
          question: 'In the CAP theorem, what must every distributed database always guarantee?',
          options: ['Consistency', 'Availability', 'Partition Tolerance', 'Durability'],
          correctIndex: 2, scenario: false,
          explanation: 'Partition Tolerance. Network partitions always happen in distributed systems - you cannot design them away. So the real trade-off is between Consistency and Availability during a partition. CP systems refuse requests to stay consistent; AP systems serve potentially stale data to stay available.',
        },
        {
          question: 'You need to add a NOT NULL column to a table with 400 million rows in production. What is the safe approach?',
          options: ['Run ALTER TABLE during a maintenance window', 'Add nullable column first, backfill in batches, then add NOT NULL constraint', 'Delete and recreate the table with the new schema', 'Add the column directly - modern databases handle it automatically'],
          correctIndex: 1, scenario: true,
          explanation: 'Add nullable first, backfill, then constrain. Adding a NOT NULL column directly on a 400M row table can lock the table for 30-60 minutes. Adding it nullable is instant. Backfilling in small batches with sleep between them avoids I/O spikes. Only then add the NOT NULL constraint. Use gh-ost or pt-osc for zero-lock migrations on critical tables.',
        },
        {
          question: 'A Users table with 50M rows has full scans despite an index on (country, city). A query WHERE city = "London" does not use the index. Why?',
          options: ['The index is corrupt', 'The leftmost prefix rule: index on (country, city) requires filtering on country first', 'City values are not unique enough for the index to help', 'Indexes do not work on VARCHAR columns'],
          correctIndex: 1, scenario: true,
          explanation: 'Leftmost prefix rule. A composite index on (country, city) is only used when the query filters on country (the leftmost column) first. A query filtering only on city cannot use this index and falls back to a full scan. Solution: create a separate index on just (city), or reorder the composite index to (city, country) if city-only queries are more common.',
        },
        {
          question: 'Transaction A holds a lock on row 1 and waits for row 2. Transaction B holds row 2 and waits for row 1. What is this called and how do you prevent it?',
          options: ['Race condition - use more threads', 'Deadlock - always acquire locks in the same consistent order', 'Dirty read - use READ COMMITTED isolation', 'Phantom read - use SERIALIZABLE isolation'],
          correctIndex: 1, scenario: false,
          explanation: 'Deadlock. Two transactions are waiting for each other\'s locks, creating a cycle that never resolves. Prevention: always acquire locks in the same consistent order across all transactions (always lock row 1 before row 2). Keep transactions short to reduce the window. Use optimistic locking with version numbers to avoid holding locks during reads.',
        },
        {
          question: 'When should you use database sharding?',
          options: ['As soon as you have more than 1 million rows', 'Only after indexing, caching, and read replicas are not enough', 'Whenever you use a cloud database', 'When your queries are slow'],
          correctIndex: 1, scenario: false,
          explanation: 'Sharding is a last resort. It adds significant operational complexity: cross-shard queries, loss of cross-shard ACID, difficult rebalancing. The order of operations should be: fix queries and add indexes first, add a cache layer second, add read replicas third, then shard only when write throughput or data volume exceeds what a single primary can handle. Most applications never reach the point of needing sharding.',
        },
      ],
    },
  },
];

module.exports = DATABASE_DESIGN_MODULES;
