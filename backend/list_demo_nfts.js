import mongoose from 'mongoose';
import dotenv from 'dotenv';
import NFT from './models/NFT.js';
import User from './models/User.js';

dotenv.config();

/**
 * Script to list demo NFTs on marketplace
 * This will update the NFT database with proper itemId and price
 * So users can purchase them with CBS tokens
 */

async function listDemoNFTs() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB\n');

        // Find DemoArtist user
        const demoArtist = await User.findOne({ username: 'DemoArtist' });
        if (!demoArtist) {
            console.log('❌ DemoArtist user not found!');
            console.log('Please create DemoArtist user first.');
            process.exit(1);
        }

        console.log(`📦 Found DemoArtist: ${demoArtist.username}`);
        console.log(`   Wallet: ${demoArtist.walletAddress}\n`);

        // Find all NFTs owned by DemoArtist that are NOT listed
        const unlistedNFTs = await NFT.find({
            owner: demoArtist._id,
            $or: [
                { itemId: null },
                { itemId: 'null' },
                { itemId: { $exists: false } }
            ]
        });

        console.log(`📋 Found ${unlistedNFTs.length} unlisted NFTs:\n`);

        if (unlistedNFTs.length === 0) {
            console.log('ℹ️  All demo NFTs are already listed!');
            process.exit(0);
        }

        // List each NFT with a price
        const prices = {
            'Nebula Dreams': 250,
            'Stellar Horizon': 350,
            'Mushroom Kingdom': 180,
            'Cosmic Ocean': 420,
            'Digital Sunset': 300
        };

        for (const nft of unlistedNFTs) {
            // Generate a simple itemId (in real scenario, this comes from blockchain)
            const itemId = `item-${nft.tokenId}`;
            
            // Get price based on name, or use default
            const price = prices[nft.name] || 200;

            // Update NFT
            nft.itemId = itemId;
            nft.price = price;
            await nft.save();

            console.log(`✅ Listed: ${nft.name} (Token #${nft.tokenId})`);
            console.log(`   Price: ${price} CBS`);
            console.log(`   ItemId: ${itemId}\n`);
        }

        console.log('🎉 All demo NFTs have been listed successfully!');
        console.log('\n📍 Next Steps:');
        console.log('   1. Go to http://localhost:5173/marketplace');
        console.log('   2. You should see the listed NFTs');
        console.log('   3. Try purchasing them with CBS tokens\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

listDemoNFTs();
