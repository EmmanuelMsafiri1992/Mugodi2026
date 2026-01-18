// Mugodi E-commerce Seed Data - Malawian Legumes
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

// Categories - Malawian Legumes (English and Chichewa names)
db.categories.insertMany([
  // 1. Beans
  {
    _id: ObjectId(),
    name: "Beans (Nyemba)",
    slug: "beans",
    description: "Quality Malawian beans including Common beans, Sugar beans, Kidney beans, Black beans, and Pinto beans. Rich in protein and fiber.",
    image: "https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=400",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // 2. Groundnuts
  {
    _id: ObjectId(),
    name: "Groundnuts (Ntedza)",
    slug: "groundnuts",
    description: "Premium Malawian groundnuts/peanuts - CG7, Chalimbana, Nsinjiro varieties. Rich in protein and essential oils.",
    image: "https://images.unsplash.com/photo-1567892320421-1c657571ea4a?w=400",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // 3. Bambara Groundnuts
  {
    _id: ObjectId(),
    name: "Bambara Groundnuts (Nkhwani)",
    slug: "bambara-groundnuts",
    description: "Indigenous Malawian bambara groundnuts - complete protein source and traditional favorite.",
    image: "https://images.unsplash.com/photo-1609780447631-05b93e5a88ea?w=400",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // 4. Pigeon Peas
  {
    _id: ObjectId(),
    name: "Pigeon Peas (Nandolo)",
    slug: "pigeon-peas",
    description: "Export-quality Malawian pigeon peas - very common in southern Malawi. Nutritious and versatile for traditional dishes.",
    image: "https://images.unsplash.com/photo-1515543904323-e24bd7ddbf86?w=400",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // 5. Cowpeas
  {
    _id: ObjectId(),
    name: "Cowpeas (Khobwe)",
    slug: "cowpeas",
    description: "Traditional Malawian cowpeas including black-eyed peas (Khobwe zamaso oyera) - drought-resistant and highly nutritious.",
    image: "https://images.unsplash.com/photo-1563746098251-d35aef196e83?w=400",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // 6. Soybeans
  {
    _id: ObjectId(),
    name: "Soybeans (Soya)",
    slug: "soybeans",
    description: "High-quality Malawian soybeans for food processing, animal feed, and home consumption.",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // 7. Lentils
  {
    _id: ObjectId(),
    name: "Lentils (Malenti)",
    slug: "lentils",
    description: "Lentils available in shops - not traditional but increasingly popular for nutritious meals and soups.",
    image: "https://images.unsplash.com/photo-1546933324-3e8b1e3c9c3e?w=400",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // 8. Chickpeas
  {
    _id: ObjectId(),
    name: "Chickpeas (Nandolo ya ku India)",
    slug: "chickpeas",
    description: "Chickpeas - mostly imported but available for hummus, curries, and various international dishes.",
    image: "https://images.unsplash.com/photo-1515543904323-e24bd7ddbf86?w=400",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // 9. Green Gram / Mung Beans
  {
    _id: ObjectId(),
    name: "Green Gram (Nandolo Zobiriwira)",
    slug: "green-gram",
    description: "Green gram or Mung beans - nutritious legumes perfect for sprouting and traditional dishes.",
    image: "https://images.unsplash.com/photo-1563746098251-d35aef196e83?w=400",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // 10. Peas
  {
    _id: ObjectId(),
    name: "Peas (Nandolo)",
    slug: "peas",
    description: "Dry peas and green peas (Nandolo zobiriwira) - versatile legumes for soups, stews, and side dishes.",
    image: "https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=400",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // 11. Broad Beans
  {
    _id: ObjectId(),
    name: "Broad Beans (Nyemba Zazikulu)",
    slug: "broad-beans",
    description: "Broad beans or Fava beans - less common but nutritious large beans for various dishes.",
    image: "https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=400",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // 12. Lima Beans
  {
    _id: ObjectId(),
    name: "Lima Beans (Nyemba za Batala)",
    slug: "lima-beans",
    description: "Lima beans or Butter beans - creamy textured beans perfect for stews and casseroles.",
    image: "https://images.unsplash.com/photo-1506807803488-8eafc15316c7?w=400",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // 13. Velvet Beans
  {
    _id: ObjectId(),
    name: "Velvet Beans (Nyemba Zakutchire)",
    slug: "velvet-beans",
    description: "Velvet beans - mostly used for soil improvement and animal feed, also edible when properly prepared.",
    image: "https://images.unsplash.com/photo-1558160074-4d7d8bdf4256?w=400",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // 14. Lablab Beans
  {
    _id: ObjectId(),
    name: "Lablab Beans (Nyemba za Mphonda)",
    slug: "lablab-beans",
    description: "Lablab or Hyacinth beans - versatile legumes used for food, fodder, and soil improvement.",
    image: "https://images.unsplash.com/photo-1585427836582-58e3ce6f8882?w=400",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

print("Categories created!");

// Get category IDs
var beans = db.categories.findOne({slug: "beans"})._id;
var groundnuts = db.categories.findOne({slug: "groundnuts"})._id;
var bambaraGroundnuts = db.categories.findOne({slug: "bambara-groundnuts"})._id;
var pigeonPeas = db.categories.findOne({slug: "pigeon-peas"})._id;
var cowpeas = db.categories.findOne({slug: "cowpeas"})._id;
var soybeans = db.categories.findOne({slug: "soybeans"})._id;
var lentils = db.categories.findOne({slug: "lentils"})._id;
var chickpeas = db.categories.findOne({slug: "chickpeas"})._id;
var greenGram = db.categories.findOne({slug: "green-gram"})._id;
var peas = db.categories.findOne({slug: "peas"})._id;
var broadBeans = db.categories.findOne({slug: "broad-beans"})._id;
var limaBeans = db.categories.findOne({slug: "lima-beans"})._id;
var velvetBeans = db.categories.findOne({slug: "velvet-beans"})._id;
var lablabBeans = db.categories.findOne({slug: "lablab-beans"})._id;

print("Creating products...");

// Products (Prices in MWK - Malawian Kwacha)
// Based on Ministry of Agriculture 2024 prices: Beans K1,200/kg, Groundnuts shelled K1,200/kg,
// Soya K800/kg, Pigeon peas K700/kg, Cowpeas K750/kg, Bambara K750/kg
db.products.insertMany([
  // ==================== GROUNDNUTS (MTEDZA) ====================
  {
    name: "CG7 Groundnuts - Shelled (1kg)",
    slug: "cg7-groundnuts-shelled-1kg",
    description: "Premium CG7 variety groundnuts, shelled and ready to use. This high-yielding Virginia bunch variety is Malawi's most popular groundnut - perfect for cooking, snacking, or making groundnut flour. Red in colour with excellent taste.",
    price: 1500,
    comparePrice: 1800,
    category: groundnuts,
    images: [
      "https://images.unsplash.com/photo-1567892320421-1c657571ea4a?w=600"
    ],
    stock: 500,
    sku: "GN-CG7-SH-1K",
    isActive: true,
    isFeatured: true,
    ratings: { average: 4.8, count: 245 },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "CG7 Groundnuts - Shelled (5kg)",
    slug: "cg7-groundnuts-shelled-5kg",
    description: "Bulk pack of premium CG7 groundnuts, shelled. Perfect for households, restaurants, and small businesses. High in protein (25-34%) and healthy oils (44-56%).",
    price: 7000,
    comparePrice: 8500,
    category: groundnuts,
    images: [
      "https://images.unsplash.com/photo-1567892320421-1c657571ea4a?w=600"
    ],
    stock: 200,
    sku: "GN-CG7-SH-5K",
    isActive: true,
    isFeatured: true,
    ratings: { average: 4.7, count: 189 },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Chalimbana Groundnuts - Shelled (1kg)",
    slug: "chalimbana-groundnuts-shelled-1kg",
    description: "Traditional Chalimbana variety - tan coloured groundnuts prized for their rich, sweet flavor. A Malawian heritage variety perfect for nsinjiro (groundnut powder) and traditional dishes.",
    price: 1400,
    comparePrice: 1700,
    category: groundnuts,
    images: [
      "https://images.unsplash.com/photo-1525351159099-81893194469e?w=600"
    ],
    stock: 350,
    sku: "GN-CHAL-SH-1K",
    isActive: true,
    isFeatured: false,
    ratings: { average: 4.6, count: 167 },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Chalimbana Groundnuts - Shelled (5kg)",
    slug: "chalimbana-groundnuts-shelled-5kg",
    description: "Bulk Chalimbana groundnuts for families and businesses. This heritage variety takes 150 days to mature, resulting in exceptional flavor and quality.",
    price: 6500,
    comparePrice: 8000,
    category: groundnuts,
    images: [
      "https://images.unsplash.com/photo-1525351159099-81893194469e?w=600"
    ],
    stock: 150,
    sku: "GN-CHAL-SH-5K",
    isActive: true,
    isFeatured: false,
    ratings: { average: 4.7, count: 98 },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Nsinjiro Groundnuts - Shelled (1kg)",
    slug: "nsinjiro-groundnuts-shelled-1kg",
    description: "Nsinjiro variety groundnuts - a modern improved variety with tan colour. Higher yielding than traditional Chalimbana with excellent disease resistance. Great for all culinary uses.",
    price: 1450,
    comparePrice: 1750,
    category: groundnuts,
    images: [
      "https://images.unsplash.com/photo-1590759668628-05b0fc34bb70?w=600"
    ],
    stock: 280,
    sku: "GN-NSIN-SH-1K",
    isActive: true,
    isFeatured: false,
    ratings: { average: 4.5, count: 134 },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Groundnuts - Unshelled (5kg)",
    slug: "groundnuts-unshelled-5kg",
    description: "Fresh unshelled groundnuts in their natural pods. Perfect for roasting at home, longer shelf life, and traditional preparation methods. Mixed CG7 and Chalimbana varieties.",
    price: 4500,
    comparePrice: 5500,
    category: groundnuts,
    images: [
      "https://images.unsplash.com/photo-1543158181-1274e5362710?w=600"
    ],
    stock: 300,
    sku: "GN-MIX-UN-5K",
    isActive: true,
    isFeatured: false,
    ratings: { average: 4.4, count: 156 },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Roasted Groundnuts - Salted (500g)",
    slug: "roasted-groundnuts-salted-500g",
    description: "Ready-to-eat roasted and lightly salted groundnuts. Perfect healthy snack packed with protein and nutrients. Made from premium CG7 variety.",
    price: 1200,
    comparePrice: 1500,
    category: groundnuts,
    images: [
      "https://images.unsplash.com/photo-1582284540020-8acbe03f4924?w=600"
    ],
    stock: 400,
    sku: "GN-RST-SAL-500",
    isActive: true,
    isFeatured: true,
    ratings: { average: 4.9, count: 312 },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Groundnut Flour (Nsinjiro) - 1kg",
    slug: "groundnut-flour-nsinjiro-1kg",
    description: "Traditional Malawian groundnut flour (nsinjiro) - finely ground from premium Chalimbana groundnuts. Essential for preparing ndiwo (relish) and thickening traditional sauces.",
    price: 2000,
    comparePrice: 2400,
    category: groundnuts,
    images: [
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600"
    ],
    stock: 250,
    sku: "GN-FLR-NSIN-1K",
    isActive: true,
    isFeatured: true,
    ratings: { average: 4.8, count: 198 },
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // ==================== BEANS (NYEMBA) ====================
  {
    name: "Sugar Beans (Kholophethe) - 1kg",
    slug: "sugar-beans-kholophethe-1kg",
    description: "Premium large red speckled sugar beans - locally known as Kholophethe or Nyati Red. White/cream with maroon stripes. Excellent for stews, rice dishes, and traditional Malawian recipes.",
    price: 1500,
    comparePrice: 1800,
    category: beans,
    images: [
      "https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=600"
    ],
    stock: 400,
    sku: "BN-SUG-KHL-1K",
    isActive: true,
    isFeatured: true,
    ratings: { average: 4.7, count: 223 },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Sugar Beans (Kholophethe) - 5kg",
    slug: "sugar-beans-kholophethe-5kg",
    description: "Bulk pack of premium sugar beans. A staple in Malawian households, these beans are rich in protein, calcium, and iron. Perfect for feeding families.",
    price: 7000,
    comparePrice: 8500,
    category: beans,
    images: [
      "https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=600"
    ],
    stock: 180,
    sku: "BN-SUG-KHL-5K",
    isActive: true,
    isFeatured: false,
    ratings: { average: 4.6, count: 145 },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Nyemba Red Beans - 1kg",
    slug: "nyemba-red-beans-1kg",
    description: "Traditional Malawian Nyemba beans from the Blantyre region. Bright red to deep maroon colour that holds when cooked. A staple food and cash crop for most of rural Malawi.",
    price: 1400,
    comparePrice: 1700,
    category: beans,
    images: [
      "https://images.unsplash.com/photo-1558160074-4d7d8bdf4256?w=600"
    ],
    stock: 350,
    sku: "BN-NYE-RED-1K",
    isActive: true,
    isFeatured: true,
    ratings: { average: 4.8, count: 267 },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Nyemba Red Beans - 5kg",
    slug: "nyemba-red-beans-5kg",
    description: "Bulk traditional Nyemba beans. Strong tolerance for dryland cultivation, these heritage beans have been grown in Malawi for generations. Rich deep colour gives dishes great eye-appeal.",
    price: 6500,
    comparePrice: 8000,
    category: beans,
    images: [
      "https://images.unsplash.com/photo-1558160074-4d7d8bdf4256?w=600"
    ],
    stock: 150,
    sku: "BN-NYE-RED-5K",
    isActive: true,
    isFeatured: false,
    ratings: { average: 4.7, count: 123 },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Kalima Beans (Red Mottled) - 1kg",
    slug: "kalima-beans-red-mottled-1kg",
    description: "Large red mottled Kalima beans - popular across East Africa. Quick cooking with creamy texture. High in protein, fiber, and essential minerals.",
    price: 1450,
    comparePrice: 1750,
    category: beans,
    images: [
      "https://images.unsplash.com/photo-1585427836582-58e3ce6f8882?w=600"
    ],
    stock: 280,
    sku: "BN-KAL-MOT-1K",
    isActive: true,
    isFeatured: false,
    ratings: { average: 4.5, count: 134 },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "White Haricot Beans - 1kg",
    slug: "white-haricot-beans-1kg",
    description: "Premium white haricot beans - perfect for soups, stews, and baked beans. Mild flavor that absorbs seasonings well. High in protein and fiber.",
    price: 1500,
    comparePrice: 1800,
    category: beans,
    images: [
      "https://images.unsplash.com/photo-1506807803488-8eafc15316c7?w=600"
    ],
    stock: 220,
    sku: "BN-WHT-HAR-1K",
    isActive: true,
    isFeatured: false,
    ratings: { average: 4.4, count: 98 },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Mixed Beans - 2kg",
    slug: "mixed-beans-2kg",
    description: "Assortment of Malawian bean varieties - Sugar beans, Nyemba, and Kalima mixed together. Great for variety in your meals and colorful presentations.",
    price: 2400,
    comparePrice: 3000,
    category: beans,
    images: [
      "https://images.unsplash.com/photo-1515543904323-e24bd7ddbf86?w=600"
    ],
    stock: 200,
    sku: "BN-MIX-VAR-2K",
    isActive: true,
    isFeatured: false,
    ratings: { average: 4.3, count: 87 },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "NUA 45 Beans - 1kg",
    slug: "nua-45-beans-1kg",
    description: "Modern NUA 45 variety - high-yielding certified seeds grown for superior quality. Bred for disease resistance and improved nutrition. The future of bean farming in Malawi.",
    price: 1600,
    comparePrice: 1900,
    category: beans,
    images: [
      "https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=600"
    ],
    stock: 180,
    sku: "BN-NUA45-1K",
    isActive: true,
    isFeatured: true,
    ratings: { average: 4.6, count: 156 },
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // ==================== SOYBEANS (SOYA) ====================
  {
    name: "Soybeans - Grade A (1kg)",
    slug: "soybeans-grade-a-1kg",
    description: "Premium Grade A Malawian soybeans - high protein content ideal for making soy milk, tofu, and tempeh. Also excellent for animal feed formulation.",
    price: 1000,
    comparePrice: 1200,
    category: soybeans,
    images: [
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600"
    ],
    stock: 400,
    sku: "SB-GRA-1K",
    isActive: true,
    isFeatured: true,
    ratings: { average: 4.6, count: 178 },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Soybeans - Grade A (5kg)",
    slug: "soybeans-grade-a-5kg",
    description: "Bulk Grade A soybeans for food processors, farmers, and feed manufacturers. Malawi's most intensively marketed legume with growing demand for human consumption.",
    price: 4500,
    comparePrice: 5500,
    category: soybeans,
    images: [
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600"
    ],
    stock: 250,
    sku: "SB-GRA-5K",
    isActive: true,
    isFeatured: false,
    ratings: { average: 4.5, count: 134 },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Soybeans - Grade A (25kg)",
    slug: "soybeans-grade-a-25kg",
    description: "Commercial pack of premium soybeans. Perfect for poultry feed manufacturers, soy milk producers, and food processing businesses. Consistent quality guaranteed.",
    price: 21000,
    comparePrice: 25000,
    category: soybeans,
    images: [
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600"
    ],
    stock: 100,
    sku: "SB-GRA-25K",
    isActive: true,
    isFeatured: false,
    ratings: { average: 4.7, count: 67 },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Roasted Soy Nuts - 500g",
    slug: "roasted-soy-nuts-500g",
    description: "Crunchy roasted soybeans - a healthy high-protein snack. Low in fat, high in fiber. Perfect alternative to unhealthy snacks.",
    price: 800,
    comparePrice: 1000,
    category: soybeans,
    images: [
      "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=600"
    ],
    stock: 300,
    sku: "SB-RST-500",
    isActive: true,
    isFeatured: true,
    ratings: { average: 4.4, count: 145 },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Soy Flour - 1kg",
    slug: "soy-flour-1kg",
    description: "Fine soy flour for baking and cooking. Adds protein and nutrition to bread, porridge, and other foods. Great for making nutritious likuni phala.",
    price: 1200,
    comparePrice: 1500,
    category: soybeans,
    images: [
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600"
    ],
    stock: 200,
    sku: "SB-FLR-1K",
    isActive: true,
    isFeatured: false,
    ratings: { average: 4.5, count: 112 },
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // ==================== PIGEON PEAS (NANDOLO) ====================
  {
    name: "Pigeon Peas (Nandolo) - 1kg",
    slug: "pigeon-peas-nandolo-1kg",
    description: "Premium Malawian pigeon peas - a nutritious legume with strong export demand. Perfect for traditional nandolo dishes, dhal, and soups. High in protein and fiber.",
    price: 900,
    comparePrice: 1100,
    category: pigeonPeas,
    images: [
      "https://images.unsplash.com/photo-1515543904323-e24bd7ddbf86?w=600"
    ],
    stock: 350,
    sku: "PP-NAN-1K",
    isActive: true,
    isFeatured: true,
    ratings: { average: 4.6, count: 189 },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Pigeon Peas (Nandolo) - 5kg",
    slug: "pigeon-peas-nandolo-5kg",
    description: "Bulk pigeon peas for households and businesses. Commonly grown in doubled-up legume systems with groundnuts. Excellent shelf life and nutritional value.",
    price: 4000,
    comparePrice: 5000,
    category: pigeonPeas,
    images: [
      "https://images.unsplash.com/photo-1515543904323-e24bd7ddbf86?w=600"
    ],
    stock: 180,
    sku: "PP-NAN-5K",
    isActive: true,
    isFeatured: false,
    ratings: { average: 4.5, count: 123 },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Pigeon Peas - Export Grade (25kg)",
    slug: "pigeon-peas-export-grade-25kg",
    description: "Export-quality pigeon peas meeting international standards. Malawi has a strong export market for pigeon peas. Clean, sorted, and ready for export or processing.",
    price: 18000,
    comparePrice: 22000,
    category: pigeonPeas,
    images: [
      "https://images.unsplash.com/photo-1515543904323-e24bd7ddbf86?w=600"
    ],
    stock: 80,
    sku: "PP-EXP-25K",
    isActive: true,
    isFeatured: false,
    ratings: { average: 4.8, count: 45 },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Split Pigeon Peas (Dhal) - 1kg",
    slug: "split-pigeon-peas-dhal-1kg",
    description: "Split and dehusked pigeon peas ready for cooking. Makes delicious dhal and soups. Cooks faster than whole peas with smooth, creamy texture.",
    price: 1200,
    comparePrice: 1500,
    category: pigeonPeas,
    images: [
      "https://images.unsplash.com/photo-1563746098251-d35aef196e83?w=600"
    ],
    stock: 250,
    sku: "PP-SPL-DAL-1K",
    isActive: true,
    isFeatured: true,
    ratings: { average: 4.7, count: 167 },
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // ==================== COWPEAS (KHOBWE) ====================
  {
    name: "Cowpeas (Khobwe) - 1kg",
    slug: "cowpeas-khobwe-1kg",
    description: "Traditional Malawian cowpeas - drought-resistant and highly nutritious. Used in traditional dishes and excellent for biological nitrogen fixation in farms.",
    price: 950,
    comparePrice: 1150,
    category: cowpeas,
    images: [
      "https://images.unsplash.com/photo-1563746098251-d35aef196e83?w=600"
    ],
    stock: 280,
    sku: "CP-KHB-1K",
    isActive: true,
    isFeatured: true,
    ratings: { average: 4.4, count: 134 },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Cowpeas (Khobwe) - 5kg",
    slug: "cowpeas-khobwe-5kg",
    description: "Bulk cowpeas for families. An important food security crop that thrives even in challenging conditions. Rich in protein, vitamins, and minerals.",
    price: 4200,
    comparePrice: 5200,
    category: cowpeas,
    images: [
      "https://images.unsplash.com/photo-1563746098251-d35aef196e83?w=600"
    ],
    stock: 150,
    sku: "CP-KHB-5K",
    isActive: true,
    isFeatured: false,
    ratings: { average: 4.3, count: 87 },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Black-Eyed Peas - 1kg",
    slug: "black-eyed-peas-1kg",
    description: "Classic black-eyed peas variety of cowpea. Distinctive black spot on cream-colored bean. Popular in salads, stews, and traditional recipes.",
    price: 1000,
    comparePrice: 1200,
    category: cowpeas,
    images: [
      "https://images.unsplash.com/photo-1594472436888-0cc6d5f8c5ae?w=600"
    ],
    stock: 200,
    sku: "CP-BEP-1K",
    isActive: true,
    isFeatured: false,
    ratings: { average: 4.5, count: 112 },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Cowpea Leaves (Dried) - 500g",
    slug: "cowpea-leaves-dried-500g",
    description: "Dried cowpea leaves for traditional vegetable dishes. Nutritious leafy green vegetable commonly eaten in Malawi. Just rehydrate and cook.",
    price: 600,
    comparePrice: 800,
    category: cowpeas,
    images: [
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600"
    ],
    stock: 180,
    sku: "CP-LVS-DRY-500",
    isActive: true,
    isFeatured: false,
    ratings: { average: 4.2, count: 78 },
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // ==================== BAMBARA NUTS (NZAMA) ====================
  {
    name: "Bambara Nuts (Nzama) - 1kg",
    slug: "bambara-nuts-nzama-1kg",
    description: "Indigenous Malawian bambara groundnuts - a complete protein source containing all essential amino acids. Traditional favorite for boiling and snacking.",
    price: 1000,
    comparePrice: 1200,
    category: bambaraGroundnuts,
    images: [
      "https://images.unsplash.com/photo-1609780447631-05b93e5a88ea?w=600"
    ],
    stock: 250,
    sku: "BM-NZM-1K",
    isActive: true,
    isFeatured: true,
    ratings: { average: 4.6, count: 156 },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Bambara Nuts (Nzama) - 5kg",
    slug: "bambara-nuts-nzama-5kg",
    description: "Bulk bambara groundnuts for families and businesses. Also known as earth peas, these drought-tolerant legumes are highly nutritious and versatile.",
    price: 4500,
    comparePrice: 5500,
    category: bambaraGroundnuts,
    images: [
      "https://images.unsplash.com/photo-1609780447631-05b93e5a88ea?w=600"
    ],
    stock: 120,
    sku: "BM-NZM-5K",
    isActive: true,
    isFeatured: false,
    ratings: { average: 4.5, count: 89 },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Roasted Bambara Nuts - 500g",
    slug: "roasted-bambara-nuts-500g",
    description: "Ready-to-eat roasted bambara nuts. Crunchy, nutritious snack with a unique earthy flavor. Traditional Malawian treat.",
    price: 900,
    comparePrice: 1100,
    category: bambaraGroundnuts,
    images: [
      "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=600"
    ],
    stock: 200,
    sku: "BM-RST-500",
    isActive: true,
    isFeatured: true,
    ratings: { average: 4.7, count: 134 },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Bambara Nut Flour - 1kg",
    slug: "bambara-nut-flour-1kg",
    description: "Fine bambara nut flour for porridge, baking, and traditional recipes. Adds protein and unique flavor to nsima accompaniments and baked goods.",
    price: 1500,
    comparePrice: 1800,
    category: bambaraGroundnuts,
    images: [
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600"
    ],
    stock: 150,
    sku: "BM-FLR-1K",
    isActive: true,
    isFeatured: false,
    ratings: { average: 4.4, count: 67 },
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

print("Products created!");

print("Creating banners...");

// Banners - Malawian Legumes Theme
db.banners.insertMany([
  {
    title: "Premium Malawian Groundnuts",
    subtitle: "CG7 & Chalimbana varieties - Fresh from our farmers",
    image: "https://images.unsplash.com/photo-1567892320421-1c657571ea4a?w=1200",
    link: "/products?category=groundnuts",
    isActive: true,
    order: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Quality Beans for Your Family",
    subtitle: "Sugar beans, Nyemba & more - Protein-rich nutrition",
    image: "https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=1200",
    link: "/products?category=beans",
    isActive: true,
    order: 2,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Bulk Orders for Businesses",
    subtitle: "Export-grade legumes at competitive prices",
    image: "https://images.unsplash.com/photo-1515543904323-e24bd7ddbf86?w=1200",
    link: "/products",
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
    code: "MUGODI10",
    description: "10% off on your first order",
    discountType: "percentage",
    discountValue: 10,
    minPurchase: 5000,
    maxDiscount: 20000,
    usageLimit: 1000,
    usedCount: 0,
    startDate: new Date(),
    endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    code: "BULK20",
    description: "MWK 20,000 off on bulk orders above MWK 100,000",
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
    description: "Free delivery on orders above MWK 10,000",
    discountType: "fixed",
    discountValue: 1500,
    minPurchase: 10000,
    maxDiscount: 1500,
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
print("MUGODI LEGUMES SEED DATA COMPLETE!");
print("========================================");
print("");
print("Summary:");
print("- 14 Categories (Beans, Groundnuts, Bambara Groundnuts, Pigeon Peas, Cowpeas, Soybeans, Lentils, Chickpeas, Green Gram, Peas, Broad Beans, Lima Beans, Velvet Beans, Lablab Beans)");
print("- 32 Products (Authentic Malawian legume varieties)");
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
