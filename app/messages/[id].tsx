import React, { useEffect, useState, useRef } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Image, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '@/app/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import MessageReactions from '@/components/MessageReactions';
import ImagePickerButton from '@/components/ImagePickerButton';
import ImageViewer from '@/components/ImageViewer';
import TemplateQuickInsert from '@/components/TemplateQuickInsert';
import * as FileSystem from 'expo-file-system';
import { updateBadgeCount } from '@/app/lib/notifications';


export default function ConversationScreen() {
  const { id } = useLocalSearchParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [conversation, setConversation] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const [otherUserOnline, setOtherUserOnline] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [landlordId, setLandlordId] = useState<string | null>(null);


  const { user } = useAuth();
  const router = useRouter();
  const typingTimeoutRef = useRef(null);
  const flatListRef = useRef(null);


  useEffect(() => {
    loadConversation();
    loadMessages();
    markMessagesAsRead();
    updatePresence(true);
    const msgSub = subscribeToMessages();
    const typingSub = subscribeToTyping();
    const presenceSub = subscribeToPresence();
    
    return () => {
      msgSub?.unsubscribe();
      typingSub?.unsubscribe();
      presenceSub?.unsubscribe();
      updatePresence(false);
    };
  }, [id]);

  const loadConversation = async () => {
    const { data } = await supabase
      .from('conversations')
      .select('*, apartments(title), users!conversations_tenant_id_fkey(full_name), users!conversations_landlord_id_fkey(full_name)')
      .eq('id', id)
      .single();
    setConversation(data);
    
    // Check if current user is landlord and get landlord_id
    if (data && user?.id) {
      const { data: landlordData } = await supabase
        .from('landlords')
        .select('id')
        .eq('user_id', user.id)
        .single();
      
      if (landlordData) {
        setLandlordId(landlordData.id);
      }
    }
  };


  const loadMessages = async () => {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', id)
      .order('created_at', { ascending: true });
    setMessages(data || []);
  };

  const markMessagesAsRead = async () => {
    await supabase
      .from('messages')
      .update({ read_at: new Date().toISOString() })
      .eq('conversation_id', id)
      .neq('sender_id', user?.id)
      .is('read_at', null);
    
    // Update badge count after marking as read
    if (user?.id) {
      updateBadgeCount(user.id);
    }
  };


  const subscribeToMessages = () => {
    return supabase
      .channel(`messages:${id}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages', 
        filter: `conversation_id=eq.${id}` 
      }, payload => {
        setMessages(prev => [...prev, payload.new]);
        if (payload.new.sender_id !== user?.id) {
          markMessagesAsRead();
        }
      })
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'messages', 
        filter: `conversation_id=eq.${id}` 
      }, payload => {
        setMessages(prev => prev.map(m => m.id === payload.new.id ? payload.new : m));
      })
      .subscribe();
  };

  const subscribeToTyping = () => {
    return supabase
      .channel(`typing:${id}`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'typing_indicators', 
        filter: `conversation_id=eq.${id}` 
      }, payload => {
        if (payload.new?.user_id !== user?.id) {
          setOtherUserTyping(payload.new?.is_typing || false);
        }
      })
      .subscribe();
  };

  const subscribeToPresence = () => {
    const otherUserId = conversation?.tenant_id === user?.id 
      ? conversation?.landlord_id 
      : conversation?.tenant_id;
    
    return supabase
      .channel(`presence:${otherUserId}`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'user_presence', 
        filter: `user_id=eq.${otherUserId}` 
      }, payload => {
        setOtherUserOnline(payload.new?.is_online || false);
      })
      .subscribe();
  };

  const updatePresence = async (isOnline) => {
    await supabase
      .from('user_presence')
      .upsert({ 
        user_id: user?.id, 
        is_online: isOnline,
        last_seen_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
  };

  const updateTypingStatus = async (typing) => {
    await supabase
      .from('typing_indicators')
      .upsert({ 
        conversation_id: id, 
        user_id: user?.id, 
        is_typing: typing,
        updated_at: new Date().toISOString()
      });
  };

  const handleTextChange = (text) => {
    setNewMessage(text);
    
    if (!isTyping && text.length > 0) {
      setIsTyping(true);
      updateTypingStatus(true);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      updateTypingStatus(false);
    }, 2000);
  };

  const uploadImages = async (imageUris: string[]) => {
    const uploadedUrls: string[] = [];
    
    for (const uri of imageUris) {
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;
      const filePath = `${id}/${fileName}`;
      
      const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
      const { data, error } = await supabase.storage
        .from('chat-images')
        .upload(filePath, decode(base64), { contentType: 'image/jpeg' });
      
      if (!error && data) {
        const { data: { publicUrl } } = supabase.storage.from('chat-images').getPublicUrl(filePath);
        uploadedUrls.push(publicUrl);
      }
    }
    
    return uploadedUrls;
  };

  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  const handleImagesSelected = async (imageUris: string[]) => {
    setUploading(true);
    const imageUrls = await uploadImages(imageUris);
    
    for (const imageUrl of imageUrls) {
      const messageData = {
        conversation_id: id,
        sender_id: user?.id,
        sender_type: conversation?.tenant_id === user?.id ? 'tenant' : 'landlord',
        content: 'Image',
        message_type: 'image',
        file_url: imageUrl
      };

      await supabase.from('messages').insert(messageData);
    }
    
    setUploading(false);
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const messageData = {
      conversation_id: id,
      sender_id: user?.id,
      sender_type: conversation?.tenant_id === user?.id ? 'tenant' : 'landlord',
      content: newMessage.trim(),
      message_type: 'text'
    };

    const { data, error } = await supabase.from('messages').insert(messageData).select().single();
    
    if (!error && data) {
      await supabase.functions.invoke('send-message-notification', {
        body: { 
          messageId: data.id, 
          conversationId: id, 
          senderId: user?.id, 
          content: messageData.content 
        }
      });
    }

    setNewMessage('');
    updateTypingStatus(false);
    setIsTyping(false);
  };

  const renderMessage = ({ item }) => {
    const isMine = item.sender_id === user?.id;
    const isRead = item.read_at !== null;

    return (
      <View style={{ marginBottom: 12 }}>
        <View style={[styles.messageBubble, isMine ? styles.myMessage : styles.theirMessage]}>
          {item.message_type === 'image' && item.file_url ? (
            <TouchableOpacity onPress={() => setSelectedImage(item.file_url)}>
              <Image source={{ uri: item.file_url }} style={styles.messageImage} />
            </TouchableOpacity>
          ) : (
            <Text style={[styles.messageText, isMine && styles.myMessageText]}>{item.content}</Text>
          )}
          <View style={styles.messageFooter}>
            <Text style={[styles.messageTime, isMine && styles.myMessageTime]}>
              {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
            {isMine && (
              <Ionicons 
                name={isRead ? 'checkmark-done' : 'checkmark'} 
                size={16} 
                color={isRead ? '#4CAF50' : '#fff'} 
                style={styles.readReceipt}
              />
            )}
          </View>
        </View>
        <MessageReactions messageId={item.id} isMine={isMine} />
      </View>
    );
  };




  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>{conversation?.apartments?.title}</Text>
          {otherUserOnline && <Text style={styles.onlineStatus}>Online</Text>}
        </View>
      </View>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
      />
      {otherUserTyping && (
        <View style={styles.typingIndicator}>
          <Text style={styles.typingText}>Typing...</Text>
        </View>
      )}
      {uploading && (
        <View style={styles.uploadingIndicator}>
          <ActivityIndicator size="small" color="#007AFF" />
          <Text style={styles.uploadingText}>Uploading images...</Text>
        </View>
      )}
      <View style={styles.inputContainer}>
        {landlordId && (
          <TouchableOpacity onPress={() => setShowTemplates(true)} style={styles.templateButton}>
            <Ionicons name="document-text-outline" size={24} color="#007AFF" />
          </TouchableOpacity>
        )}
        <ImagePickerButton onImagesSelected={handleImagesSelected} />
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={handleTextChange}
          placeholder="Type a message..."
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Ionicons name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
      
      {landlordId && (
        <TemplateQuickInsert
          landlordId={landlordId}
          visible={showTemplates}
          onClose={() => setShowTemplates(false)}
          onSelectTemplate={(content) => setNewMessage(content)}
          placeholders={{
            tenant_name: conversation?.users?.full_name || 'Tenant',
            property_address: conversation?.apartments?.title || 'Property',
            viewing_date: new Date().toLocaleDateString()
          }}
        />
      )}
      

      <ImageViewer 
        visible={selectedImage !== null} 
        imageUrl={selectedImage || ''} 
        onClose={() => setSelectedImage(null)} 
      />
    </KeyboardAvoidingView>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#eee' },
  backButton: { marginRight: 12 },
  headerInfo: { flex: 1 },
  headerTitle: { fontSize: 18, fontWeight: '600' },
  onlineStatus: { fontSize: 12, color: '#4CAF50', marginTop: 2 },
  messagesList: { padding: 16 },
  messageBubble: { maxWidth: '80%', padding: 12, borderRadius: 16, marginBottom: 8 },
  myMessage: { alignSelf: 'flex-end', backgroundColor: '#007AFF' },
  theirMessage: { alignSelf: 'flex-start', backgroundColor: '#f0f0f0' },
  messageText: { fontSize: 16, color: '#000' },
  myMessageText: { color: '#fff' },
  messageImage: { width: 200, height: 200, borderRadius: 12 },
  messageFooter: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  messageTime: { fontSize: 11, color: '#666' },
  myMessageTime: { color: '#fff' },
  readReceipt: { marginLeft: 4 },
  typingIndicator: { padding: 12, paddingLeft: 16 },
  typingText: { fontSize: 14, color: '#999', fontStyle: 'italic' },
  uploadingIndicator: { flexDirection: 'row', alignItems: 'center', padding: 12, paddingLeft: 16 },
  uploadingText: { fontSize: 14, color: '#007AFF', marginLeft: 8 },
  inputContainer: { flexDirection: 'row', padding: 12, borderTopWidth: 1, borderTopColor: '#eee', alignItems: 'center' },
  templateButton: { marginRight: 8 },
  input: { flex: 1, backgroundColor: '#f5f5f5', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, marginRight: 8, maxHeight: 100 },
  sendButton: { backgroundColor: '#007AFF', borderRadius: 20, width: 40, height: 40, justifyContent: 'center', alignItems: 'center' }
});


