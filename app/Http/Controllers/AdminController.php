<?php

namespace App\Http\Controllers;

use App\Models\Application;
use App\Models\Report;
use App\Models\Request as RequestModel;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\DB;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Mail\ApplicationRejected;
use App\Mail\PaymentRejected;

class AdminController extends Controller
{
    // Middleware is applied in routes/web.php

    /**
     * Display admin dashboard with all applications
     */
    public function dashboard(Request $request): Response
    {
        // Get analytics data
        $analytics = $this->getDashboardAnalytics();
        
        $perPage = $request->input('per_page', 10);
        
        // Get all requests with their related data
        $requests = RequestModel::with('user')->orderBy('created_at', 'desc')->paginate($perPage);
        
        // Get applications and reports data
        $applicationsData = Application::with('report')->get()->keyBy(function($app) {
            return $app->applicant_name . '|' . $app->applicant_address;
        });
        
        // Merge the data
        $applications = $requests->through(function($request) use ($applicationsData) {
            $key = $request->applicant_name . '|' . $request->applicant_address;
            $application = $applicationsData->get($key);
            $report = $application?->report;
            
            return (object)[
                'id' => $request->id,
                'applicant_name' => $request->applicant_name,
                'corporation_name' => $request->corporation_name,
                'applicant_address' => $request->applicant_address,
                'project_type' => $request->project_type,
                'project_nature' => $request->project_nature,
                'project_location_street' => $request->project_location_street,
                'project_location_barangay' => $request->project_location_barangay,
                'project_location_city' => $request->project_location_city,
                'project_location_municipality' => $request->project_location_municipality,
                'project_location_province' => $request->project_location_province,
                'lot_area_sqm' => $request->lot_area_sqm,
                'project_cost' => $request->project_cost,
                'created_at' => $request->created_at,
                'updated_at' => $request->updated_at,
                'application_id' => $application?->id,
                'report_id' => $report?->getKey(),
                'evaluation' => $report?->evaluation,
                'report_description' => $report?->description,
                'report_amount' => $report?->amount,
                'date_certified' => $report?->date_certified,
                'date_reported' => $report?->date_reported,
                'issued_by' => $report?->issued_by,
                'user_name' => $request->user?->name,
                'user_email' => $request->user?->email,
                'status' => $report?->evaluation ?? $request->status,
            ];
        });

        // Get all requests with their status (using same logic as request page)
        $allRequests = RequestModel::with('user')->get();
        $applicationsData = Application::with('report')->get()->keyBy(function($app) {
            return $app->applicant_name . '|' . $app->applicant_address;
        });

        // Calculate stats using the same logic as request page
        $statusCounts = ['pending' => 0, 'approved' => 0, 'rejected' => 0];
        
        foreach ($allRequests as $request) {
            $key = $request->applicant_name . '|' . $request->applicant_address;
            $application = $applicationsData->get($key);
            $report = $application?->report;
            
            // Use report evaluation if available, otherwise use request status
            $status = $report?->evaluation ?? $request->status;
            
            if (isset($statusCounts[$status])) {
                $statusCounts[$status]++;
            }
        }
        
        $stats = [
            'total' => $allRequests->count(),
            'pending' => $statusCounts['pending'],
            'approved' => $statusCounts['approved'],
            'rejected' => $statusCounts['rejected'],
        ];

        // Add debug logging to verify the data
        \Log::info('Evaluation Statistics:', [
            'status_counts' => $statusCounts,
            'total_requests' => $allRequests->count(),
            'final_stats' => $stats
        ]);

        // Get detailed evaluation distribution for the chart
        $evaluationDistribution = $this->getEvaluationDistribution();

        // Get detailed evaluation distribution for the chart
        $evaluationDistribution = $this->getEvaluationDistribution();

        return Inertia::render('Admin/Dashboard', [
            'applications' => $applications,
            'stats' => $stats,
            'analytics' => $analytics,
            'evaluationDistribution' => $evaluationDistribution,
        ]);
    }
    
