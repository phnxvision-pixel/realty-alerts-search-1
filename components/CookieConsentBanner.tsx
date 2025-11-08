import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView, Switch } from 'react-native';
import { consentManager, ConsentPreferences, defaultConsent } from '../app/lib/consent-manager';
import { useTheme } from '../contexts/ThemeContext';

export default function CookieConsentBanner() {
  const { theme } = useTheme();
  const [visible, setVisible] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [preferences, setPreferences] = useState<ConsentPreferences>(defaultConsent);

  useEffect(() => {
    checkConsent();
  }, []);

  const checkConsent = async () => {
    const hasConsent = await consentManager.hasConsent();
    if (!hasConsent) {
      setVisible(true);
    }
  };

  const handleAcceptAll = async () => {
    await consentManager.acceptAll();
    setVisible(false);
  };

  const handleRejectNonEssential = async () => {
    await consentManager.rejectNonEssential();
    setVisible(false);
  };

  const handleSaveCustom = async () => {
    await consentManager.setConsent(preferences);
    setVisible(false);
    setShowCustomize(false);
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={() => {}}
    >
      <View style={styles.overlay}>
        <View style={[styles.banner, { backgroundColor: theme.card }]}>
          {!showCustomize ? (
            <ScrollView>
              <Text style={[styles.title, { color: theme.text }]}>
                Ihre Privatsphäre ist uns wichtig
              </Text>
              <Text style={[styles.description, { color: theme.textSecondary }]}>
                Wir verwenden Cookies und ähnliche Technologien, um Ihnen die bestmögliche Erfahrung zu bieten. 
                Sie können Ihre Einstellungen jederzeit anpassen.
              </Text>
              
              <TouchableOpacity
                style={[styles.button, styles.primaryButton, { backgroundColor: theme.primary }]}
                onPress={handleAcceptAll}
              >
                <Text style={styles.buttonText}>Alle akzeptieren</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.button, styles.secondaryButton, { borderColor: theme.border }]}
                onPress={handleRejectNonEssential}
              >
                <Text style={[styles.buttonTextSecondary, { color: theme.text }]}>
                  Nur notwendige
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.button, styles.secondaryButton, { borderColor: theme.border }]}
                onPress={() => setShowCustomize(true)}
              >
                <Text style={[styles.buttonTextSecondary, { color: theme.text }]}>
                  Einstellungen anpassen
                </Text>
              </TouchableOpacity>
            </ScrollView>
          ) : (
            <ScrollView>
              <Text style={[styles.title, { color: theme.text }]}>
                Cookie-Einstellungen
              </Text>
              
              <View style={styles.preferenceItem}>
                <View style={styles.preferenceText}>
                  <Text style={[styles.preferenceTitle, { color: theme.text }]}>
                    Notwendige Cookies
                  </Text>
                  <Text style={[styles.preferenceDesc, { color: theme.textSecondary }]}>
                    Erforderlich für grundlegende Funktionen
                  </Text>
                </View>
                <Switch value={true} disabled />
              </View>
              
              <View style={styles.preferenceItem}>
                <View style={styles.preferenceText}>
                  <Text style={[styles.preferenceTitle, { color: theme.text }]}>
                    Funktionale Cookies
                  </Text>
                  <Text style={[styles.preferenceDesc, { color: theme.textSecondary }]}>
                    Speichern Ihre Präferenzen
                  </Text>
                </View>
                <Switch
                  value={preferences.functional}
                  onValueChange={(val) => setPreferences({ ...preferences, functional: val })}
                />
              </View>
              
              <View style={styles.preferenceItem}>
                <View style={styles.preferenceText}>
                  <Text style={[styles.preferenceTitle, { color: theme.text }]}>
                    Analyse-Cookies
                  </Text>
                  <Text style={[styles.preferenceDesc, { color: theme.textSecondary }]}>
                    Helfen uns die App zu verbessern
                  </Text>
                </View>
                <Switch
                  value={preferences.analytics}
                  onValueChange={(val) => setPreferences({ ...preferences, analytics: val })}
                />
              </View>
              
              <View style={styles.preferenceItem}>
                <View style={styles.preferenceText}>
                  <Text style={[styles.preferenceTitle, { color: theme.text }]}>
                    Marketing-Cookies
                  </Text>
                  <Text style={[styles.preferenceDesc, { color: theme.textSecondary }]}>
                    Für personalisierte Werbung
                  </Text>
                </View>
                <Switch
                  value={preferences.marketing}
                  onValueChange={(val) => setPreferences({ ...preferences, marketing: val })}
                />
              </View>
              
              <TouchableOpacity
                style={[styles.button, styles.primaryButton, { backgroundColor: theme.primary }]}
                onPress={handleSaveCustom}
              >
                <Text style={styles.buttonText}>Einstellungen speichern</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.button, styles.secondaryButton, { borderColor: theme.border }]}
                onPress={() => setShowCustomize(false)}
              >
                <Text style={[styles.buttonTextSecondary, { color: theme.text }]}>Zurück</Text>
              </TouchableOpacity>
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  banner: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    maxHeight: '80%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  button: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButton: {},
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextSecondary: {
    fontSize: 16,
    fontWeight: '600',
  },
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  preferenceText: {
    flex: 1,
    marginRight: 16,
  },
  preferenceTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  preferenceDesc: {
    fontSize: 13,
  },
});
