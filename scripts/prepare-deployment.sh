#!/bin/bash

echo "📦 Vorbereitung für Google Play Deployment"
echo "==========================================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js nicht installiert!"
    exit 1
fi

echo "✅ Node.js: $(node -v)"

# Install dependencies
echo ""
echo "📥 Installiere Dependencies..."
npm install

# Install EAS CLI
echo ""
echo "📥 Installiere EAS CLI..."
npm install -g eas-cli

# Check if logged in
echo ""
echo "🔐 Login Status prüfen..."
if eas whoami &> /dev/null; then
    echo "✅ Eingeloggt als: $(eas whoami)"
else
    echo "⚠️  Nicht eingeloggt. Führe aus: eas login"
fi

echo ""
echo "✅ Vorbereitung abgeschlossen!"
echo ""
echo "Nächste Schritte:"
echo "1. eas build:configure (falls noch nicht gemacht)"
echo "2. Projekt-ID in app.json eintragen"
echo "3. eas build --platform android --profile production"
echo ""
