import { create } from 'zustand';
import api from '../services/api';
import toast from 'react-hot-toast';

const useInventoryStore = create((set, get) => ({
  // Suppliers
  suppliers: [],
  isLoadingSuppliers: false,

  // Inventory Items
  inventoryItems: [],
  lowStockItems: [],
  inventoryCategories: [],
  isLoadingInventory: false,

  // Purchases
  purchases: [],
  totalPurchases: 0,
  purchasesPage: 1,
  isLoadingPurchases: false,

  // Packaging Batches
  packagingBatches: [],
  totalBatches: 0,
  batchesPage: 1,
  isLoadingBatches: false,
  currentBatch: null,

  // Reports
  stockValueReport: null,
  purchasesReport: null,
  packagingReport: null,
  isLoadingReports: false,

  // ============ SUPPLIERS ============
  fetchSuppliers: async (params = {}) => {
    set({ isLoadingSuppliers: true });
    try {
      const { data } = await api.get('/suppliers', { params });
      set({ suppliers: data.data, isLoadingSuppliers: false });
    } catch (error) {
      set({ isLoadingSuppliers: false });
      toast.error('Failed to fetch suppliers');
    }
  },

  createSupplier: async (supplierData) => {
    try {
      const { data } = await api.post('/suppliers', supplierData);
      set(state => ({
        suppliers: [data.data, ...state.suppliers]
      }));
      toast.success('Supplier created successfully');
      return data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create supplier');
      throw error;
    }
  },

  updateSupplier: async (supplierId, supplierData) => {
    try {
      const { data } = await api.put(`/suppliers/${supplierId}`, supplierData);
      set(state => ({
        suppliers: state.suppliers.map(s => s._id === supplierId ? data.data : s)
      }));
      toast.success('Supplier updated successfully');
      return data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update supplier');
      throw error;
    }
  },

  deleteSupplier: async (supplierId) => {
    try {
      await api.delete(`/suppliers/${supplierId}`);
      set(state => ({
        suppliers: state.suppliers.filter(s => s._id !== supplierId)
      }));
      toast.success('Supplier deleted successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete supplier');
      throw error;
    }
  },

  // ============ INVENTORY ITEMS ============
  fetchInventoryItems: async (params = {}) => {
    set({ isLoadingInventory: true });
    try {
      const { data } = await api.get('/inventory', { params });
      set({ inventoryItems: data.data, isLoadingInventory: false });
    } catch (error) {
      set({ isLoadingInventory: false });
      toast.error('Failed to fetch inventory items');
    }
  },

  fetchLowStockItems: async () => {
    try {
      const { data } = await api.get('/inventory/low-stock');
      set({ lowStockItems: data.data });
    } catch (error) {
      toast.error('Failed to fetch low stock items');
    }
  },

  fetchInventoryCategories: async () => {
    try {
      const { data } = await api.get('/inventory/categories');
      set({ inventoryCategories: data.data });
    } catch (error) {
      console.error('Failed to fetch inventory categories:', error);
    }
  },

  fetchInventoryItem: async (itemId) => {
    try {
      const { data } = await api.get(`/inventory/${itemId}`);
      return data.data;
    } catch (error) {
      toast.error('Failed to fetch inventory item');
      throw error;
    }
  },

  createInventoryItem: async (itemData) => {
    try {
      const { data } = await api.post('/inventory', itemData);
      set(state => ({
        inventoryItems: [data.data, ...state.inventoryItems]
      }));
      toast.success('Inventory item created successfully');
      return data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create inventory item');
      throw error;
    }
  },

  updateInventoryItem: async (itemId, itemData) => {
    try {
      const { data } = await api.put(`/inventory/${itemId}`, itemData);
      set(state => ({
        inventoryItems: state.inventoryItems.map(i => i._id === itemId ? data.data : i)
      }));
      toast.success('Inventory item updated successfully');
      return data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update inventory item');
      throw error;
    }
  },

  adjustStock: async (itemId, adjustmentData) => {
    try {
      const { data } = await api.post(`/inventory/${itemId}/adjust`, adjustmentData);
      set(state => ({
        inventoryItems: state.inventoryItems.map(i => i._id === itemId ? data.data.item : i)
      }));
      toast.success('Stock adjusted successfully');
      return data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to adjust stock');
      throw error;
    }
  },

  deleteInventoryItem: async (itemId) => {
    try {
      await api.delete(`/inventory/${itemId}`);
      set(state => ({
        inventoryItems: state.inventoryItems.filter(i => i._id !== itemId)
      }));
      toast.success('Inventory item deactivated');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete inventory item');
      throw error;
    }
  },

  // ============ PURCHASES ============
  fetchPurchases: async (params = {}) => {
    set({ isLoadingPurchases: true });
    try {
      const { data } = await api.get('/purchases', { params });
      set({
        purchases: data.data,
        totalPurchases: data.total,
        purchasesPage: data.currentPage,
        isLoadingPurchases: false
      });
    } catch (error) {
      set({ isLoadingPurchases: false });
      toast.error('Failed to fetch purchases');
    }
  },

  fetchPurchase: async (purchaseId) => {
    try {
      const { data } = await api.get(`/purchases/${purchaseId}`);
      return data.data;
    } catch (error) {
      toast.error('Failed to fetch purchase');
      throw error;
    }
  },

  createPurchase: async (purchaseData) => {
    try {
      const { data } = await api.post('/purchases', purchaseData);
      set(state => ({
        purchases: [data.data, ...state.purchases],
        totalPurchases: state.totalPurchases + 1
      }));
      // Refresh inventory items to get updated stock
      get().fetchInventoryItems();
      toast.success('Purchase recorded successfully');
      return data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create purchase');
      throw error;
    }
  },

  updatePurchase: async (purchaseId, purchaseData) => {
    try {
      const { data } = await api.put(`/purchases/${purchaseId}`, purchaseData);
      set(state => ({
        purchases: state.purchases.map(p => p._id === purchaseId ? data.data : p)
      }));
      toast.success('Purchase updated successfully');
      return data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update purchase');
      throw error;
    }
  },

  // ============ PACKAGING ============
  fetchPackagingBatches: async (params = {}) => {
    set({ isLoadingBatches: true });
    try {
      const { data } = await api.get('/packaging', { params });
      set({
        packagingBatches: data.data,
        totalBatches: data.total,
        batchesPage: data.currentPage,
        isLoadingBatches: false
      });
    } catch (error) {
      set({ isLoadingBatches: false });
      toast.error('Failed to fetch packaging batches');
    }
  },

  fetchPackagingBatch: async (batchId) => {
    try {
      const { data } = await api.get(`/packaging/${batchId}`);
      set({ currentBatch: data.data });
      return data.data;
    } catch (error) {
      toast.error('Failed to fetch packaging batch');
      throw error;
    }
  },

  startPackagingBatch: async (batchData) => {
    try {
      const { data } = await api.post('/packaging', batchData);
      set(state => ({
        packagingBatches: [data.data, ...state.packagingBatches],
        totalBatches: state.totalBatches + 1,
        currentBatch: data.data
      }));
      // Refresh inventory items to get updated stock
      get().fetchInventoryItems();
      toast.success('Packaging batch started');
      return data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to start packaging batch');
      throw error;
    }
  },

  updatePackagingBatch: async (batchId, batchData) => {
    try {
      const { data } = await api.put(`/packaging/${batchId}`, batchData);
      set(state => ({
        packagingBatches: state.packagingBatches.map(b => b._id === batchId ? data.data : b),
        currentBatch: data.data
      }));
      toast.success('Packaging batch updated');
      return data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update packaging batch');
      throw error;
    }
  },

  addPackagedItem: async (batchId, itemData) => {
    try {
      const { data } = await api.post(`/packaging/${batchId}/add-item`, itemData);
      set(state => ({
        packagingBatches: state.packagingBatches.map(b => b._id === batchId ? data.data : b),
        currentBatch: data.data
      }));
      toast.success('Item added to batch');
      return data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add item');
      throw error;
    }
  },

  removePackagedItem: async (batchId, itemIndex) => {
    try {
      const { data } = await api.delete(`/packaging/${batchId}/remove-item/${itemIndex}`);
      set(state => ({
        packagingBatches: state.packagingBatches.map(b => b._id === batchId ? data.data : b),
        currentBatch: data.data
      }));
      toast.success('Item removed from batch');
      return data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to remove item');
      throw error;
    }
  },

  completePackagingBatch: async (batchId) => {
    try {
      const { data } = await api.post(`/packaging/${batchId}/complete`);
      set(state => ({
        packagingBatches: state.packagingBatches.map(b => b._id === batchId ? data.data : b),
        currentBatch: data.data
      }));
      toast.success('Packaging batch completed! Product stocks updated.');
      return data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to complete packaging batch');
      throw error;
    }
  },

  cancelPackagingBatch: async (batchId, reason) => {
    try {
      const { data } = await api.post(`/packaging/${batchId}/cancel`, { reason });
      set(state => ({
        packagingBatches: state.packagingBatches.map(b => b._id === batchId ? data.data : b),
        currentBatch: null
      }));
      // Refresh inventory items to get updated stock
      get().fetchInventoryItems();
      toast.success('Packaging batch cancelled. Stock returned to inventory.');
      return data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel packaging batch');
      throw error;
    }
  },

  clearCurrentBatch: () => {
    set({ currentBatch: null });
  },

  // ============ REPORTS ============
  fetchStockValueReport: async () => {
    set({ isLoadingReports: true });
    try {
      const { data } = await api.get('/inventory/reports/stock-value');
      set({ stockValueReport: data.data, isLoadingReports: false });
      return data.data;
    } catch (error) {
      set({ isLoadingReports: false });
      toast.error('Failed to fetch stock value report');
      throw error;
    }
  },

  fetchPurchasesReport: async (params = {}) => {
    set({ isLoadingReports: true });
    try {
      const { data } = await api.get('/inventory/reports/purchases', { params });
      set({ purchasesReport: data.data, isLoadingReports: false });
      return data.data;
    } catch (error) {
      set({ isLoadingReports: false });
      toast.error('Failed to fetch purchases report');
      throw error;
    }
  },

  fetchPackagingReport: async (params = {}) => {
    set({ isLoadingReports: true });
    try {
      const { data } = await api.get('/inventory/reports/packaging', { params });
      set({ packagingReport: data.data, isLoadingReports: false });
      return data.data;
    } catch (error) {
      set({ isLoadingReports: false });
      toast.error('Failed to fetch packaging report');
      throw error;
    }
  }
}));

export default useInventoryStore;
