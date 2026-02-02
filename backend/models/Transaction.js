import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  txHash: {
    type: String,
    required: true,
    unique: true,
  },
  from: {
    type: String, // Wallet address
    required: true,
    lowercase: true,
  },
  to: {
    type: String, // Wallet address
    required: true,
    lowercase: true,
  },
  tokenId: {
    type: String,
  },
  price: {
    type: Number,
  },
  type: {
    type: String,
    enum: ['mint', 'list', 'buy', 'cancel', 'transfer'],
    default: 'transfer',
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Transaction = mongoose.model('Transaction', transactionSchema);
export default Transaction;
