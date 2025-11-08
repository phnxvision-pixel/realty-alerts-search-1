# Kritische Fehler und Lösungen

## 🔴 Google OAuth: redirect_uri_mismatch

### Fehlermeldung
```
Fehler 400: redirect_uri_mismatch
Ungültige Weiterleitung: Muss mit einer öffentlichen Top-Level-Domain enden
```

### Ursache
Die Redirect URI `realty-alerts-search-1://auth/callback` ist ein Custom URL Scheme und wird von Google OAuth **nicht akzeptiert**.

### ✅ Lösung

#### 1. Expo Username herausfinden
```bash
npx expo whoami
# oder
bash scripts/get-expo-username.sh
```

#### 2. Richtige Redirect URI verwenden
Für Expo Mobile Apps muss die URI so aussehen:
```
https://auth.expo.io/@YOUR-EXPO-USERNAME/realty-alerts-search-1
```

#### 3. In Google Cloud Console eintragen

**Für ALLE 3 Client IDs** (iOS, Android, Web):

1. Öffnen: https://console.cloud.google.com/apis/credentials
2. Jede Client ID bearbeiten
3. Unter "Autorisierte Weiterleitungs-URIs" hinzufügen:
   ```
   https://auth.expo.io/@YOUR-USERNAME/realty-alerts-search-1
   ```
4. Speichern

#### 4. Warten und Testen
- 5-10 Minuten warten (Google braucht Zeit)
- App neu starten: `npx expo start --clear`
- Google Sign-In testen

### Client IDs
- **iOS**: `929069562295-181nuemr8ocevknad565l5p0895o8old.apps.googleusercontent.com`
- **Android**: `929069562295-bpvsrm6uhpd1g9me9a07qti0ir6enb97.apps.googleusercontent.com`
- **Web**: `929069562295-6444sseek5krf53ph886sel209b30uvg.apps.googleusercontent.com`

### Warum funktioniert das?

Expo verwendet einen Proxy-Server (`auth.expo.io`), der:
1. OAuth-Anfrage von Google empfängt
2. An Ihre App mit Custom Scheme weiterleitet
3. Google sieht nur die `.io` Domain (gültig ✅)

## Weitere Dokumentation

- `OAUTH_FIX_SCHNELLANLEITUNG.md` - 5-Minuten-Anleitung
- `OAUTH_REDIRECT_FIX_GERMAN.md` - Ausführliche Anleitung
- `OAUTH_REDIRECT_URI_CHECKLIST.md` - Checkliste
