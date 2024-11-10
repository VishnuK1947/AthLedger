import express, { Request, Response, Router, NextFunction } from 'express';
import { performanceController } from '../controllers/performanceController';
import { IPerformanceInput } from '../models/Performance';

// Custom interfaces for request types
interface CreatePerformanceRequest extends Request {
  body: IPerformanceInput;
}

// Custom error class for route handling
class RouteError extends Error {
  constructor(
    message: string,
    public statusCode: number = 400
  ) {
    super(message);
    this.name = 'RouteError';
  }
}

// Create router instance
const router: Router = express.Router();

// Validation middleware
const validateUUID = (req: Request, res: Response, next: NextFunction) => {
  const uuid = req.params.athleteUuid;
  const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  
  if (!UUID_REGEX.test(uuid)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid UUID format'
    });
  }
  next();
};

const validatePerformanceId = (req: Request, res: Response, next: NextFunction) => {
  const { performanceId } = req.params;
  if (!/^[A-Za-z0-9-_]+$/.test(performanceId)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid performance ID format'
    });
  }
  next();
};

// Create performance
router.post('/', async (req: CreatePerformanceRequest, res: Response) => {
  try {
    const result = await performanceController.createPerformance(req.body);
    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    handleError(error, res);
  }
});

// Get performance by ID
router.get('/:performanceId', 
  validatePerformanceId,
  async (req: Request, res: Response) => {
    try {
      const result = await performanceController.getPerformanceById(
        req.params.performanceId
      );

      if (!result) {
        throw new RouteError(`Performance not found with ID: ${req.params.performanceId}`, 404);
      }

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      handleError(error, res);
    }
});

// Get performances by athlete
router.get('/athlete/:athleteUuid',
  validateUUID,
  async (req: Request, res: Response) => {
    try {
      const result = await performanceController.getAthletePerformances(
        req.params.athleteUuid
      );

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      handleError(error, res);
    }
});

// Get public performances by athlete
router.get('/athlete/:athleteUuid/public',
  validateUUID,
  async (req: Request, res: Response) => {
    try {
      const result = await performanceController.getPublicPerformancesByAthlete(
        req.params.athleteUuid
      );

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      handleError(error, res);
    }
});

// Add route to toggle performance privacy
router.patch('/:performanceId/privacy',
  validatePerformanceId,
  async (req: Request, res: Response) => {
    try {
      const result = await performanceController.togglePrivacy(
        req.params.performanceId
      );

      if (!result) {
        throw new RouteError(`Performance not found with ID: ${req.params.performanceId}`, 404);
      }

      res.json({
        success: true,
        data: result
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
      error: error.message
    });
    return;
  }

  console.error('Unexpected error:', error);
  
  if (error instanceof Error) {
    // Handle known error types
    if (error.message.includes('validation failed')) {
      res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.message
      });
      return;
    }
  }

  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
};

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

export default router;