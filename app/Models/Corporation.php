<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Corporation extends Model
{
    protected $fillable = [
        'corporation_name',
        'corporation_address',
    ];

    /**
     * Get the applications for the corporation.
     */
    public function applications(): HasMany
    {
        return $this->hasMany(Application::class, 'corp_id');
    }
}
