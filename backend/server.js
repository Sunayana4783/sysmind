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

app.post('/api/admin/seed', async (req, res) => {
  if (req.headers['x-seed-secret'] !== 'sysmind_seed_2024_run') return res.status(403).json({ message: 'Forbidden' });
  try {
    const Topic  = require('./src/models/Topic');
    const Module = require('./src/models/Module');
    const LB     = require('./src/data/loadBalancingContent');
    // Hard delete ALL load-balancing modules then re-insert clean
    await Module.deleteMany({ topicSlug: 'load-balancing' });
    await Topic.findOneAndUpdate({ slug: 'load-balancing' },
      { slug: 'load-balancing', title: 'Load Balancing', order: 4, locked: false,
        description: 'Load balancing algorithms, Layer 4 vs Layer 7, consistent hashing, health checks, sticky sessions, and high availability.' },
      { upsert: true, new: true });
    const log = [];
    for (const mod of LB) {
      const created = await Module.create({ ...mod, topicSlug: 'load-balancing' });
      log.push(created.order + ': ' + created.title);
    }
    res.json({ ok: true, count: log.length, log });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use((req, res) => res.status(404).json({ message: 'Route not found' }));
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
