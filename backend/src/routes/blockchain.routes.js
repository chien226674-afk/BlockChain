const express = require('express');
const router = express.Router();
const { ethers } = require('ethers');
const BitcoinNFTMarketplace = require('../artifacts/contracts/BitcoinNFTMarketplace.sol/BitcoinNFTMarketplace.json');

// Cấu hình cho Mezo Testnet
const MEZO_RPC = "https://mezo-testnet.g.alchemy.com/public";
const provider = new ethers.providers.JsonRpcProvider(MEZO_RPC);

let contract;
let signer;

// Khởi tạo contract
async function initContract() {
  const contractAddress = process.env.CONTRACT_ADDRESS;
  const privateKey = process.env.PRIVATE_KEY;
  
  signer = new ethers.Wallet(privateKey, provider);
  contract = new ethers.Contract(contractAddress, BitcoinNFTMarketplace.abi, signer);
  
  console.log("Contract initialized on Mezo Testnet");
  console.log("Contract address:", contractAddress);
  console.log("Signer address:", signer.address);
}

// API: Mint NFT với BTC
router.post('/mint-btc', async (req, res) => {
  try {
    const { tokenURI, price } = req.body;
    
    // Kết nối với user's wallet
    const userProvider = new ethers.providers.Web3Provider(req.headers['web3-provider']);
    const userSigner = userProvider.getSigner();
    const userContract = contract.connect(userSigner);
    
    // Lấy listing price
    const listingPrice = await userContract.getListingPrice();
    
    // Mint NFT
    const tx = await userContract.createToken(tokenURI, ethers.utils.parseEther(price), {
      value: listingPrice
    });
    
    const receipt = await tx.wait();
    
    res.json({
      success: true,
      transactionHash: tx.hash,
      tokenId: receipt.events[0].args.tokenId.toString(),
      price: price + " BTC"
    });
  } catch (error) {
    console.error('Mint BTC NFT error:', error);
    res.status(500).json({ error: error.message });
  }
});

// API: Mua NFT với BTC
router.post('/buy-btc', async (req, res) => {
  try {
    const { tokenId } = req.body;
    
    const userProvider = new ethers.providers.Web3Provider(req.headers['web3-provider']);
    const userSigner = userProvider.getSigner();
    const userContract = contract.connect(userSigner);
    
    // Lấy giá NFT
    const marketItems = await userContract.fetchMarketItems();
    let itemPrice = 0;
    
    for (let item of marketItems) {
      if (item.tokenId.toString() === tokenId) {
        itemPrice = ethers.utils.formatEther(item.price);
        break;
      }
    }
    
    if (itemPrice === 0) {
      throw new Error('NFT not found or already sold');
    }
    
    // Mua NFT
    const tx = await userContract.createMarketSale(tokenId, {
      value: ethers.utils.parseEther(itemPrice)
    });
    
    await tx.wait();
    
    res.json({
      success: true,
      transactionHash: tx.hash,
      tokenId: tokenId,
      price: itemPrice + " BTC"
    });
  } catch (error) {
    console.error('Buy BTC NFT error:', error);
    res.status(500).json({ error: error.message });
  }
});

// API: Lấy tất cả NFT
router.get('/btc-nfts', async (req, res) => {
  try {
    const items = await contract.fetchMarketItems();
    
    const formattedItems = items.map(item => ({
      tokenId: item.tokenId.toString(),
      seller: item.seller,
      owner: item.owner,
      price: ethers.utils.formatEther(item.price) + " BTC",
      sold: item.sold
    }));
    
    res.json({
      success: true,
      items: formattedItems,
      count: formattedItems.length,
      network: "Mezo Testnet (Bitcoin L2)"
    });
  } catch (error) {
    console.error('Fetch BTC NFTs error:', error);
    res.status(500).json({ error: error.message });
  }
});

// API: Kiểm tra balance BTC
router.get('/btc-balance/:address', async (req, res) => {
  try {
    const address = req.params.address;
    const balance = await provider.getBalance(address);
    
    res.json({
      success: true,
      address: address,
      balance: ethers.utils.formatEther(balance) + " BTC",
      balanceWei: balance.toString()
    });
  } catch (error) {
    console.error('BTC balance error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Khởi tạo contract
initContract().catch(console.error);

module.exports = router;