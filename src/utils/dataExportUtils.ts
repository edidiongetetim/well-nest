
import { supabase } from "@/integrations/supabase/client";

export interface UserDataExport {
  profile: any;
  physicalHealthRecords: any[];
  mentalHealthRecords: any[];
  reminders: any[];
  exportTimestamp: string;
}

export const exportAllUserData = async (): Promise<UserDataExport | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Fetch profile data
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    // Fetch physical health records
    const { data: physicalHealthRecords } = await supabase
      .from('physical_health_checkins')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    // Fetch mental health records
    const { data: mentalHealthRecords } = await supabase
      .from('mental_health_checkins')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    // Fetch reminders
    const { data: reminders } = await supabase
      .from('reminders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    return {
      profile: profile || {},
      physicalHealthRecords: physicalHealthRecords || [],
      mentalHealthRecords: mentalHealthRecords || [],
      reminders: reminders || [],
      exportTimestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error exporting user data:', error);
    return null;
  }
};

export const downloadUserDataAsJSON = (userData: UserDataExport) => {
  const dataStr = JSON.stringify(userData, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  
  const link = document.createElement('a');
  link.href = URL.createObjectURL(dataBlob);
  link.download = `wellnest-data-export-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
};

export const downloadUserDataAsZip = async (userData: UserDataExport) => {
  // For ZIP functionality, we'll use a simple approach with multiple JSON files
  // In a production app, you might want to use a library like JSZip
  
  // For now, we'll download as a comprehensive JSON file
  // This can be extended to create actual ZIP files if needed
  downloadUserDataAsJSON(userData);
};
