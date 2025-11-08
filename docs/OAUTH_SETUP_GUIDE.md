# OAuth Setup Guide for Apartment Finder Pro

## Table of Contents
1. [Google OAuth Setup](#google-oauth-setup)
2. [Apple Sign In Setup](#apple-sign-in-setup)
3. [Supabase Configuration](#supabase-configuration)
4. [Code Updates](#code-updates)
5. [Testing](#testing)

---

## Google OAuth Setup

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a Project" → "New Project"
3. Name: "Apartment Finder Pro"
4. Click "Create"
5. Wait for project creation, then select it

### Step 2: Enable Google+ API

1. In left sidebar: "APIs & Services" → "Library"
2. Search for "Google+ API"
3. Click on it → Click "Enable"

### Step 3: Configure OAuth Consent Screen

1. Go to "APIs & Services" → "OAuth consent screen"
2. Select "External" → Click "Create"
3. Fill in required fields:
   - **App name**: Apartment Finder Pro
   - **User support email**: your-email@example.com
   - **Developer contact**: your-email@example.com
4. Click "Save and Continue"
5. Scopes: Click "Add or Remove Scopes"
   - Select: `email`, `profile`, `openid`
6. Click "Save and Continue"
7. Test users: Add your email for testing
8. Click "Save and Continue"

### Step 4: Create OAuth Credentials

#### A. Web Client ID (for Supabase)

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. Application type: "Web application"
4. Name: "Apartment Finder Pro Web"
5. Authorized JavaScript origins:
   ```
   https://nsmwefmmgektqgfswobo.supabase.co
   ```
6. Authorized redirect URIs:
   ```
   https://nsmwefmmgektqgfswobo.supabase.co/auth/v1/callback
   ```
7. Click "Create"
8. **SAVE** the Client ID and Client Secret

#### B. iOS Client ID

1. Click "Create Credentials" → "OAuth client ID"
2. Application type: "iOS"
3. Name: "Apartment Finder Pro iOS"
4. Bundle ID: `com.apartmentfinderpro.app` (from app.json)
5. Click "Create"
6. **SAVE** the iOS Client ID

#### C. Android Client ID

1. Click "Create Credentials" → "OAuth client ID"
2. Application type: "Android"
3. Name: "Apartment Finder Pro Android"
4. Package name: `com.apartmentfinderpro.app`
5. SHA-1 certificate fingerprint:
   - For development, run:
     ```bash
     keytool -keystore ~/.android/debug.keystore -list -v -alias androiddebugkey
     ```
     Password: `android`
   - Copy the SHA-1 fingerprint
6. Click "Create"
7. **SAVE** the Android Client ID

---

## Apple Sign In Setup

### Step 1: Apple Developer Account

1. Go to [Apple Developer](https://developer.apple.com/)
2. Sign in with your Apple ID
3. Enroll in Apple Developer Program ($99/year) if not already

### Step 2: Register App ID

1. Go to "Certificates, Identifiers & Profiles"
2. Click "Identifiers" → "+" button
3. Select "App IDs" → Continue
4. Select "App" → Continue
5. Fill in:
   - **Description**: Apartment Finder Pro
   - **Bundle ID**: Explicit → `com.apartmentfinderpro.app`
6. Capabilities: Check "Sign In with Apple"
7. Click "Continue" → "Register"

### Step 3: Create Service ID

1. Click "Identifiers" → "+" button
2. Select "Services IDs" → Continue
3. Fill in:
   - **Description**: Apartment Finder Pro Web
   - **Identifier**: `com.apartmentfinderpro.app.service`
4. Check "Sign In with Apple"
5. Click "Configure" next to Sign In with Apple
6. Primary App ID: Select your app ID
7. Domains and Subdomains:
   ```
   nsmwefmmgektqgfswobo.supabase.co
   ```
8. Return URLs:
   ```
   https://nsmwefmmgektqgfswobo.supabase.co/auth/v1/callback
   ```
9. Click "Save" → "Continue" → "Register"
10. **SAVE** the Service ID

### Step 4: Create Key

1. Click "Keys" → "+" button
2. Key Name: "Apartment Finder Pro Sign In Key"
3. Check "Sign In with Apple"
4. Click "Configure" → Select your App ID
5. Click "Save" → "Continue" → "Register"
6. **DOWNLOAD** the .p8 key file (only shown once!)
7. **SAVE** the Key ID

---

## Supabase Configuration

### Step 1: Configure Google Provider

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to "Authentication" → "Providers"
4. Find "Google" → Click "Edit"
5. Enable: Toggle ON
6. Enter:
   - **Client ID**: Your Web Client ID from Google
   - **Client Secret**: Your Web Client Secret from Google
7. Click "Save"

### Step 2: Configure Apple Provider

1. In "Providers", find "Apple" → Click "Edit"
2. Enable: Toggle ON
3. Enter:
   - **Services ID**: `com.apartmentfinderpro.app.service`
   - **Secret Key (P8 file)**: Paste contents of .p8 file
   - **Key ID**: Your Key ID from Apple
   - **Team ID**: Find in Apple Developer Account (top right)
4. Click "Save"

---

## Code Updates

### Update AuthContext.tsx

Replace lines 37-39 in `contexts/AuthContext.tsx`:

```typescript
// BEFORE (lines 37-39):
const iosClientId = 'YOUR_IOS_CLIENT_ID.apps.googleusercontent.com';
const androidClientId = 'YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com';
const webClientId = 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com';

// AFTER:
const iosClientId = 'PASTE_YOUR_IOS_CLIENT_ID_HERE.apps.googleusercontent.com';
const androidClientId = 'PASTE_YOUR_ANDROID_CLIENT_ID_HERE.apps.googleusercontent.com';
const webClientId = 'PASTE_YOUR_WEB_CLIENT_ID_HERE.apps.googleusercontent.com';
```

**Example** (with fake IDs):
```typescript
const iosClientId = '123456789-abc123.apps.googleusercontent.com';
const androidClientId = '123456789-def456.apps.googleusercontent.com';
const webClientId = '123456789-ghi789.apps.googleusercontent.com';
```

### Update app.json (if needed)

Ensure bundle identifier matches:
```json
{
  "expo": {
    "ios": {
      "bundleIdentifier": "com.apartmentfinderpro.app"
    },
    "android": {
      "package": "com.apartmentfinderpro.app"
    }
  }
}
```

---

## Testing

### Test Google Sign In

1. **Development Build**:
   ```bash
   npx expo run:ios
   # or
   npx expo run:android
   ```

2. **Test Flow**:
   - Open app → Go to Login screen
   - Tap "Continue with Google"
   - Select Google account
   - Grant permissions
   - Should redirect back to app logged in

### Test Apple Sign In

1. **iOS Device Required** (doesn't work in simulator for production)
2. **Test Flow**:
   - Open app → Go to Login screen
   - Tap "Continue with Apple"
   - Use Face ID / Touch ID
   - Should redirect back to app logged in

### Common Issues

#### Google Sign In Errors

**Error**: "Invalid client ID"
- **Fix**: Double-check Client IDs in AuthContext.tsx
- Ensure no extra spaces or characters

**Error**: "Redirect URI mismatch"
- **Fix**: Add exact Supabase callback URL in Google Console

**Error**: "API not enabled"
- **Fix**: Enable Google+ API in Google Cloud Console

#### Apple Sign In Errors

**Error**: "Invalid service ID"
- **Fix**: Verify Service ID matches in Supabase and Apple Developer

**Error**: "Invalid key"
- **Fix**: Re-download .p8 file and paste entire contents

**Error**: "Domain not verified"
- **Fix**: Wait 24-48 hours after adding domain in Apple Developer

---

## Quick Reference

### What You Need to Save

From **Google Cloud Console**:
- ✅ Web Client ID
- ✅ Web Client Secret
- ✅ iOS Client ID
- ✅ Android Client ID

From **Apple Developer**:
- ✅ Service ID
- ✅ Key ID
- ✅ Team ID
- ✅ .p8 Key File

### Where to Use Them

| Credential | Where to Use |
|------------|--------------|
| Web Client ID | Supabase Dashboard (Google Provider) |
| Web Client Secret | Supabase Dashboard (Google Provider) |
| iOS Client ID | `contexts/AuthContext.tsx` line 37 |
| Android Client ID | `contexts/AuthContext.tsx` line 38 |
| Web Client ID | `contexts/AuthContext.tsx` line 39 |
| Apple Service ID | Supabase Dashboard (Apple Provider) |
| Apple Key (.p8) | Supabase Dashboard (Apple Provider) |
| Apple Key ID | Supabase Dashboard (Apple Provider) |
| Apple Team ID | Supabase Dashboard (Apple Provider) |

---

## Support

If you encounter issues:
1. Check [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
2. Check [Expo Auth Session Docs](https://docs.expo.dev/versions/latest/sdk/auth-session/)
3. Verify all credentials are correct
4. Check Supabase logs for detailed error messages
