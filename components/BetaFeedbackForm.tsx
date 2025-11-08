import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '@/app/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import Constants from 'expo-constants';

const FEEDBACK_TYPES = [
  { value: 'bug', label: 'Bug Report' },
  { value: 'feature_request', label: 'Feature Request' },

  { value: 'improvement', label: 'Improvement' },
  { value: 'other', label: 'Other' }
];

const SEVERITY_LEVELS = [
  { value: 'low', label: 'Low', color: '#10b981' },
  { value: 'medium', label: 'Medium', color: '#f59e0b' },
  { value: 'high', label: 'High', color: '#ef4444' },
  { value: 'critical', label: 'Critical', color: '#dc2626' }
];

export default function BetaFeedbackForm({ onClose }: { onClose: () => void }) {
  const { user } = useAuth();
  const [type, setType] = useState('bug');
  const [severity, setSeverity] = useState('medium');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [screenshots, setScreenshots] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setScreenshots([...screenshots, ...result.assets.map(a => a.uri)]);
    }
  };

  const submitFeedback = async () => {
    if (!title.trim() || !description.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      const screenshotUrls: string[] = [];
      
      for (const uri of screenshots) {
        const fileName = `${user?.id}/${Date.now()}_${Math.random()}.jpg`;
        const response = await fetch(uri);
        const blob = await response.blob();
        
        const { data, error } = await supabase.storage
          .from('beta-feedback')
          .upload(fileName, blob);
        
        if (!error && data) {
          const { data: { publicUrl } } = supabase.storage
            .from('beta-feedback')
            .getPublicUrl(data.path);
          screenshotUrls.push(publicUrl);
        }
      }

      const { error } = await supabase.from('beta_feedback').insert({
        user_id: user?.id,
        feedback_type: type,
        title,
        description,
        severity,
        screenshot_urls: screenshotUrls,
        device_model: Constants.deviceName || 'Unknown',
        device_os: Platform.OS,
        device_os_version: Platform.Version.toString(),
        app_version: Constants.expoConfig?.version || '1.0.0',
        user_email: user?.email,
      });


      if (error) throw error;

      Alert.alert('Success', 'Thank you for your feedback!');
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#fff', padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Beta Feedback</Text>
      
      <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>Type</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 }}>
        {FEEDBACK_TYPES.map(t => (
          <TouchableOpacity
            key={t.value}
            onPress={() => setType(t.value)}
            style={{
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 20,
              backgroundColor: type === t.value ? '#007AFF' : '#f0f0f0',
              marginRight: 8,
              marginBottom: 8
            }}>
            <Text style={{ color: type === t.value ? '#fff' : '#333' }}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>Severity</Text>
      <View style={{ flexDirection: 'row', marginBottom: 16 }}>
        {SEVERITY_LEVELS.map(s => (
          <TouchableOpacity
            key={s.value}
            onPress={() => setSeverity(s.value)}
            style={{
              flex: 1,
              padding: 12,
              borderRadius: 8,
              backgroundColor: severity === s.value ? s.color : '#f0f0f0',
              marginRight: 8
            }}>
            <Text style={{ color: severity === s.value ? '#fff' : '#333', textAlign: 'center', fontSize: 12 }}>
              {s.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        placeholder="Title *"
        value={title}
        onChangeText={setTitle}
        style={{
          borderWidth: 1,
          borderColor: '#ddd',
          borderRadius: 8,
          padding: 12,
          marginBottom: 16,
          fontSize: 16
        }}
      />

      <TextInput
        placeholder="Description *"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={6}
        style={{
          borderWidth: 1,
          borderColor: '#ddd',
          borderRadius: 8,
          padding: 12,
          marginBottom: 16,
          fontSize: 16,
          textAlignVertical: 'top'
        }}
      />

      <TouchableOpacity
        onPress={pickImages}
        style={{
          padding: 16,
          borderRadius: 8,
          borderWidth: 2,
          borderColor: '#007AFF',
          borderStyle: 'dashed',
          marginBottom: 16,
          alignItems: 'center'
        }}>
        <Text style={{ color: '#007AFF', fontSize: 16 }}>
          Add Screenshots ({screenshots.length})
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={submitFeedback}
        disabled={submitting}
        style={{
          backgroundColor: submitting ? '#ccc' : '#007AFF',
          padding: 16,
          borderRadius: 8,
          alignItems: 'center',
          marginBottom: 16
        }}>
        <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
          {submitting ? 'Submitting...' : 'Submit Feedback'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onClose} style={{ padding: 16, alignItems: 'center' }}>
        <Text style={{ color: '#666' }}>Cancel</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
