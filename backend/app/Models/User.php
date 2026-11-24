<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

use App\Models\Enrollment;
use App\Models\RoadmapStepCompletion;
use App\Models\ContactMessage;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'career_title',
        'bio',
        'avatar',
        'role',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // User has many enrollments
    public function enrollments()
    {
        return $this->hasMany(Enrollment::class);
    }

    // User has many completed roadmap steps
    public function roadmapStepCompletions()
    {
        return $this->hasMany(RoadmapStepCompletion::class);
    }

    // User has many contact messages
    public function contactMessages()
    {
        return $this->hasMany(ContactMessage::class);
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