<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class ActivityFeed extends Model
{
    protected $table = 'activity_feed';

    protected $fillable = [
        'user_id',
        'actor_name',
        'action',
        'subject_type',
        'subject_id',
        'description',
        'properties',
        'ip_address',
    ];

    protected $casts = [
        'properties' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function subject(): MorphTo
    {
        return $this->morphTo();
    }

    public static function log(string $action, Model $subject, string $description, ?array $properties = null): self
    {
        return self::create([
            'user_id' => auth()->id(),
            'actor_name' => auth()->user()?->name ?? 'System',
            'action' => $action,
            'subject_type' => get_class($subject),
            'subject_id' => $subject->id,
            'description' => $description,
            'properties' => $properties,
            'ip_address' => request()->ip(),
        ]);
    }
}
