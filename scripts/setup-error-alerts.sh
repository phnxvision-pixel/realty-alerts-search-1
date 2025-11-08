#!/bin/bash

# Setup script for error alerting system

echo "Setting up Error Alerting System..."

# Get Supabase credentials
read -p "Enter your Supabase Project URL: " SUPABASE_URL
read -p "Enter your Supabase Anon Key: " SUPABASE_KEY

# Add developer emails
echo ""
echo "Add developer emails for alerts:"
read -p "Enter developer email: " DEV_EMAIL
read -p "Alert level (all/critical/digest_only): " ALERT_LEVEL

curl -X POST "$SUPABASE_URL/rest/v1/developer_emails" \
  -H "apikey: $SUPABASE_KEY" \
  -H "Authorization: Bearer $SUPABASE_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$DEV_EMAIL\", \"alert_level\": \"$ALERT_LEVEL\"}"

echo ""
echo "✓ Developer email added"

# Test alert system
echo ""
read -p "Send test alert? (y/n): " TEST_ALERT

if [ "$TEST_ALERT" = "y" ]; then
  echo "Sending test error..."
  
  # This would be called from your app
  echo "Add this to your app to test:"
  echo ""
  echo "import { errorTracker } from '@/app/lib/error-tracking';"
  echo "await errorTracker.captureError("
  echo "  new Error('Test critical error'),"
  echo "  { screen: 'TestScreen' },"
  echo "  'critical'"
  echo ");"
fi

echo ""
echo "✓ Error alerting system setup complete!"
echo ""
echo "Next steps:"
echo "1. Update developer_emails table with real email addresses"
echo "2. Configure SendGrid sender email in edge functions"
echo "3. Set up cron job for daily digest"
echo "4. Test with a critical error in your app"
