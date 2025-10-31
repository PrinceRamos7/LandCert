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
        // Get approved requests for the current user
        $requests = RequestModel::where('user_id', auth()->id())
            ->leftJoin('applications', function($join) {
                $join->on('requests.applicant_name', '=', 'applications.applicant_name')
                     ->on('requests.applicant_address', '=', 'applications.applicant_address');
            })
            ->leftJoin('reports', 'applications.id', '=', 'reports.app_id')
            ->leftJoin('payments', 'requests.id', '=', 'payments.request_id')
            ->leftJoin('certificates', 'requests.id', '=', 'certificates.request_id')
            ->select(
                'requests.*',
                'applications.id as application_id',
                'reports.evaluation',
                'reports.workflow_status',
                'payments.id as payment_id',
                'payments.payment_status',
                'payments.receipt_file_path',
                'payments.amount as payment_amount',
                'payments.payment_date',
                'payments.rejection_reason',
                'certificates.id as certificate_id',
                'certificates.certificate_number',
                'certificates.certificate_file_path',
                'certificates.status as certificate_status',
                'certificates.issued_at'
            )
            ->where('reports.evaluation', 'approved')
            ->distinct()
            ->orderBy('requests.created_at', 'desc')
            ->get();

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

        // Update status to collected if not already
        if ($certificate->status !== 'collected') {
            $certificate->update(['status' => 'collected']);
            
            \App\Models\StatusHistory::logChange(
                $certificate->request_id,
                'certificate',
                $certificate->status,
                'collected',
                auth()->id(),
                'Certificate downloaded by applicant'
            );
        }

        $filePath = storage_path('app/public/' . $certificate->certificate_file_path);
        
        if (!file_exists($filePath)) {
            abort(404, 'Certificate file not found');
        }

        return response()->download($filePath, 'Certificate-' . $certificate->certificate_number . '.pdf');
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
