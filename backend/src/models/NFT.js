const mongoose = require('mongoose');

const nftSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  priceInETH: {
    type: Number,
    default: 0
  },
  category: {
    type: String,
    enum: ['art', 'collectible', 'game', 'utility', 'other'],
    default: 'art'
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  collectionName: {
    type: String,
    default: ''
  },
  attributes: [{
    trait_type: String,
    value: String
  }],
  isListed: {
    type: Boolean,
    default: true
  },
  isAuction: {
    type: Boolean,
    default: false
  },
  auctionEndTime: {
    type: Date
  },
  currentBid: {
    type: Number,
    default: 0
  },
  highestBidder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  views: {
    type: Number,
    default: 0
  },
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('NFT', nftSchema);