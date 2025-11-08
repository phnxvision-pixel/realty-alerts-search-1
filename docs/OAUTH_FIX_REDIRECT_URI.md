# OAuth Redirect URI Fix - Fehler 400 beheben

## Problem
Der Fehler "redirect_uri_mismatch" (Error 400) tritt auf, wenn die OAuth-Redirect-URIs nicht korrekt in Supabase konfiguriert sind.

## Lösung für React Native / Expo

### 1. App.json konfigurieren
Fügen Sie in `app.json` das Schema hinzu:

```json
{
  "expo": {
    "scheme": "wohnagent",
    "slug": "wohnagent",
    "name": "WohnAgent"
  }
}
```

### 2. Supabase Dashboard - Redirect URIs hinzufügen

Gehen Sie zu: **Supabase Dashboard → Authentication → URL Configuration**

Fügen Sie folgende URLs zu "Redirect URLs" hinzu:

#### Für Entwicklung:
```
exp://localhost:19000
exp://localhost:19000/--/auth/callback
exp://192.168.x.x:19000
```

#### Für Production (nach dem Build):
```
wohnagent://
wohnagent://auth/callback
```

#### Für Web (falls verwendet):
```
http://localhost:8081
https://yourdomain.com
```

### 3. Google OAuth Console konfigurieren

1. Gehen Sie zu: https://console.cloud.google.com/apis/credentials
2. Wählen Sie Ihr OAuth 2.0 Client ID
3. Fügen Sie unter "Authorized redirect URIs" hinzu:

```
https://nsmwefmmgektqgfswobo.supabase.co/auth/v1/callback
exp://localhost:19000
wohnagent://
```

### 4. Apple Developer Console (für iOS)

1. Gehen Sie zu: https://developer.apple.com/account/resources/identifiers/list
2. Wählen Sie Ihre App ID
3. Aktivieren Sie "Sign In with Apple"
4. Konfigurieren Sie Return URLs:

```
https://nsmwefmmgektqgfswobo.supabase.co/auth/v1/callback
```

## Testing

### Entwicklungsumgebung testen:
```bash
npx expo start
```

### Production Build testen:
```bash
eas build --platform android --profile preview
```

## Häufige Fehler

### "redirect_uri_mismatch"
- Überprüfen Sie, ob alle URLs in Supabase Dashboard eingetragen sind
- Stellen Sie sicher, dass das Schema in app.json korrekt ist
- Prüfen Sie die Google/Apple Console Einstellungen

### "Invalid client"
- Überprüfen Sie die Client IDs in AuthContext.tsx
- Stellen Sie sicher, dass die IDs mit Google Console übereinstimmen

### OAuth funktioniert in Development aber nicht in Production
- Fügen Sie das Production-Schema (wohnagent://) zu allen Plattformen hinzu
- Erstellen Sie einen neuen Build nach Schema-Änderungen

## Wichtige Hinweise

1. **Nach jeder Änderung am Schema**: Neuer Build erforderlich
2. **Redirect URIs**: Müssen exakt übereinstimmen (keine Tippfehler!)
3. **HTTPS erforderlich**: In Production immer HTTPS verwenden
4. **Mehrere URIs**: Können gleichzeitig konfiguriert werden

## Support

Bei weiteren Problemen:
1. Überprüfen Sie Supabase Logs: Dashboard → Logs → Auth
2. Überprüfen Sie Expo Logs: `npx expo start --clear`
3. Testen Sie mit verschiedenen Geräten/Emulatoren
