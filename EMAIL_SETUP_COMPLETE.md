# 📧 Email System Setup & Troubleshooting

## ✅ Email Configuration Status

### Current Configuration
- **MAIL_MAILER:** smtp ✅
- **MAIL_HOST:** smtp.gmail.com ✅
- **MAIL_PORT:** 587 ✅
- **MAIL_USERNAME:** princeandreyramos7@gmail.com ✅
- **MAIL_ENCRYPTION:** tls ✅
- **Status:** Email sending is working! ✅

### Test Results
- ✅ Simple test email: **SENT SUCCESSFULLY**
- ✅ ApplicationSubmitted email: **SENT SUCCESSFULLY**
- ✅ SMTP connection: **WORKING**

---

## 🔍 Issue Identified

**Problem:** Emails are being queued but not sent to applicants immediately.

**Root Cause:** The queue worker is not running continuously in the background.

**Solution:** Start and keep the queue worker running.

---

## 🚀 Solution: Start Queue Worker

### Option 1: Manual Queue Worker (Development)
Run this command in a separate terminal and keep it running:

```bash
php artisan queue:work
```

**Important:** This terminal must stay open for emails to be sent!

### Option 2: Process Single Job (Testing)
To process one email at a time:

```bash
php artisan queue:work --once
```

### Option 3: Supervisor (Production - Recommended)
For production, use Supervisor to keep the queue worker running automatically.

**Install Supervisor:**
```bash
# On Ubuntu/Debian
sudo apt-get install supervisor

# On Windows, use NSSM (Non-Sucking Service Manager)
# Download from: https://nssm.cc/download
```

**Supervisor Configuration** (`/etc/supervisor/conf.d/laravel-worker.conf`):
```ini
[program:laravel-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /path/to/cpdo_project/artisan queue:work --sleep=3 --tries=3 --max-time=3600
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www-data
numprocs=1
redirect_stderr=true
stdout_logfile=/path/to/cpdo_project/storage/logs/worker.log
stopwaitsecs=3600
```

### Option 4: Windows Service (Production on Windows)
Use NSSM to create a Windows service:

```bash
# Download NSSM and run:
nssm install LaravelQueue "C:\xampp\php\php.exe" "C:\xampp\htdocs\cpdo_project\artisan queue:work --sleep=3 --tries=3"
nssm start LaravelQueue
```

---

## 📝 How Emails Work in the System

### Email Flow
1. **User Action** (e.g., submits application)
2. **Email Queued** → Stored in `jobs` table
3. **Queue Worker** → Processes job and sends email
4. **Email Sent** → Via Gmail SMTP

### Emails Sent by the System

#### 1. Registration Welcome Email
- **Trigger:** User registers
- **Recipient:** New user
- **Class:** `App\Mail\UserRegistrationWelcome`
- **Sent:** Immediately (not queued)

#### 2. Application Submitted
- **Trigger:** User submits application
- **Recipient:** Applicant
- **Class:** `App\Mail\ApplicationSubmitted`
- **Sent:** Queued

#### 3. Application Approved
- **Trigger:** Admin approves application
- **Recipient:** Applicant
- **Class:** `App\Mail\ApplicationApproved`
- **Sent:** Immediately (not queued)

#### 4. Application Rejected
- **Trigger:** Admin rejects application
- **Recipient:** Applicant
- **Class:** `App\Mail\ApplicationRejected`
- **Sent:** Immediately (not queued)

#### 5. Payment Receipt Submitted
- **Trigger:** User uploads payment receipt
- **Recipient:** Applicant
- **Class:** `App\Mail\PaymentReceiptSubmitted`
- **Sent:** Queued

#### 6. Payment Rejected
- **Trigger:** Admin rejects payment
- **Recipient:** Applicant
- **Class:** `App\Mail\PaymentRejected`
- **Sent:** Immediately (not queued)

#### 7. Certificate Issued
- **Trigger:** Admin verifies payment
- **Recipient:** Applicant
- **Class:** `App\Mail\CertificateIssued`
- **Sent:** Immediately (not queued)

