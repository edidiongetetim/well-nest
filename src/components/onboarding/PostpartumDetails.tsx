
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

interface PostpartumDetailsProps {
  onNext: () => void;
  onSelect: (birthDate?: string, weight?: number) => void;
  selectedBirthDate?: string;
  selectedWeight?: number;
}

export const PostpartumDetails = ({ 
  onNext, 
  onSelect, 
  selectedBirthDate, 
  selectedWeight 
}: PostpartumDetailsProps) => {
  const [birthDate, setBirthDate] = useState<string>(selectedBirthDate || "");
  const [weight, setWeight] = useState<string>(selectedWeight?.toString() || "");

  const handleNext = () => {
    onSelect(birthDate || undefined, weight ? parseFloat(weight) : undefined);
    onNext();
  };

  const calculateBabyAge = (birthDateStr: string) => {
    if (!birthDateStr) return "";
    
    const birth = new Date(birthDateStr);
    const now = new Date();
    const diffTime = now.getTime() - birth.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} old`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} week${weeks !== 1 ? 's' : ''} old`;
    } else {
      const months = Math.floor(diffDays / 30);
      return `${months} month${months !== 1 ? 's' : ''} old`;
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h2 className="font-poppins text-3xl font-bold text-primary">
          Tell us about your baby
        </h2>
        <p className="font-poppins text-gray-600">
          This information helps us provide personalized insights (optional)
        </p>
      </div>

      <Card className="bg-white shadow-sm border border-gray-100">
        <CardContent className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="birthDate" className="font-poppins font-medium text-gray-700">
                Baby's Birth Date
              </Label>
              <Input
                id="birthDate"
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="font-poppins h-12"
                max={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight" className="font-poppins font-medium text-gray-700">
                Current Weight (kg)
              </Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                min="0"
                max="20"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="e.g., 4.5"
                className="font-poppins h-12"
              />
            </div>
          </div>

          {birthDate && (
            <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-6 rounded-xl text-center space-y-2">
              <h3 className="font-poppins font-semibold text-lg text-primary">
                Your baby is {calculateBabyAge(birthDate)}
              </h3>
              {weight && (
                <p className="font-poppins text-gray-600">
                  Current weight: {weight} kg
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-center space-x-4 pt-4">
        <Button
          onClick={handleNext}
          className="bg-[#6A1B9A] hover:bg-[#5A137A] text-white font-semibold text-lg px-10 py-3 rounded-full"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};
