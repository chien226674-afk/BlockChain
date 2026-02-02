import { ethers } from 'ethers';

const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");
const NFT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

async function check() {
    try {
        const network = await provider.getNetwork();
        console.log(`Connected to chainId: ${network.chainId}`);

        const code = await provider.getCode(NFT_ADDRESS);
        console.log(`Code at ${NFT_ADDRESS}: ${code.slice(0, 50)}...`);

        if (code === '0x') {
            console.error("❌ NO CODE FOUND! Contract does not exist.");
        } else {
            console.log("✅ Code found!");
        }
    } catch (e) {
        console.error("Error:", e);
    }
}

check();
