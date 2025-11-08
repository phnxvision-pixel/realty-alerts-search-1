import { Stack } from 'expo-router';
import { AppProvider } from '@/contexts/AppContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { LandlordProvider } from '@/contexts/LandlordContext';
import { LocalizationProvider } from '@/contexts/LocalizationContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { LanguageSync } from '@/components/LanguageSync';
import CookieConsentBanner from '@/components/CookieConsentBanner';
import { useEffect, Component, ReactNode } from 'react';
import { setupNotificationListeners } from './lib/notifications';
import { errorTracker } from './lib/error-tracking';
import { View, Text } from 'react-native';


// Global Error Boundary
class GlobalErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    errorTracker.captureError(error, {
      screen: 'GlobalErrorBoundary',
      metadata: errorInfo
    }, 'critical');
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
            Something went wrong
          </Text>
          <Text style={{ textAlign: 'center', color: '#666' }}>
            The error has been reported. Please restart the app.
          </Text>
        </View>
      );
    }
    return this.props.children;
  }
}

export default function RootLayout() {
  useEffect(() => {
    const cleanup = setupNotificationListeners();
    
    // Set up global error handler
    const originalHandler = ErrorUtils.getGlobalHandler();
    ErrorUtils.setGlobalHandler((error, isFatal) => {
      errorTracker.captureError(error, {
        metadata: { isFatal }
      }, isFatal ? 'critical' : 'error');
      
      if (originalHandler) {
        originalHandler(error, isFatal);
      }
    });
    
    return cleanup;
  }, []);

  return (
    <GlobalErrorBoundary>
      <ThemeProvider>
        <LocalizationProvider>
          <AuthProvider>
            <LanguageSync />
            <LandlordProvider>
              <AppProvider>
                <CookieConsentBanner />
                <Stack>
                  <Stack.Screen name="index" options={{ headerShown: false }} />
                  <Stack.Screen name="onboarding" options={{ headerShown: false }} />
                  <Stack.Screen name="auth/login" options={{ title: 'Login' }} />
                  <Stack.Screen name="auth/signup" options={{ title: 'Sign Up' }} />
                  <Stack.Screen name="auth/reset-password" options={{ title: 'Reset Password' }} />
                  <Stack.Screen name="profile" options={{ title: 'Profile' }} />
                  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                  <Stack.Screen name="landlord/dashboard" options={{ title: 'Landlord Dashboard' }} />
                  <Stack.Screen name="landlord/register" options={{ title: 'Become a Landlord' }} />
                  <Stack.Screen name="landlord/post-listing" options={{ title: 'Post Listing' }} />
                  <Stack.Screen name="landlord/edit-listing/[id]" options={{ title: 'Edit Listing' }} />
                  <Stack.Screen name="landlord/applications" options={{ title: 'Applications' }} />
                  <Stack.Screen name="landlord/messages" options={{ title: 'Messages' }} />
                  <Stack.Screen name="landlord/subscription" options={{ title: 'Landlord Subscription' }} />
                  <Stack.Screen name="listing/[id]" options={{ title: 'Apartment Details' }} />
                  <Stack.Screen name="compare" options={{ title: 'Compare Apartments' }} />
                </Stack>
              </AppProvider>
            </LandlordProvider>
          </AuthProvider>
        </LocalizationProvider>
      </ThemeProvider>
    </GlobalErrorBoundary>
  );
}
