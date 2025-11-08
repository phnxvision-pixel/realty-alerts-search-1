import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { supabase } from '../lib/supabase';
import LeaseCard from '../../components/LeaseCard';
import RentPaymentCard from '../../components/RentPaymentCard';
import MaintenanceRequestCard from '../../components/MaintenanceRequestCard';
import { useRouter } from 'expo-router';

export default function LeasesScreen() {
  const [activeTab, setActiveTab] = useState<'leases' | 'payments' | 'maintenance'>('leases');
  const [leases, setLeases] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [maintenanceRequests, setMaintenanceRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return;

    if (activeTab === 'leases') {
      const { data } = await supabase
        .from('leases')
        .select('*, apartment:apartments(*), tenant:users!tenant_id(*)')
        .eq('tenant_id', user.id)
        .order('created_at', { ascending: false });
      setLeases(data || []);
    } else if (activeTab === 'payments') {
      const { data } = await supabase
        .from('rent_payments')
        .select('*')
        .eq('tenant_id', user.id)
        .order('due_date', { ascending: false });
      setPayments(data || []);
    } else {
      const { data } = await supabase
        .from('maintenance_requests')
        .select('*')
        .eq('tenant_id', user.id)
        .order('created_at', { ascending: false });
      setMaintenanceRequests(data || []);
    }
    
    setLoading(false);
  };

  const handlePayRent = async (payment: any) => {
    router.push(`/payment/${payment.id}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabs}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'leases' && styles.activeTab]}
          onPress={() => setActiveTab('leases')}
        >
          <Text style={[styles.tabText, activeTab === 'leases' && styles.activeTabText]}>
            Leases
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'payments' && styles.activeTab]}
          onPress={() => setActiveTab('payments')}
        >
          <Text style={[styles.tabText, activeTab === 'payments' && styles.activeTabText]}>
            Payments
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'maintenance' && styles.activeTab]}
          onPress={() => setActiveTab('maintenance')}
        >
          <Text style={[styles.tabText, activeTab === 'maintenance' && styles.activeTabText]}>
            Maintenance
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color="#3b82f6" style={styles.loader} />
        ) : (
          <>
            {activeTab === 'leases' && leases.map(lease => (
              <LeaseCard key={lease.id} lease={lease} userType="tenant" />
            ))}
            {activeTab === 'payments' && payments.map(payment => (
              <RentPaymentCard 
                key={payment.id} 
                payment={payment}
                onPay={() => handlePayRent(payment)}
              />
            ))}
            {activeTab === 'maintenance' && maintenanceRequests.map(request => (
              <MaintenanceRequestCard 
                key={request.id} 
                request={request}
                userType="tenant"
              />
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  tabs: { flexDirection: 'row', backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  tab: { flex: 1, paddingVertical: 16, alignItems: 'center' },
  activeTab: { borderBottomWidth: 2, borderBottomColor: '#3b82f6' },
  tabText: { fontSize: 14, color: '#6b7280' },
  activeTabText: { color: '#3b82f6', fontWeight: '600' },
  content: { flex: 1, padding: 16 },
  loader: { marginTop: 40 },
});
