
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, CheckCircle } from "lucide-react";

interface EmailConfirmationProps {
  onNext: () => void;
  email?: string;
}

export const EmailConfirmation = ({ onNext, email }: EmailConfirmationProps) => {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <div className="relative">
            <Mail className="w-24 h-24 text-purple-500" />
            <CheckCircle className="w-8 h-8 text-green-500 absolute -bottom-2 -right-2" />
          </div>
        </div>
        
        <div className="space-y-4">
          <h1 className="font-poppins text-4xl font-bold text-primary">
            Check Your Email
          </h1>
          <p className="font-poppins text-xl text-gray-600 max-w-lg mx-auto leading-relaxed">
            Please confirm your email and sign back in to begin onboarding.
          </p>
          {email && (
            <p className="font-poppins text-sm text-gray-500">
              We sent a confirmation link to <strong>{email}</strong>
            </p>
          )}
        </div>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-none shadow-sm">
          <CardContent className="p-6 space-y-3">
            <h3 className="font-poppins font-semibold text-lg text-primary">
              What's next?
            </h3>
            <ul className="font-poppins text-gray-600 space-y-2 text-left max-w-md mx-auto">
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span>Check your email inbox</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span>Click the confirmation link</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span>Return here to complete setup</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="text-center pt-8">
        <Button
          onClick={onNext}
          className="bg-[#6A1B9A] hover:bg-[#5A137A] text-white font-semibold text-lg px-12 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Got it
        </Button>
      </div>
    </div>
  );
};
