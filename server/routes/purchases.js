import express from 'express';
import InventoryPurchase from '../models/InventoryPurchase.js';
import InventoryItem from '../models/InventoryItem.js';
import InventoryTransaction from '../models/InventoryTransaction.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/purchases
// @desc    Get all purchases
// @access  Private/Admin or Team
router.get('/', protect, authorize('admin', 'team'), async (req, res) => {
  try {
    const { page = 1, limit = 20, inventoryItem, supplier, startDate, endDate } = req.query;

    const filter = {};
    if (inventoryItem) filter.inventoryItem = inventoryItem;
    if (supplier) filter.supplier = supplier;
    if (startDate || endDate) {
      filter.purchaseDate = {};
      if (startDate) filter.purchaseDate.$gte = new Date(startDate);
      if (endDate) filter.purchaseDate.$lte = new Date(endDate);
    }

    const purchases = await InventoryPurchase.find(filter)
      .populate('inventoryItem', 'name unit')
      .populate('supplier', 'name location')
      .populate('recordedBy', 'name')
      .sort('-purchaseDate')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await InventoryPurchase.countDocuments(filter);

    res.json({
      success: true,
      count: purchases.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: purchases
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/purchases/:id
// @desc    Get single purchase
// @access  Private/Admin or Team
router.get('/:id', protect, authorize('admin', 'team'), async (req, res) => {
  try {
    const purchase = await InventoryPurchase.findById(req.params.id)
      .populate('inventoryItem', 'name unit currentStock')
      .populate('supplier', 'name location contactPhone')
      .populate('recordedBy', 'name');

    if (!purchase) {
      return res.status(404).json({
        success: false,
        message: 'Purchase not found'
      });
    }

    res.json({
      success: true,
      data: purchase
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/purchases
// @desc    Create purchase and update inventory
// @access  Private/Admin
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const {
      inventoryItem,
      supplier,
      quantity,
      unit,
      unitPrice,
      purchaseLocation,
      purchaseDate,
      qualityGrade,
      paymentMethod,
      paymentStatus,
      notes
    } = req.body;

    // Verify inventory item exists
    const item = await InventoryItem.findById(inventoryItem);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Inventory item not found'
      });
    }

    // Calculate total cost
    const totalCost = quantity * unitPrice;

    // Create purchase record
    const purchase = await InventoryPurchase.create({
      inventoryItem,
      supplier,
      quantity,
      unit,
      unitPrice,
      totalCost,
      purchaseLocation,
      purchaseDate: purchaseDate || new Date(),
      qualityGrade,
      paymentMethod,
      paymentStatus,
      notes,
      recordedBy: req.user._id
    });

    // Calculate unit cost in base units (per gram/ml)
    let unitCostPerBaseUnit = unitPrice;
    if (unit === 'kg' || unit === 'liter') {
      unitCostPerBaseUnit = unitPrice / 1000;
    }

    // Create inventory transaction to add stock
    await InventoryTransaction.createTransaction({
      inventoryItem,
      type: 'purchase',
      quantity,
      unit,
      unitCost: unitCostPerBaseUnit,
      notes: `Purchase ${purchase.purchaseNumber}`,
      reference: { type: 'purchase', id: purchase._id },
      recordedBy: req.user._id
    });

    // Reload purchase with populated fields
    const populatedPurchase = await InventoryPurchase.findById(purchase._id)
      .populate('inventoryItem', 'name unit currentStock')
      .populate('supplier', 'name')
      .populate('recordedBy', 'name');

    res.status(201).json({
      success: true,
      data: populatedPurchase
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   PUT /api/purchases/:id
// @desc    Update purchase (non-quantity fields only)
// @access  Private/Admin
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    // Don't allow updating quantity/unitPrice as it would require recalculating inventory
    const { quantity, unitPrice, totalCost, inventoryItem, ...updateData } = req.body;

    const purchase = await InventoryPurchase.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('inventoryItem', 'name unit')
      .populate('supplier', 'name')
      .populate('recordedBy', 'name');

    if (!purchase) {
      return res.status(404).json({
        success: false,
        message: 'Purchase not found'
      });
    }

    res.json({
      success: true,
      data: purchase
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;
