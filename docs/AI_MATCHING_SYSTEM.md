# AI-Powered Apartment Matching System

## Overview
WohnAgent uses OpenAI GPT-4 to provide intelligent apartment recommendations based on tenant preferences, search history, and behavior patterns.

## Features

### 1. Tenant Preferences Management
- Budget range (min/max price)
- Size requirements (bedrooms)
- Preferred locations
- Required amenities
- Commute preferences
- Lifestyle preferences

### 2. AI Matching Algorithm
- Analyzes tenant preferences
- Reviews search history
- Considers favorite patterns
- Generates match scores (0-100)
- Provides explanations for matches
- Breaks down compatibility by category

### 3. Smart Ranking
- Sorts apartments by match score
- Highlights best matches
- Shows match percentage badges
- Displays compatibility breakdown

## Database Tables

### tenant_preferences
- User preferences and search criteria
- Location preferences
- Budget constraints
- Required amenities

### apartment_match_scores
- Match scores for each user-apartment pair
- Match reasons and explanations
- Compatibility breakdown
- Updated dynamically

### search_history
- Tracks user searches
- Records clicked apartments
- Helps improve recommendations

## Edge Function: calculate-apartment-matches

Uses OpenAI API to:
1. Analyze tenant preferences
2. Review search patterns
3. Score each apartment
4. Generate match explanations
5. Store results in database

## UI Components

### MatchScoreBadge
- Visual score indicator
- Color-coded by match quality
- Shows percentage and label

### MatchExplanation
- Lists top reasons for match
- Shows compatibility breakdown
- Visual progress bars

### Preferences Screen
- Manage search preferences
- Set budget and size
- Select locations and amenities

## Usage

1. **Set Preferences**: Navigate to Preferences tab
2. **Calculate Matches**: Toggle AI matching on home screen
3. **View Results**: See match scores on apartment cards
4. **Sort by Match**: Apartments automatically sorted by score
5. **View Details**: See match explanation on listing page

## Integration

The system integrates with:
- OpenAI GPT-4 API for intelligent analysis
- Supabase for data storage
- Real-time updates as preferences change
- Search history tracking

## Future Enhancements
- Machine learning model training
- Behavioral pattern analysis
- Collaborative filtering
- Predictive recommendations
