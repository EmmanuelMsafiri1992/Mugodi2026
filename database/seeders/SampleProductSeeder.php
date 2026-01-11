<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Category;
use App\Models\Brand;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class SampleProductSeeder extends Seeder
{
    public function run(): void
    {
        // Clear existing products
        Product::query()->forceDelete();

        $products = [
            // Smartphones (Category 9)
            [
                'name' => 'iPhone 15 Pro Max 256GB',
                'short_description' => 'The most powerful iPhone ever with A17 Pro chip',
                'description' => 'Experience the pinnacle of smartphone technology with the iPhone 15 Pro Max. Featuring the revolutionary A17 Pro chip, a stunning 6.7-inch Super Retina XDR display, and an advanced camera system with 5x optical zoom. Crafted with aerospace-grade titanium for unmatched durability and elegance.',
                'price' => 27999.00,
                'sale_price' => 25999.00,
                'quantity' => 50,
                'category_id' => 9,
                'brand_id' => 2, // Apple
                'featured_image' => 'products/iphone-15-pro.jpg',
                'is_featured' => true,
                'is_deal_of_day' => true,
                'avg_rating' => 4.8,
                'review_count' => 245,
                'sold_count' => 1250,
            ],
            [
                'name' => 'Samsung Galaxy S24 Ultra 512GB',
                'short_description' => 'Galaxy AI powered flagship with S Pen',
                'description' => 'Unleash your creativity with the Samsung Galaxy S24 Ultra. Powered by Galaxy AI, featuring a 200MP camera, built-in S Pen, and a brilliant 6.8-inch Dynamic AMOLED display. The most intelligent Galaxy experience yet.',
                'price' => 29999.00,
                'sale_price' => 27499.00,
                'quantity' => 35,
                'category_id' => 9,
                'brand_id' => 1, // Samsung
                'featured_image' => 'products/samsung-galaxy-s24.jpg',
                'is_featured' => true,
                'is_deal_of_day' => true,
                'avg_rating' => 4.7,
                'review_count' => 189,
                'sold_count' => 980,
            ],

            // Laptops (Category 10)
            [
                'name' => 'MacBook Pro 14" M3 Pro',
                'short_description' => 'Supercharged by M3 Pro chip for pros',
                'description' => 'The MacBook Pro 14-inch with M3 Pro delivers exceptional performance for demanding workflows. Features a stunning Liquid Retina XDR display, up to 18 hours of battery life, and a pro-level camera and audio system.',
                'price' => 42999.00,
                'sale_price' => null,
                'quantity' => 25,
                'category_id' => 10,
                'brand_id' => 2, // Apple
                'featured_image' => 'products/macbook-pro.jpg',
                'is_featured' => true,
                'is_deal_of_day' => false,
                'avg_rating' => 4.9,
                'review_count' => 156,
                'sold_count' => 420,
            ],
            [
                'name' => 'Dell XPS 15 Intel Core i9',
                'short_description' => '15.6" OLED 3.5K Touch Display',
                'description' => 'Experience stunning visuals on the Dell XPS 15 with its 3.5K OLED infinity-edge display. Powered by 13th Gen Intel Core i9 processor, 32GB RAM, and 1TB SSD. Perfect for creators and professionals.',
                'price' => 38999.00,
                'sale_price' => 34999.00,
                'quantity' => 18,
                'category_id' => 10,
                'brand_id' => 8, // Dell
                'featured_image' => 'products/dell-xps.jpg',
                'is_featured' => true,
                'is_deal_of_day' => true,
                'avg_rating' => 4.6,
                'review_count' => 98,
                'sold_count' => 310,
            ],

            // TVs & Audio (Category 11)
            [
                'name' => 'Sony WH-1000XM5 Headphones',
                'short_description' => 'Industry-leading noise cancellation',
                'description' => 'The Sony WH-1000XM5 headphones offer best-in-class noise cancellation with 8 microphones and 2 processors. Crystal clear calls, 30-hour battery life, and exceptional comfort for all-day listening.',
                'price' => 7999.00,
                'sale_price' => 6499.00,
                'quantity' => 100,
                'category_id' => 11,
                'brand_id' => 4, // Sony
                'featured_image' => 'products/sony-headphones.jpg',
                'is_featured' => true,
                'is_deal_of_day' => true,
                'avg_rating' => 4.8,
                'review_count' => 512,
                'sold_count' => 2150,
            ],
            [
                'name' => 'Samsung 65" Neo QLED 8K Smart TV',
                'short_description' => 'Quantum Matrix Technology Pro',
                'description' => 'Immerse yourself in breathtaking 8K resolution with Samsung Neo QLED. Features Quantum Matrix Technology Pro, Neural Quantum Processor 8K, and Object Tracking Sound Pro for a cinema-like experience at home.',
                'price' => 54999.00,
                'sale_price' => 47999.00,
                'quantity' => 12,
                'category_id' => 11,
                'brand_id' => 1, // Samsung
                'featured_image' => 'products/samsung-tv.jpg',
                'is_featured' => true,
                'is_deal_of_day' => false,
                'avg_rating' => 4.7,
                'review_count' => 67,
                'sold_count' => 145,
            ],
            [
                'name' => 'JBL Charge 5 Bluetooth Speaker',
                'short_description' => 'Powerful sound with IP67 waterproof',
                'description' => 'Take your music anywhere with JBL Charge 5. Features powerful JBL Original Pro Sound, IP67 waterproof and dustproof rating, 20 hours of playtime, and built-in powerbank to charge your devices.',
                'price' => 3499.00,
                'sale_price' => 2999.00,
                'quantity' => 75,
                'category_id' => 11,
                'brand_id' => 4, // Sony (using as placeholder)
                'featured_image' => 'products/speaker.jpg',
                'is_featured' => false,
                'is_deal_of_day' => true,
                'avg_rating' => 4.6,
                'review_count' => 324,
                'sold_count' => 1890,
            ],

            // Fashion (Category 2)
            [
                'name' => 'Nike Air Max 270 React',
                'short_description' => 'Maximum cushioning meets futuristic design',
                'description' => 'The Nike Air Max 270 React combines two of Nike\'s best technologies - the Max Air unit and React foam - for unbelievable comfort. Features a sleek design that transitions seamlessly from workout to street.',
                'price' => 3299.00,
                'sale_price' => 2699.00,
                'quantity' => 60,
                'category_id' => 2,
                'brand_id' => 3, // Nike
                'featured_image' => 'products/nike-airmax.jpg',
                'is_featured' => true,
                'is_deal_of_day' => true,
                'avg_rating' => 4.5,
                'review_count' => 423,
                'sold_count' => 3200,
            ],
            [
                'name' => 'Adidas Ultraboost 23',
                'short_description' => 'Energy-returning comfort with BOOST',
                'description' => 'Experience incredible energy return with every stride. The Adidas Ultraboost 23 features responsive BOOST midsole, Primeknit+ upper for adaptive fit, and Continental rubber outsole for superior grip.',
                'price' => 3799.00,
                'sale_price' => null,
                'quantity' => 45,
                'category_id' => 2,
                'brand_id' => 6, // Adidas
                'featured_image' => 'products/adidas-ultraboost.jpg',
                'is_featured' => true,
                'is_deal_of_day' => false,
                'avg_rating' => 4.7,
                'review_count' => 287,
                'sold_count' => 1850,
            ],
            [
                'name' => 'Premium Cotton T-Shirt',
                'short_description' => '100% organic cotton, comfortable fit',
                'description' => 'Classic comfort meets sustainable style. Our premium cotton t-shirt is made from 100% organic cotton, features a relaxed fit, and comes in multiple colors. Perfect for everyday wear.',
                'price' => 599.00,
                'sale_price' => 449.00,
                'quantity' => 200,
                'category_id' => 2,
                'brand_id' => 3, // Nike
                'featured_image' => 'products/mens-tshirt.jpg',
                'is_featured' => false,
                'is_deal_of_day' => true,
                'avg_rating' => 4.4,
                'review_count' => 856,
                'sold_count' => 5420,
            ],
            [
                'name' => 'Elegant Summer Dress',
                'short_description' => 'Floral print midi dress for any occasion',
                'description' => 'Turn heads with this beautiful floral midi dress. Features a flattering A-line silhouette, soft breathable fabric, and elegant details perfect for summer occasions or casual outings.',
                'price' => 1299.00,
                'sale_price' => 899.00,
                'quantity' => 80,
                'category_id' => 2,
                'brand_id' => 6, // Adidas (placeholder)
                'featured_image' => 'products/womens-dress.jpg',
                'is_featured' => true,
                'is_deal_of_day' => false,
                'avg_rating' => 4.6,
                'review_count' => 234,
                'sold_count' => 1120,
            ],
            [
                'name' => 'Classic Aviator Sunglasses',
                'short_description' => 'UV400 protection with polarized lenses',
                'description' => 'Timeless style meets modern protection. These classic aviator sunglasses feature UV400 polarized lenses, lightweight metal frame, and adjustable nose pads for all-day comfort.',
                'price' => 899.00,
                'sale_price' => 699.00,
                'quantity' => 150,
                'category_id' => 2,
                'brand_id' => 3, // Nike
                'featured_image' => 'products/sunglasses.jpg',
                'is_featured' => false,
                'is_deal_of_day' => true,
                'avg_rating' => 4.3,
                'review_count' => 178,
                'sold_count' => 920,
            ],
            [
                'name' => 'Luxury Chronograph Watch',
                'short_description' => 'Stainless steel with sapphire crystal',
                'description' => 'Elevate your style with this luxurious chronograph watch. Features Japanese quartz movement, scratch-resistant sapphire crystal, stainless steel case, and water resistance up to 100m.',
                'price' => 4999.00,
                'sale_price' => 3999.00,
                'quantity' => 30,
                'category_id' => 2,
                'brand_id' => 4, // Sony (placeholder)
                'featured_image' => 'products/watch.jpg',
                'is_featured' => true,
                'is_deal_of_day' => true,
                'avg_rating' => 4.8,
                'review_count' => 89,
                'sold_count' => 340,
            ],

            // Home & Garden (Category 3)
            [
                'name' => 'De\'Longhi Espresso Machine',
                'short_description' => 'Professional barista-quality coffee at home',
                'description' => 'Brew café-quality espresso at home with this premium De\'Longhi machine. Features 15-bar pump pressure, integrated milk frother, adjustable coffee strength, and easy-to-use controls.',
                'price' => 8999.00,
                'sale_price' => 7499.00,
                'quantity' => 20,
                'category_id' => 3,
                'brand_id' => 5, // LG (placeholder)
                'featured_image' => 'products/coffee-maker.jpg',
                'is_featured' => true,
                'is_deal_of_day' => false,
                'avg_rating' => 4.7,
                'review_count' => 145,
                'sold_count' => 580,
            ],
            [
                'name' => 'Digital Air Fryer 5.5L',
                'short_description' => 'Healthy cooking with 80% less oil',
                'description' => 'Enjoy crispy, delicious food with up to 80% less oil. This digital air fryer features 8 preset cooking programs, 5.5L capacity, digital touch controls, and easy-clean non-stick basket.',
                'price' => 2499.00,
                'sale_price' => 1899.00,
                'quantity' => 55,
                'category_id' => 3,
                'brand_id' => 5, // LG
                'featured_image' => 'products/air-fryer.jpg',
                'is_featured' => false,
                'is_deal_of_day' => true,
                'avg_rating' => 4.5,
                'review_count' => 367,
                'sold_count' => 2340,
            ],
            [
                'name' => 'High-Performance Blender',
                'short_description' => '1200W motor for smoothies and more',
                'description' => 'Blend anything with this powerful 1200W blender. Features variable speed control, pulse function, BPA-free pitcher, and stainless steel blades perfect for smoothies, soups, and more.',
                'price' => 1799.00,
                'sale_price' => null,
                'quantity' => 40,
                'category_id' => 3,
                'brand_id' => 5, // LG
                'featured_image' => 'products/blender.jpg',
                'is_featured' => false,
                'is_deal_of_day' => false,
                'avg_rating' => 4.4,
                'review_count' => 234,
                'sold_count' => 1560,
            ],
            [
                'name' => 'Cordless Stick Vacuum',
                'short_description' => '60 min runtime with powerful suction',
                'description' => 'Clean your entire home cord-free with this powerful stick vacuum. Features digital motor, up to 60 minutes runtime, HEPA filtration, and transforms to handheld for versatile cleaning.',
                'price' => 6999.00,
                'sale_price' => 5499.00,
                'quantity' => 28,
                'category_id' => 3,
                'brand_id' => 5, // LG
                'featured_image' => 'products/vacuum.jpg',
                'is_featured' => true,
                'is_deal_of_day' => true,
                'avg_rating' => 4.6,
                'review_count' => 198,
                'sold_count' => 890,
            ],

            // Gaming (Category 13)
            [
                'name' => 'PlayStation 5 Console',
                'short_description' => 'Next-gen gaming with lightning speed',
                'description' => 'Experience gaming like never before with the PS5. Features ultra-high speed SSD, ray tracing, 4K gaming at 120fps, haptic feedback controller, and 3D audio for immersive gameplay.',
                'price' => 12999.00,
                'sale_price' => 11499.00,
                'quantity' => 15,
                'category_id' => 13,
                'brand_id' => 4, // Sony
                'featured_image' => 'products/ps5.jpg',
                'is_featured' => true,
                'is_deal_of_day' => true,
                'avg_rating' => 4.9,
                'review_count' => 456,
                'sold_count' => 1890,
            ],
            [
                'name' => 'Pro Gaming Chair',
                'short_description' => 'Ergonomic design for long gaming sessions',
                'description' => 'Game in comfort with this professional gaming chair. Features adjustable lumbar support, 4D armrests, 180° recline, breathable mesh fabric, and premium foam padding.',
                'price' => 5999.00,
                'sale_price' => 4499.00,
                'quantity' => 22,
                'category_id' => 13,
                'brand_id' => 4, // Sony
                'featured_image' => 'products/gaming-chair.jpg',
                'is_featured' => false,
                'is_deal_of_day' => true,
                'avg_rating' => 4.5,
                'review_count' => 167,
                'sold_count' => 720,
            ],
            [
                'name' => 'Mechanical Gaming Keyboard RGB',
                'short_description' => 'Cherry MX switches with per-key RGB',
                'description' => 'Dominate every game with this mechanical gaming keyboard. Features genuine Cherry MX switches, per-key RGB lighting, dedicated media controls, and aircraft-grade aluminum frame.',
                'price' => 2499.00,
                'sale_price' => 1999.00,
                'quantity' => 65,
                'category_id' => 13,
                'brand_id' => 7, // HP
                'featured_image' => 'products/keyboard.jpg',
                'is_featured' => false,
                'is_deal_of_day' => false,
                'avg_rating' => 4.6,
                'review_count' => 289,
                'sold_count' => 1340,
            ],
            [
                'name' => 'Wireless Gaming Mouse',
                'short_description' => '25K DPI sensor with 70-hour battery',
                'description' => 'Precision gaming without wires. Features 25,600 DPI optical sensor, LIGHTSPEED wireless technology, 70-hour battery life, and 11 programmable buttons for ultimate control.',
                'price' => 1899.00,
                'sale_price' => null,
                'quantity' => 80,
                'category_id' => 13,
                'brand_id' => 7, // HP
                'featured_image' => 'products/mouse.jpg',
                'is_featured' => false,
                'is_deal_of_day' => false,
                'avg_rating' => 4.7,
                'review_count' => 345,
                'sold_count' => 1980,
            ],

            // Cameras (Category 12)
            [
                'name' => 'Canon EOS R6 Mark II',
                'short_description' => 'Full-frame mirrorless with 24.2MP',
                'description' => 'Capture stunning images and 4K video with the Canon EOS R6 Mark II. Features 24.2MP full-frame sensor, up to 40fps continuous shooting, advanced autofocus, and in-body stabilization.',
                'price' => 52999.00,
                'sale_price' => 47999.00,
                'quantity' => 8,
                'category_id' => 12,
                'brand_id' => 9, // Canon
                'featured_image' => 'products/camera.jpg',
                'is_featured' => true,
                'is_deal_of_day' => false,
                'avg_rating' => 4.8,
                'review_count' => 78,
                'sold_count' => 210,
            ],
            [
                'name' => 'iPad Pro 12.9" M2 256GB',
                'short_description' => 'The ultimate iPad experience with M2 chip',
                'description' => 'Supercharged by the M2 chip, iPad Pro delivers next-level performance. Features stunning Liquid Retina XDR display, ProMotion technology, and works with Apple Pencil and Magic Keyboard.',
                'price' => 24999.00,
                'sale_price' => 22999.00,
                'quantity' => 20,
                'category_id' => 9,
                'brand_id' => 2, // Apple
                'featured_image' => 'products/tablet.jpg',
                'is_featured' => true,
                'is_deal_of_day' => false,
                'avg_rating' => 4.8,
                'review_count' => 134,
                'sold_count' => 560,
            ],

            // Beauty & Health (Category 5)
            [
                'name' => 'Premium Skincare Set',
                'short_description' => 'Complete routine with natural ingredients',
                'description' => 'Transform your skin with our premium skincare set. Includes cleanser, toner, serum, and moisturizer made with natural ingredients. Suitable for all skin types.',
                'price' => 1499.00,
                'sale_price' => 1199.00,
                'quantity' => 90,
                'category_id' => 5,
                'brand_id' => 5, // LG (placeholder)
                'featured_image' => 'products/skincare.jpg',
                'is_featured' => false,
                'is_deal_of_day' => true,
                'avg_rating' => 4.5,
                'review_count' => 412,
                'sold_count' => 2890,
            ],
            [
                'name' => 'Luxury Eau de Parfum 100ml',
                'short_description' => 'Long-lasting designer fragrance',
                'description' => 'Make a lasting impression with this luxurious eau de parfum. Features top notes of bergamot, heart of jasmine, and base of sandalwood. Long-lasting formula for all-day confidence.',
                'price' => 2299.00,
                'sale_price' => null,
                'quantity' => 45,
                'category_id' => 5,
                'brand_id' => 5, // LG (placeholder)
                'featured_image' => 'products/perfume.jpg',
                'is_featured' => true,
                'is_deal_of_day' => false,
                'avg_rating' => 4.6,
                'review_count' => 178,
                'sold_count' => 920,
            ],

            // Sports & Outdoors (Category 4)
            [
                'name' => 'Professional Yoga Mat',
                'short_description' => '6mm thick with non-slip surface',
                'description' => 'Elevate your practice with our professional yoga mat. Features 6mm cushioning, non-slip texture on both sides, eco-friendly materials, and includes carrying strap.',
                'price' => 799.00,
                'sale_price' => 599.00,
                'quantity' => 120,
                'category_id' => 4,
                'brand_id' => 3, // Nike
                'featured_image' => 'products/yoga-mat.jpg',
                'is_featured' => false,
                'is_deal_of_day' => true,
                'avg_rating' => 4.4,
                'review_count' => 567,
                'sold_count' => 3450,
            ],
            [
                'name' => 'Adjustable Dumbbell Set 24kg',
                'short_description' => 'Replace 15 sets of weights',
                'description' => 'Get a full gym experience at home. This adjustable dumbbell set replaces 15 sets of weights, ranging from 2.5kg to 24kg. Features quick-change dial system and durable construction.',
                'price' => 5999.00,
                'sale_price' => 4999.00,
                'quantity' => 25,
                'category_id' => 4,
                'brand_id' => 6, // Adidas
                'featured_image' => 'products/dumbbell.jpg',
                'is_featured' => true,
                'is_deal_of_day' => false,
                'avg_rating' => 4.7,
                'review_count' => 123,
                'sold_count' => 480,
            ],
            [
                'name' => 'Adventure Travel Backpack 45L',
                'short_description' => 'Water-resistant with laptop compartment',
                'description' => 'The perfect companion for any adventure. Features 45L capacity, water-resistant fabric, padded laptop compartment, multiple pockets, and ergonomic design for all-day comfort.',
                'price' => 1599.00,
                'sale_price' => 1299.00,
                'quantity' => 70,
                'category_id' => 4,
                'brand_id' => 3, // Nike
                'featured_image' => 'products/backpack.jpg',
                'is_featured' => false,
                'is_deal_of_day' => true,
                'avg_rating' => 4.5,
                'review_count' => 234,
                'sold_count' => 1560,
            ],
        ];

        foreach ($products as $productData) {
            Product::create($productData);
        }

        $this->command->info('Created ' . count($products) . ' sample products!');
    }
}
