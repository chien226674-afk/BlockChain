import { ethers } from 'ethers';

// Connect to Localhost Hardhat Node
const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");

// Admin Account (Deployer - Has CBS Supply)
const ADMIN_PRIVATE_KEY = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
const adminWallet = new ethers.Wallet(ADMIN_PRIVATE_KEY, provider);

// User Wallet to Fund (The Buyer Account from logs)
const USER_WALLET_ADDRESS = "0x8E8e4E1957E6ea0469f2bA3C9aE7c18f27C075b8"; 

// CBS Contract Address
const CBS_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"; 

// Minimal ABI for ERC20 Transfer
const CBS_ABI = [
    "function transfer(address to, uint256 amount) returns (bool)",
    "function balanceOf(address owner) view returns (uint256)",
    "function name() view returns (string)",
    "function symbol() view returns (string)"
];

async function fundCBS() {
    try {
        console.log("🔌 Connecting to Localhost...");
        
        try {
            await provider.getNetwork();
            console.log("✅ Connected to Blockchain Node");
        } catch (e) {
            console.error("❌ Failed to connect to Hardhat Node. Is it running?");
            console.error("   Please run: npx hardhat node");
            process.exit(1);
        }

        const cbsContract = new ethers.Contract(CBS_ADDRESS, [
            "function mint(address to, uint256 amount) public",
            "function balanceOf(address owner) view returns (uint256)"
        ], adminWallet);

        console.log("Minting 1000 CBS to User...");
        const amountToSend = ethers.utils.parseUnits("1000", 18);
        
        try {
            const tx = await cbsContract.mint(USER_WALLET_ADDRESS, amountToSend);
            console.log(`⏳ Mint Transaction sent! Hash: ${tx.hash}`);
            await tx.wait();
            console.log("✅ Mint Successful!");
        } catch (e) {
            console.error("Mint failed:", e);
        }

        const userBalanceAfter = await cbsContract.balanceOf(USER_WALLET_ADDRESS);
        console.log(`✅ User CBS Balance Now: ${ethers.utils.formatUnits(userBalanceAfter, 18)}`);
        
    } catch (error) {
        console.error("❌ Error funding CBS:", error);
    }
}

fundCBS();
