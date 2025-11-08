// Lightweight error tracking without Sentry dependency issues
import { supabase } from './supabase';

interface ErrorContext {
  userId?: string;
  userEmail?: string;
  screen?: string;
  action?: string;
  metadata?: Record<string, any>;
}

interface Breadcrumb {
  timestamp: Date;
  category: string;
  message: string;
  data?: Record<string, any>;
}

class ErrorTracker {
  private breadcrumbs: Breadcrumb[] = [];
  private maxBreadcrumbs = 50;
  private userContext: ErrorContext = {};

  setUserContext(context: ErrorContext) {
    this.userContext = { ...this.userContext, ...context };
  }

  addBreadcrumb(category: string, message: string, data?: Record<string, any>) {
    this.breadcrumbs.push({
      timestamp: new Date(),
      category,
      message,
      data
    });
    
    if (this.breadcrumbs.length > this.maxBreadcrumbs) {
      this.breadcrumbs.shift();
    }
  }

  async captureError(error: Error, context?: ErrorContext, severity: 'error' | 'warning' | 'critical' = 'error') {
    const errorData = {
      message: error.message,
      stack: error.stack,
      user_context: { ...this.userContext, ...context },
      breadcrumbs: this.breadcrumbs.slice(-20),
      timestamp: new Date().toISOString(),
      platform: 'react-native',
      severity
    };

    const { data, error: insertError } = await supabase
      .from('error_logs')
      .insert(errorData)
      .select()
      .single();
    
    // Trigger immediate alert for critical errors
    if (!insertError && data && severity === 'critical') {
      try {
        await supabase.functions.invoke('send-error-alerts', {
          body: { errorId: data.id }
        });
      } catch (alertError) {
        console.error('Failed to send alert:', alertError);
      }
    }
    
    if (__DEV__) {
      console.error('Error tracked:', errorData);
    }
  }


  clearBreadcrumbs() {
    this.breadcrumbs = [];
  }
}

export const errorTracker = new ErrorTracker();
