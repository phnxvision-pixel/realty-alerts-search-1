# Google Play Store - Datensicherheit Formular

## 📋 Anleitung zum Ausfüllen

Verwenden Sie diese Informationen, um das "Datensicherheit" Formular in der Google Play Console auszufüllen.

## 1️⃣ Datenerfassung und -sicherheit

### Sammelt oder teilt Ihre App Nutzerdaten?
**Antwort:** ✅ Ja

## 2️⃣ Erhobene Datentypen

### Standort
- ✅ **Ungefährer Standort** (für Immobiliensuche)
- ❌ Genauer Standort

**Zweck:** Immobiliensuche nach Standort
**Erforderlich:** Nein (optional)
**Wird geteilt:** Nein

---

### Persönliche Informationen
- ✅ **Name** (für Profil und Bewerbungen)
- ✅ **E-Mail-Adresse** (für Konto und Kommunikation)
- ✅ **Telefonnummer** (für Kontakt zwischen Mietern/Vermietern)
- ✅ **Profilbild** (optional)

**Zweck:** Kontoerstellung, Kommunikation, Bewerbungen
**Erforderlich:** Ja (außer Profilbild)
**Wird geteilt:** Ja (mit Vermietern bei Bewerbungen)

---

### Nachrichten
- ✅ **E-Mails** (Benachrichtigungen)
- ✅ **In-App-Nachrichten** (Chat zwischen Nutzern)

**Zweck:** Kommunikation zwischen Mietern und Vermietern
**Erforderlich:** Ja
**Wird geteilt:** Ja (zwischen Chat-Teilnehmern)

---

### Fotos und Videos
- ✅ **Fotos** (Profilbild, Immobilienfotos)

**Zweck:** Profil, Immobilienanzeigen
**Erforderlich:** Nein (optional)
**Wird geteilt:** Ja (in Anzeigen und Profilen)

---

### Dateien und Dokumente
- ✅ **Dateien und Dokumente** (Identitätsnachweise, optional)

**Zweck:** Identitätsverifizierung
**Erforderlich:** Nein (optional)
**Wird geteilt:** Nein

---

### App-Aktivitäten
- ✅ **App-Interaktionen** (Suchen, Favoriten, Bewerbungen)
- ✅ **In-App-Suchverlauf** (Suchpräferenzen)

**Zweck:** App-Funktionalität, personalisierte Empfehlungen
**Erforderlich:** Ja
**Wird geteilt:** Nein

---

### App-Informationen und -Leistung
- ✅ **Absturzprotokolle** (für Fehlerbehebung)
- ✅ **Diagnose** (Performance-Monitoring)

**Zweck:** App-Stabilität und Verbesserung
**Erforderlich:** Ja
**Wird geteilt:** Nein

---

### Geräte- oder andere IDs
- ✅ **Geräte- oder andere IDs** (für Authentifizierung)

**Zweck:** Kontosicherheit
**Erforderlich:** Ja
**Wird geteilt:** Nein

---

## 3️⃣ Datensicherheit

### Werden Daten verschlüsselt?
**Antwort:** ✅ Ja, Daten werden während der Übertragung verschlüsselt

### Können Nutzer die Löschung ihrer Daten beantragen?
**Antwort:** ✅ Ja

**Wie:** 
- In der App: Einstellungen → Konto löschen
- Per E-Mail: privacy@apartmentfinderpro.com

---

## 4️⃣ Drittanbieter-Dienste

### Verwendete SDKs und Bibliotheken:

1. **Supabase** (Backend/Datenbank)
   - Datentypen: Alle Nutzerdaten
   - Zweck: Datenspeicherung und Authentifizierung

2. **Google OAuth** (Anmeldung)
   - Datentypen: Name, E-Mail, Profilbild
   - Zweck: Benutzeranmeldung

3. **Expo** (App-Plattform)
   - Datentypen: Geräte-IDs, Absturzprotokolle
   - Zweck: App-Entwicklung und Updates

4. **SendGrid** (E-Mail-Versand)
   - Datentypen: E-Mail-Adressen
   - Zweck: Transaktions-E-Mails

---

## 5️⃣ Link zur Datenschutzerklärung

**Erforderlich:** Öffentlich zugänglicher Link

**Ihr Link (nach Hosting):**
```
https://ihr-username.github.io/apartment-finder-pro/privacy-policy.html
```

Siehe `DATENSCHUTZ_HOSTING_ANLEITUNG.md` für Hosting-Optionen.

---

## ✅ Checkliste vor Einreichung

- [ ] Datenschutzerklärung ist online verfügbar
- [ ] Link zur Datenschutzerklärung funktioniert
- [ ] Kontakt-E-Mail in Datenschutzerklärung ist korrekt
- [ ] Alle Datentypen sind im Formular angegeben
- [ ] Zweck jeder Datenerhebung ist klar
- [ ] Drittanbieter-Dienste sind dokumentiert
- [ ] Löschungsmöglichkeit ist implementiert

---

## 📧 Support

Bei Fragen zum Ausfüllen des Formulars:
- Siehe Google Play Console Hilfe
- Kontaktieren Sie Google Play Support
