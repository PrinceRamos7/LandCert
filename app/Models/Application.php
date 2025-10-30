<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Application extends Model
{
    protected $fillable = [
        'corp_id',
        'project_id',
        'applicant_name',
        'applicant_address',
        'authorized_representative',
        'representative_address',
        'authorization_letter_path',
        'preffered_release',
    ];

    /**
     * Get the corporation that owns the application.
     */
    public function corporation(): BelongsTo
    {
        return $this->belongsTo(Corporation::class, 'corp_id');
    }

    /**
     * Get the project that owns the application.
     */
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class, 'project_id');
    }

    /**
     * Get the report for the application.
     */
    public function report(): HasOne
    {
        return $this->hasOne(Report::class, 'app_id', 'id');
    }
}
