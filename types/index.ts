export interface Apartment {
  id: string;
  title: string;
  price: number;
  size: number;
  rooms: number;
  location: string;
  city: string;
  image: string;
  images: string[];
  description: string;
  availableFrom: string;
  petsAllowed: boolean;
  furnished: boolean;
  balcony: boolean;
  isNew: boolean;
  source: string;
}

export interface SearchProfile {
  id: string;
  name: string;
  city: string;
  priceMin: number;
  priceMax: number;
  rooms: number;
  petsAllowed?: boolean;
  furnished?: boolean;
}

export interface User {
  isPremium: boolean;
  favorites: string[];
  searchProfiles: SearchProfile[];
}
