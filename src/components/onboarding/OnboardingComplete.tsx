
import { Button } from "@/components/ui/button";
import { CheckCircle, Sparkles } from "lucide-react";

interface OnboardingCompleteProps {
  onComplete: () => void;
}

export const OnboardingComplete = ({ onComplete }: OnboardingCompleteProps) => {
  return (
    <div className="max-w-2xl mx-auto text-center space-y-8">
      <div className="space-y-6">
        <div className="flex justify-center">
          <div className="relative">
            <CheckCircle className="w-24 h-24 text-green-500" />
            <Sparkles className="w-8 h-8 text-yellow-400 absolute -top-2 -right-2 animate-pulse" />
          </div>
        </div>
        
        <div className="space-y-4">
          <h1 className="font-poppins text-4xl font-bold text-primary">
            You're All Set! 🎉
          </h1>
          <p className="font-poppins text-xl text-gray-600 max-w-lg mx-auto leading-relaxed">
            Your dashboard is now personalized just for you. 
            Let's take it one day at a time, together.
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl space-y-3">
          <h3 className="font-poppins font-semibold text-lg text-primary">
            What's next?
          </h3>
          <ul className="font-poppins text-gray-600 space-y-2 text-left max-w-md mx-auto">
            <li className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span>Explore your personalized dashboard</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span>Chat with Nestie anytime you need support</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span>Track your wellness journey at your own pace</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="pt-8">
        <Button
          onClick={onComplete}
          className="bg-[#6A1B9A] hover:bg-[#5A137A] text-white font-semibold text-lg px-12 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
};
