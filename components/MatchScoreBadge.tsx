import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface MatchScoreBadgeProps {
  score: number;
  size?: 'small' | 'medium' | 'large';
}

export default function MatchScoreBadge({ score, size = 'medium' }: MatchScoreBadgeProps) {
  const getColor = () => {
    if (score >= 90) return '#10b981';
    if (score >= 75) return '#3b82f6';
    if (score >= 60) return '#f59e0b';
    return '#6b7280';
  };

  const getLabel = () => {
    if (score >= 90) return 'Excellent Match';
    if (score >= 75) return 'Great Match';
    if (score >= 60) return 'Good Match';
    return 'Fair Match';
  };

  const sizes = {
    small: { container: 50, text: 16, label: 10 },
    medium: { container: 60, text: 20, label: 11 },
    large: { container: 70, text: 24, label: 12 },
  };

  const dimensions = sizes[size];
  const color = getColor();

  return (
    <View style={styles.container}>
      <View style={[styles.circle, { 
        width: dimensions.container, 
        height: dimensions.container,
        borderColor: color,
      }]}>
        <Text style={[styles.score, { fontSize: dimensions.text, color }]}>
          {Math.round(score)}%
        </Text>
      </View>
      <Text style={[styles.label, { fontSize: dimensions.label, color }]}>
        {getLabel()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  circle: {
    borderWidth: 3,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  score: {
    fontWeight: 'bold',
  },
  label: {
    marginTop: 4,
    fontWeight: '600',
  },
});
