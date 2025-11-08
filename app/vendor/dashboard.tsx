import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../lib/supabase';

export default function VendorDashboard() {
  const router = useRouter();
  const [jobs, setJobs] = useState<any[]>([]);
  const [filter, setFilter] = useState('assigned');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => { loadJobs(); }, [filter]);

  const loadJobs = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: userData } = await supabase.from('users').select('vendor_id').eq('id', user?.id).single();
      
      let query = supabase.from('vendor_assignments').select('*, maintenance_requests(*, apartments(*))').eq('vendor_id', userData?.vendor_id);
      
      if (filter === 'assigned') query = query.eq('status', 'assigned');
      else if (filter === 'in_progress') query = query.eq('status', 'in_progress');
      else if (filter === 'completed') query = query.eq('status', 'completed');

      const { data } = await query.order('created_at', { ascending: false });
      setJobs(data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadJobs();
    setRefreshing(false);
  };

  const renderJob = ({ item }: any) => (
    <TouchableOpacity style={styles.jobCard} onPress={() => router.push(`/vendor/job/${item.maintenance_requests.id}`)}>
      <Text style={styles.jobTitle}>{item.maintenance_requests.category}</Text>
      <Text style={styles.jobDesc}>{item.maintenance_requests.description}</Text>
      <Text style={styles.jobAddress}>{item.maintenance_requests.apartments.address}</Text>
      <View style={styles.jobFooter}>
        <Text style={styles.jobPriority}>{item.maintenance_requests.priority}</Text>
        <Text style={styles.jobStatus}>{item.status}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Jobs</Text>
      <View style={styles.filterBar}>
        {['assigned', 'in_progress', 'completed'].map(f => (
          <TouchableOpacity key={f} style={[styles.filterBtn, filter === f && styles.filterBtnActive]} onPress={() => setFilter(f)}>
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f.replace('_', ' ')}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList data={jobs} renderItem={renderJob} keyExtractor={item => item.id} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} ListEmptyComponent={<Text style={styles.empty}>No jobs found</Text>} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  title: { fontSize: 24, fontWeight: 'bold', padding: 20 },
  filterBar: { flexDirection: 'row', paddingHorizontal: 20, marginBottom: 10 },
  filterBtn: { flex: 1, padding: 10, backgroundColor: '#fff', marginRight: 8, borderRadius: 8, alignItems: 'center' },
  filterBtnActive: { backgroundColor: '#007AFF' },
  filterText: { fontSize: 14, color: '#333', textTransform: 'capitalize' },
  filterTextActive: { color: '#fff', fontWeight: '600' },
  jobCard: { backgroundColor: '#fff', margin: 10, padding: 16, borderRadius: 12 },
  jobTitle: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  jobDesc: { fontSize: 14, color: '#666', marginBottom: 8 },
  jobAddress: { fontSize: 14, color: '#999', marginBottom: 12 },
  jobFooter: { flexDirection: 'row', justifyContent: 'space-between' },
  jobPriority: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase' },
  jobStatus: { fontSize: 12, color: '#007AFF', textTransform: 'capitalize' },
  empty: { textAlign: 'center', marginTop: 40, fontSize: 16, color: '#999' }
});
