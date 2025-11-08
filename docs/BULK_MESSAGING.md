# Bulk Messaging Feature

## Overview
The bulk messaging feature allows landlords to send messages to multiple tenants at once, with recipient filtering, delivery tracking, and tenant opt-out functionality.

## Features

### 1. Recipient Selection
- **All Tenants**: Send to all tenants who have conversations with the landlord
- **By Property**: Filter recipients by specific properties
- **Custom Filters**: Advanced filtering options (coming soon)

### 2. Message Composition
- Subject line for clear communication
- Rich text message body
- Recipient count preview
- Scheduling option (future enhancement)

### 3. Delivery Tracking
- Real-time delivery status
- Sent/Delivered/Failed counts
- Individual recipient status tracking
- Campaign history dashboard

### 4. Tenant Opt-Out
Tenants can manage their message preferences:
- Bulk messages (general announcements)
- Marketing emails
- Property updates

## Database Schema

### bulk_messages
```sql
- id: UUID (primary key)
- landlord_id: UUID (foreign key)
- subject: TEXT
- message: TEXT
- recipient_filter: JSONB
- total_recipients: INTEGER
- sent_count: INTEGER
- delivered_count: INTEGER
- failed_count: INTEGER
- status: TEXT (draft, scheduled, sending, sent, failed)
- scheduled_for: TIMESTAMPTZ
- sent_at: TIMESTAMPTZ
- completed_at: TIMESTAMPTZ
```

### bulk_message_recipients
```sql
- id: UUID (primary key)
- bulk_message_id: UUID (foreign key)
- user_id: UUID (foreign key)
- conversation_id: UUID (foreign key)
- status: TEXT (pending, sent, delivered, failed, unsubscribed)
- error_message: TEXT
- sent_at: TIMESTAMPTZ
- delivered_at: TIMESTAMPTZ
```

### tenant_preferences
```sql
- id: UUID (primary key)
- user_id: UUID (foreign key, unique)
- allow_bulk_messages: BOOLEAN (default: true)
- allow_marketing_emails: BOOLEAN (default: true)
- allow_property_updates: BOOLEAN (default: true)
```

## Usage

### For Landlords

1. **Access Bulk Messages**
   - Navigate to Landlord Dashboard
   - Click "Bulk Messages" button
   - Or go to Settings > Landlord Portal > Bulk Messages

2. **Create New Campaign**
   - Click "+ New Message"
   - Enter subject and message
   - Select recipients (All Tenants or By Property)
   - Review recipient count
   - Click "Send Now"

3. **Track Campaigns**
   - View all sent campaigns in the dashboard
   - See delivery statistics for each campaign
   - Monitor sent/delivered/failed counts

### For Tenants

1. **Manage Preferences**
   - Go to Settings > Message Preferences
   - Toggle bulk message preferences
   - Choose which types of messages to receive

2. **Opt-Out Options**
   - Bulk Messages: General announcements
   - Marketing Emails: Promotional content
   - Property Updates: Maintenance and events

Note: Direct messages and important account notifications are always delivered.

## Edge Function

### send-bulk-message
Handles bulk message sending with opt-out filtering:

```typescript
POST /functions/v1/send-bulk-message
Body: {
  landlordId: string,
  subject: string,
  message: string,
  recipientFilter: {
    type: 'all' | 'properties' | 'custom',
    property_ids?: string[]
  },
  scheduledFor?: string
}
```

**Process:**
1. Fetch conversations based on filter
2. Check tenant preferences for opt-outs
3. Create bulk message record
4. Create recipient records
5. Send messages to valid recipients
6. Update delivery statistics

## Best Practices

### For Landlords
1. **Be Respectful**: Don't overuse bulk messaging
2. **Clear Subject Lines**: Help tenants understand the message purpose
3. **Relevant Content**: Only send messages relevant to recipients
4. **Timing**: Send during reasonable hours
5. **Follow-Up**: Monitor delivery status and respond to replies

### Message Examples

**Property Update:**
```
Subject: Building Maintenance - Water Shut Off
Message: Dear tenants, we will be performing maintenance on the water system 
on Saturday, Nov 15th from 9 AM to 2 PM. Please plan accordingly.
```

**Community Announcement:**
```
Subject: Holiday Building Closure
Message: Our office will be closed Dec 24-26 for the holidays. 
For emergencies, please call [emergency number].
```

## Future Enhancements

1. **Scheduled Sending**: Set future delivery times
2. **Message Templates**: Quick-insert common messages
3. **Advanced Filters**: Filter by lease status, move-in date, etc.
4. **A/B Testing**: Test different message versions
5. **Analytics**: Open rates, response rates, engagement metrics
6. **Rich Media**: Attach images, documents, links
7. **Segmentation**: Save recipient groups for reuse

## Security & Privacy

- Only landlords can send bulk messages
- Tenants can opt-out at any time
- Preferences are respected automatically
- All messages are logged for accountability
- RLS policies protect tenant data

## Troubleshooting

**Messages not sending:**
- Check landlord has active conversations
- Verify recipients haven't opted out
- Check edge function logs for errors

**Low delivery rate:**
- Many tenants may have opted out
- Check recipient filter settings
- Verify conversation records exist

**Tenants not receiving:**
- Check their preference settings
- Verify conversation exists
- Check message delivery status
