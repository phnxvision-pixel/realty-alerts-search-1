import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function VerifiedScreen() {
  const router = useRouter();

  useEffect(() => {
    // Auto-redirect after 3 seconds
    const timer = setTimeout(() => {
      router.replace('/(tabs)');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name="checkmark-circle" size={100} color="#10B981" />
      </View>

      <Text style={styles.title}>E-Mail bestätigt!</Text>
      <Text style={styles.message}>
        Deine E-Mail-Adresse wurde erfolgreich bestätigt.
      </Text>
      <Text style={styles.subMessage}>
        Du wirst automatisch weitergeleitet...
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.replace('/(tabs)')}
      >
        <Text style={styles.buttonText}>Zur Startseite</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20, justifyContent: 'center', alignItems: 'center' },
  iconContainer: { marginBottom: 24 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  message: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 8 },
  subMessage: { fontSize: 14, color: '#999', textAlign: 'center', marginBottom: 32 },
  button: { backgroundColor: '#007AFF', paddingVertical: 14, paddingHorizontal: 32, borderRadius: 8, width: '100%', alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' }
});
