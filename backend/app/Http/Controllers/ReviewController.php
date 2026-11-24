<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Course;
use App\Models\Review;
use App\Models\Enrollment;

class ReviewController extends Controller
{
    public function store(Request $request, $courseId)
    {
        $validated = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'review' => 'nullable|string|max:2000',
        ]);

        $user = $request->user();

        // Check whether course exists
        $course = Course::find($courseId);

        if (!$course) {
            return response()->json([
                'status' => false,
                'message' => 'Course not found',
            ], 404);
        }

        // Check whether user enrolled in this course
        $enrollment = Enrollment::where('user_id', $user->id)
            ->where('course_id', $courseId)
            ->first();

        if (!$enrollment) {
            return response()->json([
                'status' => false,
                'message' => 'You must enroll in this course before reviewing',
            ], 403);
        }

        // Prevent duplicate review
        $existingReview = Review::where('user_id', $user->id)
            ->where('course_id', $courseId)
            ->first();

        if ($existingReview) {
            return response()->json([
                'status' => false,
                'message' => 'You have already reviewed this course',
            ], 409);
        }

        $review = Review::create([
            'user_id' => $user->id,
            'course_id' => $courseId,
            'rating' => $validated['rating'],
            'review' => $validated['review'] ?? null,
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Course review submitted successfully',
            'data' => $review,
        ], 201);
    }


    public function index($courseId)
    {
    $course = Course::find($courseId);

    if (!$course) {
        return response()->json([
            'status' => false,
            'message' => 'Course not found',
        ], 404);
    }

    $reviews = Review::with('user:id,name')
        ->where('course_id', $courseId)
        ->latest()
        ->get();

    return response()->json([
        'status' => true,
        'message' => 'Course reviews retrieved successfully',
        'data' => $reviews,
    ], 200);
    }


    public function update(Request $request, $id)
    {
    $validated = $request->validate([
        'rating' => 'required|integer|min:1|max:5',
        'review' => 'nullable|string|max:2000',
    ]);

    $user = $request->user();

    $review = Review::where('id', $id)
        ->where('user_id', $user->id)
        ->first();

    if (!$review) {
        return response()->json([
            'status' => false,
            'message' => 'Review not found',
        ], 404);
    }

    $review->update([
        'rating' => $validated['rating'],
        'review' => $validated['review'] ?? null,
    ]);

    return response()->json([
        'status' => true,
        'message' => 'Review updated successfully',
        'data' => $review,
    ], 200);
    }


    public function destroy(Request $request, $id)
    {
    $user = $request->user();

    $review = Review::where('id', $id)
        ->where('user_id', $user->id)
        ->first();

    if (!$review) {
        return response()->json([
            'status' => false,
            'message' => 'Review not found',
        ], 404);
    }

    $review->delete();

    return response()->json([
        'status' => true,
        'message' => 'Review deleted successfully',
    ], 200);
    }


    public function ratingSummary($courseId)
    {
    $course = Course::find($courseId);

    if (!$course) {
        return response()->json([
            'status' => false,
            'message' => 'Course not found',
        ], 404);
    }

    $reviews = Review::where('course_id', $courseId);

    $totalReviews = $reviews->count();

    $averageRating = $reviews->avg('rating');

    return response()->json([
        'status' => true,
        'message' => 'Course rating summary retrieved successfully',
        'data' => [
            'course_id' => $course->id,
            'course_title' => $course->title,
            'total_reviews' => $totalReviews,
            'average_rating' => round($averageRating ?? 0, 1),
        ],
    ], 200);
    }


    public function ratingDistribution($courseId)
    {
    $course = Course::find($courseId);

    if (!$course) {
        return response()->json([
            'status' => false,
            'message' => 'Course not found',
        ], 404);
    }

    $distribution = Review::where('course_id', $courseId)
        ->selectRaw('rating, COUNT(*) as total')
        ->groupBy('rating')
        ->pluck('total', 'rating');

    $ratings = [];

    for ($i = 5; $i >= 1; $i--) {
        $ratings[] = [
            'rating' => $i,
            'count' => $distribution[$i] ?? 0,
        ];
    }

    return response()->json([
        'status' => true,
        'message' => 'Course rating distribution retrieved successfully',
        'data' => [
            'course_id' => $course->id,
            'course_title' => $course->title,
            'ratings' => $ratings,
        ],
    ], 200);
    }
}