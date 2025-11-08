# WohnAgent - AI-Powered Apartment Rental Platform

WohnAgent is a comprehensive apartment rental platform for the German market, featuring AI-powered matching, real-time messaging, and advanced landlord management tools.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npx expo start

# Run on Android
npx expo start --android

# Run on iOS
npx expo start --ios
```

## 📱 Beta Testing Program

**Status:** Ready for Internal Testing

We're running a closed beta program before public launch. See our comprehensive beta testing documentation:

- **[Beta Testing Program Overview](./docs/BETA_TESTING_PROGRAM.md)** - Setup, timeline, and success criteria
- **[Beta Tester Guide](./docs/BETA_TESTER_GUIDE.md)** - Onboarding guide for testers
- **[Test Scenarios](./docs/BETA_TEST_SCENARIOS.md)** - Detailed test cases
- **[Feedback Form Template](./docs/BETA_FEEDBACK_FORM.md)** - Google Form setup
- **[Beta Management Guide](./docs/BETA_MANAGEMENT_GUIDE.md)** - For project managers

### Quick Beta Setup

1. **Set up Internal Testing Track** in Google Play Console
2. **Add 5-10 testers** to email list
3. **Create feedback form** using template
4. **Distribute tester guide** to participants
5. **Monitor daily** using management guide
6. **Release updates** with beta-release.sh script

### Beta Scripts

```bash
# Release new beta version
./scripts/beta-release.sh 1.0.1 "Fixed login bug"

# Generate tester notification email
./scripts/notify-testers.sh 1.0.1
```

## 📦 Deployment


```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Build for production
eas build --platform android --profile production

# Submit to Google Play
eas submit --platform android
```

## Documentation

- [Deployment Guide](docs/GOOGLE_PLAY_DEPLOYMENT.md)
- [Privacy Policy](docs/PRIVACY_POLICY.md)
- [Database Schema](DATABASE_SCHEMA.md)
- [Bulk Messaging](docs/BULK_MESSAGING.md)
- [Message Templates](docs/MESSAGE_TEMPLATES.md)

## Environment Variables

Create `.env` file:
```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
```

## License

Proprietary - All rights reserved

## Support

- Email: support@wohnagent.app
- Website: https://wohnagent.app
