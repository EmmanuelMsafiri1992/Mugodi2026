import express from 'express';
import User from '../models/User.js';
import LoyaltyTransaction from '../models/LoyaltyTransaction.js';
import WalletTransaction from '../models/WalletTransaction.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/loyalty
// @desc    Get loyalty points balance
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('loyaltyPoints');

    // Calculate wallet equivalent (1 point = $0.01)
    const walletEquivalent = user.loyaltyPoints * 0.01;

    res.json({
      success: true,
      data: {
        points: user.loyaltyPoints,
        walletEquivalent
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/loyalty/transactions
// @desc    Get loyalty transactions
// @access  Private
router.get('/transactions', protect, async (req, res) => {
  try {
    const { page = 1, limit = 20, type } = req.query;

    const filter = { user: req.user._id };
    if (type) filter.type = type;

    const transactions = await LoyaltyTransaction.find(filter)
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await LoyaltyTransaction.countDocuments(filter);

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

// @route   POST /api/loyalty/convert
// @desc    Convert loyalty points to wallet balance
// @access  Private
router.post('/convert', protect, async (req, res) => {
  try {
    const { points } = req.body;

    if (!points || points <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid points amount'
      });
    }

    // Minimum conversion: 100 points
    if (points < 100) {
      return res.status(400).json({
        success: false,
        message: 'Minimum 100 points required for conversion'
      });
    }

    const user = await User.findById(req.user._id);

    if (user.loyaltyPoints < points) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient points'
      });
    }

    const walletAmount = points * 0.01; // 1 point = $0.01
    const newPoints = user.loyaltyPoints - points;
    const newWalletBalance = user.walletBalance + walletAmount;

    await User.findByIdAndUpdate(req.user._id, {
      loyaltyPoints: newPoints,
      walletBalance: newWalletBalance
    });

    // Create loyalty transaction
    await LoyaltyTransaction.create({
      user: req.user._id,
      type: 'redeemed',
      points: -points,
      balanceAfter: newPoints,
      source: 'conversion',
      description: `Converted ${points} points to $${walletAmount.toFixed(2)}`
    });

    // Create wallet transaction
    await WalletTransaction.create({
      user: req.user._id,
      type: 'credit',
      amount: walletAmount,
      balanceAfter: newWalletBalance,
      source: 'loyalty_conversion',
      description: `Converted from ${points} loyalty points`
    });

    res.json({
      success: true,
      message: `Converted ${points} points to $${walletAmount.toFixed(2)}`,
      data: {
        points: newPoints,
        walletBalance: newWalletBalance
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
