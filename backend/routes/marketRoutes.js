import express from 'express';
import { getMarketItems, getMarketItemById, syncFromChain } from '../controllers/marketController.js';
import { validate, createListingSchema } from '../middleware/validation.js';

const router = express.Router();

// Get all market items
router.get('/items', getMarketItems);

// Get specific market item
router.get('/items/:id', getMarketItemById);

// Sync from blockchain
router.post('/sync-from-chain', syncFromChain);

// Create listing (if needed)
// router.post('/list', validate(createListingSchema), createListing);

export default router;
