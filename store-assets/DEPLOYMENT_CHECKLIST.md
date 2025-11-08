# Google Play Store Deployment Checklist

## ✅ Pre-Deployment Checklist

### 1. App Configuration
- [x] Package name set: `com.wohnagent.app`
- [x] Version code: 1
- [x] Version name: 1.0.0
- [x] App name: WohnAgent - Apartment Finder
- [x] Bundle identifiers configured

### 2. Build Configuration
- [x] EAS Build configured (eas.json)
- [x] Production build profile ready
- [x] Android permissions declared
- [ ] Signing key generated (run: `eas credentials`)

### 3. Store Assets Ready
- [x] App icon (1024x1024)
- [x] Feature graphic (1024x500)
- [x] 6 Phone screenshots (9:16 aspect ratio)
- [x] Short description (80 chars)
- [x] Full description (4000 chars)
- [x] Privacy policy URL

### 4. OAuth & Backend
- [ ] Supabase project configured
- [ ] Google OAuth credentials set
- [ ] Redirect URIs configured in Google Console
- [ ] Database schema deployed
- [ ] Environment variables set

## 📱 Deployment Steps

### Step 1: Build Production APK/AAB
```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure credentials
eas credentials

# Build for production
eas build --platform android --profile production
```

### Step 2: Download Build
Once build completes, download the `.aab` file from Expo dashboard.

### Step 3: Google Play Console Setup
1. Go to https://play.google.com/console
2. Create new application
3. Fill in store listing details from `STORE_LISTING.md`
4. Upload screenshots from URLs in documentation
5. Set content rating (Everyone)
6. Set pricing (Free)

### Step 4: Upload Build
1. Go to "Production" > "Create new release"
2. Upload the `.aab` file
3. Add release notes from `STORE_LISTING.md`
4. Review and rollout

### Step 5: Post-Deployment
1. Test OAuth flow on production
2. Monitor crash reports
3. Respond to user reviews
4. Plan updates

## 🔧 Quick Commands

```bash
# Check build status
eas build:list

# View credentials
eas credentials

# Submit to Play Store (automated)
eas submit --platform android

# Update app version
# Edit app.json: version and android.versionCode
```

## 📚 Documentation References
- DEPLOYMENT_QUICKSTART.md - 5-minute German guide
- DEPLOYMENT_COMMANDS.md - Essential commands
- OAUTH_REDIRECT_URI_CHECKLIST.md - OAuth setup
- google-play-screenshots.md - Screenshot URLs
- STORE_LISTING.md - Complete store listing content

## ⚠️ Important Notes
- First deployment requires manual review (1-7 days)
- Updates are faster (few hours)
- Test on real devices before deploying
- Keep signing keys secure and backed up
