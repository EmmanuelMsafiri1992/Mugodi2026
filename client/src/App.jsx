import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import useAuthStore from './store/authStore';
import useCartStore from './store/cartStore';
import useWishlistStore from './store/wishlistStore';
import useThemeStore from './store/themeStore';

// Layout
import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';
import AdminLayout from './components/admin/AdminLayout';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import Profile from './pages/Profile';
import Addresses from './pages/Addresses';
import Wishlist from './pages/Wishlist';
import Wallet from './pages/Wallet';
import Loyalty from './pages/Loyalty';
import Coupons from './pages/Coupons';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import AdminCategories from './pages/admin/Categories';
import AdminOrders from './pages/admin/Orders';
import AdminUsers from './pages/admin/Users';
import AdminBanners from './pages/admin/Banners';
import AdminCoupons from './pages/admin/Coupons';
import AdminSettings from './pages/admin/Settings';
import AdminReports from './pages/admin/Reports';
import AdminNotifications from './pages/admin/Notifications';
import AdminReviews from './pages/admin/Reviews';

// Admin Inventory Pages
import InventoryDashboard from './pages/admin/inventory/InventoryDashboard';
import StockItems from './pages/admin/inventory/StockItems';
import Purchases from './pages/admin/inventory/Purchases';
import Packaging from './pages/admin/inventory/Packaging';
import Suppliers from './pages/admin/inventory/Suppliers';
import InventoryReports from './pages/admin/inventory/InventoryReports';

// 404 Page
const NotFound = () => (
  <div className="container-custom py-20 text-center">
    <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
    <p className="text-xl text-gray-600 mb-6">Page not found</p>
    <a href="/" className="btn btn-primary">Go Home</a>
  </div>
);

function App() {
  const { checkAuth, isAuthenticated } = useAuthStore();
  const { fetchCart } = useCartStore();
  const { fetchWishlist } = useWishlistStore();
  const { initializeTheme } = useThemeStore();

  useEffect(() => {
    checkAuth();
    initializeTheme();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
      fetchWishlist();
    }
  }, [isAuthenticated]);

  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/coupons" element={<Coupons />} />

        {/* Protected Routes */}
        <Route path="/checkout" element={
          <ProtectedRoute><Checkout /></ProtectedRoute>
        } />
        <Route path="/orders" element={
          <ProtectedRoute><Orders /></ProtectedRoute>
        } />
        <Route path="/orders/:id" element={
          <ProtectedRoute><OrderDetail /></ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute><Profile /></ProtectedRoute>
        } />
        <Route path="/addresses" element={
          <ProtectedRoute><Addresses /></ProtectedRoute>
        } />
        <Route path="/wallet" element={
          <ProtectedRoute><Wallet /></ProtectedRoute>
        } />
        <Route path="/loyalty" element={
          <ProtectedRoute><Loyalty /></ProtectedRoute>
        } />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={
        <AdminRoute>
          <AdminLayout />
        </AdminRoute>
      }>
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="banners" element={<AdminBanners />} />
        <Route path="coupons" element={<AdminCoupons />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="notifications" element={<AdminNotifications />} />
        <Route path="reviews" element={<AdminReviews />} />
        {/* Inventory Routes */}
        <Route path="inventory" element={<InventoryDashboard />} />
        <Route path="inventory/items" element={<StockItems />} />
        <Route path="inventory/purchases" element={<Purchases />} />
        <Route path="inventory/packaging" element={<Packaging />} />
        <Route path="inventory/suppliers" element={<Suppliers />} />
        <Route path="inventory/reports" element={<InventoryReports />} />
      </Route>
    </Routes>
  );
}

export default App;
