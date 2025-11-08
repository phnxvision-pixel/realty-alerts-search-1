# Testing Guide - Pre-Deployment

## Manual Testing Checklist

### Authentication Flow
- [ ] Sign up with email/password
- [ ] Log in with existing account
- [ ] Password reset functionality
- [ ] Social login (Google, Apple)
- [ ] Logout and session management

### Tenant Features
- [ ] Browse apartment listings
- [ ] Search and filter properties
- [ ] Save favorites
- [ ] View property details
- [ ] Submit rental application
- [ ] Send messages to landlords
- [ ] Receive notifications

### Landlord Features
- [ ] Post new listing
- [ ] Edit existing listings
- [ ] View applications
- [ ] Approve/reject applications
- [ ] Bulk messaging
- [ ] Message templates
- [ ] Revenue dashboard

### Vendor Features
- [ ] Register as vendor
- [ ] View assigned jobs
- [ ] Submit bids
- [ ] Update job status
- [ ] Upload completion photos
- [ ] Job calendar view
- [ ] Earnings dashboard

### General
- [ ] Dark mode toggle
- [ ] Language switching (EN/DE)
- [ ] Push notifications
- [ ] Image uploads
- [ ] Voice messages
- [ ] App navigation

## Device Testing
Test on multiple devices:
- Android 10+
- Different screen sizes
- Various manufacturers (Samsung, Google, etc.)

## Performance Testing
- [ ] App loads in < 3 seconds
- [ ] Smooth scrolling
- [ ] No memory leaks
- [ ] Offline functionality

## Build Testing
```bash
# Test production build locally
eas build --platform android --profile preview
# Install APK on device and test
```
