
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function BabyMilestoneCard() {
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

  const onboardingData = profile?.app_preferences;
  const journeyStage = onboardingData?.journeyStage;
  
  // Handle pregnancy scenario
  if (journeyStage === "Pregnant") {
    const getBabySizeInfo = (week: number) => {
      const sizeData = {
        16: { name: "Apple", emoji: "🍏", size: "4.6 inches" },
        17: { name: "Avocado", emoji: "🥑", size: "5.1 inches" },
        18: { name: "Bell Pepper", emoji: "🫑", size: "5.6 inches" },
        19: { name: "Mango", emoji: "🥭", size: "6.0 inches" },
        20: { name: "Banana", emoji: "🍌", size: "6.5 inches" },
      };
      return sizeData[week as keyof typeof sizeData] || sizeData[16];
    };

    const currentWeek = onboardingData?.pregnancyWeek || 16;
    const sizeInfo = getBabySizeInfo(currentWeek);

    return (
      <Card className="bg-gradient-to-br from-lavender-50 to-cream-50 rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <h3 className="font-poppins font-semibold text-lg text-gray-800 mb-2">
              Your baby is the size of: {sizeInfo.name} {sizeInfo.emoji}
            </h3>
            <p className="font-poppins text-sm text-gray-600">
              Week {currentWeek} • {sizeInfo.size}
            </p>
          </div>
          
          <div className="relative mx-auto w-48 h-48 bg-gradient-to-br from-purple-100 to-lavender-100 rounded-full shadow-lg mb-4 overflow-hidden">
            <div className="absolute inset-0 rounded-full shadow-inner bg-gradient-to-br from-white/20 to-transparent"></div>
            
            <img 
              src="/lovable-uploads/97cc6b09-0747-494b-adc9-e3aa1ae40cd8.png" 
              alt="Baby in womb illustration" 
              className="w-full h-full object-cover object-center rounded-full"
            />
            
            <div className="absolute inset-4 rounded-full bg-gradient-to-br from-white/10 to-purple-100/20 blur-sm pointer-events-none"></div>
          </div>
          
          <div className="text-center">
            <p className="font-poppins text-gray-600 text-sm">
              {currentWeek} weeks, 2 days · {40 - currentWeek} weeks to go
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Handle postpartum scenario
  if (journeyStage === "Postpartum" && onboardingData?.babyBirthDate) {
    const calculateBabyAge = (birthDateStr: string) => {
      const birth = new Date(birthDateStr);
      const now = new Date();
      const diffTime = now.getTime() - birth.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays < 7) {
        return `${diffDays} day${diffDays !== 1 ? 's' : ''}`;
      } else if (diffDays < 30) {
        const weeks = Math.floor(diffDays / 7);
        return `${weeks} week${weeks !== 1 ? 's' : ''}`;
      } else {
        const months = Math.floor(diffDays / 30);
        return `${months} month${months !== 1 ? 's' : ''}`;
      }
    };

    const babyAge = calculateBabyAge(onboardingData.babyBirthDate);
    const babyWeight = onboardingData.babyWeight;

    return (
      <Card className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl shadow-lg border border-gray-100 overflow-hidden">
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

  // Default pregnancy card if no specific data
  return (
    <Card className="bg-gradient-to-br from-lavender-50 to-cream-50 rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <h3 className="font-poppins font-semibold text-lg text-gray-800 mb-2">
            Your baby is the size of: Apple 🍏
          </h3>
          <p className="font-poppins text-sm text-gray-600">
            Week 16 • 4.6 inches
          </p>
        </div>
        
        <div className="relative mx-auto w-48 h-48 bg-gradient-to-br from-purple-100 to-lavender-100 rounded-full shadow-lg mb-4 overflow-hidden">
          <div className="absolute inset-0 rounded-full shadow-inner bg-gradient-to-br from-white/20 to-transparent"></div>
          
          <img 
            src="/lovable-uploads/97cc6b09-0747-494b-adc9-e3aa1ae40cd8.png" 
            alt="Baby in womb illustration" 
            className="w-full h-full object-cover object-center rounded-full"
          />
          
          <div className="absolute inset-4 rounded-full bg-gradient-to-br from-white/10 to-purple-100/20 blur-sm pointer-events-none"></div>
        </div>
        
        <div className="text-center">
          <p className="font-poppins text-gray-600 text-sm">
            16 weeks, 2 days · 176 days to childbirth
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
