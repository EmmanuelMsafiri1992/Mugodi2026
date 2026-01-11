<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    public function autocomplete(Request $request)
    {
        $query = $request->get('q', '');

        if (strlen($query) < 2) {
            return response()->json([]);
        }

        $products = Product::active()
            ->where('name', 'like', "%{$query}%")
            ->select('id', 'name', 'slug', 'price', 'sale_price')
            ->with(['primaryImage'])
            ->take(8)
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'slug' => $product->slug,
                    'price' => $product->sale_price ?? $product->price,
                    'original_price' => $product->sale_price ? $product->price : null,
                    'image' => $product->primaryImage ? asset('storage/' . $product->primaryImage->image) : null,
                    'url' => route('products.show', $product->slug),
                ];
            });

        return response()->json($products);
    }
}
