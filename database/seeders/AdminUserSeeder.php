<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin role if it doesn't exist
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        
        // Create or update admin user
        $admin = User::updateOrCreate(
            ['email' => 'admin@cpdo.com'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('admin123'),
                'user_type' => 'admin',
                'contact_number' => '09123456789',
                'address' => 'CPDO Office, Ilagan City',
            ]
        );

        // Ensure admin role is assigned
        if (!$admin->hasRole('admin')) {
            $admin->assignRole('admin');
        }

        $this->command->info('Admin user created/updated successfully!');
        $this->command->info('Email: admin@cpdo.com');
        $this->command->info('Password: admin123');
        $this->command->info('User Type: ' . $admin->user_type);
        $this->command->info('');
        $this->command->warn('⚠️  Please change the password after first login!');
    }
}
