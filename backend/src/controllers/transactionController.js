const Transaction = require('../models/Transaction');

// @desc    Get user transactions
// @route   GET /api/transactions/user
// @access  Private
exports.getUserTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      $or: [{ buyer: req.user.id }, { seller: req.user.id }]
    })
      .populate('nft', 'name image')
      .populate('buyer', 'username')
      .populate('seller', 'username')
      .sort({ createdAt: -1 });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all transactions (admin)
// @route   GET /api/transactions
// @access  Private/Admin
exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate('nft', 'name')
      .populate('buyer', 'username')
      .populate('seller', 'username')
      .sort({ createdAt: -1 });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};