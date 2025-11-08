// Configuration for error alerting system
import { supabase } from './supabase';

export interface DeveloperEmail {
  email: string;
  alert_level: 'all' | 'critical' | 'digest_only';
  active: boolean;
}

export class ErrorAlertConfig {
  /**
   * Add a developer to receive error alerts
   */
  static async addDeveloper(email: string, alertLevel: 'all' | 'critical' | 'digest_only' = 'all') {
    const { data, error } = await supabase
      .from('developer_emails')
      .insert({ email, alert_level: alertLevel })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Update developer alert preferences
   */
  static async updateDeveloper(email: string, updates: Partial<DeveloperEmail>) {
    const { data, error } = await supabase
      .from('developer_emails')
      .update(updates)
      .eq('email', email)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Remove developer from alerts
   */
  static async removeDeveloper(email: string) {
    const { error } = await supabase
      .from('developer_emails')
      .delete()
      .eq('email', email);

    if (error) throw error;
  }

  /**
   * Get all developers
   */
  static async getDevelopers() {
    const { data, error } = await supabase
      .from('developer_emails')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  /**
   * Trigger daily digest manually
   */
  static async sendDailyDigest() {
    const { data, error } = await supabase.functions.invoke('send-daily-error-digest');
    if (error) throw error;
    return data;
  }
}
