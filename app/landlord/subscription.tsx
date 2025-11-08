import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, Linking } from 'react-native';
import { useLandlord } from '@/contexts/LandlordContext';
import { supabase } from '@/app/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import SubscriptionManager from '@/components/SubscriptionManager';

export default function LandlordSubscription() {
  const { landlordProfile, isPremiumLandlord } = useLandlord();
  const [loading, setLoading] = useState(false);
  const [showManager, setShowManager] = useState(false);

  const handleUpgrade = async (tier: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-landlord-checkout', {
        body: { landlordId: landlordProfile?.id, tier }
      });

      if (error) throw error;

      if (data.sessionUrl) {
        await Linking.openURL(data.sessionUrl);
      } else {
        Alert.alert('Success', data.message);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const tiers = [
    {
      name: 'Basic',
      price: 'Free',
      features: ['1 active listing', 'Basic support', 'Standard visibility'],
      tier: 'basic'
    },
    {
      name: 'Featured',
      price: '$29.99/mo',
      features: ['5 active listings', 'Featured placement', 'Priority support', 'Analytics dashboard'],
      tier: 'featured',
      popular: true
    },
    {
      name: 'Premium',
      price: '$49.99/mo',
      features: ['Unlimited listings', 'Top placement', '24/7 support', 'Advanced analytics', 'Pricing recommendations'],
      tier: 'premium'
    }
  ];

  if (showManager) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setShowManager(false)}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.title}>Manage Subscription</Text>
        </View>
        <SubscriptionManager 
          landlordId={landlordProfile?.id || ''} 
          currentTier={landlordProfile?.subscription_tier || 'basic'}
          onUpgrade={handleUpgrade}
        />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.topBar}>
        <View>
          <Text style={styles.title}>Landlord Plans</Text>
          <Text style={styles.subtitle}>Choose the plan that fits your needs</Text>
        </View>
        {landlordProfile?.subscription_tier !== 'basic' && (
          <TouchableOpacity onPress={() => setShowManager(true)}>
            <Text style={styles.manageLink}>Manage</Text>
          </TouchableOpacity>
        )}
      </View>

      {tiers.map((plan, index) => (
        <View key={index} style={[styles.card, plan.popular && styles.popularCard]}>
          {plan.popular && <View style={styles.badge}><Text style={styles.badgeText}>POPULAR</Text></View>}
          <Text style={styles.planName}>{plan.name}</Text>
          <Text style={styles.price}>{plan.price}</Text>
          
          <View style={styles.features}>
            {plan.features.map((feature, i) => (
              <View key={i} style={styles.feature}>
                <Ionicons name="checkmark-circle" size={20} color="#34C759" />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity 
            style={[styles.button, landlordProfile?.subscription_tier === plan.tier && styles.currentButton]}
            onPress={() => handleUpgrade(plan.tier)}
            disabled={loading || landlordProfile?.subscription_tier === plan.tier}
          >
            <Text style={styles.buttonText}>
              {landlordProfile?.subscription_tier === plan.tier ? 'Current Plan' : 'Select Plan'}
            </Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );

}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 20 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  manageLink: { color: '#007AFF', fontSize: 16, fontWeight: '600' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 30 },
  card: { backgroundColor: '#fff', padding: 20, borderRadius: 12, marginBottom: 16, borderWidth: 2, borderColor: 'transparent' },
  popularCard: { borderColor: '#007AFF' },
  badge: { position: 'absolute', top: -10, right: 20, backgroundColor: '#007AFF', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  planName: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  price: { fontSize: 32, fontWeight: 'bold', color: '#007AFF', marginBottom: 20 },
  features: { gap: 12, marginBottom: 20 },
  feature: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  featureText: { fontSize: 16, color: '#333' },
  button: { backgroundColor: '#007AFF', padding: 16, borderRadius: 8 },
  currentButton: { backgroundColor: '#ccc' },
  buttonText: { color: '#fff', textAlign: 'center', fontSize: 16, fontWeight: '600' }
});

