import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/app/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export default function ProfileCompletionBanner() {
  const router = useRouter();
  const { user } = useAuth();
  const [visible, setVisible] = useState(false);
  const [skippedSteps, setSkippedSteps] = useState<string[]>([]);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    checkProfileCompletion();
  }, [user]);

  const checkProfileCompletion = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('users')
        .select('skipped_steps, phone, user_type')
        .eq('id', user.id)
        .single();

      if (data && data.skipped_steps && data.skipped_steps.length > 0) {
        setSkippedSteps(data.skipped_steps);
        setVisible(true);
      }
    } catch (error) {
      console.error('Error checking profile completion:', error);
    }
  };

  const handleComplete = () => {
    router.push('/profile-completion');
  };

  const handleDismiss = () => {
    setDismissed(true);
    setVisible(false);
  };

  if (!visible || dismissed || skippedSteps.length === 0) {
    return null;
  }

  const stepLabels: { [key: string]: string } = {
    phone: 'Telefonnummer',
    language: 'Sprache',
    user_type: 'Benutzertyp',
    preferences: 'Präferenzen'
  };

  const missingInfo = skippedSteps.map(step => stepLabels[step] || step).join(', ');

  return (
    <View style={styles.banner}>
      <View style={styles.content}>
        <Ionicons name="information-circle" size={24} color="#FF9500" />
        <View style={styles.textContainer}>
          <Text style={styles.title}>Profil vervollständigen</Text>
          <Text style={styles.subtitle}>
            Fehlende Informationen: {missingInfo}
          </Text>
        </View>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity onPress={handleDismiss} style={styles.dismissButton}>
          <Ionicons name="close" size={20} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleComplete} style={styles.completeButton}>
          <Text style={styles.completeButtonText}>Jetzt vervollständigen</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#FFF3E0',
    padding: 16,
    borderRadius: 12,
    margin: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9500',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  textContainer: {
    flex: 1,
    marginLeft: 12
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4
  },
  subtitle: {
    fontSize: 14,
    color: '#666'
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  dismissButton: {
    padding: 8
  },
  completeButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600'
  }
});
