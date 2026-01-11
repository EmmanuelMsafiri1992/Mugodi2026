<x-store-layout :title="$product->name">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Breadcrumb -->
        <nav class="text-sm mb-6">
            <ol class="flex items-center space-x-2">
                <li><a href="/" class="text-gray-500 hover:text-gray-700">Home</a></li>
                <li class="text-gray-400">/</li>
                <li><a href="/category/{{ $product->category->slug }}" class="text-gray-500 hover:text-gray-700">{{ $product->category->name }}</a></li>
                <li class="text-gray-400">/</li>
                <li class="text-gray-900">{{ $product->name }}</li>
            </ol>
        </nav>

        <div class="bg-white rounded-lg shadow-lg overflow-hidden">
            <div class="lg:flex">
                <!-- Product Images -->
                <div class="lg:w-1/2 p-6">
                    <div class="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                        @if($product->featured_image)
                            <img src="{{ asset('storage/' . $product->featured_image) }}" 
                                 alt="{{ $product->name }}" 
                                 class="w-full h-full object-contain">
                        @else
                            <div class="w-full h-full flex items-center justify-center">
                                <svg class="w-24 h-24 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                </svg>
                            </div>
                        @endif
                    </div>
                </div>

                <!-- Product Info -->
                <div class="lg:w-1/2 p-6 lg:border-l">
                    @if($product->brand)
                        <p class="text-sm text-blue-600 mb-2">{{ $product->brand->name }}</p>
                    @endif

                    <h1 class="text-2xl font-bold text-gray-900 mb-4">{{ $product->name }}</h1>

                    <!-- Rating -->
                    <div class="flex items-center mb-4">
                        <div class="flex items-center">
                            @for($i = 1; $i <= 5; $i++)
                                <svg class="w-5 h-5 {{ $i <= $product->avg_rating ? 'text-yellow-400' : 'text-gray-300' }}" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                </svg>
                            @endfor
                        </div>
                        <span class="ml-2 text-gray-600">{{ number_format($product->avg_rating, 1) }} ({{ $product->review_count }} reviews)</span>
                    </div>

                    <!-- Price -->
                    <div class="mb-6">
                        @if($product->is_on_sale)
                            <div class="flex items-center gap-4">
                                <span class="text-3xl font-bold text-gray-900">R{{ number_format($product->sale_price, 2) }}</span>
                                <span class="text-xl text-gray-500 line-through">R{{ number_format($product->price, 2) }}</span>
                                <span class="bg-red-500 text-white text-sm font-bold px-2 py-1 rounded">-{{ $product->discount_percentage }}%</span>
                            </div>
                        @else
                            <span class="text-3xl font-bold text-gray-900">R{{ number_format($product->price, 2) }}</span>
                        @endif
                    </div>

                    <!-- Stock Status -->
                    <div class="mb-6">
                        @if($product->quantity <= 0)
                            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">Out of Stock</span>
                        @elseif($product->quantity <= $product->low_stock_threshold)
                            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">Only {{ $product->quantity }} left</span>
                        @else
                            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">In Stock</span>
                        @endif
                    </div>

                    @if($product->short_description)
                        <p class="text-gray-600 mb-6">{{ $product->short_description }}</p>
                    @endif

                    <!-- Add to Cart -->
                    <form action="/cart/add" method="POST" class="mb-6">
                        @csrf
                        <input type="hidden" name="product_id" value="{{ $product->id }}">
                        
                        <div class="flex items-center gap-4 mb-4">
                            <label class="text-gray-700">Quantity:</label>
                            <input type="number" name="quantity" value="1" min="1" max="{{ $product->quantity }}"
                                   class="w-20 border-gray-300 rounded-lg text-center">
                        </div>

                        <button type="submit" 
                                class="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400"
                                {{ $product->quantity <= 0 ? 'disabled' : '' }}>
                            Add to Cart
                        </button>
                    </form>

                    <!-- Product Details -->
                    <div class="border-t pt-6">
                        <dl class="space-y-4 text-sm">
                            <div class="flex">
                                <dt class="w-32 text-gray-500">SKU:</dt>
                                <dd class="text-gray-900">{{ $product->sku }}</dd>
                            </div>
                            <div class="flex">
                                <dt class="w-32 text-gray-500">Category:</dt>
                                <dd class="text-gray-900">{{ $product->category->name }}</dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>

            @if($product->description)
                <div class="border-t p-6">
                    <h2 class="text-lg font-semibold text-gray-900 mb-4">Description</h2>
                    <div class="prose max-w-none text-gray-600">{!! nl2br(e($product->description)) !!}</div>
                </div>
            @endif
        </div>

        <!-- Reviews Section -->
        <section class="mt-12 bg-white rounded-lg shadow-lg p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>

            <!-- Review Stats -->
            <div class="flex items-center gap-6 mb-8 pb-6 border-b">
                <div class="text-center">
                    <div class="text-4xl font-bold text-gray-900">{{ number_format($product->avg_rating, 1) }}</div>
                    <div class="flex items-center justify-center mt-1">
                        @for($i = 1; $i <= 5; $i++)
                            <svg class="w-5 h-5 {{ $i <= round($product->avg_rating) ? 'text-yellow-400' : 'text-gray-300' }}" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                            </svg>
                        @endfor
                    </div>
                    <div class="text-sm text-gray-500 mt-1">{{ $product->reviews->count() }} reviews</div>
                </div>
            </div>

            <!-- Write Review Form -->
            @auth
                <div class="mb-8 pb-8 border-b">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Write a Review</h3>
                    <form action="{{ route('reviews.store', $product) }}" method="POST" class="space-y-4">
                        @csrf

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                            <div class="flex gap-2" x-data="{ rating: 5 }">
                                @for($i = 1; $i <= 5; $i++)
                                    <button type="button" @click="rating = {{ $i }}" class="focus:outline-none">
                                        <svg class="w-8 h-8 cursor-pointer" :class="rating >= {{ $i }} ? 'text-yellow-400' : 'text-gray-300'" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                        </svg>
                                    </button>
                                @endfor
                                <input type="hidden" name="rating" x-model="rating">
                            </div>
                            @error('rating')
                                <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                            @enderror
                        </div>

                        <div>
                            <label for="title" class="block text-sm font-medium text-gray-700 mb-2">Review Title</label>
                            <input type="text" name="title" id="title" value="{{ old('title') }}" required
                                class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                placeholder="Summarize your review">
                            @error('title')
                                <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                            @enderror
                        </div>

                        <div>
                            <label for="comment" class="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
                            <textarea name="comment" id="comment" rows="4" required
                                class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                placeholder="What did you like or dislike about this product?">{{ old('comment') }}</textarea>
                            @error('comment')
                                <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                            @enderror
                        </div>

                        <button type="submit" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                            Submit Review
                        </button>
                    </form>
                </div>
            @else
                <div class="mb-8 pb-8 border-b">
                    <p class="text-gray-600">
                        <a href="{{ route('login') }}" class="text-blue-600 hover:underline">Log in</a> to write a review.
                    </p>
                </div>
            @endauth

            <!-- Reviews List -->
            @if($product->reviews->count() > 0)
                <div class="space-y-6">
                    @foreach($product->reviews as $review)
                        <div class="border-b pb-6 last:border-0">
                            <div class="flex items-center gap-4 mb-2">
                                <div class="flex items-center">
                                    @for($i = 1; $i <= 5; $i++)
                                        <svg class="w-4 h-4 {{ $i <= $review->rating ? 'text-yellow-400' : 'text-gray-300' }}" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                        </svg>
                                    @endfor
                                </div>
                                <span class="font-semibold text-gray-900">{{ $review->title }}</span>
                                @if($review->is_verified_purchase)
                                    <span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Verified Purchase</span>
                                @endif
                            </div>
                            <p class="text-gray-600 mb-2">{{ $review->comment }}</p>
                            <div class="text-sm text-gray-500">
                                By {{ $review->user->name }} on {{ $review->created_at->format('M d, Y') }}
                            </div>
                        </div>
                    @endforeach
                </div>
            @else
                <p class="text-gray-500 text-center py-8">No reviews yet. Be the first to review this product!</p>
            @endif
        </section>

        @if($relatedProducts->count() > 0)
            <section class="mt-12">
                <h2 class="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
                    @foreach($relatedProducts as $related)
                        @include('partials.product-card', ['product' => $related])
                    @endforeach
                </div>
            </section>
        @endif
    </div>
</x-store-layout>
