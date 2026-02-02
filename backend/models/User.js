import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    // required: true, // Optional for wallet login?? User required username+password OR wallet. 
    // Prompt says "User đăng ký / đăng nhập bằng username + password" AND "User có thể connect ví MetaMask".
    // I'll make email optional if they just use wallet, or required if they register.
    // Let's stick to prompt: "User đăng ký / đăng nhập bằng username + password" (Base) + "Connect Wallet" (Feature).
    unique: true,
    sparse: true 
  },
  password: {
    type: String,
    // required: true 
  },
  walletAddress: {
    type: String,
    unique: true,
    sparse: true, // Allows null/undefined to not conflict
    lowercase: true,
  },
  nonce: {
    type: String,
    default: () => Math.floor(Math.random() * 1000000).toString(), // Simple numeric nonce
  },
  avatar: {
    type: String,
    default: '',
  },
  bio: {
    type: String,
    default: '',
    maxlength: 500,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model('User', userSchema);
export default User;
