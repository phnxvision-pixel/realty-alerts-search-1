import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, signInWithGoogle, signInWithApple } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Fehler', 'Bitte geben Sie E-Mail und Passwort ein');
      return;
    }
    setLoading(true);
    try {
      await signIn(email.trim(), password);
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Anmeldung fehlgeschlagen', 'Ungültige E-Mail oder Passwort');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error: any) {
      if (error.message && !error.message.includes('canceled')) {
        Alert.alert('Fehler', 'Google-Anmeldung fehlgeschlagen. Bitte versuchen Sie es erneut.');
      }
    }
  };

  const handleAppleSignIn = async () => {
    try {
      await signInWithApple();
    } catch (error: any) {
      if (error.message && !error.message.includes('canceled')) {
        Alert.alert('Fehler', 'Apple-Anmeldung fehlgeschlagen. Bitte versuchen Sie es erneut.');
      }
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Willkommen zurück</Text>
        <Text style={styles.subtitle}>Melden Sie sich bei Ihrem Konto an</Text>

        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#666" style={styles.icon} />
          <TextInput 
            style={styles.input} 
            placeholder="E-Mail" 
            value={email} 
            onChangeText={setEmail} 
            autoCapitalize="none" 
            keyboardType="email-address"
            editable={!loading}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.icon} />
          <TextInput 
            style={styles.input} 
            placeholder="Passwort" 
            value={password} 
            onChangeText={setPassword} 
            secureTextEntry={!showPassword}
            editable={!loading}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color="#666" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => router.push('/auth/reset-password')}>
          <Text style={styles.forgotText}>Passwort vergessen?</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]} 
          onPress={handleLogin} 
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Anmelden</Text>}
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={styles.line} />
          <Text style={styles.orText}>ODER</Text>
          <View style={styles.line} />
        </View>

        <TouchableOpacity style={styles.socialButton} onPress={handleGoogleSignIn} disabled={loading}>
          <Ionicons name="logo-google" size={24} color="#DB4437" />
          <Text style={styles.socialText}>Mit Google anmelden</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.socialButton} onPress={handleAppleSignIn} disabled={loading}>
          <Ionicons name="logo-apple" size={24} color="#000" />
          <Text style={styles.socialText}>Mit Apple anmelden</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/auth/signup')} disabled={loading}>
          <Text style={styles.signupText}>Noch kein Konto? <Text style={styles.signupLink}>Registrieren</Text></Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 32 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, paddingHorizontal: 12, marginBottom: 16 },
  icon: { marginRight: 8 },
  input: { flex: 1, padding: 12, fontSize: 16 },
  forgotText: { color: '#007AFF', textAlign: 'right', marginBottom: 24 },
  button: { backgroundColor: '#007AFF', padding: 16, borderRadius: 8, alignItems: 'center', marginBottom: 24 },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  divider: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  line: { flex: 1, height: 1, backgroundColor: '#ddd' },
  orText: { marginHorizontal: 16, color: '#666', fontSize: 12 },
  socialButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 8, marginBottom: 12 },
  socialText: { marginLeft: 12, fontSize: 16 },
  signupText: { textAlign: 'center', marginTop: 16, color: '#666' },
  signupLink: { color: '#007AFF', fontWeight: '600' }
});
