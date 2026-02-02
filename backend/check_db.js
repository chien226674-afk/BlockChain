import mongoose from 'mongoose';
import dotenv from 'dotenv';
import NFT from './models/NFT.js';
import MarketItem from './models/MarketItem.js';
import User from './models/User.js';

dotenv.config();

async function check() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const nfts = await NFT.find({}).populate('owner', 'username');
        const items = await MarketItem.find({}).populate('nft').populate('seller', 'username');
        
        console.log("--- NFTs ---");
        nfts.forEach(n => console.log(`${n.tokenId} | ${n.name} | Owner: ${n.owner?.username} | itemId: ${n.itemId}`));
        
        console.log("\n--- REAL Market Items ---");
        const realItems = items.filter(i => !i.itemId.toString().includes('demo'));
        console.log(`Found ${realItems.length} real items`);
        realItems.forEach(i => console.log(`Item #${i.itemId} | NFT: ${i.nft?.name} | Seller: ${i.seller?.username} | Status: ${i.status}`));
        
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

check();
