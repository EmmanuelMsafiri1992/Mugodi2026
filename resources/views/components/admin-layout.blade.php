@props(['title' => 'Admin'])

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $title }} - QuickCart Admin</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="bg-gray-100">
    <div class="min-h-screen flex">
        <!-- Sidebar -->
        <aside class="w-64 bg-gray-800 text-white">
            <div class="p-4">
                <a href="{{ route('admin.dashboard') }}" class="text-xl font-bold">QuickCart Admin</a>
            </div>
            <nav class="mt-4">
                <a href="{{ route('admin.dashboard') }}" class="block px-4 py-3 hover:bg-gray-700 {{ request()->routeIs('admin.dashboard') ? 'bg-gray-700' : '' }}">
                    Dashboard
                </a>
                <a href="{{ route('admin.products.index') }}" class="block px-4 py-3 hover:bg-gray-700 {{ request()->routeIs('admin.products.*') ? 'bg-gray-700' : '' }}">
                    Products
                </a>
                <a href="{{ route('admin.categories.index') }}" class="block px-4 py-3 hover:bg-gray-700 {{ request()->routeIs('admin.categories.*') ? 'bg-gray-700' : '' }}">
                    Categories
                </a>
                <a href="{{ route('admin.orders.index') }}" class="block px-4 py-3 hover:bg-gray-700 {{ request()->routeIs('admin.orders.*') ? 'bg-gray-700' : '' }}">
                    Orders
                </a>
                <a href="{{ route('admin.banners.index') }}" class="block px-4 py-3 hover:bg-gray-700 {{ request()->routeIs('admin.banners.*') ? 'bg-gray-700' : '' }}">
                    Banners
                </a>
                <a href="{{ route('admin.coupons.index') }}" class="block px-4 py-3 hover:bg-gray-700 {{ request()->routeIs('admin.coupons.*') ? 'bg-gray-700' : '' }}">
                    Coupons
                </a>
                <div class="border-t border-gray-700 mt-4 pt-4">
                    <a href="{{ route('home') }}" class="block px-4 py-3 hover:bg-gray-700">View Store</a>
                    <form action="{{ route('logout') }}" method="POST" class="px-4 py-3">
                        @csrf
                        <button type="submit" class="hover:text-gray-300">Logout</button>
                    </form>
                </div>
            </nav>
        </aside>

        <!-- Main Content -->
        <div class="flex-1">
            <header class="bg-white shadow px-6 py-4">
                <h1 class="text-xl font-semibold text-gray-800">{{ $title }}</h1>
            </header>

            <main class="p-6">
                @if(session('success'))
                    <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                        {{ session('success') }}
                    </div>
                @endif

                @if(session('error'))
                    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {{ session('error') }}
                    </div>
                @endif

                {{ $slot }}
            </main>
        </div>
    </div>
</body>
</html>