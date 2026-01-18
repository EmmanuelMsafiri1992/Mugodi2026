import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { securityConfig } from '../config/security.js';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email']
  },
  phone: {
    type: String,
    maxlength: [20, 'Phone number cannot be longer than 20 characters']
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 8,
    select: false
  },
  avatar: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    enum: ['user', 'team', 'admin'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: Date,
  lastLogin: Date,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  emailVerificationToken: String,
  emailVerificationExpire: Date,
  loyaltyPoints: {
    type: Number,
    default: 0
  },
  walletBalance: {
    type: Number,
    default: 0
  },
  referralCode: {
    type: String,
    unique: true,
    sparse: true
  },
  referredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(securityConfig.saltRounds);
  this.password = await bcrypt.hash(this.password, salt);

  // Generate referral code if not exists
  if (!this.referralCode) {
    this.referralCode = crypto.randomBytes(4).toString('hex').toUpperCase();
  }
});

// Sign JWT and return
userSchema.methods.getSignedJwtToken = function() {
  return jwt.sign(
    { id: this._id, email: this.email, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

// Match password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Check if account is locked
userSchema.methods.isLocked = function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
};

// Increment login attempts
userSchema.methods.incLoginAttempts = async function() {
  if (this.lockUntil && this.lockUntil < Date.now()) {
    await this.updateOne({
      $set: { loginAttempts: 1 },
      $unset: { lockUntil: 1 }
    });
    return;
  }
  const updates = { $inc: { loginAttempts: 1 } };
  if (this.loginAttempts + 1 >= 5) {
    updates.$set = { lockUntil: Date.now() + 15 * 60 * 1000 };
  }
  await this.updateOne(updates);
};

// Reset login attempts
userSchema.methods.resetLoginAttempts = async function() {
  await this.updateOne({
    $set: { loginAttempts: 0, lastLogin: new Date() },
    $unset: { lockUntil: 1 }
  });
};

// Generate password reset token
userSchema.methods.getResetPasswordToken = function() {
  const resetToken = crypto.randomBytes(20).toString('hex');
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

// Return safe user object
userSchema.methods.toSafeObject = function() {
  return {
    _id: this._id,
    name: this.name,
    email: this.email,
    phone: this.phone,
    avatar: this.avatar,
    role: this.role,
    isEmailVerified: this.isEmailVerified,
    loyaltyPoints: this.loyaltyPoints,
    walletBalance: this.walletBalance,
    referralCode: this.referralCode,
    createdAt: this.createdAt
  };
};

export default mongoose.model('User', userSchema);
