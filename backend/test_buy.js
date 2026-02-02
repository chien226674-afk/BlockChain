import { ethers } from 'ethers';

const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");
const MARKET_ADDRESS = "0x68B1D87F95878fE05B998F19b66F4baba5De1aed";
const PRIVATE_KEY = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"; // Admin
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

const MARKET_ABI = [
  "function purchaseItem(uint256 _itemId) external payable"
];

async function buy() {
    try {
        const contract = new ethers.Contract(MARKET_ADDRESS, MARKET_ABI, wallet);
        const price = ethers.utils.parseEther("1.0");

        console.log("Buying Item 1 for 1.0 GO (Static Call)...");
        try {
            await contract.callStatic.purchaseItem(1, { value: price, gasLimit: 500000 });
            console.log("✅ Static Call Successful! (Transaction would succeed)");
        } catch (error) {
            console.error("❌ Static Call Failed:", error);
            if (error.data) console.error("Error Data:", error.data);
            if (error.reason) console.error("Error Reason:", error.reason);
        }
    } catch (e) {
        console.error("❌ Purchase failed:", e);
    }
}

buy();
