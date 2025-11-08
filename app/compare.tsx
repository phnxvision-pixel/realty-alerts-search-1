import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ALL_APARTMENTS } from '@/constants/apartments';
import { Colors, Spacing } from '@/constants/theme';
import { useApp } from '@/contexts/AppContext';

export default function CompareScreen() {
  const { compareList, clearCompare } = useApp();
  const router = useRouter();
  const apartments = ALL_APARTMENTS.filter(apt => compareList.includes(apt.id));

  if (apartments.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No apartments to compare</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Compare Apartments</Text>
        <TouchableOpacity onPress={clearCompare}>
          <Text style={styles.clearText}>Clear All</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.table}>
          <View style={styles.row}>
            <Text style={styles.label}>Title</Text>
            {apartments.map(apt => (
              <Text key={apt.id} style={styles.cell}>{apt.title}</Text>
            ))}
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Price</Text>
            {apartments.map(apt => (
              <Text key={apt.id} style={styles.cell}>€{apt.price}/mo</Text>
            ))}
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Size</Text>
            {apartments.map(apt => (
              <Text key={apt.id} style={styles.cell}>{apt.size}m²</Text>
            ))}
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Rooms</Text>
            {apartments.map(apt => (
              <Text key={apt.id} style={styles.cell}>{apt.rooms}</Text>
            ))}
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Location</Text>
            {apartments.map(apt => (
              <Text key={apt.id} style={styles.cell}>{apt.location}</Text>
            ))}
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Pets</Text>
            {apartments.map(apt => (
              <Text key={apt.id} style={styles.cell}>{apt.petsAllowed ? 'Yes' : 'No'}</Text>
            ))}
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Furnished</Text>
            {apartments.map(apt => (
              <Text key={apt.id} style={styles.cell}>{apt.furnished ? 'Yes' : 'No'}</Text>
            ))}
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Balcony</Text>
            {apartments.map(apt => (
              <Text key={apt.id} style={styles.cell}>{apt.balcony ? 'Yes' : 'No'}</Text>
            ))}
          </View>
        </View>
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: Spacing.lg, backgroundColor: Colors.card },
  title: { fontSize: 24, fontWeight: 'bold', color: Colors.text },
  clearText: { color: Colors.secondary, fontSize: 16, fontWeight: '600' },
  table: { padding: Spacing.md },
  row: { flexDirection: 'row', marginBottom: Spacing.md },
  label: { width: 120, fontSize: 16, fontWeight: 'bold', color: Colors.text, paddingVertical: Spacing.sm },
  cell: { width: 200, fontSize: 16, color: Colors.text, paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md, backgroundColor: Colors.card, marginRight: Spacing.sm, borderRadius: 8 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.xl },
  emptyText: { fontSize: 18, color: Colors.textLight, marginBottom: Spacing.lg },
  backBtn: { backgroundColor: Colors.primary, paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8 },
  backText: { color: Colors.card, fontSize: 16, fontWeight: 'bold' },
});
