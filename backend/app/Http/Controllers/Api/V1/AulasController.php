<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\V1\AulasCollection;
use App\Http\Resources\V1\AulasResource;
use App\Models\Aulas;
use Illuminate\Http\Request;

class AulasController extends Controller
{
    public function index()
    {
        return new AulasCollection(Aulas::all());
    }

    public function show(Aulas $aula)
    {
        return new AulasResource($aula);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'nome' => 'required|string|max:255',
            'descricao' => 'required|string|max:255',
            'link_aula' => 'required|string|max:255',
        ]);
    

        Aulas::create($validatedData);
        return response()->json(['message' => 'Aula Created']);
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
