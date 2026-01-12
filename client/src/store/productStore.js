import { create } from 'zustand';
import api from '../services/api';

const useProductStore = create((set, get) => ({
  products: [],
  featuredProducts: [],
  dailyNeeds: [],
  flashDeals: [],
  categories: [],
  banners: [],
  currentProduct: null,
  isLoading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    total: 0
  },

  fetchProducts: async (params = {}) => {
    set({ isLoading: true });
    try {
      const response = await api.get('/products', { params });
      set({
        products: response.data.data,
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

  fetchFeaturedProducts: async () => {
    try {
      const response = await api.get('/products/featured');
      set({ featuredProducts: response.data.data });
    } catch (error) {
      console.error('Failed to fetch featured products');
    }
  },

  fetchDailyNeeds: async () => {
    try {
      const response = await api.get('/products/daily-needs');
      set({ dailyNeeds: response.data.data });
    } catch (error) {
      console.error('Failed to fetch daily needs');
    }
  },

  fetchFlashDeals: async () => {
    try {
      const response = await api.get('/products/flash-deals');
      set({ flashDeals: response.data.data });
    } catch (error) {
      console.error('Failed to fetch flash deals');
    }
  },

  fetchProductById: async (id) => {
    set({ isLoading: true, currentProduct: null });
    try {
      const response = await api.get(`/products/${id}`);
      set({ currentProduct: response.data.data, isLoading: false });
      return response.data.data;
    } catch (error) {
      set({ error: error.response?.data?.message, isLoading: false });
      return null;
    }
  },

  searchProducts: async (query, params = {}) => {
    set({ isLoading: true });
    try {
      const response = await api.get('/products/search', {
        params: { q: query, ...params }
      });
      set({
        products: response.data.data,
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

  fetchCategories: async () => {
    try {
      const response = await api.get('/categories', { params: { parent: 'null' } });
      set({ categories: response.data.data });
    } catch (error) {
      console.error('Failed to fetch categories');
    }
  },

  fetchBanners: async () => {
    try {
      const response = await api.get('/banners');
      set({ banners: response.data.data });
    } catch (error) {
      console.error('Failed to fetch banners');
    }
  },

  addReview: async (productId, rating, comment) => {
    try {
      const response = await api.post(`/products/${productId}/reviews`, {
        rating,
        comment
      });
      set({ currentProduct: response.data.data });
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message };
    }
  },

  clearCurrentProduct: () => set({ currentProduct: null })
}));

export default useProductStore;
