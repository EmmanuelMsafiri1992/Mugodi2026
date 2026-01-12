import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, CreditCard, Wallet, DollarSign, Plus, Smartphone, Building2, Banknote, Phone } from 'lucide-react';
import useCartStore from '../store/cartStore';
import useOrderStore from '../store/orderStore';
import useAuthStore from '../store/authStore';
import api from '../services/api';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Spinner from '../components/ui/Spinner';
import toast from 'react-hot-toast';

const Checkout = () => {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cash_on_delivery');
  const [paymentPhone, setPaymentPhone] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const [useWallet, setUseWallet] = useState(false);
  const [useLoyaltyPoints, setUseLoyaltyPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [paymentInfo, setPaymentInfo] = useState(null);

  const { user } = useAuthStore();
  const { cart, getCartTotal } = useCartStore();
  const { createOrder, isLoading } = useOrderStore();

  useEffect(() => {
    fetchAddresses();
    fetchPaymentInfo();
  }, []);

  const fetchAddresses = async () => {
    try {
      const response = await api.get('/addresses');
      setAddresses(response.data.data);
      const defaultAddr = response.data.data.find(a => a.isDefault);
      if (defaultAddr) {
        setSelectedAddress(defaultAddr._id);
        setPaymentPhone(defaultAddr.contactPhone || '');
      }
    } catch (error) {
      console.error('Failed to fetch addresses');
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentInfo = async () => {
    try {
      const response = await api.get('/settings/payment-info');
      setPaymentInfo(response.data.data);
    } catch (error) {
      console.error('Failed to fetch payment info');
    }
  };

  const items = cart?.items || [];
  const subtotal = getCartTotal();
  const deliveryFee = subtotal >= 5000 ? 0 : 500;
  const couponDiscount = cart?.couponDiscount || 0;
  const walletDiscount = useWallet ? Math.min(user?.walletBalance || 0, subtotal + deliveryFee - couponDiscount) : 0;
  const loyaltyDiscount = useLoyaltyPoints * 10;
  const total = Math.max(0, subtotal + deliveryFee - couponDiscount - walletDiscount - loyaltyDiscount);

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error('Please select a delivery address');
      return;
    }

    // Validate mobile money phone number
    if (['airtel_money', 'tnm_mpamba'].includes(paymentMethod) && !paymentPhone) {
      toast.error('Please enter your mobile money phone number');
      return;
    }

    // Validate bank selection for bank transfer
    if (paymentMethod === 'bank_transfer' && !selectedBank) {
      toast.error('Please select a bank');
      return;
    }

    const address = addresses.find(a => a._id === selectedAddress);

    const result = await createOrder({
      shippingAddress: {
        contactName: address.contactName,
        contactPhone: address.contactPhone,
        address: address.address,
        apartment: address.apartment,
        city: address.city,
        state: address.state,
        zipCode: address.zipCode,
        country: address.country,
        deliveryInstructions: address.deliveryInstructions
      },
      paymentMethod,
      paymentPhone: ['airtel_money', 'tnm_mpamba'].includes(paymentMethod) ? paymentPhone : undefined,
      bankName: paymentMethod === 'bank_transfer' ? selectedBank : undefined,
      useWallet,
      useLoyaltyPoints
    });

    if (result.success) {
      navigate(`/orders/${result.order._id}`, { state: { success: true, paymentMethod } });
    }
  };

  if (loading) {
    return <Spinner className="py-20" />;
  }

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="container-custom py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Delivery Address */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-primary-600" />
              Delivery Address
            </h2>

            {addresses.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No addresses found</p>
                <Button onClick={() => navigate('/addresses/new')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Address
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {addresses.map((address) => (
                  <label
                    key={address._id}
                    className={`block p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedAddress === address._id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start">
                      <input
                        type="radio"
                        name="address"
                        checked={selectedAddress === address._id}
                        onChange={() => setSelectedAddress(address._id)}
                        className="mt-1 text-primary-600"
                      />
                      <div className="ml-3">
                        <p className="font-medium">{address.contactName}</p>
                        <p className="text-sm text-gray-600">{address.contactPhone}</p>
                        <p className="text-sm text-gray-600">
                          {address.address}, {address.city}, {address.state} {address.zipCode}
                        </p>
                        {address.isDefault && (
                          <span className="text-xs text-primary-600 font-medium">Default</span>
                        )}
                      </div>
                    </div>
                  </label>
                ))}
                <button
                  onClick={() => navigate('/addresses/new')}
                  className="w-full p-4 border border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-primary-600 hover:border-primary-300 transition-colors"
                >
                  <Plus className="w-5 h-5 mx-auto mb-1" />
                  Add New Address
                </button>
              </div>
            )}
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-xl border border-gray-100 p-6 dark:bg-gray-800 dark:border-gray-700">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <CreditCard className="w-5 h-5 mr-2 text-primary-600" />
              Payment Method
            </h2>

            <div className="space-y-3">
              {/* Cash on Delivery */}
              <label className={`block p-4 border rounded-lg cursor-pointer transition-colors ${
                paymentMethod === 'cash_on_delivery' ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30' : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
              }`}>
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'cash_on_delivery'}
                    onChange={() => setPaymentMethod('cash_on_delivery')}
                    className="text-primary-600"
                  />
                  <Banknote className="w-5 h-5 ml-3 mr-2 text-green-600" />
                  <div>
                    <span className="font-medium dark:text-white">Cash on Delivery</span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Pay when you receive your order</p>
                  </div>
                </div>
              </label>

              {/* Airtel Money */}
              <label className={`block p-4 border rounded-lg cursor-pointer transition-colors ${
                paymentMethod === 'airtel_money' ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30' : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
              }`}>
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'airtel_money'}
                    onChange={() => setPaymentMethod('airtel_money')}
                    className="text-primary-600"
                  />
                  <Smartphone className="w-5 h-5 ml-3 mr-2 text-red-600" />
                  <div>
                    <span className="font-medium dark:text-white">Airtel Money</span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Pay via Airtel Money mobile wallet</p>
                  </div>
                </div>
              </label>
              {paymentMethod === 'airtel_money' && paymentInfo?.airtel_money && (
                <div className="ml-8 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-800">
                  <p className="text-sm font-medium text-red-800 dark:text-red-300 mb-2">Send payment to:</p>
                  <p className="text-lg font-bold text-red-900 dark:text-red-200">{paymentInfo.airtel_money.number}</p>
                  <p className="text-sm text-red-700 dark:text-red-300">{paymentInfo.airtel_money.accountName}</p>
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Your Airtel Money Number
                    </label>
                    <div className="flex items-center">
                      <Phone className="w-5 h-5 text-gray-400 mr-2" />
                      <input
                        type="tel"
                        value={paymentPhone}
                        onChange={(e) => setPaymentPhone(e.target.value)}
                        placeholder="099XXXXXXX"
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-red-700 dark:text-red-300">
                    <p className="font-medium mb-1">How to pay:</p>
                    <ol className="list-decimal list-inside space-y-1">
                      {paymentInfo.airtel_money.instructions.map((inst, i) => (
                        <li key={i}>{inst}</li>
                      ))}
                    </ol>
                  </div>
                </div>
              )}

              {/* TNM Mpamba */}
              <label className={`block p-4 border rounded-lg cursor-pointer transition-colors ${
                paymentMethod === 'tnm_mpamba' ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30' : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
              }`}>
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'tnm_mpamba'}
                    onChange={() => setPaymentMethod('tnm_mpamba')}
                    className="text-primary-600"
                  />
                  <Smartphone className="w-5 h-5 ml-3 mr-2 text-blue-600" />
                  <div>
                    <span className="font-medium dark:text-white">TNM Mpamba</span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Pay via TNM Mpamba mobile wallet</p>
                  </div>
                </div>
              </label>
              {paymentMethod === 'tnm_mpamba' && paymentInfo?.tnm_mpamba && (
                <div className="ml-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">Send payment to:</p>
                  <p className="text-lg font-bold text-blue-900 dark:text-blue-200">{paymentInfo.tnm_mpamba.number}</p>
                  <p className="text-sm text-blue-700 dark:text-blue-300">{paymentInfo.tnm_mpamba.accountName}</p>
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Your TNM Mpamba Number
                    </label>
                    <div className="flex items-center">
                      <Phone className="w-5 h-5 text-gray-400 mr-2" />
                      <input
                        type="tel"
                        value={paymentPhone}
                        onChange={(e) => setPaymentPhone(e.target.value)}
                        placeholder="088XXXXXXX"
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-blue-700 dark:text-blue-300">
                    <p className="font-medium mb-1">How to pay:</p>
                    <ol className="list-decimal list-inside space-y-1">
                      {paymentInfo.tnm_mpamba.instructions.map((inst, i) => (
                        <li key={i}>{inst}</li>
                      ))}
                    </ol>
                  </div>
                </div>
              )}

              {/* Bank Transfer */}
              <label className={`block p-4 border rounded-lg cursor-pointer transition-colors ${
                paymentMethod === 'bank_transfer' ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30' : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
              }`}>
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'bank_transfer'}
                    onChange={() => setPaymentMethod('bank_transfer')}
                    className="text-primary-600"
                  />
                  <Building2 className="w-5 h-5 ml-3 mr-2 text-purple-600" />
                  <div>
                    <span className="font-medium dark:text-white">Bank Transfer</span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Transfer from your bank account</p>
                  </div>
                </div>
              </label>
              {paymentMethod === 'bank_transfer' && paymentInfo?.bank_transfer && (
                <div className="ml-8 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-800">
                  <p className="text-sm font-medium text-purple-800 dark:text-purple-300 mb-3">Select your bank:</p>
                  <div className="space-y-2">
                    {paymentInfo.bank_transfer.banks.map((bank, i) => (
                      <label key={i} className={`block p-3 border rounded-lg cursor-pointer ${
                        selectedBank === bank.name ? 'border-purple-500 bg-purple-100 dark:bg-purple-800/30' : 'border-gray-200 dark:border-gray-600'
                      }`}>
                        <div className="flex items-center">
                          <input
                            type="radio"
                            name="bank"
                            checked={selectedBank === bank.name}
                            onChange={() => setSelectedBank(bank.name)}
                            className="text-purple-600"
                          />
                          <div className="ml-3">
                            <p className="font-medium text-sm dark:text-white">{bank.name}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              Acc: {bank.accountNumber} | {bank.accountName}
                            </p>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                  <div className="mt-3 text-xs text-purple-700 dark:text-purple-300">
                    <p className="font-medium mb-1">Instructions:</p>
                    <ol className="list-decimal list-inside space-y-1">
                      {paymentInfo.bank_transfer.instructions.map((inst, i) => (
                        <li key={i}>{inst}</li>
                      ))}
                    </ol>
                  </div>
                </div>
              )}
            </div>

            {/* Wallet */}
            {user?.walletBalance > 0 && (
              <div className="mt-4 pt-4 border-t dark:border-gray-600">
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={useWallet}
                      onChange={(e) => setUseWallet(e.target.checked)}
                      className="text-primary-600 rounded"
                    />
                    <Wallet className="w-5 h-5 ml-3 mr-2 text-orange-500" />
                    <span className="dark:text-white">Use Wallet Balance</span>
                  </div>
                  <span className="font-medium text-primary-600">
                    MWK {(user.walletBalance || 0).toLocaleString()}
                  </span>
                </label>
              </div>
            )}

            {/* Loyalty Points */}
            {user?.loyaltyPoints > 0 && (
              <div className="mt-4 pt-4 border-t dark:border-gray-600">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 dark:text-gray-300">Use Loyalty Points</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {user.loyaltyPoints} points = MWK {((user.loyaltyPoints || 0) * 10).toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={user.loyaltyPoints}
                  value={useLoyaltyPoints}
                  onChange={(e) => setUseLoyaltyPoints(parseInt(e.target.value))}
                  className="w-full accent-primary-500"
                />
                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>0</span>
                  <span>{useLoyaltyPoints} points (-MWK {(useLoyaltyPoints * 10).toLocaleString()})</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-100 p-6 sticky top-20">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>

            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div key={item._id} className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {item.product.name} x {item.quantity}
                  </span>
                  <span>MWK {((item.discountPrice || item.price) * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="space-y-3 border-t pt-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>MWK {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery</span>
                <span>{deliveryFee === 0 ? 'Free' : `MWK ${deliveryFee.toLocaleString()}`}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Coupon Discount</span>
                  <span>-MWK {couponDiscount.toLocaleString()}</span>
                </div>
              )}
              {walletDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Wallet</span>
                  <span>-MWK {walletDiscount.toLocaleString()}</span>
                </div>
              )}
              {loyaltyDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Loyalty Points</span>
                  <span>-MWK {loyaltyDiscount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold text-gray-900 border-t pt-3">
                <span>Total</span>
                <span>MWK {total.toLocaleString()}</span>
              </div>
            </div>

            <Button
              onClick={handlePlaceOrder}
              isLoading={isLoading}
              className="w-full mt-6"
              size="lg"
            >
              Place Order
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
