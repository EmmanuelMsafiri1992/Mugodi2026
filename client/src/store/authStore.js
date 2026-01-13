import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      // Impersonation state
      isImpersonating: false,
      originalAdmin: null,
      impersonatedUser: null,
      adminToken: null, // Store admin token to restore later

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post('/auth/login', { email, password });
          const { token, user } = response.data;

          localStorage.setItem('token', token);
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false
          });

          return { success: true };
        } catch (error) {
          const message = error.response?.data?.message || 'Login failed';
          set({ error: message, isLoading: false });
          return { success: false, message };
        }
      },

      register: async (name, email, password, phone, referralCode) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post('/auth/register', {
            name,
            email,
            password,
            phone,
            referralCode
          });
          const { token, user } = response.data;

          localStorage.setItem('token', token);
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false
          });

          return { success: true };
        } catch (error) {
          const message = error.response?.data?.message || error.response?.data?.errors?.[0] || 'Registration failed';
          set({ error: message, isLoading: false });
          return { success: false, message };
        }
      },

      logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('adminToken');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
          isImpersonating: false,
          originalAdmin: null,
          impersonatedUser: null,
          adminToken: null
        });
      },

      checkAuth: async () => {
        const token = localStorage.getItem('token');
        if (!token) {
          set({ isAuthenticated: false, user: null });
          return;
        }

        try {
          const response = await api.get('/auth/me');
          set({
            user: response.data.user,
            token,
            isAuthenticated: true
          });
        } catch (error) {
          localStorage.removeItem('token');
          set({
            user: null,
            token: null,
            isAuthenticated: false
          });
        }
      },

      updateProfile: async (data) => {
        set({ isLoading: true });
        try {
          const response = await api.put('/auth/profile', data);
          set({ user: response.data.user, isLoading: false });
          return { success: true };
        } catch (error) {
          set({ isLoading: false });
          return { success: false, message: error.response?.data?.message };
        }
      },

      clearError: () => set({ error: null }),

      // Impersonation functions
      impersonateUser: async (userId) => {
        set({ isLoading: true, error: null });
        try {
          const currentToken = get().token;
          const currentUser = get().user;

          const response = await api.post(`/auth/impersonate/${userId}`);
          const { token, user, impersonation } = response.data;

          // Store current admin token before switching
          localStorage.setItem('adminToken', currentToken);
          localStorage.setItem('token', token);

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            isImpersonating: true,
            originalAdmin: impersonation.originalAdmin,
            impersonatedUser: impersonation.targetUser,
            adminToken: currentToken
          });

          return { success: true, message: response.data.message };
        } catch (error) {
          const message = error.response?.data?.message || 'Failed to impersonate user';
          set({ error: message, isLoading: false });
          return { success: false, message };
        }
      },

      stopImpersonation: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post('/auth/stop-impersonation');
          const { token, user } = response.data;

          // Clear admin token from storage
          localStorage.removeItem('adminToken');
          localStorage.setItem('token', token);

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            isImpersonating: false,
            originalAdmin: null,
            impersonatedUser: null,
            adminToken: null
          });

          return { success: true, message: response.data.message };
        } catch (error) {
          // If stop-impersonation fails, try to restore from stored admin token
          const adminToken = localStorage.getItem('adminToken');
          if (adminToken) {
            localStorage.setItem('token', adminToken);
            localStorage.removeItem('adminToken');
            // Re-check auth to get admin user
            await get().checkAuth();
            set({
              isImpersonating: false,
              originalAdmin: null,
              impersonatedUser: null,
              adminToken: null
            });
            return { success: true, message: 'Returned to admin account' };
          }

          const message = error.response?.data?.message || 'Failed to stop impersonation';
          set({ error: message, isLoading: false });
          return { success: false, message };
        }
      },

      checkImpersonationStatus: async () => {
        try {
          const response = await api.get('/auth/impersonation-status');
          if (response.data.isImpersonating) {
            set({
              isImpersonating: true,
              originalAdmin: response.data.originalAdmin,
              impersonatedUser: response.data.targetUser
            });
          } else {
            set({
              isImpersonating: false,
              originalAdmin: null,
              impersonatedUser: null
            });
          }
        } catch (error) {
          set({
            isImpersonating: false,
            originalAdmin: null,
            impersonatedUser: null
          });
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        isImpersonating: state.isImpersonating,
        originalAdmin: state.originalAdmin,
        impersonatedUser: state.impersonatedUser,
        adminToken: state.adminToken
      })
    }
  )
);

export default useAuthStore;
