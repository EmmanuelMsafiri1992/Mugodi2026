<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Category;
use App\Models\Brand;
use App\Models\Product;
use App\Models\Banner;
use App\Models\Coupon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        // Create admin user
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@elton.test',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
            'role' => 'admin',
        ]);

        // Create test customer
        User::create([
            'name' => 'Test Customer',
            'email' => 'customer@elton.test',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
            'role' => 'customer',
        ]);

        // Create categories
        $categories = [
            ['name' => 'Electronics', 'is_featured' => true],
            ['name' => 'Fashion', 'is_featured' => true],
            ['name' => 'Home & Garden', 'is_featured' => true],
            ['name' => 'Sports & Outdoors', 'is_featured' => true],
            ['name' => 'Beauty & Health', 'is_featured' => true],
            ['name' => 'Toys & Games', 'is_featured' => true],
            ['name' => 'Books & Media', 'is_featured' => false],
            ['name' => 'Groceries', 'is_featured' => false],
        ];

        foreach ($categories as $cat) {
            Category::create([
                'name' => $cat['name'],
                'slug' => Str::slug($cat['name']),
                'is_active' => true,
                'is_featured' => $cat['is_featured'],
            ]);
        }

        // Create subcategories for Electronics
        $electronics = Category::where('slug', 'electronics')->first();
        $subCategories = ['Smartphones', 'Laptops', 'TVs & Audio', 'Cameras', 'Gaming'];
        foreach ($subCategories as $sub) {
            Category::create([
                'name' => $sub,
                'slug' => Str::slug($sub),
                'parent_id' => $electronics->id,
                'is_active' => true,
            ]);
        }

        // Create brands
        $brands = ['Samsung', 'Apple', 'Nike', 'Sony', 'LG', 'Adidas', 'HP', 'Dell', 'Canon', 'Puma'];
        foreach ($brands as $brand) {
            Brand::create([
                'name' => $brand,
                'slug' => Str::slug($brand),
                'is_active' => true,
            ]);
        }

        $this->createProducts();
        $this->createBanners();
        $this->createCoupons();
    }

    private function createProducts(): void
    {
        $electronicsId = Category::where('slug', 'electronics')->first()->id;
        $fashionId = Category::where('slug', 'fashion')->first()->id;
        $sportsId = Category::where('slug', 'sports-outdoors')->first()->id;
        $samsungId = Brand::where('slug', 'samsung')->first()->id;
        $appleId = Brand::where('slug', 'apple')->first()->id;
        $nikeId = Brand::where('slug', 'nike')->first()->id;
        $sonyId = Brand::where('slug', 'sony')->first()->id;

        $products = [
            ['name' => 'Samsung Galaxy S24 Ultra', 'description' => 'The ultimate smartphone with AI capabilities, titanium frame, and 200MP camera.', 'price' => 29999.00, 'sale_price' => 27499.00, 'category_id' => $electronicsId, 'brand_id' => $samsungId, 'quantity' => 50, 'is_featured' => true],
            ['name' => 'Apple iPhone 15 Pro Max', 'description' => 'Pro. Beyond. Titanium design, A17 Pro chip, and advanced camera system.', 'price' => 32999.00, 'sale_price' => null, 'category_id' => $electronicsId, 'brand_id' => $appleId, 'quantity' => 35, 'is_featured' => true],
            ['name' => 'Samsung 65 inch QLED 4K Smart TV', 'description' => 'Quantum Dot technology for incredible color and clarity.', 'price' => 24999.00, 'sale_price' => 19999.00, 'category_id' => $electronicsId, 'brand_id' => $samsungId, 'quantity' => 20, 'is_featured' => true],
            ['name' => 'Sony WH-1000XM5 Headphones', 'description' => 'Industry-leading noise cancellation with exceptional sound quality.', 'price' => 7999.00, 'sale_price' => 6999.00, 'category_id' => $electronicsId, 'brand_id' => $sonyId, 'quantity' => 100, 'is_featured' => true],
            ['name' => 'Nike Air Max 270', 'description' => 'Max Air unit delivers unrivaled comfort.', 'price' => 2999.00, 'sale_price' => 2499.00, 'category_id' => $fashionId, 'brand_id' => $nikeId, 'quantity' => 75, 'is_featured' => true],
            ['name' => 'Apple MacBook Air M3', 'description' => 'Supercharged by M3 chip. Strikingly thin design with up to 18 hours of battery life.', 'price' => 24999.00, 'sale_price' => null, 'category_id' => $electronicsId, 'brand_id' => $appleId, 'quantity' => 25, 'is_featured' => true],
            ['name' => 'Nike Dri-FIT Running Shirt', 'description' => 'Sweat-wicking technology keeps you dry and comfortable.', 'price' => 799.00, 'sale_price' => 599.00, 'category_id' => $sportsId, 'brand_id' => $nikeId, 'quantity' => 200, 'is_featured' => false],
            ['name' => 'Samsung Galaxy Buds2 Pro', 'description' => 'Hi-Fi sound with intelligent ANC.', 'price' => 4499.00, 'sale_price' => 3499.00, 'category_id' => $electronicsId, 'brand_id' => $samsungId, 'quantity' => 80, 'is_featured' => false],
            ['name' => 'Apple Watch Series 9', 'description' => 'Smarter. Brighter. Mightier.', 'price' => 9999.00, 'sale_price' => null, 'category_id' => $electronicsId, 'brand_id' => $appleId, 'quantity' => 40, 'is_featured' => true],
            ['name' => 'Sony PlayStation 5', 'description' => 'Experience lightning-fast loading, haptic feedback, and 3D Audio.', 'price' => 12999.00, 'sale_price' => 11499.00, 'category_id' => $electronicsId, 'brand_id' => $sonyId, 'quantity' => 15, 'is_featured' => true],
        ];

        foreach ($products as $productData) {
            Product::create([
                'name' => $productData['name'],
                'slug' => Str::slug($productData['name']),
                'description' => $productData['description'],
                'short_description' => Str::limit($productData['description'], 100),
                'price' => $productData['price'],
                'sale_price' => $productData['sale_price'],
                'category_id' => $productData['category_id'],
                'brand_id' => $productData['brand_id'],
                'quantity' => $productData['quantity'],
                'sku' => 'SKU-' . strtoupper(Str::random(8)),
                'is_active' => true,
                'is_featured' => $productData['is_featured'],
                'avg_rating' => rand(35, 50) / 10,
                'review_count' => rand(10, 500),
            ]);
        }
    }

    private function createBanners(): void
    {
        Banner::create([
            'title' => 'Blue Dot Sale',
            'subtitle' => 'Up to 50% off on Electronics',
            'image' => 'banners/blue-dot-sale.jpg',
            'button_text' => 'Shop Now',
            'link' => '/products?category=1&sale=1',
            'is_active' => true,
            'position' => 'hero',
            'order' => 1,
        ]);

        Banner::create([
            'title' => 'New Arrivals',
            'subtitle' => 'Check out the latest products',
            'image' => 'banners/new-arrivals.jpg',
            'button_text' => 'Explore',
            'link' => '/products?sort=newest',
            'is_active' => true,
            'position' => 'hero',
            'order' => 2,
        ]);

        Banner::create([
            'title' => 'Free Delivery',
            'subtitle' => 'On orders over R500',
            'image' => 'banners/free-delivery.jpg',
            'button_text' => 'Learn More',
            'link' => '/products',
            'is_active' => true,
            'position' => 'hero',
            'order' => 3,
        ]);
    }

    private function createCoupons(): void
    {
        Coupon::create([
            'code' => 'WELCOME10',
            'name' => 'Welcome Discount',
            'description' => 'Get 10% off on your first order',
            'type' => 'percentage',
            'value' => 10,
            'min_order_amount' => 500,
            'usage_limit' => 1000,
            'usage_count' => 0,
            'starts_at' => now(),
            'expires_at' => now()->addMonths(3),
            'is_active' => true,
        ]);

        Coupon::create([
            'code' => 'SAVE50',
            'name' => 'Save R50',
            'description' => 'Get R50 off on orders over R300',
            'type' => 'fixed',
            'value' => 50,
            'min_order_amount' => 300,
            'usage_limit' => 500,
            'usage_count' => 0,
            'starts_at' => now(),
            'expires_at' => now()->addMonth(),
            'is_active' => true,
        ]);
    }
}
