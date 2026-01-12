import express from 'express';
import User from '../models/User.js';
import WalletTransaction from '../models/WalletTransaction.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/wallet
// @desc    Get wallet balance
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('walletBalance');

    res.json({
      success: true,
      data: {
        balance: user.walletBalance
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/wallet/transactions
// @desc    Get wallet transactions
// @access  Private
router.get('/transactions', protect, async (req, res) => {
  try {
    const { page = 1, limit = 20, type } = req.query;

    const filter = { user: req.user._id };
    if (type) filter.type = type;

    const transactions = await WalletTransaction.find(filter)
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await WalletTransaction.countDocuments(filter);

    res.json({
      success: true,
      count: transactions.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: transactions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/wallet/add-funds
// @desc    Add funds to wallet (simulate payment)
// @access  Private
router.post('/add-funds', protect, async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid amount'
      });
    }

    const user = await User.findById(req.user._id);
    const newBalance = user.walletBalance + amount;

    await User.findByIdAndUpdate(req.user._id, {
      walletBalance: newBalance
    });

    await WalletTransaction.create({
      user: req.user._id,
      type: 'credit',
      amount,
      balanceAfter: newBalance,
      source: 'payment',
      description: 'Added funds to wallet'
    });

    res.json({
      success: true,
      message: `$${amount} added to wallet`,
      data: {
        balance: newBalance
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;
