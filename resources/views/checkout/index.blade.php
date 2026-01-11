<x-store-layout title="Checkout - Delivery Address">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="mb-8">
            <div class="flex items-center justify-center">
                <div class="flex items-center">
                    <div class="w-10 h-10 bg-[#0b79bf] text-white rounded-full flex items-center justify-center font-bold">1</div>
                    <span class="ml-2 font-medium text-[#0b79bf]">Address</span>
                </div>
                <div class="w-20 h-1 bg-gray-300 mx-4"></div>
                <div class="flex items-center">
                    <div class="w-10 h-10 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center font-bold">2</div>
                    <span class="ml-2 text-gray-500">Payment</span>
                </div>
            </div>
        </div>

        <div class="grid lg:grid-cols-3 gap-8">
            <div class="lg:col-span-2">
                <div class="bg-white rounded-lg shadow p-6">
                    <h2 class="text-xl font-semibold mb-6">Delivery Address</h2>

                    <form action="{{ route('checkout.address') }}" method="POST">
                        @csrf

                        @if($addresses->count() > 0)
                            <div class="space-y-4 mb-6">
                                @foreach($addresses as $address)
                                    <label class="flex items-start p-4 border rounded-lg cursor-pointer hover:border-blue-500">
                                        <input type="radio" name="address_id" value="{{ $address->id }}" class="mt-1" {{ $loop->first ? 'checked' : '' }}>
                                        <div class="ml-3">
                                            <p class="font-medium">{{ $address->name }}</p>
                                            <p class="text-gray-600 text-sm">{{ $address->street_address }}</p>
                                            <p class="text-gray-600 text-sm">{{ $address->city }}, {{ $address->province }} {{ $address->postal_code }}</p>
                                            <p class="text-gray-600 text-sm">{{ $address->phone }}</p>
                                        </div>
                                    </label>
                                @endforeach
                            </div>
                        @endif

                        <div x-data="{ showNew: {{ $addresses->isEmpty() ? 'true' : 'false' }} }">
                            @if($addresses->isNotEmpty())
                                <button type="button" @click="showNew = !showNew" class="text-blue-600 hover:underline mb-4">+ Add New Address</button>
                            @endif

                            <div x-show="showNew" class="space-y-4 border-t pt-4">
                                <input type="hidden" name="new_address" :value="showNew ? '1' : '0'">

                                <div class="grid grid-cols-2 gap-4">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                        <input type="text" name="name" class="w-full border-gray-300 rounded-lg" value="{{ old('name', auth()->user()->name) }}">
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                        <input type="text" name="phone" class="w-full border-gray-300 rounded-lg" value="{{ old('phone') }}">
                                    </div>
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                                    <input type="text" name="street_address" class="w-full border-gray-300 rounded-lg">
                                </div>

                                <div class="grid grid-cols-3 gap-4">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">City</label>
                                        <input type="text" name="city" class="w-full border-gray-300 rounded-lg">
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Province</label>
                                        <select name="province" class="w-full border-gray-300 rounded-lg">
                                            <option value="">Select...</option>
                                            <option value="Eastern Cape">Eastern Cape</option>
                                            <option value="Free State">Free State</option>
                                            <option value="Gauteng">Gauteng</option>
                                            <option value="KwaZulu-Natal">KwaZulu-Natal</option>
                                            <option value="Limpopo">Limpopo</option>
                                            <option value="Mpumalanga">Mpumalanga</option>
                                            <option value="North West">North West</option>
                                            <option value="Northern Cape">Northern Cape</option>
                                            <option value="Western Cape">Western Cape</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                                        <input type="text" name="postal_code" class="w-full border-gray-300 rounded-lg">
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button type="submit" class="mt-6 w-full bg-[#0b79bf] text-white py-3 rounded-lg font-semibold hover:bg-[#0a6aa8]">Continue to Payment</button>
                    </form>
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
                            @if($cart->discount > 0)
                                <div class="flex justify-between text-green-600">
                                    <span>Discount</span>
                                    <span>-R{{ number_format($cart->discount, 2) }}</span>
                                </div>
                            @endif
                            <div class="flex justify-between font-bold text-lg mt-2">
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
