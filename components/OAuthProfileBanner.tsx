import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { profileSync } from '@/app/lib/profile-sync';
import { Ionicons } from '@expo/vector-icons';

export function OAuthProfileBanner() {
  const router = useRouter();
  const { user } = useAuth();
  const [needsReview, setNeedsReview] = useState(false);

  useEffect(() => {
    checkReviewStatus();
  }, [user]);

  const checkReviewStatus = async () => {
    if (!user?.id) return;
    const needs = await profileSync.checkNeedsReview(user.id);
    setNeedsReview(needs);
  };

  if (!needsReview) return null;

  return (
    <View style={styles.banner}>
      <View style={styles.content}>
        <Ionicons name="information-circle" size={24} color="#007AFF" />
        <View style={styles.textContainer}>
          <Text style={styles.title}>Review Your Profile</Text>
          <Text style={styles.message}>
            We imported your info. Please review and confirm.
          </Text>
        </View>
      </View>
      <TouchableOpacity 
        style={styles.button}
        onPress={() => router.push('/auth/review-oauth-profile')}
      >
        <Text style={styles.buttonText}>Review Now</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#E3F2FD',
    padding: 16,
    borderRadius: 8,
    margin: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF'
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
  message: {
    fontSize: 14,
    color: '#666'
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600'
  }
});
