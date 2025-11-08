import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface RentPaymentCardProps {
  payment: any;
  onPay?: () => void;
}

export default function RentPaymentCard({ payment, onPay }: RentPaymentCardProps) {
  const getStatusColor = () => {
    switch (payment.status) {
      case 'paid': return '#10b981';
      case 'late': return '#ef4444';
      case 'pending': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const isOverdue = payment.status === 'pending' && new Date(payment.due_date) < new Date();

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.amount}>${payment.amount}</Text>
          <Text style={styles.dueDate}>
            Due: {new Date(payment.due_date).toLocaleDateString()}
          </Text>
        </View>
        <View style={[styles.badge, { backgroundColor: getStatusColor() }]}>
          <Text style={styles.badgeText}>{payment.status}</Text>
        </View>
      </View>

      {payment.status === 'paid' && payment.paid_date && (
        <Text style={styles.paidDate}>
          Paid on {new Date(payment.paid_date).toLocaleDateString()}
        </Text>
      )}

      {isOverdue && (
        <Text style={styles.overdueText}>Payment is overdue</Text>
      )}

      {payment.late_fee > 0 && (
        <Text style={styles.lateFee}>Late Fee: ${payment.late_fee}</Text>
      )}

      {payment.status === 'pending' && onPay && (
        <TouchableOpacity style={styles.payButton} onPress={onPay}>
          <Text style={styles.payButtonText}>Pay Now</Text>
        </TouchableOpacity>
      )}
    </View>
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
    marginBottom: 8,
  },
  amount: {
    fontSize: 24,
    fontWeight: '700',
  },
  dueDate: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
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
  paidDate: {
    fontSize: 14,
    color: '#10b981',
    marginTop: 4,
  },
  overdueText: {
    fontSize: 14,
    color: '#ef4444',
    fontWeight: '600',
    marginTop: 4,
  },
  lateFee: {
    fontSize: 14,
    color: '#ef4444',
    marginTop: 4,
  },
  payButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 12,
    alignItems: 'center',
  },
  payButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
