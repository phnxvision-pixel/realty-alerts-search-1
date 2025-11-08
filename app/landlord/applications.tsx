import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { useLandlord } from '@/contexts/LandlordContext';
import { supabase } from '@/app/lib/supabase';
import ApplicationReviewCard from '@/components/ApplicationReviewCard';

export default function Applications() {
  const { landlordProfile } = useLandlord();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    try {
      if (!landlordProfile?.id) return;

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
        .eq('landlord_id', landlordProfile.id)
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
  }, [landlordProfile]);

  const renderApplication = ({ item }: any) => (
    <ApplicationReviewCard application={item} onUpdate={fetchApplications} />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Rental Applications</Text>
      <FlatList
        data={applications}
        renderItem={renderApplication}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchApplications} />
        }
        ListEmptyComponent={
          <Text style={styles.empty}>No applications received yet</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: { fontSize: 24, fontWeight: 'bold', padding: 20 },
  list: { padding: 16 },
  empty: { textAlign: 'center', color: '#9ca3af', marginTop: 40, fontSize: 16 }
});

