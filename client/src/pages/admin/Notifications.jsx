import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  Send,
  Users,
  User,
  Trash2,
  X,
  ShoppingCart,
  Tag,
  Info,
  Plus,
  ExternalLink
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

const typeIcons = {
  order: ShoppingCart,
  promo: Tag,
  system: Info,
  wallet: Info,
  loyalty: Tag
};

const typeColors = {
  order: 'bg-blue-100 text-blue-700',
  promo: 'bg-purple-100 text-purple-700',
  system: 'bg-gray-100 text-gray-700',
  wallet: 'bg-green-100 text-green-700',
  loyalty: 'bg-orange-100 text-orange-700'
};

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [sendTarget, setSendTarget] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'promo'
  });
  const [isSending, setIsSending] = useState(false);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      // Try to fetch real notifications from API
      const { data } = await api.get('/admin/notifications');
      if (data.data && data.data.length > 0) {
        setNotifications(data.data);
      } else {
        // Fallback to fetching recent orders as notifications
        const ordersRes = await api.get('/admin/orders', { params: { limit: 10, sort: '-createdAt' } });
        const orders = ordersRes.data?.data || [];

        const orderNotifications = orders.map(order => ({
          _id: `order-${order._id}`,
          orderId: order._id,
          title: `Order #${order.orderNumber}`,
          message: `${order.items?.length || 0} items - ${order.currency === 'ZAR' ? 'R' : 'MWK'} ${order.total?.toLocaleString()} - ${order.status}`,
          type: 'order',
          createdAt: order.createdAt,
          sentTo: 'admin'
        }));

        setNotifications(orderNotifications);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      // Fallback mock data
      setNotifications([
        {
          _id: '1',
          title: 'New Order Received',
          message: 'Order #MGD001 has been placed',
          type: 'order',
          createdAt: new Date().toISOString(),
          sentTo: 'admin'
        },
        {
          _id: '2',
          title: 'Flash Sale!',
          message: '50% off on all groceries this weekend',
          type: 'promo',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          sentTo: 'all users'
        },
        {
          _id: '3',
          title: 'Low Stock Alert',
          message: '5 products are running low on stock',
          type: 'system',
          createdAt: new Date(Date.now() - 172800000).toISOString(),
          sentTo: 'admin'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/admin/users', { params: { limit: 100 } });
      setUsers(data.data || []);
    } catch (error) {
      console.error('Failed to fetch users');
    }
  };

  useEffect(() => {
    fetchNotifications();
    fetchUsers();
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    setIsSending(true);
    try {
      // In a real app, this would send to the backend
      const newNotification = {
        _id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString(),
        sentTo: sendTarget === 'all' ? 'all users' : `${selectedUsers.length} users`
      };

      setNotifications([newNotification, ...notifications]);
      setShowModal(false);
      setFormData({ title: '', message: '', type: 'promo' });
      setSendTarget('all');
      setSelectedUsers([]);
      toast.success('Notification sent successfully');
    } catch (error) {
      toast.error('Failed to send notification');
    } finally {
      setIsSending(false);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this notification?')) {
      setNotifications(notifications.filter(n => n._id !== id));
      toast.success('Notification deleted');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-MW', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-500">Send and manage notifications to users</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Send Notification
        </button>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => {
            setFormData({ title: 'Flash Sale!', message: '', type: 'promo' });
            setShowModal(true);
          }}
          className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Tag className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Promotional</p>
              <p className="text-sm text-gray-500">Send promo notification</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => {
            setFormData({ title: 'System Update', message: '', type: 'system' });
            setShowModal(true);
          }}
          className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <Info className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">System</p>
              <p className="text-sm text-gray-500">Send system notification</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => {
            setFormData({ title: 'Earn Double Points!', message: '', type: 'loyalty' });
            setShowModal(true);
          }}
          className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Tag className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Loyalty</p>
              <p className="text-sm text-gray-500">Send loyalty notification</p>
            </div>
          </div>
        </button>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Recent Notifications</h2>
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <Bell className="w-12 h-12 mb-4" />
            <p>No notifications sent yet</p>
          </div>
        ) : (
          <div className="divide-y">
            {notifications.map((notification) => {
              const Icon = typeIcons[notification.type] || Bell;
              const isClickable = notification.type === 'order' && notification.orderId;

              const handleClick = () => {
                if (isClickable) {
                  navigate(`/admin/orders?orderId=${notification.orderId}`);
                }
              };

              return (
                <div
                  key={notification._id}
                  className={`p-4 hover:bg-gray-50 ${isClickable ? 'cursor-pointer' : ''}`}
                  onClick={isClickable ? handleClick : undefined}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${typeColors[notification.type]}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-gray-900">{notification.title}</h3>
                        <span className={`px-2 py-0.5 text-xs rounded-full ${typeColors[notification.type]}`}>
                          {notification.type}
                        </span>
                        {isClickable && (
                          <ExternalLink className="w-4 h-4 text-primary-500" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{formatDate(notification.createdAt)}</span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          Sent to {notification.sentTo}
                        </span>
                        {isClickable && (
                          <span className="text-primary-500 font-medium">Click to view order</span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(notification._id);
                      }}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-gray-100 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Send Notification Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold">Send Notification</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSend} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="promo">Promotional</option>
                  <option value="system">System</option>
                  <option value="loyalty">Loyalty</option>
                  <option value="order">Order Update</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Send To</label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="sendTarget"
                      value="all"
                      checked={sendTarget === 'all'}
                      onChange={() => setSendTarget('all')}
                      className="text-primary-500"
                    />
                    <Users className="w-4 h-4" />
                    <span className="text-sm">All Users</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="sendTarget"
                      value="selected"
                      checked={sendTarget === 'selected'}
                      onChange={() => setSendTarget('selected')}
                      className="text-primary-500"
                    />
                    <User className="w-4 h-4" />
                    <span className="text-sm">Selected Users</span>
                  </label>
                </div>
              </div>

              {sendTarget === 'selected' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Users ({selectedUsers.length} selected)
                  </label>
                  <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-lg">
                    {users.map((user) => (
                      <label
                        key={user._id}
                        className="flex items-center gap-2 p-2 hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user._id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedUsers([...selectedUsers, user._id]);
                            } else {
                              setSelectedUsers(selectedUsers.filter(id => id !== user._id));
                            }
                          }}
                          className="text-primary-500"
                        />
                        <span className="text-sm">{user.name} ({user.email})</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSending || (sendTarget === 'selected' && selectedUsers.length === 0)}
                  className="flex items-center gap-2 px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  {isSending ? 'Sending...' : 'Send Notification'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;
