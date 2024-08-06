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
    Route::apiResource('aulas', AulasController::class);
    Route::apiResource('modulos', ModulosController::class);

    // Rotas explícitas para CursosController
    Route::get('/cursos', [CursosController::class, 'index']);
    Route::post('/cursos', [CursosController::class, 'store']);
    Route::get('/cursos/{curso}', [CursosController::class, 'show']);
    Route::put('/cursos/{curso}', [CursosController::class, 'update']);
    Route::delete('/cursos/{curso}', [CursosController::class, 'destroy']);
    
    Route::get('/modulos', [ModulosController::class, 'index']);
    Route::get('cursos/{curso}/modulos', [ModulosController::class, 'index']);
    Route::get('/modulos/{moduloId}/aulas', [AulasController::class, 'index']);
    Route::post('/modulos/{moduloId}/aulas', [AulasController::class, 'store']);
    Route::post('/cursos/{curso}/modulos', [ModulosController::class, 'store']);
    Route::get('/modulos/{modulo}', [ModulosController::class, 'show']);
    Route::put('/modulos/{modulo}', [ModulosController::class, 'update']);
    Route::delete('/modulos/{modulo}', [ModulosController::class, 'destroy']);
});
