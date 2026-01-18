import express from 'express';
import InventoryItem from '../models/InventoryItem.js';
import InventoryTransaction from '../models/InventoryTransaction.js';
import InventoryPurchase from '../models/InventoryPurchase.js';
import PackagingBatch from '../models/PackagingBatch.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/inventory
// @desc    Get all inventory items
// @access  Private/Admin or Team
router.get('/', protect, authorize('admin', 'team'), async (req, res) => {
  try {
    const { search, active, lowStock, category } = req.query;

    const filter = {};
    if (active !== undefined) {
      filter.isActive = active === 'true';
    }
    if (category) {
      filter.category = category;
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    let items = await InventoryItem.find(filter).sort('-createdAt');

    // Filter for low stock items if requested
    if (lowStock === 'true') {
      items = items.filter(item => item.currentStock <= item.reorderLevel);
    }

    res.json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/inventory/low-stock
// @desc    Get low stock items
// @access  Private/Admin or Team
router.get('/low-stock', protect, authorize('admin', 'team'), async (req, res) => {
  try {
    const items = await InventoryItem.find({ isActive: true });
    const lowStockItems = items.filter(item => item.currentStock <= item.reorderLevel);

    res.json({
      success: true,
      count: lowStockItems.length,
      data: lowStockItems
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/inventory/categories
// @desc    Get unique inventory categories
// @access  Private/Admin or Team
router.get('/categories', protect, authorize('admin', 'team'), async (req, res) => {
  try {
    const categories = await InventoryItem.distinct('category', { category: { $ne: null, $ne: '' } });

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/inventory/reports/stock-value
// @desc    Get total inventory value report
// @access  Private/Admin or Team
router.get('/reports/stock-value', protect, authorize('admin', 'team'), async (req, res) => {
  try {
    const items = await InventoryItem.find({ isActive: true });

    const totalValue = items.reduce((sum, item) => sum + item.totalValue, 0);
    const totalItems = items.length;
    const lowStockCount = items.filter(item => item.currentStock <= item.reorderLevel).length;

    const byCategory = {};
    items.forEach(item => {
      const cat = item.category || 'Uncategorized';
      if (!byCategory[cat]) {
        byCategory[cat] = { count: 0, value: 0, stock: 0 };
      }
      byCategory[cat].count++;
      byCategory[cat].value += item.totalValue;
      byCategory[cat].stock += item.currentStock;
    });

    res.json({
      success: true,
      data: {
        totalValue,
        totalItems,
        lowStockCount,
        byCategory
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/inventory/reports/purchases
// @desc    Get purchase summary report
// @access  Private/Admin or Team
router.get('/reports/purchases', protect, authorize('admin', 'team'), async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const filter = {};
    if (startDate || endDate) {
      filter.purchaseDate = {};
      if (startDate) filter.purchaseDate.$gte = new Date(startDate);
      if (endDate) filter.purchaseDate.$lte = new Date(endDate);
    }

    const purchases = await InventoryPurchase.find(filter)
      .populate('inventoryItem', 'name')
      .populate('supplier', 'name');

    const totalSpent = purchases.reduce((sum, p) => sum + p.totalCost, 0);
    const totalPurchases = purchases.length;

    // Group by item
    const byItem = {};
    purchases.forEach(p => {
      const itemName = p.inventoryItem?.name || 'Unknown';
      if (!byItem[itemName]) {
        byItem[itemName] = { count: 0, totalCost: 0, totalQuantity: 0 };
      }
      byItem[itemName].count++;
      byItem[itemName].totalCost += p.totalCost;
      byItem[itemName].totalQuantity += p.quantity;
    });

    // Group by supplier
    const bySupplier = {};
    purchases.forEach(p => {
      const supplierName = p.supplier?.name || 'Unknown';
      if (!bySupplier[supplierName]) {
        bySupplier[supplierName] = { count: 0, totalCost: 0 };
      }
      bySupplier[supplierName].count++;
      bySupplier[supplierName].totalCost += p.totalCost;
    });

    res.json({
      success: true,
      data: {
        totalSpent,
        totalPurchases,
        byItem,
        bySupplier
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/inventory/reports/packaging
// @desc    Get packaging efficiency report
// @access  Private/Admin or Team
router.get('/reports/packaging', protect, authorize('admin', 'team'), async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const filter = { status: 'completed' };
    if (startDate || endDate) {
      filter.completedAt = {};
      if (startDate) filter.completedAt.$gte = new Date(startDate);
      if (endDate) filter.completedAt.$lte = new Date(endDate);
    }

    const batches = await PackagingBatch.find(filter)
      .populate('inventoryItem', 'name');

    const totalBatches = batches.length;
    const totalWeightProcessed = batches.reduce((sum, b) => sum + b.actualWeight, 0);
    const totalPackagedWeight = batches.reduce((sum, b) => sum + b.totalPackagedWeight, 0);
    const totalWaste = batches.reduce((sum, b) => sum + b.wasteWeight, 0);
    const averageEfficiency = totalWeightProcessed > 0
      ? Math.round((totalPackagedWeight / totalWeightProcessed) * 100)
      : 0;

    // Group by item
    const byItem = {};
    batches.forEach(b => {
      const itemName = b.inventoryItem?.name || 'Unknown';
      if (!byItem[itemName]) {
        byItem[itemName] = { batches: 0, processed: 0, packaged: 0, waste: 0 };
      }
      byItem[itemName].batches++;
      byItem[itemName].processed += b.actualWeight;
      byItem[itemName].packaged += b.totalPackagedWeight;
      byItem[itemName].waste += b.wasteWeight;
    });

    res.json({
      success: true,
      data: {
        totalBatches,
        totalWeightProcessed,
        totalPackagedWeight,
        totalWaste,
        averageEfficiency,
        byItem
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/inventory/:id
// @desc    Get single inventory item
// @access  Private/Admin or Team
router.get('/:id', protect, authorize('admin', 'team'), async (req, res) => {
  try {
    const item = await InventoryItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Inventory item not found'
      });
    }

    // Get recent transactions
    const transactions = await InventoryTransaction.find({ inventoryItem: item._id })
      .populate('recordedBy', 'name')
      .sort('-createdAt')
      .limit(20);

    res.json({
      success: true,
      data: { item, transactions }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/inventory
// @desc    Create inventory item
// @access  Private/Admin
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const item = await InventoryItem.create(req.body);

    res.status(201).json({
      success: true,
      data: item
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   PUT /api/inventory/:id
// @desc    Update inventory item
// @access  Private/Admin
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    // Don't allow direct stock updates through this route
    const { currentStock, ...updateData } = req.body;

    const item = await InventoryItem.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Inventory item not found'
      });
    }

    res.json({
      success: true,
      data: item
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/inventory/:id/adjust
// @desc    Manual stock adjustment
// @access  Private/Admin
router.post('/:id/adjust', protect, authorize('admin'), async (req, res) => {
  try {
    const { quantity, unit, type, notes } = req.body;

    if (!['adjustment_add', 'adjustment_remove', 'waste'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid adjustment type. Must be: adjustment_add, adjustment_remove, or waste'
      });
    }

    const item = await InventoryItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Inventory item not found'
      });
    }

    const transaction = await InventoryTransaction.createTransaction({
      inventoryItem: req.params.id,
      type,
      quantity,
      unit: unit || item.unit,
      notes,
      reference: { type: 'manual' },
      recordedBy: req.user._id
    });

    // Reload the item to get updated stock
    const updatedItem = await InventoryItem.findById(req.params.id);

    res.json({
      success: true,
      data: { item: updatedItem, transaction }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   DELETE /api/inventory/:id
// @desc    Delete inventory item
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const item = await InventoryItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Inventory item not found'
      });
    }

    // Soft delete by setting isActive to false
    item.isActive = false;
    await item.save();

    res.json({
      success: true,
      message: 'Inventory item deactivated'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;
