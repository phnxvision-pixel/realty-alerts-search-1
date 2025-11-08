import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing } from '@/constants/theme';

interface Props {
  balcony: boolean;
  parking: boolean;
  elevator: boolean;
  furnished: boolean;
  petsAllowed: boolean;
  onToggle: (key: string) => void;
}

export const AmenitiesCheckboxes = ({ balcony, parking, elevator, furnished, petsAllowed, onToggle }: Props) => {
  const amenities = [
    { key: 'balcony', label: 'Balcony', icon: 'home-outline', value: balcony },
    { key: 'parking', label: 'Parking', icon: 'car-outline', value: parking },
    { key: 'elevator', label: 'Elevator', icon: 'arrow-up-outline', value: elevator },
    { key: 'furnished', label: 'Furnished', icon: 'bed-outline', value: furnished },
    { key: 'petsAllowed', label: 'Pets Allowed', icon: 'paw-outline', value: petsAllowed },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Amenities</Text>
      {amenities.map(amenity => (
        <TouchableOpacity
          key={amenity.key}
          style={styles.checkboxRow}
          onPress={() => onToggle(amenity.key)}
        >
          <View style={styles.leftContent}>
            <Ionicons name={amenity.icon as any} size={20} color={Colors.textSecondary} style={styles.icon} />
            <Text style={styles.amenityText}>{amenity.label}</Text>
          </View>
          <View style={[styles.checkbox, amenity.value && styles.checkboxActive]}>
            {amenity.value && <Ionicons name="checkmark" size={16} color={Colors.card} />}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: Spacing.lg },
  label: { fontSize: 16, fontWeight: '600', color: Colors.text, marginBottom: Spacing.sm },
  checkboxRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.border },
  leftContent: { flexDirection: 'row', alignItems: 'center' },
  icon: { marginRight: Spacing.md },
  amenityText: { fontSize: 16, color: Colors.text },
  checkbox: { width: 24, height: 24, borderRadius: 6, borderWidth: 2, borderColor: Colors.border, justifyContent: 'center', alignItems: 'center' },
  checkboxActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
});