#### 8. Payment Due Reminder
- **Trigger:** Scheduled task (daily)
- **Recipient:** Applicants with pending payments
- **Class:** `App\Mail\PaymentDueReminder`
- **Sent:** Queued

---

## 🧪 Testing Email System

### Test Command
```bash
php artisan test:email-send [email]
```

**Example:**
```bash
php artisan test:email-send user@example.com
```

### Check Queue Status
```bash
# View failed jobs
php artisan queue:failed

# Retry failed jobs
php artisan queue:retry all

# Clear failed jobs
php artisan queue:flush
```

### Check Logs
```bash
# View Laravel logs
tail -f storage/logs/laravel.log

# On Windows
Get-Content storage\logs\laravel.log -Tail 50
```

---

## 🔧 Troubleshooting

### Problem: Emails Not Sending

**Check 1: Is queue worker running?**
```bash
# Check if queue worker is running
ps aux | grep "queue:work"  # Linux
tasklist | findstr php      # Windows
```

**Check 2: Are jobs in the queue?**
```bash
# Check jobs table
php artisan tinker
>>> DB::table('jobs')->count();
```

**Check 3: Are there failed jobs?**
```bash
php artisan queue:failed
```

**Check 4: Test email directly**
```bash
php artisan test:email-send
```

### Problem: Gmail Authentication Error

**Solution 1: Use App Password**
1. Go to Google Account settings
2. Enable 2-Step Verification
3. Generate App Password
4. Use App Password in `.env` file

**Solution 2: Enable Less Secure Apps**
1. Go to https://myaccount.google.com/lesssecureapps
2. Turn on "Allow less secure apps"
3. Try sending email again

### Problem: Emails Go to Spam

**Solutions:**
1. Add sender to contacts
2. Mark email as "Not Spam"
3. Set up SPF/DKIM records (production)
4. Use a verified domain email

---

## 📊 Queue Monitoring

### View Queue Jobs
```bash
# Count jobs in queue
php artisan tinker
>>> DB::table('jobs')->count();

# View recent jobs
>>> DB::table('jobs')->latest()->take(5)->get();
```

### Monitor Queue in Real-Time
```bash
# Run queue worker with verbose output
php artisan queue:work --verbose
```

### Queue Statistics
```bash
# View failed jobs count
php artisan queue:failed

# View jobs table
php artisan db:show jobs
```

---

## ✅ Quick Start Checklist

For immediate email functionality:

1. **Start Queue Worker**
   ```bash
   php artisan queue:work
   ```
   Keep this terminal open!

2. **Test Email**
   ```bash
   php artisan test:email-send
   ```

3. **Submit Test Application**
   - Register a new user
   - Submit an application
   - Check email inbox

4. **Process Queue**
   - Queue worker should process automatically
   - Or run: `php artisan queue:work --once`

---

## 🎯 Production Deployment

### Before Going Live

1. **Set up Supervisor** (Linux) or **NSSM** (Windows)
2. **Configure queue worker** to restart automatically
3. **Set up monitoring** for queue failures
4. **Configure email alerts** for failed jobs
5. **Test all email scenarios**
6. **Set up log rotation**

### Recommended Settings

**.env for Production:**
```env
QUEUE_CONNECTION=database
MAIL_MAILER=smtp
LOG_CHANNEL=daily
LOG_LEVEL=info
```

**Queue Worker Command:**
```bash
php artisan queue:work --sleep=3 --tries=3 --max-time=3600 --timeout=60
```

---

## 📞 Support

### Email Test Command
```bash
php artisan test:email-send [email]
```

### Diagnostic Commands
```bash
# Clear all caches
php artisan optimize:clear

# Restart queue
php artisan queue:restart

# Check configuration
php artisan config:show mail
```

---

**Status:** ✅ Email system is configured and working!  
**Action Required:** Start queue worker to process queued emails  
**Last Updated:** November 30, 2025
