<?php

namespace App\Observers;

use App\Models\Payment;
use App\Services\DashboardCacheService;
use App\Services\AuditLogService;

class PaymentObserver
{
    protected $cacheService;

    public function __construct(DashboardCacheService $cacheService)
    {
        $this->cacheService = $cacheService;
    }

    public function created(Payment $payment): void
    {
        $this->cacheService->clearCache();
        
        AuditLogService::logCreate(
            'Payment',
            $payment->id,
            $payment->toArray(),
            "Created payment of ₱" . number_format($payment->amount, 2)
        );
    }

    public function updated(Payment $payment): void
    {
        $this->cacheService->clearCache();
        
        AuditLogService::logUpdate(
            'Payment',
            $payment->id,
            $payment->getOriginal(),
            $payment->getChanges(),
            "Updated payment #" . $payment->id
        );
    }

    public function deleted(Payment $payment): void
    {
        $this->cacheService->clearCache();
        
        AuditLogService::logDelete(
            'Payment',
            $payment->id,
            $payment->toArray(),
            "Deleted payment #" . $payment->id
        );
    }
}
