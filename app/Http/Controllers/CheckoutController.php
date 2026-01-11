<?php

namespace App\Http\Controllers;

use App\Models\Address;
use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CheckoutController extends Controller
{
    public function index()
    {
        $cart = $this->getCart();
        if (!$cart || $cart->items->isEmpty()) {
            return redirect()->route('cart.index')->with('error', 'Your cart is empty.');
        }
        $addresses = auth()->user()->addresses;
        return view('checkout.index', compact('cart', 'addresses'));
    }

    public function saveAddress(Request $request)
    {
        $request->validate([
            'address_id' => 'required_without:new_address|exists:addresses,id',
            'new_address' => 'sometimes|boolean',
            'name' => 'required_if:new_address,1|string|max:255',
            'phone' => 'required_if:new_address,1|string|max:20',
            'street_address' => 'required_if:new_address,1|string|max:255',
            'city' => 'required_if:new_address,1|string|max:100',
            'province' => 'required_if:new_address,1|string|max:100',
            'postal_code' => 'required_if:new_address,1|string|max:10',
        ]);

        if ($request->new_address) {
            $address = auth()->user()->addresses()->create($request->only(['name', 'phone', 'street_address', 'city', 'province', 'postal_code']));
            session(['checkout_address_id' => $address->id]);
        } else {
            session(['checkout_address_id' => $request->address_id]);
        }
        return redirect()->route('checkout.payment');
    }

    public function payment()
    {
        $cart = $this->getCart();
        $addressId = session('checkout_address_id');
        if (!$cart || $cart->items->isEmpty()) {
            return redirect()->route('cart.index')->with('error', 'Your cart is empty.');
        }
        if (!$addressId) {
            return redirect()->route('checkout.index')->with('error', 'Please select a delivery address.');
        }
        $address = Address::findOrFail($addressId);
        return view('checkout.payment', compact('cart', 'address'));
    }

    public function process(Request $request)
    {
        $cart = $this->getCart();
        $addressId = session('checkout_address_id');
        if (!$cart || $cart->items->isEmpty()) {
            return redirect()->route('cart.index');
        }
        if (!$addressId) {
            return redirect()->route('checkout.index');
        }
        $address = Address::findOrFail($addressId);

        try {
            DB::beginTransaction();
            $order = Order::create([
                'user_id' => auth()->id(),
                'order_number' => 'ORD-' . strtoupper(Str::random(10)),
                'status' => 'pending',
                'payment_status' => 'pending',
                'payment_method' => 'payfast',
                'subtotal' => $cart->subtotal,
                'discount' => $cart->discount,
                'shipping' => 0,
                'tax' => 0,
                'total' => $cart->total,
                'coupon_id' => $cart->coupon_id,
                'shipping_name' => $address->name,
                'shipping_phone' => $address->phone,
                'shipping_address' => $address->street_address,
                'shipping_city' => $address->city,
                'shipping_province' => $address->province,
                'shipping_postal_code' => $address->postal_code,
                'notes' => $request->notes,
            ]);

            foreach ($cart->items as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item->product_id,
                    'product_variant_id' => $item->product_variant_id,
                    'quantity' => $item->quantity,
                    'price' => $item->price,
                    'total' => $item->total,
                ]);
                $item->product->decrement('quantity', $item->quantity);
            }

            $cart->items()->delete();
            $cart->update(['coupon_id' => null]);
            session()->forget('checkout_address_id');
            session(['cart_count' => 0]);
            DB::commit();

            return $this->redirectToPayFast($order);
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'An error occurred. Please try again.');
        }
    }

    public function success(Order $order)
    {
        if ($order->user_id !== auth()->id()) {
            abort(403);
        }
        return view('checkout.success', compact('order'));
    }

    protected function getCart(): ?Cart
    {
        return Cart::where('user_id', auth()->id())->with(['items.product', 'coupon'])->first();
    }

    protected function redirectToPayFast(Order $order)
    {
        $sandbox = config('services.payfast.sandbox', true);
        $payFastUrl = $sandbox ? 'https://sandbox.payfast.co.za/eng/process' : 'https://www.payfast.co.za/eng/process';

        $data = [
            'merchant_id' => config('services.payfast.merchant_id', '10000100'),
            'merchant_key' => config('services.payfast.merchant_key', '46f0cd694581a'),
            'return_url' => route('checkout.success', $order),
            'cancel_url' => route('cart.index'),
            'notify_url' => url('/payfast/notify'),
            'm_payment_id' => $order->order_number,
            'amount' => number_format($order->total, 2, '.', ''),
            'item_name' => 'Order #' . $order->order_number,
            'email_address' => auth()->user()->email,
        ];

        $signatureString = http_build_query($data);
        $passphrase = config('services.payfast.passphrase');
        if ($passphrase) {
            $signatureString .= '&passphrase=' . urlencode($passphrase);
        }
        $data['signature'] = md5($signatureString);

        return view('checkout.payfast', compact('data', 'payFastUrl'));
    }
}
