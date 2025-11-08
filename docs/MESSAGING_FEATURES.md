# Enhanced Messaging System Documentation

## Overview
The messaging system now includes advanced features for real-time communication between tenants and landlords.

## Features Implemented

### 1. Read Receipts
- **Single Checkmark**: Message sent
- **Double Checkmark (Gray)**: Message delivered
- **Double Checkmark (Green)**: Message read
- Messages are automatically marked as read when the recipient views them
- Read status updates in real-time

### 2. Typing Indicators
- Shows "Typing..." indicator when the other user is typing
- Automatically hides after 2 seconds of inactivity
- Real-time updates via Supabase subscriptions

### 3. Online/Offline Status
- Green dot indicates user is online
- "Last seen X minutes/hours/days ago" for offline users
- Presence updates automatically when users open/close the app
- Real-time presence tracking

### 4. File Uploads in Chat
- Attach button allows uploading documents and images
- Supported file types: all document types and images
- Files stored in Supabase Storage (application-documents bucket)
- File messages show icon and filename
- Tap to view/download files

### 5. Push Notifications
- Instant notifications for new messages
- Includes message preview and sender info
- Tap notification to open conversation
- Uses Expo Push Notifications

## Database Schema

### Messages Table Extensions
```sql
- read_at: TIMESTAMP (null = unread, timestamp = read time)
- message_type: TEXT ('text', 'file', 'image')
- file_url: TEXT (Supabase Storage URL)
- file_name: TEXT (original filename)
- file_size: INTEGER (bytes)
```

### Typing Indicators Table
```sql
CREATE TABLE typing_indicators (
  id UUID PRIMARY KEY,
  conversation_id UUID REFERENCES conversations(id),
  user_id UUID REFERENCES users(id),
  is_typing BOOLEAN,
  updated_at TIMESTAMP
);
```

### User Presence Table
```sql
CREATE TABLE user_presence (
  user_id UUID PRIMARY KEY REFERENCES users(id),
  is_online BOOLEAN,
  last_seen_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

## Edge Functions

### send-message-notification
Sends push notifications when new messages arrive.

**Trigger**: Called after message insert
**Parameters**:
- messageId: UUID
- conversationId: UUID
- senderId: UUID
- content: string

## Real-time Subscriptions

### Message Updates
- Listens for new messages in conversation
- Listens for message updates (read receipts)
- Auto-scrolls to latest message

### Typing Status
- Subscribes to typing_indicators for conversation
- Shows/hides typing indicator based on updates

### Presence Updates
- Subscribes to user_presence for other user
- Updates online/offline status in real-time

## Usage

### Sending Messages
1. Type message in input field
2. Typing indicator automatically activates
3. Press send button or attach files
4. Message appears with single checkmark
5. Checkmark turns double when read

### File Uploads
1. Tap attach icon (paperclip)
2. Select file from device
3. File uploads to Supabase Storage
4. Message sent with file attachment
5. Recipient can tap to view/download

### Presence Management
- App automatically sets user online when opening messages
- Updates to offline when leaving app
- Last seen timestamp tracked for offline users

## Setup Requirements

### Push Notifications
1. Users must grant notification permissions
2. Push tokens registered via register-notification-token function
3. Tokens stored in users.push_token field

### File Storage
1. application-documents bucket must exist
2. RLS policies allow authenticated users to upload
3. Files organized by user_id/filename

## Testing

### Manual Testing
1. Open conversation on two devices
2. Send message from device 1
3. Verify notification on device 2
4. Check read receipts update
5. Test typing indicators
6. Upload files and verify display

### Admin Panel
The admin panel includes buttons to:
- Trigger test notifications
- Check saved search alerts
- Monitor system health

## Performance Considerations

- Typing indicators debounced (2 second timeout)
- Presence updates throttled
- Messages paginated (future enhancement)
- File uploads show progress indicator
- Real-time subscriptions cleaned up on unmount

## Security

- RLS policies enforce conversation access
- Only conversation participants can view messages
- File uploads restricted to authenticated users
- Push tokens encrypted in database
- Message content validated before insert

## Future Enhancements

1. Voice messages
2. Message reactions (emoji)
3. Message forwarding
4. Bulk message deletion
5. Search within conversation
6. Message pinning
7. Group conversations
8. Video/audio calls
