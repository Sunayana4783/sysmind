const mongoose = require('mongoose');

const quizAttemptSchema = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  moduleId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true },
  topicSlug: { type: String, required: true },

  attemptNumber: { type: Number, required: true },
  answers: [Number],          // selected option indices
  score: Number,              // percentage 0-100
  passed: Boolean,
  flagged: { type: Boolean, default: false },  // fullscreen exit detected
  flagCount: { type: Number, default: 0 },
  timeTaken: Number,          // seconds

  startedAt: { type: Date, default: Date.now },
  submittedAt: Date,
}, { timestamps: true });

module.exports = mongoose.model('QuizAttempt', quizAttemptSchema);
