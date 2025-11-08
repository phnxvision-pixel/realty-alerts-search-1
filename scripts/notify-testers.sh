#!/bin/bash

# WohnAgent Beta Tester Notification Script
# Generates email template for notifying testers of new beta release

VERSION=${1:-"1.0.x"}

echo "📧 Beta Tester Notification Email Template"
echo "=========================================="
echo ""
echo "Subject: WohnAgent Beta Update v$VERSION Available"
echo ""
echo "------- EMAIL BODY -------"
echo ""
cat << EOF
Hallo Beta Testers!

Eine neue Version von WohnAgent ist verfügbar! 🎉

Version: $VERSION

Was ist neu:
- [Add your changes here]
- [Bug fix 1]
- [Bug fix 2]
- [Improvement 1]

So aktualisieren Sie:
1. Öffnen Sie den Google Play Store
2. Suchen Sie nach WohnAgent
3. Tippen Sie auf "Aktualisieren"

Oder aktivieren Sie automatische Updates:
Play Store > WohnAgent > ⋮ > Auto-Update aktivieren

Bitte testen Sie:
- [Specific feature or scenario to focus on]
- [Any areas that were fixed]

Feedback: beta-feedback@wohnagent.com
Feedback Form: [INSERT YOUR GOOGLE FORM LINK]

Vielen Dank für Ihre Unterstützung!

Das WohnAgent Team

---

Hello Beta Testers!

A new version of WohnAgent is available! 🎉

Version: $VERSION

What's new:
- [Add your changes here]
- [Bug fix 1]
- [Bug fix 2]
- [Improvement 1]

To update:
1. Open Google Play Store
2. Search for WohnAgent
3. Tap "Update"

Or enable automatic updates:
Play Store > WohnAgent > ⋮ > Enable auto-update

Please test:
- [Specific feature or scenario to focus on]
- [Any areas that were fixed]

Feedback: beta-feedback@wohnagent.com
Feedback Form: [INSERT YOUR GOOGLE FORM LINK]

Thank you for your support!

The WohnAgent Team
EOF

echo ""
echo "------- END EMAIL -------"
echo ""
echo "📋 Next Steps:"
echo "1. Copy the email above"
echo "2. Customize the 'What's new' section"
echo "3. Add specific testing focus areas"
echo "4. Send to your beta tester email list"
echo ""
echo "Beta Tester Emails:"
echo "- [Add your tester emails here]"
echo ""
