import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '../ProductCard';

const ProductSection = ({
  title,
  products = [],
  viewAllLink = '/products',
  showViewAll = true,
  isScrollable = true,
  bgColor = 'bg-white'
}) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (products.length === 0) return null;

  return (
    <section className={`py-8 ${bgColor}`}>
      <div className="container-custom">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">{title}</h2>
          <div className="flex items-center gap-4">
            {isScrollable && (
              <div className="hidden md:flex items-center gap-2">
                <button
                  onClick={() => scroll('left')}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-primary-500 hover:text-primary-500 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => scroll('right')}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-primary-500 hover:text-primary-500 transition-colors bg-white"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
            {showViewAll && (
              <Link
                to={viewAllLink}
                className="text-primary-500 hover:text-primary-600 font-medium text-sm md:text-base transition-colors"
              >
                View All
              </Link>
            )}
          </div>
        </div>

        {/* Products */}
        {isScrollable ? (
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
          >
            {products.map((product) => (
              <div key={product._id} className="flex-shrink-0 w-[200px] md:w-[220px]">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductSection;
