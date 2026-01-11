<x-admin-layout title="Order {{ $order->order_number }}">
    <div class="grid lg:grid-cols-3 gap-6">
        <!-- Order Details -->
        <div class="lg:col-span-2 space-y-6">
            <!-- Items -->
            <div class="bg-white rounded-lg shadow">
                <div class="p-4 border-b">
                    <h2 class="text-lg font-semibold">Order Items</h2>
                </div>
                <div class="p-4">
                    <table class="min-w-full">
                        <thead>
                            <tr class="text-left text-gray-500 text-sm">
                                <th class="pb-2">Product</th>
                                <th class="pb-2">Price</th>
                                <th class="pb-2">Qty</th>
                                <th class="pb-2 text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y">
                            @foreach($order->items as $item)
                                <tr>
                                    <td class="py-2">
                                        <div class="flex items-center">
                                            @if($item->product && $item->product->primaryImage)
                                                <img src="{{ Storage::url($item->product->primaryImage->image) }}" alt="" class="h-10 w-10 rounded object-cover mr-3">
                                            @endif
                                            <div>
                                                <div class="font-medium">{{ $item->product->name ?? $item->product_name }}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="py-2">R{{ number_format($item->price, 2) }}</td>
                                    <td class="py-2">{{ $item->quantity }}</td>
                                    <td class="py-2 text-right">R{{ number_format($item->price * $item->quantity, 2) }}</td>
                                </tr>
                            @endforeach
                        </tbody>
                        <tfoot class="border-t">
                            <tr>
                                <td colspan="3" class="py-2 text-right font-medium">Subtotal:</td>
                                <td class="py-2 text-right">R{{ number_format($order->subtotal, 2) }}</td>
                            </tr>
                            @if($order->discount > 0)
                                <tr>
                                    <td colspan="3" class="py-2 text-right font-medium">Discount:</td>
                                    <td class="py-2 text-right text-green-600">-R{{ number_format($order->discount, 2) }}</td>
                                </tr>
                            @endif
                            <tr>
                                <td colspan="3" class="py-2 text-right font-medium">Shipping:</td>
                                <td class="py-2 text-right">R{{ number_format($order->shipping, 2) }}</td>
                            </tr>
                            <tr class="font-bold">
                                <td colspan="3" class="py-2 text-right">Total:</td>
                                <td class="py-2 text-right">R{{ number_format($order->total, 2) }}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

            <!-- Shipping Address -->
            @if($order->address)
                <div class="bg-white rounded-lg shadow">
                    <div class="p-4 border-b">
                        <h2 class="text-lg font-semibold">Shipping Address</h2>
                    </div>
                    <div class="p-4">
                        <p class="font-medium">{{ $order->address->name }}</p>
                        <p class="text-gray-600">{{ $order->address->phone }}</p>
                        <p class="text-gray-600 mt-2">
                            {{ $order->address->address_line_1 }}<br>
                            @if($order->address->address_line_2)
                                {{ $order->address->address_line_2 }}<br>
                            @endif
                            {{ $order->address->city }}, {{ $order->address->province }} {{ $order->address->postal_code }}<br>
                            {{ $order->address->country }}
                        </p>
                    </div>
                </div>
            @endif
        </div>

        <!-- Status & Actions -->
        <div class="space-y-6">
            <!-- Order Status -->
            <div class="bg-white rounded-lg shadow">
                <div class="p-4 border-b">
                    <h2 class="text-lg font-semibold">Order Status</h2>
                </div>
                <div class="p-4 space-y-4">
                    <form action="{{ route('admin.orders.status', $order) }}" method="POST">
                        @csrf
                        @method('PATCH')
                        <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
                        <select name="status" class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                            <option value="pending" {{ $order->status === 'pending' ? 'selected' : '' }}>Pending</option>
                            <option value="processing" {{ $order->status === 'processing' ? 'selected' : '' }}>Processing</option>
                            <option value="shipped" {{ $order->status === 'shipped' ? 'selected' : '' }}>Shipped</option>
                            <option value="delivered" {{ $order->status === 'delivered' ? 'selected' : '' }}>Delivered</option>
                            <option value="completed" {{ $order->status === 'completed' ? 'selected' : '' }}>Completed</option>
                            <option value="cancelled" {{ $order->status === 'cancelled' ? 'selected' : '' }}>Cancelled</option>
                        </select>
                        <button type="submit" class="mt-3 w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                            Update Status
                        </button>
                    </form>
                </div>
            </div>

            <!-- Customer Info -->
            <div class="bg-white rounded-lg shadow">
                <div class="p-4 border-b">
                    <h2 class="text-lg font-semibold">Customer</h2>
                </div>
                <div class="p-4">
                    @if($order->user)
                        <p class="font-medium">{{ $order->user->name }}</p>
                        <p class="text-gray-600">{{ $order->user->email }}</p>
                    @else
                        <p class="text-gray-500">Guest Customer</p>
                    @endif
                </div>
            </div>

            <!-- Payment Info -->
            <div class="bg-white rounded-lg shadow">
                <div class="p-4 border-b">
                    <h2 class="text-lg font-semibold">Payment</h2>
                </div>
                <div class="p-4">
                    <div class="flex justify-between mb-2">
                        <span class="text-gray-600">Method:</span>
                        <span class="font-medium">{{ ucfirst($order->payment_method) }}</span>
                    </div>
                    <div class="flex justify-between mb-2">
                        <span class="text-gray-600">Status:</span>
                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                            {{ $order->payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800' : '' }}
                            {{ $order->payment_status === 'paid' ? 'bg-green-100 text-green-800' : '' }}
                            {{ $order->payment_status === 'failed' ? 'bg-red-100 text-red-800' : '' }}
                            {{ $order->payment_status === 'refunded' ? 'bg-gray-100 text-gray-800' : '' }}">
                            {{ ucfirst($order->payment_status) }}
                        </span>
                    </div>
                    @if($order->payment_id)
                        <div class="flex justify-between">
                            <span class="text-gray-600">Payment ID:</span>
                            <span class="font-medium text-sm">{{ $order->payment_id }}</span>
                        </div>
                    @endif
                </div>
            </div>

            <!-- Order Info -->
            <div class="bg-white rounded-lg shadow">
                <div class="p-4 border-b">
                    <h2 class="text-lg font-semibold">Order Info</h2>
                </div>
                <div class="p-4">
                    <div class="flex justify-between mb-2">
                        <span class="text-gray-600">Order Number:</span>
                        <span class="font-medium">{{ $order->order_number }}</span>
                    </div>
                    <div class="flex justify-between mb-2">
                        <span class="text-gray-600">Date:</span>
                        <span class="font-medium">{{ $order->created_at->format('d M Y H:i') }}</span>
                    </div>
                    @if($order->notes)
                        <div class="mt-4">
                            <span class="text-gray-600">Notes:</span>
                            <p class="mt-1 text-sm">{{ $order->notes }}</p>
                        </div>
                    @endif
                </div>
            </div>
        </div>
    </div>

    <div class="mt-6">
        <a href="{{ route('admin.orders.index') }}" class="text-blue-600 hover:text-blue-800">&larr; Back to Orders</a>
    </div>
</x-admin-layout>
