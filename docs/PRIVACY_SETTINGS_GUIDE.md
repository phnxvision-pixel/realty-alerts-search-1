# Privacy Settings Guide

## Overview
The Privacy Settings screen allows users to manage their data preferences and exercise their GDPR rights.

## Features

### 1. Location Tracking Toggle
- Users can enable/disable location data collection
- Used for personalized apartment recommendations
- Stored in `notification_preferences` table

### 2. Email Notification Management
- **Important Updates**: System notifications, application updates
- **Marketing Emails**: Promotional content, newsletters

### 3. Data Collection Information
Displays what data is collected:
- Account information (name, email)
- Search preferences
- Favorites and saved searches
- Messages and applications
- Location data (optional)

### 4. Privacy Policy Access
- Direct link to full privacy policy
- Opens in browser
- Update URL in code: `Linking.openURL('https://your-domain.com/privacy-policy.html')`

### 5. Download User Data (GDPR Right to Access)
- Exports all user data in JSON format
- Sent via email
- Includes data from: users, favorites, saved_searches, rental_applications, messages, reviews

### 6. Request Data Deletion (GDPR Right to Erasure)
- Creates deletion request in database
- Sends notification to admin
- Processed within 30 days per GDPR

## Backend Functions

### request-data-deletion
- Creates record in `data_deletion_requests` table
- Sends email notification to admin
- Returns confirmation to user

### download-user-data
- Fetches all user data from multiple tables
- Compiles into JSON format
- Sends as email attachment via SendGrid

## Database Schema

### data_deletion_requests
```sql
- id: UUID (primary key)
- user_id: UUID (foreign key to auth.users)
- status: TEXT (pending, processing, completed)
- requested_at: TIMESTAMPTZ
- processed_at: TIMESTAMPTZ
- notes: TEXT
```

## Access
Navigate from: Settings → Privacy & Data

## GDPR Compliance
This feature helps comply with:
- Article 15: Right to access
- Article 17: Right to erasure
- Article 7: Right to withdraw consent
