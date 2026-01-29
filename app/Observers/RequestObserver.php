<?php

namespace App\Observers;

use App\Models\Request;
use App\Services\DashboardCacheService;
use App\Services\AuditLogService;
use App\Mail\ApplicationSubmitted;
use Illuminate\Support\Facades\Mail;

class RequestObserver
{
    protected $cacheService;

    public function __construct(DashboardCacheService $cacheService)
    {
        $this->cacheService = $cacheService;
    }

    /**
     * Handle the Request "created" event.
     */
    public function created(Request $request): void
    {
        $this->cacheService->clearCache();
        
        AuditLogService::logCreate(
            'Request',
            $request->id,
            $request->toArray(),
            "Created new request for {$request->applicant_name}"
        );
        
        // Send email notification to the user
        if ($request->user && $request->user->email) {
            try {
                Mail::to($request->user->email)->send(
                    new ApplicationSubmitted(
                        (object)[
                            'id' => $request->id,
                            'applicant_name' => $request->applicant_name,
                            'applicant_address' => $request->applicant_address,
                            'project_type' => $request->project_type,
                            'project_nature' => $request->project_nature,
                        ],
                        $request->user->name
                    )
                );
                \Log::info('Application submitted email sent to: ' . $request->user->email . ' for request ID: ' . $request->id);
            } catch (\Exception $e) {
                \Log::error('Failed to send application submitted email: ' . $e->getMessage());
            }
        }
    }

    /**
     * Handle the Request "updated" event.
     */
    public function updated(Request $request): void
    {
        $this->cacheService->clearCache();
        
        AuditLogService::logUpdate(
            'Request',
            $request->id,
            $request->getOriginal(),
            $request->getChanges(),
            "Updated request for {$request->applicant_name}"
        );
    }

    /**
     * Handle the Request "deleted" event.
     */
    public function deleted(Request $request): void
    {
        $this->cacheService->clearCache();
        
        AuditLogService::logDelete(
            'Request',
            $request->id,
            $request->toArray(),
            "Deleted request for {$request->applicant_name}"
        );
    }
}
