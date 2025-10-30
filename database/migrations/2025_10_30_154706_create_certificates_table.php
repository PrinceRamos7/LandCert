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
        Schema::create('certificates', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('request_id');
            $table->unsignedInteger('application_id')->nullable();
            $table->unsignedBigInteger('payment_id')->nullable();
            $table->string('certificate_number')->unique();
            $table->string('certificate_file_path')->nullable();
            $table->unsignedInteger('issued_by')->nullable();
            $table->timestamp('issued_at')->nullable();
            $table->date('valid_until')->nullable();
            $table->enum('status', ['generated', 'sent', 'collected'])->default('generated');
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->foreign('request_id')->references('id')->on('requests')->onDelete('cascade');
            $table->foreign('application_id')->references('id')->on('applications')->onDelete('set null');
            $table->foreign('payment_id')->references('id')->on('payments')->onDelete('set null');
            $table->foreign('issued_by')->references('id')->on('users')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('certificates');
    }
};
