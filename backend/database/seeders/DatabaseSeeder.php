<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            CourseSeeder::class,
            RoadmapSeeder::class,
            RoadmapStepSeeder::class,
            EnrollmentSeeder::class,
            RoadmapStepCompletionSeeder::class,
            ReviewSeeder::class,
            WishlistSeeder::class,
            ContactMessageSeeder::class,
        ]);
    }
}
