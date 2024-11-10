import express, { Request, Response, Router } from "express";
import { groupedPerformanceController } from "../controllers/groupedPerformanceController";
import { IGroupedPerformanceInput } from "../models/GroupedPerformance";

// Custom interfaces for request types
interface CreateGroupedPerformanceRequest extends Request {
  body: IGroupedPerformanceInput;
}

interface AddPerformanceRequest extends Request {
  body: {
    performanceId: string;
  };
}

// Custom error class for route handling
class RouteError extends Error {
  constructor(message: string, public statusCode: number = 400) {
    super(message);
    this.name = "RouteError";
  }
}

// Create router instance
const router: Router = express.Router();

// Create grouped performances
router.post(
  "/",
  async (req: CreateGroupedPerformanceRequest, res: Response) => {
    try {
      const result =
        await groupedPerformanceController.createGroupedPerformance(req.body);
      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      handleError(error, res);
    }
  }
);

// Get grouped performances by transaction ID
router.get("/:transactionId", async (req: Request, res: Response) => {
  try {
    const result = await groupedPerformanceController.getByTransactionId(
      req.params.transactionId
    );

    if (!result) {
      throw new RouteError(
        `No grouped performance found for transaction ID: ${req.params.transactionId}`,
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
});

// Get grouped performances by data name
router.get("/data/:dataName", async (req: Request, res: Response) => {
  try {
    const result =
      await groupedPerformanceController.getGroupedPerformancesByDataName(
        req.params.dataName
      );

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    handleError(error, res);
  }
});

// Add performance to group
router.post(
  "/:transactionId/performances",
  async (req: AddPerformanceRequest, res: Response) => {
    try {
      if (!req.body.performanceId) {
        throw new RouteError("Performance ID is required");
      }

      const result = await groupedPerformanceController.addPerformance(
        req.params.transactionId,
        req.body.performanceId
      );

      if (!result) {
        throw new RouteError(
          `No grouped performance found for transaction ID: ${req.params.transactionId}`,
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

// Remove performance from group
router.delete(
  "/:transactionId/performances/:performanceId",
  async (req: Request, res: Response) => {
    try {
      const result = await groupedPerformanceController.removePerformance(
        req.params.transactionId,
        req.params.performanceId
      );

      if (!result) {
        throw new RouteError(
          `No grouped performance found for transaction ID: ${req.params.transactionId}`,
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
  res.status(500).json({
    success: false,
    error: "Internal server error",
  });
};

// Middleware to validate ObjectId parameters
const validateObjectId = (paramName: string) => {
  return (req: Request, res: Response, next: Function) => {
    const id = req.params[paramName];
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      res.status(400).json({
        success: false,
        error: `Invalid ${paramName} format`,
      });
      return;
    }
    next();
  };
};

export default router;
