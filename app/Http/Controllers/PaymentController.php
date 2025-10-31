<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Request as RequestModel;
use App\Models\Application;
use App\Models\Report;
use App\Models\StatusHistory;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PaymentController extends Controller
{
    /**
     * Display payment page for applicant
     */
    public function index(): Response
    {
        // Get approved requests for the current user with proper relationships
        $requests = RequestModel::where('user_id', auth()->id())
            ->with(['payments' => function($query) {
                $query->with('certificate');
            }])
            ->leftJoin('applications', function($join) {
                $join->on('requests.applicant_name', '=', 'applications.applicant_name')
                     ->on('requests.applicant_address', '=', 'applications.applicant_address');
            })
            ->leftJoin('reports', 'applications.id', '=', 'reports.app_id')
            ->select(
                'requests.*',
                'applications.id as application_id',
                'reports.evaluation',
                'reports.workflow_status'
            )
            ->where('reports.evaluation', 'approved')
            ->distinct()
            ->orderBy('requests.created_at', 'desc')
            ->get()
            ->map(function($request) {
                // Get the most recent payment for this request
                $payment = $request->payments->sortByDesc('created_at')->first();
                
                if ($payment) {
                    $request->payment_id = $payment->id;
                    $request->payment_status = $payment->payment_status;
                    $request->receipt_file_path = $payment->receipt_file_path;
                    $request->payment_amount = $payment->amount;
                    $request->payment_date = $payment->payment_date;
                    $request->rejection_reason = $payment->rejection_reason;
                    
                    // Add certificate information if available
                    if ($payment->certificate) {
                        $request->certificate_id = $payment->certificate->id;
                        $request->certificate_number = $payment->certificate->certificate_number;
                        $request->certificate_file_path = $payment->certificate->certificate_file_path;
                        $request->certificate_status = $payment->certificate->status;
                        $request->issued_at = $payment->certificate->issued_at;
                    }
                }
                
                return $request;
            });

        return Inertia::render('Receipt/Receipt', [
            'requests' => $requests
        ]);
    }

    /**
     * Download certificate
     */
    public function downloadCertificate($certificateId)
    {
        $certificate = \App\Models\Certificate::findOrFail($certificateId);
        
        // Verify ownership
        $request = RequestModel::where('id', $certificate->request_id)
            ->where('user_id', auth()->id())
            ->firstOrFail();

        // Log download attempt
        \Log::info('Certificate download attempted', [
            'certificate_id' => $certificate->id,
            'certificate_number' => $certificate->certificate_number,
            'user_id' => auth()->id(),
            'request_id' => $certificate->request_id,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent()
        ]);

        // Update status to collected on first download
        $isFirstDownload = $certificate->status !== 'collected';
        if ($isFirstDownload) {
            $certificate->update(['status' => 'collected']);
            
            \App\Models\StatusHistory::logChange(
                $certificate->request_id,
                'certificate',
                $certificate->status,
                'collected',
                auth()->id(),
                'Certificate downloaded by applicant (first download)'
            );
        } else {
            // Log subsequent downloads
            \App\Models\StatusHistory::logChange(
                $certificate->request_id,
                'certificate',
                'collected',
                'collected',
                auth()->id(),
                'Certificate downloaded by applicant (repeat download)'
            );
        }

        $filePath = storage_path('app/public/' . $certificate->certificate_file_path);
        
        if (!file_exists($filePath)) {
            \Log::error('Certificate file not found', [
                'certificate_id' => $certificate->id,
                'file_path' => $filePath,
                'user_id' => auth()->id()
            ]);
            abort(404, 'Certificate file not found');
        }

        // Ensure proper filename format: Certificate-CERT-YYYY-NNNNN.pdf
        $filename = 'Certificate-' . $certificate->certificate_number . '.pdf';
        
        // Log successful download
        \Log::info('Certificate downloaded successfully', [
            'certificate_id' => $certificate->id,
            'certificate_number' => $certificate->certificate_number,
            'user_id' => auth()->id(),
            'filename' => $filename,
            'is_first_download' => $isFirstDownload
        ]);

        return response()->download($filePath, $filename);
    }

    /**
     * Store payment receipt
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'request_id' => 'required|exists:requests,id',
            'amount' => 'required|numeric|min:0',
            'payment_method' => 'required|in:cash,bank_transfer,gcash,paymaya,check,other',
            'receipt_number' => 'required_unless:payment_method,cash|nullable|string|max:255',
            'receipt_file' => 'required|file|mimes:pdf,jpg,jpeg,png|max:5120',
            'payment_date' => 'required|date',
            'notes' => 'nullable|string',
            'other_method' => 'required_if:payment_method,other|nullable|string|max:255',
        ]);

        // Upload receipt file
        $receiptPath = $request->file('receipt_file')->store('receipts', 'public');

        // Get application_id
        $requestModel = RequestModel::find($validated['request_id']);
        $application = Application::where('applicant_name', $requestModel->applicant_name)
            ->where('applicant_address', $requestModel->applicant_address)
            ->first();

        // Prepare payment method (use other_method if payment_method is 'other')
        $paymentMethod = $validated['payment_method'];
        if ($paymentMethod === 'other' && !empty($validated['other_method'])) {
            $paymentMethod = 'other: ' . $validated['other_method'];
        }

        // Create payment record
        $payment = Payment::create([
            'request_id' => $validated['request_id'],
            'application_id' => $application?->id,
            'amount' => $validated['amount'],
            'payment_method' => $paymentMethod,
            'receipt_number' => $validated['receipt_number'] ?? null,
            'receipt_file_path' => $receiptPath,
            'payment_date' => $validated['payment_date'],
            'payment_status' => 'pending',
            'notes' => $validated['notes'],
        ]);

        // Update workflow status
        if ($application) {
            $report = Report::where('app_id', $application->id)->first();
            if ($report) {
                $report->update(['workflow_status' => 'payment_submitted']);
                
                // Log status change
                StatusHistory::logChange(
                    $validated['request_id'],
                    'payment',
                    null,
                    'pending',
                    auth()->id(),
                    'Payment receipt uploaded'
                );
            }
        }

        // Send email notification to user
        try {
            \Mail::to(auth()->user()->email)->send(
                new \App\Mail\PaymentReceiptSubmitted(
                    $payment,
                    $requestModel->applicant_name,
                    $requestModel->id
                )
            );
        } catch (\Exception $e) {
            // Log the error but don't fail the request
            \Log::error('Failed to send payment receipt email: ' . $e->getMessage());
        }

        return back()->with('success', 'Payment receipt submitted successfully! Please wait for admin verification.');
    }
}
