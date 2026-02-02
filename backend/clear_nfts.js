import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

import NFT from './models/NFT.js';

async function clearStale() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        // Delete NFTs that don't have a contractAddress (stale data)
        const result = await NFT.deleteMany({ contractAddress: { $exists: false } });
        console.log(`Deleted ${result.deletedCount} stale NFTs.`);

        // Re-sync indices to make sure compound index is active
        await NFT.syncIndexes();
        console.log("Indices synchronized.");

        process.exit(0);
    } catch (e) {
        console.error("Cleanup Failed:", e);
        process.exit(1);
    }
}

clearStale();
