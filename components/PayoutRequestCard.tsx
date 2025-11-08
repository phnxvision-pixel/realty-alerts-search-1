import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface PayoutRequestCardProps {
  request: any;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  isAdmin?: boolean;
}

export default function PayoutRequestCard({ request, onApprove, onReject, isAdmin }: PayoutRequestCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'processing': return '#3b82f6';
      case 'rejected': return '#ef4444';
      case 'failed': return '#dc2626';
      default: return '#6b7280';
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.amount}>${parseFloat(request.amount).toFixed(2)}</Text>
        <View style={[styles.badge, { backgroundColor: getStatusColor(request.status) }]}>
          <Text style={styles.badgeText}>{request.status.toUpperCase()}</Text>
        </View>
      </View>
      
      <Text style={styles.date}>
        Requested: {new Date(request.requested_at).toLocaleDateString()}
      </Text>
      
      {request.processed_at && (
        <Text style={styles.date}>
          Processed: {new Date(request.processed_at).toLocaleDateString()}
        </Text>
      )}
      
      {request.stripe_payout_id && (
        <Text style={styles.id}>Transfer ID: {request.stripe_payout_id}</Text>
      )}
      
      {request.rejection_reason && (
        <Text style={styles.reason}>Reason: {request.rejection_reason}</Text>
      )}

      {isAdmin && request.status === 'pending' && (
        <View style={styles.actions}>
          <TouchableOpacity 
            style={[styles.button, styles.approveBtn]} 
            onPress={() => onApprove?.(request.id)}
          >
            <Text style={styles.buttonText}>Approve</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, styles.rejectBtn]} 
            onPress={() => onReject?.(request.id)}
          >
            <Text style={styles.buttonText}>Reject</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  amount: { fontSize: 24, fontWeight: 'bold', color: '#111' },
  badge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  date: { fontSize: 14, color: '#666', marginBottom: 4 },
  id: { fontSize: 12, color: '#888', marginTop: 4 },
  reason: { fontSize: 14, color: '#ef4444', marginTop: 8, fontStyle: 'italic' },
  actions: { flexDirection: 'row', gap: 8, marginTop: 12 },
  button: { flex: 1, padding: 12, borderRadius: 8, alignItems: 'center' },
  approveBtn: { backgroundColor: '#10b981' },
  rejectBtn: { backgroundColor: '#ef4444' },
  buttonText: { color: '#fff', fontWeight: '600' }
});
