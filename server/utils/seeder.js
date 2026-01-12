import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import Banner from '../models/Banner.js';
import Coupon from '../models/Coupon.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('DB Connection Error:', error);
    process.exit(1);
  }
};

// Malawian Legume Categories (with Chichewa names)
const categories = [
  {
    name: 'Nandolo (Pigeon Peas)',
    slug: 'nandolo-pigeon-peas',
    description: 'Traditional Malawian pigeon peas - Nandolo wabwino kwambiri',
    icon: '🫘',
    sortOrder: 1
  },
  {
    name: 'Nyemba (Cowpeas)',
    slug: 'nyemba-cowpeas',
    description: 'Nyemba za ku Malawi - Black-eyed peas and cowpeas',
    icon: '🟤',
    sortOrder: 2
  },
  {
    name: 'Mtedza (Groundnuts)',
    slug: 'mtedza-groundnuts',
    description: 'Mtedza wabwino wa ku Malawi - Premium Malawian groundnuts',
    icon: '🥜',
    sortOrder: 3
  },
  {
    name: 'Nzama (Bambara Nuts)',
    slug: 'nzama-bambara-nuts',
    description: 'Nzama za makolo - Traditional Bambara groundnuts',
    icon: '🌰',
    sortOrder: 4
  },
  {
    name: 'Soya (Soybeans)',
    slug: 'soya-soybeans',
    description: 'Soya yabwino - Nutritious Malawian soybeans',
    icon: '🫛',
    sortOrder: 5
  },
  {
    name: 'Nyemba Zazikulu (Beans)',
    slug: 'nyemba-zazikulu-beans',
    description: 'Sugar beans, kidney beans ndi mitundu ina ya nyemba',
    icon: '🫘',
    sortOrder: 6
  },
  {
    name: 'Khobwe (Processed)',
    slug: 'khobwe-processed',
    description: 'Zinthu zopangidwa ndi nyemba - Processed legume products',
    icon: '🥫',
    sortOrder: 7
  },
  {
    name: 'Ufa wa Nyemba (Legume Flour)',
    slug: 'ufa-wa-nyemba',
    description: 'Ufa wopangidwa ndi nyemba - Flour made from legumes',
    icon: '🌾',
    sortOrder: 8
  }
];

// Product images - using reliable, relevant images
const productImages = {
  // Pigeon Peas / Nandolo
  'nandolo': 'https://images.pexels.com/photos/4110256/pexels-photo-4110256.jpeg?w=400',
  'pigeon-peas': 'https://images.pexels.com/photos/4110256/pexels-photo-4110256.jpeg?w=400',

  // Cowpeas / Nyemba
  'nyemba': 'https://images.pexels.com/photos/4110251/pexels-photo-4110251.jpeg?w=400',
  'cowpeas': 'https://images.pexels.com/photos/4110251/pexels-photo-4110251.jpeg?w=400',
  'black-eyed': 'https://images.pexels.com/photos/4110251/pexels-photo-4110251.jpeg?w=400',

  // Groundnuts / Mtedza
  'mtedza': 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?w=400',
  'groundnut': 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?w=400',
  'peanut': 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?w=400',

  // Bambara Nuts / Nzama
  'nzama': 'https://images.pexels.com/photos/4110476/pexels-photo-4110476.jpeg?w=400',
  'bambara': 'https://images.pexels.com/photos/4110476/pexels-photo-4110476.jpeg?w=400',

  // Soybeans / Soya
  'soya': 'https://images.pexels.com/photos/4110255/pexels-photo-4110255.jpeg?w=400',
  'soybean': 'https://images.pexels.com/photos/4110255/pexels-photo-4110255.jpeg?w=400',

  // Beans
  'sugar-bean': 'https://images.pexels.com/photos/4110252/pexels-photo-4110252.jpeg?w=400',
  'kidney': 'https://images.pexels.com/photos/4110254/pexels-photo-4110254.jpeg?w=400',
  'bean': 'https://images.pexels.com/photos/4110252/pexels-photo-4110252.jpeg?w=400',

  // Processed
  'flour': 'https://images.pexels.com/photos/5765/flour-powder-wheat-jar.jpg?w=400',
  'powder': 'https://images.pexels.com/photos/5765/flour-powder-wheat-jar.jpg?w=400',
  'roasted': 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?w=400',
  'butter': 'https://images.pexels.com/photos/5419229/pexels-photo-5419229.jpeg?w=400',

  // Default
  'default': 'https://images.pexels.com/photos/4110256/pexels-photo-4110256.jpeg?w=400'
};

