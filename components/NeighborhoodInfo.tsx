import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { supabase } from '@/app/lib/supabase';
import { Colors } from '@/constants/theme';

interface POI {
  name: string;
  vicinity: string;
  rating: number;
  distance: string;
}

interface NeighborhoodInfoProps {
  latitude: number;
  longitude: number;
  location: string;
}

export default function NeighborhoodInfo({ latitude, longitude, location }: NeighborhoodInfoProps) {
  const [loading, setLoading] = useState(true);
  const [pois, setPois] = useState<any>({});

  useEffect(() => {
    fetchNeighborhoodData();
  }, [latitude, longitude]);

  const fetchNeighborhoodData = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('get-neighborhood-info', {
        body: { latitude, longitude, location }
      });

      if (error) throw error;
      if (data?.pois) {
        setPois(data.pois);
      }
    } catch (error) {
      console.error('Error fetching neighborhood data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color={Colors.primary} />;
  }

  const categories = [
    { key: 'school', title: 'Schools', icon: '🏫' },
    { key: 'transit_station', title: 'Transport', icon: '🚇' },
    { key: 'supermarket', title: 'Shopping', icon: '🛒' },
    { key: 'restaurant', title: 'Dining', icon: '🍽️' },
    { key: 'hospital', title: 'Healthcare', icon: '🏥' },
    { key: 'park', title: 'Parks', icon: '🌳' }
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Neighborhood Information</Text>
      {categories.map(cat => (
        pois[cat.key] && pois[cat.key].length > 0 && (
          <View key={cat.key} style={styles.category}>
            <Text style={styles.categoryTitle}>{cat.title}</Text>
            {pois[cat.key].slice(0, 3).map((poi: POI, idx: number) => (
              <View key={idx} style={styles.poiItem}>
                <Text style={styles.poiName}>{poi.name}</Text>
                <Text style={styles.poiDistance}>{poi.distance} km away</Text>
              </View>
            ))}
          </View>
        )
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  category: { marginBottom: 20 },
  categoryTitle: { fontSize: 16, fontWeight: '600', marginBottom: 8, color: Colors.primary },
  poiItem: { paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#eee' },
  poiName: { fontSize: 14, fontWeight: '500' },
  poiDistance: { fontSize: 12, color: '#666', marginTop: 2 }
});
