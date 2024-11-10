// User.ts
import mongoose, { Document, Schema, Model, Types } from "mongoose";
import type { IPerformance } from "./Performance";

// Base interface for user data
export interface IUserBase {
  uuid: string;
  revenueEarned: number;
  isAthlete: boolean;
  walletId: string;
  username: string;
  email: string;
  publicMetrics: Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

// Document interface
export interface IUser extends Omit<IUserBase, 'publicMetrics'>, Document {
  publicMetrics: Types.ObjectId[] | IPerformance[];
  addRevenue(amount: number): Promise<IUser>;
  addPublicMetric(performanceId: Types.ObjectId): Promise<IUser>;
  removePublicMetric(performanceId: Types.ObjectId): Promise<IUser>;
}

// Input interface
export interface IUserInput extends Omit<IUserBase, 'publicMetrics' | 'revenueEarned' | 'createdAt' | 'updatedAt'> {
  revenueEarned?: number;
}

// Model interface
export interface IUserModel extends Model<IUser> {
  findAthleteByUsername(username: string): Promise<IUser | null>;
  findByEmailWithMetrics(email: string): Promise<IUser | null>;
}

const userSchema = new Schema<IUser>({
  uuid: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  revenueEarned: {
    type: Number,
    default: 0,
    min: [0, "Revenue earned cannot be negative"],
  },
  isAthlete: {
    type: Boolean,
    required: true,
  },
  walletId: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    trim: true,
    minlength: [3, "Username must be at least 3 characters long"],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      "Please provide a valid email address",
    ],
  },
  publicMetrics: [{
    type: Schema.Types.ObjectId,
    ref: "Performance",
  }],
}, {
  timestamps: true,
  toJSON: {
    transform: (_doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  },
});

// Instance methods
userSchema.methods.addRevenue = async function(this: IUser, amount: number): Promise<IUser> {
  if (amount < 0) throw new Error("Cannot add negative revenue");
  this.revenueEarned += amount;
  return await this.save();
};

userSchema.methods.addPublicMetric = async function(this: IUser, performanceId: Types.ObjectId): Promise<IUser> {
  if (!this.publicMetrics.includes(performanceId)) {
    this.publicMetrics.push(performanceId);
    return await this.save();
  }
  return this;
};

userSchema.methods.removePublicMetric = async function(this: IUser, performanceId: Types.ObjectId): Promise<IUser> {
  this.publicMetrics = this.publicMetrics.filter(
    (id) => id.toString() !== performanceId.toString()
  );
  return await this.save();
};

// Static methods
userSchema.statics.findAthleteByUsername = async function(
  this: IUserModel,
  username: string
): Promise<IUser | null> {
  return this.findOne({ username, isAthlete: true });
};

userSchema.statics.findByEmailWithMetrics = async function(
  this: IUserModel,
  email: string
): Promise<IUser | null> {
  return this.findOne({ email }).populate("publicMetrics");
};

// Add indexes
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ username: 1 });
userSchema.index({ isAthlete: 1 });

// Create and export the model
const User = mongoose.model<IUser, IUserModel>("User", userSchema);
export default User;