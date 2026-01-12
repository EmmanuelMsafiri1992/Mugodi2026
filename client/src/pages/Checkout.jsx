import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, CreditCard, Wallet, DollarSign, Plus } from 'lucide-react';
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
  const [useWallet, setUseWallet] = useState(false);
  const [useLoyaltyPoints, setUseLoyaltyPoints] = useState(0);
  const [loading, setLoading] = useState(true);

  const { user } = useAuthStore();
  const { cart, getCartTotal } = useCartStore();
  const { createOrder, isLoading } = useOrderStore();

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const response = await api.get('/addresses');
      setAddresses(response.data.data);
      const defaultAddr = response.data.data.find(a => a.isDefault);
      if (defaultAddr) setSelectedAddress(defaultAddr._id);
    } catch (error) {
      console.error('Failed to fetch addresses');
    } finally {
      setLoading(false);
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
      useWallet,
      useLoyaltyPoints
    });

    if (result.success) {
      navigate(`/orders/${result.order._id}`, { state: { success: true } });
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
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <CreditCard className="w-5 h-5 mr-2 text-primary-600" />
              Payment Method
            </h2>

            <div className="space-y-3">
              <label className={`block p-4 border rounded-lg cursor-pointer transition-colors ${
                paymentMethod === 'cash_on_delivery' ? 'border-primary-500 bg-primary-50' : 'border-gray-200'
              }`}>
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'cash_on_delivery'}
                    onChange={() => setPaymentMethod('cash_on_delivery')}
                    className="text-primary-600"
                  />
                  <DollarSign className="w-5 h-5 ml-3 mr-2 text-gray-400" />
                  <span>Cash on Delivery</span>
                </div>
              </label>

              <label className={`block p-4 border rounded-lg cursor-pointer transition-colors ${
                paymentMethod === 'card' ? 'border-primary-500 bg-primary-50' : 'border-gray-200'
              }`}>
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    className="text-primary-600"
                  />
                  <CreditCard className="w-5 h-5 ml-3 mr-2 text-gray-400" />
                  <span>Credit/Debit Card</span>
                </div>
              </label>
            </div>

            {/* Wallet */}
            {user?.walletBalance > 0 && (
              <div className="mt-4 pt-4 border-t">
                <label className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={useWallet}
                      onChange={(e) => setUseWallet(e.target.checked)}
                      className="text-primary-600 rounded"
                    />
                    <Wallet className="w-5 h-5 ml-3 mr-2 text-gray-400" />
                    <span>Use Wallet Balance</span>
                  </div>
                  <span className="font-medium text-primary-600">
                    MWK {user.walletBalance.toLocaleString()}
                  </span>
                </label>
              </div>
            )}

            {/* Loyalty Points */}
            {user?.loyaltyPoints > 0 && (
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Use Loyalty Points</span>
                  <span className="text-sm text-gray-500">
                    {user.loyaltyPoints} points = MWK {(user.loyaltyPoints * 10).toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={user.loyaltyPoints}
                  value={useLoyaltyPoints}
                  onChange={(e) => setUseLoyaltyPoints(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500">
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
