<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Roadmap;
use App\Models\RoadmapStep;
use App\Models\RoadmapStepCompletion;

class RoadmapStepCompletionController extends Controller
{
    public function complete(Request $request, $id)
    {
        $step = RoadmapStep::find($id);

        if (!$step) {
            return response()->json([
                'status' => false,
                'message' => 'Roadmap step not found',
            ], 404);
        }

        $completion = RoadmapStepCompletion::firstOrCreate(
            [
                'user_id' => $request->user()->id,
                'roadmap_step_id' => $step->id,
            ],
            [
                'completed_at' => now(),
            ]
        );

        return response()->json([
            'status' => true,
            'message' => 'Roadmap step completed successfully',
            'data' => $completion,
        ], 200);
    }

    public function undo(Request $request, $id)
    {
    $step = RoadmapStep::find($id);

    if (!$step) {
        return response()->json([
            'status' => false,
            'message' => 'Roadmap step not found',
        ], 404);
    }

    $completion = RoadmapStepCompletion::where('user_id', $request->user()->id)
        ->where('roadmap_step_id', $step->id)
        ->first();

    if (!$completion) {
        return response()->json([
            'status' => false,
            'message' => 'Step is not completed yet',
        ], 404);
    }

    $completion->delete();

    return response()->json([
        'status' => true,
        'message' => 'Roadmap step marked as incomplete successfully',
    ], 200);
    }


    public function myProgress(Request $request, $roadmapId)
    {
    $roadmap = Roadmap::where('is_active', true)
        ->find($roadmapId);

    if (!$roadmap) {
        return response()->json([
            'status' => false,
            'message' => 'Roadmap not found',
        ], 404);
    }

    $steps = $roadmap->steps()
        ->with(['completions' => function ($query) use ($request) {
            $query->where('user_id', $request->user()->id);
        }])
        ->orderBy('step_order')
        ->get();

    $totalSteps = $steps->count();

    $completedSteps = $steps->filter(function ($step) {
        return $step->completions->isNotEmpty();
    })->count();

    $progress = $totalSteps > 0
        ? round(($completedSteps / $totalSteps) * 100, 2)
        : 0;

    $stepDetails = $steps->map(function ($step) {
        $completion = $step->completions->first();

        return [
            'id' => $step->id,
            'title' => $step->title,
            'step_order' => $step->step_order,
            'is_completed' => $completion ? true : false,
            'completed_at' => $completion ? $completion->completed_at : null,
        ];
    });

    return response()->json([
        'status' => true,
        'message' => 'Roadmap progress retrieved successfully',
        'data' => [
            'roadmap' => $roadmap->title,
            'total_steps' => $totalSteps,
            'completed_steps' => $completedSteps,
            'pending_steps' => $totalSteps - $completedSteps,
            'progress_percentage' => $progress,
            'steps' => $stepDetails,
        ],
    ], 200);
    }
}