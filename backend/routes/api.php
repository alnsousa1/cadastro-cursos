<?php

use App\Http\Controllers\Api\V1\AulasController;
use App\Http\Controllers\Api\V1\CursosController;
use App\Http\Controllers\Api\V1\ModulosController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});


Route::prefix('v1')->group(function () {
    //Login/Register/Logout
    Route::post('/register', [RegisteredUserController::class, 'store']);
    Route::post('/login', [AuthenticatedSessionController::class, 'store']);
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->middleware('auth:sanctum');
    // Aulas
    Route::apiResource('aulas', AulasController::class)->except(['index', 'store']);
    Route::get('/cursos/{curso}/modulos/{moduloId}/aulas', [AulasController::class, 'index']);
    Route::post('/modulos/{modulos}/aulas', [AulasController::class, 'store']);
    
    // Módulos
    Route::apiResource('modulos', ModulosController::class)->except(['index', 'store']);
    Route::get('/modulos', [ModulosController::class, 'index']);
    Route::post('/cursos/{curso}/modulos', [ModulosController::class, 'store']);
    Route::get('/cursos/{curso}/modulos', [ModulosController::class, 'index']);
    
    // Cursos
    Route::apiResource('cursos', CursosController::class)->except(['index', 'store']);
    Route::get('/cursos', [CursosController::class, 'index']);
    Route::post('/cursos', [CursosController::class, 'store']);
});