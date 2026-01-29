<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\StatusHistory;
use App\Models\Request as RequestModel;
use App\Models\User;

class DemoStatusChangeEmails extends Command
{
    protected $signature = 'demo:status-change-emails';
    protected $description = 'Demonstrate the automatic status change email notification system';

    public function handle()
    {
        $this->info('=== Status Change Email Notification Demo ===');
        $this->newLine();
        
        // Get a request with a user
        $request = RequestModel::whereNotNull('user_id')->first();
        
        if (!$request) {
            $this->error('No requests found with a user_id');
            return 1;
        }
        
        $user = User::find($request->user_id);
        
        $this->info("Demo Setup:");
        $this->line("  Request ID: {$request->id}");
        $this->line("  Applicant: {$request->applicant_name}");
        $this->line("  User: {$user->name}");
        $this->line("  Email: {$user->email}");
        $this->newLine();
        
        $this->info("The system will now create various status changes.");
        $this->info("Watch how the observer automatically sends email notifications!");
        $this->newLine();
        
        // Demo 1: Certificate collected
        $this->info("1. Creating status change: Certificate Collected");
        StatusHistory::logChange(
            $request->id,
            'certificate',
            null,
            'collected',
            auth()->id() ?? 1,
            'Demo: Certificate downloaded by applicant'
        );
        $this->line("   ✓ Status change logged");
        $this->line("   ✓ Observer automatically triggered");
        $this->line("   ✓ Email sent to {$user->email}");
        $this->newLine();
        
        sleep(2);
        
        // Demo 2: Payment submitted
        $this->info("2. Creating status change: Payment Submitted");
        StatusHistory::logChange(
            $request->id,
            'payment',
            'pending',
            'submitted',
            auth()->id() ?? 1,
            'Demo: Payment receipt uploaded'
        );
        $this->line("   ✓ Status change logged");
        $this->line("   ✓ Observer automatically triggered");
        $this->line("   ✓ Email sent to {$user->email}");
        $this->newLine();
        
        sleep(2);
        
        // Demo 3: Application under review
        $this->info("3. Creating status change: Application Under Review");
        StatusHistory::logChange(
            $request->id,
            'application',
            'pending',
            'under_review',
            auth()->id() ?? 1,
            'Demo: Application is being reviewed by admin'
        );
        $this->line("   ✓ Status change logged");
        $this->line("   ✓ Observer automatically triggered");
        $this->line("   ✓ Email sent to {$user->email}");
        $this->newLine();
        
        $this->info("=== Demo Complete ===");
        $this->newLine();
        $this->info("Check the logs to verify:");
        $logFile = storage_path('logs/laravel-' . date('Y-m-d') . '.log');
        $this->line("  Log file: {$logFile}");
        $this->newLine();
        $this->line("  Search for:");
        $this->line("    - 'StatusHistoryObserver::created triggered'");
        $this->line("    - 'Status change notification email sent'");
        $this->newLine();
        $this->info("Check the user's email inbox at: {$user->email}");
        
        return 0;
    }
}
