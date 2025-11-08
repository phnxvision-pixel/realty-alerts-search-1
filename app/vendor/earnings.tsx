import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ScrollView } from 'react-native';
import { supabase } from '../lib/supabase';

export default function VendorEarnings() {
  const [stats, setStats] = useState({ total: 0, pending: 0, paid: 0, thisMonth: 0 });
  const [payments, setPayments] = useState<any[]>([]);

  useEffect(() => { loadEarnings(); }, []);

  const loadEarnings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: userData } = await supabase.from('users').select('vendor_id').eq('id', user?.id).single();
      
      const { data } = await supabase.from('vendor_payments').select('*').eq('vendor_id', userData?.vendor_id).order('created_at', { ascending: false });
      
      const total = data?.reduce((sum, p) => sum + p.amount, 0) || 0;
      const paid = data?.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0) || 0;
      const pending = data?.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0) || 0;
      const thisMonth = data?.filter(p => new Date(p.created_at).getMonth() === new Date().getMonth()).reduce((sum, p) => sum + p.amount, 0) || 0;
      
      setStats({ total, pending, paid, thisMonth });
      setPayments(data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const renderPayment = ({ item }: any) => (
    <View style={styles.paymentCard}>
      <View style={styles.paymentHeader}>
        <Text style={styles.paymentAmount}>${item.amount.toFixed(2)}</Text>
        <Text style={[styles.paymentStatus, item.status === 'paid' ? styles.statusPaid : styles.statusPending]}>{item.status}</Text>
      </View>
      <Text style={styles.paymentDesc}>{item.description}</Text>
      <Text style={styles.paymentDate}>{new Date(item.created_at).toLocaleDateString()}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Earnings Dashboard</Text>
      
      <View style={styles.statsGrid}>
        <View style={styles.statCard}><Text style={styles.statValue}>${stats.total.toFixed(2)}</Text><Text style={styles.statLabel}>Total Earnings</Text></View>
        <View style={styles.statCard}><Text style={styles.statValue}>${stats.thisMonth.toFixed(2)}</Text><Text style={styles.statLabel}>This Month</Text></View>
        <View style={styles.statCard}><Text style={styles.statValue}>${stats.pending.toFixed(2)}</Text><Text style={styles.statLabel}>Pending</Text></View>
        <View style={styles.statCard}><Text style={styles.statValue}>${stats.paid.toFixed(2)}</Text><Text style={styles.statLabel}>Paid</Text></View>
      </View>

      <Text style={styles.sectionTitle}>Payment History</Text>
      <FlatList data={payments} renderItem={renderPayment} keyExtractor={item => item.id} scrollEnabled={false} ListEmptyComponent={<Text style={styles.empty}>No payments yet</Text>} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  title: { fontSize: 24, fontWeight: 'bold', padding: 20 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 10 },
  statCard: { width: '48%', backgroundColor: '#fff', margin: '1%', padding: 20, borderRadius: 12, alignItems: 'center' },
  statValue: { fontSize: 24, fontWeight: 'bold', color: '#007AFF', marginBottom: 4 },
  statLabel: { fontSize: 12, color: '#666' },
  sectionTitle: { fontSize: 18, fontWeight: '600', padding: 20, paddingBottom: 10 },
  paymentCard: { backgroundColor: '#fff', margin: 10, padding: 16, borderRadius: 12 },
  paymentHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  paymentAmount: { fontSize: 20, fontWeight: 'bold' },
  paymentStatus: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  statusPaid: { backgroundColor: '#D4EDDA', color: '#155724' },
  statusPending: { backgroundColor: '#FFF3CD', color: '#856404' },
  paymentDesc: { fontSize: 14, color: '#666', marginBottom: 4 },
  paymentDate: { fontSize: 12, color: '#999' },
  empty: { textAlign: 'center', marginTop: 40, fontSize: 16, color: '#999' }
});
