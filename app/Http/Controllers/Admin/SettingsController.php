<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class SettingsController extends Controller
{
    public function index()
    {
        $settings = Setting::pluck('value', 'key')->toArray();

        return view('admin.settings.index', compact('settings'));
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'site_name' => 'required|string|max:255',
            'site_tagline' => 'nullable|string|max:255',
            'contact_email' => 'required|email',
            'contact_phone' => 'nullable|string|max:20',
            'contact_address' => 'nullable|string|max:500',
            'currency' => 'required|string|max:10',
            'currency_symbol' => 'required|string|max:5',
            'free_shipping_threshold' => 'nullable|numeric|min:0',
            'low_stock_threshold' => 'nullable|integer|min:0',
            'footer_text' => 'nullable|string|max:500',
            'facebook_url' => 'nullable|url|max:255',
            'twitter_url' => 'nullable|url|max:255',
            'instagram_url' => 'nullable|url|max:255',
        ]);

        foreach ($validated as $key => $value) {
            Setting::updateOrCreate(
                ['key' => $key],
                ['value' => $value ?? '']
            );
        }

        Cache::forget('settings');

        return back()->with('success', 'Settings updated successfully.');
    }

    public function payment()
    {
        $settings = Setting::pluck('value', 'key')->toArray();

        return view('admin.settings.payment', compact('settings'));
    }

    public function updatePayment(Request $request)
    {
        $validated = $request->validate([
            'payfast_merchant_id' => 'nullable|string|max:255',
            'payfast_merchant_key' => 'nullable|string|max:255',
            'payfast_passphrase' => 'nullable|string|max:255',
            'payfast_sandbox' => 'nullable|boolean',
            'cod_enabled' => 'nullable|boolean',
            'eft_enabled' => 'nullable|boolean',
            'eft_bank_name' => 'nullable|string|max:255',
            'eft_account_name' => 'nullable|string|max:255',
            'eft_account_number' => 'nullable|string|max:255',
            'eft_branch_code' => 'nullable|string|max:50',
            'eft_reference' => 'nullable|string|max:255',
        ]);

        // Handle boolean fields
        $validated['payfast_sandbox'] = $request->has('payfast_sandbox') ? '1' : '0';
        $validated['cod_enabled'] = $request->has('cod_enabled') ? '1' : '0';
        $validated['eft_enabled'] = $request->has('eft_enabled') ? '1' : '0';

        foreach ($validated as $key => $value) {
            Setting::updateOrCreate(
                ['key' => $key],
                ['value' => $value ?? '']
            );
        }

        Cache::forget('settings');

        return back()->with('success', 'Payment settings updated successfully.');
    }
}
