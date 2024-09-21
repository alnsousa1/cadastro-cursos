<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Resources\Json\ResourceCollection;

class CursosCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return $this->collection->map(function($curso) {
            return [
                'id' => $curso->id,
                'titulo' => $curso->titulo,
                'descricao' => $curso->descricao,
                'imagem' => $curso->imagem,
                'modulos_count' => $curso->modulos()->count(),
                'aulas_count' => $curso->modulos()->withCount('aulas')->get()->sum('aulas_count'),
            ];
        });
    }
}
