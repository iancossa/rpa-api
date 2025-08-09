const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  service: { type: String, required: true },
  action: { type: String, required: true },
  level: { type: String, enum: ['info', 'warn', 'error', 'debug'], required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, required: true },
  data: { type: Object, default: {} }
});

module.exports = mongoose.model('Log', logSchema);