import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';
import * as ImagePicker from 'expo-image-picker';
import JobMessageThread from '../../../components/JobMessageThread';
import { useTheme } from '../../../contexts/ThemeContext';

export default function VendorJobDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { theme } = useTheme();
  const [job, setJob] = useState<any>(null);
  const [notes, setNotes] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string>('');

  useEffect(() => { 
    loadJob(); 
    loadUser();
    loadConversation();
  }, []);

  const loadUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) setCurrentUserId(user.id);
  };

  const loadConversation = async () => {
    const { data } = await supabase
      .from('conversations')
      .select('id')
      .eq('job_id', id)
      .single();
    if (data) setConversationId(data.id);
  };



  const loadJob = async () => {
    const { data } = await supabase.from('maintenance_requests').select('*, apartments(*)').eq('id', id).single();
    setJob(data);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsMultipleSelection: true, quality: 0.8 });
    if (!result.canceled) {
      setPhotos([...photos, ...result.assets.map(a => a.uri)]);
    }
  };

  const updateStatus = async (status: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke('vendor-update-job-status', {
        body: { requestId: id, status, notes, completionPhotos: photos }
      });
      if (error) throw error;
      Alert.alert('Success', 'Job status updated');
      router.back();
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!job) return <View style={[styles.container, { backgroundColor: theme.background }]}><Text style={{ color: theme.text }}>Loading...</Text></View>;

  if (showMessages && conversationId) {
    return (
      <View style={{ flex: 1 }}>
        <View style={[styles.header, { backgroundColor: theme.card }]}>
          <TouchableOpacity onPress={() => setShowMessages(false)}>
            <Text style={{ color: theme.primary, fontSize: 16 }}>← Back to Job</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Job Messages</Text>
        </View>
        <JobMessageThread conversationId={conversationId} currentUserId={currentUserId} theme={theme} />
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.headerRow}>
        <Text style={[styles.title, { color: theme.text }]}>{job.category}</Text>
        {conversationId && (
          <TouchableOpacity onPress={() => setShowMessages(true)} style={styles.messageBtn}>
            <Text style={{ color: theme.primary, fontSize: 16 }}>💬 Messages</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <Text style={[styles.desc, { color: theme.textSecondary }]}>{job.description}</Text>
      <View style={styles.infoRow}><Text style={[styles.label, { color: theme.text }]}>Priority:</Text><Text style={[styles.value, { color: theme.textSecondary }]}>{job.priority}</Text></View>
      <View style={styles.infoRow}><Text style={[styles.label, { color: theme.text }]}>Status:</Text><Text style={[styles.value, { color: theme.textSecondary }]}>{job.status}</Text></View>
      <View style={styles.infoRow}><Text style={[styles.label, { color: theme.text }]}>Location:</Text><Text style={[styles.value, { color: theme.textSecondary }]}>{job.apartments.address}</Text></View>
      
      <Text style={[styles.sectionTitle, { color: theme.text }]}>Notes</Text>
      <TextInput style={[styles.textArea, { borderColor: theme.border, color: theme.text, backgroundColor: theme.card }]} placeholder="Add work notes..." placeholderTextColor={theme.textSecondary} value={notes} onChangeText={setNotes} multiline numberOfLines={4} />
      
      <Text style={[styles.sectionTitle, { color: theme.text }]}>Completion Photos</Text>
      <TouchableOpacity style={[styles.photoBtn, { backgroundColor: theme.card }]} onPress={pickImage}><Text style={[styles.photoBtnText, { color: theme.primary }]}>Add Photos</Text></TouchableOpacity>
      <View style={styles.photoGrid}>
        {photos.map((uri, i) => <Image key={i} source={{ uri }} style={styles.photo} />)}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={[styles.btn, styles.btnProgress]} onPress={() => updateStatus('in_progress')} disabled={loading}><Text style={styles.btnText}>Start Job</Text></TouchableOpacity>
        <TouchableOpacity style={[styles.btn, styles.btnComplete]} onPress={() => updateStatus('completed')} disabled={loading}><Text style={styles.btnText}>Complete</Text></TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: { padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  headerTitle: { fontSize: 18, fontWeight: '600', flex: 1, textAlign: 'center' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  messageBtn: { padding: 8 },
  title: { fontSize: 24, fontWeight: 'bold' },
  desc: { fontSize: 16, color: '#666', marginBottom: 20 },
  infoRow: { flexDirection: 'row', marginBottom: 12 },
  label: { fontSize: 14, fontWeight: '600', width: 100 },
  value: { fontSize: 14, color: '#666', flex: 1 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginTop: 20, marginBottom: 12 },
  textArea: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, height: 100, textAlignVertical: 'top' },
  photoBtn: { backgroundColor: '#f0f0f0', padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 12 },
  photoBtnText: { fontSize: 16, color: '#007AFF' },
  photoGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  photo: { width: 100, height: 100, borderRadius: 8, marginRight: 8, marginBottom: 8 },
  actions: { flexDirection: 'row', marginTop: 20, gap: 12, marginBottom: 40 },
  btn: { flex: 1, padding: 16, borderRadius: 8, alignItems: 'center' },
  btnProgress: { backgroundColor: '#FF9500' },
  btnComplete: { backgroundColor: '#34C759' },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '600' }
});
