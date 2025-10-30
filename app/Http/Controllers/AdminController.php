<?php

namespace App\Http\Controllers;

use App\Models\Application;
use App\Models\Report;
use App\Models\Request as RequestModel;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    // Middleware is applied in routes/web.php

    /**
     * Display admin dashboard with all applications
     */
    public function dashboard(): Response
    {
        // Get all requests with their related data
        $requests = RequestModel::with('user')->orderBy('created_at', 'desc')->get();
        
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
                'report_id' => $report?->report_id,
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

        $stats = [
            'total' => $applications->count(),
            'pending' => $applications->where('status', 'pending')->count(),
            'approved' => $applications->where('status', 'approved')->count(),
            'rejected' => $applications->where('status', 'rejected')->count(),
        ];

        return Inertia::render('Admin/Dashboard', [
            'applications' => $applications,
            'stats' => $stats,
        ]);
    }

    /**
     * Display all applications for admin to review
     */
    public function applications(): Response
    {
        // Get all requests with their related data
        $requests = RequestModel::with('user')->orderBy('created_at', 'desc')->get();
        
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
                'report_id' => $report?->report_id,
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
    public function requests(): Response
    {
        // Get all requests with their related data
        $requestsData = RequestModel::with('user')->orderBy('created_at', 'desc')->get();
        
        // Get applications and reports data
        $applicationsData = Application::with('report')->get()->keyBy(function($app) {
            return $app->applicant_name . '|' . $app->applicant_address;
        });
        
        // Merge the data
        $requests = $requestsData->map(function($request) use ($applicationsData) {
            $key = $request->applicant_name . '|' . $request->applicant_address;
            $application = $applicationsData->get($key);
            $report = $application?->report;
            
            // Convert to array and add additional fields
            $requestArray = $request->toArray();
            $requestArray['application_id'] = $application?->id;
            $requestArray['authorization_letter_path'] = $application?->authorization_letter_path;
            $requestArray['report_id'] = $report?->report_id;
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

        // Send email notification if status changed to approved
        if ($validated['evaluation'] === 'approved' && $oldEvaluation !== 'approved') {
            try {
                // Get the application and request details
                $application = Application::find($report->app_id);
                if ($application) {
                    // Find the request associated with this application
                    $requestModel = RequestModel::where('applicant_name', $application->applicant_name)
                        ->where('applicant_address', $application->applicant_address)
                        ->first();
                    
                    if ($requestModel && $requestModel->user_id) {
                        $user = \App\Models\User::find($requestModel->user_id);
                        if ($user) {
                            \Mail::to($user->email)->send(
                                new \App\Mail\ApplicationApproved(
                                    $application,
                                    $application->applicant_name,
                                    $requestModel->id
                                )
                            );
                        }
                    }
                }
            } catch (\Exception $e) {
                // Log the error but don't fail the request
                \Log::error('Failed to send approval email: ' . $e->getMessage());
            }
        }

        return back()->with('success', 'Application evaluation updated successfully!');
    }

    /**
     * Display all users with user_type 'applicant'
     */
    public function users(): Response
    {
        $users = \App\Models\User::where('user_type', 'applicant')
            ->orderBy('created_at', 'desc')
            ->get();

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
    public function payments(): Response
    {
        $payments = \App\Models\Payment::with(['request', 'application', 'verifier'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function($payment) {
                $request = $payment->request;
                return [
                    'id' => $payment->id,
                    'request_id' => $payment->request_id,
                    'applicant_name' => $request->applicant_name,
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
            $this->generateCertificate($payment);
        } catch (\Exception $e) {
            \Log::error('Failed to generate certificate: ' . $e->getMessage());
        }

        return back()->with('success', 'Payment verified and certificate generated successfully!');
    }

    /**
     * Generate certificate PDF
     */
    private function generateCertificate($payment)
    {
        $requestModel = RequestModel::find($payment->request_id);
        $application = Application::find($payment->application_id);
        
        if (!$requestModel || !$application) {
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

        // Generate PDF
        $pdf = \PDF::loadView('certificates.template', $data);
        
        // Save PDF
        $filename = 'certificates/' . $certificateNumber . '.pdf';
        \Storage::disk('public')->put($filename, $pdf->output());

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

        return back()->with('success', 'Payment rejected.');
    }
}
