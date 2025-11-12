<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Reminder extends Model
{
    protected $fillable = [
        'user_id',
        'type',
        'related_id',
        'related_type',
        'scheduled_at',
        'sent_at',
        'status',
        'message',
        'metadata',
    ];

    protected $casts = [
        'scheduled_at' => 'datetime',
        'sent_at' => 'datetime',
        'metadata' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function related(): MorphTo
    {
        return $this->morphTo();
    }

    public function markAsSent(): void
    {
        $this->update([
            'status' => 'sent',
            'sent_at' => now(),
        ]);
    }

    public function markAsFailed(): void
    {
        $this->update(['status' => 'failed']);
    }

    public static function schedulePaymentReminder($requestId, $userId, $days = 3)
    {
        return self::create([
            'user_id' => $userId,
            'type' => 'payment_due',
            'related_id' => $requestId,
            'related_type' => 'App\Models\Request',
            'scheduled_at' => now()->addDays($days),
            'message' => 'Your payment is due. Please submit your payment receipt.',
            'metadata' => ['days' => $days],
        ]);
    }

    public static function scheduleDocumentReminder($requestId, $userId, $days = 7)
    {
        return self::create([
            'user_id' => $userId,
            'type' => 'document_pending',
            'related_id' => $requestId,
            'related_type' => 'App\Models\Request',
            'scheduled_at' => now()->addDays($days),
            'message' => 'Your documents are still pending. Please complete your submission.',
            'metadata' => ['days' => $days],
        ]);
    }

    public static function scheduleCertificateExpiryReminder($certificateId, $userId, $days = 30)
    {
        $certificate = Certificate::find($certificateId);
        if (!$certificate) return null;

        return self::create([
            'user_id' => $userId,
            'type' => 'certificate_expiry',
            'related_id' => $certificateId,
            'related_type' => 'App\Models\Certificate',
            'scheduled_at' => now()->addDays($days),
            'message' => 'Your certificate will expire soon. Please renew it.',
            'metadata' => ['days' => $days, 'certificate_number' => $certificate->certificate_number],
        ]);
    }
}