const getProductImage = (productName) => {
  const name = productName.toLowerCase();
  for (const [key, url] of Object.entries(productImages)) {
    if (name.includes(key)) return url;
  }
  return productImages.default;
};

const generateProducts = (categoryId, categoryName) => {
  // Prices in Malawian Kwacha (MWK) - 1 USD ≈ 1700 MWK
  const productTemplates = {
    'Nandolo (Pigeon Peas)': [
      { name: 'Nandolo Woyera (White Pigeon Peas)', nameNy: 'Nandolo Woyera', price: 2500, description: 'Premium white pigeon peas from Lilongwe', descriptionNy: 'Nandolo woyera wabwino kwambiri kuchokera ku Lilongwe', unit: 'kg', unitValue: 1, isDailyNeed: true },
      { name: 'Nandolo Wofiira (Red Pigeon Peas)', nameNy: 'Nandolo Wofiira', price: 2800, description: 'Traditional red pigeon peas', descriptionNy: 'Nandolo wofiira wamakolo', unit: 'kg', unitValue: 1, isDailyNeed: true },
      { name: 'Nandolo Wosakaniza (Mixed Pigeon Peas)', nameNy: 'Nandolo Wosakaniza', price: 2600, description: 'Mixed variety pigeon peas', descriptionNy: 'Nandolo wosakanizidwa mitundu yosiyanasiyana', unit: 'kg', unitValue: 1, isFeatured: true },
      { name: 'Nandolo Wophika (Split Pigeon Peas)', nameNy: 'Nandolo Wophika', price: 3200, description: 'Split and cleaned pigeon peas ready for cooking', descriptionNy: 'Nandolo wophikidwa ndi woyeretsedwa', unit: 'kg', unitValue: 1, isDailyNeed: true },
      { name: 'Nandolo wa Mzimba', nameNy: 'Nandolo wa Mzimba', price: 2700, description: 'Premium pigeon peas from Mzimba district', descriptionNy: 'Nandolo wabwino kuchokera ku Mzimba', unit: 'kg', unitValue: 1, isFeatured: true },
      { name: 'Nandolo Watsopano (Fresh Pigeon Peas)', nameNy: 'Nandolo Watsopano', price: 3000, description: 'Fresh harvest pigeon peas', descriptionNy: 'Nandolo watsopano wokolola kumene', unit: 'kg', unitValue: 1 },
      { name: 'Nandolo Waukulu (Large Pigeon Peas)', nameNy: 'Nandolo Waukulu', price: 3500, description: 'Extra large premium pigeon peas', descriptionNy: 'Nandolo waukulu kwambiri', unit: 'kg', unitValue: 1, isFeatured: true },
      { name: 'Nandolo wa 500g Pack', nameNy: 'Nandolo wa 500g', price: 1400, description: 'Convenient 500g pack of pigeon peas', descriptionNy: 'Nandolo wophikidwa wa 500g', unit: 'g', unitValue: 500, isDailyNeed: true }
    ],
    'Nyemba (Cowpeas)': [
      { name: 'Nyemba Zakuda (Black-Eyed Peas)', nameNy: 'Nyemba Zakuda', price: 2200, description: 'Traditional black-eyed peas', descriptionNy: 'Nyemba zakuda zamakolo', unit: 'kg', unitValue: 1, isDailyNeed: true },
      { name: 'Nyemba Zoyera (White Cowpeas)', nameNy: 'Nyemba Zoyera', price: 2400, description: 'Premium white cowpeas', descriptionNy: 'Nyemba zoyera zabwino kwambiri', unit: 'kg', unitValue: 1, isDailyNeed: true },
      { name: 'Nyemba Zofiira (Red Cowpeas)', nameNy: 'Nyemba Zofiira', price: 2500, description: 'Red cowpeas variety', descriptionNy: 'Nyemba zofiira', unit: 'kg', unitValue: 1, isFeatured: true },
      { name: 'Nyemba za Salima', nameNy: 'Nyemba za Salima', price: 2300, description: 'Cowpeas from Salima district', descriptionNy: 'Nyemba zochokera ku Salima', unit: 'kg', unitValue: 1 },
      { name: 'Nyemba za Kasungu', nameNy: 'Nyemba za Kasungu', price: 2350, description: 'Premium cowpeas from Kasungu', descriptionNy: 'Nyemba zabwino za ku Kasungu', unit: 'kg', unitValue: 1, isFeatured: true },
      { name: 'Nyemba Zosakaniza (Mixed Cowpeas)', nameNy: 'Nyemba Zosakaniza', price: 2150, description: 'Mixed cowpea varieties', descriptionNy: 'Nyemba zosakaniza mitundu', unit: 'kg', unitValue: 1, isDailyNeed: true },
      { name: 'Nyemba Zouma (Dried Cowpeas)', nameNy: 'Nyemba Zouma', price: 2000, description: 'Well-dried cowpeas for storage', descriptionNy: 'Nyemba zouma bwino losungika', unit: 'kg', unitValue: 1 },
      { name: 'Nyemba za 500g Pack', nameNy: 'Nyemba za 500g', price: 1200, description: 'Convenient 500g cowpea pack', descriptionNy: 'Nyemba za 500g zophikidwa', unit: 'g', unitValue: 500, isDailyNeed: true }
    ],
    'Mtedza (Groundnuts)': [
      { name: 'Mtedza Woyera (Raw Groundnuts)', nameNy: 'Mtedza Woyera', price: 3500, description: 'Premium raw shelled groundnuts', descriptionNy: 'Mtedza woyera wosasalidwa', unit: 'kg', unitValue: 1, isDailyNeed: true },
      { name: 'Mtedza Wokazinga (Roasted Groundnuts)', nameNy: 'Mtedza Wokazinga', price: 4000, description: 'Roasted and salted groundnuts', descriptionNy: 'Mtedza wokazinga ndi mchere', unit: 'kg', unitValue: 1, isDailyNeed: true },
      { name: 'Mtedza wa Mchere (Salted Groundnuts)', nameNy: 'Mtedza wa Mchere', price: 4200, description: 'Salted groundnuts snack', descriptionNy: 'Mtedza wa mchere wodyera', unit: 'g', unitValue: 500, isFeatured: true },
      { name: 'Mtedza wa Karonga', nameNy: 'Mtedza wa Karonga', price: 3800, description: 'Premium groundnuts from Karonga', descriptionNy: 'Mtedza wabwino wa ku Karonga', unit: 'kg', unitValue: 1, isFeatured: true },
      { name: 'Mtedza wa Mchinji', nameNy: 'Mtedza wa Mchinji', price: 3600, description: 'Groundnuts from Mchinji district', descriptionNy: 'Mtedza wochokera ku Mchinji', unit: 'kg', unitValue: 1 },
      { name: 'Mtedza Waukulu (Large Groundnuts)', nameNy: 'Mtedza Waukulu', price: 4500, description: 'Extra large groundnuts', descriptionNy: 'Mtedza waukulu kwambiri', unit: 'kg', unitValue: 1, isFeatured: true },
      { name: 'Mtedza Wosasalidwa (Unshelled)', nameNy: 'Mtedza Wosasalidwa', price: 2500, description: 'Groundnuts in shell', descriptionNy: 'Mtedza wosasalidwa m\'makoko', unit: 'kg', unitValue: 1 },
      { name: 'Mtedza wa Chalimbana (CG7)', nameNy: 'Mtedza wa Chalimbana', price: 3700, description: 'Popular Chalimbana variety groundnuts', descriptionNy: 'Mtedza wa mtundu wa Chalimbana', unit: 'kg', unitValue: 1, isDailyNeed: true },
      { name: 'Nsinjiro (Groundnut Powder)', nameNy: 'Nsinjiro', price: 5000, description: 'Traditional groundnut powder for cooking', descriptionNy: 'Nsinjiro wophikira', unit: 'kg', unitValue: 1, isDailyNeed: true },
      { name: 'Mtedza wa 500g Pack', nameNy: 'Mtedza wa 500g', price: 2000, description: 'Convenient 500g groundnut pack', descriptionNy: 'Mtedza wa 500g wophikidwa', unit: 'g', unitValue: 500, isDailyNeed: true }
    ],
    'Nzama (Bambara Nuts)': [
      { name: 'Nzama Zoyera (White Bambara Nuts)', nameNy: 'Nzama Zoyera', price: 3000, description: 'Traditional white bambara nuts', descriptionNy: 'Nzama zoyera zamakolo', unit: 'kg', unitValue: 1, isDailyNeed: true },
      { name: 'Nzama Zakuda (Dark Bambara Nuts)', nameNy: 'Nzama Zakuda', price: 3200, description: 'Dark variety bambara nuts', descriptionNy: 'Nzama zakuda', unit: 'kg', unitValue: 1, isFeatured: true },
      { name: 'Nzama Zofiira (Red Bambara Nuts)', nameNy: 'Nzama Zofiira', price: 3100, description: 'Red bambara nut variety', descriptionNy: 'Nzama zofiira', unit: 'kg', unitValue: 1 },
      { name: 'Nzama Zosakaniza (Mixed Bambara)', nameNy: 'Nzama Zosakaniza', price: 2900, description: 'Mixed bambara nut varieties', descriptionNy: 'Nzama zosakaniza mitundu', unit: 'kg', unitValue: 1, isDailyNeed: true },
      { name: 'Nzama za Ntchisi', nameNy: 'Nzama za Ntchisi', price: 3300, description: 'Premium bambara nuts from Ntchisi', descriptionNy: 'Nzama zabwino za ku Ntchisi', unit: 'kg', unitValue: 1, isFeatured: true },
      { name: 'Nzama za Dedza', nameNy: 'Nzama za Dedza', price: 3150, description: 'Bambara nuts from Dedza district', descriptionNy: 'Nzama za ku Dedza', unit: 'kg', unitValue: 1 },
      { name: 'Nzama za 500g Pack', nameNy: 'Nzama za 500g', price: 1700, description: 'Convenient 500g bambara nut pack', descriptionNy: 'Nzama za 500g zophikidwa', unit: 'g', unitValue: 500, isDailyNeed: true }
    ],
    'Soya (Soybeans)': [
      { name: 'Soya Yoyera (White Soybeans)', nameNy: 'Soya Yoyera', price: 2000, description: 'Premium white soybeans', descriptionNy: 'Soya yoyera yabwino kwambiri', unit: 'kg', unitValue: 1, isDailyNeed: true },
      { name: 'Soya Yofiira (Brown Soybeans)', nameNy: 'Soya Yofiira', price: 2200, description: 'Brown soybean variety', descriptionNy: 'Soya yofiira', unit: 'kg', unitValue: 1 },
      { name: 'Soya ya Bunda', nameNy: 'Soya ya Bunda', price: 2100, description: 'Soybeans from Bunda College area', descriptionNy: 'Soya yochokera ku Bunda', unit: 'kg', unitValue: 1, isFeatured: true },
      { name: 'Soya ya Lilongwe', nameNy: 'Soya ya Lilongwe', price: 1950, description: 'Soybeans from Lilongwe district', descriptionNy: 'Soya ya ku Lilongwe', unit: 'kg', unitValue: 1, isDailyNeed: true },
      { name: 'Soya Yophikira (Cooking Soybeans)', nameNy: 'Soya Yophikira', price: 2300, description: 'Soybeans prepared for cooking', descriptionNy: 'Soya yophikidwa kale', unit: 'kg', unitValue: 1, isFeatured: true },
      { name: 'Soya Pieces (TSP)', nameNy: 'Soya Yodula', price: 4500, description: 'Textured soy protein chunks', descriptionNy: 'Soya yodula ngati nyama', unit: 'kg', unitValue: 1, isDailyNeed: true },
      { name: 'Soya Mince', nameNy: 'Soya Yosakidwa', price: 4000, description: 'Soy mince for cooking', descriptionNy: 'Soya yosakidwa yophikira', unit: 'g', unitValue: 500 },
      { name: 'Soya ya 500g Pack', nameNy: 'Soya ya 500g', price: 1100, description: 'Convenient 500g soybean pack', descriptionNy: 'Soya ya 500g yophikidwa', unit: 'g', unitValue: 500, isDailyNeed: true }
    ],
    'Nyemba Zazikulu (Beans)': [
      { name: 'Sugar Beans (Nyemba Zatsopano)', nameNy: 'Sugar Beans', price: 2800, description: 'Premium white sugar beans', descriptionNy: 'Sugar beans zabwino kwambiri', unit: 'kg', unitValue: 1, isDailyNeed: true },
      { name: 'Red Kidney Beans (Nyemba Zofiira)', nameNy: 'Nyemba Zofiira Zazikulu', price: 3200, description: 'Large red kidney beans', descriptionNy: 'Nyemba zofiira zazikulu', unit: 'kg', unitValue: 1, isFeatured: true },
      { name: 'Khaki Beans', nameNy: 'Nyemba za Khaki', price: 2600, description: 'Khaki colored beans', descriptionNy: 'Nyemba za mtundu wa khaki', unit: 'kg', unitValue: 1, isDailyNeed: true },
      { name: 'Speckled Beans (Nyemba Zamathothomathotho)', nameNy: 'Nyemba Zamathothomathotho', price: 2700, description: 'Speckled variety beans', descriptionNy: 'Nyemba zamathothomathotho', unit: 'kg', unitValue: 1 },
      { name: 'Yellow Beans (Nyemba Zachikasu)', nameNy: 'Nyemba Zachikasu', price: 2900, description: 'Yellow bean variety', descriptionNy: 'Nyemba zachikasu', unit: 'kg', unitValue: 1, isFeatured: true },
      { name: 'Kaulesi Beans', nameNy: 'Nyemba za Kaulesi', price: 3000, description: 'Popular Kaulesi bean variety', descriptionNy: 'Nyemba za mtundu wa Kaulesi', unit: 'kg', unitValue: 1 },
      { name: 'Mixed Beans (Nyemba Zosakaniza)', nameNy: 'Nyemba Zosakaniza', price: 2500, description: 'Mixed bean varieties', descriptionNy: 'Nyemba zosakaniza mitundu', unit: 'kg', unitValue: 1, isDailyNeed: true },
      { name: 'Beans 500g Pack', nameNy: 'Nyemba za 500g', price: 1500, description: 'Convenient 500g bean pack', descriptionNy: 'Nyemba za 500g zophikidwa', unit: 'g', unitValue: 500, isDailyNeed: true }
    ],
    'Khobwe (Processed)': [
      { name: 'Peanut Butter (Thokozani)', nameNy: 'Peanut Butter', price: 3500, description: 'Creamy Malawian peanut butter', descriptionNy: 'Peanut butter ya ku Malawi', unit: 'g', unitValue: 500, isDailyNeed: true },
      { name: 'Peanut Butter (Crunchy)', nameNy: 'Peanut Butter Crunchy', price: 3700, description: 'Crunchy peanut butter with pieces', descriptionNy: 'Peanut butter yokhala ndi tunthudzu', unit: 'g', unitValue: 500, isFeatured: true },
      { name: 'Roasted Groundnuts Pack', nameNy: 'Mtedza Wokazinga', price: 1500, description: 'Ready-to-eat roasted groundnuts', descriptionNy: 'Mtedza wokazinga wodyera', unit: 'g', unitValue: 250, isDailyNeed: true },
      { name: 'Roasted Bambara Nuts', nameNy: 'Nzama Zokazinga', price: 1800, description: 'Roasted bambara nuts snack', descriptionNy: 'Nzama zokazinga zodyera', unit: 'g', unitValue: 250, isFeatured: true },
      { name: 'Soya Milk Powder', nameNy: 'Ufa wa Mkaka wa Soya', price: 5500, description: 'Nutritious soya milk powder', descriptionNy: 'Ufa wa mkaka wa soya', unit: 'g', unitValue: 400 },
      { name: 'Likuni Phala (Soya Blend)', nameNy: 'Likuni Phala', price: 3000, description: 'Nutritious soya-maize porridge blend', descriptionNy: 'Likuni phala ya soya ndi chimanga', unit: 'kg', unitValue: 1, isDailyNeed: true },
      { name: 'Chiponde (Groundnut Relish)', nameNy: 'Chiponde', price: 2500, description: 'Traditional groundnut relish', descriptionNy: 'Chiponde chamakolo', unit: 'g', unitValue: 500 }
    ],
    'Ufa wa Nyemba (Legume Flour)': [
      { name: 'Ufa wa Soya (Soya Flour)', nameNy: 'Ufa wa Soya', price: 3500, description: 'Nutritious soya flour for porridge', descriptionNy: 'Ufa wa soya wophikira phala', unit: 'kg', unitValue: 1, isDailyNeed: true },
      { name: 'Ufa wa Mtedza (Groundnut Flour)', nameNy: 'Ufa wa Mtedza', price: 5000, description: 'Pure groundnut flour', descriptionNy: 'Ufa wa mtedza woyera', unit: 'kg', unitValue: 1, isFeatured: true },
      { name: 'Ufa wa Nzama (Bambara Flour)', nameNy: 'Ufa wa Nzama', price: 4500, description: 'Traditional bambara nut flour', descriptionNy: 'Ufa wa nzama wamakolo', unit: 'kg', unitValue: 1 },
      { name: 'Ufa wa Nyemba (Bean Flour)', nameNy: 'Ufa wa Nyemba', price: 3800, description: 'Bean flour for cooking', descriptionNy: 'Ufa wa nyemba wophikira', unit: 'kg', unitValue: 1, isDailyNeed: true },
      { name: 'Ufa Wosakaniza (Mixed Legume Flour)', nameNy: 'Ufa Wosakaniza', price: 4000, description: 'Mixed legume flour blend', descriptionNy: 'Ufa wosakaniza wa nyemba zosiyanasiyana', unit: 'kg', unitValue: 1, isFeatured: true },
      { name: 'Ufa wa Nandolo (Pigeon Pea Flour)', nameNy: 'Ufa wa Nandolo', price: 4200, description: 'Pigeon pea flour for cooking', descriptionNy: 'Ufa wa nandolo wophikira', unit: 'kg', unitValue: 1 },
      { name: 'Ufa wa 500g Pack', nameNy: 'Ufa wa 500g', price: 2000, description: 'Convenient 500g flour pack', descriptionNy: 'Ufa wa 500g wophikidwa', unit: 'g', unitValue: 500, isDailyNeed: true }
    ]
  };

  const products = productTemplates[categoryName] || [];
  return products.map(product => ({
    name: product.name,
    nameNy: product.nameNy,
    slug: product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    description: product.description,
    descriptionNy: product.descriptionNy,
    price: product.price,
    unit: product.unit,
    unitValue: product.unitValue,
    isDailyNeed: product.isDailyNeed || false,
    isFeatured: product.isFeatured || false,
    category: categoryId,
    stock: Math.floor(Math.random() * 100) + 20,
    discountPercent: Math.random() > 0.7 ? Math.floor(Math.random() * 20) + 5 : 0,
    thumbnail: getProductImage(product.name),
    images: [getProductImage(product.name)],
    tags: ['nyemba', 'legumes', categoryName.toLowerCase().split(' ')[0], 'malawi']
  }));
};

