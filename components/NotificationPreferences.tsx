import React, { useState, useEffect } from 'react';
import { View, Text, Switch, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { supabase } from '../app/lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export default function NotificationPreferences() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [prefs, setPrefs] = useState({
    new_messages: true,
    message_sound: true,
    application_status_updates: true,
    application_messages: true,
    favorite_price_changes: true,
    saved_search_matches: true,
    new_listings_in_area: true,
    new_applications: true,
    application_deadlines: true,
    payment_received: true,
    quiet_hours_enabled: false,
    quiet_hours_start: '22:00',
    quiet_hours_end: '08:00',
    instant_notifications: true,
    daily_digest: false,
    weekly_digest: false,
  });

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('notification_preferences')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (data) {
      setPrefs(data);
    } else {
      await supabase.from('notification_preferences').insert({ user_id: user.id });
    }
    setLoading(false);
  };

  const updatePref = async (key: string, value: boolean) => {
    setPrefs({ ...prefs, [key]: value });
    await supabase
      .from('notification_preferences')
      .upsert({ user_id: user?.id, [key]: value, updated_at: new Date().toISOString() });
  };

  const Section = ({ title, children }: any) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );

  const PrefRow = ({ label, value, onToggle }: any) => (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Switch value={value} onValueChange={onToggle} />
    </View>
  );

  if (loading) return <Text style={styles.loading}>Loading...</Text>;

  return (
    <ScrollView style={styles.container}>
      <Section title="Messages">
        <PrefRow label="New Messages" value={prefs.new_messages} onToggle={(v: boolean) => updatePref('new_messages', v)} />
        <PrefRow label="Message Sound" value={prefs.message_sound} onToggle={(v: boolean) => updatePref('message_sound', v)} />
      </Section>

      <Section title="Applications">
        <PrefRow label="Status Updates" value={prefs.application_status_updates} onToggle={(v: boolean) => updatePref('application_status_updates', v)} />
        <PrefRow label="Application Messages" value={prefs.application_messages} onToggle={(v: boolean) => updatePref('application_messages', v)} />
      </Section>

      <Section title="Properties">
        <PrefRow label="Price Changes" value={prefs.favorite_price_changes} onToggle={(v: boolean) => updatePref('favorite_price_changes', v)} />
        <PrefRow label="Saved Search Matches" value={prefs.saved_search_matches} onToggle={(v: boolean) => updatePref('saved_search_matches', v)} />
        <PrefRow label="New Listings" value={prefs.new_listings_in_area} onToggle={(v: boolean) => updatePref('new_listings_in_area', v)} />
      </Section>

      <Section title="Landlord Notifications">
        <PrefRow label="New Applications" value={prefs.new_applications} onToggle={(v: boolean) => updatePref('new_applications', v)} />
        <PrefRow label="Deadlines" value={prefs.application_deadlines} onToggle={(v: boolean) => updatePref('application_deadlines', v)} />
        <PrefRow label="Payments" value={prefs.payment_received} onToggle={(v: boolean) => updatePref('payment_received', v)} />
      </Section>

      <Section title="Quiet Hours">
        <PrefRow label="Enable Quiet Hours" value={prefs.quiet_hours_enabled} onToggle={(v: boolean) => updatePref('quiet_hours_enabled', v)} />
        <Text style={styles.info}>Notifications during quiet hours will be scheduled for later</Text>
      </Section>

      <Section title="Delivery">
        <PrefRow label="Instant" value={prefs.instant_notifications} onToggle={(v: boolean) => updatePref('instant_notifications', v)} />
        <PrefRow label="Daily Digest" value={prefs.daily_digest} onToggle={(v: boolean) => updatePref('daily_digest', v)} />
        <PrefRow label="Weekly Digest" value={prefs.weekly_digest} onToggle={(v: boolean) => updatePref('weekly_digest', v)} />
      </Section>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  section: { backgroundColor: '#fff', marginBottom: 12, padding: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  label: { fontSize: 16 },
  info: { fontSize: 12, color: '#666', marginTop: 4 },
  loading: { textAlign: 'center', marginTop: 20, fontSize: 16 },
});
