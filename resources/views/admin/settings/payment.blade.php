<x-admin-layout title="Payment Settings" subtitle="Configure payment gateways and options">
    <div class="max-w-4xl">
        <form action="{{ route('admin.settings.payment.update') }}" method="POST">
            @csrf
            @method('PUT')

            <!-- PayFast Settings -->
            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
                <div class="p-6 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <h2 class="text-lg font-bold text-gray-900">PayFast</h2>
                        <p class="text-sm text-gray-500">South African payment gateway</p>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="w-3 h-3 bg-green-500 rounded-full"></span>
                        <span class="text-sm text-gray-600">Enabled</span>
                    </div>
                </div>
                <div class="p-6 space-y-6">
                    <div class="grid sm:grid-cols-2 gap-6">
                        <div>
                            <label for="payfast_merchant_id" class="block text-sm font-semibold text-gray-700 mb-2">Merchant ID</label>
                            <input type="text" id="payfast_merchant_id" name="payfast_merchant_id" value="{{ old('payfast_merchant_id', $settings['payfast_merchant_id'] ?? '') }}"
                                   class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                   placeholder="e.g., 10000100">
                        </div>
                        <div>
                            <label for="payfast_merchant_key" class="block text-sm font-semibold text-gray-700 mb-2">Merchant Key</label>
                            <input type="text" id="payfast_merchant_key" name="payfast_merchant_key" value="{{ old('payfast_merchant_key', $settings['payfast_merchant_key'] ?? '') }}"
                                   class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                   placeholder="e.g., 46f0cd694581a">
                        </div>
                    </div>
                    <div>
                        <label for="payfast_passphrase" class="block text-sm font-semibold text-gray-700 mb-2">Passphrase (Optional)</label>
                        <input type="password" id="payfast_passphrase" name="payfast_passphrase" value="{{ old('payfast_passphrase', $settings['payfast_passphrase'] ?? '') }}"
                               class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                               placeholder="Your PayFast passphrase">
                    </div>
                    <div class="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                        <input type="checkbox" id="payfast_sandbox" name="payfast_sandbox" value="1"
                               class="w-5 h-5 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
                               {{ old('payfast_sandbox', $settings['payfast_sandbox'] ?? '1') === '1' ? 'checked' : '' }}>
                        <div>
                            <label for="payfast_sandbox" class="font-semibold text-yellow-800 cursor-pointer">Sandbox Mode</label>
                            <p class="text-sm text-yellow-700">Use PayFast sandbox for testing. Disable in production.</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Cash on Delivery -->
            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
                <div class="p-6 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <h2 class="text-lg font-bold text-gray-900">Cash on Delivery (COD)</h2>
                        <p class="text-sm text-gray-500">Allow customers to pay when they receive the order</p>
                    </div>
                </div>
                <div class="p-6">
                    <div class="flex items-center gap-3">
                        <input type="checkbox" id="cod_enabled" name="cod_enabled" value="1"
                               class="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                               {{ old('cod_enabled', $settings['cod_enabled'] ?? '0') === '1' ? 'checked' : '' }}>
                        <div>
                            <label for="cod_enabled" class="font-semibold text-gray-800 cursor-pointer">Enable Cash on Delivery</label>
                            <p class="text-sm text-gray-500">Customers can choose to pay in cash upon delivery</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- EFT / Bank Transfer -->
            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
                <div class="p-6 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <h2 class="text-lg font-bold text-gray-900">EFT / Bank Transfer</h2>
                        <p class="text-sm text-gray-500">Allow customers to pay via bank transfer</p>
                    </div>
                </div>
                <div class="p-6 space-y-6">
                    <div class="flex items-center gap-3 mb-6">
                        <input type="checkbox" id="eft_enabled" name="eft_enabled" value="1"
                               class="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                               {{ old('eft_enabled', $settings['eft_enabled'] ?? '0') === '1' ? 'checked' : '' }}>
                        <div>
                            <label for="eft_enabled" class="font-semibold text-gray-800 cursor-pointer">Enable EFT Payments</label>
                            <p class="text-sm text-gray-500">Show bank details for manual transfers</p>
                        </div>
                    </div>

                    <div class="grid sm:grid-cols-2 gap-6">
                        <div>
                            <label for="eft_bank_name" class="block text-sm font-semibold text-gray-700 mb-2">Bank Name</label>
                            <input type="text" id="eft_bank_name" name="eft_bank_name" value="{{ old('eft_bank_name', $settings['eft_bank_name'] ?? '') }}"
                                   class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                   placeholder="e.g., FNB, Standard Bank">
                        </div>
                        <div>
                            <label for="eft_account_name" class="block text-sm font-semibold text-gray-700 mb-2">Account Name</label>
                            <input type="text" id="eft_account_name" name="eft_account_name" value="{{ old('eft_account_name', $settings['eft_account_name'] ?? '') }}"
                                   class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                   placeholder="e.g., QuickCart PTY Ltd">
                        </div>
                    </div>
                    <div class="grid sm:grid-cols-2 gap-6">
                        <div>
                            <label for="eft_account_number" class="block text-sm font-semibold text-gray-700 mb-2">Account Number</label>
                            <input type="text" id="eft_account_number" name="eft_account_number" value="{{ old('eft_account_number', $settings['eft_account_number'] ?? '') }}"
                                   class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                   placeholder="Your bank account number">
                        </div>
                        <div>
                            <label for="eft_branch_code" class="block text-sm font-semibold text-gray-700 mb-2">Branch Code</label>
                            <input type="text" id="eft_branch_code" name="eft_branch_code" value="{{ old('eft_branch_code', $settings['eft_branch_code'] ?? '') }}"
                                   class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                   placeholder="e.g., 250655">
                        </div>
                    </div>
                    <div>
                        <label for="eft_reference" class="block text-sm font-semibold text-gray-700 mb-2">Reference Instructions</label>
                        <input type="text" id="eft_reference" name="eft_reference" value="{{ old('eft_reference', $settings['eft_reference'] ?? 'Use your order number as reference') }}"
                               class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                    </div>
                </div>
            </div>

            <div class="flex justify-end">
                <button type="submit" class="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-colors">
                    Save Payment Settings
                </button>
            </div>
        </form>
    </div>
</x-admin-layout>
