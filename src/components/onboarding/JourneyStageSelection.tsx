
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Baby, Heart, Users, Sparkles } from "lucide-react";

interface JourneyStageSelectionProps {
  onNext: () => void;
  onSelect: (stage: string) => void;
  selectedStage: string;
}

export const JourneyStageSelection = ({ onNext, onSelect, selectedStage }: JourneyStageSelectionProps) => {
  const stages = [
    {
      id: "Pregnant",
      label: "Pregnant",
      description: "Currently expecting",
      icon: Baby,
      color: "from-purple-100 to-purple-50"
    },
    {
      id: "Postpartum",
      label: "Postpartum",
      description: "New parent journey",
      icon: Heart,
      color: "from-pink-100 to-pink-50"
    },
    {
      id: "Trying to Conceive",
      label: "Trying to Conceive",
      description: "Planning for pregnancy",
      icon: Sparkles,
      color: "from-green-100 to-green-50"
    },
    {
      id: "Support Person",
      label: "Support Person",
      description: "Supporting someone else",
      icon: Users,
      color: "from-blue-100 to-blue-50"
    }
  ];

  const handleSelect = (stage: string) => {
    onSelect(stage);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h2 className="font-poppins text-3xl font-bold text-primary">
          Where are you in your journey?
        </h2>
        <p className="font-poppins text-gray-600">
          This helps us personalize your experience
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stages.map((stage) => {
          const IconComponent = stage.icon;
          return (
            <Card
              key={stage.id}
              className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                selectedStage === stage.id 
                  ? 'ring-2 ring-[#6A1B9A] shadow-lg' 
                  : 'hover:scale-105'
              }`}
              onClick={() => handleSelect(stage.id)}
            >
              <CardContent className={`p-6 bg-gradient-to-br ${stage.color} text-center space-y-4`}>
                <IconComponent className="w-12 h-12 mx-auto text-primary" />
                <div>
                  <h3 className="font-poppins font-semibold text-lg text-primary">
                    {stage.label}
                  </h3>
                  <p className="font-poppins text-gray-600 text-sm">
                    {stage.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {selectedStage && (
        <div className="text-center pt-4">
          <Button
            onClick={onNext}
            className="bg-[#6A1B9A] hover:bg-[#5A137A] text-white font-semibold text-lg px-10 py-3 rounded-full"
          >
            Continue
          </Button>
        </div>
      )}
    </div>
  );
};
