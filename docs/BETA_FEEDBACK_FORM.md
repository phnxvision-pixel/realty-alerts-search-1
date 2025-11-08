# Beta Feedback Form System

## Overview
The beta feedback form allows testers to report bugs, request features, and provide feedback directly from the app with automatic device information capture and screenshot attachments.

## Features

### User-Facing Features
- **Multiple Feedback Types**: Bug reports, feature requests, improvements, other
- **Severity Levels**: Low, medium, high, critical
- **Screenshot Attachments**: Upload multiple screenshots from gallery
- **Automatic Device Info**: Model, OS, version, screen resolution captured automatically
- **Context Capture**: Current screen and user info included

### Developer Features
- **Email Notifications**: Instant alerts when feedback is submitted
- **Structured Data**: All feedback stored in database with searchable fields
- **Media Storage**: Screenshots stored in Supabase storage
- **Status Tracking**: Track feedback from new → in progress → resolved

## Database Schema

```sql
CREATE TABLE beta_feedback (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  feedback_type TEXT CHECK (feedback_type IN ('bug', 'feature_request', 'improvement', 'other')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  severity TEXT CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  
  -- Device info
  device_model TEXT,
  device_os TEXT,
  device_os_version TEXT,
  app_version TEXT,
  screen_resolution TEXT,
  
  -- Media
  screenshot_urls TEXT[],
  recording_url TEXT,
  
  -- Context
  current_screen TEXT,
  user_email TEXT,
  user_name TEXT,
  
  -- Status
  status TEXT DEFAULT 'new',
  developer_notes TEXT,
  resolved_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Usage

### For Beta Testers
1. Go to Settings → Beta Testing → Report Bug / Feedback
2. Select feedback type (Bug, Feature Request, etc.)
3. Choose severity level
4. Enter title and description
5. Optionally add screenshots
6. Submit

### For Developers
Feedback is stored in the `beta_feedback` table and can be viewed via:
- Supabase Dashboard
- Custom admin panel (to be built)
- Email notifications (sent immediately)

## Storage
- Bucket: `beta-feedback`
- Access: Private
- Files: Screenshots and recordings uploaded by users

## Email Notifications
Developers receive emails with:
- Feedback type and severity
- User information
- Device details
- Full description
- Number of attachments
- Link to dashboard

## Status Workflow
1. **new**: Just submitted
2. **in_progress**: Being worked on
3. **resolved**: Fixed/implemented
4. **wont_fix**: Declined

## Future Enhancements
- Screen recording support
- In-app feedback viewing for admins
- Feedback voting system
- Automatic duplicate detection
- Integration with issue tracking systems
