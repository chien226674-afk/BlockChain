const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  bannerImage: {
    type: String
  },
  profileImage: {
    type: String
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  nfts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NFT'
  }],
  category: {
    type: String,
    enum: ['art', 'photography', 'games', 'metaverse', 'other'],
    default: 'art'
  },
  totalVolume: {
    type: Number,
    default: 0
  },
  floorPrice: {
    type: Number,
    default: 0
  },
  website: {
    type: String
  },
  discord: {
    type: String
  },
  twitter: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Collection', collectionSchema);