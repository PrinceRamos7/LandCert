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
        Schema::create('projects', function (Blueprint $table) {
            $table->increments('id');
            $table->text('location');
            $table->string('lot')->nullable();
            $table->string('bldg_improvement')->nullable();
            $table->string('right_over_land')->nullable();
            $table->string('nature')->nullable();
            $table->string('existing_land_use')->nullable();
            $table->decimal('cost', 15, 2)->nullable();
            $table->string('question_1')->nullable();
            $table->string('if_yes_a')->nullable();
            $table->string('if_yes_b')->nullable();
            $table->string('question_b')->nullable();
            $table->string('if_yes_c')->nullable();
            $table->string('if_yes_d')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
