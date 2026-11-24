<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Course;
use App\Models\Wishlist;
use Illuminate\Database\Seeder;

class WishlistSeeder extends Seeder
{
    public function run(): void
    {
        $students = User::where('role', 'user')->get();

        $courses = Course::where('is_active', true)
            ->orderBy('id')
            ->get();

        if ($courses->isEmpty()) {
            return;
        }

        foreach ($students as $index => $student) {

            // Each student saves 2 courses
            for ($i = 0; $i < 2; $i++) {

                $course = $courses[($index + $i + 3) % $courses->count()];

                Wishlist::firstOrCreate([
                    'user_id' => $student->id,
                    'course_id' => $course->id,
                ]);
            }
        }
    }
}
