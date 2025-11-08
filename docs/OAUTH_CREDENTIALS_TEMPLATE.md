# OAuth Credentials Template

## Google Cloud Console Credentials

### Web Client (für Supabase)
```
Client ID: ___________________________________.apps.googleusercontent.com
Client Secret: ___________________________________
```

**Authorized JavaScript origins:**
```
https://nsmwefmmgektqgfswobo.supabase.co
```

**Authorized redirect URIs:**
```
https://nsmwefmmgektqgfswobo.supabase.co/auth/v1/callback
```

---

### iOS Client
```
Client ID: ___________________________________.apps.googleusercontent.com
Bundle ID: com.wohnagent.app
```

---

### Android Client (Development)
```
Client ID: ___________________________________.apps.googleusercontent.com
Package name: com.wohnagent.app
SHA-1 Fingerprint: ___________________________________
```

**SHA-1 holen:**
```bash
keytool -keystore ~/.android/debug.keystore -list -v -alias androiddebugkey
# Passwort: android
```

---

### Android Client (Production)
```
Client ID: ___________________________________.apps.googleusercontent.com
Package name: com.wohnagent.app
SHA-1 Fingerprint: ___________________________________
```

**Production SHA-1 holen:**
```bash
eas credentials
# Wähle: Android → Production → Keystore
```

---

## Supabase Configuration

### Google Provider
```
Enable: ☑ ON
Client ID: [Web Client ID von oben]
Client Secret: [Web Client Secret von oben]
```

---

## Code Updates

### contexts/AuthContext.tsx (Zeilen 36-40)

```typescript
const [request, response, promptAsync] = Google.useAuthRequest({
  iosClientId: '___IOS_CLIENT_ID___.apps.googleusercontent.com',
  androidClientId: '___ANDROID_CLIENT_ID___.apps.googleusercontent.com',
  webClientId: '___WEB_CLIENT_ID___.apps.googleusercontent.com',
});
```

---

## Checkliste

### Google Cloud Console
- [ ] Projekt erstellt: "WohnAgent"
- [ ] Google+ API aktiviert
- [ ] OAuth Consent Screen konfiguriert
- [ ] Web Client ID erstellt
- [ ] iOS Client ID erstellt
- [ ] Android Client ID erstellt (Development)
- [ ] Android Client ID erstellt (Production)

### Supabase
- [ ] Google Provider aktiviert
- [ ] Web Client ID eingetragen
- [ ] Web Client Secret eingetragen

### Code
- [ ] iOS Client ID in AuthContext.tsx
- [ ] Android Client ID in AuthContext.tsx
- [ ] Web Client ID in AuthContext.tsx
- [ ] app.json bundleIdentifier: com.wohnagent.app
- [ ] app.json package: com.wohnagent.app

### Testing
- [ ] Development Build erstellt
- [ ] Google Login getestet
- [ ] Erfolgreich eingeloggt

---

## Notizen

Datum: _______________

Probleme/Lösungen:
_______________________________________
_______________________________________
_______________________________________
