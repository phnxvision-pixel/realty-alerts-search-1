import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { supabase } from '@/app/lib/supabase';
import { Colors } from '@/constants/theme';


export default function ApplicationDetailScreen() {
  const { id } = useLocalSearchParams();
  const [application, setApplication] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplicationDetails();
  }, [id]);

  const fetchApplicationDetails = async () => {
    try {
      const { data: app, error: appError } = await supabase
        .from('rental_applications')
        .select('*, apartments(title, address, price)')
        .eq('id', id)
        .single();

      if (appError) throw appError;
      setApplication(app);

      const { data: hist, error: histError } = await supabase
        .from('application_status_history')
        .select('*')
        .eq('application_id', id)
        .order('created_at', { ascending: false });

      if (histError) throw histError;
      setHistory(hist || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={Colors.primary} />

      </View>
    );
  }

  if (!application) {
    return (
      <View style={styles.loading}>
        <Text>Application not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.title}>{application.apartments?.title}</Text>
        <Text style={styles.subtitle}>{application.apartments?.address}</Text>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{application.status.toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Application Details</Text>
        <Text style={styles.detail}>Submitted: {new Date(application.created_at).toLocaleDateString()}</Text>
        <Text style={styles.detail}>Monthly Income: €{application.monthly_income}</Text>
        <Text style={styles.detail}>Move-in Date: {application.move_in_date}</Text>
      </View>

      {history.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Status History</Text>
          {history.map((item) => (
            <View key={item.id} style={styles.historyItem}>
              <Text style={styles.historyStatus}>{item.new_status}</Text>
              <Text style={styles.historyDate}>
                {new Date(item.created_at).toLocaleDateString()}
              </Text>
              {item.notes && <Text style={styles.historyNotes}>{item.notes}</Text>}
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  section: { backgroundColor: 'white', margin: 16, padding: 16, borderRadius: 12 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 4 },
  subtitle: { color: '#6b7280', marginBottom: 12 },
  statusBadge: { backgroundColor: Colors.primary, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, alignSelf: 'flex-start' },

  statusText: { color: 'white', fontWeight: 'bold', fontSize: 12 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  detail: { fontSize: 14, color: '#4b5563', marginBottom: 6 },
  historyItem: { backgroundColor: '#f3f4f6', padding: 12, borderRadius: 8, marginBottom: 8 },
  historyStatus: { fontWeight: 'bold', fontSize: 14, marginBottom: 4 },
  historyDate: { fontSize: 12, color: '#6b7280', marginBottom: 4 },
  historyNotes: { fontSize: 13, color: '#4b5563', fontStyle: 'italic' }
});
