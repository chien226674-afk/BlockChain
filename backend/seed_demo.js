import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import NFT from './models/NFT.js';
import MarketItem from './models/MarketItem.js';

dotenv.config();

const DEMO_NFTS = [
    {
        name: "Nebula Dreams",
        description: "A cosmic journey through distant galaxies.",
        image: "https://gateway.pinata.cloud/ipfs/QmZqY3YgJm8c8k1HkM7hPzXz9z9z9z9z9z9z9z9z9z9z9z", // Placeholder or use uploaded if possible
        price: 0.1
    },
    {
        name: "Cyber Guardian",
        description: "The protector of the digital realm.",
        image: "https://gateway.pinata.cloud/ipfs/QmZqY3YgJm8c8k1HkM7hPzXz9z9z9z9z9z9z9z9z9z9z9z",
        price: 0.2
    },
    {
        name: "Neon Forest",
        description: "Where technology meets nature in a glowing harmony.",
        image: "https://gateway.pinata.cloud/ipfs/QmZqY3YgJm8c8k1HkM7hPzXz9z9z9z9z9z9z9z9z9z9z9z",
        price: 0.15
    },
    {
        name: "Stellar Horizon",
        description: "A breathtaking view of an alien sunset.",
        image: "https://picsum.photos/seed/103/600/600",
        price: 0.05
    },
    {
        name: "Mushroom Kingdom",
        description: "Psychedelic fungi in a magical forest.",
        image: "https://picsum.photos/seed/104/600/600",
        price: 0.08
    }
];

// I will use some of the user's uploaded images by simulating the upload process if I had the keys
// But for now, I will use placeholder images that look good or pointing to the local assets if served.
// Since the local server serves ../img, I can't easily put files there from here without copy.

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");

        // 0. Cleanup old demo data
        await User.deleteMany({ username: 'DemoArtist' });
        await MarketItem.deleteMany({ itemId: { $regex: /^demo-item-/ } });
        await NFT.deleteMany({ tokenId: { $regex: /^demo-/ } });
        console.log("Cleanup old demo data complete");

        // 1. Create a Demo Artist
        let artist = await User.findOne({ username: 'DemoArtist' });
        if (!artist) {
            artist = await User.create({
                username: 'DemoArtist',
                walletAddress: '0x1234567890123456789012345678901234567890',
                avatar: 'https://ui-avatars.com/api/?name=Demo+Artist&background=random'
            });
        }

        // 2. Add some items
        for (let i = 0; i < DEMO_NFTS.length; i++) {
            const data = DEMO_NFTS[i];
            const tokenId = `demo-${Date.now()}-${i}`;
            
            const nft = await NFT.create({
                tokenId,
                contractAddress: '0x24d38D8C7B979c3779ae6e43DBB37eDcb3Ba6F6a',
                name: data.name,
                description: data.description,
                image: `https://picsum.photos/seed/${i + 100}/600/600`, // Using Picsum for variety
                tokenURI: `ipfs://demo-${i}`,
                creator: artist._id,
                owner: artist._id
            });

            await MarketItem.create({
                itemId: `demo-item-${i}`,
                tokenId: tokenId, // Fixed: added missing tokenId
                nft: nft._id,
                seller: artist._id,
                price: data.price,
                status: 'listed'
            });
            console.log(`Seeded: ${data.name}`);
        }

        console.log("Seeding complete!");
        process.exit(0);
    } catch (error) {
        console.error("Seeding failed:", error);
        process.exit(1);
    }
}

seed();
