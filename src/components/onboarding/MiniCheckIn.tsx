
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Activity, Brain } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface MiniCheckInProps {
  onNext: () => void;
  onSkip: () => void;
  onComplete: (completed: boolean) => void;
}

export const MiniCheckIn = ({ onNext, onSkip, onComplete }: MiniCheckInProps) => {
  const navigate = useNavigate();

  const handleCheckIn = (type: string) => {
    onComplete(true);
    if (type === 'physical') {
      navigate('/health-check-in');
    } else {
      navigate('/mental-check-in');
    }
  };

  const handleSkip = () => {
    onComplete(false);
    onSkip();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h2 className="font-poppins text-3xl font-bold text-primary">
          Would you like to start with a quick check-in?
        </h2>
        <p className="font-poppins text-gray-600">
          Get personalized insights about your wellness right away
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card
          className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
          onClick={() => handleCheckIn('physical')}
        >
          <CardContent className="p-6 bg-gradient-to-br from-green-100 to-green-50 text-center space-y-4">
            <Activity className="w-12 h-12 mx-auto text-green-600" />
            <div>
              <h3 className="font-poppins font-semibold text-lg text-primary">
                Physical Health Check-in
              </h3>
              <p className="font-poppins text-gray-600 text-sm">
                Quick assessment of your physical wellness
              </p>
            </div>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
          onClick={() => handleCheckIn('mental')}
        >
          <CardContent className="p-6 bg-gradient-to-br from-purple-100 to-purple-50 text-center space-y-4">
            <Brain className="w-12 h-12 mx-auto text-purple-600" />
            <div>
              <h3 className="font-poppins font-semibold text-lg text-primary">
                Mental Health Check-in
              </h3>
              <p className="font-poppins text-gray-600 text-sm">
                EPDS screening for emotional wellness
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center space-x-4 pt-4">
        <Button
          onClick={handleSkip}
          variant="outline"
          className="text-gray-600 font-semibold px-8 py-3 rounded-full"
        >
          Skip for now
        </Button>
        <Button
          onClick={onNext}
          className="bg-[#6A1B9A] hover:bg-[#5A137A] text-white font-semibold px-8 py-3 rounded-full"
        >
          Continue without check-in
        </Button>
      </div>
    </div>
  );
};
