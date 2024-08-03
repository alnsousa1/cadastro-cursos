<?php

namespace App\Http\Controllers;

use App\Http\Resources\V1\ModulosCollection;
use App\Http\Resources\V1\ModulosResource;
use App\Models\Modulos;
use Illuminate\Http\Request;

class ModulosController extends Controller
{
    public function index()
    {
        return new ModulosCollection(Modulos::all());
    }

    public function show(Modulos $modulo)
    {
        return new ModulosResource($modulo);
    }
   
    public function store(Request $request)
    {
        Modulos::create($request->all());
        return response()->json(['message' => 'Modulo Created']);
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
