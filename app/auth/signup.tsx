import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function SignupScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signUp, signInWithGoogle, signInWithApple } = useAuth();
  const router = useRouter();

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSignup = async () => {
    if (!fullName.trim()) {
      Alert.alert('Fehler', 'Bitte geben Sie Ihren vollständigen Namen ein');
      return;
    }
    if (!email.trim() || !validateEmail(email)) {
      Alert.alert('Fehler', 'Bitte geben Sie eine gültige E-Mail-Adresse ein');
      return;
    }
    if (!password || password.length < 6) {
      Alert.alert('Fehler', 'Das Passwort muss mindestens 6 Zeichen lang sein');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Fehler', 'Die Passwörter stimmen nicht überein');
      return;
    }

    setLoading(true);

    try {
      await signUp(email.trim(), password, fullName.trim());
      // Navigate to verification screen
      router.replace('/auth/verify-email');
    } catch (error: any) {
      Alert.alert('Registrierung fehlgeschlagen', error.message || 'Ein Fehler ist aufgetreten');
    } finally {
      setLoading(false);
    }

  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Konto erstellen</Text>
      <Text style={styles.subtitle}>Willkommen bei WohnAgent</Text>

      <View style={styles.inputContainer}>
        <Ionicons name="person-outline" size={20} color="#666" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Vollständiger Name"
          value={fullName}
          onChangeText={setFullName}
          autoCapitalize="words"
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="mail-outline" size={20} color="#666" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="E-Mail"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Passwort (min. 6 Zeichen)"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color="#666" />
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Passwort bestätigen"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showPassword}
        />
      </View>

      <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={handleSignup} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Registrieren</Text>}
      </TouchableOpacity>

      <View style={styles.divider}>
        <View style={styles.line} />
        <Text style={styles.orText}>ODER</Text>
        <View style={styles.line} />
      </View>

      <TouchableOpacity style={styles.socialButton} onPress={signInWithGoogle}>
        <Ionicons name="logo-google" size={24} color="#DB4437" />
        <Text style={styles.socialText}>Mit Google registrieren</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.socialButton} onPress={signInWithApple}>
        <Ionicons name="logo-apple" size={24} color="#000" />
        <Text style={styles.socialText}>Mit Apple registrieren</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.loginText}>Bereits ein Konto? <Text style={styles.loginLink}>Anmelden</Text></Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 20, paddingTop: 60 },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 32 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, paddingHorizontal: 12, marginBottom: 16 },
  icon: { marginRight: 8 },
  input: { flex: 1, padding: 12, fontSize: 16 },
  button: { backgroundColor: '#007AFF', padding: 16, borderRadius: 8, alignItems: 'center', marginBottom: 24 },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  divider: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  line: { flex: 1, height: 1, backgroundColor: '#ddd' },
  orText: { marginHorizontal: 16, color: '#666', fontSize: 12 },
  socialButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 8, marginBottom: 12 },
  socialText: { marginLeft: 12, fontSize: 16 },
  loginText: { textAlign: 'center', marginTop: 16, color: '#666' },
  loginLink: { color: '#007AFF', fontWeight: '600' }
});
