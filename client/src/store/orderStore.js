import { create } from 'zustand';
import api from '../services/api';
import toast from 'react-hot-toast';

const useOrderStore = create((set, get) => ({
  orders: [],
  currentOrder: null,
  isLoading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    total: 0
  },

  fetchOrders: async (params = {}) => {
    set({ isLoading: true });
    try {
      const response = await api.get('/orders', { params });
      set({
        orders: response.data.data,
        pagination: {
          currentPage: response.data.currentPage,
          totalPages: response.data.totalPages,
          total: response.data.total
        },
        isLoading: false
      });
    } catch (error) {
      set({ error: error.response?.data?.message, isLoading: false });
    }
  },

  fetchOrderById: async (id) => {
    set({ isLoading: true, currentOrder: null });
    try {
      const response = await api.get(`/orders/${id}`);
      set({ currentOrder: response.data.data, isLoading: false });
      return response.data.data;
    } catch (error) {
      set({ error: error.response?.data?.message, isLoading: false });
      return null;
    }
  },

  createOrder: async (orderData) => {
    set({ isLoading: true });
    try {
      const response = await api.post('/orders', orderData);
      set({ currentOrder: response.data.data, isLoading: false });
      toast.success('Order placed successfully!');
      return { success: true, order: response.data.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to place order';
      set({ isLoading: false });
      toast.error(message);
      return { success: false, message };
    }
  },

  cancelOrder: async (orderId, reason) => {
    set({ isLoading: true });
    try {
      const response = await api.put(`/orders/${orderId}/cancel`, { reason });
      set({ currentOrder: response.data.data, isLoading: false });

      // Update in orders list
      const orders = get().orders.map(o =>
        o._id === orderId ? response.data.data : o
      );
      set({ orders });

      toast.success('Order cancelled');
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      toast.error(error.response?.data?.message || 'Failed to cancel order');
      return { success: false };
    }
  },

  trackOrder: async (orderId) => {
    try {
      const response = await api.get(`/orders/${orderId}/track`);
      return response.data.data;
    } catch (error) {
      return null;
    }
  },

  clearCurrentOrder: () => set({ currentOrder: null })
}));

export default useOrderStore;
