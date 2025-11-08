import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';

export function GoogleLoginButton() {
  const { signInWithGoogle } = useAuth();
  
  return (
    <TouchableOpacity 
      style={styles.socialButton} 
      onPress={async () => {
        try {
          await signInWithGoogle();
        } catch (error: any) {
          Alert.alert('Error', error.message);
        }
      }}
    >
      <Ionicons name="logo-google" size={24} color="#DB4437" />
      <Text style={styles.socialText}>Continue with Google</Text>
    </TouchableOpacity>
  );
}

export function AppleLoginButton() {
  const { signInWithApple } = useAuth();
  
  if (Platform.OS !== 'ios') return null;
  
  return (
    <TouchableOpacity 
      style={styles.socialButton} 
      onPress={async () => {
        try {
          await signInWithApple();
        } catch (error: any) {
          Alert.alert('Error', error.message);
        }
      }}
    >
      <Ionicons name="logo-apple" size={24} color="#000" />
      <Text style={styles.socialText}>Continue with Apple</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#fff'
  },
  socialText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#333'
  }
});
