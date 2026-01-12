import { useEffect, useState } from 'react';
import { Tag, Copy, Clock, CheckCircle } from 'lucide-react';
import api from '../services/api';
import useAuthStore from '../store/authStore';
import Spinner from '../components/ui/Spinner';
import toast from 'react-hot-toast';

const Coupons = () => {
  const { isAuthenticated } = useAuthStore();
  const [coupons, setCoupons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(null);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const response = await api.get('/coupons');
      setCoupons(response.data.data);
    } catch (error) {
      console.error('Failed to fetch coupons');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success('Coupon code copied!');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  if (!isAuthenticated) {
    return (
      <div className="container-custom py-20 text-center">
        <Tag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">View Available Coupons</h2>
        <p className="text-gray-500 mb-6">Login to see exclusive coupon codes</p>
        <a href="/login" className="btn btn-primary">
          Login
        </a>
      </div>
    );
  }

  if (isLoading) {
    return <Spinner className="py-20" />;
  }

  return (
    <div className="container-custom py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Available Coupons</h1>

      {coupons.length === 0 ? (
        <div className="text-center py-20">
          <Tag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">No coupons available</h2>
          <p className="text-gray-500">Check back later for new offers</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {coupons.map((coupon) => {
            const daysLeft = Math.ceil((new Date(coupon.endDate) - new Date()) / (1000 * 60 * 60 * 24));

            return (
              <div
                key={coupon._id}
                className="bg-white rounded-xl border border-gray-100 overflow-hidden"
              >
                <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-primary-100 text-sm">{coupon.title}</p>
                      <p className="text-2xl font-bold">
                        {coupon.discountType === 'percentage'
                          ? `${coupon.discountValue}% OFF`
                          : `$${coupon.discountValue} OFF`
                        }
                      </p>
                    </div>
                    <Tag className="w-10 h-10 text-primary-200" />
                  </div>
                </div>

                <div className="p-4">
                  <p className="text-gray-600 text-sm mb-3">{coupon.description}</p>

                  <div className="flex items-center justify-between mb-3">
                    <div className="font-mono text-lg font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded">
                      {coupon.code}
                    </div>
                    <button
                      onClick={() => handleCopy(coupon.code)}
                      className={`p-2 rounded-lg transition-colors ${
                        copiedCode === coupon.code
                          ? 'bg-green-100 text-green-600'
                          : 'bg-gray-100 text-gray-600 hover:bg-primary-100 hover:text-primary-600'
                      }`}
                    >
                      {copiedCode === coupon.code ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <Copy className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Min order: ${coupon.minOrderAmount}</span>
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {daysLeft} days left
                    </span>
                  </div>

                  {coupon.maxDiscount && (
                    <p className="text-xs text-gray-400 mt-2">
                      Max discount: ${coupon.maxDiscount}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Coupons;
