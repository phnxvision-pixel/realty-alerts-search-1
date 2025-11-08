import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Apartment } from '@/types';
import { useAuth } from './AuthContext';

interface AppContextType {
  favorites: string[];
  toggleFavorite: (id: string) => boolean;
  compareList: string[];
  toggleCompare: (id: string) => void;
  clearCompare: () => void;
  getRemainingFavorites: () => number;
  canAddFavorite: () => boolean;
  showPaywallModal: boolean;
  setShowPaywallModal: (show: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const FREE_FAVORITES_LIMIT = 5;

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [showPaywallModal, setShowPaywallModal] = useState(false);
  const { isPremium } = useAuth();

  const canAddFavorite = () => {
    if (isPremium) return true;
    return favorites.length < FREE_FAVORITES_LIMIT;
  };

  const getRemainingFavorites = () => {
    if (isPremium) return Infinity;
    return Math.max(0, FREE_FAVORITES_LIMIT - favorites.length);
  };

  const toggleFavorite = (id: string): boolean => {
    // If removing, always allow
    if (favorites.includes(id)) {
      setFavorites(prev => prev.filter(fav => fav !== id));
      return true;
    }
    
    // If adding, check limit
    if (!canAddFavorite()) {
      setShowPaywallModal(true);
      return false;
    }
    
    setFavorites(prev => [...prev, id]);
    return true;
  };

  const toggleCompare = (id: string) => {
    setCompareList(prev => {
      if (prev.includes(id)) return prev.filter(item => item !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  };

  const clearCompare = () => setCompareList([]);

  return (
    <AppContext.Provider
      value={{ 
        favorites, 
        toggleFavorite, 
        compareList, 
        toggleCompare, 
        clearCompare,
        getRemainingFavorites,
        canAddFavorite,
        showPaywallModal,
        setShowPaywallModal
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

