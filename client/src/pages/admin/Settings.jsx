import { useState, useEffect, useRef } from 'react';
import { Save, Store, Bell, Shield, Palette, Globe, CreditCard, Truck, Smartphone, Building2, Plus, Trash2, Monitor, Banknote, Upload, X, Image, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    // General
    storeName: 'Mugodi',
    storeEmail: 'admin@mugodi.com',
    storePhone: '+265 999 123 456',
    storeAddress: 'Area 47, Lilongwe, Malawi',
    currency: 'MWK',
    timezone: 'Africa/Blantyre',

    // Notifications
    emailNotifications: true,
    orderNotifications: true,
    stockAlerts: true,
    lowStockThreshold: 10,

    // Delivery
    freeDeliveryThreshold: 50000,
    defaultDeliveryFee: 2500,
    deliveryTimeSlots: ['9:00 AM - 12:00 PM', '12:00 PM - 3:00 PM', '3:00 PM - 6:00 PM'],

    // Loyalty
    loyaltyPointsPerOrder: 10,
    pointsToMwkRate: 100,
    referralBonus: 500,

    // Appearance
    primaryColor: '#009f7f',
    logoUrl: '',
    faviconUrl: ''
  });

  const [isSaving, setIsSaving] = useState(false);
  const [paymentSettings, setPaymentSettings] = useState({
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
      number: '',
      accountName: '',
      instructions: [
        'Dial *778# on your phone',
        'Select "Send Money"',
        'Enter the number',
        'Enter the amount',
        'Confirm with your PIN',
        'Save the confirmation message'
      ]
    },
    tnm_mpamba: {
      name: 'TNM Mpamba',
      enabled: true,
      number: '',
      accountName: '',
      instructions: [
        'Dial *212# on your phone',
        'Select "Send Money"',
        'Enter the number',
        'Enter the amount',
        'Confirm with your PIN',
        'Save the confirmation message'
      ]
    },
    bank_transfer: {
      enabled: true,
      banks: [
        { name: '', accountNumber: '', accountName: '', branchCode: '' }
      ],
      instructions: [
        'Transfer the exact amount to the bank account',
        'Use your Order Number as reference',
        'Keep the payment receipt',
        'Payment will be verified within 24 hours'
      ]
    },
    bank_transfer_za: {
      enabled: true,
      banks: [
        { name: '', accountNumber: '', accountName: '', branchCode: '' }
      ],
      instructions: [
        'Transfer the exact amount to the bank account',
        'Use your Order Number as reference',
        'Keep the payment receipt',
        'Payment will be verified within 24 hours'
      ]
    }
  });
  const [isLoadingPayment, setIsLoadingPayment] = useState(true);
  const [displaySettings, setDisplaySettings] = useState({
    showAppDownload: true,
    showNewsletter: true,
    googlePlayUrl: '',
    appStoreUrl: ''
  });
  const [isLoadingDisplay, setIsLoadingDisplay] = useState(true);
  const [countrySettings, setCountrySettings] = useState({
    MW: true,
    ZA: false
  });
  const [isLoadingCountry, setIsLoadingCountry] = useState(true);
  const [brandingSettings, setBrandingSettings] = useState({
    logo: '/mugodi-logo.png',
    logoAdmin: '/mugodi-logo.png',
    favicon: '/favicon.ico',
    siteName: 'Mugodi'
  });
  const [isLoadingBranding, setIsLoadingBranding] = useState(true);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingLogoAdmin, setIsUploadingLogoAdmin] = useState(false);
  const [isUploadingFavicon, setIsUploadingFavicon] = useState(false);

  // File input refs
  const logoInputRef = useRef(null);
  const logoAdminInputRef = useRef(null);
  const faviconInputRef = useRef(null);

  const tabs = [
    { id: 'general', icon: Store, label: 'General' },
    { id: 'countries', icon: Globe, label: 'Countries' },
    { id: 'display', icon: Monitor, label: 'Display' },
    { id: 'notifications', icon: Bell, label: 'Notifications' },
    { id: 'delivery', icon: Truck, label: 'Delivery' },
    { id: 'payments', icon: Smartphone, label: 'Payments' },
    { id: 'loyalty', icon: CreditCard, label: 'Loyalty' },
    { id: 'appearance', icon: Palette, label: 'Appearance' }
  ];

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Save general settings to localStorage for demo purposes
      localStorage.setItem('adminSettings', JSON.stringify(settings));

      // Save payment settings to database
      if (activeTab === 'payments') {
        await api.put('/settings/payment-info', paymentSettings);
      }

      // Save display settings to database
      if (activeTab === 'display') {
        await api.put('/settings/site-display', displaySettings);
      }

      // Save country settings to database
      if (activeTab === 'countries') {
        await api.put('/settings/enabled-countries', countrySettings);
      }

      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const fetchPaymentSettings = async () => {
    try {
      const response = await api.get('/settings/payment-info');
      if (response.data.data) {
        setPaymentSettings(prev => ({
          ...prev,
          ...response.data.data
        }));
      }
    } catch (error) {
      console.error('Failed to fetch payment settings');
    } finally {
      setIsLoadingPayment(false);
    }
  };

  const fetchDisplaySettings = async () => {
    try {
      const response = await api.get('/settings/site-display');
      if (response.data.data) {
        setDisplaySettings(prev => ({
          ...prev,
          ...response.data.data
        }));
      }
    } catch (error) {
      console.error('Failed to fetch display settings');
    } finally {
      setIsLoadingDisplay(false);
    }
  };

  const fetchCountrySettings = async () => {
    try {
      const response = await api.get('/settings/enabled-countries');
      if (response.data.data) {
        setCountrySettings(prev => ({
          ...prev,
          ...response.data.data
        }));
      }
    } catch (error) {
      console.error('Failed to fetch country settings');
    } finally {
      setIsLoadingCountry(false);
    }
  };

  const fetchBrandingSettings = async () => {
    try {
      const response = await api.get('/settings/branding');
      if (response.data.data) {
        setBrandingSettings(prev => ({
          ...prev,
          ...response.data.data
        }));
      }
    } catch (error) {
      console.error('Failed to fetch branding settings');
    } finally {
      setIsLoadingBranding(false);
    }
  };

  const handleLogoUpload = async (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    const setUploading = type === 'logo' ? setIsUploadingLogo :
                         type === 'logoAdmin' ? setIsUploadingLogoAdmin :
                         setIsUploadingFavicon;

    setUploading(true);
    const formData = new FormData();
    formData.append(type, file);

    try {
      const response = await api.post('/settings/branding/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.data) {
        setBrandingSettings(response.data.data);
        toast.success(`${type === 'logo' ? 'Frontend logo' : type === 'logoAdmin' ? 'Admin logo' : 'Favicon'} updated successfully`);
      }
    } catch (error) {
      toast.error('Failed to upload file');
    } finally {
      setUploading(false);
      // Reset file input
      if (type === 'logo' && logoInputRef.current) logoInputRef.current.value = '';
      if (type === 'logoAdmin' && logoAdminInputRef.current) logoAdminInputRef.current.value = '';
      if (type === 'favicon' && faviconInputRef.current) faviconInputRef.current.value = '';
    }
  };

  const handleResetBranding = async (type) => {
    if (!confirm(`Are you sure you want to reset the ${type} to default?`)) return;

    try {
      const response = await api.delete(`/settings/branding/${type}`);
      if (response.data.data) {
        setBrandingSettings(response.data.data);
        toast.success(`${type} reset to default`);
      }
    } catch (error) {
      toast.error('Failed to reset');
    }
  };

  useEffect(() => {
    // Load saved settings
    const saved = localStorage.getItem('adminSettings');
    if (saved) {
      setSettings(prev => ({ ...prev, ...JSON.parse(saved) }));
    }
    // Load payment settings from database
    fetchPaymentSettings();
    // Load display settings from database
    fetchDisplaySettings();
    // Load country settings from database
    fetchCountrySettings();
    // Load branding settings from database
    fetchBrandingSettings();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500">Manage your store configuration</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-500'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="p-6">
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Store Name
                </label>
                <input
                  type="text"
                  value={settings.storeName}
                  onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Store Email
                  </label>
                  <input
                    type="email"
                    value={settings.storeEmail}
                    onChange={(e) => setSettings({ ...settings, storeEmail: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Store Phone
                  </label>
                  <input
                    type="tel"
                    value={settings.storePhone}
                    onChange={(e) => setSettings({ ...settings, storePhone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Store Address
                </label>
                <textarea
                  value={settings.storeAddress}
                  onChange={(e) => setSettings({ ...settings, storeAddress: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Currency
                  </label>
                  <select
                    value={settings.currency}
                    onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="MWK">MWK - Malawian Kwacha</option>
                    <option value="USD">USD - US Dollar</option>
                    <option value="ZAR">ZAR - South African Rand</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Timezone
                  </label>
                  <select
                    value={settings.timezone}
                    onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="Africa/Blantyre">Africa/Blantyre (CAT)</option>
                    <option value="Africa/Johannesburg">Africa/Johannesburg (SAST)</option>
                    <option value="UTC">UTC</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Country Settings */}
          {activeTab === 'countries' && (
            <div className="space-y-6 max-w-2xl">
              {isLoadingCountry ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto" />
                </div>
              ) : (
                <>
                  <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6 border border-blue-200">
                    <div className="flex items-center gap-3 mb-4">
                      <Globe className="w-6 h-6 text-blue-600" />
                      <h3 className="text-lg font-semibold text-gray-800">Multi-Country Support</h3>
                    </div>
                    <p className="text-gray-600 mb-6">
                      Enable or disable countries where your store operates. Customers will only see enabled countries when selecting their location.
                    </p>

                    <div className="space-y-4">
                      {/* Malawi */}
                      <div className={`p-4 rounded-lg border-2 transition-all ${
                        countrySettings.MW ? 'bg-white border-green-300' : 'bg-gray-50 border-gray-200'
                      }`}>
                        <label className="flex items-center gap-4 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={countrySettings.MW}
                            onChange={(e) => {
                              // Prevent disabling if ZA is also disabled
                              if (!e.target.checked && !countrySettings.ZA) {
                                toast.error('At least one country must be enabled');
                                return;
                              }
                              setCountrySettings({ ...countrySettings, MW: e.target.checked });
                            }}
                            className="w-5 h-5 text-green-500 border-gray-300 rounded focus:ring-green-500"
                          />
                          <span className="text-3xl">🇲🇼</span>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">Malawi</p>
                            <p className="text-sm text-gray-500">Currency: MWK (Malawian Kwacha)</p>
                            <p className="text-xs text-gray-400 mt-1">
                              Payments: Cash, Airtel Money, TNM Mpamba, Bank Transfer, Wallet
                            </p>
                          </div>
                          {countrySettings.MW && (
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                              Enabled
                            </span>
                          )}
                        </label>
                      </div>

                      {/* South Africa */}
                      <div className={`p-4 rounded-lg border-2 transition-all ${
                        countrySettings.ZA ? 'bg-white border-green-300' : 'bg-gray-50 border-gray-200'
                      }`}>
                        <label className="flex items-center gap-4 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={countrySettings.ZA}
                            onChange={(e) => {
                              // Prevent disabling if MW is also disabled
                              if (!e.target.checked && !countrySettings.MW) {
                                toast.error('At least one country must be enabled');
                                return;
                              }
                              setCountrySettings({ ...countrySettings, ZA: e.target.checked });
                            }}
                            className="w-5 h-5 text-green-500 border-gray-300 rounded focus:ring-green-500"
                          />
                          <span className="text-3xl">🇿🇦</span>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">South Africa</p>
                            <p className="text-sm text-gray-500">Currency: ZAR (South African Rand)</p>
                            <p className="text-xs text-gray-400 mt-1">
                              Payments: Cash, Bank Transfer, Wallet
                            </p>
                          </div>
                          {countrySettings.ZA && (
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                              Enabled
                            </span>
                          )}
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-800">
                      <strong>Note:</strong> When only one country is enabled, customers will not see the country selector.
                      Their location will be automatically set to the enabled country.
                    </p>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      <strong>Tip:</strong> If you enable South Africa, make sure to configure SA bank accounts in the Payments tab
                      and set ZAR prices for your products.
                    </p>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Display Settings */}
          {activeTab === 'display' && (
            <div className="space-y-6 max-w-2xl">
              {isLoadingDisplay ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto" />
                </div>
              ) : (
                <>
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Footer Sections</h3>
                    <div className="space-y-4">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={displaySettings.showAppDownload}
                          onChange={(e) => setDisplaySettings({ ...displaySettings, showAppDownload: e.target.checked })}
                          className="w-5 h-5 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
                        />
                        <div>
                          <p className="font-medium text-gray-900">Show App Download Section</p>
                          <p className="text-sm text-gray-500">Display Google Play and App Store download buttons in footer</p>
                        </div>
                      </label>

                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={displaySettings.showNewsletter}
                          onChange={(e) => setDisplaySettings({ ...displaySettings, showNewsletter: e.target.checked })}
                          className="w-5 h-5 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
                        />
                        <div>
                          <p className="font-medium text-gray-900">Show Newsletter Section</p>
                          <p className="text-sm text-gray-500">Display newsletter subscription form in footer</p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {displaySettings.showAppDownload && (
                    <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                      <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
                        <Smartphone className="w-5 h-5" />
                        App Store Links
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Google Play Store URL
                          </label>
                          <input
                            type="url"
                            value={displaySettings.googlePlayUrl}
                            onChange={(e) => setDisplaySettings({ ...displaySettings, googlePlayUrl: e.target.value })}
                            placeholder="https://play.google.com/store/apps/details?id=your.app.id"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <p className="text-sm text-gray-500 mt-1">Leave empty to use # as placeholder</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Apple App Store URL
                          </label>
                          <input
                            type="url"
                            value={displaySettings.appStoreUrl}
                            onChange={(e) => setDisplaySettings({ ...displaySettings, appStoreUrl: e.target.value })}
                            placeholder="https://apps.apple.com/app/your-app-name/id123456789"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <p className="text-sm text-gray-500 mt-1">Leave empty to use # as placeholder</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-800">
                      <strong>Note:</strong> These settings control what sections are visible to customers on the website footer.
                      Changes will take effect immediately after saving.
                    </p>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <div className="space-y-6 max-w-2xl">
              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                    className="w-5 h-5 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <div>
                    <p className="font-medium text-gray-900">Email Notifications</p>
                    <p className="text-sm text-gray-500">Receive email alerts for important events</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.orderNotifications}
                    onChange={(e) => setSettings({ ...settings, orderNotifications: e.target.checked })}
                    className="w-5 h-5 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <div>
                    <p className="font-medium text-gray-900">Order Notifications</p>
                    <p className="text-sm text-gray-500">Get notified when new orders are placed</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.stockAlerts}
                    onChange={(e) => setSettings({ ...settings, stockAlerts: e.target.checked })}
                    className="w-5 h-5 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <div>
                    <p className="font-medium text-gray-900">Stock Alerts</p>
                    <p className="text-sm text-gray-500">Get notified when products are running low</p>
                  </div>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Low Stock Threshold
                </label>
                <input
                  type="number"
                  value={settings.lowStockThreshold}
                  onChange={(e) => setSettings({ ...settings, lowStockThreshold: parseInt(e.target.value) })}
                  className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Alert when product stock falls below this number
                </p>
              </div>
            </div>
          )}

          {/* Delivery Settings */}
          {activeTab === 'delivery' && (
            <div className="space-y-6 max-w-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Free Delivery Threshold (MWK)
                  </label>
                  <input
                    type="number"
                    value={settings.freeDeliveryThreshold}
                    onChange={(e) => setSettings({ ...settings, freeDeliveryThreshold: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Orders above this amount get free delivery
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Default Delivery Fee (MWK)
                  </label>
                  <input
                    type="number"
                    value={settings.defaultDeliveryFee}
                    onChange={(e) => setSettings({ ...settings, defaultDeliveryFee: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Time Slots
                </label>
                <div className="space-y-2">
                  {settings.deliveryTimeSlots.map((slot, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={slot}
                        onChange={(e) => {
                          const newSlots = [...settings.deliveryTimeSlots];
                          newSlots[index] = e.target.value;
                          setSettings({ ...settings, deliveryTimeSlots: newSlots });
                        }}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                      <button
                        onClick={() => {
                          const newSlots = settings.deliveryTimeSlots.filter((_, i) => i !== index);
                          setSettings({ ...settings, deliveryTimeSlots: newSlots });
                        }}
                        className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      setSettings({
                        ...settings,
                        deliveryTimeSlots: [...settings.deliveryTimeSlots, '']
                      });
                    }}
                    className="text-primary-500 hover:text-primary-600 text-sm font-medium"
                  >
                    + Add Time Slot
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Payment Settings */}
          {activeTab === 'payments' && (
            <div className="space-y-8 max-w-3xl">
              {isLoadingPayment ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto" />
                </div>
              ) : (
                <>
                  {/* Cash on Delivery */}
                  <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                    <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center gap-2">
                      <Banknote className="w-5 h-5" />
                      Cash on Delivery
                    </h3>
                    <div className="space-y-4">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={paymentSettings.cash_on_delivery?.enabled ?? true}
                          onChange={(e) => setPaymentSettings({
                            ...paymentSettings,
                            cash_on_delivery: { ...paymentSettings.cash_on_delivery, enabled: e.target.checked }
                          })}
                          className="w-5 h-5 text-green-500 border-gray-300 rounded focus:ring-green-500"
                        />
                        <div>
                          <p className="font-medium text-gray-900">Enable Cash on Delivery</p>
                          <p className="text-sm text-gray-500">Allow customers to pay with cash when they receive their order</p>
                        </div>
                      </label>

                      {paymentSettings.cash_on_delivery?.enabled && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Instructions (shown to customers)
                          </label>
                          <div className="space-y-2">
                            {(paymentSettings.cash_on_delivery?.instructions || []).map((instruction, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={instruction}
                                  onChange={(e) => {
                                    const newInstructions = [...(paymentSettings.cash_on_delivery?.instructions || [])];
                                    newInstructions[index] = e.target.value;
                                    setPaymentSettings({
                                      ...paymentSettings,
                                      cash_on_delivery: { ...paymentSettings.cash_on_delivery, instructions: newInstructions }
                                    });
                                  }}
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                                <button
                                  onClick={() => {
                                    const newInstructions = (paymentSettings.cash_on_delivery?.instructions || []).filter((_, i) => i !== index);
                                    setPaymentSettings({
                                      ...paymentSettings,
                                      cash_on_delivery: { ...paymentSettings.cash_on_delivery, instructions: newInstructions }
                                    });
                                  }}
                                  className="text-red-500 hover:text-red-600 p-1"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                            <button
                              onClick={() => {
                                setPaymentSettings({
                                  ...paymentSettings,
                                  cash_on_delivery: {
                                    ...paymentSettings.cash_on_delivery,
                                    instructions: [...(paymentSettings.cash_on_delivery?.instructions || []), '']
                                  }
                                });
                              }}
                              className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium text-sm"
                            >
                              <Plus className="w-4 h-4" />
                              Add Instruction
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Airtel Money */}
                  <div className="bg-red-50 rounded-xl p-6 border border-red-200">
                    <h3 className="text-lg font-semibold text-red-800 mb-4 flex items-center gap-2">
                      <Smartphone className="w-5 h-5" />
                      Airtel Money
                    </h3>
                    <div className="space-y-4">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={paymentSettings.airtel_money?.enabled ?? true}
                          onChange={(e) => setPaymentSettings({
                            ...paymentSettings,
                            airtel_money: { ...paymentSettings.airtel_money, enabled: e.target.checked }
                          })}
                          className="w-5 h-5 text-red-500 border-gray-300 rounded focus:ring-red-500"
                        />
                        <div>
                          <p className="font-medium text-gray-900">Enable Airtel Money</p>
                          <p className="text-sm text-gray-500">Allow customers to pay via Airtel Money</p>
                        </div>
                      </label>

                      {paymentSettings.airtel_money?.enabled && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Phone Number
                            </label>
                            <input
                              type="tel"
                              value={paymentSettings.airtel_money.number}
                              onChange={(e) => setPaymentSettings({
                                ...paymentSettings,
                                airtel_money: { ...paymentSettings.airtel_money, number: e.target.value }
                              })}
                              placeholder="099XXXXXXX"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Account Name
                            </label>
                            <input
                              type="text"
                              value={paymentSettings.airtel_money.accountName}
                              onChange={(e) => setPaymentSettings({
                                ...paymentSettings,
                                airtel_money: { ...paymentSettings.airtel_money, accountName: e.target.value }
                              })}
                              placeholder="MUGODI STORE"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* TNM Mpamba */}
                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                    <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
                      <Smartphone className="w-5 h-5" />
                      TNM Mpamba
                    </h3>
                    <div className="space-y-4">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={paymentSettings.tnm_mpamba?.enabled ?? true}
                          onChange={(e) => setPaymentSettings({
                            ...paymentSettings,
                            tnm_mpamba: { ...paymentSettings.tnm_mpamba, enabled: e.target.checked }
                          })}
                          className="w-5 h-5 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <div>
                          <p className="font-medium text-gray-900">Enable TNM Mpamba</p>
                          <p className="text-sm text-gray-500">Allow customers to pay via TNM Mpamba</p>
                        </div>
                      </label>

                      {paymentSettings.tnm_mpamba?.enabled && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Phone Number
                            </label>
                            <input
                              type="tel"
                              value={paymentSettings.tnm_mpamba.number}
                              onChange={(e) => setPaymentSettings({
                                ...paymentSettings,
                                tnm_mpamba: { ...paymentSettings.tnm_mpamba, number: e.target.value }
                              })}
                              placeholder="088XXXXXXX"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Account Name
                            </label>
                            <input
                              type="text"
                              value={paymentSettings.tnm_mpamba.accountName}
                              onChange={(e) => setPaymentSettings({
                                ...paymentSettings,
                                tnm_mpamba: { ...paymentSettings.tnm_mpamba, accountName: e.target.value }
                              })}
                              placeholder="MUGODI STORE"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bank Transfer - Malawi */}
                  <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                    <h3 className="text-lg font-semibold text-purple-800 mb-4 flex items-center gap-2">
                      <Building2 className="w-5 h-5" />
                      Bank Accounts (Malawi)
                    </h3>
                    <div className="space-y-4">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={paymentSettings.bank_transfer?.enabled ?? true}
                          onChange={(e) => setPaymentSettings({
                            ...paymentSettings,
                            bank_transfer: { ...paymentSettings.bank_transfer, enabled: e.target.checked }
                          })}
                          className="w-5 h-5 text-purple-500 border-gray-300 rounded focus:ring-purple-500"
                        />
                        <div>
                          <p className="font-medium text-gray-900">Enable Bank Transfer</p>
                          <p className="text-sm text-gray-500">Allow customers to pay via bank transfer</p>
                        </div>
                      </label>

                      {paymentSettings.bank_transfer?.enabled && paymentSettings.bank_transfer.banks.map((bank, index) => (
                        <div key={index} className="bg-white p-4 rounded-lg border border-purple-200">
                          <div className="flex items-center justify-between mb-3">
                            <span className="font-medium text-purple-800">Bank {index + 1}</span>
                            {paymentSettings.bank_transfer.banks.length > 1 && (
                              <button
                                onClick={() => {
                                  const newBanks = paymentSettings.bank_transfer.banks.filter((_, i) => i !== index);
                                  setPaymentSettings({
                                    ...paymentSettings,
                                    bank_transfer: { ...paymentSettings.bank_transfer, banks: newBanks }
                                  });
                                }}
                                className="text-red-500 hover:text-red-600 p-1"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Bank Name
                              </label>
                              <input
                                type="text"
                                value={bank.name}
                                onChange={(e) => {
                                  const newBanks = [...paymentSettings.bank_transfer.banks];
                                  newBanks[index] = { ...newBanks[index], name: e.target.value };
                                  setPaymentSettings({
                                    ...paymentSettings,
                                    bank_transfer: { ...paymentSettings.bank_transfer, banks: newBanks }
                                  });
                                }}
                                placeholder="National Bank of Malawi"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Account Number
                              </label>
                              <input
                                type="text"
                                value={bank.accountNumber}
                                onChange={(e) => {
                                  const newBanks = [...paymentSettings.bank_transfer.banks];
                                  newBanks[index] = { ...newBanks[index], accountNumber: e.target.value };
                                  setPaymentSettings({
                                    ...paymentSettings,
                                    bank_transfer: { ...paymentSettings.bank_transfer, banks: newBanks }
                                  });
                                }}
                                placeholder="1234567890"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Account Name
                              </label>
                              <input
                                type="text"
                                value={bank.accountName}
                                onChange={(e) => {
                                  const newBanks = [...paymentSettings.bank_transfer.banks];
                                  newBanks[index] = { ...newBanks[index], accountName: e.target.value };
                                  setPaymentSettings({
                                    ...paymentSettings,
                                    bank_transfer: { ...paymentSettings.bank_transfer, banks: newBanks }
                                  });
                                }}
                                placeholder="MUGODI ENTERPRISE"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Branch Code
                              </label>
                              <input
                                type="text"
                                value={bank.branchCode}
                                onChange={(e) => {
                                  const newBanks = [...paymentSettings.bank_transfer.banks];
                                  newBanks[index] = { ...newBanks[index], branchCode: e.target.value };
                                  setPaymentSettings({
                                    ...paymentSettings,
                                    bank_transfer: { ...paymentSettings.bank_transfer, banks: newBanks }
                                  });
                                }}
                                placeholder="001"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                      {paymentSettings.bank_transfer?.enabled && (
                        <button
                          onClick={() => {
                            setPaymentSettings({
                              ...paymentSettings,
                              bank_transfer: {
                                ...paymentSettings.bank_transfer,
                                banks: [...paymentSettings.bank_transfer.banks, { name: '', accountNumber: '', accountName: '', branchCode: '' }]
                              }
                            });
                          }}
                          className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
                        >
                          <Plus className="w-4 h-4" />
                          Add Another Bank
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Bank Transfer - South Africa */}
                  <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                    <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center gap-2">
                      <Building2 className="w-5 h-5" />
                      Bank Accounts (South Africa)
                    </h3>
                    <div className="space-y-4">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={paymentSettings.bank_transfer_za?.enabled ?? true}
                          onChange={(e) => setPaymentSettings({
                            ...paymentSettings,
                            bank_transfer_za: { ...paymentSettings.bank_transfer_za, enabled: e.target.checked }
                          })}
                          className="w-5 h-5 text-green-500 border-gray-300 rounded focus:ring-green-500"
                        />
                        <div>
                          <p className="font-medium text-gray-900">Enable SA Bank Transfer</p>
                          <p className="text-sm text-gray-500">Allow South African customers to pay via bank transfer</p>
                        </div>
                      </label>

                      {paymentSettings.bank_transfer_za?.enabled && (paymentSettings.bank_transfer_za?.banks || [{ name: '', accountNumber: '', accountName: '', branchCode: '' }]).map((bank, index) => (
                        <div key={index} className="bg-white p-4 rounded-lg border border-green-200">
                          <div className="flex items-center justify-between mb-3">
                            <span className="font-medium text-green-800">SA Bank {index + 1}</span>
                            {(paymentSettings.bank_transfer_za?.banks?.length || 1) > 1 && (
                              <button
                                onClick={() => {
                                  const newBanks = paymentSettings.bank_transfer_za.banks.filter((_, i) => i !== index);
                                  setPaymentSettings({
                                    ...paymentSettings,
                                    bank_transfer_za: { ...paymentSettings.bank_transfer_za, banks: newBanks }
                                  });
                                }}
                                className="text-red-500 hover:text-red-600 p-1"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Bank Name
                              </label>
                              <input
                                type="text"
                                value={bank.name}
                                onChange={(e) => {
                                  const newBanks = [...(paymentSettings.bank_transfer_za?.banks || [])];
                                  newBanks[index] = { ...newBanks[index], name: e.target.value };
                                  setPaymentSettings({
                                    ...paymentSettings,
                                    bank_transfer_za: { ...paymentSettings.bank_transfer_za, banks: newBanks }
                                  });
                                }}
                                placeholder="FNB / Standard Bank / ABSA / Capitec"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Account Number
                              </label>
                              <input
                                type="text"
                                value={bank.accountNumber}
                                onChange={(e) => {
                                  const newBanks = [...(paymentSettings.bank_transfer_za?.banks || [])];
                                  newBanks[index] = { ...newBanks[index], accountNumber: e.target.value };
                                  setPaymentSettings({
                                    ...paymentSettings,
                                    bank_transfer_za: { ...paymentSettings.bank_transfer_za, banks: newBanks }
                                  });
                                }}
                                placeholder="1234567890"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Account Name
                              </label>
                              <input
                                type="text"
                                value={bank.accountName}
                                onChange={(e) => {
                                  const newBanks = [...(paymentSettings.bank_transfer_za?.banks || [])];
                                  newBanks[index] = { ...newBanks[index], accountName: e.target.value };
                                  setPaymentSettings({
                                    ...paymentSettings,
                                    bank_transfer_za: { ...paymentSettings.bank_transfer_za, banks: newBanks }
                                  });
                                }}
                                placeholder="MUGODI ENTERPRISE"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Branch Code
                              </label>
                              <input
                                type="text"
                                value={bank.branchCode}
                                onChange={(e) => {
                                  const newBanks = [...(paymentSettings.bank_transfer_za?.banks || [])];
                                  newBanks[index] = { ...newBanks[index], branchCode: e.target.value };
                                  setPaymentSettings({
                                    ...paymentSettings,
                                    bank_transfer_za: { ...paymentSettings.bank_transfer_za, banks: newBanks }
                                  });
                                }}
                                placeholder="250655"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                      {paymentSettings.bank_transfer_za?.enabled && (
                        <button
                          onClick={() => {
                            setPaymentSettings({
                              ...paymentSettings,
                              bank_transfer_za: {
                                ...paymentSettings.bank_transfer_za,
                                banks: [...(paymentSettings.bank_transfer_za?.banks || []), { name: '', accountNumber: '', accountName: '', branchCode: '' }]
                              }
                            });
                          }}
                          className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium"
                        >
                          <Plus className="w-4 h-4" />
                          Add Another SA Bank
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-800">
                      <strong>Note:</strong> These payment details will be shown to customers during checkout.
                      Make sure to enter accurate information. Customers will be instructed to send payments to these accounts.
                    </p>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Loyalty Settings */}
          {activeTab === 'loyalty' && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Points Earned Per MWK Spent
                </label>
                <input
                  type="number"
                  value={settings.loyaltyPointsPerOrder}
                  onChange={(e) => setSettings({ ...settings, loyaltyPointsPerOrder: parseInt(e.target.value) })}
                  className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Points earned per 1000 MWK spent
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Points to MWK Conversion Rate
                </label>
                <input
                  type="number"
                  value={settings.pointsToMwkRate}
                  onChange={(e) => setSettings({ ...settings, pointsToMwkRate: parseInt(e.target.value) })}
                  className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <p className="text-sm text-gray-500 mt-1">
                  {settings.pointsToMwkRate} points = MWK 1
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Referral Bonus (Points)
                </label>
                <input
                  type="number"
                  value={settings.referralBonus}
                  onChange={(e) => setSettings({ ...settings, referralBonus: parseInt(e.target.value) })}
                  className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Points awarded when a referred user makes their first purchase
                </p>
              </div>
            </div>
          )}

          {/* Appearance Settings */}
          {activeTab === 'appearance' && (
            <div className="space-y-6 max-w-3xl">
              {isLoadingBranding ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto" />
                </div>
              ) : (
                <>
                  {/* Site Name */}
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Site Name</h3>
                    <input
                      type="text"
                      value={brandingSettings.siteName}
                      onChange={(e) => setBrandingSettings({ ...brandingSettings, siteName: e.target.value })}
                      placeholder="Your Store Name"
                      className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  {/* Frontend Logo */}
                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                    <div className="flex items-center gap-2 mb-4">
                      <Image className="w-5 h-5 text-blue-600" />
                      <h3 className="text-lg font-semibold text-blue-800">Frontend Logo</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      This logo appears on the customer-facing website (header, footer, etc.)
                    </p>
                    <div className="flex items-start gap-6">
                      <div className="bg-white p-4 rounded-lg border border-blue-200 flex items-center justify-center min-w-[200px] min-h-[80px]">
                        <img
                          src={brandingSettings.logo}
                          alt="Frontend Logo"
                          className="max-h-16 max-w-[180px] object-contain"
                          onError={(e) => { e.target.src = '/mugodi-logo.png'; }}
                        />
                      </div>
                      <div className="flex-1 space-y-3">
                        <input
                          ref={logoInputRef}
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleLogoUpload(e, 'logo')}
                          className="hidden"
                        />
                        <button
                          onClick={() => logoInputRef.current?.click()}
                          disabled={isUploadingLogo}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                        >
                          {isUploadingLogo ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <Upload className="w-4 h-4" />
                          )}
                          {isUploadingLogo ? 'Uploading...' : 'Upload Logo'}
                        </button>
                        <button
                          onClick={() => handleResetBranding('logo')}
                          className="flex items-center gap-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                          <X className="w-4 h-4" />
                          Reset to Default
                        </button>
                        <p className="text-xs text-gray-500">Recommended: 200x50px, PNG or SVG, max 5MB</p>
                      </div>
                    </div>
                  </div>

                  {/* Admin Panel Logo */}
                  <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                    <div className="flex items-center gap-2 mb-4">
                      <Image className="w-5 h-5 text-purple-600" />
                      <h3 className="text-lg font-semibold text-purple-800">Admin Panel Logo</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      This logo appears in the admin sidebar. Should work well on dark background.
                    </p>
                    <div className="flex items-start gap-6">
                      <div className="bg-gray-800 p-4 rounded-lg border border-purple-200 flex items-center justify-center min-w-[200px] min-h-[80px]">
                        <img
                          src={brandingSettings.logoAdmin}
                          alt="Admin Logo"
                          className="max-h-12 max-w-[150px] object-contain"
                          onError={(e) => { e.target.src = '/mugodi-logo.png'; }}
                        />
                      </div>
                      <div className="flex-1 space-y-3">
                        <input
                          ref={logoAdminInputRef}
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleLogoUpload(e, 'logoAdmin')}
                          className="hidden"
                        />
                        <button
                          onClick={() => logoAdminInputRef.current?.click()}
                          disabled={isUploadingLogoAdmin}
                          className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50"
                        >
                          {isUploadingLogoAdmin ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <Upload className="w-4 h-4" />
                          )}
                          {isUploadingLogoAdmin ? 'Uploading...' : 'Upload Logo'}
                        </button>
                        <button
                          onClick={() => handleResetBranding('logoAdmin')}
                          className="flex items-center gap-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                          <X className="w-4 h-4" />
                          Reset to Default
                        </button>
                        <p className="text-xs text-gray-500">Recommended: 150x40px, PNG with transparency, max 5MB</p>
                      </div>
                    </div>
                  </div>

                  {/* Favicon */}
                  <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                    <div className="flex items-center gap-2 mb-4">
                      <Image className="w-5 h-5 text-green-600" />
                      <h3 className="text-lg font-semibold text-green-800">Favicon</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      Small icon shown in browser tabs. Should be square.
                    </p>
                    <div className="flex items-start gap-6">
                      <div className="bg-white p-4 rounded-lg border border-green-200 flex items-center justify-center w-24 h-24">
                        <img
                          src={brandingSettings.favicon}
                          alt="Favicon"
                          className="w-12 h-12 object-contain"
                          onError={(e) => { e.target.src = '/favicon.ico'; }}
                        />
                      </div>
                      <div className="flex-1 space-y-3">
                        <input
                          ref={faviconInputRef}
                          type="file"
                          accept="image/*,.ico"
                          onChange={(e) => handleLogoUpload(e, 'favicon')}
                          className="hidden"
                        />
                        <button
                          onClick={() => faviconInputRef.current?.click()}
                          disabled={isUploadingFavicon}
                          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
                        >
                          {isUploadingFavicon ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <Upload className="w-4 h-4" />
                          )}
                          {isUploadingFavicon ? 'Uploading...' : 'Upload Favicon'}
                        </button>
                        <button
                          onClick={() => handleResetBranding('favicon')}
                          className="flex items-center gap-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                          <X className="w-4 h-4" />
                          Reset to Default
                        </button>
                        <p className="text-xs text-gray-500">Recommended: 32x32px or 64x64px, ICO or PNG, max 5MB</p>
                      </div>
                    </div>
                  </div>

                  {/* Primary Color */}
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Primary Color</h3>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={settings.primaryColor}
                        onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                        className="w-12 h-12 border border-gray-300 rounded-lg cursor-pointer"
                      />
                      <input
                        type="text"
                        value={settings.primaryColor}
                        onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="#009f7f"
                      />
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-800">
                      <strong>Note:</strong> Logo changes will take effect immediately. You may need to refresh the page to see updates in the current view.
                    </p>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
