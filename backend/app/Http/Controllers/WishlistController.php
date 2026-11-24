<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Wishlist;
use Illuminate\Http\Request;

class WishlistController extends Controller
{
    // Add course to wishlist
    public function store(Request $request, $courseId)
    {
        $course = Course::where('is_active', true)->find($courseId);

        if (!$course) {
            return response()->json([
                'status' => false,
                'message' => 'Course not found',
            ], 404);
        }

        $wishlist = Wishlist::firstOrCreate([
            'user_id' => $request->user()->id,
            'course_id' => $course->id,
        ]);

        return response()->json([
            'status' => true,
            'message' => $wishlist->wasRecentlyCreated
                ? 'Course added to wishlist'
                : 'Course already in wishlist',
            'data' => $wishlist,
        ], $wishlist->wasRecentlyCreated ? 201 : 200);
    }

    // Get logged-in user's wishlist
    public function index(Request $request)
    {
        $wishlists = Wishlist::with('course')
            ->where('user_id', $request->user()->id)
            ->latest()
            ->get();

        return response()->json([
            'status' => true,
            'data' => $wishlists,
        ], 200);
    }

    // Remove course from wishlist
    public function destroy(Request $request, $courseId)
    {
        $wishlist = Wishlist::where('user_id', $request->user()->id)
            ->where('course_id', $courseId)
            ->first();

        if (!$wishlist) {
            return response()->json([
                'status' => false,
                'message' => 'Course not found in wishlist',
            ], 404);
        }

        $wishlist->delete();

        return response()->json([
            'status' => true,
            'message' => 'Course removed from wishlist',
        ], 200);
    }
}