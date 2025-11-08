# In-App Payment System

## Overview
Complete payment system for landlord subscriptions, listing promotions, and premium features using Stripe and Google Play Billing.

## Features

### Payment Methods
- **Stripe**: Web-based checkout for subscriptions and promotions
- **Google Play Billing**: In-app purchases for Android users

### Subscription Plans
1. **Basic** (Free): 1 listing, basic support
2. **Featured** ($29.99/mo): 5 listings, featured placement, analytics
3. **Premium** ($49.99/mo): Unlimited listings, top placement, 24/7 support

### Listing Promotions
- **Boost** ($9.99-$29.99): Increased visibility
- **Featured** ($14.99-$39.99): Featured placement
- **Premium** ($19.99-$49.99): Top placement + analytics

## Database Tables

### payment_history
Tracks all payments with status, method, and metadata.

### invoices
Generated invoices for completed payments.

### listing_promotions
Active promotions with impression/click tracking.

### subscription_history
Historical record of all subscriptions.

## Edge Functions

### verify-google-play-purchase
Verifies Google Play purchases and creates payment records.

### purchase-listing-promotion
Handles listing promotion purchases via Stripe or direct payment.

### stripe-webhook
Processes Stripe webhook events for subscriptions and promotions.

## Usage

### Subscribe to Plan
```typescript
const { data } = await supabase.functions.invoke('create-landlord-checkout', {
  body: { landlordId, tier: 'premium' }
});
```

### Purchase Promotion
```typescript
const { data } = await supabase.functions.invoke('purchase-listing-promotion', {
  body: { apartmentId, landlordId, promotionType: 'featured', duration: 30 }
});
```

### View Payment History
Navigate to `/landlord/payment-history` to see all transactions with filtering.

## Components

- **PaymentHistoryList**: Display payment transactions
- **PromotionPurchaseModal**: Purchase listing promotions
- **SubscriptionManager**: Manage subscription, view history, upgrade/cancel

## Screens

- `/landlord/payment-history`: Full payment history with filters
- `/landlord/subscription`: Plans, current subscription, management
- `/landlord/dashboard`: Quick access to payments and subscription
