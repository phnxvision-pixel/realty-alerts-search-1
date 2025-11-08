import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabase';
import { useAuth } from './AuthContext';

interface LandlordContextType {
  landlordProfile: any;
  isLandlord: boolean;
  isPremiumLandlord: boolean;
  loading: boolean;
  createLandlordProfile: (data: any) => Promise<void>;
  updateLandlordProfile: (data: any) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const LandlordContext = createContext<LandlordContextType | undefined>(undefined);

export const LandlordProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [landlordProfile, setLandlordProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchLandlordProfile = async () => {
    if (!user) {
      setLandlordProfile(null);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('landlords')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (!error && data) {
      setLandlordProfile(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLandlordProfile();
  }, [user]);

  const createLandlordProfile = async (profileData: any) => {
    const { data, error } = await supabase
      .from('landlords')
      .insert([{ ...profileData, user_id: user?.id }])
      .select()
      .single();

    if (error) throw error;
    setLandlordProfile(data);
  };

  const updateLandlordProfile = async (profileData: any) => {
    const { data, error } = await supabase
      .from('landlords')
      .update(profileData)
      .eq('user_id', user?.id)
      .select()
      .single();

    if (error) throw error;
    setLandlordProfile(data);
  };

  const isLandlord = !!landlordProfile;
  const isPremiumLandlord = landlordProfile?.subscription_tier === 'featured' || landlordProfile?.subscription_tier === 'premium';

  return (
    <LandlordContext.Provider value={{
      landlordProfile,
      isLandlord,
      isPremiumLandlord,
      loading,
      createLandlordProfile,
      updateLandlordProfile,
      refreshProfile: fetchLandlordProfile
    }}>
      {children}
    </LandlordContext.Provider>
  );
};

export const useLandlord = () => {
  const context = useContext(LandlordContext);
  if (!context) throw new Error('useLandlord must be used within LandlordProvider');
  return context;
};
