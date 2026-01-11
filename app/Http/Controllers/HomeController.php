<?php

namespace App\Http\Controllers;

use App\Models\Banner;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function index(Request $request)
    {
        $banners = Banner::active()->hero()->ordered()->get();

        // Get all categories with product counts
        $categories = Category::active()
            ->parents()
            ->withCount(['products' => function ($query) {
                $query->active()->inStock();
            }])
            ->orderBy('name')
            ->get();

        // Get all brands
        $brands = Brand::orderBy('name')->get();

        // Build products query with filters
        $query = Product::active()
            ->inStock()
            ->with(['category', 'brand']);

        // Filter by category
        if ($request->filled('category')) {
            $query->where('category_id', $request->category);
        }

        // Filter by brand
        if ($request->filled('brand')) {
            $query->where('brand_id', $request->brand);
        }

        // Filter by sale
        if ($request->filled('sale')) {
            $query->onSale();
        }

        // Sorting
        switch ($request->get('sort', 'newest')) {
            case 'price_low':
                $query->orderBy('price', 'asc');
                break;
            case 'price_high':
                $query->orderBy('price', 'desc');
                break;
            case 'popular':
                $query->orderBy('views', 'desc');
                break;
            case 'newest':
            default:
                $query->latest();
                break;
        }

        $products = $query->paginate(24);

        return view('home', compact(
            'banners',
            'categories',
            'brands',
            'products'
        ));
    }
}
