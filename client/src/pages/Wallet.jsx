import { useEffect, useState } from 'react';
import { Wallet as WalletIcon, Plus, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import api from '../services/api';
import useAuthStore from '../store/authStore';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import Spinner from '../components/ui/Spinner';
import toast from 'react-hot-toast';

const Wallet = () => {
  const { user, checkAuth } = useAuthStore();
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [amount, setAmount] = useState('');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await api.get('/wallet/transactions');
      setTransactions(response.data.data);
    } catch (error) {
      console.error('Failed to fetch transactions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddFunds = async (e) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    try {
      await api.post('/wallet/add-funds', { amount: numAmount });
      toast.success(`MWK ${numAmount.toLocaleString()} added to wallet`);
      setIsModalOpen(false);
      setAmount('');
      fetchTransactions();
      checkAuth(); // Refresh user data
    } catch (error) {
      toast.error('Failed to add funds');
    }
  };

  if (isLoading) {
    return <Spinner className="py-20" />;
  }

  return (
    <div className="container-custom py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Wallet</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Balance Card */}
        <div className="md:col-span-1">
          <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl p-6 text-white">
            <div className="flex items-center space-x-3 mb-4">
              <WalletIcon className="w-10 h-10" />
              <div>
                <p className="text-primary-100 text-sm">Available Balance</p>
                <p className="text-3xl font-bold">MWK {user?.walletBalance?.toLocaleString() || '0'}</p>
              </div>
            </div>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="w-full bg-white text-primary-600 hover:bg-primary-50"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Funds
            </Button>
          </div>

          <div className="mt-4 bg-white rounded-xl border border-gray-100 p-4">
            <h3 className="font-medium text-gray-900 mb-2">About Wallet</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>Use wallet balance for faster checkout</li>
              <li>Receive refunds directly to wallet</li>
              <li>Convert loyalty points to wallet balance</li>
            </ul>
          </div>
        </div>

        {/* Transactions */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Transaction History</h2>

            {transactions.length === 0 ? (
              <div className="text-center py-12">
                <WalletIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No transactions yet</p>
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
                        tx.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {tx.type === 'credit' ? (
                          <ArrowDownLeft className="w-5 h-5 text-green-600" />
                        ) : (
                          <ArrowUpRight className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{tx.description}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(tx.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${
                        tx.type === 'credit' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {tx.type === 'credit' ? '+' : '-'}MWK {tx.amount.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        Balance: MWK {tx.balanceAfter.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Funds Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setAmount(''); }}
        title="Add Funds to Wallet"
        size="sm"
      >
        <form onSubmit={handleAddFunds} className="space-y-4">
          <Input
            label="Amount (MWK)"
            type="number"
            min="100"
            step="100"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            required
          />

          <div className="flex gap-2">
            {[1000, 2500, 5000, 10000].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setAmount(preset.toString())}
                className="flex-1 py-2 border border-gray-300 rounded-lg hover:border-primary-500 hover:text-primary-600 transition-colors"
              >
                {preset.toLocaleString()}
              </button>
            ))}
          </div>

          <p className="text-sm text-gray-500">
            This is a demo. In production, this would connect to a payment gateway.
          </p>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => { setIsModalOpen(false); setAmount(''); }}
            >
              Cancel
            </Button>
            <Button type="submit">
              Add MWK {amount ? parseInt(amount).toLocaleString() : '0'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Wallet;
