import mongoose from 'mongoose';

const packagedItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1']
  },
  unitWeight: {
    type: Number,
    required: true,
    min: [0, 'Unit weight must be positive']
  },
  totalWeight: {
    type: Number,
    required: true,
    min: [0, 'Total weight must be positive']
  },
  sellingPrice: {
    type: Number,
    required: true,
    min: [0, 'Selling price must be positive']
  }
});

const packagingBatchSchema = new mongoose.Schema({
  batchNumber: {
    type: String,
    unique: true
  },
  inventoryItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InventoryItem',
    required: [true, 'Please specify the inventory item']
  },
  weightTaken: {
    type: Number,
    required: [true, 'Please specify weight taken from inventory'],
    min: [0, 'Weight taken must be positive']
  },
  actualWeight: {
    type: Number,
    default: 0,
    min: [0, 'Actual weight must be positive']
  },
  weightVariance: {
    type: Number,
    default: 0
  },
  packagedItems: [packagedItemSchema],
  totalPackagedWeight: {
    type: Number,
    default: 0,
    min: [0, 'Total packaged weight must be positive']
  },
  wasteWeight: {
    type: Number,
    default: 0,
    min: [0, 'Waste weight cannot be negative']
  },
  status: {
    type: String,
    enum: ['in_progress', 'completed', 'cancelled'],
    default: 'in_progress'
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot be more than 500 characters']
  },
  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  completedAt: {
    type: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Generate batch number: PKG240117-XXX (date-sequential)
packagingBatchSchema.pre('save', async function(next) {
  if (!this.batchNumber) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    // Count batches created today
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));
    const todayCount = await this.constructor.countDocuments({
      createdAt: { $gte: startOfDay, $lte: endOfDay }
    }) + 1;

    this.batchNumber = `PKG${year}${month}${day}-${todayCount.toString().padStart(3, '0')}`;
  }

  // Calculate variance and totals
  if (this.actualWeight) {
    this.weightVariance = this.weightTaken - this.actualWeight;
  }

  if (this.packagedItems && this.packagedItems.length > 0) {
    this.totalPackagedWeight = this.packagedItems.reduce((sum, item) => sum + item.totalWeight, 0);
    this.wasteWeight = this.actualWeight - this.totalPackagedWeight;
  }

  next();
});

// Virtual for efficiency percentage
packagingBatchSchema.virtual('efficiency').get(function() {
  if (!this.actualWeight || this.actualWeight === 0) return 0;
  return Math.round((this.totalPackagedWeight / this.actualWeight) * 100);
});

// Indexes
packagingBatchSchema.index({ batchNumber: 1 });
packagingBatchSchema.index({ inventoryItem: 1 });
packagingBatchSchema.index({ status: 1 });
packagingBatchSchema.index({ processedBy: 1 });
packagingBatchSchema.index({ createdAt: -1 });

export default mongoose.model('PackagingBatch', packagingBatchSchema);
