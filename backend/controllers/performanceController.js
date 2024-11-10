const Performance = require('../models/Performance');

const performanceController = {
  // Create new performance
  async createPerformance(performanceData) {
    try {
      const performance = new Performance(performanceData);
      await performance.save();
      return performance;
    } catch (error) {
      throw error;
    }
  },

  // Get performance by ID
  async getPerformanceById(performanceId) {
    try {
      return await Performance.findOne({ performanceId });
    } catch (error) {
      throw error;
    }
  },

  // Update performance
  async updatePerformance(performanceId, updateData) {
    try {
      return await Performance.findOneAndUpdate(
        { performanceId },
        updateData,
        { new: true }
      );
    } catch (error) {
      throw error;
    }
  },

  // Delete performance
  async deletePerformance(performanceId) {
    try {
      return await Performance.findOneAndDelete({ performanceId });
    } catch (error) {
      throw error;
    }
  },

  // Get all performances for an athlete
  async getAthletePerformances(athleteUuid) {
    try {
      return await Performance.find({ athleteUuid });
    } catch (error) {
      throw error;
    }
  },

  // Toggle performance privacy
  async togglePrivacy(performanceId) {
    try {
      const performance = await Performance.findOne({ performanceId });
      performance.isPrivate = !performance.isPrivate;
      return await performance.save();
    } catch (error) {
      throw error;
    }
  }
};

module.exports = performanceController;