// const Performance = require('../models/Performance');

// const performanceController = {
//   // Create new performance
//   async createPerformance(performanceData) {
//     try {
//       const performance = new Performance(performanceData);
//       await performance.save();
//       return performance;
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Get performance by ID
//   async getPerformanceById(performanceId) {
//     try {
//       return await Performance.findOne({ performanceId });
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Update performance
//   async updatePerformance(performanceId, updateData) {
//     try {
//       return await Performance.findOneAndUpdate(
//         { performanceId },
//         updateData,
//         { new: true }
//       );
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Delete performance
//   async deletePerformance(performanceId) {
//     try {
//       return await Performance.findOneAndDelete({ performanceId });
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Get all performances for an athlete
//   async getAthletePerformances(athleteUuid) {
//     try {
//       return await Performance.find({ athleteUuid });
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Toggle performance privacy
//   async togglePrivacy(performanceId) {
//     try {
//       const performance = await Performance.findOne({ performanceId });
//       performance.isPrivate = !performance.isPrivate;
//       return await performance.save();
//     } catch (error) {
//       throw error;
//     }
//   }
// };

// module.exports = performanceController;

import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import fs from 'fs/promises';
import path from 'path';
import csv from 'csv-parse';
import { v4 as uuidv4 } from 'uuid';
import OpenAI from 'openai';
import { Performance } from '../models/Performance';
import { User } from '../models/User';

// Types
interface PerformanceData {
  performanceId: string;
  athleteUuid: string;
  isPrivate: boolean;
  metricName: string;
  metric: any;
  blockchainHash: string;
}

interface ProcessedCSVResponse {
  performances: PerformanceData[];
}

interface AuthRequest extends Request {
  user?: {
    uuid: string;
    isAthlete: boolean;
  };
}

// Configure OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Configure Multer for file upload
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'text/csv') {
      cb(new Error('Only CSV files are allowed'));
      return;
    }
    cb(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Helper to read CSV file
const readCSVFile = async (filePath: string): Promise<string[][]> => {
  const fileContent = await fs.readFile(filePath, 'utf-8');
  return new Promise((resolve, reject) => {
    csv.parse(fileContent, {
      trim: true,
      skip_empty_lines: true
    }, (err, records) => {
      if (err) reject(err);
      resolve(records);
    });
  });
};

// OpenAI prompt template
const generateOpenAIPrompt = (csvData: string[][], userUuid: string): string => {
  return `
  Process this CSV data for an athlete's health metrics and convert it to a structured JSON format.
  The currently logged in user UUID is: ${userUuid}

  CSV Data:
  ${csvData.map(row => row.join(', ')).join('\n')}

  Please convert this data into JSON with the following structure for each row:
  {
    "performances": [{
      "performanceId": "unique-id-based-on-datetime",
      "athleteUuid": "user-uuid",
      "isPrivate": boolean,
      "metricName": "name-of-health-metric",
      "metric": "actual-value",
      "blockchainHash": "generated-hash"
    }]
  }

  Rules:
  1. Generate a unique performanceId for each entry using the current datetime
  2. Use the provided user UUID
  3. Set isPrivate to true by default
  4. Identify the metric name and value from the CSV data
  5. Generate a placeholder blockchain hash
  
  Return only the JSON without any additional explanation.
  `;
};

export class PerformanceController {
  // Create performance from CSV
  static createPerformance = async (req: AuthRequest, res: Response): Promise<void> => {
    const uploadMiddleware = upload.single('csvFile');
    
    try {
      // Handle file upload
      await new Promise((resolve, reject) => {
        uploadMiddleware(req, res, (err) => {
          if (err) reject(err);
          resolve(null);
        });
      });

      if (!req.file) {
        throw new Error('No CSV file uploaded');
      }

      // Get current user
      if (!req.user?.uuid) {
        throw new Error('User not authenticated');
      }

      // Read CSV file
      const csvData = await readCSVFile(req.file.path);

      // Process with OpenAI
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{
          role: "user",
          content: generateOpenAIPrompt(csvData, req.user.uuid)
        }]
      });

      const processedData: ProcessedCSVResponse = JSON.parse(
        completion.choices[0].message.content || '{}'
      );

      // Save to database
      const savedPerformances = await Promise.all(
        processedData.performances.map(async (performance) => {
          const newPerformance = new Performance(performance);
          return await newPerformance.save();
        })
      );

      // Clean up - delete CSV file
      await fs.unlink(req.file.path);

      res.status(201).json({
        success: true,
        data: savedPerformances
      });

    } catch (error) {
      // Clean up file if exists
      if (req.file) {
        await fs.unlink(req.file.path).catch(() => {});
      }
      
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  };

  // Get performance by ID
  static getPerformanceById = async (req: Request, res: Response): Promise<void> => {
    try {
      const performance = await Performance.findOne({
        performanceId: req.params.performanceId
      });
      
      if (!performance) {
        res.status(404).json({
          success: false,
          error: 'Performance not found'
        });
        return;
      }

      res.json({
        success: true,
        data: performance
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  };

  // Get performances by athlete
  static getPerformancesByAthlete = async (req: Request, res: Response): Promise<void> => {
    try {
      const performances = await Performance.find({
        athleteUuid: req.params.athleteUuid
      });

      res.json({
        success: true,
        data: performances
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  };

  // Get public performances by athlete
  static getPublicPerformancesByAthlete = async (req: Request, res: Response): Promise<void> => {
    try {
      const performances = await Performance.find({
        athleteUuid: req.params.athleteUuid,
        isPrivate: false
      });

      res.json({
        success: true,
        data: performances
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  };

  // Update performance
  static updatePerformance = async (req: Request, res: Response): Promise<void> => {
    try {
      const updatedPerformance = await Performance.findOneAndUpdate(
        { performanceId: req.params.performanceId },
        req.body,
        { new: true }
      );

      if (!updatedPerformance) {
        res.status(404).json({
          success: false,
          error: 'Performance not found'
        });
        return;
      }

      res.json({
        success: true,
        data: updatedPerformance
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  };

  // Delete performance
  static deletePerformance = async (req: Request, res: Response): Promise<void> => {
    try {
      const deletedPerformance = await Performance.findOneAndDelete({
        performanceId: req.params.performanceId
      });

      if (!deletedPerformance) {
        res.status(404).json({
          success: false,
          error: 'Performance not found'
        });
        return;
      }

      res.json({
        success: true,
        data: deletedPerformance
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  };

  // Toggle performance privacy
  static togglePrivacy = async (req: Request, res: Response): Promise<void> => {
    try {
      const performance = await Performance.findOne({
        performanceId: req.params.performanceId
      });

      if (!performance) {
        res.status(404).json({
          success: false,
          error: 'Performance not found'
        });
        return;
      }

      performance.isPrivate = !performance.isPrivate;
      await performance.save();

      res.json({
        success: true,
        data: performance
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  };
}

// Auth middleware
export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({
        success: false,
        error: 'No authorization header'
      });
      return;
    }

    const token = authHeader.split(' ')[1];
    // Implement your token verification logic here
    // Set req.user with the verified user data
    
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Invalid authorization'
    });
  }
};

export default PerformanceController;