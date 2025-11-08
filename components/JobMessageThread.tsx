import React, { useState, useEffect, useRef } from 'react';
import { View, FlatList, Text, TextInput, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/app/lib/supabase';
import VoiceRecorder from './VoiceRecorder';
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';

interface Message {
  id: string;
  content: string;
  sender_id: string;
  image_url?: string;
  voice_message_url?: string;
  voice_duration?: number;
  read_at?: string;
  created_at: string;
  sender?: { full_name: string; avatar_url?: string };
}

export default function JobMessageThread({ conversationId, currentUserId, theme }: any) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showVoice, setShowVoice] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    loadMessages();
    markAsRead();
    
    const subscription = supabase
      .channel(`conversation:${conversationId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${conversationId}` }, 
        (payload) => {
          setMessages(prev => [...prev, payload.new as Message]);
          markAsRead();
        }
      )
      .subscribe();

    return () => { subscription.unsubscribe(); };
  }, [conversationId]);

  const loadMessages = async () => {
    const { data } = await supabase
      .from('messages')
      .select('*, sender:users!sender_id(full_name, avatar_url)')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });
    
    if (data) setMessages(data);
  };

  const markAsRead = async () => {
    await supabase.rpc('mark_messages_read', { 
      p_conversation_id: conversationId, 
      p_user_id: currentUserId 
    });
  };

  const sendMessage = async (content?: string, imageUri?: string, voiceUri?: string, voiceDuration?: number) => {
    if (!content && !imageUri && !voiceUri) return;

    setLoading(true);
    let imageUrl = imageUri;
    let voiceUrl = voiceUri;

    if (imageUri) {
      const fileName = `${Date.now()}.jpg`;
      const { data } = await supabase.storage.from('chat-images').upload(fileName, { uri: imageUri } as any);
      if (data) imageUrl = supabase.storage.from('chat-images').getPublicUrl(data.path).data.publicUrl;
    }

    if (voiceUri) {
      const fileName = `${Date.now()}.m4a`;
      const { data } = await supabase.storage.from('voice-messages').upload(fileName, { uri: voiceUri } as any);
      if (data) voiceUrl = supabase.storage.from('voice-messages').getPublicUrl(data.path).data.publicUrl;
    }

    await supabase.functions.invoke('send-job-message', {
      body: { conversationId, senderId: currentUserId, content, imageUrl, voiceMessageUrl: voiceUrl, voiceDuration }
    });

    setNewMessage('');
    setLoading(false);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8 });
    if (!result.canceled) sendMessage('', result.assets[0].uri);
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isMine = item.sender_id === currentUserId;
    return (
      <View style={[styles.messageBubble, isMine ? styles.myMessage : styles.theirMessage, { backgroundColor: isMine ? theme.primary : theme.card }]}>
        {!isMine && <Text style={styles.senderName}>{item.sender?.full_name}</Text>}
        {item.content ? <Text style={[styles.messageText, { color: isMine ? '#fff' : theme.text }]}>{item.content}</Text> : null}
        {item.image_url && <Image source={{ uri: item.image_url }} style={styles.messageImage} />}
        {item.voice_message_url && <VoicePlayer uri={item.voice_message_url} duration={item.voice_duration} theme={theme} />}
        <Text style={[styles.timestamp, { color: isMine ? '#fff9' : theme.textSecondary }]}>
          {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          {isMine && item.read_at && ' ✓✓'}
        </Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList ref={flatListRef} data={messages} renderItem={renderMessage} keyExtractor={item => item.id} 
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()} />
      <View style={[styles.inputContainer, { backgroundColor: theme.card }]}>
        <TouchableOpacity onPress={pickImage}><Ionicons name="image" size={24} color={theme.primary} /></TouchableOpacity>
        <TouchableOpacity onPress={() => setShowVoice(!showVoice)}><Ionicons name="mic" size={24} color={theme.primary} /></TouchableOpacity>
        {showVoice ? (
          <VoiceRecorder onRecordingComplete={(uri, duration) => { sendMessage('', undefined, uri, duration); setShowVoice(false); }} theme={theme} />
        ) : (
          <>
            <TextInput style={[styles.input, { color: theme.text }]} value={newMessage} onChangeText={setNewMessage} placeholder="Type a message..." placeholderTextColor={theme.textSecondary} />
            <TouchableOpacity onPress={() => sendMessage(newMessage)} disabled={loading}>
              {loading ? <ActivityIndicator /> : <Ionicons name="send" size={24} color={theme.primary} />}
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

function VoicePlayer({ uri, duration, theme }: any) {
  const [sound, setSound] = useState<Audio.Sound>();
  const [isPlaying, setIsPlaying] = useState(false);

  const playSound = async () => {
    if (isPlaying) {
      await sound?.pauseAsync();
      setIsPlaying(false);
    } else {
      const { sound: newSound } = await Audio.Sound.createAsync({ uri });
      setSound(newSound);
      await newSound.playAsync();
      setIsPlaying(true);
      newSound.setOnPlaybackStatusUpdate((status: any) => {
        if (status.didJustFinish) setIsPlaying(false);
      });
    }
  };

  return (
    <TouchableOpacity onPress={playSound} style={styles.voicePlayer}>
      <Ionicons name={isPlaying ? "pause" : "play"} size={20} color={theme.primary} />
      <Text style={{ color: theme.text }}>{duration}s</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  messageBubble: { maxWidth: '75%', padding: 12, borderRadius: 16, marginVertical: 4, marginHorizontal: 12 },
  myMessage: { alignSelf: 'flex-end' },
  theirMessage: { alignSelf: 'flex-start' },
  senderName: { fontSize: 12, fontWeight: '600', marginBottom: 4, opacity: 0.7 },
  messageText: { fontSize: 15 },
  messageImage: { width: 200, height: 200, borderRadius: 8, marginTop: 8 },
  timestamp: { fontSize: 11, marginTop: 4 },
  inputContainer: { flexDirection: 'row', padding: 12, gap: 8, alignItems: 'center' },
  input: { flex: 1, padding: 8, borderRadius: 20, backgroundColor: '#f0f0f0' },
  voicePlayer: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 8 }
});
