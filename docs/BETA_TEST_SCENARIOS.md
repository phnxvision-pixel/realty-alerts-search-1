# WohnAgent Beta Test Scenarios

## Detailed Test Cases for Beta Testers

This document provides comprehensive test scenarios to ensure all features are thoroughly tested.

---

## Test Scenario 1: User Registration & Onboarding

### Test Case 1.1: Email Registration (Tenant)
**Priority:** P0 - Critical

**Steps:**
1. Open WohnAgent app
2. Tap "Registrieren" (Sign Up)
3. Select "Mieter" (Tenant)
4. Enter email: test.tenant@example.com
5. Enter password: TestPass123!
6. Tap "Konto erstellen"
7. Check email for verification link
8. Click verification link
9. Return to app

**Expected Result:**
- Account created successfully
- Verification email received within 2 minutes
- After verification, user can log in
- Onboarding wizard appears

**Report if:**
- Email not received
- Verification link doesn't work
- App crashes during signup
- Error messages appear

---

### Test Case 1.2: Google OAuth Login
**Priority:** P0 - Critical

**Steps:**
1. Tap "Mit Google anmelden"
2. Select Google account
3. Grant permissions
4. Complete profile if needed

**Expected Result:**
- Seamless login without errors
- Profile pre-filled with Google data
- Redirected to home screen

---

### Test Case 1.3: Onboarding Wizard
**Priority:** P1 - High

**Steps:**
1. After first login, complete onboarding
2. Enter location preferences
3. Set budget range
4. Select apartment size
5. Choose amenities
6. Complete wizard

**Expected Result:**
- All steps work smoothly
- Can go back to previous steps
- Preferences saved correctly
- Home screen shows relevant listings

---

## Test Scenario 2: Apartment Search & Discovery

### Test Case 2.1: Basic Search
**Priority:** P0 - Critical

**Steps:**
1. Go to Home tab
2. View default apartment listings
3. Scroll through at least 10 apartments
4. Tap on an apartment card

**Expected Result:**
- Listings load within 2 seconds
- Smooth scrolling (no lag)
- Images load properly
- Apartment details open correctly

---

### Test Case 2.2: Search with Filters
**Priority:** P0 - Critical

**Steps:**
1. Tap search/filter icon
2. Set price range: €800-€1200
3. Set size: 50-80 m²
4. Select city: Berlin
5. Choose 2 bedrooms
6. Apply filters
7. View results

**Expected Result:**
- Filter modal opens smoothly
- All filters work correctly
- Results match filter criteria
- Result count updates
- Can clear filters

**Test variations:**
- Different price ranges
- Different cities
- Multiple amenities
- Extreme values (€0, €10000)

---

### Test Case 2.3: Saved Searches
**Priority:** P2 - Medium

**Steps:**
1. Apply filters
2. Tap "Save Search"
3. Name it "Berlin 2BR"
4. Go to Saved Searches
5. Tap saved search
6. Verify filters applied

**Expected Result:**
- Search saved successfully
- Can view all saved searches
- Can delete saved searches
- Filters restore correctly

---

## Test Scenario 3: Apartment Details & Interaction

### Test Case 3.1: View Apartment Details
**Priority:** P0 - Critical

**Steps:**
1. Tap any apartment card
2. View all sections:
   - Photo gallery
   - Price and basic info
   - Description
   - Amenities
   - Location/map
   - Landlord info
3. Scroll through entire page

**Expected Result:**
- All information displays correctly
- Images load in high quality
- Map shows correct location
- No missing data
- Smooth scrolling

---

### Test Case 3.2: Image Gallery
**Priority:** P1 - High

**Steps:**
1. Open apartment details
2. Tap on main image
3. Swipe through gallery
4. Pinch to zoom
5. Close gallery

**Expected Result:**
- Gallery opens in fullscreen
- Smooth swiping between images
- Zoom works properly
- Close button visible
- Image counter shows (e.g., 3/8)

---

### Test Case 3.3: Save to Favorites
**Priority:** P1 - High

**Steps:**
1. View apartment details
2. Tap heart/favorite icon
3. Go to Favorites tab
4. Verify apartment appears
5. Tap heart again to unfavorite
6. Verify removed from favorites

**Expected Result:**
- Heart icon toggles state
- Visual feedback (animation)
- Favorites persist after app restart
- Can view all favorites
- Can remove from favorites

---

## Test Scenario 4: Messaging & Communication

### Test Case 4.1: Send Message to Landlord
**Priority:** P0 - Critical

**Steps:**
1. Open apartment details
2. Tap "Nachricht senden" (Send Message)
3. Type message: "Hallo, ich interessiere mich für die Wohnung."
4. Tap send
5. Go to Messages tab
6. Verify message appears

**Expected Result:**
- Message composer opens
- Can type message
- Send button enabled
- Message sends successfully
- Appears in message list
- Timestamp correct

