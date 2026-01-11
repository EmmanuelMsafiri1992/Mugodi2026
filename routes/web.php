<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\WishlistController;
use App\Http\Controllers\AccountController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Admin\CategoryController as AdminCategoryController;
use App\Http\Controllers\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Admin\BannerController as AdminBannerController;
use App\Http\Controllers\Admin\CouponController as AdminCouponController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\Admin\SettingsController as AdminSettingsController;
use App\Http\Controllers\PayFastController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\SearchController;
use Illuminate\Support\Facades\Route;

// Public Routes
Route::get("/", [HomeController::class, "index"])->name("home");

// Dashboard redirect based on user role
Route::middleware("auth")->get("/dashboard", function () {
    if (auth()->user()->role === 'admin') {
        return redirect()->route('admin.dashboard');
    }
    return redirect()->route('account.dashboard');
})->name("dashboard");

// Products
Route::get("/products", [ProductController::class, "index"])->name("products.index");
Route::get("/products/search", [ProductController::class, "search"])->name("products.search");
Route::get("/search/autocomplete", [SearchController::class, "autocomplete"])->name("search.autocomplete");
Route::get("/deals", [ProductController::class, "deals"])->name("products.deals");
Route::get("/product/{product:slug}", [ProductController::class, "show"])->name("products.show");

// Categories
Route::get("/category/{category:slug}", [CategoryController::class, "show"])->name("categories.show");

// Cart
Route::get("/cart", [CartController::class, "index"])->name("cart.index");
Route::post("/cart/add", [CartController::class, "add"])->name("cart.add");
Route::patch("/cart/update/{cartItem}", [CartController::class, "update"])->name("cart.update");
Route::delete("/cart/remove/{cartItem}", [CartController::class, "remove"])->name("cart.remove");
Route::post("/cart/coupon", [CartController::class, "applyCoupon"])->name("cart.coupon");

// Wishlist
Route::middleware("auth")->group(function () {
    Route::get("/wishlist", [WishlistController::class, "index"])->name("wishlist.index");
    Route::post("/wishlist/add/{product}", [WishlistController::class, "add"])->name("wishlist.add");
    Route::delete("/wishlist/remove/{product}", [WishlistController::class, "remove"])->name("wishlist.remove");
});

// Reviews
Route::middleware("auth")->group(function () {
    Route::post("/product/{product}/review", [ReviewController::class, "store"])->name("reviews.store");
});

// Checkout
Route::middleware("auth")->group(function () {
    Route::get("/checkout", [CheckoutController::class, "index"])->name("checkout.index");
    Route::post("/checkout/address", [CheckoutController::class, "saveAddress"])->name("checkout.address");
    Route::get("/checkout/payment", [CheckoutController::class, "payment"])->name("checkout.payment");
    Route::post("/checkout/process", [CheckoutController::class, "process"])->name("checkout.process");
    Route::get("/checkout/success/{order}", [CheckoutController::class, "success"])->name("checkout.success");
});

// Account
Route::middleware("auth")->prefix("account")->name("account.")->group(function () {
    Route::get("/", [AccountController::class, "dashboard"])->name("dashboard");
    Route::get("/orders", [AccountController::class, "orders"])->name("orders");
    Route::get("/orders/{order}", [AccountController::class, "orderDetail"])->name("orders.show");
    Route::get("/addresses", [AccountController::class, "addresses"])->name("addresses");
    Route::post("/addresses", [AccountController::class, "storeAddress"])->name("addresses.store");
    Route::get("/profile", [ProfileController::class, "edit"])->name("profile.edit");
    Route::patch("/profile", [ProfileController::class, "update"])->name("profile.update");
});

// Admin Routes
Route::middleware(["auth", "admin"])->prefix("admin")->name("admin.")->group(function () {
    Route::get("/", [AdminDashboardController::class, "index"])->name("dashboard");
    Route::resource("products", AdminProductController::class);
    Route::delete("/products/image/{image}", [AdminProductController::class, "deleteImage"])->name("products.deleteImage");
    Route::resource("categories", AdminCategoryController::class);
    Route::get("/orders", [AdminOrderController::class, "index"])->name("orders.index");
    Route::get("/orders/{order}", [AdminOrderController::class, "show"])->name("orders.show");
    Route::patch("/orders/{order}/status", [AdminOrderController::class, "updateStatus"])->name("orders.status");
    Route::resource("banners", AdminBannerController::class);
    Route::resource("coupons", AdminCouponController::class);
    Route::resource("users", AdminUserController::class)->except(['show']);

    // Settings
    Route::get("/settings", [AdminSettingsController::class, "index"])->name("settings.index");
    Route::put("/settings", [AdminSettingsController::class, "update"])->name("settings.update");
    Route::get("/settings/payment", [AdminSettingsController::class, "payment"])->name("settings.payment");
    Route::put("/settings/payment", [AdminSettingsController::class, "updatePayment"])->name("settings.payment.update");
});

// PayFast ITN
Route::post("/payfast/notify", [PayFastController::class, "notify"])->name("payfast.notify");

require __DIR__."/auth.php";