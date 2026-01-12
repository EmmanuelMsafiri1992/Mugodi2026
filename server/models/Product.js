import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    maxlength: 1000
  }
}, { timestamps: true });

const variationSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true
  },
  values: [{
    name: String,
    price: Number,
    stock: Number
  }]
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a product name'],
    trim: true,
    maxlength: [200, 'Name cannot be more than 200 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  shortDescription: {
    type: String,
    maxlength: [500, 'Short description cannot be more than 500 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
    min: [0, 'Price must be positive']
  },
  discountPrice: {
    type: Number,
    min: [0, 'Discount price must be positive']
  },
  discountPercent: {
    type: Number,
    min: 0,
    max: 100
  },
  images: [{
    type: String
  }],
  thumbnail: {
    type: String,
    default: ''
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Please add a category']
  },
  unit: {
    type: String,
    default: 'piece'
  },
  unitValue: {
    type: Number,
    default: 1
  },
  stock: {
    type: Number,
    required: [true, 'Please add stock quantity'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  minOrderQty: {
    type: Number,
    default: 1
  },
  maxOrderQty: {
    type: Number,
    default: 100
  },
  variations: [variationSchema],
  tags: [{
    type: String,
    trim: true
  }],
  isFeatured: {
    type: Boolean,
    default: false
  },
  isDailyNeed: {
    type: Boolean,
    default: false
  },
  isFlashDeal: {
    type: Boolean,
    default: false
  },
  flashDealExpiry: Date,
  isActive: {
    type: Boolean,
    default: true
  },
  reviews: [reviewSchema],
  averageRating: {
    type: Number,
    default: 0
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  totalSold: {
    type: Number,
    default: 0
  },
  viewCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Generate slug from name
productSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + '-' + Date.now().toString(36);
  }
  next();
});

// Calculate average rating
productSchema.methods.calculateAverageRating = function() {
  if (this.reviews.length === 0) {
    this.averageRating = 0;
    this.totalReviews = 0;
    return;
  }
  const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
  this.averageRating = Math.round((sum / this.reviews.length) * 10) / 10;
  this.totalReviews = this.reviews.length;
};

// Virtual for discount amount
productSchema.virtual('discountAmount').get(function() {
  if (this.discountPrice && this.discountPrice < this.price) {
    return this.price - this.discountPrice;
  }
  if (this.discountPercent) {
    return Math.round(this.price * this.discountPercent / 100);
  }
  return 0;
});

// Virtual for final price
productSchema.virtual('finalPrice').get(function() {
  if (this.discountPrice && this.discountPrice < this.price) {
    return this.discountPrice;
  }
  if (this.discountPercent) {
    return Math.round(this.price * (100 - this.discountPercent) / 100);
  }
  return this.price;
});

// Index for search
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ isFeatured: 1, isActive: 1 });
productSchema.index({ isDailyNeed: 1, isActive: 1 });

export default mongoose.model('Product', productSchema);