    /**
     * Get dashboard analytics
     */
    private function getDashboardAnalytics()
    {
        // Monthly submissions trend (last 6 months)
        $monthlyData = RequestModel::select(
            DB::raw('DATE_FORMAT(created_at, "%Y-%m") as month'),
            DB::raw('COUNT(*) as count')
        )
        ->where('created_at', '>=', now()->subMonths(6))
        ->groupBy('month')
        ->orderBy('month')
        ->get();
        
        // Payment statistics
        $paymentStats = [
            'total_revenue' => \App\Models\Payment::where('payment_status', 'verified')->sum('amount'),
            'pending_payments' => \App\Models\Payment::where('payment_status', 'pending')->count(),
            'verified_payments' => \App\Models\Payment::where('payment_status', 'verified')->count(),
            'rejected_payments' => \App\Models\Payment::where('payment_status', 'rejected')->count(),
            'average_payment' => \App\Models\Payment::where('payment_status', 'verified')->avg('amount'),
        ];
        
        // Monthly payment revenue (last 6 months)
        $monthlyRevenue = \App\Models\Payment::select(
            DB::raw('DATE_FORMAT(payment_date, "%Y-%m") as month'),
            DB::raw('SUM(amount) as revenue'),
            DB::raw('COUNT(*) as count')
        )
        ->where('payment_status', 'verified')
        ->where('payment_date', '>=', now()->subMonths(6))
        ->groupBy('month')
        ->orderBy('month')
        ->get();
        
        // Payment methods distribution
        $paymentMethods = \App\Models\Payment::select('payment_method', DB::raw('COUNT(*) as count'))
            ->where('payment_status', 'verified')
            ->groupBy('payment_method')
            ->get();
        
        // Certificate statistics
        $certificateStats = [
            'total_issued' => \App\Models\Certificate::count(),
            'issued_this_month' => \App\Models\Certificate::whereMonth('issued_at', now()->month)->count(),
            'collected' => \App\Models\Certificate::where('status', 'collected')->count(),
            'sent' => \App\Models\Certificate::where('status', 'sent')->count(),
        ];
        
        // Application status breakdown
        $statusBreakdown = Report::select('evaluation', DB::raw('COUNT(*) as count'))
            ->groupBy('evaluation')
            ->get();
        
        // Average processing time (from submission to approval)
        $avgProcessingTime = Report::where('evaluation', 'approved')
            ->whereNotNull('date_reported')
            ->join('applications', 'reports.app_id', '=', 'applications.id')
            ->selectRaw('AVG(DATEDIFF(reports.date_reported, applications.created_at)) as avg_days')
            ->value('avg_days');
        
        // Recent activity
        $recentActivity = \App\Models\StatusHistory::with('user')
            ->latest()
            ->take(10)
            ->get()
            ->map(function($history) {
                return [
                    'id' => $history->id,
                    'request_id' => $history->request_id,
                    'entity_type' => $history->entity_type,
                    'old_status' => $history->old_status,
                    'new_status' => $history->new_status,
                    'changed_by' => $history->user?->name ?? 'System',
                    'notes' => $history->notes,
                    'created_at' => $history->created_at,
                ];
            });
        
        // Project type distribution
        $projectTypes = RequestModel::select('project_type', DB::raw('COUNT(*) as count'))
            ->whereNotNull('project_type')
            ->groupBy('project_type')
            ->get();
        
        // Top users by submissions
        $topUsers = RequestModel::select('user_id', DB::raw('COUNT(*) as count'))
            ->whereNotNull('user_id')
            ->groupBy('user_id')
            ->orderByDesc('count')
            ->take(5)
            ->with('user')
            ->get()
            ->map(function($item) {
                return [
                    'name' => $item->user?->name ?? 'Unknown',
                    'email' => $item->user?->email ?? '',
                    'count' => $item->count,
                ];
            });
        
        // Weekly activity (last 4 weeks)
        $weeklyActivity = RequestModel::select(
            DB::raw('YEARWEEK(created_at) as week'),
            DB::raw('COUNT(*) as count')
        )
        ->where('created_at', '>=', now()->subWeeks(4))
        ->groupBy('week')
        ->orderBy('week')
        ->get();
        
        return [
            'monthly_submissions' => $monthlyData,
            'monthly_revenue' => $monthlyRevenue,
            'payment_stats' => $paymentStats,
            'payment_methods' => $paymentMethods,
            'certificate_stats' => $certificateStats,
            'status_breakdown' => $statusBreakdown,
            'avg_processing_time' => round($avgProcessingTime ?? 0, 1),
            'recent_activity' => $recentActivity,
            'project_types' => $projectTypes,
            'top_users' => $topUsers,
            'weekly_activity' => $weeklyActivity,
        ];
    }

    /**
     * Display all applications for admin to review
     */
    public function applications(Request $request): Response
    {
        $perPage = $request->input('per_page', 15);
        
        // Get all requests with their related data
        $requests = RequestModel::with('user')->orderBy('created_at', 'desc')->paginate($perPage);
        
        // Get applications and reports data
        $applicationsData = Application::with('report')->get()->keyBy(function($app) {
            return $app->applicant_name . '|' . $app->applicant_address;
        });
        
        // Merge the data
        $applications = $requests->map(function($request) use ($applicationsData) {
            $key = $request->applicant_name . '|' . $request->applicant_address;
            $application = $applicationsData->get($key);
            $report = $application?->report;
            
            return (object)[
                'id' => $request->id,
                'applicant_name' => $request->applicant_name,
                'corporation_name' => $request->corporation_name,
                'applicant_address' => $request->applicant_address,
                'project_type' => $request->project_type,
                'project_nature' => $request->project_nature,
                'project_location_street' => $request->project_location_street,
                'project_location_barangay' => $request->project_location_barangay,
                'project_location_city' => $request->project_location_city,
                'project_location_municipality' => $request->project_location_municipality,
                'project_location_province' => $request->project_location_province,
                'lot_area_sqm' => $request->lot_area_sqm,
                'project_cost' => $request->project_cost,
                'created_at' => $request->created_at,
                'updated_at' => $request->updated_at,
                'application_id' => $application?->id,
                'report_id' => $report?->getKey(),
                'evaluation' => $report?->evaluation,
                'report_description' => $report?->description,
                'report_amount' => $report?->amount,
                'date_certified' => $report?->date_certified,
                'date_reported' => $report?->date_reported,
                'issued_by' => $report?->issued_by,
                'user_name' => $request->user?->name,
                'user_email' => $request->user?->email,
                'status' => $report?->evaluation ?? $request->status,
            ];
        });

        return Inertia::render('Admin/Applications', [
            'applications' => $applications,
        ]);
    }

