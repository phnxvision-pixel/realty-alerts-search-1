import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/app/lib/supabase';

interface Props {
  visible: boolean;
  onClose: () => void;
  apartmentId: string;
  landlordId: string;
}

export default function PromotionPurchaseModal({ visible, onClose, apartmentId, landlordId }: Props) {
  const [selectedType, setSelectedType] = useState('boost');
  const [selectedDuration, setSelectedDuration] = useState(7);
  const [loading, setLoading] = useState(false);

  const promotions = [
    { type: 'boost', name: 'Boost', icon: 'arrow-up-circle', color: '#FF9500' },
    { type: 'featured', name: 'Featured', icon: 'star', color: '#007AFF' },
    { type: 'premium', name: 'Premium', icon: 'diamond', color: '#AF52DE' }
  ];

  const durations = [7, 14, 30];

  const pricing = {
    boost: { 7: 9.99, 14: 17.99, 30: 29.99 },
    featured: { 7: 14.99, 14: 24.99, 30: 39.99 },
    premium: { 7: 19.99, 14: 34.99, 30: 49.99 }
  };

  const handlePurchase = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('purchase-listing-promotion', {
        body: { apartmentId, landlordId, promotionType: selectedType, duration: selectedDuration, paymentMethod: 'stripe' }
      });

      if (error) throw error;

      if (data.sessionUrl) {
        Alert.alert('Success', 'Redirecting to payment...');
        // In production, open Stripe checkout
      }
      onClose();
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>Promote Your Listing</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <ScrollView>
            <Text style={styles.label}>Promotion Type</Text>
            <View style={styles.options}>
              {promotions.map(promo => (
                <TouchableOpacity
                  key={promo.type}
                  style={[styles.option, selectedType === promo.type && styles.selectedOption]}
                  onPress={() => setSelectedType(promo.type)}
                >
                  <Ionicons name={promo.icon as any} size={32} color={promo.color} />
                  <Text style={styles.optionText}>{promo.name}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Duration</Text>
            <View style={styles.durations}>
              {durations.map(days => (
                <TouchableOpacity
                  key={days}
                  style={[styles.duration, selectedDuration === days && styles.selectedDuration]}
                  onPress={() => setSelectedDuration(days)}
                >
                  <Text style={styles.durationText}>{days} days</Text>
                  <Text style={styles.price}>${pricing[selectedType][days]}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.summary}>
              <Text style={styles.summaryText}>Total</Text>
              <Text style={styles.total}>${pricing[selectedType][selectedDuration]}</Text>
            </View>

            <TouchableOpacity style={styles.button} onPress={handlePurchase} disabled={loading}>
              <Text style={styles.buttonText}>Purchase Promotion</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modal: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '80%' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#eee' },
  title: { fontSize: 20, fontWeight: 'bold' },
  label: { fontSize: 16, fontWeight: '600', marginTop: 20, marginHorizontal: 20 },
  options: { flexDirection: 'row', padding: 20, gap: 12 },
  option: { flex: 1, alignItems: 'center', padding: 16, borderRadius: 12, borderWidth: 2, borderColor: '#eee' },
  selectedOption: { borderColor: '#007AFF', backgroundColor: '#007AFF10' },
  optionText: { marginTop: 8, fontSize: 14, fontWeight: '600' },
  durations: { flexDirection: 'row', padding: 20, gap: 12 },
  duration: { flex: 1, padding: 16, borderRadius: 12, borderWidth: 2, borderColor: '#eee', alignItems: 'center' },
  selectedDuration: { borderColor: '#007AFF', backgroundColor: '#007AFF10' },
  durationText: { fontSize: 16, fontWeight: '600' },
  price: { fontSize: 14, color: '#666', marginTop: 4 },
  summary: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, backgroundColor: '#f5f5f5', marginHorizontal: 20, borderRadius: 12, marginTop: 20 },
  summaryText: { fontSize: 18, fontWeight: '600' },
  total: { fontSize: 24, fontWeight: 'bold', color: '#007AFF' },
  button: { backgroundColor: '#007AFF', padding: 16, borderRadius: 12, margin: 20 },
  buttonText: { color: '#fff', textAlign: 'center', fontSize: 16, fontWeight: '600' }
});
