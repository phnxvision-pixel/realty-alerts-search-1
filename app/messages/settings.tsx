import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import MessageNotificationSettings from '@/components/MessageNotificationSettings';
import TenantPreferences from '@/components/TenantPreferences';

export default function MessageSettingsScreen() {
  const { user } = useAuth();

  return (
    <ScrollView style={styles.container}>
      <MessageNotificationSettings />
      {user && <TenantPreferences userId={user.id} />}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' }
});
