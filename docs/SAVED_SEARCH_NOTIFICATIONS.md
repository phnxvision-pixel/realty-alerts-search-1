# Saved Search Email Notifications

## Overview
Users can save their apartment searches and receive email notifications when new matching listings appear.

## Features
- **Email Frequency Options**: Instant, Daily, Weekly, or None
- **New Listing Counter**: Badge showing unread new listings
- **Share Searches**: Generate shareable links for search criteria
- **Push Notifications**: Toggle push notifications per search

## Setup Instructions

### 1. Automatic Email Notifications (Recommended)

Use a cron service to trigger email notifications automatically:

#### Option A: cron-job.org
1. Visit https://cron-job.org
2. Create a new cron job with these settings:
   - **URL**: `https://YOUR_PROJECT.supabase.co/functions/v1/send-saved-search-emails`
   - **Method**: POST
   - **Headers**: 
     - `Authorization: Bearer YOUR_ANON_KEY`
     - `Content-Type: application/json`
   - **Body**: `{"frequency": "instant"}` (or "daily", "weekly")
   - **Schedule**: 
     - Instant: Every 15 minutes
     - Daily: Once per day at 9 AM
     - Weekly: Once per week on Monday at 9 AM

#### Option B: GitHub Actions
Create `.github/workflows/email-notifications.yml`:

```yaml
name: Send Email Notifications
on:
  schedule:
    - cron: '0 9 * * *'  # Daily at 9 AM UTC
jobs:
  notify:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Daily Emails
        run: |
          curl -X POST YOUR_SUPABASE_URL/functions/v1/send-saved-search-emails \
            -H "Authorization: Bearer ${{ secrets.SUPABASE_ANON_KEY }}" \
            -H "Content-Type: application/json" \
            -d '{"frequency": "daily"}'
```

### 2. Manual Trigger (Admin Panel)
Admins can manually trigger email notifications from the Admin Panel:
- Navigate to Admin tab
- Click "Send instant/daily/weekly emails"

### 3. Background Counter Updates
Set up a cron job to update new listing counters:
- **URL**: `https://YOUR_PROJECT.supabase.co/functions/v1/check-saved-searches`
- **Schedule**: Every 15 minutes
- **Method**: POST
- **Headers**: `Authorization: Bearer YOUR_ANON_KEY`

## User Guide

### Saving a Search
1. Apply desired filters on the home screen
2. Tap "Save Current" in the Saved Searches section
3. Enter a name for your search
4. Choose notification preferences:
   - Enable/disable push notifications
   - Select email frequency (None, Instant, Daily, Weekly)
5. Tap "Save"

### Managing Email Notifications
1. Tap the mail icon on any saved search
2. Select your preferred email frequency
3. Changes are saved automatically

### Viewing New Listings
- Saved searches with new listings show a red badge with the count
- Tap the search to apply filters and view new listings
- The counter resets when you view the search

### Sharing a Search
1. Tap the share icon on any saved search
2. Choose how to share (message, email, etc.)
3. Recipients can open the link to apply the same search criteria

## Email Template
Emails include:
- Number of new listings
- First 5 listings with title, price, and location
- Link to view all matches in the app

## Database Schema
```sql
saved_searches:
- email_frequency: 'instant' | 'daily' | 'weekly' | 'none'
- new_listings_count: integer
- last_checked_at: timestamp
- last_notified_at: timestamp
```
