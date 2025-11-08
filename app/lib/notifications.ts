import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { supabase } from './supabase';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function registerForPushNotificationsAsync(userId: string) {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  
  if (finalStatus !== 'granted') {
    return null;
  }

  token = (await Notifications.getExpoPushTokenAsync()).data;

  // Register token with backend
  await supabase
    .from('push_tokens')
    .upsert({ 
      user_id: userId, 
      token,
      device_type: Platform.OS,
      is_active: true,
      updated_at: new Date().toISOString()
    });

  return token;
}

export function setupNotificationListeners(onNotificationReceived?: (notification: any) => void, onNotificationTapped?: (response: any) => void) {
  const notificationListener = Notifications.addNotificationReceivedListener(notification => {
    if (onNotificationReceived) {
      onNotificationReceived(notification);
    }
  });

  const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
    if (onNotificationTapped) {
      onNotificationTapped(response);
    }
  });

  return () => {
    Notifications.removeNotificationSubscription(notificationListener);
    Notifications.removeNotificationSubscription(responseListener);
  };
}

export async function getUnreadMessageCount(userId: string): Promise<number> {
  const { data } = await supabase
    .from('messages')
    .select('id, conversation_id, conversations!inner(tenant_id, landlord_id)')
    .is('read_at', null)
    .neq('sender_id', userId);

  const filtered = data?.filter((msg: any) => 
    msg.conversations.tenant_id === userId || msg.conversations.landlord_id === userId
  );

  return filtered?.length || 0;
}

export async function updateBadgeCount(userId: string) {
  const count = await getUnreadMessageCount(userId);
  await Notifications.setBadgeCountAsync(count);
}
