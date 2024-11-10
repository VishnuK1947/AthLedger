const GroupedPerformance = require('../models/GroupedPerformances');

const groupedPerformanceController = {
  // Create new grouped performance
  async createGroupedPerformance(groupData) {
    try {
      const groupedPerf = new GroupedPerformance(groupData);
      await groupedPerf.save();
      return groupedPerf;
    } catch (error) {
      throw error;
    }
  },

  // Get grouped performance by transaction ID
  async getByTransactionId(transactionId) {
    try {
      return await GroupedPerformance.findOne({ transactionId })
        .populate('performanceIds');
    } catch (error) {
      throw error;
    }
  },

  // Add performance to group
  async addPerformance(transactionId, performanceId) {
    try {
      return await GroupedPerformance.findOneAndUpdate(
        { transactionId },
        { $push: { performanceIds: performanceId } },
        { new: true }
      );
    } catch (error) {
      throw error;
    }
  },

  // Remove performance from group
  async removePerformance(transactionId, performanceId) {
    try {
      return await GroupedPerformance.findOneAndUpdate(
        { transactionId },
        { $pull: { performanceIds: performanceId } },
        { new: true }
      );
    } catch (error) {
      throw error;
    }
  }
};

module.exports = groupedPerformanceController;