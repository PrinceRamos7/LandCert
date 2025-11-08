<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class ResetAdminPassword extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'admin:reset-password';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Reset the admin password to default (admin123)';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Resetting admin password...');
        
        $admin = User::where('email', 'admin@cpdo.com')->first();
        
        if (!$admin) {
            $this->error('Admin user not found!');
            $this->info('Running admin seeder...');
            $this->call('db:seed', ['--class' => 'Database\\Seeders\\AdminUserSeeder']);
            return 0;
        }
        
        $admin->password = Hash::make('admin123');
        $admin->save();
        
        $this->info('✓ Admin password reset successfully!');
        $this->newLine();
        $this->info('Login Credentials:');
        $this->info('Email: admin@cpdo.com');
        $this->info('Password: admin123');
        $this->newLine();
        $this->warn('⚠️  Please change the password after login!');
        
        return 0;
    }
}
