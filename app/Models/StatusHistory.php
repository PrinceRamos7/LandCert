<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StatusHistory extends Model
{
    protected $table = 'status_history';

    protected $fillable = [
        'request_id',
        'status_type',
        'old_status',
        'new_status',
        'changed_by',
        'notes',
    ];

    /**
     * Get the request that owns the status history.
     */
    public function request(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Request::class, 'request_id');
    }

    /**
     * Get the user who changed the status.
     */
    public function changer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'changed_by');
    }

    /**
     * Alias for changer relationship (for backwards compatibility).
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'changed_by');
    }

    /**
     * Log a status change.
     */
    public static function logChange(
        int $requestId,
        string $statusType,
        ?string $oldStatus,
        string $newStatus,
        ?int $changedBy = null,
        ?string $notes = null
    ): self {
        return self::create([
            'request_id' => $requestId,
            'status_type' => $statusType,
            'old_status' => $oldStatus,
            'new_status' => $newStatus,
            'changed_by' => $changedBy ?? auth()->id(),
            'notes' => $notes,
        ]);
    }
}
