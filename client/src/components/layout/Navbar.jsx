import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ShoppingCart,
  Heart,
  User,
  Search,
  Menu,
  X,
  LogOut,
  Package,
  Wallet,
  Award,
  MapPin,
  ChevronDown,
  Moon,
  Sun,
  Globe,
  LayoutDashboard
} from 'lucide-react';
import useAuthStore from '../../store/authStore';
import useCartStore from '../../store/cartStore';
import useProductStore from '../../store/productStore';
import useThemeStore from '../../store/themeStore';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const categoriesRef = useRef(null);
  const profileRef = useRef(null);
  const languageRef = useRef(null);
  const navigate = useNavigate();

  const { isAuthenticated, user, logout } = useAuthStore();
  const { getItemCount } = useCartStore();
  const { categories } = useProductStore();
  const { isDarkMode, toggleDarkMode } = useThemeStore();
  const cartCount = getItemCount();

  const currentLanguage = i18n.language === 'ny' ? 'Chichewa' : 'English';
  const currentLangCode = i18n.language === 'ny' ? 'NY' : 'EN';

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoriesRef.current && !categoriesRef.current.contains(event.target)) {
        setIsCategoriesOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (languageRef.current && !languageRef.current.contains(event.target)) {
        setIsLanguageOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    navigate('/');
  };

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    setIsLanguageOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full max-w-full overflow-x-hidden">
      {/* Top Utility Bar - Hidden on mobile */}
      <div className="hidden sm:block bg-white border-b border-gray-100 dark:bg-gray-800 dark:border-gray-700">
        <div className="container-custom">
          <div className="flex items-center justify-end h-10 space-x-4 text-sm">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              <span>{isDarkMode ? t('common.lightMode') : t('common.darkMode')}</span>
              <div className={`relative w-11 h-6 rounded-full transition-colors ${isDarkMode ? 'bg-primary-500' : 'bg-gray-300'}`}>
                <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${isDarkMode ? 'translate-x-5' : ''}`} />
              </div>
            </button>

            {/* Language Selector */}
            <div className="relative" ref={languageRef}>
              <button
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              >
                <Globe className="w-4 h-4" />
                <span>{currentLangCode}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isLanguageOpen ? 'rotate-180' : ''}`} />
              </button>

              {isLanguageOpen && (
                <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50 dark:bg-gray-800 dark:border-gray-700">
                  <button
                    onClick={() => changeLanguage('en')}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2 dark:hover:bg-gray-700 ${i18n.language === 'en' ? 'text-primary-500 bg-primary-50 dark:bg-primary-900/30' : 'text-gray-700 dark:text-gray-200'}`}
                  >
                    <span className="text-lg">🇬🇧</span>
                    <span>English</span>
                  </button>
                  <button
                    onClick={() => changeLanguage('ny')}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2 dark:hover:bg-gray-700 ${i18n.language === 'ny' ? 'text-primary-500 bg-primary-50 dark:bg-primary-900/30' : 'text-gray-700 dark:text-gray-200'}`}
                  >
                    <span className="text-lg">🇲🇼</span>
                    <span>Chichewa</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="bg-white shadow-sm dark:bg-gray-900 dark:shadow-gray-800 w-full">
        <div className="container-custom">
          <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center flex-shrink-0">
              <img
                src="/mugodi-logo.png"
                alt="Mugodi"
                className="h-8 sm:h-12 w-auto object-contain"
              />
            </Link>

            {/* Navigation Links - Desktop */}
            <nav className="hidden lg:flex items-center space-x-6">
              <Link
                to="/"
                className="text-gray-700 hover:text-primary-500 font-medium transition-colors dark:text-gray-200 dark:hover:text-primary-400"
              >
                {t('nav.home')}
              </Link>

              {/* Categories Dropdown */}
              <div className="relative" ref={categoriesRef}>
                <button
                  onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                  className="flex items-center space-x-1 text-gray-700 hover:text-primary-500 font-medium transition-colors dark:text-gray-200 dark:hover:text-primary-400"
                >
                  <span>{t('nav.categories')}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isCategoriesOpen ? 'rotate-180' : ''}`} />
                </button>

                {isCategoriesOpen && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-100 py-2 animate-fade-in z-50 dark:bg-gray-800 dark:border-gray-700">
                    {categories.map((category) => (
                      <Link
                        key={category._id}
                        to={`/products?category=${category._id}`}
                        onClick={() => setIsCategoriesOpen(false)}
                        className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 text-gray-700 dark:text-gray-200 dark:hover:bg-gray-700"
                      >
                        <span className="text-lg">{category.icon}</span>
                        <span className="text-sm">{category.name}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </nav>

            {/* Search Bar - Desktop */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder={t('common.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-12 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white transition-all dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 dark:focus:bg-gray-700"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Right Icons */}
            <div className="flex items-center space-x-2">
              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="hidden sm:flex p-2 text-gray-600 hover:text-primary-500 transition-colors dark:text-gray-300 dark:hover:text-primary-400"
                title={t('common.wishlist')}
              >
                <Heart className="w-6 h-6" />
              </Link>

              {/* Cart */}
              <Link
                to="/cart"
                className="relative p-2 text-gray-600 hover:text-primary-500 transition-colors dark:text-gray-300 dark:hover:text-primary-400"
                title={t('common.cart')}
              >
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </Link>

              {/* User Profile */}
              {isAuthenticated ? (
                <div className="relative hidden sm:block" ref={profileRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="p-2 text-gray-600 hover:text-primary-500 transition-colors dark:text-gray-300 dark:hover:text-primary-400"
                  >
                    <User className="w-6 h-6" />
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-2 animate-fade-in z-50 dark:bg-gray-800 dark:border-gray-700">
                      <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                        <p className="font-medium text-gray-900 dark:text-white">{user?.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
                      </div>
                      {(user?.role === 'admin' || user?.role === 'team') && (
                        <Link
                          to="/admin"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-primary-600 dark:text-primary-400 font-medium"
                        >
                          <LayoutDashboard className="w-5 h-5" />
                          <span>Admin Dashboard</span>
                        </Link>
                      )}
                      <Link
                        to="/profile"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-200"
                      >
                        <User className="w-5 h-5 text-gray-400" />
                        <span>{t('profile.title')}</span>
                      </Link>
                      <Link
                        to="/orders"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-200"
                      >
                        <Package className="w-5 h-5 text-gray-400" />
                        <span>{t('profile.orders')}</span>
                      </Link>
                      <Link
                        to="/addresses"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-200"
                      >
                        <MapPin className="w-5 h-5 text-gray-400" />
                        <span>{t('profile.addresses')}</span>
                      </Link>
                      <Link
                        to="/wallet"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-200"
                      >
                        <Wallet className="w-5 h-5 text-gray-400" />
                        <span>{t('profile.wallet')}</span>
                      </Link>
                      <Link
                        to="/loyalty"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-200"
                      >
                        <Award className="w-5 h-5 text-gray-400" />
                        <span>{t('profile.loyaltyPoints')}</span>
                      </Link>
                      <hr className="my-2 dark:border-gray-700" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 w-full text-red-600 dark:hover:bg-gray-700 dark:text-red-400"
                      >
                        <LogOut className="w-5 h-5" />
                        <span>{t('common.logout')}</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="hidden sm:flex p-2 text-gray-600 hover:text-primary-500 transition-colors dark:text-gray-300 dark:hover:text-primary-400"
                >
                  <User className="w-6 h-6" />
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-gray-600 hover:text-primary-500 transition-colors dark:text-gray-300 dark:hover:text-primary-400"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="md:hidden pb-3">
            <div className="relative">
              <input
                type="text"
                placeholder={t('common.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-12 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-primary-500 text-white rounded-md"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="bg-white border-t animate-slide-down shadow-lg dark:bg-gray-900 dark:border-gray-700 w-full max-w-full overflow-x-hidden">
          <nav className="container-custom py-4 space-y-2 overflow-x-hidden">
            {/* Language Selector in Mobile */}
            <div className="px-4 py-2 mb-2 bg-gray-50 rounded-lg dark:bg-gray-800">
              <p className="text-xs font-medium text-gray-500 mb-2 dark:text-gray-400">{t('common.language')}</p>
              <div className="flex space-x-2">
                <button
                  onClick={() => changeLanguage('en')}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium ${i18n.language === 'en' ? 'bg-primary-500 text-white' : 'bg-white border border-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200'}`}
                >
                  🇬🇧 English
                </button>
                <button
                  onClick={() => changeLanguage('ny')}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium ${i18n.language === 'ny' ? 'bg-primary-500 text-white' : 'bg-white border border-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200'}`}
                >
                  🇲🇼 Chichewa
                </button>
              </div>
            </div>

            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className="block px-4 py-3 rounded-lg hover:bg-gray-50 font-medium dark:text-gray-200 dark:hover:bg-gray-800"
            >
              {t('nav.home')}
            </Link>

            {/* Categories in mobile */}
            <div className="px-4 py-2">
              <p className="text-sm font-medium text-gray-500 mb-2 dark:text-gray-400">{t('nav.categories')}</p>
              <div className="grid grid-cols-2 gap-2">
                {categories.slice(0, 8).map((category) => (
                  <Link
                    key={category._id}
                    to={`/products?category=${category._id}`}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800"
                  >
                    <span>{category.icon}</span>
                    <span className="text-xs">{category.name.split(' ')[0]}</span>
                  </Link>
                ))}
              </div>
            </div>

            <hr className="my-2 dark:border-gray-700" />

            <Link
              to="/cart"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              <ShoppingCart className="w-5 h-5 text-gray-400" />
              <span>{t('common.cart')}</span>
              {cartCount > 0 && (
                <span className="ml-auto bg-primary-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
            <Link
              to="/wishlist"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              <Heart className="w-5 h-5 text-gray-400" />
              <span>{t('common.wishlist')}</span>
            </Link>
            {isAuthenticated ? (
              <>
                {(user?.role === 'admin' || user?.role === 'team') && (
                  <Link
                    to="/admin"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 font-medium"
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    <span>Admin Dashboard</span>
                  </Link>
                )}
                <Link
                  to="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                  <User className="w-5 h-5 text-gray-400" />
                  <span>{t('common.profile')}</span>
                </Link>
                <Link
                  to="/orders"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                  <Package className="w-5 h-5 text-gray-400" />
                  <span>{t('profile.orders')}</span>
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-50 w-full text-red-600 dark:hover:bg-gray-800 dark:text-red-400"
                >
                  <LogOut className="w-5 h-5" />
                  <span>{t('common.logout')}</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-primary-500 text-white"
              >
                <User className="w-5 h-5" />
                <span>{t('common.login')} / {t('common.register')}</span>
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
