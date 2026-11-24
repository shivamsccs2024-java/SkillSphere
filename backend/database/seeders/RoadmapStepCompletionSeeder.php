<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\RoadmapStep;
use App\Models\RoadmapStepCompletion;
use Illuminate\Database\Seeder;

class RoadmapStepCompletionSeeder extends Seeder
{
    public function run(): void
    {
        $students = User::where('role', 'user')->get();

        $steps = RoadmapStep::orderBy('roadmap_id')
            ->orderBy('step_order')
            ->get();

        foreach ($students as $index => $student) {

            // Each student completes 2 steps in a roadmap
            $roadmapSteps = $steps
                ->where('roadmap_id', $steps[($index % 3) * 5]->roadmap_id)
                ->take(2);

            foreach ($roadmapSteps as $step) {
                RoadmapStepCompletion::firstOrCreate(
                    [
                        'user_id' => $student->id,
                        'roadmap_step_id' => $step->id,
                    ],
                    [
                        'completed_at' => now()->subDays($index + 1),
                    ]
                );
            }
        }
    }
}
