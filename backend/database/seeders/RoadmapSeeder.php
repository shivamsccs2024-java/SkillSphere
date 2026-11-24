<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Roadmap;

class RoadmapSeeder extends Seeder
{
    public function run(): void
    {
        $roadmaps = [
            [
                'title' => 'Frontend Developer',
                'slug' => 'frontend-developer',
                'description' => 'Learn frontend development from basics to advanced.',
                'duration' => '6 Months',
                'level' => 'Beginner',
                'icon' => 'Monitor',
                'color' => '#4F46E5',
                'is_active' => true,
            ],
            [
                'title' => 'Backend Developer',
                'slug' => 'backend-developer',
                'description' => 'Learn backend development, APIs and databases.',
                'duration' => '8 Months',
                'level' => 'Intermediate',
                'icon' => 'Server',
                'color' => '#0EA5E9',
                'is_active' => true,
            ],
            [
                'title' => 'Full Stack Developer',
                'slug' => 'full-stack-developer',
                'description' => 'Learn frontend and backend development.',
                'duration' => '10 Months',
                'level' => 'Intermediate',
                'icon' => 'Code',
                'color' => '#10B981',
                'is_active' => true,
            ],
        ];

        foreach ($roadmaps as $roadmap) {
            Roadmap::updateOrCreate(
                ['slug' => $roadmap['slug']],
                $roadmap
            );
        }
    }
}