require('dotenv').config();
const mongoose = require('mongoose');
const Topic = require('../models/Topic');
const Module = require('../models/Module');
const CACHING_MODULES = require('./cachingContent');
const SYSTEM_ARCHITECTURE_MODULES = require('./systemArchitectureContent');
const SCALABILITY_MODULES = require('./scalabilityContent');

const TOPICS = [
  {
    slug: 'caching',
    title: 'Caching',
    description: 'Master caching fundamentals, eviction policies, Redis, and distributed caching patterns.',
    order: 1,
    locked: false,
    modules: CACHING_MODULES,
  },
  {
    slug: 'system-architecture',
    title: 'System Architecture',
    description: 'Understand architectural patterns, monolith vs microservices, scalability, distributed systems, and fault tolerance.',
    order: 2,
    locked: false,
    modules: SYSTEM_ARCHITECTURE_MODULES,
  },
  {
    slug: 'scalability',
    title: 'Scalability',
    description: 'Vertical vs horizontal scaling, auto-scaling, capacity planning, bottleneck identification, and handling traffic spikes.',
    order: 3,
    locked: false,
    modules: SCALABILITY_MODULES,
  },
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
