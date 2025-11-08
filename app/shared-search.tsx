import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Colors, Spacing } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';

export default function SharedSearchScreen() {
  const params = useLocalSearchParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Parse search parameters from URL
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [params]);

  const applySearch = () => {
    // Navigate to home with filters applied
    router.replace({
      pathname: '/(tabs)',
      params: params
    });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading search...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Ionicons name="search" size={64} color={Colors.primary} />
        <Text style={styles.title}>Shared Search</Text>
        <Text style={styles.subtitle}>Someone shared an apartment search with you!</Text>
        
        <View style={styles.filtersBox}>
          <Text style={styles.filtersTitle}>Search Criteria:</Text>
          {params.city && <Text style={styles.filterItem}>City: {params.city}</Text>}
          {params.minPrice && <Text style={styles.filterItem}>Min Price: ${params.minPrice}</Text>}
          {params.maxPrice && <Text style={styles.filterItem}>Max Price: ${params.maxPrice}</Text>}
          {params.bedrooms && <Text style={styles.filterItem}>Bedrooms: {params.bedrooms}</Text>}
          {params.bathrooms && <Text style={styles.filterItem}>Bathrooms: {params.bathrooms}</Text>}
        </View>

        <TouchableOpacity style={styles.applyBtn} onPress={applySearch}>
          <Text style={styles.applyText}>Apply Search</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelBtn} onPress={() => router.replace('/(tabs)')}>
          <Text style={styles.cancelText}>Go to Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  content: {
    alignItems: 'center',
    width: '100%',
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: 16,
    color: Colors.textSecondary,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  filtersBox: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: Spacing.lg,
    width: '100%',
    marginBottom: Spacing.xl,
  },
  filtersTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  filterItem: {
    fontSize: 16,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  applyBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  applyText: {
    color: Colors.card,
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelBtn: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    width: '100%',
    alignItems: 'center',
  },
  cancelText: {
    color: Colors.textSecondary,
    fontSize: 16,
  },
});
