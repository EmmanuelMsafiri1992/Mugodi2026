import express from 'express';
import Banner from '../models/Banner.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/banners
// @desc    Get active banners
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { type } = req.query;
    const now = new Date();

    const filter = {
      isActive: true,
      $or: [
        { startDate: null },
        { startDate: { $lte: now } }
      ],
      $and: [
        {
          $or: [
            { endDate: null },
            { endDate: { $gte: now } }
          ]
        }
      ]
    };

    if (type) filter.type = type;

    const banners = await Banner.find(filter)
      .populate('linkedCategory', 'name slug')
      .populate('linkedProduct', 'name slug')
      .sort('sortOrder');

    res.json({
      success: true,
      count: banners.length,
      data: banners
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// ADMIN ROUTES

// @route   GET /api/banners/admin/all
// @desc    Get all banners (admin)
// @access  Private/Admin or Team
router.get('/admin/all', protect, authorize('admin', 'team'), async (req, res) => {
  try {
    const banners = await Banner.find()
      .populate('linkedCategory', 'name')
      .populate('linkedProduct', 'name')
      .sort('sortOrder -createdAt');

    res.json({
      success: true,
      count: banners.length,
      data: banners
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/banners
// @desc    Create banner
// @access  Private/Admin
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const banner = await Banner.create(req.body);
    res.status(201).json({
      success: true,
      data: banner
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   PUT /api/banners/:id
// @desc    Update banner
// @access  Private/Admin
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const banner = await Banner.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: 'Banner not found'
      });
    }

    res.json({
      success: true,
      data: banner
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   DELETE /api/banners/:id
// @desc    Delete banner
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: 'Banner not found'
      });
    }

    res.json({
      success: true,
      message: 'Banner deleted'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;
