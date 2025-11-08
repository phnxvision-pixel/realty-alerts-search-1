# Job-Specific Messaging System

## Overview
Dedicated in-app messaging system for vendor-landlord communication on maintenance jobs with rich media support, real-time updates, and group chat capabilities.

## Features

### 1. Message Types
- **Text Messages**: Standard text communication
- **Photo Sharing**: Share job photos, before/after images
- **Voice Messages**: Record and send voice notes (up to 60 seconds)
- **Read Receipts**: See when messages are read (✓✓)
- **Typing Indicators**: Real-time typing status

### 2. Conversation Types
- **Direct**: One-on-one vendor-landlord chat
- **Job**: Linked to specific maintenance request
- **Group**: Multiple vendors on same job

### 3. Real-Time Features
- Live message updates via Supabase Realtime
- Typing indicators
- Online/offline presence
- Push notifications for new messages
- Unread message counts

### 4. Message Templates
- Quick responses for common scenarios
- Customizable templates per vendor
- One-tap insertion

## Database Schema

### Extended Tables
```sql
-- Messages table additions
ALTER TABLE messages ADD COLUMN voice_message_url TEXT;
ALTER TABLE messages ADD COLUMN voice_duration INTEGER;
ALTER TABLE messages ADD COLUMN read_at TIMESTAMPTZ;

-- Conversations table additions
ALTER TABLE conversations ADD COLUMN job_id UUID REFERENCES maintenance_requests(id);
ALTER TABLE conversations ADD COLUMN conversation_type TEXT;

-- New conversation_participants table
CREATE TABLE conversation_participants (
  id UUID PRIMARY KEY,
  conversation_id UUID REFERENCES conversations(id),
  user_id UUID REFERENCES users(id),
  participant_type TEXT CHECK (participant_type IN ('landlord', 'tenant', 'vendor')),
  joined_at TIMESTAMPTZ,
  last_read_at TIMESTAMPTZ,
  is_active BOOLEAN
);
```

## Edge Functions

### create-job-conversation
Creates a conversation when a vendor is assigned to a job.

**Request:**
```json
{
  "jobId": "uuid",
  "landlordId": "uuid",
  "vendorIds": ["uuid1", "uuid2"],
  "jobTitle": "Plumbing repair"
}
```

### send-job-message
Sends a message with optional media attachments.

**Request:**
```json
{
  "conversationId": "uuid",
  "senderId": "uuid",
  "content": "I'll arrive at 2pm",
  "imageUrl": "optional",
  "voiceMessageUrl": "optional",
  "voiceDuration": 30
}
```

## Components

### JobMessageThread
Full-featured message thread component with:
- Message history
- Real-time updates
- Photo picker
- Voice recorder
- Read receipts
- Typing indicators

**Usage:**
```tsx
<JobMessageThread 
  conversationId={conversationId}
  currentUserId={userId}
  theme={theme}
/>
```

### VoiceRecorder
Records and sends voice messages.

**Features:**
- Audio permission handling
- Recording duration display
- Cancel/send controls
- High-quality audio recording

## Vendor Integration

### Job Detail Screen
- Toggle between job details and messages
- Message button with unread count
- Seamless navigation

### Messages Screen
- List all job conversations
- Unread indicators
- Quick access to job details

## Storage Buckets

### voice-messages (Private)
Stores voice message recordings
- Access: Authenticated users only
- Max size: 5MB per file
- Format: M4A

### chat-images (Public)
Stores shared photos
- Access: Public read, authenticated write
- Max size: 10MB per file
- Format: JPG, PNG

## Usage Flow

### For Vendors
1. Receive job assignment
2. Job conversation auto-created
3. Access messages from job detail screen
4. Send text, photos, or voice messages
5. View read receipts
6. Receive push notifications

### For Landlords
1. Assign vendor to maintenance request
2. Conversation automatically created
3. Communicate about job details
4. Share photos/instructions
5. Track message history

## Best Practices

1. **Auto-create conversations** when vendors are assigned
2. **Enable push notifications** for real-time communication
3. **Use voice messages** for complex instructions
4. **Share photos** for visual documentation
5. **Read receipts** ensure message delivery
6. **Group chats** for multi-vendor jobs

## Security

- RLS policies ensure users only see their conversations
- Voice messages stored in private bucket
- Message content encrypted in transit
- User authentication required for all operations

## Future Enhancements
- Message reactions (👍, ✅, etc.)
- File attachments (PDFs, documents)
- Video messages
- Message search
- Conversation archiving
- Scheduled messages
