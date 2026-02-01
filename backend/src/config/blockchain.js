// config/blockchain.js
const Web3 = require('web3');
const ethers = require('ethers');
const NFTTokenABI = require('./contracts/NFTToken.json');
const NFTMarketplaceABI = require('./contracts/NFTMarketplace.json');

class BlockchainService {
    constructor() {
        this.provider = new ethers.JsonRpcProvider(process.env.RPC_URL || 'http://localhost:8545');
        this.web3 = new Web3(process.env.RPC_URL || 'http://localhost:8545');
        
        // Khởi tạo contracts
        this.nftToken = new ethers.Contract(
            process.env.NFT_TOKEN_ADDRESS,
            NFTTokenABI.abi,
            this.provider
        );
        
        this.marketplace = new ethers.Contract(
            process.env.MARKETPLACE_ADDRESS,
            NFTMarketplaceABI.abi,
            this.provider
        );
        
        this.signer = new ethers.Wallet(process.env.PRIVATE_KEY, this.provider);
        this.nftTokenWithSigner = this.nftToken.connect(this.signer);
        this.marketplaceWithSigner = this.marketplace.connect(this.signer);
    }
    
    // Kết nối với MetaMask từ frontend
    async connectToMetaMask() {
        if (typeof window.ethereum !== 'undefined') {
            try {
                // Request account access
                const accounts = await window.ethereum.request({ 
                    method: 'eth_requestAccounts' 
                });
                
                const provider = new ethers.BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
                
                return {
                    success: true,
                    address: accounts[0],
                    signer: signer
                };
            } catch (error) {
                return {
                    success: false,
                    error: error.message
                };
            }
        } else {
            return {
                success: false,
                error: 'MetaMask not installed'
            };
        }
    }
    
    // Mint NFT
    async mintNFT(metadataURI, royaltyPercentage, userAddress) {
        try {
            const tx = await this.nftTokenWithSigner.safeMint(
                userAddress,
                metadataURI,
                royaltyPercentage,
                { gasLimit: 3000000 }
            );
            
            const receipt = await tx.wait();
            return {
                success: true,
                transactionHash: receipt.hash,
                tokenId: receipt.logs[0].topics[3] // Extract tokenId from event
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    // List NFT for sale
    async listNFT(tokenId, price, userAddress) {
        try {
            const listingFee = await this.nftTokenWithSigner.listingFee();
            
            const tx = await this.nftTokenWithSigner.listNFT(
                tokenId,
                price,
                { value: listingFee, gasLimit: 3000000 }
            );
            
            const receipt = await tx.wait();
            return {
                success: true,
                transactionHash: receipt.hash
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    // Buy NFT
    async buyNFT(tokenId, price, userAddress) {
        try {
            const tx = await this.nftTokenWithSigner.buyNFT(
                tokenId,
                { value: price, gasLimit: 3000000 }
            );
            
            const receipt = await tx.wait();
            return {
                success: true,
                transactionHash: receipt.hash
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    // Create Auction
    async createAuction(tokenId, startPrice, durationHours, userAddress) {
        try {
            const auctionFee = await this.nftTokenWithSigner.auctionFee();
            
            const tx = await this.nftTokenWithSigner.createAuction(
                tokenId,
                startPrice,
                durationHours,
                { value: auctionFee, gasLimit: 3000000 }
            );
            
            const receipt = await tx.wait();
            return {
                success: true,
                transactionHash: receipt.hash
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    // Get active listings
    async getActiveListings() {
        try {
            const listings = await this.nftTokenWithSigner.getActiveListings();
            return {
                success: true,
                listings: listings
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
}

module.exports = new BlockchainService();