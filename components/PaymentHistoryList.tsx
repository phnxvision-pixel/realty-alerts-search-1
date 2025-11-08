import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Payment {
  id: string;
  amount: number;
  currency: string;
  payment_type: string;
  status: string;
  description: string;
  created_at: string;
}

interface Props {
  payments: Payment[];
  onViewInvoice?: (paymentId: string) => void;
}

export default function PaymentHistoryList({ payments, onViewInvoice }: Props) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#34C759';
      case 'pending': return '#FF9500';
      case 'failed': return '#FF3B30';
      case 'refunded': return '#8E8E93';
      default: return '#666';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'subscription': return 'repeat';
      case 'promotion': return 'megaphone';
      case 'featured_placement': return 'star';
      default: return 'card';
    }
  };

  const renderItem = ({ item }: { item: Payment }) => (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        <Ionicons name={getTypeIcon(item.payment_type)} size={24} color="#007AFF" />
      </View>
      
      <View style={styles.details}>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.date}>
          {new Date(item.created_at).toLocaleDateString()}
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status.toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.right}>
        <Text style={styles.amount}>
          ${item.amount.toFixed(2)}
        </Text>
        {onViewInvoice && item.status === 'completed' && (
          <TouchableOpacity onPress={() => onViewInvoice(item.id)}>
            <Text style={styles.invoiceLink}>Invoice</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <FlatList
      data={payments}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
      ListEmptyComponent={
        <Text style={styles.empty}>No payment history yet</Text>
      }
    />
  );
}

const styles = StyleSheet.create({
  list: { padding: 16 },
  card: { flexDirection: 'row', backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12, alignItems: 'center' },
  iconContainer: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#007AFF20', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  details: { flex: 1 },
  description: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  date: { fontSize: 14, color: '#666', marginBottom: 8 },
  statusBadge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  statusText: { fontSize: 12, fontWeight: '600' },
  right: { alignItems: 'flex-end' },
  amount: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  invoiceLink: { fontSize: 14, color: '#007AFF' },
  empty: { textAlign: 'center', color: '#666', marginTop: 40, fontSize: 16 }
});
