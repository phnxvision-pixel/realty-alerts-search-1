# Registrierung & Anmeldung - Vollständige Anleitung

## 📋 Übersicht

Die WohnAgent-App bietet drei Möglichkeiten zur Registrierung:
1. **E-Mail & Passwort** - Klassische Registrierung
2. **Google OAuth** - Schnelle Anmeldung mit Google-Konto
3. **Apple Sign In** - Für iOS-Geräte

## 🔐 E-Mail/Passwort Registrierung

### Schritt-für-Schritt:

1. **Registrierungsformular öffnen**
   - Tippen Sie auf "Registrieren" auf dem Login-Bildschirm

2. **Daten eingeben**
   - Vollständiger Name (erforderlich)
   - E-Mail-Adresse (gültige E-Mail erforderlich)
   - Passwort (mindestens 6 Zeichen)
   - Passwort bestätigen (muss übereinstimmen)

3. **Registrierung abschließen**
   - Tippen Sie auf "Registrieren"
   - Überprüfen Sie Ihre E-Mail
   - Klicken Sie auf den Bestätigungslink

4. **Anmelden**
   - Kehren Sie zur App zurück
   - Melden Sie sich mit Ihren Daten an

### Validierung:
- ✅ Alle Felder müssen ausgefüllt sein
- ✅ E-Mail muss gültiges Format haben
- ✅ Passwort mindestens 6 Zeichen
- ✅ Passwörter müssen übereinstimmen

## 🔵 Google OAuth Anmeldung

### Voraussetzungen:
- Google-Konto erforderlich
- Internetverbindung

### Ablauf:
1. Tippen Sie auf "Mit Google anmelden"
2. Wählen Sie Ihr Google-Konto
3. Erlauben Sie den Zugriff
4. Automatische Weiterleitung zur App

### Bei Problemen:
- Stellen Sie sicher, dass Sie mit dem Internet verbunden sind
- Überprüfen Sie, ob Google-Dienste auf Ihrem Gerät funktionieren
- Versuchen Sie es mit einem anderen Google-Konto

## 🍎 Apple Sign In (nur iOS)

### Voraussetzungen:
- iOS-Gerät (iPhone/iPad)
- Apple ID
- iOS 13 oder höher

### Ablauf:
1. Tippen Sie auf "Mit Apple anmelden"
2. Verwenden Sie Face ID / Touch ID / Passcode
3. Wählen Sie, ob Sie Ihre echte E-Mail oder eine versteckte E-Mail verwenden möchten
4. Bestätigen Sie die Anmeldung

## 🔄 Profil-Vervollständigung (Onboarding)

Nach der ersten Anmeldung (besonders bei OAuth):

### Schritt 1: Telefonnummer
- Geben Sie Ihre Telefonnummer ein
- Format: +49 oder 0 gefolgt von der Nummer

### Schritt 2: Sprache
- Wählen Sie Ihre bevorzugte Sprache
- Deutsch oder Englisch

### Schritt 3: Benutzertyp
- **Mieter**: Auf der Suche nach Wohnungen
- **Vermieter**: Wohnungen vermieten
- **Beides**: Beide Funktionen nutzen

### Schritt 4: Mietpräferenzen (für Mieter)
- Preisbereich
- Anzahl Zimmer
- Standort-Präferenzen

### "Später vervollständigen"
- Sie können jeden Schritt überspringen
- Ein Banner erinnert Sie daran, Ihr Profil zu vervollständigen
- Vervollständigen Sie es jederzeit über Einstellungen

## ❌ Häufige Fehler & Lösungen

### "redirect_uri_mismatch"
**Problem:** OAuth-Konfiguration nicht korrekt

**Lösung:**
1. Siehe `OAUTH_SCHNELLSTART.md`
2. Redirect URLs in Supabase hinzufügen
3. App neu starten

### "Email already registered"
**Problem:** E-Mail bereits verwendet

**Lösung:**
- Verwenden Sie "Passwort vergessen" zum Zurücksetzen
- Oder melden Sie sich mit bestehendem Konto an

### "Invalid email or password"
**Problem:** Falsche Anmeldedaten

**Lösung:**
- Überprüfen Sie Ihre E-Mail-Adresse
- Überprüfen Sie Ihr Passwort
- Verwenden Sie "Passwort vergessen"

### "Network error"
**Problem:** Keine Internetverbindung

**Lösung:**
- Überprüfen Sie Ihre Internetverbindung
- Versuchen Sie es erneut

## 🔒 Sicherheit

### Passwort-Anforderungen:
- Mindestens 6 Zeichen
- Empfohlen: Groß- und Kleinbuchstaben, Zahlen, Sonderzeichen

### Datenschutz:
- Passwörter werden verschlüsselt gespeichert
- OAuth verwendet sichere Token
- Keine Speicherung von Klartextpasswörtern

### Zwei-Faktor-Authentifizierung:
- Aktuell: E-Mail-Verifizierung
- Zukünftig: SMS/App-basierte 2FA

## 📱 Kontoverwaltung

### Profil bearbeiten:
1. Gehen Sie zu Profil
2. Tippen Sie auf "Profil bearbeiten"
3. Ändern Sie Ihre Daten
4. Speichern Sie die Änderungen

### Passwort ändern:
1. Abmelden
2. "Passwort vergessen" verwenden
3. Link in E-Mail folgen
4. Neues Passwort festlegen

### Konto löschen:
- Kontaktieren Sie den Support
- Oder verwenden Sie die Konto-Löschfunktion in Einstellungen

## 🆘 Support

Bei weiteren Problemen:
1. Überprüfen Sie die Dokumentation
2. Supabase Logs prüfen (für Entwickler)
3. Support kontaktieren: support@wohnagent.de
