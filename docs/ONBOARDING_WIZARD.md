# Onboarding Wizard System

## Overview
The onboarding wizard appears automatically after OAuth login (Google/Apple) to collect essential profile information from new users. Users can now skip non-essential steps and complete their profile later.

## Features

### Multi-Step Wizard
1. **Step 1: Phone Number**
   - Required for landlord contact
   - Can be skipped with "Complete Later" button
   - Stored in `users.phone`

2. **Step 2: Language Preference**
   - Choose from: German, English, French, Spanish
   - Can be skipped (defaults to German)
   - Stored in `users.preferred_language`

3. **Step 3: User Type**
   - Tenant: Looking for apartments
   - Landlord: Renting out properties
   - Can be skipped
   - Stored in `users.user_type`

4. **Step 4: Preferences (Tenant Only)**
   - Budget range (min/max)
   - Number of bedrooms
   - Preferred location
   - Can be skipped
   - Stored in `tenant_preferences` table

### Skip Functionality
- "Complete Later" button on each step
- Tracks skipped steps in `users.skipped_steps` array
- Shows profile completion banner in app
- Users can return to complete profile anytime

### Database Schema

```sql
-- Users table additions
ALTER TABLE users ADD COLUMN onboarding_completed BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN user_type TEXT CHECK (user_type IN ('tenant', 'landlord', 'vendor'));
ALTER TABLE users ADD COLUMN skipped_steps TEXT[] DEFAULT '{}';
```

## User Flow

### After OAuth Login
1. User signs in with Google/Apple
2. Profile data synced (name, email, avatar)
3. System checks `onboarding_completed` status
4. If `false`, redirect to `/profile-completion`
5. User completes wizard or skips steps
6. `onboarding_completed` set to `true`
7. `skipped_steps` array stores incomplete steps
8. Redirect to main app `/(tabs)`

### Profile Completion Banner
- Shows on home screen when `skipped_steps` is not empty
- Displays missing information (phone, language, user_type, preferences)
- Click to return to profile completion
- Dismissible (hides until next app launch)

## Implementation

### AuthContext Integration
```typescript
const { needsOnboarding } = useAuth();
// Returns true if onboarding_completed is false
```

### Profile Completion Banner
```typescript
<ProfileCompletionBanner />
// Automatically checks and displays if profile incomplete
```

## Benefits

1. **Flexible Onboarding**: Users can skip and complete later
2. **Better UX**: No forced data entry
3. **Persistent Reminders**: Banner prompts completion
4. **Complete Profiles**: Tracks what's missing
5. **User Segmentation**: User type enables role-based features
