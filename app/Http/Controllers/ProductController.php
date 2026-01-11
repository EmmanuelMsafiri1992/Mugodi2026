<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use App\Models\Brand;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::active()->inStock()->with(["category", "brand"]);

        // Filters
        if ($request->filled("category")) {
            $query->where("category_id", $request->category);
        }

        if ($request->filled("brand")) {
            $query->where("brand_id", $request->brand);
        }

        if ($request->filled("min_price")) {
            $query->where("price", ">=", $request->min_price);
        }

        if ($request->filled("max_price")) {
            $query->where("price", "<=", $request->max_price);
        }

        if ($request->boolean("sale")) {
            $query->onSale();
        }

        // Sorting
        switch ($request->get("sort", "newest")) {
            case "price_low":
                $query->orderBy("price", "asc");
                break;
            case "price_high":
                $query->orderBy("price", "desc");
                break;
            case "popular":
                $query->orderBy("sold_count", "desc");
                break;
            case "rating":
                $query->orderBy("avg_rating", "desc");
                break;
            default:
                $query->latest();
        }

        $products = $query->paginate(20);
        $categories = Category::active()->parents()->withCount("products")->get();
        $brands = Brand::active()->withCount("products")->get();

        return view("products.index", compact("products", "categories", "brands"));
    }

    public function show(Product $product)
    {
        $product->load(["category", "brand", "images", "variants", "reviews" => function ($q) {
            $q->approved()->with("user")->latest()->take(10);
        }]);

        $product->increment("view_count");

        $relatedProducts = Product::active()
            ->inStock()
            ->where("category_id", $product->category_id)
            ->where("id", "!=", $product->id)
            ->with(["category", "brand"])
            ->take(4)
            ->get();

        return view("products.show", compact("product", "relatedProducts"));
    }

    public function search(Request $request)
    {
        $query = $request->get("q");

        $products = Product::active()
            ->where(function ($q) use ($query) {
                $q->where("name", "like", "%{$query}%")
                  ->orWhere("description", "like", "%{$query}%")
                  ->orWhere("sku", "like", "%{$query}%");
            })
            ->with(["category", "brand"])
            ->paginate(20);

        $categories = Category::active()->parents()->withCount("products")->get();
        $brands = Brand::active()->withCount("products")->get();

        return view("products.index", compact("products", "categories", "brands", "query"));
    }

    public function deals()
    {
        $products = Product::active()
            ->dealsOfDay()
            ->inStock()
            ->with(["category", "brand"])
            ->paginate(20);

        $categories = Category::active()->parents()->withCount("products")->get();
        $brands = Brand::active()->withCount("products")->get();

        return view("products.deals", compact("products", "categories", "brands"));
    }
}