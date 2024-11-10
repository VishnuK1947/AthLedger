import express, { Request, Response, Router, NextFunction } from "express";
import { userController } from "../controllers/userController";
import { IUserInput } from "../models/User";

// Custom interfaces for request types
interface CreateUserRequest extends Request {
  body: IUserInput;
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
  const uuid = req.params.uuid;
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

// Validate email format
const validateEmail = (email: string): boolean => {
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return EMAIL_REGEX.test(email);
};

// Create user
router.post("/", async (req: CreateUserRequest, res: Response) => {
  try {
    const { email, username, walletId } = req.body;

    // Validate required fields
    if (!email || !username || !walletId) {
      throw new RouteError("Email, username, and walletId are required");
    }

    // Validate email format
    if (!validateEmail(email)) {
      throw new RouteError("Invalid email format");
    }

    // Validate username length
    if (username.length < 3) {
      throw new RouteError("Username must be at least 3 characters long");
    }

    const result = await userController.createUser(req.body);
    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    handleError(error, res);
  }
});

// Get user by UUID
router.get("/:uuid", validateUUID, async (req: Request, res: Response) => {
  try {
    const result = await userController.getUserByUuid(req.params.uuid);

    if (!result) {
      throw new RouteError(`User not found with UUID: ${req.params.uuid}`, 404);
    }

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    handleError(error, res);
  }
});

// Get all athletes
router.get("/athletes", async (_req: Request, res: Response) => {
  try {
    const result = await userController.getAthletes();

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    handleError(error, res);
  }
});

// Add update user endpoint
router.patch("/:uuid", validateUUID, async (req: Request, res: Response) => {
  try {
    // Prevent updating UUID
    if ("uuid" in req.body) {
      throw new RouteError("Cannot update UUID");
    }

    // Validate email if it's being updated
    if (req.body.email && !validateEmail(req.body.email)) {
      throw new RouteError("Invalid email format");
    }

    // Validate username if it's being updated
    if (req.body.username && req.body.username.length < 3) {
      throw new RouteError("Username must be at least 3 characters long");
    }

    const result = await userController.updateUser(req.params.uuid, req.body);

    if (!result) {
      throw new RouteError(`User not found with UUID: ${req.params.uuid}`, 404);
    }

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    handleError(error, res);
  }
});

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
      const field = error.message.includes("email") ? "email" : "username";
      res.status(409).json({
        success: false,
        error: `${field} already exists`,
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
