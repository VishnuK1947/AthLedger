const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  transactionId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  senderUuid: {
    type: String,
    required: true,
    ref: 'User'
  },
  clientUuid: {
    type: String,
    required: true,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['approved', 'pending', 'revoked'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  dataName: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;