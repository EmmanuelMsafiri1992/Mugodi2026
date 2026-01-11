<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Cart extends Model
{
    protected $fillable = [
        'user_id',
        'session_id',
        'coupon_id',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(CartItem::class);
    }

    public function coupon(): BelongsTo
    {
        return $this->belongsTo(Coupon::class);
    }

    public function getSubtotalAttribute(): float
    {
        return $this->items->sum(function ($item) {
            return $item->price * $item->quantity;
        });
    }

    public function getDiscountAttribute(): float
    {
        if (!$this->coupon) {
            return 0;
        }

        $subtotal = $this->subtotal;

        if ($this->coupon->min_order_amount && $subtotal < $this->coupon->min_order_amount) {
            return 0;
        }

        if ($this->coupon->type === 'percentage') {
            $discount = $subtotal * ($this->coupon->value / 100);
        } else {
            $discount = $this->coupon->value;
        }

        if ($this->coupon->max_discount_amount) {
            $discount = min($discount, $this->coupon->max_discount_amount);
        }

        return $discount;
    }

    public function getTotalAttribute(): float
    {
        return max(0, $this->subtotal - $this->discount);
    }

    public function getItemCountAttribute(): int
    {
        return $this->items->sum('quantity');
    }
}
