import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/app/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';

export default function EmailVerificationBanner() {
  const [loading, setLoading] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  if (!user || user.email_confirmed_at || dismissed) return null;

  const handleResend = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email!,
      });

      if (error) throw error;
      Alert.alert('Erfolg', 'Bestätigungs-E-Mail wurde gesendet!');
    } catch (error: any) {
      Alert.alert('Fehler', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.banner}>
      <View style={styles.content}>
        <Ionicons name="warning" size={20} color="#FF9500" />
        <Text style={styles.text}>Bitte bestätige deine E-Mail-Adresse</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity onPress={handleResend} disabled={loading}>
          {loading ? (
            <ActivityIndicator size="small" color="#007AFF" />
          ) : (
            <Text style={styles.resendText}>Erneut senden</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setDismissed(true)} style={styles.dismissButton}>
          <Ionicons name="close" size={20} color="#666" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: { backgroundColor: '#FFF3CD', padding: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  content: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  text: { marginLeft: 8, fontSize: 14, color: '#856404', flex: 1 },
  actions: { flexDirection: 'row', alignItems: 'center' },
  resendText: { color: '#007AFF', fontSize: 14, fontWeight: '600', marginRight: 12 },
  dismissButton: { padding: 4 }
});
