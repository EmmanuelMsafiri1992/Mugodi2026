<x-admin-layout title="General Settings" subtitle="Configure your store settings">
    <div class="max-w-4xl">
        <form action="{{ route('admin.settings.update') }}" method="POST">
            @csrf
            @method('PUT')

            <!-- Store Information -->
            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
                <div class="p-6 border-b border-gray-100">
                    <h2 class="text-lg font-bold text-gray-900">Store Information</h2>
                    <p class="text-sm text-gray-500">Basic information about your store</p>
                </div>
                <div class="p-6 space-y-6">
                    <div class="grid sm:grid-cols-2 gap-6">
                        <div>
                            <label for="site_name" class="block text-sm font-semibold text-gray-700 mb-2">Store Name</label>
                            <input type="text" id="site_name" name="site_name" value="{{ old('site_name', $settings['site_name'] ?? 'QuickCart') }}" required
                                   class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                        </div>
                        <div>
                            <label for="site_tagline" class="block text-sm font-semibold text-gray-700 mb-2">Tagline</label>
                            <input type="text" id="site_tagline" name="site_tagline" value="{{ old('site_tagline', $settings['site_tagline'] ?? '') }}"
                                   class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                        </div>
                    </div>
                </div>
            </div>

            <!-- Contact Information -->
            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
                <div class="p-6 border-b border-gray-100">
                    <h2 class="text-lg font-bold text-gray-900">Contact Information</h2>
                    <p class="text-sm text-gray-500">How customers can reach you</p>
                </div>
                <div class="p-6 space-y-6">
                    <div class="grid sm:grid-cols-2 gap-6">
                        <div>
                            <label for="contact_email" class="block text-sm font-semibold text-gray-700 mb-2">Contact Email</label>
                            <input type="email" id="contact_email" name="contact_email" value="{{ old('contact_email', $settings['contact_email'] ?? '') }}" required
                                   class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                        </div>
                        <div>
                            <label for="contact_phone" class="block text-sm font-semibold text-gray-700 mb-2">Contact Phone</label>
                            <input type="text" id="contact_phone" name="contact_phone" value="{{ old('contact_phone', $settings['contact_phone'] ?? '') }}"
                                   class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                        </div>
                    </div>
                    <div>
                        <label for="contact_address" class="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                        <textarea id="contact_address" name="contact_address" rows="2"
                                  class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent">{{ old('contact_address', $settings['contact_address'] ?? '') }}</textarea>
                    </div>
                </div>
            </div>

            <!-- Currency & Shipping -->
            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
                <div class="p-6 border-b border-gray-100">
                    <h2 class="text-lg font-bold text-gray-900">Currency & Shipping</h2>
                    <p class="text-sm text-gray-500">Configure currency and shipping options</p>
                </div>
                <div class="p-6 space-y-6">
                    <div class="grid sm:grid-cols-3 gap-6">
                        <div>
                            <label for="currency" class="block text-sm font-semibold text-gray-700 mb-2">Currency Code</label>
                            <input type="text" id="currency" name="currency" value="{{ old('currency', $settings['currency'] ?? 'ZAR') }}" required
                                   class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                        </div>
                        <div>
                            <label for="currency_symbol" class="block text-sm font-semibold text-gray-700 mb-2">Currency Symbol</label>
                            <input type="text" id="currency_symbol" name="currency_symbol" value="{{ old('currency_symbol', $settings['currency_symbol'] ?? 'R') }}" required
                                   class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                        </div>
                        <div>
                            <label for="free_shipping_threshold" class="block text-sm font-semibold text-gray-700 mb-2">Free Shipping Threshold</label>
                            <input type="number" id="free_shipping_threshold" name="free_shipping_threshold" value="{{ old('free_shipping_threshold', $settings['free_shipping_threshold'] ?? '500') }}" min="0" step="0.01"
                                   class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                        </div>
                    </div>
                </div>
            </div>

            <!-- Inventory -->
            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
                <div class="p-6 border-b border-gray-100">
                    <h2 class="text-lg font-bold text-gray-900">Inventory</h2>
                    <p class="text-sm text-gray-500">Stock management settings</p>
                </div>
                <div class="p-6 space-y-6">
                    <div class="max-w-xs">
                        <label for="low_stock_threshold" class="block text-sm font-semibold text-gray-700 mb-2">Low Stock Threshold</label>
                        <input type="number" id="low_stock_threshold" name="low_stock_threshold" value="{{ old('low_stock_threshold', $settings['low_stock_threshold'] ?? '10') }}" min="0"
                               class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                        <p class="mt-1 text-sm text-gray-500">Alert when product stock falls below this number</p>
                    </div>
                </div>
            </div>

            <!-- Social Media -->
            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
                <div class="p-6 border-b border-gray-100">
                    <h2 class="text-lg font-bold text-gray-900">Social Media</h2>
                    <p class="text-sm text-gray-500">Your social media profiles</p>
                </div>
                <div class="p-6 space-y-6">
                    <div class="grid sm:grid-cols-3 gap-6">
                        <div>
                            <label for="facebook_url" class="block text-sm font-semibold text-gray-700 mb-2">Facebook URL</label>
                            <input type="url" id="facebook_url" name="facebook_url" value="{{ old('facebook_url', $settings['facebook_url'] ?? '') }}"
                                   class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                   placeholder="https://facebook.com/...">
                        </div>
                        <div>
                            <label for="twitter_url" class="block text-sm font-semibold text-gray-700 mb-2">Twitter URL</label>
                            <input type="url" id="twitter_url" name="twitter_url" value="{{ old('twitter_url', $settings['twitter_url'] ?? '') }}"
                                   class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                   placeholder="https://twitter.com/...">
                        </div>
                        <div>
                            <label for="instagram_url" class="block text-sm font-semibold text-gray-700 mb-2">Instagram URL</label>
                            <input type="url" id="instagram_url" name="instagram_url" value="{{ old('instagram_url', $settings['instagram_url'] ?? '') }}"
                                   class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                   placeholder="https://instagram.com/...">
                        </div>
                    </div>
                </div>
            </div>

            <!-- Footer -->
            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
                <div class="p-6 border-b border-gray-100">
                    <h2 class="text-lg font-bold text-gray-900">Footer</h2>
                    <p class="text-sm text-gray-500">Footer content settings</p>
                </div>
                <div class="p-6 space-y-6">
                    <div>
                        <label for="footer_text" class="block text-sm font-semibold text-gray-700 mb-2">Footer Text</label>
                        <input type="text" id="footer_text" name="footer_text" value="{{ old('footer_text', $settings['footer_text'] ?? '') }}"
                               class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                    </div>
                </div>
            </div>

            <div class="flex justify-end">
                <button type="submit" class="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-colors">
                    Save Settings
                </button>
            </div>
        </form>
    </div>
</x-admin-layout>
