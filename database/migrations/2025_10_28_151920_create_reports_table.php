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
    Schema::create('reports', function (Blueprint $table) {
        $table->increments('report_id');
        $table->unsignedInteger('app_id');
        $table->foreign('app_id')->references('id')->on('applications')->onDelete('cascade');
        
        $table->text('description')->nullable();
        $table->date('date_certified')->nullable();
        $table->decimal('amount', 12, 2)->nullable();
        $table->enum('evaluation', ['pending', 'approved', 'rejected'])->nullable();
        $table->dateTime('date_reported')->nullable();
        $table->string('issued_by')->nullable();

        $table->timestamps();
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reports');
    }
};
