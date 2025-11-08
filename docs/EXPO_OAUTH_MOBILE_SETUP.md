# Expo OAuth Mobile Setup Guide

## Understanding Mobile OAuth Redirect URIs

Mobile apps use **custom URL schemes** instead of http/https URLs for OAuth redirects.

### How It Works

1. **App registers a custom scheme**: `realty-alerts-search-1://`
2. **OAuth provider redirects to**: `realty-alerts-search-1://auth/callback`
3. **Operating system opens your app** with the callback data
4. **App processes the authentication** token

## Current Configuration

### app.json
```json
{
  "expo": {
    "scheme": "realty-alerts-search-1",
    "ios": {
      "bundleIdentifier": "com.wohnagent.app"
    },
    "android": {
      "package": "com.wohnagent.app"
    }
  }
}
```

### AuthContext.tsx
```typescript
const redirectUri = makeRedirectUri({
  scheme: 'realty-alerts-search-1',
  path: 'auth/callback'
});
// Results in: realty-alerts-search-1://auth/callback
```

## Google Cloud Console Setup

### Required Redirect URIs

Add ALL of these to your OAuth 2.0 Client ID:

#### Production (Standalone App)
```
realty-alerts-search-1://auth/callback
realty-alerts-search-1://
com.wohnagent.app://auth/callback
```

#### Development (Expo Go)
```
exp://localhost:19000/--/auth/callback
exp://127.0.0.1:19000/--/auth/callback
https://auth.expo.io/@YOUR_EXPO_USERNAME/realty-alerts-search-1
```

Replace `YOUR_EXPO_USERNAME` with your Expo account username.

### Step-by-Step

1. Go to: https://console.cloud.google.com/apis/credentials
2. Select your project
3. Click on your OAuth 2.0 Client ID
4. Under "Authorized redirect URIs", click "ADD URI"
5. Add each URI from the list above
6. Click "SAVE"

## Testing Different Environments

### Expo Go (Development)
```bash
npx expo start
# Scan QR code with Expo Go app
# Redirect URI will be: exp://...
```

### Development Build
```bash
npx expo run:android
# or
npx expo run:ios
# Redirect URI will be: realty-alerts-search-1://...
```

### Production Build
```bash
eas build --platform android
# Redirect URI will be: realty-alerts-search-1://...
```

## Debugging Redirect URIs

Add this to AuthContext.tsx temporarily:

```typescript
const redirectUri = makeRedirectUri({
  scheme: 'realty-alerts-search-1',
  path: 'auth/callback'
});

console.log('=== OAUTH DEBUG ===');
console.log('Redirect URI:', redirectUri);
console.log('Platform:', Platform.OS);
console.log('===================');
```

## Common Issues

### Error: redirect_uri_mismatch
**Cause**: The redirect URI used by the app doesn't match any URI in Google Console.

**Solution**:
1. Check console.log output for actual redirect URI
2. Add that exact URI to Google Console
3. Wait 1-2 minutes for changes to propagate
4. Clear app cache: `npx expo start --clear`

### Error: invalid_client
**Cause**: Wrong Client ID for the platform.

**Solution**: Verify you're using the correct Client ID:
- Android: Use Android Client ID
- iOS: Use iOS Client ID
- Web: Use Web Client ID

### Expo Go vs Standalone
- **Expo Go**: Uses `exp://` scheme
- **Standalone**: Uses your custom scheme

You need BOTH sets of URIs in Google Console if testing with Expo Go.

## Security Best Practices

1. **Never commit Client IDs** to public repos (use environment variables)
2. **Use different OAuth clients** for dev/staging/production
3. **Restrict bundle IDs** in Google Console to your actual app IDs
4. **Enable only required scopes**

## Next Steps

After fixing redirect URIs:
1. Test OAuth login flow
2. Verify profile data sync
3. Test on both Android and iOS
4. Test in Expo Go and standalone builds
