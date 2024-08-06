<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Modulos extends Model
{
    use HasFactory;

    protected $table = 'modulos';
    protected $fillable = ['titulo'];

    public function curso()
    {
        return $this->belongsTo(Cursos::class);
    }

    public function aulas()
{
    return $this->hasMany(Aula::class);
}

}
