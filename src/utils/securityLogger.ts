
import { supabase } from "@/integrations/supabase/client";

interface SecurityEvent {
  event_type: 'data_access' | 'auth_change' | 'profile_update' | 'health_data_access';
  table_name?: string;
  user_id?: string;
  details?: Record<string, any>;
  timestamp: string;
}

export const logSecurityEvent = async (event: Omit<SecurityEvent, 'timestamp'>) => {
  const securityEvent: SecurityEvent = {
    ...event,
    timestamp: new Date().toISOString(),
  };

  // Log to console for monitoring
  console.log('Security Event:', securityEvent);

  // In a production environment, you might want to send this to a dedicated logging service
  // For now, we'll just log sensitive data access patterns
  if (event.event_type === 'health_data_access' || event.event_type === 'profile_update') {
    console.warn('Sensitive data accessed:', {
      type: event.event_type,
      table: event.table_name,
      user: event.user_id,
      timestamp: securityEvent.timestamp
    });
  }
};

export const logHealthDataAccess = async (tableName: string, operation: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (user) {
    await logSecurityEvent({
      event_type: 'health_data_access',
      table_name: tableName,
      user_id: user.id,
      details: { operation }
    });
  }
};

export const logProfileUpdate = async (changes: Record<string, any>) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (user) {
    await logSecurityEvent({
      event_type: 'profile_update',
      table_name: 'profiles',
      user_id: user.id,
      details: { changed_fields: Object.keys(changes) }
    });
  }
};
