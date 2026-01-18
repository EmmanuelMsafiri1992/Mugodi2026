import express from 'express';
import PackagingBatch from '../models/PackagingBatch.js';
import InventoryItem from '../models/InventoryItem.js';
import InventoryTransaction from '../models/InventoryTransaction.js';
import Product from '../models/Product.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/packaging
// @desc    Get all packaging batches
// @access  Private/Admin
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const { page = 1, limit = 20, status, inventoryItem } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (inventoryItem) filter.inventoryItem = inventoryItem;

    const batches = await PackagingBatch.find(filter)
      .populate('inventoryItem', 'name unit currentStock')
      .populate('packagedItems.product', 'name price stock')
      .populate('processedBy', 'name')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await PackagingBatch.countDocuments(filter);

    res.json({
      success: true,
      count: batches.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: batches
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/packaging/:id
// @desc    Get single packaging batch
// @access  Private/Admin
router.get('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const batch = await PackagingBatch.findById(req.params.id)
      .populate('inventoryItem', 'name unit currentStock')
      .populate('packagedItems.product', 'name price stock thumbnail')
      .populate('processedBy', 'name');

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: 'Packaging batch not found'
      });
    }

    res.json({
      success: true,
      data: batch
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/packaging
// @desc    Start a new packaging batch (take weight from inventory)
// @access  Private/Admin
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const { inventoryItem, weightTaken, notes } = req.body;

    // Verify inventory item exists and has sufficient stock
    const item = await InventoryItem.findById(inventoryItem);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Inventory item not found'
      });
    }

    if (item.currentStock < weightTaken) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock. Available: ${item.currentStock}${item.unit}, Requested: ${weightTaken}${item.unit}`
      });
    }

    // Create packaging batch
    const batch = await PackagingBatch.create({
      inventoryItem,
      weightTaken,
      actualWeight: weightTaken, // Default to same, can be updated after weighing
      notes,
      processedBy: req.user._id
    });

    // Deduct from inventory
    await InventoryTransaction.createTransaction({
      inventoryItem,
      type: 'packaging',
      quantity: weightTaken,
      unit: item.unit,
      notes: `Packaging batch ${batch.batchNumber}`,
      reference: { type: 'packaging_batch', id: batch._id },
      recordedBy: req.user._id
    });

    // Reload batch with populated fields
    const populatedBatch = await PackagingBatch.findById(batch._id)
      .populate('inventoryItem', 'name unit currentStock')
      .populate('processedBy', 'name');

    res.status(201).json({
      success: true,
      data: populatedBatch
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   PUT /api/packaging/:id
// @desc    Update packaging batch (add packaged items, update actual weight)
// @access  Private/Admin
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const batch = await PackagingBatch.findById(req.params.id);

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: 'Packaging batch not found'
      });
    }

    if (batch.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot modify a completed batch'
      });
    }

    const { actualWeight, packagedItems, notes } = req.body;

    if (actualWeight !== undefined) {
      batch.actualWeight = actualWeight;
    }

    if (packagedItems) {
      // Validate products exist
      for (const item of packagedItems) {
        const product = await Product.findById(item.product);
        if (!product) {
          return res.status(400).json({
            success: false,
            message: `Product not found: ${item.product}`
          });
        }
      }
      batch.packagedItems = packagedItems;
    }

    if (notes !== undefined) {
      batch.notes = notes;
    }

    await batch.save();

    // Reload with populated fields
    const populatedBatch = await PackagingBatch.findById(batch._id)
      .populate('inventoryItem', 'name unit currentStock')
      .populate('packagedItems.product', 'name price stock thumbnail')
      .populate('processedBy', 'name');

    res.json({
      success: true,
      data: populatedBatch
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/packaging/:id/add-item
// @desc    Add a packaged item to the batch
// @access  Private/Admin
router.post('/:id/add-item', protect, authorize('admin'), async (req, res) => {
  try {
    const { product, quantity, unitWeight, sellingPrice } = req.body;

    const batch = await PackagingBatch.findById(req.params.id);

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: 'Packaging batch not found'
      });
    }

    if (batch.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot modify a completed batch'
      });
    }

    // Verify product exists
    const productDoc = await Product.findById(product);
    if (!productDoc) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const totalWeight = quantity * unitWeight;

    batch.packagedItems.push({
      product,
      quantity,
      unitWeight,
      totalWeight,
      sellingPrice: sellingPrice || productDoc.price
    });

    await batch.save();

    const populatedBatch = await PackagingBatch.findById(batch._id)
      .populate('inventoryItem', 'name unit currentStock')
      .populate('packagedItems.product', 'name price stock thumbnail')
      .populate('processedBy', 'name');

    res.json({
      success: true,
      data: populatedBatch
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   DELETE /api/packaging/:id/remove-item/:itemIndex
// @desc    Remove a packaged item from the batch
// @access  Private/Admin
router.delete('/:id/remove-item/:itemIndex', protect, authorize('admin'), async (req, res) => {
  try {
    const batch = await PackagingBatch.findById(req.params.id);

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: 'Packaging batch not found'
      });
    }

    if (batch.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot modify a completed batch'
      });
    }

    const itemIndex = parseInt(req.params.itemIndex);
    if (itemIndex < 0 || itemIndex >= batch.packagedItems.length) {
      return res.status(400).json({
        success: false,
        message: 'Invalid item index'
      });
    }

    batch.packagedItems.splice(itemIndex, 1);
    await batch.save();

    const populatedBatch = await PackagingBatch.findById(batch._id)
      .populate('inventoryItem', 'name unit currentStock')
      .populate('packagedItems.product', 'name price stock thumbnail')
      .populate('processedBy', 'name');

    res.json({
      success: true,
      data: populatedBatch
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/packaging/:id/complete
// @desc    Complete packaging batch and add stock to products
// @access  Private/Admin
router.post('/:id/complete', protect, authorize('admin'), async (req, res) => {
  try {
    const batch = await PackagingBatch.findById(req.params.id);

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: 'Packaging batch not found'
      });
    }

    if (batch.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Batch is already completed'
      });
    }

    if (batch.packagedItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot complete batch with no packaged items'
      });
    }

    // Update product stocks
    for (const item of batch.packagedItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity }
      });
    }

    batch.status = 'completed';
    batch.completedAt = new Date();
    await batch.save();

    const populatedBatch = await PackagingBatch.findById(batch._id)
      .populate('inventoryItem', 'name unit currentStock')
      .populate('packagedItems.product', 'name price stock thumbnail')
      .populate('processedBy', 'name');

    res.json({
      success: true,
      message: 'Packaging batch completed and product stocks updated',
      data: populatedBatch
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/packaging/:id/cancel
// @desc    Cancel packaging batch and return stock to inventory
// @access  Private/Admin
router.post('/:id/cancel', protect, authorize('admin'), async (req, res) => {
  try {
    const { reason } = req.body;
    const batch = await PackagingBatch.findById(req.params.id);

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: 'Packaging batch not found'
      });
    }

    if (batch.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel a completed batch'
      });
    }

    if (batch.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Batch is already cancelled'
      });
    }

    const item = await InventoryItem.findById(batch.inventoryItem);

    // Return stock to inventory
    await InventoryTransaction.createTransaction({
      inventoryItem: batch.inventoryItem,
      type: 'adjustment_add',
      quantity: batch.weightTaken,
      unit: item.unit,
      notes: `Cancelled packaging batch ${batch.batchNumber}. ${reason || ''}`,
      reference: { type: 'packaging_batch', id: batch._id },
      recordedBy: req.user._id
    });

    batch.status = 'cancelled';
    batch.notes = `${batch.notes || ''}\nCancelled: ${reason || 'No reason provided'}`;
    await batch.save();

    const populatedBatch = await PackagingBatch.findById(batch._id)
      .populate('inventoryItem', 'name unit currentStock')
      .populate('processedBy', 'name');

    res.json({
      success: true,
      message: 'Packaging batch cancelled and stock returned to inventory',
      data: populatedBatch
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;
