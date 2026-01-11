<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PayFastController extends Controller
{
    public function notify(Request $request)
    {
        Log::info('PayFast ITN received', $request->all());

        $pfData = $request->except('signature');
        $pfParamString = '';
        foreach ($pfData as $key => $val) {
            $pfParamString .= $key . '=' . urlencode(trim($val)) . '&';
        }
        $pfParamString = rtrim($pfParamString, '&');

        $passphrase = config('services.payfast.passphrase');
        if ($passphrase) {
            $pfParamString .= '&passphrase=' . urlencode($passphrase);
        }

        $signature = md5($pfParamString);

        if ($signature !== $request->signature) {
            Log::error('PayFast ITN: Invalid signature');
            return response('Invalid signature', 400);
        }

        $order = Order::where('order_number', $request->m_payment_id)->first();

        if (!$order) {
            Log::error('PayFast ITN: Order not found', ['m_payment_id' => $request->m_payment_id]);
            return response('Order not found', 404);
        }

        $paymentStatus = $request->payment_status;

        if ($paymentStatus === 'COMPLETE') {
            $order->update([
                'payment_status' => 'paid',
                'status' => 'processing',
                'paid_at' => now(),
                'payment_reference' => $request->pf_payment_id,
            ]);
            Log::info('PayFast ITN: Payment complete', ['order' => $order->order_number]);
        } elseif ($paymentStatus === 'CANCELLED') {
            $order->update([
                'payment_status' => 'cancelled',
                'status' => 'cancelled',
            ]);
            Log::info('PayFast ITN: Payment cancelled', ['order' => $order->order_number]);
        } elseif ($paymentStatus === 'FAILED') {
            $order->update([
                'payment_status' => 'failed',
                'status' => 'failed',
            ]);
            Log::info('PayFast ITN: Payment failed', ['order' => $order->order_number]);
        }

        return response('OK', 200);
    }
}
