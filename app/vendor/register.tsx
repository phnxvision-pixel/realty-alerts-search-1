import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../lib/supabase';

const SPECIALTIES = ['plumbing', 'electrical', 'hvac', 'carpentry', 'painting', 'landscaping', 'appliance_repair', 'general'];

export default function VendorRegister() {
  const router = useRouter();
  const [businessName, setBusinessName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [serviceArea, setServiceArea] = useState('');
  const [bio, setBio] = useState('');
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleSpecialty = (specialty: string) => {
    setSelectedSpecialties(prev =>
      prev.includes(specialty) ? prev.filter(s => s !== specialty) : [...prev, specialty]
    );
  };

  const handleRegister = async () => {
    if (!businessName || !phone || !email || selectedSpecialties.length === 0) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('vendor-register', {
        body: { businessName, phone, email, specialties: selectedSpecialties, hourlyRate: parseFloat(hourlyRate) || 0, serviceArea, bio }
      });

      if (error) throw error;
      Alert.alert('Success', 'Vendor registration complete!', [
        { text: 'OK', onPress: () => router.replace('/vendor/dashboard') }
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Register as Vendor</Text>
      <TextInput style={styles.input} placeholder="Business Name *" value={businessName} onChangeText={setBusinessName} />
      <TextInput style={styles.input} placeholder="Phone *" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
      <TextInput style={styles.input} placeholder="Email *" value={email} onChangeText={setEmail} keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Hourly Rate ($)" value={hourlyRate} onChangeText={setHourlyRate} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Service Area" value={serviceArea} onChangeText={setServiceArea} />
      <TextInput style={[styles.input, styles.textArea]} placeholder="Bio" value={bio} onChangeText={setBio} multiline numberOfLines={4} />
      
      <Text style={styles.label}>Specialties *</Text>
      <View style={styles.specialtiesGrid}>
        {SPECIALTIES.map(specialty => (
          <TouchableOpacity key={specialty} style={[styles.specialtyChip, selectedSpecialties.includes(specialty) && styles.specialtyChipActive]} onPress={() => toggleSpecialty(specialty)}>
            <Text style={[styles.specialtyText, selectedSpecialties.includes(specialty) && styles.specialtyTextActive]}>{specialty.replace('_', ' ')}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Registering...' : 'Register'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 12, fontSize: 16 },
  textArea: { height: 100, textAlignVertical: 'top' },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  specialtiesGrid: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20 },
  specialtyChip: { backgroundColor: '#f0f0f0', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginRight: 8, marginBottom: 8 },
  specialtyChipActive: { backgroundColor: '#007AFF' },
  specialtyText: { fontSize: 14, color: '#333', textTransform: 'capitalize' },
  specialtyTextActive: { color: '#fff' },
  button: { backgroundColor: '#007AFF', padding: 16, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' }
});
