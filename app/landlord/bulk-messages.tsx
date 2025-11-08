import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal, Alert } from 'react-native';
import { supabase } from '@/app/lib/supabase';
import { useLandlord } from '@/contexts/LandlordContext';
import BulkMessageComposer from '@/components/BulkMessageComposer';

interface BulkMessage {
  id: string;
  subject: string;
  message: string;
  total_recipients: number;
  sent_count: number;
  delivered_count: number;
  failed_count: number;
  status: string;
  created_at: string;
  sent_at: string;
}

export default function BulkMessagesScreen() {
  const { landlord } = useLandlord();
  const [messages, setMessages] = useState<BulkMessage[]>([]);
  const [showComposer, setShowComposer] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (landlord?.id) {
      loadBulkMessages();
    }
  }, [landlord]);

  const loadBulkMessages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('bulk_messages')
      .select('*')
      .eq('landlord_id', landlord?.id)
      .order('created_at', { ascending: false });

    if (data) setMessages(data);
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return '#4CAF50';
      case 'sending': return '#FF9800';
      case 'failed': return '#F44336';
      case 'scheduled': return '#2196F3';
      default: return '#9E9E9E';
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Bulk Messages</Text>
        <TouchableOpacity style={styles.newBtn} onPress={() => setShowComposer(true)}>
          <Text style={styles.newBtnText}>+ New Message</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.messageList}>
        {loading ? (
          <Text style={styles.emptyText}>Loading...</Text>
        ) : messages.length === 0 ? (
          <Text style={styles.emptyText}>No bulk messages sent yet</Text>
        ) : (
          messages.map(msg => (
            <View key={msg.id} style={styles.messageCard}>
              <View style={styles.messageHeader}>
                <Text style={styles.messageSubject}>{msg.subject}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(msg.status) }]}>
                  <Text style={styles.statusText}>{msg.status}</Text>
                </View>
              </View>
              
              <Text style={styles.messagePreview} numberOfLines={2}>
                {msg.message}
              </Text>

              <View style={styles.messageStats}>
                <View style={styles.stat}>
                  <Text style={styles.statValue}>{msg.total_recipients}</Text>
                  <Text style={styles.statLabel}>Recipients</Text>
                </View>
                <View style={styles.stat}>
                  <Text style={styles.statValue}>{msg.sent_count}</Text>
                  <Text style={styles.statLabel}>Sent</Text>
                </View>
                <View style={styles.stat}>
                  <Text style={styles.statValue}>{msg.delivered_count}</Text>
                  <Text style={styles.statLabel}>Delivered</Text>
                </View>
                <View style={styles.stat}>
                  <Text style={styles.statValue}>{msg.failed_count}</Text>
                  <Text style={styles.statLabel}>Failed</Text>
                </View>
              </View>

              <Text style={styles.messageDate}>
                {msg.sent_at ? `Sent ${formatDate(msg.sent_at)}` : `Created ${formatDate(msg.created_at)}`}
              </Text>
            </View>
          ))
        )}
      </ScrollView>

      <Modal visible={showComposer} animationType="slide" presentationStyle="pageSheet">
        <BulkMessageComposer
          landlordId={landlord?.id || ''}
          onClose={() => setShowComposer(false)}
          onSent={loadBulkMessages}
        />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold' },
  newBtn: { backgroundColor: '#007AFF', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  newBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  messageList: { flex: 1, padding: 16 },
  emptyText: { textAlign: 'center', color: '#999', fontSize: 16, marginTop: 40 },
  messageCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  messageHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  messageSubject: { fontSize: 18, fontWeight: '600', flex: 1 },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  statusText: { color: '#fff', fontSize: 12, fontWeight: '600', textTransform: 'uppercase' },
  messagePreview: { fontSize: 14, color: '#666', marginBottom: 12 },
  messageStats: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 12, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#eee', marginBottom: 8 },
  stat: { alignItems: 'center' },
  statValue: { fontSize: 20, fontWeight: 'bold', color: '#007AFF' },
  statLabel: { fontSize: 12, color: '#666', marginTop: 4 },
  messageDate: { fontSize: 12, color: '#999', textAlign: 'right' },
});