const banners = [
  {
    title: 'Nyemba Zabwino za ku Malawi',
    titleEn: 'Premium Malawian Legumes',
    subtitle: 'Nandolo, Nyemba, Mtedza ndi zina zambiri - Zochokera kwa alimi a ku Malawi',
    subtitleEn: 'Pigeon peas, Cowpeas, Groundnuts and more - Direct from Malawian farmers',
    image: 'https://images.pexels.com/photos/4110256/pexels-photo-4110256.jpeg?w=1200',
    type: 'main',
    backgroundColor: '#009f7f',
    textColor: '#ffffff',
    sortOrder: 1
  },
  {
    title: 'Mtedza wa ku Malawi',
    titleEn: 'Malawian Groundnuts',
    subtitle: 'Mtedza wabwino kwambiri wa ku Karonga, Mchinji ndi Kasungu',
    subtitleEn: 'Premium groundnuts from Karonga, Mchinji and Kasungu',
    image: 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg?w=1200',
    type: 'main',
    backgroundColor: '#2E7D32',
    textColor: '#ffffff',
    sortOrder: 2
  },
  {
    title: 'Chithandizo cha Kusunga - Tathana!',
    titleEn: 'Bulk Savings - Special Offer!',
    subtitle: 'Gulani zambiri ndipo mupeze chithandizo cha 15%',
    subtitleEn: 'Buy in bulk and get 15% discount',
    image: 'https://images.pexels.com/photos/4110252/pexels-photo-4110252.jpeg?w=1200',
    type: 'promo',
    backgroundColor: '#FF6F00',
    textColor: '#ffffff',
    sortOrder: 3
  }
];

