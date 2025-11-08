import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import { supabase } from '../lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import RevenueChart from '../../components/RevenueChart';
import PayoutRequestCard from '../../components/PayoutRequestCard';


export default function AdminPanel() {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [landlords, setLandlords] = useState([]);
  const [listings, setListings] = useState([]);
  const [payoutRequests, setPayoutRequests] = useState([]);
  const [revenueData, setRevenueData] = useState<any>(null);
  const [timeframe, setTimeframe] = useState<'month' | 'year'>('month');
  const [stats, setStats] = useState({ 
    totalUsers: 0, 
    totalLandlords: 0, 
    totalListings: 0,
    pendingLandlords: 0,
    pendingListings: 0,
    pendingPayouts: 0
  });



  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    
    if (activeTab === 'overview') {
      const [usersRes, landlordsRes, listingsRes, payoutsRes] = await Promise.all([
        supabase.from('users').select('id'),
        supabase.from('landlords').select('id, verified'),
        supabase.from('apartments').select('id, verified'),
        supabase.from('payout_requests').select('id, status')
      ]);
      
      setStats({
        totalUsers: usersRes.data?.length || 0,
        totalLandlords: landlordsRes.data?.length || 0,
        totalListings: listingsRes.data?.length || 0,
        pendingLandlords: landlordsRes.data?.filter(l => !l.verified).length || 0,
        pendingListings: listingsRes.data?.filter(l => !l.verified).length || 0,
        pendingPayouts: payoutsRes.data?.filter(p => p.status === 'pending').length || 0
      });
    } else if (activeTab === 'users') {
      const { data } = await supabase.from('users').select('*').order('created_at', { ascending: false }).limit(50);
      setUsers(data || []);
    } else if (activeTab === 'landlords') {
      const { data } = await supabase.from('landlords').select('*').order('created_at', { ascending: false });
      setLandlords(data || []);
    } else if (activeTab === 'listings') {
      const { data } = await supabase.from('apartments').select('*').order('created_at', { ascending: false }).limit(50);
      setListings(data || []);
    } else if (activeTab === 'payouts') {
      const { data } = await supabase.from('payout_requests').select('*').order('created_at', { ascending: false });
      setPayoutRequests(data || []);
    } else if (activeTab === 'revenue') {
      const startDate = new Date();
      if (timeframe === 'month') {
        startDate.setMonth(startDate.getMonth() - 1);
      } else {
        startDate.setFullYear(startDate.getFullYear() - 1);
      }
      const { data } = await supabase.functions.invoke('get-revenue-data', {
        body: { timeframe, startDate: startDate.toISOString() }
      });
      setRevenueData(data);
    }
    
    setLoading(false);
  };



  const approveLandlord = async (id: string) => {
    await supabase.from('landlords').update({ verified: true, status: 'approved' }).eq('id', id);
    fetchData();
  };

  const rejectLandlord = async (id: string) => {
    await supabase.from('landlords').update({ status: 'rejected' }).eq('id', id);
    fetchData();
  };

  const approveListing = async (id: string) => {
    await supabase.from('apartments').update({ verified: true }).eq('id', id);
    fetchData();
  };

  const deleteListing = async (id: string) => {
    await supabase.from('apartments').delete().eq('id', id);
    fetchData();
  };


  const approvePayout = async (id: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    const { data: admin } = await supabase.from('admin_users').select('id').eq('user_id', user?.id).single();
    
    await supabase.functions.invoke('process-payout', {
      body: { requestId: id, action: 'approve', adminId: admin?.id }
    });
    fetchData();
  };

  const rejectPayout = async (id: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    const { data: admin } = await supabase.from('admin_users').select('id').eq('user_id', user?.id).single();
    
    await supabase.functions.invoke('process-payout', {
      body: { requestId: id, action: 'reject', adminId: admin?.id, rejectionReason: 'Admin rejected' }
    });
    fetchData();
  };


  const renderOverview = () => (
    <View style={styles.statsContainer}>
      <View style={styles.statCard}>
        <Ionicons name="people" size={32} color="#007AFF" />
        <Text style={styles.statNumber}>{stats.totalUsers}</Text>
        <Text style={styles.statLabel}>Total Users</Text>
      </View>
      <View style={styles.statCard}>
        <Ionicons name="business" size={32} color="#34C759" />
        <Text style={styles.statNumber}>{stats.totalLandlords}</Text>
        <Text style={styles.statLabel}>Landlords</Text>
      </View>
      <View style={styles.statCard}>
        <Ionicons name="home" size={32} color="#FF9500" />
        <Text style={styles.statNumber}>{stats.totalListings}</Text>
        <Text style={styles.statLabel}>Listings</Text>
      </View>
      <View style={styles.statCard}>
        <Ionicons name="time" size={32} color="#FF3B30" />
        <Text style={styles.statNumber}>{stats.pendingLandlords}</Text>
        <Text style={styles.statLabel}>Pending Landlords</Text>
      </View>
    </View>
  );

  const renderLandlords = () => (
    <FlatList
      data={landlords}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <View style={styles.itemCard}>
          <Text style={styles.itemTitle}>{item.company_name || item.full_name}</Text>
          <Text style={styles.itemSubtitle}>{item.email}</Text>
          <Text style={styles.itemStatus}>Status: {item.status || 'pending'}</Text>
          {!item.verified && (
            <View style={styles.actions}>
              <TouchableOpacity style={styles.approveBtn} onPress={() => approveLandlord(item.id)}>
                <Text style={styles.btnText}>Approve</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.rejectBtn} onPress={() => rejectLandlord(item.id)}>
                <Text style={styles.btnText}>Reject</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    />
  );

  const renderListings = () => (
    <FlatList
      data={listings}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <View style={styles.itemCard}>
          <Text style={styles.itemTitle}>{item.title}</Text>
          <Text style={styles.itemSubtitle}>{item.address}, {item.city}</Text>
          <Text style={styles.itemPrice}>€{item.price}/month</Text>
          <View style={styles.actions}>
            {!item.verified && (
              <TouchableOpacity style={styles.approveBtn} onPress={() => approveListing(item.id)}>
                <Text style={styles.btnText}>Approve</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.deleteBtn} onPress={() => deleteListing(item.id)}>
              <Text style={styles.btnText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    />
  );

  const renderPayouts = () => (
    <FlatList
      data={payoutRequests}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <PayoutRequestCard
          request={item}
          isAdmin={true}
          onApprove={approvePayout}
          onReject={rejectPayout}
        />
      )}
    />
  );

  const exportCSV = async () => {
    const { data } = await supabase.functions.invoke('export-revenue-csv', { body: { timeframe } });
  };

  const renderRevenue = () => (
    <View>
      <View style={styles.timeframeToggle}>
        <TouchableOpacity
          style={[styles.toggleBtn, timeframe === 'month' && styles.toggleActive]}
          onPress={() => { setTimeframe('month'); fetchData(); }}>
          <Text style={[styles.toggleText, timeframe === 'month' && styles.toggleTextActive]}>Month</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleBtn, timeframe === 'year' && styles.toggleActive]}
          onPress={() => { setTimeframe('year'); fetchData(); }}>
          <Text style={[styles.toggleText, timeframe === 'year' && styles.toggleTextActive]}>Year</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>${revenueData?.summary?.totalRevenue?.toFixed(2) || '0'}</Text>
          <Text style={styles.statLabel}>Total Revenue</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>${revenueData?.summary?.platformCommission?.toFixed(2) || '0'}</Text>
          <Text style={styles.statLabel}>Commission</Text>
        </View>
      </View>

      {revenueData?.monthlyData && <RevenueChart data={revenueData.monthlyData} type="revenue" />}
      {revenueData?.monthlyData && <RevenueChart data={revenueData.monthlyData} type="commission" />}

      <TouchableOpacity style={styles.exportBtn} onPress={exportCSV}>
        <Ionicons name="download-outline" size={20} color="#fff" />
        <Text style={styles.exportText}>Export CSV</Text>
      </TouchableOpacity>
    </View>
  );


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Panel</Text>
      
      <View style={styles.tabs}>
        {['overview', 'landlords', 'listings', 'payouts', 'revenue'].map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
      ) : (
        <ScrollView style={styles.content}>
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'landlords' && renderLandlords()}
          {activeTab === 'listings' && renderListings()}
          {activeTab === 'payouts' && renderPayouts()}
          {activeTab === 'revenue' && renderRevenue()}
        </ScrollView>
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  title: { fontSize: 28, fontWeight: 'bold', padding: 20, paddingBottom: 10 },
  tabs: { flexDirection: 'row', paddingHorizontal: 20, gap: 8, marginBottom: 16 },
  tab: { flex: 1, padding: 12, backgroundColor: '#fff', borderRadius: 8, alignItems: 'center' },
  activeTab: { backgroundColor: '#007AFF' },
  tabText: { fontSize: 14, fontWeight: '600', color: '#666' },
  activeTabText: { color: '#fff' },
  content: { flex: 1, paddingHorizontal: 20 },
  loader: { marginTop: 40 },
  statsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  statCard: { flex: 1, minWidth: '45%', backgroundColor: '#fff', padding: 20, borderRadius: 12, alignItems: 'center' },
  statNumber: { fontSize: 28, fontWeight: 'bold', marginTop: 8 },
  statLabel: { fontSize: 12, color: '#666', marginTop: 4 },
  statsGrid: { flexDirection: 'row', paddingHorizontal: 16, gap: 16, marginBottom: 16 },
  statValue: { fontSize: 24, fontWeight: '700', color: '#007AFF' },
  timeframeToggle: { flexDirection: 'row', marginBottom: 16, backgroundColor: '#fff', borderRadius: 8, padding: 4 },
  toggleBtn: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 6 },
  toggleActive: { backgroundColor: '#007AFF' },
  toggleText: { color: '#666', fontWeight: '600' },
  toggleTextActive: { color: '#fff' },
  exportBtn: { flexDirection: 'row', backgroundColor: '#007AFF', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginTop: 16 },
  exportText: { color: '#fff', marginLeft: 8, fontWeight: '600' },
  itemCard: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12 },
  itemTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  itemSubtitle: { fontSize: 14, color: '#666', marginBottom: 4 },
  itemStatus: { fontSize: 12, color: '#999', marginBottom: 8 },
  itemPrice: { fontSize: 14, fontWeight: '600', color: '#007AFF', marginBottom: 8 },
  actions: { flexDirection: 'row', gap: 8 },
  approveBtn: { flex: 1, backgroundColor: '#34C759', padding: 10, borderRadius: 8, alignItems: 'center' },
  rejectBtn: { flex: 1, backgroundColor: '#FF9500', padding: 10, borderRadius: 8, alignItems: 'center' },
  deleteBtn: { flex: 1, backgroundColor: '#FF3B30', padding: 10, borderRadius: 8, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 14 }
});
