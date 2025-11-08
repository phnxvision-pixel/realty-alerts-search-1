import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/app/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';

export default function MessagesScreen() {
  const [conversations, setConversations] = useState([]);
  const [presenceData, setPresenceData] = useState({});
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    loadConversations();
    subscribeToPresence();
    updateOwnPresence(true);

    return () => {
      updateOwnPresence(false);
    };
  }, []);

  const updateOwnPresence = async (isOnline) => {
    await supabase
      .from('user_presence')
      .upsert({ 
        user_id: user?.id, 
        is_online: isOnline,
        last_seen_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
  };

  const loadConversations = async () => {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          apartments(title, address),
          messages(id, content, created_at, read_at, sender_id)
        `)
        .eq('tenant_id', user?.id)
        .order('last_message_at', { ascending: false });

      if (error) throw error;

      // Get presence for all users in conversations
      const userIds = data?.map(c => c.landlord_id).filter(Boolean) || [];
      if (userIds.length > 0) {
        const { data: presence } = await supabase
          .from('user_presence')
          .select('user_id, is_online, last_seen_at')
          .in('user_id', userIds);

        const presenceMap = {};
        presence?.forEach(p => {
          presenceMap[p.user_id] = p;
        });
        setPresenceData(presenceMap);
      }

      setConversations(data || []);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const subscribeToPresence = () => {
    return supabase
      .channel('all-presence')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'user_presence'
      }, payload => {
        setPresenceData(prev => ({
          ...prev,
          [payload.new.user_id]: payload.new
        }));
      })
      .subscribe();
  };

  const getUnreadCount = (messages) => {
    return messages?.filter(m => !m.read_at && m.sender_id !== user?.id).length || 0;
  };

  const formatLastSeen = (lastSeenAt) => {
    const now = new Date();
    const lastSeen = new Date(lastSeenAt);
    const diffMs = now - lastSeen;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const renderConversation = ({ item }) => {
    const lastMessage = item.messages?.[item.messages.length - 1];
    const unreadCount = getUnreadCount(item.messages);
    const otherUserId = item.landlord_id;
    const presence = presenceData[otherUserId];
    const isOnline = presence?.is_online;

    return (
      <TouchableOpacity
        style={styles.conversationCard}
        onPress={() => router.push(`/messages/${item.id}`)}
      >
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={24} color="#666" />
          </View>
          {isOnline && <View style={styles.onlineDot} />}
        </View>
        
        <View style={styles.conversationContent}>
          <View style={styles.headerRow}>
            <Text style={styles.listingTitle} numberOfLines={1}>
              {item.apartments?.title}
            </Text>
            {lastMessage && (
              <Text style={styles.timestamp}>
                {new Date(lastMessage.created_at).toLocaleDateString([], { 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </Text>
            )}
          </View>
          
          <Text style={styles.address} numberOfLines={1}>
            {item.apartments?.address}
          </Text>
          
          {lastMessage && (
            <View style={styles.messageRow}>
              <Text 
                style={[
                  styles.lastMessage, 
                  unreadCount > 0 && styles.unreadMessage
                ]} 
                numberOfLines={1}
              >
                {lastMessage.content}
              </Text>
            </View>
          )}

          {!isOnline && presence?.last_seen_at && (
            <Text style={styles.lastSeen}>
              Last seen {formatLastSeen(presence.last_seen_at)}
            </Text>
          )}
        </View>
        
        {unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{unreadCount}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Messages</Text>
      </View>
      {conversations.length === 0 && !loading ? (
        <View style={styles.emptyState}>
          <Ionicons name="chatbubbles-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>No conversations yet</Text>
          <Text style={styles.emptySubtext}>
            Start a conversation by contacting a landlord
          </Text>
        </View>
      ) : (
        <FlatList
          data={conversations}
          renderItem={renderConversation}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  titleContainer: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#eee' },
  title: { fontSize: 28, fontWeight: 'bold' },
  list: { padding: 16 },
  conversationCard: { 
    backgroundColor: '#fff', 
    padding: 16, 
    borderRadius: 12, 
    marginBottom: 12, 
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2
  },
  avatarContainer: { marginRight: 12, position: 'relative' },
  avatar: { 
    width: 50, 
    height: 50, 
    borderRadius: 25, 
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center'
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#fff'
  },
  conversationContent: { flex: 1 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  listingTitle: { fontSize: 16, fontWeight: '600', flex: 1, marginRight: 8 },
  timestamp: { fontSize: 12, color: '#999' },
  address: { fontSize: 13, color: '#666', marginBottom: 6 },
  messageRow: { flexDirection: 'row', alignItems: 'center' },
  lastMessage: { fontSize: 14, color: '#999', flex: 1 },
  unreadMessage: { color: '#000', fontWeight: '500' },
  lastSeen: { fontSize: 11, color: '#999', marginTop: 4 },
  unreadBadge: { 
    backgroundColor: '#007AFF', 
    borderRadius: 12, 
    minWidth: 24, 
    height: 24, 
    justifyContent: 'center', 
    alignItems: 'center',
    paddingHorizontal: 6
  },
  unreadText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  emptyState: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 32 
  },
  emptyText: { 
    fontSize: 18, 
    fontWeight: '600', 
    color: '#666', 
    marginTop: 16 
  },
  emptySubtext: { 
    fontSize: 14, 
    color: '#999', 
    marginTop: 8, 
    textAlign: 'center' 
  }
});
