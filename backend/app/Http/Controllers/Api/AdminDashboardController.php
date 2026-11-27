<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\ContactMessage;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class AdminDashboardController extends Controller
{
    public function index()
    {
        // Total Students
        $totalStudents = User::where('role', 'user')->count();

        // Total Courses
        $totalCourses = Course::count();

        // Total Student Enrollments (Exclude Admin)
        $totalEnrollments = Enrollment::whereHas('user', function ($query) {
            $query->where('role', 'user');
        })->count();

        // Total Contact Messages
        $totalContactMessages = ContactMessage::count();

        // Contact Message Statistics
        $pendingMessages = ContactMessage::where(
            'status',
            'pending'
        )->count();

        $inProgressMessages = ContactMessage::where(
            'status',
            'in_progress'
        )->count();

        $resolvedMessages = ContactMessage::where(
            'status',
            'resolved'
        )->count();

        // Latest 5 Students
        $recentStudents = User::where('role', 'user')
            ->latest()
            ->take(5)
            ->get([
                'id',
                'name',
                'email',
                'created_at'
            ]);

        // Latest 5 Student Enrollments (Exclude Admin)
        $recentEnrollments = Enrollment::with([
            'user:id,name,email',
            'course:id,title'
        ])
            ->whereHas('user', function ($query) {
                $query->where('role', 'user');
            })
            ->latest()
            ->take(5)
            ->get();


            // Monthly Enrollments - Last 6 Months

            $startDate = Carbon::now()
            ->subMonths(5)
            ->startOfMonth();

            $monthlyData = Enrollment::whereHas('user', function ($query) {
                $query->where('role', 'user');
            })
            ->where('created_at', '>=', $startDate)
            ->selectRaw('YEAR(created_at) as year, MONTH(created_at) as month, COUNT(*) as total')
            ->groupByRaw('YEAR(created_at), MONTH(created_at)')
            ->get()
            ->keyBy(function ($item) {
                return $item->year . '-' . $item->month;
            });

            // Include months with zero enrollments
            $monthlyEnrollments = collect();

            for ($i = 0; $i < 6; $i++) {
            $date = $startDate->copy()->addMonths($i);

            $key = $date->year . '-' . $date->month;

            $monthlyEnrollments->push([
                'month' => $date->format('M'),
                'year' => $date->year,
                'total' => optional($monthlyData->get($key))->total ?? 0,
            ]);
            }

        // API Response
        return response()->json([
            'status' => true,
            'message' => 'Admin dashboard data retrieved successfully',

            'data' => [
                'total_students' => $totalStudents,
                'total_courses' => $totalCourses,
                'total_enrollments' => $totalEnrollments,
                'total_contact_messages' => $totalContactMessages,

                'pending_messages' => $pendingMessages,
                'in_progress_messages' => $inProgressMessages,
                'resolved_messages' => $resolvedMessages,

                'recent_students' => $recentStudents,
                'recent_enrollments' => $recentEnrollments,
                'monthly_enrollments' => $monthlyEnrollments,
            ]
        ], 200);
    }
}
