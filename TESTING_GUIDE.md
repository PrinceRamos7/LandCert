# 🧪 Testing Guide - Land Certification System

## Overview
This guide provides comprehensive testing procedures for the Land Certification System to ensure all features work correctly before and after deployment.

---

## 🎯 Test Environment Setup

### Prerequisites
```bash
# 1. Ensure database is seeded
php artisan migrate:fresh --seed

# 2. Seed roles and admin user
php artisan db:seed --class=RoleSeeder
php artisan db:seed --class=AdminUserSeeder

# 3. Clear all caches
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# 4. Build assets
npm run build

# 5. Start development server
php artisan serve
```

### Test Accounts

#### Admin Account
- **Email**: admin@example.com
- **Password**: password
- **Role**: admin

#### Test Applicant Account
- **Email**: user@example.com
- **Password**: password
- **Role**: applicant

---

## 📋 Test Cases

### 1. User Authentication Tests

#### Test 1.1: User Registration
**Steps**:
1. Navigate to `/register`
2. Fill in registration form:
   - Name: Test User
   - Email: testuser@example.com
   - Password: password123
   - Confirm Password: password123
3. Click "Register"

**Expected Result**:
- ✅ User is created successfully
- ✅ Redirected to dashboard
- ✅ Welcome email sent (check logs)
- ✅ User has 'applicant' role by default

#### Test 1.2: User Login
**Steps**:
1. Navigate to `/login`
2. Enter credentials
3. Click "Log in"

**Expected Result**:
- ✅ Successful login
- ✅ Redirected to appropriate dashboard (admin/applicant)
- ✅ Session created

#### Test 1.3: Password Reset
**Steps**:
1. Click "Forgot Password"
2. Enter email
3. Check email for reset link
4. Reset password

**Expected Result**:
- ✅ Reset email sent
- ✅ Password updated successfully
- ✅ Can login with new password

---

### 2. Application Submission Tests

#### Test 2.1: Basic Application Submission
**Steps**:
1. Login as applicant
2. Navigate to "New Request"
3. Fill Page 1 (Applicant Info):
   - Applicant Name: John Doe
   - Applicant Address: 123 Main St, City
4. Click "Next"
5. Fill Page 2 (Project Details):
   - Project Type: Residential
   - Lot Area: 500 sqm
   - Project Cost: 5000000
6. Click "Next"
7. Fill Page 3 (Land Uses):
   - Select preferences
8. Click "Submit Request"
9. **NEW**: Review confirmation modal
10. Click "Confirm & Submit"

**Expected Result**:
- ✅ Confirmation modal appears with summary
- ✅ Application submitted successfully
- ✅ Toast notification shown
- ✅ Email sent to applicant
- ✅ Redirected to dashboard
- ✅ Application appears in list with "Pending" status

#### Test 2.2: Application with Representative
**Steps**:
1. Start new application
2. Check "Do you have an Authorized Representative?"
3. Fill representative details
4. Upload authorization letter (PDF/JPG)
5. Complete and submit

**Expected Result**:
- ✅ Representative fields appear
- ✅ File upload works
- ✅ File stored in storage/app/public/authorization_letters
- ✅ Application includes representative info

#### Test 2.3: Form Validation
**Steps**:
1. Try to submit without required fields
2. Try to upload invalid file type
3. Try to upload file > 5MB

**Expected Result**:
- ✅ Validation errors shown
- ✅ Toast notification for missing fields
- ✅ File type/size errors displayed
- ✅ Form not submitted

---

### 3. Admin Review Tests

#### Test 3.1: View Applications
**Steps**:
1. Login as admin
2. Navigate to "Requests" or "Applications"
3. View list of applications

**Expected Result**:
- ✅ All applications displayed
- ✅ Statistics cards show correct counts
- ✅ Search functionality works
- ✅ Filter by status works

#### Test 3.2: View Application Details
**Steps**:
1. Click "View" on any application
2. Review modal with full details

**Expected Result**:
- ✅ Modal opens with complete information
- ✅ All fields displayed correctly
- ✅ Authorization letter viewable (if exists)
- ✅ Image preview for JPG/PNG files

#### Test 3.3: Approve Application
**Steps**:
1. Click "Accept" on pending application
2. **NEW**: Review confirmation modal
3. Click "Approve"

