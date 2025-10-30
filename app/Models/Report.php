<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Report extends Model
{
    protected $primaryKey = 'report_id';

    protected $fillable = [
        'app_id',
        'description',
        'date_certified',
        'amount',
        'evaluation',
        'date_reported',
        'issued_by',
    ];

    protected $casts = [
        'date_certified' => 'date',
        'date_reported' => 'datetime',
        'amount' => 'decimal:2',
    ];

    /**
     * Get the application that owns the report.
     */
    public function application(): BelongsTo
    {
        return $this->belongsTo(Application::class, 'app_id', 'id');
    }
}
