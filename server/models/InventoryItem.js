import mongoose from 'mongoose';

const inventoryItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add an inventory item name'],
    trim: true,
    maxlength: [200, 'Name cannot be more than 200 characters']
  },
  category: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  currentStock: {
    type: Number,
    default: 0,
    min: [0, 'Stock cannot be negative']
  },
  unit: {
    type: String,
    enum: ['g', 'kg', 'piece', 'liter', 'ml'],
    default: 'g'
  },
  reorderLevel: {
    type: Number,
    default: 1000 // Default 1kg for items measured in grams
  },
  averageCost: {
    type: Number,
    default: 0,
    min: [0, 'Average cost cannot be negative']
  },
  totalValue: {
    type: Number,
    default: 0,
    min: [0, 'Total value cannot be negative']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for low stock status
inventoryItemSchema.virtual('isLowStock').get(function() {
  return this.currentStock <= this.reorderLevel;
});

// Virtual for formatted stock display
inventoryItemSchema.virtual('stockDisplay').get(function() {
  if (this.unit === 'g' && this.currentStock >= 1000) {
    return `${(this.currentStock / 1000).toFixed(2)} kg`;
  }
  if (this.unit === 'ml' && this.currentStock >= 1000) {
    return `${(this.currentStock / 1000).toFixed(2)} L`;
  }
  return `${this.currentStock} ${this.unit}`;
});

// Update total value when stock or average cost changes
inventoryItemSchema.pre('save', function(next) {
  this.totalValue = this.currentStock * this.averageCost;
  next();
});

// Indexes
inventoryItemSchema.index({ name: 'text', category: 'text' });
inventoryItemSchema.index({ isActive: 1 });
inventoryItemSchema.index({ currentStock: 1, reorderLevel: 1 });

export default mongoose.model('InventoryItem', inventoryItemSchema);
