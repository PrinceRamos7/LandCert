# 🚀 Quick Start Guide - Land Certification System

## For Developers

### Initial Setup (5 minutes)
```bash
# 1. Clone and install
git clone <repository-url>
cd cpdo_project
composer install
npm install

# 2. Environment setup
cp .env.example .env
php artisan key:generate

# 3. Database setup
# Edit .env with your database credentials
php artisan migrate --seed

# 4. Storage setup
php artisan storage:link

# 5. Build assets
npm run build

# 6. Start server
php artisan serve
```

### Default Accounts
- **Admin**: admin@example.com / password
- **User**: user@example.com / password

---

## For Testers

### Quick Test Flow (10 minutes)

#### 1. Test Application Submission
1. Login as user@example.com
2. Click "New Request"
3. Fill form (3 pages)
4. Review confirmation modal
5. Submit ✅

#### 2. Test Admin Approval
1. Login as admin@example.com
2. Go to "Requests"
3. Click "Accept" on application
4. Confirm in modal
5. Check email sent ✅

#### 3. Test Payment Upload
1. Login as user
2. Go to "Payment Receipt"
3. Click "Upload Receipt"
4. Fill details and upload file
5. Confirm submission ✅

#### 4. Test Payment Verification
1. Login as admin
2. Go to "Payments"
3. Click "Verify Payment"
4. Confirm verification
5. Certificate auto-generated ✅

#### 5. Test Certificate Download
1. Login as user
2. Go to "Payment Receipt"
3. Click "Download Certificate"
4. PDF downloads ✅

---

## For Admins

### Daily Tasks

#### Review Applications
```
Dashboard → Requests → View/Approve/Reject
```

#### Verify Payments
```
Dashboard → Payments → Verify/Reject
```

#### Manage Users
```
Dashboard → Users → View/Edit/Delete
```

### Common Actions

**Approve Application**
1. Click "Accept" button
2. Confirm in modal
3. Email sent automatically ✅

**Verify Payment**
1. Click "Verify Payment"
2. Review details in modal
3. Confirm
4. Certificate generated automatically ✅

**Reject Payment**
1. Click "Reject Payment"
2. Enter rejection reason
3. Confirm
4. Applicant can resubmit ✅

---

## For Applicants

### How to Apply

#### Step 1: Create Account
```
Register → Fill details → Verify email
```

#### Step 2: Submit Application
```
New Request → Fill 3 pages → Review → Submit
```

#### Step 3: Wait for Approval
```
Check Dashboard → Status: Pending → Approved
```

#### Step 4: Upload Payment
```
Payment Receipt → Upload Receipt → Confirm
```

#### Step 5: Download Certificate
```
Payment Receipt → Download Certificate
```

### Application Status Guide
- **Pending**: Under review
- **Approved**: Ready for payment
- **Rejected**: Needs revision
- **Payment Pending**: Awaiting verification
- **Payment Verified**: Certificate ready
- **Complete**: Certificate downloaded

---

## Troubleshooting

### Common Issues

**"Page not found"**
```bash
php artisan route:clear
php artisan config:clear
```

**"Assets not loading"**
```bash
npm run build
php artisan optimize:clear
```

**"Email not sending"**
```
Check .env mail configuration
Test with: php artisan tinker
Mail::raw('Test', function($msg) { $msg->to('test@example.com'); });
```

**"File upload fails"**
```bash
# Check permissions
chmod -R 755 storage
php artisan storage:link
```

**"Database error"**
```bash
# Reset database
php artisan migrate:fresh --seed
```

---

## File Locations

### Important Files
```
Controllers:
- app/Http/Controllers/AdminController.php
- app/Http/Controllers/RequestController.php
- app/Http/Controllers/PaymentController.php

Models:
- app/Models/Request.php
- app/Models/Application.php
- app/Models/Payment.php
- app/Models/Certificate.php

Frontend:
- resources/js/Components/Request_form/index.jsx
- resources/js/Components/Admin/Request/index.jsx
- resources/js/Components/Admin/Payments/index.jsx
- resources/js/Components/Receipt/index.jsx

Routes:
- routes/web.php

Migrations:
- database/migrations/

Emails:
- app/Mail/
- resources/views/emails/

Certificates:
- resources/views/certificates/template.blade.php
```

### Storage Locations
```
Uploaded Files:
- storage/app/public/authorization_letters/
- storage/app/public/receipts/
- storage/app/public/certificates/

Public Access:
- public/storage/ (symlink)
```

---

## Quick Commands

### Development
```bash
# Start dev server
php artisan serve

# Watch assets
npm run dev

# Clear all caches
php artisan optimize:clear

# Run migrations
php artisan migrate

# Seed database
php artisan db:seed
```

