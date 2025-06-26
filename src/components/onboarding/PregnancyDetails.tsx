
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PregnancyDetailsProps {
  onNext: () => void;
  onSelect: (week: number) => void;
  selectedWeek?: number;
}

export const PregnancyDetails = ({ onNext, onSelect, selectedWeek }: PregnancyDetailsProps) => {
  const [week, setWeek] = useState<number | undefined>(selectedWeek);

  const handleWeekSelect = (value: string) => {
    const weekNum = parseInt(value);
    setWeek(weekNum);
    onSelect(weekNum);
  };

  const getTrimester = (week: number) => {
    if (week <= 12) return "First Trimester";
    if (week <= 28) return "Second Trimester";
    return "Third Trimester";
  };

  const getEDD = (week: number) => {
    const today = new Date();
    const weeksRemaining = 40 - week;
    const edd = new Date(today.getTime() + (weeksRemaining * 7 * 24 * 60 * 60 * 1000));
    return edd.toLocaleDateString();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h2 className="font-poppins text-3xl font-bold text-primary">
          What week of pregnancy are you in?
        </h2>
        <p className="font-poppins text-gray-600">
          This helps us provide the most relevant information for your stage
        </p>
      </div>

      <div className="space-y-6">
        <div className="max-w-md mx-auto">
          <Select onValueChange={handleWeekSelect} value={week?.toString()}>
            <SelectTrigger className="w-full h-14 text-lg">
              <SelectValue placeholder="Select your pregnancy week" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 42 }, (_, i) => i + 1).map((weekNum) => (
                <SelectItem key={weekNum} value={weekNum.toString()}>
                  Week {weekNum}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {week && (
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl text-center space-y-2">
            <h3 className="font-poppins font-semibold text-lg text-primary">
              {getTrimester(week)}
            </h3>
            <p className="font-poppins text-gray-600">
              Expected Due Date: {getEDD(week)}
            </p>
            <p className="font-poppins text-sm text-gray-500">
              Week {week} of 40
            </p>
          </div>
        )}
      </div>

      {week && (
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
