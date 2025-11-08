# OAuth Redirect URI Checklist - Schnelle Lösung

## ✅ Sofort-Checkliste

### 1. Expo Username herausfinden
```bash
npx expo whoami
```
Beispiel Ausgabe: `meinusername`

### 2. Redirect URI für Google Console
Verwenden Sie diese URI für **ALLE 3 Client IDs**:

```
https://auth.expo.io/@MEINUSERNAME/realty-alerts-search-1
```

⚠️ **Ersetzen Sie `MEINUSERNAME` mit Ihrem echten Expo-Benutzernamen!**

### 3. In Google Cloud Console eintragen

**Für iOS Client ID:**
- ID: `929069562295-181nuemr8ocevknad565l5p0895o8old.apps.googleusercontent.com`
- Redirect URI: `https://auth.expo.io/@MEINUSERNAME/realty-alerts-search-1`

**Für Android Client ID:**
- ID: `929069562295-bpvsrm6uhpd1g9me9a07qti0ir6enb97.apps.googleusercontent.com`
- Redirect URI: `https://auth.expo.io/@MEINUSERNAME/realty-alerts-search-1`

**Für Web Client ID:**
- ID: `929069562295-6444sseek5krf53ph886sel209b30uvg.apps.googleusercontent.com`
- Redirect URI: `https://auth.expo.io/@MEINUSERNAME/realty-alerts-search-1`

### 4. Speichern & Warten
- Alle Änderungen speichern
- 5-10 Minuten warten
- App neu starten

### 5. Testen
```bash
npx expo start --clear
```

## ❌ Häufige Fehler

### FALSCH:
```
realty-alerts-search-1://auth/callback  ❌
http://localhost:8081                    ❌
```

### RICHTIG:
```
https://auth.expo.io/@MEINUSERNAME/realty-alerts-search-1  ✅
```

## 📝 Notizen

- Custom URL Schemes (`app://`) funktionieren **nicht** mit Google OAuth
- Expo verwendet einen Proxy-Server für OAuth
- Der Username ist case-sensitive
- Änderungen brauchen 5-10 Minuten

## 🆘 Hilfe

Wenn es nicht funktioniert:
1. Username nochmal überprüfen
2. 10 Minuten warten
3. Cache löschen: `npx expo start --clear`
4. Browser-Cache löschen
