import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ShoppingCart,
  Heart,
  Star,
  Minus,
  Plus,
  ChevronLeft,
  Truck,
  Shield,
  RotateCcw
} from 'lucide-react';
import useProductStore from '../store/productStore';
import useCartStore from '../store/cartStore';
import useWishlistStore from '../store/wishlistStore';
import useAuthStore from '../store/authStore';
import useCountryStore from '../store/countryStore';
import { getProductPrice, formatPrice, getDiscountPercent } from '../utils/currency';
import Spinner from '../components/ui/Spinner';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const { currentProduct, isLoading, fetchProductById } = useProductStore();
  const { addToCart, isLoading: cartLoading } = useCartStore();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();
  const { isAuthenticated } = useAuthStore();
  const { country } = useCountryStore();

  const product = currentProduct;
  const inWishlist = product ? isInWishlist(product._id) : false;

  useEffect(() => {
    fetchProductById(id);
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }
    await addToCart(product._id, quantity);
  };

  const handleWishlistToggle = async () => {
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

  if (isLoading) {
    return <Spinner className="py-20" />;
  }

  if (!product) {
    return (
      <div className="container-custom py-20 text-center">
        <p className="text-gray-500 text-lg">Product not found</p>
        <Link to="/products" className="text-primary-600 hover:underline mt-4 inline-block">
          Back to Products
        </Link>
      </div>
    );
  }

  const images = product.images?.length > 0 ? product.images : [product.thumbnail];
  const discountPercent = getDiscountPercent(product, country);
  const finalPrice = getProductPrice(product, 'finalPrice', country);
  const originalPrice = getProductPrice(product, 'price', country);

  return (
    <div className="container-custom py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm mb-6">
        <Link to="/" className="text-gray-500 hover:text-primary-600">Home</Link>
        <span className="text-gray-400">/</span>
        <Link to="/products" className="text-gray-500 hover:text-primary-600">Products</Link>
        <span className="text-gray-400">/</span>
        <span className="text-gray-900">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
            <img
              src={images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === index ? 'border-primary-500' : 'border-transparent'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-6">
          <div>
            <p className="text-sm text-primary-600 font-medium mb-2">{product.category?.name}</p>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.averageRating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="text-gray-600 ml-2">
                  {product.averageRating?.toFixed(1)} ({product.totalReviews} reviews)
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-baseline space-x-3">
            <span className="text-4xl font-bold text-primary-600">
              {formatPrice(finalPrice, country)}
            </span>
            {discountPercent > 0 && (
              <>
                <span className="text-xl text-gray-400 line-through">
                  {formatPrice(originalPrice, country)}
                </span>
                <span className="px-2 py-1 bg-red-100 text-red-600 text-sm font-semibold rounded">
                  -{discountPercent}%
                </span>
              </>
            )}
          </div>

          <p className="text-gray-600">{product.description}</p>

          <div className="flex items-center space-x-2 text-sm">
            <span className={`font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
            <span className="text-gray-400">|</span>
            <span className="text-gray-600">{product.unit}</span>
          </div>

          {product.stock > 0 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-gray-100 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="p-3 hover:bg-gray-100 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={handleWishlistToggle}
                  className={`p-3 rounded-lg border transition-colors ${
                    inWishlist
                      ? 'border-red-500 bg-red-50 text-red-500'
                      : 'border-gray-300 hover:border-red-500 hover:text-red-500'
                  }`}
                >
                  <Heart className={`w-6 h-6 ${inWishlist ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Total Price Display */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-600 font-medium">Total:</span>
                <span className="text-2xl font-bold text-primary-600">
                  {formatPrice(finalPrice * quantity, country)}
                </span>
              </div>

              <Button
                onClick={handleAddToCart}
                isLoading={cartLoading}
                className="w-full"
                size="lg"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart - {formatPrice(finalPrice * quantity, country)}
              </Button>
            </div>
          )}

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t">
            <div className="text-center">
              <Truck className="w-8 h-8 text-primary-600 mx-auto mb-2" />
              <p className="text-sm font-medium">Free Delivery</p>
              <p className="text-xs text-gray-500">On orders {formatPrice(country === 'ZA' ? 500 : 5000, country)}+</p>
            </div>
            <div className="text-center">
              <Shield className="w-8 h-8 text-primary-600 mx-auto mb-2" />
              <p className="text-sm font-medium">Fresh Guarantee</p>
              <p className="text-xs text-gray-500">100% quality</p>
            </div>
            <div className="text-center">
              <RotateCcw className="w-8 h-8 text-primary-600 mx-auto mb-2" />
              <p className="text-sm font-medium">Easy Returns</p>
              <p className="text-xs text-gray-500">24hr policy</p>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      {product.reviews?.length > 0 && (
        <div className="mt-12 pt-8 border-t">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>
          <div className="space-y-4">
            {product.reviews.slice(0, 5).map((review, index) => (
              <div key={index} className="bg-white p-4 rounded-lg border border-gray-100">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-medium">
                      {review.user?.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{review.user?.name || 'User'}</p>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                {review.comment && <p className="text-gray-600">{review.comment}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
