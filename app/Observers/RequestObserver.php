<?php

namespace App\Observers;

use App\Models\Request;
use App\Services\DashboardCacheService;
use App\Services\AuditLogService;

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
