// Performance.ts
import mongoose, { Document, Schema, Model } from "mongoose";

// Base interface for performance data
export interface IPerformanceBase {
  performanceId: string;
  athleteUuid: string;
  isPrivate: boolean;
  metricName: string;
  blockchainHash: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Document interface
export interface IPerformance extends IPerformanceBase, Document {}

// Input interface
export interface IPerformanceInput extends Omit<IPerformanceBase, 'createdAt' | 'updatedAt'> {}

// Model interface
export interface IPerformanceModel extends Model<IPerformance> {}

// Schema
const performanceSchema = new Schema<IPerformance>({
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

// Create and export the model
const Performance = mongoose.model<IPerformance, IPerformanceModel>("Performance", performanceSchema);
export default Performance;
