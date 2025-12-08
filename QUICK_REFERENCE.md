# 🚀 CPDO System - Quick Reference

## 📊 Current Status

✅ **Database:** `cpdo_ilagan` (25 tables)  
✅ **Migrations:** 22/22 complete  
✅ **Admin Account:** 1 user ready  
✅ **System:** Fully operational  

---

## 🔐 Login Credentials

**Admin Account:**
```
URL: http://localhost:8000/login
Email: admin@cpdo.com
Password: admin123
```
⚠️ Change password after first login!

---

## ⚡ Quick Commands

### Start Application
```bash
php artisan serve
# Visit: http://localhost:8000
```

### Database
```bash
# Check status
php artisan migrate:status

# Fresh migration (WARNING: deletes all data)
php artisan migrate:fresh --seed

# Check database info
php artisan about
```

### Admin Management
```bash
# Show admin info
php artisan show:admin-info

# Reset admin password
php artisan reset:admin-password

# Check database data
php artisan check:database
```

### Cache Management
```bash
# Clear all caches
php artisan optimize:clear

# Or individually
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear
```

### Testing
```bash
# Test email
php artisan test:email your@email.com

# Test reminders
php artisan reminders:send

# Test performance
php artisan performance:test
```

---

## 🔧 Automation Setup

### Queue Worker (Background Jobs)
```bash
# Start manually
php artisan queue:work

# Or double-click
start-queue-worker.bat
```

### Task Scheduler (Automated Reminders)
```powershell
# Run as Administrator
.\setup-task-scheduler.ps1
```

See `SETUP_COMPLETE.md` for detailed instructions.

---

## 📁 Important Files

### Configuration
- `.env` - Environment settings
- `config/database.php` - Database config
- `config/mail.php` - Email config

### Documentation
- `DATABASE_MIGRATION_COMPLETE.md` - Migration summary
- `SETUP_COMPLETE.md` - Automation setup
- `QUICK_START.md` - Quick start guide
- `SYSTEM_DIAGNOSTIC_REPORT.md` - Full system analysis

### Scripts
- `start-queue-worker.bat` - Start queue worker
- `setup-task-scheduler.ps1` - Setup scheduler

---

## 🐛 Common Issues

### Application Won't Start
```bash
php artisan config:clear
php artisan serve
```

### Database Connection Error
```bash
# Check .env file
DB_DATABASE=cpdo_ilagan
DB_USERNAME=root
DB_PASSWORD=

# Clear config
php artisan config:clear
```

### Migration Errors
```bash
# Fresh start (WARNING: deletes data)
php artisan migrate:fresh --seed
```

### Can't Login
```bash
# Reset admin password
php artisan reset:admin-password
```

---

## 📊 System Features

### For Applicants
✅ User registration  
✅ Request submission  
✅ Payment upload  
✅ Certificate download  
✅ Status tracking  

### For Admins
✅ Dashboard analytics  
✅ Application management  
✅ Payment verification  
✅ User management  
✅ Bulk operations  
✅ Export to PDF/CSV  
✅ Audit logs  
✅ Global search  

### Automated
✅ Email notifications  
✅ Payment reminders  
✅ Certificate generation  
✅ Background jobs  

---

## 🔍 Monitoring

### Check Logs
```bash
# View latest logs
type storage\logs\laravel.log | Select-Object -Last 50

# Search for errors
findstr /i "error" storage\logs\laravel.log
```

### Check Queue
```bash
# Failed jobs
php artisan queue:failed

# Process one job
php artisan queue:work --once
```

### Check Scheduler
```bash
# List scheduled tasks
php artisan schedule:list

# Run manually
php artisan schedule:run
```

---

## 📞 Quick Help

### System Info
```bash
php artisan about
```

### Database Info
```bash
php artisan db:show
```

### Routes List
```bash
php artisan route:list
```

### Clear Everything
```bash
php artisan optimize:clear
composer dump-autoload
```

---

## 🎯 Next Steps

1. ✅ **Database Setup** - DONE
2. 🔄 **Start Application** - `php artisan serve`
3. 🔄 **Login & Test** - http://localhost:8000
4. 🔄 **Change Password** - Security first!
5. ⏳ **Setup Automation** - See `SETUP_COMPLETE.md`
6. ⏳ **Add Test Data** - Create sample requests
7. ⏳ **Test Workflow** - End-to-end testing

---

## 📚 Full Documentation

For detailed information, see:
- `DATABASE_MIGRATION_COMPLETE.md` - This migration
- `SETUP_COMPLETE.md` - Automation setup
- `SYSTEM_DIAGNOSTIC_REPORT.md` - System analysis
- `QUICK_FIX_GUIDE.md` - Troubleshooting
- `SYSTEM_DOCUMENTATION.md` - Feature documentation

---

**System Status:** ✅ READY  
**Database:** cpdo_ilagan  
**Last Updated:** November 14, 2025
