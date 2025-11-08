import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

interface LeaseCardProps {
  lease: any;
  userType: 'tenant' | 'landlord';
}

export default function LeaseCard({ lease, userType }: LeaseCardProps) {
  const router = useRouter();

  const getStatusColor = () => {
    switch (lease.status) {
      case 'active': return '#10b981';
      case 'pending_signature': return '#f59e0b';
      case 'expired': return '#ef4444';
      case 'draft': return '#6b7280';
      default: return '#6b7280';
    }
  };

  return (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => router.push(`/lease/${lease.id}`)}
    >
      <View style={styles.header}>
        <Text style={styles.address}>{lease.apartment?.address || 'Property'}</Text>
        <View style={[styles.badge, { backgroundColor: getStatusColor() }]}>
          <Text style={styles.badgeText}>{lease.status.replace('_', ' ')}</Text>
        </View>
      </View>
      
      <View style={styles.details}>
        <View style={styles.row}>
          <Text style={styles.label}>Monthly Rent:</Text>
          <Text style={styles.value}>${lease.monthly_rent}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Lease Period:</Text>
          <Text style={styles.value}>
            {new Date(lease.start_date).toLocaleDateString()} - {new Date(lease.end_date).toLocaleDateString()}
          </Text>
        </View>
        {userType === 'landlord' && (
          <View style={styles.row}>
            <Text style={styles.label}>Tenant:</Text>
            <Text style={styles.value}>{lease.tenant?.full_name || 'N/A'}</Text>
          </View>
        )}
      </View>

      {lease.status === 'pending_signature' && (
        <View style={styles.signatureStatus}>
          <Text style={styles.signatureText}>
            {lease.signed_by_tenant ? '✓' : '○'} Tenant Signed
          </Text>
          <Text style={styles.signatureText}>
            {lease.signed_by_landlord ? '✓' : '○'} Landlord Signed
          </Text>
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
    alignItems: 'center',
    marginBottom: 12,
  },
  address: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  details: {
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 14,
    color: '#6b7280',
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
  },
  signatureStatus: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  signatureText: {
    fontSize: 12,
    color: '#6b7280',
  },
});
