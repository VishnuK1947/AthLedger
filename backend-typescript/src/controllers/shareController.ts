import { Types } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { userController } from "./userController";
import { transactionController } from "./transactionController";
import { groupedPerformanceController } from "./groupedPerformanceController";
import { TransactionStatus } from "../models/Transaction";

interface ShareDataInput {
  senderUsername: string;
  clientUsername: string;
  dataName: string;
  amount: number;
  performanceIds: string[];
}

class ShareController {
  // Share performance data
  async shareData(shareData: ShareDataInput) {
    try {
      // 1. Get sender and client UUIDs from usernames
      const [sender, client] = await Promise.all([
        userController.getUserByUsername(shareData.senderUsername),
        userController.getUserByUsername(shareData.clientUsername)
      ]);

      if (!sender || !client) {
        throw new Error("Sender or client not found");
      }

      // 2. Create transaction
      const transactionId = `TXN-${uuidv4()}`;
      const transaction = await transactionController.createTransaction({
        transactionId,
        senderUuid: sender.uuid,
        clientUuid: client.uuid,
        status: TransactionStatus.PENDING,
        amount: shareData.amount,
        dataName: shareData.dataName
      });

      // 3. Create grouped performance
      const groupedPerformance = await groupedPerformanceController.createGroupedPerformance({
        transactionId: transaction.transactionId,
        dataName: shareData.dataName,
        performanceIds: shareData.performanceIds.map(id => new Types.ObjectId(id))
      });

      return {
        transaction,
        groupedPerformance
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Approve shared data transaction
  async approveSharing(transactionId: string) {
    try {
      const transaction = await transactionController.updateTransactionStatus(
        transactionId,
        TransactionStatus.APPROVED
      );

      if (!transaction) {
        throw new Error("Transaction not found");
      }

      // Update user revenue
      const sender = await userController.getUserByUuid(transaction.senderUuid);
      if (sender) {
        await userController.updateUser(sender.uuid, {
          revenueEarned: (sender.revenueEarned || 0) + transaction.amount
        });
      }

      return transaction;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Revoke shared data transaction
  async revokeSharing(transactionId: string) {
    try {
      const transaction = await transactionController.updateTransactionStatus(
        transactionId,
        TransactionStatus.REVOKED
      );

      if (!transaction) {
        throw new Error("Transaction not found");
      }

      // Remove grouped performance
      await groupedPerformanceController.deleteByTransactionId(transactionId);

      return transaction;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get all shared data for a user (both as sender and client)
  async getUserSharedData(userUuid: string) {
    try {
      const transactions = await transactionController.getUserTransactions(userUuid);
      
      // Get grouped performances for each transaction
      const sharedData = await Promise.all(
        transactions.map(async (transaction) => {
          const groupedPerformance = await groupedPerformanceController.getByTransactionId(
            transaction.transactionId
          );
          
          return {
            transaction,
            groupedPerformance
          };
        })
      );

      return sharedData;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: unknown): Error {
    if (error instanceof Error) {
      return error;
    }
    return new Error("An unknown error occurred in share controller");
  }
}

export const shareController = new ShareController();

// routes/shareRoutes.ts
import express, { Request, Response, Router } from "express";
import { shareController } from "../controllers/shareController";

const router: Router = express.Router();

// Share data endpoint
router.post("/", async (req: Request, res: Response) => {
  try {
    const result = await shareController.shareData(req.body);
    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    handleError(error, res);
  }
});

// Approve sharing
router.post("/:transactionId/approve", async (req: Request, res: Response) => {
  try {
    const result = await shareController.approveSharing(req.params.transactionId);
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    handleError(error, res);
  }
});

// Revoke sharing
router.post("/:transactionId/revoke", async (req: Request, res: Response) => {
  try {
    const result = await shareController.revokeSharing(req.params.transactionId);
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    handleError(error, res);
  }
});

// Get user's shared data
router.get("/user/:userUuid", async (req: Request, res: Response) => {
  try {
    const result = await shareController.getUserSharedData(req.params.userUuid);
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    handleError(error, res);
  }
});

const handleError = (error: unknown, res: Response): void => {
  console.error("Share route error:", error);
  
  if (error instanceof Error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
    return;
  }
  
  res.status(500).json({
    success: false,
    error: "Internal server error"
  });
};

export default router;

// Add to server.ts or app.ts
import shareRoutes from "./routes/shareRoutes";
app.use("/api/share", shareRoutes);