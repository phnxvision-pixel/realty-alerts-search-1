import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert, Share } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

interface ShareButtonProps {
  title: string;
  message: string;
  url?: string;
  onPress?: () => void;
}

export const ShareButton: React.FC<ShareButtonProps> = ({ title, message, url, onPress }) => {
  const { theme } = useTheme();

  const handleShare = async () => {
    try {
      const content: any = { title, message };
      if (url) content.url = url;
      
      const result = await Share.share(content);
      
      if (result.action === Share.sharedAction) {
        // Shared successfully
      }

      }
      
      if (onPress) onPress();
    } catch (error: any) {
      Alert.alert('Error', 'Failed to share: ' + error.message);
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.button, { backgroundColor: theme.primary }]} 
      onPress={handleShare}
    >
      <Ionicons name="share-social" size={20} color="#fff" />
      <Text style={styles.text}>Share</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
  },
  text: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
