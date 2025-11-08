import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/app/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export default function VerifyEmailScreen() {
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleResendEmail = async () => {
    if (!user?.email) return;
    
    setLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email,
      });

      if (error) throw error;

      Alert.alert('Erfolg', 'Bestätigungs-E-Mail wurde erneut gesendet!');
      setResendCooldown(60);
    } catch (error: any) {
      Alert.alert('Fehler', error.message || 'E-Mail konnte nicht gesendet werden');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name="mail-outline" size={80} color="#007AFF" />
      </View>

      <Text style={styles.title}>E-Mail bestätigen</Text>
      <Text style={styles.message}>
        Wir haben eine Bestätigungs-E-Mail an{'\n'}
        <Text style={styles.email}>{user?.email}</Text> gesendet.
      </Text>

      <Text style={styles.instructions}>
        Bitte überprüfe dein E-Mail-Postfach und klicke auf den Bestätigungslink.
      </Text>

      <TouchableOpacity
        style={[styles.button, (loading || resendCooldown > 0) && styles.buttonDisabled]}
        onPress={handleResendEmail}
        disabled={loading || resendCooldown > 0}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>
            {resendCooldown > 0 
              ? `Erneut senden in ${resendCooldown}s` 
              : 'E-Mail erneut senden'}
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.replace('/auth/login')}>
        <Text style={styles.backLink}>Zurück zur Anmeldung</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20, justifyContent: 'center', alignItems: 'center' },
  iconContainer: { marginBottom: 24 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  message: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 12 },
  email: { fontWeight: '600', color: '#007AFF' },
  instructions: { fontSize: 14, color: '#999', textAlign: 'center', marginBottom: 32 },
  button: { backgroundColor: '#007AFF', paddingVertical: 14, paddingHorizontal: 32, borderRadius: 8, width: '100%', alignItems: 'center', marginBottom: 16 },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  backLink: { color: '#007AFF', fontSize: 16, marginTop: 8 }
});
