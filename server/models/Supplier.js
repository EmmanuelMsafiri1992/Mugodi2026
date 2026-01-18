import mongoose from 'mongoose';

const supplierSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a supplier name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  location: {
    district: {
      type: String,
      trim: true
    },
    area: {
      type: String,
      trim: true
    }
  },
  contactPhone: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot be more than 500 characters']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for search
supplierSchema.index({ name: 'text' });
supplierSchema.index({ isActive: 1 });

export default mongoose.model('Supplier', supplierSchema);
