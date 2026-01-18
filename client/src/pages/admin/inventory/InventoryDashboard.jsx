import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ShoppingCart, Scissors, Users, AlertTriangle, TrendingUp, ArrowRight, DollarSign } from 'lucide-react';
import useInventoryStore from '../../../store/inventoryStore';

const InventoryDashboard = () => {
  const {
    inventoryItems,
    lowStockItems,
    packagingBatches,
    suppliers,
    fetchInventoryItems,
    fetchLowStockItems,
    fetchPackagingBatches,
    fetchSuppliers,
    fetchStockValueReport,
    stockValueReport,
    isLoadingInventory
  } = useInventoryStore();

  useEffect(() => {
    fetchInventoryItems();
    fetchLowStockItems();
    fetchPackagingBatches({ limit: 5 });
    fetchSuppliers();
    fetchStockValueReport();
  }, []);

  const formatCurrency = (amount) => {
    return `MWK ${(amount || 0).toLocaleString()}`;
  };

  const formatStock = (stock, unit) => {
    if (unit === 'g' && stock >= 1000) {
      return `${(stock / 1000).toFixed(1)} kg`;
    }
    return `${stock.toLocaleString()} ${unit}`;
  };

  const inProgressBatches = packagingBatches.filter(b => b.status === 'in_progress');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Inventory Dashboard</h1>
        <p className="text-gray-500">Overview of your storeroom inventory</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Stock Value</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(stockValueReport?.totalValue)}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Stock Items</p>
              <p className="text-2xl font-bold text-gray-900">{inventoryItems.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Low Stock Alerts</p>
              <p className="text-2xl font-bold text-yellow-600">{lowStockItems.length}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Suppliers</p>
              <p className="text-2xl font-bold text-gray-900">
                {suppliers.filter(s => s.isActive).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Items */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              <h2 className="font-semibold text-gray-900">Low Stock Items</h2>
            </div>
            <Link
              to="/admin/inventory/items"
              className="text-sm text-primary-500 hover:text-primary-600 flex items-center gap-1"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y">
            {lowStockItems.slice(0, 5).map((item) => (
              <div key={item._id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-500">{item.category}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-yellow-600">
                    {formatStock(item.currentStock, item.unit)}
                  </p>
                  <p className="text-xs text-gray-500">
                    Reorder at {formatStock(item.reorderLevel, item.unit)}
                  </p>
                </div>
              </div>
            ))}
            {lowStockItems.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                No low stock items. All items are well stocked!
              </div>
            )}
          </div>
        </div>

        {/* In Progress Batches */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center gap-2">
              <Scissors className="w-5 h-5 text-blue-500" />
              <h2 className="font-semibold text-gray-900">In Progress Batches</h2>
            </div>
            <Link
              to="/admin/inventory/packaging"
              className="text-sm text-primary-500 hover:text-primary-600 flex items-center gap-1"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y">
            {inProgressBatches.slice(0, 5).map((batch) => (
              <div key={batch._id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{batch.batchNumber}</p>
                  <p className="text-sm text-gray-500">{batch.inventoryItem?.name}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">
                    {formatStock(batch.weightTaken, batch.inventoryItem?.unit || 'g')}
                  </p>
                  <p className="text-xs text-gray-500">
                    {batch.packagedItems?.length || 0} items packaged
                  </p>
                </div>
              </div>
            ))}
            {inProgressBatches.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                No batches in progress.
                <Link
                  to="/admin/inventory/packaging"
                  className="block mt-2 text-primary-500 hover:text-primary-600"
                >
                  Start a new batch
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            to="/admin/inventory/purchases"
            className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors"
          >
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Record Purchase</p>
              <p className="text-xs text-gray-500">Add new stock</p>
            </div>
          </Link>

          <Link
            to="/admin/inventory/packaging"
            className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors"
          >
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Scissors className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Start Packaging</p>
              <p className="text-xs text-gray-500">Package products</p>
            </div>
          </Link>

          <Link
            to="/admin/inventory/items"
            className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors"
          >
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Manage Stock</p>
              <p className="text-xs text-gray-500">View & adjust items</p>
            </div>
          </Link>

          <Link
            to="/admin/inventory/reports"
            className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors"
          >
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">View Reports</p>
              <p className="text-xs text-gray-500">Analytics & insights</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default InventoryDashboard;
