import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AnalyticsProps {
  stats: {
    totalViews: number;
    totalApplications: number;
    conversionRate: number;
    avgResponseTime: number;
    activeListings: number;
    totalRevenue: number;
  };
}

export function LandlordAnalytics({ stats }: AnalyticsProps) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.container}>
      <View style={styles.card}>
        <Ionicons name="eye" size={24} color="#007AFF" />
        <Text style={styles.value}>{stats.totalViews}</Text>
        <Text style={styles.label}>Total Views</Text>
      </View>
      <View style={styles.card}>
        <Ionicons name="document-text" size={24} color="#34C759" />
        <Text style={styles.value}>{stats.totalApplications}</Text>
        <Text style={styles.label}>Applications</Text>
      </View>
      <View style={styles.card}>
        <Ionicons name="trending-up" size={24} color="#FF9500" />
        <Text style={styles.value}>{stats.conversionRate}%</Text>
        <Text style={styles.label}>Conversion</Text>
      </View>
      <View style={styles.card}>
        <Ionicons name="time" size={24} color="#5856D6" />
        <Text style={styles.value}>{stats.avgResponseTime}h</Text>
        <Text style={styles.label}>Avg Response</Text>
      </View>
      <View style={styles.card}>
        <Ionicons name="home" size={24} color="#FF3B30" />
        <Text style={styles.value}>{stats.activeListings}</Text>
        <Text style={styles.label}>Active Listings</Text>
      </View>
      <View style={styles.card}>
        <Ionicons name="cash" size={24} color="#34C759" />
        <Text style={styles.value}>€{stats.totalRevenue}</Text>
        <Text style={styles.label}>Revenue</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 16 },
  card: { 
    backgroundColor: '#fff', 
    padding: 16, 
    borderRadius: 12, 
    marginRight: 12,
    minWidth: 120,
    alignItems: 'center'
  },
  value: { fontSize: 24, fontWeight: 'bold', marginTop: 8 },
  label: { fontSize: 12, color: '#666', marginTop: 4 }
});
