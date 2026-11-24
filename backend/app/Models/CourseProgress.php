<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CourseProgress extends Model
{
    protected $fillable = [
        'enrollment_id',
        'progress_percentage',
        'started_at',
        'completed_at',
    ];

    protected function casts(): array
    {
        return [
            'progress_percentage' => 'integer',
            'started_at' => 'datetime',
            'completed_at' => 'datetime',
        ];
    }

    public function enrollment(): BelongsTo
    {
        return $this->belongsTo(Enrollment::class);
    }
}