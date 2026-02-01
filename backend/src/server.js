import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/database.js';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

import userRoutes from './routes/userRoutes.js';
// other routes commented out until converted
// import nftRoutes from './routes/nftRoutes.js';
// import collectionRoutes from './routes/collectionRoutes.js';
// import transactionRoutes from './routes/transactionRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5000'],
  credentials: true
}));

// Set static folder
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Mount routers
app.use('/api/users', userRoutes);
// app.use('/api/nfts', nftRoutes);
// app.use('/api/collections', collectionRoutes);
// app.use('/api/transactions', transactionRoutes);

// API documentation
app.get('/api', (req, res) => {
  res.json({
    message: 'NFT Marketplace API',
    endpoints: {
      users: {
        register: 'POST /api/users/register',
        login: 'POST /api/users/login'
      }
    }
  });
});

app.get('/', (req, res) => {
  res.json({
    message: 'NFT Marketplace Backend API is running...',
    status: 'connected'
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});