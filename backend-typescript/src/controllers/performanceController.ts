import { Model, Document, Types } from "mongoose";
import { Request, Response } from 'express';
import multer from 'multer';
import fs from 'fs/promises';
import csv from 'csv-parse';
import { v4 as uuidv4 } from 'uuid';
import OpenAI from 'openai';
import { Web3 } from 'web3';
import Performance from "../models/Performance";
import { BlockchainService } from '../services/blockchainService';

// Initialize services
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const blockchainService = new BlockchainService({
  web3Provider: process.env.WEB3_PROVIDER_URL || 'http://localhost:8545',
  contractAddress: process.env.CONTRACT_ADDRESS || '',
  ipfsApiUrl: process.env.IPFS_API_URL || 'http://localhost:5001'
});

// Interfaces
interface IPerformance extends Document {
  performanceId: string;
  athleteUuid: string;
  isPrivate: boolean;
  metricName: string;
  metric: any;
  blockchainHash: string;
  createdAt: Date;
  updatedAt: Date;
}

interface CreatePerformanceInput {
  performanceId: string;
  athleteUuid: string;
  isPrivate?: boolean;
  metricName: string;
  metric: any;
  blockchainHash?: string;
}

interface UpdatePerformanceInput {
  athleteUuid?: string;
  isPrivate?: boolean;
  metricName?: string;
  metric?: any;
}

interface ProcessedCSVResponse {
  performances: CreatePerformanceInput[];
}

interface AuthRequest extends Request {
  user?: {
    uuid: string;
    isAthlete: boolean;
  };
}

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

class PerformanceController {
  private model: Model<IPerformance>;

  constructor() {
    this.model = Performance;
  }

  // Helper to read CSV file
  private async readCSVFile(filePath: string): Promise<string[][]> {
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
  }

  // Generate OpenAI prompt
  private generateOpenAIPrompt(csvData: string[][], userUuid: string): string {
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
        "metric": "actual-value"
      }]
    }

    Rules:
    1. Generate a unique performanceId for each entry using the current datetime
    2. Use the provided user UUID
    3. Set isPrivate to true by default
    4. Identify the metric name and value from the CSV data
    
    Return only the JSON without any additional explanation.
    `;
  }

  // Create performance from CSV
  async createPerformanceFromCSV(req: AuthRequest, res: Response): Promise<void> {
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
        throw new PerformanceError('No CSV file uploaded');
      }

      if (!req.user?.uuid) {
        throw new PerformanceError('User not authenticated');
      }

      // Read CSV file
      const csvData = await this.readCSVFile(req.file.path);

      // Process with OpenAI
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{
          role: "user",
          content: this.generateOpenAIPrompt(csvData, req.user.uuid)
        }]
      });

      const processedData: ProcessedCSVResponse = JSON.parse(
        completion.choices[0].message.content || '{}'
      );

      // Store data on blockchain and save to database
      const savedPerformances = await Promise.all(
        processedData.performances.map(async (performance) => {
          // Store metric data on blockchain
          const blockchainHash = await blockchainService.storeMetricData({
            athleteUuid: performance.athleteUuid,
            metricName: performance.metricName,
            metric: performance.metric,
            timestamp: Date.now()
          });

          // Create performance with blockchain hash
          return await this.createPerformance({
            ...performance,
            blockchainHash
          });
        })
      );

      // Clean up CSV file
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
      
      throw this.handleError(error);
    }
  }

  // Create new performance
  async createPerformance(
    performanceData: CreatePerformanceInput
  ): Promise<IPerformance> {
    try {
      const performance = new this.model(performanceData);
      await performance.save();
      return performance;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get performance by ID
  async getPerformanceById(
    performanceId: string
  ): Promise<IPerformance | null> {
    try {
      return await this.model.findOne({ performanceId });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get metric data from blockchain
  async getMetricFromBlockchain(
    blockchainHash: string
  ): Promise<any> {
    try {
      return await blockchainService.getMetricData(blockchainHash);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Update performance
  async updatePerformance(
    performanceId: string,
    updateData: UpdatePerformanceInput
  ): Promise<IPerformance | null> {
    try {
      return await this.model.findOneAndUpdate(
        { performanceId },
        updateData,
        { new: true }
      );
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Delete performance
  async deletePerformance(
    performanceId: string
  ): Promise<IPerformance | null> {
    try {
      return await this.model.findOneAndDelete({ performanceId });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get all performances for an athlete
  async getAthletePerformances(
    athleteUuid: string
  ): Promise<IPerformance[]> {
    try {
      return await this.model.find({ athleteUuid });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get public performances for an athlete
  async getPublicPerformances(
    athleteUuid: string
  ): Promise<IPerformance[]> {
    try {
      return await this.model.find({
        athleteUuid,
        isPrivate: false
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Toggle performance privacy
  async togglePrivacy(
    performanceId: string
  ): Promise<IPerformance | null> {
    try {
      const performance = await this.model.findOne({ performanceId });

      if (!performance) {
        return null;
      }

      performance.isPrivate = !performance.isPrivate;
      return await performance.save();
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Error handler helper
  private handleError(error: unknown): Error {
    if (error instanceof Error) {
      return error;
    }
    return new Error("An unknown error occurred");
  }
}

// Custom error class for Performance-related errors
export class PerformanceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PerformanceError";
  }
}

// Export singleton instance
export const performanceController = new PerformanceController();

// Export class for testing purposes
export default PerformanceController;