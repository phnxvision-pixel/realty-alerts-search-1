import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';

export default function IndexScreen() {
  const { user, loading, needsOnboarding } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        if (needsOnboarding) {
          router.replace('/profile-completion');
        } else {
          router.replace('/(tabs)');
        }
      } else {
        router.replace('/onboarding');
      }
    }
  }, [user, loading, needsOnboarding]);


  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#007AFF" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  }
});
