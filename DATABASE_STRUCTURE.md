# Database Structure - Payment & Certificate System

## Overview
Professional database structure for handling the complete workflow from application approval to certificate issuance.

## New Tables Created

### 1. `payments` Table
Handles all payment-related information.

**Columns:**
- `id` - Primary key
- `request_id` - Foreign key to requests table
- `application_id` - Foreign key to applications table (nullable)
- `amount` - Payment amount (decimal 10,2)
- `payment_method` - Enum: cash, bank_transfer, gcash, paymaya, check, other
- `receipt_number` - Receipt/reference number
- `receipt_file_path` - Uploaded receipt image path
- `payment_date` - Date of payment
- `payment_status` - Enum: pending, verified, rejected
- `verified_by` - Foreign key to users (admin who verified)
- `verified_at` - Timestamp of verification
- `rejection_reason` - Text field for rejection explanation
- `notes` - Additional notes
- `created_at`, `updated_at`

**Relationships:**
- Belongs to Request
- Belongs to Application
- Belongs to User (verifier)
- Has one Certificate

---

### 2. `certificates` Table
Stores generated certificates.

**Columns:**
- `id` - Primary key
- `request_id` - Foreign key to requests
- `application_id` - Foreign key to applications (nullable)
- `payment_id` - Foreign key to payments (nullable)
- `certificate_number` - Unique certificate number (e.g., CERT-2025-00001)
- `certificate_file_path` - Generated PDF file path
- `issued_by` - Foreign key to users (admin who issued)
- `issued_at` - Timestamp of issuance
- `valid_until` - Expiration date (nullable)
- `status` - Enum: generated, sent, collected
- `notes` - Additional notes
- `created_at`, `updated_at`

**Relationships:**
- Belongs to Request
- Belongs to Application
- Belongs to Payment
- Belongs to User (issuer)

**Features:**
- Auto-generates unique certificate numbers (CERT-YYYY-XXXXX format)
- Tracks certificate lifecycle (generated → sent → collected)

---

### 3. `status_history` Table
Complete audit trail of all status changes.

**Columns:**
- `id` - Primary key
- `request_id` - Foreign key to requests
- `status_type` - Enum: application, payment, certificate
- `old_status` - Previous status value
- `new_status` - New status value
- `changed_by` - Foreign key to users (who made the change)
- `notes` - Reason or additional information
- `created_at`, `updated_at`

**Relationships:**
- Belongs to Request
- Belongs to User (changer)

**Features:**
- Logs every status change automatically
- Provides complete audit trail
- Tracks who made changes and when

---

### 4. `reports` Table (Updated)
Added workflow status tracking.

**New Column:**
- `workflow_status` - Enum tracking the complete workflow:
  - `pending_approval` - Initial state
  - `approved_pending_payment` - Approved, waiting for payment
  - `payment_submitted` - Payment receipt uploaded
  - `payment_verified` - Payment confirmed by admin
  - `certificate_issued` - Certificate generated and sent

---

## Complete Workflow

```
1. Application Submitted
   └─> reports.evaluation = 'pending'
   └─> reports.workflow_status = 'pending_approval'

2. Admin Approves Application
   └─> reports.evaluation = 'approved'
   └─> reports.workflow_status = 'approved_pending_payment'
   └─> Email sent to applicant
   └─> Status logged in status_history

3. Applicant Uploads Payment Receipt
   └─> Payment record created
   └─> payments.payment_status = 'pending'
   └─> reports.workflow_status = 'payment_submitted'
   └─> Status logged in status_history

4. Admin Verifies Payment
   └─> payments.payment_status = 'verified'
   └─> payments.verified_by = admin_id
   └─> payments.verified_at = now()
   └─> reports.workflow_status = 'payment_verified'
   └─> Status logged in status_history

5. System Generates Certificate
   └─> Certificate record created
   └─> certificates.certificate_number = auto-generated
   └─> certificates.status = 'generated'
   └─> reports.workflow_status = 'certificate_issued'
   └─> PDF generated and stored
   └─> Email sent to applicant with certificate
   └─> Status logged in status_history

6. Applicant Downloads Certificate
   └─> certificates.status = 'collected'
   └─> Status logged in status_history
```

## Model Relationships

### Request Model
```php
- hasMany(Payment)
- hasMany(Certificate)
- hasMany(StatusHistory)
```

### Application Model
```php
- hasMany(Payment)
- hasMany(Certificate)
- hasOne(Report)
```

### Payment Model
```php
- belongsTo(Request)
- belongsTo(Application)
- belongsTo(User) // verifier
- hasOne(Certificate)
```

### Certificate Model
```php
- belongsTo(Request)
- belongsTo(Application)
- belongsTo(Payment)
- belongsTo(User) // issuer
```

### StatusHistory Model
```php
- belongsTo(Request)
- belongsTo(User) // changer
```

## Key Features

### 1. **Complete Audit Trail**
- Every status change is logged
- Track who made changes and when
- Maintain historical records

### 2. **Payment Verification**
- Upload receipt proof
- Admin verification workflow
- Rejection with reasons
- Multiple payment methods supported

### 3. **Certificate Management**
- Auto-generated unique numbers
- PDF generation and storage
- Email delivery
- Download tracking

### 4. **Professional Structure**
- Normalized database design
- Proper foreign key relationships
- Scalable for future features
- Easy to query and report

## Next Steps

1. **Create Payment Upload Page** (Applicant)
2. **Create Payment Verification Page** (Admin)
3. **Implement Certificate Generation** (PDF)
4. **Create Certificate Email Template**
5. **Add Download Certificate Feature**
6. **Create Payment & Certificate Reports** (Admin)

## Database Diagram

```
┌─────────────┐
│   requests  │
└──────┬──────┘
       │
       ├──────────────┐
       │              │
       ▼              ▼
┌─────────────┐  ┌──────────────┐
│ applications│  │status_history│
└──────┬──────┘  └──────────────┘
       │
       ├──────────────┬──────────────┐
       │              │              │
       ▼              ▼              ▼
┌─────────────┐  ┌──────────┐  ┌──────────────┐
│   reports   │  │ payments │  │ certificates │
└─────────────┘  └────┬─────┘  └──────────────┘
                      │
                      └──────────────┘
```

## Benefits

✅ **Scalable** - Easy to add new features
✅ **Maintainable** - Clear separation of concerns
✅ **Auditable** - Complete history tracking
✅ **Professional** - Industry-standard design
✅ **Flexible** - Supports complex workflows
✅ **Secure** - Proper foreign key constraints
