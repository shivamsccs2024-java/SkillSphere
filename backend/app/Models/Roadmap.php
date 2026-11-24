<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Roadmap extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'description',
        'duration',
        'level',
        'icon',
        'color',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    public function steps(): HasMany
    {
        return $this->hasMany(RoadmapStep::class)->orderBy('step_order');
    }
}