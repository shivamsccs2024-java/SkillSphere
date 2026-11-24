<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;


class Course extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'description',
        'category',
        'level',
        'price',
        'duration',
        'image',
        'instructor',
        'rating',
        'students_count',
        'what_you_learn',
        'curriculum',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'rating' => 'decimal:1',
            'students_count' => 'integer',
            'what_you_learn' => 'array',
            'curriculum' => 'array',
            'is_active' => 'boolean',
        ];
    }

    public function enrollments(): HasMany
    {
        return $this->hasMany(Enrollment::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function wishlists()
    {
        return $this->hasMany(Wishlist::class);
    }
}