import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Import routes
import expenseRoutes from './routes/expenses';
import projectRoutes from './routes/projects';
import featureFlagRoutes from './routes/featureFlags';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Prisma Client
export const prisma = new PrismaClient();

// Middleware
app.use(helmet()); // Security headers
app.use(morgan('combined')); // Logging
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Expense Management API is running',
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint under API path as well
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Expense Management API is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/expenses', expenseRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/feature-flags', featureFlagRoutes);

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`
  });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check available at http://localhost:${PORT}/health`);
});

export default app;
