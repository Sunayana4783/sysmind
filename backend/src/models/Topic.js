const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true }, // e.g. "caching"
  title: { type: String, required: true },              // e.g. "Caching"
  description: { type: String },
  order: { type: Number, default: 0 },
  locked: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Topic', topicSchema);
