<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\StatusHistory;
use App\Models\Request as RequestModel;
use Illuminate\Support\Facades\Log;

class TestObserver extends Command
{
    protected $signature = 'test:observer';
    protected $description = 'Test if StatusHistory observer is firing';

    public function handle()
    {
        $this->info('Testing StatusHistory observer...');
        
        // Get a request
        $request = RequestModel::first();
        
        if (!$request) {
            $this->error('No requests found');
            return 1;
        }
        
        $this->info("Using request ID: {$request->id}");
        
        // Test 1: Using create() directly
        $this->info("\nTest 1: Using StatusHistory::create()");
        $sh1 = StatusHistory::create([
            'request_id' => $request->id,
            'status_type' => 'application',
            'old_status' => 'pending',
            'new_status' => 'under_review',
            'changed_by' => 1,
            'notes' => 'Test 1 - Direct create()',
        ]);
        $this->info("Created StatusHistory ID: {$sh1->id}");
        
        sleep(1);
        
        // Test 2: Using logChange() method
        $this->info("\nTest 2: Using StatusHistory::logChange()");
        $sh2 = StatusHistory::logChange(
            $request->id,
            'payment',
            'pending',
            'submitted',
            1,
            'Test 2 - Using logChange()'
        );
        $this->info("Created StatusHistory ID: {$sh2->id}");
        
        sleep(1);
        
        // Check the logs
        $this->info("\nChecking logs...");
        $logFile = storage_path('logs/laravel-' . date('Y-m-d') . '.log');
        
        if (!file_exists($logFile)) {
            $this->error("Log file not found: {$logFile}");
            return 1;
        }
        
        $logs = file_get_contents($logFile);
        
        if (strpos($logs, 'StatusHistoryObserver::created triggered') !== false) {
            $this->info('✓ Observer WAS triggered!');
            $this->info("\nRecent log entries:");
            $lines = explode("\n", $logs);
            $recentLines = array_slice($lines, -20);
            foreach ($recentLines as $line) {
                if (strpos($line, 'StatusHistory') !== false || strpos($line, 'Status change') !== false) {
                    $this->line($line);
                }
            }
        } else {
            $this->error('✗ Observer was NOT triggered!');
        }
        
        return 0;
    }
}
