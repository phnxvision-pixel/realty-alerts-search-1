# 📦 WohnAgent - Complete Deployment Guide

## 🎯 Quick Links
- **Quick Start:** See `DEPLOYMENT_QUICKSTART.md` (5 steps, ~1 hour)
- **Detailed Guide:** See `docs/GOOGLE_PLAY_DEPLOYMENT.md`
- **Asset Downloads:** See `store-assets/google-play-assets.md`
- **Testing:** See `docs/TESTING_GUIDE.md`

## 📋 Pre-Deployment Checklist

### 1. Environment Setup
```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Verify setup
./scripts/prepare-deployment.sh
```

### 2. Download Assets
Download from `store-assets/google-play-assets.md`:
- ✅ App icon (1024x1024)
- ✅ Adaptive icon (1024x1024)
- ✅ Splash screen (9:16)
- ✅ Feature graphic (1024x500)
- ✅ 3 screenshots

### 3. Configure Project
```bash
# First time only
eas build:configure

# Update app.json with your project ID
# Replace "YOUR_PROJECT_ID" with actual ID
```

### 4. Build for Production
```bash
# Build Android App Bundle
eas build --platform android --profile production

# Wait 10-15 minutes
# Download .aab file when complete
```

### 5. Google Play Console
1. Create app at https://play.google.com/console
2. Complete store listing (use content from `store-assets/STORE_LISTING.md`)
3. Upload assets and screenshots
4. Set content rating
5. Add privacy policy URL
6. Upload .aab file
7. Submit for review

## 🔄 Updates & Maintenance

### Version Updates
```bash
# Update version in app.json
# Increment versionCode: 1 → 2 → 3
# Increment version: "1.0.0" → "1.0.1"

# Build and submit
eas build --platform android --profile production
eas submit --platform android
```

## 🤖 Automated Deployment (Optional)
See `.github/workflows/eas-build.yml` for CI/CD setup

## 📞 Support
- EAS Docs: https://docs.expo.dev/build/
- Google Play: https://support.google.com/googleplay/android-developer
