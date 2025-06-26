
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { logHealthDataAccess } from "@/utils/securityLogger";

export const useSecureHealthData = () => {
  const { user } = useAuth();

  const fetchPhysicalCheckIns = useQuery({
    queryKey: ['physical-checkins', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      await logHealthDataAccess('physical_health_checkins', 'SELECT');
      
      const { data, error } = await supabase
        .from('physical_health_checkins')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching physical check-ins:', error);
        throw error;
      }

      return data;
    },
    enabled: !!user,
  });

  const fetchMentalCheckIns = useQuery({
    queryKey: ['mental-checkins', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      await logHealthDataAccess('mental_health_checkins', 'SELECT');
      
      const { data, error } = await supabase
        .from('mental_health_checkins')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching mental check-ins:', error);
        throw error;
      }

      return data;
    },
    enabled: !!user,
  });

  const createPhysicalCheckIn = useMutation({
    mutationFn: async (checkInData: any) => {
      if (!user) throw new Error('User not authenticated');
      
      await logHealthDataAccess('physical_health_checkins', 'INSERT');
      
      const { data, error } = await supabase
        .from('physical_health_checkins')
        .insert({
          ...checkInData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating physical check-in:', error);
        throw error;
      }

      return data;
    },
  });

  const createMentalCheckIn = useMutation({
    mutationFn: async (checkInData: any) => {
      if (!user) throw new Error('User not authenticated');
      
      await logHealthDataAccess('mental_health_checkins', 'INSERT');
      
      const { data, error } = await supabase
        .from('mental_health_checkins')
        .insert({
          ...checkInData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating mental check-in:', error);
        throw error;
      }

      return data;
    },
  });

  return {
    physicalCheckIns: fetchPhysicalCheckIns.data,
    mentalCheckIns: fetchMentalCheckIns.data,
    isLoading: fetchPhysicalCheckIns.isLoading || fetchMentalCheckIns.isLoading,
    createPhysicalCheckIn,
    createMentalCheckIn,
  };
};
