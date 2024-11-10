import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
// Change in server.ts
import { ILayer } from "express-serve-static-core";

// Import routes
import userRoutes from "./routes/userRoutes";
import performanceRoutes from "./routes/performanceRoutes";
import transactionRoutes from "./routes/transactionRoutes";
import groupedPerformanceRoutes from "./routes/groupedPerformanceRoutes";

// Load environment variables
dotenv.config();

// Custom error class for application errors
class ApplicationError extends Error {
  constructor(message: string, public statusCode: number = 500) {
    super(message);
    this.name = "ApplicationError";
  }
}

// Interface for environment variables
interface EnvironmentVariables {
  NODE_ENV: string;
  MONGODB_URI: string;
  PORT: string | number;
}

// Type guard for environment variables
const validateEnv = (): EnvironmentVariables => {
  if (!process.env.MONGODB_URI) {
    throw new ApplicationError(
      "MONGODB_URI is required in environment variables"
    );
  }

  return {
    NODE_ENV: process.env.NODE_ENV || "development",
    MONGODB_URI: process.env.MONGODB_URI,
    PORT: process.env.PORT || 5001,
  };
};

// Response interfaces
interface HealthCheckResponse {
  status: string;
  environment: string;
  database: string;
}

interface ApiInfoResponse {
  message: string;
  status: string;
  endpoints: {
    users: string;
    performance: string;
    transactions: string;
    groupedPerformances: string;
  };
}

// Initialize express
const app: Express = express();

// Validate environment variables
const env = validateEnv();

// Log environment
console.log("NODE_ENV:", env.NODE_ENV);

// Connect to MongoDB Atlas
mongoose
  .connect(env.MONGODB_URI)
  .then(() => {
    console.log("Successfully connected to MongoDB Atlas!");
  })
  .catch((error: Error) => {
    console.error("Error connecting to MongoDB Atlas:", error);
    process.exit(1);
  });

// Middleware
app.use(cors());
app.use(express.json());

// Debug route registration
console.log("Registering routes...");

// Routes
app.use("/api/users", userRoutes);
app.use("/api/performance", performanceRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/grouped-performances", groupedPerformanceRoutes);

// Health check route
app.get("/health", (_req: Request, res: Response) => {
  const healthCheck: HealthCheckResponse = {
    status: "OK",
    environment: env.NODE_ENV,
    database:
      mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
  };
  res.status(200).json(healthCheck);
});

// Root route with API information
app.get("/", (_req: Request, res: Response) => {
  const apiInfo: ApiInfoResponse = {
    message: "Welcome to Athledger API",
    status: "Running",
    endpoints: {
      users: "/api/users",
      performance: "/api/performance",
      transactions: "/api/transactions",
      groupedPerformances: "/api/grouped-performances",
    },
  };
  res.json(apiInfo);
});

// Error handling middleware
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);

  if (err instanceof ApplicationError) {
    res.status(err.statusCode).json({
      success: false,
      error: err.message,
    });
    return;
  }

  res.status(500).json({
    success: false,
    error: "Internal server error",
  });
});

// Handle 404
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
  });
});

// Start server
const server = app.listen(env.PORT, () => {
  console.log(`Server running on port ${env.PORT}`);
  console.log(`Server ready at http://localhost:${env.PORT}`);

  // Log registered routes for debugging
  console.log("\nRegistered Routes:");
  app._router.stack.forEach((r: ILayer) => {
    if (r.route && r.route.path) {
      Object.keys(r.route.methods).forEach((method) => {
        console.log(`${method.toUpperCase()} ${r.route.path}`);
      });
    }
  });
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received. Closing server...");
  server.close(() => {
    console.log("Server closed");
    mongoose.connection.close(false).then(() => {
      console.log("MongoDB connection closed");
      process.exit(0);
    });
  });
});

export default app;