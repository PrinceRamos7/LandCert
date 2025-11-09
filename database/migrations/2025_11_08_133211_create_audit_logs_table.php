<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('user_id')->nullable();
            $table->string('user_name')->nullable();
            $table->string('user_email')->nullable();
            $table->string('user_type')->nullable();
            
            // Action details
            $table->string('action'); // created, updated, deleted, viewed, exported, etc.
            $table->string('model_type')->nullable(); // Request, Payment, User, etc.
            $table->unsignedBigInteger('model_id')->nullable();
            $table->string('description');
            
            // Before/After values
            $table->json('old_values')->nullable();
            $table->json('new_values')->nullable();
            
            // Request details
            $table->string('ip_address', 45)->nullable();
            $table->string('user_agent')->nullable();
            $table->string('url')->nullable();
            $table->string('method', 10)->nullable(); // GET, POST, PUT, DELETE
            
            // Additional metadata
            $table->json('metadata')->nullable();
            $table->timestamp('created_at')->useCurrent();
            
            // Indexes for performance
            $table->index('user_id');
            $table->index('action');
            $table->index('model_type');
            $table->index('model_id');
            $table->index('created_at');
            $table->index(['user_id', 'created_at']);
            $table->index(['model_type', 'model_id']);
            
            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
    }
};
