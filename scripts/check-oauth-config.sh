#!/bin/bash

echo "🔍 OAuth Konfiguration prüfen"
echo "================================"
echo ""

# Check app.json for scheme
echo "📱 App Scheme:"
if [ -f "app.json" ]; then
  grep -A 1 '"scheme"' app.json | grep -v "scheme"
else
  echo "❌ app.json nicht gefunden"
fi
echo ""

# Display expected redirect URIs
echo "✅ Erforderliche Redirect URIs für Google Cloud Console:"
echo "-----------------------------------------------------------"
echo "realty-alerts-search-1://auth/callback"
echo "exp://localhost:19000/--/auth/callback"
echo "https://nsmwefmmgektqgfswobo.supabase.co/auth/v1/callback"
echo ""

# Display client IDs
echo "🔑 Ihre Client IDs:"
echo "-----------------------------------------------------------"
echo "iOS:     929069562295-181nuemr8ocevknad565l5p0895o8old.apps.googleusercontent.com"
echo "Android: 929069562295-bpvsrm6uhpd1g9me9a07qti0ir6enb97.apps.googleusercontent.com"
echo "Web:     929069562295-6444sseek5krf53ph886sel209b30uvg.apps.googleusercontent.com"
echo ""

echo "📋 Nächste Schritte:"
echo "1. Gehen Sie zu: https://console.cloud.google.com/apis/credentials"
echo "2. Fügen Sie die obigen Redirect URIs zu ALLEN 3 Client IDs hinzu"
echo "3. Klicken Sie auf 'SAVE'"
echo "4. Warten Sie 5 Minuten"
echo "5. Starten Sie die App neu: npx expo start --clear"
echo ""
echo "✅ Fertig!"
