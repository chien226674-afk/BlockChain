import { ethers } from 'ethers';

const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");
const CBS_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

async function check() {
    try {
        const network = await provider.getNetwork();
        console.log(`Connected to chainId: ${network.chainId}`);

        const code = await provider.getCode(CBS_ADDRESS);
        console.log(`Code at ${CBS_ADDRESS}: ${code.slice(0, 50)}...`);

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
