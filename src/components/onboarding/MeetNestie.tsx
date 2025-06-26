
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle } from "lucide-react";

interface MeetNestieProps {
  onNext: () => void;
}

export const MeetNestie = ({ onNext }: MeetNestieProps) => {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h2 className="font-poppins text-3xl font-bold text-primary">
          Meet Nestie, Your AI Companion
        </h2>
        <p className="font-poppins text-gray-600">
          Your friendly support companion here to guide you
        </p>
      </div>

      <Card className="bg-gradient-to-br from-purple-100 to-pink-100 border-none shadow-lg">
        <CardContent className="p-8 text-center space-y-6">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
            <MessageCircle className="w-12 h-12 text-white" />
          </div>
          
          <div className="space-y-4">
            <h3 className="font-poppins text-2xl font-semibold text-primary">
              Hi there! I'm Nestie 💜
            </h3>
            <div className="bg-white/60 p-4 rounded-xl">
              <p className="font-poppins text-gray-700 leading-relaxed">
                "I'm here to support you every step of the way! Whether you need someone to talk to, 
                want to check in on your wellness, or just need a friendly reminder, I've got you covered. 
                Think of me as your personal wellness companion who's always here to listen and help."
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
            <span className="font-poppins">Available 24/7 for support</span>
          </div>
        </CardContent>
      </Card>

      <div className="text-center pt-4">
        <Button
          onClick={onNext}
          className="bg-[#6A1B9A] hover:bg-[#5A137A] text-white font-semibold text-lg px-10 py-3 rounded-full"
        >
          Nice to meet you, Nestie!
        </Button>
      </div>
    </div>
  );
};
