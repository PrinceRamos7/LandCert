# 🚀 Deployment Checklist - Land Certification System

## Pre-Deployment Tasks

### 1. Environment Configuration
- [ ] Copy `.env.example` to `.env` on production server
- [ ] Set `APP_ENV=production`
- [ ] Set `APP_DEBUG=false`
- [ ] Generate new `APP_KEY` using `php artisan key:generate`
- [ ] Configure database credentials
- [ ] Set up mail configuration (SMTP/Mailtrap/SendGrid)
- [ ] Configure file storage (local/S3)
- [ ] Set proper `APP_URL`

### 2. Database Setup
- [ ] Create production database
- [ ] Run migrations: `php artisan migrate --force`
- [ ] Seed roles: `php artisan db:seed --class=RoleSeeder`
- [ ] Create admin user: `php artisan db:seed --class=AdminUserSeeder`
- [ ] Verify database connections

### 3. File Permissions
```bash
chmod -R 755 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
```

### 4. Dependencies
- [ ] Install PHP dependencies: `composer install --optimize-autoloader --no-dev`
- [ ] Install Node dependencies: `npm install`
- [ ] Build assets: `npm run build`
- [ ] Clear and cache config: `php artisan config:cache`
- [ ] Cache routes: `php artisan route:cache`
- [ ] Cache views: `php artisan view:cache`

### 5. Storage Setup
- [ ] Create storage link: `php artisan storage:link`
- [ ] Verify storage directories exist:
  - `storage/app/public/receipts`
  - `storage/app/public/certificates`
  - `storage/app/public/authorization_letters`

### 6. Security
- [ ] Enable HTTPS/SSL certificate
- [ ] Configure CORS if needed
- [ ] Set secure session cookies
- [ ] Enable CSRF protection
- [ ] Configure rate limiting
- [ ] Set up firewall rules

### 7. Email Testing
- [ ] Test application submitted email
- [ ] Test application approved email
- [ ] Test payment receipt submitted email
- [ ] Test certificate issued email
- [ ] Verify email templates render correctly

### 8. Performance Optimization
- [ ] Enable OPcache
- [ ] Configure Redis/Memcached for caching
- [ ] Optimize images and assets
- [ ] Enable Gzip compression
- [ ] Set up CDN if needed

### 9. Monitoring & Logging
- [ ] Configure error logging
- [ ] Set up application monitoring (Sentry/Bugsnag)
- [ ] Configure log rotation
- [ ] Set up backup system
- [ ] Configure uptime monitoring

### 10. Testing
- [ ] Test user registration
- [ ] Test application submission
- [ ] Test admin approval workflow
- [ ] Test payment upload
- [ ] Test certificate generation
- [ ] Test email notifications
- [ ] Test file downloads
- [ ] Test all CRUD operations
- [ ] Test role-based access control

## Post-Deployment

### Immediate Actions
- [ ] Verify all pages load correctly
- [ ] Test critical user flows
- [ ] Check error logs
- [ ] Verify email delivery
- [ ] Test file uploads/downloads

### Ongoing Maintenance
- [ ] Regular database backups
- [ ] Monitor server resources
- [ ] Review error logs weekly
- [ ] Update dependencies monthly
- [ ] Security patches as needed

## Environment Variables Checklist

```env
# Application
APP_NAME="Land Certification System"
APP_ENV=production
APP_KEY=
APP_DEBUG=false
APP_URL=https://yourdomain.com

# Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database
DB_USERNAME=your_username
DB_PASSWORD=your_password

# Mail
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=
MAIL_PASSWORD=
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@yourdomain.com
MAIL_FROM_NAME="${APP_NAME}"

# Session
SESSION_DRIVER=file
SESSION_LIFETIME=120

# Cache
CACHE_DRIVER=file
QUEUE_CONNECTION=sync
```

## Server Requirements

### Minimum Requirements
- PHP >= 8.1
- MySQL >= 5.7 or MariaDB >= 10.3
- Composer
- Node.js >= 16.x
- NPM >= 8.x

### PHP Extensions
- BCMath
- Ctype
- Fileinfo
- JSON
- Mbstring
- OpenSSL
- PDO
- Tokenizer
- XML
- GD or Imagick (for PDF generation)

### Recommended Server Specs
- 2 CPU cores
- 4GB RAM
- 20GB SSD storage
- Ubuntu 20.04 LTS or newer

## Deployment Commands

```bash
# 1. Pull latest code
git pull origin main

# 2. Install dependencies
composer install --optimize-autoloader --no-dev
npm install
npm run build

# 3. Run migrations
php artisan migrate --force

# 4. Clear and cache
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan optimize

# 5. Set permissions
chmod -R 755 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache

# 6. Restart services
sudo systemctl restart php8.1-fpm
sudo systemctl restart nginx
```

## Rollback Plan

If deployment fails:
```bash
# 1. Revert to previous version
git checkout <previous-commit-hash>

# 2. Restore database backup
mysql -u username -p database_name < backup.sql

# 3. Clear caches
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# 4. Rebuild assets
npm run build

# 5. Restart services
sudo systemctl restart php8.1-fpm nginx
```

## Support Contacts

- **System Admin**: [email]
- **Database Admin**: [email]
- **Developer**: [email]
- **Emergency Contact**: [phone]

---

**Last Updated**: October 31, 2025
**Version**: 1.0.0
