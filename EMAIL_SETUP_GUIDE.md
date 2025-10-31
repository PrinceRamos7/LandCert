# Email Notifications Setup Guide

## Quick Setup (Choose One Method)

### Option 1: Gmail (Easiest for Testing)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to https://myaccount.google.com/security
   - Click "2-Step Verification"
   - Scroll down to "App passwords"
   - Select "Mail" and "Other (Custom name)"
   - Copy the 16-character password

3. **Update your `.env` file**:
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-16-char-app-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=your-email@gmail.com
MAIL_FROM_NAME="LandCert System"
```

### Option 2: Mailtrap (Best for Development/Testing)

1. **Sign up** at https://mailtrap.io (Free)
2. **Get credentials** from your inbox
3. **Update your `.env` file**:
```env
MAIL_MAILER=smtp
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your-mailtrap-username
MAIL_PASSWORD=your-mailtrap-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@landcert.local
MAIL_FROM_NAME="LandCert System"
```

### Option 3: Log Driver (Testing Without Sending)

Update your `.env` file:
```env
MAIL_MAILER=log
MAIL_FROM_ADDRESS=noreply@landcert.local
MAIL_FROM_NAME="LandCert System"
```

Emails will be saved to `storage/logs/laravel.log`

## Test Email Configuration

Run this command to test:
```bash
php artisan tinker
```

Then in tinker:
```php
Mail::raw('Test email', function($message) {
    $message->to('test@example.com')->subject('Test');
});
```

## Email Queue Setup (Recommended for Production)

1. **Update `.env`**:
```env
QUEUE_CONNECTION=database
```

2. **Create queue table**:
```bash
php artisan queue:table
php artisan migrate
```

3. **Start queue worker**:
```bash
php artisan queue:work
```

For production, use Supervisor to keep queue worker running.

## Emails Currently Implemented

1. **Application Submitted** - Sent when user submits application
2. **Application Approved** - Sent when admin approves application
3. **Payment Receipt Submitted** - Sent when user uploads payment
4. **Certificate Issued** - Sent when certificate is generated

## Troubleshooting

### Gmail "Less secure app" error
- Make sure 2FA is enabled
- Use App Password, not regular password
- Check if Gmail blocked the sign-in attempt

### Emails not sending
```bash
# Check logs
tail -f storage/logs/laravel.log

# Clear config cache
php artisan config:clear
php artisan cache:clear
```

### Test email sending
```bash
php artisan tinker
Mail::raw('Test', fn($m) => $m->to('your@email.com')->subject('Test'));
```

## Production Recommendations

For production, use a dedicated email service:

### Mailgun (Recommended)
- Free: 5,000 emails/month
- Reliable and fast
- Good deliverability

### Postmark
- Free: 100 emails/month
- Excellent deliverability
- Great for transactional emails

### Amazon SES
- Very cheap ($0.10 per 1,000 emails)
- Requires AWS account
- Highly scalable

## Email Templates Location

- `resources/views/emails/` - Email blade templates
- `app/Mail/` - Mailable classes

## Customizing Email Templates

Edit the blade files in `resources/views/emails/`:
- `application-submitted.blade.php`
- `application-approved.blade.php`
- `payment-receipt-submitted.blade.php`
- `certificate-issued.blade.php`

## Next Steps

1. Choose your email method
2. Update `.env` file
3. Test email sending
4. (Optional) Setup queue for better performance
5. Customize email templates if needed
