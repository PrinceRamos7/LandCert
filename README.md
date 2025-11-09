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

## ✨ Features

- 📋 Request Management
- 💰 Payment Processing
- 👥 User Management
- 📜 Certificate Generation
- 📧 Email Notifications
- 📊 Audit Logs
- 🚀 Performance Optimized

## 📚 Documentation

See **SYSTEM_DOCUMENTATION.md** for complete documentation.

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
