import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/app/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export default function ConnectedAccounts() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [providers, setProviders] = useState<string[]>([]);

  useEffect(() => {
    loadConnectedAccounts();
  }, [user]);

  const loadConnectedAccounts = async () => {
    if (!user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('oauth_provider')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      
      const connectedProviders = [];
      if (data?.oauth_provider) {
        connectedProviders.push(data.oauth_provider);
      }
      
      // Always show email if user has email
      if (user.email) {
        connectedProviders.push('email');
      }
      
      setProviders(connectedProviders);
    } catch (error) {
      console.error('Error loading connected accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'google':
        return 'logo-google';
      case 'apple':
        return 'logo-apple';
      case 'email':
        return 'mail';
      default:
        return 'link';
    }
  };

  const getProviderName = (provider: string) => {
    switch (provider) {
      case 'google':
        return 'Google';
      case 'apple':
        return 'Apple';
      case 'email':
        return 'E-Mail';
      default:
        return provider;
    }
  };

  const getProviderColor = (provider: string) => {
    switch (provider) {
      case 'google':
        return '#DB4437';
      case 'apple':
        return '#000';
      case 'email':
        return '#007AFF';
      default:
        return '#666';
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verbundene Konten</Text>
      <Text style={styles.subtitle}>
        Verwalten Sie Ihre Anmeldemethoden
      </Text>

      {providers.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="link-outline" size={48} color="#ccc" />
          <Text style={styles.emptyText}>Keine verbundenen Konten</Text>
        </View>
      ) : (
        providers.map((provider) => (
          <View key={provider} style={styles.accountItem}>
            <View style={styles.accountInfo}>
              <Ionicons 
                name={getProviderIcon(provider) as any} 
                size={24} 
                color={getProviderColor(provider)} 
              />
              <View style={styles.accountDetails}>
                <Text style={styles.accountName}>{getProviderName(provider)}</Text>
                <Text style={styles.accountStatus}>Verbunden</Text>
              </View>
            </View>
            <View style={styles.connectedBadge}>
              <Ionicons name="checkmark-circle" size={20} color="#34C759" />
            </View>
          </View>
        ))
      )}

      <View style={styles.infoBox}>
        <Ionicons name="information-circle-outline" size={20} color="#007AFF" />
        <Text style={styles.infoText}>
          Sie können sich mit allen verbundenen Methoden anmelden
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff', borderRadius: 12, marginVertical: 8 },
  loadingContainer: { padding: 40, alignItems: 'center' },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 16 },
  accountItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12, backgroundColor: '#f8f8f8', borderRadius: 8, marginBottom: 8 },
  accountInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  accountDetails: { marginLeft: 12, flex: 1 },
  accountName: { fontSize: 16, fontWeight: '600', marginBottom: 2 },
  accountStatus: { fontSize: 12, color: '#34C759' },
  connectedBadge: { marginLeft: 12 },
  emptyState: { alignItems: 'center', padding: 40 },
  emptyText: { marginTop: 12, fontSize: 16, color: '#999' },
  infoBox: { flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: '#E3F2FD', borderRadius: 8, marginTop: 8 },
  infoText: { flex: 1, marginLeft: 8, fontSize: 12, color: '#007AFF' }
});
