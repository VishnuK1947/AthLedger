import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { config } from './config/config';

const app: Express = express();

// Middleware
app.use(cors());
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