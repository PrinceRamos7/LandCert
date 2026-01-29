<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\StatusHistory;
use App\Models\Request as RequestModel;
use App\Models\User;
use Illuminate\Support\Facades\Mail;

class TestStatusChangeEmail extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'test:status-change-email {request_id?}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test status change notification email';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $requestId = $this->argument('request_id');
        
        if (!$requestId) {
            // Get the first request with a user
            $request = RequestModel::whereNotNull('user_id')->first();
            
            if (!$request) {
                $this->error('No requests found with a user_id');
                return 1;
            }
            
            $requestId = $request->id;
        } else {
            $request = RequestModel::find($requestId);
            
            if (!$request) {
                $this->error("Request with ID {$requestId} not found");
                return 1;
            }
        }
        
        if (!$request->user_id) {
            $this->error("Request {$requestId} has no user_id");
            return 1;
        }
        
        $user = User::find($request->user_id);
        
        if (!$user) {
            $this->error("User with ID {$request->user_id} not found");
            return 1;
        }
        
        $this->info("Testing status change email for:");
        $this->info("  Request ID: {$request->id}");
        $this->info("  User: {$user->name} ({$user->email})");
        $this->info("  Applicant: {$request->applicant_name}");
        
        // Create a test status history entry
        $this->info("\nCreating test status history entry...");
        
        $statusHistory = StatusHistory::create([
            'request_id' => $request->id,
            'status_type' => 'certificate',
            'old_status' => null,
            'new_status' => 'collected',
            'changed_by' => auth()->id() ?? 1,
            'notes' => 'Test status change - Certificate downloaded by applicant',
        ]);
        
        $this->info("Status history created with ID: {$statusHistory->id}");
        $this->info("\nThe observer should automatically send an email notification.");
        $this->info("Check the logs and the user's email inbox.");
        
        // Also send a direct test email
        $this->info("\nSending direct test email...");
        
        try {
            Mail::to($user->email)->send(
                new \App\Mail\StatusChangeNotification(
                    $statusHistory,
                    $request,
                    $user
                )
            );
            
            $this->info("✓ Test email sent successfully to {$user->email}");
        } catch (\Exception $e) {
            $this->error("✗ Failed to send test email: " . $e->getMessage());
            return 1;
        }
        
        $this->info("\n✓ Test completed successfully!");
        
        return 0;
    }
}
