<div class="product-card group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
    <a href="/product/{{ $product->slug }}" class="block">
        <!-- Image Container -->
        <div class="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
            @if($product->featured_image)
                <img src="{{ asset('storage/' . $product->featured_image) }}"
                     alt="{{ $product->name }}"
                     class="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500 ease-out"
                     loading="lazy">
            @else
                <div class="w-full h-full flex items-center justify-center">
                    <svg class="w-20 h-20 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                </div>
            @endif

            <!-- Badges -->
            <div class="absolute top-3 left-3 flex flex-col gap-1.5">
                @if($product->is_on_sale)
                    <span class="bg-gradient-to-r from-[#e65163] to-[#d43d4f] text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                        -{{ $product->discount_percentage }}% OFF
                    </span>
                @endif
                @if($product->is_deal_of_day)
                    <span class="bg-gradient-to-r from-[#f7941d] to-[#e8850f] text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm flex items-center gap-1">
                        <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clip-rule="evenodd"/></svg>
                        HOT
                    </span>
                @endif
                @if($product->is_featured && !$product->is_deal_of_day)
                    <span class="bg-gradient-to-r from-[#0b79bf] to-[#0a6aa8] text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
                        FEATURED
                    </span>
                @endif
            </div>

            <!-- Action Buttons -->
            <div class="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                <button class="w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-[#e65163] hover:text-white transition-colors" title="Add to Wishlist">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                    </svg>
                </button>
                <button class="w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-[#0b79bf] hover:text-white transition-colors" title="Quick View">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                </button>
            </div>

            <!-- Free Delivery Badge -->
            @if($product->current_price >= 500)
                <div class="absolute bottom-3 left-3 bg-[#00b67a] text-white text-[9px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"/></svg>
                    FREE DELIVERY
                </div>
            @endif
        </div>

        <!-- Product Info -->
        <div class="p-4">
            <!-- Brand -->
            @if($product->brand)
                <p class="text-[11px] text-[#0b79bf] font-semibold mb-1.5 uppercase tracking-wider">{{ $product->brand->name }}</p>
            @endif

            <!-- Product Name -->
            <h3 class="text-sm font-medium text-gray-800 mb-2 line-clamp-2 min-h-[2.5rem] leading-snug group-hover:text-[#0b79bf] transition-colors">{{ $product->name }}</h3>

            <!-- Rating -->
            @if($product->review_count > 0)
                <div class="flex items-center gap-1.5 mb-3">
                    <div class="flex items-center bg-[#00b67a] text-white text-[11px] font-bold px-1.5 py-0.5 rounded">
                        <svg class="w-3 h-3 mr-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                        {{ number_format($product->avg_rating, 1) }}
                    </div>
                    <span class="text-[11px] text-gray-400">({{ number_format($product->review_count) }} reviews)</span>
                </div>
            @else
                <div class="flex items-center gap-1 mb-3">
                    <div class="flex">
                        @for($i = 1; $i <= 5; $i++)
                            <svg class="w-3.5 h-3.5 text-gray-200" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                            </svg>
                        @endfor
                    </div>
                    <span class="text-[11px] text-gray-400">No reviews yet</span>
                </div>
            @endif

            <!-- Price -->
            <div class="mb-3">
                @if($product->is_on_sale)
                    <div class="flex items-baseline gap-2 flex-wrap">
                        <span class="text-xl font-bold text-gray-900">R{{ number_format($product->sale_price, 0) }}</span>
                        <span class="text-sm text-gray-400 line-through">R{{ number_format($product->price, 0) }}</span>
                        <span class="text-xs font-semibold text-[#e65163] bg-red-50 px-1.5 py-0.5 rounded">Save R{{ number_format($product->price - $product->sale_price, 0) }}</span>
                    </div>
                @else
                    <span class="text-xl font-bold text-gray-900">R{{ number_format($product->price, 0) }}</span>
                @endif
            </div>

            <!-- Stock Status -->
            @if($product->quantity <= 0)
                <p class="text-xs text-[#e65163] font-semibold flex items-center gap-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    Out of Stock
                </p>
            @elseif($product->quantity <= ($product->low_stock_threshold ?? 5))
                <p class="text-xs text-[#f7941d] font-semibold flex items-center gap-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    Only {{ $product->quantity }} left - Order soon!
                </p>
            @else
                <p class="text-xs text-[#00b67a] font-semibold flex items-center gap-1">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                    </svg>
                    In Stock - Ready to Ship
                </p>
            @endif
        </div>
    </a>

    <!-- Add to Cart Button -->
    <div class="px-4 pb-4">
        <form action="/cart/add" method="POST">
            @csrf
            <input type="hidden" name="product_id" value="{{ $product->id }}">
            <input type="hidden" name="quantity" value="1">
            <button type="submit"
                    class="w-full py-3 rounded-lg text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2
                           {{ $product->quantity <= 0
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-gradient-to-r from-[#0b79bf] to-[#0a6aa8] text-white hover:from-[#0a6aa8] hover:to-[#085a91] hover:shadow-lg hover:-translate-y-0.5' }}"
                    {{ $product->quantity <= 0 ? 'disabled' : '' }}>
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
                {{ $product->quantity <= 0 ? 'Out of Stock' : 'Add to Cart' }}
            </button>
        </form>
    </div>
</div>
