import NFT from '../models/NFT.js';
import MarketItem from '../models/MarketItem.js';
import User from '../models/User.js';
import { uploadFileToIPFS, uploadJSONToIPFS } from '../utils/pinata.js';
import fs from 'fs/promises';

// Upload Image to IPFS
export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const ipfsUrl = await uploadFileToIPFS(req.file);
    
    // Clean up local file usually, but for now we might keep it or delete it
    try {
        await fs.unlink(req.file.path);
    } catch(e) { console.error("Cleanup error", e)}

    res.json({ imageUrl: ipfsUrl });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading image', error: error.message });
  }
};

// Ensure Metadata
export const createMetadata = async (req, res) => {
  try {
    const { name, description, image, attributes } = req.body;
    if (!name || !description || !image) {
        return res.status(400).json({ message: 'Missing required fields' });
    }
    
    const metadata = { name, description, image, attributes };
    const tokenURI = await uploadJSONToIPFS(metadata);
    
    res.json({ tokenURI });
  } catch (error) {
    res.status(500).json({ message: 'Error creating metadata', error: error.message });
  }
};

// Create NFT in DB (Called after minting on frontend usually, or we can listen to events)
// For now, let's assume frontend calls this after minting to cache it immediately
export const createNFT = async (req, res) => {
    try {
        console.log("Create NFT Internal Body:", req.body);
        const { tokenId, contractAddress, name, description, image, tokenURI, creatorId, price, itemId } = req.body;
        
        // Basic validation
        if (!tokenId || !tokenURI || !contractAddress) {
            console.error("DEBUG: Sync failure details:", { 
                hasTokenId: !!tokenId, 
                hasTokenURI: !!tokenURI, 
                hasContractAddress: !!contractAddress,
                receivedBody: req.body 
            });
            return res.status(400).json({ message: 'TokenID, TokenURI and ContractAddress are required' });
        }
        // Resolve creator/owner (handle both Wallet and ObjectId)
        let userId = creatorId;
        if (creatorId && creatorId.startsWith('0x')) {
            const user = await User.findOne({ walletAddress: creatorId.toLowerCase() });
            if (user) {
                userId = user._id;
            } else {
                // If user not found, create a placeholder
                const newUser = new User({ 
                    walletAddress: creatorId.toLowerCase(),
                    username: `user_${creatorId.slice(2, 8)}`
                });
                await newUser.save();
                userId = newUser._id;
            }
        }

        const newNFT = new NFT({
            tokenId,
            contractAddress: contractAddress.toLowerCase(),
            name,
            description,
            image,
            tokenURI,
            creator: userId,
            owner: userId,
            price: Number(price) || 0,
            itemId
        });

        await newNFT.save();

        // Sync with MarketItem if listed
        if (itemId && price) {
            console.log("Creating MarketItem for newly created NFT...");
            await MarketItem.findOneAndUpdate(
                { itemId: itemId },
                {
                    itemId: itemId,
                    tokenId: tokenId,
                    nft: newNFT._id,
                    seller: userId, // Fixed: use resolved userId instead of creatorId
                    price: price,
                    status: 'listed'
                },
                { upsert: true, new: true }
            );
        }

        res.status(201).json(newNFT);
    } catch (error) {
        res.status(500).json({ message: 'Error creating NFT record', error: error.message });
    }
}

export const getAllNFTs = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) {
        query = { 
            $or: [ 
                { name: { $regex: search, $options: 'i' } },
                // Populate creator to search by creator name? Complex.
            ]
        };
    }

    const nfts = await NFT.find(query).populate('creator', 'username avatar walletAddress').populate('owner', 'username avatar walletAddress');
    res.json(nfts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getNFTById = async (req, res) => {
  try {
    const { id, contractAddress } = req.params;
    let query = { tokenId: id };
    if (contractAddress) {
      query.contractAddress = contractAddress.toLowerCase();
    }
    const nft = await NFT.findOne(query).populate('creator', 'username avatar walletAddress').populate('owner', 'username avatar walletAddress');
    if (!nft) {
      return res.status(404).json({ message: 'NFT not found' });
    }
    res.json(nft);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateNFT = async (req, res) => {
    try {
        const { price, itemId, owner } = req.body;
        const nft = await NFT.findOne({ tokenId: req.params.id });

        if (!nft) {
            return res.status(404).json({ message: 'NFT not found' });
        }

        if (price !== undefined) nft.price = price;
        if (itemId !== undefined) nft.itemId = itemId;
        if (owner !== undefined) nft.owner = owner;

        await nft.save();

        // Sync with MarketItem
        if (itemId !== undefined && price !== undefined) {
            console.log("Updating MarketItem for updated NFT...");
            await MarketItem.findOneAndUpdate(
                { itemId: itemId },
                {
                    itemId: itemId,
                    tokenId: nft.tokenId,
                    nft: nft._id,
                    seller: owner || nft.owner,
                    price: price,
                    status: 'listed'
                },
                { upsert: true, new: true }
            );
        }

        res.json(nft);
    } catch (error) {
        res.status(500).json({ message: 'Error updating NFT', error: error.message });
    }
};

export const buyNFT = async (req, res) => {
    try {
        const { buyerAddress } = req.body;
        const { id } = req.params; // tokenId

        if (!buyerAddress) {
            return res.status(400).json({ message: 'Buyer address is required' });
        }

        const nft = await NFT.findOne({ tokenId: id });
        if (!nft) {
            return res.status(404).json({ message: 'NFT not found' });
        }

        // Resolving buyer User
        let buyer = await User.findOne({ walletAddress: buyerAddress.toLowerCase() });
        if (!buyer) {
            buyer = new User({ 
                walletAddress: buyerAddress.toLowerCase(),
                username: `user_${buyerAddress.slice(2, 8)}`
            });
            await buyer.save();
        }

        // Update NFT owner
        nft.owner = buyer._id;
        nft.itemId = null; // Remove item ID as it is no longer listed
        await nft.save();

        // Update MarketItem status to sold
        await MarketItem.findOneAndUpdate(
            { nft: nft._id, status: 'listed' },
            { status: 'sold' }
        );

        res.json({ message: 'Purchase synchronized successfully', nft });
    } catch (error) {
        res.status(500).json({ message: 'Error synchronizing purchase', error: error.message });
    }
}
