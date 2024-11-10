import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { config } from './config/config';

const app: Express = express();

const corsOptions = {
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "svix-id", "svix-timestamp", "svix-signature"],
    credentials: true,
    optionsSuccessStatus: 204
  };
  
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic error handling
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Basic route
app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'Welcome to Express TypeScript Server' });
});

// Start server
app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
    console.log(`Environment: ${config.nodeEnv}`);
});

export default app;