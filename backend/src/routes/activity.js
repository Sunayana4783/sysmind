const express = require('express');
const { protect } = require('../middleware/auth');
const LearningActivity = require('../models/LearningActivity');

const router = express.Router();

// Helper: get today's date string in YYYY-MM-DD using local server time
const todayStr = () => {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

// Helper: format a Date object as YYYY-MM-DD
const dateStr = (d) => {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

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
    // Get all activity for the past 366 days
    const yearAgo = new Date();
    yearAgo.setDate(yearAgo.getDate() - 366);
    const yearAgoStr = dateStr(yearAgo);

    const activities = await LearningActivity.find({
      userId: req.user._id,
      date: { $gte: yearAgoStr },
    }).sort({ date: 1 }).lean();

    // Build date → count map and total
    const activityMap = {};
    let total = 0;
    activities.forEach(a => {
      activityMap[a.date] = a.count;
      total += a.count;
    });

    const today = todayStr();

    // ── Current streak: consecutive days ending today or yesterday ────────────
    let currentStreak = 0;
    const checkFrom = new Date();
    // If no activity today, start check from yesterday
    if (!activityMap[today]) {
      checkFrom.setDate(checkFrom.getDate() - 1);
    }
    for (let i = 0; i < 366; i++) {
      const d = new Date(checkFrom);
      d.setDate(d.getDate() - i);
      const ds = dateStr(d);
      if (activityMap[ds]) {
        currentStreak++;
      } else {
        break;
      }
    }

    // ── Longest streak: full scan of sorted dates ─────────────────────────────
    let longestStreak = 0;
    let tempStreak = 0;
    const sortedDates = Object.keys(activityMap).sort();
    for (let i = 0; i < sortedDates.length; i++) {
      if (i === 0) {
        tempStreak = 1;
      } else {
        const prev = new Date(sortedDates[i - 1]);
        const curr = new Date(sortedDates[i]);
        // Check if consecutive days (exactly 1 day apart)
        const diffMs = curr.getTime() - prev.getTime();
        const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          tempStreak++;
        } else {
          tempStreak = 1;
        }
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
