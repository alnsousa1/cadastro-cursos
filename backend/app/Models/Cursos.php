<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cursos extends Model
{
    use HasFactory;

    protected $table = 'cursos';
    protected $fillable = ['titulo', 'descricao', 'imagem'];

    public function aulas()
    {
        return $this->hasMany(Aulas::class, 'curso_id');
    }

    public function modulos()
    {
        return $this->hasMany(Modulos::class, 'curso_id');
    }
}
