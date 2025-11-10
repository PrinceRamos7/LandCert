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
        // Requests table indexes (user_id already has foreign key index)
        Schema::table('requests', function (Blueprint $table) {
            $table->index('status');
            $table->index('created_at');
            $table->index(['status', 'created_at']);
        });

        // Applications table indexes (corp_id and project_id already have foreign key indexes)
        Schema::table('applications', function (Blueprint $table) {
            $table->index('created_at');
        });

        // Payments table indexes (request_id, application_id, verified_by already have foreign key indexes)
        Schema::table('payments', function (Blueprint $table) {
            $table->index('payment_status');
            $table->index('payment_date');
            $table->index(['payment_status', 'payment_date']);
        });

        // Users table indexes
        Schema::table('users', function (Blueprint $table) {
            $table->index('user_type');
            $table->index('created_at');
        });

        // Status history table indexes (request_id likely has foreign key index)
        Schema::table('status_history', function (Blueprint $table) {
            $table->index('created_at');
        });

        // Reports table indexes
        Schema::table('reports', function (Blueprint $table) {
            $table->index('evaluation');
            $table->index('app_id');
            $table->index('workflow_status');
        });

        // Certificates table indexes (request_id likely has foreign key index)
        Schema::table('certificates', function (Blueprint $table) {
            $table->index('issued_at');
        });

        // Audit logs table indexes for better performance
        Schema::table('audit_logs', function (Blueprint $table) {
            $table->index(['created_at', 'user_id']);
            $table->index('action');
            $table->index('model_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('requests', function (Blueprint $table) {
            $table->dropIndex(['requests_status_index']);
            $table->dropIndex(['requests_created_at_index']);
            $table->dropIndex(['requests_status_created_at_index']);
        });

        Schema::table('applications', function (Blueprint $table) {
            $table->dropIndex(['applications_created_at_index']);
        });

        Schema::table('payments', function (Blueprint $table) {
            $table->dropIndex(['payments_payment_status_index']);
            $table->dropIndex(['payments_payment_date_index']);
            $table->dropIndex(['payments_payment_status_payment_date_index']);
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex(['users_user_type_index']);
            $table->dropIndex(['users_created_at_index']);
        });

        Schema::table('status_history', function (Blueprint $table) {
            $table->dropIndex(['status_history_created_at_index']);
        });

        Schema::table('reports', function (Blueprint $table) {
            $table->dropIndex(['evaluation']);
            $table->dropIndex(['app_id']);
            $table->dropIndex(['workflow_status']);
        });

        Schema::table('certificates', function (Blueprint $table) {
            $table->dropIndex(['certificates_issued_at_index']);
        });

        Schema::table('audit_logs', function (Blueprint $table) {
            $table->dropIndex(['audit_logs_created_at_user_id_index']);
            $table->dropIndex(['audit_logs_action_index']);
            $table->dropIndex(['audit_logs_model_type_index']);
        });
    }
};
