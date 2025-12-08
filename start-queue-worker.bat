@echo off
echo ========================================
echo   CPDO Queue Worker
echo ========================================
echo.
echo Starting queue worker...
echo This window must stay open for emails to be sent!
echo.
echo Press Ctrl+C to stop the queue worker
echo ========================================
echo.

php artisan queue:work --verbose --tries=3 --timeout=60

pause
