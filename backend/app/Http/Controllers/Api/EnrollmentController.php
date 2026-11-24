<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Enrollment;
use Illuminate\Http\Request;

class EnrollmentController extends Controller
{
    public function store(Request $request, $courseId)
    {
        $course = Course::where('is_active', true)
            ->find($courseId);

        if (!$course) {
            return response()->json([
                'status' => false,
                'message' => 'Course not found',
            ], 404);
        }

        $user = $request->user();

        $existingEnrollment = Enrollment::where('user_id', $user->id)
            ->where('course_id', $course->id)
            ->first();

        if ($existingEnrollment) {
            return response()->json([
                'status' => false,
                'message' => 'You are already enrolled in this course',
            ], 409);
        }

        $enrollment = Enrollment::create([
            'user_id' => $user->id,
            'course_id' => $course->id,
            'status' => 'active',
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Course enrolled successfully',
            'data' => $enrollment,
        ], 201);
    }


    public function myCourses(Request $request)
    {
    $enrollments = Enrollment::with('course')
        ->where('user_id', $request->user()->id)
        ->latest()
        ->get();

    return response()->json([
        'status' => true,
        'message' => 'Enrolled courses retrieved successfully',
        'data' => $enrollments,
    ], 200);
    }
}