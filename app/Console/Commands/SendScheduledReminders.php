<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class SendScheduledReminders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'reminders:send';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send all scheduled reminders that are due';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Sending scheduled reminders...');
        
        $reminderService = app(\App\Services\ReminderService::class);
        $sent = $reminderService->sendPendingReminders();
        
        $this->info("Successfully sent {$sent} reminder(s)!");
        
        return 0;
    }
}
