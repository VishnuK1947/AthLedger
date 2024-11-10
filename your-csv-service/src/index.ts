import { z } from "zod";
import { defineDAINService, ToolConfig, AgentInfo } from "@dainprotocol/service-sdk";
import * as fs from 'fs';
import * as express from 'express';
import * as multer from 'multer';
import * as csvParser from 'csv-parser';

const upload = multer({ dest: 'uploads/' });

// Helper function for transforming data
function transformToFormat(data: any[], format: Record<string, any>): any[] {
  // Implement your transformation logic here
  return data;
}

const convertCsvToJsonConfig: ToolConfig = {
  id: "convert-csv-to-json",
  name: "Convert CSV to JSON",
  description: "Converts a CSV file to a specified JSON format",
  pricing: {
    amount: 0,
    currency: "USD"
  },
  input: z.object({
    csvPath: z.string().describe("Path to the uploaded CSV file"),
    outputFormat: z.object({}).describe("Desired JSON output format")
  }),
  output: z.object({
    jsonData: z.array(z.object({})).describe("Converted JSON data")
  }),
  handler: async ({ csvPath, outputFormat }: { csvPath: string; outputFormat: Record<string, any> }, agentInfo: AgentInfo) => {
    return new Promise((resolve, reject) => {
      const results: any[] = [];
      fs.createReadStream(csvPath)
        .pipe(csvParser())
        .on('data', (data) => results.push(data))
        .on('end', () => {
          const formattedResults = transformToFormat(results, outputFormat);
          resolve({
            text: "CSV successfully converted to JSON",
            data: {
              jsonData: formattedResults
            },
            ui: {
              type: "card",
              uiData: JSON.stringify({
                title: "CSV to JSON Conversion",
                content: `Converted ${results.length} rows to JSON format`
              })
            }
          });
        })
        .on('error', (err) => reject(err));
    });
  }
};

const dainService = defineDAINService({
  metadata: {
    title: "CSV to JSON Converter",
    description: "A service to convert CSV files to custom JSON formats",
    version: "1.0.0",
    author: "Your Name",
    tags: ["csv", "json", "converter"]
  },
  identity: {
    apiKey: process.env.DAIN_API_KEY,
  },
  tools: [convertCsvToJsonConfig],
});

const app = express();

app.post('/convert', upload.single('csvFile'), async (req, res) => {
  try {
    if (!req.file) {
      throw new Error('No file uploaded');
    }
    
    const tools = dainService.getTools();
    const tool = tools.find(t => t.id === 'convert-csv-to-json');
    
    if (!tool) {
      throw new Error('Tool not found');
    }

    const result = await tool.handler({
      csvPath: req.file.path,
      outputFormat: req.body.outputFormat ? JSON.parse(req.body.outputFormat) : {}
    }, { 
      id: 'api-user',  // Changed from agentId to id
      address: '0x0000000000000000000000000000000000000000'
    });
    
    res.json(result.data);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ error: errorMessage });
  }
});

const server = app.listen(2022, () => {
  console.log("CSV to JSON Converter Service is running on port 2022");
});

export default dainService;