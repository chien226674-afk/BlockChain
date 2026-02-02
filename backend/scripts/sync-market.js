import mongoose from 'mongoose';
import MarketItem from '../models/MarketItem.js';
import NFT from '../models/NFT.js';
import User from '../models/User.js';
import { ethers } from 'ethers';
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config();

// Contract info
const MARKET_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
const NFT_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const RPC_URL = "http://127.0.0.1:8545";

// Load ABIs
const MARKET_ABI = JSON.parse(fs.readFileSync('../smart_contracts/artifacts/contracts/Marketplace.sol/Marketplace.json')).abi;

async function sync() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
        const marketContract = new ethers.Contract(MARKET_ADDRESS, MARKET_ABI, provider);

        const itemCount = await marketContract.itemCount();
        console.log(`Total items on blockchain: ${itemCount.toString()}`);

        for (let i = 1; i <= itemCount.toNumber(); i++) {
            const item = await marketContract.items(i);
            const isSold = item.sold;
            
            console.log(`Checking Item ${i}: TokenID ${item.tokenId.toString()}, Sold: ${isSold}`);

            // Find item in DB
            const dbItem = await MarketItem.findOne({ itemId: i.toString() });
            
            if (dbItem) {
                const currentStatus = dbItem.status;
                const newStatus = isSold ? 'sold' : 'listed';

                if (currentStatus !== newStatus) {
                    console.log(`Updating DB Item ${i}: ${currentStatus} -> ${newStatus}`);
                    dbItem.status = newStatus;
                    await dbItem.save();
                    
                    // Also update NFT item ID if sold
                    if (isSold) {
                        await NFT.findOneAndUpdate(
                            { tokenId: item.tokenId.toString(), contractAddress: NFT_ADDRESS.toLowerCase() },
                            { itemId: null }
                        );
                    }
                }
            } else {
                console.log(`Item ${i} not found in DB.`);
            }
        }

        console.log("Sync complete!");
        process.exit(0);
    } catch (error) {
        console.error("Sync failed", error);
        process.exit(1);
    }
}

sync();
