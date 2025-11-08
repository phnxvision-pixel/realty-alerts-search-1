import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl, TouchableOpacity } from 'react-native';
import { supabase } from '@/app/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import VerificationConsentModal from '@/components/VerificationConsentModal';
import VerificationBadge from '@/components/VerificationBadge';

export default function Verifications() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<any[]>([]);
  const [verifications, setVerifications] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);

  const fetchData = async () => {
    try {
      const { data: reqData } = await supabase
        .from('verification_requests')
        .select('*')
        .eq('tenant_id', user?.id)
        .order('created_at', { ascending: false });

      const { data: verData } = await supabase
        .from('tenant_verifications')
        .select('*')
        .eq('tenant_id', user?.id)
        .single();

      setRequests(reqData || []);
      setVerifications(verData);
    } catch (error) {
      console.error('Error fetching verifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const renderRequest = ({ item }: any) => (
    <TouchableOpacity
      style={styles.requestCard}
      onPress={() => item.status === 'pending_consent' && setSelectedRequest(item)}
    >
      <Text style={styles.requestType}>
        {item.verification_type.replace('_', ' ').toUpperCase()}
      </Text>
      <Text style={styles.requestStatus}>{item.status}</Text>
      <Text style={styles.requestCost}>${item.cost_amount}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Verifications</Text>
      
      {verifications && (
        <View style={styles.badgeSection}>
          <Text style={styles.sectionTitle}>Verification Badges</Text>
          <View style={styles.badges}>
            <VerificationBadge verified={verifications.credit_check_verified} type="credit" />
            <VerificationBadge verified={verifications.background_check_verified} type="background" />
            <VerificationBadge verified={verifications.employment_verified} type="employment" />
            <VerificationBadge verified={verifications.rental_history_verified} type="rental" />
          </View>
        </View>
      )}

      <Text style={styles.sectionTitle}>Verification Requests</Text>
      <FlatList
        data={requests}
        renderItem={renderRequest}
        keyExtractor={item => item.id}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchData} />}
        ListEmptyComponent={<Text style={styles.empty}>No verification requests</Text>}
      />

      {selectedRequest && (
        <VerificationConsentModal
          visible={!!selectedRequest}
          onClose={() => {
            setSelectedRequest(null);
            fetchData();
          }}
          request={selectedRequest}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { fontSize: 24, fontWeight: 'bold', padding: 20 },
  badgeSection: { backgroundColor: '#FFF', padding: 16, marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12, paddingHorizontal: 20 },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  requestCard: { backgroundColor: '#FFF', padding: 16, marginHorizontal: 20, marginBottom: 12, borderRadius: 12 },
  requestType: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  requestStatus: { fontSize: 14, color: '#666', marginBottom: 4 },
  requestCost: { fontSize: 14, color: '#3B82F6', fontWeight: '600' },
  empty: { textAlign: 'center', color: '#999', marginTop: 40 }
});
