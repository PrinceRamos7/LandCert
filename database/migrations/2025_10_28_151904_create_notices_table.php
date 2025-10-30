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
    Schema::create('notices', function (Blueprint $table) {
        $table->increments('notice_id');
        $table->unsignedInteger('app_id');
        $table->foreign('app_id')->references('id')->on('applications')->onDelete('cascade');

        $table->enum('notice_type', ['Zoning Notice', 'Similar Application']);
        $table->string('officer_name')->nullable();
        $table->string('office_name')->nullable();
        $table->date('date_issued')->nullable();

        $table->timestamps();
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notices');
    }
};
