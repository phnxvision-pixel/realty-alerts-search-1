# Supabase Redirect URLs - Komplette Konfiguration

## Zugriff auf Supabase Dashboard

**URL**: https://supabase.com/dashboard/project/nsmwefmmgektqgfswobo

## Navigation

1. Klicken Sie auf **"Authentication"** in der linken Seitenleiste
2. Klicken Sie auf **"URL Configuration"**
3. Scrollen Sie zum Abschnitt **"Redirect URLs"**

## Alle Redirect URLs (kopieren und einfügen)

Fügen Sie folgende URLs hinzu (eine pro Zeile im Textfeld):

### Für Entwicklung (Expo Go)
```
exp://localhost:19000
exp://localhost:19000/--/auth/callback
exp://192.168.1.1:19000
```

### Für Production (Native App)
```
wohnagent://
wohnagent://auth/callback
wohnagent://auth/verified
wohnagent://auth/review-oauth-profile
```

### Für Supabase Auth Callback
```
https://nsmwefmmgektqgfswobo.supabase.co/auth/v1/callback
```

## Screenshot-Anleitung

1. **Textfeld finden**: Suchen Sie nach "Redirect URLs" oder "Additional Redirect URLs"
2. **URLs einfügen**: Kopieren Sie alle URLs oben und fügen Sie sie ein
3. **Speichern**: Klicken Sie auf "Save" oder "Update"

## Site URL konfigurieren

Im gleichen Bereich finden Sie **"Site URL"**:

```
wohnagent://
```

## Wichtig

- ✅ Alle URLs müssen exakt übereinstimmen
- ✅ Keine Leerzeichen vor oder nach den URLs
- ✅ Jede URL in einer neuen Zeile
- ✅ Nach dem Speichern 1-2 Minuten warten

## Verifizierung

Nach dem Speichern sollten Sie sehen:
- Grüne Bestätigung: "Configuration updated"
- Alle URLs in der Liste sichtbar
