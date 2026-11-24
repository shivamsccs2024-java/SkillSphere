<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RoadmapStepCompletion extends Model
{
    protected $fillable = [
        'user_id',
        'roadmap_step_id',
        'completed_at',
    ];

    protected function casts(): array
    {
        return [
            'completed_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function roadmapStep(): BelongsTo
    {
        return $this->belongsTo(RoadmapStep::class);
    }
}