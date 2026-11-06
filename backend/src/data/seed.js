require('dotenv').config();
const mongoose = require('mongoose');
const Topic = require('../models/Topic');
const Module = require('../models/Module');
const CACHING_MODULES          = require('./cachingContent');
const SYSTEM_ARCHITECTURE_MODULES = require('./systemArchitectureContent');
const SCALABILITY_MODULES      = require('./scalabilityContent');
const LOAD_BALANCING_MODULES   = require('./loadBalancingContent');
const DATABASE_DESIGN_MODULES  = require('./databaseDesignContent');
const MICROSERVICES_MODULES    = require('./microservicesContent');
const API_GATEWAY_MODULES      = require('./apiGatewayContent');

const TOPICS = [
  { slug: 'caching',             title: 'Caching',             order: 1, locked: false, description: 'Master caching fundamentals, eviction policies, Redis, and distributed caching patterns.',                                                              modules: CACHING_MODULES },
  { slug: 'system-architecture', title: 'System Architecture', order: 2, locked: false, description: 'Understand architectural patterns, monolith vs microservices, scalability, distributed systems, and fault tolerance.',                               modules: SYSTEM_ARCHITECTURE_MODULES },
  { slug: 'scalability',         title: 'Scalability',         order: 3, locked: false, description: 'Vertical vs horizontal scaling, auto-scaling, capacity planning, bottleneck identification, and handling traffic spikes.',                            modules: SCALABILITY_MODULES },
  { slug: 'load-balancing',      title: 'Load Balancing',      order: 4, locked: false, description: 'Load balancing algorithms, Layer 4 vs Layer 7, consistent hashing, health checks, sticky sessions, and high availability.',                         modules: LOAD_BALANCING_MODULES },
  { slug: 'database-design',     title: 'Database Design',     order: 5, locked: false, description: 'SQL vs NoSQL, data modeling, normalization, indexing, replication, sharding, ACID transactions, and CAP theorem.',                                    modules: DATABASE_DESIGN_MODULES },
  { slug: 'microservices',       title: 'Microservices',       order: 6, locked: false, description: 'Service decomposition, inter-service communication, service discovery, data management, containerization, resilience, and observability.',            modules: MICROSERVICES_MODULES },
  { slug: 'api-gateway',         title: 'API Gateway',         order: 7, locked: false, description: 'API Gateway fundamentals, routing, authentication, rate limiting, transformation, aggregation, security, and monitoring.',                            modules: API_GATEWAY_MODULES },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    for (const topic of TOPICS) {
      // ── Upsert topic ────────────────────────────────────────────────────
      await Topic.findOneAndUpdate(
        { slug: topic.slug },
        {
          slug: topic.slug,
          title: topic.title,
          description: topic.description,
          order: topic.order,
          locked: topic.locked,
        },
        { upsert: true, new: true }
      );
      console.log(`Topic seeded: ${topic.slug}`);

      // ── Upsert each module ──────────────────────────────────────────────
      for (const mod of topic.modules) {
        await Module.findOneAndUpdate(
          { topicSlug: topic.slug, order: mod.order },
          { ...mod, topicSlug: topic.slug },
          { upsert: true, new: true }
        );
        console.log(`  Module seeded: order=${mod.order} "${mod.title}"`);
      }
    }

    console.log('\nSeed complete');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exit(1);
  }
};

seed();
