<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Project extends Model
{
    protected $fillable = [
        'location',
        'lot',
        'bldg_improvement',
        'right_over_land',
        'nature',
        'existing_land_use',
        'cost',
        'question_1',
        'if_yes_a',
        'if_yes_b',
        'question_b',
        'if_yes_c',
        'if_yes_d',
    ];

    protected $casts = [
        'cost' => 'decimal:2',
    ];

    /**
     * Get the applications for the project.
     */
    public function applications(): HasMany
    {
        return $this->hasMany(Application::class, 'project_id');
    }
}
