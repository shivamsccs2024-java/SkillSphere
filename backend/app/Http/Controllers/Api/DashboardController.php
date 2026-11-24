<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Enrollment;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function stats(Request $request)
    {
        $userId = $request->user()->id;

        // Get user's enrollments
        $enrollments = Enrollment::with('progress')
            ->where('user_id', $userId)
            ->get();

        // Total enrolled courses
        $totalEnrolled = $enrollments->count();

        // Completed courses
        $completedCourses = $enrollments->filter(function ($enrollment) {
            return $enrollment->progress &&
                $enrollment->progress->progress_percentage == 100;
        })->count();

        // In progress courses
        $inProgressCourses = $enrollments->filter(function ($enrollment) {
            return $enrollment->progress &&
                $enrollment->progress->progress_percentage > 0 &&
                $enrollment->progress->progress_percentage < 100;
        })->count();

        // Average progress
        $averageProgress = $enrollments->avg(function ($enrollment) {
            return $enrollment->progress
                ? $enrollment->progress->progress_percentage
                : 0;
        });

        return response()->json([
            'status' => true,
            'message' => 'Dashboard statistics retrieved successfully',
            'data' => [
                'total_enrolled' => $totalEnrolled,
                'completed_courses' => $completedCourses,
                'in_progress_courses' => $inProgressCourses,
                'average_progress' => round($averageProgress, 2),
            ],
        ], 200);
    }
}