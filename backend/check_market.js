import { ethers } from 'ethers';

const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");
const MARKET_ADDRESS = "0x68B1D87F95878fE05B998F19b66F4baba5De1aed";
const MARKET_ABI = [
  "function itemCount() view returns (uint256)"
];

async function check() {
    try {
        const contract = new ethers.Contract(MARKET_ADDRESS, MARKET_ABI, provider);
        const count = await contract.itemCount();
        console.log(`Marketplace Item Count: ${count.toString()}`);
    } catch (e) {
        console.error("Error:", e);
    }
}

check();
