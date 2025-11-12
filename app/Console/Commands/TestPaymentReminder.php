<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Request as RequestModel;
use App\Models\Application;
use App\Models\Report;
use App\Services\ReminderService;

class TestPaymentReminder extends Command
{
    protected $signature = 'test:payment-reminder {request_id?}';
    protected $description = 'Test the automated payment reminder system';

    public function handle()
    {
        $this->info('🧪 Testing Automated Payment Reminder System...');
        $this->newLine();

        $requestId = $this->argument('request_id');
        
        if (!$requestId) {
            // Find an approved request
            $request = RequestModel::whereNotNull('user_id')
                ->with('user')
                ->get()
                ->filter(function($req) {
                    $application = \App\Models\Application::where('applicant_name', $req->applicant_name)
                        ->where('applicant_address', $req->applicant_address)
                        ->first();
                    
                    if (!$application) return false;
                    
                    $report = \App\Models\Report::where('app_id', $application->id)
                        ->where('evaluation', 'approved')
                        ->first();
                    
                    return $report !== null;
                })
                ->first();
                
            if (!$request) {
                $this->error('❌ No approved requests found. Please approve a request first.');
                return 1;
            }
            
            $requestId = $request->id;
        } else {
            $request = RequestModel::find($requestId);
            if (!$request) {
                $this->error("❌ Request #{$requestId} not found.");
                return 1;
            }
        }

        $this->info("📋 Testing with Request ID: #{$requestId}");
        $this->info("👤 Applicant: {$request->applicant_name}");
        $this->info("📧 Email: {$request->user->email}");
        $this->newLine();

        // Schedule the reminder
        try {
            $reminderService = app(ReminderService::class);
            $reminder = $reminderService->schedulePaymentReminder(
                $request->id,
                $request->user_id,
                3
            );

            $this->info('✅ Payment reminder scheduled successfully!');
            $this->newLine();
            
            $this->table(
                ['Field', 'Value'],
                [
                    ['Reminder ID', $reminder->id],
                    ['Type', $reminder->type],
                    ['User', $request->user->name],
                    ['Email', $request->user->email],
                    ['Scheduled For', $reminder->scheduled_at->format('Y-m-d H:i:s')],
                    ['Days Until Due', '3 days'],
                    ['Status', $reminder->status],
                ]
            );
            
            $this->newLine();
            $this->info('📬 To send this reminder immediately (for testing):');
            $this->comment('   php artisan reminders:send');
            $this->newLine();
            $this->info('⏰ In production, reminders will be sent automatically every hour via:');
            $this->comment('   php artisan schedule:run');
            
            return 0;
        } catch (\Exception $e) {
            $this->error('❌ Failed to schedule reminder: ' . $e->getMessage());
            return 1;
        }
    }
}
