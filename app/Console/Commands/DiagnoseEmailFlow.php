<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Request as RequestModel;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class DiagnoseEmailFlow extends Command
{
    protected $signature = 'diagnose:email-flow {request_id?}';
    protected $description = 'Diagnose email sending for a specific request';

    public function handle()
    {
        $requestId = $this->argument('request_id');
        
        if (!$requestId) {
            $request = RequestModel::whereNotNull('user_id')->latest()->first();
            if (!$request) {
                $this->error('No requests found');
                return 1;
            }
            $requestId = $request->id;
        } else {
            $request = RequestModel::find($requestId);
            if (!$request) {
                $this->error("Request ID {$requestId} not found");
                return 1;
            }
        }
        
        $this->info("=== Email Flow Diagnosis for Request #{$request->id} ===");
        $this->newLine();
        
        // Request details
        $this->info("Request Details:");
        $this->line("  ID: {$request->id}");
        $this->line("  Applicant: {$request->applicant_name}");
        $this->line("  Status: {$request->status}");
        $this->line("  Created: {$request->created_at}");
        $this->newLine();
        
        // User details
        if ($request->user_id) {
            $user = User::find($request->user_id);
            if ($user) {
                $this->info("User Details:");
                $this->line("  Name: {$user->name}");
                $this->line("  Email: {$user->email}");
                $this->line("  User Type: {$user->user_type}");
                $this->newLine();
            } else {
                $this->error("User ID {$request->user_id} not found!");
                $this->newLine();
            }
        } else {
            $this->error("No user_id associated with this request!");
            $this->newLine();
        }
        
        // Check status history
        $statusHistories = \App\Models\StatusHistory::where('request_id', $request->id)
            ->orderBy('created_at', 'desc')
            ->get();
        
        $this->info("Status History ({$statusHistories->count()} entries):");
        foreach ($statusHistories as $history) {
            $this->line("  [{$history->created_at}] {$history->status_type}: {$history->old_status} → {$history->new_status}");
            $this->line("    Notes: {$history->notes}");
        }
        $this->newLine();
        
        // Check logs for this request
        $logFile = storage_path('logs/laravel-' . date('Y-m-d') . '.log');
        if (file_exists($logFile)) {
            $this->info("Checking today's logs for request #{$request->id}...");
            $logs = file_get_contents($logFile);
            $lines = explode("\n", $logs);
            
            $emailLogs = [];
            foreach ($lines as $line) {
                if (strpos($line, "request_id\":{$request->id}") !== false || 
                    strpos($line, "request ID: {$request->id}") !== false) {
                    if (strpos($line, 'email') !== false || strpos($line, 'Email') !== false) {
                        $emailLogs[] = $line;
                    }
                }
            }
            
            if (count($emailLogs) > 0) {
                $this->info("Found " . count($emailLogs) . " email-related log entries:");
                foreach ($emailLogs as $log) {
                    // Extract just the relevant part
                    if (preg_match('/\[(.*?)\].*?(INFO|ERROR|WARNING):(.*)/', $log, $matches)) {
                        $this->line("  [{$matches[1]}] " . trim($matches[3]));
                    }
                }
            } else {
                $this->warn("No email-related logs found for this request today.");
            }
        } else {
            $this->warn("Today's log file not found: {$logFile}");
        }
        
        $this->newLine();
        $this->info("=== Diagnosis Complete ===");
        $this->newLine();
        
        // Recommendations
        $this->info("Recommendations:");
        $this->line("1. Check the email inbox: " . ($user->email ?? 'N/A'));
        $this->line("2. Check spam/junk folder");
        $this->line("3. Verify MAIL_FROM_ADDRESS in .env matches a valid email");
        $this->line("4. Check mail server logs if using external SMTP");
        $this->line("5. Run: php artisan queue:work (if using queued emails)");
        
        return 0;
    }
}
