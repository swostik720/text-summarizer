<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\SummaryController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Log;
use Smalot\PdfParser\Parser;
use thiagoalessio\TesseractOCR\TesseractOCR;

// Get authenticated user
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Public Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/password/email', [AuthController::class, 'sendPasswordResetLink']);
Route::post('/password/reset', [AuthController::class, 'resetPassword']);

// Protected Routes
Route::middleware('auth:sanctum')->group(function () {
    // Authenticated user actions
    Route::post('/logout', [AuthController::class, 'logout']);

    // Summarize text via Hugging Face API
    Route::post('/summarize', function (Request $request) {
        $text = $request->input('text');
        $apiKey = env('HUGGINGFACE_API_KEY');

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $apiKey,
        ])->post('https://api-inference.huggingface.co/models/facebook/bart-large-cnn', [
            'inputs' => $text,
        ]);

        return response()->json($response->json());
    });

    // Extract text from PDF or Image
    Route::post('/upload', function (Request $request) {
        try {
            Log::info('Upload request received.');
            $request->validate(['file' => 'required|file|mimes:pdf,jpg,jpeg,png']);

            $file = $request->file('file');
            Log::info('Uploaded file path: ' . $file->getPathname());

            if ($file->getClientOriginalExtension() === 'pdf') {
                Log::info('Parsing PDF...');
                $parser = new Parser();
                $pdf = $parser->parseFile($file->getPathname());
                $text = $pdf->getText();
            } else {
                Log::info('Running Tesseract OCR...');
                $text = (new TesseractOCR($file->getPathname()))
                    ->executable('C:\Program Files (x86)\Tesseract-OCR\tesseract.exe')
                    ->run();
            }

            Log::info('Extracted text length: ' . strlen($text));
            return response()->json(['text' => $text]);
        } catch (\Exception $e) {
            Log::error('Upload failed: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    });

    // Summary CRUD routes
    Route::get('/summaries', [SummaryController::class, 'index']);
    Route::get('/summaries/{id}', [SummaryController::class, 'show']);
    Route::post('/summaries', [SummaryController::class, 'store']);
    Route::put('/summaries/{id}', [SummaryController::class, 'update']);
    Route::delete('/summaries/{id}', [SummaryController::class, 'destroy']);

    // Admin route to see, edit and delete summaries
    Route::get('/admin/summaries', [SummaryController::class, 'allSummaries']);
    Route::put('/admin/summaries/{id}', [SummaryController::class, 'adminUpdate']);
    Route::delete('/admin/summaries/{id}', [SummaryController::class, 'adminDestroy']);
});
