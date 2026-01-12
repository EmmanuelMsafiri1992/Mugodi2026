// Mugodi E-commerce Seed Data
// Run in MongoDB shell: mongo < seed-data.js
// Or copy and paste sections into mongo shell

// Switch to mugodi database
db = db.getSiblingDB('mugodi');

// Clear existing data
db.categories.drop();
db.products.drop();
db.banners.drop();
db.coupons.drop();
db.users.drop();

print("Creating categories...");

// Categories
db.categories.insertMany([
  {
    _id: ObjectId(),
    name: "Electronics",
    slug: "electronics",
    description: "Phones, laptops, tablets and electronic gadgets",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    name: "Fashion",
    slug: "fashion",
    description: "Clothing, shoes, and accessories for men and women",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    name: "Home & Living",
    slug: "home-living",
    description: "Furniture, decor, and home essentials",
    image: "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=400",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    name: "Groceries",
    slug: "groceries",
    description: "Fresh food, beverages, and household items",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    name: "Health & Beauty",
    slug: "health-beauty",
    description: "Skincare, cosmetics, and wellness products",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    name: "Sports & Outdoors",
    slug: "sports-outdoors",
    description: "Sports equipment and outdoor gear",
    image: "https://images.unsplash.com/photo-1461896836934- voices-of-spring?w=400",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

print("Categories created!");

// Get category IDs
var electronics = db.categories.findOne({slug: "electronics"})._id;
var fashion = db.categories.findOne({slug: "fashion"})._id;
var homeLiving = db.categories.findOne({slug: "home-living"})._id;
var groceries = db.categories.findOne({slug: "groceries"})._id;
var healthBeauty = db.categories.findOne({slug: "health-beauty"})._id;
var sports = db.categories.findOne({slug: "sports-outdoors"})._id;

print("Creating products...");

// Products (Prices in MWK - Malawian Kwacha)
db.products.insertMany([
  // Electronics
  {
    name: "Samsung Galaxy A54",
    slug: "samsung-galaxy-a54",
    description: "6.4-inch Super AMOLED display, 128GB storage, 50MP triple camera, 5000mAh battery. Perfect for everyday use with premium features.",
    price: 450000,
    comparePrice: 520000,
    category: electronics,
    images: [
      "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600"
    ],
    stock: 25,
    sku: "SAM-A54-128",
    isActive: true,
    isFeatured: true,
    ratings: { average: 4.5, count: 128 },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "HP Laptop 15",
    slug: "hp-laptop-15",
    description: "15.6-inch Full HD display, Intel Core i5, 8GB RAM, 256GB SSD. Ideal for work and study.",
    price: 850000,
    comparePrice: 950000,
    category: electronics,
    images: [
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600"
    ],
    stock: 15,
    sku: "HP-LAP-15",
    isActive: true,
    isFeatured: true,
    ratings: { average: 4.3, count: 89 },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Wireless Earbuds Pro",
    slug: "wireless-earbuds-pro",
    description: "Active noise cancellation, 24-hour battery life, water resistant. Crystal clear sound quality.",
    price: 75000,
    comparePrice: 95000,
    category: electronics,
    images: [
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600"
    ],
    stock: 50,
    sku: "EAR-PRO-01",
    isActive: true,
    isFeatured: false,
    ratings: { average: 4.6, count: 234 },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Smart Watch Series 5",
    slug: "smart-watch-series-5",
    description: "Heart rate monitor, GPS tracking, 7-day battery life, water resistant up to 50m.",
    price: 180000,
    comparePrice: 220000,
    category: electronics,
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600"
    ],
    stock: 30,
    sku: "WATCH-S5",
    isActive: true,
    isFeatured: true,
    ratings: { average: 4.4, count: 156 },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Bluetooth Speaker",
    slug: "bluetooth-speaker",
    description: "Portable wireless speaker with 360-degree sound, 12-hour playtime, IPX7 waterproof.",
    price: 45000,
    comparePrice: 55000,
    category: electronics,
    images: [
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600"
    ],
    stock: 40,
    sku: "SPK-BT-01",
    isActive: true,
    isFeatured: false,
    ratings: { average: 4.2, count: 98 },
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // Fashion
  {
    name: "Men's Casual Shirt",
    slug: "mens-casual-shirt",
    description: "100% cotton casual shirt, breathable fabric, available in multiple colors. Perfect for everyday wear.",
    price: 25000,
    comparePrice: 32000,
    category: fashion,
    images: [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600"
    ],
    stock: 100,
    sku: "SHT-CAS-M",
    isActive: true,
    isFeatured: false,
    ratings: { average: 4.1, count: 67 },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Women's Summer Dress",
    slug: "womens-summer-dress",
    description: "Elegant floral print dress, lightweight and comfortable. Perfect for any occasion.",
    price: 35000,
    comparePrice: 45000,
    category: fashion,
    images: [
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600"
    ],
    stock: 60,
    sku: "DRS-SUM-W",
    isActive: true,
    isFeatured: true,
    ratings: { average: 4.7, count: 145 },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Running Sneakers",
    slug: "running-sneakers",
    description: "Lightweight running shoes with cushioned sole, breathable mesh upper. Available in multiple sizes.",
    price: 85000,
    comparePrice: 105000,
    category: fashion,
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600"
    ],
    stock: 45,
    sku: "SNK-RUN-01",
    isActive: true,
    isFeatured: true,
    ratings: { average: 4.5, count: 189 },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Leather Handbag",
    slug: "leather-handbag",
    description: "Genuine leather handbag with multiple compartments, adjustable strap. Elegant and practical.",
    price: 120000,
    comparePrice: 150000,
    category: fashion,
    images: [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600"
    ],
    stock: 25,
    sku: "BAG-LTH-01",
    isActive: true,
    isFeatured: false,
    ratings: { average: 4.6, count: 78 },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Sunglasses Classic",
    slug: "sunglasses-classic",
    description: "UV400 protection, polarized lenses, classic aviator style. Comes with protective case.",
    price: 28000,
    comparePrice: 35000,
    category: fashion,
    images: [
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600"
    ],
    stock: 80,
    sku: "SUN-CLS-01",
    isActive: true,
    isFeatured: false,
    ratings: { average: 4.3, count: 112 },
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // Home & Living
  {
    name: "Modern Sofa Set",
    slug: "modern-sofa-set",
    description: "3-seater sofa with premium fabric upholstery, solid wood frame. Comfortable and stylish.",
    price: 650000,
    comparePrice: 780000,
    category: homeLiving,
    images: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600"
    ],
    stock: 8,
    sku: "SOF-MOD-3S",
    isActive: true,
    isFeatured: true,
    ratings: { average: 4.8, count: 34 },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Dining Table Set",
    slug: "dining-table-set",
    description: "6-seater dining table with chairs, solid mahogany wood. Elegant design for your dining room.",
    price: 480000,
    comparePrice: 550000,
    category: homeLiving,
    images: [
      "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=600"
    ],
    stock: 5,
    sku: "DIN-TBL-6S",
    isActive: true,
    isFeatured: false,
    ratings: { average: 4.7, count: 28 },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "LED Desk Lamp",
    slug: "led-desk-lamp",
    description: "Adjustable LED lamp with 3 brightness levels, USB charging port. Perfect for study or work.",
    price: 18000,
    comparePrice: 24000,
    category: homeLiving,
    images: [
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600"
    ],
    stock: 70,
    sku: "LMP-LED-01",
    isActive: true,
    isFeatured: false,
    ratings: { average: 4.4, count: 156 },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Cotton Bed Sheet Set",
    slug: "cotton-bed-sheet-set",
    description: "100% cotton bed sheet set with 2 pillow cases, soft and breathable. Queen size.",
    price: 42000,
    comparePrice: 52000,
    category: homeLiving,
    images: [
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600"
    ],
    stock: 35,
    sku: "BED-COT-Q",
    isActive: true,
    isFeatured: false,
    ratings: { average: 4.5, count: 89 },
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // Groceries
  {
    name: "Premium Rice 25kg",
    slug: "premium-rice-25kg",
    description: "High-quality long grain rice, perfect for everyday meals. Locally sourced.",
    price: 38000,
    comparePrice: 42000,
    category: groceries,
    images: [
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600"
    ],
    stock: 200,
    sku: "RIC-PRE-25",
    isActive: true,
    isFeatured: false,
    ratings: { average: 4.6, count: 234 },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Cooking Oil 5L",
    slug: "cooking-oil-5l",
    description: "Pure vegetable cooking oil, healthy and cholesterol-free. Perfect for all cooking needs.",
    price: 18500,
    comparePrice: 21000,
    category: groceries,
    images: [
      "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600"
    ],
    stock: 150,
    sku: "OIL-VEG-5L",
    isActive: true,
    isFeatured: false,
    ratings: { average: 4.3, count: 167 },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Instant Coffee 500g",
    slug: "instant-coffee-500g",
    description: "Premium instant coffee, rich aroma and smooth taste. Perfect morning boost.",
    price: 12000,
    comparePrice: 15000,
    category: groceries,
    images: [
      "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600"
    ],
    stock: 100,
    sku: "COF-INS-500",
    isActive: true,
    isFeatured: true,
    ratings: { average: 4.5, count: 198 },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Sugar 2kg Pack",
    slug: "sugar-2kg-pack",
    description: "Pure white sugar, fine granules. Essential for your kitchen.",
    price: 4500,
    comparePrice: 5200,
    category: groceries,
    images: [
      "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=600"
    ],
    stock: 300,
    sku: "SUG-WHT-2K",
    isActive: true,
    isFeatured: false,
    ratings: { average: 4.2, count: 145 },
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // Health & Beauty
  {
    name: "Facial Moisturizer",
    slug: "facial-moisturizer",
    description: "Hydrating facial moisturizer with vitamin E, suitable for all skin types. 100ml bottle.",
    price: 22000,
    comparePrice: 28000,
    category: healthBeauty,
    images: [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600"
    ],
    stock: 60,
    sku: "SKN-MOI-100",
    isActive: true,
    isFeatured: true,
    ratings: { average: 4.7, count: 189 },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Shampoo & Conditioner Set",
    slug: "shampoo-conditioner-set",
    description: "Nourishing shampoo and conditioner duo, for healthy and shiny hair. 500ml each.",
    price: 15000,
    comparePrice: 19000,
    category: healthBeauty,
    images: [
      "https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=600"
    ],
    stock: 80,
    sku: "HAR-SET-500",
    isActive: true,
    isFeatured: false,
    ratings: { average: 4.4, count: 134 },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Vitamin C Supplements",
    slug: "vitamin-c-supplements",
    description: "Immune boosting vitamin C tablets, 1000mg per tablet. 60 tablets per bottle.",
    price: 8500,
    comparePrice: 10500,
    category: healthBeauty,
    images: [
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600"
    ],
    stock: 120,
    sku: "VIT-C-60",
    isActive: true,
    isFeatured: false,
    ratings: { average: 4.6, count: 267 },
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // Sports & Outdoors
  {
    name: "Yoga Mat Premium",
    slug: "yoga-mat-premium",
    description: "Non-slip yoga mat, 6mm thick, eco-friendly material. Includes carrying strap.",
    price: 28000,
    comparePrice: 35000,
    category: sports,
    images: [
      "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600"
    ],
    stock: 45,
    sku: "YOG-MAT-PR",
    isActive: true,
    isFeatured: false,
    ratings: { average: 4.5, count: 98 },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Dumbbell Set 20kg",
    slug: "dumbbell-set-20kg",
    description: "Adjustable dumbbell set with various weight plates, rubber coated. Perfect for home gym.",
    price: 95000,
    comparePrice: 115000,
    category: sports,
    images: [
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600"
    ],
    stock: 20,
    sku: "DUM-ADJ-20",
    isActive: true,
    isFeatured: true,
    ratings: { average: 4.6, count: 67 },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Football Official Size",
    slug: "football-official-size",
    description: "Official size 5 football, durable PU leather, suitable for all surfaces.",
    price: 18000,
    comparePrice: 22000,
    category: sports,
    images: [
      "https://images.unsplash.com/photo-1614632537423-1e6c2e7e0aab?w=600"
    ],
    stock: 50,
    sku: "FTB-OFF-5",
    isActive: true,
    isFeatured: false,
    ratings: { average: 4.4, count: 145 },
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

print("Products created!");

print("Creating banners...");

// Banners
db.banners.insertMany([
  {
    title: "New Year Sale",
    subtitle: "Up to 50% Off on Electronics",
    image: "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=1200",
    link: "/products?category=electronics",
    isActive: true,
    order: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Fashion Week",
    subtitle: "Latest Trends at Best Prices",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200",
    link: "/products?category=fashion",
    isActive: true,
    order: 2,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Home Makeover",
    subtitle: "Transform Your Space",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200",
    link: "/products?category=home-living",
    isActive: true,
    order: 3,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

print("Banners created!");

print("Creating coupons...");

// Coupons
db.coupons.insertMany([
  {
    code: "WELCOME10",
    description: "10% off on your first order",
    discountType: "percentage",
    discountValue: 10,
    minPurchase: 10000,
    maxDiscount: 50000,
    usageLimit: 1000,
    usedCount: 0,
    startDate: new Date(),
    endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    code: "SAVE20",
    description: "MWK 20,000 off on orders above MWK 100,000",
    discountType: "fixed",
    discountValue: 20000,
    minPurchase: 100000,
    maxDiscount: 20000,
    usageLimit: 500,
    usedCount: 0,
    startDate: new Date(),
    endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    code: "FREESHIP",
    description: "Free delivery on all orders",
    discountType: "fixed",
    discountValue: 500,
    minPurchase: 5000,
    maxDiscount: 500,
    usageLimit: 2000,
    usedCount: 0,
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

print("Coupons created!");

print("Creating admin user...");

// Admin User (password: Admin@123 - bcrypt hashed)
db.users.insertOne({
  name: "Admin User",
  email: "admin@mugodi.com",
  password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password: password
  phone: "+265999000000",
  role: "admin",
  isVerified: true,
  wallet: { balance: 0, transactions: [] },
  loyalty: { points: 0, tier: "bronze", history: [] },
  createdAt: new Date(),
  updatedAt: new Date()
});

print("Admin user created!");
print("");
print("========================================");
print("SEED DATA COMPLETE!");
print("========================================");
print("");
print("Summary:");
print("- 6 Categories");
print("- 24 Products");
print("- 3 Banners");
print("- 3 Coupons");
print("- 1 Admin User");
print("");
print("Admin Login:");
print("Email: admin@mugodi.com");
print("Password: password");
print("");
print("NOTE: Please change the admin password after first login!");
print("========================================");
