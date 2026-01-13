import express from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect, authorize } from '../middleware/auth.js';
import { authLimiter } from '../middleware/security.js';
import { validatePassword } from '../config/security.js';

const router = express.Router();

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(e => e.msg)
    });
  }
  next();
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', authLimiter, [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('phone').optional().isMobilePhone().withMessage('Valid phone number required')
], validate, async (req, res) => {
  try {
    const { name, email, password, phone, referralCode } = req.body;

    // Password strength validation
    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      return res.status(400).json({
        success: false,
        errors: passwordErrors
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Handle referral
    let referredByUser = null;
    if (referralCode) {
      referredByUser = await User.findOne({ referralCode: referralCode.toUpperCase() });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      phone,
      referredBy: referredByUser?._id,
      loyaltyPoints: 100 // Signup bonus
    });

    // Award referral bonus
    if (referredByUser) {
      await User.findByIdAndUpdate(referredByUser._id, {
        $inc: { loyaltyPoints: 500, walletBalance: 5 }
      });
    }

    const token = user.getSignedJwtToken();

    res.status(201).json({
      success: true,
      token,
      user: user.toSafeObject()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', authLimiter, [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
], validate, async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    if (user.isLocked()) {
      return res.status(423).json({
        success: false,
        message: 'Account is temporarily locked. Please try again later.'
      });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      await user.incLoginAttempts();
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    await user.resetLoginAttempts();

    const token = user.getSignedJwtToken();

    res.json({
      success: true,
      token,
      user: user.toSafeObject()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      success: true,
      user: user.toSafeObject()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('phone').optional().isMobilePhone().withMessage('Valid phone number required')
], validate, async (req, res) => {
  try {
    const { name, phone, avatar } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, avatar },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      user: user.toSafeObject()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   PUT /api/auth/password
// @desc    Update password
// @access  Private
router.put('/password', protect, [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters')
], validate, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select('+password');

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    const passwordErrors = validatePassword(newPassword);
    if (passwordErrors.length > 0) {
      return res.status(400).json({
        success: false,
        errors: passwordErrors
      });
    }

    user.password = newPassword;
    await user.save();

    const token = user.getSignedJwtToken();

    res.json({
      success: true,
      message: 'Password updated successfully',
      token
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', protect, (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

// @route   POST /api/auth/impersonate/:userId
// @desc    Admin impersonates a user
// @access  Private/Admin
router.post('/impersonate/:userId', protect, authorize('admin'), async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.userId);

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent impersonating other admins
    if (targetUser.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Cannot impersonate admin users'
      });
    }

    // Create an impersonation token that includes the original admin's ID
    const impersonationToken = jwt.sign(
      {
        id: targetUser._id,
        email: targetUser.email,
        role: targetUser.role,
        isImpersonating: true,
        originalAdminId: req.user._id,
        originalAdminEmail: req.user.email
      },
      process.env.JWT_SECRET,
      { expiresIn: '2h' } // Shorter expiry for impersonation sessions
    );

    res.json({
      success: true,
      message: `Now viewing as ${targetUser.name}`,
      token: impersonationToken,
      user: targetUser.toSafeObject(),
      impersonation: {
        isImpersonating: true,
        originalAdmin: {
          id: req.user._id,
          email: req.user.email,
          name: req.user.name
        },
        targetUser: {
          id: targetUser._id,
          name: targetUser.name,
          email: targetUser.email
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/auth/stop-impersonation
// @desc    Stop impersonating and return to admin
// @access  Private (must be impersonating)
router.post('/stop-impersonation', protect, async (req, res) => {
  try {
    // Check if the current session is an impersonation session
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.isImpersonating || !decoded.originalAdminId) {
      return res.status(400).json({
        success: false,
        message: 'Not currently impersonating any user'
      });
    }

    // Get the original admin user
    const adminUser = await User.findById(decoded.originalAdminId);

    if (!adminUser || adminUser.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Original admin account not found or no longer has admin privileges'
      });
    }

    // Generate a fresh token for the admin
    const adminToken = adminUser.getSignedJwtToken();

    res.json({
      success: true,
      message: 'Returned to admin account',
      token: adminToken,
      user: adminUser.toSafeObject()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/auth/impersonation-status
// @desc    Check if currently impersonating
// @access  Private
router.get('/impersonation-status', protect, async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.json({
        success: true,
        isImpersonating: false
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.isImpersonating && decoded.originalAdminId) {
      const originalAdmin = await User.findById(decoded.originalAdminId).select('name email');
      const targetUser = await User.findById(decoded.id).select('name email');

      return res.json({
        success: true,
        isImpersonating: true,
        originalAdmin: originalAdmin ? {
          id: decoded.originalAdminId,
          name: originalAdmin.name,
          email: originalAdmin.email
        } : null,
        targetUser: targetUser ? {
          id: decoded.id,
          name: targetUser.name,
          email: targetUser.email
        } : null
      });
    }

    res.json({
      success: true,
      isImpersonating: false
    });
  } catch (error) {
    res.json({
      success: true,
      isImpersonating: false
    });
  }
});

export default router;
