
# OAuth Schnellstart-Anleitung - Fehler beheben

## 🚨 SOFORTIGE LÖSUNG für "redirect_uri_mismatch"

### Schritt 1: Supabase Dashboard öffnen
1. Gehen Sie zu: https://supabase.com/dashboard
2. Wählen Sie Ihr Projekt aus: **geydwdnjzbkuqozymbrm**
3. Navigieren Sie zu: **Authentication** → **URL Configuration**

### Schritt 2: Redirect URLs hinzufügen
Fügen Sie ALLE folgenden URLs in das Feld "Redirect URLs" ein (eine pro Zeile). Die letzte URL ist die wichtigste und hat sich geändert.

```
exp://localhost:19000
exp://localhost:19000/--/auth/callback
realty-alerts-search-1://
realty-alerts-search-1://auth/callback
http://localhost:8081
https://geydwdnjzbkuqozymbrm.supabase.co/auth/v1/callback
```

### Schritt 3: Speichern
Klicken Sie auf **"Save"** unten auf der Seite.

### Schritt 4: App neu starten
Starten Sie Ihren Expo-Server neu, um sicherzustellen, dass alle Änderungen übernommen werden:
```bash
npx expo start --clear
```

---
(Rest der Anleitung bleibt gleich)
---
