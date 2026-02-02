import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import NFT from './models/NFT.js';
import User from './models/User.js';
import MarketItem from './models/MarketItem.js';
import connectDB from './config/db.js';

dotenv.config();

const seedData = async () => {
    await connectDB();

    try {
        console.log("🌱 Starting database seeding...\n");

        // Clear existing data for fresh demo
        await User.deleteMany({});
        await NFT.deleteMany({});
        await MarketItem.deleteMany({});
        console.log("✓ Cleared existing data\n");

        // ========== SEED USERS ==========
        console.log("👥 Creating demo users...");
        
        const hashedPassword = await bcrypt.hash('password123', 10);
        
        const users = [
            {
                username: 'alice_creator',
                email: 'alice@nftmarket.com',
                password: hashedPassword,
                walletAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1',
                avatar: `http://localhost:${process.env.PORT || 5000}/assets/nft-images/avatar_alice.jpg`,
                role: 'user'
            },
            {
                username: 'bob_collector',
                email: 'bob@nftmarket.com',
                password: hashedPassword,
                walletAddress: '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4',
                avatar: `http://localhost:${process.env.PORT || 5000}/assets/nft-images/avatar_bob.jpg`,
                role: 'user'
            },
            {
                username: 'charlie_artist',
                email: 'charlie@nftmarket.com',
                password: hashedPassword,
                walletAddress: '0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2',
                avatar: `http://localhost:${process.env.PORT || 5000}/assets/nft-images/avatar_charlie.jpg`,
                role: 'user'
            },
            {
                username: 'admin',
                email: 'admin@nftmarket.com',
                password: hashedPassword,
                walletAddress: '0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db',
                avatar: `http://localhost:${process.env.PORT || 5000}/assets/nft-images/avatar_admin.jpg`,
                role: 'admin'
            }
        ];

        const createdUsers = await User.insertMany(users);
        console.log(`✓ Created ${createdUsers.length} users`);
        createdUsers.forEach(u => console.log(`  - ${u.username} (${u.walletAddress})`));
        console.log();

        // ========== SEED NFTs ==========
        console.log("🎨 Creating NFTs...");
        
        const nftData = [
            { img: "cat.png", name: "Cosmic Cat", desc: "A mystical feline guardian of the digital realm", creator: 0, owner: 0, price: 0.5 },
            { img: "jellyfish.png", name: "Ethereal Jellyfish", desc: "Floating through the metaverse seas", creator: 0, owner: 1, price: 0.8 },
            { img: "lion.png", name: "Neon Lion", desc: "King of the blockchain jungle", creator: 2, owner: 2, price: 1.2 },
            { img: "mushroom.png", name: "Magic Mushroom", desc: "Gateway to psychedelic NFT experiences", creator: 0, owner: 0, price: 0.3 },
            { img: "mushrooms.png", name: "Mushroom Colony", desc: "A thriving ecosystem of digital fungi", creator: 2, owner: 1, price: 0.9 },
            { img: "owl.png", name: "Wise Owl", desc: "Guardian of blockchain wisdom", creator: 0, owner: 0, price: 0.7 },
            { img: "robot1.png", name: "Cyber Guardian", desc: "Protector of the digital frontier", creator: 1, owner: 1, price: 1.5 },
            { img: "robot2.png", name: "Neon Sentinel", desc: "Advanced AI art from the future", creator: 1, owner: 2, price: 1.8 },
            { img: "scenery.png", name: "Digital Dreamscape", desc: "Where reality meets imagination", creator: 2, owner: 2, price: 2.0 },
            { img: "tree.png", name: "Cosmic Tree", desc: "The tree of life in the metaverse", creator: 2, owner: 0, price: 1.1 }
        ];

        const createdNFTs = [];
        for (let i = 0; i < nftData.length; i++) {
            const data = nftData[i];
            const nft = await NFT.create({
                tokenId: (i + 1).toString(),
                name: data.name,
                description: data.desc,
                image: `http://localhost:${process.env.PORT || 5000}/assets/nft-images/${data.img}`,
                tokenURI: `ipfs://QmExample${i + 1}`,
                creator: createdUsers[data.creator]._id,
                owner: createdUsers[data.owner]._id
            });
            createdNFTs.push({ nft, price: data.price, seller: data.owner });
            console.log(`  ✓ ${data.name} (Token #${i + 1})`);
        }
        console.log();

        // ========== SEED MARKETPLACE LISTINGS ==========
        console.log("🏪 Creating marketplace listings...");
        
        // List some NFTs for sale (not all)
        const listingsToCreate = [
            { nftIndex: 0, price: 0.5 },  // Cosmic Cat
            { nftIndex: 1, price: 0.8 },  // Ethereal Jellyfish
            { nftIndex: 2, price: 1.2 },  // Neon Lion
            { nftIndex: 4, price: 0.9 },  // Mushroom Colony
            { nftIndex: 6, price: 1.5 },  // Cyber Guardian
            { nftIndex: 8, price: 2.0 },  // Digital Dreamscape
        ];

        for (const listing of listingsToCreate) {
            const nftData = createdNFTs[listing.nftIndex];
            const marketItem = await MarketItem.create({
                itemId: (listing.nftIndex + 1).toString(),
                tokenId: nftData.nft.tokenId, // Add tokenId from NFT
                nft: nftData.nft._id,
                seller: createdUsers[nftData.seller]._id,
                price: listing.price,
                sold: false
            });
            console.log(`  ✓ Listed "${nftData.nft.name}" for ${listing.price} ETH`);
        }
        console.log();

        // ========== SUMMARY ==========
        console.log("📊 Seeding Summary:");
        console.log(`  • Users: ${createdUsers.length}`);
        console.log(`  • NFTs: ${createdNFTs.length}`);
        console.log(`  • Marketplace Listings: ${listingsToCreate.length}`);
        console.log();
        
        console.log("🎉 Demo Data Ready!");
        console.log("\n📝 Test Credentials:");
        console.log("  Username: alice_creator | bob_collector | charlie_artist | admin");
        console.log("  Password: password123");
        console.log("\n🔗 Wallet Addresses:");
        createdUsers.forEach(u => console.log(`  ${u.username}: ${u.walletAddress}`));
        
        process.exit(0);
    } catch (error) {
        console.error("❌ Error Seeding:", error);
        process.exit(1);
    }
};

seedData();
