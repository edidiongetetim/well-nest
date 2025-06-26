
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Activity, Brain, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface HealthAssessmentsScreenProps {
  onNext: () => void;
  completedAssessments: {
    physical: boolean;
    mental: boolean;
  };
  onAssessmentComplete: (type: 'physical' | 'mental') => void;
}

export const HealthAssessmentsScreen = ({ 
  onNext, 
  completedAssessments, 
  onAssessmentComplete 
}: HealthAssessmentsScreenProps) => {
  const navigate = useNavigate();

  const handleAssessment = (type: 'physical' | 'mental') => {
    if (type === 'physical') {
      navigate('/health-check-in?onboarding=true');
    } else {
      navigate('/mental-check-in?onboarding=true');
    }
  };

  const allCompleted = completedAssessments.physical && completedAssessments.mental;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h2 className="font-poppins text-3xl font-bold text-primary">
          Complete Your Health Assessments
        </h2>
        <p className="font-poppins text-gray-600">
          These quick assessments help us provide personalized insights
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card
          className={`cursor-pointer hover:shadow-lg transition-all duration-300 relative ${
            completedAssessments.physical ? 'ring-2 ring-green-500' : 'hover:scale-105'
          }`}
          onClick={() => !completedAssessments.physical && handleAssessment('physical')}
        >
          <CardContent className="p-6 bg-gradient-to-br from-green-100 to-green-50 text-center space-y-4">
            {completedAssessments.physical && (
              <div className="absolute -top-2 -right-2">
                <div className="bg-green-500 rounded-full p-2">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              </div>
            )}
            <Activity className="w-12 h-12 mx-auto text-green-600" />
            <div>
              <h3 className="font-poppins font-semibold text-lg text-primary">
                Physical Health Check-in
              </h3>
              <p className="font-poppins text-gray-600 text-sm">
                Quick assessment of your physical wellness
              </p>
              {completedAssessments.physical && (
                <p className="font-poppins text-green-600 text-sm font-medium mt-2">
                  ✓ Completed
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer hover:shadow-lg transition-all duration-300 relative ${
            completedAssessments.mental ? 'ring-2 ring-green-500' : 'hover:scale-105'
          }`}
          onClick={() => !completedAssessments.mental && handleAssessment('mental')}
        >
          <CardContent className="p-6 bg-gradient-to-br from-purple-100 to-purple-50 text-center space-y-4">
            {completedAssessments.mental && (
              <div className="absolute -top-2 -right-2">
                <div className="bg-green-500 rounded-full p-2">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              </div>
            )}
            <Brain className="w-12 h-12 mx-auto text-purple-600" />
            <div>
              <h3 className="font-poppins font-semibold text-lg text-primary">
                Mental Health Check-in
              </h3>
              <p className="font-poppins text-gray-600 text-sm">
                EPDS screening for emotional wellness
              </p>
              {completedAssessments.mental && (
                <p className="font-poppins text-green-600 text-sm font-medium mt-2">
                  ✓ Completed
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="text-center pt-4 space-y-4">
        {allCompleted ? (
          <Button
            onClick={onNext}
            className="bg-[#6A1B9A] hover:bg-[#5A137A] text-white font-semibold text-lg px-12 py-3 rounded-full"
          >
            Continue
          </Button>
        ) : (
          <Button
            onClick={onNext}
            variant="outline"
            className="text-gray-600 font-semibold px-8 py-3 rounded-full"
          >
            Skip for now
          </Button>
        )}
      </div>
    </div>
  );
};