**Expected Result**:
- ✅ Confirmation modal appears
- ✅ Application status changes to "Approved"
- ✅ Toast notification shown
- ✅ Email sent to applicant
- ✅ Application appears in approved list

#### Test 3.4: Reject Application
**Steps**:
1. Click "Decline" on pending application
2. **NEW**: Review confirmation modal
3. Click "Decline"

**Expected Result**:
- ✅ Confirmation modal appears
- ✅ Application status changes to "Rejected"
- ✅ Toast notification shown
- ✅ Applicant notified

#### Test 3.5: Edit Application
**Steps**:
1. Click "Edit" on application
2. Modify evaluation details
3. Click "Update"

**Expected Result**:
- ✅ Edit modal opens
- ✅ Fields pre-filled with current data
- ✅ Changes saved successfully
- ✅ Toast notification shown

#### Test 3.6: Delete Application
**Steps**:
1. Click "Delete" on application
2. **NEW**: Review confirmation modal
3. Click "Delete"

**Expected Result**:
- ✅ Confirmation modal appears
- ✅ Application deleted from database
- ✅ Toast notification shown
- ✅ Removed from list

---

### 4. Payment Submission Tests

#### Test 4.1: Upload Payment Receipt
**Steps**:
1. Login as applicant
2. Navigate to "Payment Receipt"
3. Find approved application
4. Click "Upload Receipt"
5. Fill payment details:
   - Amount: 5000
   - Method: GCash
   - Receipt Number: GC123456
   - Date: Today
   - Upload receipt file
6. Click "Submit Receipt"
7. **NEW**: Review confirmation modal
8. Click "Confirm & Submit"

**Expected Result**:
- ✅ Confirmation modal shows payment summary
- ✅ Payment submitted successfully
- ✅ File stored in storage/app/public/receipts
- ✅ Toast notification shown
- ✅ Email sent to applicant
- ✅ Status changes to "Pending Verification"

#### Test 4.2: Payment Validation
**Steps**:
1. Try to submit without amount
2. Try to submit with amount = 0
3. Try to submit without file

**Expected Result**:
- ✅ Validation errors shown
- ✅ Toast notifications for errors
- ✅ Form not submitted

---

### 5. Payment Verification Tests

#### Test 5.1: Verify Payment
**Steps**:
1. Login as admin
2. Navigate to "Payments"
3. Find pending payment
4. Click "Verify Payment"
5. **NEW**: Review confirmation modal
6. Click "Verify & Generate Certificate"

**Expected Result**:
- ✅ Confirmation modal shows payment details
- ✅ Payment status changes to "Verified"
- ✅ Certificate automatically generated
- ✅ PDF created in storage/app/public/certificates
- ✅ Email sent with certificate attachment
- ✅ Toast notification shown

#### Test 5.2: Reject Payment
**Steps**:
1. Click "Reject Payment"
2. Enter rejection reason
3. Click "Reject Payment"

**Expected Result**:
- ✅ Rejection modal appears
- ✅ Reason is required
- ✅ Payment status changes to "Rejected"
- ✅ Applicant can resubmit
- ✅ Toast notification shown

---

### 6. Certificate Tests

#### Test 6.1: Certificate Generation
**Steps**:
1. Verify a payment (see Test 5.1)
2. Check storage/app/public/certificates

**Expected Result**:
- ✅ PDF file created
- ✅ Filename format: CERT-YYYY-XXXXX.pdf
- ✅ Certificate contains all required info
- ✅ Professional formatting

#### Test 6.2: Certificate Download
**Steps**:
1. Login as applicant
2. Navigate to "Payment Receipt"
3. Find application with certificate
4. Click "Download Certificate"

**Expected Result**:
- ✅ PDF downloads successfully
- ✅ Certificate status updates to "Collected"
- ✅ Audit log created

#### Test 6.3: Certificate Email
**Steps**:
1. Check email after payment verification
2. Open certificate email

**Expected Result**:
- ✅ Email received
- ✅ Professional template
- ✅ Certificate attached as PDF
- ✅ All details correct

---

### 7. Email Notification Tests

