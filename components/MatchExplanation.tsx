import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface MatchExplanationProps {
  reasons: string[];
  breakdown: {
    location?: number;
    price?: number;
    amenities?: number;
    size?: number;
  };
}

export default function MatchExplanation({ reasons, breakdown }: MatchExplanationProps) {
  const categories = [
    { key: 'location', label: 'Location', icon: 'location' },
    { key: 'price', label: 'Price', icon: 'cash' },
    { key: 'amenities', label: 'Amenities', icon: 'star' },
    { key: 'size', label: 'Size', icon: 'resize' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Why This Match?</Text>
      
      <View style={styles.reasonsContainer}>
        {reasons.map((reason, index) => (
          <View key={index} style={styles.reasonItem}>
            <Ionicons name="checkmark-circle" size={20} color="#10b981" />
            <Text style={styles.reasonText}>{reason}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.subtitle}>Compatibility Breakdown</Text>
      <View style={styles.breakdownContainer}>
        {categories.map(({ key, label, icon }) => {
          const score = breakdown[key as keyof typeof breakdown] || 0;
          return (
            <View key={key} style={styles.breakdownItem}>
              <View style={styles.breakdownHeader}>
                <Ionicons name={icon as any} size={16} color="#6b7280" />
                <Text style={styles.breakdownLabel}>{label}</Text>
              </View>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${score}%` }]} />
              </View>
              <Text style={styles.breakdownScore}>{score}%</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#f9fafb', borderRadius: 12 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  reasonsContainer: { marginBottom: 16 },
  reasonItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 },
  reasonText: { flex: 1, marginLeft: 8, color: '#374151', fontSize: 14 },
  subtitle: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  breakdownContainer: { gap: 12 },
  breakdownItem: { gap: 4 },
  breakdownHeader: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  breakdownLabel: { fontSize: 14, fontWeight: '500', color: '#374151' },
  progressBar: { height: 8, backgroundColor: '#e5e7eb', borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#3b82f6', borderRadius: 4 },
  breakdownScore: { fontSize: 12, color: '#6b7280', textAlign: 'right' },
});
