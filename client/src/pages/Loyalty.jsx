import { useEffect, useState } from 'react';
import { Award, ArrowRight, Gift, Star, Trophy } from 'lucide-react';
import api from '../services/api';
import useAuthStore from '../store/authStore';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import toast from 'react-hot-toast';

const Loyalty = () => {
  const { user, checkAuth } = useAuthStore();
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [convertPoints, setConvertPoints] = useState(0);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await api.get('/loyalty/transactions');
      setTransactions(response.data.data);
    } catch (error) {
      console.error('Failed to fetch transactions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConvert = async () => {
    if (convertPoints < 100) {
      toast.error('Minimum 100 points required');
      return;
    }

    try {
      await api.post('/loyalty/convert', { points: convertPoints });
      toast.success(`Converted ${convertPoints} points to MWK ${(convertPoints * 10).toLocaleString()}`);
      setConvertPoints(0);
      fetchTransactions();
      checkAuth();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Conversion failed');
    }
  };

  if (isLoading) {
    return <Spinner className="py-20" />;
  }

  const points = user?.loyaltyPoints || 0;
  const walletValue = (points * 0.01).toFixed(2);

  return (
    <div className="container-custom py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Loyalty Program</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Points Card */}
        <div className="md:col-span-1 space-y-4">
          <div className="bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-xl p-6 text-white">
            <div className="flex items-center space-x-3 mb-4">
              <Award className="w-10 h-10" />
              <div>
                <p className="text-secondary-100 text-sm">Your Points</p>
                <p className="text-3xl font-bold">{points.toLocaleString()}</p>
              </div>
            </div>
            <p className="text-secondary-100">
              Worth MWK {(points * 10).toLocaleString()} in wallet credit
            </p>
          </div>

          {/* Convert Points */}
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <h3 className="font-medium text-gray-900 mb-3">Convert to Wallet</h3>
            <div className="space-y-3">
              <input
                type="range"
                min="0"
                max={points}
                step="100"
                value={convertPoints}
                onChange={(e) => setConvertPoints(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-sm">
                <span>{convertPoints.toLocaleString()} points</span>
                <span className="text-primary-600 font-medium">
                  MWK {(convertPoints * 10).toLocaleString()}
                </span>
              </div>
              <Button
                onClick={handleConvert}
                disabled={convertPoints < 100}
                className="w-full"
              >
                Convert Points
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <p className="text-xs text-gray-500 text-center">
                Minimum 100 points required
              </p>
            </div>
          </div>

          {/* How to Earn */}
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <h3 className="font-medium text-gray-900 mb-3">How to Earn Points</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-2">
                <Gift className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Shop & Earn</p>
                  <p className="text-gray-500">1 point per MWK 100 spent</p>
                </div>
              </li>
              <li className="flex items-start space-x-2">
                <Star className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Write Reviews</p>
                  <p className="text-gray-500">50 points per review</p>
                </div>
              </li>
              <li className="flex items-start space-x-2">
                <Trophy className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Refer Friends</p>
                  <p className="text-gray-500">500 points per referral</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Transaction History */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Points History</h2>

            {transactions.length === 0 ? (
              <div className="text-center py-12">
                <Award className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No transactions yet</p>
                <p className="text-sm text-gray-400 mt-1">Start shopping to earn points!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {transactions.map((tx) => (
                  <div
                    key={tx._id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${
                        tx.type === 'earned' || tx.type === 'bonus'
                          ? 'bg-green-100'
                          : 'bg-orange-100'
                      }`}>
                        <Award className={`w-5 h-5 ${
                          tx.type === 'earned' || tx.type === 'bonus'
                            ? 'text-green-600'
                            : 'text-orange-600'
                        }`} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{tx.description}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(tx.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${
                        tx.points > 0 ? 'text-green-600' : 'text-orange-600'
                      }`}>
                        {tx.points > 0 ? '+' : ''}{tx.points.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        Balance: {tx.balanceAfter.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loyalty;
