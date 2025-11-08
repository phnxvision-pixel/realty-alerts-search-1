import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import { supabase } from '@/app/lib/supabase';
import { Colors } from '@/constants/theme';

interface PriceAnalyticsProps {
  apartmentId: string;
  currentPrice: number;
  location: string;
  rooms: number;
}

export default function PriceAnalytics({ apartmentId, currentPrice, location, rooms }: PriceAnalyticsProps) {
  const [loading, setLoading] = useState(true);
  const [priceHistory, setPriceHistory] = useState<any[]>([]);
  const [avgPrice, setAvgPrice] = useState(0);
  const [priceChange, setPriceChange] = useState(0);

  useEffect(() => {
    fetchPriceData();
  }, [apartmentId]);

  const fetchPriceData = async () => {
    try {
      // Fetch price history for this apartment
      const { data: history } = await supabase
        .from('price_history')
        .select('*')
        .eq('apartment_id', apartmentId)
        .order('recorded_at', { ascending: true });

      if (history && history.length > 0) {
        setPriceHistory(history);
        const oldestPrice = parseFloat(history[0].price);
        const change = ((currentPrice - oldestPrice) / oldestPrice) * 100;
        setPriceChange(change);
      }

      // Fetch average price for similar apartments
      const { data: similar } = await supabase
        .from('apartments')
        .select('price')
        .ilike('location', `%${location}%`)
        .eq('rooms', rooms)
        .limit(20);

      if (similar && similar.length > 0) {
        const avg = similar.reduce((sum, apt) => sum + parseFloat(apt.price), 0) / similar.length;
        setAvgPrice(avg);
      }
    } catch (error) {
      console.error('Error fetching price data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <ActivityIndicator size="large" color={Colors.primary} />;

  const priceDiff = currentPrice - avgPrice;
  const priceDiffPercent = avgPrice > 0 ? (priceDiff / avgPrice) * 100 : 0;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Price Analysis</Text>
      
      <View style={styles.card}>
        <Text style={styles.label}>Current Price</Text>
        <Text style={styles.price}>${currentPrice.toLocaleString()}/mo</Text>
      </View>

      {avgPrice > 0 && (
        <View style={styles.card}>
          <Text style={styles.label}>Market Average ({rooms} bed in {location})</Text>
          <Text style={styles.price}>${avgPrice.toFixed(0)}/mo</Text>
          <Text style={[styles.comparison, priceDiff < 0 ? styles.below : styles.above]}>
            {priceDiff < 0 ? '↓' : '↑'} ${Math.abs(priceDiff).toFixed(0)} ({Math.abs(priceDiffPercent).toFixed(1)}%)
            {priceDiff < 0 ? ' below' : ' above'} average
          </Text>
        </View>
      )}

      {priceHistory.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.label}>Price Trend</Text>
          <Text style={[styles.trend, priceChange >= 0 ? styles.up : styles.down]}>
            {priceChange >= 0 ? '↑' : '↓'} {Math.abs(priceChange).toFixed(1)}% since listing
          </Text>
        </View>
      )}

      <View style={styles.insights}>
        <Text style={styles.insightTitle}>Market Insights</Text>
        {priceDiff < -100 && <Text style={styles.insight}>• Great value compared to similar listings</Text>}
        {priceDiff > 100 && <Text style={styles.insight}>• Premium pricing for this area</Text>}
        {Math.abs(priceDiff) < 100 && <Text style={styles.insight}>• Competitively priced</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  card: { backgroundColor: '#f8f8f8', padding: 16, borderRadius: 8, marginBottom: 12 },
  label: { fontSize: 14, color: '#666', marginBottom: 4 },
  price: { fontSize: 24, fontWeight: 'bold', color: Colors.primary },
  comparison: { fontSize: 14, marginTop: 8, fontWeight: '600' },
  below: { color: '#10b981' },
  above: { color: '#ef4444' },
  trend: { fontSize: 18, fontWeight: 'bold', marginTop: 4 },
  up: { color: '#ef4444' },
  down: { color: '#10b981' },
  insights: { marginTop: 16, padding: 16, backgroundColor: '#f0f9ff', borderRadius: 8 },
  insightTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 8, color: Colors.primary },
  insight: { fontSize: 14, color: '#333', marginBottom: 4 }
});
