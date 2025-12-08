<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;
use App\Mail\ApplicationSubmitted;
use App\Models\Application;
use App\Models\User;

class TestEmailSending extends Command
{
    protected $signature = 'test:email-send {email?}';
    protected $description = 'Test email sending functionality';

    public function handle()
    {
        $email = $this->argument('email') ?? 'princeandreyramos7@gmail.com';
        
        $this->info('Testing email configuration...');
        $this->info('MAIL_MAILER: ' . config('mail.default'));
        $this->info('MAIL_HOST: ' . config('mail.mailers.smtp.host'));
        $this->info('MAIL_PORT: ' . config('mail.mailers.smtp.port'));
        $this->info('MAIL_USERNAME: ' . config('mail.mailers.smtp.username'));
        $this->info('MAIL_FROM: ' . config('mail.from.address'));
        $this->newLine();

        $this->info('Sending test email to: ' . $email);
        
        try {
            // Send a simple test email
            Mail::raw('This is a test email from CPDO System. If you receive this, email is working!', function ($message) use ($email) {
                $message->to($email)
                    ->subject('CPDO System - Test Email');
            });
            
            $this->info('✅ Test email sent successfully!');
            $this->info('Check your inbox at: ' . $email);
            $this->newLine();
            
            // Test with actual application email
            $this->info('Testing ApplicationSubmitted email...');
            $user = User::first();
            $application = Application::first();
            
            if ($user && $application) {
                Mail::to($email)->send(new ApplicationSubmitted($application, $user->name));
                $this->info('✅ ApplicationSubmitted email sent successfully!');
            } else {
                $this->warn('⚠️  No user or application found in database to test with.');
            }
            
            return Command::SUCCESS;
            
        } catch (\Exception $e) {
            $this->error('❌ Failed to send email!');
            $this->error('Error: ' . $e->getMessage());
            $this->newLine();
            $this->info('Troubleshooting tips:');
            $this->info('1. Check your .env file has correct MAIL_* settings');
            $this->info('2. Verify MAIL_MAILER=smtp (not log)');
            $this->info('3. Check Gmail app password is correct');
            $this->info('4. Ensure less secure app access is enabled');
            
            return Command::FAILURE;
        }
    }
}
