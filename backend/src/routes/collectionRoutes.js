const express = require('express');
const router = express.Router();
const {
  getCollections,
  getCollection,
  createCollection,
  addNFTToCollection
} = require('../controllers/collectionController');
const { protect } = require('../middleware/auth');

router.get('/', getCollections);
router.get('/:id', getCollection);
router.post('/', protect, createCollection);
router.post('/:id/nfts', protect, addNFTToCollection);

module.exports = router;