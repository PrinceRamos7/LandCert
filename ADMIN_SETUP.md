# Admin Account Setup Guide

## Default Admin Account

After running the seeder, you can login with:

**Email:** `admin@cpdo.com`  
**Password:** `admin123`

⚠️ **Important:** Change this password after first login!

---

## How to Create Admin Accounts

### Method 1: Using Seeder (Recommended)

Run the admin seeder command:
```bash
php artisan db:seed --class=AdminUserSeeder
```

This will create the default admin account shown above.

---

### Method 2: Using Tinker (For Custom Admins)

1. Open Laravel Tinker:
```bash
php artisan tinker
```

2. Create a new admin user:
```php
$user = \App\Models\User::create([
    'name' => 'Your Admin Name',
    'email' => 'youradmin@cpdo.com',
    'password' => \Hash::make('your-password'),
    'user_type' => 'admin',
    'contact_number' => '09123456789',
    'address' => 'Your Address'
]);

$user->assignRole('admin');
```

3. Exit tinker:
```php
exit
```

---

### Method 3: Modify the Seeder

Edit `database/seeders/AdminUserSeeder.php` and add more admin users:

```php
public function run(): void
{
    $adminRole = Role::firstOrCreate(['name' => 'admin']);
    
    // First Admin
    $admin1 = User::firstOrCreate(
        ['email' => 'admin@cpdo.com'],
        [
            'name' => 'Admin User',
            'password' => Hash::make('admin123'),
            'user_type' => 'admin',
        ]
    );
    $admin1->assignRole('admin');
    
    // Second Admin
    $admin2 = User::firstOrCreate(
        ['email' => 'supervisor@cpdo.com'],
        [
            'name' => 'Supervisor',
            'password' => Hash::make('supervisor123'),
            'user_type' => 'admin',
        ]
    );
    $admin2->assignRole('admin');
}
```

Then run:
```bash
php artisan db:seed --class=AdminUserSeeder
```

---

## Resetting Admin Password

If you forget the admin password, use tinker:

```bash
php artisan tinker
```

```php
$user = \App\Models\User::where('email', 'admin@cpdo.com')->first();
$user->password = \Hash::make('new-password');
$user->save();
exit
```

---

## Checking Admin Access

After creating an admin account:

1. Go to: `http://your-domain/login`
2. Login with admin credentials
3. You should be redirected to: `/admin/dashboard`
4. You should see the admin sidebar with:
   - Dashboard
   - Requests
   - Users

---

## User Types

The system has 3 user types:

1. **applicant** (default) - Regular users who submit applications
2. **staff** - Staff members (if needed in future)
3. **admin** - Full access to admin panel

---

## Roles vs User Types

- **user_type** - Database field for basic categorization
- **roles** (Spatie) - For permission-based access control

Both are used together:
- `user_type = 'admin'` - Marks user as admin in database
- `assignRole('admin')` - Gives admin permissions via Spatie

---

## Quick Commands Reference

```bash
# Create admin account
php artisan db:seed --class=AdminUserSeeder

# Reset all data and create admin
php artisan migrate:fresh --seed

# Open tinker for manual operations
php artisan tinker

# Clear all caches
php artisan cache:clear
php artisan config:clear
php artisan route:clear
```

---

## Security Best Practices

1. ✅ Change default password immediately
2. ✅ Use strong passwords (min 12 characters)
3. ✅ Don't share admin credentials
4. ✅ Create separate admin accounts for each administrator
5. ✅ Regularly review admin user list
6. ✅ Remove unused admin accounts
7. ✅ Enable two-factor authentication (future feature)

---

## Troubleshooting

### "Admin role not found"
Run the role seeder first:
```bash
php artisan db:seed --class=RoleSeeder
```

### "Can't access admin panel"
Check if user has admin role:
```bash
php artisan tinker
```
```php
$user = \App\Models\User::where('email', 'admin@cpdo.com')->first();
$user->roles; // Should show 'admin'
$user->assignRole('admin'); // If not assigned
exit
```

### "Redirected to applicant dashboard"
Make sure:
1. User has `user_type = 'admin'`
2. User has 'admin' role assigned
3. Clear cache: `php artisan cache:clear`

---

## Current Admin Features

✅ View all applications and requests  
✅ Approve/Reject applications  
✅ View and manage users  
✅ Update evaluation status  
✅ Delete requests  
✅ View statistics and analytics  

---

## Need Help?

If you encounter issues:
1. Check the logs: `storage/logs/laravel.log`
2. Clear all caches
3. Verify database connection
4. Check user roles in database
