import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { supabase } from '@/app/lib/supabase';
import { Colors } from '@/constants/theme';


interface RentalApplicationFormProps {
  apartmentId: string;
  landlordId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function RentalApplicationForm({ 
  apartmentId, 
  landlordId, 
  onSuccess, 
  onCancel 
}: RentalApplicationFormProps) {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    current_address: '',
    employment_status: '',
    employer_name: '',
    job_title: '',
    employment_duration: '',
    monthly_income: '',
    reference_1_name: '',
    reference_1_phone: '',
    reference_1_relationship: '',
    reference_2_name: '',
    reference_2_phone: '',
    reference_2_relationship: '',
    number_of_occupants: '1',
    has_pets: false,
    pet_details: '',
    move_in_date: '',
    lease_duration_months: '12',
    additional_notes: ''
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!formData.full_name || !formData.email || !formData.phone) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase.from('rental_applications').insert({
        apartment_id: apartmentId,
        tenant_id: user.id,
        landlord_id: landlordId,
        ...formData,
        monthly_income: parseFloat(formData.monthly_income) || null,
        number_of_occupants: parseInt(formData.number_of_occupants) || 1,
        lease_duration_months: parseInt(formData.lease_duration_months) || 12
      });

      if (error) throw error;

      Alert.alert('Success', 'Application submitted successfully!');
      onSuccess();
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Personal Information</Text>
      <TextInput
        style={styles.input}
        placeholder="Full Name *"
        value={formData.full_name}
        onChangeText={(text) => setFormData({ ...formData, full_name: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Email *"
        value={formData.email}
        onChangeText={(text) => setFormData({ ...formData, email: text })}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Phone *"
        value={formData.phone}
        onChangeText={(text) => setFormData({ ...formData, phone: text })}
        keyboardType="phone-pad"
      />

      <Text style={styles.sectionTitle}>Employment</Text>
      <TextInput
        style={styles.input}
        placeholder="Employer Name"
        value={formData.employer_name}
        onChangeText={(text) => setFormData({ ...formData, employer_name: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Job Title"
        value={formData.job_title}
        onChangeText={(text) => setFormData({ ...formData, job_title: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Monthly Income"
        value={formData.monthly_income}
        onChangeText={(text) => setFormData({ ...formData, monthly_income: text })}
        keyboardType="numeric"
      />

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.submitButton, loading && styles.disabledButton]} 
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>
            {loading ? 'Submitting...' : 'Submit Application'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 20, marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 12 },
  buttonRow: { flexDirection: 'row', gap: 12, marginTop: 20, marginBottom: 40 },
  cancelButton: { flex: 1, padding: 16, borderRadius: 8, borderWidth: 1, borderColor: '#ddd' },
  cancelButtonText: { textAlign: 'center', fontSize: 16 },
  submitButton: { flex: 1, padding: 16, borderRadius: 8, backgroundColor: Colors.primary },

  submitButtonText: { textAlign: 'center', color: 'white', fontSize: 16, fontWeight: 'bold' },
  disabledButton: { opacity: 0.5 }
});
