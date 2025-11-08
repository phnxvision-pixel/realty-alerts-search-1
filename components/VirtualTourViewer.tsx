import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import { Colors } from '@/constants/theme';

interface VirtualTour {
  id: string;
  tour_type: 'video' | '360' | 'matterport';
  url: string;
  thumbnail_url?: string;
}

interface VirtualTourViewerProps {
  tours: VirtualTour[];
}

export default function VirtualTourViewer({ tours }: VirtualTourViewerProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTour, setSelectedTour] = useState<VirtualTour | null>(null);

  if (!tours || tours.length === 0) return null;

  const openTour = (tour: VirtualTour) => {
    setSelectedTour(tour);
    setModalVisible(true);
  };

  const getTourIcon = (type: string) => {
    switch(type) {
      case 'video': return '🎥';
      case '360': return '🔄';
      case 'matterport': return '🏠';
      default: return '👁️';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Virtual Tours</Text>
      <View style={styles.tourButtons}>
        {tours.map(tour => (
          <TouchableOpacity
            key={tour.id}
            style={styles.tourButton}
            onPress={() => openTour(tour)}
          >
            <Text style={styles.tourIcon}>{getTourIcon(tour.tour_type)}</Text>
            <Text style={styles.tourLabel}>
              {tour.tour_type === 'video' ? 'Video Tour' : 
               tour.tour_type === '360' ? '360° View' : '3D Tour'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Modal visible={modalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Virtual Tour</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
          {selectedTour && (
            <WebView
              source={{ uri: selectedTour.url }}
              style={styles.webview}
              allowsFullscreenVideo
            />
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  tourButtons: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  tourButton: { backgroundColor: Colors.primary, padding: 16, borderRadius: 8, alignItems: 'center', minWidth: 100 },
  tourIcon: { fontSize: 32, marginBottom: 8 },
  tourLabel: { color: '#fff', fontSize: 14, fontWeight: '600' },
  modalContainer: { flex: 1, backgroundColor: '#000' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#fff' },
  modalTitle: { fontSize: 18, fontWeight: 'bold' },
  closeButton: { padding: 8 },
  closeText: { color: Colors.primary, fontSize: 16, fontWeight: '600' },
  webview: { flex: 1 }
});
