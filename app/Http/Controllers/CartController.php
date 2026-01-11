<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Models\Coupon;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function index()
    {
        $cart = $this->getOrCreateCart();
        $cart->load(['items.product', 'items.variant', 'coupon']);

        return view('cart.index', compact('cart'));
    }

    public function add(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
            'variant_id' => 'nullable|exists:product_variants,id',
        ]);

        $product = Product::findOrFail($request->product_id);

        if ($product->quantity < $request->quantity) {
            return back()->with('error', 'Not enough stock available.');
        }

        $cart = $this->getOrCreateCart();

        $existingItem = $cart->items()
            ->where('product_id', $product->id)
            ->where('product_variant_id', $request->variant_id)
            ->first();

        if ($existingItem) {
            $newQuantity = $existingItem->quantity + $request->quantity;
            if ($product->quantity < $newQuantity) {
                return back()->with('error', 'Not enough stock available.');
            }
            $existingItem->update(['quantity' => $newQuantity]);
        } else {
            $price = $product->sale_price ?? $product->price;
            
            $cart->items()->create([
                'product_id' => $product->id,
                'product_variant_id' => $request->variant_id,
                'quantity' => $request->quantity,
                'price' => $price,
            ]);
        }

        $this->updateCartCount();

        return back()->with('success', 'Product added to cart!');
    }

    public function update(Request $request, CartItem $cartItem)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        if ($cartItem->product->quantity < $request->quantity) {
            return back()->with('error', 'Not enough stock available.');
        }

        $cartItem->update(['quantity' => $request->quantity]);
        $this->updateCartCount();

        return back()->with('success', 'Cart updated!');
    }

    public function remove(CartItem $cartItem)
    {
        $cartItem->delete();
        $this->updateCartCount();

        return back()->with('success', 'Item removed from cart.');
    }

    public function applyCoupon(Request $request)
    {
        $request->validate([
            'code' => 'required|string',
        ]);

        $coupon = Coupon::where('code', $request->code)->first();

        if (!$coupon) {
            return back()->with('error', 'Invalid coupon code.');
        }

        if (!$coupon->isValid()) {
            return back()->with('error', 'This coupon has expired or is no longer valid.');
        }

        $cart = $this->getOrCreateCart();
        $cart->update(['coupon_id' => $coupon->id]);

        return back()->with('success', 'Coupon applied successfully!');
    }

    public function removeCoupon()
    {
        $cart = $this->getOrCreateCart();
        $cart->update(['coupon_id' => null]);

        return back()->with('success', 'Coupon removed.');
    }

    protected function getOrCreateCart(): Cart
    {
        if (auth()->check()) {
            $cart = Cart::firstOrCreate(['user_id' => auth()->id()]);
            
            // Merge session cart if exists
            $sessionCart = Cart::where('session_id', session()->getId())->first();
            if ($sessionCart) {
                foreach ($sessionCart->items as $item) {
                    $existingItem = $cart->items()
                        ->where('product_id', $item->product_id)
                        ->where('product_variant_id', $item->product_variant_id)
                        ->first();

                    if ($existingItem) {
                        $existingItem->update([
                            'quantity' => $existingItem->quantity + $item->quantity
                        ]);
                    } else {
                        $cart->items()->create([
                            'product_id' => $item->product_id,
                            'product_variant_id' => $item->product_variant_id,
                            'quantity' => $item->quantity,
                            'price' => $item->price,
                        ]);
                    }
                }
                $sessionCart->items()->delete();
                $sessionCart->delete();
            }
        } else {
            $cart = Cart::firstOrCreate(['session_id' => session()->getId()]);
        }

        return $cart;
    }

    protected function updateCartCount()
    {
        $cart = $this->getOrCreateCart();
        session(['cart_count' => $cart->items->sum('quantity')]);
    }
}
