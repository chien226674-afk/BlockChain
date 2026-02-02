import mongoose from 'mongoose';
import dotenv from 'dotenv';
import NFT from './models/NFT.js';
import User from './models/User.js';

dotenv.config();

/**
 * Remove all demo NFTs from database
 * These NFTs don't exist on blockchain and cause purchase errors
 */

async function removeDemoNFTs() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected\n');

        // Find DemoArtist
        const demoArtist = await User.findOne({ username: 'DemoArtist' });
        
        if (!demoArtist) {
            console.log('ℹ️  DemoArtist not found - nothing to remove');
            process.exit(0);
        }

        // Find all demo NFTs
        const demoNFTs = await NFT.find({ owner: demoArtist._id });
        
        console.log(`📦 Found ${demoNFTs.length} demo NFTs:\n`);
        
        demoNFTs.forEach(nft => {
            console.log(`   - ${nft.name} (tokenId: ${nft.tokenId}, itemId: ${nft.itemId})`);
        });
        
        if (demoNFTs.length === 0) {
            console.log('\nℹ️  No demo NFTs to remove');
            process.exit(0);
        }

        console.log(`\n🗑️  Removing ${demoNFTs.length} demo NFTs...`);
        
        // Delete all demo NFTs
        const result = await NFT.deleteMany({ owner: demoArtist._id });
        
        console.log(`✅ Deleted ${result.deletedCount} demo NFTs\n`);
        
        console.log('═'.repeat(70));
        console.log('\n✅ Database cleaned successfully!');
        console.log('   Only real user NFTs remain in database\n');
        
        // Show remaining NFTs
        const remainingNFTs = await NFT.find({}).populate('owner', 'username');
        console.log(`📊 Remaining NFTs: ${remainingNFTs.length}\n`);
        
        if (remainingNFTs.length > 0) {
            console.log('Real NFTs in database:');
            remainingNFTs.forEach(nft => {
                const status = (nft.itemId && nft.itemId !== 'null') ? `Listed (itemId: ${nft.itemId})` : 'Not Listed';
                console.log(`   - ${nft.name} | Owner: ${nft.owner.username} | ${status}`);
            });
        }
        
        console.log('\n🎉 Marketplace now only shows real blockchain NFTs!\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

removeDemoNFTs();
