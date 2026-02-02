import express from 'express';
import 'express-async-errors'; // Automatically catches async errors
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { validateEnv, securityConfig } from './config/security.js';
import { apiLimiter, authLimiter, uploadLimiter } from './middleware/rateLimiter.js';

import authRoutes from './routes/authRoutes.js';
import nftRoutes from './routes/nftRoutes.js';
import userRoutes from './routes/userRoutes.js';
import marketRoutes from './routes/marketRoutes.js';

dotenv.config();

// Validate environment variables
validateEnv();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Security Headers (Helmet)
app.use(helmet(securityConfig.helmet));

// CORS
app.use(cors(securityConfig.cors));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging in development
if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
        console.log(`${req.method} ${req.path}`);
        next();
    });
}

// Helper for __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static images (from sibling "img" folder)
app.use('/assets/nft-images', express.static(path.join(__dirname, '../img')));

// Basic Route
app.get('/', (req, res) => {
  res.json({ 
    success: true,
    message: 'Blockchain NFT Marketplace API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      nfts: '/api/nfts',
      users: '/api/users',
      market: '/api/market'
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// Apply Rate Limiters to Routes
app.use('/api/auth', authLimiter, authRoutes); // Strict rate limiting for auth
app.use('/api/nfts', apiLimiter, nftRoutes);
app.use('/api/users', apiLimiter, userRoutes);
app.use('/api/market', apiLimiter, marketRoutes);

// 404 handler - must be after all routes
app.use(notFound);

// Global error handler - must be last
app.use(errorHandler);

// Only start server if not in test environment
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🔒 Security features enabled`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

export default app;
