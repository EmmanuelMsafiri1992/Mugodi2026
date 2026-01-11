<x-store-layout title="{{ $category->name }}">
    <!-- Category Header -->
    <section class="bg-gradient-to-r from-[#0b79bf] to-[#085a91] text-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <nav class="flex items-center gap-2 text-sm text-white/70 mb-4">
                <a href="/" class="hover:text-white">Home</a>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
                <span class="text-white">{{ $category->name }}</span>
            </nav>
            <h1 class="text-3xl md:text-4xl font-bold mb-2">{{ $category->name }}</h1>
            <p class="text-white/60 text-sm mt-2">{{ $products->total() }} products found</p>
        </div>
    </section>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex flex-col lg:flex-row gap-8">
            <!-- Sidebar Filters -->
            <aside class="lg:w-64 flex-shrink-0">
                <div class="bg-white rounded-xl shadow-sm p-6 sticky top-20">
                    <h3 class="font-bold text-gray-900 mb-4">Filters</h3>
                    <form action="" method="GET">
                        <div class="mb-6">
                            <h4 class="font-semibold text-gray-700 mb-3 text-sm">Categories</h4>
                            <div class="space-y-2">
                                @foreach($categories as $cat)
                                    <a href="/category/{{ $cat->slug }}" class="flex items-center justify-between py-1.5 px-2 rounded-lg text-sm {{ $cat->id === $category->id ? 'bg-[#0b79bf] text-white' : 'text-gray-600 hover:bg-gray-100' }}">
                                        <span>{{ $cat->name }}</span>
                                        <span class="text-xs">{{ $cat->products_count }}</span>
                                    </a>
                                @endforeach
                            </div>
                        </div>
                        @if($brands->count() > 0)
                        <div class="mb-6">
                            <h4 class="font-semibold text-gray-700 mb-3 text-sm">Brand</h4>
                            <select name="brand" class="w-full border-gray-300 rounded-lg text-sm" onchange="this.form.submit()">
                                <option value="">All Brands</option>
                                @foreach($brands as $brand)
                                    <option value="{{ $brand->id }}" {{ request("brand") == $brand->id ? "selected" : "" }}>{{ $brand->name }}</option>
                                @endforeach
                            </select>
                        </div>
                        @endif
                        <div class="mb-6">
                            <label class="flex items-center gap-2">
                                <input type="checkbox" name="sale" value="1" {{ request("sale") ? "checked" : "" }} class="rounded" onchange="this.form.submit()">
                                <span class="text-sm">On Sale Only</span>
                            </label>
                        </div>
                        <button type="submit" class="w-full bg-[#0b79bf] text-white py-2.5 rounded-lg font-semibold hover:bg-[#0a6aa8]">Apply Filters</button>
                    </form>
                </div>
            </aside>

            <!-- Products Grid -->
            <div class="flex-1">
                <div class="bg-white rounded-xl shadow-sm p-4 mb-6 flex items-center justify-between">
                    <p class="text-gray-600 text-sm">{{ $products->total() }} products</p>
                    <select onchange="window.location.href = this.value" class="border-gray-300 rounded-lg text-sm">
                        <option value="?sort=newest" {{ request("sort") == "newest" ? "selected" : "" }}>Newest</option>
                        <option value="?sort=price_low" {{ request("sort") == "price_low" ? "selected" : "" }}>Price: Low to High</option>
                        <option value="?sort=price_high" {{ request("sort") == "price_high" ? "selected" : "" }}>Price: High to Low</option>
                        <option value="?sort=popular" {{ request("sort") == "popular" ? "selected" : "" }}>Most Popular</option>
                    </select>
                </div>

                @if($products->count() > 0)
                    <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                        @foreach($products as $product)
                            @include("partials.product-card", ["product" => $product])
                        @endforeach
                    </div>
                    <div class="mt-8">{{ $products->withQueryString()->links() }}</div>
                @else
                    <div class="bg-white rounded-xl shadow-sm p-12 text-center">
                        <h3 class="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
                        <p class="text-gray-500">Try adjusting your filters.</p>
                    </div>
                @endif
            </div>
        </div>
    </div>
</x-store-layout>