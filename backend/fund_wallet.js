import { ethers } from 'ethers';

// Connect to Localhost Hardhat Node
// Try localhost instead of 127.0.0.1
const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");

// Hardhat Account 0 (Standard Test Account - Has 10000 ETH)
// Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
const ADMIN_PRIVATE_KEY = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
const adminWallet = new ethers.Wallet(ADMIN_PRIVATE_KEY, provider);

// User Wallet to Fund
const USER_WALLET_ADDRESS = "0x8256e30bc5058762dd891ec98cb84a58c28bfd51"; 

async function fundWallet() {
    try {
        console.log("🔌 Connecting to Localhost...");
        
        // Check network connection explicitely
        try {
            const network = await provider.getNetwork();
            console.log(`✅ Connected to network: ${network.name} (chainId: ${network.chainId})`);
        } catch (e) {
            console.error("❌ Failed to connect to Hardhat Node. Is it running?");
            console.error("   Please run: npx hardhat node");
            process.exit(1);
        }

        // Check Admin Balance
        const adminBalance = await provider.getBalance(adminWallet.address);
        console.log(`💰 Admin Balance: ${ethers.utils.formatEther(adminBalance)} ETH`);

        if (adminBalance.lt(ethers.utils.parseEther("1.0"))) {
             console.error("❌ Admin wallet seems empty. Did the node reset or is this the wrong account?");
             process.exit(1);
        }

        // Check User Balance
        const userBalanceBefore = await provider.getBalance(USER_WALLET_ADDRESS);
        console.log(`👤 User Balance Before: ${ethers.utils.formatEther(userBalanceBefore)} ETH`);

        console.log("\n💸 Sending 100 ETH to User...");

        // Send Transaction
        const tx = await adminWallet.sendTransaction({
            to: USER_WALLET_ADDRESS,
            value: ethers.utils.parseEther("100.0")
        });

        console.log(`⏳ Transaction sent! Hash: ${tx.hash}`);
        await tx.wait();

        // Check User Balance Again
        const userBalanceAfter = await provider.getBalance(USER_WALLET_ADDRESS);
        console.log(`✅ User Balance After: ${ethers.utils.formatEther(userBalanceAfter)} ETH`);
        console.log("\n🎉 Funding Complete! Please try the transaction again.");

    } catch (error) {
        console.error("❌ Error funding wallet:", error);
    }
}

fundWallet();
