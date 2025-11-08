import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../lib/supabase';
import { useTheme } from '../../contexts/ThemeContext';

export default function VendorMessages() {
  const router = useRouter();
  const { theme } = useTheme();
  const [conversations, setConversations] = useState<any[]>([]);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    if (userId) loadConversations();
  }, [userId]);

  const loadUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) setUserId(user.id);
  };

  const loadConversations = async () => {
    const { data } = await supabase
      .from('conversation_participants')
      .select('conversation_id, conversations!inner(*, maintenance_requests(category, description))')
      .eq('user_id', userId)
      .eq('participant_type', 'vendor');
    
    if (data) {
      const convos = data.map(d => d.conversations).filter(Boolean);
      setConversations(convos);
    }
  };

  const renderConversation = ({ item }: any) => (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor: theme.card }]}
      onPress={() => router.push(`/vendor/job/${item.job_id}`)}
    >
      <Text style={[styles.title, { color: theme.text }]}>
        {item.maintenance_requests?.category || 'Job Conversation'}
      </Text>
      <Text style={[styles.preview, { color: theme.textSecondary }]} numberOfLines={2}>
        {item.last_message || item.maintenance_requests?.description}
      </Text>
      <Text style={[styles.time, { color: theme.textSecondary }]}>
        {new Date(item.updated_at).toLocaleDateString()}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.header, { color: theme.text }]}>Job Messages</Text>
      <FlatList
        data={conversations}
        renderItem={renderConversation}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { fontSize: 28, fontWeight: 'bold', padding: 20, paddingBottom: 12 },
  list: { padding: 20, paddingTop: 0 },
  card: { padding: 16, borderRadius: 12, marginBottom: 12, elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4 },
  title: { fontSize: 18, fontWeight: '600', marginBottom: 6 },
  preview: { fontSize: 14, marginBottom: 8 },
  time: { fontSize: 12 }
});
