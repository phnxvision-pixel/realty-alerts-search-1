import { supabase } from './supabase';
import { User } from '@supabase/supabase-js';

interface OAuthProfile {
  name?: string;
  given_name?: string;
  family_name?: string;
  email?: string;
  picture?: string;
  avatar_url?: string;
  locale?: string;
  gender?: string;
  verified_email?: boolean;
}

export interface ImportedProfileData {
  full_name?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  avatar_url?: string;
  bio?: string;
  language?: string;
  provider: 'google' | 'apple';
  needs_review: boolean;
}

class ProfileSyncService {
  async syncOAuthProfile(user: User, accessToken: string, provider: 'google' | 'apple'): Promise<ImportedProfileData | null> {
    try {
      let profileData: OAuthProfile = {};

      if (provider === 'google') {
        profileData = await this.fetchGoogleProfile(accessToken);
      } else if (provider === 'apple') {
        profileData = this.extractAppleProfile(user);
      }

      const importedData: ImportedProfileData = {
        full_name: profileData.name || user.user_metadata?.full_name,
        first_name: profileData.given_name || user.user_metadata?.given_name,
        last_name: profileData.family_name || user.user_metadata?.family_name,
        email: user.email || profileData.email,
        avatar_url: profileData.picture || profileData.avatar_url || user.user_metadata?.avatar_url,
        language: profileData.locale?.split('-')[0] || 'en',
        provider: provider,
        needs_review: true
      };

      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('id', user.id)
        .single();

      const updateData = {
        email: importedData.email,
        full_name: importedData.full_name,
        avatar_url: importedData.avatar_url,
        language: importedData.language,
        provider: provider,
        provider_id: user.id,
        oauth_data_needs_review: true,
        updated_at: new Date().toISOString()
      };

      if (existingUser) {
        await supabase.from('users').update(updateData).eq('id', user.id);
      } else {
        await supabase.from('users').insert({ 
          id: user.id, 
          ...updateData,
          onboarding_completed: false
        });
      }

      return importedData;
    } catch (error) {
      console.error('Profile sync error:', error);
      return null;
    }
  }

  private async fetchGoogleProfile(accessToken: string): Promise<OAuthProfile> {
    try {
      const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      return await response.json();
    } catch (error) {
      console.error('Google profile fetch error:', error);
      return {};
    }
  }

  private extractAppleProfile(user: User): OAuthProfile {
    return {
      name: user.user_metadata?.full_name,
      given_name: user.user_metadata?.given_name,
      family_name: user.user_metadata?.family_name,
      email: user.email,
      avatar_url: user.user_metadata?.avatar_url
    };
  }

  async confirmImportedData(userId: string, confirmedData: Partial<ImportedProfileData>) {
    const { error } = await supabase
      .from('users')
      .update({
        full_name: confirmedData.full_name,
        avatar_url: confirmedData.avatar_url,
        bio: confirmedData.bio,
        language: confirmedData.language,
        oauth_data_needs_review: false,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);
    
    if (error) throw error;
  }

  async checkNeedsReview(userId: string): Promise<boolean> {
    const { data } = await supabase
      .from('users')
      .select('oauth_data_needs_review')
      .eq('id', userId)
      .single();
    
    return data?.oauth_data_needs_review || false;
  }
}

export const profileSync = new ProfileSyncService();
