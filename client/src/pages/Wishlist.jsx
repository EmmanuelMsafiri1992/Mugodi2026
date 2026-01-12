import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import useWishlistStore from '../store/wishlistStore';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';
import Spinner from '../components/ui/Spinner';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

const Wishlist = () => {
  const { isAuthenticated } = useAuthStore();
  const { items, isLoading, fetchWishlist, removeFromWishlist } = useWishlistStore();
  const { addToCart } = useCartStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    }
  }, [isAuthenticated]);

  const handleAddToCart = async (productId) => {
    const result = await addToCart(productId, 1);
    if (result.success) {
      await removeFromWishlist(productId);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container-custom py-20 text-center">
        <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
        <p className="text-gray-500 mb-6">Please login to view your wishlist</p>
        <Link to="/login" className="btn btn-primary">
          Login
        </Link>
      </div>
    );
  }

  if (isLoading && items.length === 0) {
    return <Spinner className="py-20" />;
  }

  if (items.length === 0) {
    return (
      <div className="container-custom py-20 text-center">
        <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
        <p className="text-gray-500 mb-6">Save items you love by clicking the heart icon</p>
        <Link to="/products" className="btn btn-primary">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Wishlist</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item) => {
          const product = item.product;
          if (!product) return null;

          const discountPercent = product.discountPercent ||
            (product.discountPrice && product.price > product.discountPrice
              ? Math.round((1 - product.discountPrice / product.price) * 100)
              : 0);
          const finalPrice = product.discountPrice || product.price;

          return (
            <div key={item._id} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <Link to={`/products/${product._id}`} className="block">
                <div className="relative aspect-square bg-gray-100">
                  <img
                    src={product.thumbnail}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  {discountPercent > 0 && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                      -{discountPercent}%
                    </span>
                  )}
                </div>
              </Link>

              <div className="p-4">
                <Link
                  to={`/products/${product._id}`}
                  className="font-medium text-gray-900 hover:text-primary-600 line-clamp-2"
                >
                  {product.name}
                </Link>

                <div className="mt-2 flex items-baseline space-x-2">
                  <span className="text-lg font-bold text-primary-600">
                    MWK {finalPrice.toLocaleString()}
                  </span>
                  {discountPercent > 0 && (
                    <span className="text-sm text-gray-400 line-through">
                      MWK {product.price.toLocaleString()}
                    </span>
                  )}
                </div>

                <div className="mt-4 flex space-x-2">
                  <Button
                    onClick={() => handleAddToCart(product._id)}
                    disabled={product.stock === 0}
                    className="flex-1"
                    size="sm"
                  >
                    <ShoppingCart className="w-4 h-4 mr-1" />
                    Add to Cart
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFromWishlist(product._id)}
                    className="text-red-500 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Wishlist;
