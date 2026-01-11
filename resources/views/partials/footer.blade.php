<footer class="bg-gray-800 text-white mt-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
                <h3 class="text-lg font-semibold mb-4">About QuickCart</h3>
                <ul class="space-y-2 text-gray-400">
                    <li><a href="#" class="hover:text-white">About Us</a></li>
                    <li><a href="#" class="hover:text-white">Careers</a></li>
                    <li><a href="#" class="hover:text-white">Contact Us</a></li>
                </ul>
            </div>
            <div>
                <h3 class="text-lg font-semibold mb-4">Customer Service</h3>
                <ul class="space-y-2 text-gray-400">
                    <li><a href="#" class="hover:text-white">Help Center</a></li>
                    <li><a href="#" class="hover:text-white">Returns & Refunds</a></li>
                    <li><a href="#" class="hover:text-white">Delivery Info</a></li>
                    <li><a href="#" class="hover:text-white">Track Order</a></li>
                </ul>
            </div>
            <div>
                <h3 class="text-lg font-semibold mb-4">Shop</h3>
                <ul class="space-y-2 text-gray-400">
                    @foreach(\App\Models\Category::where('is_active', true)->whereNull('parent_id')->take(5)->get() as $cat)
                        <li><a href="/category/{{ $cat->slug }}" class="hover:text-white">{{ $cat->name }}</a></li>
                    @endforeach
                </ul>
            </div>
            <div>
                <h3 class="text-lg font-semibold mb-4">Stay Connected</h3>
                <p class="text-gray-400 mb-4">Subscribe for deals and updates</p>
                <form class="flex">
                    <input type="email" placeholder="Your email" class="flex-1 px-4 py-2 rounded-l-lg text-gray-900">
                    <button type="submit" class="bg-[#0b79bf] px-4 py-2 rounded-r-lg hover:bg-[#0a6aa8]">Subscribe</button>
                </form>
            </div>
        </div>
        <div class="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {{ date('Y') }} QuickCart. All rights reserved. South Africas Leading Online Store.</p>
        </div>
    </div>
</footer>