const express = require('express');
const { protect } = require('../middleware/auth');
const LearningActivity = require('../models/LearningActivity');

const router = express.Router();

// Helper: YYYY-MM-DD from a Date using LOCAL time
const dateStr = (d) => {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};
const todayStr = () => dateStr(new Date());

// ── POST /api/activity/log ────────────────────────────────────────────────────
router.post('/log', protect, async (req, res) => {
  const today = todayStr();
  try {
    await LearningActivity.findOneAndUpdate(
      { userId: req.user._id, date: today },
      { $inc: { count: 1 } },
      { upsert: true, new: true }
    );
    res.json({ message: 'Activity logged', date: today });
  } catch (err) {
    console.error('Activity log error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ── GET /api/activity/streak ──────────────────────────────────────────────────
router.get('/streak', protect, async (req, res) => {
  try {
    const yearAgo = new Date();
    yearAgo.setDate(yearAgo.getDate() - 366);
    const yearAgoStr = dateStr(yearAgo);

    const activities = await LearningActivity.find({
      userId: req.user._id,
      date: { $gte: yearAgoStr },
    }).sort({ date: 1 }).lean();

    const activityMap = {};
    let total = 0;
    activities.forEach(a => {
      activityMap[a.date] = a.count;
      total += a.count;
    });

    const today = todayStr();

    // ── Current streak ────────────────────────────────────────────────────────
    let currentStreak = 0;
    for (let i = 0; i < 366; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const ds = dateStr(d);
      if (activityMap[ds]) {
        currentStreak++;
      } else {
        if (i === 0) continue; // no activity today yet — check yesterday
        break;
      }
    }

    // ── Longest streak ────────────────────────────────────────────────────────
    let longestStreak = 0;
    let tempStreak = 0;
    const sortedDates = Object.keys(activityMap).sort();
    for (let i = 0; i < sortedDates.length; i++) {
      if (i === 0) {
        tempStreak = 1;
      } else {
        const prev = new Date(sortedDates[i - 1] + 'T00:00:00');
        const curr = new Date(sortedDates[i] + 'T00:00:00');
        const diffDays = Math.round((curr - prev) / (1000 * 60 * 60 * 24));
        tempStreak = diffDays === 1 ? tempStreak + 1 : 1;
      }
      if (tempStreak > longestStreak) longestStreak = tempStreak;
    }

    res.json({ activityMap, total, currentStreak, longestStreak, today });
  } catch (err) {
    console.error('Streak error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
