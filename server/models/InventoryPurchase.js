import mongoose from 'mongoose';

const inventoryPurchaseSchema = new mongoose.Schema({
  purchaseNumber: {
    type: String,
    unique: true
  },
  inventoryItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InventoryItem',
    required: [true, 'Please specify the inventory item']
  },
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier'
  },
  quantity: {
    type: Number,
    required: [true, 'Please add purchase quantity'],
    min: [0.01, 'Quantity must be greater than 0']
  },
  unit: {
    type: String,
    enum: ['g', 'kg', 'piece', 'liter', 'ml'],
    required: true
  },
  unitPrice: {
    type: Number,
    required: [true, 'Please add unit price'],
    min: [0, 'Unit price cannot be negative']
  },
  totalCost: {
    type: Number,
    required: true,
    min: [0, 'Total cost cannot be negative']
  },
  purchaseLocation: {
    district: {
      type: String,
      trim: true
    },
    market: {
      type: String,
      trim: true
    }
  },
  purchaseDate: {
    type: Date,
    default: Date.now
  },
  qualityGrade: {
    type: String,
    enum: ['A', 'B', 'C', 'ungraded'],
    default: 'ungraded'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'mobile_money', 'bank_transfer', 'credit'],
    default: 'cash'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'partial', 'paid'],
    default: 'paid'
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

// Generate purchase number: PUR2401XXXXX (year, month, sequential)
inventoryPurchaseSchema.pre('save', async function(next) {
  if (!this.purchaseNumber) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const count = await this.constructor.countDocuments() + 1;
    this.purchaseNumber = `PUR${year}${month}${count.toString().padStart(5, '0')}`;
  }

  // Calculate total cost if not provided
  if (!this.totalCost) {
    this.totalCost = this.quantity * this.unitPrice;
  }

  next();
});

// Convert quantity to base units (grams/ml) for inventory tracking
inventoryPurchaseSchema.methods.getQuantityInBaseUnits = function() {
  if (this.unit === 'kg') {
    return this.quantity * 1000;
  }
  if (this.unit === 'liter') {
    return this.quantity * 1000;
  }
  return this.quantity;
};

// Indexes
inventoryPurchaseSchema.index({ purchaseNumber: 1 });
inventoryPurchaseSchema.index({ inventoryItem: 1, createdAt: -1 });
inventoryPurchaseSchema.index({ supplier: 1 });
inventoryPurchaseSchema.index({ purchaseDate: -1 });
inventoryPurchaseSchema.index({ recordedBy: 1 });

export default mongoose.model('InventoryPurchase', inventoryPurchaseSchema);
