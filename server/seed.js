import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mugodi');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Define schemas
const categorySchema = new mongoose.Schema({
  name: String,
  slug: String,
  description: String,
  image: String,
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  name: String,
  slug: String,
  description: String,
  price: Number,
  comparePrice: Number,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  images: [String],
  stock: Number,
  sku: String,
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  ratings: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  }
}, { timestamps: true });

const bannerSchema = new mongoose.Schema({
  title: String,
  subtitle: String,
  image: String,
  link: String,
  isActive: { type: Boolean, default: true },
  order: Number
}, { timestamps: true });

const couponSchema = new mongoose.Schema({
  code: String,
  description: String,
  discountType: String,
  discountValue: Number,
  minPurchase: Number,
  maxDiscount: Number,
  usageLimit: Number,
  usedCount: { type: Number, default: 0 },
  startDate: Date,
  endDate: Date,
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  phone: String,
  role: { type: String, default: 'user' },
  isVerified: { type: Boolean, default: false },
  wallet: {
    balance: { type: Number, default: 0 },
    transactions: { type: Array, default: [] }
  },
  loyalty: {
    points: { type: Number, default: 0 },
    tier: { type: String, default: 'bronze' },
    history: { type: Array, default: [] }
  }
}, { timestamps: true });

// Create models
const Category = mongoose.model('Category', categorySchema);
const Product = mongoose.model('Product', productSchema);
const Banner = mongoose.model('Banner', bannerSchema);
const Coupon = mongoose.model('Coupon', couponSchema);
const User = mongoose.model('User', userSchema);

