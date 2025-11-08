# OAuth Fix - Schnellanleitung (5 Minuten)

## Das Problem
Google sagt: "Ungültige Weiterleitung: Muss mit .com oder .org enden"

## Die Lösung in 3 Schritten

### Schritt 1: Expo Username
```bash
npx expo whoami
```
Merken Sie sich den Username! Beispiel: `maxmustermann`

### Schritt 2: Google Console öffnen
https://console.cloud.google.com/apis/credentials

### Schritt 3: Redirect URI hinzufügen

Für **JEDE** der 3 OAuth Client IDs:

**Tragen Sie ein:**
```
https://auth.expo.io/@IHRUSERNAME/realty-alerts-search-1
```

**Beispiel** (wenn Username = maxmustermann):
```
https://auth.expo.io/@maxmustermann/realty-alerts-search-1
```

## Client IDs zum Bearbeiten

1. **iOS Client ID**
   - Endet mit: `...o8old.apps.googleusercontent.com`
   - Redirect URI hinzufügen ✏️

2. **Android Client ID**  
   - Endet mit: `...enb97.apps.googleusercontent.com`
   - Redirect URI hinzufügen ✏️

3. **Web Client ID**
   - Endet mit: `...30uvg.apps.googleusercontent.com`
   - Redirect URI hinzufügen ✏️

## Wichtig!

- ❌ NICHT: `realty-alerts-search-1://auth/callback`
- ✅ SONDERN: `https://auth.expo.io/@username/realty-alerts-search-1`

## Nach dem Speichern

1. 5 Minuten warten
2. App neu starten: `npx expo start --clear`
3. Testen!

## Fertig! 🎉

Die Google-Anmeldung sollte jetzt funktionieren.
