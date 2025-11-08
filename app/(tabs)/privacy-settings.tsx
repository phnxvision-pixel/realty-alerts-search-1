import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity, Alert, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/app/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { consentManager } from '@/app/lib/consent-manager';


export default function PrivacySettings() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [locationTracking, setLocationTracking] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const { data } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (data) {
        setEmailNotifications(data.email_enabled ?? true);
        setMarketingEmails(data.marketing_emails ?? false);
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  const updatePreference = async (field: string, value: boolean) => {
    try {
      await supabase
        .from('notification_preferences')
        .upsert({
          user_id: user?.id,
          [field]: value,
          updated_at: new Date().toISOString()
        });
    } catch (error) {
      console.error('Error updating preference:', error);
    }
  };

  const handleRequestDeletion = () => {
    Alert.alert(
      'Daten löschen',
      'Möchten Sie wirklich alle Ihre Daten löschen? Diese Aktion kann nicht rückgängig gemacht werden.',
      [
        { text: 'Abbrechen', style: 'cancel' },
        { text: 'Löschen', style: 'destructive', onPress: requestDataDeletion }
      ]
    );
  };

  const requestDataDeletion = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke('request-data-deletion', {
        body: { user_id: user?.id }
      });

      if (error) throw error;

      Alert.alert('Erfolg', 'Ihre Löschanfrage wurde eingereicht. Sie erhalten eine Bestätigung per E-Mail.');
    } catch (error) {
      Alert.alert('Fehler', 'Löschanfrage konnte nicht verarbeitet werden.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('download-user-data', {
        body: { user_id: user?.id }
      });

      if (error) throw error;

      Alert.alert('Erfolg', 'Ihre Daten werden per E-Mail zugesendet.');
    } catch (error) {
      Alert.alert('Fehler', 'Datenexport konnte nicht verarbeitet werden.');
    } finally {
      setLoading(false);
    }
  };

  const openPrivacyPolicy = () => {
    Linking.openURL('https://your-domain.com/privacy-policy.html');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Datenschutzeinstellungen</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Standortverfolgung</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Standortdaten erfassen</Text>
          <Switch
            value={locationTracking}
            onValueChange={(value) => {
              setLocationTracking(value);
              updatePreference('location_tracking', value);
            }}
          />
        </View>
        <Text style={styles.description}>
          Ermöglicht personalisierte Wohnungsvorschläge basierend auf Ihrem Standort
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>E-Mail-Benachrichtigungen</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Wichtige Updates</Text>
          <Switch
            value={emailNotifications}
            onValueChange={(value) => {
              setEmailNotifications(value);
              updatePreference('email_enabled', value);
            }}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Marketing-E-Mails</Text>
          <Switch
            value={marketingEmails}
            onValueChange={(value) => {
              setMarketingEmails(value);
              updatePreference('marketing_emails', value);
            }}
          />
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cookie-Einstellungen</Text>
        <TouchableOpacity 
          style={styles.linkButton}
          onPress={async () => {
            await consentManager.clearConsent();
            Alert.alert('Erfolg', 'Cookie-Einstellungen wurden zurückgesetzt. Starten Sie die App neu, um das Banner erneut anzuzeigen.');
          }}
        >
          <Text style={styles.linkText}>Cookie-Einstellungen ändern</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Datensammlung</Text>
        <Text style={styles.infoText}>Wir sammeln folgende Daten:</Text>
        <Text style={styles.bulletPoint}>• Kontoinformationen (Name, E-Mail)</Text>
        <Text style={styles.bulletPoint}>• Suchpräferenzen</Text>
        <Text style={styles.bulletPoint}>• Favoriten und gespeicherte Suchen</Text>
        <Text style={styles.bulletPoint}>• Nachrichten und Bewerbungen</Text>
        <Text style={styles.bulletPoint}>• Standortdaten (optional)</Text>
      </View>


      <TouchableOpacity style={styles.button} onPress={openPrivacyPolicy}>
        <Text style={styles.buttonText}>Datenschutzerklärung anzeigen</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleDownloadData} disabled={loading}>
        <Text style={styles.buttonText}>Meine Daten herunterladen</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, styles.dangerButton]} 
        onPress={handleRequestDeletion}
        disabled={loading}
      >
        <Text style={[styles.buttonText, styles.dangerText]}>Daten löschen anfordern</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  section: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  label: { fontSize: 16, flex: 1 },
  description: { fontSize: 14, color: '#666', marginTop: 5 },
  infoText: { fontSize: 14, marginBottom: 10, fontWeight: '500' },
  bulletPoint: { fontSize: 14, color: '#666', marginBottom: 5 },
  button: { backgroundColor: '#007AFF', padding: 15, borderRadius: 10, marginBottom: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  dangerButton: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#FF3B30' },
  dangerText: { color: '#FF3B30' },
  linkButton: { padding: 10 },
  linkText: { color: '#007AFF', fontSize: 16 }
});

