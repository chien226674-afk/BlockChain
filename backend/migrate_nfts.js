import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

// Define Schemas inline to avoid import issues
const userSchema = new mongoose.Schema({
    walletAddress: { type: String, unique: true, lowercase: true },
    username: String
});
const User = mongoose.model('User', userSchema);

const nftSchema = new mongoose.Schema({
    tokenId: String,
    contractAddress: String,
    creator: { type: mongoose.Schema.Types.Mixed }, // Use Mixed temporarily for migration
    owner: { type: mongoose.Schema.Types.Mixed }
});
const NFT = mongoose.model('NFT', nftSchema);

async function migrate() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected!");

        const nfts = await NFT.find({});
        console.log(`Found ${nfts.length} NFTs to check.`);

        for (const nft of nfts) {
            let updated = false;

            // Fix creator
            if (typeof nft.creator === 'string' && nft.creator.startsWith('0x')) {
                console.log(`Fixing creator for NFT ${nft.tokenId}...`);
                let user = await User.findOne({ walletAddress: nft.creator.toLowerCase() });
                if (!user) {
                    user = await User.create({ 
                        walletAddress: nft.creator.toLowerCase(),
                        username: `user_${nft.creator.slice(2, 8)}`
                    });
                }
                nft.creator = user._id;
                updated = true;
            }

            // Fix owner
            if (typeof nft.owner === 'string' && nft.owner.startsWith('0x')) {
                console.log(`Fixing owner for NFT ${nft.tokenId}...`);
                let user = await User.findOne({ walletAddress: nft.owner.toLowerCase() });
                if (!user) {
                    user = await User.create({ 
                        walletAddress: nft.owner.toLowerCase(),
                        username: `user_${nft.owner.slice(2, 8)}`
                    });
                }
                nft.owner = user._id;
                updated = true;
            }

            if (updated) {
                await NFT.updateOne({ _id: nft._id }, { creator: nft.creator, owner: nft.owner });
                console.log(`Updated NFT ${nft.tokenId}`);
            }
        }

        console.log("Migration complete!");
        process.exit(0);
    } catch (error) {
        console.error("Migration failed:", error);
        process.exit(1);
    }
}

migrate();
