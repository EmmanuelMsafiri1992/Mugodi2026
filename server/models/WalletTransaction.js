import mongoose from 'mongoose';

const walletTransactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['credit', 'debit'],
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  balanceAfter: {
    type: Number,
    required: true
  },
  source: {
    type: String,
    enum: ['order_refund', 'admin', 'referral', 'loyalty_conversion', 'payment', 'order_payment', 'cashback'],
    required: true
  },
  referenceId: String,
  referenceModel: {
    type: String,
    enum: ['Order', 'User']
  },
  description: String,
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'completed'
  }
}, {
  timestamps: true
});

walletTransactionSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model('WalletTransaction', walletTransactionSchema);
