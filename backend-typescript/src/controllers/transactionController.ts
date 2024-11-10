import { Model, Document } from "mongoose";
import Transaction from "../models/Transaction";

// Define possible transaction status values
export enum TransactionStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED",
  // Add other status values as needed
}

// Define interface for the Transaction document
interface ITransaction extends Document {
  transactionId: string;
  senderUuid: string;
  clientUuid: string;
  status: TransactionStatus;
  createdAt: Date;
  updatedAt: Date;
  // Add other transaction-specific fields here
}

// Define interface for creating a new transaction
interface CreateTransactionInput {
  transactionId: string;
  senderUuid: string;
  clientUuid: string;
  status?: TransactionStatus;
  // Add other fields needed for creation
}

// Custom error class for Transaction-related errors
export class TransactionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TransactionError";
  }
}

class TransactionController {
  private model: Model<ITransaction>;

  constructor() {
    this.model = Transaction;
  }

  // Create new transaction
  async createTransaction(
    transactionData: CreateTransactionInput
  ): Promise<ITransaction> {
    try {
      const transaction = new this.model({
        ...transactionData,
        status: transactionData.status || TransactionStatus.PENDING,
      });
      await transaction.save();
      return transaction;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get transaction by ID
  async getTransactionById(
    transactionId: string
  ): Promise<ITransaction | null> {
    try {
      return await this.model.findOne({ transactionId });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Update transaction status
  async updateTransactionStatus(
    transactionId: string,
    status: TransactionStatus
  ): Promise<ITransaction | null> {
    try {
      const transaction = await this.model.findOneAndUpdate(
        { transactionId },
        { status },
        { new: true }
      );

      if (!transaction) {
        throw new TransactionError(
          `Transaction with ID ${transactionId} not found`
        );
      }

      return transaction;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Delete transaction
  async deleteTransaction(transactionId: string): Promise<ITransaction | null> {
    try {
      const transaction = await this.model.findOneAndDelete({ transactionId });

      if (!transaction) {
        throw new TransactionError(
          `Transaction with ID ${transactionId} not found`
        );
      }

      return transaction;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get all transactions for a user (as sender or client)
  async getUserTransactions(userUuid: string): Promise<ITransaction[]> {
    try {
      return await this.model.find({
        $or: [{ senderUuid: userUuid }, { clientUuid: userUuid }],
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Error handler helper
  private handleError(error: unknown): Error {
    if (error instanceof TransactionError) {
      return error;
    }
    if (error instanceof Error) {
      return new TransactionError(error.message);
    }
    return new TransactionError("An unknown error occurred");
  }
}

// Export singleton instance
export const transactionController = new TransactionController();

// Export class for testing purposes
export default TransactionController;