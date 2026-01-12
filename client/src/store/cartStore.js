import { create } from 'zustand';
import api from '../services/api';
import toast from 'react-hot-toast';

const useCartStore = create((set, get) => ({
  cart: null,
  isLoading: false,
  error: null,

  fetchCart: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get('/cart');
      set({ cart: response.data.data, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message, isLoading: false });
    }
  },

  addToCart: async (productId, quantity = 1, variation = null) => {
    set({ isLoading: true });
    try {
      const response = await api.post('/cart/add', {
        productId,
        quantity,
        variation
      });
      set({ cart: response.data.data, isLoading: false });
      toast.success('Added to cart');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add to cart';
      set({ isLoading: false });
      toast.error(message);
      return { success: false, message };
    }
  },

  updateQuantity: async (itemId, quantity) => {
    set({ isLoading: true });
    try {
      const response = await api.put('/cart/update', { itemId, quantity });
      set({ cart: response.data.data, isLoading: false });
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      toast.error(error.response?.data?.message || 'Failed to update cart');
      return { success: false };
    }
  },

  removeFromCart: async (itemId) => {
    set({ isLoading: true });
    try {
      const response = await api.delete(`/cart/remove/${itemId}`);
      set({ cart: response.data.data, isLoading: false });
      toast.success('Item removed');
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      toast.error('Failed to remove item');
      return { success: false };
    }
  },

  clearCart: async () => {
    set({ isLoading: true });
    try {
      await api.delete('/cart/clear');
      set({ cart: { items: [], couponDiscount: 0 }, isLoading: false });
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return { success: false };
    }
  },

  applyCoupon: async (code) => {
    set({ isLoading: true });
    try {
      const response = await api.post('/cart/apply-coupon', { code });
      set({ cart: response.data.data, isLoading: false });
      toast.success(response.data.message);
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      toast.error(error.response?.data?.message || 'Invalid coupon');
      return { success: false };
    }
  },

  removeCoupon: async () => {
    set({ isLoading: true });
    try {
      const response = await api.delete('/cart/remove-coupon');
      set({ cart: response.data.data, isLoading: false });
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return { success: false };
    }
  },

  getCartTotal: () => {
    const cart = get().cart;
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((total, item) => {
      const price = item.discountPrice || item.price;
      return total + price * item.quantity;
    }, 0);
  },

  getItemCount: () => {
    const cart = get().cart;
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((count, item) => count + item.quantity, 0);
  }
}));

export default useCartStore;
