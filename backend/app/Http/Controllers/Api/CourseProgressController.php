<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Enrollment;
use App\Models\CourseProgress;
use Illuminate\Http\Request;

class CourseProgressController extends Controller
{
    public function show(Request $request, $courseId)
    {
        // Find user's enrollment
        $enrollment = Enrollment::where('user_id', $request->user()->id)
            ->where('course_id', $courseId)
            ->first();

        if (!$enrollment) {
            return response()->json([
                'status' => false,
                'message' => 'You are not enrolled in this course',
            ], 403);
        }

        // Get course progress
        $progress = CourseProgress::where(
            'enrollment_id',
            $enrollment->id
        )->first();

        return response()->json([
            'status' => true,
            'message' => 'Course progress retrieved successfully',
            'data' => [
                'course_id' => $courseId,
                'progress' => $progress ? $progress->progress_percentage : 0,
                'started_at' => $progress ? $progress->started_at : null,
                'completed_at' => $progress ? $progress->completed_at : null
            ],
        ], 200);
    }

    public function update(Request $request, $courseId)
    {
    $request->validate([
        'progress_percentage' => 'required|integer|min:0|max:100',
    ]);

    $enrollment = Enrollment::where('user_id', $request->user()->id)
        ->where('course_id', $courseId)
        ->first();

    if (!$enrollment) {
        return response()->json([
            'status' => false,
            'message' => 'You are not enrolled in this course',
        ], 403);
    }

    $percentage = $request->progress_percentage;

    $progress = CourseProgress::updateOrCreate(
        ['enrollment_id' => $enrollment->id],
        [
            'progress_percentage' => $percentage,
            'started_at' => now(),
            'completed_at' => $percentage == 100 ? now() : null,
        ]
    );

    return response()->json([
        'status' => true,
        'message' => 'Course progress updated successfully',
        'data' => $progress,
    ], 200);
    }
}