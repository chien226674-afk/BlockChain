const express = require('express');
const router = express.Router();
const {
  getNFTs,
  getNFT,
  createNFT,
  updateNFT,
  deleteNFT,
  getTrendingCollections,
  placeBid,
  buyNFT,
  getTotalStats
} = require('../controllers/nftController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', getNFTs);
router.get('/trending', getTrendingCollections);
router.get('/stats/total', getTotalStats);
router.get('/:id', getNFT);

// Protected routes
router.post('/', protect, createNFT);
router.put('/:id', protect, updateNFT);
router.delete('/:id', protect, deleteNFT);
router.post('/:id/bid', protect, placeBid);
router.post('/:id/buy', protect, buyNFT);

// Upload image route
router.post('/upload', protect, upload.single('image'), (req, res) => {
  res.json({
    success: true,
    imageUrl: `/uploads/${req.file.filename}`
  });
});

module.exports = router;