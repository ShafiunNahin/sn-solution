<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\SystemSettingController;

Route::post('/login', [AuthController::class, 'login']);
Route::get('/settings/info', [SystemSettingController::class, 'getInfo']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/settings', [SystemSettingController::class, 'index']);
    Route::post('/settings', [SystemSettingController::class, 'store']);
    Route::put('/settings/{id}', [SystemSettingController::class, 'update']);
    Route::delete('/settings/{id}', [SystemSettingController::class, 'destroy']);
    Route::post('/upload', [SystemSettingController::class, 'uploadFile']);
});