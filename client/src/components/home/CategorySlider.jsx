import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Category images mapping - Malawian Legumes
const categoryImages = {
  // Nandolo (Pigeon Peas)
  'Nandolo': 'https://images.pexels.com/photos/4110256/pexels-photo-4110256.jpeg?w=200',
  'Pigeon Peas': 'https://images.pexels.com/photos/4110256/pexels-photo-4110256.jpeg?w=200',

  // Nyemba (Cowpeas)
  'Nyemba': 'https://images.pexels.com/photos/4110251/pexels-photo-4110251.jpeg?w=200',
  'Cowpeas': 'https://images.pexels.com/photos/4110251/pexels-photo-4110251.jpeg?w=200',

  // Mtedza (Groundnuts)
  'Mtedza': 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?w=200',
  'Groundnuts': 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?w=200',

  // Nzama (Bambara Nuts)
  'Nzama': 'https://images.pexels.com/photos/4110476/pexels-photo-4110476.jpeg?w=200',
  'Bambara': 'https://images.pexels.com/photos/4110476/pexels-photo-4110476.jpeg?w=200',

  // Soya (Soybeans)
  'Soya': 'https://images.pexels.com/photos/4110255/pexels-photo-4110255.jpeg?w=200',
  'Soybeans': 'https://images.pexels.com/photos/4110255/pexels-photo-4110255.jpeg?w=200',

  // Nyemba Zazikulu (Beans)
  'Beans': 'https://images.pexels.com/photos/4110252/pexels-photo-4110252.jpeg?w=200',
  'Nyemba Zazikulu': 'https://images.pexels.com/photos/4110252/pexels-photo-4110252.jpeg?w=200',

  // Khobwe (Processed)
  'Khobwe': 'https://images.pexels.com/photos/5419229/pexels-photo-5419229.jpeg?w=200',
  'Processed': 'https://images.pexels.com/photos/5419229/pexels-photo-5419229.jpeg?w=200',

  // Ufa wa Nyemba (Legume Flour)
  'Ufa': 'https://images.pexels.com/photos/5765/flour-powder-wheat-jar.jpg?w=200',
  'Flour': 'https://images.pexels.com/photos/5765/flour-powder-wheat-jar.jpg?w=200',
  'Legume Flour': 'https://images.pexels.com/photos/5765/flour-powder-wheat-jar.jpg?w=200',
};

const getCategoryImage = (categoryName) => {
  // Check for exact match first
  if (categoryImages[categoryName]) {
    return categoryImages[categoryName];
  }

  // Check if name contains any of our keywords
  const lowerName = categoryName.toLowerCase();
  for (const [key, url] of Object.entries(categoryImages)) {
    if (lowerName.includes(key.toLowerCase())) {
      return url;
    }
  }

  // Default image
  return 'https://images.pexels.com/photos/4110256/pexels-photo-4110256.jpeg?w=200';
};

const CategorySlider = ({ categories = [], title = "Popular Categories" }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (categories.length === 0) return null;

  return (
    <div className="py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">{title}</h2>
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={() => scroll('left')}
            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-primary-500 hover:text-primary-500 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-primary-500 hover:text-primary-500 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Categories Scroll Container */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4"
      >
        {categories.map((category) => (
          <Link
            key={category._id}
            to={`/products?category=${category._id}`}
            className="flex flex-col items-center flex-shrink-0 group"
          >
            {/* Circular Image */}
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-2 border-transparent group-hover:border-primary-500 transition-all duration-300 shadow-md group-hover:shadow-lg">
              <img
                src={getCategoryImage(category.name)}
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                onError={(e) => {
                  e.target.src = 'https://images.pexels.com/photos/4110256/pexels-photo-4110256.jpeg?w=200';
                }}
              />
            </div>
            {/* Category Name - Show first word only for cleaner look */}
            <span className="mt-3 text-sm md:text-base text-gray-700 text-center font-medium group-hover:text-primary-500 transition-colors max-w-[100px] truncate">
              {category.name.split(' ')[0]}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategorySlider;
