<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\V1\ModulosResource;
use App\Models\Modulos;
use Illuminate\Http\Request;

class ModulosController extends Controller
{
    public function index($cursoId)
    {
        $modulos = Modulos::where('curso_id', $cursoId)->get();
        return response()->json(['data' => $modulos]);
    }


    public function show(Modulos $modulo)
    {
        return new ModulosResource($modulo);
    }

    public function store(Request $request, $cursoId)
    {
        $request->validate([
            'titulo' => 'required|string|max:255',
        ]);

        if ($cursoId === 'undefined' || !is_numeric($cursoId)) {
            return response()->json(['error' => 'Curso ID inválido'], 400);
        }

        $modulo = new Modulos();
        $modulo->titulo = $request->input('titulo');
        $modulo->curso_id = (int) $cursoId;
        $modulo->save();

        return response()->json(['id' => $modulo->id, 'message' => 'Módulo Created'], 201);
    }




    public function update(Request $request, $id)
    {
        $modulo = Modulos::findOrFail($id);
        $modulo->update($request->all());

        return $modulo;
    }

    public function destroy(Modulos $modulo)
    {
        $modulo->delete();
        return response()->json(['message' => 'Metodo Deleted']);
    }
}
