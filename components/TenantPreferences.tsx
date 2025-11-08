import React, { useState, useEffect } from 'react';
import { View, Text, Switch, StyleSheet, ScrollView, Alert } from 'react-native';
import { supabase } from '@/app/lib/supabase';

interface TenantPreferencesProps {
  userId: string;
}

export default function TenantPreferences({ userId }: TenantPreferencesProps) {
  const [preferences, setPreferences] = useState({
    allow_bulk_messages: true,
    allow_marketing_emails: true,
    allow_property_updates: true,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPreferences();
  }, [userId]);

  const loadPreferences = async () => {
    const { data, error } = await supabase
      .from('tenant_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (data) {
      setPreferences(data);
    } else if (!error || error.code === 'PGRST116') {
      // Create default preferences if they don't exist
      await supabase.from('tenant_preferences').insert({
        user_id: userId,
        allow_bulk_messages: true,
        allow_marketing_emails: true,
        allow_property_updates: true,
      });
    }
    setLoading(false);
  };

  const updatePreference = async (key: string, value: boolean) => {
    const newPreferences = { ...preferences, [key]: value };
    setPreferences(newPreferences);

    const { error } = await supabase
      .from('tenant_preferences')
      .upsert({
        user_id: userId,
        ...newPreferences,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      Alert.alert('Error', 'Failed to update preferences');
      // Revert on error
      setPreferences(preferences);
    }
  };

  if (loading) {
    return <Text style={styles.loading}>Loading preferences...</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Notification Preferences</Text>
      <Text style={styles.subtitle}>
        Control what messages and notifications you receive from landlords
      </Text>

      <View style={styles.preferenceItem}>
        <View style={styles.preferenceInfo}>
          <Text style={styles.preferenceTitle}>Bulk Messages</Text>
          <Text style={styles.preferenceDesc}>
            Receive general announcements and updates sent to multiple tenants
          </Text>
        </View>
        <Switch
          value={preferences.allow_bulk_messages}
          onValueChange={(value) => updatePreference('allow_bulk_messages', value)}
        />
      </View>

      <View style={styles.preferenceItem}>
        <View style={styles.preferenceInfo}>
          <Text style={styles.preferenceTitle}>Marketing Emails</Text>
          <Text style={styles.preferenceDesc}>
            Receive promotional content and special offers from landlords
          </Text>
        </View>
        <Switch
          value={preferences.allow_marketing_emails}
          onValueChange={(value) => updatePreference('allow_marketing_emails', value)}
        />
      </View>

      <View style={styles.preferenceItem}>
        <View style={styles.preferenceInfo}>
          <Text style={styles.preferenceTitle}>Property Updates</Text>
          <Text style={styles.preferenceDesc}>
            Receive notifications about maintenance, events, and property news
          </Text>
        </View>
        <Switch
          value={preferences.allow_property_updates}
          onValueChange={(value) => updatePreference('allow_property_updates', value)}
        />
      </View>

      <View style={styles.note}>
        <Text style={styles.noteText}>
          Note: You will still receive direct messages and important account notifications
          regardless of these settings.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  loading: { textAlign: 'center', marginTop: 40, fontSize: 16, color: '#666' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 24 },
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  preferenceInfo: { flex: 1, marginRight: 16 },
  preferenceTitle: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  preferenceDesc: { fontSize: 14, color: '#666' },
  note: {
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 8,
    marginTop: 24,
  },
  noteText: { fontSize: 13, color: '#666', lineHeight: 20 },
});
