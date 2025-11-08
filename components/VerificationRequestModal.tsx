import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/app/lib/supabase';

interface VerificationRequestModalProps {
  visible: boolean;
  onClose: () => void;
  applicationId: string;
  tenantId: string;
}

export default function VerificationRequestModal({
  visible,
  onClose,
  applicationId,
  tenantId
}: VerificationRequestModalProps) {
  const [loading, setLoading] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const verificationTypes = [
    { id: 'credit_check', name: 'Credit Check', cost: 29.99, icon: 'card-outline' },
    { id: 'background_check', name: 'Background Check', cost: 39.99, icon: 'shield-checkmark-outline' },
    { id: 'employment_verification', name: 'Employment Verification', cost: 19.99, icon: 'briefcase-outline' },
    { id: 'rental_history', name: 'Rental History', cost: 24.99, icon: 'home-outline' }
  ];

  const toggleType = (typeId: string) => {
    setSelectedTypes(prev => 
      prev.includes(typeId) ? prev.filter(t => t !== typeId) : [...prev, typeId]
    );
  };

  const handleRequest = async () => {
    if (selectedTypes.length === 0) {
      Alert.alert('Error', 'Please select at least one verification type');
      return;
    }

    setLoading(true);
    try {
      for (const type of selectedTypes) {
        const { error } = await supabase.functions.invoke('request-verification', {
          body: {
            applicationId,
            tenantId,
            verificationType: type,
            paidBy: 'landlord'
          }
        });
        if (error) throw error;
      }
      Alert.alert('Success', 'Verification requests sent to tenant');
      onClose();
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const totalCost = selectedTypes.reduce((sum, typeId) => {
    const type = verificationTypes.find(t => t.id === typeId);
    return sum + (type?.cost || 0);
  }, 0);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>Request Verification</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            {verificationTypes.map(type => (
              <TouchableOpacity
                key={type.id}
                style={[styles.typeCard, selectedTypes.includes(type.id) && styles.typeCardSelected]}
                onPress={() => toggleType(type.id)}
              >
                <Ionicons name={type.icon as any} size={24} color={selectedTypes.includes(type.id) ? '#3B82F6' : '#666'} />
                <View style={styles.typeInfo}>
                  <Text style={styles.typeName}>{type.name}</Text>
                  <Text style={styles.typeCost}>${type.cost.toFixed(2)}</Text>
                </View>
                <Ionicons 
                  name={selectedTypes.includes(type.id) ? 'checkbox' : 'square-outline'} 
                  size={24} 
                  color={selectedTypes.includes(type.id) ? '#3B82F6' : '#CCC'} 
                />
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.footer}>
            <Text style={styles.total}>Total: ${totalCost.toFixed(2)}</Text>
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleRequest}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Requesting...' : 'Request Verification'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modal: { backgroundColor: '#FFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '80%' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  title: { fontSize: 20, fontWeight: 'bold' },
  content: { padding: 20 },
  typeCard: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 12 },
  typeCardSelected: { borderColor: '#3B82F6', backgroundColor: '#EFF6FF' },
  typeInfo: { flex: 1, marginLeft: 12 },
  typeName: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  typeCost: { fontSize: 14, color: '#666' },
  footer: { padding: 20, borderTopWidth: 1, borderTopColor: '#EEE' },
  total: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  button: { backgroundColor: '#3B82F6', padding: 16, borderRadius: 12, alignItems: 'center' },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
});
