<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Report;

class TestReport extends Command
{
    protected $signature = 'test:report {id?}';
    protected $description = 'Test report model';

    public function handle()
    {
        $id = $this->argument('id');
        
        if ($id) {
            $report = Report::find($id);
            if ($report) {
                $this->info("Found report with ID: {$id}");
                $this->info("Primary Key Name: " . $report->getKeyName());
                $this->info("Primary Key Value: " . $report->getKey());
                $this->info("App ID: " . $report->app_id);
                $this->info("Evaluation: " . $report->evaluation);
            } else {
                $this->error("Report with ID {$id} not found");
            }
        } else {
            $reports = Report::all();
            $this->info("Total reports: " . $reports->count());
            foreach ($reports as $report) {
                $this->info("Report Key: {$report->getKey()} - App ID: {$report->app_id} - Evaluation: {$report->evaluation}");
            }
        }
    }
}