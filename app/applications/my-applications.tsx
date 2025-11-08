import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/app/lib/supabase';
import { theme } from '@/constants/theme';

export default function MyApplicationsScreen() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchApplications = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('rental_applications')
        .select(`
          *,
          apartments (
            title,
            address,
            price
          )
        `)
        .eq('tenant_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return '#22c55e';
      case 'rejected': return '#ef4444';
      case 'under_review': return '#f59e0b';
      case 'documents_requested': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const renderApplication = ({ item }: any) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => router.push(`/applications/${item.id}`)}
    >
      <Text style={styles.title}>{item.apartments?.title}</Text>
      <Text style={styles.address}>{item.apartments?.address}</Text>
      <View style={styles.statusRow}>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status.replace('_', ' ').toUpperCase()}</Text>
        </View>
        <Text style={styles.date}>
          {new Date(item.created_at).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Applications</Text>
      <FlatList
        data={applications}
        renderItem={renderApplication}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchApplications} />
        }
        ListEmptyComponent={
          <Text style={styles.empty}>No applications yet</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: { fontSize: 24, fontWeight: 'bold', padding: 20 },
  card: { backgroundColor: 'white', margin: 16, padding: 16, borderRadius: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  address: { color: '#6b7280', marginBottom: 12 },
  statusRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  statusText: { color: 'white', fontSize: 12, fontWeight: 'bold' },
  date: { color: '#9ca3af', fontSize: 12 },
  empty: { textAlign: 'center', marginTop: 40, color: '#9ca3af' }
});
