import User from '../models/User.js';
import { NotFoundError, ValidationError } from '../utils/errors.js';

export const getUserById = async (req, res) => {
  const user = await User.findById(req.params.id).select('-password -nonce');
  
  if (!user) {
    throw new NotFoundError('User');
  }
  
  res.json({ success: true, user });
};

export const getTopCreators = async (req, res) => {
  // Get all users and mock volume for now
  const users = await User.find().select('-password -nonce').limit(10);
  
  const creators = users.map(u => ({
    ...u.toObject(),
    volume: Math.floor(Math.random() * 100) // Mock volume
  })).sort((a, b) => b.volume - a.volume);
  
  res.json({ success: true, creators });
};

// Get current user's profile
export const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id).select('-password -nonce');
  
  if (!user) {
    throw new NotFoundError('User');
  }
  
  res.json({ 
    success: true, 
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      walletAddress: user.walletAddress,
      avatar: user.avatar,
      role: user.role,
      bio: user.bio,
      createdAt: user.createdAt
    }
  });
};

// Update current user's profile
export const updateProfile = async (req, res) => {
  const { username, email, bio, avatar } = req.body;
  
  const user = await User.findById(req.user._id);
  
  if (!user) {
    throw new NotFoundError('User');
  }
  
  // Check if username is taken by another user
  if (username && username !== user.username) {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      throw new ValidationError('Username already taken');
    }
  }
  
  // Check if email is taken by another user
  if (email && email !== user.email) {
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      throw new ValidationError('Email already taken');
    }
  }
  
  // Update fields
  if (username) user.username = username;
  if (email) user.email = email;
  if (bio !== undefined) user.bio = bio;
  if (avatar) user.avatar = avatar;
  
  await user.save();
  
  res.json({ 
    success: true, 
    message: 'Profile updated successfully',
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      walletAddress: user.walletAddress,
      avatar: user.avatar,
      role: user.role,
      bio: user.bio
    }
  });
};
