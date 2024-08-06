<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Aula extends Model
{
    protected $fillable = ['nome', 'descricao', 'link_video', 'modulo_id', 'curso_id'];

    public function modulo()
    {
        return $this->belongsTo(Modulos::class);
    }

    public function curso()
    {
        return $this->belongsTo(Cursos::class);
    }
}

