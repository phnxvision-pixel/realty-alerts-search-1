import { supabase } from './supabase';

export const NotificationService = {
  async sendMessageNotification(conversationId: string, senderId: string, content: string) {
    await supabase.functions.invoke('send-message-notification', {
      body: { conversationId, senderId, content }
    });
  },

  async sendApplicationUpdate(applicationId: string, newStatus: string) {
    await supabase.functions.invoke('notify-application-update', {
      body: { applicationId, newStatus }
    });
  },

  async sendPriceChangeNotification(apartmentId: string, oldPrice: number, newPrice: number) {
    await supabase.functions.invoke('notify-price-change', {
      body: { apartmentId, oldPrice, newPrice }
    });
  },

  async sendLandlordNotification(landlordId: string, eventType: string, data: any) {
    await supabase.functions.invoke('notify-landlord', {
      body: { landlordId, eventType, data }
    });
  },

  async sendCustomNotification(userId: string, notificationType: string, title: string, body: string, data?: any) {
    await supabase.functions.invoke('send-push-notification', {
      body: { userId, notificationType, title, body, data }
    });
  },

  async scheduleNotification(userId: string, notificationType: string, title: string, body: string, scheduledFor: Date, data?: any) {
    await supabase.from('scheduled_notifications').insert({
      user_id: userId,
      notification_type: notificationType,
      title,
      body,
      data,
      scheduled_for: scheduledFor.toISOString()
    });
  },

  async getNotificationHistory(userId: string, limit = 50) {
    const { data } = await supabase
      .from('notification_log')
      .select('*')
      .eq('user_id', userId)
      .order('sent_at', { ascending: false })
      .limit(limit);
    return data || [];
  },

  async markNotificationAsOpened(notificationId: string) {
    await supabase
      .from('notification_log')
      .update({ opened: true, opened_at: new Date().toISOString() })
      .eq('id', notificationId);
  },

  async getUnreadCount(userId: string) {
    const { count } = await supabase
      .from('notification_log')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('opened', false);
    return count || 0;
  }
};
