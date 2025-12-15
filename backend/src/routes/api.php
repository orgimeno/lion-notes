<?php

use App\Http\Controllers\Api\HealthController;
use App\Http\Controllers\Api\NoteController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|  /api Prefijo
*/

Route::get('/health', HealthController::class);
Route::apiResource('notes', NoteController::class);
