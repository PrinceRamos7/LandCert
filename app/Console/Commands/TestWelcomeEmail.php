<?php

namespace App\Console\Commands;

use App\Mail\UserRegistrationWelcome;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class TestWelcomeEmail extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'email:test-welcome {email}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test the welcome email by sending it to a specified email address';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $email = $this->argument('email');
        
        // Create a test user object
        $testUser = new User([
            'name' => 'Test User',
            'email' => $email,
        ]);

        try {
            Mail::to($email)->send(new UserRegistrationWelcome($testUser));
            $this->info("Welcome email sent successfully to: {$email}");
            return 0;
        } catch (\Exception $e) {
            $this->error("Failed to send welcome email: " . $e->getMessage());
            return 1;
        }
    }
}