#### Test 7.1: Application Submitted Email
**Trigger**: Submit new application
**Check**:
- ✅ Email sent to applicant
- ✅ Contains application ID
- ✅ Professional formatting
- ✅ Correct recipient

#### Test 7.2: Application Approved Email
**Trigger**: Admin approves application
**Check**:
- ✅ Email sent to applicant
- ✅ Contains next steps (payment)
- ✅ Professional formatting

#### Test 7.3: Payment Receipt Submitted Email
**Trigger**: Upload payment receipt
**Check**:
- ✅ Email sent to applicant
- ✅ Contains payment details
- ✅ Mentions verification pending

#### Test 7.4: Certificate Issued Email
**Trigger**: Admin verifies payment
**Check**:
- ✅ Email sent to applicant
- ✅ Certificate attached as PDF
- ✅ Download link included
- ✅ Professional formatting

---

### 8. User Management Tests (Admin)

#### Test 8.1: View Users
**Steps**:
1. Login as admin
2. Navigate to "Users"

**Expected Result**:
- ✅ All applicant users listed
- ✅ User details displayed
- ✅ Search works

#### Test 8.2: Edit User
**Steps**:
1. Click edit on user
2. Modify details
3. Save

**Expected Result**:
- ✅ User updated successfully
- ✅ Toast notification shown

#### Test 8.3: Delete User
**Steps**:
1. Click delete on user
2. Confirm deletion

**Expected Result**:
- ✅ User deleted
- ✅ Toast notification shown

---

### 9. Dashboard Tests

#### Test 9.1: Applicant Dashboard
**Steps**:
1. Login as applicant
2. View dashboard

**Expected Result**:
- ✅ Shows user's applications only
- ✅ Status badges correct
- ✅ Statistics accurate
- ✅ Recent applications listed

#### Test 9.2: Admin Dashboard
**Steps**:
1. Login as admin
2. View dashboard

**Expected Result**:
- ✅ Shows all applications
- ✅ Statistics cards accurate
- ✅ Charts display correctly
- ✅ Quick actions available

---

### 10. Role-Based Access Tests

#### Test 10.1: Applicant Access
**Steps**:
1. Login as applicant
2. Try to access admin routes directly

