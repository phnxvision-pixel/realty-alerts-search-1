#!/bin/bash

echo "🚀 WohnAgent Google Play Deployment Script"
echo "=========================================="
echo ""

# Check if EAS CLI is installed
if ! command -v eas &> /dev/null; then
    echo "❌ EAS CLI nicht gefunden. Installiere..."
    npm install -g eas-cli
fi

# Login check
echo "📝 Prüfe EAS Login..."
if ! eas whoami &> /dev/null; then
    echo "🔐 Bitte einloggen..."
    eas login
fi

# Build for production
echo ""
echo "🏗️  Starte Production Build..."
echo "⏱️  Dies dauert 10-15 Minuten..."
echo ""

eas build --platform android --profile production

echo ""
echo "✅ Build abgeschlossen!"
echo ""
echo "📥 Download die .aab Datei vom Link oben"
echo "📱 Lade sie zu Google Play Console hoch:"
echo "   https://play.google.com/console"
echo ""
