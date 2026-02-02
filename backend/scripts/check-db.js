import mongoose from 'mongoose';
import MarketItem from '../models/MarketItem.js';
import NFT from '../models/NFT.js';
import dotenv from 'dotenv';
dotenv.config();

async function checkDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        const items = await MarketItem.find().populate('nft');
        console.log("Market Items in DB:");
        items.forEach(item => {
            console.log(`\nItem ID: ${item.itemId}`);
            console.log(`NFT Name: ${item.nft?.name}`);
            console.log(`Status: ${item.status}`);
            console.log(`Price: ${item.price}`);
        });

        process.exit(0);
    } catch (error) {
        console.error("DB check failed", error);
        process.exit(1);
    }
}

checkDB();
