import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../lib/supabase';

export default function SubscriptionScreen() {
  const { user } = useAuth();
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expiryDate, setExpiryDate] = useState<string | null>(null);

  useEffect(() => {
    loadSubscriptionStatus();
  }, [user]);

  const loadSubscriptionStatus = async () => {
    if (!user) return;
    const { data } = await supabase.from('users').select('subscription_status, subscription_expiry').eq('id', user.id).single();
    if (data) {
      setIsPremium(data.subscription_status === 'premium');
      setExpiryDate(data.subscription_expiry);
    }
  };

  const handleUpgrade = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: { userId: user.id, email: user.email }
      });
      if (error) throw error;
      if (data.url) await Linking.openURL(data.url);
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { free: 'Basic search', premium: 'Advanced filters with presets', icon: 'search' },
    { free: '5 favorites max', premium: 'Unlimited favorites', icon: 'heart' },
    { free: 'No notifications', premium: 'Push notifications for new listings', icon: 'notifications' },
    { free: 'Standard support', premium: 'Priority 24/7 support', icon: 'headset' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="diamond" size={60} color={isPremium ? '#FFD700' : '#007AFF'} />
        <Text style={styles.title}>{isPremium ? 'Premium Member' : 'Upgrade to Premium'}</Text>
        {isPremium && expiryDate && (
          <Text style={styles.expiry}>Active until {new Date(expiryDate).toLocaleDateString()}</Text>
        )}
      </View>

      <View style={styles.comparison}>
        <View style={styles.comparisonHeader}>
          <Text style={styles.planTitle}>Free</Text>
          <Text style={[styles.planTitle, styles.premiumText]}>Premium</Text>
        </View>
        {features.map((f, i) => (
          <View key={i} style={styles.featureRow}>
            <Ionicons name={f.icon as any} size={20} color="#666" style={styles.featureIcon} />
            <Text style={styles.featureFree}>{f.free}</Text>
            <Text style={styles.featurePremium}>{f.premium}</Text>
          </View>
        ))}
      </View>

      {!isPremium && (
        <TouchableOpacity style={styles.upgradeBtn} onPress={handleUpgrade} disabled={loading}>
          <Text style={styles.upgradeBtnText}>{loading ? 'Loading...' : 'Upgrade for €5/month'}</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { backgroundColor: '#fff', padding: 32, alignItems: 'center', marginBottom: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginTop: 16 },
  expiry: { fontSize: 14, color: '#666', marginTop: 8 },
  comparison: { backgroundColor: '#fff', padding: 16, marginBottom: 16 },
  comparisonHeader: { flexDirection: 'row', marginBottom: 16, paddingBottom: 12, borderBottomWidth: 2, borderBottomColor: '#007AFF' },
  planTitle: { flex: 1, fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
  premiumText: { color: '#007AFF' },
  featureRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  featureIcon: { width: 30 },
  featureFree: { flex: 1, fontSize: 14, color: '#666' },
  featurePremium: { flex: 1, fontSize: 14, fontWeight: '600', color: '#007AFF' },
  upgradeBtn: { backgroundColor: '#007AFF', margin: 16, padding: 18, borderRadius: 12 },
  upgradeBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
});
