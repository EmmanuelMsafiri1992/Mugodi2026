import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title']
  },
  subtitle: String,
  image: {
    type: String,
    required: [true, 'Please add an image']
  },
  type: {
    type: String,
    enum: ['main', 'promo', 'category', 'product'],
    default: 'main'
  },
  link: String,
  linkType: {
    type: String,
    enum: ['none', 'category', 'product', 'external'],
    default: 'none'
  },
  linkedCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  linkedProduct: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  backgroundColor: {
    type: String,
    default: '#ffffff'
  },
  textColor: {
    type: String,
    default: '#000000'
  },
  sortOrder: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  startDate: Date,
  endDate: Date
}, {
  timestamps: true
});

export default mongoose.model('Banner', bannerSchema);
