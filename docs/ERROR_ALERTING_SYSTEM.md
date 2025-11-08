# Automated Error Alerting System

## Overview
Comprehensive email alert system for critical errors during beta testing with spam prevention and daily digests.

## Features
- **Immediate Alerts**: Critical errors trigger instant email notifications
- **Spam Prevention**: 1-hour throttling per unique error signature
- **Daily Digests**: Summary reports of all errors in last 24 hours
- **Severity Levels**: warning, error, critical
- **Developer Management**: Configure who receives which alerts

## Database Tables

### error_logs
Stores all application errors with full context
- `severity`: warning, error, critical
- `user_context`: User info and screen
- `breadcrumbs`: User actions leading to error
- `stack`: Full stack trace

### error_alert_tracking
Prevents alert spam by tracking sent alerts
- `error_signature`: Unique error identifier
- `last_alert_sent`: Timestamp of last alert
- `alert_count`: Total alerts sent

### developer_emails
Manages alert recipients
- `email`: Developer email address
- `alert_level`: 'all', 'critical', 'digest_only'
- `active`: Enable/disable alerts

## Setup

### 1. Configure Developer Emails
```sql
INSERT INTO developer_emails (email, alert_level) 
VALUES 
  ('lead@example.com', 'all'),
  ('dev@example.com', 'critical'),
  ('manager@example.com', 'digest_only');
```

### 2. Usage in App
```typescript
import { errorTracker } from '@/app/lib/error-tracking';

// Critical errors (immediate alert)
try {
  await paymentProcess();
} catch (error) {
  await errorTracker.captureError(error, 
    { action: 'payment' }, 
    'critical'
  );
}

// Regular errors (logged, included in digest)
try {
  await loadData();
} catch (error) {
  await errorTracker.captureError(error, 
    { action: 'data_load' }, 
    'error'
  );
}
```

### 3. Schedule Daily Digest
Set up a cron job to call:
```bash
curl -X POST https://[project].supabase.co/functions/v1/send-daily-error-digest \
  -H "Authorization: Bearer [anon-key]"
```

Recommended: Daily at 9 AM

## Alert Thresholds
- **Critical**: Immediate (throttled to 1/hour per error)
- **Error**: Digest only
- **Warning**: Digest only

## Email Content

### Immediate Alert
- Error message and severity
- Platform and timestamp
- User context
- Full stack trace
- Breadcrumb trail

### Daily Digest
- Total error count
- Breakdown by severity
- Breakdown by platform
- Top 10 most frequent errors
- Link to dashboard

## Testing
```typescript
// Test critical alert
await errorTracker.captureError(
  new Error('Test critical error'),
  { screen: 'TestScreen' },
  'critical'
);

// Test daily digest
await supabase.functions.invoke('send-daily-error-digest');
```

## Monitoring
Check alert effectiveness:
```sql
SELECT 
  error_signature,
  alert_count,
  last_alert_sent
FROM error_alert_tracking
ORDER BY alert_count DESC;
```
