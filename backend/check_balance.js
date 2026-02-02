import { ethers } from 'ethers';
const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");
const ADDRESS = "0x8256e30bc5058762dd891ec98cb84a58c28bfd51";
async function check() {
    const balance = await provider.getBalance(ADDRESS);
    console.log(`Balance: ${ethers.utils.formatEther(balance)} GO`);
}
check();
