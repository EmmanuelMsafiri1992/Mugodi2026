<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value')->nullable();
            $table->timestamps();
        });

        // Insert default settings
        $defaults = [
            'site_name' => 'QuickCart',
            'site_tagline' => 'Your One-Stop Online Shop',
            'contact_email' => 'info@quickcart.co.za',
            'contact_phone' => '+27 11 123 4567',
            'contact_address' => 'Johannesburg, South Africa',
            'currency' => 'ZAR',
            'currency_symbol' => 'R',
            'free_shipping_threshold' => '500',
            'low_stock_threshold' => '10',
            'footer_text' => '© 2026 QuickCart. All rights reserved.',
            'payfast_sandbox' => '1',
            'cod_enabled' => '1',
            'eft_enabled' => '0',
        ];

        foreach ($defaults as $key => $value) {
            DB::table('settings')->insert([
                'key' => $key,
                'value' => $value,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};
