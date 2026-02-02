import mongoose from 'mongoose';
import dotenv from 'dotenv';
import NFT from './models/NFT.js';
import User from './models/User.js';

dotenv.config();

/**
 * Reset all NFT listings by removing itemId and price
 * This allows users to list NFTs fresh on blockchain
 */

async function resetNFTListings() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected\n');

        // Find all NFTs with itemId
        const listedNFTs = await NFT.find({
            itemId: { $exists: true, $ne: null, $ne: 'null' }
        });
        
        console.log(`📦 Found ${listedNFTs.length} NFTs with listings:\n`);
        
        if (listedNFTs.length === 0) {
            console.log('ℹ️  No NFTs to reset');
            process.exit(0);
        }

        for (const nft of listedNFTs) {
            const owner = await User.findById(nft.owner);
            console.log(`   - ${nft.name} (tokenId: ${nft.tokenId}, itemId: ${nft.itemId}, owner: ${owner?.username})`);
        }
        
        console.log(`\n🔄 Resetting ${listedNFTs.length} NFT listings...`);
        
        // Update all NFTs to remove itemId and price
        const result = await NFT.updateMany(
            { itemId: { $exists: true, $ne: null, $ne: 'null' } },
            { 
                $set: { 
                    itemId: null,
                    price: null
                }
            }
        );
        
        console.log(`✅ Reset ${result.modifiedCount} NFT listings\n`);
        
        console.log('═'.repeat(70));
        console.log('\n✅ All NFT listings have been reset!');
        console.log('   NFTs are now unlisted and ready to be listed fresh\n');
        
        // Show current state
        const allNFTs = await NFT.find({});
        console.log(`📊 Current NFTs in database: ${allNFTs.length}\n`);
        
        for (const nft of allNFTs) {
            const owner = await User.findById(nft.owner);
            const status = (nft.itemId && nft.itemId !== 'null') ? `Listed (itemId: ${nft.itemId})` : '❌ Not Listed';
            console.log(`   ${nft.name} | Owner: ${owner?.username} | ${status}`);
        }
        
        console.log('\n📝 Next Steps:');
        console.log('   1. Go to your profile: http://localhost:5173/user/profile');
        console.log('   2. Click "List for Sale" on an NFT');
        console.log('   3. Enter price and confirm 2 MetaMask transactions');
        console.log('   4. The NFT will be listed on blockchain with REAL itemId\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

resetNFTListings();

