import { useEffect, useState } from 'react';
import { BarChart3, Package, ShoppingCart, Scissors, TrendingUp, AlertTriangle, DollarSign } from 'lucide-react';
import useInventoryStore from '../../../store/inventoryStore';

const InventoryReports = () => {
  const {
    stockValueReport,
    purchasesReport,
    packagingReport,
    isLoadingReports,
    fetchStockValueReport,
    fetchPurchasesReport,
    fetchPackagingReport
  } = useInventoryStore();

  const [activeTab, setActiveTab] = useState('stock');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchStockValueReport();
  }, []);

  useEffect(() => {
    if (activeTab === 'purchases') {
      fetchPurchasesReport(dateRange);
    } else if (activeTab === 'packaging') {
      fetchPackagingReport(dateRange);
    }
  }, [activeTab, dateRange]);

  const formatCurrency = (amount) => {
    return `MWK ${(amount || 0).toLocaleString()}`;
  };

  const tabs = [
    { id: 'stock', label: 'Stock Value', icon: Package },
    { id: 'purchases', label: 'Purchases', icon: ShoppingCart },
    { id: 'packaging', label: 'Packaging', icon: Scissors }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Inventory Reports</h1>
        <p className="text-gray-500">View stock value, purchase history, and packaging efficiency</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className="w-5 h-5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Date Range (for purchases and packaging) */}
      {(activeTab === 'purchases' || activeTab === 'packaging') && (
        <div className="flex flex-wrap gap-4 items-end bg-white p-4 rounded-lg shadow-sm">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      )}

      {/* Loading */}
      {isLoadingReports && (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" />
        </div>
      )}

      {/* Stock Value Report */}
      {activeTab === 'stock' && stockValueReport && !isLoadingReports && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Inventory Value</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(stockValueReport.totalValue)}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Items</p>
                  <p className="text-2xl font-bold text-gray-900">{stockValueReport.totalItems}</p>
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
                  <p className="text-2xl font-bold text-yellow-600">{stockValueReport.lowStockCount}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>
          </div>

          {/* By Category */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Value by Category</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Stock</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {Object.entries(stockValueReport.byCategory || {}).map(([category, data]) => (
                    <tr key={category}>
                      <td className="px-4 py-3 font-medium">{category}</td>
                      <td className="px-4 py-3">{data.count}</td>
                      <td className="px-4 py-3">{data.stock.toLocaleString()}g</td>
                      <td className="px-4 py-3 font-medium">{formatCurrency(data.value)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Purchases Report */}
      {activeTab === 'purchases' && purchasesReport && !isLoadingReports && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Spent</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(purchasesReport.totalSpent)}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Purchases</p>
                  <p className="text-2xl font-bold text-gray-900">{purchasesReport.totalPurchases}</p>
                </div>
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-indigo-600" />
                </div>
              </div>
            </div>
          </div>

          {/* By Item */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Purchases by Item</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Purchases</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Quantity</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {Object.entries(purchasesReport.byItem || {}).map(([item, data]) => (
                    <tr key={item}>
                      <td className="px-4 py-3 font-medium">{item}</td>
                      <td className="px-4 py-3">{data.count}</td>
                      <td className="px-4 py-3">{data.totalQuantity.toLocaleString()}</td>
                      <td className="px-4 py-3 font-medium">{formatCurrency(data.totalCost)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* By Supplier */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Purchases by Supplier</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Supplier</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Purchases</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {Object.entries(purchasesReport.bySupplier || {}).map(([supplier, data]) => (
                    <tr key={supplier}>
                      <td className="px-4 py-3 font-medium">{supplier}</td>
                      <td className="px-4 py-3">{data.count}</td>
                      <td className="px-4 py-3 font-medium">{formatCurrency(data.totalCost)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Packaging Report */}
      {activeTab === 'packaging' && packagingReport && !isLoadingReports && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <p className="text-sm text-gray-500">Total Batches</p>
              <p className="text-2xl font-bold text-gray-900">{packagingReport.totalBatches}</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <p className="text-sm text-gray-500">Weight Processed</p>
              <p className="text-2xl font-bold text-gray-900">{(packagingReport.totalWeightProcessed / 1000).toFixed(1)} kg</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <p className="text-sm text-gray-500">Weight Packaged</p>
              <p className="text-2xl font-bold text-gray-900">{(packagingReport.totalPackagedWeight / 1000).toFixed(1)} kg</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <p className="text-sm text-gray-500">Total Waste</p>
              <p className="text-2xl font-bold text-red-600">{packagingReport.totalWaste.toLocaleString()} g</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Avg Efficiency</p>
                  <p className={`text-2xl font-bold ${
                    packagingReport.averageEfficiency >= 95 ? 'text-green-600' :
                    packagingReport.averageEfficiency >= 90 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {packagingReport.averageEfficiency}%
                  </p>
                </div>
                <TrendingUp className={`w-6 h-6 ${
                  packagingReport.averageEfficiency >= 95 ? 'text-green-600' :
                  packagingReport.averageEfficiency >= 90 ? 'text-yellow-600' : 'text-red-600'
                }`} />
              </div>
            </div>
          </div>

          {/* By Item */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Packaging by Item</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Batches</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Processed</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Packaged</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Waste</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Efficiency</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {Object.entries(packagingReport.byItem || {}).map(([item, data]) => {
                    const efficiency = data.processed > 0 ? Math.round((data.packaged / data.processed) * 100) : 0;
                    return (
                      <tr key={item}>
                        <td className="px-4 py-3 font-medium">{item}</td>
                        <td className="px-4 py-3">{data.batches}</td>
                        <td className="px-4 py-3">{(data.processed / 1000).toFixed(1)} kg</td>
                        <td className="px-4 py-3">{(data.packaged / 1000).toFixed(1)} kg</td>
                        <td className="px-4 py-3 text-red-600">{data.waste.toLocaleString()} g</td>
                        <td className="px-4 py-3">
                          <span className={`font-medium ${
                            efficiency >= 95 ? 'text-green-600' :
                            efficiency >= 90 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {efficiency}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryReports;
