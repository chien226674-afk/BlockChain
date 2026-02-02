import mongoose from 'mongoose';
import dotenv from 'dotenv';
import NFT from './models/NFT.js';
import User from './models/User.js';

dotenv.config();

async function verifyListedNFTs() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        
        // Find DemoArtist
        const demoArtist = await User.findOne({ username: 'DemoArtist' });
        
        // Find all NFTs by DemoArtist
        const demoNFTs = await NFT.find({ owner: demoArtist._id });
        
        console.log('\n📊 Demo NFTs Available for Purchase:\n');
        console.log('═'.repeat(70));
        
        demoNFTs.forEach((nft, index) => {
            const status = (nft.itemId && nft.itemId !== 'null') ? '✅ LISTED' : '❌ NOT LISTED';
            console.log(`\n${index + 1}. ${nft.name}`);
            console.log(`   Token ID: ${nft.tokenId}`);
            console.log(`   Status: ${status}`);
            if (nft.itemId && nft.itemId !== 'null') {
                console.log(`   Price: ${nft.price || 'N/A'} CBS`);
                console.log(`   Item ID: ${nft.itemId}`);
            }
            console.log(`   Description: ${nft.description}`);
        });
        
        console.log('\n' + '═'.repeat(70));
        
        const listedCount = demoNFTs.filter(nft => nft.itemId && nft.itemId !== 'null').length;
        console.log(`\n📈 Summary: ${listedCount} out of ${demoNFTs.length} demo NFTs are listed\n`);
        
        // Find user's NFTs
        const user = await User.findOne({ username: 'ChienMinh113' });
        if (user) {
            const userNFTs = await NFT.find({ owner: user._id });
            console.log(`👤 Your NFTs (ChienMinh113): ${userNFTs.length} total`);
            userNFTs.forEach(nft => {
                const status = (nft.itemId && nft.itemId !== 'null') ? 'Listed' : 'Not Listed';
                console.log(`   - ${nft.name} (${status})`);
            });
        }
        
        console.log('\n✅ You can now buy demo NFTs on the marketplace!\n');
        
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

verifyListedNFTs();
