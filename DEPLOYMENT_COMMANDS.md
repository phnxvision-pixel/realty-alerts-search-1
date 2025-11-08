# 🚀 Google Play Store Deployment - Quick Start

## Schritt 1: EAS CLI installieren
```bash
npm install -g eas-cli
eas login
```

## Schritt 2: Projekt konfigurieren
```bash
eas build:configure
```
Dies erstellt eine Projekt-ID. Kopiere sie und füge sie in `app.json` unter `extra.eas.projectId` ein.

## Schritt 3: Production Build erstellen
```bash
eas build --platform android --profile production
```
⏱️ Dauert 10-15 Minuten. Du erhältst einen Download-Link für die `.aab` Datei.

## Schritt 4: Google Play Console
1. Gehe zu https://play.google.com/console
2. Erstelle neue App
3. Lade die `.aab` Datei hoch
4. Fülle Store Listing aus (siehe `store-assets/STORE_LISTING.md`)
5. Reiche zur Überprüfung ein

## 🎯 Schnellbefehl (alles auf einmal)
```bash
eas build --platform android --profile production
```

## 📱 App-Details
- **Package Name**: com.wohnagent.app
- **Version**: 1.0.0
- **Version Code**: 1

## 🔄 Updates veröffentlichen
```bash
# Version in app.json erhöhen (versionCode: 2, version: "1.0.1")
eas build --platform android --profile production
```

## ⚠️ Wichtig
- Google Play Developer Account erforderlich ($25 einmalig)
- Privacy Policy URL benötigt
- Mindestens 2 Screenshots erforderlich
