import express from 'express';
import { getUserById, getTopCreators, updateProfile, getUserProfile } from '../controllers/userController.js';
import { validate, updateProfileSchema } from '../middleware/validation.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/rankings', getTopCreators);
router.get('/:id', getUserById);

// Protected routes
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, validate(updateProfileSchema), updateProfile);

export default router;
