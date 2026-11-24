<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Roadmap;
use App\Models\RoadmapStep;

class RoadmapStepSeeder extends Seeder
{
    public function run(): void
    {
        $roadmapSteps = [
            'frontend-developer' => [
                [
                    'title' => 'HTML & CSS Basics',
                    'description' => 'Learn webpage structure and styling.',
                    'topics' => ['HTML', 'CSS', 'Forms', 'Flexbox'],
                    'step_order' => 1,
                    'duration' => '4 Weeks',
                ],
                [
                    'title' => 'JavaScript Fundamentals',
                    'description' => 'Learn programming concepts using JavaScript.',
                    'topics' => ['Variables', 'Functions', 'Arrays', 'DOM'],
                    'step_order' => 2,
                    'duration' => '6 Weeks',
                ],
                [
                    'title' => 'Advanced JavaScript',
                    'description' => 'Understand modern JavaScript features.',
                    'topics' => ['ES6', 'Promises', 'Async/Await', 'Fetch API'],
                    'step_order' => 3,
                    'duration' => '4 Weeks',
                ],
                [
                    'title' => 'React JS Development',
                    'description' => 'Build dynamic interfaces using React.',
                    'topics' => ['Components', 'Props', 'State', 'Hooks'],
                    'step_order' => 4,
                    'duration' => '6 Weeks',
                ],
                [
                    'title' => 'Frontend Projects',
                    'description' => 'Build responsive real-world frontend projects.',
                    'topics' => ['React Router', 'API Integration', 'Responsive Design', 'GitHub'],
                    'step_order' => 5,
                    'duration' => '4 Weeks',
                ],
            ],

            'backend-developer' => [
                [
                    'title' => 'Programming Fundamentals',
                    'description' => 'Understand programming and server-side concepts.',
                    'topics' => ['Variables', 'Functions', 'OOP', 'Exception Handling'],
                    'step_order' => 1,
                    'duration' => '4 Weeks',
                ],
                [
                    'title' => 'PHP Fundamentals',
                    'description' => 'Learn PHP backend programming.',
                    'topics' => ['PHP Syntax', 'Arrays', 'Functions', 'OOP'],
                    'step_order' => 2,
                    'duration' => '4 Weeks',
                ],
                [
                    'title' => 'Laravel Framework',
                    'description' => 'Build backend applications using Laravel.',
                    'topics' => ['MVC', 'Routing', 'Models', 'Middleware'],
                    'step_order' => 3,
                    'duration' => '6 Weeks',
                ],
                [
                    'title' => 'Database Management',
                    'description' => 'Design and manage relational databases.',
                    'topics' => ['MySQL', 'Relationships', 'Joins', 'Migrations'],
                    'step_order' => 4,
                    'duration' => '4 Weeks',
                ],
                [
                    'title' => 'REST API Development',
                    'description' => 'Create and secure REST APIs.',
                    'topics' => ['API Routes', 'Validation', 'Sanctum', 'Postman'],
                    'step_order' => 5,
                    'duration' => '4 Weeks',
                ],
            ],

            'full-stack-developer' => [
                [
                    'title' => 'HTML, CSS & JavaScript',
                    'description' => 'Learn the foundations of frontend development.',
                    'topics' => ['HTML', 'CSS', 'JavaScript', 'Bootstrap'],
                    'step_order' => 1,
                    'duration' => '6 Weeks',
                ],
                [
                    'title' => 'React Development',
                    'description' => 'Build frontend applications using React.',
                    'topics' => ['Components', 'Hooks', 'Routing', 'Axios'],
                    'step_order' => 2,
                    'duration' => '6 Weeks',
                ],
                [
                    'title' => 'Backend Development',
                    'description' => 'Build backend applications and APIs.',
                    'topics' => ['PHP', 'Laravel', 'MVC', 'REST API'],
                    'step_order' => 3,
                    'duration' => '8 Weeks',
                ],
                [
                    'title' => 'Database & Integration',
                    'description' => 'Connect frontend, backend and database.',
                    'topics' => ['MySQL', 'CRUD', 'Authentication', 'API Integration'],
                    'step_order' => 4,
                    'duration' => '4 Weeks',
                ],
                [
                    'title' => 'Full Stack Project',
                    'description' => 'Develop and deploy a complete application.',
                    'topics' => ['Git', 'Testing', 'Deployment', 'Final Project'],
                    'step_order' => 5,
                    'duration' => '6 Weeks',
                ],
            ],
        ];

        foreach ($roadmapSteps as $slug => $steps) {
            $roadmap = Roadmap::where('slug', $slug)->first();

            if (!$roadmap) {
                continue;
            }

            foreach ($steps as $step) {
                RoadmapStep::updateOrCreate(
                    [
                        'roadmap_id' => $roadmap->id,
                        'step_order' => $step['step_order'],
                    ],
                    $step
                );
            }
        }
    }
}
