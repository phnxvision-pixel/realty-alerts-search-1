# WohnAgent Beta Testing - 30 Minute Quick Start

Get your beta testing program running in 30 minutes!

## ⏱️ Timeline

- **Minutes 0-10:** Google Play Console Setup
- **Minutes 10-15:** Build & Upload
- **Minutes 15-20:** Add Testers
- **Minutes 20-25:** Create Feedback Form
- **Minutes 25-30:** Send Invitations

---

## Step 1: Google Play Console (10 min)

### 1.1 Access Console
1. Go to https://play.google.com/console
2. Select WohnAgent app
3. Click **Testing** → **Internal testing**

### 1.2 Create Release
1. Click **Create new release**
2. Click **Continue** (you'll upload AAB later)

---

## Step 2: Build & Upload (5 min)

### 2.1 Build with EAS
```bash
# Make sure you're logged in
eas login

# Build for Android
eas build --platform android --profile preview
```

### 2.2 Wait for Build
- Check status: `eas build:list`
- Download AAB when ready
- Or use direct upload from EAS

### 2.3 Upload to Play Console
1. In the release draft, upload your AAB
2. Add release notes:
```
WohnAgent Beta v1.0.0

Welcome to beta testing!

Features to test:
✅ Search & filters
✅ Apartment details
✅ Messaging
✅ Applications
✅ Landlord dashboard

Report bugs: beta-feedback@wohnagent.com
```

---

## Step 3: Add Testers (5 min)

### 3.1 Create Email List
1. In Internal testing, go to **Testers** tab
2. Click **Create email list**
3. Name: "WohnAgent Beta Team"

### 3.2 Add Emails
Add 5-10 tester emails:
```
tester1@example.com
tester2@example.com
tester3@example.com
developer@wohnagent.com
qa@wohnagent.com
```

### 3.3 Save & Get Link
1. Save the list
2. Copy the **opt-in URL** (you'll need this!)

---

## Step 4: Feedback Form (5 min)

### 4.1 Quick Google Form
1. Go to https://forms.google.com
2. Click **Blank Form**
3. Title: "WohnAgent Beta Feedback"

### 4.2 Essential Questions
Add these 5 questions:

**Q1:** Email (short answer, required)
**Q2:** Which features did you test? (checkboxes: Search, Filters, Details, Messaging, Applications, Other)
**Q3:** Did you find any bugs? (Yes/No + description)
**Q4:** Overall rating (1-5 scale)
**Q5:** Comments (long answer)

### 4.3 Get Link
1. Click **Send**
2. Copy the form link
3. Save it for tester emails

---

## Step 5: Invite Testers (5 min)

### 5.1 Email Template
Copy and customize this email:

```
Subject: You're invited to WohnAgent Beta! 🎉

Hallo [Name],

You're invited to test WohnAgent before launch!

🔗 Join Beta: [PASTE OPT-IN URL]

Steps:
1. Click the link above
2. Accept invitation
3. Download from Play Store
4. Start testing!

📋 Tester Guide: [Link to BETA_TESTER_GUIDE.md]
📝 Feedback Form: [Your Google Form link]
📧 Questions: beta-feedback@wohnagent.com

Testing period: 1-2 weeks
Time needed: 15-30 min/day

Thank you!
Das WohnAgent Team
```

### 5.2 Send Invitations
1. Replace [PASTE OPT-IN URL] with your actual link
2. Send to all testers
3. BCC yourself to confirm

---

## ✅ You're Done!

### What Happens Next?

**Day 1:**
- Testers opt-in and download
- Monitor for crashes
- Respond to questions

**Days 2-7:**
- Collect feedback daily
- Fix critical bugs
- Release updates as needed

**Days 8-14:**
- Focus on refinements
- Verify all fixes
- Prepare for production

---

## Quick Reference Commands

```bash
# Check build status
eas build:list

# Build new version
eas build --platform android --profile preview

# Update version (manual)
# Edit app.json: increment version and versionCode

# Release script (after setup)
./scripts/beta-release.sh 1.0.1 "Bug fixes"

# Notify testers
./scripts/notify-testers.sh 1.0.1
```

---

## Need Help?

**Full Documentation:**
- [Complete Beta Program Guide](./BETA_TESTING_PROGRAM.md)
- [Tester Guide](./BETA_TESTER_GUIDE.md)
- [Management Guide](./BETA_MANAGEMENT_GUIDE.md)

**Common Issues:**

**Q: Testers can't find the app**
A: Make sure they clicked opt-in link first

**Q: Build failed**
A: Check `eas build:list` for error details

**Q: How to update the beta?**
A: Build new version, upload to same release track

**Q: Testers not giving feedback**
A: Send reminder emails, make form easier

---

## Success Checklist

After 30 minutes, you should have:
- ✅ Beta release live in Play Console
- ✅ 5-10 testers invited
- ✅ Feedback form created
- ✅ Invitation emails sent
- ✅ Monitoring system ready

**Now:** Wait for testers to opt-in and start testing!

**Tomorrow:** Review first feedback and triage bugs

**Week 2:** Fix issues and prepare for production

Good luck! 🚀
