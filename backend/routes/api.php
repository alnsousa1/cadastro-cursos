<?php

use App\Http\Controllers\Api\V1\AulasController;
use App\Http\Controllers\Api\V1\CursosController;
use App\Http\Controllers\Api\V1\ModulosController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::group(['prefix' => 'v1'], function(){
    Route::apiResource('aulas', AulasController::class);
    Route::apiResource('cursos', CursosController::class);
    Route::apiResource('modulos', ModulosController::class);
});
