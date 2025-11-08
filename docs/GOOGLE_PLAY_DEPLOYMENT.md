# Google Play Store Deployment Guide

## ⚠️ IMPORTANT: Beta Testing First!

**Before deploying to production, run a closed beta test!**

We strongly recommend completing a 1-2 week beta testing program before public launch. This helps catch bugs, gather feedback, and ensure a smooth launch.

📋 **[Start Beta Testing Program →](./BETA_QUICK_START.md)**

See our complete beta testing documentation:
- [30-Minute Quick Start](./BETA_QUICK_START.md)
- [Full Beta Program Guide](./BETA_TESTING_PROGRAM.md)
- [Beta Tester Guide](./BETA_TESTER_GUIDE.md)
- [Test Scenarios](./BETA_TEST_SCENARIOS.md)
- [Management Guide](./BETA_MANAGEMENT_GUIDE.md)

---

## Prerequisites
- Google Play Developer Account ($25 one-time fee)
- EAS CLI installed: `npm install -g eas-cli`
- Expo account (free at expo.dev)


## Step 1: Setup EAS Account

```bash
# Login to Expo
eas login

# Configure your project
eas build:configure
```

## Step 2: Update Project ID

After running `eas build:configure`, update `app.json`:
- Replace `YOUR_PROJECT_ID` in `extra.eas.projectId` with your actual project ID

## Step 3: Generate App Icons

Replace placeholder icons in `assets/images/`:
- `icon.png` (1024x1024) - App icon
- `adaptive-icon.png` (1024x1024) - Android adaptive icon

Generated icons and assets:
- **App Icon**: https://d64gsuwffb70l.cloudfront.net/69070b8626239a76108fff59_1762104086524_b792e175.webp
- **Splash Screen**: https://d64gsuwffb70l.cloudfront.net/69070b8626239a76108fff59_1762104087303_a2f0b705.webp
- **Feature Graphic**: https://d64gsuwffb70l.cloudfront.net/69070b8626239a76108fff59_1762104088003_506768cb.webp

Download these and save to:
- `assets/images/icon.png` (1024x1024)
- `assets/images/adaptive-icon.png` (1024x1024, use same as icon)
- `assets/images/splash-icon.png` (for splash screen)

## Step 4: Build for Production

```bash
# Build Android App Bundle (AAB)
eas build --platform android --profile production
```

This will:
- Create optimized production build
- Generate signed AAB file
- Provide download link when complete

## Step 5: Prepare Store Listing

### Required Assets

#### NEW Professional Phone Screenshots (9:16 - RECOMMENDED)
1. Home Screen - Apartment Listings: https://d64gsuwffb70l.cloudfront.net/69070b8626239a76108fff59_1762287895373_edb1af7c.webp
2. Search & Filter Interface: https://d64gsuwffb70l.cloudfront.net/69070b8626239a76108fff59_1762287896168_45707730.webp
3. Apartment Details View: https://d64gsuwffb70l.cloudfront.net/69070b8626239a76108fff59_1762287896951_78e7ea6b.webp
4. Messaging Screen: https://d64gsuwffb70l.cloudfront.net/69070b8626239a76108fff59_1762287897717_32afa5c9.webp
5. Landlord Dashboard: https://d64gsuwffb70l.cloudfront.net/69070b8626239a76108fff59_1762287898470_90af1255.webp
6. Profile & Settings: https://d64gsuwffb70l.cloudfront.net/69070b8626239a76108fff59_1762287899206_33edfe56.webp

#### Alternative Screenshots
1. Screenshot 1: https://d64gsuwffb70l.cloudfront.net/69070b8626239a76108fff59_1762104088765_6de1f57a.webp
2. Screenshot 2: https://d64gsuwffb70l.cloudfront.net/69070b8626239a76108fff59_1762104090516_7c15cb6f.webp
3. Screenshot 3: https://d64gsuwffb70l.cloudfront.net/69070b8626239a76108fff59_1762104092269_2d2857d0.webp


2. **Feature Graphic** (1024x500)
3. **App Icon** (512x512)

### Store Listing Content

**Title:** WohnAgent - Apartment Finder

**Short Description:**
Find your perfect apartment in Germany. Connect with landlords, schedule viewings, and apply instantly.

**Full Description:**
WohnAgent is the ultimate apartment rental platform connecting tenants and landlords across Germany.

🏠 FOR TENANTS:
• Browse thousands of verified apartment listings
• Advanced search with filters (price, location, amenities)
• Save favorites and get instant notifications
• Direct messaging with landlords
• Submit rental applications with documents
• Virtual tours and detailed property info
• Compare multiple properties side-by-side

🏢 FOR LANDLORDS:
• Post unlimited property listings
• Manage applications efficiently
• Bulk messaging to multiple tenants
• Message templates for quick responses
• Track revenue and analytics
• Receive payout requests
• Verified tenant profiles

✨ KEY FEATURES:
• Real-time messaging and notifications
• Secure document uploads
• Multi-language support (English/German)
• Dark mode support
• Neighborhood information
• Financing calculator
• Property reviews and ratings

Whether you're searching for your dream apartment or managing rental properties, WohnAgent makes the process simple, fast, and transparent.

**Category:** House & Home
**Content Rating:** Everyone
**Contact Email:** support@wohnagent.app
**Privacy Policy URL:** https://wohnagent.app/privacy

## Step 6: Create Privacy Policy

Create and host a privacy policy at your domain. Template included in `PRIVACY_POLICY.md`.

## Step 7: Upload to Google Play Console

1. Go to https://play.google.com/console
2. Create new app
3. Fill in store listing details
4. Upload screenshots and graphics
5. Set content rating (complete questionnaire)
6. Set up pricing (Free)
7. Upload AAB file from EAS build
8. Complete all required sections
9. Submit for review

## Step 8: Automated Submission (Optional)

```bash
# Setup service account for automated submission
# 1. Create service account in Google Cloud Console
# 2. Download JSON key as google-play-service-account.json
# 3. Grant access in Play Console

# Submit automatically
eas submit --platform android --profile production
```

## Post-Launch

### Update App
```bash
# Increment version in app.json
# android.versionCode: 2, 3, 4...
# version: "1.0.1", "1.0.2"...

# Build and submit update
eas build --platform android --profile production
eas submit --platform android
```

### Monitor Performance
- Check Google Play Console for:
  - Install statistics
  - Crash reports
  - User reviews
  - Performance metrics

## Troubleshooting

### Build Fails
- Check `eas build` logs
- Verify all dependencies are compatible
- Ensure no missing assets

### Submission Rejected
- Complete all required store listing sections
- Provide valid privacy policy URL
- Answer content rating questionnaire
- Add required screenshots (minimum 2)

## Support
- EAS Docs: https://docs.expo.dev/build/introduction/
- Google Play: https://support.google.com/googleplay/android-developer
