import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface VerificationBadgeProps {
  verified: boolean;
  type: 'credit' | 'background' | 'employment' | 'rental';
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
}

export default function VerificationBadge({ 
  verified, 
  type, 
  size = 'medium',
  showLabel = true 
}: VerificationBadgeProps) {
  const labels = {
    credit: 'Credit Verified',
    background: 'Background Checked',
    employment: 'Employment Verified',
    rental: 'Rental History Verified'
  };

  const icons = {
    credit: 'card-outline',
    background: 'shield-checkmark-outline',
    employment: 'briefcase-outline',
    rental: 'home-outline'
  };

  const sizes = {
    small: { icon: 16, text: 10 },
    medium: { icon: 20, text: 12 },
    large: { icon: 24, text: 14 }
  };

  if (!verified) return null;

  return (
    <View style={styles.container}>
      <View style={[styles.badge, styles[`badge${size}`]]}>
        <Ionicons 
          name={icons[type] as any} 
          size={sizes[size].icon} 
          color="#10B981" 
        />
      </View>
      {showLabel && (
        <Text style={[styles.label, { fontSize: sizes[size].text }]}>
          {labels[type]}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  badge: {
    backgroundColor: '#D1FAE5',
    borderRadius: 12,
    padding: 4,
    marginRight: 4,
  },
  badgesmall: {
    padding: 2,
  },
  badgemedium: {
    padding: 4,
  },
  badgelarge: {
    padding: 6,
  },
  label: {
    color: '#10B981',
    fontWeight: '600',
  },
});
