const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  nft: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NFT',
    required: true
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  priceInETH: {
    type: Number,
    required: true
  },
  transactionHash: {
    type: String,
    unique: true
  },
  type: {
    type: String,
    enum: ['sale', 'bid', 'transfer'],
    default: 'sale'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Transaction', transactionSchema);