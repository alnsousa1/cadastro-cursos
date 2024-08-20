<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\V1\AulasResource;
use App\Models\Aulas;
use App\Models\Cursos;
use App\Models\Modulos;
use Illuminate\Http\Request;

class AulasController extends Controller
{
    public function index(Cursos $curso, $moduloId)
    {
        $modulo = $curso->modulos->where('id', $moduloId)->first();

        return AulasResource::collection($modulo->aulas);
    }

    public function show(Aulas $aula)
    {
        return new AulasResource($aula);
    }

    public function store(Request $request, $moduloId)
    {
        $request->validate([
            'nome' => 'required|string|max:255',
            'descricao' => 'required|string',
            'link_aula' => 'required|url',
        ]);

        $aula = Aulas::create([
            'nome' => $request->nome,
            'descricao' => $request->descricao,
            'link_aula' => $request->link_aula,
            'modulo_id' => $moduloId,
            'curso_id' => $request->curso_id // Certifique-se de enviar o curso_id no request
        ]);

        return response()->json($aula, 201);
    }

    public function update(Request $request, $id)
    {
        $aula = Aulas::findOrFail($id);
        $aula->update($request->all());

        return $aula;
    }

    public function destroy(Aulas $aula)
    {
        $aula->delete();
        return response()->json(['message' => 'Aula Deleted']);
    }
}
