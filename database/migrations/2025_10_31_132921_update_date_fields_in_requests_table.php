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
        Schema::table('requests', function (Blueprint $table) {
            // Change notice_dates from string to date
            $table->date('notice_dates')->nullable()->change();
            
            // Change similar_application_dates from string to date
            $table->date('similar_application_dates')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('requests', function (Blueprint $table) {
            // Revert back to string
            $table->string('notice_dates')->nullable()->change();
            $table->string('similar_application_dates')->nullable()->change();
        });
    }
};