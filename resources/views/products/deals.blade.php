<x-store-layout title="Products">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex flex-col lg:flex-row gap-8">
            <!-- Sidebar Filters -->
            <aside class="lg:w-64 flex-shrink-0">
                <div class="bg-white rounded-lg shadow p-6">
                    <h3 class="font-semibold text-gray-900 mb-4">Filters</h3>
                    
                    <form action="" method="GET">
                        <!-- Categories -->
                        <div class="mb-6">
                            <h4 class="font-medium text-gray-700 mb-2">Category</h4>
                            <select name="category" class="w-full border-gray-300 rounded-lg" onchange="this.form.submit()">
                                <option value="">All Categories</option>
                                @foreach($categories as $category)
                                    <option value="{{ $category->id }}" {{ request("category") == $category->id ? "selected" : "" }}>
                                        {{ $category->name }} ({{ $category->products_count }})
                                    </option>
                                @endforeach
                            </select>
                        </div>

                        <!-- Brands -->
                        <div class="mb-6">
                            <h4 class="font-medium text-gray-700 mb-2">Brand</h4>
                            <select name="brand" class="w-full border-gray-300 rounded-lg" onchange="this.form.submit()">
                                <option value="">All Brands</option>
                                @foreach($brands as $brand)
                                    <option value="{{ $brand->id }}" {{ request("brand") == $brand->id ? "selected" : "" }}>
                                        {{ $brand->name }} ({{ $brand->products_count }})
                                    </option>
                                @endforeach
                            </select>
                        </div>

                        <!-- Price Range -->
                        <div class="mb-6">
                            <h4 class="font-medium text-gray-700 mb-2">Price Range</h4>
                            <div class="flex gap-2">
                                <input type="number" name="min_price" placeholder="Min" value="{{ request("min_price") }}"
                                       class="w-1/2 border-gray-300 rounded-lg text-sm">
                                <input type="number" name="max_price" placeholder="Max" value="{{ request("max_price") }}"
                                       class="w-1/2 border-gray-300 rounded-lg text-sm">
                            </div>
                        </div>

                        <!-- Sale -->
                        <div class="mb-6">
                            <label class="flex items-center">
                                <input type="checkbox" name="sale" value="1" {{ request("sale") ? "checked" : "" }}
                                       class="rounded border-gray-300" onchange="this.form.submit()">
                                <span class="ml-2 text-gray-700">On Sale Only</span>
                            </label>
                        </div>

                        <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                            Apply Filters
                        </button>
                    </form>
                </div>
            </aside>

            <!-- Products Grid -->
            <div class="flex-1">
                <!-- Sort & Results -->
                <div class="bg-white rounded-lg shadow p-4 mb-6 flex items-center justify-between">
                    <p class="text-gray-600">{{ $products->total() }} products found</p>
                    <div class="flex items-center gap-4">
                        <label class="text-gray-600">Sort by:</label>
                        <select onchange="window.location.href = updateQueryString("sort", this.value)"
                                class="border-gray-300 rounded-lg">
                            <option value="newest" {{ request("sort") == "newest" ? "selected" : "" }}>Newest</option>
                            <option value="price_low" {{ request("sort") == "price_low" ? "selected" : "" }}>Price: Low to High</option>
                            <option value="price_high" {{ request("sort") == "price_high" ? "selected" : "" }}>Price: High to Low</option>
                            <option value="popular" {{ request("sort") == "popular" ? "selected" : "" }}>Most Popular</option>
                            <option value="rating" {{ request("sort") == "rating" ? "selected" : "" }}>Best Rated</option>
                        </select>
                    </div>
                </div>

                @if($products->count() > 0)
                    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        @foreach($products as $product)
                            @include("partials.product-card", ["product" => $product])
                        @endforeach
                    </div>

                    <div class="mt-8">
                        {{ $products->withQueryString()->links() }}
                    </div>
                @else
                    <div class="bg-white rounded-lg shadow p-12 text-center">
                        <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        <h3 class="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                        <p class="text-gray-500">Try adjusting your filters or search criteria.</p>
                    </div>
                @endif
            </div>
        </div>
    </div>

    <script>
        function updateQueryString(key, value) {
            const url = new URL(window.location.href);
            url.searchParams.set(key, value);
            return url.toString();
        }
    </script>
</x-store-layout>