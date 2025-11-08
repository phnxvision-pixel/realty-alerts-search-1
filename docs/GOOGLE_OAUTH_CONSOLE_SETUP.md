# Google OAuth Console - Redirect URIs konfigurieren

## Zugriff auf Google Cloud Console

**URL**: https://console.cloud.google.com/apis/credentials

## Schritt-für-Schritt Anleitung

### 1. Projekt auswählen
- Wählen Sie Ihr Projekt aus dem Dropdown oben

### 2. OAuth 2.0 Client IDs finden
- In der Liste "OAuth 2.0 Client IDs" finden Sie:
  - **iOS Client ID**: 929069562295-181nuemr8ocevknad565l5p0895o8old
  - **Android Client ID**: 929069562295-bpvsrm6uhpd1g9me9a07qti0ir6enb97
  - **Web Client ID**: 929069562295-6444sseek5krf53ph886sel209b30uvg

### 3. Jede Client ID konfigurieren

Für **jede** der drei Client IDs:

1. Klicken Sie auf den Namen der Client ID
2. Scrollen Sie zu **"Authorized redirect URIs"**
3. Klicken Sie auf **"ADD URI"**
4. Fügen Sie folgende URIs hinzu:

```
https://nsmwefmmgektqgfswobo.supabase.co/auth/v1/callback
```

5. Klicken Sie auf **"SAVE"**

## Für Entwicklung (optional)

Wenn Sie in der Entwicklungsumgebung testen:

```
exp://localhost:19000
http://localhost:19000
```

## Für Production

```
wohnagent://
```

## ⚠️ Wichtig

1. **Alle drei Client IDs**: iOS, Android UND Web müssen konfiguriert werden
2. **Exact Match**: URIs müssen exakt übereinstimmen
3. **HTTPS erforderlich**: Supabase Callback muss HTTPS verwenden
4. **Propagation**: Änderungen können 5-10 Minuten dauern

## Verifizierung

Nach dem Speichern:
- ✅ Grüne Bestätigung sehen
- ✅ URI in der Liste sichtbar
- ✅ 5-10 Minuten warten vor dem Testen

## Häufige Fehler

- ❌ Nur eine Client ID konfiguriert (alle drei erforderlich!)
- ❌ Tippfehler in der Supabase URL
- ❌ Vergessen auf "SAVE" zu klicken
- ❌ Zu schnell getestet (Propagation abwarten)

## Test

Nach der Konfiguration:
1. App neu starten: `npx expo start --clear`
2. Google Sign-In versuchen
3. Sollte jetzt funktionieren!
