import { ethers } from 'ethers';

const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");
const MARKET_ADDRESS = "0x68B1D87F95878fE05B998F19b66F4baba5De1aed";
const MARKET_ABI = [
  "function items(uint256) view returns (uint256 itemId, address nft, uint256 tokenId, uint256 price, address seller, bool sold)"
];

async function check() {
    try {
        const contract = new ethers.Contract(MARKET_ADDRESS, MARKET_ABI, provider);
        const item = await contract.items(1);
        console.log("Item 1 Details:");
        console.log(`- Item ID: ${item.itemId.toString()}`);
        console.log(`- NFT Contract: ${item.nft}`);
        console.log(`- Price: ${ethers.utils.formatEther(item.price)} GO`);
        console.log(`- Seller: ${item.seller}`);
        console.log(`- Sold: ${item.sold}`);
    } catch (e) {
        console.error("Error:", e);
    }
}

check();
