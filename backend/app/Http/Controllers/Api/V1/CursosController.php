<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\V1\CursosCollection;
use App\Http\Resources\V1\CursosResource;
use Illuminate\Http\Request;
use App\Models\Cursos;

class CursosController extends Controller
{
    public function index()
    {
        return new CursosCollection(Cursos::all());
    }

    public function show(Cursos $curso)
    {
        return new CursosResource($curso);
    }

    public function store(Request $request)
    {
        Cursos::create($request->all());
        return response()->json(['message' => 'Curso Created']);
    }

    public function update(Request $request, $id)
    {
        $curso = Cursos::findOrFail($id);
        $curso->update($request->all());

        return $curso;
    }

    public function destroy(Cursos $curso)
    {
        $curso->delete();
        return response()->json(['message' => 'Curso Deleted']);
    }
}