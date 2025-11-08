import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/app/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import MessageTemplateManager from '@/components/MessageTemplateManager';

export default function TemplatesScreen() {
  const [landlordId, setLandlordId] = useState<string | null>(null);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    loadLandlordId();
  }, [user]);

  const loadLandlordId = async () => {
    if (!user?.id) return;
    
    const { data } = await supabase
      .from('landlords')
      .select('id')
      .eq('user_id', user.id)
      .single();
    
    if (data) {
      setLandlordId(data.id);
    }
  };

  if (!landlordId) {
    return null;
  }

  return (
    <ScrollView style={styles.container}>
      <MessageTemplateManager landlordId={landlordId} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  }
});
