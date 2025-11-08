import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { supabase } from '@/app/lib/supabase';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  landlordId: string;
  currentTier: string;
  onUpgrade: (tier: string) => void;
}

export default function SubscriptionManager({ landlordId, currentTier, onUpgrade }: Props) {
  const [history, setHistory] = useState([]);
  const [autoRenew, setAutoRenew] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const { data } = await supabase
      .from('subscription_history')
      .select('*')
      .eq('landlord_id', landlordId)
      .order('created_at', { ascending: false })
      .limit(5);
    
    setHistory(data || []);
  };

  const handleCancelSubscription = () => {
    Alert.alert(
      'Cancel Subscription',
      'Are you sure you want to cancel? You will lose premium features at the end of your billing period.',
      [
        { text: 'Keep Subscription', style: 'cancel' },
        { text: 'Cancel', style: 'destructive', onPress: () => {
          Alert.alert('Success', 'Subscription will be cancelled at end of period');
        }}
      ]
    );
  };

  const tiers = {
    basic: { name: 'Basic', color: '#8E8E93' },
    featured: { name: 'Featured', color: '#007AFF' },
    premium: { name: 'Premium', color: '#AF52DE' }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.currentPlan}>
        <View style={styles.planHeader}>
          <Ionicons name="shield-checkmark" size={32} color={tiers[currentTier]?.color || '#666'} />
          <View style={styles.planInfo}>
            <Text style={styles.planName}>{tiers[currentTier]?.name || 'Basic'} Plan</Text>
            <Text style={styles.planStatus}>Active</Text>
          </View>
        </View>

        {currentTier !== 'basic' && (
          <View style={styles.actions}>
            <TouchableOpacity style={styles.actionBtn} onPress={handleCancelSubscription}>
              <Text style={styles.cancelText}>Cancel Subscription</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upgrade Options</Text>
        {currentTier !== 'premium' && (
          <TouchableOpacity style={styles.upgradeCard} onPress={() => onUpgrade('premium')}>
            <View style={styles.upgradeInfo}>
              <Ionicons name="diamond" size={24} color="#AF52DE" />
              <View style={styles.upgradeText}>
                <Text style={styles.upgradeName}>Upgrade to Premium</Text>
                <Text style={styles.upgradeDesc}>Unlimited listings & top placement</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </TouchableOpacity>
        )}
        {currentTier === 'basic' && (
          <TouchableOpacity style={styles.upgradeCard} onPress={() => onUpgrade('featured')}>
            <View style={styles.upgradeInfo}>
              <Ionicons name="star" size={24} color="#007AFF" />
              <View style={styles.upgradeText}>
                <Text style={styles.upgradeName}>Upgrade to Featured</Text>
                <Text style={styles.upgradeDesc}>5 listings & featured placement</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Subscription History</Text>
        {history.map((item: any) => (
          <View key={item.id} style={styles.historyItem}>
            <View>
              <Text style={styles.historyTier}>{tiers[item.subscription_tier]?.name}</Text>
              <Text style={styles.historyDate}>
                {new Date(item.start_date).toLocaleDateString()}
              </Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: item.status === 'active' ? '#34C75920' : '#8E8E9320' }]}>
              <Text style={[styles.statusText, { color: item.status === 'active' ? '#34C759' : '#8E8E93' }]}>
                {item.status}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  currentPlan: { backgroundColor: '#fff', padding: 20, marginBottom: 16, borderRadius: 12 },
  planHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  planInfo: { marginLeft: 12, flex: 1 },
  planName: { fontSize: 20, fontWeight: 'bold' },
  planStatus: { fontSize: 14, color: '#34C759', marginTop: 4 },
  actions: { marginTop: 12 },
  actionBtn: { padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#FF3B30' },
  cancelText: { color: '#FF3B30', textAlign: 'center', fontWeight: '600' },
  section: { backgroundColor: '#fff', padding: 20, marginBottom: 16, borderRadius: 12 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  upgradeCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, backgroundColor: '#f5f5f5', borderRadius: 12, marginBottom: 12 },
  upgradeInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  upgradeText: { marginLeft: 12, flex: 1 },
  upgradeName: { fontSize: 16, fontWeight: '600' },
  upgradeDesc: { fontSize: 14, color: '#666', marginTop: 2 },
  historyItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  historyTier: { fontSize: 16, fontWeight: '600' },
  historyDate: { fontSize: 14, color: '#666', marginTop: 4 },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  statusText: { fontSize: 12, fontWeight: '600' }
});
