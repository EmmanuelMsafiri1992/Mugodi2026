@props(["title" => null])

<!DOCTYPE html>
<html lang="{{ str_replace("_", "-", app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>{{ $title ?? config("app.name", "QuickCart") }} - South Africas Leading Online Store</title>
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=inter:400,500,600,700&display=swap" rel="stylesheet" />
    @vite(["resources/css/app.css", "resources/js/app.js"])
    <style>[x-cloak] { display: none !important; }</style>
</head>
<body class="font-sans antialiased bg-gray-100">
    <div class="min-h-screen flex flex-col">
        @include("partials.header")

        @if(session("success"))
            <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3">
                <div class="max-w-7xl mx-auto">{{ session("success") }}</div>
            </div>
        @endif

        @if(session("error"))
            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3">
                <div class="max-w-7xl mx-auto">{{ session("error") }}</div>
            </div>
        @endif

        <main class="flex-1">{{ $slot }}</main>

        @include("partials.footer")
    </div>
</body>
</html>