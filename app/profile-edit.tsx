import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { supabase } from './lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import ConnectedAccounts from '@/components/ConnectedAccounts';

export default function ProfileEditScreen() {
  const { user, updateProfile } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    if (!user?.id) return;
    try {
      const { data, error } = await supabase
        .from('users')
        .select('full_name, phone')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      if (data) {
        setFullName(data.full_name || '');
        setPhone(data.phone || '');
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateProfile({ full_name: fullName, phone });
      Alert.alert('Erfolg', 'Profil erfolgreich aktualisiert');
      router.back();
    } catch (error: any) {
      Alert.alert('Fehler', 'Profil konnte nicht aktualisiert werden');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profil bearbeiten</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Vollständiger Name</Text>
        <TextInput
          style={styles.input}
          value={fullName}
          onChangeText={setFullName}
          placeholder="Name eingeben"
        />
        <Text style={styles.label}>E-Mail</Text>
        <TextInput
          style={[styles.input, styles.disabledInput]}
          value={user?.email}
          editable={false}
        />
        <Text style={styles.label}>Telefon</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          placeholder="Telefonnummer eingeben"
          keyboardType="phone-pad"
        />
      </View>

      <ConnectedAccounts />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={loading}>
        <Text style={styles.saveButtonText}>{loading ? 'Speichern...' : 'Änderungen speichern'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, backgroundColor: '#fff' },
  headerTitle: { fontSize: 18, fontWeight: '600' },
  section: { backgroundColor: '#fff', padding: 20, marginTop: 16 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8, color: '#333' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, fontSize: 16, marginBottom: 16 },
  disabledInput: { backgroundColor: '#f9f9f9', color: '#999' },
  saveButton: { backgroundColor: '#007AFF', margin: 16, padding: 16, borderRadius: 8, alignItems: 'center' },
  saveButtonText: { color: '#fff', fontWeight: '600', fontSize: 16 }
});
