import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { validate, registerSchema, loginSchema, verifySignatureSchema } from '../middleware/validation.js';
import { verifySignature, generateNonceMessage } from '../utils/walletValidator.js';
import { AuthenticationError, ValidationError, NotFoundError } from '../utils/errors.js';
import crypto from 'crypto';

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register new user
 * @access  Public
 */
router.post('/register', validate(registerSchema), async (req, res) => {
    const { username, email, password, walletAddress } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ 
        $or: [{ email }, { username }] 
    });

    if (existingUser) {
        throw new ValidationError('Username or email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
        username,
        email,
        password: hashedPassword,
        walletAddress: walletAddress || null
    });

    // Generate token
    const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );

    res.status(201).json({
        success: true,
        message: 'User registered successfully',
        token,
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            walletAddress: user.walletAddress
        }
    });
});

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', validate(loginSchema), async (req, res) => {
    const { username, password } = req.body;

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
        throw new AuthenticationError('Invalid credentials');
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new AuthenticationError('Invalid credentials');
    }

    // Generate token
    const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );

    res.json({
        success: true,
        message: 'Login successful',
        token,
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            walletAddress: user.walletAddress,
            avatar: user.avatar
        }
    });
});

/**
 * @route   GET /api/auth/nonce/:address
 * @desc    Get nonce for wallet signature
 * @access  Public
 */
router.get('/nonce/:address', async (req, res) => {
    const { address } = req.params;

    // Validate address format (done by route param validation if added)
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
        throw new ValidationError('Invalid Ethereum address format');
    }

    // Find or create user with this wallet
    let user = await User.findOne({ walletAddress: address });

    if (!user) {
        // Create temporary user entry
        const tempUsername = `user_${address.slice(2, 8)}`;
        user = await User.create({
            username: tempUsername,
            email: `${tempUsername}@temp.com`,
            password: await bcrypt.hash(crypto.randomBytes(32).toString('hex'), 10),
            walletAddress: address,
            nonce: crypto.randomBytes(16).toString('hex')
        });
    } else {
        // Generate new nonce
        user.nonce = crypto.randomBytes(16).toString('hex');
        await user.save();
    }

    res.json({
        success: true,
        nonce: user.nonce,
        message: generateNonceMessage(user.nonce)
    });
});

/**
 * @route   POST /api/auth/verify
 * @desc    Verify wallet signature and login
 * @access  Public
 */
router.post('/verify', validate(verifySignatureSchema), async (req, res) => {
    const { walletAddress, signature } = req.body;

    // Find user
    const user = await User.findOne({ walletAddress });
    if (!user || !user.nonce) {
        throw new NotFoundError('User');
    }

    // Verify signature
    const message = generateNonceMessage(user.nonce);
    const isValid = verifySignature(message, signature, walletAddress);

    if (!isValid) {
        throw new AuthenticationError('Invalid signature');
    }

    // Clear nonce (one-time use)
    user.nonce = null;
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );

    res.json({
        success: true,
        message: 'Wallet verified successfully',
        token,
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            walletAddress: user.walletAddress,
            avatar: user.avatar
        }
    });
});

export default router;
