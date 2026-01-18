import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useProductStore from '../store/productStore';
import ProductCard from '../components/ProductCard';
import Spinner from '../components/ui/Spinner';
import BannerCarousel from '../components/home/BannerCarousel';
import CategorySlider from '../components/home/CategorySlider';
import ProductSection from '../components/home/ProductSection';

const Home = () => {
  const { t } = useTranslation();
  const {
    featuredProducts,
    dailyNeeds,
    categories,
    banners,
    products,
    isLoading,
    fetchFeaturedProducts,
    fetchDailyNeeds,
    fetchCategories,
    fetchBanners,
    fetchProducts
  } = useProductStore();

  const [showAllProducts, setShowAllProducts] = useState(false);

  useEffect(() => {
    fetchBanners();
    fetchCategories();
    fetchFeaturedProducts();
    fetchDailyNeeds();
    fetchProducts({ limit: 20 });
  }, []);

  // Combine products for "More Products" section
  const allProducts = products.length > 0 ? products : [...featuredProducts, ...dailyNeeds];
  const displayProducts = showAllProducts ? allProducts : allProducts.slice(0, 10);

  return (
    <div className="pb-8 w-full max-w-full overflow-x-hidden">
      {/* Banner Carousel */}
      <section className="container-custom pt-4 sm:pt-6">
        <BannerCarousel banners={banners} />
      </section>

      {/* Popular Categories */}
      <section className="container-custom">
        <CategorySlider categories={categories} title={t('home.popularCategories')} />
      </section>

      {/* Daily Needs - Horizontal Scroll */}
      <ProductSection
        title={t('home.dailyNeeds')}
        products={dailyNeeds}
        viewAllLink="/products?dailyNeed=true"
        isScrollable={true}
      />

      {/* Featured Products - Horizontal Scroll */}
      <ProductSection
        title={t('home.featuredProducts')}
        products={featuredProducts}
        viewAllLink="/products?featured=true"
        isScrollable={true}
        bgColor="bg-gray-50"
      />

      {/* All Products Grid */}
      <section className="py-8">
        <div className="container-custom">
          {isLoading ? (
            <Spinner className="py-12" />
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {displayProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* See More Button */}
              {!showAllProducts && allProducts.length > 10 && (
                <div className="flex justify-center mt-8">
                  <button
                    onClick={() => setShowAllProducts(true)}
                    className="px-8 py-3 border-2 border-primary-500 text-primary-500 rounded-lg font-medium hover:bg-primary-50 transition-colors"
                  >
                    {t('common.seeMore')}
                  </button>
                </div>
              )}

              {showAllProducts && (
                <div className="flex justify-center mt-8">
                  <Link
                    to="/products"
                    className="px-8 py-3 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors"
                  >
                    {t('common.viewAll')} {t('common.products')}
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
