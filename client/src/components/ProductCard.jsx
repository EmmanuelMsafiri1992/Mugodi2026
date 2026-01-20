import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import useCartStore from '../store/cartStore';
import useWishlistStore from '../store/wishlistStore';
import useAuthStore from '../store/authStore';
import useCountryStore from '../store/countryStore';
import { getProductPrice, formatPrice, getDiscountPercent, getCurrencySymbol } from '../utils/currency';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { addToCart, isLoading } = useCartStore();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();
  const { isAuthenticated } = useAuthStore();
  const { country } = useCountryStore();

  const inWishlist = isInWishlist(product._id);
  const currencySymbol = getCurrencySymbol(country);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }

    await addToCart(product._id, 1);
  };

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error('Please login to add items to wishlist');
      return;
    }

    if (inWishlist) {
      await removeFromWishlist(product._id);
    } else {
      await addToWishlist(product._id);
    }
  };

  const discountPercent = getDiscountPercent(product, country);
  const finalPrice = getProductPrice(product, 'finalPrice', country);
  const originalPrice = getProductPrice(product, 'price', country);
  const hasDiscount = discountPercent > 0 || (originalPrice && finalPrice < originalPrice);
  const discountAmount = hasDiscount ? (originalPrice - finalPrice) : 0;

  // Format unit display
  const unitDisplay = product.unitValue && product.unit
    ? `${product.unitValue} ${product.unit}`
    : product.unit || '';

  return (
    <Link
      to={`/products/${product._id}`}
      className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-primary-100 transition-all duration-200 flex flex-col h-full"
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        {/* Discount Badge - Top Left */}
        {hasDiscount && (
          <span className="absolute top-3 left-3 bg-primary-500 text-white text-xs font-semibold px-2 py-1 rounded-md z-10">
            {discountPercent > 0 ? `-${discountPercent}%` : `-${currencySymbol} ${discountAmount.toLocaleString()}`}
          </span>
        )}

        {/* Action Buttons - Top Right */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
          {/* Wishlist Button */}
          <button
            onClick={handleWishlistToggle}
            className={`p-2 rounded-full shadow-md transition-all duration-200 ${
              inWishlist
                ? 'bg-red-50 text-red-500'
                : 'bg-white text-gray-400 hover:text-red-500'
            }`}
          >
            <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
          </button>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0 || isLoading}
            className={`p-2 rounded-full shadow-md transition-all duration-200 ${
              product.stock === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-400 hover:text-primary-500 hover:bg-primary-50'
            }`}
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>

        {/* Product Image */}
        <img
          src={product.thumbnail || product.images?.[0] || 'https://placehold.co/400x400/e2e8f0/64748b?text=No+Image'}
          alt={product.name}
          className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
        />

        {/* Out of Stock Overlay */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-gray-900 font-medium px-4 py-2 rounded-lg text-sm">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 flex flex-col flex-grow text-center">
        {/* Rating */}
        <div className="flex items-center justify-center gap-1 mb-2">
          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          <span className="text-sm font-medium text-gray-700">
            {product.averageRating?.toFixed(1) || '0.0'}
          </span>
        </div>

        {/* Product Name */}
        <h3 className="font-medium text-gray-900 line-clamp-2 mb-1 group-hover:text-primary-500 transition-colors text-sm md:text-base">
          {product.name}
        </h3>

        {/* Unit */}
        {unitDisplay && (
          <p className="text-xs text-gray-400 mb-2">{unitDisplay}</p>
        )}

        {/* Price */}
        <div className="mt-auto flex items-center justify-center gap-2">
          {hasDiscount && (
            <span className="text-sm text-gray-400 line-through">
              {formatPrice(originalPrice, country)}
            </span>
          )}
          <span className="text-base font-bold text-primary-500">
            {formatPrice(finalPrice, country)}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
