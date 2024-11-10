const User = require('../models/User');

const userController = {
  // Create a new user
  async createUser(userData) {
    try {
      const user = new User(userData);
      await user.save();
      return user;
    } catch (error) {
      throw error;
    }
  },

  // Get user by UUID
  async getUserByUuid(uuid) {
    try {
      return await User.findOne({ uuid }).populate('publicMetrics');
    } catch (error) {
      throw error;
    }
  },

  // Update user
  async updateUser(uuid, updateData) {
    try {
      return await User.findOneAndUpdate(
        { uuid },
        updateData,
        { new: true }
      );
    } catch (error) {
      throw error;
    }
  },

  // Delete user
  async deleteUser(uuid) {
    try {
      return await User.findOneAndDelete({ uuid });
    } catch (error) {
      throw error;
    }
  },

  // Add performance to public metrics
  async addPublicMetric(uuid, performanceId) {
    try {
      return await User.findOneAndUpdate(
        { uuid },
        { $push: { publicMetrics: performanceId } },
        { new: true }
      );
    } catch (error) {
      throw error;
    }
  }
};

module.exports = userController;