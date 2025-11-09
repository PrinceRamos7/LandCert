<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Drop all existing performance indexes if they exist
        // Requests
        $this->dropIndexIfExists('requests', 'requests_status_index');
        $this->dropIndexIfExists('requests', 'requests_user_id_index');
        $this->dropIndexIfExists('requests', 'requests_created_at_index');
        $this->dropIndexIfExists('requests', 'requests_status_created_at_index');
        
        // Payments
        $this->dropIndexIfExists('payments', 'payments_payment_status_index');
        $this->dropIndexIfExists('payments', 'payments_payment_date_index');
        $this->dropIndexIfExists('payments', 'payments_payment_status_payment_date_index');
        
        // Applications
        $this->dropIndexIfExists('applications', 'applications_created_at_index');
        
        // Users
        $this->dropIndexIfExists('users', 'users_user_type_index');
        $this->dropIndexIfExists('users', 'users_created_at_index');
        
        // Certificates
        $this->dropIndexIfExists('certificates', 'certificates_issued_at_index');
        
        // Status History
        $this->dropIndexIfExists('status_history', 'status_history_created_at_index');
        
        // Reports
        $this->dropIndexIfExists('reports', 'reports_evaluation_index');
        $this->dropIndexIfExists('reports', 'reports_app_id_index');
        $this->dropIndexIfExists('reports', 'reports_workflow_status_index');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Nothing to do
    }

    private function dropIndexIfExists($table, $index)
    {
        try {
            DB::statement("ALTER TABLE `{$table}` DROP INDEX `{$index}`");
        } catch (\Exception $e) {
            // Index doesn't exist, ignore
        }
    }
};
