
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { calculatePregnancyWeek, calculatePregnancyFromWeek, calculateBabyAge } from "@/utils/pregnancyCalculations";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { format } from "date-fns";

interface OnboardingData {
  journeyStage?: string;
  pregnancyWeek?: number;
  dueDate?: string;
  babyBirthDate?: string;
  babyWeight?: number;
  onboardingCompleted?: boolean;
  completedAt?: string;
}

export function BabyProgressCard() {
  const { user } = useAuth();

  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('app_preferences')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Safely cast and validate the onboarding data
  const onboardingData: OnboardingData | null = (() => {
    if (!profile?.app_preferences) return null;
    
    try {
      // Handle both object and string cases
      if (typeof profile.app_preferences === 'string') {
        return JSON.parse(profile.app_preferences) as OnboardingData;
      } else if (typeof profile.app_preferences === 'object' && profile.app_preferences !== null) {
        return profile.app_preferences as OnboardingData;
      }
    } catch (error) {
      console.error('Error parsing app_preferences:', error);
    }
    
    return null;
  })();

  const journeyStage = onboardingData?.journeyStage;
  
  // If onboarding not completed, show prompt
  if (!onboardingData?.onboardingCompleted) {
    return (
      <Card className="bg-gradient-to-br from-purple-50 to-lavender-50 rounded-xl shadow-lg border border-gray-100">
        <CardContent className="p-6 text-center">
          <div className="mb-4">
            <span className="text-4xl mb-4 block">📋</span>
            <h3 className="font-poppins font-semibold text-lg text-gray-800 mb-2">
              Complete Your Profile
            </h3>
            <p className="font-poppins text-gray-600 text-sm mb-4">
              Tell us about your pregnancy journey to get personalized tracking and insights.
            </p>
          </div>
          <Link to="/onboarding">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white font-poppins">
              Complete Setup
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  // Handle postpartum scenario
  if (journeyStage === "Postpartum" && onboardingData?.babyBirthDate) {
    const babyAge = calculateBabyAge(onboardingData.babyBirthDate);
    const babyWeight = onboardingData.babyWeight;

    return (
      <Card className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl shadow-lg border border-gray-100">
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <h3 className="font-poppins font-semibold text-lg text-gray-800 mb-2">
              Your Baby 👶
            </h3>
            <p className="font-poppins text-gray-600">
              Your baby is now {babyAge} old
              {babyWeight && ` and weighs ${babyWeight} kg`}
            </p>
          </div>
          
          <div className="relative mx-auto w-32 h-32 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full shadow-lg mb-4 flex items-center justify-center">
            <span className="text-6xl">👶</span>
          </div>
          
          <div className="text-center">
            <p className="font-poppins text-gray-600 text-sm">
              Growing stronger every day
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Handle pregnancy scenario with two-card layout
  if (journeyStage === "Pregnant") {
    const today = new Date();
    let pregnancyInfo;

    // Calculate pregnancy info based on available data
    if (onboardingData?.dueDate) {
      pregnancyInfo = calculatePregnancyWeek(today, new Date(onboardingData.dueDate));
    } else if (onboardingData?.pregnancyWeek) {
      pregnancyInfo = calculatePregnancyFromWeek(onboardingData.pregnancyWeek);
    } else {
      // Default fallback
      pregnancyInfo = calculatePregnancyFromWeek(16);
    }

    return (
      <div className="space-y-4">
        {/* Two-card layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left card - Date and pregnancy info */}
          <Card className="bg-gradient-to-br from-lavender-50 to-cream-50 rounded-xl shadow-lg border border-gray-100">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <h2 className="font-poppins font-bold text-2xl text-primary mb-2">
                    {format(new Date(), 'd MMMM')}
                  </h2>
                  <p className="font-poppins text-lg text-gray-700 mb-2">
                    {pregnancyInfo.currentWeek} weeks, {pregnancyInfo.currentDay} days
                  </p>
                  <p className="font-poppins text-sm text-gray-600">
                    {pregnancyInfo.daysRemaining} days left to childbirth
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right card - Baby size and visual */}
          <Card className="bg-gradient-to-br from-purple-50 to-lavender-50 rounded-xl shadow-lg border border-gray-100">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <h3 className="font-poppins font-semibold text-lg text-gray-800">
                  Your baby is the size of: {pregnancyInfo.babySize.name} {pregnancyInfo.babySize.emoji}
                </h3>
                
                <div className="relative mx-auto w-24 h-24 bg-gradient-to-br from-purple-100 to-lavender-100 rounded-full shadow-lg flex items-center justify-center">
                  <span className="text-5xl">{pregnancyInfo.babySize.emoji}</span>
                </div>
                
                <p className="font-poppins text-sm text-gray-600">
                  Week {pregnancyInfo.currentWeek} • {pregnancyInfo.babySize.size}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress tracker below both cards */}
        <Card className="bg-white rounded-xl shadow-sm border border-gray-100">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-poppins text-sm text-gray-600">{pregnancyInfo.trimesterName} trimester</span>
                <span className="font-poppins text-sm font-medium text-primary">{pregnancyInfo.currentWeek} weeks</span>
              </div>
              
              <Progress value={pregnancyInfo.progressPercentage} className="h-3 bg-gray-100">
                <div 
                  className="h-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-full transition-all duration-300" 
                  style={{width: `${pregnancyInfo.progressPercentage}%`}} 
                />
              </Progress>
              
              <div className="flex justify-between items-center">
                <span className="font-poppins text-xs text-gray-500">{pregnancyInfo.daysRemaining} days to childbirth</span>
                <span className="font-poppins text-xs text-gray-500">{Math.round(pregnancyInfo.progressPercentage)}% complete</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Default fallback for other journey stages
  return (
    <Card className="bg-gradient-to-br from-lavender-50 to-cream-50 rounded-xl shadow-lg border border-gray-100">
      <CardContent className="p-6 text-center">
        <div className="mb-4">
          <span className="text-4xl mb-4 block">🌸</span>
          <h3 className="font-poppins font-semibold text-lg text-gray-800 mb-2">
            Welcome to WellNest
          </h3>
          <p className="font-poppins text-gray-600 text-sm">
            Your wellness journey starts here
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
