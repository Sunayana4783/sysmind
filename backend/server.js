require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');

const authRoutes     = require('./src/routes/auth');
const learningRoutes = require('./src/routes/learning');
const quizRoutes     = require('./src/routes/quiz');
const activityRoutes = require('./src/routes/activity');

const app = express();

connectDB();

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    // Allow localhost for development
    if (origin.startsWith('http://localhost')) return callback(null, true);
    // Allow all Vercel deployments for this project
    if (origin.includes('sysmind') && origin.includes('vercel.app')) return callback(null, true);
    // Allow the configured CLIENT_URL
    if (origin === process.env.CLIENT_URL) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth',     authRoutes);
app.use('/api/learning', learningRoutes);
app.use('/api/quiz',     quizRoutes);
app.use('/api/activity', activityRoutes);

// ── One-time seed endpoint (protected by SEED_SECRET env var) ────────────────
app.post('/api/admin/seed', async (req, res) => {
  const secret = req.headers['x-seed-secret'];
  if (!secret || secret !== process.env.SEED_SECRET) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  try {
    const Topic  = require('./src/models/Topic');
    const Module = require('./src/models/Module');
    const CACHING_MODULES = require('./src/data/cachingContent');
    const SA_MODULES      = require('./src/data/systemArchitectureContent');

    const TOPICS = [
      { slug: 'caching',             title: 'Caching',             order: 1, locked: false,
        description: 'Master caching fundamentals, eviction policies, Redis, and distributed caching patterns.',
        modules: CACHING_MODULES },
      { slug: 'system-architecture', title: 'System Architecture', order: 2, locked: false,
        description: 'Understand architectural patterns, monolith vs microservices, scalability, distributed systems, and fault tolerance.',
        modules: SA_MODULES },
    ];

    const log = [];
    for (const topic of TOPICS) {
      await Topic.findOneAndUpdate(
        { slug: topic.slug },
        { slug: topic.slug, title: topic.title, description: topic.description, order: topic.order, locked: topic.locked },
        { upsert: true, new: true }
      );
      log.push(`topic: ${topic.slug}`);
      for (const mod of topic.modules) {
        await Module.findOneAndUpdate(
          { topicSlug: topic.slug, order: mod.order },
          { ...mod, topicSlug: topic.slug },
          { upsert: true, new: true }
        );
        log.push(`  module ${mod.order}: ${mod.title}`);
      }
    }
    res.json({ ok: true, log });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use((req, res) => res.status(404).json({ message: 'Route not found' }));
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
