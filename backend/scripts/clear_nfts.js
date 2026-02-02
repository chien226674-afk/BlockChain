import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const clearDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    // Delete all NFTs and MarketItems
    const NFT = mongoose.model('NFT', new mongoose.Schema({}));
    const MarketItem = mongoose.model('MarketItem', new mongoose.Schema({}));

    await NFT.deleteMany({});
    console.log('Cleaned NFTs');
    
    await MarketItem.deleteMany({});
    console.log('Cleaned MarketItems');

    console.log('Database Cleanup Successful');
    process.exit(0);
  } catch (error) {
    console.error('Cleanup Error:', error);
    process.exit(1);
  }
};

clearDB();
