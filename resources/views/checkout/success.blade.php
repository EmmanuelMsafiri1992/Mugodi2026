<x-store-layout title="Order Confirmed">
    <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="bg-white rounded-lg shadow p-8 text-center">
            <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg class="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
            </div>

            <h1 class="text-2xl font-bold text-gray-900 mb-2">Thank You for Your Order!</h1>
            <p class="text-gray-600 mb-6">Your order has been placed successfully.</p>

            <div class="bg-gray-50 rounded-lg p-6 mb-6 text-left">
                <div class="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p class="text-gray-500">Order Number</p>
                        <p class="font-semibold">{{ $order->order_number }}</p>
                    </div>
                    <div>
                        <p class="text-gray-500">Date</p>
                        <p class="font-semibold">{{ $order->created_at->format('M d, Y') }}</p>
                    </div>
                    <div>
                        <p class="text-gray-500">Total</p>
                        <p class="font-semibold">R{{ number_format($order->total, 2) }}</p>
                    </div>
                    <div>
                        <p class="text-gray-500">Payment Status</p>
                        <p class="font-semibold capitalize">{{ $order->payment_status }}</p>
                    </div>
                </div>
            </div>

            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
                <h3 class="font-semibold text-blue-900 mb-2">Delivery Address</h3>
                <p class="text-blue-800 text-sm">
                    {{ $order->shipping_name }}<br>
                    {{ $order->shipping_address }}<br>
                    {{ $order->shipping_city }}, {{ $order->shipping_province }} {{ $order->shipping_postal_code }}<br>
                    {{ $order->shipping_phone }}
                </p>
            </div>

            <div class="border-t pt-6">
                <h3 class="font-semibold mb-4 text-left">Order Items</h3>
                <div class="space-y-3 text-sm text-left">
                    @foreach($order->items as $item)
                        <div class="flex justify-between">
                            <span>{{ $item->product->name }} x{{ $item->quantity }}</span>
                            <span>R{{ number_format($item->total, 2) }}</span>
                        </div>
                    @endforeach
                </div>
            </div>

            <div class="flex gap-4 mt-8">
                <a href="{{ route('account.orders') }}" class="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700">View My Orders</a>
                <a href="{{ route('products.index') }}" class="flex-1 border border-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-50">Continue Shopping</a>
            </div>
        </div>
    </div>
</x-store-layout>
