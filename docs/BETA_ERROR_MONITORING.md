# Beta Testing Error Monitoring Guide

## Overview
Comprehensive crash reporting and error tracking system for beta testing phase.

## Features Implemented

### 1. Automatic Crash Detection
- Global error boundary catches all React component errors
- Native crash handler captures fatal JavaScript errors
- Automatic severity classification (warning, error, critical)

### 2. Stack Trace Collection
- Full stack traces for all errors
- Source maps for readable error locations
- Platform information (iOS/Android)

### 3. User Context Capture
- User ID and email
- Current screen/route
- User actions and metadata
- Device and platform info

### 4. Breadcrumb Tracking
- Last 20 user actions before crash
- Navigation history
- API calls and responses
- User interactions (button clicks, form submissions)

### 5. Real-Time Alerts
- Immediate email for critical errors
- 1-hour throttling per unique error
- Configurable alert recipients
- Daily digest summaries

## For Beta Testers

### What Gets Tracked
- App crashes and errors
- Your actions leading to the error
- Screen you were on
- Device and OS version

### Privacy
- No personal data beyond email (if logged in)
- No sensitive form data captured
- All data stored securely in Supabase

## For Developers

### Setup Checklist
1. ✅ Database tables created
2. ✅ Edge functions deployed
3. ⚠️ Configure developer emails
4. ⚠️ Update SendGrid sender email
5. ⚠️ Set up daily digest cron job

### Configure Developer Emails
```typescript
import { ErrorAlertConfig } from '@/app/lib/error-alert-config';

// Add developers
await ErrorAlertConfig.addDeveloper('dev@example.com', 'all');
await ErrorAlertConfig.addDeveloper('lead@example.com', 'critical');
await ErrorAlertConfig.addDeveloper('manager@example.com', 'digest_only');
```

### Alert Levels
- **all**: Receive immediate alerts for all critical errors + daily digest
- **critical**: Only immediate alerts for critical errors + daily digest
- **digest_only**: Only daily digest summary

### Manual Testing
```typescript
// Test error tracking
import { errorTracker } from '@/app/lib/error-tracking';

// Add breadcrumbs
errorTracker.addBreadcrumb('navigation', 'Opened listing details');
errorTracker.addBreadcrumb('user_action', 'Clicked apply button');

// Set user context
errorTracker.setUserContext({
  userId: 'test-user-123',
  userEmail: 'test@example.com',
  screen: 'ListingDetail'
});

// Trigger test error
await errorTracker.captureError(
  new Error('Test error for monitoring'),
  { action: 'test' },
  'critical'
);
```

### Schedule Daily Digest
Add to your cron scheduler (e.g., GitHub Actions, Vercel Cron):

```yaml
# .github/workflows/daily-digest.yml
name: Daily Error Digest
on:
  schedule:
    - cron: '0 9 * * *' # 9 AM daily
jobs:
  send-digest:
    runs-on: ubuntu-latest
    steps:
      - name: Send digest
        run: |
          curl -X POST ${{ secrets.SUPABASE_URL }}/functions/v1/send-daily-error-digest \
            -H "Authorization: Bearer ${{ secrets.SUPABASE_ANON_KEY }}"
```

### Monitoring Dashboard
View errors in Supabase:
```sql
-- Recent errors
SELECT * FROM error_logs 
ORDER BY timestamp DESC 
LIMIT 50;

-- Error frequency
SELECT 
  message,
  COUNT(*) as count,
  MAX(timestamp) as last_seen
FROM error_logs
WHERE timestamp > NOW() - INTERVAL '7 days'
GROUP BY message
ORDER BY count DESC;

-- Errors by user
SELECT 
  user_context->>'userId' as user_id,
  COUNT(*) as error_count
FROM error_logs
WHERE timestamp > NOW() - INTERVAL '7 days'
GROUP BY user_context->>'userId'
ORDER BY error_count DESC;
```

## Best Practices

### For Development
1. Add breadcrumbs before risky operations
2. Set user context on login
3. Use appropriate severity levels
4. Test error tracking in staging

### For Beta Testing
1. Monitor alerts daily
2. Review digest summaries
3. Prioritize critical errors
4. Track error trends over time
5. Update beta testers on fixes

### Error Severity Guidelines
- **critical**: Crashes, payment failures, data loss
- **error**: Feature failures, API errors, validation issues
- **warning**: Deprecation notices, performance issues

## Troubleshooting

### Not Receiving Alerts?
1. Check developer_emails table
2. Verify SendGrid API key
3. Check spam folder
4. Test with manual error

### Too Many Alerts?
1. Adjust alert_level to 'critical' or 'digest_only'
2. Fix high-frequency errors first
3. Increase throttling threshold

### Missing Context?
1. Ensure setUserContext called on login
2. Add more breadcrumbs
3. Include relevant metadata in captureError
