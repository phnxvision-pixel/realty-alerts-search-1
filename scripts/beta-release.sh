#!/bin/bash

# WohnAgent Beta Release Script
# Automates the process of building and releasing beta versions

set -e  # Exit on error

echo "🚀 WohnAgent Beta Release Script"
echo "================================"
echo ""

# Check if version argument provided
if [ -z "$1" ]; then
    echo "❌ Error: Version number required"
    echo "Usage: ./scripts/beta-release.sh <version> [release-notes]"
    echo "Example: ./scripts/beta-release.sh 1.0.1 'Fixed login bug'"
    exit 1
fi

VERSION=$1
RELEASE_NOTES=${2:-"Beta release $VERSION"}

echo "📦 Version: $VERSION"
echo "📝 Release Notes: $RELEASE_NOTES"
echo ""

# Confirm with user
read -p "Continue with beta release? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Release cancelled"
    exit 1
fi

echo ""
echo "Step 1: Updating version in app.json..."
# Update version in app.json (requires jq)
if command -v jq &> /dev/null; then
    CURRENT_VERSION_CODE=$(jq -r '.expo.android.versionCode' app.json)
    NEW_VERSION_CODE=$((CURRENT_VERSION_CODE + 1))
    
    jq ".expo.version = \"$VERSION\" | .expo.android.versionCode = $NEW_VERSION_CODE" app.json > app.json.tmp
    mv app.json.tmp app.json
    
    echo "✅ Updated to version $VERSION (versionCode: $NEW_VERSION_CODE)"
else
    echo "⚠️  jq not installed. Please update app.json manually:"
    echo "   - version: $VERSION"
    echo "   - android.versionCode: increment by 1"
    read -p "Press enter when done..."
fi

echo ""
echo "Step 2: Building with EAS..."
eas build --platform android --profile preview --non-interactive

echo ""
echo "Step 3: Build submitted!"
echo ""
echo "📋 Next Steps:"
echo "1. Wait for build to complete (check: eas build:list)"
echo "2. Go to Google Play Console"
echo "3. Navigate to Testing > Internal testing"
echo "4. Create new release"
echo "5. Upload the AAB file"
echo "6. Add release notes:"
echo "   $RELEASE_NOTES"
echo "7. Review and start rollout"
echo ""
echo "8. Notify testers:"
echo "   ./scripts/notify-testers.sh $VERSION"
echo ""
echo "✅ Beta release process initiated!"
