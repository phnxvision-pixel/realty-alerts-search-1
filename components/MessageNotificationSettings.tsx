import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/app/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function MessageNotificationSettings() {
  const { user } = useAuth();
  const [prefs, setPrefs] = useState({
    push_enabled: true,
    email_enabled: false,
    sms_enabled: false,
    quiet_hours_enabled: false,
    quiet_hours_start: '22:00',
    quiet_hours_end: '08:00',
    priority_only: false,
    sound_enabled: true,
    vibration_enabled: true
  });
  const [isPremium, setIsPremium] = useState(false);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    const { data: userData } = await supabase
      .from('users')
      .select('subscription_status, is_premium')
      .eq('id', user?.id)
      .single();
    
    setIsPremium(userData?.subscription_status === 'premium' || userData?.is_premium);

    const { data } = await supabase
      .from('message_notification_preferences')
      .select('*')
      .eq('user_id', user?.id)
      .single();

    if (data) setPrefs(data);
  };

  const updatePref = async (key: string, value: any) => {
    const updated = { ...prefs, [key]: value };
    setPrefs(updated);
    
    await supabase
      .from('message_notification_preferences')
      .upsert({ user_id: user?.id, ...updated });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Push Notifications</Text>
        <View style={styles.row}>
          <View style={styles.info}>
            <Text style={styles.label}>Enable Push</Text>
            <Text style={styles.desc}>Get instant alerts</Text>
          </View>
          <Switch value={prefs.push_enabled} onValueChange={(v) => updatePref('push_enabled', v)} />
        </View>
        <View style={styles.row}>
          <View style={styles.info}>
            <Text style={styles.label}>Sound</Text>
          </View>
          <Switch value={prefs.sound_enabled} onValueChange={(v) => updatePref('sound_enabled', v)} />
        </View>
        <View style={styles.row}>
          <View style={styles.info}>
            <Text style={styles.label}>Vibration</Text>
          </View>
          <Switch value={prefs.vibration_enabled} onValueChange={(v) => updatePref('vibration_enabled', v)} />
        </View>
      </View>

      {isPremium && (
        <>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Premium Channels</Text>
            <View style={styles.row}>
              <View style={styles.info}>
                <Text style={styles.label}>Email Notifications</Text>
                <Text style={styles.desc}>Receive via email</Text>
              </View>
              <Switch value={prefs.email_enabled} onValueChange={(v) => updatePref('email_enabled', v)} />
            </View>
            <View style={styles.row}>
              <View style={styles.info}>
                <Text style={styles.label}>SMS Notifications</Text>
                <Text style={styles.desc}>Receive via text</Text>
              </View>
              <Switch value={prefs.sms_enabled} onValueChange={(v) => updatePref('sms_enabled', v)} />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quiet Hours</Text>
            <View style={styles.row}>
              <View style={styles.info}>
                <Text style={styles.label}>Enable Quiet Hours</Text>
                <Text style={styles.desc}>Mute during set times</Text>
              </View>
              <Switch value={prefs.quiet_hours_enabled} onValueChange={(v) => updatePref('quiet_hours_enabled', v)} />
            </View>
            {prefs.quiet_hours_enabled && (
              <>
                <TouchableOpacity style={styles.timeRow} onPress={() => setShowStartPicker(true)}>
                  <Text style={styles.label}>Start Time</Text>
                  <Text style={styles.timeText}>{prefs.quiet_hours_start}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.timeRow} onPress={() => setShowEndPicker(true)}>
                  <Text style={styles.label}>End Time</Text>
                  <Text style={styles.timeText}>{prefs.quiet_hours_end}</Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          <View style={styles.section}>
            <View style={styles.row}>
              <View style={styles.info}>
                <Text style={styles.label}>Priority Only</Text>
                <Text style={styles.desc}>Only urgent messages</Text>
              </View>
              <Switch value={prefs.priority_only} onValueChange={(v) => updatePref('priority_only', v)} />
            </View>
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  section: { backgroundColor: '#fff', padding: 16, marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  info: { flex: 1 },
  label: { fontSize: 16, fontWeight: '500' },
  desc: { fontSize: 14, color: '#666', marginTop: 2 },
  timeRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  timeText: { fontSize: 16, color: '#007AFF' }
});
