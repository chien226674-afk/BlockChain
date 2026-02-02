import bcrypt from 'bcryptjs';
import jsonwebtoken from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import NFT from '../models/NFT.js';
import { verifySignature as verifyWalletSignature, generateNonceMessage } from '../utils/walletValidator.js';
import { AuthenticationError, ValidationError, NotFoundError } from '../utils/errors.js';
import nonceManager from '../utils/nonceManager.js';

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';

// Register User (Username/Password)
export const register = async (req, res) => {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ 
        $or: [{ username }, { email: email || '' }] 
    });
    
    if (existingUser) {
        throw new ValidationError('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
        username,
        email,
        password: hashedPassword,
    });

    await newUser.save();

    const token = jsonwebtoken.sign(
        { id: newUser._id, role: newUser.role }, 
        SECRET_KEY, 
        { expiresIn: '7d' }
    );

    res.status(201).json({ 
        success: true,
        token, 
        user: { 
            id: newUser._id, 
            username, 
            email, 
            avatar: newUser.avatar, 
            role: newUser.role,
            walletAddress: newUser.walletAddress
        } 
    });
};

// Login User (Username/Password)
export const login = async (req, res) => {
    const { username, email, password } = req.body;
    
    // Find user by username OR email
    const query = username ? { username } : { email };
    if (!username && !email) {
        throw new ValidationError('Username or password is required');
    }

    const user = await User.findOne({ 
        $or: [{ username }, { email }] 
    });

    if (!user || !user.password) {
        throw new AuthenticationError('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new AuthenticationError('Invalid credentials');
    }

    const token = jsonwebtoken.sign(
        { id: user._id, role: user.role }, 
        SECRET_KEY, 
        { expiresIn: '7d' }
    );

    res.json({ 
        success: true,
        token, 
        user: { 
            id: user._id, 
            username: user.username, 
            email: user.email, 
            avatar: user.avatar, 
            role: user.role,
            walletAddress: user.walletAddress
        } 
    });
};

// Web3: Get Nonce
export const getNonce = async (req, res) => {
    const { walletAddress } = req.params;
    
    if (!walletAddress || !/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
        throw new ValidationError('Invalid Ethereum address format');
    }

    let user = await User.findOne({ walletAddress: walletAddress.toLowerCase() });
    
    if (!user) {
        const randomNonce = crypto.randomBytes(16).toString('hex');
        user = new User({
            walletAddress: walletAddress.toLowerCase(),
            username: `user_${walletAddress.slice(2, 8)}`,
            nonce: randomNonce
        });
        await user.save();
    } else {
        user.nonce = crypto.randomBytes(16).toString('hex');
        await user.save();
    }

    // Track nonce in nonce manager (15 min expiration)
    const nonceData = nonceManager.createNonce(user._id.toString(), user.nonce);

    res.json({ 
        success: true,
        nonce: user.nonce,
        message: generateNonceMessage(user.nonce),
        expiresAt: nonceData.expiresAt
    });
};

// Web3: Verify Signature
export const verifySignature = async (req, res) => {
    const { walletAddress, signature } = req.body;
    console.log("Verifying signature for:", walletAddress);
    console.log("Signature received:", signature);

    const user = await User.findOne({ walletAddress: walletAddress.toLowerCase() });
    if (!user || !user.nonce) {
        console.error("User or nonce not found for:", walletAddress);
        throw new NotFoundError('User');
    }

    // Verify nonce hasn't expired or been used (replay attack prevention)
    const isNonceValid = nonceManager.verifyAndConsume(user._id.toString(), user.nonce);
    if (!isNonceValid) {
        console.error("Nonce invalid or expired for user:", user._id);
        throw new AuthenticationError('Nonce expired or already used. Please request a new nonce.');
    }

    const message = generateNonceMessage(user.nonce);
    console.log("Expected message (signing):", message);
    console.log("Using nonce from DB:", user.nonce);
    
    const isValid = verifyWalletSignature(message, signature, walletAddress);
    console.log("Verification result:", isValid);

    if (!isValid) {
        console.error("Signature mismatch. Address provided:", walletAddress);
        throw new AuthenticationError('Invalid signature');
    }

    // Issue JWT
    const token = jsonwebtoken.sign(
        { id: user._id, walletAddress: user.walletAddress, role: user.role }, 
        SECRET_KEY, 
        { expiresIn: '7d' }
    );

    // Rotate nonce (one-time use)
    user.nonce = crypto.randomBytes(16).toString('hex');
    await user.save();

    res.json({ 
        success: true,
        token, 
        user: { 
            id: user._id, 
            username: user.username, 
            walletAddress, 
            avatar: user.avatar, 
            role: user.role,
            email: user.email
        } 
    });
};

// Web3: Link Wallet to Existing Account
export const linkWallet = async (req, res) => {
    const { walletAddress, signature } = req.body;
    const userId = req.user.id || req.user._id;

    console.log(`Linking wallet ${walletAddress} to user ${userId}`);

    // 1. Check if wallet is already linked to ANOTHER user
    const existingUserWithWallet = await User.findOne({ 
        walletAddress: walletAddress.toLowerCase(),
        _id: { $ne: userId } 
    });

    if (existingUserWithWallet) {
        // Conflict Resolution: If the other user is JUST a placeholder (no password, no email, and no NFTs)
        // we can allow the current user to "reclaim" the wallet address.
        const isPlaceholder = !existingUserWithWallet.password && !existingUserWithWallet.email;
        if (isPlaceholder) {
            const hasNFTs = await NFT.exists({ 
                $or: [
                    { creator: existingUserWithWallet._id },
                    { owner: existingUserWithWallet._id }
                ] 
            });

            if (!hasNFTs) {
                console.log(`Reclaiming wallet from placeholder account ${existingUserWithWallet.username}`);
                existingUserWithWallet.walletAddress = undefined;
                await existingUserWithWallet.save();
            } else {
                // Merging Logic: If placeholder has NFTs, move them to the current user
                console.log(`Merging ${existingUserWithWallet.username} NFTs into current account...`);
                await NFT.updateMany(
                    { creator: existingUserWithWallet._id },
                    { creator: userId }
                );
                await NFT.updateMany(
                    { owner: existingUserWithWallet._id },
                    { owner: userId }
                );
                
                // Remove wallet from placeholder
                existingUserWithWallet.walletAddress = undefined;
                await existingUserWithWallet.save();
                console.log(`Merge complete for ${existingUserWithWallet.username}`);
            }
        } else {
            throw new ValidationError(`This wallet is already linked to another account (${existingUserWithWallet.username}).`);
        }
    }

    const user = await User.findById(userId);
    if (!user) {
        throw new NotFoundError('User');
    }

    // 2. Verify signature
    const message = generateNonceMessage(user.nonce);
    const isValid = verifyWalletSignature(message, signature, walletAddress);

    if (!isValid) {
        throw new AuthenticationError('Invalid signature');
    }

    // 3. Link and rotate nonce
    user.walletAddress = walletAddress.toLowerCase();
    user.nonce = crypto.randomBytes(16).toString('hex');
    await user.save();

    res.json({
        success: true,
        message: 'Wallet linked successfully',
        user: {
            id: user._id,
            username: user.username,
            walletAddress: user.walletAddress,
            avatar: user.avatar,
            role: user.role,
            email: user.email,
            bio: user.bio
        }
    });
};
