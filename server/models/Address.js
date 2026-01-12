import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['home', 'office', 'other'],
    default: 'home'
  },
  contactName: {
    type: String,
    required: [true, 'Please add a contact name'],
    trim: true
  },
  contactPhone: {
    type: String,
    required: [true, 'Please add a contact phone']
  },
  address: {
    type: String,
    required: [true, 'Please add an address']
  },
  apartment: String,
  city: {
    type: String,
    required: [true, 'Please add a city']
  },
  state: String,
  zipCode: String,
  country: {
    type: String,
    default: 'United States'
  },
  latitude: Number,
  longitude: Number,
  isDefault: {
    type: Boolean,
    default: false
  },
  deliveryInstructions: String
}, {
  timestamps: true
});

// Only one default address per user
addressSchema.pre('save', async function(next) {
  if (this.isDefault) {
    await this.constructor.updateMany(
      { user: this.user, _id: { $ne: this._id } },
      { isDefault: false }
    );
  }
  next();
});

export default mongoose.model('Address', addressSchema);
