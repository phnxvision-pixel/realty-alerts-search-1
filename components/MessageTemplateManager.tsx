import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert, Modal } from 'react-native';
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
  onSelectTemplate?: (template: Template) => void;
}

export default function MessageTemplateManager({ landlordId, onSelectTemplate }: Props) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [showEditor, setShowEditor] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('General');
  const [filterCategory, setFilterCategory] = useState<string | null>(null);

  const categories = ['General', 'Viewing', 'Application', 'Maintenance', 'Payment'];

  useEffect(() => {
    loadTemplates();
  }, [landlordId]);

  const loadTemplates = async () => {
    const { data, error } = await supabase
      .from('message_templates')
      .select('*')
      .eq('landlord_id', landlordId)
      .order('is_favorite', { ascending: false })
      .order('use_count', { ascending: false });

    if (data) setTemplates(data);
  };

  const saveTemplate = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (editingTemplate) {
      const { error } = await supabase
        .from('message_templates')
        .update({ title, content, category, updated_at: new Date().toISOString() })
        .eq('id', editingTemplate.id);

      if (!error) {
        Alert.alert('Success', 'Template updated');
        resetEditor();
        loadTemplates();
      }
    } else {
      const { error } = await supabase
        .from('message_templates')
        .insert({ landlord_id: landlordId, title, content, category });

      if (!error) {
        Alert.alert('Success', 'Template created');
        resetEditor();
        loadTemplates();
      }
    }
  };

  const deleteTemplate = async (id: string) => {
    Alert.alert('Delete Template', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await supabase.from('message_templates').delete().eq('id', id);
          loadTemplates();
        }
      }
    ]);
  };

  const toggleFavorite = async (template: Template) => {
    await supabase
      .from('message_templates')
      .update({ is_favorite: !template.is_favorite })
      .eq('id', template.id);
    loadTemplates();
  };

  const resetEditor = () => {
    setShowEditor(false);
    setEditingTemplate(null);
    setTitle('');
    setContent('');
    setCategory('General');
  };

  const editTemplate = (template: Template) => {
    setEditingTemplate(template);
    setTitle(template.title);
    setContent(template.content);
    setCategory(template.category);
    setShowEditor(true);
  };

  const filteredTemplates = filterCategory
    ? templates.filter(t => t.category === filterCategory)
    : templates;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Message Templates</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setShowEditor(true)}>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        horizontal
        data={['All', ...categories]}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.categoryChip, (item === 'All' ? !filterCategory : filterCategory === item) && styles.categoryChipActive]}
            onPress={() => setFilterCategory(item === 'All' ? null : item)}
          >
            <Text style={[styles.categoryText, (item === 'All' ? !filterCategory : filterCategory === item) && styles.categoryTextActive]}>
              {item}
            </Text>
          </TouchableOpacity>
        )}
        style={styles.categoryList}
      />

      <FlatList
        data={filteredTemplates}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.templateCard}
            onPress={() => onSelectTemplate?.(item)}
          >
            <View style={styles.templateHeader}>
              <Text style={styles.templateTitle}>{item.title}</Text>
              <View style={styles.templateActions}>
                <TouchableOpacity onPress={() => toggleFavorite(item)}>
                  <Ionicons name={item.is_favorite ? 'star' : 'star-outline'} size={20} color="#FFD700" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => editTemplate(item)}>
                  <Ionicons name="create-outline" size={20} color="#666" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteTemplate(item.id)}>
                  <Ionicons name="trash-outline" size={20} color="#FF3B30" />
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.templateContent} numberOfLines={2}>{item.content}</Text>
            <View style={styles.templateFooter}>
              <Text style={styles.categoryBadge}>{item.category}</Text>
              <Text style={styles.useCount}>Used {item.use_count} times</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      <Modal visible={showEditor} animationType="slide">
        <View style={styles.editorContainer}>
          <View style={styles.editorHeader}>
            <TouchableOpacity onPress={resetEditor}>
              <Text style={styles.cancelButton}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.editorTitle}>{editingTemplate ? 'Edit' : 'New'} Template</Text>
            <TouchableOpacity onPress={saveTemplate}>
              <Text style={styles.saveButton}>Save</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Template Title"
            value={title}
            onChangeText={setTitle}
          />

          <View style={styles.categorySelector}>
            {categories.map(cat => (
              <TouchableOpacity
                key={cat}
                style={[styles.categorySelectorChip, category === cat && styles.categorySelectorChipActive]}
                onPress={() => setCategory(cat)}
              >
                <Text style={[styles.categorySelectorText, category === cat && styles.categorySelectorTextActive]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            style={styles.contentInput}
            placeholder="Template content... Use {tenant_name}, {property_address}, {viewing_date}"
            value={content}
            onChangeText={setContent}
            multiline
            textAlignVertical="top"
          />

          <Text style={styles.helpText}>
            Available placeholders: {'{tenant_name}'}, {'{property_address}'}, {'{viewing_date}'}
          </Text>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold' },
  addButton: { backgroundColor: '#007AFF', padding: 8, borderRadius: 20 },
  categoryList: { padding: 16, maxHeight: 60 },
  categoryChip: { backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginRight: 8, borderWidth: 1, borderColor: '#ddd' },
  categoryChipActive: { backgroundColor: '#007AFF', borderColor: '#007AFF' },
  categoryText: { color: '#666' },
  categoryTextActive: { color: '#fff' },
  templateCard: { backgroundColor: '#fff', padding: 16, marginHorizontal: 16, marginBottom: 12, borderRadius: 12 },
  templateHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  templateTitle: { fontSize: 16, fontWeight: '600', flex: 1 },
  templateActions: { flexDirection: 'row', gap: 12 },
  templateContent: { color: '#666', marginBottom: 8 },
  templateFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  categoryBadge: { backgroundColor: '#E8F4FF', color: '#007AFF', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, fontSize: 12 },
  useCount: { fontSize: 12, color: '#999' },
  editorContainer: { flex: 1, backgroundColor: '#fff', padding: 16 },
  editorHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  editorTitle: { fontSize: 18, fontWeight: '600' },
  cancelButton: { color: '#666', fontSize: 16 },
  saveButton: { color: '#007AFF', fontSize: 16, fontWeight: '600' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 16 },
  categorySelector: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  categorySelectorChip: { backgroundColor: '#f0f0f0', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  categorySelectorChipActive: { backgroundColor: '#007AFF' },
  categorySelectorText: { color: '#666' },
  categorySelectorTextActive: { color: '#fff' },
  contentInput: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, height: 200, fontSize: 16, marginBottom: 8 },
  helpText: { fontSize: 12, color: '#999', fontStyle: 'italic' }
});
