
import { Button } from "@/components/ui/button";

interface WelcomeScreenProps {
  onNext: () => void;
}

export const WelcomeScreen = ({ onNext }: WelcomeScreenProps) => {
  return (
    <div className="max-w-2xl mx-auto text-center space-y-8">
      <div className="space-y-4">
        <img 
          src="/lovable-uploads/91d2546c-bdfa-484f-989a-fb228fba05f8.png" 
          alt="WellNest Logo" 
          className="w-32 h-32 mx-auto object-contain"
        />
        <h1 className="font-poppins text-4xl font-bold text-primary">
          Welcome to WellNest
        </h1>
        <p className="font-poppins text-xl text-gray-600 max-w-lg mx-auto">
          Your space for personalized wellness during pregnancy and postpartum
        </p>
      </div>

      <div className="pt-8">
        <Button
          onClick={onNext}
          className="bg-[#6A1B9A] hover:bg-[#5A137A] text-white font-semibold text-lg px-12 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Get Started
        </Button>
      </div>
    </div>
  );
};
