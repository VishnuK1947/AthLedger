import mongoose, { Document, Schema, Model, Types } from "mongoose";
import { IPerformance } from "./Performance";

// Interface for the User document
export interface IUser extends Document {
  uuid: string;
  revenueEarned: number;
  isAthlete: boolean;
  walletId: string;
  username: string;
  email: string;
  publicMetrics: Types.ObjectId[] | IPerformance[];
  createdAt: Date;
  updatedAt: Date;

  // Instance methods
  addRevenue(amount: number): Promise<IUser>;
  addPublicMetric(performanceId: Types.ObjectId): Promise<IUser>;
  removePublicMetric(performanceId: Types.ObjectId): Promise<IUser>;
}

// Interface for creating a new User (without document methods)
export interface IUserInput {
  uuid: string;
  isAthlete: boolean;
  walletId: string;
  username: string;
  email: string;
  revenueEarned?: number;
  publicMetrics?: Types.ObjectId[];
}

// Schema definition
const userSchema = new Schema<IUser>(
  {
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
    publicMetrics: [
      {
        type: Schema.Types.ObjectId,
        ref: "Performance",
      },
    ],
  },
  {
    timestamps: true,

    // Add type checking for mongoose methods
    toJSON: {
      transform: (_doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Add indexes for common queries
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ username: 1 });
userSchema.index({ isAthlete: 1 });

// Instance method to add revenue
userSchema.methods.addRevenue = async function (
  amount: number
): Promise<IUser> {
  if (amount < 0) {
    throw new Error("Cannot add negative revenue");
  }
  this.revenueEarned += amount;
  return await this.save();
};

// Instance method to add a public metric
userSchema.methods.addPublicMetric = async function (
  performanceId: Types.ObjectId
): Promise<IUser> {
  if (!this.publicMetrics.includes(performanceId)) {
    this.publicMetrics.push(performanceId);
    return await this.save();
  }
  return this;
};

// Instance method to remove a public metric
userSchema.methods.removePublicMetric = async function (
  performanceId: Types.ObjectId
): Promise<IUser> {
  this.publicMetrics = this.publicMetrics.filter(
    (id) => id.toString() !== performanceId.toString()
  );
  return await this.save();
};

// Static method to find athlete by username
userSchema.statics.findAthleteByUsername = async function (
  username: string
): Promise<IUser | null> {
  return this.findOne({ username, isAthlete: true });
};

// Static method to find by email with public metrics
userSchema.statics.findByEmailWithMetrics = async function (
  email: string
): Promise<IUser | null> {
  return this.findOne({ email }).populate("publicMetrics");
};

// Middleware to validate email uniqueness
userSchema.pre("save", async function (next) {
  if (this.isModified("email")) {
    const existingUser = await this.constructor.findOne({ email: this.email });
    if (existingUser && existingUser.id !== this.id) {
      next(new Error("Email already exists"));
    }
  }
  next();
});

// Virtual for user's full profile
userSchema.virtual("fullProfile").get(function () {
  return {
    username: this.username,
    isAthlete: this.isAthlete,
    revenueEarned: this.revenueEarned,
    metricsCount: this.publicMetrics.length,
    memberSince: this.createdAt,
  };
});

// Create and export the model
const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default User;