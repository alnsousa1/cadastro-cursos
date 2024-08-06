<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\V1\CursosCollection;
use App\Http\Resources\V1\CursosResource;
use Illuminate\Http\Request;
use App\Models\Cursos;
use Illuminate\Support\Facades\Storage;

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
        $validatedData = $request->validate([
            'titulo' => 'required|string|max:255',
            'descricao' => 'required|string|max:255',
            'imagem' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);
    
        // Salva a imagem
        if ($request->hasFile('imagem')) {
            $path = $request->file('imagem')->store('images/cursos', 'public');
            $validatedData['imagem'] = $path;
        }
    
        Cursos::create($validatedData);
        return response()->json(['message' => 'Curso Created']);
    }
    

    public function update(Request $request, $id)
    {
        $curso = Cursos::findOrFail($id);

        $validatedData = $request->validate([
            'titulo' => 'required|string|max:255',
            'descricao' => 'required|string|max:255',
            'imagem' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // Validação da imagem opcional
        ]);

        // Se houver uma nova imagem, salvar e atualizar o caminho
        if ($request->hasFile('imagem')) {
            // Deletar a imagem antiga se necessário
            if ($curso->imagem) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $curso->imagem));
            }

            $imagePath = $request->file('imagem')->store('cursos', 'public');
            $curso->imagem = '/storage/' . $imagePath;
        }

        $curso->titulo = $validatedData['titulo'];
        $curso->descricao = $validatedData['descricao'];
        $curso->save();

        return response()->json(['message' => 'Curso Updated', 'data' => new CursosResource($curso)]);
    }

    public function destroy(Cursos $curso)
    {
        // Deletar a imagem associada
        if ($curso->imagem) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $curso->imagem));
        }

        $curso->delete();
        return response()->json(['message' => 'Curso Deleted']);
    }
}
