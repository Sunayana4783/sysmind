const express = require('express');
const { protect } = require('../middleware/auth');
const Topic = require('../models/Topic');
const Module = require('../models/Module');
const Progress = require('../models/Progress');
const LearningActivity = require('../models/LearningActivity');

const router = express.Router();

// ── Helper: log a learning activity for today ─────────────────────────────────
const logActivity = async (userId) => {
  const d = new Date();
  const today = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  try {
    await LearningActivity.findOneAndUpdate(
      { userId, date: today },
      { $inc: { count: 1 } },
      { upsert: true, new: true }
    );
  } catch (_) { /* non-critical */ }
};

// ── GET /api/learning/topics ──────────────────────────────────────────────────
// Returns all topics
router.get('/topics', protect, async (req, res) => {
  try {
    const topics = await Topic.find().sort({ order: 1 });
    res.json({ topics });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ── GET /api/learning/topics/:slug/modules ────────────────────────────────────
// Returns all modules for a topic (quiz questions stripped — fetched separately)
router.get('/topics/:slug/modules', protect, async (req, res) => {
  try {
    const modules = await Module.find({ topicSlug: req.params.slug })
      .sort({ order: 1 })
      .lean();

    // Strip quiz answers/correctIndex from module list response
    const safe = modules.map(m => {
      if (m.type === 'quiz' && m.quizConfig) {
        return {
          ...m,
          quizConfig: {
            timeLimitSeconds: m.quizConfig.timeLimitSeconds,
            maxAttempts: m.quizConfig.maxAttempts,
            passingPercent: m.quizConfig.passingPercent,
            questionCount: m.quizConfig.questions?.length || 0,
          },
        };
      }
      return m;
    });

    res.json({ modules: safe });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ── GET /api/learning/topics/:slug/progress ───────────────────────────────────
// Returns user's completed module IDs for a topic
router.get('/topics/:slug/progress', protect, async (req, res) => {
  try {
    const records = await Progress.find({
      userId: req.user._id,
      topicSlug: req.params.slug,
    }).lean();

    const completedModuleIds = records.map(r => r.moduleId.toString());
    res.json({ completedModuleIds });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ── POST /api/learning/progress/complete ─────────────────────────────────────
// Mark a module as completed (user must explicitly click the button)
router.post('/progress/complete', protect, async (req, res) => {
  const { moduleId, topicSlug } = req.body;
  if (!moduleId || !topicSlug) {
    return res.status(400).json({ message: 'moduleId and topicSlug are required' });
  }

  try {
    // Upsert — idempotent, clicking twice won't create duplicates
    await Progress.findOneAndUpdate(
      { userId: req.user._id, moduleId },
      { userId: req.user._id, moduleId, topicSlug, completedAt: new Date() },
      { upsert: true, new: true }
    );

    // Log learning activity
    await logActivity(req.user._id);

    res.json({ message: 'Module marked as completed' });
  } catch (err) {
    if (err.code === 11000) {
      return res.json({ message: 'Already completed' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
module.exports.logActivity = logActivity;
