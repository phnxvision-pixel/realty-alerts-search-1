import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/app/lib/supabase';
import { Ionicons } from '@expo/vector-icons';

export default function TenantDashboard() {
  const router = useRouter();
  const { user, isPremium } = useAuth();
  const [stats, setStats] = useState({ 
    applications: 0, 
    favorites: 0, 
    savedSearches: 0,
    messages: 0 
  });

  useEffect(() => {
    if (user) fetchStats();
  }, [user]);

  const fetchStats = async () => {
    const [apps, favs, searches, msgs] = await Promise.all([
      supabase.from('rental_applications').select('id').eq('user_id', user?.id),
      supabase.from('favorites').select('id').eq('user_id', user?.id),
      supabase.from('saved_searches').select('id').eq('user_id', user?.id),
      supabase.from('conversations').select('id').eq('user_id', user?.id)
    ]);

    setStats({
      applications: apps.data?.length || 0,
      favorites: favs.data?.length || 0,
      savedSearches: searches.data?.length || 0,
      messages: msgs.data?.length || 0
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>My Dashboard</Text>
      
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Ionicons name="document-text" size={28} color="#007AFF" />
          <Text style={styles.statNumber}>{stats.applications}</Text>
          <Text style={styles.statLabel}>Applications</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="heart" size={28} color="#FF3B30" />
          <Text style={styles.statNumber}>{stats.favorites}</Text>
          <Text style={styles.statLabel}>Favorites</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="search" size={28} color="#34C759" />
          <Text style={styles.statNumber}>{stats.savedSearches}</Text>
          <Text style={styles.statLabel}>Saved Searches</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="chatbubbles" size={28} color="#FF9500" />
          <Text style={styles.statNumber}>{stats.messages}</Text>
          <Text style={styles.statLabel}>Messages</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/applications/my-applications')}>
          <Ionicons name="document-text" size={20} color="#007AFF" />
          <Text style={styles.actionText}>View Applications</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/(tabs)/favorites')}>
          <Ionicons name="heart" size={20} color="#007AFF" />
          <Text style={styles.actionText}>My Favorites</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/messages')}>
          <Ionicons name="chatbubbles" size={20} color="#007AFF" />
          <Text style={styles.actionText}>Messages</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/profile')}>
          <Ionicons name="person" size={20} color="#007AFF" />
          <Text style={styles.actionText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      {!isPremium && (
        <TouchableOpacity style={styles.premiumCard} onPress={() => router.push('/(tabs)/subscription')}>
          <Ionicons name="star" size={32} color="#FFD700" />
          <Text style={styles.premiumTitle}>Upgrade to Premium</Text>
          <Text style={styles.premiumDesc}>Get instant alerts, unlimited favorites, and more!</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },
  statCard: { flex: 1, minWidth: '45%', backgroundColor: '#fff', padding: 16, borderRadius: 12, alignItems: 'center' },
  statNumber: { fontSize: 24, fontWeight: 'bold', marginTop: 8 },
  statLabel: { fontSize: 12, color: '#666', marginTop: 4 },
  actions: { gap: 12, marginBottom: 24 },
  actionButton: { backgroundColor: '#fff', padding: 16, borderRadius: 12, flexDirection: 'row', alignItems: 'center', gap: 12 },
  actionText: { fontSize: 16, color: '#007AFF', fontWeight: '500' },
  premiumCard: { backgroundColor: '#1C1C1E', padding: 24, borderRadius: 16, alignItems: 'center' },
  premiumTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginTop: 12 },
  premiumDesc: { fontSize: 14, color: '#999', marginTop: 8, textAlign: 'center' }
});
