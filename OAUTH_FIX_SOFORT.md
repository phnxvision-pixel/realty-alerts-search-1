# ⚡ SOFORT-FIX: Google OAuth Error 400

## 🎯 Das Problem
```
Fehler 400: redirect_uri_mismatch
```

## ✅ Die Lösung (3 Schritte)

### 1️⃣ Google Cloud Console öffnen
https://console.cloud.google.com/apis/credentials

### 2️⃣ Bei JEDER OAuth Client ID diese URI hinzufügen:

```
realty-alerts-search-1://auth/callback
```

**Wichtig**: Sie haben 3 Client IDs (iOS, Android, Web) - bei ALLEN hinzufügen!

### 3️⃣ Speichern & Warten

- Auf "SAVE" klicken
- 5 Minuten warten
- App neu starten: `npx expo start --clear`

## ✅ Fertig!

Der Fehler sollte jetzt behoben sein.

---

**Detaillierte Anleitung**: Siehe `GOOGLE_OAUTH_FEHLER_BEHEBEN.md`
