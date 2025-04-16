<?php

namespace App\Http\Controllers;

use App\Models\Summary;
use Illuminate\Http\Request;

class SummaryController extends Controller
{
    // Get all summaries of the authenticated user
    public function index(Request $request)
    {
        $summaries = $request->user()->summaries;

        if ($summaries->isEmpty()) {
            return response()->json([
                'message' => 'No summaries found.'
            ], 404);
        }

        return response()->json($summaries, 200);
    }

    public function allSummaries(Request $request)
    {
        // Only allow if the user is admin
        if (!$request->user()->is_admin) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        // Return all summaries (you could also include user info if needed)
        $summaries = Summary::with('user')->latest()->get();

        return response()->json($summaries);
    }

    // Get a specific summary by its ID
    public function show(Request $request, $id)
    {
        $summary = $request->user()->summaries()->find($id);

        if (!$summary) {
            return response()->json([
                'message' => 'Summary not found.'
            ], 404);
        }

        return response()->json($summary, 200);
    }

    // Create a new summary for the authenticated user
    public function store(Request $request)
    {
        $data = $request->validate([
            'original_text' => 'required',
            'summary_text' => 'required',
        ]);

        $summary = $request->user()->summaries()->create($data);

        return response()->json([
            'message' => 'Summary created successfully',
            'summary' => $summary
        ], 201);
    }

    // Update an existing summary
    public function update(Request $request, $id)
    {
        $summary = $request->user()->summaries()->find($id);

        if (!$summary) {
            return response()->json([
                'message' => 'Summary not found.'
            ], 404);
        }

        $summary->update($request->only('original_text', 'summary_text'));

        return response()->json([
            'message' => 'Summary updated successfully',
            'summary' => $summary
        ], 200);
    }

    // Delete a summary
    public function destroy(Request $request, $id)
    {
        $summary = $request->user()->summaries()->find($id);

        if (!$summary) {
            return response()->json([
                'message' => 'Summary not found.'
            ], 404);
        }

        $summary->delete();

        return response()->json([
            'message' => 'Summary deleted successfully',
            'summary' => $summary
        ], 200);
    }

    public function adminUpdate(Request $request, $id)
    {
        if (!$request->user()->is_admin) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $summary = Summary::find($id);
        if (!$summary) {
            return response()->json(['message' => 'Summary not found'], 404);
        }

        $summary->update($request->only('original_text', 'summary_text'));

        return response()->json([
            'message' => 'Summary updated successfully',
            'summary' => $summary
        ]);
    }

    public function adminDestroy(Request $request, $id)
    {
        if (!$request->user()->is_admin) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $summary = Summary::find($id);
        if (!$summary) {
            return response()->json(['message' => 'Summary not found'], 404);
        }

        $summary->delete();

        return response()->json(['message' => 'Summary deleted successfully']);
    }
}
