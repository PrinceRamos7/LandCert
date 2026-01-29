# CPDO System Architecture Documentation

## System Overview

**System Name:** City Planning and Development Office (CPDO) Management System  
**Type:** Web-based Application Management System  
**Architecture:** Monolithic with MVC Pattern  
**Deployment:** Single Server Architecture

---

## Table of Contents

1. [High-Level Architecture](#high-level-architecture)
2. [Technology Stack](#technology-stack)
3. [System Layers](#system-layers)
4. [Database Architecture](#database-architecture)
5. [Application Flow](#application-flow)
6. [Security Architecture](#security-architecture)
7. [Component Architecture](#component-architecture)
8. [Integration Architecture](#integration-architecture)

---

## 1. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Browser    │  │   Mobile     │  │   Tablet     │          │
│  │  (Chrome,    │  │   Browser    │  │   Browser    │          │
│  │  Firefox,    │  │              │  │              │          │
│  │   Safari)    │  │              │  │              │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      WEB SERVER LAYER                            │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    Apache/Nginx                           │   │
│  │  - SSL/TLS Termination                                   │   │
│  │  - Static Asset Serving                                  │   │
│  │  - Request Routing                                       │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   APPLICATION LAYER                              │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                  Laravel Framework                        │   │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐        │   │
│  │  │Controllers │  │ Middleware │  │  Services  │        │   │
│  │  └────────────┘  └────────────┘  └────────────┘        │   │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐        │   │
│  │  │   Models   │  │ Observers  │  │   Jobs     │        │   │
│  │  └────────────┘  └────────────┘  └────────────┘        │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     DATA LAYER                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │    MySQL     │  │  File System │  │    Cache     │          │
│  │   Database   │  │   (Storage)  │  │   (Redis)    │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                  EXTERNAL SERVICES                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │    Email     │  │     SMS      │  │   Payment    │          │
│  │   Service    │  │   Service    │  │   Gateway    │          │
│  │   (SMTP)     │  │  (Optional)  │  │  (Optional)  │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Technology Stack

### Backend Technologies

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| Framework | Laravel | 11.x | PHP Web Framework |
| Language | PHP | 8.2+ | Server-side Programming |
| Database | MySQL | 8.0+ | Relational Database |
| Cache | Redis | 7.x | Session & Data Caching |
| Queue | Laravel Queue | - | Background Job Processing |
| Mail | Laravel Mail | - | Email Notifications |

### Frontend Technologies

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| Framework | React | 18.x | UI Library |
| Router | Inertia.js | 1.x | SPA Routing |
| Build Tool | Vite | 7.x | Asset Bundling |
| Styling | Tailwind CSS | 3.x | Utility-first CSS |
| UI Components | Shadcn/ui | - | Component Library |
| Charts | Recharts | 2.x | Data Visualization |
| Icons | Lucide React | - | Icon Library |
| State | React Hooks | - | State Management |

### Development Tools

| Tool | Purpose |
|------|---------|
| Composer | PHP Dependency Management |
| NPM | JavaScript Dependency Management |
| Git | Version Control |
| Artisan | Laravel CLI Tool |

---

## 3. System Layers

### 3.1 Presentation Layer (Frontend)


```
┌─────────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │                    Pages Layer                          │    │
│  │  - Auth Pages (Login, Register, Reset Password)       │    │
│  │  - User Dashboard                                      │    │
│  │  - Admin Dashboard                                     │    │
│  │  - Request Management                                  │    │
│  │  - Payment Management                                  │    │
│  │  - Receipt Management                                  │    │
│  │  - Audit Logs                                         │    │
│  │  - Analytics                                          │    │
│  └────────────────────────────────────────────────────────┘    │
│                          │                                       │
│                          ▼                                       │
│  ┌────────────────────────────────────────────────────────┐    │
│  │                 Components Layer                        │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │    │
│  │  │   Admin      │  │    User      │  │   Shared     │ │    │
│  │  │ Components   │  │ Components   │  │ Components   │ │    │
│  │  │              │  │              │  │              │ │    │
│  │  │ - Request    │  │ - Dashboard  │  │ - UI Kit     │ │    │
│  │  │ - Payments   │  │ - Receipt    │  │ - Forms      │ │    │
│  │  │ - Analytics  │  │ - Request    │  │ - Modals     │ │    │
│  │  │ - AuditLog   │  │   Form       │  │ - Tables     │ │    │
│  │  └──────────────┘  └──────────────┘  └──────────────┘ │    │
│  └────────────────────────────────────────────────────────┘    │
│                          │                                       │
│                          ▼                                       │
│  ┌────────────────────────────────────────────────────────┐    │
│  │                  Layouts Layer                          │    │
│  │  - Authenticated Layout                                │    │
│  │  - Guest Layout                                        │    │
│  │  - Admin Layout                                        │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 Application Layer (Backend)


```
┌─────────────────────────────────────────────────────────────────┐
│                   APPLICATION LAYER                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │                  Routes Layer                           │    │
│  │  - web.php (Web Routes)                                │    │
│  │  - api.php (API Routes - Optional)                     │    │
│  └────────────────────────────────────────────────────────┘    │
│                          │                                       │
│                          ▼                                       │
│  ┌────────────────────────────────────────────────────────┐    │
│  │                 Middleware Layer                        │    │
│  │  - Authentication (auth)                               │    │
│  │  - Role-based Access (RoleMiddleware)                  │    │
│  │  - Audit Logging (AuditLogMiddleware)                  │    │
│  │  - Performance Headers (PerformanceHeaders)            │    │
│  │  - CSRF Protection                                     │    │
│  └────────────────────────────────────────────────────────┘    │
│                          │                                       │
│                          ▼                                       │
│  ┌────────────────────────────────────────────────────────┐    │
│  │                Controllers Layer                        │    │
│  │  - AuthController                                      │    │
│  │  - AdminController                                     │    │
│  │  - PaymentController                                   │    │
│  │  - NotificationController                              │    │
│  └────────────────────────────────────────────────────────┘    │
│                          │                                       │
│                          ▼                                       │
│  ┌────────────────────────────────────────────────────────┐    │
│  │                 Services Layer                          │    │
│  │  - AuditLogService                                     │    │
│  │  - ReminderService                                     │    │
│  │  - DashboardCacheService                               │    │
│  └────────────────────────────────────────────────────────┘    │
│                          │                                       │
│                          ▼                                       │
│  ┌────────────────────────────────────────────────────────┐    │
│  │                  Models Layer                           │    │
│  │  - User, Request, Payment, Certificate                │    │
│  │  - AuditLog, Notification, Reminder                    │    │
│  │  - StatusHistory, Report                               │    │
│  └────────────────────────────────────────────────────────┘    │
│                          │                                       │
│                          ▼                                       │
│  ┌────────────────────────────────────────────────────────┐    │
│  │                 Observers Layer                         │    │
│  │  - RequestObserver                                     │    │
│  │  - PaymentObserver                                     │    │
│  │  - ReportObserver                                      │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. Database Architecture


### 4.1 Database Schema Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                      DATABASE SCHEMA                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐         ┌──────────────┐                     │
│  │    users     │────────▶│   requests   │                     │
│  │              │  1:N    │              │                     │
│  │ - id         │         │ - id         │                     │
│  │ - name       │         │ - user_id    │                     │
│  │ - email      │         │ - status     │                     │
│  │ - role       │         │ - evaluation │                     │
│  └──────────────┘         └──────────────┘                     │
│                                  │                               │
│                                  │ 1:1                          │
│                                  ▼                               │
│                           ┌──────────────┐                      │
│                           │   payments   │                      │
│                           │              │                      │
│                           │ - id         │                      │
│                           │ - request_id │                      │
│                           │ - amount     │                      │
│                           │ - status     │                      │
│                           └──────────────┘                      │
│                                  │                               │
│                                  │ 1:1                          │
│                                  ▼                               │
│                           ┌──────────────┐                      │
│                           │certificates  │                      │
│                           │              │                      │
│                           │ - id         │                      │
│                           │ - request_id │                      │
│                           │ - cert_no    │                      │
│                           │ - status     │                      │
│                           └──────────────┘                      │
│                                                                  │
│  ┌──────────────┐         ┌──────────────┐                     │
│  │  audit_logs  │         │notifications │                     │
│  │              │         │              │                     │
│  │ - id         │         │ - id         │                     │
│  │ - user_id    │         │ - user_id    │                     │
│  │ - action     │         │ - type       │                     │
│  │ - model_type │         │ - message    │                     │
│  └──────────────┘         └──────────────┘                     │
│                                                                  │
│  ┌──────────────┐         ┌──────────────┐                     │
│  │  reminders   │         │status_history│                     │
│  │              │         │              │                     │
│  │ - id         │         │ - id         │                     │
│  │ - request_id │         │ - request_id │                     │
│  │ - sent_at    │         │ - old_status │                     │
│  │ - type       │         │ - new_status │                     │
│  └──────────────┘         └──────────────┘                     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 Core Tables


#### Users Table
- **Purpose:** Store user accounts (Admin, Regular Users)
- **Key Fields:** id, name, email, password, role, email_verified_at
- **Relationships:** Has many Requests, Notifications, Audit Logs

#### Requests Table
- **Purpose:** Store application/permit requests
- **Key Fields:** id, user_id, applicant_name, project_type, status, evaluation
- **Relationships:** Belongs to User, Has one Payment, Has one Certificate

#### Payments Table
- **Purpose:** Store payment information and receipts
- **Key Fields:** id, request_id, amount, payment_method, status, receipt_file_path
- **Relationships:** Belongs to Request

#### Certificates Table
- **Purpose:** Store issued certificates
- **Key Fields:** id, request_id, certificate_number, issued_at, status
- **Relationships:** Belongs to Request

#### Audit Logs Table
- **Purpose:** Track all system activities
- **Key Fields:** id, user_id, action, model_type, model_id, old_values, new_values
- **Relationships:** Belongs to User

#### Notifications Table
- **Purpose:** Store user notifications
- **Key Fields:** id, user_id, type, message, read_at
- **Relationships:** Belongs to User

---

## 5. Application Flow

### 5.1 User Request Submission Flow


```
┌──────────┐
│   User   │
└────┬─────┘
     │
     │ 1. Access Request Form
     ▼
┌─────────────────────┐
│  Request Form Page  │
│  (3-Step Wizard)    │
└────┬────────────────┘
     │
     │ 2. Fill Form Data
     │    - Step 1: Applicant Info
     │    - Step 2: Project Details
     │    - Step 3: Land Use
     ▼
┌─────────────────────┐
│  Form Validation    │
└────┬────────────────┘
     │
     │ 3. Submit Request
     ▼
┌─────────────────────┐
│  Backend Controller │
│  - Validate Data    │
│  - Create Request   │
│  - Trigger Observer │
└────┬────────────────┘
     │
     │ 4. Save to Database
     ▼
┌─────────────────────┐
│  Database (MySQL)   │
│  - requests table   │
└────┬────────────────┘
     │
     │ 5. Trigger Events
     ├──────────────────────┐
     │                      │
     ▼                      ▼
┌──────────────┐    ┌──────────────┐
│ Send Email   │    │  Audit Log   │
│ Notification │    │   Created    │
└──────────────┘    └──────────────┘
     │
     │ 6. Redirect to Dashboard
     ▼
┌─────────────────────┐
│  User Dashboard     │
│  (View Request)     │
└─────────────────────┘
```

### 5.2 Admin Request Processing Flow


```
┌──────────┐
│  Admin   │
└────┬─────┘
     │
     │ 1. View Requests
     ▼
┌─────────────────────┐
│ Admin Request Page  │
│ - Filter/Search     │
│ - View Details      │
└────┬────────────────┘
     │
     │ 2. Review Request
     ▼
┌─────────────────────┐
│  Decision Making    │
│  - Approve          │
│  - Reject           │
│  - Request Edit     │
└────┬────────────────┘
     │
     │ 3. Update Status
     ▼
┌─────────────────────┐
│  Backend Controller │
│  - Update Request   │
│  - Trigger Observer │
└────┬────────────────┘
     │
     │ 4. Update Database
     ▼
┌─────────────────────┐
│  Database (MySQL)   │
│  - Update status    │
│  - Log history      │
└────┬────────────────┘
     │
     │ 5. Trigger Events
     ├──────────────────────┬──────────────────┐
     │                      │                  │
     ▼                      ▼                  ▼
┌──────────────┐    ┌──────────────┐  ┌──────────────┐
│ Send Email   │    │  Audit Log   │  │ Notification │
│ to User      │    │   Created    │  │   Created    │
└──────────────┘    └──────────────┘  └──────────────┘
```

### 5.3 Payment Processing Flow


```
┌──────────┐
│   User   │
└────┬─────┘
     │
     │ 1. Request Approved
     ▼
┌─────────────────────┐
│  Receipt Page       │
│  - Upload Receipt   │
│  - Enter Details    │
└────┬────────────────┘
     │
     │ 2. Submit Payment Info
     ▼
┌─────────────────────┐
│  Payment Controller │
│  - Validate File    │
│  - Store Receipt    │
│  - Create Payment   │
└────┬────────────────┘
     │
     │ 3. Save to Database
     ▼
┌─────────────────────┐
│  Database (MySQL)   │
│  - payments table   │
│  - File storage     │
└────┬────────────────┘
     │
     │ 4. Admin Verification
     ▼
┌─────────────────────┐
│ Admin Payment Page  │
│ - View Receipt      │
│ - Verify/Reject     │
└────┬────────────────┘
     │
     │ 5. Update Payment Status
     ▼
┌─────────────────────┐
│  Payment Controller │
│  - Update Status    │
│  - Generate Cert    │
└────┬────────────────┘
     │
     │ 6. If Verified
     ▼
┌─────────────────────┐
│ Certificate Service │
│ - Generate PDF      │
│ - Store Certificate │
└────┬────────────────┘
     │
     │ 7. Notify User
     ▼
┌─────────────────────┐
│  Email Service      │
│  - Send Certificate │
│  - Download Link    │
└─────────────────────┘
```

---

## 6. Security Architecture


### 6.1 Security Layers

```
┌─────────────────────────────────────────────────────────────────┐
│                      SECURITY ARCHITECTURE                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Layer 1: Network Security                                      │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  - HTTPS/SSL Encryption                                │    │
│  │  - Firewall Rules                                      │    │
│  │  - DDoS Protection                                     │    │
│  └────────────────────────────────────────────────────────┘    │
│                          │                                       │
│                          ▼                                       │
│  Layer 2: Application Security                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  - CSRF Protection (Laravel)                           │    │
│  │  - XSS Prevention                                      │    │
│  │  - SQL Injection Prevention (Eloquent ORM)             │    │
│  │  - Input Validation & Sanitization                     │    │
│  └────────────────────────────────────────────────────────┘    │
│                          │                                       │
│                          ▼                                       │
│  Layer 3: Authentication & Authorization                        │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  - Laravel Breeze Authentication                       │    │
│  │  - Password Hashing (bcrypt)                           │    │
│  │  - Session Management                                  │    │
│  │  - Role-based Access Control (RBAC)                    │    │
│  │  - Email Verification                                  │    │
│  └────────────────────────────────────────────────────────┘    │
│                          │                                       │
│                          ▼                                       │
│  Layer 4: Data Security                                         │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  - Database Encryption                                 │    │
│  │  - File Upload Validation                              │    │
│  │  - Secure File Storage                                 │    │
│  │  - Audit Logging                                       │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 6.2 Authentication Flow


```
┌──────────┐
│   User   │
└────┬─────┘
     │
     │ 1. Enter Credentials
     ▼
┌─────────────────────┐
│   Login Page        │
└────┬────────────────┘
     │
     │ 2. Submit Form
     ▼
┌─────────────────────┐
│  Auth Controller    │
│  - Validate Input   │
│  - Check Credentials│
└────┬────────────────┘
     │
     │ 3. Verify Password
     ▼
┌─────────────────────┐
│  Database Query     │
│  - Find User        │
│  - Compare Hash     │
└────┬────────────────┘
     │
     │ 4. Create Session
     ▼
┌─────────────────────┐
│  Session Manager    │
│  - Generate Token   │
│  - Store Session    │
└────┬────────────────┘
     │
     │ 5. Check Role
     ▼
┌─────────────────────┐
│  Role Middleware    │
│  - Admin → Admin    │
│  - User → Dashboard │
└────┬────────────────┘
     │
     │ 6. Redirect
     ▼
┌─────────────────────┐
│  Authorized Page    │
└─────────────────────┘
```

### 6.3 Role-Based Access Control (RBAC)

| Role | Permissions |
|------|-------------|
| **Admin** | - View all requests<br>- Approve/Reject requests<br>- Verify payments<br>- Issue certificates<br>- View analytics<br>- View audit logs<br>- Manage users |
| **User** | - Submit requests<br>- View own requests<br>- Upload payment receipts<br>- Download certificates<br>- View notifications |

---

## 7. Component Architecture


### 7.1 Frontend Component Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                  REACT COMPONENT HIERARCHY                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│                        App Root                                  │
│                            │                                     │
│              ┌─────────────┴─────────────┐                      │
│              │                           │                      │
│         Guest Layout              Authenticated Layout          │
│              │                           │                      │
│    ┌─────────┴─────────┐       ┌────────┴────────┐            │
│    │                   │       │                 │            │
│  Login            Register   Dashboard      Admin Panel        │
│  Reset Password   Verify     │               │                │
│                               │               │                │
│                    ┌──────────┴──────┐       │                │
│                    │                 │       │                │
│              Request Form      Receipt Page  │                │
│              (3 Steps)                       │                │
│                                              │                │
│                                   ┌──────────┴──────────┐     │
│                                   │                     │     │
│                              Requests            Payments     │
│                              Analytics           AuditLogs    │
│                              Users               Reports      │
│                                                                │
└─────────────────────────────────────────────────────────────────┘
```

### 7.2 Component Structure (Refactored)

Each major component follows this modular structure:

```
ComponentFolder/
├── index.jsx              # Main container (state, logic, composition)
├── utils.jsx              # Utility functions (formatters, validators)
├── ComponentStats.jsx     # Statistics display
├── ComponentTable.jsx     # Data table
├── ComponentModal.jsx     # Modal dialogs
├── ComponentFilters.jsx   # Filter controls
└── ComponentPagination.jsx # Pagination controls
```

**Example: Admin Request Component**
```
Admin/Request/
├── index.jsx                    # Main container (~500 lines)
├── utils.jsx                    # Utilities
├── RequestStats.jsx             # Statistics cards
├── RequestTable.jsx             # Request table
├── RequestTableHeader.jsx       # Table header
├── RequestPagination.jsx        # Pagination
├── ViewRequestModal.jsx         # View modal
├── EditRequestModal.jsx         # Edit modal
├── DeleteConfirmDialog.jsx      # Delete confirmation
├── ApproveConfirmDialog.jsx     # Approve confirmation
└── RejectDialog.jsx             # Reject dialog
```

---

## 8. Integration Architecture


### 8.1 Email Integration

```
┌─────────────────────────────────────────────────────────────────┐
│                    EMAIL NOTIFICATION SYSTEM                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Trigger Events:                                                │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  1. User Registration                                  │    │
│  │  2. Request Submitted                                  │    │
│  │  3. Request Approved                                   │    │
│  │  4. Request Rejected                                   │    │
│  │  5. Payment Receipt Submitted                          │    │
│  │  6. Payment Verified                                   │    │
│  │  7. Payment Rejected                                   │    │
│  │  8. Certificate Issued                                 │    │
│  │  9. Payment Reminder (Scheduled)                       │    │
│  └────────────────────────────────────────────────────────┘    │
│                          │                                       │
│                          ▼                                       │
│  ┌────────────────────────────────────────────────────────┐    │
│  │              Laravel Mail System                       │    │
│  │  - Mailable Classes                                    │    │
│  │  - Email Templates (Blade)                             │    │
│  │  - Queue Support                                       │    │
│  └────────────────────────────────────────────────────────┘    │
│                          │                                       │
│                          ▼                                       │
│  ┌────────────────────────────────────────────────────────┐    │
│  │              SMTP Server                               │    │
│  │  - Gmail, SendGrid, Mailgun, etc.                      │    │
│  └────────────────────────────────────────────────────────┘    │
│                          │                                       │
│                          ▼                                       │
│  ┌────────────────────────────────────────────────────────┐    │
│  │              Recipient Email                           │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 8.2 File Storage Integration

```
┌─────────────────────────────────────────────────────────────────┐
│                    FILE STORAGE SYSTEM                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  File Types:                                                    │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  1. Payment Receipts (PDF, JPG, PNG)                   │    │
│  │  2. Generated Certificates (PDF)                       │    │
│  │  3. User Avatars (JPG, PNG)                            │    │
│  │  4. Export Files (PDF, Excel)                          │    │
│  └────────────────────────────────────────────────────────┘    │
│                          │                                       │
│                          ▼                                       │
│  ┌────────────────────────────────────────────────────────┐    │
│  │           Laravel Storage System                       │    │
│  │  - File Validation                                     │    │
│  │  - Secure Upload                                       │    │
│  │  - Path Generation                                     │    │
│  └────────────────────────────────────────────────────────┘    │
│                          │                                       │
│                          ▼                                       │
│  ┌────────────────────────────────────────────────────────┐    │
│  │           Storage/app/public/                          │    │
│  │  ├── receipts/                                         │    │
│  │  ├── certificates/                                     │    │
│  │  ├── avatars/                                          │    │
│  │  └── exports/                                          │    │
│  └────────────────────────────────────────────────────────┘    │
│                          │                                       │
│                          ▼                                       │
│  ┌────────────────────────────────────────────────────────┐    │
│  │           Symbolic Link: public/storage                │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 9. Performance Optimization


### 9.1 Caching Strategy

```
┌─────────────────────────────────────────────────────────────────┐
│                    CACHING ARCHITECTURE                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Level 1: Browser Cache                                         │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  - Static Assets (CSS, JS, Images)                     │    │
│  │  - Cache-Control Headers                               │    │
│  │  - ETags                                               │    │
│  └────────────────────────────────────────────────────────┘    │
│                          │                                       │
│                          ▼                                       │
│  Level 2: Application Cache (Redis)                             │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  - Dashboard Statistics                                │    │
│  │  - Analytics Data                                      │    │
│  │  - User Sessions                                       │    │
│  │  - Query Results                                       │    │
│  └────────────────────────────────────────────────────────┘    │
│                          │                                       │
│                          ▼                                       │
│  Level 3: Database Query Optimization                           │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  - Indexed Columns                                     │    │
│  │  - Eager Loading (N+1 Prevention)                      │    │
│  │  - Query Optimization                                  │    │
│  │  - Database Connection Pooling                         │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 9.2 Database Indexes

**Optimized Tables:**
- `requests`: Indexed on user_id, status, evaluation, created_at
- `payments`: Indexed on request_id, status, payment_date
- `audit_logs`: Indexed on user_id, action, model_type, created_at
- `notifications`: Indexed on user_id, read_at, created_at

### 9.3 Asset Optimization

```
Build Process (Vite):
┌──────────────┐
│ Source Files │
│ - React JSX  │
│ - CSS        │
│ - Images     │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Vite Build   │
│ - Minify     │
│ - Bundle     │
│ - Tree Shake │
│ - Code Split │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Optimized    │
│ Assets       │
│ - Gzipped    │
│ - Hashed     │
└──────────────┘
```

---

## 10. Monitoring & Logging


### 10.1 Audit Logging System

```
┌─────────────────────────────────────────────────────────────────┐
│                    AUDIT LOGGING SYSTEM                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Tracked Actions:                                               │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  - User Login/Logout                                   │    │
│  │  - Request Created/Updated/Deleted                     │    │
│  │  - Payment Verified/Rejected                           │    │
│  │  - Certificate Issued                                  │    │
│  │  - User Actions (CRUD operations)                      │    │
│  │  - Admin Actions                                       │    │
│  └────────────────────────────────────────────────────────┘    │
│                          │                                       │
│                          ▼                                       │
│  ┌────────────────────────────────────────────────────────┐    │
│  │           AuditLogMiddleware                           │    │
│  │  - Capture Request Data                                │    │
│  │  - Log User Action                                     │    │
│  │  - Store IP Address                                    │    │
│  │  - Store User Agent                                    │    │
│  └────────────────────────────────────────────────────────┘    │
│                          │                                       │
│                          ▼                                       │
│  ┌────────────────────────────────────────────────────────┐    │
│  │           AuditLogService                              │    │
│  │  - Format Log Data                                     │    │
│  │  - Store Old/New Values                                │    │
│  │  - Save to Database                                    │    │
│  └────────────────────────────────────────────────────────┘    │
│                          │                                       │
│                          ▼                                       │
│  ┌────────────────────────────────────────────────────────┐    │
│  │           audit_logs Table                             │    │
│  │  - Searchable                                          │    │
│  │  - Filterable                                          │    │
│  │  - Exportable                                          │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 10.2 Application Logging

**Log Channels:**
- `daily`: Daily rotating log files
- `stack`: Multiple channel logging
- `single`: Single log file
- `stderr`: Error output

**Log Levels:**
- Emergency
- Alert
- Critical
- Error
- Warning
- Notice
- Info
- Debug

---

## 11. Deployment Architecture


### 11.1 Production Deployment

```
┌─────────────────────────────────────────────────────────────────┐
│                   PRODUCTION ENVIRONMENT                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │              Load Balancer (Optional)                  │    │
│  │  - SSL Termination                                     │    │
│  │  - Traffic Distribution                                │    │
│  └────────────────────────────────────────────────────────┘    │
│                          │                                       │
│                          ▼                                       │
│  ┌────────────────────────────────────────────────────────┐    │
│  │              Web Server (Apache/Nginx)                 │    │
│  │  - PHP-FPM                                             │    │
│  │  - Static File Serving                                 │    │
│  │  - Reverse Proxy                                       │    │
│  └────────────────────────────────────────────────────────┘    │
│                          │                                       │
│                          ▼                                       │
│  ┌────────────────────────────────────────────────────────┐    │
│  │              Laravel Application                       │    │
│  │  - PHP 8.2+                                            │    │
│  │  - Composer Dependencies                               │    │
│  │  - Environment Configuration                           │    │
│  └────────────────────────────────────────────────────────┘    │
│                          │                                       │
│              ┌───────────┴───────────┐                          │
│              │                       │                          │
│              ▼                       ▼                          │
│  ┌──────────────────┐    ┌──────────────────┐                 │
│  │  MySQL Database  │    │  Redis Cache     │                 │
│  │  - Master/Slave  │    │  - Session Store │                 │
│  │  - Backups       │    │  - Cache Store   │                 │
│  └──────────────────┘    └──────────────────┘                 │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 11.2 Deployment Checklist

**Pre-Deployment:**
- [ ] Run tests
- [ ] Build assets (`npm run build`)
- [ ] Update dependencies
- [ ] Database migrations
- [ ] Environment configuration

**Deployment:**
- [ ] Pull latest code
- [ ] Install dependencies
- [ ] Run migrations
- [ ] Clear caches
- [ ] Restart services
- [ ] Verify deployment

**Post-Deployment:**
- [ ] Monitor logs
- [ ] Check performance
- [ ] Verify functionality
- [ ] User acceptance testing

---

## 12. Backup & Recovery


### 12.1 Backup Strategy

```
┌─────────────────────────────────────────────────────────────────┐
│                    BACKUP ARCHITECTURE                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Database Backups:                                              │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  - Daily Full Backups                                  │    │
│  │  - Hourly Incremental Backups                          │    │
│  │  - 30-day Retention                                    │    │
│  │  - Off-site Storage                                    │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  File Storage Backups:                                          │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  - Daily Backups                                       │    │
│  │  - Receipts, Certificates, Avatars                     │    │
│  │  - 90-day Retention                                    │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  Application Backups:                                           │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  - Code Repository (Git)                               │    │
│  │  - Configuration Files                                 │    │
│  │  - Environment Variables                               │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 12.2 Disaster Recovery Plan

**Recovery Time Objective (RTO):** 4 hours  
**Recovery Point Objective (RPO):** 1 hour

**Recovery Steps:**
1. Restore database from latest backup
2. Restore file storage
3. Deploy application code
4. Configure environment
5. Verify system functionality
6. Resume operations

---

## 13. Scalability Considerations


### 13.1 Horizontal Scaling

```
Current Architecture (Single Server):
┌──────────────────────┐
│   Web + App + DB     │
│   Single Server      │
└──────────────────────┘

Future Scalable Architecture:
┌─────────────────────────────────────────────────────────────────┐
│                    Load Balancer                                 │
└────────┬────────────────────────────────────────────┬───────────┘
         │                                            │
         ▼                                            ▼
┌──────────────────┐                        ┌──────────────────┐
│   Web Server 1   │                        │   Web Server 2   │
│   + App Server   │                        │   + App Server   │
└────────┬─────────┘                        └────────┬─────────┘
         │                                            │
         └────────────────┬───────────────────────────┘
                          │
                          ▼
         ┌────────────────────────────────┐
         │      Database Cluster          │
         │  ┌──────────┐  ┌──────────┐   │
         │  │  Master  │  │  Slave   │   │
         │  └──────────┘  └──────────┘   │
         └────────────────────────────────┘
                          │
                          ▼
         ┌────────────────────────────────┐
         │      Redis Cluster             │
         └────────────────────────────────┘
```

### 13.2 Performance Metrics

**Current Capacity:**
- Concurrent Users: ~100
- Requests/Second: ~50
- Database Queries/Second: ~200
- Average Response Time: <500ms

**Scaling Triggers:**
- CPU Usage > 70%
- Memory Usage > 80%
- Response Time > 1s
- Database Connections > 80%

---

## 14. API Documentation (Future)


### 14.1 RESTful API Structure (If Implemented)

```
Base URL: https://cpdo.example.com/api/v1

Authentication:
- Bearer Token (JWT)
- API Key

Endpoints:

┌─────────────────────────────────────────────────────────────────┐
│                      API ENDPOINTS                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Authentication:                                                │
│  POST   /api/v1/auth/login                                      │
│  POST   /api/v1/auth/logout                                     │
│  POST   /api/v1/auth/refresh                                    │
│                                                                  │
│  Requests:                                                      │
│  GET    /api/v1/requests                                        │
│  POST   /api/v1/requests                                        │
│  GET    /api/v1/requests/{id}                                   │
│  PUT    /api/v1/requests/{id}                                   │
│  DELETE /api/v1/requests/{id}                                   │
│                                                                  │
│  Payments:                                                      │
│  GET    /api/v1/payments                                        │
│  POST   /api/v1/payments                                        │
│  GET    /api/v1/payments/{id}                                   │
│  PUT    /api/v1/payments/{id}/verify                            │
│                                                                  │
│  Certificates:                                                  │
│  GET    /api/v1/certificates                                    │
│  GET    /api/v1/certificates/{id}/download                      │
│                                                                  │
│  Analytics:                                                     │
│  GET    /api/v1/analytics/dashboard                             │
│  GET    /api/v1/analytics/reports                               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 15. System Requirements


### 15.1 Server Requirements

**Minimum Requirements:**
- CPU: 2 Cores
- RAM: 4 GB
- Storage: 50 GB SSD
- OS: Ubuntu 20.04+ / CentOS 8+

**Recommended Requirements:**
- CPU: 4 Cores
- RAM: 8 GB
- Storage: 100 GB SSD
- OS: Ubuntu 22.04 LTS

### 15.2 Software Requirements

**Backend:**
- PHP 8.2 or higher
- Composer 2.x
- MySQL 8.0 or higher
- Redis 7.x (optional but recommended)
- Apache 2.4+ or Nginx 1.18+

**Frontend:**
- Node.js 18.x or higher
- NPM 9.x or higher

**Development:**
- Git 2.x
- Text Editor/IDE (VS Code, PHPStorm)

### 15.3 Browser Support

**Supported Browsers:**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Opera 76+

**Mobile Browsers:**
- Chrome Mobile
- Safari Mobile
- Samsung Internet

---

## 16. Key Features Summary


### 16.1 Core Features

**User Features:**
- ✅ User Registration & Authentication
- ✅ Multi-step Request Form (3 steps)
- ✅ Request Status Tracking
- ✅ Payment Receipt Upload
- ✅ Certificate Download
- ✅ Real-time Notifications
- ✅ Dashboard with Statistics
- ✅ Search & Filter Requests

**Admin Features:**
- ✅ Request Management (Approve/Reject/Edit)
- ✅ Payment Verification
- ✅ Certificate Generation & Issuance
- ✅ User Management
- ✅ Analytics Dashboard
- ✅ Audit Log Tracking
- ✅ PDF Export (Requests, Payments, Users, Audit Logs)
- ✅ Email Notifications
- ✅ Payment Reminders

**System Features:**
- ✅ Role-based Access Control (Admin/User)
- ✅ Audit Logging
- ✅ Email Notifications
- ✅ File Upload & Storage
- ✅ PDF Generation
- ✅ Data Export
- ✅ Performance Optimization
- ✅ Caching
- ✅ Security Features

---

## 17. Technology Decisions & Rationale


### 17.1 Why Laravel?

**Advantages:**
- ✅ Mature, well-documented framework
- ✅ Built-in authentication & authorization
- ✅ Eloquent ORM for database operations
- ✅ Queue system for background jobs
- ✅ Mail system for notifications
- ✅ Large ecosystem & community
- ✅ Security features out-of-the-box
- ✅ Easy to maintain & scale

### 17.2 Why React + Inertia.js?

**Advantages:**
- ✅ Modern, component-based UI
- ✅ SPA experience without API complexity
- ✅ Server-side routing with client-side rendering
- ✅ No need for separate API layer
- ✅ Shared authentication state
- ✅ Fast development cycle
- ✅ Great developer experience

### 17.3 Why MySQL?

**Advantages:**
- ✅ Reliable & proven technology
- ✅ ACID compliance
- ✅ Good performance for relational data
- ✅ Wide hosting support
- ✅ Easy backup & recovery
- ✅ Strong community support

### 17.4 Why Tailwind CSS?

**Advantages:**
- ✅ Utility-first approach
- ✅ Fast development
- ✅ Consistent design system
- ✅ Small production bundle
- ✅ Easy customization
- ✅ Great documentation

---

## 18. Future Enhancements


### 18.1 Planned Features

**Short-term (3-6 months):**
- [ ] Mobile Application (React Native)
- [ ] SMS Notifications
- [ ] Online Payment Gateway Integration
- [ ] Advanced Analytics & Reporting
- [ ] Document Templates Management
- [ ] Bulk Operations

**Medium-term (6-12 months):**
- [ ] RESTful API for Third-party Integration
- [ ] Multi-language Support (i18n)
- [ ] Advanced Search with Elasticsearch
- [ ] Real-time Chat Support
- [ ] Document Versioning
- [ ] Workflow Automation

**Long-term (12+ months):**
- [ ] AI-powered Document Processing
- [ ] Predictive Analytics
- [ ] Mobile App (iOS/Android)
- [ ] Integration with Government Systems
- [ ] Blockchain for Certificate Verification
- [ ] Advanced Reporting & BI Tools

---

## 19. Maintenance & Support


### 19.1 Maintenance Schedule

**Daily:**
- Monitor system logs
- Check error rates
- Verify backup completion
- Monitor disk space

**Weekly:**
- Review performance metrics
- Check security updates
- Review audit logs
- Database optimization

**Monthly:**
- Security patches
- Dependency updates
- Performance tuning
- Capacity planning

**Quarterly:**
- Major updates
- Feature releases
- Security audit
- Disaster recovery testing

### 19.2 Support Levels

**Level 1 - User Support:**
- Password resets
- Basic troubleshooting
- How-to questions
- Account issues

**Level 2 - Technical Support:**
- Bug fixes
- Performance issues
- Integration problems
- Configuration changes

**Level 3 - Development Support:**
- New features
- Architecture changes
- Major updates
- System optimization

---

## 20. Conclusion


The CPDO Management System is a modern, scalable web application built with industry-standard technologies and best practices. The architecture follows a modular, maintainable design that allows for easy updates and feature additions.

### Key Architectural Strengths:

1. **Modular Design:** Components are separated by concern, making maintenance easier
2. **Security First:** Multiple layers of security protection
3. **Performance Optimized:** Caching, indexing, and query optimization
4. **Scalable:** Can grow from single server to distributed architecture
5. **Maintainable:** Clean code, documentation, and audit trails
6. **User-Friendly:** Modern UI with responsive design
7. **Reliable:** Backup systems and disaster recovery plans

### System Statistics:

- **Total Components:** 59 modular React components
- **Code Reduction:** 63% from original monolithic design
- **Backend Models:** 10+ Eloquent models
- **Database Tables:** 12+ tables with relationships
- **API Endpoints:** 50+ routes
- **Email Templates:** 10+ notification types
- **Security Layers:** 4 levels of protection

---

## Appendix

### A. Glossary

- **SPA:** Single Page Application
- **MVC:** Model-View-Controller
- **ORM:** Object-Relational Mapping
- **CRUD:** Create, Read, Update, Delete
- **RBAC:** Role-Based Access Control
- **JWT:** JSON Web Token
- **SMTP:** Simple Mail Transfer Protocol
- **SSL/TLS:** Secure Sockets Layer / Transport Layer Security
- **CSRF:** Cross-Site Request Forgery
- **XSS:** Cross-Site Scripting

### B. References

- Laravel Documentation: https://laravel.com/docs
- React Documentation: https://react.dev
- Inertia.js Documentation: https://inertiajs.com
- Tailwind CSS Documentation: https://tailwindcss.com
- MySQL Documentation: https://dev.mysql.com/doc

### C. Contact Information

**System Administrator:** [Contact Details]  
**Development Team:** [Contact Details]  
**Support Email:** [Email Address]  
**Emergency Contact:** [Phone Number]

---

**Document Version:** 1.0  
**Last Updated:** January 29, 2026  
**Author:** System Architecture Team  
**Status:** Production Ready

---

*This document is confidential and intended for authorized personnel only.*
