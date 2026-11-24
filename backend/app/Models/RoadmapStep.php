<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class RoadmapStep extends Model
{
    protected $fillable = [
        'roadmap_id',
        'title',
        'description',
        'topics',
        'step_order',
        'duration',
    ];

    protected function casts(): array
    {
        return [
            'topics' => 'array',
            'step_order' => 'integer',
        ];
    }

    public function roadmap(): BelongsTo
    {
        return $this->belongsTo(Roadmap::class);
    }

    public function completions(): HasMany
    {
        return $this->hasMany(RoadmapStepCompletion::class);
    }
}