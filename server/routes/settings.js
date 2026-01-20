import express from 'express';
import Settings from '../models/Settings.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Default payment info (used as fallback)
const defaultPaymentInfo = {
  cash_on_delivery: {
    name: 'Cash on Delivery',
    enabled: true,
    instructions: [
      'Pay with cash when your order is delivered',
      'Please have the exact amount ready',
      'Our delivery agent will provide a receipt'
    ]
  },
  airtel_money: {
    name: 'Airtel Money',
    enabled: true,
    number: '0991234567',
    accountName: 'MUGODI STORE',
    instructions: [
      'Dial *778# on your phone',
      'Select "Send Money"',
      'Enter the number: 0991234567',
      'Enter the amount',
      'Confirm with your PIN',
      'Save the confirmation message'
    ]
  },
  tnm_mpamba: {
    name: 'TNM Mpamba',
    enabled: true,
    number: '0881234567',
    accountName: 'MUGODI STORE',
    instructions: [
      'Dial *212# on your phone',
      'Select "Send Money"',
      'Enter the number: 0881234567',
      'Enter the amount',
      'Confirm with your PIN',
      'Save the confirmation message'
    ]
  },
  bank_transfer: {
    enabled: true,
    banks: [
      {
        name: 'National Bank of Malawi',
        accountNumber: '1234567890',
        accountName: 'MUGODI ENTERPRISE',
        branchCode: '001'
      },
      {
        name: 'Standard Bank Malawi',
        accountNumber: '0987654321',
        accountName: 'MUGODI ENTERPRISE',
        branchCode: '002'
      },
      {
        name: 'FDH Bank',
        accountNumber: '5678901234',
        accountName: 'MUGODI ENTERPRISE',
        branchCode: '003'
      }
    ],
    instructions: [
      'Transfer the exact amount to the bank account',
      'Use your Order Number as reference',
      'Keep the payment receipt',
      'Payment will be verified within 24 hours'
    ]
  }
};

// Default site display settings
const defaultSiteSettings = {
  showAppDownload: true,
  showNewsletter: true,
  googlePlayUrl: '',
  appStoreUrl: ''
};

// Default enabled countries settings
const defaultEnabledCountries = {
  MW: true,   // Malawi - always enabled by default
  ZA: false   // South Africa - disabled by default
};

// @route   GET /api/settings/enabled-countries
// @desc    Get enabled countries (public)
// @access  Public
router.get('/enabled-countries', async (req, res) => {
  try {
    const enabledCountries = await Settings.getSetting('enabled_countries', defaultEnabledCountries);

    res.json({
      success: true,
      data: enabledCountries
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   PUT /api/settings/enabled-countries
// @desc    Update enabled countries (admin only)
// @access  Private/Admin
router.put('/enabled-countries', protect, authorize('admin'), async (req, res) => {
  try {
    const { MW, ZA } = req.body;

    // Ensure at least one country is enabled
    if (!MW && !ZA) {
      return res.status(400).json({
        success: false,
        message: 'At least one country must be enabled'
      });
    }

    const currentSettings = await Settings.getSetting('enabled_countries', defaultEnabledCountries);

    const updatedSettings = {
      MW: MW !== undefined ? MW : currentSettings.MW,
      ZA: ZA !== undefined ? ZA : currentSettings.ZA
    };

    await Settings.setSetting(
      'enabled_countries',
      updatedSettings,
      req.user._id,
      'Enabled countries settings'
    );

    res.json({
      success: true,
      message: 'Country settings updated successfully',
      data: updatedSettings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/settings/site-display
// @desc    Get site display settings (public)
// @access  Public
router.get('/site-display', async (req, res) => {
  try {
    const siteSettings = await Settings.getSetting('site_display', defaultSiteSettings);

    res.json({
      success: true,
      data: siteSettings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   PUT /api/settings/site-display
// @desc    Update site display settings (admin only)
// @access  Private/Admin
router.put('/site-display', protect, authorize('admin'), async (req, res) => {
  try {
    const { showAppDownload, showNewsletter, googlePlayUrl, appStoreUrl } = req.body;

    const currentSettings = await Settings.getSetting('site_display', defaultSiteSettings);

    const updatedSettings = {
      showAppDownload: showAppDownload !== undefined ? showAppDownload : currentSettings.showAppDownload,
      showNewsletter: showNewsletter !== undefined ? showNewsletter : currentSettings.showNewsletter,
      googlePlayUrl: googlePlayUrl !== undefined ? googlePlayUrl : currentSettings.googlePlayUrl,
      appStoreUrl: appStoreUrl !== undefined ? appStoreUrl : currentSettings.appStoreUrl
    };

    await Settings.setSetting(
      'site_display',
      updatedSettings,
      req.user._id,
      'Site display settings'
    );

    res.json({
      success: true,
      message: 'Site display settings updated successfully',
      data: updatedSettings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/settings/payment-info
// @desc    Get payment account information (public)
// @access  Public
router.get('/payment-info', async (req, res) => {
  try {
    const paymentInfo = await Settings.getSetting('payment_info', defaultPaymentInfo);

    res.json({
      success: true,
      data: paymentInfo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   PUT /api/settings/payment-info
// @desc    Update payment account information (admin only)
// @access  Private/Admin
router.put('/payment-info', protect, authorize('admin'), async (req, res) => {
  try {
    const { cash_on_delivery, airtel_money, tnm_mpamba, bank_transfer } = req.body;

    // Build the updated payment info object
    const currentPaymentInfo = await Settings.getSetting('payment_info', defaultPaymentInfo);

    const updatedPaymentInfo = {
      cash_on_delivery: cash_on_delivery ? {
        ...currentPaymentInfo.cash_on_delivery,
        ...cash_on_delivery
      } : currentPaymentInfo.cash_on_delivery,
      airtel_money: airtel_money ? {
        ...currentPaymentInfo.airtel_money,
        ...airtel_money
      } : currentPaymentInfo.airtel_money,
      tnm_mpamba: tnm_mpamba ? {
        ...currentPaymentInfo.tnm_mpamba,
        ...tnm_mpamba
      } : currentPaymentInfo.tnm_mpamba,
      bank_transfer: bank_transfer ? {
        ...currentPaymentInfo.bank_transfer,
        ...bank_transfer
      } : currentPaymentInfo.bank_transfer
    };

    await Settings.setSetting(
      'payment_info',
      updatedPaymentInfo,
      req.user._id,
      'Payment account information'
    );

    res.json({
      success: true,
      message: 'Payment settings updated successfully',
      data: updatedPaymentInfo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/settings
// @desc    Get all settings (admin only)
// @access  Private/Admin
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const settings = await Settings.getAllSettings();

    res.json({
      success: true,
      data: settings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   PUT /api/settings/:key
// @desc    Update a setting (admin only)
// @access  Private/Admin
router.put('/:key', protect, authorize('admin'), async (req, res) => {
  try {
    const { value, description } = req.body;

    const setting = await Settings.setSetting(
      req.params.key,
      value,
      req.user._id,
      description
    );

    res.json({
      success: true,
      message: 'Setting updated successfully',
      data: setting
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;
