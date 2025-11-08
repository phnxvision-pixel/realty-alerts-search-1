import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

interface MaintenanceRequestCardProps {
  request: any;
  userType: 'tenant' | 'landlord';
  onPress?: () => void;
}

export default function MaintenanceRequestCard({ request, userType, onPress }: MaintenanceRequestCardProps) {
  const getPriorityColor = () => {
    switch (request.priority) {
      case 'emergency': return '#dc2626';
      case 'high': return '#f59e0b';
      case 'medium': return '#3b82f6';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getStatusColor = () => {
    switch (request.status) {
      case 'completed': return '#10b981';
      case 'in_progress': return '#3b82f6';
      case 'acknowledged': return '#f59e0b';
      case 'submitted': return '#6b7280';
      default: return '#6b7280';
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{request.title}</Text>
          <Text style={styles.category}>{request.category}</Text>
        </View>
        <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor() }]}>
          <Text style={styles.badgeText}>{request.priority}</Text>
        </View>
      </View>

      <Text style={styles.description} numberOfLines={2}>
        {request.description}
      </Text>

      <View style={styles.footer}>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
          <Text style={styles.badgeText}>{request.status.replace('_', ' ')}</Text>
        </View>
        <Text style={styles.date}>
          {new Date(request.created_at).toLocaleDateString()}
        </Text>
      </View>

      {request.images && request.images.length > 0 && (
        <View style={styles.imagePreview}>
          <Image source={{ uri: request.images[0] }} style={styles.image} />
          {request.images.length > 1 && (
            <Text style={styles.imageCount}>+{request.images.length - 1}</Text>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  category: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
    textTransform: 'capitalize',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    height: 24,
  },
  description: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  date: {
    fontSize: 12,
    color: '#9ca3af',
  },
  imagePreview: {
    marginTop: 12,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 120,
    borderRadius: 8,
  },
  imageCount: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    color: 'white',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 12,
    fontWeight: '600',
  },
});
