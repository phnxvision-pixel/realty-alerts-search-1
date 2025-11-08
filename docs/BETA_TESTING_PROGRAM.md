# WohnAgent Beta Testing Program

## Overview / Überblick

This document outlines the closed beta testing program for WohnAgent before public launch on Google Play Store.

**Testing Timeline:** 1-2 weeks
**Target Testers:** 5-10 internal testers
**Platform:** Google Play Console Internal Testing Track

---

## 1. Google Play Console Setup

### Step 1: Create Internal Testing Track

1. Go to [Google Play Console](https://play.google.com/console)
2. Select your app (WohnAgent)
3. Navigate to **Testing > Internal testing**
4. Click **Create new release**
5. Upload your AAB file from EAS Build
6. Add release notes (see template below)
7. Click **Review release** → **Start rollout to Internal testing**

### Step 2: Add Beta Testers

1. In **Internal testing**, go to **Testers** tab
2. Click **Create email list**
3. Name it "WohnAgent Beta Team"
4. Add tester emails (5-10 people):
   - developers@wohnagent.com
   - qa@wohnagent.com
   - [Add team member emails]
5. Save the list
6. Copy the **opt-in URL** for testers

---

## 2. Beta Release Notes Template

```
WohnAgent Beta v1.0.0 (Build 1)

Willkommen zum WohnAgent Beta-Test!

Neue Features:
✅ Wohnungssuche mit KI-Matching
✅ Erweiterte Filter (Preis, Größe, Lage)
✅ Echtzeit-Messaging mit Vermietern
✅ Vermieter-Dashboard
✅ Favoriten & gespeicherte Suchen

Bitte testen:
- Registrierung & Login
- Wohnungssuche & Filter
- Bewerbungsprozess
- Messaging-Funktion
- Vermieter-Features

Feedback: beta-feedback@wohnagent.com
Bug Reports: Use in-app feedback form
```

---

## 3. Testing Timeline

### Week 1: Core Functionality Testing
- **Days 1-2:** Onboarding & account creation
- **Days 3-4:** Search, filters, and apartment browsing
- **Days 5-7:** Applications and messaging

### Week 2: Advanced Features & Bug Fixes
- **Days 8-10:** Landlord features, dashboard, analytics
- **Days 11-12:** Bug fixes and refinements
- **Days 13-14:** Final testing and sign-off

---

## 4. Success Criteria for Production Launch

### Must-Have (Blocker Issues)
- [ ] No crash bugs during core user flows
- [ ] Login/signup works 100% of the time
- [ ] Search and filters return correct results
- [ ] Messages send and receive successfully
- [ ] Payment processing works (if applicable)
- [ ] All critical user data is saved correctly

### Performance Metrics
- [ ] App launches in < 3 seconds
- [ ] Search results load in < 2 seconds
- [ ] No memory leaks or excessive battery drain
- [ ] Smooth scrolling (60 FPS) on mid-range devices

### User Experience
- [ ] 80%+ tester satisfaction score
- [ ] Average usability rating ≥ 4/5
- [ ] All critical bugs resolved
- [ ] No major UI/UX complaints

### Test Coverage
- [ ] All test scenarios completed by ≥3 testers
- [ ] At least 5 complete user journeys documented
- [ ] Both tenant and landlord flows tested

---

## 5. Feedback Collection

### Primary Channel: Google Form
**Form URL:** [Create using template in BETA_FEEDBACK_FORM.md]

### Secondary Channels:
- Email: beta-feedback@wohnagent.com
- Slack/Discord: #beta-testing channel
- Weekly video calls with testers

### Required Feedback:
- Daily usage logs (what features used)
- Bug reports with screenshots
- Feature requests and suggestions
- Overall satisfaction rating

---

## 6. Bug Reporting Workflow

### Bug Priority Levels:

**P0 - Critical (Fix immediately)**
- App crashes on launch
- Cannot login/signup
- Data loss or corruption
- Payment failures

**P1 - High (Fix within 24h)**
- Major feature broken
- Significant UI issues
- Performance problems

**P2 - Medium (Fix within 3 days)**
- Minor feature issues
- Cosmetic bugs
- Non-critical errors

**P3 - Low (Fix before launch)**
- Polish items
- Nice-to-have improvements

### Bug Report Template:
```
Title: [Brief description]
Priority: P0/P1/P2/P3
Steps to Reproduce:
1. 
2. 
3. 
Expected Result:
Actual Result:
Device: [Model, Android version]
Screenshot: [Attach if possible]
```

---

## 7. Managing Beta Releases

### Releasing Updates:

```bash
# 1. Build new version
eas build --platform android --profile preview

# 2. Update version in app.json
# Increment versionCode and version

# 3. Upload to Internal Testing
# Go to Play Console > Internal testing > Create new release

# 4. Notify testers
# Send email with changelog
```

### Update Frequency:
- **Week 1:** Every 2-3 days (rapid bug fixes)
- **Week 2:** Every 3-4 days (refinements)

---

## 8. Tester Communication

### Initial Email Template:
```
Subject: Welcome to WohnAgent Beta Testing!

Hallo [Name],

Vielen Dank, dass Sie am WohnAgent Beta-Test teilnehmen!

Opt-in Link: [INSERT_LINK]

Nächste Schritte:
1. Klicken Sie auf den Link oben
2. Akzeptieren Sie die Einladung
3. Laden Sie die App herunter
4. Lesen Sie den Tester-Guide: [LINK]
5. Beginnen Sie mit dem Testen!

Feedback: beta-feedback@wohnagent.com

Vielen Dank!
Das WohnAgent Team
```

### Weekly Update Template:
```
Subject: WohnAgent Beta - Week [X] Update

Hi Beta Testers,

This week's focus: [Feature area]

New in this build:
- [Change 1]
- [Change 2]

Known issues:
- [Issue 1]

Please test: [Specific scenarios]

Thank you for your feedback!
```

---

## 9. Post-Beta Checklist

Before moving to production:
- [ ] All P0 and P1 bugs resolved
- [ ] Success criteria met
- [ ] Final build tested by all testers
- [ ] Store listing finalized (screenshots, description)
- [ ] Privacy policy and terms updated
- [ ] Support email/system ready
- [ ] Analytics and crash reporting configured
- [ ] Rollout plan defined (e.g., 10% → 50% → 100%)

---

## Resources

- [Beta Tester Guide](./BETA_TESTER_GUIDE.md)
- [Test Scenarios](./BETA_TEST_SCENARIOS.md)
- [Feedback Form Template](./BETA_FEEDBACK_FORM.md)
- [Google Play Console](https://play.google.com/console)
