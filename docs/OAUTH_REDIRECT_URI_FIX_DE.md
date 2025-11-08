# 🔧 OAuth Redirect URI Fehler beheben

## Problem: Error 400 - redirect_uri_mismatch

Dieser Fehler tritt auf, wenn die Redirect URI in der Google Cloud Console nicht mit der URI übereinstimmt, die Ihre App verwendet.

## 🎯 Schnelle Lösung

### Schritt 1: Google Cloud Console öffnen
https://console.cloud.google.com/apis/credentials

### Schritt 2: Projekt auswählen
Wählen Sie "Apartment Finder Pro" (oder Ihr Projektname)

### Schritt 3: OAuth 2.0 Client IDs konfigurieren

Sie haben 3 Client IDs, die ALLE konfiguriert werden müssen:

#### 1. iOS Client ID
**ID**: `929069562295-181nuemr8ocevknad565l5p0895o8old.apps.googleusercontent.com`

Klicken Sie auf die ID und fügen Sie unter "Authorized redirect URIs" hinzu:
```
realty-alerts-search-1://auth/callback
exp://localhost:19000/--/auth/callback
```

#### 2. Android Client ID
**ID**: `929069562295-bpvsrm6uhpd1g9me9a07qti0ir6enb97.apps.googleusercontent.com`

Fügen Sie unter "Authorized redirect URIs" hinzu:
```
realty-alerts-search-1://auth/callback
exp://localhost:19000/--/auth/callback
```

#### 3. Web Client ID
**ID**: `929069562295-6444sseek5krf53ph886sel209b30uvg.apps.googleusercontent.com`

Fügen Sie unter "Authorized redirect URIs" hinzu:
```
realty-alerts-search-1://auth/callback
exp://localhost:19000/--/auth/callback
https://nsmwefmmgektqgfswobo.supabase.co/auth/v1/callback
```

### Schritt 4: Speichern
- Klicken Sie bei jeder Client ID auf "SAVE"
- Warten Sie 2-5 Minuten (Google benötigt Zeit für die Aktualisierung)

### Schritt 5: App neu starten
```bash
npx expo start --clear
```

## ✅ Testen
1. App öffnen
2. Zum Login gehen
3. "Mit Google anmelden" klicken
4. Sollte jetzt funktionieren!

## 🔍 Debugging
Die App zeigt jetzt die verwendete Redirect URI in der Konsole an:
```
🔍 OAuth Redirect URI: realty-alerts-search-1://auth/callback
```

## 🆘 Weitere Hilfe
- `GOOGLE_OAUTH_FEHLER_BEHEBEN.md` - Detaillierte Anleitung
- `OAUTH_FIX_SOFORT.md` - Schnellanleitung
- `scripts/check-oauth-config.sh` - Konfiguration prüfen
