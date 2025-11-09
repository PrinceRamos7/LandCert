<?php

namespace App\Observers;

use App\Models\Report;
use App\Services\DashboardCacheService;

class ReportObserver
{
    protected $cacheService;

    public function __construct(DashboardCacheService $cacheService)
    {
        $this->cacheService = $cacheService;
    }

    public function created(Report $report): void
    {
        $this->cacheService->clearCache();
    }

    public function updated(Report $report): void
    {
        $this->cacheService->clearCache();
    }

    public function deleted(Report $report): void
    {
        $this->cacheService->clearCache();
    }
}
