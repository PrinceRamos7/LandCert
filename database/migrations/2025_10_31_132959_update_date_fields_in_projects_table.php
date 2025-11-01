<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            // Change if_yes_b (notice dates) from string to date
            $table->date('if_yes_b')->nullable()->change();
            
            // Change if_yes_d (similar application dates) from string to date
            $table->date('if_yes_d')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            // Revert back to string
            $table->string('if_yes_b')->nullable()->change();
            $table->string('if_yes_d')->nullable()->change();
        });
    }
};