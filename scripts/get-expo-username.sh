#!/bin/bash

# Script to get Expo username and generate correct OAuth redirect URIs

echo "🔍 Checking Expo Username..."
echo ""

# Try to get username from expo whoami
USERNAME=$(npx expo whoami 2>/dev/null | tail -n 1)

if [ -z "$USERNAME" ] || [ "$USERNAME" = "Not logged in" ]; then
    echo "❌ Not logged in to Expo"
    echo ""
    echo "Please login first:"
    echo "  npx expo login"
    echo ""
    exit 1
fi

echo "✅ Expo Username: $USERNAME"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 CORRECT REDIRECT URI FOR GOOGLE CONSOLE:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "https://auth.expo.io/@$USERNAME/realty-alerts-search-1"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Add this URI to ALL 3 Google OAuth Client IDs:"
echo "  1. iOS Client ID"
echo "  2. Android Client ID"
echo "  3. Web Client ID"
echo ""
echo "Google Cloud Console:"
echo "https://console.cloud.google.com/apis/credentials"
echo ""
