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
    const Topic = require('./src/models/Topic');
    const Module = require('./src/models/Module');
    const RT = require('./src/data/realtimeStreamingContent');
    await Module.deleteMany({ topicSlug: 'realtime-streaming' });
    await Topic.findOneAndUpdate({ slug: 'realtime-streaming' },
      { slug: 'realtime-streaming', title: 'Real-Time and Streaming', order: 13, locked: false,
        description: 'WebSockets, SSE, Kafka Streams, Flink, event streaming, windows, event-time vs processing-time.' },
      { upsert: true, new: true });
    const log = [];
    for (const mod of RT) {
      await Module.create({ ...mod, topicSlug: 'realtime-streaming' });
      log.push(mod.order + ': ' + mod.title);
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
