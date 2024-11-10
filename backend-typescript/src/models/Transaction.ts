import mongoose, { Document, Schema, Model } from "mongoose";

// Enum for transaction status
export enum TransactionStatus {
  APPROVED = "approved",
  PENDING = "pending",
  REVOKED = "revoked",
}

// Interface for the Transaction document
export interface ITransaction extends Document {
  transactionId: string;
  senderUuid: string;
  clientUuid: string;
  status: TransactionStatus;
  amount: number;
  dataName: string;
  createdAt: Date;
  updatedAt: Date;
}

// Interface for creating a new Transaction (without document methods)
export interface ITransactionInput {
  transactionId: string;
  senderUuid: string;
  clientUuid: string;
  status: TransactionStatus;
  amount: number;
  dataName: string;
}

// Schema definition
const transactionSchema = new Schema<ITransaction>(
  {
    transactionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    senderUuid: {
      type: String,
      required: true,
      ref: "User",
    },
    clientUuid: {
      type: String,
      required: true,
      ref: "User",
    },
    status: {
      type: String,
      enum: Object.values(TransactionStatus),
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    dataName: {
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

// Add compound index for faster queries
transactionSchema.index({ senderUuid: 1, clientUuid: 1 });

// Add method to check if transaction can be updated
transactionSchema.methods.canUpdate = function (): boolean {
  return this.status === TransactionStatus.PENDING;
};

// Add method to approve transaction
transactionSchema.methods.approve = async function (): Promise<ITransaction> {
  if (!this.canUpdate()) {
    throw new Error("Transaction cannot be approved - invalid status");
  }
  this.status = TransactionStatus.APPROVED;
  return await this.save();
};

// Add method to revoke transaction
transactionSchema.methods.revoke = async function (): Promise<ITransaction> {
  if (!this.canUpdate()) {
    throw new Error("Transaction cannot be revoked - invalid status");
  }
  this.status = TransactionStatus.REVOKED;
  return await this.save();
};

// Add static method to find pending transactions
transactionSchema.statics.findPendingTransactions = function (): Promise<
  ITransaction[]
> {
  return this.find({ status: TransactionStatus.PENDING });
};

// Add static method to find transactions by user
transactionSchema.statics.findByUser = function (
  userUuid: string
): Promise<ITransaction[]> {
  return this.find({
    $or: [{ senderUuid: userUuid }, { clientUuid: userUuid }],
  });
};

// Middleware to validate amount
transactionSchema.pre("save", function (next) {
  if (this.amount <= 0) {
    next(new Error("Transaction amount must be greater than 0"));
  }
  next();
});

// Create and export the model
const Transaction: Model<ITransaction> = mongoose.model<ITransaction>(
  "Transaction",
  transactionSchema
);

export default Transaction;