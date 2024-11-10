import mongoose, { Document, Schema, Model, Types } from "mongoose";
import { IPerformance } from "./Performance";

// Interface for the GroupedPerformance document
export interface IGroupedPerformance extends Document {
  transactionId: string;
  dataName: string;
  performanceIds: Types.ObjectId[] | IPerformance[];
  createdAt: Date;
  updatedAt: Date;
}

// Interface for creating a new GroupedPerformance (without document methods)
export interface IGroupedPerformanceInput {
  transactionId: string;
  dataName: string;
  performanceIds?: Types.ObjectId[];
}

// Schema definition
const groupedPerformanceSchema = new Schema<IGroupedPerformance>(
  {
    transactionId: {
      type: String,
      required: true,
      unique: true,
      ref: "Transaction",
      index: true,
    },
    dataName: {
      type: String,
      required: true,
    },
    performanceIds: [
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

// Add index for faster queries
groupedPerformanceSchema.index({ transactionId: 1 });

// Virtual populate setup example (uncomment if needed)
// groupedPerformanceSchema.virtual('performances', {
//   ref: 'Performance',
//   localField: 'performanceIds',
//   foreignField: '_id'
// });

// Add methods to check if a performance is already in the group
groupedPerformanceSchema.methods.hasPerformance = function (
  performanceId: Types.ObjectId | string
): boolean {
  return this.performanceIds.some(
    (id: Types.ObjectId) => id.toString() === performanceId.toString()
  );
};

// Add static method to find by transaction ID with populated performances
groupedPerformanceSchema.statics.findByTransactionId = async function (
  transactionId: string
): Promise<IGroupedPerformance | null> {
  return this.findOne({ transactionId }).populate("performanceIds");
};

// Create and export the model
const GroupedPerformance: Model<IGroupedPerformance> =
  mongoose.model<IGroupedPerformance>(
    "GroupedPerformance",
    groupedPerformanceSchema
  );

export default GroupedPerformance;