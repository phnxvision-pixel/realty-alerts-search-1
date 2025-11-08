import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Spacing } from '../constants/themes';

export const FinancingCalculator: React.FC = () => {
  const { theme } = useTheme();
  const [rent, setRent] = useState('1200');
  const [utilities, setUtilities] = useState('200');
  const [deposit, setDeposit] = useState('3');
  const [movingDistance, setMovingDistance] = useState('50');

  const rentNum = parseFloat(rent) || 0;
  const utilitiesNum = parseFloat(utilities) || 0;
  const depositNum = parseFloat(deposit) || 3;
  const distanceNum = parseFloat(movingDistance) || 0;

  const totalMonthly = rentNum + utilitiesNum;
  const totalDeposit = rentNum * depositNum;
  const movingCost = distanceNum * 15 + 200;
  const initialCost = totalDeposit + movingCost;

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Financing Calculator</Text>
      
      <View style={[styles.card, { backgroundColor: theme.card }]}>
        <Text style={[styles.label, { color: theme.text }]}>Monthly Rent</Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.text, borderColor: theme.border }]}
          value={rent}
          onChangeText={setRent}
          keyboardType="numeric"
          placeholder="1200"
          placeholderTextColor={theme.textLight}
        />
      </View>

      <View style={[styles.card, { backgroundColor: theme.card }]}>
        <Text style={[styles.label, { color: theme.text }]}>Monthly Utilities</Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.text, borderColor: theme.border }]}
          value={utilities}
          onChangeText={setUtilities}
          keyboardType="numeric"
          placeholder="200"
          placeholderTextColor={theme.textLight}
        />
      </View>

      <View style={[styles.card, { backgroundColor: theme.card }]}>
        <Text style={[styles.label, { color: theme.text }]}>Deposit (months)</Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.text, borderColor: theme.border }]}
          value={deposit}
          onChangeText={setDeposit}
          keyboardType="numeric"
          placeholder="3"
          placeholderTextColor={theme.textLight}
        />
      </View>

      <View style={[styles.card, { backgroundColor: theme.card }]}>
        <Text style={[styles.label, { color: theme.text }]}>Moving Distance (km)</Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.text, borderColor: theme.border }]}
          value={movingDistance}
          onChangeText={setMovingDistance}
          keyboardType="numeric"
          placeholder="50"
          placeholderTextColor={theme.textLight}
        />
      </View>

      <View style={[styles.results, { backgroundColor: theme.card }]}>
        <Text style={[styles.resultTitle, { color: theme.primary }]}>Results</Text>
        <View style={styles.resultRow}>
          <Text style={[styles.resultLabel, { color: theme.textLight }]}>Total Monthly Cost:</Text>
          <Text style={[styles.resultValue, { color: theme.text }]}>${totalMonthly.toFixed(2)}</Text>
        </View>
        <View style={styles.resultRow}>
          <Text style={[styles.resultLabel, { color: theme.textLight }]}>Security Deposit:</Text>
          <Text style={[styles.resultValue, { color: theme.text }]}>${totalDeposit.toFixed(2)}</Text>
        </View>
        <View style={styles.resultRow}>
          <Text style={[styles.resultLabel, { color: theme.textLight }]}>Moving Cost:</Text>
          <Text style={[styles.resultValue, { color: theme.text }]}>${movingCost.toFixed(2)}</Text>
        </View>
        <View style={[styles.resultRow, styles.totalRow]}>
          <Text style={[styles.resultLabel, { color: theme.text, fontWeight: 'bold' }]}>Initial Cost:</Text>
          <Text style={[styles.resultValue, { color: theme.primary, fontWeight: 'bold', fontSize: 20 }]}>${initialCost.toFixed(2)}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: Spacing.md },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: Spacing.lg },
  card: { padding: Spacing.md, borderRadius: 12, marginBottom: Spacing.md },
  label: { fontSize: 16, fontWeight: '600', marginBottom: Spacing.sm },
  input: { borderWidth: 1, borderRadius: 8, padding: Spacing.md, fontSize: 16 },
  results: { padding: Spacing.lg, borderRadius: 12, marginTop: Spacing.md },
  resultTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: Spacing.md },
  resultRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.sm },
  resultLabel: { fontSize: 16 },
  resultValue: { fontSize: 16, fontWeight: '600' },
  totalRow: { marginTop: Spacing.md, paddingTop: Spacing.md, borderTopWidth: 1, borderTopColor: '#e0e0e0' },
});
