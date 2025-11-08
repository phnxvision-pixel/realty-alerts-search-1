# Error Tracking & Crash Reporting Setup

## Overview
Lightweight error tracking system with breadcrumb tracking, user context, and Supabase storage.

## Database Setup

```sql
CREATE TABLE error_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  message TEXT NOT NULL,
  stack TEXT,
  user_context JSONB,
  breadcrumbs JSONB,
  timestamp TIMESTAMPTZ NOT NULL,
  platform TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_error_logs_timestamp ON error_logs(timestamp DESC);
CREATE INDEX idx_error_logs_user ON error_logs((user_context->>'userId'));
```

## Usage

```typescript
import { errorTracker } from '@/app/lib/error-tracking';

// Set user context
errorTracker.setUserContext({
  userId: user.id,
  userEmail: user.email,
  screen: 'ListingDetail'
});

// Add breadcrumbs
errorTracker.addBreadcrumb('navigation', 'Viewed listing', { listingId: '123' });
errorTracker.addBreadcrumb('user_action', 'Clicked apply button');

// Capture errors
try {
  // risky operation
} catch (error) {
  await errorTracker.captureError(error, { action: 'submit_application' });
}
```

## Beta Testing Integration
All errors during beta automatically logged with full context for debugging.
