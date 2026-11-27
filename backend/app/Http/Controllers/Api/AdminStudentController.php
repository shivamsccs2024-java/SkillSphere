<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class AdminStudentController extends Controller
{
    public function index(Request $request)
    {
        $students = User::select(
            'id',
            'name',
            'email',
            'role',
            'is_active',
            'created_at'
        )
        ->where('role', 'user')
        ->when($request->search, function ($query, $search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        })
        ->latest()
        ->paginate(10);

        return response()->json([
            'success' => true,
            'message' => 'Students retrieved successfully',
            'data' => $students
        ]);
    }


    public function show($id)
    {
        $student = User::where('role', 'user')
            ->with([
                'enrollments.course:id,title,category,level'
            ])
            ->withCount('enrollments')
            ->findOrFail($id);
    
        return response()->json([
            'success' => true,
            'message' => 'Student details retrieved successfully',
            'data' => $student
        ]);
    }


    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'is_active' => 'required|boolean'
        ]);

        $student = User::where('role', 'user')->findOrFail($id);

        $student->is_active = $request->is_active;
        $student->save();

        // Revoke existing tokens when account is deactivated
        if (!$student->is_active) {
            $student->tokens()->delete();
        }

        return response()->json([
            'success' => true,
            'message' => $student->is_active
                ? 'Student account activated successfully'
                : 'Student account deactivated successfully',
            'data' => [
                'id' => $student->id,
                'name' => $student->name,
                'is_active' => $student->is_active
            ]
        ]);
    }


    public function learningProgress($id)
    {
        $student = User::where('role', 'user')
            ->with([
                'enrollments.course:id,title,category,level',
                'enrollments.progress:id,enrollment_id,progress_percentage,started_at,completed_at'
            ])
            ->findOrFail($id);

        $courses = $student->enrollments->map(function ($enrollment) {

            $progress = $enrollment->progress;

            $percentage = $progress
                ? (float) $progress->progress_percentage
                : 0;

            $isCompleted = $progress &&
                ($percentage >= 100 || $progress->completed_at !== null);

            if ($isCompleted) {
                $status = 'completed';
            } elseif ($percentage > 0) {
                $status = 'in_progress';
            } else {
                $status = 'not_started';
            }

            return [
                'enrollment_id' => $enrollment->id,
                'course' => $enrollment->course,
                'progress_percentage' => $percentage,
                'status' => $status,
                'started_at' => $progress ? $progress->started_at : null,
                'completed_at' => $progress ? $progress->completed_at : null,
            ];
        });

        $totalCourses = $courses->count();

        $completedCourses = $courses->where('status', 'completed')->count();

        $inProgressCourses = $courses->where('status', 'in_progress')->count();

        $notStartedCourses = $courses->where('status', 'not_started')->count();

        $overallProgress = $totalCourses > 0
            ? round($courses->avg('progress_percentage'), 2)
            : 0;

        return response()->json([
            'success' => true,
            'message' => 'Student learning progress retrieved successfully',
            'data' => [
                'student' => [
                    'id' => $student->id,
                    'name' => $student->name,
                    'email' => $student->email,
                ],
                'summary' => [
                    'total_courses' => $totalCourses,
                    'completed_courses' => $completedCourses,
                    'in_progress_courses' => $inProgressCourses,
                    'not_started_courses' => $notStartedCourses,
                    'overall_progress' => $overallProgress,
                ],
                'courses' => $courses,
            ]
        ]);
    } 

}
