# Datenschutzerklärung Hosting-Anleitung

## 🎯 Ziel
Die Datenschutzerklärung muss öffentlich im Internet verfügbar sein, damit Sie den Link im Google Play Store angeben können.

## 📋 Optionen zum Hosting

### Option 1: GitHub Pages (KOSTENLOS & EINFACH) ⭐ EMPFOHLEN

1. **Repository auf GitHub erstellen oder verwenden**
   ```bash
   # Falls noch nicht vorhanden
   git init
   git add privacy-policy.html
   git commit -m "Add privacy policy"
   git branch -M main
   git remote add origin https://github.com/IHR-USERNAME/apartment-finder-pro.git
   git push -u origin main
   ```

2. **GitHub Pages aktivieren**
   - Gehen Sie zu Ihrem Repository auf GitHub
   - Klicken Sie auf "Settings" → "Pages"
   - Unter "Source" wählen Sie "main" branch
   - Klicken Sie "Save"

3. **Ihr Link wird sein:**
   ```
   https://IHR-USERNAME.github.io/apartment-finder-pro/privacy-policy.html
   ```

### Option 2: Netlify (KOSTENLOS) ⭐ SEHR EINFACH

1. **Auf Netlify.com registrieren**
2. **"Add new site" → "Deploy manually"**
3. **Datei privacy-policy.html hochziehen**
4. **Ihr Link:** `https://IHR-SITE-NAME.netlify.app/privacy-policy.html`

### Option 3: Vercel (KOSTENLOS)

1. **Auf Vercel.com registrieren**
2. **GitHub Repository verbinden**
3. **Automatisch deployed**
4. **Ihr Link:** `https://apartment-finder-pro.vercel.app/privacy-policy.html`

### Option 4: Eigene Domain

Falls Sie bereits eine Website haben:
1. Laden Sie `privacy-policy.html` auf Ihren Webserver hoch
2. Link: `https://ihre-domain.com/privacy-policy.html`

## ✅ Schnellste Lösung (5 Minuten)

### Netlify Drop (Kein Account nötig!)

1. Gehen Sie zu: https://app.netlify.com/drop
2. Ziehen Sie `privacy-policy.html` in den Browser
3. Fertig! Sie erhalten sofort einen Link

**Beispiel-Link:** `https://apartment-finder-pro-privacy.netlify.app/privacy-policy.html`

## 📱 Für Google Play Store

Kopieren Sie Ihren Link und fügen Sie ihn hier ein:

**Google Play Console → App-Inhalte → Datenschutzerklärung**

Beispiel:
```
https://ihr-username.github.io/apartment-finder-pro/privacy-policy.html
```

## 🔍 Erforderliche Angaben für Google Play

Die bereitgestellte Datenschutzerklärung enthält bereits alle erforderlichen Informationen:

✅ Welche Daten gesammelt werden
✅ Wie Daten verwendet werden
✅ Welche Drittanbieter-SDKs verwendet werden
✅ Wie Daten geteilt werden
✅ Nutzerrechte (DSGVO-konform)
✅ Kontaktinformationen

## 📧 Kontakt-E-Mail anpassen

**WICHTIG:** Ersetzen Sie in der `privacy-policy.html` die E-Mail-Adresse:

```html
<p><strong>E-Mail:</strong> privacy@apartmentfinderpro.com</p>
```

Ändern Sie zu Ihrer echten E-Mail-Adresse:

```html
<p><strong>E-Mail:</strong> ihre-email@gmail.com</p>
```

## 🎨 Design anpassen (Optional)

Die Datenschutzerklärung ist bereits professionell gestylt, aber Sie können:
- Farben ändern (aktuell: Blau #2563eb)
- Logo hinzufügen
- Firmennamen anpassen

## ✨ Fertig!

Nach dem Hosting haben Sie:
1. ✅ Öffentlich zugängliche Datenschutzerklärung
2. ✅ Link für Google Play Store
3. ✅ DSGVO-konforme Dokumentation
4. ✅ Deutsch und Englisch verfügbar
