const NFT = require('../models/NFT');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

// @desc    Get all NFTs
// @route   GET /api/nfts
// @access  Public
exports.getNFTs = async (req, res) => {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      sortBy = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 12,
      search
    } = req.query;

    const query = { isListed: true };

    // Filter by category
    if (category && category !== 'all') {
      query.category = category;
    }

    // Filter by price
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Search by name or description
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Sorting
    const sortOptions = {};
    sortOptions[sortBy] = order === 'asc' ? 1 : -1;

    // Pagination
    const startIndex = (Number(page) - 1) * Number(limit);
    const total = await NFT.countDocuments(query);

    const nfts = await NFT.find(query)
      .populate('creator', 'username profileImage')
      .populate('owner', 'username profileImage')
      .sort(sortOptions)
      .limit(Number(limit))
      .skip(startIndex);

    res.json({
      nfts,
      currentPage: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      totalItems: total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single NFT
// @route   GET /api/nfts/:id
// @access  Public
exports.getNFT = async (req, res) => {
  try {
    const nft = await NFT.findById(req.params.id)
      .populate('creator', 'username profileImage bio walletAddress')
      .populate('owner', 'username profileImage walletAddress')
      .populate('highestBidder', 'username profileImage');

    if (!nft) {
      return res.status(404).json({ message: 'NFT not found' });
    }

    // Increment view count
    nft.views += 1;
    await nft.save();

    res.json(nft);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create NFT
// @route   POST /api/nfts
// @access  Private
exports.createNFT = async (req, res) => {
  try {
    const {
      name,
      description,
      image,
      price,
      priceInETH,
      category,
      collectionName,
      attributes,
      isAuction,
      auctionEndTime
    } = req.body;

    const nft = await NFT.create({
      name,
      description,
      image,
      price,
      priceInETH: priceInETH || price / 2000, // Giả sử 1 ETH = 2000 USD
      category,
      creator: req.user.id,
      owner: req.user.id,
      collectionName,
      attributes: attributes ? JSON.parse(attributes) : [],
      isAuction: isAuction || false,
      auctionEndTime: isAuction ? auctionEndTime : null
    });

    // Populate creator and owner info
    const populatedNFT = await NFT.findById(nft._id)
      .populate('creator', 'username profileImage')
      .populate('owner', 'username profileImage');

    res.status(201).json(populatedNFT);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update NFT
// @route   PUT /api/nfts/:id
// @access  Private
exports.updateNFT = async (req, res) => {
  try {
    let nft = await NFT.findById(req.params.id);

    if (!nft) {
      return res.status(404).json({ message: 'NFT not found' });
    }

    // Check if user is owner
    if (nft.owner.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    nft = await NFT.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    ).populate('creator', 'username profileImage')
     .populate('owner', 'username profileImage');

    res.json(nft);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete NFT
// @route   DELETE /api/nfts/:id
// @access  Private
exports.deleteNFT = async (req, res) => {
  try {
    const nft = await NFT.findById(req.params.id);

    if (!nft) {
      return res.status(404).json({ message: 'NFT not found' });
    }

    // Check if user is owner
    if (nft.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await nft.remove();
    res.json({ message: 'NFT removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get trending collections
// @route   GET /api/nfts/trending
// @access  Public
exports.getTrendingCollections = async (req, res) => {
  try {
    // Giả lập dữ liệu trending collections dựa trên giao diện của bạn
    const trendingCollections = [
      {
        id: 1,
        name: 'Dagon Animals',
        nftCount: 1,
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dagon',
        floorPrice: '0.5 ETH',
        volume: '120 ETH'
      },
      {
        id: 2,
        name: 'Magic Mushrooms',
        nftCount: 1,
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mushroom',
        floorPrice: '0.3 ETH',
        volume: '85 ETH'
      },
      {
        id: 3,
        name: 'Disco Machines',
        nftCount: 1,
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Disco',
        floorPrice: '0.8 ETH',
        volume: '150 ETH'
      }
    ];

    res.json(trendingCollections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Place bid on NFT
// @route   POST /api/nfts/:id/bid
// @access  Private
exports.placeBid = async (req, res) => {
  try {
    const { bidAmount } = req.body;
    const nft = await NFT.findById(req.params.id);

    if (!nft) {
      return res.status(404).json({ message: 'NFT not found' });
    }

    if (!nft.isAuction) {
      return res.status(400).json({ message: 'This NFT is not for auction' });
    }

    if (nft.auctionEndTime && new Date() > nft.auctionEndTime) {
      return res.status(400).json({ message: 'Auction has ended' });
    }

    if (bidAmount <= nft.currentBid) {
      return res.status(400).json({ message: 'Bid must be higher than current bid' });
    }

    nft.currentBid = bidAmount;
    nft.highestBidder = req.user.id;
    await nft.save();

    res.json({
      message: 'Bid placed successfully',
      currentBid: nft.currentBid,
      highestBidder: req.user.id
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Buy NFT (fixed price)
// @route   POST /api/nfts/:id/buy
// @access  Private
exports.buyNFT = async (req, res) => {
  try {
    const nft = await NFT.findById(req.params.id);
    const buyer = await User.findById(req.user.id);

    if (!nft) {
      return res.status(404).json({ message: 'NFT not found' });
    }

    if (!nft.isListed) {
      return res.status(400).json({ message: 'NFT is not for sale' });
    }

    if (nft.isAuction) {
      return res.status(400).json({ message: 'This NFT is for auction, use bid endpoint' });
    }

    // Check if buyer is not the owner
    if (nft.owner.toString() === req.user.id) {
      return res.status(400).json({ message: 'You already own this NFT' });
    }

    // In a real application, you would integrate with a blockchain here
    // For now, we'll simulate the transaction

    // Create transaction record
    const transaction = await Transaction.create({
      nft: nft._id,
      seller: nft.owner,
      buyer: req.user.id,
      price: nft.price,
      priceInETH: nft.priceInETH,
      type: 'sale'
    });

    // Update NFT owner
    nft.owner = req.user.id;
    nft.isListed = false;
    await nft.save();

    // Update seller stats
    await User.findByIdAndUpdate(nft.creator, {
      $inc: { 
        totalSales: 1,
        totalVolume: nft.price,
        nftsSold: 1
      }
    });

    // Update buyer stats
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { totalSales: 1 }
    });

    res.json({
      message: 'NFT purchased successfully',
      transactionId: transaction._id,
      nft: nft
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get NFT statistics
// @route   GET /api/nfts/stats/total
// @access  Public
exports.getTotalStats = async (req, res) => {
  try {
    const totalSale = await NFT.countDocuments({ isListed: false });
    const auctions = await NFT.countDocuments({ isAuction: true, isListed: true });
    const artists = await User.countDocuments({ role: 'artist' });

    res.json({
      totalSale: totalSale + 240000, // Thêm số liệu mẫu
      auctions: auctions + 100000, // Thêm số liệu mẫu
      artists: artists + 240000 // Thêm số liệu mẫu
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};