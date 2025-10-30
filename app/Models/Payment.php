<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Payment extends Model
{
    protected $fillable = [
        'request_id',
        'application_id',
        'amount',
        'payment_method',
        'receipt_number',
        'receipt_file_path',
        'payment_date',
        'payment_status',
        'verified_by',
        'verified_at',
        'rejection_reason',
        'notes',
    ];

    protected $casts = [
        'payment_date' => 'date',
        'verified_at' => 'datetime',
        'amount' => 'decimal:2',
    ];

    /**
     * Get the request that owns the payment.
     */
    public function request(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Request::class, 'request_id');
    }

    /**
     * Get the application that owns the payment.
     */
    public function application(): BelongsTo
    {
        return $this->belongsTo(Application::class, 'application_id');
    }

    /**
     * Get the user who verified the payment.
     */
    public function verifier(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    /**
     * Get the certificate for this payment.
     */
    public function certificate(): HasOne
    {
        return $this->hasOne(Certificate::class, 'payment_id');
    }
}
