
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Heart, MessageCircle, Calendar, Activity } from "lucide-react";

interface SupportPreferencesProps {
  onNext: () => void;
  preferences: {
    healthReminders: boolean;
    emotionalSupport: boolean;
    nestieNotes: boolean;
    appointmentReminders: boolean;
  };
  onUpdate: (preferences: any) => void;
}

export const SupportPreferences = ({ onNext, preferences, onUpdate }: SupportPreferencesProps) => {
  const handleToggle = (key: string) => {
    onUpdate({
      ...preferences,
      [key]: !preferences[key as keyof typeof preferences]
    });
  };

  const supportOptions = [
    {
      key: "healthReminders",
      label: "Health check-in reminders",
      description: "Regular prompts to track your wellness",
      icon: Activity,
      color: "text-green-600"
    },
    {
      key: "emotionalSupport",
      label: "Emotional support tips",
      description: "Helpful guidance for mental wellness",
      icon: Heart,
      color: "text-pink-600"
    },
    {
      key: "nestieNotes",
      label: "Encouraging notes from Nestie",
      description: "Daily motivation and support messages",
      icon: MessageCircle,
      color: "text-purple-600"
    },
    {
      key: "appointmentReminders",
      label: "Appointment & medication reminders",
      description: "Never miss important healthcare tasks",
      icon: Calendar,
      color: "text-blue-600"
    }
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h2 className="font-poppins text-3xl font-bold text-primary">
          How would you like to receive reminders and support?
        </h2>
        <p className="font-poppins text-gray-600">
          You can always change these preferences later in settings
        </p>
      </div>

      <div className="space-y-4">
        {supportOptions.map((option) => {
          const IconComponent = option.icon;
          return (
            <Card key={option.key} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <IconComponent className={`w-6 h-6 ${option.color}`} />
                    <div>
                      <h3 className="font-poppins font-medium text-lg">
                        {option.label}
                      </h3>
                      <p className="font-poppins text-gray-600 text-sm">
                        {option.description}
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={preferences[option.key as keyof typeof preferences]}
                    onCheckedChange={() => handleToggle(option.key)}
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="text-center pt-4">
        <Button
          onClick={onNext}
          className="bg-[#6A1B9A] hover:bg-[#5A137A] text-white font-semibold text-lg px-10 py-3 rounded-full"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};
