<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Admin
        User::updateOrCreate(
            ['email' => 'shivamsccs2024@gmail.com'],
            [
                'name' => 'A.Sivakumar',
                'password' => Hash::make('Admin@123'),
                'phone' => '7558181337',
                'career_title' => 'Full Stack Developer',
                'bio' => 'SkillSphere platform administrator.',
                'role' => 'admin',
            ]
        );

        // 15 Students
        $students = [
            ['Arun Kumar', 'arun@gmail.com', '9876500001', 'Frontend Developer'],
            ['Priya Sharma', 'priya@gmail.com', '9876500002', 'UI/UX Designer'],
            ['Rahul Kumar', 'rahul@gmail.com', '9876500003', 'Backend Developer'],
            ['Divya Raj', 'divya@gmail.com', '9876500004', 'Java Developer'],
            ['Karthik M', 'karthik@gmail.com', '9876500005', 'React Developer'],
            ['Vijay Anand', 'vijay@gmail.com', '9876500006', 'Python Developer'],
            ['Sneha R', 'sneha@gmail.com', '9876500007', 'Web Designer'],
            ['Ajay Kumar', 'ajay@gmail.com', '9876500008', 'Full Stack Developer'],
            ['Meena Devi', 'meena@gmail.com', '9876500009', 'Data Analyst'],
            ['Sanjay Raj', 'sanjay@gmail.com', '9876500010', 'Java Developer'],
            ['Kavya S', 'kavya@gmail.com', '9876500011', 'UI/UX Designer'],
            ['Praveen Kumar', 'praveen@gmail.com', '9876500012', 'Laravel Developer'],
            ['Nithya M', 'nithya@gmail.com', '9876500013', 'Frontend Developer'],
            ['Gokul Raj', 'gokul@gmail.com', '9876500014', 'Python Developer'],
            ['Harini S', 'harini@gmail.com', '9876500015', 'Software Developer'],
        ];

        foreach ($students as $student) {
            User::updateOrCreate(
                ['email' => $student[1]],
                [
                    'name' => $student[0],
                    'password' => Hash::make('Student@123'),
                    'phone' => $student[2],
                    'career_title' => $student[3],
                    'bio' => 'Learning and developing professional skills through SkillSphere.',
                    'role' => 'user',
                ]
            );
        }
    }
}