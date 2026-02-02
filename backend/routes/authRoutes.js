import express from 'express';
import { register, login, getNonce, verifySignature, linkWallet } from '../controllers/authController.js';
import { validate, registerSchema, loginSchema, verifySignatureSchema } from '../middleware/validation.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Name/Pass Auth
router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);

// Web3 Auth
router.get('/nonce/me', protect, (req, res, next) => {
    // Forward to getNonce but using the current user's walletAddress if available
    // Or just fetch the user's nonce directly.
    next();
}, async (req, res) => {
    const user = await import('../models/User.js').then(m => m.default.findById(req.user.id));
    res.json({ 
        success: true, 
        nonce: user.nonce,
        message: `Please sign this message to verify your identity. Nonce: ${user.nonce}`
    });
});
router.get('/nonce/:walletAddress', getNonce);
router.post('/verify', validate(verifySignatureSchema), verifySignature);
router.post('/link-wallet', protect, validate(verifySignatureSchema), linkWallet);

export default router;
