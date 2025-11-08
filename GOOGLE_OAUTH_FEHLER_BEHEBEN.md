# 🔧 Google OAuth Fehler beheben

## Fehler: "redirect_uri_mismatch" Error 400

### Problem
Die Redirect URI in der Google Cloud Console stimmt nicht mit der URI überein, die Ihre App sendet.

## ✅ Lösung (10 Minuten)

### Schritt 1: Redirect URI ermitteln

Ihre App verwendet: `realty-alerts-search-1://auth/callback`

### Schritt 2: Google Cloud Console öffnen

1. Gehen Sie zu: https://console.cloud.google.com/apis/credentials
2. Wählen Sie Ihr Projekt "Apartment Finder Pro"

### Schritt 3: OAuth-Client IDs konfigurieren

Sie müssen **ALLE DREI** Client IDs aktualisieren:

#### iOS Client ID
- ID: `929069562295-181nuemr8ocevknad565l5p0895o8old.apps.googleusercontent.com`
- Fügen Sie unter "Authorized redirect URIs" hinzu:
```
realty-alerts-search-1://auth/callback
exp://localhost:19000/--/auth/callback
```

#### Android Client ID
- ID: `929069562295-bpvsrm6uhpd1g9me9a07qti0ir6enb97.apps.googleusercontent.com`
- Fügen Sie unter "Authorized redirect URIs" hinzu:
```
realty-alerts-search-1://auth/callback
exp://localhost:19000/--/auth/callback
```

#### Web Client ID
- ID: `929069562295-6444sseek5krf53ph886sel209b30uvg.apps.googleusercontent.com`
- Fügen Sie unter "Authorized redirect URIs" hinzu:
```
realty-alerts-search-1://auth/callback
exp://localhost:19000/--/auth/callback
https://nsmwefmmgektqgfswobo.supabase.co/auth/v1/callback
```

### Schritt 4: Speichern

1. Klicken Sie auf "SAVE" bei jeder Client ID
2. Warten Sie 2-5 Minuten (Google braucht Zeit zum Aktualisieren)

### Schritt 5: App neu starten

```bash
npx expo start --clear
```

## 📱 Testen

1. Öffnen Sie die App
2. Gehen Sie zu Login
3. Klicken Sie auf "Mit Google anmelden"
4. Es sollte jetzt funktionieren!

## 🆘 Immer noch Fehler?

Prüfen Sie:
- [ ] Alle 3 Client IDs aktualisiert?
- [ ] Auf "Save" geklickt?
- [ ] 5 Minuten gewartet?
- [ ] App mit --clear neu gestartet?
