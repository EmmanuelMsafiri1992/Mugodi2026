import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const BannerCarousel = ({ banners = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Default banners if none provided
  const defaultBanners = [
    {
      _id: '1',
      title: 'Fresh & Healthy Vegetables',
      subtitle: 'Free Delivery on orders over $50',
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80',
      backgroundColor: '#4CAF50',
      link: '/products?category=fruits-vegetables'
    },
    {
      _id: '2',
      title: 'Fresh Groceries Delivered',
      subtitle: 'Stay home & call us for delivery',
      image: 'https://images.unsplash.com/photo-1543168256-418811576931?w=800&q=80',
      backgroundColor: '#8BC34A',
      link: '/products'
    },
    {
      _id: '3',
      title: 'Eat Healthy, Eat Organic',
      subtitle: '100% Organic Products',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80',
      backgroundColor: '#009688',
      link: '/products?featured=true'
    }
  ];

  const displayBanners = banners.length > 0 ? banners : defaultBanners;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % displayBanners.length);
  }, [displayBanners.length]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + displayBanners.length) % displayBanners.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  // Pause auto-play on hover
  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  if (displayBanners.length === 0) return null;

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Banner Container */}
      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {displayBanners.map((banner, index) => (
            <div
              key={banner._id || index}
              className="w-full flex-shrink-0"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-1">
                {/* Show current and next banners on desktop */}
                {displayBanners.map((b, i) => {
                  const adjustedIndex = (currentIndex + i) % displayBanners.length;
                  const currentBanner = displayBanners[adjustedIndex];
                  return (
                    <a
                      key={`${currentBanner._id}-${i}`}
                      href={currentBanner.link || '#'}
                      className={`relative rounded-2xl overflow-hidden h-48 md:h-64 group ${i > 0 ? 'hidden md:block' : ''}`}
                    >
                      <div
                        className="absolute inset-0 bg-gradient-to-r from-primary-600/90 to-primary-500/70"
                        style={{ backgroundColor: currentBanner.backgroundColor }}
                      />
                      <img
                        src={currentBanner.image}
                        alt={currentBanner.title}
                        className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60 group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="relative h-full flex flex-col justify-center p-6 text-white">
                        <h3 className="text-xl md:text-2xl font-bold mb-2 drop-shadow-lg">
                          {currentBanner.title}
                        </h3>
                        <p className="text-sm md:text-base opacity-90 drop-shadow">
                          {currentBanner.subtitle}
                        </p>
                        <button className="mt-4 px-4 py-2 bg-white text-primary-600 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors w-fit">
                          Order Now
                        </button>
                      </div>
                    </a>
                  );
                }).slice(0, 3)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows - Desktop only */}
      <button
        onClick={prevSlide}
        className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full items-center justify-center shadow-lg hover:bg-white transition-colors z-10"
      >
        <ChevronLeft className="w-6 h-6 text-gray-700" />
      </button>
      <button
        onClick={nextSlide}
        className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full items-center justify-center shadow-lg hover:bg-white transition-colors z-10"
      >
        <ChevronRight className="w-6 h-6 text-gray-700" />
      </button>

      {/* Dot Indicators */}
      <div className="flex justify-center gap-2 mt-4">
        {displayBanners.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              index === currentIndex
                ? 'bg-primary-500 w-6'
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default BannerCarousel;