    /**
     * Display all requests for admin
     */
    public function requests(Request $request): Response
    {
        $perPage = $request->input('per_page', 15);
        
        // Get all requests with their related data
        $requestsData = RequestModel::with('user')->orderBy('created_at', 'desc')->paginate($perPage);
        
        // Get applications and reports data
        $applicationsData = Application::with('report')->get()->keyBy(function($app) {
            return $app->applicant_name . '|' . $app->applicant_address;
        });
        
        // Merge the data
        $requests = $requestsData->through(function($request) use ($applicationsData) {
            $key = $request->applicant_name . '|' . $request->applicant_address;
            $application = $applicationsData->get($key);
            $report = $application?->report;
            
            // Convert to array and add additional fields
            $requestArray = $request->toArray();
            $requestArray['application_id'] = $application?->id;
            $requestArray['authorization_letter_path'] = $application?->authorization_letter_path;
            $requestArray['report_id'] = $report?->getKey();
            $requestArray['evaluation'] = $report?->evaluation;
            $requestArray['user_name'] = $request->user?->name;
            $requestArray['user_email'] = $request->user?->email;
            $requestArray['status'] = $report?->evaluation ?? $request->status;
            
            return $requestArray;
        });

        return Inertia::render('Admin/Request', [
            'requests' => $requests,
        ]);
    }

    /**
     * Delete a request
     */
    public function deleteRequest($requestId)
    {
        $request = RequestModel::findOrFail($requestId);
        $request->delete();

        return back()->with('success', 'Request deleted successfully!');
    }

    /**
     * Update report evaluation
     */
    public function updateEvaluation(Request $request, $reportId)
    {
        \Log::info('updateEvaluation called with reportId: ' . $reportId);
        \Log::info('Request data: ' . json_encode($request->all()));
        
        $validated = $request->validate([
            'evaluation' => 'required|in:pending,approved,rejected',
            'description' => 'nullable|string',
            'amount' => 'nullable|numeric',
            'date_certified' => 'nullable|date',
            'issued_by' => 'nullable|string|max:255',
        ]);

        $report = Report::findOrFail($reportId);
        $oldEvaluation = $report->evaluation;
        
        $report->update([
            'evaluation' => $validated['evaluation'],
            'description' => $validated['description'] ?? $report->description,
            'amount' => $validated['amount'] ?? $report->amount,
            'date_certified' => $validated['date_certified'] ?? $report->date_certified,
            'date_reported' => now(),
            'issued_by' => $validated['issues_by'] ?? $report->issued_by,
        ]);

        // Send email notification if status changed
        if ($validated['evaluation'] !== $oldEvaluation) {
            try {
                // Get the application and request details
                $application = Application::find($report->app_id);
                \Log::info('Application found: ' . ($application ? 'Yes - ID: ' . $application->id : 'No'));
                
                if ($application) {
                    \Log::info('Looking for request with applicant_name: ' . $application->applicant_name . ' and applicant_address: ' . $application->applicant_address);
                    
                    // Find the request associated with this application
                    $requestModel = RequestModel::where('applicant_name', $application->applicant_name)
                        ->where('applicant_address', $application->applicant_address)
                        ->first();
                    
                    \Log::info('Request found: ' . ($requestModel ? 'Yes - ID: ' . $requestModel->id . ', User ID: ' . $requestModel->user_id : 'No'));
                    
                    if ($requestModel && $requestModel->user_id) {
                        $user = \App\Models\User::find($requestModel->user_id);
                        \Log::info('User found: ' . ($user ? 'Yes - Email: ' . $user->email : 'No'));
                        
                        if ($user) {
                            if ($validated['evaluation'] === 'approved') {
                                \Mail::to($user->email)->send(
                                    new \App\Mail\ApplicationApproved(
                                        $application,
                                        $application->applicant_name,
                                        $requestModel->id
                                    )
                                );
                                \Log::info('Application approval email sent to: ' . $user->email . ' for request ID: ' . $requestModel->id);
                            } elseif ($validated['evaluation'] === 'rejected') {
                                // Send rejection email immediately (not queued)
                                \Mail::to($user->email)->send(
                                    new ApplicationRejected(
                                        $application,
                                        $application->applicant_name,
                                        $requestModel->id,
                                        $validated['description'] ?? 'Your application has been rejected. Please review and resubmit with the necessary corrections.'
                                    )
                                );
                                
                                // Log the email sending for debugging
                                \Log::info('Application rejection email sent to: ' . $user->email . ' for request ID: ' . $requestModel->id);
                            }
                        } else {
                            \Log::warning('User not found for user_id: ' . $requestModel->user_id);
                        }
                    } else {
                        \Log::warning('Request not found or missing user_id for application: ' . $application->applicant_name);
                    }
                } else {
                    \Log::warning('Application not found for report app_id: ' . $report->app_id);
                }
            } catch (\Exception $e) {
                // Log the error but don't fail the request
                \Log::error('Failed to send status change email: ' . $e->getMessage());
            }
        }

        return back()->with('success', 'Application evaluation updated successfully!');
    }

