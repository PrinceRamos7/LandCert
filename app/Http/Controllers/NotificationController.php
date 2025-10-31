<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class NotificationController extends Controller
{
    /**
     * Get notifications for the authenticated user
     */
    public function index()
    {
        $user = auth()->user();
        
        // Get recent activity based on user role
        if ($user->user_type === 'admin') {
            $notifications = $this->getAdminNotifications();
        } else {
            $notifications = $this->getUserNotifications($user->id);
        }
        
        return response()->json($notifications);
    }
    
    /**
     * Get admin notifications
     */
    private function getAdminNotifications()
    {
        $notifications = [];
        
        // Pending payments
        $pendingPayments = \App\Models\Payment::where('payment_status', 'pending')
            ->with('request')
            ->latest()
            ->take(5)
            ->get();
            
        foreach ($pendingPayments as $payment) {
            $notifications[] = [
                'id' => 'payment_' . $payment->id,
                'type' => 'payment_pending',
                'title' => 'New Payment Submission',
                'message' => "Payment from {$payment->request->applicant_name} needs verification",
                'link' => route('admin.payments'),
                'created_at' => $payment->created_at,
                'read' => false,
            ];
        }
        
        // Pending applications
        $pendingApps = \App\Models\Report::where('evaluation', 'pending')
            ->with('application')
            ->latest()
            ->take(5)
            ->get();
            
        foreach ($pendingApps as $report) {
            if ($report->application) {
                $notifications[] = [
                    'id' => 'app_' . $report->report_id,
                    'type' => 'application_pending',
                    'title' => 'Pending Application',
                    'message' => "Application from {$report->application->applicant_name} awaiting review",
                    'link' => route('admin.dashboard'),
                    'created_at' => $report->created_at,
                    'read' => false,
                ];
            }
        }
        
        // Sort by date
        usort($notifications, function($a, $b) {
            return $b['created_at'] <=> $a['created_at'];
        });
        
        return array_slice($notifications, 0, 10);
    }
    
    /**
     * Get user notifications
     */
    private function getUserNotifications($userId)
    {
        $notifications = [];
        
        // Get user's requests with status changes
        $requests = \App\Models\Request::where('user_id', $userId)
            ->with(['application.report', 'payments', 'certificates'])
            ->latest()
            ->get();
            
        foreach ($requests as $request) {
            // Check for approved applications
            if ($request->application && $request->application->report) {
                $report = $request->application->report;
                if ($report->evaluation === 'approved') {
                    $notifications[] = [
                        'id' => 'approved_' . $request->id,
                        'type' => 'application_approved',
                        'title' => 'Application Approved',
                        'message' => "Your application has been approved. Please proceed with payment.",
                        'link' => route('receipt.index'),
                        'created_at' => $report->updated_at,
                        'read' => false,
                    ];
                }
            }
            
            // Check for verified payments
            foreach ($request->payments as $payment) {
                if ($payment->payment_status === 'verified') {
                    $notifications[] = [
                        'id' => 'payment_verified_' . $payment->id,
                        'type' => 'payment_verified',
                        'title' => 'Payment Verified',
                        'message' => "Your payment has been verified. Certificate is being generated.",
                        'link' => route('receipt.index'),
                        'created_at' => $payment->verified_at,
                        'read' => false,
                    ];
                }
            }
            
            // Check for certificates
            foreach ($request->certificates as $certificate) {
                if ($certificate->status === 'sent') {
                    $notifications[] = [
                        'id' => 'certificate_' . $certificate->id,
                        'type' => 'certificate_issued',
                        'title' => 'Certificate Issued',
                        'message' => "Your certificate {$certificate->certificate_number} is ready for download.",
                        'link' => route('receipt.index'),
                        'created_at' => $certificate->issued_at,
                        'read' => false,
                    ];
                }
            }
        }
        
        // Sort by date
        usort($notifications, function($a, $b) {
            return $b['created_at'] <=> $a['created_at'];
        });
        
        return array_slice($notifications, 0, 10);
    }
    
    /**
     * Mark notification as read
     */
    public function markAsRead(Request $request)
    {
        // In a real implementation, you'd store read status in database
        return response()->json(['success' => true]);
    }
}
