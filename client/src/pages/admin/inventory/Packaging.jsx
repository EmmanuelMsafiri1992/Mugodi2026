import { useEffect, useState } from 'react';
import { Plus, X, Package, Scale, CheckCircle, XCircle, Trash2, Eye, ArrowRight } from 'lucide-react';
import useInventoryStore from '../../../store/inventoryStore';
import useAdminStore from '../../../store/adminStore';

const Packaging = () => {
  const {
    packagingBatches,
    totalBatches,
    isLoadingBatches,
    currentBatch,
    fetchPackagingBatches,
    fetchPackagingBatch,
    startPackagingBatch,
    updatePackagingBatch,
    addPackagedItem,
    removePackagedItem,
    completePackagingBatch,
    cancelPackagingBatch,
    clearCurrentBatch,
    inventoryItems,
    fetchInventoryItems
  } = useInventoryStore();

  const { products, fetchAdminProducts } = useAdminStore();

  const [showStartModal, setShowStartModal] = useState(false);
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');

  const [startFormData, setStartFormData] = useState({
    inventoryItem: '',
    weightTaken: '',
    notes: ''
  });

  const [addItemData, setAddItemData] = useState({
    product: '',
    quantity: '',
    unitWeight: '',
    sellingPrice: ''
  });

  useEffect(() => {
    fetchPackagingBatches({ status: statusFilter || undefined });
    fetchInventoryItems();
    fetchAdminProducts();
  }, [statusFilter]);

  const handleStartBatch = async (e) => {
    e.preventDefault();
    try {
      const batch = await startPackagingBatch({
        ...startFormData,
        weightTaken: parseFloat(startFormData.weightTaken)
      });
      setShowStartModal(false);
      setStartFormData({ inventoryItem: '', weightTaken: '', notes: '' });
      // Open the batch detail modal
      setShowBatchModal(true);
    } catch (error) {
      console.error('Failed to start batch:', error);
    }
  };

  const openBatchDetail = async (batch) => {
    await fetchPackagingBatch(batch._id);
    setShowBatchModal(true);
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      await addPackagedItem(currentBatch._id, {
        ...addItemData,
        quantity: parseInt(addItemData.quantity),
        unitWeight: parseFloat(addItemData.unitWeight),
        sellingPrice: parseFloat(addItemData.sellingPrice)
      });
      setShowAddItemModal(false);
      setAddItemData({ product: '', quantity: '', unitWeight: '', sellingPrice: '' });
    } catch (error) {
      console.error('Failed to add item:', error);
    }
  };

  const handleRemoveItem = async (index) => {
    if (window.confirm('Remove this item from the batch?')) {
      await removePackagedItem(currentBatch._id, index);
    }
  };

  const handleComplete = async () => {
    if (window.confirm('Complete this batch? Product stocks will be updated.')) {
      await completePackagingBatch(currentBatch._id);
    }
  };

  const handleCancel = async () => {
    const reason = window.prompt('Enter reason for cancellation:');
    if (reason !== null) {
      await cancelPackagingBatch(currentBatch._id, reason);
      setShowBatchModal(false);
    }
  };

  const handleUpdateActualWeight = async (weight) => {
    await updatePackagingBatch(currentBatch._id, { actualWeight: parseFloat(weight) });
  };

  const closeBatchModal = () => {
    setShowBatchModal(false);
    clearCurrentBatch();
  };

  const formatStock = (stock, unit) => {
    if (unit === 'g' && stock >= 1000) {
      return `${(stock / 1000).toFixed(2)} kg`;
    }
    return `${stock.toLocaleString()} ${unit}`;
  };

  const formatCurrency = (amount) => {
    return `MWK ${amount.toLocaleString()}`;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Set default selling price when product is selected
  const handleProductSelect = (productId) => {
    const product = products.find(p => p._id === productId);
    setAddItemData({
      ...addItemData,
      product: productId,
      sellingPrice: product?.price?.toString() || ''
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Packaging</h1>
          <p className="text-gray-500">Package inventory items into sellable products</p>
        </div>
        <button
          onClick={() => setShowStartModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Start New Batch
        </button>
      </div>

      {/* Status Filter */}
      <div className="flex gap-2">
        <button
          onClick={() => setStatusFilter('')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            !statusFilter ? 'bg-gray-900 text-white' : 'bg-white border border-gray-300 hover:bg-gray-50'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setStatusFilter('in_progress')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            statusFilter === 'in_progress' ? 'bg-blue-500 text-white' : 'bg-white border border-gray-300 hover:bg-gray-50'
          }`}
        >
          In Progress
        </button>
        <button
          onClick={() => setStatusFilter('completed')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            statusFilter === 'completed' ? 'bg-green-500 text-white' : 'bg-white border border-gray-300 hover:bg-gray-50'
          }`}
        >
          Completed
        </button>
        <button
          onClick={() => setStatusFilter('cancelled')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            statusFilter === 'cancelled' ? 'bg-red-500 text-white' : 'bg-white border border-gray-300 hover:bg-gray-50'
          }`}
        >
          Cancelled
        </button>
      </div>

      {/* Batches Grid */}
      {isLoadingBatches ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packagingBatches.map((batch) => (
            <div key={batch._id} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-mono text-gray-500">{batch.batchNumber}</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(batch.status)}`}>
                    {batch.status.replace('_', ' ')}
                  </span>
                </div>

                <h3 className="font-semibold text-gray-900 mb-2">
                  {batch.inventoryItem?.name || 'Unknown Item'}
                </h3>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Weight Taken:</span>
                    <span className="font-medium">{formatStock(batch.weightTaken, batch.inventoryItem?.unit || 'g')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Items Packaged:</span>
                    <span className="font-medium">{batch.packagedItems?.length || 0}</span>
                  </div>
                  {batch.status === 'completed' && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Efficiency:</span>
                      <span className={`font-medium ${batch.efficiency >= 95 ? 'text-green-600' : batch.efficiency >= 90 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {batch.efficiency}%
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {formatDate(batch.createdAt)}
                  </span>
                  <button
                    onClick={() => openBatchDetail(batch)}
                    className="flex items-center gap-1 text-primary-500 hover:text-primary-600"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}

          {packagingBatches.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500">
              No packaging batches found. Start a new batch to begin.
            </div>
          )}
        </div>
      )}

      {/* Start Batch Modal */}
      {showStartModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold">Start Packaging Batch</h2>
              <button onClick={() => setShowStartModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleStartBatch} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Inventory Item *
                </label>
                <select
                  value={startFormData.inventoryItem}
                  onChange={(e) => setStartFormData({ ...startFormData, inventoryItem: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                >
                  <option value="">Select Item</option>
                  {inventoryItems.filter(i => i.isActive && i.currentStock > 0).map(item => (
                    <option key={item._id} value={item._id}>
                      {item.name} ({formatStock(item.currentStock, item.unit)} available)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Weight to Take (grams) *
                </label>
                <input
                  type="number"
                  value={startFormData.weightTaken}
                  onChange={(e) => setStartFormData({ ...startFormData, weightTaken: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                  min="1"
                  placeholder="e.g., 10000 for 10kg"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter weight in grams. This will be deducted from inventory.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={startFormData.notes}
                  onChange={(e) => setStartFormData({ ...startFormData, notes: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Optional notes..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowStartModal(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
                >
                  Start Batch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Batch Detail Modal */}
      {showBatchModal && currentBatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl my-8">
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-xl font-semibold">Batch {currentBatch.batchNumber}</h2>
                <span className={`inline-flex px-2 py-1 text-xs rounded-full mt-1 ${getStatusColor(currentBatch.status)}`}>
                  {currentBatch.status.replace('_', ' ')}
                </span>
              </div>
              <button onClick={closeBatchModal} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Batch Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500">Item</p>
                  <p className="font-semibold">{currentBatch.inventoryItem?.name}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500">Weight Taken</p>
                  <p className="font-semibold">{formatStock(currentBatch.weightTaken, currentBatch.inventoryItem?.unit || 'g')}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500">Actual Weight</p>
                  {currentBatch.status === 'in_progress' ? (
                    <input
                      type="number"
                      defaultValue={currentBatch.actualWeight}
                      onBlur={(e) => handleUpdateActualWeight(e.target.value)}
                      className="w-full font-semibold bg-white border border-gray-300 rounded px-2 py-1"
                    />
                  ) : (
                    <p className="font-semibold">{formatStock(currentBatch.actualWeight, currentBatch.inventoryItem?.unit || 'g')}</p>
                  )}
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500">Variance</p>
                  <p className={`font-semibold ${currentBatch.weightVariance > 0 ? 'text-green-600' : currentBatch.weightVariance < 0 ? 'text-red-600' : ''}`}>
                    {currentBatch.weightVariance > 0 ? '+' : ''}{currentBatch.weightVariance}g
                  </p>
                </div>
              </div>

              {/* Packaged Items */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Packaged Items</h3>
                  {currentBatch.status === 'in_progress' && (
                    <button
                      onClick={() => setShowAddItemModal(true)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      Add Item
                    </button>
                  )}
                </div>

                {currentBatch.packagedItems?.length > 0 ? (
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Product</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Qty</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Unit Weight</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Total Weight</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Selling Price</th>
                          {currentBatch.status === 'in_progress' && (
                            <th className="px-4 py-2"></th>
                          )}
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {currentBatch.packagedItems.map((item, index) => (
                          <tr key={index}>
                            <td className="px-4 py-3 text-sm">{item.product?.name || 'Unknown'}</td>
                            <td className="px-4 py-3 text-sm">{item.quantity}</td>
                            <td className="px-4 py-3 text-sm">{item.unitWeight}g</td>
                            <td className="px-4 py-3 text-sm">{item.totalWeight}g</td>
                            <td className="px-4 py-3 text-sm">{formatCurrency(item.sellingPrice)}</td>
                            {currentBatch.status === 'in_progress' && (
                              <td className="px-4 py-3 text-right">
                                <button
                                  onClick={() => handleRemoveItem(index)}
                                  className="p-1 text-red-500 hover:bg-red-50 rounded"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 border border-dashed rounded-lg">
                    No items packaged yet. Click "Add Item" to start packaging.
                  </div>
                )}
              </div>

              {/* Summary */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Packaged Weight:</span>
                  <span className="font-medium">{currentBatch.totalPackagedWeight || 0}g</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Waste Weight:</span>
                  <span className={`font-medium ${currentBatch.wasteWeight > 0 ? 'text-red-600' : ''}`}>
                    {currentBatch.wasteWeight || 0}g
                  </span>
                </div>
                {currentBatch.actualWeight > 0 && (
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-gray-600">Efficiency:</span>
                    <span className={`font-bold ${
                      (currentBatch.totalPackagedWeight / currentBatch.actualWeight) >= 0.95 ? 'text-green-600' :
                      (currentBatch.totalPackagedWeight / currentBatch.actualWeight) >= 0.90 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {Math.round((currentBatch.totalPackagedWeight / currentBatch.actualWeight) * 100) || 0}%
                    </span>
                  </div>
                )}
              </div>

              {/* Notes */}
              {currentBatch.notes && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Notes</h4>
                  <p className="text-gray-600 text-sm whitespace-pre-line">{currentBatch.notes}</p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center gap-3 p-6 border-t bg-gray-50">
              <div className="text-sm text-gray-500">
                Processed by: {currentBatch.processedBy?.name}
              </div>
              <div className="flex gap-3">
                {currentBatch.status === 'in_progress' && (
                  <>
                    <button
                      onClick={handleCancel}
                      className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
                    >
                      <XCircle className="w-4 h-4" />
                      Cancel Batch
                    </button>
                    <button
                      onClick={handleComplete}
                      disabled={!currentBatch.packagedItems?.length}
                      className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Complete Batch
                    </button>
                  </>
                )}
                {currentBatch.status !== 'in_progress' && (
                  <button
                    onClick={closeBatchModal}
                    className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  >
                    Close
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Packaged Item Modal */}
      {showAddItemModal && currentBatch && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold">Add Packaged Item</h2>
              <button onClick={() => setShowAddItemModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddItem} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product *
                </label>
                <select
                  value={addItemData.product}
                  onChange={(e) => handleProductSelect(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                >
                  <option value="">Select Product</option>
                  {products.filter(p => p.isActive).map(product => (
                    <option key={product._id} value={product._id}>
                      {product.name} ({formatCurrency(product.price)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    value={addItemData.quantity}
                    onChange={(e) => setAddItemData({ ...addItemData, quantity: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                    min="1"
                    placeholder="e.g., 10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unit Weight (g) *
                  </label>
                  <input
                    type="number"
                    value={addItemData.unitWeight}
                    onChange={(e) => setAddItemData({ ...addItemData, unitWeight: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                    min="1"
                    placeholder="e.g., 1000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Selling Price (MWK) *
                </label>
                <input
                  type="number"
                  value={addItemData.sellingPrice}
                  onChange={(e) => setAddItemData({ ...addItemData, sellingPrice: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                  min="0"
                />
              </div>

              {/* Preview */}
              {addItemData.quantity && addItemData.unitWeight && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Total Weight:</strong> {parseInt(addItemData.quantity) * parseFloat(addItemData.unitWeight)}g
                    ({((parseInt(addItemData.quantity) * parseFloat(addItemData.unitWeight)) / 1000).toFixed(2)}kg)
                  </p>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddItemModal(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
                >
                  Add Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Packaging;
