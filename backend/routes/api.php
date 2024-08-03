<?php

use App\Http\Controllers\Api\V1\CursosController;
use Illuminate\Support\Facades\Route;

Route::group(['prefix' => 'v1'], function(){
    Route::apiResource('cursos', CursosController::class);
});