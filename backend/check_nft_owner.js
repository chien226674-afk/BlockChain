import { ethers } from 'ethers';

const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");
const NFT_ADDRESS = "0x9A9f2CCfdE556A7E9Ff0848998Aa4a0CFD8863AE";
const MARKET_ADDRESS = "0x68B1D87F95878fE05B998F19b66F4baba5De1aed";
const NFT_ABI = [
  "function ownerOf(uint256 tokenId) view returns (address)"
];

async function check() {
    try {
        const contract = new ethers.Contract(NFT_ADDRESS, NFT_ABI, provider);
        const owner = await contract.ownerOf(1);
        console.log(`Owner of NFT 1: ${owner}`);
        console.log(`Marketplace Address: ${MARKET_ADDRESS}`);
        
        if (owner.toLowerCase() === MARKET_ADDRESS.toLowerCase()) {
            console.log("✅ Marketplace owns the NFT.");
        } else {
            console.log("❌ Marketplace DOES NOT own the NFT!");
        }
    } catch (e) {
        console.error("Error:", e);
    }
}

check();