// Seed data
const seedDatabase = async () => {
  try {
    await connectDB();

    // Check if data already exists
    const existingProducts = await Product.countDocuments();
    if (existingProducts > 0) {
      console.log('Database already has data. Skipping seed.');
      console.log(`Existing: ${existingProducts} products`);
      process.exit(0);
    }

    console.log('Seeding database...');

    // Clear existing data
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Banner.deleteMany({});
    await Coupon.deleteMany({});

    // Create categories
    console.log('Creating categories...');
    const categories = await Category.insertMany([
      { name: "Electronics", slug: "electronics", description: "Phones, laptops, tablets and electronic gadgets", image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400", isActive: true },
      { name: "Fashion", slug: "fashion", description: "Clothing, shoes, and accessories", image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400", isActive: true },
      { name: "Home & Living", slug: "home-living", description: "Furniture, decor, and home essentials", image: "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=400", isActive: true },
      { name: "Groceries", slug: "groceries", description: "Fresh food, beverages, and household items", image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400", isActive: true },
      { name: "Health & Beauty", slug: "health-beauty", description: "Skincare, cosmetics, and wellness products", image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400", isActive: true },
      { name: "Sports & Outdoors", slug: "sports-outdoors", description: "Sports equipment and outdoor gear", image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400", isActive: true }
    ]);

    // Get category IDs
    const catMap = {};
    categories.forEach(cat => {
      catMap[cat.slug] = cat._id;
    });

    // Create products (prices in MWK)
    console.log('Creating products...');
    await Product.insertMany([
      // Electronics
      { name: "Samsung Galaxy A54", slug: "samsung-galaxy-a54", description: "6.4-inch Super AMOLED display, 128GB storage, 50MP triple camera", price: 450000, comparePrice: 520000, category: catMap['electronics'], images: ["https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600"], stock: 25, sku: "SAM-A54-128", isActive: true, isFeatured: true, ratings: { average: 4.5, count: 128 } },
      { name: "HP Laptop 15", slug: "hp-laptop-15", description: "15.6-inch Full HD, Intel Core i5, 8GB RAM, 256GB SSD", price: 850000, comparePrice: 950000, category: catMap['electronics'], images: ["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600"], stock: 15, sku: "HP-LAP-15", isActive: true, isFeatured: true, ratings: { average: 4.3, count: 89 } },
      { name: "Wireless Earbuds Pro", slug: "wireless-earbuds-pro", description: "Active noise cancellation, 24-hour battery life", price: 75000, comparePrice: 95000, category: catMap['electronics'], images: ["https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600"], stock: 50, sku: "EAR-PRO-01", isActive: true, isFeatured: false, ratings: { average: 4.6, count: 234 } },
      { name: "Smart Watch Series 5", slug: "smart-watch-series-5", description: "Heart rate monitor, GPS tracking, 7-day battery life", price: 180000, comparePrice: 220000, category: catMap['electronics'], images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600"], stock: 30, sku: "WATCH-S5", isActive: true, isFeatured: true, ratings: { average: 4.4, count: 156 } },
      { name: "Bluetooth Speaker", slug: "bluetooth-speaker", description: "Portable wireless speaker, 12-hour playtime, IPX7 waterproof", price: 45000, comparePrice: 55000, category: catMap['electronics'], images: ["https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600"], stock: 40, sku: "SPK-BT-01", isActive: true, isFeatured: false, ratings: { average: 4.2, count: 98 } },

      // Fashion
      { name: "Men's Casual Shirt", slug: "mens-casual-shirt", description: "100% cotton casual shirt, breathable fabric", price: 25000, comparePrice: 32000, category: catMap['fashion'], images: ["https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600"], stock: 100, sku: "SHT-CAS-M", isActive: true, isFeatured: false, ratings: { average: 4.1, count: 67 } },
      { name: "Women's Summer Dress", slug: "womens-summer-dress", description: "Elegant floral print dress, lightweight", price: 35000, comparePrice: 45000, category: catMap['fashion'], images: ["https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600"], stock: 60, sku: "DRS-SUM-W", isActive: true, isFeatured: true, ratings: { average: 4.7, count: 145 } },
      { name: "Running Sneakers", slug: "running-sneakers", description: "Lightweight running shoes with cushioned sole", price: 85000, comparePrice: 105000, category: catMap['fashion'], images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600"], stock: 45, sku: "SNK-RUN-01", isActive: true, isFeatured: true, ratings: { average: 4.5, count: 189 } },
      { name: "Leather Handbag", slug: "leather-handbag", description: "Genuine leather handbag with multiple compartments", price: 120000, comparePrice: 150000, category: catMap['fashion'], images: ["https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600"], stock: 25, sku: "BAG-LTH-01", isActive: true, isFeatured: false, ratings: { average: 4.6, count: 78 } },
      { name: "Sunglasses Classic", slug: "sunglasses-classic", description: "UV400 protection, polarized lenses, aviator style", price: 28000, comparePrice: 35000, category: catMap['fashion'], images: ["https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600"], stock: 80, sku: "SUN-CLS-01", isActive: true, isFeatured: false, ratings: { average: 4.3, count: 112 } },

      // Home & Living
      { name: "Modern Sofa Set", slug: "modern-sofa-set", description: "3-seater sofa with premium fabric upholstery", price: 650000, comparePrice: 780000, category: catMap['home-living'], images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600"], stock: 8, sku: "SOF-MOD-3S", isActive: true, isFeatured: true, ratings: { average: 4.8, count: 34 } },
      { name: "Dining Table Set", slug: "dining-table-set", description: "6-seater dining table with chairs, solid mahogany", price: 480000, comparePrice: 550000, category: catMap['home-living'], images: ["https://images.unsplash.com/photo-1617806118233-18e1de247200?w=600"], stock: 5, sku: "DIN-TBL-6S", isActive: true, isFeatured: false, ratings: { average: 4.7, count: 28 } },
      { name: "LED Desk Lamp", slug: "led-desk-lamp", description: "Adjustable LED lamp with 3 brightness levels", price: 18000, comparePrice: 24000, category: catMap['home-living'], images: ["https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600"], stock: 70, sku: "LMP-LED-01", isActive: true, isFeatured: false, ratings: { average: 4.4, count: 156 } },
      { name: "Cotton Bed Sheet Set", slug: "cotton-bed-sheet-set", description: "100% cotton bed sheet set with 2 pillow cases", price: 42000, comparePrice: 52000, category: catMap['home-living'], images: ["https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600"], stock: 35, sku: "BED-COT-Q", isActive: true, isFeatured: false, ratings: { average: 4.5, count: 89 } },

      // Groceries
      { name: "Premium Rice 25kg", slug: "premium-rice-25kg", description: "High-quality long grain rice, locally sourced", price: 38000, comparePrice: 42000, category: catMap['groceries'], images: ["https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600"], stock: 200, sku: "RIC-PRE-25", isActive: true, isFeatured: false, ratings: { average: 4.6, count: 234 } },
      { name: "Cooking Oil 5L", slug: "cooking-oil-5l", description: "Pure vegetable cooking oil, cholesterol-free", price: 18500, comparePrice: 21000, category: catMap['groceries'], images: ["https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600"], stock: 150, sku: "OIL-VEG-5L", isActive: true, isFeatured: false, ratings: { average: 4.3, count: 167 } },
      { name: "Instant Coffee 500g", slug: "instant-coffee-500g", description: "Premium instant coffee, rich aroma and smooth taste", price: 12000, comparePrice: 15000, category: catMap['groceries'], images: ["https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600"], stock: 100, sku: "COF-INS-500", isActive: true, isFeatured: true, ratings: { average: 4.5, count: 198 } },
      { name: "Sugar 2kg Pack", slug: "sugar-2kg-pack", description: "Pure white sugar, fine granules", price: 4500, comparePrice: 5200, category: catMap['groceries'], images: ["https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=600"], stock: 300, sku: "SUG-WHT-2K", isActive: true, isFeatured: false, ratings: { average: 4.2, count: 145 } },

      // Health & Beauty
      { name: "Facial Moisturizer", slug: "facial-moisturizer", description: "Hydrating facial moisturizer with vitamin E, 100ml", price: 22000, comparePrice: 28000, category: catMap['health-beauty'], images: ["https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600"], stock: 60, sku: "SKN-MOI-100", isActive: true, isFeatured: true, ratings: { average: 4.7, count: 189 } },
      { name: "Shampoo & Conditioner Set", slug: "shampoo-conditioner-set", description: "Nourishing shampoo and conditioner duo, 500ml each", price: 15000, comparePrice: 19000, category: catMap['health-beauty'], images: ["https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=600"], stock: 80, sku: "HAR-SET-500", isActive: true, isFeatured: false, ratings: { average: 4.4, count: 134 } },
      { name: "Vitamin C Supplements", slug: "vitamin-c-supplements", description: "Immune boosting vitamin C tablets, 60 tablets", price: 8500, comparePrice: 10500, category: catMap['health-beauty'], images: ["https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600"], stock: 120, sku: "VIT-C-60", isActive: true, isFeatured: false, ratings: { average: 4.6, count: 267 } },

      // Sports & Outdoors
      { name: "Yoga Mat Premium", slug: "yoga-mat-premium", description: "Non-slip yoga mat, 6mm thick, eco-friendly", price: 28000, comparePrice: 35000, category: catMap['sports-outdoors'], images: ["https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600"], stock: 45, sku: "YOG-MAT-PR", isActive: true, isFeatured: false, ratings: { average: 4.5, count: 98 } },
      { name: "Dumbbell Set 20kg", slug: "dumbbell-set-20kg", description: "Adjustable dumbbell set with rubber coating", price: 95000, comparePrice: 115000, category: catMap['sports-outdoors'], images: ["https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600"], stock: 20, sku: "DUM-ADJ-20", isActive: true, isFeatured: true, ratings: { average: 4.6, count: 67 } },
      { name: "Football Official Size", slug: "football-official-size", description: "Official size 5 football, durable PU leather", price: 18000, comparePrice: 22000, category: catMap['sports-outdoors'], images: ["https://images.unsplash.com/photo-1614632537423-1e6c2e7e0aab?w=600"], stock: 50, sku: "FTB-OFF-5", isActive: true, isFeatured: false, ratings: { average: 4.4, count: 145 } }
    ]);

    // Create banners
    console.log('Creating banners...');
    await Banner.insertMany([
      { title: "New Year Sale", subtitle: "Up to 50% Off on Electronics", image: "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=1200", link: "/products?category=electronics", isActive: true, order: 1 },
      { title: "Fashion Week", subtitle: "Latest Trends at Best Prices", image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200", link: "/products?category=fashion", isActive: true, order: 2 },
      { title: "Home Makeover", subtitle: "Transform Your Space", image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200", link: "/products?category=home-living", isActive: true, order: 3 }
    ]);

    // Create coupons
    console.log('Creating coupons...');
    const now = new Date();
    await Coupon.insertMany([
      { code: "WELCOME10", description: "10% off on your first order", discountType: "percentage", discountValue: 10, minPurchase: 10000, maxDiscount: 50000, usageLimit: 1000, usedCount: 0, startDate: now, endDate: new Date(now.getTime() + 90*24*60*60*1000), isActive: true },
      { code: "SAVE20", description: "MWK 20,000 off on orders above MWK 100,000", discountType: "fixed", discountValue: 20000, minPurchase: 100000, maxDiscount: 20000, usageLimit: 500, usedCount: 0, startDate: now, endDate: new Date(now.getTime() + 60*24*60*60*1000), isActive: true },
      { code: "FREESHIP", description: "Free delivery on all orders", discountType: "fixed", discountValue: 500, minPurchase: 5000, maxDiscount: 500, usageLimit: 2000, usedCount: 0, startDate: now, endDate: new Date(now.getTime() + 30*24*60*60*1000), isActive: true }
    ]);

    // Create admin user if not exists
    console.log('Creating admin user...');
    const existingAdmin = await User.findOne({ email: 'admin@mugodi.com' });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('Admin@123', 10);
      await User.create({
        name: "Admin User",
        email: "admin@mugodi.com",
        password: hashedPassword,
        phone: "+265999000000",
        role: "admin",
        isVerified: true,
        wallet: { balance: 0, transactions: [] },
        loyalty: { points: 0, tier: "bronze", history: [] }
      });
      console.log('Admin user created: admin@mugodi.com / Admin@123');
    } else {
      console.log('Admin user already exists');
    }

    // Print summary
    const catCount = await Category.countDocuments();
    const prodCount = await Product.countDocuments();
    const bannerCount = await Banner.countDocuments();
    const couponCount = await Coupon.countDocuments();
    const userCount = await User.countDocuments();

    console.log('\n========================================');
    console.log('SEED COMPLETE!');
    console.log('========================================');
    console.log(`Categories: ${catCount}`);
    console.log(`Products: ${prodCount}`);
    console.log(`Banners: ${bannerCount}`);
    console.log(`Coupons: ${couponCount}`);
    console.log(`Users: ${userCount}`);
    console.log('========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedDatabase();