const coupons = [
  {
    code: 'TAKULANDIRANI',
    title: 'Takulandirani - Welcome Discount',
    description: '20% off for new customers / Chithandizo cha 20% kwa makasitomala atsopano',
    discountType: 'percentage',
    discountValue: 20,
    minOrderAmount: 5000,
    maxDiscount: 10000,
    usagePerUser: 1,
    startDate: new Date(),
    endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
  },
  {
    code: 'ZAMBIRI15',
    title: 'Zambiri Savings - Bulk Discount',
    description: '15% off orders over MWK 15,000 / Chithandizo cha 15% pa ma oda opitilira MWK 15,000',
    discountType: 'percentage',
    discountValue: 15,
    minOrderAmount: 15000,
    maxDiscount: 8000,
    startDate: new Date(),
    endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
  },
  {
    code: 'MTEDZA10',
    title: 'Mtedza Special',
    description: 'MWK 2,000 off groundnut products / MWK 2,000 pa zinthu za mtedza',
    discountType: 'fixed',
    discountValue: 2000,
    minOrderAmount: 8000,
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Banner.deleteMany({});
    await Coupon.deleteMany({});

    // Create admin user
    console.log('Creating admin user...');
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@mugodi.com',
      password: 'Admin123!',
      role: 'admin',
      isEmailVerified: true
    });
    console.log('Admin created:', admin.email);

    // Create test user
    console.log('Creating test user...');
    const testUser = await User.create({
      name: 'Kondwani Banda',
      email: 'user@mugodi.com',
      password: 'User123!',
      role: 'user',
      isEmailVerified: true,
      loyaltyPoints: 500,
      walletBalance: 5000
    });
    console.log('Test user created:', testUser.email);

    // Create categories
    console.log('Creating Malawian legume categories...');
    const createdCategories = await Category.insertMany(categories);
    console.log(`Created ${createdCategories.length} categories`);

    // Create products for each category
    console.log('Creating Malawian legume products...');
    let totalProducts = 0;
    for (const category of createdCategories) {
      const products = generateProducts(category._id, category.name);
      if (products.length > 0) {
        await Product.insertMany(products);
        totalProducts += products.length;
      }
    }
    console.log(`Created ${totalProducts} products`);

    // Create banners
    console.log('Creating banners...');
    await Banner.insertMany(banners);
    console.log(`Created ${banners.length} banners`);

    // Create coupons
    console.log('Creating coupons...');
    await Coupon.insertMany(coupons);
    console.log(`Created ${coupons.length} coupons`);

    console.log('\n========================================');
    console.log('Malawian Legume Database Seeded Successfully!');
    console.log('Database ya Nyemba za ku Malawi yakhazikitsidwa!');
    console.log('========================================');
    console.log('\nLogin credentials / Mawu achinsinsi:');
    console.log('Admin: admin@mugodi.com / Admin123!');
    console.log('User: user@mugodi.com / User123!');
    console.log('\nCoupon codes / Ma code a chithandizo:');
    console.log('TAKULANDIRANI - 20% off (new customers)');
    console.log('ZAMBIRI15 - 15% off orders over MWK 15,000');
    console.log('MTEDZA10 - MWK 2,000 off groundnut products');
    console.log('========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
