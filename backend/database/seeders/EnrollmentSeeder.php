<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\CourseProgress;
use Illuminate\Database\Seeder;

class EnrollmentSeeder extends Seeder
{
    public function run(): void
    {
        $students = User::where('role', 'user')->get();
        $courses = Course::where('is_active', true)->get();

        foreach ($students as $index => $student) {

            // Each student enrolls in 3 courses
            for ($i = 0; $i < 3; $i++) {

                $course = $courses[($index + $i) % $courses->count()];

                $enrollment = Enrollment::firstOrCreate(
                    [
                        'user_id' => $student->id,
                        'course_id' => $course->id,
                    ],
                    [
                        'status' => 'active',
                        'enrolled_at' => now()->subDays(20 - ($index + $i)),
                    ]
                );

                // Sample course progress
                $progress = [25, 60, 100];

                $percentage = $progress[($index + $i) % 3];

                CourseProgress::updateOrCreate(
                    ['enrollment_id' => $enrollment->id],
                    [
                        'progress_percentage' => $percentage,
                        'started_at' => $enrollment->enrolled_at,
                        'completed_at' => $percentage === 100
                            ? now()->subDays(2)
                            : null,
                    ]
                );
            }
        }
    }
}
