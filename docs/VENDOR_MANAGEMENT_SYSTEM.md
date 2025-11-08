# Vendor Management System

## Overview
Complete vendor management system for maintenance requests with automatic assignment, bidding, ratings, and payment tracking.

## Database Tables

### vendors
- Contractor/service provider profiles
- Specialties, ratings, job history
- Contact information and rates
- Insurance verification status

### vendor_assignments
- Links vendors to maintenance requests
- Assignment types: automatic, manual, bid_accepted
- Status tracking: assigned, in_progress, completed
- Completion timestamps

### vendor_bids
- Bidding system for maintenance jobs
- Bid amounts with materials/labor breakdown
- Estimated hours and completion dates
- Status: pending, accepted, rejected

### vendor_ratings
- 5-star rating system
- Quality, timeliness, communication, value ratings
- Review text and hire-again preference
- Automatic average calculation

### vendor_payments
- Payment tracking for completed work
- Stripe integration support
- Payment status tracking
- Historical payment records

## Edge Functions

### manage-vendors
CRUD operations for vendor profiles
- Create, update, delete, list vendors
- Landlord-specific vendor lists

### assign-vendor
Automatic and manual vendor assignment
- Auto-assign based on specialty and rating
- Manual assignment by landlord
- Updates maintenance request status

### manage-vendor-bids
Complete bidding workflow
- Submit bids with cost breakdown
- Accept/reject bids
- Auto-reject competing bids on acceptance
- Create vendor assignment on acceptance

## Features

### Automatic Assignment
- Matches vendors by specialty
- Prioritizes by rating
- Updates job counts

### Bidding System
- Multiple vendors can bid
- Cost breakdown (materials + labor)
- Estimated completion dates
- One-click accept/reject

### Performance Tracking
- Average ratings calculation
- Job completion statistics
- Multi-criteria ratings
- Review history

### Payment Management
- Track vendor payments
- Stripe integration ready
- Payment history
- Status tracking

## Usage

### Add Vendor
```typescript
const { data } = await supabase.functions.invoke('manage-vendors', {
  body: {
    action: 'create',
    vendorData: {
      name: 'John Smith',
      email: 'john@example.com',
      phone: '555-0100',
      specialties: ['plumbing', 'hvac'],
      hourly_rate: 75.00
    }
  }
});
```

### Auto-Assign Vendor
```typescript
const { data } = await supabase.functions.invoke('assign-vendor', {
  body: {
    maintenanceRequestId: 'request-id',
    assignmentType: 'automatic'
  }
});
```

### Submit Bid
```typescript
const { data } = await supabase.functions.invoke('manage-vendor-bids', {
  body: {
    action: 'submit',
    bidData: {
      maintenance_request_id: 'request-id',
      vendor_id: 'vendor-id',
      bid_amount: 500.00,
      materials_cost: 200.00,
      labor_cost: 300.00,
      estimated_hours: 4,
      description: 'Fix leaking pipe'
    }
  }
});
```

## Specialties
- plumbing
- electrical
- hvac
- carpentry
- painting
- landscaping
- appliance_repair
- general

## Rating System
- Overall rating (1-5 stars)
- Quality rating
- Timeliness rating
- Communication rating
- Value rating
- Would hire again (yes/no)

## Notifications
- Vendor assigned to job
- New bid received
- Bid accepted/rejected
- Job completed
- Payment received
