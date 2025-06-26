
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Baby, Heart, Users, Bot, Gear } from "lucide-react";
import { useState } from "react";

interface JourneyStageSelectionProps {
  onNext: () => void;
  onSelect: (stage: string) => void;
  selectedStage: string;
}

export const JourneyStageSelection = ({ onNext, onSelect, selectedStage }: JourneyStageSelectionProps) => {
  const [showComingSoonModal, setShowComingSoonModal] = useState(false);

  const stages = [
    {
      id: "Pregnant",
      label: "Pregnant",
      description: "Currently expecting",
      icon: Baby,
      color: "from-purple-100 to-purple-50",
      available: true
    },
    {
      id: "Postpartum",
      label: "Postpartum",
      description: "New parent journey",
      icon: Heart,
      color: "from-pink-100 to-pink-50",
      available: true
    },
    {
      id: "Support Partner",
      label: "Support Partner",
      description: "Supporting someone else",
      icon: Users,
      color: "from-blue-100 to-blue-50",
      available: false
    },
    {
      id: "Care Provider",
      label: "Care Provider",
      description: "Healthcare professional",
      icon: Bot,
      color: "from-green-100 to-green-50",
      available: false
    },
    {
      id: "Other",
      label: "Other",
      description: "Something else",
      icon: Gear,
      color: "from-gray-100 to-gray-50",
      available: false
    }
  ];

  const handleSelect = (stage: any) => {
    if (!stage.available) {
      setShowComingSoonModal(true);
      return;
    }
    onSelect(stage.id);
  };

  return (
    <>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h2 className="font-poppins text-3xl font-bold text-primary">
            Where are you in your journey?
          </h2>
          <p className="font-poppins text-gray-600">
            This helps us personalize your experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stages.map((stage) => {
            const IconComponent = stage.icon;
            const isSelected = selectedStage === stage.id;
            const isAvailable = stage.available;
            
            return (
              <div key={stage.id} className="relative">
                <Card
                  className={`cursor-pointer transition-all duration-300 ${
                    !isAvailable 
                      ? 'opacity-60 cursor-not-allowed' 
                      : isSelected 
                        ? 'ring-2 ring-[#6A1B9A] shadow-lg' 
                        : 'hover:scale-105 hover:shadow-lg'
                  }`}
                  onClick={() => handleSelect(stage)}
                >
                  <CardContent className={`p-6 bg-gradient-to-br ${stage.color} text-center space-y-4 relative`}>
                    {!isAvailable && (
                      <div className="absolute inset-0 bg-white/40 rounded-lg"></div>
                    )}
                    <IconComponent className={`w-12 h-12 mx-auto ${isAvailable ? 'text-primary' : 'text-gray-400'}`} />
                    <div>
                      <h3 className={`font-poppins font-semibold text-lg ${isAvailable ? 'text-primary' : 'text-gray-500'}`}>
                        {stage.label}
                      </h3>
                      <p className={`font-poppins text-sm ${isAvailable ? 'text-gray-600' : 'text-gray-400'}`}>
                        {stage.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                {!isAvailable && (
                  <Badge 
                    variant="secondary" 
                    className="absolute -top-2 -right-2 bg-orange-100 text-orange-600 border-orange-200 font-poppins text-xs px-2 py-1"
                  >
                    Launching Soon
                  </Badge>
                )}
              </div>
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

      <Dialog open={showComingSoonModal} onOpenChange={setShowComingSoonModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-poppins text-xl text-primary">Coming Soon!</DialogTitle>
            <DialogDescription className="font-poppins text-gray-600">
              This feature is currently under development and will be available soon. 
              We're working hard to bring you the best experience for all user types.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end pt-4">
            <Button 
              onClick={() => setShowComingSoonModal(false)}
              className="bg-[#6A1B9A] hover:bg-[#5A137A] text-white font-poppins"
            >
              Got it
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
