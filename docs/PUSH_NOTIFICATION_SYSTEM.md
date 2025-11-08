# Push Notification System

## Overview
Comprehensive push notification system using Expo Push Notifications with Firebase Cloud Messaging support.

## Database Tables

### notification_preferences
Stores user notification preferences for all notification types:
- Message notifications (new_messages, message_sound)
- Application notifications (application_status_updates, application_messages)
- Property notifications (favorite_price_changes, saved_search_matches, new_listings_in_area)
- Landlord notifications (new_applications, application_deadlines, payment_received)
- Quiet hours settings
- Delivery preferences (instant, daily digest, weekly digest)

### scheduled_notifications
Stores notifications scheduled for later delivery (quiet hours, digests)

### notification_log
Logs all sent notifications for analytics and history

## Edge Functions

### send-push-notification
Universal notification sender with:
- Preference checking
- Quiet hours support
- Multi-device support
- Notification logging

### notify-application-update
Sends notifications when application status changes

## Components

### NotificationPreferences
Comprehensive UI for managing all notification settings

### NotificationHistory
View notification history with filtering

### NotificationService
Helper service for triggering notifications from anywhere in the app

## Usage

```typescript
import { NotificationService } from '@/app/lib/notification-service';

// Send custom notification
await NotificationService.sendCustomNotification(
  userId, 
  'new_messages', 
  'New Message', 
  'You have a new message'
);

// Schedule notification
await NotificationService.scheduleNotification(
  userId,
  'reminder',
  'Reminder',
  'Check your applications',
  new Date(Date.now() + 3600000)
);
```

## Features
- Multi-device support
- Quiet hours scheduling
- Notification preferences per type
- Notification history with analytics
- Real-time delivery
- Badge count management
- Sound control
- Digest options (daily/weekly)
