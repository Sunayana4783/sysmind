const mongoose = require('mongoose');

// A single learning step inside a topic (content / failureCases / interview / quiz)
const moduleSchema = new mongoose.Schema({
  topicSlug: { type: String, required: true, index: true },
  order: { type: Number, required: true },   // 1,2,3,4,5,6
  type: {
    type: String,
    enum: ['content', 'failureCases', 'interview', 'quiz'],
    required: true,
  },
  title: { type: String, required: true },

  // ── Content modules (type === 'content') ──────────────────────────────
  content: {
    overview: String,
    sections: [
      {
        heading: String,
        body: String,
        code: String,            // optional code block
        icon: String,            // emoji icon
      }
    ],
    keyPoints: [String],
    animationSteps: [           // reused from existing FlowAnimation
      {
        label: String,
        description: String,
        highlight: Boolean,
      }
    ],
    example: String,
  },

  // ── Failure Cases (type === 'failureCases') ───────────────────────────
  failureCases: [
    {
      title: String,
      icon: String,
      scenario: String,
      impact: String,
      resolution: String,
      animationSteps: [{ label: String, description: String, highlight: Boolean }],
    }
  ],

  // ── Interview questions (type === 'interview') ────────────────────────
  interviewQuestions: [
    {
      question: String,
      answer: String,
      icon: String,
      difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
    }
  ],

  // ── Quiz config (type === 'quiz') ─────────────────────────────────────
  quizConfig: {
    timeLimitSeconds: { type: Number, default: 600 },   // 10 min
    maxAttempts: { type: Number, default: 3 },
    passingPercent: { type: Number, default: 70 },
    questions: [
      {
        question: String,
        options: [String],
        correctIndex: Number,
        explanation: String,
        scenario: Boolean,       // true = real-world scenario question
      }
    ],
  },
}, { timestamps: true });

module.exports = mongoose.model('Module', moduleSchema);
