<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ContactMessage;

class ContactMessageController extends Controller
{

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);
    
        // Get authenticated user through Sanctum
        $user = auth('sanctum')->user();
    
        $contactMessage = ContactMessage::create([
            'user_id' => $user ? $user->id : null,
            'name' => $validated['name'],
            'email' => $validated['email'],
            'subject' => $validated['subject'],
            'message' => $validated['message'],
            'status' => 'pending',
        ]);
    
        return response()->json([
            'status' => true,
            'message' => 'Contact message submitted successfully',
            'data' => $contactMessage,
        ], 201);
    }
    

    public function index(Request $request)
    {
    $messages = ContactMessage::where('user_id', $request->user()->id)
        ->latest()
        ->get();

    return response()->json([
        'status' => true,
        'message' => 'Contact messages retrieved successfully',
        'data' => $messages,
    ], 200);
    }

    public function adminIndex()
    {
    $messages = ContactMessage::latest()->get();

    return response()->json([
        'status' => true,
        'message' => 'All contact messages retrieved successfully',
        'data' => $messages,
    ], 200);
    }


    public function updateStatus(Request $request, $id)
    {
    $validated = $request->validate([
        'status' => 'required|in:pending,in_progress,resolved',
    ]);

    $contactMessage = ContactMessage::find($id);

    if (!$contactMessage) {
        return response()->json([
            'status' => false,
            'message' => 'Contact message not found',
        ], 404);
    }

    $contactMessage->update([
        'status' => $validated['status'],
    ]);

    return response()->json([
        'status' => true,
        'message' => 'Contact message status updated successfully',
        'data' => $contactMessage,
    ], 200);
    }


    public function destroy($id)
    {
    $contactMessage = ContactMessage::find($id);

    if (!$contactMessage) {
        return response()->json([
            'status' => false,
            'message' => 'Contact message not found',
        ], 404);
    }

    $contactMessage->delete();

    return response()->json([
        'status' => true,
        'message' => 'Contact message deleted successfully',
    ], 200);
    }
}