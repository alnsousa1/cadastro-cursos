<?php

use App\Http\Controllers\Api\V1\AulasController;
use App\Http\Controllers\Api\V1\CursosController;
use App\Http\Controllers\Api\V1\ModulosController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::prefix('v1')->group(function () {
    // Aulas
    Route::apiResource('aulas', AulasController::class)->except(['index', 'store']);
    Route::get('/modulos/{moduloId}/aulas', [AulasController::class, 'index']);
    Route::post('/modulos/{moduloId}/aulas', [AulasController::class, 'store']);
    
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