    /**
     * Display all users with user_type 'applicant'
     */
    public function users(Request $request): Response
    {
        $perPage = $request->input('per_page', 15);
        
        $users = \App\Models\User::where('user_type', 'applicant')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return Inertia::render('Admin/Users', [
            'users' => $users,
        ]);
    }

    /**
     * Update user information
     */
    public function updateUser(Request $request, $userId)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $userId . ',id',
            'contact_number' => 'nullable|string|max:20',
            'address' => 'nullable|string',
        ]);

        $user = \App\Models\User::findOrFail($userId);
        $user->update($validated);

        return back()->with('success', 'User updated successfully!');
    }

    /**
     * Delete a user
     */
    public function deleteUser($userId)
    {
        $user = \App\Models\User::findOrFail($userId);
        $user->delete();

        return back()->with('success', 'User deleted successfully!');
    }

    /**
     * Display all payments for verification
     */
    public function payments(Request $request): Response
    {
        $perPage = $request->input('per_page', 15);
        
        $payments = \App\Models\Payment::with(['request', 'application', 'verifier'])
            ->orderBy('created_at', 'desc')
            ->paginate($perPage)
            ->through(function($payment) {
                $request = $payment->request;
                return [
                    'id' => $payment->id,
                    'request_id' => $payment->request_id,
                    'applicant_name' => $request->applicant_name,
                    'applicant_email' => $request->user?->email,
                    'amount' => $payment->amount,
                    'payment_method' => $payment->payment_method,
                    'receipt_number' => $payment->receipt_number,
                    'receipt_file_path' => $payment->receipt_file_path,
                    'payment_date' => $payment->payment_date,
                    'payment_status' => $payment->payment_status,
                    'verified_by_name' => $payment->verifier?->name,
                    'verified_at' => $payment->verified_at,
                    'rejection_reason' => $payment->rejection_reason,
                    'notes' => $payment->notes,
                    'created_at' => $payment->created_at,
                ];
            });

        return Inertia::render('Admin/Payments', [
            'payments' => $payments,
        ]);
    }
    
    /**
     * Export payments to CSV
     */
    public function exportPayments(Request $request)
    {
        $status = $request->input('status', 'all');
        
        $query = \App\Models\Payment::with(['request.user', 'verifier']);
        
        if ($status !== 'all') {
            $query->where('payment_status', $status);
        }
        
        $payments = $query->orderBy('created_at', 'desc')->get();
        
        $filename = 'payments_export_' . now()->format('Y-m-d_His') . '.csv';
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"$filename\"",
        ];
        
        $callback = function() use ($payments) {
            $file = fopen('php://output', 'w');
            
            // Headers
            fputcsv($file, [
                'Payment ID',
                'Applicant Name',
                'Email Address',
                'Request ID',
                'Payment Method',
                'Receipt Number',
                'Payment Date',
                'Payment Status',
                'Current Status',
                'Total Amount',
                'Processing Fee',
                'Submission Date',
                'Verified By',
                'Verification Date',
                'Receipt Document',
                'Rejection Reason',
                'Notes'
            ]);
            
            // Data
            foreach ($payments as $payment) {
                $subtotal = $payment->amount ?? 0;
                $processingFee = 0; // Assuming no processing fee for now
                $totalAmount = $subtotal + $processingFee;
                
                fputcsv($file, [
                    $payment->id,
                    $payment->request?->applicant_name ?? '',
                    $payment->request?->user?->email ?? '',
                    '#' . $payment->request_id,
                    ucfirst($payment->payment_method ?? 'cash'),
                    $payment->receipt_number ?? 'N/A',
                    $payment->payment_date ? \Carbon\Carbon::parse($payment->payment_date)->format('M j, Y') : '',
                    ucfirst($payment->payment_status ?? 'pending'),
                    ucfirst($payment->payment_status ?? 'pending'),
                    $totalAmount ? 'PHP ' . number_format($totalAmount, 2) : '',
                    'PHP ' . number_format($processingFee, 2),
                    $payment->created_at ? $payment->created_at->format('M j, Y') : '',
                    $payment->verifier?->name ?? '',
                    $payment->verified_at ? \Carbon\Carbon::parse($payment->verified_at)->format('M j, Y') : '',
                    $payment->receipt_file_path ? 'View Receipt Document' : 'No Receipt',
                    $payment->rejection_reason ?? '',
                    $payment->notes ?? '',
                ]);
            }
            
            fclose($file);
        };
        
        return response()->stream($callback, 200, $headers);
    }
    
    /**
     * Export applications to CSV
     */
    public function exportApplications(Request $request)
    {
        $status = $request->input('status', 'all');
        
        $requests = RequestModel::with('user')->orderBy('created_at', 'desc')->get();
        $applicationsData = Application::with('report')->get()->keyBy(function($app) {
            return $app->applicant_name . '|' . $app->applicant_address;
        });
        
        $applications = $requests->map(function($request) use ($applicationsData) {
            $key = $request->applicant_name . '|' . $request->applicant_address;
            $application = $applicationsData->get($key);
            $report = $application?->report;
            
            // Build project location
            $projectLocation = collect([
                $request->project_location_street,
                $request->project_location_barangay,
                $request->project_location_city ?? $request->project_location_municipality,
                $request->project_location_province
            ])->filter()->implode(', ');
            
            return (object)[
                'id' => $request->id,
                'full_name' => $request->user?->name,
                'email_address' => $request->user?->email,
                'applicant_name' => $request->applicant_name,
                'corporation_name' => $request->corporation_name,
                'applicant_address' => $request->applicant_address,
                'current_status' => $report?->evaluation ?? $request->status,
                'submission_date' => $request->created_at?->format('M j, Y'),
                'project_type' => $request->project_type,
                'project_nature' => $request->project_nature,
                'project_location' => $projectLocation,
                'project_area' => $request->project_area_sqm,
                'lot_area' => $request->lot_area_sqm,
                'building_area' => $request->bldg_improvement_sqm,
                'project_cost' => $request->project_cost ? '₱' . number_format($request->project_cost, 2) : '',
                'right_over_land' => $request->right_over_land ?? 'Owner',
                'project_duration' => $request->project_nature_duration ?? 'Permanent',
                'existing_land_use' => $request->existing_land_use ?? 'Not Tenanted',
                'written_notice_to_tenants' => $request->has_written_notice ? 'YES' : 'NO',
                'similar_application_filed' => $request->has_similar_application ? 'YES' : 'NO',
                'release_preference' => $request->preferred_release_mode ?? 'mail applicant',
                'authorized_representative' => $application?->authorization_letter_path ? 'Yes' : 'No Authorized Representative',
                'authorization_note' => $application?->authorization_letter_path ? 'Has authorized representative' : 'This application was submitted directly by the applicant',
                'created_at' => $request->created_at,
            ];
        });
        
        if ($status !== 'all') {
            $applications = $applications->filter(function($app) use ($status) {
                return $app->current_status === $status;
            });
        }
        
        $filename = 'applications_export_' . now()->format('Y-m-d_His') . '.csv';
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"$filename\"",
        ];
        
        $callback = function() use ($applications) {
            $file = fopen('php://output', 'w');
            
            // Headers - User Information
            fputcsv($file, [
                'Request ID',
                'Full Name',
                'Email Address',
                'Applicant Name',
                'Corporation Name',
                'Corporation Address',
                'Current Status',
                'Submission Date',
                'Project Type',
                'Project Nature',
                'Project Location',
                'Project Area (sqm)',
                'Lot Area (sqm)',
                'Building Area (sqm)',
                'Project Cost',
                'Right Over Land',
                'Project Duration',
                'Existing Land Use',
                'Written Notice to Tenants',
                'Similar Application Filed',
                'Release Preference',
                'Authorized Representative',
                'Authorization Note'
            ]);
            
            // Data
            foreach ($applications as $app) {
                fputcsv($file, [
                    $app->id,
                    $app->full_name ?? '',
                    $app->email_address ?? '',
                    $app->applicant_name ?? '',
                    $app->corporation_name ?? '',
                    $app->applicant_address ?? '',
                    ucfirst($app->current_status ?? 'Pending'),
                    $app->submission_date ?? '',
                    $app->project_type ?? '',
                    $app->project_nature ?? '',
                    $app->project_location ?? '',
                    $app->project_area ?? '',
                    $app->lot_area ?? '',
                    $app->building_area ?? '',
                    $app->project_cost ?? '',
                    $app->right_over_land ?? '',
                    $app->project_duration ?? '',
                    $app->existing_land_use ?? '',
                    $app->written_notice_to_tenants ?? '',
                    $app->similar_application_filed ?? '',
                    $app->release_preference ?? '',
                    $app->authorized_representative ?? '',
                    $app->authorization_note ?? '',
                ]);
            }
            
            fclose($file);
        };
        
        return response()->stream($callback, 200, $headers);
    }

    /**
     * Verify a payment
     */
    public function verifyPayment(Request $request, $paymentId)
    {
        $payment = \App\Models\Payment::findOrFail($paymentId);
        
        $payment->update([
            'payment_status' => 'verified',
            'verified_by' => auth()->id(),
            'verified_at' => now(),
        ]);

        // Update workflow status
        if ($payment->application_id) {
            $report = Report::where('app_id', $payment->application_id)->first();
            if ($report) {
                $report->update(['workflow_status' => 'payment_verified']);
            }
        }

        // Log status change
        \App\Models\StatusHistory::logChange(
            $payment->request_id,
            'payment',
            'pending',
            'verified',
            auth()->id(),
            'Payment verified by admin'
        );

        // Generate certificate automatically
        try {
            \Log::info('Starting certificate generation for payment: ' . $payment->id);
            $this->generateCertificate($payment);
            \Log::info('Certificate generation completed for payment: ' . $payment->id);
        } catch (\Exception $e) {
            \Log::error('Failed to generate certificate: ' . $e->getMessage(), [
                'payment_id' => $payment->id,
                'trace' => $e->getTraceAsString()
            ]);
        }

        return back()->with('success', 'Payment verified and certificate generated successfully!');
    }

    /**
     * Generate certificate PDF
     */
    private function generateCertificate($payment)
    {
        \Log::info('generateCertificate called', ['payment_id' => $payment->id]);
        
        $requestModel = RequestModel::find($payment->request_id);
        $application = Application::find($payment->application_id);
        
        \Log::info('Found models', [
            'request_model' => $requestModel ? $requestModel->id : 'null',
            'application' => $application ? $application->id : 'null'
        ]);
        
        if (!$requestModel || !$application) {
            \Log::error('Missing required models for certificate generation', [
                'payment_id' => $payment->id,
                'request_id' => $payment->request_id,
                'application_id' => $payment->application_id
            ]);
            return;
        }

        // Generate certificate number
        $certificateNumber = \App\Models\Certificate::generateCertificateNumber();

        // Prepare certificate data
        $projectLocation = collect([
            $requestModel->project_location_street,
            $requestModel->project_location_barangay,
            $requestModel->project_location_city ?? $requestModel->project_location_municipality,
            $requestModel->project_location_province
        ])->filter()->implode(', ');

        $data = [
            'certificateNumber' => $certificateNumber,
            'applicantName' => $requestModel->applicant_name,
            'projectLocation' => $projectLocation ?: 'N/A',
            'projectType' => $requestModel->project_type ?? 'N/A',
            'projectNature' => $requestModel->project_nature ?? 'N/A',
            'lotArea' => $requestModel->lot_area_sqm ? number_format($requestModel->lot_area_sqm, 2) : 'N/A',
            'projectCost' => $requestModel->project_cost,
            'issuedDate' => now()->format('F d, Y'),
            'validUntil' => now()->addYears(5)->format('F d, Y'),
            'issuedBy' => auth()->user()->name,
        ];

        \Log::info('Generating PDF with data', ['certificate_number' => $certificateNumber]);
        
        // Generate PDF
        try {
            $pdf = Pdf::loadView('certificates.professional-template', $data);
            \Log::info('PDF generated successfully');
        } catch (\Exception $e) {
            \Log::error('PDF generation failed: ' . $e->getMessage());
            throw $e;
        }
        
        // Save PDF
        $filename = 'certificates/' . $certificateNumber . '.pdf';
        try {
            \Storage::disk('public')->put($filename, $pdf->output());
            \Log::info('PDF saved successfully', ['filename' => $filename]);
        } catch (\Exception $e) {
            \Log::error('PDF save failed: ' . $e->getMessage());
            throw $e;
        }

        // Create certificate record
        $certificate = \App\Models\Certificate::create([
            'request_id' => $payment->request_id,
            'application_id' => $payment->application_id,
            'payment_id' => $payment->id,
            'certificate_number' => $certificateNumber,
            'certificate_file_path' => $filename,
            'issued_by' => auth()->id(),
            'issued_at' => now(),
            'valid_until' => now()->addYears(5),
            'status' => 'generated',
        ]);

        // Update workflow status
        if ($payment->application_id) {
            $report = Report::where('app_id', $payment->application_id)->first();
            if ($report) {
                $report->update(['workflow_status' => 'certificate_issued']);
            }
        }

        // Log status change
        \App\Models\StatusHistory::logChange(
            $payment->request_id,
            'certificate',
            null,
            'generated',
            auth()->id(),
            'Certificate generated: ' . $certificateNumber
        );

        // Send email with certificate
        try {
            $user = \App\Models\User::find($requestModel->user_id);
            if ($user) {
                \Mail::to($user->email)->send(
                    new \App\Mail\CertificateIssued(
                        $certificate,
                        $requestModel->applicant_name,
                        $certificateNumber
                    )
                );
                
                // Update certificate status to sent
                $certificate->update(['status' => 'sent']);
            }
        } catch (\Exception $e) {
            \Log::error('Failed to send certificate email: ' . $e->getMessage());
        }
    }

    /**
     * Reject a payment
     */
    public function rejectPayment(Request $request, $paymentId)
    {
        $validated = $request->validate([
            'rejection_reason' => 'required|string',
        ]);

        $payment = \App\Models\Payment::findOrFail($paymentId);
        
        $payment->update([
            'payment_status' => 'rejected',
            'verified_by' => auth()->id(),
            'verified_at' => now(),
            'rejection_reason' => $validated['rejection_reason'],
        ]);

        // Log status change
        \App\Models\StatusHistory::logChange(
            $payment->request_id,
            'payment',
            'pending',
            'rejected',
            auth()->id(),
            'Payment rejected: ' . $validated['rejection_reason']
        );

        // Send rejection email to applicant
        try {
            $requestModel = RequestModel::find($payment->request_id);
            if ($requestModel && $requestModel->user_id) {
                $user = \App\Models\User::find($requestModel->user_id);
                if ($user) {
                    // Send payment rejection email immediately (not queued)
                    \Mail::to($user->email)->send(
                        new PaymentRejected(
                            $payment,
                            $requestModel->applicant_name,
                            $requestModel->id,
                            $validated['rejection_reason']
                        )
                    );
                    
                    // Log the email sending for debugging
                    \Log::info('Payment rejection email sent to: ' . $user->email . ' for payment ID: ' . $payment->id);
                }
            }
        } catch (\Exception $e) {
            // Log the error but don't fail the request
            \Log::error('Failed to send payment rejection email: ' . $e->getMessage());
        }

        return back()->with('success', 'Payment rejected and notification sent to applicant.');
    }
    
    /**
     * Export requests to CSV
     */
    public function exportRequests(Request $request)
    {
        $status = $request->input('status', 'all');
        
        $requestsData = RequestModel::with('user')->orderBy('created_at', 'desc')->get();
        $applicationsData = Application::with('report')->get()->keyBy(function($app) {
            return $app->applicant_name . '|' . $app->applicant_address;
        });
        
        $requests = $requestsData->map(function($request) use ($applicationsData) {
            $key = $request->applicant_name . '|' . $request->applicant_address;
            $application = $applicationsData->get($key);
            $report = $application?->report;
            
            return (object)[
                'id' => $request->id,
                'applicant_name' => $request->applicant_name,
                'corporation_name' => $request->corporation_name,
                'applicant_address' => $request->applicant_address,
                'project_type' => $request->project_type,
                'project_nature' => $request->project_nature,
                'project_location_street' => $request->project_location_street,
                'project_location_barangay' => $request->project_location_barangay,
                'project_location_city' => $request->project_location_city,
                'project_location_municipality' => $request->project_location_municipality,
                'project_location_province' => $request->project_location_province,
                'lot_area_sqm' => $request->lot_area_sqm,
                'project_cost' => $request->project_cost,
                'user_name' => $request->user?->name,
                'user_email' => $request->user?->email,
                'status' => $report?->evaluation ?? $request->status,
                'authorization_letter_path' => $application?->authorization_letter_path,
                'created_at' => $request->created_at,
            ];
        });
        
        if ($status !== 'all') {
            $requests = $requests->filter(function($req) use ($status) {
                return $req->status === $status;
            });
        }
        
        $filename = 'requests_export_' . now()->format('Y-m-d_His') . '.csv';
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"$filename\"",
        ];
        
        $callback = function() use ($requests) {
            $file = fopen('php://output', 'w');
            
            // Headers
            fputcsv($file, [
                'ID',
                'Applicant Name',
                'Corporation',
                'Address',
                'Project Type',
                'Project Nature',
                'Location Street',
                'Location Barangay',
                'Location City',
                'Location Municipality',
                'Location Province',
                'Lot Area (sqm)',
                'Project Cost',
                'User Name',
                'User Email',
                'Status',
                'Has Authorization Letter',
                'Submitted At'
            ]);
            
            // Data
            foreach ($requests as $req) {
                fputcsv($file, [
                    $req->id,
                    $req->applicant_name,
                    $req->corporation_name ?? '',
                    $req->applicant_address,
                    $req->project_type ?? '',
                    $req->project_nature ?? '',
                    $req->project_location_street ?? '',
                    $req->project_location_barangay ?? '',
                    $req->project_location_city ?? '',
                    $req->project_location_municipality ?? '',
                    $req->project_location_province ?? '',
                    $req->lot_area_sqm ?? '',
                    $req->project_cost ?? '',
                    $req->user_name,
                    $req->user_email,
                    $req->status,
                    $req->authorization_letter_path ? 'Yes' : 'No',
                    $req->created_at,
                ]);
            }
            
            fclose($file);
        };
        
        return response()->stream($callback, 200, $headers);
    }

    /**
     * Export users to CSV
     */
    public function exportUsers(Request $request)
    {
        $userType = $request->input('user_type', 'all');
        
        $query = \App\Models\User::query();
        
        if ($userType !== 'all') {
            $query->where('user_type', $userType);
        }
        
        $users = $query->orderBy('created_at', 'desc')->get();
        
        $filename = 'users_export_' . now()->format('Y-m-d_His') . '.csv';
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"$filename\"",
        ];
        
        $callback = function() use ($users) {
            $file = fopen('php://output', 'w');
            
            // Headers
            fputcsv($file, [
                'User ID',
                'Full Name',
                'Email Address',
                'Contact Number',
                'Address',
                'User Type',
                'Email Verified',
                'Registration Date'
            ]);
            
            // Data
            foreach ($users as $user) {
                fputcsv($file, [
                    $user->id,
                    $user->name ?? '',
                    $user->email ?? '',
                    $user->contact_number ?? '',
                    $user->address ?? '',
                    ucfirst($user->user_type ?? 'applicant'),
                    $user->email_verified_at ? 'Yes' : 'No',
                    $user->created_at ? $user->created_at->format('M j, Y') : '',
                ]);
            }
            
            fclose($file);
        };
        
        return response()->stream($callback, 200, $headers);
    }

    /**
     * Get detailed evaluation distribution data
     */
    private function getEvaluationDistribution()
    {
        // Use the same logic as the main stats calculation
        $allRequests = RequestModel::with('user')->get();
        $applicationsData = Application::with('report')->get()->keyBy(function($app) {
            return $app->applicant_name . '|' . $app->applicant_address;
        });

        $statusCounts = ['pending' => 0, 'approved' => 0, 'rejected' => 0];
        $requestsWithoutReports = 0;
        $requestsWithReports = 0;
        
        foreach ($allRequests as $request) {
            $key = $request->applicant_name . '|' . $request->applicant_address;
            $application = $applicationsData->get($key);
            $report = $application?->report;
            
            // Use report evaluation if available, otherwise use request status
            $status = $report?->evaluation ?? $request->status;
            
            if (isset($statusCounts[$status])) {
                $statusCounts[$status]++;
            }
            
            // Track if request has report or not
            if ($report) {
                $requestsWithReports++;
            } else {
                $requestsWithoutReports++;
            }
        }

        $total = array_sum($statusCounts);

        return [
            'pending' => $statusCounts['pending'],
            'approved' => $statusCounts['approved'],
            'rejected' => $statusCounts['rejected'],
            'total' => $total,
            'percentages' => [
                'pending' => $total > 0 ? round(($statusCounts['pending'] / $total) * 100, 1) : 0,
                'approved' => $total > 0 ? round(($statusCounts['approved'] / $total) * 100, 1) : 0,
                'rejected' => $total > 0 ? round(($statusCounts['rejected'] / $total) * 100, 1) : 0,
            ],
            'raw_data' => [
                'requests_with_reports' => $requestsWithReports,
                'requests_without_reports' => $requestsWithoutReports,
                'status_breakdown' => $statusCounts,
            ]
        ];
    }

    /**
     * Bulk approve requests
     */
    public function bulkApprove(Request $request)
    {
        $request->validate([
            'request_ids' => 'required|array',
            'request_ids.*' => 'integer|exists:requests,id'
        ]);

        $successCount = 0;
        $errors = [];

        foreach ($request->request_ids as $requestId) {
            try {
                $requestModel = RequestModel::findOrFail($requestId);
                
                // Find the application and report
                $application = Application::where('applicant_name', $requestModel->applicant_name)
                    ->where('applicant_address', $requestModel->applicant_address)
                    ->first();

                if (!$application || !$application->report) {
                    $errors[] = "No report found for request #{$requestId}";
                    continue;
                }

                $report = $application->report;
                $report->evaluation = 'approved';
                $report->issued_by = auth()->user()->name ?? 'Admin';
                $report->date_reported = now();
                $report->save();

                // Send approval email
                try {
                    \Mail::to($requestModel->user->email)->send(new \App\Mail\ApplicationApproved(
                        $application,
                        $requestModel->applicant_name,
                        $requestModel->id
                    ));
                } catch (\Exception $e) {
                    \Log::error("Failed to send approval email for request {$requestId}: " . $e->getMessage());
                }

                $successCount++;
            } catch (\Exception $e) {
                $errors[] = "Failed to approve request #{$requestId}: " . $e->getMessage();
            }
        }

        $flashData = ['success' => "Successfully approved {$successCount} request(s)."];
        
        if (!empty($errors)) {
            $flashData['error'] = 'Some requests failed: ' . implode(', ', $errors);
        }
        
        return redirect()->back()->with($flashData);
    }

    /**
     * Bulk reject requests
     */
    public function bulkReject(Request $request)
    {
        $request->validate([
            'request_ids' => 'required|array',
            'request_ids.*' => 'integer|exists:requests,id',
            'reason' => 'required|string|max:1000'
        ]);

        $successCount = 0;
        $errors = [];

        foreach ($request->request_ids as $requestId) {
            try {
                $requestModel = RequestModel::findOrFail($requestId);
                
                // Find the application and report
                $application = Application::where('applicant_name', $requestModel->applicant_name)
                    ->where('applicant_address', $requestModel->applicant_address)
                    ->first();

                if (!$application || !$application->report) {
                    $errors[] = "No report found for request #{$requestId}";
                    continue;
                }

                $report = $application->report;
                $report->evaluation = 'rejected';
                $report->description = $request->reason;
                $report->issued_by = auth()->user()->name ?? 'Admin';
                $report->date_reported = now();
                $report->save();

                // Send rejection email
                try {
                    \Mail::to($requestModel->user->email)->send(new ApplicationRejected(
                        $application,
                        $requestModel->applicant_name,
                        $requestModel->id,
                        $request->reason
                    ));
                } catch (\Exception $e) {
                    \Log::error("Failed to send rejection email for request {$requestId}: " . $e->getMessage());
                }

                $successCount++;
            } catch (\Exception $e) {
                $errors[] = "Failed to reject request #{$requestId}: " . $e->getMessage();
            }
        }

        $flashData = ['success' => "Successfully rejected {$successCount} request(s)."];
        
        if (!empty($errors)) {
            $flashData['error'] = 'Some requests failed: ' . implode(', ', $errors);
        }
        
        return redirect()->back()->with($flashData);
    }

    /**
     * Bulk delete requests
     */
    public function bulkDelete(Request $request)
    {
        $request->validate([
            'request_ids' => 'required|array',
            'request_ids.*' => 'integer|exists:requests,id'
        ]);

        $successCount = 0;
        $errors = [];

        foreach ($request->request_ids as $requestId) {
            try {
                $requestModel = RequestModel::findOrFail($requestId);
                
                // Find and delete related application and report
                $application = Application::where('applicant_name', $requestModel->applicant_name)
                    ->where('applicant_address', $requestModel->applicant_address)
                    ->first();

                if ($application) {
                    if ($application->report) {
                        $application->report->delete();
                    }
                    $application->delete();
                }

                $requestModel->delete();
                $successCount++;
            } catch (\Exception $e) {
                $errors[] = "Failed to delete request #{$requestId}: " . $e->getMessage();
            }
        }

        $flashData = ['success' => "Successfully deleted {$successCount} request(s)."];
        
        if (!empty($errors)) {
            $flashData['error'] = 'Some requests failed: ' . implode(', ', $errors);
        }
        
        return redirect()->back()->with($flashData);
    }
}
