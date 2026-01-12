import { useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import {
  ChevronLeft,
  Package,
  MapPin,
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
  Truck
} from 'lucide-react';
import useOrderStore from '../store/orderStore';
import Spinner from '../components/ui/Spinner';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

const OrderDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const { currentOrder, isLoading, fetchOrderById, cancelOrder } = useOrderStore();

  useEffect(() => {
    fetchOrderById(id);
  }, [id]);

  if (isLoading) {
    return <Spinner className="py-20" />;
  }

  if (!currentOrder) {
    return (
      <div className="container-custom py-20 text-center">
        <p className="text-gray-500 text-lg">Order not found</p>
        <Link to="/orders" className="text-primary-600 hover:underline mt-4 inline-block">
          Back to Orders
        </Link>
      </div>
    );
  }

  const order = currentOrder;
  const canCancel = ['pending', 'confirmed'].includes(order.status);

  const statusSteps = [
    { key: 'pending', label: 'Order Placed', icon: Clock },
    { key: 'confirmed', label: 'Confirmed', icon: CheckCircle },
    { key: 'processing', label: 'Processing', icon: Package },
    { key: 'out_for_delivery', label: 'Out for Delivery', icon: Truck },
    { key: 'delivered', label: 'Delivered', icon: CheckCircle }
  ];

  const currentStepIndex = statusSteps.findIndex(s => s.key === order.status);
  const isCancelled = order.status === 'cancelled';

  const handleCancel = async () => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      await cancelOrder(order._id, 'Customer requested cancellation');
    }
  };

  return (
    <div className="container-custom py-8">
      <Link to="/orders" className="inline-flex items-center text-gray-600 hover:text-primary-600 mb-6">
        <ChevronLeft className="w-5 h-5 mr-1" />
        Back to Orders
      </Link>

      {location.state?.success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-700 font-medium">Order placed successfully!</p>
          <p className="text-green-600 text-sm">Thank you for your order.</p>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Order Header */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-xl font-bold text-gray-900">Order #{order.orderNumber}</h1>
                <p className="text-sm text-gray-500">
                  Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              {canCancel && (
                <Button variant="danger" size="sm" onClick={handleCancel}>
                  Cancel Order
                </Button>
              )}
            </div>

            {/* Order Status Timeline */}
            {!isCancelled ? (
              <div className="relative">
                <div className="flex justify-between">
                  {statusSteps.map((step, index) => {
                    const Icon = step.icon;
                    const isCompleted = index <= currentStepIndex;
                    const isCurrent = index === currentStepIndex;

                    return (
                      <div key={step.key} className="flex flex-col items-center relative z-10">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          isCompleted ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-400'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <p className={`mt-2 text-xs text-center ${
                          isCurrent ? 'font-semibold text-primary-600' : 'text-gray-500'
                        }`}>
                          {step.label}
                        </p>
                      </div>
                    );
                  })}
                </div>
                <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 -z-0">
                  <div
                    className="h-full bg-primary-600 transition-all duration-500"
                    style={{ width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3 p-4 bg-red-50 rounded-lg">
                <XCircle className="w-6 h-6 text-red-500" />
                <div>
                  <p className="font-medium text-red-700">Order Cancelled</p>
                  {order.cancelReason && (
                    <p className="text-sm text-red-600">{order.cancelReason}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Order Items</h2>
            <div className="divide-y">
              {order.items.map((item, index) => (
                <div key={index} className="py-4 flex items-center space-x-4">
                  <img
                    src={item.thumbnail || item.images?.[0] || 'https://placehold.co/80x80/e2e8f0/64748b?text=No+Image'}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      MWK {(item.discountPrice || item.price).toLocaleString()} x {item.quantity}
                    </p>
                  </div>
                  <p className="font-bold">
                    MWK {((item.discountPrice || item.price) * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Address */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-primary-600" />
              Delivery Address
            </h2>
            <div className="text-gray-600">
              <p className="font-medium text-gray-900">{order.shippingAddress.contactName}</p>
              <p>{order.shippingAddress.contactPhone}</p>
              <p>{order.shippingAddress.address}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
              </p>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-100 p-6 sticky top-20">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>

            <div className="space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>MWK {order.subtotal?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Fee</span>
                <span>{order.deliveryFee === 0 ? 'Free' : `MWK ${order.deliveryFee?.toLocaleString()}`}</span>
              </div>
              {order.tax > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>MWK {order.tax?.toLocaleString()}</span>
                </div>
              )}
              {order.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-MWK {order.discount?.toLocaleString()}</span>
                </div>
              )}
              {order.walletUsed > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Wallet</span>
                  <span>-MWK {order.walletUsed?.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold text-gray-900 border-t pt-3">
                <span>Total</span>
                <span>MWK {order.total?.toLocaleString()}</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t">
              <h3 className="font-medium text-gray-900 mb-2 flex items-center">
                <CreditCard className="w-5 h-5 mr-2 text-primary-600" />
                Payment
              </h3>
              <p className="text-gray-600 capitalize">
                {order.paymentMethod?.replace('_', ' ')}
              </p>
              <Badge variant={order.paymentStatus === 'paid' ? 'success' : 'warning'} className="mt-1">
                {order.paymentStatus}
              </Badge>
            </div>

            {order.loyaltyPointsEarned > 0 && (
              <div className="mt-4 p-3 bg-primary-50 rounded-lg">
                <p className="text-sm text-primary-700">
                  You earned <span className="font-bold">{order.loyaltyPointsEarned}</span> loyalty points!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
