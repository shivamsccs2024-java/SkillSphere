<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    public function show(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'status' => true,
            'message' => 'Profile retrieved successfully',
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'career_title' => $user->career_title,
                'bio' => $user->bio,
                'avatar' => $user->avatar,
            ],
        ], 200);
    }


    public function update(Request $request)
    {
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'phone' => 'nullable|string|max:20',
        'career_title' => 'nullable|string|max:255',
        'bio' => 'nullable|string|max:1000',
    ]);

    $user = $request->user();

    $user->update($validated);

    return response()->json([
        'status' => true,
        'message' => 'Profile updated successfully',
        'data' => [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone,
            'career_title' => $user->career_title,
            'bio' => $user->bio,
            'avatar' => $user->avatar,
        ],
    ], 200);
    }


    public function uploadAvatar(Request $request)
    {
    $validated = $request->validate([
        'avatar' => 'required|image|mimes:jpg,jpeg,png,webp|max:2048',
    ]);

    $user = $request->user();

    // Delete old avatar if exists
    if ($user->avatar) {
        Storage::disk('public')->delete($user->avatar);
    }

    // Store new avatar
    $path = $request->file('avatar')->store('avatars', 'public');

    $user->update([
        'avatar' => $path,
    ]);

    return response()->json([
        'status' => true,
        'message' => 'Profile avatar uploaded successfully',
        'data' => [
            'avatar' => asset('storage/' . $path),
        ],
    ], 200);
    }

    public function deleteAvatar(Request $request)
    {
    $user = $request->user();

    if (!$user->avatar) {
        return response()->json([
            'status' => false,
            'message' => 'No profile avatar found',
        ], 404);
    }

    Storage::disk('public')->delete($user->avatar);

    $user->update([
        'avatar' => null,
    ]);

    return response()->json([
        'status' => true,
        'message' => 'Profile avatar deleted successfully',
    ], 200);
    }
}