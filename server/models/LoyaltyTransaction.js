import mongoose from 'mongoose';

const loyaltyTransactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['earned', 'redeemed', 'expired', 'bonus'],
    required: true
  },
  points: {
    type: Number,
    required: true
  },
  balanceAfter: {
    type: Number,
    required: true
  },
  source: {
    type: String,
    enum: ['order', 'referral', 'review', 'signup', 'conversion', 'admin', 'promo'],
    required: true
  },
  referenceId: String,
  referenceModel: {
    type: String,
    enum: ['Order', 'User', 'Product']
  },
  description: String,
  expiryDate: Date
}, {
  timestamps: true
});

loyaltyTransactionSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model('LoyaltyTransaction', loyaltyTransactionSchema);
