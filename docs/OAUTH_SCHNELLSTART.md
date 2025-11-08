# OAuth Schnellstart-Anleitung - Fehler beheben

## 🚨 SOFORTIGE LÖSUNG für "redirect_uri_mismatch"

### Schritt 1: Supabase Dashboard öffnen
1. Gehen Sie zu: https://supabase.com/dashboard
2. Wählen Sie Ihr Projekt aus
3. Navigieren Sie zu: **Authentication** → **URL Configuration**

### Schritt 2: Redirect URLs hinzufügen
Fügen Sie ALLE folgenden URLs in das Feld "Redirect URLs" ein (eine pro Zeile):

```
exp://localhost:19000
exp://localhost:19000/--/auth/callback
realty-alerts-search-1://
realty-alerts-search-1://auth/callback
http://localhost:8081
https://nsmwefmmgektqgfswobo.supabase.co/auth/v1/callback
```

### Schritt 3: Speichern
Klicken Sie auf **"Save"** unten auf der Seite.

### Schritt 4: App neu starten
```bash
# Terminal schließen und neu öffnen
npx expo start --clear
```

## ✅ Testen

### Email/Password Registrierung testen:
1. Öffnen Sie die App
2. Klicken Sie auf "Registrieren"
3. Füllen Sie alle Felder aus
4. Klicken Sie auf "Registrieren"
5. Überprüfen Sie Ihre E-Mail

### Google OAuth testen:
1. Klicken Sie auf "Mit Google anmelden"
2. Wählen Sie Ihr Google-Konto
3. Erlauben Sie den Zugriff

## 🔧 Wenn es immer noch nicht funktioniert

### Problem: "Invalid client"
**Lösung:** Überprüfen Sie die Client IDs in `contexts/AuthContext.tsx`

### Problem: Google OAuth öffnet sich nicht
**Lösung:** 
```bash
npm install expo-auth-session expo-web-browser
npx expo start --clear
```

### Problem: Registrierung schlägt fehl
**Lösung:** Überprüfen Sie Supabase Logs:
1. Dashboard → Logs → Auth Logs
2. Suchen Sie nach Fehlermeldungen

## 📱 Google OAuth Client IDs

Ihre aktuellen IDs (bereits in der App konfiguriert):
- **iOS**: `929069562295-181nuemr8ocevknad565l5p0895o8old.apps.googleusercontent.com`
- **Android**: `929069562295-bpvsrm6uhpd1g9me9a07qti0ir6enb97.apps.googleusercontent.com`
- **Web**: `929069562295-6444sseek5krf53ph886sel209b30uvg.apps.googleusercontent.com`

## 🎯 Wichtige Hinweise

1. **Nach Änderungen**: Immer `npx expo start --clear` ausführen
2. **Redirect URIs**: Müssen EXAKT übereinstimmen (keine Leerzeichen!)
3. **Mehrere Geräte**: Jedes Gerät kann eine andere IP haben (192.168.x.x)

## 📞 Support

Bei weiteren Problemen:
1. Überprüfen Sie die vollständige Anleitung: `OAUTH_FIX_REDIRECT_URI.md`
2. Supabase Logs prüfen
3. Expo Logs prüfen: Terminal-Ausgabe beachten
