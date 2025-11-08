
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import { authStorage } from '@/app/lib/auth-storage';
import { profileSync } from '@/app/lib/profile-sync';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as AppleAuthentication from 'expo-apple-authentication';
import { Platform, Alert } from 'react-native';
import { makeRedirectUri } from 'expo-auth-session';
import { router } from 'expo-router';

WebBrowser.maybeCompleteAuthSession();

interface AuthContextType {
  session: Session | null;
  user: User | null;
  isPremium: boolean;
  loading: boolean;
  needsOnboarding: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
  checkPremiumStatus: () => Promise<void>;
  checkOnboardingStatus: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [loading, setLoading] = useState(true);

  // Corrected Redirect URI using Expo's proxy
  const redirectUri = makeRedirectUri({
    useProxy: true,
  });

  console.log('✅ Corrected OAuth Redirect URI:', redirectUri);

  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: '929069562295-181nuemr8ocevknad565l5p0895o8old.apps.googleusercontent.com',
    androidClientId: '929069562295-bpvsrm6uhpd1g9me9a07qti0ir6enb97.apps.googleusercontent.com',
    webClientId: '929069562295-6444sseek5krf53ph886sel209b30uvg.apps.googleusercontent.com',
    redirectUri: redirectUri,
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      if (authentication?.accessToken) {
        handleGoogleSignIn(authentication.accessToken);
      } else {
        console.error('❌ Google OAuth response without accessToken.');
        Alert.alert('Google Sign-In Error', 'An error occurred during sign-in. Please try again.');
      }
    } else if (response?.type === 'error') {
      console.error('❌ OAuth Error:', response.error);
      Alert.alert(
        'Google Sign-In Error',
        'Please check the OAuth configuration. Details in the console.',
        [{ text: 'OK' }]
      );
    }
  }, [response]);


  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        checkPremiumStatus();
        checkOnboardingStatus();
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        checkPremiumStatus();
        checkOnboardingStatus();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkOnboardingStatus = async () => {
    const currentUser = user || session?.user;
    if (!currentUser?.id) return;
    
    try {
      const { data } = await supabase
        .from('users')
        .select('onboarding_completed')
        .eq('id', currentUser.id)
        .single();
      
      setNeedsOnboarding(!data?.onboarding_completed);
    } catch (error) {
      console.error('Error checking onboarding status:', error);
    }
  };

  const checkPremiumStatus = async () => {
    const { data } = await supabase
      .from('users')
      .select('is_premium, premium_expires_at')
      .eq('id', user?.id)
      .single();
    
    if (data) {
      const isActive = data.is_premium && (!data.premium_expires_at || new Date(data.premium_expires_at) > new Date());
      setIsPremium(isActive);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        emailRedirectTo: 'realty-alerts-search-1://auth/verified'
      }
    });
    if (error) throw error;
    if (data.user) {
      await supabase.from('users').insert({ id: data.user.id, email, full_name: fullName });
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    await authStorage.clearAll();
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  };

  const updateProfile = async (data: any) => {
    await supabase.from('users').update(data).eq('id', user?.id);
  };

  const handleGoogleSignIn = async (accessToken: string) => {
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: accessToken,
    });
    if (error) throw error;
    if (data.user) {
      const importedData = await profileSync.syncOAuthProfile(data.user, accessToken, 'google');
      await authStorage.saveToken(accessToken);
      await authStorage.saveUser(data.user);
      
      if (importedData?.needs_review) {
        router.replace('/auth/review-oauth-profile');
      }
    }
  };

  const signInWithGoogle = async () => {
    await promptAsync();
  };

  const signInWithApple = async () => {
    if (Platform.OS !== 'ios') {
      throw new Error('Apple Sign In is only available on iOS');
    }
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'apple',
        token: credential.identityToken!,
      });
      if (error) throw error;
      if (data.user) {
        const importedData = await profileSync.syncOAuthProfile(data.user, credential.identityToken!, 'apple');
        await authStorage.saveToken(credential.identityToken!);
        await authStorage.saveUser(data.user);
        
        if (importedData?.needs_review) {
          router.replace('/auth/review-oauth-profile');
        }
      }
    } catch (e: any) {
      if (e.code === 'ERR_CANCELED') {
        return;
      }
      throw e;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      session, user, isPremium, loading, needsOnboarding,
      signIn, signUp, signOut, resetPassword, 
      updateProfile, checkPremiumStatus, checkOnboardingStatus,
      signInWithGoogle, signInWithApple 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
