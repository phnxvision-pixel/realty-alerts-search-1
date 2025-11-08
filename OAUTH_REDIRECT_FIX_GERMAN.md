# Google OAuth Redirect URI Fehler Beheben

## Problem
```
Fehler 400: redirect_uri_mismatch
Ungültige Weiterleitung: Muss mit einer öffentlichen Top-Level-Domain enden
```

## Lösung für Expo Mobile Apps

### Schritt 1: Richtige Redirect URIs für Google Console

Fügen Sie diese **3 Redirect URIs** in der Google Cloud Console hinzu:

#### Für alle 3 Client IDs (iOS, Android, Web):

```
https://auth.expo.io/@your-expo-username/realty-alerts-search-1
```

**WICHTIG:** Ersetzen Sie `your-expo-username` mit Ihrem echten Expo-Benutzernamen!

### Schritt 2: Expo Username finden

```bash
# Führen Sie aus:
npx expo whoami
```

### Schritt 3: Google Cloud Console konfigurieren

1. Gehen Sie zu: https://console.cloud.google.com/apis/credentials
2. Für **JEDE** der 3 OAuth Client IDs:
   - iOS Client ID
   - Android Client ID  
   - Web Client ID

3. Klicken Sie auf "Bearbeiten"
4. Unter "Autorisierte Weiterleitungs-URIs" fügen Sie hinzu:
   ```
   https://auth.expo.io/@IHR-EXPO-USERNAME/realty-alerts-search-1
   ```

5. Klicken Sie auf "Speichern"

### Warum funktioniert `realty-alerts-search-1://` nicht?

Google OAuth akzeptiert **keine** Custom URL Schemes wie `app://` für Web-OAuth.
Expo verwendet stattdessen einen Proxy-Server (`auth.expo.io`), der:
1. OAuth-Anfrage empfängt
2. An Ihre App weiterleitet

## Vollständige Redirect URI Liste

Für **iOS Client ID**:
```
https://auth.expo.io/@your-expo-username/realty-alerts-search-1
```

Für **Android Client ID**:
```
https://auth.expo.io/@your-expo-username/realty-alerts-search-1
```

Für **Web Client ID**:
```
https://auth.expo.io/@your-expo-username/realty-alerts-search-1
```

## Nach der Konfiguration

1. Warten Sie 5 Minuten (Google braucht Zeit)
2. App neu starten
3. Google Sign-In testen

## Testen

```bash
# App neu bauen
npx expo start --clear

# Testen Sie die Anmeldung
```

## Troubleshooting

### Fehler bleibt bestehen?
- Überprüfen Sie den Expo-Benutzernamen
- Warten Sie 10 Minuten
- Cache löschen: `npx expo start --clear`

### Expo Username überprüfen
```bash
npx expo whoami
# Oder
cat ~/.expo/state.json
```
