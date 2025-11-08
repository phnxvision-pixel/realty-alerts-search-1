# 🚀 Google Play Deployment - 5 Minuten Schnellstart

## Voraussetzungen
✅ Google Play Developer Account ($25)
✅ Node.js installiert
✅ Expo Account (kostenlos auf expo.dev)

## Los geht's!

### 1️⃣ EAS CLI installieren (1 Minute)
```bash
npm install -g eas-cli
eas login
```

### 2️⃣ Projekt konfigurieren (1 Minute)
```bash
eas build:configure
```
**Wichtig**: Kopiere die generierte Projekt-ID und füge sie in `app.json` ein:
```json
"extra": {
  "eas": {
    "projectId": "DEINE-PROJEKT-ID-HIER"
  }
}
```

### 3️⃣ Build starten (10-15 Minuten)
```bash
eas build --platform android --profile production
```
☕ Warte auf den Build. Du bekommst eine E-Mail mit dem Download-Link.

### 4️⃣ Zu Google Play hochladen (3 Minuten)
1. Öffne https://play.google.com/console
2. Klicke "App erstellen"
3. Lade die `.aab` Datei hoch
4. Fülle die Pflichtfelder aus
5. Reiche zur Überprüfung ein

## 📋 Was du brauchst

### Store Assets (bereits erstellt!)
- ✅ App Icon (1024x1024)
- ✅ Feature Graphic (1024x500)
- ✅ Screenshots (3 Stück)
- ✅ Store Beschreibung

Alle Assets findest du in `store-assets/` und `docs/GOOGLE_PLAY_DEPLOYMENT.md`

### App-Informationen
- **Name**: WohnAgent - Apartment Finder
- **Package**: com.wohnagent.app
- **Kategorie**: House & Home
- **Preis**: Kostenlos

## 🎉 Fertig!
Nach 1-7 Tagen wird deine App überprüft und veröffentlicht.

## 📚 Detaillierte Anleitungen
- `docs/GOOGLE_PLAY_DEPLOYMENT.md` - Vollständige Anleitung
- `store-assets/STORE_LISTING.md` - Store-Texte
- `store-assets/DEPLOYMENT_CHECKLIST.md` - Checkliste