**Expected Result**:
- ✅ Cannot access /admin/* routes
- ✅ Redirected or 403 error
- ✅ Only sees own data

#### Test 10.2: Admin Access
**Steps**:
1. Login as admin
2. Access all routes

**Expected Result**:
- ✅ Can access all admin routes
- ✅ Can view all applications
- ✅ Can perform all admin actions

---

### 11. File Upload Tests

#### Test 11.1: Authorization Letter Upload
**File Types**: PDF, JPG, PNG
**Max Size**: 5MB

**Test Cases**:
- ✅ Valid PDF upload
- ✅ Valid JPG upload
- ✅ Valid PNG upload
- ❌ Invalid file type (e.g., .docx)
- ❌ File > 5MB
- ✅ File stored correctly
- ✅ File accessible via URL

#### Test 11.2: Receipt Upload
**Same as 11.1**

---

### 12. Search and Filter Tests

#### Test 12.1: Search Applications
**Steps**:
1. Enter search term
2. Check results

**Test Cases**:
- ✅ Search by applicant name
- ✅ Search by email
- ✅ Search by project type
- ✅ Search by ID
- ✅ Case-insensitive search

#### Test 12.2: Filter by Status
**Steps**:
1. Click status filter
2. Check results

**Test Cases**:
- ✅ Filter pending
- ✅ Filter approved
- ✅ Filter rejected
- ✅ Clear filter

---

### 13. Modal Confirmation Tests

#### Test 13.1: All Modals Present
**Check that modals exist for**:
- ✅ Application submission
- ✅ Payment upload
- ✅ Payment verification
- ✅ Application approval
- ✅ Application rejection
- ✅ Application deletion
- ✅ Application edit

#### Test 13.2: Modal Functionality
**For each modal**:
- ✅ Opens correctly
- ✅ Shows relevant data
- ✅ Cancel button works
- ✅ Confirm button works
- ✅ Closes after action
- ✅ Proper loading states

---

### 14. Toast Notification Tests

#### Test 14.1: Success Notifications
**Check for**:
- ✅ Application submitted
- ✅ Payment uploaded
- ✅ Payment verified
- ✅ Application approved
- ✅ Application rejected
- ✅ Application deleted
- ✅ User updated

#### Test 14.2: Error Notifications
**Check for**:
- ✅ Validation errors
- ✅ Network errors
- ✅ Permission errors
- ✅ File upload errors

---

### 15. Performance Tests

#### Test 15.1: Page Load Times
**Acceptable**: < 2 seconds

**Pages to test**:
- ✅ Dashboard
- ✅ Request form
- ✅ Admin requests list
- ✅ Payment page

#### Test 15.2: Large Dataset
**Steps**:
1. Create 100+ applications
2. Test list performance
3. Test search performance

**Expected**:
- ✅ No lag in UI
- ✅ Pagination works
- ✅ Search is fast

---

### 16. Browser Compatibility Tests

#### Test 16.1: Desktop Browsers
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Edge (latest)
- ✅ Safari (latest)

#### Test 16.2: Mobile Browsers
- ✅ Chrome Mobile
- ✅ Safari iOS
- ✅ Samsung Internet

#### Test 16.3: Responsive Design
**Test at**:
- ✅ 1920x1080 (Desktop)
- ✅ 1366x768 (Laptop)
- ✅ 768x1024 (Tablet)
- ✅ 375x667 (Mobile)

---

### 17. Security Tests

#### Test 17.1: CSRF Protection
**Steps**:
1. Try to submit form without CSRF token
2. Try to submit with invalid token

**Expected**:
- ✅ Request rejected
- ✅ 419 error

#### Test 17.2: SQL Injection
**Steps**:
1. Try SQL injection in search
2. Try in form fields

**Expected**:
- ✅ No SQL errors
- ✅ Input sanitized

#### Test 17.3: XSS Protection
**Steps**:
1. Try to inject JavaScript
2. Check if executed

**Expected**:
- ✅ Script not executed
- ✅ HTML escaped

---

### 18. Edge Cases

#### Test 18.1: Empty States
- ✅ No applications
- ✅ No payments
- ✅ No users
- ✅ Proper messages shown

#### Test 18.2: Concurrent Actions
- ✅ Multiple users submitting
- ✅ Admin approving while user viewing
- ✅ No race conditions

#### Test 18.3: Session Timeout
- ✅ Proper redirect to login
- ✅ Data not lost
- ✅ Can resume after login

---

## 🐛 Bug Reporting Template

When you find a bug, report it using this template:

```markdown
### Bug Title
Brief description of the issue

**Steps to Reproduce**:
1. Step 1
2. Step 2
3. Step 3

**Expected Behavior**:
What should happen

**Actual Behavior**:
What actually happens

**Screenshots**:
[Attach if applicable]

**Environment**:
- Browser: Chrome 120
- OS: Windows 11
- User Role: Admin/Applicant
- Date: 2025-10-31

**Priority**: High/Medium/Low

**Additional Notes**:
Any other relevant information
```

---

## ✅ Pre-Deployment Checklist

Before deploying to production, ensure:

- [ ] All test cases pass
- [ ] No console errors
- [ ] All emails working
- [ ] File uploads working
- [ ] PDF generation working
- [ ] All modals functional
- [ ] Toast notifications working
- [ ] Role-based access working
- [ ] Database migrations run
- [ ] Seeders run successfully
- [ ] Environment variables set
- [ ] SSL certificate installed
- [ ] Backups configured
- [ ] Monitoring set up

---

## 📊 Test Results Template

```markdown
# Test Results - [Date]

## Summary
- Total Tests: X
- Passed: X
- Failed: X
- Skipped: X

## Failed Tests
1. Test Name - Reason
2. Test Name - Reason

## Notes
Any additional observations

## Tested By
[Your Name]
```

---

## 🔄 Regression Testing

After any code changes, run these critical tests:

1. User authentication
2. Application submission
3. Admin approval
4. Payment upload
5. Payment verification
6. Certificate generation
7. Email notifications

---

## 📞 Support

For testing questions or issues:
- Review this guide first
- Check BUG_FIXES_AND_IMPROVEMENTS.md
- Contact development team

---

**Last Updated**: October 31, 2025
**Version**: 1.0.0
