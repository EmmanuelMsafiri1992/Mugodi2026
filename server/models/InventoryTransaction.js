import mongoose from 'mongoose';

const inventoryTransactionSchema = new mongoose.Schema({
  inventoryItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InventoryItem',
    required: true
  },
  type: {
    type: String,
    enum: ['purchase', 'packaging', 'adjustment_add', 'adjustment_remove', 'waste'],
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    enum: ['g', 'kg', 'piece', 'liter', 'ml'],
    required: true
  },
  quantityInBaseUnit: {
    type: Number,
    required: true
  },
  previousStock: {
    type: Number,
    required: true
  },
  newStock: {
    type: Number,
    required: true
  },
  reference: {
    type: {
      type: String,
      enum: ['purchase', 'packaging_batch', 'manual']
    },
    id: mongoose.Schema.Types.ObjectId
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot be more than 500 characters']
  },
  recordedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Static method to create a transaction
inventoryTransactionSchema.statics.createTransaction = async function(data) {
  const InventoryItem = mongoose.model('InventoryItem');
  const item = await InventoryItem.findById(data.inventoryItem);

  if (!item) {
    throw new Error('Inventory item not found');
  }

  // Convert to base units (grams/ml)
  let quantityInBaseUnit = data.quantity;
  if (data.unit === 'kg' || data.unit === 'liter') {
    quantityInBaseUnit = data.quantity * 1000;
  }

  // Determine if adding or removing stock
  const isAdding = ['purchase', 'adjustment_add'].includes(data.type);
  const change = isAdding ? quantityInBaseUnit : -quantityInBaseUnit;

  const previousStock = item.currentStock;
  const newStock = previousStock + change;

  // Prevent negative stock
  if (newStock < 0) {
    throw new Error(`Insufficient stock. Current: ${previousStock}, Requested: ${Math.abs(change)}`);
  }

  // Create the transaction
  const transaction = await this.create({
    inventoryItem: data.inventoryItem,
    type: data.type,
    quantity: data.quantity,
    unit: data.unit,
    quantityInBaseUnit: Math.abs(quantityInBaseUnit),
    previousStock,
    newStock,
    reference: data.reference,
    notes: data.notes,
    recordedBy: data.recordedBy
  });

  // Update inventory item stock
  item.currentStock = newStock;

  // Update average cost for purchases
  if (data.type === 'purchase' && data.unitCost) {
    const totalCost = item.averageCost * previousStock + data.unitCost * quantityInBaseUnit;
    item.averageCost = newStock > 0 ? totalCost / newStock : data.unitCost;
  }

  await item.save();

  return transaction;
};

// Indexes
inventoryTransactionSchema.index({ inventoryItem: 1, createdAt: -1 });
inventoryTransactionSchema.index({ type: 1 });
inventoryTransactionSchema.index({ 'reference.type': 1, 'reference.id': 1 });
inventoryTransactionSchema.index({ recordedBy: 1 });
inventoryTransactionSchema.index({ createdAt: -1 });

export default mongoose.model('InventoryTransaction', inventoryTransactionSchema);
