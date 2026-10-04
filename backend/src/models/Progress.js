const mongoose = require('mongoose');

// Tracks which modules a user has explicitly marked completed
const progressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  topicSlug: { type: String, required: true },
  moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true },
  completedAt: { type: Date, default: Date.now },
}, { timestamps: true });

// Unique per user+module — can't complete same module twice
progressSchema.index({ userId: 1, moduleId: 1 }, { unique: true });

module.exports = mongoose.model('Progress', progressSchema);
