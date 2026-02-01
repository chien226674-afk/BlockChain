import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// @desc    Register user
// @route   POST /api/users/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { username, email, password, walletAddress } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password,
      walletAddress
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        walletAddress: user.walletAddress,
        role: user.role,
        token: generateToken(user._id)
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      walletAddress: user.walletAddress,
      role: user.role,
      totalSales: user.totalSales,
      totalVolume: user.totalVolume,
      nftsSold: user.nftsSold,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login with Wallet
// @route   POST /api/users/login-wallet
// @access  Public
export const loginWithWallet = async (req, res) => {
  try {
    const { walletAddress } = req.body;

    if (!walletAddress) {
      return res.status(400).json({ message: 'Wallet address is required' });
    }

    let user = await User.findOne({ walletAddress });

    if (!user) {
      // Create new user if not exists
      // Generate a temporary username based on wallet address if one isn't provided (or handle registration UI flow separately)
      // For this step, we'll auto-register a basic user
      user = await User.create({
        username: `user_${walletAddress.substring(2, 8)}`,
        email: `${walletAddress}@placeholder.com`, // Placeholder email, valid format
        password: await bcrypt.hash(Math.random().toString(36), 10), // Random password
        walletAddress,
        role: 'user'
      });
    }

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      walletAddress: user.walletAddress,
      role: user.role,
      totalSales: user.totalSales,
      totalVolume: user.totalVolume,
      nftsSold: user.nftsSold,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get top creators
// @route   GET /api/users/top-creators
// @access  Public
export const getTopCreators = async (req, res) => {
  try {
    const { timeframe = 'all' } = req.query;
    let sortCriteria = {};

    switch (timeframe) {
      case 'today':
        // Logic for today (cần thêm trường lastActivityDate trong User model)
        sortCriteria = { totalVolume: -1 };
        break;
      case 'week':
        // Logic for this week
        sortCriteria = { totalVolume: -1 };
        break;
      case 'month':
        // Logic for this month
        sortCriteria = { totalVolume: -1 };
        break;
      default:
        sortCriteria = { totalVolume: -1 };
    }

    const creators = await User.find({ role: 'artist' })
      .sort(sortCriteria)
      .limit(12)
      .select('username profileImage totalSales totalVolume nftsSold');

    res.json(creators);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.bio = req.body.bio || user.bio;
    user.walletAddress = req.body.walletAddress || user.walletAddress;
    user.profileImage = req.body.profileImage || user.profileImage;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      bio: updatedUser.bio,
      walletAddress: updatedUser.walletAddress,
      profileImage: updatedUser.profileImage
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};