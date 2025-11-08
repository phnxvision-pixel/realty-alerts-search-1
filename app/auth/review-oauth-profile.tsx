import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { profileSync, ImportedProfileData } from '@/app/lib/profile-sync';
import { supabase } from '@/app/lib/supabase';
import { Ionicons } from '@expo/vector-icons';

export default function ReviewOAuthProfile() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState<Partial<ImportedProfileData>>({});

  useEffect(() => {
    loadImportedData();
  }, []);

  const loadImportedData = async () => {
    if (!user?.id) return;
    
    try {
      const { data } = await supabase
        .from('users')
        .select('full_name, avatar_url, email, language, provider, bio')
        .eq('id', user.id)
        .single();
      
      if (data) {
        setProfileData({
          full_name: data.full_name || '',
          email: data.email || '',
          avatar_url: data.avatar_url || '',
          language: data.language || 'en',
          bio: data.bio || '',
          provider: data.provider
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user?.id) return;
    
    setSaving(true);
    try {
      await profileSync.confirmImportedData(user.id, profileData);
      Alert.alert('Success', 'Your profile has been updated!', [
        { text: 'OK', onPress: () => router.replace('/(tabs)') }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to save profile');
    } finally {
      setSaving(false);
    }
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
        <Ionicons name="checkmark-circle" size={60} color="#34C759" />
        <Text style={styles.title}>Review Your Profile</Text>
        <Text style={styles.subtitle}>
          We've imported your info from {profileData.provider === 'google' ? 'Google' : 'Apple'}. 
          Please review and edit as needed.
        </Text>
      </View>

      {profileData.avatar_url && (
        <View style={styles.avatarContainer}>
          <Image source={{ uri: profileData.avatar_url }} style={styles.avatar} />
          <Text style={styles.label}>Profile Picture</Text>
        </View>
      )}

      <View style={styles.form}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          value={profileData.full_name}
          onChangeText={(text) => setProfileData({ ...profileData, full_name: text })}
          placeholder="Enter your full name"
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={[styles.input, styles.disabledInput]}
          value={profileData.email}
          editable={false}
        />

        <Text style={styles.label}>Bio (Optional)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={profileData.bio}
          onChangeText={(text) => setProfileData({ ...profileData, bio: text })}
          placeholder="Tell us about yourself"
          multiline
          numberOfLines={4}
        />

        <TouchableOpacity 
          style={[styles.button, saving && styles.buttonDisabled]} 
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Confirm & Continue</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { alignItems: 'center', padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginTop: 16 },
  subtitle: { fontSize: 14, color: '#666', textAlign: 'center', marginTop: 8 },
  avatarContainer: { alignItems: 'center', padding: 24, backgroundColor: '#fff', marginTop: 12 },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  form: { padding: 20, backgroundColor: '#fff', marginTop: 12 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8, color: '#333', marginTop: 12 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, fontSize: 16 },
  disabledInput: { backgroundColor: '#f5f5f5', color: '#999' },
  textArea: { height: 100, textAlignVertical: 'top' },
  button: { backgroundColor: '#007AFF', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 24 },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' }
});
