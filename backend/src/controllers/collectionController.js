const Collection = require('../models/Collection');
const NFT = require('../models/NFT');

// @desc    Get all collections
// @route   GET /api/collections
// @access  Public
exports.getCollections = async (req, res) => {
  try {
    const collections = await Collection.find()
      .populate('creator', 'username profileImage')
      .sort({ totalVolume: -1 });

    res.json(collections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single collection
// @route   GET /api/collections/:id
// @access  Public
exports.getCollection = async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id)
      .populate('creator', 'username profileImage bio')
      .populate({
        path: 'nfts',
        populate: {
          path: 'owner',
          select: 'username profileImage'
        }
      });

    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }

    res.json(collection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create collection
// @route   POST /api/collections
// @access  Private
exports.createCollection = async (req, res) => {
  try {
    const collection = await Collection.create({
      ...req.body,
      creator: req.user.id
    });

    const populatedCollection = await Collection.findById(collection._id)
      .populate('creator', 'username profileImage');

    res.status(201).json(populatedCollection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add NFT to collection
// @route   POST /api/collections/:id/nfts
// @access  Private
exports.addNFTToCollection = async (req, res) => {
  try {
    const { nftId } = req.body;
    const collection = await Collection.findById(req.params.id);

    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }

    // Check if user is creator
    if (collection.creator.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const nft = await NFT.findById(nftId);
    if (!nft) {
      return res.status(404).json({ message: 'NFT not found' });
    }

    // Add NFT to collection if not already added
    if (!collection.nfts.includes(nftId)) {
      collection.nfts.push(nftId);
      await collection.save();
    }

    res.json(collection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};