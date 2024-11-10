import { Types, Model } from "mongoose";
import User, { IUser, IUserInput } from "../models/User";

// Custom error class for User-related errors
export class UserError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UserError";
  }
}

class UserController {
  private model: Model<IUser>;

  constructor() {
    this.model = User;
  }

  // Create a new user
  async createUser(userData: IUserInput): Promise<IUser> {
    try {
      const user = new this.model(userData);
      await user.save();
      return user;
    } catch (error) {
      throw this.handleError(error, "Error creating user");
    }
  }

  // Get user by UUID with populated public metrics
  async getUserByUuid(uuid: string): Promise<IUser | null> {
    try {
      const user = await this.model.findOne({ uuid }).populate({
        path: "publicMetrics",
        select: "-__v", // Exclude version key
      });

      return user;
    } catch (error) {
      throw this.handleError(error, "Error fetching user");
    }
  }

  // Update user
  async updateUser(
    uuid: string,
    updateData: Partial<Omit<IUserInput, "uuid">>
  ): Promise<IUser | null> {
    try {
      // Prevent updating the uuid
      if ("uuid" in updateData) {
        throw new UserError("Cannot update UUID");
      }

      const user = await this.model.findOneAndUpdate({ uuid }, updateData, {
        new: true,
        runValidators: true, // Run model validators on update
      });

      if (!user) {
        throw new UserError(`User with UUID ${uuid} not found`);
      }

      return user;
    } catch (error) {
      throw this.handleError(error, "Error updating user");
    }
  }

  // Delete user
  async deleteUser(uuid: string): Promise<IUser | null> {
    try {
      const user = await this.model.findOneAndDelete({ uuid });

      if (!user) {
        throw new UserError(`User with UUID ${uuid} not found`);
      }

      return user;
    } catch (error) {
      throw this.handleError(error, "Error deleting user");
    }
  }

  // Add performance to public metrics
  async addPublicMetric(
    uuid: string,
    performanceId: string | Types.ObjectId
  ): Promise<IUser | null> {
    try {
      // Convert string ID to ObjectId if necessary
      const perfId =
        typeof performanceId === "string"
          ? new Types.ObjectId(performanceId)
          : performanceId;

      // Check if the metric is already in the list
      const existingUser = await this.model.findOne({
        uuid,
        publicMetrics: perfId,
      });

      if (existingUser) {
        throw new UserError(
          "Performance metric already exists in public metrics"
        );
      }

      const user = await this.model.findOneAndUpdate(
        { uuid },
        { $push: { publicMetrics: perfId } },
        {
          new: true,
          runValidators: true,
        }
      );

      if (!user) {
        throw new UserError(`User with UUID ${uuid} not found`);
      }

      return user;
    } catch (error) {
      throw this.handleError(error, "Error adding public metric");
    }
  }

  // Remove performance from public metrics
  async removePublicMetric(
    uuid: string,
    performanceId: string | Types.ObjectId
  ): Promise<IUser | null> {
    try {
      const perfId =
        typeof performanceId === "string"
          ? new Types.ObjectId(performanceId)
          : performanceId;

      const user = await this.model.findOneAndUpdate(
        { uuid },
        { $pull: { publicMetrics: perfId } },
        {
          new: true,
          runValidators: true,
        }
      );

      if (!user) {
        throw new UserError(`User with UUID ${uuid} not found`);
      }

      return user;
    } catch (error) {
      throw this.handleError(error, "Error removing public metric");
    }
  }

  // Error handler helper
  private handleError(error: unknown, context: string): Error {
    if (error instanceof UserError) {
      return error;
    }
    if (error instanceof Error) {
      return new UserError(`${context}: ${error.message}`);
    }
    return new UserError(`${context}: Unknown error occurred`);
  }
}

// Export singleton instance
export const userController = new UserController();

// Export class for testing purposes
export default UserController;
