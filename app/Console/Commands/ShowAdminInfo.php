<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;

class ShowAdminInfo extends Command
{
    protected $signature = 'admin:info';
    protected $description = 'Show admin user information';

    public function handle()
    {
        $admin = User::where('email', 'admin@cpdo.com')->first();
        
        if (!$admin) {
            $this->error('Admin user not found!');
            return 1;
        }
        
        $this->info('Admin User Information:');
        $this->table(
            ['Field', 'Value'],
            [
                ['ID', $admin->id],
                ['Name', $admin->name],
                ['Email', $admin->email],
                ['User Type', $admin->user_type],
                ['Has Admin Role', $admin->hasRole('admin') ? 'Yes' : 'No'],
                ['Created At', $admin->created_at],
            ]
        );
        
        $this->newLine();
        $this->info('Default Login Credentials:');
        $this->info('Email: admin@cpdo.com');
        $this->info('Password: admin123');
        
        return 0;
    }
}
