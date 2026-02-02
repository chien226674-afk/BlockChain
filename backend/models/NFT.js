import mongoose from 'mongoose';

const nftSchema = new mongoose.Schema({
  tokenId: {
    type: String, 
    required: true,
  },
  contractAddress: {
    type: String,
    required: true,
    lowercase: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  image: {
    type: String, 
    required: true,
  },
  tokenURI: {
    type: String, 
    required: true,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  attributes: [
    {
      trait_type: String,
      value: String,
    }
  ],
  price: {
    type: Number, 
    default: 0
  },
  itemId: {
    type: String, 
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound unique index for multi-contract support
nftSchema.index({ tokenId: 1, contractAddress: 1 }, { unique: true });

const NFT = mongoose.model('NFT', nftSchema);
export default NFT;
