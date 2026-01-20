import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: String,
  thumbnail: String,
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true
  },
  discountPrice: Number,
  variation: String,
  notes: String
});

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [orderItemSchema],
  shippingAddress: {
    contactName: String,
    contactPhone: String,
    address: String,
    apartment: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    latitude: Number,
    longitude: Number,
    deliveryInstructions: String
  },
  paymentMethod: {
    type: String,
    enum: ['cash_on_delivery', 'airtel_money', 'tnm_mpamba', 'bank_transfer', 'wallet', 'card'],
    required: true
  },
  currency: {
    type: String,
    enum: ['MWK', 'ZAR'],
    default: 'MWK'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'awaiting_payment', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentId: String,
  paymentPhone: String,
  paymentDetails: {
    transactionId: String,
    bankName: String,
    accountName: String,
    reference: String,
    paidAt: Date
  },
  subtotal: {
    type: Number,
    required: true
  },
  deliveryFee: {
    type: Number,
    default: 0
  },
  tax: {
    type: Number,
    default: 0
  },
  discount: {
    type: Number,
    default: 0
  },
  coupon: {
    code: String,
    discount: Number
  },
  walletUsed: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'out_for_delivery', 'delivered', 'cancelled', 'returned'],
    default: 'pending'
  },
  statusHistory: [{
    status: String,
    note: String,
    timestamp: { type: Date, default: Date.now }
  }],
  deliveryPerson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  deliveryDate: Date,
  deliveryTimeSlot: String,
  estimatedDelivery: Date,
  actualDelivery: Date,
  cancelReason: String,
  returnReason: String,
  notes: String,
  loyaltyPointsEarned: {
    type: Number,
    default: 0
  },
  loyaltyPointsUsed: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Generate order number
orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const count = await this.constructor.countDocuments() + 1;
    this.orderNumber = `MUG${year}${month}${count.toString().padStart(6, '0')}`;
  }

  // Add status to history
  if (this.isNew) {
    this.statusHistory = [{ status: this.status, note: 'Order placed' }];
  }
  next();
});

// Method to update status
orderSchema.methods.updateStatus = function(status, note = '') {
  this.status = status;
  this.statusHistory.push({ status, note, timestamp: new Date() });
  if (status === 'delivered') {
    this.actualDelivery = new Date();
  }
  return this.save();
};

// Index for queries
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ status: 1 });

export default mongoose.model('Order', orderSchema);
