import dotenv from 'dotenv';
import api from './services/api.js';

dotenv.config();

/**
 * Demo Script for Testing Buy/Sell Transactions
 * This simulates the frontend flow for demonstration purposes
 */

const demoTransactions = async () => {
    console.log("🎬 Starting Demo Transaction Flow...\n");

    try {
        // 1. Login as Bob (Buyer)
        console.log("1️⃣ Logging in as bob_collector...");
        const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: 'bob_collector',
                password: 'password123'
            })
        });
        const { token, user } = await loginResponse.json();
        console.log(`   ✓ Logged in as ${user.username}`);
        console.log(`   Wallet: ${user.walletAddress}\n`);

        // 2. View Marketplace
        console.log("2️⃣ Fetching marketplace items...");
        const marketResponse = await fetch('http://localhost:5000/api/market/items', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const items = await marketResponse.json();
        console.log(`   ✓ Found ${items.length} items for sale:`);
        items.forEach((item, i) => {
            console.log(`   ${i + 1}. ${item.nft.name} - ${item.price} ETH (Seller: ${item.seller.username})`);
        });
        console.log();

        // 3. Demo Instructions
        console.log("📋 Next Steps for Manual Testing:");
        console.log("   1. Open http://localhost:5173 in your browser");
        console.log("   2. Login with: bob_collector / password123");
        console.log("   3. Connect MetaMask wallet: 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4");
        console.log("   4. Go to Marketplace and click 'Buy' on any item");
        console.log("   5. Confirm the transaction in MetaMask");
        console.log();

        console.log("🔧 Smart Contract Interaction:");
        console.log("   • Ensure Hardhat local node is running: npx hardhat node");
        console.log("   • Deploy contracts: npx hardhat run scripts/deploy.js --network localhost");
        console.log("   • Update contract addresses in: blockchain_ui/src/services/contract.ts");
        console.log();

        console.log("✅ Demo preparation complete!");

    } catch (error) {
        console.error("❌ Error:", error.message);
    }
};

demoTransactions();
