import { Model, Document, Types } from "mongoose";
import Performance from "../models/Performance";

// Define interfaces for the Performance document
interface IPerformance extends Document {
  performanceId: string;
  athleteUuid: string;
  isPrivate: boolean;
  // Add other performance-specific fields here
}

// Define interface for creating a new performance
interface CreatePerformanceInput {
  performanceId: string;
  athleteUuid: string;
  isPrivate?: boolean;
  // Add other required and optional fields
}

// Define interface for updating a performance
interface UpdatePerformanceInput {
  athleteUuid?: string;
  isPrivate?: boolean;
  // Add other updatable fields
}

class PerformanceController {
  private model: Model<IPerformance>;

  constructor() {
    this.model = Performance;
  }

  // Create new performance
  async createPerformance(
    performanceData: CreatePerformanceInput
  ): Promise<IPerformance> {
    try {
      const performance = new this.model(performanceData);
      await performance.save();
      return performance;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get performance by ID
  async getPerformanceById(
    performanceId: string
  ): Promise<IPerformance | null> {
    try {
      return await this.model.findOne({ performanceId });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Update performance
  async updatePerformance(
    performanceId: string,
    updateData: UpdatePerformanceInput
  ): Promise<IPerformance | null> {
    try {
      return await this.model.findOneAndUpdate({ performanceId }, updateData, {
        new: true,
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Delete performance
  async deletePerformance(performanceId: string): Promise<IPerformance | null> {
    try {
      return await this.model.findOneAndDelete({ performanceId });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get all performances for an athlete
  async getAthletePerformances(athleteUuid: string): Promise<IPerformance[]> {
    try {
      return await this.model.find({ athleteUuid });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Toggle performance privacy
  async togglePrivacy(performanceId: string): Promise<IPerformance | null> {
    try {
      const performance = await this.model.findOne({ performanceId });

      if (!performance) {
        return null;
      }

      performance.isPrivate = !performance.isPrivate;
      return await performance.save();
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Error handler helper
  private handleError(error: unknown): Error {
    if (error instanceof Error) {
      return error;
    }
    return new Error("An unknown error occurred");
  }
}

// Custom error class for Performance-related errors
export class PerformanceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PerformanceError";
  }
}

// Export singleton instance
export const performanceController = new PerformanceController();

// Export class for testing purposes
export default PerformanceController;