<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\AuditLogService;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class TestAuditLog extends Command
{
    protected $signature = 'test:audit-log';
    protected $description = 'Test audit log functionality with real data';

    public function handle()
    {
        $this->info('🧪 Testing Audit Log System...');
        $this->newLine();

        // Get an admin user
        $admin = User::where('user_type', 'admin')->first();
        
        if (!$admin) {
            $this->error('No admin user found. Please create an admin user first.');
            return 1;
        }

        // Simulate login
        Auth::login($admin);
        $this->info("✅ Logged in as: {$admin->name}");

        // Test 1: Log a create action
        $this->info('📝 Testing CREATE action...');
        AuditLogService::logCreate(
            'Request',
            1,
            ['applicant_name' => 'John Doe', 'status' => 'pending'],
            'Created test request for John Doe'
        );
        $this->info('✅ Create action logged');

        // Test 2: Log an update action
        $this->info('📝 Testing UPDATE action...');
        AuditLogService::logUpdate(
            'Request',
            1,
            ['status' => 'pending'],
            ['status' => 'approved'],
            'Updated request status to approved'
        );
        $this->info('✅ Update action logged');

        // Test 3: Log a delete action
        $this->info('📝 Testing DELETE action...');
        AuditLogService::logDelete(
            'Payment',
            1,
            ['amount' => 1000, 'status' => 'pending'],
            'Deleted payment record'
        );
        $this->info('✅ Delete action logged');

        // Test 4: Log a view action
        $this->info('📝 Testing VIEW action...');
        AuditLogService::logView(
            'User',
            $admin->id,
            'Viewed user profile'
        );
        $this->info('✅ View action logged');

        // Test 5: Log an export action
        $this->info('📝 Testing EXPORT action...');
        AuditLogService::logExport('requests', 50, 'pdf');
        $this->info('✅ Export action logged');

        // Test 6: Log a login action
        $this->info('📝 Testing LOGIN action...');
        AuditLogService::logLogin();
        $this->info('✅ Login action logged');

        // Test 7: Log a bulk action
        $this->info('📝 Testing BULK action...');
        AuditLogService::logBulkAction('delete', 'Request', [1, 2, 3]);
        $this->info('✅ Bulk action logged');

        $this->newLine();
        $this->info('🎉 All tests completed!');
        
        $count = \App\Models\AuditLog::count();
        $this->info("📊 Total audit logs: {$count}");
        
        $this->newLine();
        $this->info('✨ You can now view the audit logs at: /admin/audit-logs');

        return 0;
    }
}
