import express from 'express';
const router = express.Router();
import {
  register,
  login,
  loginWithWallet,
  getProfile,
  updateProfile,
  getTopCreators
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

// Routes
router.post('/register', register);
router.post('/login', login);
router.post('/login-wallet', loginWithWallet);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.get('/top-creators', getTopCreators);

export default router;