import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface VendorCardProps {
  vendor: any;
  onEdit?: () => void;
  onAssign?: () => void;
  onViewDetails?: () => void;
}

export default function VendorCard({ vendor, onEdit, onAssign, onViewDetails }: VendorCardProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Ionicons
        key={i}
        name={i < Math.floor(rating) ? 'star' : 'star-outline'}
        size={16}
        color="#FFD700"
      />
    ));
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={32} color="#666" />
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{vendor.name}</Text>
          {vendor.company_name && (
            <Text style={styles.company}>{vendor.company_name}</Text>
          )}
          <View style={styles.rating}>
            {renderStars(vendor.average_rating || 0)}
            <Text style={styles.ratingText}>
              {vendor.average_rating?.toFixed(1) || '0.0'} ({vendor.total_jobs || 0} jobs)
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.specialties}>
        {vendor.specialties?.map((specialty: string, index: number) => (
          <View key={index} style={styles.specialtyTag}>
            <Text style={styles.specialtyText}>{specialty}</Text>
          </View>
        ))}
      </View>

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Ionicons name="mail" size={16} color="#666" />
          <Text style={styles.detailText}>{vendor.email}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="call" size={16} color="#666" />
          <Text style={styles.detailText}>{vendor.phone}</Text>
        </View>
        {vendor.hourly_rate && (
          <View style={styles.detailRow}>
            <Ionicons name="cash" size={16} color="#666" />
            <Text style={styles.detailText}>${vendor.hourly_rate}/hr</Text>
          </View>
        )}
      </View>

      <View style={styles.actions}>
        {onAssign && (
          <TouchableOpacity style={styles.assignButton} onPress={onAssign}>
            <Text style={styles.assignButtonText}>Assign</Text>
          </TouchableOpacity>
        )}
        {onEdit && (
          <TouchableOpacity style={styles.editButton} onPress={onEdit}>
            <Ionicons name="create-outline" size={20} color="#007AFF" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  header: { flexDirection: 'row', marginBottom: 12 },
  avatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  info: { flex: 1 },
  name: { fontSize: 18, fontWeight: '600', marginBottom: 4 },
  company: { fontSize: 14, color: '#666', marginBottom: 4 },
  rating: { flexDirection: 'row', alignItems: 'center' },
  ratingText: { marginLeft: 8, fontSize: 12, color: '#666' },
  specialties: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 },
  specialtyTag: { backgroundColor: '#e3f2fd', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, marginRight: 8, marginBottom: 4 },
  specialtyText: { fontSize: 12, color: '#1976d2' },
  details: { marginBottom: 12 },
  detailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  detailText: { marginLeft: 8, fontSize: 14, color: '#666' },
  actions: { flexDirection: 'row', justifyContent: 'flex-end' },
  assignButton: { backgroundColor: '#007AFF', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, marginRight: 8 },
  assignButtonText: { color: '#fff', fontWeight: '600' },
  editButton: { padding: 8 }
});
