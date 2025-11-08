import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing } from '@/constants/theme';

interface Props {
  onFilterPress: () => void;
  activeFilters: number;
}

export const FilterBar = ({ onFilterPress, activeFilters }: Props) => {
  const cities = ['All', 'Berlin', 'Munich', 'Hamburg', 'Frankfurt', 'Cologne'];
  const [selectedCity, setSelectedCity] = React.useState('All');

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cityScroll}>
        {cities.map(city => (
          <TouchableOpacity
            key={city}
            style={[styles.cityChip, selectedCity === city && styles.cityChipActive]}
            onPress={() => setSelectedCity(city)}
          >
            <Text style={[styles.cityText, selectedCity === city && styles.cityTextActive]}>
              {city}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <TouchableOpacity style={styles.filterBtn} onPress={onFilterPress}>
        <Ionicons name="options-outline" size={20} color={Colors.card} />
        {activeFilters > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{activeFilters}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.sm, backgroundColor: Colors.background },
  cityScroll: { flex: 1, paddingHorizontal: Spacing.md },
  cityChip: { backgroundColor: Colors.card, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginRight: 8, borderWidth: 1, borderColor: Colors.border },
  cityChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  cityText: { fontSize: 14, color: Colors.text },
  cityTextActive: { color: Colors.card, fontWeight: '600' },
  filterBtn: { backgroundColor: Colors.primary, padding: 12, borderRadius: 8, marginRight: Spacing.md, position: 'relative' },
  badge: { position: 'absolute', top: -4, right: -4, backgroundColor: Colors.secondary, borderRadius: 10, width: 20, height: 20, justifyContent: 'center', alignItems: 'center' },
  badgeText: { color: Colors.card, fontSize: 10, fontWeight: 'bold' },
});
