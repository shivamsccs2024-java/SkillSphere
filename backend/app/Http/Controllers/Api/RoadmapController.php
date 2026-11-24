<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Roadmap;
use Illuminate\Http\Request;

class RoadmapController extends Controller
{
    public function index()
    {
        $roadmaps = Roadmap::where('is_active', true)->get();

        return response()->json([
            'status' => true,
            'message' => 'Roadmaps retrieved successfully',
            'data' => $roadmaps,
        ], 200);
    }


    public function show($id)
    {
    $roadmap = Roadmap::with('steps')
        ->where('is_active', true)
        ->find($id);

    if (!$roadmap) {
        return response()->json([
            'status' => false,
            'message' => 'Roadmap not found',
        ], 404);
    }

    return response()->json([
        'status' => true,
        'message' => 'Roadmap details retrieved successfully',
        'data' => $roadmap,
    ], 200);
    }

    
    public function steps($id)
    {
    $roadmap = Roadmap::where('is_active', true)->find($id);

    if (!$roadmap) {
        return response()->json([
            'status' => false,
            'message' => 'Roadmap not found',
        ], 404);
    }

    $steps = $roadmap->steps()
        ->orderBy('step_order')
        ->get();

    return response()->json([
        'status' => true,
        'message' => 'Roadmap steps retrieved successfully',
        'data' => $steps,
    ], 200);
    }
}