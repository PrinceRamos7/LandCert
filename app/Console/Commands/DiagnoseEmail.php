<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Application;
use App\Models\Report;
use App\Models\Request as RequestModel;
use App\Models\User;

class DiagnoseEmail extends Command
{
    protected $signature = 'diagnose:email';
    protected $description = 'Diagnose email sending issues';

    public function handle()
    {
        $this->info('=== Email Diagnosis ===');
        
        // Check if we have applications
        $applicationCount = Application::count();
        $this->info("Total Applications: {$applicationCount}");
        
        // Check if we have reports
        $reportCount = Report::count();
        $this->info("Total Reports: {$reportCount}");
        
        // Check if we have requests
        $requestCount = RequestModel::count();
        $this->info("Total Requests: {$requestCount}");
        
        // Check if we have users
        $userCount = User::count();
        $this->info("Total Users: {$userCount}");
        
        $this->info("\n=== Recent Applications ===");
        $recentApps = Application::orderBy('created_at', 'desc')->take(3)->get();
        foreach ($recentApps as $app) {
            $this->info("App ID: {$app->id} - Name: {$app->applicant_name} - Address: {$app->applicant_address}");
        }
        
        $this->info("\n=== Recent Requests ===");
        $recentRequests = RequestModel::orderBy('created_at', 'desc')->take(3)->get();
        foreach ($recentRequests as $req) {
            $this->info("Request ID: {$req->id} - Name: {$req->applicant_name} - Address: {$req->applicant_address} - User ID: {$req->user_id}");
        }
        
        $this->info("\n=== Recent Reports ===");
        $recentReports = Report::orderBy('updated_at', 'desc')->take(3)->get();
        foreach ($recentReports as $report) {
            $this->info("Report ID: {$report->id} - App ID: {$report->app_id} - Evaluation: {$report->evaluation}");
        }
        
        $this->info("\n=== Checking Application-Request Matching ===");
        $applications = Application::take(5)->get();
        foreach ($applications as $app) {
            $matchingRequest = RequestModel::where('applicant_name', $app->applicant_name)
                ->where('applicant_address', $app->applicant_address)
                ->first();
            
            if ($matchingRequest) {
                $user = User::find($matchingRequest->user_id);
                $this->info("✅ App {$app->id} matches Request {$matchingRequest->id} - User: " . ($user ? $user->email : 'NOT FOUND'));
            } else {
                $this->error("❌ App {$app->id} ({$app->applicant_name}) has NO matching request");
            }
        }
    }
}