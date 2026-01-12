import { create } from 'zustand';
import api from '../services/api';
import toast from 'react-hot-toast';

const useAdminStore = create((set, get) => ({
  // Dashboard stats
  stats: null,
  isLoadingStats: false,

  // Users
  users: [],
  totalUsers: 0,
  usersPage: 1,
  isLoadingUsers: false,

  // Products
  products: [],
  totalProducts: 0,
  productsPage: 1,
  isLoadingProducts: false,

  // Categories
  categories: [],
  isLoadingCategories: false,

  // Orders
  orders: [],
  totalOrders: 0,
  ordersPage: 1,
  isLoadingOrders: false,

  // Banners
  banners: [],
  isLoadingBanners: false,

  // Coupons
  coupons: [],
  isLoadingCoupons: false,

  // Fetch dashboard stats
  fetchStats: async () => {
    set({ isLoadingStats: true });
    try {
      const { data } = await api.get('/admin/stats');
      set({ stats: data.data, isLoadingStats: false });
    } catch (error) {
      set({ isLoadingStats: false });
      toast.error('Failed to fetch stats');
    }
  },

  // Users CRUD
  fetchUsers: async (params = {}) => {
    set({ isLoadingUsers: true });
    try {
      const { data } = await api.get('/admin/users', { params });
      set({
        users: data.data,
        totalUsers: data.total,
        usersPage: data.page,
        isLoadingUsers: false
      });
    } catch (error) {
      set({ isLoadingUsers: false });
      toast.error('Failed to fetch users');
    }
  },

  updateUser: async (userId, userData) => {
    try {
      const { data } = await api.put(`/admin/users/${userId}`, userData);
      set(state => ({
        users: state.users.map(u => u._id === userId ? data.data : u)
      }));
      toast.success('User updated successfully');
      return data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update user');
      throw error;
    }
  },

  deleteUser: async (userId) => {
    try {
      await api.delete(`/admin/users/${userId}`);
      set(state => ({
        users: state.users.filter(u => u._id !== userId),
        totalUsers: state.totalUsers - 1
      }));
      toast.success('User deleted successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete user');
      throw error;
    }
  },

  // Products CRUD
  fetchAdminProducts: async (params = {}) => {
    set({ isLoadingProducts: true });
    try {
      const { data } = await api.get('/products', { params: { ...params, limit: 20 } });
      set({
        products: data.data,
        totalProducts: data.total,
        productsPage: data.page,
        isLoadingProducts: false
      });
    } catch (error) {
      set({ isLoadingProducts: false });
      toast.error('Failed to fetch products');
    }
  },

  createProduct: async (productData) => {
    try {
      const { data } = await api.post('/products', productData);
      set(state => ({
        products: [data.data, ...state.products],
        totalProducts: state.totalProducts + 1
      }));
      toast.success('Product created successfully');
      return data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create product');
      throw error;
    }
  },

  updateProduct: async (productId, productData) => {
    try {
      const { data } = await api.put(`/products/${productId}`, productData);
      set(state => ({
        products: state.products.map(p => p._id === productId ? data.data : p)
      }));
      toast.success('Product updated successfully');
      return data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update product');
      throw error;
    }
  },

  deleteProduct: async (productId) => {
    try {
      await api.delete(`/products/${productId}`);
      set(state => ({
        products: state.products.filter(p => p._id !== productId),
        totalProducts: state.totalProducts - 1
      }));
      toast.success('Product deleted successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete product');
      throw error;
    }
  },

  // Categories CRUD
  fetchAdminCategories: async () => {
    set({ isLoadingCategories: true });
    try {
      const { data } = await api.get('/categories');
      set({ categories: data.data, isLoadingCategories: false });
    } catch (error) {
      set({ isLoadingCategories: false });
      toast.error('Failed to fetch categories');
    }
  },

  createCategory: async (categoryData) => {
    try {
      const { data } = await api.post('/categories', categoryData);
      set(state => ({
        categories: [...state.categories, data.data]
      }));
      toast.success('Category created successfully');
      return data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create category');
      throw error;
    }
  },

  updateCategory: async (categoryId, categoryData) => {
    try {
      const { data } = await api.put(`/categories/${categoryId}`, categoryData);
      set(state => ({
        categories: state.categories.map(c => c._id === categoryId ? data.data : c)
      }));
      toast.success('Category updated successfully');
      return data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update category');
      throw error;
    }
  },

  deleteCategory: async (categoryId) => {
    try {
      await api.delete(`/categories/${categoryId}`);
      set(state => ({
        categories: state.categories.filter(c => c._id !== categoryId)
      }));
      toast.success('Category deleted successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete category');
      throw error;
    }
  },

  // Orders
  fetchAdminOrders: async (params = {}) => {
    set({ isLoadingOrders: true });
    try {
      const { data } = await api.get('/orders/admin/all', { params });
      set({
        orders: data.data,
        totalOrders: data.total,
        ordersPage: data.currentPage,
        isLoadingOrders: false
      });
    } catch (error) {
      set({ isLoadingOrders: false });
      toast.error('Failed to fetch orders');
    }
  },

  updateOrderStatus: async (orderId, status) => {
    try {
      const { data } = await api.put(`/orders/admin/${orderId}/status`, { status });
      set(state => ({
        orders: state.orders.map(o => o._id === orderId ? data.data : o)
      }));
      toast.success('Order status updated');
      return data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update order');
      throw error;
    }
  },

  // Banners CRUD
  fetchBanners: async () => {
    set({ isLoadingBanners: true });
    try {
      const { data } = await api.get('/banners/admin/all');
      set({ banners: data.data, isLoadingBanners: false });
    } catch (error) {
      set({ isLoadingBanners: false });
      toast.error('Failed to fetch banners');
    }
  },

  createBanner: async (bannerData) => {
    try {
      const { data } = await api.post('/banners', bannerData);
      set(state => ({
        banners: [...state.banners, data.data]
      }));
      toast.success('Banner created successfully');
      return data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create banner');
      throw error;
    }
  },

  updateBanner: async (bannerId, bannerData) => {
    try {
      const { data } = await api.put(`/banners/${bannerId}`, bannerData);
      set(state => ({
        banners: state.banners.map(b => b._id === bannerId ? data.data : b)
      }));
      toast.success('Banner updated successfully');
      return data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update banner');
      throw error;
    }
  },

  deleteBanner: async (bannerId) => {
    try {
      await api.delete(`/banners/${bannerId}`);
      set(state => ({
        banners: state.banners.filter(b => b._id !== bannerId)
      }));
      toast.success('Banner deleted successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete banner');
      throw error;
    }
  },

  // Coupons CRUD
  fetchCoupons: async () => {
    set({ isLoadingCoupons: true });
    try {
      const { data } = await api.get('/coupons/admin/all');
      set({ coupons: data.data, isLoadingCoupons: false });
    } catch (error) {
      set({ isLoadingCoupons: false });
      toast.error('Failed to fetch coupons');
    }
  },

  createCoupon: async (couponData) => {
    try {
      const { data } = await api.post('/coupons', couponData);
      set(state => ({
        coupons: [...state.coupons, data.data]
      }));
      toast.success('Coupon created successfully');
      return data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create coupon');
      throw error;
    }
  },

  updateCoupon: async (couponId, couponData) => {
    try {
      const { data } = await api.put(`/coupons/${couponId}`, couponData);
      set(state => ({
        coupons: state.coupons.map(c => c._id === couponId ? data.data : c)
      }));
      toast.success('Coupon updated successfully');
      return data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update coupon');
      throw error;
    }
  },

  deleteCoupon: async (couponId) => {
    try {
      await api.delete(`/coupons/${couponId}`);
      set(state => ({
        coupons: state.coupons.filter(c => c._id !== couponId)
      }));
      toast.success('Coupon deleted successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete coupon');
      throw error;
    }
  }
}));

export default useAdminStore;
