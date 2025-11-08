import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { supabase } from '@/app/lib/supabase';
import { useLandlord } from '@/contexts/LandlordContext';
import PaymentHistoryList from '@/components/PaymentHistoryList';
import { Ionicons } from '@expo/vector-icons';

export default function PaymentHistory() {
  const { landlordProfile } = useLandlord();
  const [payments, setPayments] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPayments();
  }, [filter]);

  const loadPayments = async () => {
    try {
      let query = supabase
        .from('payment_history')
        .select('*')
        .eq('landlord_id', landlordProfile?.id)
        .order('created_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('payment_type', filter);
      }

      const { data, error } = await query;
      if (error) throw error;
      setPayments(data || []);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleViewInvoice = async (paymentId: string) => {
    Alert.alert('Invoice', 'Invoice generation coming soon!');
  };

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'subscription', label: 'Subscriptions' },
    { key: 'promotion', label: 'Promotions' }
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Payment History</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filters}>
        {filters.map(f => (
          <TouchableOpacity
            key={f.key}
            style={[styles.filterBtn, filter === f.key && styles.activeFilter]}
            onPress={() => setFilter(f.key)}
          >
            <Text style={[styles.filterText, filter === f.key && styles.activeFilterText]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <PaymentHistoryList payments={payments} onViewInvoice={handleViewInvoice} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  title: { fontSize: 24, fontWeight: 'bold' },
  filters: { flexGrow: 0, backgroundColor: '#fff', paddingVertical: 12, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#eee' },
  filterBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#f5f5f5', marginRight: 8 },
  activeFilter: { backgroundColor: '#007AFF' },
  filterText: { fontSize: 14, color: '#666' },
  activeFilterText: { color: '#fff', fontWeight: '600' }
});