---

### Test Case 4.2: Message Thread
**Priority:** P1 - High

**Steps:**
1. Open existing conversation
2. Send multiple messages
3. Scroll through history
4. Receive response (if possible)

**Expected Result:**
- Messages display in correct order
- Sent messages align right
- Received messages align left
- Timestamps visible
- Smooth scrolling

---

### Test Case 4.3: Message Notifications
**Priority:** P2 - Medium

**Steps:**
1. Enable notifications in settings
2. Have someone send you a message (or simulate)
3. Check notification appears
4. Tap notification
5. Verify opens correct conversation

**Expected Result:**
- Push notification received
- Notification shows sender and preview
- Tapping opens app to conversation
- Badge count updates

---

## Test Scenario 5: Rental Application

### Test Case 5.1: Submit Application
**Priority:** P0 - Critical

**Steps:**
1. Open apartment details
2. Tap "Jetzt bewerben" (Apply Now)
3. Fill out application form:
   - Personal info
   - Employment details
   - Income information
   - Move-in date
4. Upload documents (if required)
5. Submit application

**Expected Result:**
- Form validates all fields
- Can upload documents
- Submit button works
- Confirmation message appears
- Application appears in "My Applications"

---

### Test Case 5.2: View Application Status
**Priority:** P1 - High

**Steps:**
1. Go to Applications tab
2. View submitted applications
3. Check status (Pending/Accepted/Rejected)
4. Tap to view details

**Expected Result:**
- All applications listed
- Status clearly visible
- Can view application details
- Timestamp of submission shown

---

## Test Scenario 6: Landlord Features

### Test Case 6.1: Post New Listing
**Priority:** P0 - Critical (for landlords)

**Steps:**
1. Switch to landlord account
2. Tap "Post Listing" or "+"
3. Fill out listing form:
   - Title
   - Description
   - Price
   - Size
   - Location
   - Amenities
4. Upload 5+ photos
5. Publish listing

**Expected Result:**
- Form easy to fill out
- Image upload works
- Preview available
- Listing publishes successfully
- Appears in search results

---

### Test Case 6.2: Manage Applications
**Priority:** P1 - High

**Steps:**
1. Go to Landlord Dashboard
2. View incoming applications
3. Open an application
4. Review applicant details
5. Accept or reject
6. Send message to applicant

**Expected Result:**
- Applications list loads
- Can view all details
- Accept/reject buttons work
- Applicant notified of decision
- Can communicate with applicant

---

## Test Scenario 7: Settings & Profile

### Test Case 7.1: Edit Profile
**Priority:** P1 - High

**Steps:**
1. Go to Profile tab
2. Tap "Edit Profile"
3. Change name, bio, photo
4. Save changes
5. Verify changes persist

**Expected Result:**
- All fields editable
- Photo upload works
- Changes save successfully
- Updates reflect immediately

---

### Test Case 7.2: Notification Settings
**Priority:** P2 - Medium

**Steps:**
1. Go to Settings
2. Open Notifications
3. Toggle different notification types
4. Save preferences

**Expected Result:**
- All toggles work
- Settings save
- Notifications respect preferences

---

## Test Scenario 8: Edge Cases & Error Handling

### Test Case 8.1: Offline Mode
**Priority:** P1 - High

**Steps:**
1. Turn off WiFi and mobile data
2. Open app
3. Try to search
4. Try to view saved favorites
5. Try to send message

**Expected Result:**
- App doesn't crash
- Appropriate error messages
- Cached data still visible
- Graceful degradation

---

### Test Case 8.2: Invalid Input
**Priority:** P2 - Medium

**Steps:**
1. Try to register with invalid email
2. Enter password too short
3. Submit form with missing fields
4. Enter negative price in filters

**Expected Result:**
- Validation errors shown
- Clear error messages
- Can't submit invalid data
- No crashes

---

## Reporting Template

After completing each scenario, report using this format:

```
Scenario: [Number and name]
Status: ✅ Pass / ❌ Fail / ⚠️ Issues
Device: [Your device model]
Android Version: [e.g., 13]
App Version: [Check in Settings]

Notes:
[Any observations, bugs, or suggestions]

Screenshots: [Attach if issues found]
```

---

## Daily Testing Checklist

**Day 1:**
- [ ] Scenarios 1.1, 1.2, 1.3

**Day 2:**
- [ ] Scenarios 2.1, 2.2, 2.3

**Day 3:**
- [ ] Scenarios 3.1, 3.2, 3.3

**Day 4:**
- [ ] Scenarios 4.1, 4.2, 4.3

**Day 5:**
- [ ] Scenarios 5.1, 5.2

**Day 6:**
- [ ] Scenarios 6.1, 6.2 (if landlord)

**Day 7:**
- [ ] Scenarios 7.1, 7.2, 8.1, 8.2
