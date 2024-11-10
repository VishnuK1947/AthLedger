const mongoose = require('mongoose');

const performanceSchema = new mongoose.Schema({
  performanceId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  athleteUuid: {
    type: String,
    required: true,
    ref: 'User'
  },
  isPrivate: {
    type: Boolean,
    required: true,
    default: true
  },
  metricName: {
    type: String,
    required: true
  },
  blockchainHash: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

const Performance = mongoose.model('Performance', performanceSchema);
module.exports = Performance;