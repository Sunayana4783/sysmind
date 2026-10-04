const mongoose = require('mongoose');

// One document per user per calendar day — incremented on any learning action
const learningActivitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true },   // "YYYY-MM-DD" — easy to query by date
  count: { type: Number, default: 1 },      // number of actions that day
}, { timestamps: true });

learningActivitySchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('LearningActivity', learningActivitySchema);
