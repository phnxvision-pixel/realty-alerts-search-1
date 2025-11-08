import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

interface RevenueChartProps {
  data: { [key: string]: { revenue: number; commission: number; count: number } };
  type?: 'revenue' | 'commission';
}

export default function RevenueChart({ data, type = 'revenue' }: RevenueChartProps) {
  const months = Object.keys(data).sort().slice(-12);
  const maxValue = Math.max(...months.map(m => data[m][type]));
  const chartWidth = Dimensions.get('window').width - 80;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {type === 'revenue' ? 'Revenue' : 'Commission'} Trend
      </Text>
      <View style={styles.chart}>
        {months.map((month, index) => {
          const value = data[month][type];
          const height = (value / maxValue) * 150;
          return (
            <View key={month} style={styles.barContainer}>
              <View style={[styles.bar, { height }]}>
                <Text style={styles.barValue}>${value.toFixed(0)}</Text>
              </View>
              <Text style={styles.barLabel}>{month.split('-')[1]}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 16 },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 16, color: '#1a1a1a' },
  chart: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 180 },
  barContainer: { flex: 1, alignItems: 'center', marginHorizontal: 2 },
  bar: { backgroundColor: '#007AFF', width: '100%', borderRadius: 4, justifyContent: 'flex-end', paddingBottom: 4 },
  barValue: { fontSize: 10, color: '#fff', textAlign: 'center', fontWeight: '600' },
  barLabel: { fontSize: 10, color: '#666', marginTop: 4 }
});
