const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Sử dụng URI mặc định nếu không có trong .env
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nft_marketplace';
    
    console.log('🔗 Connecting to MongoDB:', mongoURI);
    
    const conn = await mongoose.connect(mongoURI);
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📁 Database: ${conn.connection.name}`);
    
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.log('💡 Tip: Make sure MongoDB is running: mongod');
    process.exit(1);
  }
};

module.exports = connectDB;