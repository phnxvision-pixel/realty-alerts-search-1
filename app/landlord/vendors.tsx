import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';
import VendorCard from '../../components/VendorCard';

const SPECIALTIES = ['plumbing', 'electrical', 'hvac', 'carpentry', 'painting', 'landscaping', 'appliance_repair', 'general'];

export default function VendorsScreen() {
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingVendor, setEditingVendor] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '', company_name: '', email: '', phone: '', specialties: [] as string[],
    hourly_rate: '', description: '', license_number: '', insurance_verified: false
  });

  useEffect(() => {
    loadVendors();
  }, []);

  const loadVendors = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('manage-vendors', {
        body: { action: 'list' }
      });
      if (error) throw error;
      setVendors(data.data || []);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const action = editingVendor ? 'update' : 'create';
      const { data, error } = await supabase.functions.invoke('manage-vendors', {
        body: { action, vendorData: formData, vendorId: editingVendor?.id }
      });
      if (error) throw error;
      Alert.alert('Success', `Vendor ${action}d successfully`);
      setShowAddModal(false);
      setEditingVendor(null);
      resetForm();
      loadVendors();
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', company_name: '', email: '', phone: '', specialties: [], hourly_rate: '', description: '', license_number: '', insurance_verified: false });
  };

  const toggleSpecialty = (specialty: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter(s => s !== specialty)
        : [...prev.specialties, specialty]
    }));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Vendors</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setShowAddModal(true)}>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {vendors.map(vendor => (
          <VendorCard
            key={vendor.id}
            vendor={vendor}
            onEdit={() => {
              setEditingVendor(vendor);
              setFormData(vendor);
              setShowAddModal(true);
            }}
          />
        ))}
      </ScrollView>

      <Modal visible={showAddModal} animationType="slide">
        <View style={styles.modal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{editingVendor ? 'Edit' : 'Add'} Vendor</Text>
            <TouchableOpacity onPress={() => { setShowAddModal(false); resetForm(); }}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.form}>
            <TextInput style={styles.input} placeholder="Name" value={formData.name} onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))} />
            <TextInput style={styles.input} placeholder="Company Name" value={formData.company_name} onChangeText={(text) => setFormData(prev => ({ ...prev, company_name: text }))} />
            <TextInput style={styles.input} placeholder="Email" value={formData.email} onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))} keyboardType="email-address" />
            <TextInput style={styles.input} placeholder="Phone" value={formData.phone} onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))} keyboardType="phone-pad" />
            <TextInput style={styles.input} placeholder="Hourly Rate" value={formData.hourly_rate} onChangeText={(text) => setFormData(prev => ({ ...prev, hourly_rate: text }))} keyboardType="numeric" />
            <Text style={styles.label}>Specialties</Text>
            <View style={styles.specialties}>
              {SPECIALTIES.map(specialty => (
                <TouchableOpacity key={specialty} style={[styles.specialtyChip, formData.specialties.includes(specialty) && styles.specialtyChipActive]} onPress={() => toggleSpecialty(specialty)}>
                  <Text style={[styles.specialtyChipText, formData.specialties.includes(specialty) && styles.specialtyChipTextActive]}>{specialty}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save Vendor</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: '700' },
  addButton: { backgroundColor: '#007AFF', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  content: { flex: 1, padding: 16 },
  modal: { flex: 1, backgroundColor: '#fff' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#e0e0e0' },
  modalTitle: { fontSize: 20, fontWeight: '700' },
  form: { flex: 1, padding: 16 },
  input: { backgroundColor: '#f5f5f5', padding: 12, borderRadius: 8, marginBottom: 12, fontSize: 16 },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  specialties: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 },
  specialtyChip: { backgroundColor: '#e0e0e0', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, marginRight: 8, marginBottom: 8 },
  specialtyChipActive: { backgroundColor: '#007AFF' },
  specialtyChipText: { color: '#666' },
  specialtyChipTextActive: { color: '#fff' },
  saveButton: { backgroundColor: '#007AFF', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 16 },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' }
});
