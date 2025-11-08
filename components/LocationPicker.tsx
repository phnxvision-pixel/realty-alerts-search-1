import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing } from '@/constants/theme';

interface Props {
  location: string;
  radius: number;
  onLocationChange: (location: string) => void;
  onRadiusChange: (radius: number) => void;
}

export const LocationPicker = ({ location, radius, onLocationChange, onRadiusChange }: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Location</Text>
      <View style={styles.inputContainer}>
        <Ionicons name="location-outline" size={20} color={Colors.textSecondary} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Enter city or address"
          placeholderTextColor={Colors.textSecondary}
          value={location}
          onChangeText={onLocationChange}
        />
      </View>
      <View style={styles.radiusRow}>
        <Text style={styles.label}>Search Radius</Text>
        <Text style={styles.radiusValue}>{radius} km</Text>
      </View>
      <Slider
        style={styles.slider}
        minimumValue={1}
        maximumValue={50}
        step={1}
        value={radius}
        onValueChange={onRadiusChange}
        minimumTrackTintColor={Colors.primary}
        maximumTrackTintColor={Colors.border}
        thumbTintColor={Colors.primary}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: Spacing.lg },
  label: { fontSize: 16, fontWeight: '600', color: Colors.text, marginBottom: Spacing.sm },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.background, borderRadius: 8, borderWidth: 1, borderColor: Colors.border, paddingHorizontal: Spacing.md, marginBottom: Spacing.md },
  icon: { marginRight: Spacing.sm },
  input: { flex: 1, paddingVertical: 12, fontSize: 16, color: Colors.text },
  radiusRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: Spacing.sm },
  radiusValue: { fontSize: 18, color: Colors.primary, fontWeight: 'bold' },
  slider: { width: '100%', height: 40 },
});
