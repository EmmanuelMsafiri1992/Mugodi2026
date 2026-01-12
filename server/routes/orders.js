import express from 'express';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import Coupon from '../models/Coupon.js';
import Notification from '../models/Notification.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/orders
// @desc    Get user's orders
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const filter = { user: req.user._id };
    if (status) filter.status = status;

    const orders = await Order.find(filter)
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(filter);

    res.json({
      success: true,
      count: orders.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/orders/:id
// @desc    Get single order
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product', 'name thumbnail')
      .populate('deliveryPerson', 'name phone');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user owns this order or is admin
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/orders
// @desc    Create new order
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const {
      shippingAddress,
      paymentMethod,
      paymentPhone,
      bankName,
      deliveryTimeSlot,
      notes,
      useWallet = false,
      useLoyaltyPoints = 0
    } = req.body;

    // Get cart
    const cart = await Cart.findOne({ user: req.user._id })
      .populate('items.product')
      .populate('coupon');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }

    // Validate stock
    for (const item of cart.items) {
      if (!item.product || !item.product.isActive) {
        return res.status(400).json({
          success: false,
          message: `Product ${item.product?.name || 'Unknown'} is no longer available`
        });
      }
      if (item.product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${item.product.name}`
        });
      }
    }

    // Calculate totals
    const subtotal = cart.items.reduce((total, item) => {
      const price = item.discountPrice || item.price;
      return total + (price * item.quantity);
    }, 0);

    const deliveryFee = subtotal >= 50 ? 0 : 5; // Free delivery over $50
    const tax = Math.round(subtotal * 0.08 * 100) / 100; // 8% tax
    let discount = cart.couponDiscount || 0;

    // Handle loyalty points
    const user = await User.findById(req.user._id);
    let loyaltyPointsUsed = 0;
    let loyaltyDiscount = 0;

    if (useLoyaltyPoints > 0 && user.loyaltyPoints >= useLoyaltyPoints) {
      loyaltyPointsUsed = Math.min(useLoyaltyPoints, user.loyaltyPoints);
      loyaltyDiscount = loyaltyPointsUsed * 0.01; // 1 point = $0.01
      discount += loyaltyDiscount;
    }

    // Handle wallet
    let walletUsed = 0;
    let remainingTotal = subtotal + deliveryFee + tax - discount;

    if (useWallet && user.walletBalance > 0) {
      walletUsed = Math.min(user.walletBalance, remainingTotal);
      remainingTotal -= walletUsed;
    }

    const total = Math.max(0, remainingTotal);

    // Prepare order items
    const orderItems = cart.items.map(item => ({
      product: item.product._id,
      name: item.product.name,
      thumbnail: item.product.thumbnail,
      quantity: item.quantity,
      price: item.price,
      discountPrice: item.discountPrice,
      variation: item.variation,
      notes: item.notes
    }));

    // Determine payment status based on payment method
    let paymentStatus = 'pending';
    if (paymentMethod === 'wallet' && total === 0) {
      paymentStatus = 'paid'; // Fully paid with wallet
    } else if (['airtel_money', 'tnm_mpamba', 'bank_transfer'].includes(paymentMethod)) {
      paymentStatus = 'awaiting_payment';
    }

    // Create order
    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      paymentPhone: paymentPhone || shippingAddress.contactPhone,
      paymentStatus,
      paymentDetails: bankName ? { bankName } : undefined,
      subtotal,
      deliveryFee,
      tax,
      discount,
      coupon: cart.coupon ? {
        code: cart.coupon.code,
        discount: cart.couponDiscount
      } : undefined,
      walletUsed,
      total,
      deliveryTimeSlot,
      notes,
      loyaltyPointsUsed,
      loyaltyPointsEarned: Math.floor(total * 10), // 10 points per MWK 100
      estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // 2 days
    });

    // Update product stock
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.quantity, totalSold: item.quantity }
      });
    }

    // Update user wallet and loyalty points
    await User.findByIdAndUpdate(req.user._id, {
      $inc: {
        walletBalance: -walletUsed,
        loyaltyPoints: -loyaltyPointsUsed + order.loyaltyPointsEarned
      }
    });

    // Update coupon usage
    if (cart.coupon) {
      await Coupon.findByIdAndUpdate(cart.coupon._id, {
        $inc: { usedCount: 1 },
        $push: { usedBy: { user: req.user._id } }
      });
    }

    // Clear cart
    cart.items = [];
    cart.coupon = undefined;
    cart.couponDiscount = 0;
    await cart.save();

    // Create notification
    await Notification.create({
      user: req.user._id,
      title: 'Order Placed',
      message: `Your order #${order.orderNumber} has been placed successfully.`,
      type: 'order',
      data: { orderId: order._id }
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   PUT /api/orders/:id/cancel
// @desc    Cancel order
// @access  Private
router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const { reason } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    if (!['pending', 'confirmed'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel this order'
      });
    }

    // Restore stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity, totalSold: -item.quantity }
      });
    }

    // Refund to wallet
    if (order.paymentStatus === 'paid' || order.walletUsed > 0) {
      const refundAmount = order.total + order.walletUsed;
      await User.findByIdAndUpdate(req.user._id, {
        $inc: { walletBalance: refundAmount }
      });
    }

    // Restore loyalty points
    await User.findByIdAndUpdate(req.user._id, {
      $inc: {
        loyaltyPoints: order.loyaltyPointsUsed - order.loyaltyPointsEarned
      }
    });

    await order.updateStatus('cancelled', reason || 'Cancelled by customer');

    // Create notification
    await Notification.create({
      user: req.user._id,
      title: 'Order Cancelled',
      message: `Your order #${order.orderNumber} has been cancelled.`,
      type: 'order',
      data: { orderId: order._id }
    });

    res.json({
      success: true,
      message: 'Order cancelled',
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/orders/:id/track
// @desc    Get order tracking info
// @access  Private
router.get('/:id/track', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .select('orderNumber status statusHistory estimatedDelivery actualDelivery deliveryPerson')
      .populate('deliveryPerson', 'name phone');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// ADMIN ROUTES

// @route   GET /api/orders/admin/all
// @desc    Get all orders (admin)
// @access  Private/Admin
router.get('/admin/all', protect, authorize('admin'), async (req, res) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { orderNumber: { $regex: search, $options: 'i' } }
      ];
    }

    const orders = await Order.find(filter)
      .populate('user', 'name email')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(filter);

    res.json({
      success: true,
      count: orders.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   PUT /api/orders/admin/:id/status
// @desc    Update order status (admin)
// @access  Private/Admin
router.put('/admin/:id/status', protect, authorize('admin'), async (req, res) => {
  try {
    const { status, note } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    await order.updateStatus(status, note);

    // Update payment status if delivered
    if (status === 'delivered' && order.paymentMethod === 'cash_on_delivery') {
      order.paymentStatus = 'paid';
      await order.save();
    }

    // Create notification
    await Notification.create({
      user: order.user,
      title: 'Order Update',
      message: `Your order #${order.orderNumber} is now ${status.replace('_', ' ')}.`,
      type: 'order',
      data: { orderId: order._id }
    });

    res.json({
      success: true,
      message: 'Order status updated',
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   PUT /api/orders/admin/:id/payment
// @desc    Confirm payment (admin)
// @access  Private/Admin
router.put('/admin/:id/payment', protect, authorize('admin'), async (req, res) => {
  try {
    const { transactionId, reference } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.paymentStatus === 'paid') {
      return res.status(400).json({
        success: false,
        message: 'Order is already paid'
      });
    }

    // Update payment status
    order.paymentStatus = 'paid';
    order.paymentDetails = {
      ...order.paymentDetails,
      transactionId,
      reference,
      paidAt: new Date()
    };

    // Confirm order if it was pending
    if (order.status === 'pending') {
      order.status = 'confirmed';
      order.statusHistory.push({
        status: 'confirmed',
        note: 'Payment confirmed',
        timestamp: new Date()
      });
    }

    await order.save();

    // Create notification for customer
    await Notification.create({
      user: order.user,
      title: 'Payment Confirmed',
      message: `Payment for order #${order.orderNumber} has been confirmed. Your order is being processed.`,
      type: 'order',
      data: { orderId: order._id }
    });

    res.json({
      success: true,
      message: 'Payment confirmed',
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;
