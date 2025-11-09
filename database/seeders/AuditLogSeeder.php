<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\AuditLog;
use App\Models\User;

class AuditLogSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::all();
        
        if ($users->isEmpty()) {
            $this->command->warn('No users found. Please seed users first.');
            return;
        }

        $actions = ['created', 'updated', 'deleted', 'viewed', 'exported', 'login', 'logout'];
        $modelTypes = ['Request', 'Payment', 'Application', 'User', 'Report'];
        
        $descriptions = [
            'created' => [
                'Created new request for John Doe',
                'Created payment record',
                'Created new user account',
                'Created application form',
            ],
            'updated' => [
                'Updated request status to approved',
                'Updated payment verification',
                'Updated user information',
                'Updated application details',
            ],
            'deleted' => [
                'Deleted request #123',
                'Deleted payment record',
                'Deleted user account',
                'Deleted application',
            ],
            'viewed' => [
                'Viewed request details',
                'Viewed payment information',
                'Viewed user profile',
                'Viewed application form',
            ],
            'exported' => [
                'Exported 50 requests as PDF',
                'Exported 25 payments as PDF',
                'Exported 100 users as PDF',
                'Exported applications report',
            ],
            'login' => [
                'User logged in successfully',
            ],
            'logout' => [
                'User logged out',
            ],
        ];

        $this->command->info('Creating sample audit logs...');

        for ($i = 0; $i < 50; $i++) {
            $user = $users->random();
            $action = $actions[array_rand($actions)];
            $modelType = $modelTypes[array_rand($modelTypes)];
            
            AuditLog::create([
                'user_id' => $user->id,
                'user_name' => $user->name,
                'user_email' => $user->email,
                'user_type' => $user->user_type,
                'action' => $action,
                'model_type' => $modelType,
                'model_id' => rand(1, 100),
                'description' => $descriptions[$action][array_rand($descriptions[$action])],
                'old_values' => $action === 'updated' ? [
                    'status' => 'pending',
                    'amount' => '1000.00',
                ] : null,
                'new_values' => $action === 'updated' ? [
                    'status' => 'approved',
                    'amount' => '1500.00',
                ] : null,
                'ip_address' => '192.168.' . rand(1, 255) . '.' . rand(1, 255),
                'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'url' => 'http://localhost:8000/admin/' . strtolower($modelType) . 's',
                'method' => ['GET', 'POST', 'PUT', 'DELETE'][array_rand(['GET', 'POST', 'PUT', 'DELETE'])],
                'metadata' => null,
                'created_at' => now()->subDays(rand(0, 30))->subHours(rand(0, 23)),
            ]);
        }

        $this->command->info('Sample audit logs created successfully!');
    }
}
