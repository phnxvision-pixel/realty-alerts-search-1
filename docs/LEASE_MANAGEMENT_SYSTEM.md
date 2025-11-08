# Lease Management System

## Overview
Complete lease management system with digital signing, rent payments, maintenance requests, and automated reminders.

## Features

### 1. Digital Lease Signing
- **Two-party signature workflow**: Both tenant and landlord must sign
- **Status tracking**: Draft → Pending Signature → Active
- **Automatic activation**: Lease becomes active when both parties sign
- **Signature timestamps**: Records when each party signed
- **Push notifications**: Alerts when lease is fully executed

### 2. Rent Payment System
- **Stripe integration**: Secure payment processing
- **Automatic payment tracking**: Updates status on successful payment
- **Late fee calculation**: Automatic late fees for overdue payments
- **Payment history**: Complete record of all rent payments
- **Multiple payment methods**: Stripe, bank transfer, cash, check
- **Payment reminders**: Automated notifications before due date

### 3. Maintenance Request System
- **Priority levels**: Emergency, High, Medium, Low
- **Category tracking**: Plumbing, Electrical, Heating, Appliance, Structural, Other
- **Image attachments**: Upload photos of maintenance issues
- **Status workflow**: Submitted → Acknowledged → In Progress → Completed
- **Real-time notifications**: Landlord notified immediately on submission
- **Cost tracking**: Record maintenance costs
- **Scheduling**: Schedule maintenance appointments

### 4. Lease Renewal System
- **Automatic reminders**: Notifications 60, 30, and 7 days before lease expiration
- **Auto-renewal option**: Optional automatic lease renewal
- **Renewal tracking**: Monitor upcoming lease expirations

## Database Schema

### Leases Table
- `id`: UUID primary key
- `apartment_id`: Reference to apartment
- `tenant_id`: Reference to tenant user
- `landlord_id`: Reference to landlord
- `start_date`, `end_date`: Lease period
- `monthly_rent`, `security_deposit`: Financial terms
- `status`: draft, pending_signature, active, expired, terminated
- `signed_by_tenant`, `signed_by_landlord`: Signature status
- `tenant_signature_date`, `landlord_signature_date`: Signature timestamps
- `auto_renew`: Automatic renewal flag

### Rent Payments Table
- `id`: UUID primary key
- `lease_id`: Reference to lease
- `amount`: Payment amount
- `due_date`, `paid_date`: Payment dates
- `status`: pending, paid, late, failed
- `stripe_payment_intent_id`: Stripe integration
- `late_fee`: Late fee amount

### Maintenance Requests Table
- `id`: UUID primary key
- `lease_id`: Reference to lease
- `title`, `description`: Request details
- `category`: Type of maintenance
- `priority`: Urgency level
- `status`: Request workflow status
- `images`: Array of image URLs
- `scheduled_date`, `completed_date`: Scheduling
- `cost`: Maintenance cost

## Edge Functions

### create-rent-payment
Creates Stripe payment intent and rent payment record.
```typescript
POST /functions/v1/create-rent-payment
Body: { leaseId, amount, dueDate }
Returns: { clientSecret, paymentId }
```

### sign-lease
Handles digital lease signing by tenants and landlords.
```typescript
POST /functions/v1/sign-lease
Body: { leaseId, userId, userType, signatureData }
Returns: { success, leaseActive }
```

### submit-maintenance-request
Creates maintenance request and notifies landlord.
```typescript
POST /functions/v1/submit-maintenance-request
Body: { leaseId, title, description, category, priority, images }
Returns: { success, request }
```

## Storage Buckets
- `lease-documents`: Lease agreements and related documents (private)
- `maintenance-images`: Maintenance request photos (private)

## Usage Examples

### Tenant: Pay Rent
1. View upcoming rent payments in Leases tab
2. Click "Pay Now" on pending payment
3. Complete Stripe payment flow
4. Payment status automatically updates to "paid"
5. Landlord receives notification

### Tenant: Submit Maintenance Request
1. Navigate to Maintenance tab
2. Click "New Request"
3. Fill in title, description, category, priority
4. Upload photos (optional)
5. Submit request
6. Landlord receives immediate notification

### Landlord: Sign Lease
1. Create lease agreement
2. Send to tenant for signature
3. Tenant signs digitally
4. Landlord signs to activate lease
5. Both parties receive confirmation

## Notifications
- **New maintenance request**: Landlord notified immediately
- **Lease signed**: Both parties notified when fully executed
- **Rent payment due**: Tenant notified 3 days before due date
- **Rent payment received**: Landlord notified on payment
- **Lease expiring**: Both parties notified 60, 30, 7 days before expiration

## Security
- Row Level Security (RLS) enabled on all tables
- Tenants can only view their own leases and payments
- Landlords can only view leases for their properties
- Private storage buckets for sensitive documents
- Stripe secure payment processing

## Future Enhancements
- Automatic rent collection with saved payment methods
- Lease template builder
- Maintenance vendor management
- Expense tracking and reporting
- Lease comparison tools
