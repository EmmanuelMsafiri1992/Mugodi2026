<x-store-layout title="Welcome to QuickCart">
    @php
        $slides = $banners->count() > 0 ? $banners : collect([
            (object)['title' => 'Mega Sale is Live!', 'subtitle' => 'Up to 70% off on thousands of items', 'button_text' => 'Shop Now', 'link' => '/deals', 'image' => null],
            (object)['title' => 'New Arrivals', 'subtitle' => 'Check out the latest trends', 'button_text' => 'Explore', 'link' => '/products', 'image' => null],
            (object)['title' => 'Free Shipping', 'subtitle' => 'On orders over R500', 'button_text' => 'Start Shopping', 'link' => '/products', 'image' => null],
        ]);
        $slideCount = $slides->count();
    @endphp

    <!-- HERO SECTION -->
    <section class="relative" id="hero-slider">
        <div class="relative h-[400px] md:h-[500px] lg:h-[550px] overflow-hidden">
            @foreach($slides as $index => $slide)
                <div class="slide absolute inset-0 {{ $index === 0 ? 'opacity-100' : 'opacity-0' }} transition-opacity duration-1000">
                    <!-- Background Image -->
                    @if($slide->image)
                        <div class="absolute inset-0 z-0">
                            <img src="{{ asset('storage/' . $slide->image) }}" class="w-full h-full object-cover" alt="{{ $slide->title }}">
                        </div>
                        <div class="absolute inset-0 z-[1] bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
                    @else
                        <div class="absolute inset-0 z-0 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700">
                            <div class="absolute inset-0">
                                <div class="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.05\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
                                <div class="absolute -top-40 -right-40 w-96 h-96 bg-pink-500/30 rounded-full blur-3xl"></div>
                                <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl"></div>
                            </div>
                        </div>
                    @endif

                    <!-- Content -->
                    <div class="relative z-[2] h-full flex items-center">
                        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                            <div class="max-w-2xl">
                                <span class="inline-block px-4 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-4">
                                    Limited Time Offer
                                </span>
                                <h1 class="text-4xl md:text-5xl lg:text-7xl font-black text-white mb-4 leading-tight">
                                    {{ $slide->title }}
                                </h1>
                                <p class="text-xl md:text-2xl text-white/90 mb-8">{{ $slide->subtitle }}</p>
                                <div class="flex flex-wrap gap-4">
                                    <a href="{{ $slide->link ?? '/products' }}" class="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-yellow-400 hover:scale-105 transition-all shadow-2xl">
                                        {{ $slide->button_text ?? 'Shop Now' }}
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                                    </a>
                                    <a href="/deals" class="inline-flex items-center gap-2 bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-gray-900 transition-all">
                                        View Deals
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            @endforeach

            <!-- Slider Controls -->
            <button onclick="prevSlide()" class="absolute left-4 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/90 hover:bg-white rounded-full flex items-center justify-center text-gray-800 shadow-xl z-10 hover:scale-110 transition-all">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
            </button>
            <button onclick="nextSlide()" class="absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/90 hover:bg-white rounded-full flex items-center justify-center text-gray-800 shadow-xl z-10 hover:scale-110 transition-all">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            </button>

            <!-- Dots -->
            <div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
                @for($i = 0; $i < $slideCount; $i++)
                    <button onclick="goToSlide({{ $i }})" class="slide-dot w-3 h-3 rounded-full transition-all {{ $i === 0 ? 'bg-white w-10' : 'bg-white/50' }}"></button>
                @endfor
            </div>
        </div>
    </section>

    <!-- QUICK FEATURES -->
    <section class="bg-white py-6 shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                <div class="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100">
                    <div class="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                    </div>
                    <div>
                        <p class="font-bold text-gray-900">Genuine Products</p>
                        <p class="text-sm text-gray-500">100% Authentic</p>
                    </div>
                </div>
                <div class="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100">
                    <div class="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"/></svg>
                    </div>
                    <div>
                        <p class="font-bold text-gray-900">Free Delivery</p>
                        <p class="text-sm text-gray-500">Orders over R500</p>
                    </div>
                </div>
                <div class="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-100">
                    <div class="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                    </div>
                    <div>
                        <p class="font-bold text-gray-900">Easy Returns</p>
                        <p class="text-sm text-gray-500">30 Day Policy</p>
                    </div>
                </div>
                <div class="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-100">
                    <div class="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
                    </div>
                    <div>
                        <p class="font-bold text-gray-900">24/7 Support</p>
                        <p class="text-sm text-gray-500">Here to help</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- CATEGORIES SLIDER SECTION -->
    <section class="py-12 bg-gray-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between mb-8">
                <div>
                    <h2 class="text-3xl md:text-4xl font-black text-gray-900 mb-2">Shop by Category</h2>
                    <p class="text-gray-500">Find what you're looking for</p>
                </div>
                <div class="flex gap-2">
                    <button onclick="scrollCategorySlider(-1)" class="w-12 h-12 bg-white hover:bg-purple-600 hover:text-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 border border-gray-100">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
                    </button>
                    <button onclick="scrollCategorySlider(1)" class="w-12 h-12 bg-white hover:bg-purple-600 hover:text-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 border border-gray-100">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                    </button>
                </div>
            </div>

            <!-- Category Slider -->
            <div class="relative">
                <div id="category-slider" class="flex gap-6 overflow-x-auto scroll-smooth pb-4 -mx-4 px-4" style="scrollbar-width: none; -ms-overflow-style: none;">
                    @php
                        $categoryColors = [
                            ['bg-gradient-to-br from-pink-500 to-rose-600', 'bg-pink-100'],
                            ['bg-gradient-to-br from-blue-500 to-indigo-600', 'bg-blue-100'],
                            ['bg-gradient-to-br from-green-500 to-emerald-600', 'bg-green-100'],
                            ['bg-gradient-to-br from-purple-500 to-violet-600', 'bg-purple-100'],
                            ['bg-gradient-to-br from-orange-500 to-amber-600', 'bg-orange-100'],
                            ['bg-gradient-to-br from-teal-500 to-cyan-600', 'bg-teal-100'],
                            ['bg-gradient-to-br from-red-500 to-pink-600', 'bg-red-100'],
                            ['bg-gradient-to-br from-indigo-500 to-purple-600', 'bg-indigo-100'],
                        ];
                        $categoryIcons = [
                            '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>',
                            '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>',
                            '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>',
                            '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"/>',
                            '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>',
                            '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>',
                            '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>',
                            '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"/>',
                        ];
                    @endphp
                    @foreach($categories as $index => $category)
                        <a href="/?category={{ $category->id }}" class="group flex-shrink-0 w-[200px] md:w-[240px]">
                            <div class="relative {{ $categoryColors[$index % 8][0] }} rounded-3xl p-6 h-[180px] md:h-[200px] overflow-hidden transition-all duration-500 group-hover:scale-[1.02] group-hover:shadow-2xl">
                                <!-- Background Pattern -->
                                <div class="absolute inset-0 opacity-10">
                                    <div class="absolute -right-8 -bottom-8 w-40 h-40 border-[20px] border-white rounded-full"></div>
                                    <div class="absolute -left-4 -top-4 w-24 h-24 border-[15px] border-white rounded-full"></div>
                                </div>

                                <!-- Icon -->
                                <div class="relative w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        {!! $categoryIcons[$index % 8] !!}
                                    </svg>
                                </div>

                                <!-- Content -->
                                <div class="relative">
                                    <h3 class="text-white font-bold text-lg mb-1 line-clamp-2">{{ $category->name }}</h3>
                                    <p class="text-white/70 text-sm">{{ $category->products_count }} {{ $category->products_count == 1 ? 'item' : 'items' }}</p>
                                </div>

                                <!-- Arrow -->
                                <div class="absolute bottom-6 right-6 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                                </div>
                            </div>
                        </a>
                    @endforeach
                </div>
            </div>
        </div>
        <style>
            #category-slider::-webkit-scrollbar { display: none; }
        </style>
    </section>

    <!-- FLASH DEALS BANNER -->
    <section class="py-8 bg-gradient-to-r from-red-600 via-pink-600 to-purple-600">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex flex-col md:flex-row items-center justify-between gap-4">
                <div class="flex items-center gap-4">
                    <div class="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center animate-pulse">
                        <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd"/></svg>
                    </div>
                    <div>
                        <h3 class="text-2xl md:text-3xl font-black text-white">Flash Deals!</h3>
                        <p class="text-white/80">Limited time offers - Don't miss out!</p>
                    </div>
                </div>
                <a href="/deals" class="bg-white text-pink-600 px-8 py-3 rounded-full font-bold hover:bg-yellow-300 hover:text-gray-900 transition-all hover:scale-105">
                    View All Deals →
                </a>
            </div>
        </div>
    </section>

    <!-- PRODUCTS SECTION -->
    <section class="py-12 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <!-- Section Header -->
            <div class="flex items-center justify-between mb-8">
                <div>
                    <h2 class="text-3xl md:text-4xl font-black text-gray-900">
                        @if(request('category'))
                            {{ $categories->firstWhere('id', request('category'))?->name ?? 'Products' }}
                        @else
                            Trending Products
                        @endif
                    </h2>
                    <p class="text-gray-500 mt-1">{{ $products->total() }} products available</p>
                </div>
                <div class="flex items-center gap-2">
                    <select onchange="window.location.href = updateQueryStringParameter(window.location.href, 'sort', this.value)"
                            class="bg-gray-100 border-0 rounded-full px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-purple-500">
                        <option value="newest" {{ request('sort', 'newest') == 'newest' ? 'selected' : '' }}>Newest</option>
                        <option value="price_low" {{ request('sort') == 'price_low' ? 'selected' : '' }}>Price: Low to High</option>
                        <option value="price_high" {{ request('sort') == 'price_high' ? 'selected' : '' }}>Price: High to Low</option>
                        <option value="popular" {{ request('sort') == 'popular' ? 'selected' : '' }}>Popular</option>
                    </select>
                </div>
            </div>

            <div class="flex flex-col lg:flex-row gap-8">
                <!-- Sidebar Filters -->
                <aside class="lg:w-64 flex-shrink-0">
                    <div class="bg-gray-50 rounded-3xl p-6 sticky top-24">
                        <h3 class="font-black text-gray-900 text-lg mb-6 flex items-center gap-2">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/></svg>
                            Filters
                        </h3>

                        <!-- Categories Filter -->
                        <div class="mb-6">
                            <h4 class="font-bold text-gray-700 mb-3 text-sm">Categories</h4>
                            <div class="space-y-2 max-h-60 overflow-y-auto pr-2">
                                @foreach($categories as $cat)
                                    <a href="/?category={{ $cat->id }}"
                                       class="flex items-center justify-between p-3 rounded-xl text-sm transition-all {{ request('category') == $cat->id ? 'bg-purple-600 text-white shadow-lg' : 'bg-white text-gray-700 hover:bg-purple-50' }}">
                                        <span class="font-medium">{{ $cat->name }}</span>
                                        <span class="text-xs {{ request('category') == $cat->id ? 'bg-white/20' : 'bg-gray-100' }} px-2 py-1 rounded-full">{{ $cat->products_count }}</span>
                                    </a>
                                @endforeach
                            </div>
                        </div>

                        <!-- Brand Filter -->
                        @if($brands->count() > 0)
                        <div class="mb-6">
                            <h4 class="font-bold text-gray-700 mb-3 text-sm">Brand</h4>
                            <select name="brand" onchange="window.location.href = updateQueryStringParameter(window.location.href, 'brand', this.value)"
                                    class="w-full bg-white border-0 rounded-xl p-3 text-sm font-medium shadow-sm focus:ring-2 focus:ring-purple-500">
                                <option value="">All Brands</option>
                                @foreach($brands as $brand)
                                    <option value="{{ $brand->id }}" {{ request('brand') == $brand->id ? 'selected' : '' }}>{{ $brand->name }}</option>
                                @endforeach
                            </select>
                        </div>
                        @endif

                        <!-- Sale Filter -->
                        <div class="mb-6">
                            <label class="flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl cursor-pointer border-2 border-transparent hover:border-red-200 transition-all {{ request('sale') ? 'border-red-400' : '' }}">
                                <div class="flex items-center gap-3">
                                    <span class="text-2xl">🔥</span>
                                    <span class="font-bold text-gray-800">On Sale</span>
                                </div>
                                <input type="checkbox" {{ request('sale') ? 'checked' : '' }} onchange="window.location.href = this.checked ? updateQueryStringParameter(window.location.href, 'sale', '1') : removeQueryStringParameter(window.location.href, 'sale')" class="w-5 h-5 rounded-lg text-red-500 focus:ring-red-500">
                            </label>
                        </div>

                        @if(request('category') || request('brand') || request('sale'))
                            <a href="/" class="flex items-center justify-center gap-2 w-full py-3 bg-gray-200 hover:bg-red-100 text-gray-700 hover:text-red-600 rounded-xl font-bold transition-all">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                                Clear Filters
                            </a>
                        @endif
                    </div>
                </aside>

                <!-- Products Grid -->
                <div class="flex-1">
                    @if($products->count() > 0)
                        <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                            @foreach($products as $product)
                                <div class="group bg-white rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100">
                                    <a href="/product/{{ $product->slug }}" class="block">
                                        <!-- Image -->
                                        <div class="relative aspect-square bg-gray-100 overflow-hidden">
                                            @if($product->featured_image)
                                                <img src="{{ asset('storage/' . $product->featured_image) }}" alt="{{ $product->name }}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">
                                            @else
                                                <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                                                    <svg class="w-20 h-20 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                                                </div>
                                            @endif

                                            <!-- Badges -->
                                            @if($product->is_on_sale)
                                                <div class="absolute top-3 left-3">
                                                    <span class="bg-red-500 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-lg">
                                                        -{{ $product->discount_percentage }}%
                                                    </span>
                                                </div>
                                            @endif

                                            <!-- Wishlist -->
                                            <button class="absolute top-3 right-3 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 hover:scale-110">
                                                <svg class="w-5 h-5 text-gray-400 hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
                                            </button>

                                            <!-- Quick Add -->
                                            <div class="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-all">
                                                <form action="/cart/add" method="POST">
                                                    @csrf
                                                    <input type="hidden" name="product_id" value="{{ $product->id }}">
                                                    <input type="hidden" name="quantity" value="1">
                                                    <button type="submit" class="w-full bg-white hover:bg-yellow-400 text-gray-900 py-2.5 rounded-xl font-bold text-sm transition-all">
                                                        Add to Cart
                                                    </button>
                                                </form>
                                            </div>
                                        </div>

                                        <!-- Details -->
                                        <div class="p-4">
                                            @if($product->brand)
                                                <p class="text-xs text-purple-600 font-semibold uppercase tracking-wider mb-1">{{ $product->brand->name }}</p>
                                            @endif
                                            <h3 class="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">{{ $product->name }}</h3>

                                            <!-- Price -->
                                            <div class="flex items-center gap-2">
                                                <span class="text-xl font-black text-gray-900">R{{ number_format($product->current_price, 0) }}</span>
                                                @if($product->is_on_sale)
                                                    <span class="text-sm text-gray-400 line-through">R{{ number_format($product->price, 0) }}</span>
                                                @endif
                                            </div>

                                            <!-- Rating Stars (placeholder) -->
                                            <div class="flex items-center gap-1 mt-2">
                                                @for($i = 0; $i < 5; $i++)
                                                    <svg class="w-4 h-4 {{ $i < 4 ? 'text-yellow-400' : 'text-gray-200' }}" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                                                @endfor
                                                <span class="text-xs text-gray-400 ml-1">({{ rand(10, 200) }})</span>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                            @endforeach
                        </div>

                        <!-- Pagination -->
                        <div class="mt-12">
                            {{ $products->withQueryString()->links() }}
                        </div>
                    @else
                        <div class="text-center py-20">
                            <div class="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg class="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                            </div>
                            <h3 class="text-2xl font-black text-gray-900 mb-2">No Products Found</h3>
                            <p class="text-gray-500 mb-6">Try adjusting your filters</p>
                            <a href="/" class="inline-flex items-center gap-2 bg-purple-600 text-white px-8 py-4 rounded-full font-bold hover:bg-purple-700 transition-all">
                                View All Products
                            </a>
                        </div>
                    @endif
                </div>
            </div>
        </div>
    </section>

    <!-- NEWSLETTER -->
    <section class="py-16 bg-gradient-to-r from-purple-600 via-pink-600 to-red-500">
        <div class="max-w-4xl mx-auto px-4 text-center">
            <h2 class="text-3xl md:text-4xl font-black text-white mb-4">Get 10% Off Your First Order!</h2>
            <p class="text-white/80 mb-8 text-lg">Subscribe to our newsletter for exclusive deals and updates</p>
            <form class="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
                <input type="email" placeholder="Enter your email" class="flex-1 px-6 py-4 rounded-full text-gray-900 font-medium focus:outline-none focus:ring-4 focus:ring-white/30">
                <button type="submit" class="bg-gray-900 hover:bg-black text-white px-8 py-4 rounded-full font-bold hover:scale-105 transition-all">
                    Subscribe
                </button>
            </form>
        </div>
    </section>

    <!-- SCRIPTS -->
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // Hero Slider
            let currentSlide = 0;
            const totalSlides = {{ $slideCount }};
            const slides = document.querySelectorAll('#hero-slider .slide');
            const dots = document.querySelectorAll('#hero-slider .slide-dot');

            function showSlide(index) {
                slides.forEach((s, i) => {
                    s.classList.toggle('opacity-0', i !== index);
                    s.classList.toggle('opacity-100', i === index);
                });
                dots.forEach((d, i) => {
                    d.classList.toggle('bg-white', i === index);
                    d.classList.toggle('w-10', i === index);
                    d.classList.toggle('bg-white/50', i !== index);
                    d.classList.toggle('w-3', i !== index);
                });
                currentSlide = index;
            }

            window.nextSlide = () => showSlide((currentSlide + 1) % totalSlides);
            window.prevSlide = () => showSlide((currentSlide - 1 + totalSlides) % totalSlides);
            window.goToSlide = (i) => showSlide(i);

            setInterval(window.nextSlide, 5000);

            // Category Slider
            const categorySlider = document.getElementById('category-slider');
            window.scrollCategorySlider = function(direction) {
                const scrollAmount = 260; // Card width + gap
                categorySlider.scrollBy({
                    left: direction * scrollAmount,
                    behavior: 'smooth'
                });
            };
        });

        function updateQueryStringParameter(uri, key, value) {
            const re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
            const separator = uri.indexOf('?') !== -1 ? "&" : "?";
            return uri.match(re) ? uri.replace(re, '$1' + key + "=" + value + '$2') : uri + separator + key + "=" + value;
        }

        function removeQueryStringParameter(uri, key) {
            const re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
            if (uri.match(re)) {
                uri = uri.replace(re, '$1$2').replace(/[?&]$/, '').replace(/([?&])&/, '$1');
            }
            return uri;
        }
    </script>
</x-store-layout>
