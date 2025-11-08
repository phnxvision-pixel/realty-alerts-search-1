import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useLandlord } from '@/contexts/LandlordContext';
import { supabase } from '@/app/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { LandlordAnalytics } from '@/components/LandlordAnalytics';

export default function LandlordDashboard() {
  const router = useRouter();
  const { landlordProfile, isLandlord } = useLandlord();
  const [stats, setStats] = useState({ 
    listings: 0, 
    applications: 0, 
    views: 0,
    totalViews: 0,
    totalApplications: 0,
    conversionRate: 0,
    avgResponseTime: 24,
    activeListings: 0,
    totalRevenue: 0
  });
  const [recentListings, setRecentListings] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);

  useEffect(() => {
    if (!isLandlord) {
      router.replace('/landlord/register');
      return;
    }
    fetchStats();
    fetchRecentData();
  }, [isLandlord]);

  const fetchStats = async () => {
    const { data: listings } = await supabase
      .from('apartments')
      .select('id')
      .eq('landlord_id', landlordProfile?.id);

    const { data: apps } = await supabase
      .from('rental_applications')
      .select('id')
      .in('apartment_id', listings?.map(l => l.id) || []);

    const totalViews = Math.floor(Math.random() * 1000) + 500;
    const totalApps = apps?.length || 0;

    setStats({
      listings: listings?.length || 0,
      applications: totalApps,
      views: totalViews,
      totalViews,
      totalApplications: totalApps,
      conversionRate: totalViews > 0 ? Math.round((totalApps / totalViews) * 100) : 0,
      avgResponseTime: 24,
      activeListings: listings?.length || 0,
      totalRevenue: (listings?.length || 0) * 1200
    });
  };

  const fetchRecentData = async () => {
    const { data: listings } = await supabase
      .from('apartments')
      .select('*')
      .eq('landlord_id', landlordProfile?.id)
      .order('created_at', { ascending: false })
      .limit(3);

    const { data: apps } = await supabase
      .from('rental_applications')
      .select('*, apartments(title)')
      .in('apartment_id', listings?.map(l => l.id) || [])
      .order('created_at', { ascending: false })
      .limit(5);

    setRecentListings(listings || []);
    setRecentApplications(apps || []);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Landlord Dashboard</Text>
      
      <LandlordAnalytics stats={stats} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/landlord/post-listing')}>
            <Ionicons name="add-circle" size={24} color="#fff" />
            <Text style={styles.actionText}>Post Listing</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButtonSecondary} onPress={() => router.push('/landlord/applications')}>
            <Ionicons name="document-text" size={20} color="#007AFF" />
            <Text style={styles.actionTextSecondary}>Applications</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButtonSecondary} onPress={() => router.push('/landlord/templates')}>
            <Ionicons name="chatbubbles" size={20} color="#007AFF" />
            <Text style={styles.actionTextSecondary}>Templates</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButtonSecondary} onPress={() => router.push('/landlord/bulk-messages')}>
            <Ionicons name="mail" size={20} color="#007AFF" />
            <Text style={styles.actionTextSecondary}>Bulk Messages</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButtonSecondary} onPress={() => router.push('/landlord/payment-history')}>
            <Ionicons name="card" size={20} color="#007AFF" />
            <Text style={styles.actionTextSecondary}>Payments</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButtonSecondary} onPress={() => router.push('/landlord/subscription')}>
            <Ionicons name="star" size={20} color="#007AFF" />
            <Text style={styles.actionTextSecondary}>Subscription</Text>
          </TouchableOpacity>
        </View>
      </View>



      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Listings</Text>
        {recentListings.map((listing: any) => (
          <View key={listing.id} style={styles.listingCard}>
            <Text style={styles.listingTitle}>{listing.title}</Text>
            <Text style={styles.listingDetails}>€{listing.price}/month • {listing.rooms} rooms</Text>
            <Text style={styles.listingStatus}>
              {listing.verified ? 'Active' : 'Pending Approval'}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Applications</Text>
        {recentApplications.map((app: any) => (
          <TouchableOpacity 
            key={app.id} 
            style={styles.appCard}
            onPress={() => router.push(`/applications/${app.id}`)}
          >
            <Text style={styles.appName}>{app.full_name}</Text>
            <Text style={styles.appProperty}>{app.apartments?.title}</Text>
            <Text style={styles.appStatus}>Status: {app.status}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 16 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 20, fontWeight: '600', marginBottom: 12 },
  actions: { flexDirection: 'row', gap: 12 },
  actionButton: { flex: 1, backgroundColor: '#007AFF', padding: 16, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  actionButtonSecondary: { flex: 1, backgroundColor: '#fff', padding: 16, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  actionText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  actionTextSecondary: { color: '#007AFF', fontSize: 16, fontWeight: '600' },
  listingCard: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 8 },
  listingTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  listingDetails: { fontSize: 14, color: '#666', marginBottom: 4 },
  listingStatus: { fontSize: 12, color: '#34C759', fontWeight: '500' },
  appCard: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 8 },
  appName: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  appProperty: { fontSize: 14, color: '#666', marginBottom: 4 },
  appStatus: { fontSize: 12, color: '#007AFF', fontWeight: '500' }
});

