# SendGrid Email Integration for Message Notifications

## Overview
Premium users receive email notifications when they get new messages. This document explains the email integration with SendGrid.

## Features
- **Email Templates**: Beautiful HTML emails with message preview
- **Delivery Tracking**: Track email status (sent, delivered, failed, bounced)
- **Premium Only**: Email notifications only for premium/pro subscribers
- **User Preferences**: Users can enable/disable email notifications

## Email Template
The email includes:
- WohnAgent branding with gradient header
- Sender name and email
- Property title
- Message preview (truncated to 200 chars)
- Direct link to conversation
- Settings link to manage preferences

## SendGrid Configuration

### Environment Variable
The `SENDGRID_API_KEY` is already configured in Supabase edge functions.

### Sender Email
Emails are sent from: `notifications@wohnagent.com`

**Important**: You must verify this sender email in SendGrid:
1. Go to SendGrid Dashboard → Settings → Sender Authentication
2. Add and verify `notifications@wohnagent.com`
3. Complete domain authentication for better deliverability

## Edge Function Integration

The `send-message-notification` function handles email sending:

```typescript
// Check if user is premium and has email enabled
const isPremium = ['premium', 'pro'].includes(subscription_tier);
if (email_enabled && isPremium && recipient_email) {
  // Send via SendGrid API
  // Log to notification_history with tracking
}
```

## Notification History Tracking

Email delivery is tracked in `notification_history` table:

```sql
{
  email_status: 'sent' | 'delivered' | 'failed' | 'bounced',
  email_sent_at: timestamp,
  email_delivered_at: timestamp,
  email_error: error_message,
  sendgrid_message_id: sendgrid_id
}
```

## Webhook for Delivery Status

Create a webhook endpoint to receive SendGrid events:

### Webhook URL
`https://[your-project].supabase.co/functions/v1/sendgrid-webhook`

### Events to Track
- `delivered`: Email successfully delivered
- `bounce`: Email bounced
- `dropped`: Email dropped by SendGrid
- `spam_report`: Marked as spam

### Implementation
```typescript
// Update notification_history based on webhook events
if (event === 'delivered') {
  UPDATE notification_history 
  SET email_status = 'delivered',
      email_delivered_at = NOW()
  WHERE sendgrid_message_id = event.sg_message_id;
}
```

## Testing

### Test Email Sending
1. Enable email notifications in message settings
2. Ensure user has premium subscription
3. Send a message to the user
4. Check SendGrid dashboard for delivery status

### Verify Tracking
```sql
SELECT * FROM notification_history 
WHERE email_status IS NOT NULL 
ORDER BY created_at DESC;
```

## Best Practices

1. **Rate Limiting**: SendGrid has rate limits based on your plan
2. **Bounce Handling**: Automatically disable emails for bounced addresses
3. **Unsubscribe**: Include unsubscribe link in emails
4. **Testing**: Use SendGrid sandbox mode for testing
5. **Monitoring**: Set up alerts for high bounce rates

## Troubleshooting

### Email Not Sending
- Verify SendGrid API key is set
- Check sender email is verified
- Confirm user is premium tier
- Check email_enabled preference

### Delivery Issues
- Check SendGrid activity feed
- Review bounce/spam reports
- Verify recipient email is valid
- Check email_error field in notification_history
