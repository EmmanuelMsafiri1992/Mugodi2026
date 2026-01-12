import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Package,
  ShoppingCart,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Image,
  Ticket,
  BarChart3,
  Bell,
  RefreshCw,
  Calendar
} from 'lucide-react';
import useAdminStore from '../../store/adminStore';

const StatCard = ({ title, value, icon: Icon, change, changeType, link, color = 'primary' }) => {
  const colors = {
    primary: 'bg-primary-500',
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    orange: 'bg-orange-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500'
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <div className={`flex items-center mt-2 text-sm ${changeType === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {changeType === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              <span>{change}</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 ${colors[color]} rounded-lg flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      {link && (
        <Link to={link} className="mt-4 text-sm text-primary-500 hover:underline inline-block">
          View details →
        </Link>
      )}
    </div>
  );
};

const QuickAction = ({ icon: Icon, label, to, color = 'primary' }) => {
  const colors = {
    primary: 'bg-primary-100 text-primary-700 hover:bg-primary-200',
    blue: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
    green: 'bg-green-100 text-green-700 hover:bg-green-200',
    orange: 'bg-orange-100 text-orange-700 hover:bg-orange-200',
    purple: 'bg-purple-100 text-purple-700 hover:bg-purple-200'
  };

  return (
    <Link
      to={to}
      className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-colors ${colors[color]}`}
    >
      <Icon className="w-6 h-6" />
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );
};

const Dashboard = () => {
  const { stats, isLoadingStats, fetchStats } = useAdminStore();
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchStats();
    setIsRefreshing(false);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-MW', {
      style: 'currency',
      currency: 'MWK',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  if (isLoadingStats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">Welcome back! Here's what's happening with your store.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <Link
            to="/admin/reports"
            className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
          >
            <BarChart3 className="w-5 h-5" />
            View Reports
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          <QuickAction icon={Plus} label="Add Product" to="/admin/products" color="primary" />
          <QuickAction icon={ShoppingCart} label="View Orders" to="/admin/orders" color="blue" />
          <QuickAction icon={Image} label="Add Banner" to="/admin/banners" color="green" />
          <QuickAction icon={Ticket} label="Create Coupon" to="/admin/coupons" color="orange" />
          <QuickAction icon={Bell} label="Send Alert" to="/admin/notifications" color="purple" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(stats?.revenue?.total)}
          icon={TrendingUp}
          change={`${formatCurrency(stats?.revenue?.monthly)} this month`}
          changeType="up"
          color="green"
        />
        <StatCard
          title="Total Orders"
          value={stats?.orders?.total || 0}
          icon={ShoppingCart}
          change={`${stats?.orders?.pending || 0} pending`}
          changeType="up"
          link="/admin/orders"
          color="blue"
        />
        <StatCard
          title="Total Products"
          value={stats?.products?.total || 0}
          icon={Package}
          change={`${stats?.products?.lowStock || 0} low stock`}
          changeType={stats?.products?.lowStock > 0 ? 'down' : 'up'}
          link="/admin/products"
          color="purple"
        />
        <StatCard
          title="Total Users"
          value={stats?.users?.total || 0}
          icon={Users}
          change={`${stats?.users?.newThisMonth || 0} new this month`}
          changeType="up"
          link="/admin/users"
          color="orange"
        />
      </div>

      {/* Order Status Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-yellow-50 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-yellow-600">{stats?.orders?.pending || 0}</p>
          <p className="text-sm text-yellow-700">Pending</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{stats?.orders?.processing || 0}</p>
          <p className="text-sm text-blue-700">Processing</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{stats?.orders?.completed || 0}</p>
          <p className="text-sm text-green-700">Completed</p>
        </div>
        <div className="bg-red-50 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-red-600">{stats?.orders?.cancelled || 0}</p>
          <p className="text-sm text-red-700">Cancelled</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
              <Link to="/admin/orders" className="text-sm text-primary-500 hover:underline">
                View all
              </Link>
            </div>
          </div>
          <div className="divide-y">
            {stats?.recentOrders?.length > 0 ? (
              stats.recentOrders.slice(0, 5).map((order) => (
                <div key={order._id} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">#{order.orderNumber}</p>
                    <p className="text-sm text-gray-500">{order.user?.name || 'Guest'}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(order.total)}</p>
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                No orders yet
              </div>
            )}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Top Selling Products</h2>
              <Link to="/admin/products" className="text-sm text-primary-500 hover:underline">
                View all
              </Link>
            </div>
          </div>
          <div className="divide-y">
            {stats?.topProducts?.length > 0 ? (
              stats.topProducts.slice(0, 5).map((product, index) => (
                <div key={product._id} className="p-4 flex items-center gap-4">
                  <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                    {index + 1}
                  </span>
                  <img
                    src={product.thumbnail || product.images?.[0] || 'https://placehold.co/40x40/e2e8f0/64748b?text=No+Image'}
                    alt={product.name}
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.soldCount || 0} sold</p>
                  </div>
                  <p className="font-medium">{formatCurrency(product.price)}</p>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                No sales data yet
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Low Stock Alert */}
      {stats?.products?.lowStock > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <AlertTriangle className="w-8 h-8 text-orange-500" />
            <div>
              <h3 className="font-semibold text-orange-800">Low Stock Alert</h3>
              <p className="text-orange-600">
                {stats.products.lowStock} products are running low on stock.
                <Link to="/admin/products?stock=low" className="underline ml-1">
                  View products
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
