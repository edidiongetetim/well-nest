
import { useState } from "react";
import { WelcomeScreen } from "@/components/onboarding/WelcomeScreen";
import { JourneyStageSelection } from "@/components/onboarding/JourneyStageSelection";
import { PregnancyDetails } from "@/components/onboarding/PregnancyDetails";
import { PostpartumDetails } from "@/components/onboarding/PostpartumDetails";
import { SupportPreferences } from "@/components/onboarding/SupportPreferences";
import { HealthAssessmentsScreen } from "@/components/onboarding/HealthAssessmentsScreen";
import { OnboardingComplete } from "@/components/onboarding/OnboardingComplete";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export interface OnboardingData {
  journeyStage: string;
  pregnancyWeek?: number;
  babyBirthDate?: string;
  babyWeight?: number;
  supportPreferences: {
    healthReminders: boolean;
    emotionalSupport: boolean;
    nestieNotes: boolean;
    appointmentReminders: boolean;
  };
  completedAssessments: {
    physical: boolean;
    mental: boolean;
  };
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
    completedAssessments: {
      physical: false,
      mental: false,
    },
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

  const completeOnboarding = async () => {
    console.log('Starting onboarding completion...');
    console.log('Current user:', user?.id);
    console.log('Onboarding data:', onboardingData);

    if (!user) {
      console.error('No user found during onboarding completion');
      toast({
        title: "Authentication Error",
        description: "Please sign in again to complete setup.",
      });
      navigate('/login');
      return;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          app_preferences: {
            ...onboardingData,
            onboardingCompleted: true,
            completedAt: new Date().toISOString(),
          }
        }, {
          onConflict: 'id'
        });

      if (error) {
        console.error('Database error during onboarding:', error);
        throw error;
      }

      console.log('Onboarding data saved successfully');
      
      toast({
        title: "Welcome to WellNest!",
        description: "Your profile has been set up successfully.",
      });

    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast({
        title: "Setup Complete",
        description: "Welcome to WellNest! You can always update your preferences later.",
      });
    }

    console.log('Navigating to dashboard...');
    navigate('/dashboard');
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
        ) : onboardingData.journeyStage === "Postpartum" ? (
          <PostpartumDetails
            onNext={nextStep}
            onSelect={(birthDate, weight) => updateOnboardingData({ 
              babyBirthDate: birthDate, 
              babyWeight: weight 
            })}
            selectedBirthDate={onboardingData.babyBirthDate}
            selectedWeight={onboardingData.babyWeight}
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
          <HealthAssessmentsScreen
            onNext={nextStep}
            completedAssessments={onboardingData.completedAssessments}
            onAssessmentComplete={(type) => 
              updateOnboardingData({ 
                completedAssessments: { 
                  ...onboardingData.completedAssessments, 
                  [type]: true 
                } 
              })
            }
          />
        );
      case 5:
        return <OnboardingComplete onComplete={completeOnboarding} />;
      default:
        return <WelcomeScreen onNext={nextStep} />;
    }
  };

  // Skip pregnancy/postpartum details if not relevant
  if (currentStep === 2 && !["Pregnant", "Postpartum"].includes(onboardingData.journeyStage)) {
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
