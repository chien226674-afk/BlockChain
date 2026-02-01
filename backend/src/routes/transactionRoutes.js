const express = require('express');
const router = express.Router();
const {
  getUserTransactions,
  getAllTransactions
} = require('../controllers/transactionController');
const { protect, admin } = require('../middleware/auth');

router.get('/user', protect, getUserTransactions);
router.get('/', protect, admin, getAllTransactions);

module.exports = router;