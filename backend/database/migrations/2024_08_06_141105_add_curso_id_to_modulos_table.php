<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('modulos', function (Blueprint $table) {
            $table->unsignedBigInteger('curso_id');
    
            // Se você quiser adicionar uma chave estrangeira, adicione:
            $table->foreign('curso_id')->references('id')->on('cursos')->onDelete('cascade');
        });
    }
    
    public function down()
    {
        Schema::table('modulos', function (Blueprint $table) {
            $table->dropForeign(['curso_id']);
            $table->dropColumn('curso_id');
        });
    }
};
