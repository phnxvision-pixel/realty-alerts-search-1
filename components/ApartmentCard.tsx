import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Apartment } from '@/types';
import { Colors, Spacing } from '@/constants/theme';
import { useApp } from '@/contexts/AppContext';
import { useRouter } from 'expo-router';
import MatchScoreBadge from './MatchScoreBadge';

interface Props {
  apartment: Apartment;
  matchScore?: number;
  showMatchScore?: boolean;
}


export const ApartmentCard = ({ apartment, matchScore, showMatchScore }: Props) => {
  const { favorites, toggleFavorite, compareList, toggleCompare } = useApp();
  const router = useRouter();
  const isFavorite = favorites.includes(apartment.id);
  const isComparing = compareList.includes(apartment.id);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/listing/${apartment.id}`)}
      activeOpacity={0.7}
    >
      <Image source={{ uri: apartment.image }} style={styles.image} />
      {apartment.isNew && (
        <View style={styles.newBadge}>
          <Text style={styles.newText}>NEW</Text>
        </View>
      )}
      {showMatchScore && matchScore !== undefined && (
        <View style={styles.matchBadge}>
          <MatchScoreBadge score={matchScore} size="small" />
        </View>
      )}
      <TouchableOpacity
        style={styles.favoriteBtn}
        onPress={() => toggleFavorite(apartment.id)}
      >
        <Ionicons
          name={isFavorite ? 'heart' : 'heart-outline'}
          size={24}
          color={isFavorite ? Colors.secondary : Colors.card}
        />
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>{apartment.title}</Text>
        <Text style={styles.location}>{apartment.address || apartment.location}</Text>
        <View style={styles.amenitiesRow}>
          {apartment.balcony && <Ionicons name="home-outline" size={16} color={Colors.primary} style={styles.amenityIcon} />}
          {apartment.parking && <Ionicons name="car-outline" size={16} color={Colors.primary} style={styles.amenityIcon} />}
          {apartment.elevator && <Ionicons name="arrow-up-outline" size={16} color={Colors.primary} style={styles.amenityIcon} />}
        </View>
        <View style={styles.details}>
          <Text style={styles.price}>€{apartment.price}/mo</Text>
          <Text style={styles.meta}>{apartment.rooms} rooms • {apartment.size}m²</Text>
        </View>

        <TouchableOpacity
          style={[styles.compareBtn, isComparing && styles.comparingBtn]}
          onPress={() => toggleCompare(apartment.id)}
        >
          <Text style={styles.compareText}>
            {isComparing ? 'Remove' : 'Compare'}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: { backgroundColor: Colors.card, borderRadius: 12, marginBottom: Spacing.md, overflow: 'hidden', elevation: 2 },
  image: { width: '100%', height: 200 },
  newBadge: { position: 'absolute', top: 12, left: 12, backgroundColor: Colors.secondary, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  newText: { color: Colors.card, fontSize: 12, fontWeight: 'bold' },
  matchBadge: { position: 'absolute', top: 12, left: 12, zIndex: 10 },
  favoriteBtn: { position: 'absolute', top: 12, right: 12, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 20, padding: 6 },

  content: { padding: Spacing.md },
  title: { fontSize: 18, fontWeight: 'bold', color: Colors.text, marginBottom: 4 },
  location: { fontSize: 14, color: Colors.textLight, marginBottom: 4 },
  amenitiesRow: { flexDirection: 'row', marginBottom: 8 },
  amenityIcon: { marginRight: 8 },
  details: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  price: { fontSize: 20, fontWeight: 'bold', color: Colors.primary },
  meta: { fontSize: 14, color: Colors.textLight },
  compareBtn: { backgroundColor: Colors.primary, paddingVertical: 8, borderRadius: 6, alignItems: 'center' },
  comparingBtn: { backgroundColor: Colors.secondary },
  compareText: { color: Colors.card, fontSize: 14, fontWeight: '600' },
});

