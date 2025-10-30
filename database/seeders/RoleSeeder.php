<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        // Create roles
        $adminRole = Role::create(['name' => 'admin']);
        $userRole = Role::create(['name' => 'user']);

        // Create permissions
        $permissions = [
            'view applications',
            'create applications',
            'edit applications',
            'delete applications',
            'manage reports',
            'approve applications',
            'reject applications',
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        // Assign all permissions to admin
        $adminRole->givePermissionTo(Permission::all());

        // Assign limited permissions to user
        $userRole->givePermissionTo(['view applications', 'create applications']);

        // Create admin user
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@cpdo.com',
            'password' => Hash::make('password'),
        ]);
        $admin->assignRole('admin');

        // Create regular user
        $user = User::create([
            'name' => 'Regular User',
            'email' => 'user@cpdo.com',
            'password' => Hash::make('password'),
        ]);
        $user->assignRole('user');
    }
}
