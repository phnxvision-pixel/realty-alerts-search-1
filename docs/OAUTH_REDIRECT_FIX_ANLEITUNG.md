# OAuth Redirect URI Fehler beheben - Schritt-für-Schritt Anleitung

## 🔴 Problem
**Fehler 400: redirect_uri_mismatch**

Sie können sich nicht anmelden, weil die App eine ungültige Anfrage gesendet hat.

## ✅ Lösung in 3 Schritten

### Schritt 1: Supabase Dashboard konfigurieren

1. Öffnen Sie: https://supabase.com/dashboard/project/nsmwefmmgektqgfswobo
2. Gehen Sie zu: **Authentication** → **URL Configuration**
3. Scrollen Sie zu **"Redirect URLs"**
4. Fügen Sie folgende URLs hinzu (eine pro Zeile):

```
exp://localhost:19000
exp://localhost:19000/--/auth/callback
wohnagent://
wohnagent://auth/callback
wohnagent://auth/verified
https://nsmwefmmgektqgfswobo.supabase.co/auth/v1/callback
```

5. Klicken Sie auf **"Save"**

### Schritt 2: Google OAuth Console konfigurieren

1. Öffnen Sie: https://console.cloud.google.com/apis/credentials
2. Wählen Sie Ihre **OAuth 2.0 Client ID** aus
3. Fügen Sie unter **"Authorized redirect URIs"** hinzu:

```
https://nsmwefmmgektqgfswobo.supabase.co/auth/v1/callback
exp://localhost:19000
wohnagent://
```

4. Klicken Sie auf **"Save"**

### Schritt 3: App neu starten

```bash
# Cache löschen und neu starten
npx expo start --clear
```

## 📱 Für Production Build

Wenn Sie die App veröffentlichen möchten:

```bash
# Neuen Build erstellen (nach Schema-Änderung erforderlich)
eas build --platform android --profile production
```

## ⚠️ Wichtige Hinweise

1. **Schema geändert**: Von `realty-alerts-search-1` zu `wohnagent`
2. **Neuer Build erforderlich**: Nach Schema-Änderung muss die App neu gebaut werden
3. **Exact Match**: Redirect URIs müssen exakt übereinstimmen (keine Leerzeichen!)
4. **Propagation**: Änderungen können 1-2 Minuten dauern

## 🧪 Testen

1. Starten Sie die App: `npx expo start --clear`
2. Öffnen Sie die App auf Ihrem Gerät
3. Versuchen Sie, sich mit Google anzumelden
4. Es sollte jetzt funktionieren!

## 🆘 Wenn es immer noch nicht funktioniert

### Überprüfen Sie:

1. **Supabase Logs**: Dashboard → Logs → Auth Logs
2. **Expo Console**: Suchen Sie nach Fehlermeldungen
3. **Redirect URIs**: Alle URLs korrekt eingegeben?
4. **Client IDs**: Stimmen die IDs in AuthContext.tsx?

### Häufige Fehler:

- ❌ Tippfehler in Redirect URIs
- ❌ Vergessen auf "Save" zu klicken
- ❌ Alten Cache nicht gelöscht
- ❌ Falsches Schema verwendet

## 📞 Support

Bei weiteren Problemen:
- Supabase Logs prüfen
- Google OAuth Console Logs prüfen
- App komplett neu installieren
