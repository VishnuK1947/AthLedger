import mongoose, { Document, Schema, Model } from "mongoose";

// Interface for the Performance document
export interface IPerformance extends Document {
  performanceId: string;
  athleteUuid: string;
  isPrivate: boolean;
  metricName: string;
  blockchainHash: string;
  createdAt: Date;
  updatedAt: Date;
}

// Interface for creating a new Performance (without the document methods)
export interface IPerformanceInput {
  performanceId: string;
  athleteUuid: string;
  isPrivate?: boolean;
  metricName: string;
  blockchainHash: string;
}

// Schema definition
const performanceSchema = new Schema<IPerformance>(
  {
    performanceId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    athleteUuid: {
      type: String,
      required: true,
      ref: "User",
    },
    isPrivate: {
      type: Boolean,
      required: true,
      default: true,
    },
    metricName: {
      type: String,
      required: true,
    },
    blockchainHash: {
      type: String,
      required: true,
    },
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

// Add any instance methods here
// performanceSchema.methods.someMethod = function(): Promise<void> {
//   // Method implementation
// };

// Add any static methods here
// performanceSchema.statics.someStaticMethod = function(): Promise<void> {
//   // Static method implementation
// };

// Create and export the model
const Performance: Model<IPerformance> = mongoose.model<IPerformance>(
  "Performance",
  performanceSchema
);

export default Performance;