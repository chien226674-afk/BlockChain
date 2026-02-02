import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const nftSchema = new mongoose.Schema({
    tokenId: String,
    name: String
});
const NFT = mongoose.model('NFT', nftSchema);

const marketItemSchema = new mongoose.Schema({
    nft: { type: mongoose.Schema.Types.ObjectId, ref: 'NFT' },
    status: String
});
const MarketItem = mongoose.model('MarketItem', marketItemSchema);

async function cleanup() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected!");

        const allItems = await MarketItem.find({}).populate('nft');
        console.log(`Checking ${allItems.length} MarketItems...`);

        let deletedCount = 0;
        for (const item of allItems) {
            if (!item.nft) {
                console.log(`Deleting orphaned MarketItem: ${item._id} (No NFT associated)`);
                await MarketItem.deleteOne({ _id: item._id });
                deletedCount++;
            }
        }

        console.log(`Cleanup complete! Deleted ${deletedCount} orphaned items.`);
        process.exit(0);
    } catch (error) {
        console.error("Cleanup failed:", error);
        process.exit(1);
    }
}

cleanup();
