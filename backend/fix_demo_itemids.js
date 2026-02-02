import mongoose from 'mongoose';
import dotenv from 'dotenv';
import NFT from './models/NFT.js';
import User from './models/User.js';

dotenv.config();

/**
 * Fix demo NFT itemIds to be numeric instead of strings
 * This allows the smart contract to process purchases correctly
 */

async function fixDemoItemIds() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected\n');

        // Find DemoArtist
        const demoArtist = await User.findOne({ username: 'DemoArtist' });
        if (!demoArtist) {
            console.log('❌ DemoArtist not found!');
            process.exit(1);
        }

        // Find all NFTs with existing numeric itemIds to determine next available ID
        const allNFTs = await NFT.find({});
        const numericItemIds = allNFTs
            .map(nft => parseInt(nft.itemId))
            .filter(id => !isNaN(id));
        
        const maxItemId = numericItemIds.length > 0 ? Math.max(...numericItemIds) : 0;
        console.log(`📊 Current max itemId: ${maxItemId}\n`);

        // Find demo NFTs with string itemIds
        const demoNFTs = await NFT.find({ 
            owner: demoArtist._id,
            itemId: { $exists: true, $ne: null }
        });

        console.log(`📦 Found ${demoNFTs.length} demo NFTs\n`);

        let nextItemId = maxItemId + 1;
        let updatedCount = 0;

        for (const nft of demoNFTs) {
            const currentItemId = nft.itemId;
            
            // Check if itemId is a string (not a valid number)
            if (isNaN(parseInt(currentItemId)) || currentItemId.toString().includes('item-')) {
                const oldItemId = nft.itemId;
                nft.itemId = nextItemId.toString();
                await nft.save();
                
                console.log(`✅ Updated: ${nft.name}`);
                console.log(`   Old itemId: ${oldItemId}`);
                console.log(`   New itemId: ${nextItemId}`);
                console.log(`   Price: ${nft.price} CBS\n`);
                
                nextItemId++;
                updatedCount++;
            } else {
                console.log(`⏭️  Skipped: ${nft.name} (already has numeric itemId: ${currentItemId})\n`);
            }
        }

        console.log('═'.repeat(70));
        console.log(`\n✅ Fixed ${updatedCount} demo NFTs`);
        console.log(`📊 Next available itemId: ${nextItemId}\n`);
        
        console.log('🎉 Demo NFTs are now ready for purchase!');
        console.log('   Go to marketplace and try buying with CBS tokens\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

fixDemoItemIds();
