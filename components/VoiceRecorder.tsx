import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';

interface VoiceRecorderProps {
  onRecordingComplete: (uri: string, duration: number) => void;
  theme: any;
}

export default function VoiceRecorder({ onRecordingComplete, theme }: VoiceRecorderProps) {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);

  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission needed', 'Please allow microphone access');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(recording);
      setIsRecording(true);
      setDuration(0);

      const interval = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);

      (recording as any).interval = interval;
    } catch (err) {
      Alert.alert('Error', 'Failed to start recording');
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    clearInterval((recording as any).interval);
    setIsRecording(false);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    
    if (uri) {
      onRecordingComplete(uri, duration);
    }
    
    setRecording(null);
    setDuration(0);
  };

  const cancelRecording = async () => {
    if (!recording) return;
    
    clearInterval((recording as any).interval);
    setIsRecording(false);
    await recording.stopAndUnloadAsync();
    setRecording(null);
    setDuration(0);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      {!isRecording ? (
        <TouchableOpacity onPress={startRecording} style={[styles.button, { backgroundColor: theme.primary }]}>
          <Ionicons name="mic" size={24} color="#fff" />
        </TouchableOpacity>
      ) : (
        <View style={styles.recordingContainer}>
          <Text style={[styles.duration, { color: theme.text }]}>{formatDuration(duration)}</Text>
          <TouchableOpacity onPress={cancelRecording} style={styles.cancelButton}>
            <Ionicons name="close" size={24} color="#ff4444" />
          </TouchableOpacity>
          <TouchableOpacity onPress={stopRecording} style={[styles.button, { backgroundColor: theme.primary }]}>
            <Ionicons name="send" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 8 },
  button: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
  recordingContainer: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  duration: { fontSize: 16, fontWeight: '600' },
  cancelButton: { padding: 8 }
});
