import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { supabase } from './lib/supabase';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    if (!user?.id) return;
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    Alert.alert(
      'Abmelden',
      'Möchten Sie sich wirklich abmelden?',
      [
        { text: 'Abbrechen', style: 'cancel' },
        {
          text: 'Abmelden',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
              router.replace('/auth/login');
            } catch (error) {
              Alert.alert('Fehler', 'Abmeldung fehlgeschlagen');
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person-circle" size={80} color="#007AFF" />
        </View>
        <Text style={styles.name}>{profile?.full_name || 'Benutzer'}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Konto</Text>
        
        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/profile-edit')}>
          <Ionicons name="create-outline" size={24} color="#007AFF" />
          <Text style={styles.menuText}>Profil bearbeiten</Text>
          <Ionicons name="chevron-forward" size={24} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/(tabs)/preferences')}>
          <Ionicons name="settings-outline" size={24} color="#007AFF" />
          <Text style={styles.menuText}>Einstellungen</Text>
          <Ionicons name="chevron-forward" size={24} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/(tabs)/subscription')}>
          <Ionicons name="card-outline" size={24} color="#007AFF" />
          <Text style={styles.menuText}>Abonnement</Text>
          <Ionicons name="chevron-forward" size={24} color="#999" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informationen</Text>
        
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Benutzer-ID</Text>
          <Text style={styles.infoValue}>{user?.id.substring(0, 8)}...</Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Registriert seit</Text>
          <Text style={styles.infoValue}>
            {new Date(user?.created_at || '').toLocaleDateString('de-DE')}
          </Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Premium-Status</Text>
          <Text style={styles.infoValue}>
            {profile?.is_premium ? 'Aktiv' : 'Nicht aktiv'}
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
        <Text style={styles.signOutText}>Abmelden</Text>
      </TouchableOpacity>

      <Text style={styles.version}>Version 1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { backgroundColor: '#fff', padding: 20, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#e0e0e0' },
  avatarContainer: { marginBottom: 12 },
  name: { fontSize: 24, fontWeight: 'bold', marginBottom: 4 },
  email: { fontSize: 16, color: '#666' },
  section: { backgroundColor: '#fff', marginTop: 20, padding: 16, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#e0e0e0' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  menuText: { flex: 1, fontSize: 16, marginLeft: 12 },
  infoItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  infoLabel: { fontSize: 16, color: '#666' },
  infoValue: { fontSize: 16, fontWeight: '500' },
  signOutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', margin: 20, padding: 16, borderRadius: 8, borderWidth: 1, borderColor: '#FF3B30' },
  signOutText: { fontSize: 16, color: '#FF3B30', marginLeft: 8, fontWeight: '600' },
  version: { textAlign: 'center', color: '#999', marginBottom: 40 }
});
