import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import { supabase } from '@/app/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

const COMMON_EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '🎉', '🔥', '👏'];

export default function MessageReactions({ messageId, isMine }) {
  const [reactions, setReactions] = useState([]);
  const [showPicker, setShowPicker] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    loadReactions();
    const sub = subscribeToReactions();
    return () => sub?.unsubscribe();
  }, [messageId]);

  const loadReactions = async () => {
    const { data } = await supabase
      .from('message_reactions')
      .select('*, users(full_name)')
      .eq('message_id', messageId);
    setReactions(data || []);
  };

  const subscribeToReactions = () => {
    return supabase
      .channel(`reactions:${messageId}`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'message_reactions', 
        filter: `message_id=eq.${messageId}` 
      }, () => loadReactions())
      .subscribe();
  };

  const toggleReaction = async (emoji) => {
    const existing = reactions.find(r => r.user_id === user?.id && r.emoji === emoji);
    
    if (existing) {
      await supabase.from('message_reactions').delete().eq('id', existing.id);
    } else {
      await supabase.from('message_reactions').insert({
        message_id: messageId,
        user_id: user?.id,
        emoji
      });
    }
    setShowPicker(false);
  };

  const groupedReactions = reactions.reduce((acc, r) => {
    if (!acc[r.emoji]) acc[r.emoji] = [];
    acc[r.emoji].push(r);
    return acc;
  }, {});

  return (
    <View style={styles.container}>
      {Object.keys(groupedReactions).length > 0 && (
        <TouchableOpacity 
          style={[styles.reactionsBar, isMine && styles.reactionsBarMine]} 
          onPress={() => setShowDetails(true)}
        >
          {Object.entries(groupedReactions).map(([emoji, reacts]) => (
            <View key={emoji} style={styles.reactionBubble}>
              <Text style={styles.emoji}>{emoji}</Text>
              <Text style={styles.count}>{reacts.length}</Text>
            </View>
          ))}
        </TouchableOpacity>
      )}
      
      <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.addButton}>
        <Text style={styles.addEmoji}>+</Text>
      </TouchableOpacity>

      <Modal visible={showPicker} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setShowPicker(false)}>
          <View style={styles.pickerContainer}>
            {COMMON_EMOJIS.map(emoji => (
              <TouchableOpacity key={emoji} onPress={() => toggleReaction(emoji)} style={styles.emojiButton}>
                <Text style={styles.pickerEmoji}>{emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal visible={showDetails} transparent animationType="slide">
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setShowDetails(false)}>
          <View style={styles.detailsContainer}>
            <Text style={styles.detailsTitle}>Reactions</Text>
            <ScrollView>
              {Object.entries(groupedReactions).map(([emoji, reacts]) => (
                <View key={emoji} style={styles.detailGroup}>
                  <Text style={styles.detailEmoji}>{emoji}</Text>
                  {reacts.map(r => (
                    <Text key={r.id} style={styles.userName}>{r.users?.full_name}</Text>
                  ))}
                </View>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  reactionsBar: { flexDirection: 'row', flexWrap: 'wrap', marginRight: 8 },
  reactionsBarMine: { justifyContent: 'flex-end' },
  reactionBubble: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0f0f0', borderRadius: 12, paddingHorizontal: 8, paddingVertical: 4, marginRight: 4, marginBottom: 4 },
  emoji: { fontSize: 14 },
  count: { fontSize: 12, marginLeft: 4, color: '#666' },
  addButton: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' },
  addEmoji: { fontSize: 16, color: '#666' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  pickerContainer: { backgroundColor: '#fff', borderRadius: 16, padding: 16, flexDirection: 'row', flexWrap: 'wrap', width: 280 },
  emojiButton: { width: 50, height: 50, justifyContent: 'center', alignItems: 'center' },
  pickerEmoji: { fontSize: 28 },
  detailsContainer: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '50%', width: '100%', position: 'absolute', bottom: 0 },
  detailsTitle: { fontSize: 18, fontWeight: '600', marginBottom: 16 },
  detailGroup: { marginBottom: 16 },
  detailEmoji: { fontSize: 24, marginBottom: 8 },
  userName: { fontSize: 14, color: '#666', marginLeft: 32, marginBottom: 4 }
});
