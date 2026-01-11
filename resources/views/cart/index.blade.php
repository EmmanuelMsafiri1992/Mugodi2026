<x-store-layout title="Shopping Cart">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 class="text-2xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        @if($cart->items->count() > 0)
            <div class="lg:flex lg:gap-8">
                <div class="lg:w-2/3">
                    <div class="bg-white rounded-lg shadow overflow-hidden">
                        @foreach($cart->items as $item)
                            <div class="flex items-center p-6 border-b last:border-b-0">
                                <div class="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                                    @if($item->product->featured_image)
                                        <img src="{{ asset('storage/' . $item->product->featured_image) }}" alt="{{ $item->product->name }}" class="w-full h-full object-contain">
                                    @endif
                                </div>
                                <div class="flex-1 ml-6">
                                    <a href="/product/{{ $item->product->slug }}" class="font-medium text-gray-900 hover:text-[#0b79bf]">{{ $item->product->name }}</a>
                                    <p class="text-lg font-semibold text-gray-900 mt-1">R{{ number_format($item->price, 2) }}</p>
                                </div>
                                <div class="flex items-center mx-6">
                                    <form action="{{ route('cart.update', $item) }}" method="POST" class="flex items-center">
                                        @csrf
                                        @method('PATCH')
                                        <input type="number" name="quantity" value="{{ $item->quantity }}" min="1" class="w-16 border-gray-300 rounded-lg text-center" onchange="this.form.submit()">
                                    </form>
                                </div>
                                <div class="w-24 text-right">
                                    <p class="font-semibold text-gray-900">R{{ number_format($item->total, 2) }}</p>
                                </div>
                                <form action="{{ route('cart.remove', $item) }}" method="POST" class="ml-4">
                                    @csrf
                                    @method('DELETE')
                                    <button type="submit" class="text-red-500 hover:text-red-700">Remove</button>
                                </form>
                            </div>
                        @endforeach
                    </div>
                </div>
                <div class="lg:w-1/3 mt-8 lg:mt-0">
                    <div class="bg-white rounded-lg shadow p-6">
                        <h2 class="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
                        <div class="space-y-3 border-t pt-4">
                            <div class="flex justify-between">
                                <span class="text-gray-600">Subtotal</span>
                                <span class="font-medium">R{{ number_format($cart->subtotal, 2) }}</span>
                            </div>
                            @if($cart->discount > 0)
                                <div class="flex justify-between text-green-600">
                                    <span>Discount</span>
                                    <span>-R{{ number_format($cart->discount, 2) }}</span>
                                </div>
                            @endif
                            <div class="flex justify-between border-t pt-3">
                                <span class="text-lg font-semibold">Total</span>
                                <span class="text-lg font-semibold">R{{ number_format($cart->total, 2) }}</span>
                            </div>
                        </div>
                        <a href="{{ route('checkout.index') }}" class="block w-full mt-6 bg-[#0b79bf] text-white text-center py-3 rounded-lg font-semibold hover:bg-[#0a6aa8]">Proceed to Checkout</a>
                    </div>
                </div>
            </div>
        @else
            <div class="bg-white rounded-lg shadow p-12 text-center">
                <h3 class="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
                <p class="text-gray-500 mb-6">Start shopping to add items to your cart.</p>
                <a href="/products" class="inline-block bg-[#0b79bf] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#0a6aa8]">Start Shopping</a>
            </div>
        @endif
    </div>
</x-store-layout>