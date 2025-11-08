import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { supabase } from '@/app/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';

export default function PreferencesScreen() {
  const { user } = useAuth();
  const [prefs, setPrefs] = useState({
    min_price: '',
    max_price: '',
    min_bedrooms: '',
    max_bedrooms: '',
    preferred_locations: '',
    required_amenities: '',
    max_commute_time: '',
    work_location: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('tenant_preferences')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (data) {
      setPrefs({
        min_price: data.min_price?.toString() || '',
        max_price: data.max_price?.toString() || '',
        min_bedrooms: data.min_bedrooms?.toString() || '',
        max_bedrooms: data.max_bedrooms?.toString() || '',
        preferred_locations: data.preferred_locations?.join(', ') || '',
        required_amenities: data.required_amenities?.join(', ') || '',
        max_commute_time: data.max_commute_time?.toString() || '',
        work_location: data.work_location || '',
      });
    }
  };

  const savePreferences = async () => {
    if (!user) return;
    setLoading(true);

    const { error } = await supabase.from('tenant_preferences').upsert({
      user_id: user.id,
      min_price: parseInt(prefs.min_price) || null,
      max_price: parseInt(prefs.max_price) || null,
      min_bedrooms: parseInt(prefs.min_bedrooms) || null,
      max_bedrooms: parseInt(prefs.max_bedrooms) || null,
      preferred_locations: prefs.preferred_locations.split(',').map(s => s.trim()).filter(Boolean),
      required_amenities: prefs.required_amenities.split(',').map(s => s.trim()).filter(Boolean),
      max_commute_time: parseInt(prefs.max_commute_time) || null,
      work_location: prefs.work_location || null,
      updated_at: new Date().toISOString(),
    });

    setLoading(false);
    if (error) {
      Alert.alert('Error', 'Failed to save preferences');
    } else {
      Alert.alert('Success', 'Preferences saved! Matching will improve over time.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Your Apartment Preferences</Text>
      <Text style={styles.subtitle}>Help us find your perfect match</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Budget</Text>
        <View style={styles.row}>
          <View style={styles.halfInput}>
            <Text style={styles.label}>Min Price (€)</Text>
            <TextInput
              style={styles.input}
              value={prefs.min_price}
              onChangeText={(text) => setPrefs({ ...prefs, min_price: text })}
              keyboardType="numeric"
              placeholder="500"
            />
          </View>
          <View style={styles.halfInput}>
            <Text style={styles.label}>Max Price (€)</Text>
            <TextInput
              style={styles.input}
              value={prefs.max_price}
              onChangeText={(text) => setPrefs({ ...prefs, max_price: text })}
              keyboardType="numeric"
              placeholder="2000"
            />
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Size</Text>
        <View style={styles.row}>
          <View style={styles.halfInput}>
            <Text style={styles.label}>Min Bedrooms</Text>
            <TextInput
              style={styles.input}
              value={prefs.min_bedrooms}
              onChangeText={(text) => setPrefs({ ...prefs, min_bedrooms: text })}
              keyboardType="numeric"
              placeholder="1"
            />
          </View>
          <View style={styles.halfInput}>
            <Text style={styles.label}>Max Bedrooms</Text>
            <TextInput
              style={styles.input}
              value={prefs.max_bedrooms}
              onChangeText={(text) => setPrefs({ ...prefs, max_bedrooms: text })}
              keyboardType="numeric"
              placeholder="3"
            />
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Location</Text>
        <Text style={styles.label}>Preferred Locations (comma-separated)</Text>
        <TextInput
          style={styles.input}
          value={prefs.preferred_locations}
          onChangeText={(text) => setPrefs({ ...prefs, preferred_locations: text })}
          placeholder="Berlin, Munich, Hamburg"
          multiline
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Amenities</Text>
        <Text style={styles.label}>Required Amenities (comma-separated)</Text>
        <TextInput
          style={styles.input}
          value={prefs.required_amenities}
          onChangeText={(text) => setPrefs({ ...prefs, required_amenities: text })}
          placeholder="Parking, Balcony, Elevator"
          multiline
        />
      </View>

      <TouchableOpacity
        style={[styles.saveBtn, loading && styles.saveBtnDisabled]}
        onPress={savePreferences}
        disabled={loading}
      >
        <Ionicons name="save" size={20} color="#fff" />
        <Text style={styles.saveBtnText}>
          {loading ? 'Saving...' : 'Save Preferences'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 24 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
  label: { fontSize: 14, fontWeight: '500', marginBottom: 6, color: '#374151' },
  input: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, padding: 12, fontSize: 16 },
  row: { flexDirection: 'row', gap: 12 },
  halfInput: { flex: 1 },
  saveBtn: { backgroundColor: '#3b82f6', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, borderRadius: 8, gap: 8, marginBottom: 40 },
  saveBtnDisabled: { opacity: 0.6 },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
