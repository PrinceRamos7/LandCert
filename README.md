# 🏛️ CPDO Management System

A comprehensive City Planning and Development Office management system for land certification requests, payment processing, and administrative workflows.

## 🚀 Quick Start

### Installation
```bash
composer install
npm install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan db:seed
```

### Development
```bash
# Start Laravel server
php artisan serve

# Start Vite dev server (in another terminal)
npm run dev
```

### Access
- **URL**: http://localhost:8000
- **Admin Panel**: /admin/dashboard
- **Payments**: /admin/payments

### Test Accounts
- **Admin**: admin@cpdo.com / password
- **Regular User**: user@cpdo.com / password

## ✨ Features

### Core Features
- 📋 Request Management
- 💰 Payment Processing
- 👥 User Management
- 📜 Certificate Generation
- 📧 Email Notifications
- 📊 Audit Logs
- 🚀 Performance Optimized

### 🆕 New Features (November 2025)
- 🔔 **Real-time Notifications System**
  - Database-backed persistent notifications
  - Unread count tracking
  - Automatic notifications for all events
  
- ✅ **Payment Verification with Bulk Actions**
  - Single-click payment approval
  - Bulk verify multiple payments
  - Integrated into payments page
  - Automatic certificate generation

## 📚 Documentation

### Main Documentation
- **SYSTEM_DOCUMENTATION.md** - Complete system documentation
- **SYSTEM_ANALYSIS_REPORT.md** - System analysis and performance

## 🛠️ Tech Stack

- Laravel 12
- React 18 + Inertia.js
- Tailwind CSS + shadcn/ui
- MySQL

## 📝 Useful Commands

```bash
# Performance test
php artisan performance:test

# Test audit logs
php artisan test:audit-log

# Clear caches
php artisan cache:clear

# Run queue worker
php artisan queue:work
```

## 📞 Support

For detailed documentation, troubleshooting, and configuration, see **SYSTEM_DOCUMENTATION.md**.

---

**Status**: Production Ready ✅
