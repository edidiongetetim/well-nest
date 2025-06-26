
import { useState } from "react";
import { WelcomeScreen } from "@/components/onboarding/WelcomeScreen";
import { JourneyStageSelection } from "@/components/onboarding/JourneyStageSelection";
import { PregnancyDetails } from "@/components/onboarding/PregnancyDetails";
import { SupportPreferences } from "@/components/onboarding/SupportPreferences";
import { MiniCheckIn } from "@/components/onboarding/MiniCheckIn";
import { MeetNestie } from "@/components/onboarding/MeetNestie";
import { OnboardingComplete } from "@/components/onboarding/OnboardingComplete";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export interface OnboardingData {
  journeyStage: string;
  pregnancyWeek?: number;
  supportPreferences: {
    healthReminders: boolean;
    emotionalSupport: boolean;
    nestieNotes: boolean;
    appointmentReminders: boolean;
  };
  hasCompletedCheckIn: boolean;
}

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    journeyStage: "",
    supportPreferences: {
      healthReminders: false,
      emotionalSupport: false,
      nestieNotes: false,
      appointmentReminders: false,
    },
    hasCompletedCheckIn: false,
  });

  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const updateOnboardingData = (data: Partial<OnboardingData>) => {
    setOnboardingData(prev => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const skipToEnd = () => {
    setCurrentStep(6);
  };

  const completeOnboarding = async () => {
    if (!user) return;

    try {
      // Save onboarding data to user profile
      const { error } = await supabase
        .from('profiles')
        .update({
          app_preferences: {
            ...onboardingData,
            onboardingCompleted: true,
            completedAt: new Date().toISOString(),
          }
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Welcome to WellNest!",
        description: "Your profile has been set up successfully.",
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast({
        title: "Setup Complete",
        description: "Welcome to WellNest! You can always update your preferences later.",
      });
      navigate('/dashboard');
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <WelcomeScreen onNext={nextStep} />;
      case 1:
        return (
          <JourneyStageSelection
            onNext={nextStep}
            onSelect={(stage) => updateOnboardingData({ journeyStage: stage })}
            selectedStage={onboardingData.journeyStage}
          />
        );
      case 2:
        return onboardingData.journeyStage === "Pregnant" ? (
          <PregnancyDetails
            onNext={nextStep}
            onSelect={(week) => updateOnboardingData({ pregnancyWeek: week })}
            selectedWeek={onboardingData.pregnancyWeek}
          />
        ) : null;
      case 3:
        return (
          <SupportPreferences
            onNext={nextStep}
            preferences={onboardingData.supportPreferences}
            onUpdate={(prefs) => updateOnboardingData({ supportPreferences: prefs })}
          />
        );
      case 4:
        return (
          <MiniCheckIn
            onNext={nextStep}
            onSkip={skipToEnd}
            onComplete={(completed) => updateOnboardingData({ hasCompletedCheckIn: completed })}
          />
        );
      case 5:
        return <MeetNestie onNext={nextStep} />;
      case 6:
        return <OnboardingComplete onComplete={completeOnboarding} />;
      default:
        return <WelcomeScreen onNext={nextStep} />;
    }
  };

  // Skip pregnancy details if not pregnant
  if (currentStep === 2 && onboardingData.journeyStage !== "Pregnant") {
    setCurrentStep(3);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8">
        {renderStep()}
      </div>
    </div>
  );
};

export default Onboarding;
