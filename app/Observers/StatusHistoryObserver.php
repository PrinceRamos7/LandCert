<?php

namespace App\Observers;

use App\Models\StatusHistory;
use App\Models\User;
use App\Models\Request as RequestModel;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class StatusHistoryObserver
{
    /**
     * Handle the StatusHistory "created" event.
     */
    public function created(StatusHistory $statusHistory): void
    {
        Log::info('StatusHistoryObserver::created triggered', [
            'status_history_id' => $statusHistory->id,
            'request_id' => $statusHistory->request_id,
            'status_type' => $statusHistory->status_type,
            'new_status' => $statusHistory->new_status
        ]);
        
        // Send email notification to the user about the status change
        try {
            $request = RequestModel::find($statusHistory->request_id);
            
            if (!$request || !$request->user_id) {
                Log::info('No user found for status history notification', [
                    'status_history_id' => $statusHistory->id,
                    'request_id' => $statusHistory->request_id
                ]);
                return;
            }
            
            $user = User::find($request->user_id);
            
            if (!$user) {
                Log::warning('User not found for status history notification', [
                    'user_id' => $request->user_id,
                    'status_history_id' => $statusHistory->id
                ]);
                return;
            }
            
            // Only send email for certain status types and changes
            // Avoid duplicate emails for changes already handled by controllers
            $shouldSendEmail = $this->shouldSendEmailNotification($statusHistory);
            
            if ($shouldSendEmail) {
                Mail::to($user->email)->send(
                    new \App\Mail\StatusChangeNotification(
                        $statusHistory,
                        $request,
                        $user
                    )
                );
                
                Log::info('Status change notification email sent', [
                    'user_email' => $user->email,
                    'status_type' => $statusHistory->status_type,
                    'new_status' => $statusHistory->new_status,
                    'request_id' => $request->id
                ]);
            }
        } catch (\Exception $e) {
            Log::error('Failed to send status change notification email: ' . $e->getMessage(), [
                'status_history_id' => $statusHistory->id,
                'trace' => $e->getTraceAsString()
            ]);
        }
    }
    
    /**
     * Determine if an email notification should be sent for this status change.
     */
    private function shouldSendEmailNotification(StatusHistory $statusHistory): bool
    {
        // Don't send emails for these status changes as they're already handled by controllers
        $skipEmailFor = [
            // Payment status changes are handled by verifyPayment/rejectPayment
            'payment' => ['verified', 'rejected'],
            // Certificate generation is handled by generateCertificate
            'certificate' => ['generated'],
            // Application approval/rejection is handled by updateEvaluation
            'application' => ['approved', 'rejected'],
        ];
        
        $statusType = $statusHistory->status_type;
        $newStatus = $statusHistory->new_status;
        
        // Check if this status change should skip email
        if (isset($skipEmailFor[$statusType]) && in_array($newStatus, $skipEmailFor[$statusType])) {
            return false;
        }
        
        // Send email for other status changes
        return true;
    }
}
