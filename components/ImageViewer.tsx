import React from 'react';
import { Modal, View, Image, TouchableOpacity, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

interface ImageViewerProps {
  visible: boolean;
  imageUrl: string;
  onClose: () => void;
}

export default function ImageViewer({ visible, imageUrl, onClose }: ImageViewerProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close" size={32} color="#fff" />
        </TouchableOpacity>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          maximumZoomScale={3}
          minimumZoomScale={1}
        >
          <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="contain" />
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'rgba(0,0,0,0.95)', justifyContent: 'center', alignItems: 'center' },
  closeButton: { position: 'absolute', top: 50, right: 20, zIndex: 10, padding: 8 },
  scrollContent: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  image: { width: width * 0.9, height: height * 0.8 }
});
