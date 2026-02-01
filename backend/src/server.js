const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/database');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Route files
const userRoutes = require('./routes/userRoutes');
const nftRoutes = require('./routes/nftRoutes');
const collectionRoutes = require('./routes/collectionRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS - Cấu hình chi tiết hơn
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5000'],
  credentials: true
}));

// Set static folder
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Mount routers
app.use('/api/users', userRoutes);
app.use('/api/nfts', nftRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/transactions', transactionRoutes);

// API documentation
app.get('/api', (req, res) => {
  res.json({
    message: 'NFT Marketplace API',
    version: '1.0.0',
    server: `Running on port ${PORT}`,
    endpoints: {
      users: {
        register: 'POST /api/users/register',
        login: 'POST /api/users/login',
        profile: 'GET /api/users/profile',
        topCreators: 'GET /api/users/top-creators'
      },
      nfts: {
        getAll: 'GET /api/nfts',
        getSingle: 'GET /api/nfts/:id',
        create: 'POST /api/nfts',
        update: 'PUT /api/nfts/:id',
        delete: 'DELETE /api/nfts/:id',
        trending: 'GET /api/nfts/trending',
        stats: 'GET /api/nfts/stats/total',
        bid: 'POST /api/nfts/:id/bid',
        buy: 'POST /api/nfts/:id/buy',
        upload: 'POST /api/nfts/upload'
      },
      collections: {
        getAll: 'GET /api/collections',
        getSingle: 'GET /api/collections/:id',
        create: 'POST /api/collections'
      }
    }
  });
});

// Test route
app.get('/', (req, res) => {
  res.json({ 
    message: 'NFT Marketplace Backend API is running...',
    database: 'MongoDB',
    status: 'connected',
    port: PORT
  });
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    requestedUrl: req.originalUrl
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📚 API: http://localhost:${PORT}/api`);
  console.log(`🌐 Home: http://localhost:${PORT}`);
});