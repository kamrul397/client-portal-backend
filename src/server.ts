import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import { connectDB } from './config/db';
import authRoutes from './routes/authRoutes';

// Load environment variables from .env file
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB Database
connectDB();

// Global Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger UI Documentation Route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /:
 *   get:
 *     summary: API Health Check Route
 *     description: Returns the status of the server and link to the Swagger documentation.
 *     responses:
 *       200:
 *         description: Server is online and functioning properly.
 */
app.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Client & Compliance Portal Backend API is running.',
    swaggerDocs: `http://localhost:${PORT}/api-docs`,
    environment: process.env.NODE_ENV || 'development',
  });
});

// Authentication Routes
app.use('/api/auth', authRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 Server running on: http://localhost:${PORT}`);
  console.log(`📄 Swagger UI docs: http://localhost:${PORT}/api-docs`);
  console.log(`====================================================`);
});

export default app;
