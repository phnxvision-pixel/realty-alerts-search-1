import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useLandlord } from '@/contexts/LandlordContext';
import { useAuth } from '@/contexts/AuthContext';

export default function LandlordRegister() {
  const router = useRouter();
  const { user } = useAuth();
  const { createLandlordProfile } = useLandlord();
  const [businessName, setBusinessName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!businessName || !phone) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await createLandlordProfile({
        business_name: businessName,
        phone: phone,
        verification_status: 'pending'
      });
      Alert.alert('Success', 'Landlord profile created!');
      router.replace('/landlord/dashboard');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Become a Landlord</Text>
      <Text style={styles.subtitle}>Start listing your properties today</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Business Name</Text>
        <TextInput
          style={styles.input}
          value={businessName}
          onChangeText={setBusinessName}
          placeholder="Your Property Management Company"
        />

        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          placeholder="(555) 123-4567"
          keyboardType="phone-pad"
        />

        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Creating Profile...' : 'Create Landlord Profile'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', marginTop: 20 },
  subtitle: { fontSize: 16, color: '#666', marginTop: 8, marginBottom: 30 },
  form: { gap: 20 },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, fontSize: 16 },
  button: { backgroundColor: '#007AFF', padding: 16, borderRadius: 8, marginTop: 20 },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: '#fff', textAlign: 'center', fontSize: 16, fontWeight: '600' }
});
