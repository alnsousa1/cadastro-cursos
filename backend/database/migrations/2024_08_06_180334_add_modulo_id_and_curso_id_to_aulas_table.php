<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddModuloIdAndCursoIdToAulasTable extends Migration
{
    public function up()
    {
        Schema::table('aulas', function (Blueprint $table) {
            $table->unsignedBigInteger('modulo_id')->after('id');
            $table->unsignedBigInteger('curso_id')->after('modulo_id');

            $table->foreign('modulo_id')->references('id')->on('modulos')->onDelete('cascade');
            $table->foreign('curso_id')->references('id')->on('cursos')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::table('aulas', function (Blueprint $table) {
            $table->dropForeign(['modulo_id']);
            $table->dropForeign(['curso_id']);
            $table->dropColumn(['modulo_id', 'curso_id']);
        });
    }
}