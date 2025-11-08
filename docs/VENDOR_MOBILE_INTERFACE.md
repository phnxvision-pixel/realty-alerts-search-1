# Vendor Mobile Interface Documentation

## Overview
Complete mobile interface for contractors and service providers to manage maintenance jobs, submit bids, track earnings, and communicate with landlords.

## Features

### 1. Vendor Registration
**Screen**: `/vendor/register`
- Business name, contact info, specialties
- Hourly rate and service area
- Bio and credentials
- Multi-specialty selection (8 categories)

### 2. Job Dashboard
**Screen**: `/vendor/dashboard`
- View all assigned jobs
- Filter by status (assigned/in_progress/completed)
- Pull-to-refresh functionality
- Quick job details preview
- Navigate to job details

### 3. Job Detail & Management
**Screen**: `/vendor/job/[id]`
- Full job description and requirements
- Priority and status indicators
- Property location details
- Add work notes
- Upload completion photos (multiple)
- Update job status (start/complete)
- Real-time status sync

### 4. Earnings Dashboard
**Screen**: `/vendor/earnings`
- Total earnings overview
- Current month earnings
- Pending vs paid breakdown
- Payment history list
- Payment status tracking
- Date-based filtering

### 5. Job Calendar
**Component**: `VendorJobCalendar`
- Monthly calendar view
- Visual indicators for scheduled jobs
- Month navigation
- Job dots on scheduled dates
- Integrated with job assignments

## Database Tables

### vendor_notifications
```sql
- id (UUID)
- vendor_id (UUID, FK to vendors)
- type (TEXT)
- title (TEXT)
- message (TEXT)
- data (JSONB)
- read (BOOLEAN)
- created_at (TIMESTAMP)
```

### vendor_availability
```sql
- id (UUID)
- vendor_id (UUID, FK to vendors)
- date (DATE)
- available (BOOLEAN)
- notes (TEXT)
- created_at (TIMESTAMP)
```

## Edge Functions

### vendor-register
**Purpose**: Register new vendor accounts
**Input**: businessName, phone, email, specialties, hourlyRate, serviceArea, bio
**Process**:
1. Create vendor record
2. Update user record with vendor status
3. Link user to vendor profile

### vendor-update-job-status
**Purpose**: Update maintenance job status
**Input**: requestId, status, notes, completionPhotos
**Process**:
1. Verify vendor authorization
2. Update maintenance request
3. Add completion notes and photos
4. Notify landlord of status change
5. Track completion timestamp

## User Flow

### New Vendor Onboarding
1. Sign up as regular user
2. Navigate to vendor registration
3. Fill in business details
4. Select specialties
5. Submit registration
6. Redirect to vendor dashboard

### Job Management Flow
1. View assigned jobs in dashboard
2. Filter by status
3. Tap job to view details
4. Start job (updates to in_progress)
5. Add work notes during job
6. Upload completion photos
7. Mark as completed
8. Landlord receives notification

### Earnings Tracking
1. View earnings dashboard
2. See total and monthly stats
3. Check pending payments
4. Review payment history
5. Track payment status changes

## Integration Points

### With Landlord System
- Receives job assignments
- Sends status updates
- Submits completion photos
- Receives payments

### With Maintenance System
- Updates maintenance_requests table
- Links to vendor_assignments
- Tracks job progress
- Stores completion data

### With Payment System
- Tracks vendor_payments
- Shows pending/paid status
- Calculates earnings
- Integrates with Stripe payouts

## Mobile Optimizations

### Performance
- Lazy loading of job lists
- Image compression for uploads
- Cached vendor data
- Optimistic UI updates

### UX Features
- Pull-to-refresh
- Swipe gestures
- Touch-friendly buttons
- Clear status indicators
- Photo gallery view

### Offline Support
- Cache job data
- Queue status updates
- Sync when online
- Local photo storage

## Notifications

### Vendor Receives
- New job assignments
- Job cancellations
- Payment confirmations
- Rating updates
- Message from landlords

### Vendor Triggers
- Job status changes
- Completion notifications
- Bid submissions
- Availability updates

## Security

### Authentication
- Required for all vendor operations
- Vendor ID verification
- Job access control
- Payment data protection

### Authorization
- Vendors can only view assigned jobs
- Cannot modify other vendor data
- Secure photo uploads
- Protected payment info

## Future Enhancements
- In-app messaging with landlords
- Video call support
- Digital signatures for work orders
- Inventory management
- Time tracking
- Route optimization
- Team management for multi-person crews
