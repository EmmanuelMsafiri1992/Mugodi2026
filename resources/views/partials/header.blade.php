<!-- Main Header - Takealot Style -->
<header class="bg-[#0b79bf] sticky top-0 z-50 shadow-header">
    <div class="max-w-7xl mx-auto px-4">
        <div class="flex items-center h-16 gap-6">
            <!-- Logo -->
            <a href="/" class="flex-shrink-0">
                <div class="flex items-center gap-2">
                    <div class="w-10 h-10 bg-white rounded flex items-center justify-center">
                        <span class="text-[#0b79bf] font-black text-xl">Q</span>
                    </div>
                    <span class="text-white text-xl font-bold tracking-tight hidden sm:block">QuickCart</span>
                </div>
            </a>

            <!-- Search Bar -->
            <div class="flex-1 max-w-3xl hidden sm:block" x-data="searchAutocomplete()">
                <form action="/products/search" method="GET" class="relative">
                    <div class="flex">
                        <input type="text"
                               name="q"
                               placeholder="Search products, brands and categories..."
                               class="flex-1 h-10 px-4 rounded-l border-0 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-0"
                               value="{{ request('q') }}"
                               x-model="query"
                               @input.debounce.300ms="search()"
                               @focus="showResults = results.length > 0"
                               @click.away="showResults = false"
                               autocomplete="off">
                        <button type="submit" class="h-10 px-5 bg-[#0a6aa8] hover:bg-[#085a91] transition-colors">
                            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                            </svg>
                        </button>
                    </div>

                    <!-- Search Results Dropdown -->
                    <div x-show="showResults && results.length > 0" x-cloak
                         class="absolute top-full left-0 right-0 mt-1 bg-white rounded shadow-lg z-[60] border border-gray-200 max-h-96 overflow-y-auto">
                        <template x-for="product in results" :key="product.id">
                            <a :href="product.url" class="flex items-center gap-3 p-3 hover:bg-gray-50 border-b border-gray-100 last:border-0">
                                <div class="w-12 h-12 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                                    <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                                    </svg>
                                </div>
                                <div class="flex-1 min-w-0">
                                    <p class="text-sm text-gray-900 truncate" x-text="product.name"></p>
                                    <p class="text-sm font-semibold text-[#0b79bf]" x-text="'R ' + product.price.toFixed(2)"></p>
                                </div>
                            </a>
                        </template>
                        <div class="p-3 bg-gray-50 text-center">
                            <button type="submit" class="text-sm text-[#0b79bf] hover:underline">
                                View all results for "<span x-text="query"></span>"
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            <script>
                function searchAutocomplete() {
                    return {
                        query: '{{ request("q", "") }}',
                        results: [],
                        showResults: false,
                        loading: false,
                        async search() {
                            if (this.query.length < 2) {
                                this.results = [];
                                this.showResults = false;
                                return;
                            }
                            this.loading = true;
                            try {
                                const response = await fetch(`/search/autocomplete?q=${encodeURIComponent(this.query)}`);
                                this.results = await response.json();
                                this.showResults = this.results.length > 0;
                            } catch (error) {
                                console.error('Search error:', error);
                            }
                            this.loading = false;
                        }
                    }
                }
            </script>

            <!-- Mobile Search Toggle -->
            <div class="sm:hidden" x-data="{ mobileSearchOpen: false }">
                <button @click="mobileSearchOpen = !mobileSearchOpen" class="text-white hover:bg-white/10 p-2 rounded transition">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                    </svg>
                </button>
                <!-- Mobile Search Dropdown -->
                <div x-show="mobileSearchOpen" x-cloak @click.away="mobileSearchOpen = false"
                     class="absolute left-0 right-0 top-full bg-[#0b79bf] p-4 shadow-lg z-[60]">
                    <form action="/products/search" method="GET" class="flex">
                        <input type="text" name="q" placeholder="Search products..."
                               class="flex-1 h-10 px-4 rounded-l border-0 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-0">
                        <button type="submit" class="h-10 px-5 bg-[#0a6aa8] hover:bg-[#085a91] rounded-r transition-colors">
                            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                            </svg>
                        </button>
                    </form>
                </div>
            </div>

            <!-- Right Actions -->
            <div class="flex items-center gap-2">
                <!-- Account -->
                <div x-data="{ open: false }" class="relative">
                    <button @click="open = !open" class="flex items-center gap-2 text-white hover:bg-white/10 px-3 py-2 rounded transition">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                        </svg>
                        <div class="hidden md:block text-left">
                            <div class="text-xs text-white/70">@auth Hi, {{ Str::limit(Auth::user()->name, 8) }} @else Login @endauth</div>
                            <div class="text-sm font-medium">Account</div>
                        </div>
                        <svg class="w-4 h-4 hidden md:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                        </svg>
                    </button>

                    <div x-show="open" @click.away="open = false" x-cloak
                         x-transition:enter="transition ease-out duration-100"
                         x-transition:enter-start="opacity-0 scale-95"
                         x-transition:enter-end="opacity-100 scale-100"
                         class="absolute right-0 mt-2 w-56 bg-white rounded shadow-lg py-2 text-gray-800 z-[60] border border-gray-200">
                        @auth
                            <div class="px-4 py-3 border-b border-gray-100 bg-gray-50">
                                <p class="font-medium text-gray-900">{{ Auth::user()->name }}</p>
                                <p class="text-xs text-gray-500">{{ Auth::user()->email }}</p>
                            </div>
                            <a href="/account" class="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-sm">
                                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                                My Account
                            </a>
                            <a href="/account/orders" class="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-sm">
                                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
                                Orders
                            </a>
                            <a href="/wishlist" class="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-sm">
                                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
                                Wishlist
                            </a>
                            @if(Auth::user()->role === 'admin')
                                <div class="border-t border-gray-100 mt-1 pt-1">
                                    <a href="/admin" class="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-sm text-[#0b79bf]">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                                        Admin Panel
                                    </a>
                                </div>
                            @endif
                            <div class="border-t border-gray-100 mt-1 pt-1">
                                <form method="POST" action="/logout">
                                    @csrf
                                    <button type="submit" class="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 w-full text-left text-sm text-red-600">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                                        Sign Out
                                    </button>
                                </form>
                            </div>
                        @else
                            <a href="/login" class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-sm">
                                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/></svg>
                                Login
                            </a>
                            <a href="/register" class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-sm">
                                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/></svg>
                                Register
                            </a>
                        @endauth
                    </div>
                </div>

                <!-- Wishlist -->
                <a href="/wishlist" class="text-white hover:bg-white/10 p-2 rounded transition flex flex-col items-center" title="Wishlist">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                    </svg>
                    <span class="text-[10px] mt-0.5 hidden lg:block">Wishlist</span>
                </a>

                <!-- Cart -->
                <a href="/cart" class="text-white hover:bg-white/10 p-2 rounded transition flex flex-col items-center relative">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                    </svg>
                    @php $cartCount = session('cart_count', 0); @endphp
                    @if($cartCount > 0)
                        <span class="absolute -top-0.5 -right-0.5 bg-[#e65163] text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                            {{ $cartCount > 9 ? '9+' : $cartCount }}
                        </span>
                    @endif
                    <span class="text-[10px] mt-0.5 hidden lg:block">Cart</span>
                </a>
            </div>
        </div>
    </div>

    <!-- Secondary Nav -->
    <div class="bg-[#0a6aa8] border-t border-white/10">
        <div class="max-w-7xl mx-auto px-4">
            <nav class="flex items-center gap-1 h-10 text-sm">
                <!-- All Categories Dropdown -->
                <div x-data="{ open: false }" class="relative">
                    <button @click="open = !open" class="flex items-center gap-2 text-white hover:bg-white/10 px-3 py-1.5 rounded transition text-sm">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                        </svg>
                        <span>All Categories</span>
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                        </svg>
                    </button>

                    <div x-show="open" @click.away="open = false" x-cloak
                         x-transition:enter="transition ease-out duration-100"
                         x-transition:enter-start="opacity-0 scale-95"
                         x-transition:enter-end="opacity-100 scale-100"
                         class="absolute left-0 mt-1 w-64 bg-white rounded shadow-lg py-1 text-gray-800 z-[60] border border-gray-200">
                        @foreach(\App\Models\Category::where('is_active', true)->whereNull('parent_id')->orderBy('name')->get() as $category)
                            <a href="/category/{{ $category->slug }}" class="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-sm">
                                <svg class="w-4 h-4 text-[#0b79bf]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                </svg>
                                {{ $category->name }}
                            </a>
                        @endforeach
                    </div>
                </div>

                <a href="/deals" class="flex items-center gap-1.5 text-white hover:bg-white/10 px-3 py-1.5 rounded transition text-sm">
                    <span class="bg-[#e65163] text-white text-[10px] font-bold px-1.5 py-0.5 rounded">HOT</span>
                    Daily Deals
                </a>

                <a href="/products?featured=1" class="text-white hover:bg-white/10 px-3 py-1.5 rounded transition text-sm">
                    Featured
                </a>

                <a href="/products?sale=1" class="text-[#ffc107] hover:bg-white/10 px-3 py-1.5 rounded transition text-sm font-medium">
                    Sale
                </a>

                <div class="flex-1"></div>

                <span class="text-white/70 text-xs hidden md:flex items-center gap-1.5">
                    <svg class="w-4 h-4 text-[#00b67a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"/>
                    </svg>
                    Free Delivery over R500
                </span>
            </nav>
        </div>
    </div>
</header>
