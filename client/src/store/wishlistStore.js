import { create } from 'zustand';
import api from '../services/api';
import toast from 'react-hot-toast';

const useWishlistStore = create((set, get) => ({
  items: [],
  isLoading: false,

  fetchWishlist: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get('/wishlist');
      set({ items: response.data.data, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
    }
  },

  addToWishlist: async (productId) => {
    try {
      const response = await api.post(`/wishlist/${productId}`);
      set({ items: response.data.data });
      toast.success('Added to wishlist');
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add to wishlist');
      return { success: false };
    }
  },

  removeFromWishlist: async (productId) => {
    try {
      const response = await api.delete(`/wishlist/${productId}`);
      set({ items: response.data.data });
      toast.success('Removed from wishlist');
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  },

  isInWishlist: (productId) => {
    const items = get().items;
    return items.some(item => item.product?._id === productId);
  },

  clearWishlist: async () => {
    try {
      await api.delete('/wishlist');
      set({ items: [] });
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  }
}));

export default useWishlistStore;
