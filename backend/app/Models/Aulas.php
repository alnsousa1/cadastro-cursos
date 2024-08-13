<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Aulas extends Model
{
    protected $fillable = ['nome', 'descricao', 'link_aula', 'modulo_id', 'curso_id'];

    public function modulo()
    {
        return $this->belongsTo(Modulos::class);
    }

    public function curso()
    {
        return $this->belongsTo(Cursos::class);
    }
}

