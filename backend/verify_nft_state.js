import { ethers } from 'ethers';

const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");
const NFT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const NFT_ABI = [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function tokenCount() view returns (uint256)"
];

async function verify() {
    try {
        console.log(`Checking contract at ${NFT_ADDRESS}...`);
        const code = await provider.getCode(NFT_ADDRESS);
        
        if (code === "0x") {
            console.error("❌ NO CODE found at this address! The contract is not deployed or you are on the wrong network.");
            return;
        }
        console.log("✅ Contract code found.");

        const contract = new ethers.Contract(NFT_ADDRESS, NFT_ABI, provider);
        const name = await contract.name();
        const symbol = await contract.symbol();
        const count = await contract.tokenCount();
        
        console.log(`- Name: ${name}`);
        console.log(`- Symbol: ${symbol}`);
        console.log(`- Current Token Count: ${count.toString()}`);
        console.log("✅ Contract is responding correctly.");

    } catch (e) {
        console.error("❌ Error during verification:", e.message);
    }
}

verify();
