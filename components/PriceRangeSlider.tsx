import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { Colors, Spacing } from '@/constants/theme';

interface Props {
  minValue: number;
  maxValue: number;
  onMinChange: (value: number) => void;
  onMaxChange: (value: number) => void;
}

export const PriceRangeSlider = ({ minValue, maxValue, onMinChange, onMaxChange }: Props) => {
  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>Min Price</Text>
        <Text style={styles.value}>€{minValue}</Text>
      </View>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={5000}
        step={50}
        value={minValue}
        onValueChange={onMinChange}
        minimumTrackTintColor={Colors.primary}
        maximumTrackTintColor={Colors.border}
        thumbTintColor={Colors.primary}
      />
      <View style={styles.labelRow}>
        <Text style={styles.label}>Max Price</Text>
        <Text style={styles.value}>€{maxValue}</Text>
      </View>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={5000}
        step={50}
        value={maxValue}
        onValueChange={onMaxChange}
        minimumTrackTintColor={Colors.primary}
        maximumTrackTintColor={Colors.border}
        thumbTintColor={Colors.primary}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: Spacing.lg },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.xs },
  label: { fontSize: 16, fontWeight: '600', color: Colors.text },
  value: { fontSize: 18, color: Colors.primary, fontWeight: 'bold' },
  slider: { width: '100%', height: 40 },
});
