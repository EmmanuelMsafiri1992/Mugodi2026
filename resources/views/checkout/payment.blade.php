<x-store-layout title="Checkout - Payment">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="mb-8">
            <div class="flex items-center justify-center">
                <div class="flex items-center">
                    <div class="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                    </div>
                    <span class="ml-2 text-green-600">Address</span>
                </div>
                <div class="w-20 h-1 bg-[#0b79bf] mx-4"></div>
                <div class="flex items-center">
                    <div class="w-10 h-10 bg-[#0b79bf] text-white rounded-full flex items-center justify-center font-bold">2</div>
                    <span class="ml-2 font-medium text-[#0b79bf]">Payment</span>
                </div>
            </div>
        </div>

        <div class="grid lg:grid-cols-3 gap-8">
            <div class="lg:col-span-2">
                <div class="bg-white rounded-lg shadow p-6 mb-6">
                    <h2 class="text-xl font-semibold mb-4">Delivery Address</h2>
                    <div class="bg-gray-50 rounded-lg p-4">
                        <p class="font-medium">{{ $address->name }}</p>
                        <p class="text-gray-600">{{ $address->street_address }}</p>
                        <p class="text-gray-600">{{ $address->city }}, {{ $address->province }} {{ $address->postal_code }}</p>
                        <p class="text-gray-600">{{ $address->phone }}</p>
                    </div>
                    <a href="{{ route('checkout.index') }}" class="text-[#0b79bf] hover:underline text-sm mt-2 inline-block">Change address</a>
                </div>

                <div class="bg-white rounded-lg shadow p-6">
                    <h2 class="text-xl font-semibold mb-4">Payment Method</h2>

                    <form action="{{ route('checkout.process') }}" method="POST">
                        @csrf

                        <div class="border rounded-lg p-4 mb-4 bg-sky-50 border-[#0b79bf]/30">
                            <div class="flex items-center">
                                <input type="radio" name="payment_method" value="payfast" checked class="mr-3">
                                <div class="flex-1">
                                    <p class="font-medium">PayFast</p>
                                    <p class="text-sm text-gray-600">Pay securely with credit card, debit card, or EFT</p>
                                </div>
                                <img src="https://www.payfast.co.za/images/stacked-logos-medium.png" alt="PayFast" class="h-10">
                            </div>
                        </div>

                        <div class="mb-4">
                            <label class="block text-sm font-medium text-gray-700 mb-1">Order Notes (Optional)</label>
                            <textarea name="notes" rows="3" class="w-full border-gray-300 rounded-lg" placeholder="Any special instructions for your order..."></textarea>
                        </div>

                        <button type="submit" class="w-full bg-[#0b79bf] text-white py-3 rounded-lg font-semibold hover:bg-[#0a6aa8]">
                            Pay R{{ number_format($cart->total, 2) }}
                        </button>
                    </form>

                    <p class="text-center text-sm text-gray-500 mt-4">
                        By placing this order, you agree to our Terms & Conditions and Privacy Policy
                    </p>
                </div>
            </div>

            <div>
                <div class="bg-white rounded-lg shadow p-6">
                    <h3 class="font-semibold mb-4">Order Summary</h3>
                    <div class="space-y-3 text-sm">
                        @foreach($cart->items as $item)
                            <div class="flex justify-between">
                                <span class="text-gray-600">{{ $item->product->name }} x{{ $item->quantity }}</span>
                                <span>R{{ number_format($item->total, 2) }}</span>
                            </div>
                        @endforeach
                        <div class="border-t pt-3">
                            <div class="flex justify-between">
                                <span>Subtotal</span>
                                <span>R{{ number_format($cart->subtotal, 2) }}</span>
                            </div>
                            <div class="flex justify-between">
                                <span>Shipping</span>
                                <span class="text-green-600">FREE</span>
                            </div>
                            @if($cart->discount > 0)
                                <div class="flex justify-between text-green-600">
                                    <span>Discount</span>
                                    <span>-R{{ number_format($cart->discount, 2) }}</span>
                                </div>
                            @endif
                            <div class="flex justify-between font-bold text-lg mt-2 pt-2 border-t">
                                <span>Total</span>
                                <span>R{{ number_format($cart->total, 2) }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</x-store-layout>
