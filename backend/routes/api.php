<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CourseController;
use App\Http\Controllers\Api\EnrollmentController;
use App\Http\Controllers\Api\CourseProgressController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\RoadmapController;
use App\Http\Controllers\RoadmapStepCompletionController;
use App\Http\Controllers\ContactMessageController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\WishlistController;



Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/courses', [CourseController::class, 'index']);
Route::get('/courses/search', [CourseController::class, 'search']);
Route::get('/courses/{id}', [CourseController::class, 'show']);
Route::get('/categories', [CourseController::class, 'categories']);
Route::get('/roadmaps', [RoadmapController::class, 'index']);
Route::get('/roadmaps/{id}', [RoadmapController::class, 'show']);
Route::get('/roadmaps/{id}/steps', [RoadmapController::class, 'steps']);
Route::post('/contact', [ContactMessageController::class, 'store']);
Route::get('/courses/{courseId}/reviews', [ReviewController::class, 'index']);
Route::get('/courses/{courseId}/rating-summary', [ReviewController::class, 'ratingSummary']);
Route::get('/courses/{courseId}/rating-distribution',[ReviewController::class, 'ratingDistribution']    );

Route::post('/courses/{courseId}/enroll', [EnrollmentController::class, 'store'])
    ->middleware('auth:sanctum');


Route::get('/my-courses', [EnrollmentController::class, 'myCourses'])
    ->middleware('auth:sanctum');


Route::get('/my-courses/{courseId}/progress', [CourseProgressController::class, 'show'])
    ->middleware('auth:sanctum');


Route::post('/logout', [AuthController::class, 'logout'])
    ->middleware('auth:sanctum');


    Route::put('/my-courses/{courseId}/progress', [CourseProgressController::class, 'update'])
    ->middleware('auth:sanctum');

    // Dashboard
    Route::get('/dashboard/stats', [DashboardController::class, 'stats'])
    ->middleware('auth:sanctum');

    Route::post('/roadmap-steps/{id}/complete', [RoadmapStepCompletionController::class, 'complete'])
    ->middleware('auth:sanctum');

    Route::delete('/roadmap-steps/{id}/complete', [RoadmapStepCompletionController::class, 'undo'])
    ->middleware('auth:sanctum');

    Route::get('/roadmaps/{roadmapId}/my-progress', [RoadmapStepCompletionController::class, 'myProgress'])
    ->middleware('auth:sanctum');

    Route::get('/my-contact-messages', [ContactMessageController::class, 'index'])
    ->middleware('auth:sanctum');


    // Admin Group route 
    Route::middleware(['auth:sanctum', 'admin'])->group(function () {
        Route::get('/admin/contact-messages', [ContactMessageController::class, 'adminIndex']);
        
        Route::put(
            '/admin/contact-messages/{id}/status', [ContactMessageController::class, 'updateStatus']
        );

        Route::delete('/admin/contact-messages/{id}',[ContactMessageController::class, 'destroy']
        );
    });


    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/profile', [ProfileController::class, 'show']);
        Route::put('/profile', [ProfileController::class, 'update']);
        Route::post('/profile/avatar', [ProfileController::class, 'uploadAvatar']);
        Route::delete('/profile/avatar', [ProfileController::class, 'deleteAvatar']);

        Route::post('/courses/{courseId}/reviews', [ReviewController::class, 'store']);
        Route::put('/reviews/{id}', [ReviewController::class, 'update']);
        Route::delete('/reviews/{id}', [ReviewController::class, 'destroy']);

        Route::get('/my-wishlist', [WishlistController::class, 'index']);
        Route::post('/courses/{courseId}/wishlist', [WishlistController::class, 'store']);
        Route::delete('/courses/{courseId}/wishlist', [WishlistController::class, 'destroy']);
    });

    


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
