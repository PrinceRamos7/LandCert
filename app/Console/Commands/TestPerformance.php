<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use App\Services\DashboardCacheService;
use App\Models\Request as RequestModel;
use App\Models\Payment;
use App\Models\User;

class TestPerformance extends Command
{
    protected $signature = 'performance:test';
    protected $description = 'Test performance optimizations';

    public function handle()
    {
        $this->info('🚀 Testing Performance Optimizations...');
        $this->newLine();

        // Test 1: Database Indexes
        $this->testDatabaseIndexes();

        // Test 2: Query Performance
        $this->testQueryPerformance();

        // Test 3: Cache Performance
        $this->testCachePerformance();

        // Test 4: Pagination
        $this->testPagination();

        $this->newLine();
        $this->info('✅ All performance tests completed!');
    }

    private function testDatabaseIndexes()
    {
        $this->info('📊 Testing Database Indexes...');

        $tables = ['requests', 'payments', 'users', 'applications', 'certificates', 'status_history', 'reports'];
        
        foreach ($tables as $table) {
            $indexes = DB::select("SHOW INDEX FROM {$table}");
            $indexCount = count($indexes);
            $this->line("  - {$table}: {$indexCount} indexes");
        }

        $this->newLine();
    }

    private function testQueryPerformance()
    {
        $this->info('⚡ Testing Query Performance...');

        // Test requests query
        $start = microtime(true);
        $requests = RequestModel::with('user')
            ->orderBy('created_at', 'desc')
            ->limit(25)
            ->get();
        $time = round((microtime(true) - $start) * 1000, 2);
        $this->line("  - Requests query (25 records): {$time}ms");

        // Test payments query
        $start = microtime(true);
        $payments = Payment::with(['request', 'verifier'])
            ->orderBy('created_at', 'desc')
            ->limit(25)
            ->get();
        $time = round((microtime(true) - $start) * 1000, 2);
        $this->line("  - Payments query (25 records): {$time}ms");

        // Test users query
        $start = microtime(true);
        $users = User::orderBy('created_at', 'desc')
            ->limit(25)
            ->get();
        $time = round((microtime(true) - $start) * 1000, 2);
        $this->line("  - Users query (25 records): {$time}ms");

        $this->newLine();
    }

    private function testCachePerformance()
    {
        $this->info('💾 Testing Cache Performance...');

        $cacheService = app(DashboardCacheService::class);

        // Clear cache first
        $cacheService->clearCache();
        $this->line('  - Cache cleared');

        // Test uncached
        $start = microtime(true);
        $analytics = $cacheService->getAnalytics();
        $uncachedTime = round((microtime(true) - $start) * 1000, 2);
        $this->line("  - Analytics (uncached): {$uncachedTime}ms");

        // Test cached
        $start = microtime(true);
        $analytics = $cacheService->getAnalytics();
        $cachedTime = round((microtime(true) - $start) * 1000, 2);
        $this->line("  - Analytics (cached): {$cachedTime}ms");

        $improvement = round((($uncachedTime - $cachedTime) / $uncachedTime) * 100, 1);
        $this->line("  - Cache improvement: {$improvement}%");

        $this->newLine();
    }

    private function testPagination()
    {
        $this->info('📄 Testing Pagination...');

        $requestCount = RequestModel::count();
        $paymentCount = Payment::count();
        $userCount = User::count();

        $this->line("  - Total requests: {$requestCount}");
        $this->line("  - Total payments: {$paymentCount}");
        $this->line("  - Total users: {$userCount}");

        $perPage = config('performance.pagination.default', 25);
        $this->line("  - Default pagination: {$perPage} per page");

        $requestPages = ceil($requestCount / $perPage);
        $this->line("  - Request pages: {$requestPages}");

        $this->newLine();
    }
}
