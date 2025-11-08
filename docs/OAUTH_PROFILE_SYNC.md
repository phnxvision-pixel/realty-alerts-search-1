# OAuth Profile Sync Documentation

## Overview
Automatic profile data synchronization from Google and Apple OAuth providers, including profile pictures, names, and email addresses.

## Features Implemented

### 1. Automatic Profile Sync
- **Google OAuth**: Syncs name, email, and profile picture
- **Apple OAuth**: Syncs name and email (Apple doesn't provide profile pictures)
- Automatic sync on first login and subsequent logins
- Updates user profile in database with OAuth data

### 2. Profile Management UI
- **Main Profile Screen** (`app/profile.tsx`):
  - Displays synced profile picture from OAuth provider
  - Shows full name from OAuth
  - Displays OAuth provider badge (Google/Apple)
  - Quick edit for name
  - Link to full profile editor

- **Profile Edit Screen** (`app/profile-edit.tsx`):
  - Full profile editing interface
  - Profile picture display
  - Editable fields: full name, phone
  - Read-only email field
  - Connected accounts management section

### 3. Connected Accounts Management
- **ConnectedAccounts Component**:
  - Shows currently connected OAuth provider
  - Provider icons (Google/Apple)
  - Unlink account functionality
  - Confirmation dialog before unlinking

## Database Schema Updates

Add these fields to your `users` table:

```sql
ALTER TABLE users ADD COLUMN provider TEXT;
ALTER TABLE users ADD COLUMN provider_id TEXT;
```

## How It Works

### Google OAuth Flow
1. User clicks "Sign in with Google"
2. Google authentication completes
3. `profileSync.syncOAuthProfile()` is called
4. Fetches user data from Google's userinfo API
5. Extracts: name, email, profile picture URL
6. Saves to Supabase users table

### Apple OAuth Flow
1. User clicks "Sign in with Apple"
2. Apple authentication completes
3. `profileSync.syncOAuthProfile()` is called
4. Extracts: name, email from Apple credential
5. Saves to Supabase users table

## Files Modified/Created

### New Files
- `app/lib/profile-sync.ts` - Profile sync service
- `components/ConnectedAccounts.tsx` - Connected accounts UI
- `app/profile-edit.tsx` - Full profile editor
- `docs/OAUTH_PROFILE_SYNC.md` - This documentation

### Modified Files
- `contexts/AuthContext.tsx` - Added profile sync calls
- `app/profile.tsx` - Enhanced to show OAuth data
- `DATABASE_SCHEMA.md` - Added provider fields

## Usage

### For Users
1. Sign in with Google or Apple
2. Profile data is automatically synced
3. View profile to see synced information
4. Edit profile to update synced data
5. Manage connected accounts in profile editor

### For Developers
```typescript
// Sync profile after OAuth login
await profileSync.syncOAuthProfile(user, accessToken, 'google');

// Get connected accounts
const accounts = await profileSync.getConnectedAccounts(userId);

// Unlink account
await profileSync.unlinkAccount(userId);
```

## Security Considerations
- OAuth tokens are securely stored
- Profile sync only updates user's own data
- RLS policies protect user data
- Unlinking requires confirmation

## Future Enhancements
- Profile picture upload/change
- Multiple OAuth accounts linked to one profile
- Sync additional OAuth data (birthday, location)
- Automatic profile refresh on login
