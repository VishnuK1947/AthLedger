import express, { Request, Response, Router, NextFunction } from "express";
import { transactionController } from "../controllers/transactionController";
import { ITransactionInput, TransactionStatus } from "../models/Transaction";

// Custom interfaces for request types
interface CreateTransactionRequest extends Request {
  body: ITransactionInput;
}

interface UpdateTransactionStatusRequest extends Request {
  body: {
    status: TransactionStatus;
  };
}

// Custom error class for route handling
class RouteError extends Error {
  constructor(message: string, public statusCode: number = 400) {
    super(message);
    this.name = "RouteError";
  }
}

// Response interfaces for type safety
interface SuccessResponse<T> {
  success: true;
  data: T;
}

interface ErrorResponse {
  success: false;
  error: string;
  details?: string;
}

type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

// Create router instance
const router: Router = express.Router();

// Validation middleware
const validateUUID = (req: Request, res: Response, next: NextFunction) => {
  const uuid = req.params.userUuid;
  const UUID_REGEX =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  if (!UUID_REGEX.test(uuid)) {
    return res.status(400).json({
      success: false,
      error: "Invalid UUID format",
    });
  }
  next();
};

const validateTransactionId = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { transactionId } = req.params;
  if (!/^[A-Za-z0-9-_]+$/.test(transactionId)) {
    return res.status(400).json({
      success: false,
      error: "Invalid transaction ID format",
    });
  }
  next();
};

const validateTransactionStatus = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { status } = req.body;
  if (!Object.values(TransactionStatus).includes(status)) {
    return res.status(400).json({
      success: false,
      error: `Invalid status. Must be one of: ${Object.values(
        TransactionStatus
      ).join(", ")}`,
    });
  }
  next();
};

// Create transaction
router.post("/", async (req: CreateTransactionRequest, res: Response) => {
  try {
    const result = await transactionController.createTransaction(req.body);
    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    handleError(error, res);
  }
});

// Get transaction by ID
router.get(
  "/:transactionId",
  validateTransactionId,
  async (req: Request, res: Response) => {
    try {
      const result = await transactionController.getTransactionById(
        req.params.transactionId
      );

      if (!result) {
        throw new RouteError(
          `Transaction not found with ID: ${req.params.transactionId}`,
          404
        );
      }

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      handleError(error, res);
    }
  }
);

// Get transactions by user
router.get(
  "/user/:userUuid",
  validateUUID,
  async (req: Request, res: Response) => {
    try {
      const result = await transactionController.getUserTransactions(
        req.params.userUuid
      );

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      handleError(error, res);
    }
  }
);

// Update transaction status
router.put(
  "/:transactionId/status",
  validateTransactionId,
  validateTransactionStatus,
  async (req: UpdateTransactionStatusRequest, res: Response) => {
    try {
      const result = await transactionController.updateTransactionStatus(
        req.params.transactionId,
        req.body.status
      );

      if (!result) {
        throw new RouteError(
          `Transaction not found with ID: ${req.params.transactionId}`,
          404
        );
      }

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      handleError(error, res);
    }
  }
);

// Error handler helper function
const handleError = (error: unknown, res: Response): void => {
  if (error instanceof RouteError) {
    res.status(error.statusCode).json({
      success: false,
      error: error.message,
    });
    return;
  }

  console.error("Unexpected error:", error);

  if (error instanceof Error) {
    // Handle validation errors
    if (error.message.includes("validation failed")) {
      res.status(400).json({
        success: false,
        error: "Validation error",
        details: error.message,
      });
      return;
    }

    // Handle duplicate key errors
    if (error.message.includes("duplicate key")) {
      res.status(409).json({
        success: false,
        error: "Resource already exists",
      });
      return;
    }
  }

  res.status(500).json({
    success: false,
    error: "Internal server error",
  });
};

export default router;
