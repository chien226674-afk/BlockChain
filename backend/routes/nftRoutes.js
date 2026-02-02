import express from 'express';
import { getAllNFTs, getNFTById, uploadImage, createMetadata, createNFT, updateNFT, buyNFT } from '../controllers/nftController.js';
import { uploadSingle, validateUploadedFile, handleUploadError } from '../middleware/upload.js';
import { validate, createNFTSchema } from '../middleware/validation.js';

const router = express.Router();

// Get all NFTs
router.get('/', getAllNFTs);

// Get NFT by ID (with optional contract address)
router.get('/:id/:contractAddress?', getNFTById);

// Upload image to IPFS
router.post('/upload-image', 
    uploadSingle, 
    handleUploadError,
    validateUploadedFile,
    uploadImage
);

// Create metadata
router.post('/create-metadata', createMetadata);

// Create NFT (internal sync)
router.post('/create', validate(createNFTSchema), createNFT);

// Update NFT (sync after listing or sale)
router.patch('/:id', updateNFT);

// Synchronize purchase
router.post('/:id/buy', buyNFT);

export default router;
