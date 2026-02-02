import mongoose from 'mongoose';

const marketItemSchema = new mongoose.Schema({
  tokenId: {
    type: String,
    required: true,
  },
  nft: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NFT',
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  price: {
    type: Number, // In ETH
    required: true,
  },
  status: {
    type: String,
    enum: ['listed', 'sold', 'canceled'],
    default: 'listed',
  },
  itemId: {
    type: String, // ID on the blockchain smart contract
    required: true,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const MarketItem = mongoose.model('MarketItem', marketItemSchema);
export default MarketItem;
