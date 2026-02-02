import MarketItem from '../models/MarketItem.js';
import NFT from '../models/NFT.js';
import User from '../models/User.js';

// Get active market items
export const getMarketItems = async (req, res) => {
  try {
    const items = await MarketItem.find({ status: 'listed' })
      .populate('nft')
      .populate('seller', 'username walletAddress avatar');
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get specific market item by ID
export const getMarketItemById = async (req, res) => {
  try {
    const item = await MarketItem.findById(req.params.id)
      .populate('nft')
      .populate('seller', 'username walletAddress avatar');
    
    if (!item) {
      return res.status(404).json({ message: 'Market item not found' });
    }
    
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create a new listing
export const createListing = async (req, res) => {
  try {
    const { nftId, price, itemId } = req.body;

    // Check if NFT exists
    const nft = await NFT.findById(nftId);
    if (!nft) {
      return res.status(404).json({ message: 'NFT not found' });
    }

    // Create market item
    const newItem = await MarketItem.create({
      itemId,
      nft: nftId,
      seller: req.user._id, // Assuming protected route attaches user
      price,
      status: 'listed'
    });

    res.status(201).json({ message: 'Listed successfully', item: newItem });
  } catch (error) {
    res.status(500).json({ message: 'Listing error', error: error.message });
  }
};

// Sync from chain (Mock / Placeholder)
export const syncFromChain = async (req, res) => {
  try {
    const { tokenId, contractAddress, price, sellerAddress, status, transactionHash } = req.body;
    
    // 1. Find or Create Seller
    let seller = await User.findOne({ walletAddress: sellerAddress.toLowerCase() });
    if (!seller) {
        seller = new User({ walletAddress: sellerAddress.toLowerCase(), username: `unknown_${sellerAddress.slice(2, 6)}` });
        await seller.save();
    }

    // 2. Find NFT with contractAddress
    const nft = await NFT.findOne({ tokenId, contractAddress: contractAddress?.toLowerCase() });
    if (!nft) {
        return res.status(404).json({ message: 'NFT not found locally.' });
    }

    // 3. Create/Update Market Item
    const newItem = await MarketItem.findOneAndUpdate(
        { tokenId, listingId: transactionHash },
        {
            nft: nft._id,
            seller: seller._id, // Fixed: use ObjectId
            price: parseFloat(price),
            status: status || 'listed',
            listingId: transactionHash
        },
        { upsert: true, new: true }
    );

    res.json({ message: 'Synced successfully', item: newItem });
  } catch (error) {
    res.status(500).json({ message: 'Sync error', error: error.message });
  }
};

