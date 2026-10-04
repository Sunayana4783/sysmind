require('dotenv').config();
const mongoose = require('mongoose');
const Topic = require('../models/Topic');
const Module = require('../models/Module');
const CACHING_MODULES = require('./cachingContent');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // ── Upsert the Caching topic ──────────────────────────────────────────
    await Topic.findOneAndUpdate(
      { slug: 'caching' },
      {
        slug: 'caching',
        title: 'Caching',
        description: 'Master caching fundamentals, eviction policies, Redis, and distributed caching patterns.',
        order: 1,
        locked: false,
      },
      { upsert: true, new: true }
    );
    console.log('Topic seeded: caching');

    // ── Upsert each module ─────────────────────────────────────────────────
    for (const mod of CACHING_MODULES) {
      await Module.findOneAndUpdate(
        { topicSlug: 'caching', order: mod.order },
        { ...mod, topicSlug: 'caching' },
        { upsert: true, new: true }
      );
      console.log(`Module seeded: order=${mod.order} "${mod.title}"`);
    }

    console.log('\n✅ Seed complete');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exit(1);
  }
};

seed();
