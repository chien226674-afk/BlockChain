import mongoose from 'mongoose';
import dotenv from 'dotenv';
import NFT from './models/NFT.js';
import User from './models/User.js';

dotenv.config();

async function checkItemIds() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        
        const demoArtist = await User.findOne({ username: 'DemoArtist' });
        const demoNFTs = await NFT.find({ owner: demoArtist._id }).sort({ tokenId: 1 });
        
        console.log('\n📋 Demo NFTs - ItemId Check:\n');
        console.log('═'.repeat(80));
        
        demoNFTs.forEach((nft, index) => {
            const itemId = nft.itemId;
            const isNumeric = !isNaN(parseInt(itemId)) && !itemId.toString().includes('item-');
            const status = isNumeric ? '✅ NUMERIC' : '❌ STRING';
            
            console.log(`\n${index + 1}. ${nft.name}`);
            console.log(`   TokenId: ${nft.tokenId}`);
            console.log(`   ItemId: ${itemId} ${status}`);
            console.log(`   Price: ${nft.price} CBS`);
            console.log(`   Type: ${typeof itemId}`);
        });
        
        console.log('\n' + '═'.repeat(80));
        
        const numericCount = demoNFTs.filter(nft => {
            const itemId = nft.itemId;
            return !isNaN(parseInt(itemId)) && !itemId.toString().includes('item-');
        }).length;
        
        console.log(`\n✅ ${numericCount} out of ${demoNFTs.length} have valid numeric itemIds`);
        
        if (numericCount === demoNFTs.length) {
            console.log(`\n🎉 All demo NFTs are ready for purchase!\n`);
        } else {
            console.log(`\n⚠️  Some NFTs still have string itemIds - run fix_demo_itemids.js again\n`);
        }
        
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkItemIds();
