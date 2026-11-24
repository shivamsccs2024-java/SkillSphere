<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\ContactMessage;
use Illuminate\Database\Seeder;

class ContactMessageSeeder extends Seeder
{
    public function run(): void
    {
        $students = User::where('role', 'user')->get();

        $messages = [
            [
                'subject' => 'Course Enrollment Help',
                'message' => 'I need help understanding the course enrollment process.',
                'status' => 'pending',
            ],
            [
                'subject' => 'Payment Support',
                'message' => 'I would like to know more about the payment process.',
                'status' => 'in_progress',
            ],
            [
                'subject' => 'Course Content',
                'message' => 'Can you provide additional learning materials for this course?',
                'status' => 'resolved',
            ],
            [
                'subject' => 'Account Assistance',
                'message' => 'I need assistance updating my profile information.',
                'status' => 'pending',
            ],
            [
                'subject' => 'Technical Support',
                'message' => 'I am experiencing an issue accessing my dashboard.',
                'status' => 'resolved',
            ],
        ];

        foreach ($students as $index => $student) {
            $message = $messages[$index % count($messages)];

            ContactMessage::firstOrCreate(
                [
                    'user_id' => $student->id,
                    'subject' => $message['subject'],
                ],
                [
                    'name' => $student->name,
                    'email' => $student->email,
                    'message' => $message['message'],
                    'status' => $message['status'],
                ]
            );
        }
    }
}
