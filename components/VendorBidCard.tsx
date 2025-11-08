import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface VendorBidCardProps {
  bid: any;
  onAccept?: () => void;
  onReject?: () => void;
  showActions?: boolean;
}

export default function VendorBidCard({ bid, onAccept, onReject, showActions = true }: VendorBidCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return '#4CAF50';
      case 'rejected': return '#f44336';
      case 'withdrawn': return '#9e9e9e';
      default: return '#FF9800';
    }
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.vendorInfo}>
          <Text style={styles.vendorName}>{bid.vendors?.name}</Text>
          {bid.vendors?.company_name && (
            <Text style={styles.companyName}>{bid.vendors.company_name}</Text>
          )}
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(bid.status) }]}>
          <Text style={styles.statusText}>{getStatusLabel(bid.status)}</Text>
        </View>
      </View>

      <View style={styles.bidAmount}>
        <Text style={styles.amountLabel}>Bid Amount</Text>
        <Text style={styles.amount}>${bid.bid_amount?.toFixed(2)}</Text>
      </View>

      <View style={styles.details}>
        {bid.estimated_hours && (
          <View style={styles.detailRow}>
            <Ionicons name="time-outline" size={16} color="#666" />
            <Text style={styles.detailText}>{bid.estimated_hours} hours</Text>
          </View>
        )}
        {bid.estimated_completion_date && (
          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={16} color="#666" />
            <Text style={styles.detailText}>
              Complete by: {new Date(bid.estimated_completion_date).toLocaleDateString()}
            </Text>
          </View>
        )}
      </View>

      {bid.description && (
        <Text style={styles.description}>{bid.description}</Text>
      )}

      {bid.materials_cost && bid.labor_cost && (
        <View style={styles.breakdown}>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Materials:</Text>
            <Text style={styles.breakdownValue}>${bid.materials_cost.toFixed(2)}</Text>
          </View>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Labor:</Text>
            <Text style={styles.breakdownValue}>${bid.labor_cost.toFixed(2)}</Text>
          </View>
        </View>
      )}

      {showActions && bid.status === 'pending' && (
        <View style={styles.actions}>
          {onReject && (
            <TouchableOpacity style={styles.rejectButton} onPress={onReject}>
              <Text style={styles.rejectButtonText}>Reject</Text>
            </TouchableOpacity>
          )}
          {onAccept && (
            <TouchableOpacity style={styles.acceptButton} onPress={onAccept}>
              <Text style={styles.acceptButtonText}>Accept Bid</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  vendorInfo: { flex: 1 },
  vendorName: { fontSize: 16, fontWeight: '600', marginBottom: 2 },
  companyName: { fontSize: 14, color: '#666' },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  statusText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  bidAmount: { backgroundColor: '#f5f5f5', padding: 12, borderRadius: 8, marginBottom: 12 },
  amountLabel: { fontSize: 12, color: '#666', marginBottom: 4 },
  amount: { fontSize: 24, fontWeight: '700', color: '#007AFF' },
  details: { marginBottom: 12 },
  detailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  detailText: { marginLeft: 8, fontSize: 14, color: '#666' },
  description: { fontSize: 14, color: '#333', marginBottom: 12, lineHeight: 20 },
  breakdown: { backgroundColor: '#f9f9f9', padding: 12, borderRadius: 8, marginBottom: 12 },
  breakdownRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  breakdownLabel: { fontSize: 14, color: '#666' },
  breakdownValue: { fontSize: 14, fontWeight: '600' },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8 },
  rejectButton: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: '#f44336' },
  rejectButtonText: { color: '#f44336', fontWeight: '600' },
  acceptButton: { backgroundColor: '#4CAF50', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  acceptButtonText: { color: '#fff', fontWeight: '600' }
});
