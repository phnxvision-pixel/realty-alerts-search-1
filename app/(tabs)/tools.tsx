import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing } from '@/constants/theme';
import { useApp } from '@/contexts/AppContext';
import { FinancingCalculator } from '@/components/FinancingCalculator';

const tools = [
  { id: '1', title: 'Cover Letter Templates', icon: 'document-text', premium: true },
  { id: '2', title: 'PDF Generator', icon: 'document', premium: true },
  { id: '3', title: 'Document Checklist', icon: 'checkbox', premium: true },
  { id: '4', title: 'Application Tracker', icon: 'list', premium: true },
  { id: '5', title: 'Commute Calculator', icon: 'car', premium: true },
  { id: '6', title: 'Neighborhood Analysis', icon: 'location', premium: true },
  { id: '7', title: 'Price Analytics', icon: 'analytics', premium: true },
  { id: '8', title: 'Financing Calculator', icon: 'calculator', premium: false },
];


export default function ToolsScreen() {
  const { isPremium } = useApp();
  const [showCalculator, setShowCalculator] = useState(false);

  const handleToolPress = (toolId: string) => {
    if (toolId === '8') {
      setShowCalculator(true);
    }
  };

  return (
    <>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Application Tools</Text>
          <Text style={styles.subtitle}>Everything you need to apply successfully</Text>
        </View>
        {!isPremium && (
          <View style={styles.premiumBanner}>
            <Ionicons name="star" size={24} color={Colors.primary} />
            <Text style={styles.premiumText}>Unlock all tools with Premium</Text>
          </View>
        )}
        <View style={styles.grid}>
          {tools.map(tool => (
            <TouchableOpacity
              key={tool.id}
              style={[styles.toolCard, !isPremium && tool.premium && styles.locked]}
              disabled={!isPremium && tool.premium}
              onPress={() => handleToolPress(tool.id)}
            >
              <Ionicons name={tool.icon as any} size={32} color={isPremium || !tool.premium ? Colors.primary : Colors.textLight} />
              <Text style={[styles.toolTitle, !isPremium && tool.premium && styles.lockedText]}>
                {tool.title}
              </Text>
              {!isPremium && tool.premium && (
                <View style={styles.lockBadge}>
                  <Ionicons name="lock-closed" size={16} color={Colors.textLight} />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <Modal visible={showCalculator} animationType="slide">
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setShowCalculator(false)}>
            <Ionicons name="close" size={28} color={Colors.text} />
          </TouchableOpacity>
        </View>
        <FinancingCalculator />
      </Modal>
    </>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { padding: Spacing.lg, backgroundColor: Colors.card },
  title: { fontSize: 28, fontWeight: 'bold', color: Colors.text },
  subtitle: { fontSize: 16, color: Colors.textLight, marginTop: 4 },
  premiumBanner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.premium, padding: Spacing.md, margin: Spacing.md, borderRadius: 8 },
  premiumText: { marginLeft: 8, fontWeight: 'bold', color: Colors.primary },
  grid: { padding: Spacing.md },
  toolCard: { backgroundColor: Colors.card, padding: Spacing.lg, borderRadius: 12, marginBottom: Spacing.md, alignItems: 'center', elevation: 2 },
  locked: { opacity: 0.5 },
  toolTitle: { fontSize: 16, fontWeight: '600', color: Colors.text, marginTop: Spacing.sm, textAlign: 'center' },
  lockedText: { color: Colors.textLight },
  lockBadge: { position: 'absolute', top: 12, right: 12 },
  modalHeader: { padding: Spacing.md, backgroundColor: Colors.card, alignItems: 'flex-end' },
});

