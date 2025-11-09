<?php

namespace App\Traits;

trait OptimizedQueries
{
    /**
     * Get paginated requests with optimized queries
     */
    public function getOptimizedRequests($perPage = null)
    {
        $perPage = $perPage ?? config('performance.pagination.requests', 25);
        
        return \App\Models\Request::query()
            ->select([
                'id', 'applicant_name', 'corporation_name', 'applicant_address',
                'project_type', 'project_nature', 'project_location_street',
                'project_location_barangay', 'project_location_city',
                'project_location_municipality', 'project_location_province',
                'lot_area_sqm', 'project_cost', 'status', 'user_id',
                'created_at', 'updated_at'
            ])
            ->with(['user:id,name,email'])
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    /**
     * Get paginated payments with optimized queries
     */
    public function getOptimizedPayments($perPage = null, $status = null)
    {
        $perPage = $perPage ?? config('performance.pagination.payments', 25);
        
        $query = \App\Models\Payment::query()
            ->select([
                'id', 'request_id', 'application_id', 'amount', 'payment_method',
                'receipt_number', 'receipt_file_path', 'payment_date',
                'payment_status', 'verified_by', 'verified_at',
                'rejection_reason', 'notes', 'created_at', 'updated_at'
            ])
            ->with([
                'request:id,applicant_name,project_type',
                'verifier:id,name,email'
            ])
            ->orderBy('created_at', 'desc');

        if ($status && $status !== 'all') {
            $query->where('payment_status', $status);
        }

        return $query->paginate($perPage);
    }

    /**
     * Get paginated users with optimized queries
     */
    public function getOptimizedUsers($perPage = null, $userType = null)
    {
        $perPage = $perPage ?? config('performance.pagination.users', 25);
        
        $query = \App\Models\User::query()
            ->select([
                'id', 'name', 'email', 'contact_number', 'address',
                'user_type', 'email_verified_at', 'created_at', 'updated_at'
            ])
            ->orderBy('created_at', 'desc');

        if ($userType && $userType !== 'all') {
            $query->where('user_type', $userType);
        }

        return $query->paginate($perPage);
    }

    /**
     * Process large dataset in chunks
     */
    public function processInChunks($query, $callback, $chunkSize = null)
    {
        $chunkSize = $chunkSize ?? config('performance.query.chunk_processing', 1000);
        
        $query->chunk($chunkSize, $callback);
    }
}
