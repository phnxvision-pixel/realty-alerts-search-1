import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/app/lib/supabase';

interface Template {
  id: string;
  title: string;
  content: string;
  category: string;
  is_favorite: boolean;
  use_count: number;
}

interface Props {
  landlordId: string;
  visible: boolean;
  onClose: () => void;
  onSelectTemplate: (content: string) => void;
  placeholders?: Record<string, string>;
}

export default function TemplateQuickInsert({ 
  landlordId, 
  visible, 
  onClose, 
  onSelectTemplate,
  placeholders = {}
}: Props) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = ['All', 'General', 'Viewing', 'Application', 'Maintenance', 'Payment'];

  useEffect(() => {
    if (visible) {
      loadTemplates();
    }
  }, [visible, landlordId]);

  const loadTemplates = async () => {
    const { data } = await supabase
      .from('message_templates')
      .select('*')
      .eq('landlord_id', landlordId)
      .order('is_favorite', { ascending: false })
      .order('use_count', { ascending: false });

    if (data) setTemplates(data);
  };

  const replacePlaceholders = (content: string): string => {
    let result = content;
    Object.entries(placeholders).forEach(([key, value]) => {
      result = result.replace(new RegExp(`{${key}}`, 'g'), value);
    });
    return result;
  };

  const handleSelectTemplate = async (template: Template) => {
    // Increment use count
    await supabase
      .from('message_templates')
      .update({ use_count: template.use_count + 1 })
      .eq('id', template.id);

    const processedContent = replacePlaceholders(template.content);
    onSelectTemplate(processedContent);
    onClose();
  };

  const filteredTemplates = templates.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         t.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || selectedCategory === 'All' || t.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Quick Insert Template</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.searchInput}
            placeholder="Search templates..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          <FlatList
            horizontal
            data={categories}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.categoryChip, (item === 'All' ? !selectedCategory : selectedCategory === item) && styles.categoryChipActive]}
                onPress={() => setSelectedCategory(item === 'All' ? null : item)}
              >
                <Text style={[styles.categoryText, (item === 'All' ? !selectedCategory : selectedCategory === item) && styles.categoryTextActive]}>
                  {item}
                </Text>
              </TouchableOpacity>
            )}
            style={styles.categoryList}
            showsHorizontalScrollIndicator={false}
          />

          <FlatList
            data={filteredTemplates}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.templateCard}
                onPress={() => handleSelectTemplate(item)}
              >
                <View style={styles.templateHeader}>
                  <Text style={styles.templateTitle}>
                    {item.is_favorite && <Ionicons name="star" size={14} color="#FFD700" />} {item.title}
                  </Text>
                  <Text style={styles.categoryBadge}>{item.category}</Text>
                </View>
                <Text style={styles.templateContent} numberOfLines={2}>
                  {item.content}
                </Text>
                <Text style={styles.useCount}>Used {item.use_count} times</Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Ionicons name="document-text-outline" size={48} color="#ccc" />
                <Text style={styles.emptyText}>No templates found</Text>
              </View>
            }
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  container: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '80%', paddingBottom: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#eee' },
  title: { fontSize: 18, fontWeight: '600' },
  searchInput: { margin: 16, padding: 12, backgroundColor: '#f5f5f5', borderRadius: 8, fontSize: 16 },
  categoryList: { paddingHorizontal: 16, maxHeight: 50, marginBottom: 8 },
  categoryChip: { backgroundColor: '#f0f0f0', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, marginRight: 8 },
  categoryChipActive: { backgroundColor: '#007AFF' },
  categoryText: { color: '#666', fontSize: 14 },
  categoryTextActive: { color: '#fff' },
  templateCard: { backgroundColor: '#f9f9f9', padding: 12, marginHorizontal: 16, marginBottom: 8, borderRadius: 8 },
  templateHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  templateTitle: { fontSize: 15, fontWeight: '600', flex: 1 },
  categoryBadge: { backgroundColor: '#E8F4FF', color: '#007AFF', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, fontSize: 11 },
  templateContent: { color: '#666', fontSize: 13, marginBottom: 4 },
  useCount: { fontSize: 11, color: '#999' },
  emptyState: { alignItems: 'center', padding: 40 },
  emptyText: { marginTop: 12, color: '#999', fontSize: 16 }
});
