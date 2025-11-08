import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface VerificationResultsProps {
  results: any[];
}

export default function VerificationResults({ results }: VerificationResultsProps) {
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return '#10B981';
      case 'medium': return '#F59E0B';
      case 'high': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getIcon = (type: string) => {
    const icons: any = {
      credit_check: 'card-outline',
      background_check: 'shield-checkmark-outline',
      employment_verification: 'briefcase-outline',
      rental_history: 'home-outline'
    };
    return icons[type] || 'document-outline';
  };

  return (
    <ScrollView style={styles.container}>
      {results.map((result, index) => (
        <View key={index} style={styles.resultCard}>
          <View style={styles.header}>
            <Ionicons name={getIcon(result.verification_type)} size={24} color="#3B82F6" />
            <Text style={styles.title}>
              {result.verification_type.replace('_', ' ').toUpperCase()}
            </Text>
            <View style={[styles.badge, { backgroundColor: result.passed ? '#D1FAE5' : '#FEE2E2' }]}>
              <Text style={[styles.badgeText, { color: result.passed ? '#10B981' : '#EF4444' }]}>
                {result.passed ? 'PASSED' : 'REVIEW'}
              </Text>
            </View>
          </View>

          {result.credit_score && (
            <View style={styles.scoreContainer}>
              <Text style={styles.scoreLabel}>Credit Score</Text>
              <Text style={styles.score}>{result.credit_score}</Text>
            </View>
          )}

          {result.risk_level && (
            <View style={styles.row}>
              <Text style={styles.label}>Risk Level:</Text>
              <Text style={[styles.value, { color: getRiskColor(result.risk_level) }]}>
                {result.risk_level.toUpperCase()}
              </Text>
            </View>
          )}

          <View style={styles.details}>
            {Object.entries(result.result_data || {}).map(([key, value]) => (
              <View key={key} style={styles.detailRow}>
                <Text style={styles.detailLabel}>{key.replace(/_/g, ' ')}:</Text>
                <Text style={styles.detailValue}>{String(value)}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.date}>
            Verified: {new Date(result.created_at).toLocaleDateString()}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  resultCard: { backgroundColor: '#FFF', borderRadius: 12, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  title: { flex: 1, fontSize: 16, fontWeight: '600', marginLeft: 8 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  badgeText: { fontSize: 12, fontWeight: '600' },
  scoreContainer: { alignItems: 'center', padding: 16, backgroundColor: '#F3F4F6', borderRadius: 12, marginBottom: 16 },
  scoreLabel: { fontSize: 14, color: '#666', marginBottom: 4 },
  score: { fontSize: 32, fontWeight: 'bold', color: '#3B82F6' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  label: { fontSize: 14, color: '#666' },
  value: { fontSize: 14, fontWeight: '600' },
  details: { backgroundColor: '#F9FAFB', padding: 12, borderRadius: 8, marginBottom: 12 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  detailLabel: { fontSize: 13, color: '#666', textTransform: 'capitalize' },
  detailValue: { fontSize: 13, fontWeight: '500' },
  date: { fontSize: 12, color: '#999', textAlign: 'right' },
});
