const express = require('express');
const { protect } = require('../middleware/auth');
const Module = require('../models/Module');
const Progress = require('../models/Progress');
const QuizAttempt = require('../models/QuizAttempt');
const { logActivity } = require('./learning');

const router = express.Router();

// ── GET /api/quiz/:moduleId ───────────────────────────────────────────────────
// Returns full quiz (WITH questions but WITHOUT correctIndex — sent only at submit)
router.get('/:moduleId', protect, async (req, res) => {
  try {
    const mod = await Module.findById(req.params.moduleId).lean();
    if (!mod || mod.type !== 'quiz') {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Count existing attempts for this user
    const attemptCount = await QuizAttempt.countDocuments({
      userId: req.user._id,
      moduleId: req.params.moduleId,
    });

    const { quizConfig } = mod;
    const attemptsRemaining = quizConfig.maxAttempts - attemptCount;

    // Check if already passed
    const passed = await QuizAttempt.findOne({
      userId: req.user._id,
      moduleId: req.params.moduleId,
      passed: true,
    });

    // Strip correctIndex and explanation from questions before sending
    const questions = (quizConfig.questions || []).map(q => ({
      question: q.question,
      options: q.options,
      scenario: q.scenario,
    }));

    res.json({
      moduleId: mod._id,
      title: mod.title,
      topicSlug: mod.topicSlug,
      timeLimitSeconds: quizConfig.timeLimitSeconds,
      maxAttempts: quizConfig.maxAttempts,
      passingPercent: quizConfig.passingPercent,
      attemptsTaken: attemptCount,
      attemptsRemaining,
      alreadyPassed: !!passed,
      questions,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ── POST /api/quiz/:moduleId/attempt ─────────────────────────────────────────
// Submit quiz answers, calculate score, record attempt
router.post('/:moduleId/attempt', protect, async (req, res) => {
  const { answers, timeTaken, flagged, flagCount } = req.body;

  try {
    const mod = await Module.findById(req.params.moduleId).lean();
    if (!mod || mod.type !== 'quiz') {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    const { quizConfig } = mod;

    // Check attempt limit
    const attemptCount = await QuizAttempt.countDocuments({
      userId: req.user._id,
      moduleId: req.params.moduleId,
    });

    if (attemptCount >= quizConfig.maxAttempts) {
      return res.status(403).json({ message: 'No attempts remaining' });
    }

    // Check if already passed — allow retake as long as attempts remain
    const alreadyPassed = await QuizAttempt.findOne({
      userId: req.user._id,
      moduleId: req.params.moduleId,
      passed: true,
    });

    // Block only if no attempts remaining
    if (attemptCount >= quizConfig.maxAttempts) {
      return res.status(403).json({ message: 'No attempts remaining' });
    }

    // Grade the answers
    const questions = quizConfig.questions || [];
    let correct = 0;
    const results = questions.map((q, i) => {
      const isCorrect = answers[i] === q.correctIndex;
      if (isCorrect) correct++;
      return {
        question: q.question,
        options: q.options,              // full options array so frontend can display them
        selected: answers[i],
        correctIndex: q.correctIndex,
        explanation: q.explanation,
        isCorrect,
      };
    });

    const score = Math.round((correct / questions.length) * 100);
    const passed = score >= quizConfig.passingPercent;

    // Save attempt
    const attempt = await QuizAttempt.create({
      userId: req.user._id,
      moduleId: req.params.moduleId,
      topicSlug: mod.topicSlug,
      attemptNumber: attemptCount + 1,
      answers,
      score,
      passed,
      flagged: !!flagged,
      flagCount: flagCount || 0,
      timeTaken,
      submittedAt: new Date(),
    });

    // If passed → mark quiz module as completed
    if (passed) {
      await Progress.findOneAndUpdate(
        { userId: req.user._id, moduleId: req.params.moduleId },
        {
          userId: req.user._id,
          moduleId: req.params.moduleId,
          topicSlug: mod.topicSlug,
          completedAt: new Date(),
        },
        { upsert: true }
      );
      await logActivity(req.user._id);
    }

    const attemptsRemaining = quizConfig.maxAttempts - (attemptCount + 1);

    res.json({
      score,
      passed,
      correct,
      total: questions.length,
      passingPercent: quizConfig.passingPercent,
      attemptsRemaining,
      flagged: !!flagged,
      results,   // full breakdown with explanations
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
