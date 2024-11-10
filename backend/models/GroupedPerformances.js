const mongoose = require('mongoose');

const groupedPerformanceSchema = new mongoose.Schema({
  transactionId: {
    type: String,
    required: true,
    unique: true,
    ref: 'Transaction'
  },
  dataName: {
    type: String,
    required: true
  },
  performanceIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Performance'
  }]
}, {
  timestamps: true
});

const GroupedPerformance = mongoose.model('GroupedPerformance', groupedPerformanceSchema);
module.exports = GroupedPerformance;