<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    public function index()
    {
        $courses = Course::where('is_active', true)
    ->withAvg('reviews', 'rating')
    ->withCount('reviews')
    ->get();

        return response()->json([
            'status' => true,
            'message' => 'Courses retrieved successfully',
            'data' => $courses,
        ], 200);
    }

    public function show($id)
    {
        $course = Course::where('is_active', true)
        ->withAvg('reviews', 'rating')
        ->withCount('reviews')
        ->find($id);

    return response()->json([
        'status' => true,
        'message' => 'Course retrieved successfully',
        'data' => $course,
    ], 200);
    }


    public function search(Request $request)
    {
        $query = Course::where('is_active', true);
    
        // Search by title
        if ($request->filled('search')) {
            $query->where('title', 'LIKE', '%' . $request->search . '%');
        }
    
        // Filter by category
        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }
    
        // Filter by level
        if ($request->filled('level')) {
            $query->where('level', $request->level);
        }
    
        // Filter by minimum price
        if ($request->filled('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }
    
        // Filter by maximum price
        if ($request->filled('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }
    
        // Sorting
        if ($request->filled('sort')) {
            if ($request->sort === 'price_low') {
                $query->orderBy('price', 'asc');
            } elseif ($request->sort === 'price_high') {
                $query->orderBy('price', 'desc');
            } elseif ($request->sort === 'rating') {
                $query->orderBy('rating', 'desc');
            } else {
                $query->latest();
            }
        }
    
        $courses = $query
            ->withAvg('reviews', 'rating')
            ->withCount('reviews')
            ->paginate(6);
    
        return response()->json([
            'status' => true,
            'message' => 'Courses filtered successfully',
            'data' => $courses,
        ], 200);
    }

    public function categories()
    {
    $categories = Course::where('is_active', true)
        ->select('category')
        ->distinct()
        ->orderBy('category')
        ->pluck('category');

    return response()->json([
        'status' => true,
        'message' => 'Categories retrieved successfully',
        'data' => $categories,
    ], 200);
    }
}