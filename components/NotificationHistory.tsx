import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { supabase } from '../app/lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export default function NotificationHistory() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, [filter]);

  const loadNotifications = async () => {
    if (!user) return;
    
    let query = supabase
      .from('notification_log')
      .select('*')
      .eq('user_id', user.id)
      .order('sent_at', { ascending: false })
      .limit(50);

    if (filter !== 'all') {
      query = query.eq('notification_type', filter);
    }

    const { data } = await query;
    setNotifications(data || []);
    setLoading(false);
  };

  const markAsOpened = async (id: string) => {
    await supabase
      .from('notification_log')
      .update({ opened: true, opened_at: new Date().toISOString() })
      .eq('id', id);
    loadNotifications();
  };

  const renderNotification = ({ item }: any) => (
    <TouchableOpacity 
      style={[styles.card, !item.opened && styles.unread]}
      onPress={() => markAsOpened(item.id)}
    >
      <View style={styles.header}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.time}>{new Date(item.sent_at).toLocaleDateString()}</Text>
      </View>
      <Text style={styles.body}>{item.body}</Text>
      <View style={styles.footer}>
        <Text style={styles.type}>{item.notification_type.replace(/_/g, ' ')}</Text>
        {item.delivered && <Text style={styles.delivered}>✓ Delivered</Text>}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.filters}>
        {['all', 'new_messages', 'application_status_updates', 'favorite_price_changes'].map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.filterBtn, filter === f && styles.activeFilter]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, filter === f && styles.activeFilterText]}>
              {f.replace(/_/g, ' ')}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.empty}>No notifications yet</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  filters: { flexDirection: 'row', padding: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e0e0e0' },
  filterBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, marginRight: 8, backgroundColor: '#f0f0f0' },
  activeFilter: { backgroundColor: '#007AFF' },
  filterText: { fontSize: 12, color: '#666' },
  activeFilterText: { color: '#fff' },
  list: { padding: 12 },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 8, marginBottom: 12 },
  unread: { borderLeftWidth: 4, borderLeftColor: '#007AFF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  title: { fontSize: 16, fontWeight: '600', flex: 1 },
  time: { fontSize: 12, color: '#999' },
  body: { fontSize: 14, color: '#333', marginBottom: 8 },
  footer: { flexDirection: 'row', justifyContent: 'space-between' },
  type: { fontSize: 12, color: '#666', textTransform: 'capitalize' },
  delivered: { fontSize: 12, color: '#4CAF50' },
  empty: { textAlign: 'center', marginTop: 40, fontSize: 16, color: '#999' },
});
