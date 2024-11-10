const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  uuid: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  revenueEarned: {
    type: Number,
    default: 0
  },
  isAthlete: {
    type: Boolean,
    required: true
  },
  walletId: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  publicMetrics: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Performance'
  }]
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);
module.exports = User;