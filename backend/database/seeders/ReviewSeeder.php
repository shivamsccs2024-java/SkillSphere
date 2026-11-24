<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Enrollment;
use App\Models\Review;
use Illuminate\Database\Seeder;

class ReviewSeeder extends Seeder
{
    public function run(): void
    {
        $students = User::where('role', 'user')->get();

        $feedbacks = [
            'Excellent course! The concepts are explained clearly.',
            'Very useful content with practical examples.',
            'Good learning experience. I improved my skills.',
            'The instructor explains everything in an easy way.',
            'Great course for beginners. Highly recommended.',
            'The practical lessons helped me understand the topics.',
        ];

        foreach ($students as $index => $student) {

            // Get student's enrolled courses
            $enrollments = Enrollment::where('user_id', $student->id)
                ->take(2)
                ->get();

            foreach ($enrollments as $courseIndex => $enrollment) {

                Review::firstOrCreate(
                    [
                        'user_id' => $student->id,
                        'course_id' => $enrollment->course_id,
                    ],
                    [
                        'rating' => 4 + (($index + $courseIndex) % 2),
                        'review' => $feedbacks[($index + $courseIndex) % count($feedbacks)],
                    ]
                );
            }
        }
    }
}
