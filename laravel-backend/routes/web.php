<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'ok' => true,
        'message' => 'Backend working'
    ]);
});

// Minimal named login route to satisfy redirects from auth middleware during local testing
Route::get('/login', function () {
    return response()->json(['message' => 'Login route (placeholder)']);
})->name('login');