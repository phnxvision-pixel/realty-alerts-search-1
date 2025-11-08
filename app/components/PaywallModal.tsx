import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface PaywallModalProps {
  visible: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

export default function PaywallModal({ visible, onClose, onUpgrade }: PaywallModalProps) {
  const premiumFeatures = [
    { icon: 'notifications', title: 'Push Notifications', desc: 'Get instant alerts for new listings' },
    { icon: 'heart', title: 'Unlimited Favorites', desc: 'Save as many apartments as you want' },
    { icon: 'headset', title: 'Priority Support', desc: '24/7 dedicated customer service' },
    { icon: 'filter', title: 'Advanced Filters', desc: 'Save unlimited filter presets' },
  ];

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Ionicons name="close" size={24} color="#666" />
          </TouchableOpacity>
          
          <ScrollView showsVerticalScrollIndicator={false}>
            <Ionicons name="star" size={60} color="#FFD700" style={styles.starIcon} />
            <Text style={styles.title}>Upgrade to Premium</Text>
            <Text style={styles.subtitle}>Unlock all features and find your perfect apartment faster</Text>
            
            {premiumFeatures.map((feature, idx) => (
              <View key={idx} style={styles.feature}>
                <Ionicons name={feature.icon as any} size={24} color="#007AFF" />
                <View style={styles.featureText}>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDesc}>{feature.desc}</Text>
                </View>
              </View>
            ))}
            
            <View style={styles.priceBox}>
              <Text style={styles.price}>€5.00/month</Text>
              <Text style={styles.priceDesc}>Cancel anytime</Text>
            </View>
            
            <TouchableOpacity style={styles.upgradeBtn} onPress={onUpgrade}>
              <Text style={styles.upgradeBtnText}>Start Premium Trial</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modal: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, maxHeight: '85%' },
  closeBtn: { position: 'absolute', top: 16, right: 16, zIndex: 1 },
  starIcon: { alignSelf: 'center', marginTop: 20 },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginTop: 16 },
  subtitle: { fontSize: 16, color: '#666', textAlign: 'center', marginTop: 8, marginBottom: 24 },
  feature: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  featureText: { marginLeft: 16, flex: 1 },
  featureTitle: { fontSize: 18, fontWeight: '600', marginBottom: 4 },
  featureDesc: { fontSize: 14, color: '#666' },
  priceBox: { backgroundColor: '#F0F8FF', padding: 20, borderRadius: 12, marginTop: 24, alignItems: 'center' },
  price: { fontSize: 32, fontWeight: 'bold', color: '#007AFF' },
  priceDesc: { fontSize: 14, color: '#666', marginTop: 4 },
  upgradeBtn: { backgroundColor: '#007AFF', padding: 18, borderRadius: 12, marginTop: 24, marginBottom: 16 },
  upgradeBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
});
