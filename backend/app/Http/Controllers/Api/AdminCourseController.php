<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AdminCourseController extends Controller
{
    // Display all courses
    public function index(Request $request)
    {
        $courses = Course::query()
            ->when($request->search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                      ->orWhere('instructor', 'like', "%{$search}%")
                      ->orWhere('category', 'like', "%{$search}%");
                });
            })
            ->when($request->category, function ($query, $category) {
                $query->where('category', $category);
            })
            ->when($request->level, function ($query, $level) {
                $query->where('level', $level);
            })
            ->latest()
            ->paginate(10);

        return response()->json([
            'success' => true,
            'message' => 'Courses retrieved successfully',
            'data' => $courses
        ]);
    }

    public function store(Request $request)
    {
    $validated = $request->validate([
        'title' => 'required|string|max:255',
        'description' => 'nullable|string',
        'category' => 'required|string|max:255',
        'level' => 'required|string|max:255',
        'price' => 'required|numeric|min:0',
        'duration' => 'nullable|string|max:255',
        'image' => 'nullable|string',
        'instructor' => 'nullable|string|max:255',
        'what_you_learn' => 'nullable|array',
        'what_you_learn.*' => 'string',
        'curriculum' => 'nullable|array',
        'is_active' => 'sometimes|boolean',
    ]);

    // Generate unique slug from course title
    $baseSlug = Str::slug($validated['title']);
    $slug = $baseSlug;
    $counter = 1;

    while (Course::where('slug', $slug)->exists()) {
        $slug = $baseSlug . '-' . $counter;
        $counter++;
    }

    $course = Course::create([
        ...$validated,
        'slug' => $slug,
        'is_active' => $validated['is_active'] ?? true,
    ]);

    return response()->json([
        'success' => true,
        'message' => 'Course created successfully',
        'data' => $course,
    ], 201);
    }

    public function update(Request $request, $id)
    {
    $course = Course::findOrFail($id);

    $validated = $request->validate([
        'title' => 'sometimes|required|string|max:255',
        'description' => 'nullable|string',
        'category' => 'sometimes|required|string|max:255',
        'level' => 'sometimes|required|string|max:255',
        'price' => 'sometimes|required|numeric|min:0',
        'duration' => 'nullable|string|max:255',
        'image' => 'nullable|string',
        'instructor' => 'nullable|string|max:255',
        'what_you_learn' => 'nullable|array',
        'what_you_learn.*' => 'string',
        'curriculum' => 'nullable|array',
        'is_active' => 'sometimes|boolean',
    ]);

    // Generate a new unique slug if title is updated
    if (isset($validated['title'])) {
        $baseSlug = Str::slug($validated['title']);
        $slug = $baseSlug;
        $counter = 1;

        while (
            Course::where('slug', $slug)
                ->where('id', '!=', $course->id)
                ->exists()
        ) {
            $slug = $baseSlug . '-' . $counter;
            $counter++;
        }

        $validated['slug'] = $slug;
    }

    $course->update($validated);

    return response()->json([
        'success' => true,
        'message' => 'Course updated successfully',
        'data' => $course->fresh(),
    ]);
    }

    public function destroy($id)
    {
    $course = Course::findOrFail($id);

    if (!$course->is_active) {
        return response()->json([
            'success' => false,
            'message' => 'Course is already inactive',
        ], 422);
    }

    $course->update([
        'is_active' => false,
    ]);

    return response()->json([
        'success' => true,
        'message' => 'Course deactivated successfully',
        'data' => $course->fresh(),
    ]);
    }
}
