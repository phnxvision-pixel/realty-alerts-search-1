# Cookie Consent Banner - Implementation Guide

## Overview
The app now includes a GDPR-compliant cookie consent banner that appears on first launch, allowing users to manage their privacy preferences.

## Features

### 1. Cookie Consent Banner
- **First Launch Display**: Automatically shows on first app launch
- **Three Options**:
  - Accept All: Enables all cookies (necessary, functional, analytics, marketing)
  - Reject Non-Essential: Only enables necessary cookies
  - Customize: Granular control over each cookie type

### 2. Cookie Categories

#### Necessary Cookies (Always Enabled)
- Required for basic app functionality
- Cannot be disabled
- Examples: Authentication, session management

#### Functional Cookies (Optional)
- Store user preferences
- Remember settings and choices
- Examples: Language preference, theme selection

#### Analytics Cookies (Optional)
- Help improve the app
- Track usage patterns
- Examples: Screen views, feature usage

#### Marketing Cookies (Optional)
- Personalized advertising
- Track conversion events
- Examples: Ad targeting, campaign tracking

## Implementation Details

### Files Created
1. **app/lib/consent-manager.ts**: Manages consent storage in AsyncStorage
2. **components/CookieConsentBanner.tsx**: UI component for consent banner
3. **Updated app/_layout.tsx**: Integrated banner into app root

### Storage
- Consent preferences stored in AsyncStorage
- Key: `@wohnsinn_consent_preferences`
- Includes timestamp and version tracking

## Usage in Your App

### Checking Consent Before Analytics
```typescript
import { consentManager } from '@/app/lib/consent-manager';

async function trackEvent(eventName: string) {
  const consent = await consentManager.getConsent();
  
  if (consent?.analytics) {
    // Track analytics event
    analytics.track(eventName);
  }
}
```

### Checking Marketing Consent
```typescript
async function showAd() {
  const consent = await consentManager.getConsent();
  
  if (consent?.marketing) {
    // Show personalized ad
  } else {
    // Show generic ad or no ad
  }
}
```

### Respecting Functional Cookie Consent
```typescript
async function saveUserPreference(key: string, value: any) {
  const consent = await consentManager.getConsent();
  
  if (consent?.functional) {
    await AsyncStorage.setItem(key, value);
  }
}
```

## User Management

### Changing Consent
Users can change their cookie preferences at any time:
1. Go to Settings
2. Tap "Privacy & Data"
3. Scroll to "Cookie Settings"
4. Tap "Change Cookie Settings"
5. Restart the app to see the banner again

### Privacy Settings Integration
The cookie consent is integrated with the Privacy Settings screen:
- Users can reset their consent
- Link to privacy policy
- View data collection details

## GDPR Compliance

### Requirements Met
✅ Explicit consent before non-essential cookies
✅ Clear explanation of cookie purposes
✅ Easy to withdraw consent
✅ Granular control over cookie types
✅ Consent stored with timestamp
✅ No cookies set before consent (except necessary)

### Best Practices
- Banner shows before any analytics/marketing tracking
- Necessary cookies clearly marked as required
- Easy access to change preferences later
- Clear language explaining each cookie type

## Testing

### Test Scenarios
1. **First Launch**: Banner should appear
2. **Accept All**: All preferences set to true
3. **Reject Non-Essential**: Only necessary cookies enabled
4. **Customize**: Individual toggles work correctly
5. **Persistence**: Choices persist across app restarts
6. **Reset**: Can reset and see banner again

### Testing Commands
```bash
# Clear app data to test first launch
# iOS Simulator
xcrun simctl uninstall booted [bundle-id]

# Android Emulator
adb uninstall [package-name]
```

## Localization
The banner is currently in German. To add English:
1. Update CookieConsentBanner.tsx
2. Use LocalizationContext for translations
3. Add translations to constants/translations.ts

## Future Enhancements
- [ ] Add more cookie categories if needed
- [ ] Implement cookie scanning to detect third-party cookies
- [ ] Add detailed cookie list in privacy policy
- [ ] Track consent changes for compliance logs
- [ ] Add consent banner version management
