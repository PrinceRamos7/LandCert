# CPDO System - Architecture Quick Reference

## System at a Glance

**Name:** City Planning and Development Office (CPDO) Management System  
**Type:** Web Application  
**Architecture:** Monolithic MVC  
**Status:** Production Ready

---

## Technology Stack

### Backend
- **Framework:** Laravel 11.x
- **Language:** PHP 8.2+
- **Database:** MySQL 8.0+
- **Cache:** Redis 7.x

### Frontend
- **Framework:** React 18.x
- **Router:** Inertia.js 1.x
- **Build:** Vite 7.x
- **Styling:** Tailwind CSS 3.x
- **UI:** Shadcn/ui
- **Charts:** Recharts 2.x

---

## Key Components

### User-Facing
1. **Request Form** - 3-step wizard for submitting applications
2. **Dashboard** - View and track requests
3. **Receipt Upload** - Submit payment receipts
4. **Certificate Download** - Download issued certificates

### Admin-Facing
1. **Request Management** - Approve/reject applications
2. **Payment Verification** - Verify payment receipts
3. **Analytics Dashboard** - View system statistics
4. **Audit Logs** - Track all system activities
5. **User Management** - Manage system users

---

## Database Tables

| Table | Purpose | Key Relationships |
|-------|---------|-------------------|
| users | User accounts | Has many requests |
| requests | Applications | Belongs to user, has one payment |
| payments | Payment records | Belongs to request |
| certificates | Issued certificates | Belongs to request |
| audit_logs | Activity tracking | Belongs to user |
| notifications | User notifications | Belongs to user |
| reminders | Payment reminders | Belongs to request |
| status_history | Status changes | Belongs to request |

---

## User Roles

### Admin
- View all requests
- Approve/reject requests
- Verify payments
- Issue certificates
- View analytics
- View audit logs
- Manage users

### User (Citizen)
- Submit requests
- View own requests
- Upload payment receipts
- Download certificates
- View notifications

---

## Application Flow

### Request Submission
```
User → Fill Form → Submit → Validation → Save to DB → 
Email Notification → Admin Review
```

### Payment Processing
```
User → Upload Receipt → Admin Verification → 
Generate Certificate → Email to User
```

### Certificate Issuance
```
Payment Verified → Generate PDF → Save to Storage → 
Send Email → User Downloads
```

---

## Security Features

1. **Authentication** - Laravel Breeze
2. **Authorization** - Role-based access control
3. **CSRF Protection** - Built-in Laravel protection
4. **XSS Prevention** - Input sanitization
5. **SQL Injection** - Eloquent ORM protection
6. **Password Hashing** - bcrypt
7. **HTTPS** - SSL/TLS encryption
8. **Audit Logging** - All actions tracked

---

## Performance Optimizations

1. **Caching** - Redis for sessions and data
2. **Database Indexing** - Optimized queries
3. **Eager Loading** - Prevent N+1 queries
4. **Asset Optimization** - Vite bundling and minification
5. **Query Optimization** - Indexed columns
6. **Code Splitting** - Lazy loading components

---

## File Structure

```
cpdo_project/
├── app/
│   ├── Http/Controllers/
│   ├── Models/
│   ├── Services/
│   ├── Observers/
│   └── Mail/
├── resources/
│   ├── js/
│   │   ├── Components/
│   │   ├── Pages/
│   │   └── Layouts/
│   └── views/
├── database/
│   ├── migrations/
│   └── seeders/
├── routes/
│   └── web.php
└── storage/
    └── app/public/
```

---

## API Endpoints (Web Routes)

### Authentication
- `GET /login` - Login page
- `POST /login` - Login action
- `POST /logout` - Logout action
- `GET /register` - Registration page
- `POST /register` - Registration action

### User Routes
- `GET /dashboard` - User dashboard
- `GET /request/create` - Request form
- `POST /request` - Submit request
- `GET /receipt` - Receipt page
- `POST /receipt` - Upload receipt

### Admin Routes
- `GET /admin/dashboard` - Admin dashboard
- `GET /admin/requests` - Request management
- `GET /admin/payments` - Payment management
- `GET /admin/analytics` - Analytics
- `GET /admin/audit-logs` - Audit logs
- `GET /admin/users` - User management

---

## Email Notifications

1. User Registration Welcome
2. Request Submitted
3. Request Approved
4. Request Rejected
5. Payment Receipt Submitted
6. Payment Verified
7. Payment Rejected
8. Certificate Issued
9. Payment Reminder (Scheduled)

---

## Deployment Checklist

- [ ] Update `.env` configuration
- [ ] Run `composer install`
- [ ] Run `npm install`
- [ ] Run `npm run build`
- [ ] Run `php artisan migrate`
- [ ] Run `php artisan storage:link`
- [ ] Set proper file permissions
- [ ] Configure web server
- [ ] Set up SSL certificate
- [ ] Configure email settings
- [ ] Set up backup system
- [ ] Configure monitoring

---

## Monitoring & Maintenance

### Daily
- Check system logs
- Monitor error rates
- Verify backups

### Weekly
- Review performance metrics
- Check security updates
- Review audit logs

### Monthly
- Apply security patches
- Update dependencies
- Performance tuning

---

## Support Contacts

**System Administrator:** [Contact]  
**Development Team:** [Contact]  
**Support Email:** [Email]  
**Emergency:** [Phone]

---

## Quick Commands

### Development
```bash
# Start development server
php artisan serve
npm run dev

# Run migrations
php artisan migrate

# Clear cache
php artisan cache:clear
php artisan config:clear
php artisan view:clear

# Create storage link
php artisan storage:link
```

### Production
```bash
# Build assets
npm run build

# Optimize
php artisan optimize
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Run queue worker
php artisan queue:work
```

---

## System Metrics

- **Total Components:** 59 React components
- **Code Reduction:** 63% from refactoring
- **Database Tables:** 12+ tables
- **API Routes:** 50+ routes
- **Email Templates:** 10+ templates
- **Security Layers:** 4 levels

---

**Version:** 1.0  
**Last Updated:** January 29, 2026  
**Status:** Production Ready
