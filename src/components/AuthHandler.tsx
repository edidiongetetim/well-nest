
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const AuthHandler = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleAuthStateChange = async () => {
      if (!user) return;

      try {
        // Check if user has completed onboarding
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('app_preferences')
          .eq('id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error checking profile:', error);
          // For new users or profile errors, send to onboarding
          navigate('/onboarding');
          return;
        }

        // Check if user has completed onboarding
        const hasCompletedOnboarding = profile?.app_preferences?.onboardingCompleted;

        if (!hasCompletedOnboarding) {
          console.log('User needs onboarding, redirecting...');
          navigate('/onboarding');
        } else {
          console.log('User has completed onboarding, redirecting to dashboard...');
          navigate('/dashboard');
        }

      } catch (error) {
        console.error('Error in auth handler:', error);
        // Default to onboarding on error
        navigate('/onboarding');
      }
    };

    if (user) {
      handleAuthStateChange();
    }
  }, [user, navigate]);

  return null;
};