### Production
```bash
# Build assets
npm run build

# Cache everything
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Optimize
php artisan optimize
```

### Database
```bash
# Fresh start
php artisan migrate:fresh --seed

# Rollback
php artisan migrate:rollback

# Status
php artisan migrate:status
```

### Testing
```bash
# Run tests
php artisan test

# Check code
./vendor/bin/phpstan analyse

# Format code
./vendor/bin/pint
```

---

## Environment Variables

### Essential Settings
```env
APP_NAME="Land Certification System"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=cpdo_project
DB_USERNAME=root
DB_PASSWORD=

MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=
MAIL_PASSWORD=
MAIL_FROM_ADDRESS=noreply@example.com
```

---

## API Endpoints

### Public Routes
```
GET  /                  - Welcome page
GET  /login             - Login page
POST /login             - Login action
GET  /register          - Register page
POST /register          - Register action
```

### Applicant Routes (Auth Required)
```
GET  /dashboard         - User dashboard
GET  /request           - New request form
POST /request           - Submit request
GET  /receipt           - Payment page
POST /receipt           - Upload payment
GET  /certificate/{id}  - Download certificate
```

### Admin Routes (Admin Role Required)
```
GET  /admin/dashboard   - Admin dashboard
GET  /admin/requests    - All requests
GET  /admin/payments    - All payments
GET  /admin/users       - All users
POST /admin/approve     - Approve request
POST /admin/verify      - Verify payment
```

---

## Modal Confirmations

All critical actions now have confirmation modals:

✅ Application submission
✅ Payment upload
✅ Payment verification
✅ Application approval
✅ Application rejection
✅ Application deletion
✅ Application edit

**Pattern**:
1. User clicks action button
2. Modal shows with details
3. User reviews and confirms
4. Action executes
5. Toast notification shows result

---

## Email Notifications

Automatic emails sent for:

📧 Application submitted
📧 Application approved
📧 Payment receipt submitted
📧 Certificate issued (with PDF)

**Test emails**:
```bash
php artisan tinker
Mail::to('test@example.com')->send(new \App\Mail\ApplicationSubmitted($application, 'Test User'));
```

---

## Security Checklist

✅ CSRF protection enabled
✅ XSS prevention
✅ SQL injection prevention
✅ File upload validation
✅ Role-based access control
✅ Secure session handling
✅ Password hashing
✅ Input sanitization

---

## Performance Tips

### Development
- Use `npm run dev` for hot reload
- Enable query logging for debugging
- Use Laravel Debugbar

### Production
- Run `npm run build`
- Enable OPcache
- Use Redis for caching
- Enable Gzip compression
- Optimize images

---

## Documentation

📚 **Complete Guides**:
- DEPLOYMENT_CHECKLIST.md - Deployment steps
- TESTING_GUIDE.md - Testing procedures
- BUG_FIXES_AND_IMPROVEMENTS.md - Change log
- IMPROVEMENTS_SUMMARY.md - Overview
- QUICK_START_GUIDE.md - This file

📚 **System Guides**:
- PAYMENT_SYSTEM_GUIDE.md
- CERTIFICATE_SYSTEM_COMPLETE.md
- ADMIN_SETUP.md
- DATABASE_STRUCTURE.md

---

## Support

### Getting Help
1. Check documentation first
2. Review error logs
3. Search existing issues
4. Contact development team

### Reporting Bugs
Use the template in TESTING_GUIDE.md

### Feature Requests
Submit with:
- Clear description
- Use case
- Expected behavior
- Priority level

---

## Version Info

**Current Version**: 1.1.0
**Release Date**: October 31, 2025
**Status**: Production Ready ✅

**Recent Changes**:
- Added modal confirmations
- Enhanced validation
- Improved user feedback
- Complete documentation
- Bug fixes

---

## Next Steps

### For New Developers
1. Read this guide
2. Set up local environment
3. Review code structure
4. Run test suite
5. Make a test change

### For Testers
1. Follow quick test flow
2. Report any issues
3. Suggest improvements
4. Document edge cases

### For Deployment
1. Review DEPLOYMENT_CHECKLIST.md
2. Set up production environment
3. Run all tests
4. Deploy
5. Monitor

---

## Useful Links

- Laravel Docs: https://laravel.com/docs
- React Docs: https://react.dev
- Inertia Docs: https://inertiajs.com
- Tailwind Docs: https://tailwindcss.com
- Shadcn/ui: https://ui.shadcn.com

---

**Happy Coding! 🚀**

*Last Updated: October 31, 2025*
