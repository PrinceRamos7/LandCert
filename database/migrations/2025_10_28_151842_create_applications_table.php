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
    Schema::create('applications', function (Blueprint $table) {
        $table->increments('id');
        $table->unsignedInteger('corp_id')->nullable();
        $table->foreign('corp_id')->references('id')->on('corporations')->onDelete('set null');
        $table->unsignedInteger('project_id')->nullable();
        $table->foreign('project_id')->references('id')->on('projects')->onDelete('set null');
        $table->string('applicant_name');
        $table->text('applicant_address');
        $table->string('authorized_representative')->nullable();
        $table->text('representative_address')->nullable();
        $table->string('authorization_letter_path')->nullable();
        $table->string('preffered_release')->nullable();
        $table->timestamps();
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('applications');
    }
};
