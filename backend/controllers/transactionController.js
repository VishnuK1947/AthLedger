const Transaction = require('../models/Transaction');

const transactionController = {
  // Create new transaction
  async createTransaction(transactionData) {
    try {
      const transaction = new Transaction(transactionData);
      await transaction.save();
      return transaction;
    } catch (error) {
      throw error;
    }
  },

  // Get transaction by ID
  async getTransactionById(transactionId) {
    try {
      return await Transaction.findOne({ transactionId });
    } catch (error) {
      throw error;
    }
  },

  // Update transaction status
  async updateTransactionStatus(transactionId, status) {
    try {
      return await Transaction.findOneAndUpdate(
        { transactionId },
        { status },
        { new: true }
      );
    } catch (error) {
      throw error;
    }
  },

  // Delete transaction
  async deleteTransaction(transactionId) {
    try {
      return await Transaction.findOneAndDelete({ transactionId });
    } catch (error) {
      throw error;
    }
  },

  // Get all transactions for a user (as sender or client)
  async getUserTransactions(userUuid) {
    try {
      return await Transaction.find({
        $or: [
          { senderUuid: userUuid },
          { clientUuid: userUuid }
        ]
      });
    } catch (error) {
      throw error;
    }
  }
};

module.exports = transactionController;