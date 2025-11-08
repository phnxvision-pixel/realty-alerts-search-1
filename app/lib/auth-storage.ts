import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = '@apartment_finder_token';
const USER_KEY = '@apartment_finder_user';
const PREMIUM_KEY = '@apartment_finder_premium';

export const authStorage = {
  async saveToken(token: string) {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  },

  async getToken(): Promise<string | null> {
    return await AsyncStorage.getItem(TOKEN_KEY);
  },

  async removeToken() {
    await AsyncStorage.removeItem(TOKEN_KEY);
  },

  async saveUser(user: any) {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  async getUser(): Promise<any | null> {
    const data = await AsyncStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : null;
  },

  async removeUser() {
    await AsyncStorage.removeItem(USER_KEY);
  },

  async savePremiumStatus(isPremium: boolean) {
    await AsyncStorage.setItem(PREMIUM_KEY, JSON.stringify(isPremium));
  },

  async getPremiumStatus(): Promise<boolean> {
    const data = await AsyncStorage.getItem(PREMIUM_KEY);
    return data ? JSON.parse(data) : false;
  },

  async clearAll() {
    await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY, PREMIUM_KEY]);
  }
};
