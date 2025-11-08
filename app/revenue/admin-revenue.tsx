import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { supabase } from '../lib/supabase';
import RevenueChart from '../../components/RevenueChart';
import { Ionicons } from '@expo/vector-icons';

export default function AdminRevenueDashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [timeframe, setTimeframe] = useState<'month' | 'year'>('month');
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    loadRevenueData();
  }, [timeframe]);

  const loadRevenueData = async () => {
    try {
      setLoading(true);
      const startDate = new Date();
      if (timeframe === 'month') {
        startDate.setMonth(startDate.getMonth() - 1);
      } else {
        startDate.setFullYear(startDate.getFullYear() - 1);
      }

      const { data: result, error } = await supabase.functions.invoke('get-revenue-data', {
        body: { timeframe, startDate: startDate.toISOString() }
      });

      if (error) throw error;
      setData(result);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = async () => {
    try {
      setExporting(true);
      const { data: csv, error } = await supabase.functions.invoke('export-revenue-csv', {
        body: { timeframe }
      });
      if (error) throw error;
      Alert.alert('Success', 'CSV exported successfully');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Revenue Dashboard</Text>
        <TouchableOpacity onPress={exportCSV} disabled={exporting} style={styles.exportBtn}>
          <Ionicons name="download-outline" size={20} color="#fff" />
          <Text style={styles.exportText}>Export CSV</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.timeframeToggle}>
        <TouchableOpacity
          style={[styles.toggleBtn, timeframe === 'month' && styles.toggleActive]}
          onPress={() => setTimeframe('month')}>
          <Text style={[styles.toggleText, timeframe === 'month' && styles.toggleTextActive]}>Month</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleBtn, timeframe === 'year' && styles.toggleActive]}
          onPress={() => setTimeframe('year')}>
          <Text style={[styles.toggleText, timeframe === 'year' && styles.toggleTextActive]}>Year</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>${data?.summary?.totalRevenue?.toFixed(2) || '0'}</Text>
          <Text style={styles.statLabel}>Total Revenue</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>${data?.summary?.platformCommission?.toFixed(2) || '0'}</Text>
          <Text style={styles.statLabel}>Commission</Text>
        </View>
      </View>

      {data?.monthlyData && <RevenueChart data={data.monthlyData} type="revenue" />}
      {data?.monthlyData && <RevenueChart data={data.monthlyData} type="commission" />}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: '700', color: '#1a1a1a' },
  exportBtn: { flexDirection: 'row', backgroundColor: '#007AFF', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
  exportText: { color: '#fff', marginLeft: 8, fontWeight: '600' },
  timeframeToggle: { flexDirection: 'row', margin: 16, backgroundColor: '#fff', borderRadius: 8, padding: 4 },
  toggleBtn: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 6 },
  toggleActive: { backgroundColor: '#007AFF' },
  toggleText: { color: '#666', fontWeight: '600' },
  toggleTextActive: { color: '#fff' },
  statsGrid: { flexDirection: 'row', paddingHorizontal: 16, gap: 16 },
  statCard: { flex: 1, backgroundColor: '#fff', padding: 16, borderRadius: 12, alignItems: 'center' },
  statValue: { fontSize: 24, fontWeight: '700', color: '#007AFF' },
  statLabel: { fontSize: 14, color: '#666', marginTop: 4 }
});
